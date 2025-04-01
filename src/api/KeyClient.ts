import { useCallback, useMemo } from "react";
import { createApiFetch } from "../api/utils";

interface UseKeyClient {
  getServerKey: () => Promise<{ key: string }>;
}

export const useKeyClient = (): UseKeyClient => {
  const fetch = useMemo(() => createApiFetch(), []);

  const getServerKey = useCallback(async (): Promise<{ key: string }> => {
    const response = await fetch("publicKey", "GET");
    return response as { key: string };
  }, [fetch]);

  return { getServerKey };
};
