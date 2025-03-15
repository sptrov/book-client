export default {
  dev: {
    HOST: "http://localhost:3000",
  },
  prod: {
    HOST: "https://production.com",
  },
  environment: "dev",
};

export type ConfigType = {
  dev: { HOST: string };
  prod: { HOST: string };
  environment: "dev" | "prod";
};
