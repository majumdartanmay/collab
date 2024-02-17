const config = require('./backend.json');
var cors = require('cors')
const express = require("express");
const mysql = require('mysql2/promise');
const app = express();
const bcrypt = require('bcryptjs');

const port = config.PORT;
const database = config.DB.database;
const tableName = config.DB.usertable;

app.use(express.json());

//Enable cors
app.use(cors({
    origin: 'http://localhost:10302'
}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.post("/room", async function (req, res, next) {
    try {
        await preparedQuery(`INSERT INTO ${database}.${tableName} (username, secret, roomId) VALUES (?, ?, ?)`,
            [req.body.username, await bcrypt.hash(req.body.pwd, config.SALT_LENGTH), req.body.roomId]);
        res.json({ "status": "OK" });
    } catch (err) {
        next(err);
    }
});

app.post("/login", async function (req, res, next) {
    try {
        const pwd = await getSecret(req.body.roomId);
        if (!pwd) {
            res.json({status: "NOT_FOUND", message: "User not found"});
            return;
        }

        const result = bcrypt.compareSync(req.body.pwd, pwd.secret);
        if (result) {
            res.json({ "status": "OK" });
            return;
        }
        res.json({status: "INVALID", message: "Password comparison failed"});
    } catch (err) {
        next(err);
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

app.get("/healthcheck", async(req, res, next) => {
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
