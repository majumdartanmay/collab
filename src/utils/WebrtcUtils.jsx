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

export function addRoomMetadata(room, pwd, admin)  {

    roomYMap.set(room, pwd);
    const reqBody = {
        username: admin,
        pwd,
        roomId: room
    }
    var data = JSON.stringify(reqBody);

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "http://localhost:24555/room");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

export function roomExists(room) {
    logDebug(`Room json ${JSON.stringify(roomYMap.toJSON())}`);
    const exists = roomYMap.get(room) != undefined;
    logDebug(`Room exists : ${exists}`);
    return exists;
}

export function verifyRoomPwd(room, pwd) {

    var data = JSON.stringify({
        pwd,
        roomId: room
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === XMLHttpRequest.DONE) {
            const statusBody = JSON.parse(this.responseText);
            console.log(statusBody);
        }
    });

    xhr.open("POST", "http://localhost:24555/login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
    return roomYMap.get(room) === pwd;
}

export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}
