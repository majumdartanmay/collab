# Introduction

This is light weight realtime text collabation tool. It has the following key components

1. [YJS](https://docs.yjs.dev/) for [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
2. [Monaco](https://microsoft.github.io/monaco-editor/) for editor
3. [WebRTC](https://webrtc.org/) as communication protocol
4. [Node](https://nodejs.org/en) Node js for signalling server and authentication server
5. [MySQL](https://www.mysql.com/) MySQL database to store room passwords and room creator information

![User flow](/screenshots/BasicCollabUserFlow.gif)

----

# Build 
## Requirements

- node v18.0.0
- npm 9.8.1

## Starting the backend

### Quick start with docker

The backend has mainly 3 components. Signalling server, authentication server and a  MySQL database

`cd backend; node init.js ; docker-compose build --no-cache ; docker-compose up`

This wil start the MySQL database, signalling server and auth server with the default values which are present in [backend.json](/backend/backend.json)

### Signalling server

This editor needs a [signalling server](https://www.wowza.com/blog/webrtc-signaling-servers). We will explain how to start the server.

Go to [backend.json](/backend/backend.json) and edit the SIGNALLING_SERVER to the IP address of the machine where you will be running the server. You can choose to change the SIGNALLING PORT if you want.

We need to start the signalling server

```
cd backend
npm install
node server.js
```

### Start the user authentication backend server

Anyone who creates a new room is known as the admin of that room. Admins get to set the password of their room. This record of room, admin, password is stored in a MySQL database. The APIs to store and verify this information are present in [app.js](/backend/app.js) . Without this node service, the room creation and password verification will fail. 

To configure the details of this server go to [backend.json](/backend/backend.json) and configure the listed details

```json
{
    "AUTH_PORT": 24555,
    "BACKEND_URL_SCHEME": "http",
    "SALT_LENGTH": 7,
    "SIGNALLING_PORT": 24444,
    "SIGNALLING_SERVER": "0.0.0.0",
    "BACKEND_SERVER": "0.0.0.0", 
    "CLIENT": {
        "SIGNALLING_SERVER": "localhost",
        "BACKEND_SERVER": "localhost" 
    }
}

```

These properties are relevant for the authentication service. App.js will run in the AUTH_PORT.

### Configuring DB details

To configure the details of this server go to [db.json](/backend/db.json) and configure the listed details

```json
{
    "usertable": "users",
    "service_name": "mysql_service",
    "host": "localhost",
    "user": "collab_user",
    "password": "Collab_11122023",
    "database": "collab",
    "port": 21992,
    "connectTimeout": 60000,
    "root_password": "MySQLRootPassword",
    "health_table": "collab_health_table"
}
```

### Create the collab database in MySQL

You can run the DDL and DML scripts which we have added in [schema-template.sql](/backend/schema-template.sql)

```
cd backend && npm install
npm install
node app.js
```

## Starting frontend
```bash
npm install
npm run dev
```
## Deployment frontend
If after compilation you want to run on production mode in local. Then run the following commands

```
npm install
npm run build
npm run preview
```

## Run unit tests

[![Collab Unit Tests](https://github.com/majumdartanmay/collab/actions/workflows/UnitTests.yml/badge.svg)](https://github.com/majumdartanmay/collab/actions/workflows/UnitTests.yml)

Unit tests have been created using [jest](https://jestjs.io/docs/tutorial-react)

```
npm install
npm run test
```
