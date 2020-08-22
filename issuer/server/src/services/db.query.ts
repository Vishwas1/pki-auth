export const CREATE_USER_TABLE = "CREATE TABLE User (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, fname text, lname text, phoneNumber text, username text, password text, email text, publicKey text, hash text, birthdate text, jobTitle text)";
export const ADD_USER = "INSERT INTO User (fname, lname, phoneNumber, username, password, email, publicKey, hash, birthdate, jobTitle) VALUES (?,?,?,?,?,?,?,?,?,?)";
export const GET_USER = "SELECT * FROM User";
export const DROP_USER_TABLE = "DROP TABLE User;"

export const CREATE_APPLICATION_TABLE = "CREATE TABLE Application (appId text PRIMARY KEY UNIQUE, appSecret text, isActive INTEGER)"
export const INSERT_APPLICATION = "INSERT INTO Application (appId, appSecret, isActive) VALUES (?,?,?)";
export const GET_APPLICATION = "SELECT * from Application";
export const DROP_APPLICATION_TABLE = "DROP TABLE Application";



