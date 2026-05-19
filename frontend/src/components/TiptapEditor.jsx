/**
 * TiptapEditor.jsx
 *
 * ROOT CAUSE FIXES:
 * 1. KHÔNG truyền `content` vào useEditor khi dùng Collaboration extension.
 *    Content ban đầu do Y.Doc quản lý. Truyền content = ghi đè Y.Doc → xung đột.
 *
 * 2. Extensions array PHẢI ổn định qua các lần render.
 *    Dùng useMemo với deps [ydoc, provider, currentUser] — những thứ chỉ đổi khi
 *    documentId đổi (lúc đó component đã bị remount bởi key= ở EditorComponent).
 *
 * 3. StarterKit phải disable `history: false` vì Collaboration tự quản lý undo/redo
 *    qua Y.UndoManager. Dùng cả hai = double undo stack = hành vi kỳ lạ.
 *
 * 4. Underline extension phải được import riêng từ @tiptap/extension-underline.
 *    StarterKit KHÔNG bao gồm Underline.
 *
 * 5. editorProps.handleDOMEvents không can thiệp vào mousedown của toolbar.
 */

import React, { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import EditorToolbar from "./EditorToolbar";
import { editorContentStyle, a4PageStyle } from "./editorStyles";

export default function TiptapEditor({ ydoc, provider, currentUser }) {
  /**
   * useMemo để extensions không bị tạo lại mỗi render.
   * Chỉ tạo lại khi ydoc/provider/currentUser thực sự thay đổi
   * (thực tế điều này không xảy ra vì có key= ở component cha).
   */
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        /**
         * CRITICAL: Tắt history của StarterKit.
         * Collaboration extension dùng Y.UndoManager để quản lý undo/redo.
         * Nếu cả hai cùng chạy → conflict → editor có thể re-render kỳ lạ
         * và làm mất selection sau mỗi keystroke.
         */
        history: false,

        // Các node/mark trong StarterKit vẫn dùng bình thường
        bold: {},
        italic: {},
        // Underline KHÔNG có trong StarterKit, load riêng bên dưới
      }),

      /**
       * Underline từ @tiptap/extension-underline
       * Đây là extension riêng biệt, không phải một phần của StarterKit.
       * Thiếu extension này → editor.chain().focus().toggleUnderline() không hoạt động.
       */
      Underline,

      /**
       * Collaboration PHẢI được config với ydoc.
       * Extension này replace toàn bộ document state bằng Y.Doc.
       * Đó là lý do KHÔNG được truyền content vào useEditor.
       */
      Collaboration.configure({
        document: ydoc,
      }),

      /**
       * CollaborationCursor hiển thị cursor của user khác.
       * provider ở đây là HocuspocusProvider.
       */
      CollaborationCursor.configure({
        provider,
        user: {
          name: currentUser?.name ?? "Người dùng",
          color: currentUser?.color ?? "#4f46e5",
        },
      }),
    ],
    [ydoc, provider, currentUser],
  );

  const editor = useEditor({
    extensions,

    /**
     * CRITICAL: KHÔNG truyền content khi dùng Collaboration.
     * Nếu truyền content ở đây, Tiptap sẽ ghi đè Y.Doc ban đầu mỗi lần
     * useEditor chạy lại → mất nội dung, mất selection, mất collaboration state.
     *
     * content: undefined  ← để trống hoặc comment ra
     */

    autofocus: "end",

    editorProps: {
      attributes: {
        /**
         * Class để target bằng CSS nếu cần.
         * KHÔNG đặt tabIndex ở đây, ProseMirror tự quản lý focus.
         */
        class: "tiptap-prose-editor",
        spellcheck: "true",
      },
    },

    /**
     * onCreate: chỉ dùng để log, không manipulate content.
     */
    onCreate: ({ editor: e }) => {
      console.log(
        "[TiptapEditor] Editor created, node count:",
        e.state.doc.childCount,
      );
    },

    onDestroy: () => {
      console.log("[TiptapEditor] Editor destroyed");
    },
  });

  // Editor chưa sẵn sàng (mounting)
  if (!editor) {
    return (
      <div className="editor-skeleton">
        <div className="toolbar-skeleton" />
        <div className="page-skeleton" />
      </div>
    );
  }

  return (
    <div className="tiptap-editor-root" style={editorContentStyle.root}>
      <EditorToolbar editor={editor} />

      {/*
       * .a4-page KHÔNG được có:
       * - onMouseDown với preventDefault (phá selection)
       * - user-select: none (CSS)
       * - tabIndex (steal focus)
       * - pointer-events: none
       * Nó chỉ là container thuần túy về visual.
       */}
      <div className="a4-page-scroll" style={editorContentStyle.scroll}>
        <div className="a4-page" style={a4PageStyle}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
