# Agenda

We basically want to have a single javascript files which will
full fill the following goals.

- Set couple of environment variables.
- Start the docker process
- The docker process must use the environment variables. We should not be able
to hard code the files again.

--

## Commands for docker images

`cd backend ; node init.js ; docker-compose build --no-cache ; docker-compose up`
