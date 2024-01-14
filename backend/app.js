const config = require('./backend.json');
const express = require("express");
const mysql = require('mysql2/promise');
const app = express();
const bcrypt = require('bcryptjs');

const port = config.PORT;
const database = config.DB.database;
const tableName = config.DB.usertable;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.get("/users", async function (req, res, next) {
    const rows = await query(`SELECT * FROM ${database}.${tableName}`) || [];
    res.json(rows);
});

app.post("/user", async function (req, res, next) {
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
        const pwd = await getSecret(req.body.username, req.body,roomId);
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
    const connection = await mysql.createConnection({
        host: config.DB.service_name,
        user: config.DB.user,
        password: config.DB.password
    });
    const [results,] = await connection.execute(sql, params);
    connection.end();
    return results;
}

async function preparedQuery(sql, params = []) {
    const connection = await mysql.createConnection(config.DB);
    await connection.query(sql, params);
    connection.end();
}

async function getSecret(user, roomId) {
    const connection = await mysql.createConnection(config.DB);
    const [results, ] = await connection.execute(`SELECT secret FROM ${database}.${tableName} WHERE username = ? and roomId  = ?`, [user, roomId]);
    if (!results) {
        return null;
    }
    const pwd = results[0];
    return pwd;
}

app.get("/healthcheck", (req, res, next) => {
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
