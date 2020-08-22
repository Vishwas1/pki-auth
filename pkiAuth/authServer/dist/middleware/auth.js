"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = require("../config");
function verifyAuth(req, res, next) {
    var authToken = req.headers['x-auth-token'];
    if (authToken) {
        jsonwebtoken_1.default.verify(authToken, config_1.jwtSecret, function (err, data) {
            if (err)
                res.status(403).send({ status: 403, message: "Unauthorized.", error: null });
            res.locals.data = data;
            next();
        });
    }
    else {
        res.status(403).send({ status: 403, message: "Please send the x-auth-token in the header", error: null });
    }
}
exports.default = verifyAuth;
