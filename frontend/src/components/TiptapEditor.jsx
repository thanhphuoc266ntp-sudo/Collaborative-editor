/**
 * TiptapEditor.jsx — v2 (bugfix)
 *
 * FIX 1: TypeError "Cannot read properties of undefined (reading 'doc')"
 *   → Collaboration.configure({ document: undefined }) crash ProseMirror khi
 *     TiptapEditor mount trước khi EditorComponent's useEffect chạy xong.
 *   → Giải pháp: Guard wrapper pattern. TiptapEditorInner (có useEditor hook)
 *     chỉ được mount khi ydoc + provider đã sẵn sàng.
 *     Không thể đặt if-return trước useEditor vì vi phạm Rules of Hooks —
 *     tách thành 2 component: wrapper (guard) + inner (hooks).
 *
 * FIX 2: Duplicate extension names 'underline'
 *   → Xảy ra khi Underline được register 2 lần.
 *   → Đảm bảo chỉ có MỘT Underline trong toàn bộ extensions array.
 *   → Xóa Underline khỏi mọi nơi khác trong codebase, chỉ giữ ở đây.
 *
 * FIX 3: Không truyền content khi dùng Collaboration.
 * FIX 4: StarterKit history: false.
 */

import React, { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import EditorToolbar from "./EditorToolbar";
import {
  editorContentStyle,
  a4PageStyle,
  injectEditorStyles,
} from "./editorStyles";

// Inject CSS một lần khi module load
injectEditorStyles();

// ─── Public component: Guard wrapper ─────────────────────────────────────────

/**
 * Wrapper kiểm tra ydoc + provider TRƯỚC KHI mount TiptapEditorInner.
 *
 * Tại sao cần guard riêng?
 * React Rules of Hooks: không thể đặt `if (!ydoc) return null` trước useEditor().
 * Giải pháp: tách thành 2 component. Guard wrapper không có hooks, chỉ kiểm tra
 * props. TiptapEditorInner có hooks và được mount khi props đã sẵn sàng.
 */
export default function TiptapEditor({ ydoc, provider, currentUser }) {
  if (!ydoc || !provider) {
    return (
      <div style={editorContentStyle.root}>
        <div className="editor-loading">
          <LoadingSpinner />
          <span>Đang khởi tạo tài liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <TiptapEditorInner
      ydoc={ydoc}
      provider={provider}
      currentUser={currentUser}
    />
  );
}

// ─── Inner component: chứa useEditor hook ────────────────────────────────────

/**
 * Chỉ được mount khi ydoc VÀ provider đã sẵn sàng (guaranteed bởi guard trên).
 * useEditor sẽ không bao giờ nhận ydoc=undefined.
 */
function TiptapEditorInner({ ydoc, provider, currentUser }) {
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        /**
         * CRITICAL: Tắt history của StarterKit.
         * Collaboration dùng Y.UndoManager → nếu cả hai cùng chạy:
         * double undo stack → re-render liên tục → reset selection.
         */
        history: false,
      }),

      /**
       * Underline — import từ @tiptap/extension-underline.
       * StarterKit KHÔNG bao gồm Underline.
       * Đây là nơi DUY NHẤT khai báo Underline — đừng thêm ở bất kỳ chỗ nào khác.
       *
       * Nếu vẫn gặp warning "Duplicate extension names: underline":
       * → Tìm và xóa Underline trong code cũ của bạn (EditorComponent, TiptapEditor cũ, v.v.)
       */
      Underline,

      /**
       * Collaboration quản lý toàn bộ document content qua Y.Doc.
       * ydoc được đảm bảo là defined bởi guard wrapper.
       */
      Collaboration.configure({
        document: ydoc,
      }),

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
    // KHÔNG truyền content — Collaboration lấy từ Y.Doc
    autofocus: "end",
    editorProps: {
      attributes: {
        class: "tiptap-prose-editor",
        spellcheck: "true",
      },
    },
  });

  if (!editor) {
    return (
      <div style={editorContentStyle.root}>
        <div className="editor-loading">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="tiptap-editor-root" style={editorContentStyle.root}>
      <EditorToolbar editor={editor} />
      <div className="a4-page-scroll" style={editorContentStyle.scroll}>
        <div className="a4-page" style={a4PageStyle}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
