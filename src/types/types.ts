export interface IBook {
  title: string;
  author: string;
  publicationDate: Date;
  _id: string;
}

export interface BookResponse {
  error?: string;
  data?: unknown;
  encryptedData?: string;
  encryptedKey?: string;
  authTag?: string;
}
