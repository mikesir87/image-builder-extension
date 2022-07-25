# Image Builder Extension

This repo provides a PoC of an extension that provides the ability to create a container image graphically.

## Installing

If you wish to try out the latest version of the extension, you can run:

```
docker extension install mikesir87/image-builder-extension
```

If you wish to build and use the latest version yourself, you can run `make install-extension`.


## Development

You can simply run `make dev-up`, which will do the following:

1. Builds and installs the extension.
1. Starts a container that runs React in dev mode (documented in `docker-compose.yaml`).
1. Configures the extension to enable both the dev tools and use the React container as the UI source.

When you're done, simply run `make dev-down`.
