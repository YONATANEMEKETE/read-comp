'use client';

import * as React from 'react';
import { Upload, X, ArrowRight } from 'lucide-react';
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

interface UploadBookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadBookDialog({
  open,
  onOpenChange,
}: UploadBookDialogProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    // TODO: Implement upload logic
    console.log('Uploading:', { file: selectedFile, title, author });
  };

  const handleClose = () => {
    setSelectedFile(null);
    setTitle('');
    setAuthor('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[480px] bg-background border-border rounded-3xl p-8"
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

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
            className={`
              relative w-full aspect-[2/1] border-2 border-dashed rounded-2xl 
              flex flex-col items-center justify-center gap-3 
              transition-all cursor-pointer group
              ${
                isDragging
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card/40 hover:border-primary/50 hover:bg-primary/5'
              }
              ${selectedFile ? 'border-primary bg-primary/5' : ''}
            `}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="size-12 rounded-full bg-background shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 pointer-events-none">
              <Upload size={24} />
            </div>

            <div className="text-center pointer-events-none">
              {selectedFile ? (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    PDF only (max 50MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Book Details Form */}
          <div className="space-y-5">
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
                className="w-full px-4 py-2.5 bg-card border-border rounded-md text-foreground placeholder-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary shadow-inner-soft text-sm"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-4 py-3 rounded-xl border-border text-muted-foreground font-medium hover:bg-muted hover:text-foreground transition-colors text-sm cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !title}
              className="px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Add Book</span>
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
