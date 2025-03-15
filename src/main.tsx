import { StrictMode, createContext, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { useKeyClient } from "./api/KeyClient.ts";

// Create a context for the server key
const ServerKeyContext = createContext<{
  publicKey?: string | undefined;
  privateKey?: string | undefined;
  serverKey: string;
}>({
  serverKey: "",
});

import { ReactNode } from "react";
import { generateKeyPairs } from "./utils/utils.ts";

const ServerKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serverKey, setServerKey] = useState<string>("");
  const [clientKeyPair, setClientKeyPair] = useState<{
    publicKey: string;
    privateKey: string;
  }>();
  const client = useKeyClient();

  useEffect(() => {
    const fetchServerKey = async () => {
      try {
        const response = await client.getServerKey();
        console.log("Fetched server key:", response.key);
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
  }, []);

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
