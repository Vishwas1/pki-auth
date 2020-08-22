"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var sqlite3_1 = __importDefault(require("sqlite3"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var log = require('simple-node-logger');
dotenv_1.default.config();
var log_dir = path_1.default.resolve(__dirname, '../log');
var db_dir = path_1.default.resolve(__dirname, '../db');
if (!fs_1.default.existsSync(log_dir))
    fs_1.default.mkdirSync(log_dir);
if (!fs_1.default.existsSync(db_dir))
    fs_1.default.mkdirSync(db_dir);
// LOGGING
var log_path = path_1.default.resolve(__dirname, process.env.LOG_FILEPATH || 'ssi-infra.log');
var logger = log.createSimpleLogger({
    logFilePath: log_path,
    timestampFormat: process.env.LOG_TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss.SSS'
});
exports.logger = logger;
logger.setLevel(process.env.LOG_LEVEL || 'info');
var port = process.env.PORT || 5000;
exports.port = port;
// DATABASE
// Ref: https://www.sqlitetutorial.net/sqlite-nodejs/
var db_file_path = process.env.DATABASE_FILEPATH || 'ssi.db';
var db_path = path_1.default.resolve(__dirname, db_file_path);
var db = new sqlite3_1.default.Database(db_path, function (err) {
    if (err) {
        logger.error("SQLite db error:  " + err.message);
    }
    else {
        logger.info("Connected to ssi-infa database. DB path = " + db_path);
    }
});
exports.db = db;
// DID Related
var did = {
    sheme: process.env.DID_SCHEME || 'did',
    method: process.env.DID_METHOD_NAME || 'hypersign',
};
exports.did = did;
var jwtSecret = process.env.JWT_SECRET || 'secretKey';
exports.jwtSecret = jwtSecret;
