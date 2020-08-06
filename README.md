## JWT Demo

## Install

```js
npm i
npm run dev
npm run build
npm run test
npm run start // prod

```

## APIs

### Register

Endpoint:

```
POST: localhost:5000/api/auth/register
```
Request:

```json
{
        "fname": "Amit",
        "lname": "lumar",
        "username": "vishwas1212",
        "password": "password",
        "email": "vishu.anand1@gmail.com",
        "phoneNumber": "a12123123",
        "publicKey": "ak_2aYCwWQMVZA7sCoNbYrkrpZVVJ9wQJ5",
        "privateKey": "54b391778f0580b116d658558371be04b85396246476e4a73451ca0d093f1dd6cfd92a2e1b36111c3dfd76a3b87185e5dec3695dd7da83263141e0a0822b94e9"
}
```
Response:

```json
{
    "status": 200,
    "message": "{\"id\":3,\"fname\":\"Amit\",\"lname\":\"lumar\",\"phoneNumber\":\"a12123123\",\"username\":\"vishwas1212\",\"password\":\"password\",\"email\":\"vishu.anand1@gmail.com\",\"publicKey\":\"ak_2aYCwWQMVZA7sCoNbYrkrpZVVJ9wQJ5\",\"privateKey\":\"54b391778f0580b116d658558371be04b85396246476e4a73451ca0d093f1dd6cfd92a2e1b36111c3dfd76a3b87185e5dec3695dd7da83263141e0a0822b94e9\"}",
    "error": null
}
```

### Login



Endpoint:

```
POST: localhost:5000/api/auth/login
```
Request:

```json
{
    "username": "vishwas1212",
    "password": "password",
    "publicKey": "ak_2aYCwWQMVZA7sCoNbYrkrpZVVJ9wQJ5"
}
```
Response:

```json
{
    "status": 200,
    "message": "Sussfully loggedIn",
    "error": null
}
```