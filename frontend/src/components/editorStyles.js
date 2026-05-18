export const editorStyles = `
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    background-color: #f3f4f6;
  }

  .toolbar {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    gap: 4px;
    z-index: 10;
  }

  .tool-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
    border: 1px solid transparent;
    border-radius: 6px;
    background: transparent;
    color: #4b5563;
    cursor: pointer;
    font-size: 16px;
    user-select: none;
  }

  .tool-btn.text-btn {
    padding: 0 12px;
    font-weight: 600;
    font-size: 14px;
  }

  .tool-btn:hover {
    background-color: #f3f4f6;
  }

  .tool-btn:active {
    transform: scale(0.92);
  }

  .tool-btn.is-active {
    background-color: #e0e7ff;
    color: #4338ca;
    border: 1px solid #c7d2fe;
    font-weight: 700;
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: #e5e7eb;
    margin: 0 8px;
  }

  .save-status {
    margin-left: auto;
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
  }

  .workspace {
    flex: 1;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    padding: 40px 20px;
    background-color: #f3f4f6;
  }

  .a4-page {
    width: 210mm;
    min-height: 297mm;
    padding: 25.4mm;
    background: #ffffff;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 10px 15px -3px rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    border: 1px solid #e5e7eb;
  }

  .a4-page .ProseMirror {
    outline: none;
    min-height: 100%;
    color: #1f2937;
    font-size: 16px;
    line-height: 1.6;
  }

  .a4-page .ProseMirror p {
    margin-bottom: 1em;
  }

  .a4-page .ProseMirror h1,
  .a4-page .ProseMirror h2 {
    color: #111827;
    line-height: 1.3;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }

  .loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 500px;
    background-color: #f3f4f6;
    color: #6b7280;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top-color: #4f46e5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
