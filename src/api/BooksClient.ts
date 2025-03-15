import { useContext, useCallback, useMemo } from "react";
import { ServerKeyContext } from "../main";
import { createApiFetch } from "../api/utils";
import type { BookResponse } from "../types/types";

interface UseBooksClient {
  createBook: (data: unknown) => Promise<BookResponse>;
  searchBooks: (query: string) => Promise<BookResponse>;
}

export const useBooksClient = (): UseBooksClient => {
  const { serverKey, publicKey } = useContext(ServerKeyContext);
  const fetch = useMemo(() => createApiFetch(), []);

  const createBook = useCallback(
    async (data: unknown): Promise<BookResponse> => {
      return await fetch("books", "POST", "", data, serverKey, publicKey ?? "");
    },
    [serverKey, publicKey, fetch]
  );

  const searchBooks = useCallback(
    async (query: string): Promise<BookResponse> => {
      return await fetch(
        "books",
        "GET",
        `?query=${query}`,
        undefined,
        serverKey,
        publicKey ?? ""
      );
    },
    [serverKey, publicKey, fetch]
  );

  return { createBook, searchBooks };
};
