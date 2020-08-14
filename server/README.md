## Server

```js
cd server
npm i
mv .env.sample .env // rename remove .sample from  .env.sample
npm run newdb // to setup database. Do not run this everytime. 
npm run dev
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

