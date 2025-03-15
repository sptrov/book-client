import { useContext } from "react";
import { ServerKeyContext } from "../main";
import { createApiFetch } from "../api/utils";
import type { BookResponse } from "../types/types";

interface UseBooksClient {
  createBook: (data: unknown) => Promise<BookResponse>;
  searchBooks: (query: string) => Promise<BookResponse>;
}

export const useBooksClient = (): UseBooksClient => {
  const { serverKey, publicKey } = useContext(ServerKeyContext);
  const fetch = createApiFetch();

  const createBook = async (data: unknown): Promise<BookResponse> => {
    return await fetch("books", "POST", "", data, serverKey, publicKey ?? "");
  };

  const searchBooks = async (query: string): Promise<BookResponse> => {
    return await fetch(
      "books",
      "GET",
      `?query=${query}`,
      undefined,
      serverKey,
      publicKey ?? ""
    );
  };

  return { createBook, searchBooks };
};
// import type { BookResponse } from "../types/types";
// import IBooksClient from "./IBooksClient";
// import { createApiFetch } from "./utils";

// export default class BooksClient implements IBooksClient {
//   private fetch: (
//     controller: string,
//     method: string,
//     queryParams?: string,
//     body?: unknown,
//     key?: string | null,
//     clientPublicKey?: string
//   ) => Promise<BookResponse>;
//   constructor() {
//     this.fetch = createApiFetch();
//   }

//   async createBook(
//     data: unknown,
//     key: string | null,
//     clientPublicKey: string
//   ): Promise<BookResponse> {
//     return await this.fetch("books", "POST", "", data, key, clientPublicKey);
//   }
//   async searchBooks(
//     query: string,
//     key: string | null,
//     clientPublicKey: string
//   ): Promise<BookResponse> {
//     return await this.fetch(
//       "books",
//       "GET",
//       `?query=${query}`,
//       undefined,
//       key,
//       clientPublicKey
//     );
//   }
// }
