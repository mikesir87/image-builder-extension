# Image Builder Extension

This repo provides a PoC of an extension that provides the ability to create a container image graphically.

## Installing

If you wish to try out the latest version of the extension, you can run:

```
docker extension install mikesir87/image-builder-extension
```

If you wish to build and use the latest version yourself, you can run `make install-extension`.

## Example/Demo App

To help with demos for the extension, we've included a simple Node app in the `example-app` directory. With this, you can open the extension and do the following:

1. Use a Node base image (such as `node:lts-alpine`)
1. Select the `example-app` directory as the host directory
1. Create a new `/app` directory in your new container
1. Copy the `package.json` and `yarn.lock` files into the container
1. Run `yarn install` to install all of the app dependencies
1. Copy the `src` directory into the container

Snag your Dockerfile and you're good to go! Eventually, we can provide the ability to save the Dockerfile or build the image. But, we're not there yet.

## Development

You can simply run `make dev-up`, which will do the following:

1. Builds and installs the extension.
1. Starts a container that runs React in dev mode (documented in `docker-compose.yaml`).
1. Configures the extension to enable both the dev tools and use the React container as the UI source.

When you're done, simply run `make dev-down`.
