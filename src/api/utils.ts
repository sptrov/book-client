import config, { ConfigType } from "../config/config";

import { encryptData } from "../utils/utils";

export const createApiFetch =
  () =>
  async (
    controller: string,
    method: string,
    queryParams?: string,
    body?: unknown,
    key?: string | null,
    publicClientKey?: string
  ) => {
    // if we have a public server key and body, encrypt the body for each request
    if (key && body) {
      body = await encryptData(key, body);
    }
    const hostConfig = config[config.environment as keyof ConfigType];
    const host = typeof hostConfig === "string" ? hostConfig : hostConfig.HOST;

    const headers = {
      "Content-Type": "application/json",
      "x-public-client-key": publicClientKey || "",
    };

    const url = queryParams
      ? `${host}/${controller}/${queryParams}`
      : `${host}/${controller}`;

    const options: RequestInit = {
      method,
      headers,
    };
    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify({
        encrypted: body,
      });
    }

    const response = await fetch(url, options);

    if (response.json) {
      return await response.json();
    }
  };
