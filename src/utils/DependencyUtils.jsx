import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from 'y-monaco';


export function createWebrtcProvider(hash, doc, wsParam) {
  const provider = new WebrtcProvider(hash, doc, wsParam);
  provider.on('status', (data) => {
    console.log(`Provider status for ${hash} ${data}`);
  });
  return provider;
}

export function bindMonaco(type, editorModel, editorSet, awareness) {
    return new MonacoBinding(
      type,
      editorModel,
      editorSet,
      awareness);
}

