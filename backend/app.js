import cors from 'cors'
import express from 'express'
import bcrypt from 'bcryptjs'
import process from 'node:process';
import Database from 'better-sqlite3';
import fs from 'fs';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const DB = loadJSON('./db.json');
const config = loadJSON('./backend.json');
const app = express();
const port = config.AUTH_PORT;
const database = DB.database;
const sqlliteDBName = `${database}.db`
const tableName = DB.usertable;

app.use(express.json());

//Enable cors
app.use(cors({}));

app.use(function(_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.listen(port, config.BACKEND_SERVER, () => {
    console.log(`Backend app is listening at http://${config.BACKEND_SERVER}:${port}. 
    Call http://${config.BACKEND_SERVER}:${port}/healthcheck to see 
    if we have established DB connectivity`);

    initDBInfra();
});

function initDBInfra() {

    console.debug(`Attempting to create required infrastructure`);
    const dbConnection = new Database(sqlliteDBName, { verbose: console.log });
    try {
        const userTableCreateSQL =
            `CREATE TABLE IF NOT EXISTS ${DB.usertable} (
        roomId VARCHAR(255) NOT NULL,
        secret VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        PRIMARY KEY (roomId, username))`;

        const healthTableCreateSQL =
            `CREATE TABLE IF NOT EXISTS ${DB.health_table} (
        id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL, 
        value INT)`

        const deleteHealthEntriesSQL = `DELETE FROM ${DB.health_table}`;

        const insertIntoHealthSQL = `INSERT INTO ${DB.health_table}  (ID, VALUE) VALUES(?, FLOOR(RANDOM()));`;

        dbConnection.prepare(userTableCreateSQL).run();
        console.debug(`${DB.usertable} created!`);

        dbConnection.prepare(healthTableCreateSQL).run();
        console.debug(`${DB.health_table} created!`);

        dbConnection.prepare(deleteHealthEntriesSQL).run();
        console.debug(`${DB.health_table} entries deleted!`);

        for (let i = 0; i < 5; i++) {
            dbConnection.prepare(insertIntoHealthSQL).run(i);
        }

    } catch (err) {
        console.debug(`Unable to create infrastructure. ${err}`);
        process.exit(-1);
    } finally {
        dbConnection.close();
    }
}

app.get("/healthcheck", async (_, res, __) => {
    const dbConnection = new Database(sqlliteDBName, { verbose: console.log });
    try {
        const rows = dbConnection.prepare(`SELECT * FROM ${DB.health_table}`).all() || [];
        res.json(rows);
    } catch (e) {
        res.json(e);
    } finally {
        dbConnection.close();
    }
});

app.post("/room", async function(req, res, _) {

    const dbConnection = new Database(sqlliteDBName, { verbose: console.log });
    try {

        dbConnection.prepare(`INSERT INTO ${tableName} (username, secret, roomId) VALUES (?, ?, ?)`)
            .run(req.body.username, await bcrypt.hash(req.body.pwd, config.SALT_LENGTH), req.body.roomId);
        res.json({ "status": "OK" });
    } catch (err) {
        res.json({ "status": err.message });
    } finally {
        dbConnection.close();
    }
});

app.delete("/room", async function(req, res, _) {
    const dbConnection = new Database(sqlliteDBName, { verbose: console.log });
    try {
        dbConnection.prepare(`DELETE FROM ${tableName} WHERE roomId = ?`).run(req.body.roomId);
        res.json({ "status": "OK" });
    } catch (err) {
        res.json({ "status": err.message });
    } finally {
        dbConnection.close();
    }
});

app.post("/login", async function(req, res, _) {
    try {
        const pwd = await getSecret(req.body.roomId);
        console.log(`pwd = ${pwd} | secret : ${req.body.pwd}`);
        if (!pwd) {
            res.json({ status: "NOT_FOUND", message: "Room not found" });
            return;
        }

        const result = bcrypt.compareSync(req.body.pwd, pwd.secret);
        if (result) {
            res.json({ "status": "OK" });
            return;
        }
        res.json({ status: "INVALID", message: "Password comparison failed" });
    } catch (err) {
        res.json({ status: "UNKNOWN_ERROR", message: err.message });
    }
});

async function getSecret(roomId) {
    const dbConnection = new Database(sqlliteDBName, { verbose: console.log });
    const results = dbConnection.prepare(`SELECT secret FROM ${tableName} WHERE roomId  = ?`).get(roomId);
    if (!results) {
        return null;
    }
    return results;
}
