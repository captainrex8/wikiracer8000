 FROM mhart/alpine-node:12.17.0 as base

# Install tools
# RUN apk update && apk add openssh

# Copy project and install packages
COPY . /wikiracer8000
WORKDIR /wikiracer8000
RUN yarn install --prod

# Initialize container
FROM mhart/alpine-node:12.17.0
COPY --from=base /wikiracer8000 /wikiracer8000
WORKDIR /wikiracer8000
CMD ["yarn", "start"]