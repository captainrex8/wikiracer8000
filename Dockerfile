 FROM mhart/alpine-node:12.17.0 as base

# Install tools
RUN apk update && apk add openssh && apk add --no-cache git

# Copy project and install packages
COPY . /app
WORKDIR /app
RUN yarn install --prod

# Initialize container
FROM mhart/alpine-node:12.17.0
COPY --from=base /app /app
WORKDIR /app
CMD ["yarn", "start"] 