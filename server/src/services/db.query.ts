export const CREATE_USER_TABLE = "CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, fname text, lname text, phoneNumber text, username text, password text, email text, publicKey text, hash text, birthdate text, jobTitle text)";
export const ADD_USER = "INSERT INTO User (fname, lname, phoneNumber, username, password, email, publicKey, hash, birthdate, jobTitle) VALUES (?,?,?,?,?,?,?,?,?,?)";
export const GET_USER = "SELECT * FROM User";
export const DROP_USER_TABLE = "DROP TABLE User;"



