import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs";
import config from '../../backend/backend.json'

const debug = true;

const doc = createYDoc();
const roomID = "4D278ds2f66729";
const hostname = config.CLIENT.SIGNALLING_SERVER;
const port = config.SIGNALLING_PORT;
new WebrtcProvider(roomID, doc, { signaling: [`ws://${hostname}:${port}`] });
const userKey = 'users';
const roomKey = 'rooms'
const ymap = doc.getMap('metadata');
ymap.set(userKey, ymap.get(userKey) || new Y.Array(userKey));
const roomYMap = doc.getMap(roomKey); 

export function logDebug(s) {
    if (debug) console.log(s);
}

function createYDoc() {
    return new Y.Doc();
}

export const addUsers = (username) => {
    addYUsersInWebRtc(username);
}

function addYUsersInWebRtc(userName) {
    updateYDoc();
    const usersY = ymap.get(userKey);
    const users = usersY.toArray();
    users.push(userName);
    usersY.insert(0, users);
}

function updateYDoc() {
    const update = Y.encodeStateAsUpdate(doc);
    Y.applyUpdate(doc, update);
}

export function addRoomMetadata(room, pwd)  {
    roomYMap.set(room, pwd);
}

export function roomExists(room) {
    logDebug(`Room json ${JSON.stringify(roomYMap.toJSON())}`);
    const exists = roomYMap.get(room) != undefined;
    logDebug(`Room exists : ${exists}`);
    return exists;
}

export function verifyRoomPwd(room, pwd) {
    return roomYMap.get(room) === pwd;
}

export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}
