import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import config from '../../backend/backend.json'

const doc = createYDoc();
const SUCCESS = 0;
const FAIL = 1;
const UNKNOWN_ERROR = 2;
const genericError = "Unknown problem occured.";
const roomID = "4D278ds2f66729";
const hostname = config.CLIENT.SIGNALLING_SERVER;
const port = config.SIGNALLING_PORT;
const backend_host = config.CLIENT.BACKEND_SERVER;
const backend_port = config.AUTH_PORT;
const backend_scheme = config.BACKEND_URL_SCHEME;
const backend_url = `${backend_scheme}://${backend_host}:${backend_port}/`
const userKey = 'users';
const roomKey = 'rooms'

class CustomRtcProvider extends WebrtcProvider {

    emit (name, args) {
        const output = super.emit(name, args);
        logDebug(`CustomRtcProvider is working`);
        return output;
    }

}

initContext();
const ymap = doc.getMap('metadata');
ymap.set(userKey, ymap.get(userKey) || new Y.Array(userKey));
const roomYMap = doc.getMap(roomKey); 

/**
 * Stores the webrtc provider in a global cache.
 *
 * @param {string} roomID - Room identification
 * @param {WebrtcProvider} provider - The webrtc provider in question
 */
function addToCollabCache(roomId, provider) {

    window.colllabCache = getCacheObject();
    window.collabCache[roomId] = provider;
    logDebug(`Stored provider for ${roomId} in cache`);
}

/**
 * Creates the cache object for collab
 *
 * @returns {Object} Cache map
 */
function getCacheObject() {

    if (window.collabCache == undefined) {
        window.collabCache = {};
    }

    return window.collabCache;
}

/**
 * Gets you the cached webrtc provider, if it exists
 *
 * @param {string} roomId - Room identification
 * @returns {WebrtcProvider} cached web rtc provider
 */
function getOldProvider(roomId) {
    return getCacheObject()[roomId];
}

/**
 * Creates a WebrtcProvider
 *
 * @param {string} hash - Hash of the room
 *
 * @param {Doc} doc - A YJS document. This will be bounded
 * to the WebRtc provider
 *
 * @param {Object} wsParam - Parameters of the WebrtcProvider
 * @see {@link WebrtcProvider#constructor}
 *
 * @returns {WebrtcProvider} instance of the webrtc provider
 */
export function createWebrtcProvider(hash, doc, wsParam) {

    const oldProvider = getOldProvider(hash);
    if (oldProvider == undefined) {
        logDebug(`Old provider for ${hash} doesn't exist`);
    }else {

        logDebug(`Found old provider for ${hash}`);
        if (oldProvider.connected) {
            logDebug(`${hash} has a cached provider. Destryoing it...`);
            oldProvider.room.disconnect();

        } else {

            logDebug(`No old  web rtc provider for ${hash}. Creating a new one`);
        }
    }

    const provider =  new CustomRtcProvider(hash, doc, wsParam);

    addToCollabCache(hash, provider);
    return provider;
}

/**
 * Creates an instance of WebrtcProvider
 * using the roomId and the YJS document
 * for the room
 *
 */
function initContext() {
    createWebrtcProvider(roomID, doc, { signaling: [`ws://${hostname}:${port}`] });
}

/**
 * Commmon logger for the application
 * It will only print the log if the
 * relevant flag is true in localStroage
 *
 * @param {string} s - Log message
 */
export function logDebug(s) {
    if (localStorage.collab) console.log(s);
}

/**
 * Wrapper method to create yjs document
 *
 * @returns {Y.Doc} YJS document
 */
function createYDoc() {
    return new Y.Doc();
}

/**
 * Adds user to the YJS document
 * which is mapped to roomid = #roomId
 *
 * @param {string} username - Username to add
 */
export const addUsers = (username) => {
    addYUsersInWebRtc(username);
}


/**
 * Deletes the room for the backend database
 *
 * @param {string} roomId - Room to delete
 * @param {@function} callback - Callback to broadcast result
 */
export function deleteRoom(roomId, callback) {

    try {

        const data = JSON.stringify({
            roomId
        });

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function() {
            if(this.readyState === 4) {
                if (this.responseText) {
                    const statusBody = JSON.parse(this.responseText);
                    if (statusBody && statusBody.status == "OK") {
                        const msg = "Stale room deleted";
                        callback(SUCCESS, msg);
                        logDebug(msg);
                    } else {
                        const error = `${genericError} [ERROR_CODE: 3]`
                        callback(UNKNOWN_ERROR, error);
                        logDebug(error);
                    }
                }
            }
        });

        xhr.open("DELETE", `${backend_url}room`);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(data);
    } catch(e) {
        const error = `${genericError} ${e.message}`
        callback(UNKNOWN_ERROR, error);
        logDebug(error);
    }

}

/**
 * Adds user to the YJS document
 *
 * @param {string} userName - Username to add
 */
function addYUsersInWebRtc(userName) {
    updateYDoc();
    const usersY = ymap.get(userKey);
    const users = usersY.toArray();
    users.push(userName);
    usersY.insert(0, users);
}

/**
 * Updates the YJS document
 *
 */
function updateYDoc() {
    const update = Y.encodeStateAsUpdate(doc);
    Y.applyUpdate(doc, update);
}

/**
 * Each room needs to be mapped with a password, 
 * admin username. This function will log this 
 * information in YJS doc and also perist the 
 * information in the collab database
 *
 * @param {string} room - Room to add
 * @param {string} pwd - Password to access the room
 * @param {string} admin - Username  of the room creator
 * @param {@function} callback - Function to call with the processing information
 */
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
        if(this.readyState === 4) {
        logDebug("Room metadata API response : " + this.responseText);
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

/**
 * Checks if the room already exists
 *
 * @param {string} room - Room identification
 * @returns {boolean} <code>true</code> if room exists
 */
export function roomExists(room) {
    logDebug(`Room json ${JSON.stringify(roomYMap.toJSON())}`);
    const exists = !!roomYMap.get(room);
    logDebug(`Room exists : ${exists}`);
    return exists;
}

/**
 * Checks the room password
 *
 * @param {string} roomId - Room identification
 * @param {string} pwd - Password of the room
 * @param {@function} callback - Callback to broadcast results
 */
export function verifyRoomPwd(roomId, pwd, callback) {

    var data = JSON.stringify({
        pwd,
        roomId
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === XMLHttpRequest.DONE) {

            const statusBody = JSON.parse(this.responseText);
            logDebug(statusBody);

            if (statusBody && statusBody.status == "OK") {
                callback(SUCCESS, statusBody.message);
            }else if (statusBody) {
                callback(FAIL, statusBody.message);
            }else {
                callback(UNKNOWN_ERROR, "Unable to verify your credentials. Please try again");
            }
        }
    });

    xhr.open("POST", `${backend_url}login`);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

/**
 * Get users from YJS document
 *
 * @returns {Array} List of users who are online
 */
export function getYUsersInWebrtc() {
    return ymap.get(userKey).toArray();
}
