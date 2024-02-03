# Introduction
This is light weight realtime text collabation tool. It has the following key components

1. [YJS](https://docs.yjs.dev/) for [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type)
2. [Monaco](https://microsoft.github.io/monaco-editor/) for editor
3. [WebRTC](https://webrtc.org/) as communication protocol
----

# Build 
## Requirements

- node v18.0.0
- npm 9.8.1

## Starting the backend

This editor needs a [signalling server](https://www.wowza.com/blog/webrtc-signaling-servers). We will explain how to start the server.

Go to [config.json](/backend/config.json) and edit the SERVER_URL to the IP address of the machine where you will be running the server. You can choose to change the SIGNALLING PORT if you want.

We need to start the signalling server

```
npm install
cd backend
node server.js
```

## Starting frontend
```
npm run dev
```
## Deployment frontend
If after compilation you want to run on production mode in local. Then run the following commands

```
npm run build
npm run preview
```

## Run unit tests

[![Collab Unit Tests](https://github.com/majumdartanmay/collab/actions/workflows/UnitTests.yml/badge.svg?branch=feature%2F1-add-password-protection-in-individual-rooms)](https://github.com/majumdartanmay/collab/actions/workflows/UnitTests.yml)

Unit tests have been created using [jest](https://jestjs.io/docs/tutorial-react)

```
npm run test
```
