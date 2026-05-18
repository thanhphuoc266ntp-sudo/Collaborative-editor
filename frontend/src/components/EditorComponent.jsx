import React, { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import TiptapEditor from "./TiptapEditor";
import { editorStyles } from "./editorStyles";

const COLLAB_URL =
  import.meta.env.VITE_COLLAB_URL ||
  "wss://collaborative-editor-zegd.onrender.com/collaboration";

const EditorComponent = ({ documentId }) => {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (!documentId) return;

    const ydoc = new Y.Doc();

    const provider = new HocuspocusProvider({
      url: COLLAB_URL,
      name: documentId,
      document: ydoc,
      connect: true,
    });

    setNetwork({
      ydoc,
      provider,
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [documentId]);

  return (
    <>
      <style>{editorStyles}</style>

      {!network ? (
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Đang kết nối Hocuspocus...</p>
        </div>
      ) : (
        <TiptapEditor ydoc={network.ydoc} provider={network.provider} />
      )}
    </>
  );
};

export default EditorComponent;
