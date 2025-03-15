export async function encryptData(base64PublicKey: string, data: unknown) {
  try {
    const binaryBuffer = Uint8Array.from(atob(base64PublicKey), (c) =>
      c.charCodeAt(0)
    ).buffer;

    const publicKey = await window.crypto.subtle.importKey(
      "spki",
      binaryBuffer,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encodedData
    );

    const encryptedBase64 = btoa(
      String.fromCharCode(...new Uint8Array(encryptedBuffer))
    );

    return encryptedBase64;
  } catch (error) {
    console.error("Encryption Error:", error);
  }
}

export async function decryptData(
  encryptedBase64Data: string,
  base64PrivateKey: string,
  encryptedKey?: string,
  authTagBase64?: string
) {
  try {
    const binaryPrivateKey = Uint8Array.from(atob(base64PrivateKey), (c) =>
      c.charCodeAt(0)
    ).buffer;

    const clientPrivateKey = await window.crypto.subtle.importKey(
      "pkcs8",
      binaryPrivateKey,
      { name: "RSA-OAEP", hash: "SHA-256" },
      true,
      ["decrypt"]
    );

    //NEW CODE for encrypt large data
    if (encryptedKey) {
      const authTag = Uint8Array.from(atob(authTagBase64 ?? ""), (c) =>
        c.charCodeAt(0)
      );
      const encryptedBufferAES = Uint8Array.from(atob(encryptedKey), (c) =>
        c.charCodeAt(0)
      ).buffer;
      const decryptedBufferAES = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        clientPrivateKey,
        encryptedBufferAES
      );

      const aesKey = decryptedBufferAES.slice(0, 32);
      const iv = decryptedBufferAES.slice(32, 44); // 12 for AES-GCM

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        aesKey,
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const encryptedBuffer = Uint8Array.from(atob(encryptedBase64Data), (c) =>
        c.charCodeAt(0)
      );

      const fullEncryptedData = new Uint8Array([
        ...encryptedBuffer,
        ...authTag,
      ]);

      const decryptedData = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv,
          additionalData: new Uint8Array(),
          tagLength: 128,
        },
        cryptoKey,
        fullEncryptedData
      );

      const decryptedText = new TextDecoder().decode(decryptedData);

      return JSON.parse(decryptedText);
    }

    // // ✅ Convert Base64 string to ArrayBuffer
    // const encryptedBuffer = Uint8Array.from(atob(encryptedBase64Data), (c) =>
    //   c.charCodeAt(0)
    // ).buffer;

    // // ✅ Decrypt the data using the client's private key
    // const decryptedBuffer = await window.crypto.subtle.decrypt(
    //   { name: "RSA-OAEP" },
    //   clientPrivateKey, // Client's private key
    //   encryptedBuffer
    // );

    // // ✅ Convert decrypted ArrayBuffer back to a UTF-8 string
    // const decryptedText = new TextDecoder().decode(decryptedBuffer);

    // // ✅ Parse JSON data
    // return JSON.parse(decryptedText);
  } catch (error) {
    console.error("❌ Decryption Error:", error);
    throw new Error("Failed to decrypt data.");
  }
}

export async function generateKeyPairs() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exportedPublicKey = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const exportedPrivateKey = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const clientKeyPair = {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey))),
    privateKey: btoa(
      String.fromCharCode(...new Uint8Array(exportedPrivateKey))
    ),
  };

  return clientKeyPair;
}
