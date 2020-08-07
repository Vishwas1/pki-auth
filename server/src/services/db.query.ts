export const CREATE_USER_TABLE = "CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT, fname text, lname text, phoneNumber text, username text, password text, email text, publicKey text UNIQUE, privateKey text, CONSTRAINT publicKey_unique UNIQUE (publicKey))";
export const ADD_USER = "INSERT INTO User (fname, lname, phoneNumber, username, password, email, publicKey, privateKey) VALUES (?,?,?,?,?,?,?,?)";
export const GET_USER = "SELECT * FROM User";
export const DROP_USER_TABLE = "DROP TABLE User;"



