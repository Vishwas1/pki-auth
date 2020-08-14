## Server

```bash
cd server
npm i
mv .env.sample .env // rename remove .sample from  .env.sample
npm run newdb // to setup database. Do not run this everytime.
npm run dev // finally run the server
```

The server runs on port `5000`. Please look into `.env` file to change paramaters. 

Other commands:

```bash
npm run build
npm run test
npm run start 
```

## APIs

- `api/auth/register`: To register a user
- `api/auth/login`: Tp authenticate a user
- `api/auth/verify`: Verifies the authToken passed in header for client
- `api/auth/challenge`: To get a new challenge
- `api/blog/created`: Protected with JSON web token

