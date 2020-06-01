# WikiRacer 8000

Wikiracer takes a starting page and an end page (as a page title) and successfully figure out how to traverse from one to the other (or tell the user if there isn’t a path). The output would be a list of pages on the path, as well as the total elapsed time to run.

## High-level architecture overview


## What the code does


## Instructions for how to run your Wikiracer

To start, obtain the source code from the following repository through git clone:

`git clone https://github.com/captainrex8/wikiracer8000.git`

Make sure you have *docker*, *docker-compose* and *make*.

### Sanity check

The first step is to run the tests by running `make test`. This will build the test container and run the unit tests.

Then you could launch the application container by running `make build-run`.

Once you have the main application container up and running. You could check to see if the application is running by making a call to the ping endpoint using the following curl command:

```
curl --header "Content-Type: application/json" \
  --request GET \
  http://localhost:8089/api/v1/ping
```

If the application is running successfully, you should get a json response like this: `{"data":{"message":"I am still alive!"}}`

Unfortunately, I did not have time to build a UI to interact with the primary race API. I'd recommend using [Postman](https://www.postman.com/downloads/) for interactions with the wikiracer api endpoints. If not, the following curl command would initiate the search from Giant sloth to Sloth:

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"from":"Giant sloth","to":"Sloth"}' \
  http://localhost:8089/api/v1/race
```

You should get the follwoing response given the wiki pages hasn't changed much: `{"data":{"fromTitle":"Giant sloth","toTitle":"Sloth","path":["Giant sloth","Ground sloth","Sloth"]}}`

### A little bit more info on ...

#### Client side

Now you've completed the application start up sanity check. You could start racing by changing the POST body and send it to the `race` end point. There are just 2 required parameters:

```
{
    "from": "starting title",
    "to": "destionation title"
}
```

`from` represents the wiki title you would like to start racing from and `to` represents the wiki title you would like the race to end at. Here's the Giant sloth to Sloth example using Postman:

![Postman](docs/postman1.png)

#### Server side

At the same time, you could check the running container for log outputs. Here's the container log output from the Giant sloth to Sloth example:

![Docker](docs/docker1.png)

In the above example, the first 2 log entries prefixed with info are from application start up.

The more relevant log entries are the last two lines. These are race progress logs. They have structure like this:

`[log level]: [searchId] [parent] -> [current title] | [duration] | [search queue items]`

`log level` - For race progress logs, these will always be info.

`searchId` - The id for a particular linked titles search.

`parent` - The parent title where the current title search originates from.

`duration` - Duration of the current title search. This contains the time to check if current title is directly linked with the destionation. Plus, if needed, the time to retrieve more linked titles for further searches.

`search queue items` - The number of pending title searches yet to be performed.


## References

*make* commands:

`make test` - This will build and launch the docker container to run the jest unit tests

`make run` - This will run the docket container using docker-compose up

`make build-run` - This will build the docker container with the main application and then run the docket container using docker-compose up. By default, the running application should be accessible through port 8089 on localhost.

`make stop` - This will stop the docker container using docker-compose down

*yarn/npm* script targets:

`yarn start` - This will start the application on your host machine

`yarn lint` - This will check your code style against ESLint rules

`yarn test` - This will check code style first and then run unit tests with code coverage report

## Strategies you tried



## How long you spent on each part of the project
