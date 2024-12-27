# Introduction

This is light weight realtime text collabation tool. It has the following key components

1. [YJS](https://docs.yjs.dev/) for [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
2. [Monaco](https://microsoft.github.io/monaco-editor/) for editor
3. [WebRTC](https://webrtc.org/) as communication protocol
4. [Node](https://nodejs.org/en) Node js for signalling server and authentication server
5. [SQLite](https://www.sqlite.org/) SQLite DB to store user credentials and room metadata

![User flow](/screenshots/BasicCollabUserFlow.gif)

----

# Build 
## Requirements

- node v23.4.0
- npm 11.0.0

## Building the full application

These commands will start the front-end service as well as the backend service

```bash
npm install
cd backend 
npm install
cd ..
npm run all
```

## Starting just the backend 

The backend has mainly 2 components. Signalling server, authentication server. The below steps will start both the signalling server and the auth server.

```bash
cd backend
npm install
npm start
```

### Configuring the authentication backend server

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

** This is optional, if you are happy with the default values **

To configure the details of the SQLite DB that will be created go to [db.json](/backend/db.json) and configure the listed details

```json
{
    "usertable": "users",
    "host": "localhost",
    "user": "collab_user",
    "database": "collab",
    "health_table": "collab_health_table"
}
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
