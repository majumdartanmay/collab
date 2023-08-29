import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs";
import config from '../../backend/config.json'

const doc = new Y.Doc();
const roomID = "4D278ds2f66729";
const hostname = config.SERVER_URL;
const port = config.SIGNALLING_PORT;
const provider = new WebrtcProvider(roomID, doc, { signaling: [`ws://${hostname}:${port}`] });
const userKey = 'users';
const ymap = doc.getMap('metadata');
ymap.set(userKey, ymap.get(userKey) || new Y.Array(userKey));

export function addYUsersInWebRtc(userName) {
    const update = Y.encodeStateAsUpdate(doc);
    Y.applyUpdate(doc, update);
    const usersY = ymap.get(userKey);
    const users = usersY.toArray();
    console.log("users @ " + users);
    users.push(userName);
    usersY.insert(0, users);
}

export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}