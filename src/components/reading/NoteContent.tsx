'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Check,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { getNoteAction, saveNoteAction } from '@/actions/notes';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  tooltip: string;
}

const ToolbarButton = ({
  onClick,
  isActive,
  disabled,
  icon,
  tooltip,
}: ToolbarButtonProps) => (
  <TooltipProvider delayDuration={100}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          disabled={disabled}
          className={cn(
            'h-8 w-8 shrink-0',
            isActive && 'bg-primary/15 text-primary ring-1 ring-primary ring-offset-1 hover:bg-primary/25'
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface NoteContentProps {
  bookId?: string;
  isOffline?: boolean;
}

const NoteContent = ({ bookId, isOffline = false }: NoteContentProps) => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const queryClient = useQueryClient();
  
  // Ref to track the timeout for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>('');
  const isInitialLoadDone = useRef<boolean>(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', bookId],
    queryFn: async () => {
      if (!bookId) return null;
      const result = await getNoteAction(bookId);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    },
    enabled: !!bookId,
    staleTime: 1000 * 60, // 1 minute stale time instead of Infinity
  });

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: async (content: string) => {
      if (!bookId) return;
      return await saveNoteAction(bookId, content);
    },
    onSuccess: (result) => {
      if (result?.success) {
        setLastSaved(new Date());
        queryClient.invalidateQueries({ queryKey: ['note', bookId] });
      }
    },
    onError: (error) => {
      console.error('Failed to auto-save note:', error);
      toast.error('Failed to save note');
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your notes...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: '<p></p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-3 sm:px-6 py-4 font-serif text-stone-800 dark:text-stone-300 leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      if (isOffline) return;
      if (!bookId) return;
      
      const content = editor.getHTML();
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Don't save if content hasn't really changed
      if (content === lastContentRef.current) return;

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        lastContentRef.current = content;
        saveNote(content);
      }, 3000);
    },
  });

  // Load initial note data into editor
  useEffect(() => {
    if (editor && note && !isInitialLoadDone.current) {
      editor.commands.setContent(note.content);
      lastContentRef.current = note.content;
      setLastSaved(new Date(note.updatedAt));
      isInitialLoadDone.current = true;
    }
  }, [editor, note]);

  // Toggle editability when offline
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isOffline);
    }
  }, [editor, isOffline]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Check if toolbar has overflow (needs scrolling)
  useEffect(() => {
    const checkOverflow = () => {
      if (toolbarRef.current) {
        const { scrollWidth, clientWidth } = toolbarRef.current;
        setShowScrollIndicator(scrollWidth > clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    
    // Also check after a short delay to account for initial render
    const timeoutId = setTimeout(checkOverflow, 100);
    
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
    };
  }, []);

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isHeading1: false,
          isHeading2: false,
          isBulletList: false,
          isOrderedList: false,
          isBlockquote: false,
          canUndo: false,
          canRedo: false,
          canBold: false,
          canItalic: false,
          canHeading1: false,
          canHeading2: false,
          canBulletList: false,
          canOrderedList: false,
          canBlockquote: false,
        };
      }
      return {
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isHeading1: editor.isActive('heading', { level: 1 }),
        isHeading2: editor.isActive('heading', { level: 2 }),
        isBulletList: editor.isActive('bulletList'),
        isOrderedList: editor.isActive('orderedList'),
        isBlockquote: editor.isActive('blockquote'),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        canBold: editor.can().chain().focus().toggleBold().run(),
        canItalic: editor.can().chain().focus().toggleItalic().run(),
        canHeading1: editor.can().chain().focus().toggleHeading({ level: 1 }).run(),
        canHeading2: editor.can().chain().focus().toggleHeading({ level: 2 }).run(),
        canBulletList: editor.can().chain().focus().toggleBulletList().run(),
        canOrderedList: editor.can().chain().focus().toggleOrderedList().run(),
        canBlockquote: editor.can().chain().focus().toggleBlockquote().run(),
      };
    },
  });

  if (!editor || !editorState) {
    return null;
  }

  if (isLoading && !isInitialLoadDone.current) {
    return (
      <div className="flex h-full items-center justify-center bg-white dark:bg-sidebar-dark">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-sidebar-dark relative">
      {isOffline && (
        <div className="px-4 py-2 text-xs text-amber-700 bg-amber-50 border-b border-amber-200">
          Offline mode: notes are read-only.
        </div>
      )}
      {/* Saving Indicator Overlay */}
      <div className="absolute top-2 right-4 z-10 pointer-events-none">
        {isSaving ? (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-white/80 dark:bg-stone-900/80 px-2 py-1 rounded-full backdrop-blur-sm border border-border/50 shadow-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </div>
        ) : lastSaved ? (
          <div className="flex items-center gap-1.5 text-xs text-green-600/80 dark:text-green-400/80 bg-white/80 dark:bg-stone-900/80 px-2 py-1 rounded-full backdrop-blur-sm border border-border/50 shadow-sm transition-opacity duration-1000 opacity-0 hover:opacity-100 group-hover:opacity-100">
            <Check className="h-3 w-3" />
            <span>Saved</span>
          </div>
        ) : null}
      </div>

      {/* Toolbar */}
      <div className="flex items-center px-2 sm:px-4 py-2 border-b border-sepia-divider/30 dark:border-sidebar-border/50 bg-stone-50/50 dark:bg-stone-900/30 shrink-0 overflow-x-auto scrollbar-hide">
        {/* Formatting Group */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editorState.isBold}
            disabled={!editorState.canBold}
            icon={<Bold className="h-4 w-4" />}
            tooltip="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editorState.isItalic}
            disabled={!editorState.canItalic}
            icon={<Italic className="h-4 w-4" />}
            tooltip="Italic (Ctrl+I)"
          />
        </div>

        <Separator orientation="vertical" className="mx-1 h-4 shrink-0" />

        {/* Headings Group */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editorState.isHeading1}
            disabled={!editorState.canHeading1}
            icon={<Heading1 className="h-4 w-4" />}
            tooltip="Heading 1"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editorState.isHeading2}
            disabled={!editorState.canHeading2}
            icon={<Heading2 className="h-4 w-4" />}
            tooltip="Heading 2"
          />
        </div>

        <Separator orientation="vertical" className="mx-1 h-4 shrink-0" />

        {/* Lists Group */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editorState.isBulletList}
            disabled={!editorState.canBulletList}
            icon={<List className="h-4 w-4" />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editorState.isOrderedList}
            disabled={!editorState.canOrderedList}
            icon={<ListOrdered className="h-4 w-4" />}
            tooltip="Numbered List"
          />
        </div>

        <Separator orientation="vertical" className="mx-1 h-4 shrink-0" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isBlockquote}
          disabled={!editorState.canBlockquote}
          icon={<Quote className="h-4 w-4" />}
          tooltip="Quote"
        />

        <div className="flex-1 min-w-[8px]" />

        {/* History Group */}
        <div className="flex items-center gap-0.5 shrink-0">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editorState.canUndo}
            icon={<Undo className="h-4 w-4" />}
            tooltip="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editorState.canRedo}
            icon={<Redo className="h-4 w-4" />}
            tooltip="Redo (Ctrl+Y)"
          />
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteContent;
