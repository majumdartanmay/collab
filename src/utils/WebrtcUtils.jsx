import { WebrtcProvider } from "y-webrtc"
import * as Y from "yjs";
import config from '../../backend/config.json'

const debug = true;

const doc = new Y.Doc();
const roomID = "4D278ds2f66729";
const hostname = config.SERVER_URL;
const port = config.SIGNALLING_PORT;
const provider = new WebrtcProvider(roomID, doc, { signaling: [`ws://${hostname}:${port}`] });
const userKey = 'users';
const roomKey = 'rooms'
const ymap = doc.getMap('metadata');
ymap.set(userKey, ymap.get(userKey) || new Y.Array(userKey));
ymap.set(roomKey, ymap.get(roomKey) || new Y.Map());

export function logDebug(s) {
    if (debug) console.log(s);
}

export function addYUsersInWebRtc(userName) {
    updateYDoc();
    const usersY = ymap.get(userKey);
    const users = usersY.toArray();
    console.log("users @ " + users);
    users.push(userName);
    usersY.insert(0, users);
}

function updateYDoc() {
    const update = Y.encodeStateAsUpdate(doc);
    Y.applyUpdate(doc, update);
}

export function addRoomMetadata(room, pwd)  {
    updateYDoc();
    const roomY = ymap.get(roomKey);
    roomY.set(room, pwd);
    ymap.set(roomKey, roomY);
    const roomMap = roomY.toJSON();
    logDebug("Printing room map " + roomMap);
}

export function roomExists(room) {
    logDebug("Calling roomExists");
    const roomMetadata = getRoomMap();
    const output =  roomMetadata[room] != undefined && roomMetadata[room] != null;
    logDebug(`roomExists(${room}) : ${output}`);
    return output;
}

export function verifyPwd(room, pwd) {
    const roomMetadata = getRoomMap();
    return roomMetadata[room] === pwd;
}

function getRoomMap() {
    updateYDoc();
    const roomY = ymap.get(roomKey);
    const roomMetadata = roomY.toJSON();
    return roomMetadata;
}

export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}