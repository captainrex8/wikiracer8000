# WikiRacer 8000

Wikiracer takes a starting page and an end page (as either a URL or a page title) and successfully figure out how to traverse from one to the other (or tell the user if there isn’t a path). The output would be a list of pages on the path, as well as the total elapsed time to run.

## High-level architecture overview


## What the code does


## Instructions for how to run your Wikiracer

To start, obtain the source code from the following repository through git clone:

`git clone https://github.com/captainrex8/wikiracer8000.git`

Makre sure you have docker, docker-compose and make. Here are some make commands:

`make test`

This will build and launch the docker container to run the jest unit tests

`make stop`

This will stop the docker container using docker-compose down

`make run`

This will run the docket container using docker-compose up

`make brun`

This will build the docker container with the main application and then run the docket container using docker-compose up

By default, the running application should be accessible through port 8089 on localhost.


## Strategies you tried


## How long you spent on each part of the project
