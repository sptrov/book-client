# Books Client

This project is a React application built with TypeScript and Vite. It includes features for searching and adding books, with encryption and decryption of data using RSA and AES algorithms.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have a running backend server that provides the necessary API endpoints.

## Installation

1. Clone the repository:

```bash
cd books-client
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173` to see the application running.

## Building for Production

To create a production build of the application, run:

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

- `src/`: Contains the source code of the application.
  - `api/`: Contains API client hooks and utility functions.
  - `components/`: Contains React components.
  - `hooks/`: Contains custom hooks.
  - `utils/`: Contains utility functions for encryption and decryption.
  - `App.tsx`: The main application component.
  - `main.tsx`: The entry point of the application.

## Key Features

- **Book Search**: Search for books using the `BookSearch` component.Data is encrypted on the server and here on the client an encrypted array json is received and being decrypted with RSA + AES to be able to visualize
- **Add Book**: Add new books using the `BookForm` component.Before sending the book data is encrypted with the server public key and since the data is not too big only RSA encryption is used
- **Encryption/Decryption**: when starting the React app a private and public keys are generated and passed down through Context api and also a request for the server public key is done and also provided through the context api.

## Environment Variables

config/config.ts is already provided with a single configuration of the BE host already configured to

```
HOST=http://localhost:3000
```
