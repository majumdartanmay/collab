import * as Y from "yjs";
import config from '../../backend/backend.json'
import {createWebrtcProvider} from './DependencyUtils'

const debug = false;
const doc = createYDoc();
const SUCCESS = 0;
const FAIL = 1;
const UNKNOWN_ERROR = 2;
const roomID = "4D278ds2f66729";
const hostname = config.CLIENT.SIGNALLING_SERVER;
const port = config.SIGNALLING_PORT;
const backend_host = config.CLIENT.BACKEND_SERVER;
const backend_port = config.PORT;
const backend_scheme = config.BACKEND_URL_SCHEME;
const backend_url = `${backend_scheme}://${backend_host}:${backend_port}/`
createWebrtcProvider(roomID, doc, { signaling: [`ws://${hostname}:${port}`] });
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

export function addRoomMetadata(room, pwd, admin, callback)  {

    roomYMap.set(room, admin);

    const reqBody = {
        username: admin,
        pwd,
        roomId: room
    }

    const data = JSON.stringify(reqBody);

    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        logDebug("Room metadata API response : " + this.responseText);
        if(this.readyState === 4) {
            const statusBody = JSON.parse(this.responseText);
            if (statusBody && statusBody.status == "OK") {
                callback(SUCCESS, "Room metadata added");
                logDebug("Room metadata added for " + room);
            } else {
                const errMessage = statusBody ? statusBody.status : '';
                const errorNotification = "Unable to add room metadata.[CODE : 2]" + errMessage; 
                callback(FAIL, errorNotification);
                logDebug(errorNotification);
            }
        }
    });

    xhr.open("POST", `${backend_url}room`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

export function roomExists(room) {
    logDebug(`Room json ${JSON.stringify(roomYMap.toJSON())}`);
    const exists = !!roomYMap.get(room);
    logDebug(`Room exists : ${exists}`);
    return exists;
}

export function verifyRoomPwd(roomId, pwd, callback) {

    var data = JSON.stringify({
        pwd,
        roomId
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === XMLHttpRequest.DONE) {

            logDebug(this.responseText);
            const statusBody = JSON.parse(this.responseText);

            if (statusBody && statusBody.status == "OK") {
                callback(SUCCESS, status.message);
            }else if (statusBody) {
                callback(FAIL, status.message);
            }else {
                callback(UNKNOWN_ERROR, "Unable to verify your credentials. Please try again");
            }
        }
    });

    xhr.open("POST", `${backend_url}login`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}
