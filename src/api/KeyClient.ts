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
