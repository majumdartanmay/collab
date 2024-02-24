import config from './backend.json' assert { type: "json" };
import cors from 'cors'
import express from 'express'
import mysql from 'mysql2/promise' 
import bcrypt from 'bcryptjs'

const app = express();
const port = config.AUTH_PORT;
const database = config.DB.database;
const tableName = config.DB.usertable;

app.use(express.json());

//Enable cors
app.use(cors({
    origin: 'http://localhost:10302'
}));

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

    const connection = await mysql.createConnection({
        host: config.DB.service_name,
        user: config.DB.user,
        password: config.DB.password
    });

    return connection;
}

async function preparedQuery(sql, params = []) {
    const connection = await createConnection(); 
    await connection.query(sql, params);
    connection.end();
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
        const rows = await query(`SELECT * FROM ${config.DB.database}.${config.DB.health_table}`) || [];
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
