import {
  StrictMode,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { useKeyClient } from "./api/KeyClient.ts";

// Create a context for the server key
const ServerKeyContext = createContext<{
  publicKey?: string;
  privateKey?: string;
  serverKey: string;
}>({
  serverKey: "",
});

import { generateKeyPairs } from "./utils/utils.ts";

const ServerKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serverKey, setServerKey] = useState<string>("");
  const [clientKeyPair, setClientKeyPair] = useState<{
    publicKey: string;
    privateKey: string;
  }>();
  const { getServerKey } = useKeyClient();

  useEffect(() => {
    const fetchServerKey = async () => {
      try {
        const response = await getServerKey();
        setServerKey(response.key);
      } catch (error) {
        console.error("Failed to fetch server key:", error);
      }
    };
    const generateClientKeys = async () => {
      const keyPairs = await generateKeyPairs();

      setClientKeyPair(keyPairs);
    };

    fetchServerKey();
    generateClientKeys();
  }, [getServerKey]);

  return (
    <ServerKeyContext.Provider value={{ serverKey, ...clientKeyPair }}>
      {children}
    </ServerKeyContext.Provider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ServerKeyProvider>
      <App />
    </ServerKeyProvider>
  </StrictMode>
);

export { ServerKeyContext };
