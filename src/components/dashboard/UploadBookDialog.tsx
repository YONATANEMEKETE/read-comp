'use client';
import { createBookAction } from '@/actions/books';

import * as React from 'react';
import {
  Upload,
  X,
  ArrowRight,
  Check,
  AlertCircle,
  FileText,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { extractFirstPageAsImage } from '@/lib/pdf-utils';
import { useQueryClient } from '@tanstack/react-query';

interface UploadBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function UploadBookDialog({
  open,
  onOpenChange,
}: UploadBookDialogProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');

  // Upload State
  const [uploadProgress, setUploadProgress] = React.useState(0);
  // Thumbnail State
  const [thumbnailProgress, setThumbnailProgress] = React.useState(0);
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);

  const [status, setStatus] = React.useState<UploadStatus>('idle');
  const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null);

  // Saving State (Server Action)
  const [isSaving, setIsSaving] = React.useState(false);

  const queryClient = useQueryClient();

  const { startUpload: startPdfUpload, isUploading: isPdfUploading } =
    useUploadThing('pdfUploader', {
      onUploadProgress: (p) => {
        setUploadProgress(p);
      },
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          setUploadedUrl(res[0].url);
        }
      },
      onUploadError: (error: Error) => {
        handleUploadError(error);
      },
    });

  const { startUpload: startImageUpload, isUploading: isImageUploading } =
    useUploadThing('imageUploader', {
      onUploadProgress: (p) => {
        setThumbnailProgress(p);
      },
      onClientUploadComplete: (res) => {
        if (res && res[0]) {
          setThumbnailUrl(res[0].url);
        }
      },
      onUploadError: (error: Error) => {
        console.error('Thumbnail upload failed:', error);
        // We don't fail the whole process if thumbnail fails, just log it
        // Or strictly fail? Let's strictly fail for consistency
        handleUploadError(error);
      },
    });

  React.useEffect(() => {
    // Only wait for PDF upload to show success in the main dropzone
    if (uploadedUrl) {
      setStatus('success');
      toast.success('PDF uploaded successfully!');
    }
  }, [uploadedUrl]);

  const handleUploadError = (error: Error) => {
    setStatus('error');
    toast.error(`Upload failed: ${error.message}`);
    // Revert to idle after 3 seconds
    setTimeout(() => {
      setStatus('idle');
      setUploadProgress(0);
      setThumbnailProgress(0);
      setSelectedFile(null);
      setTitle('');
      setAuthor('');
      setUploadedUrl(null);
      setThumbnailUrl(null);
    }, 3000);
  };

  const processFile = async (file: File) => {
    try {
      // Auto-start upload
      setStatus('uploading');
      setUploadProgress(0);
      setThumbnailProgress(0);
      setUploadedUrl(null);
      setThumbnailUrl(null);

      // 1. Start PDF Upload (The specific "public" part the user sees)
      const pdfUploadPromise = startPdfUpload([file]);

      // 2. Extract and Upload Thumbnail (Background process)
      extractFirstPageAsImage(file)
        .then(async (thumbnailFile) => {
          if (thumbnailFile) {
            await startImageUpload([thumbnailFile]);
          } else {
            console.warn('Could not extract thumbnail');
            toast.error('Failed to generate cover image');
            // We don't set thumbnailUrl, so the button stays disabled
            // limiting the user from adding incomplete data
          }
        })
        .catch((err) => {
          console.error('Thumbnail generation error:', err);
          toast.error('Error generating cover image');
        });

      await pdfUploadPromise;
    } catch (e) {
      console.error(e);
    }
  };

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Invalid file type. Please upload a PDF.');
      return false;
    }
    // 32MB limit matching core.ts
    if (file.size > 32 * 1024 * 1024) {
      toast.error('File is too large. Max size is 32MB.', {
        position: 'bottom-right',
      });
      return false;
    }
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (status === 'uploading' || status === 'success') return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (status === 'uploading' || status === 'success') return;

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Auto-populate title from filename if empty
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }

      // Process both uploads
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace('.pdf', ''));
      }

      // Process both uploads
      processFile(file);
    }
    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!uploadedUrl || !thumbnailUrl) return;

    // Capture values before closing/resetting
    const bookData = {
      title,
      author,
      pdfUrl: uploadedUrl,
      thumbnailUrl: thumbnailUrl,
    };

    // Close dialog immediately
    handleClose(true); // invalidating the check for isSaving inside handleClose for this specific call

    // Show promise toast
    toast.promise(
      createBookAction(bookData).then(async (result) => {
        if (!result.success) {
          throw new Error(result.message);
        }

        // Invalidate the user-books query to refresh the list
        await queryClient.invalidateQueries({ queryKey: ['user-books'] });

        return result;
      }),
      {
        loading: 'Adding your book... a moment.',
        success: 'Book added successfully!',
        error: (err) => `Failed to add book: ${err.message}`,
        position: 'top-right',
      },
    );
  };

  const handleClose = (force = false) => {
    // Prevent closing while uploading or saving (unless forced)
    if (!force && (status === 'uploading' || isSaving)) return;

    setSelectedFile(null);
    setTitle('');
    setAuthor('');
    setStatus('idle');
    setUploadProgress(0);
    setThumbnailProgress(0);
    setUploadedUrl(null);
    setThumbnailUrl(null);
    onOpenChange(false);
  };

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      // Small delay to clear state after animation
      const timer = setTimeout(() => {
        if (status !== 'uploading' && !isSaving) {
          setSelectedFile(null);
          setTitle('');
          setAuthor('');
          setStatus('idle');
          setUploadProgress(0);
          setThumbnailProgress(0);
          setUploadedUrl(null);
          setThumbnailUrl(null);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, status, isSaving]);

  // Derived state for the button
  const isCoverGenerating = uploadedUrl && !thumbnailUrl;
  const isReadyToAdd =
    !!selectedFile &&
    !!title &&
    !!author &&
    !!uploadedUrl &&
    !!thumbnailUrl &&
    !isSaving;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[480px] bg-background border-border rounded-3xl p-8"
        onInteractOutside={(e) => {
          if (status === 'uploading' || isSaving) {
            e.preventDefault();
          }
        }}
      >
        {!status || (status !== 'uploading' && !isSaving) ? (
          <button
            onClick={() => handleClose()}
            className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        ) : null}

        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold text-foreground font-sans">
            Upload a Book
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Add a new PDF to your personal library.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative w-full aspect-[2/1] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300',
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.02]'
                : 'border-border bg-card/40',
              !isDragging &&
                status === 'idle' &&
                'hover:border-primary/50 hover:bg-primary/5 cursor-pointer',
              status === 'error' && 'border-destructive/50 bg-destructive/5',
              status === 'success' && 'border-green-500/50 bg-green-500/5',
            )}
          >
            {status === 'idle' && (
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={status !== 'idle'}
              />
            )}

            {status === 'uploading' ? (
              <div className="w-full max-w-[80%] flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                {/* Circular Progress */}
                <div className="relative size-24 flex items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle
                      className="text-muted/20"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    {/* Progress Circle */}
                    <circle
                      className="text-primary transition-all duration-300 ease-in-out"
                      strokeWidth="8"
                      strokeDasharray={251.2} // 2 * PI * 40
                      strokeDashoffset={251.2 - (uploadProgress / 100) * 251.2}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {Math.round(uploadProgress)}%
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-1 text-center">
                  <p className="text-sm font-medium text-foreground">
                    Uploading PDF...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Please wait while we process your file
                  </p>
                </div>
              </div>
            ) : status === 'success' ? (
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="size-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={28} strokeWidth={3} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">
                    PDF Uploaded!
                  </p>
                  <a
                    href={uploadedUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline mt-1 block"
                  >
                    View File
                  </a>
                </div>
              </div>
            ) : status === 'error' ? (
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="size-14 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                  <AlertCircle size={28} strokeWidth={2} />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold text-foreground">
                    Upload Failed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please try again.
                  </p>
                </div>
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-300">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm ring-4 ring-background">
                  <FileText size={24} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground max-w-[200px] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering file input
                      setSelectedFile(null);
                    }}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 mt-2"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 pointer-events-none border border-muted/50">
                  <Upload size={24} />
                </div>

                <div className="text-center pointer-events-none space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF only (max 32MB)
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Book Details Form */}
          <div className="space-y-5 transition-opacity duration-300">
            <div>
              <Label
                htmlFor="book-title"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1"
              >
                Book Title
              </Label>
              <Input
                id="book-title"
                type="text"
                placeholder="e.g. The Midnight Library"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                className="w-full px-4 py-2.5 bg-card border-border rounded-md text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-inner-soft text-sm"
              />
            </div>

            <div>
              <Label
                htmlFor="book-author"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 ml-1"
              >
                Author
              </Label>
              <Input
                id="book-author"
                type="text"
                placeholder="e.g. Matt Haig"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSaving}
                className="w-full px-4 py-2.5 bg-card border-border rounded-md text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-inner-soft text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => handleClose()}
              disabled={status === 'uploading' || isSaving}
              className="px-4 py-3 rounded-xl border-border text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={!isReadyToAdd || status === 'uploading'}
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isCoverGenerating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Generating Cover...</span>
                </>
              ) : isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Add Book</span>
                  <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
