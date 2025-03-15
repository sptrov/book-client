// import { createApiFetch } from "./utils";

// export default class KeyClient {
//   private fetch: (
//     controller: string,
//     method: string,
//     queryParams?: string,
//     body?: unknown
//   ) => Promise<unknown>;
//   constructor() {
//     this.fetch = createApiFetch();
//   }

//   async getServerKey(): Promise<{ key: string }> {
//     const response = await this.fetch("publicKey", "GET");
//     return response as { key: string };
//   }
// }
import { createApiFetch } from "../api/utils";

interface UseKeyClient {
  getServerKey: () => Promise<{ key: string }>;
}

export const useKeyClient = (): UseKeyClient => {
  const fetch = createApiFetch();

  const getServerKey = async (): Promise<{ key: string }> => {
    const response = await fetch("publicKey", "GET");
    return response as { key: string };
  };

  return { getServerKey };
};
