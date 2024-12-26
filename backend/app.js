import cors from 'cors'
import express from 'express'
import bcrypt from 'bcryptjs'
import process from 'node:process';
import sqlite3 from 'sqlite3';
import fs from 'fs';

const loadJSON = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const DB = loadJSON('./db.json');
const config = loadJSON('./backend.json');
const app = express();
const port = config.AUTH_PORT;
const database = DB.database;
const tableName = DB.usertable;
const sqlliteDBName = "collab.db";

app.use(express.json());

//Enable cors
app.use(cors({}));

app.use(function (_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.post("/room", async function (req, res, _) {
    try {
        await preparedQuery(`INSERT INTO ${database}.${tableName} (username, secret, roomId) VALUES (?, ?, ?)`,
            [req.body.username, await bcrypt.hash(req.body.pwd, config.SALT_LENGTH), req.body.roomId]);
        res.json({ "status": "OK" });
    } catch (err) {
        res.json({ "status": err.message });
    }
});

app.delete("/room", async function (req, res, _) {
    try {
        await preparedQuery(`DELETE FROM ${database}.${tableName} WHERE roomId = ?`,
            [req.body.roomId]);
            
        res.json({ "status": "OK" });
    } catch (err) {
        res.json({ "status": err.message });
    }
});

app.post("/login", async function (req, res, _) {
    try {
        const pwd = await getSecret(req.body.roomId);
        if (!pwd) {
            res.json({status: "NOT_FOUND", message: "Room not found"});
            return;
        }

        const result = bcrypt.compareSync(req.body.pwd, pwd.secret);
        if (result) {
            res.json({ "status": "OK" });
            return;
        }
        res.json({status: "INVALID", message: "Password comparison failed"});
    } catch (err) {
        res.json({status: "UNKNOWN_ERROR", message: err.message});
    }
});

async function query(sql, params) {
    const connection = await createConnection();
    const [results,] = await connection.execute(sql, params);
    connection.end();
    return results;
}

async function createConnection() {

    if (fs.existsSync(sqlliteDBName)) {
        return new sqlite3.Database(sqlliteDBName);
    }

    const db = new sqlite3.Database(sqlliteDBName, (error) => {
        if (error) {
            console.error(error);
            process.exit(-1);
        }
    });

    createTable(db);
    console.log("SQL Connection created");
    return db;
}

async function createTable(db) {
    db.exec(`
                CREATE TABLE users (
                    roomId VARCHAR(255) NOT NULL,
                    secret VARCHAR(255) NOT NULL,
                    username VARCHAR(255) NOT NULL,
                    PRIMARY KEY (roomId, username)
                );
            `);
}

async function preparedQuery(sql, params = []) {
    const connection = await createConnection(); 
    connection.run(
        sql,
        params,
        function (error) {
            if (error) {
                console.error(error.message);
            }
        }
    );
}

async function getSecret(roomId) {
    const connection = await createConnection(); 
    const [results, ] = await connection.execute(`SELECT secret FROM ${database}.${tableName} WHERE roomId  = ?`,  [roomId]);
    if (!results) {
        return null;
    }
    const pwd = results[0];
    return pwd;
}

app.get("/healthcheck", async(_, res, __) => {
    try {
        const rows = await query(`SELECT * FROM ${DB.database}.${DB.health_table}`) || [];
        res.json(rows);
    } catch(e) {
        res.json(e);
    }
});

app.listen(port, config.BACKEND_SERVER , () => {
    console.log(`Backend app is listening at http://${config.BACKEND_SERVER}:${port}. 
    Call http://${config.BACKEND_SERVER}:${port}/healthcheck to see 
    if we have established DB connectivity`);
});

