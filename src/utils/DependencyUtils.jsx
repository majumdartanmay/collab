import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from 'y-monaco';

export function createWebrtcProvider(hash, doc, wsParam) {
  return new WebrtcProvider(hash, doc, wsParam);
}

export function createMonacoProvider(type, editorModel, editorSet, awareness) {
    return new MonacoBinding()(
      type,
      editorModel,
      editorSet,
      awareness);
}
