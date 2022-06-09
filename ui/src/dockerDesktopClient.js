import { createDockerDesktopClient } from '@docker/extension-api-client';

const client = createDockerDesktopClient();

export function useDockerDesktopClient() {
    return client;
}
