'use client';

import React from 'react';
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
} from 'lucide-react';

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

const NoteContent = () => {
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
          'prose prose-stone dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-6 py-4 font-serif text-stone-800 dark:text-stone-300 leading-relaxed',
      },
    },
  });

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

  return (
    <div className="flex flex-col h-full bg-white dark:bg-sidebar-dark">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-sepia-divider/30 dark:border-sidebar-border/50 bg-stone-50/50 dark:bg-stone-900/30 shrink-0 flex-wrap">
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

        <Separator orientation="vertical" className="mx-1 h-4" />

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

        <Separator orientation="vertical" className="mx-1 h-4" />

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

        <Separator orientation="vertical" className="mx-1 h-4" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isBlockquote}
          disabled={!editorState.canBlockquote}
          icon={<Quote className="h-4 w-4" />}
          tooltip="Quote"
        />

        <div className="flex-1" />

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

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default NoteContent;
