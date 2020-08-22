"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var user_service_1 = require("../services/user.service");
var config_1 = require("../config");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var lds_sdk_1 = require("lds-sdk");
var sha256hashStr = require('../../../client/src/crypto-lib/symmetric.js').sha256hashStr;
var check = function (req, res) {
    var param = {
        chJWT: "chJWT",
        challenge: "challenge",
        domain: "pkiAuth.com",
        redirect_uri: "redirect_uri"
    };
    var query = "?";
    Object.keys(param).forEach(function (k) {
        query += k + "=" + param[k] + "&";
    });
    query = query.slice(0, query.length - 1);
    res.redirect("http://localhost:8080/login" + query);
};
var register = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var body, user, userindbstr, createdU, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                config_1.logger.debug(req.body);
                body = req.body;
                user = new user_service_1.User(__assign({}, body));
                return [4 /*yield*/, user.fetch()];
            case 1:
                userindbstr = _a.sent();
                if (userindbstr)
                    throw new Error("User " + user.publicKey + " already exists");
                return [4 /*yield*/, user.create()];
            case 2:
                createdU = _a.sent();
                res.status(200).send({ status: 200, message: createdU, error: null });
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                res.status(500).send({ status: 500, message: null, error: e_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var login = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var challengeExtractedFromChToken, loginType, x, userInDb, userData_1, _a, username, password, proof, controller, challenge, publicKey, domain, userObj, userindbstr, res_1, userObj, userindbstr, generatedHash, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                challengeExtractedFromChToken = res.locals.data ? res.locals.data.challenge : "";
                console.log(challengeExtractedFromChToken);
                loginType = req.query.type;
                x = {};
                userInDb = {};
                userData_1 = {};
                _a = req.body, username = _a.username, password = _a.password, proof = _a.proof, controller = _a.controller, challenge = _a.challenge, publicKey = _a.publicKey, domain = _a.domain;
                if (!!loginType) return [3 /*break*/, 2];
                if (!password || !username)
                    throw new Error('PublicKey or password or username is empty');
                x = { password: password, username: username };
                userObj = new user_service_1.User(x);
                return [4 /*yield*/, userObj.fetch(false)];
            case 1:
                userindbstr = _b.sent();
                if (!userindbstr)
                    throw new Error("Invalid user. Please register to login");
                userInDb = JSON.parse(userindbstr);
                if ((userInDb.username != username) && (userInDb.password != password))
                    throw new Error("Unauthorized: Username or password mismatch");
                userData_1 = userInDb;
                _b.label = 2;
            case 2:
                if (!(loginType == 'PKI')) return [3 /*break*/, 6];
                if (!proof || !controller || !publicKey || !domain)
                    throw new Error('proof, controller, publicKey, challenge, domain is empty');
                proof = JSON.parse(proof);
                config_1.logger.debug("Before verifying the proof, ch = " + challengeExtractedFromChToken);
                return [4 /*yield*/, lds_sdk_1.verify({ doc: proof, publicKey: publicKey, challenge: challengeExtractedFromChToken, domain: domain, controller: controller })];
            case 3:
                res_1 = _b.sent();
                config_1.logger.debug("After verifying the proof, res = " + JSON.stringify(res_1));
                if (!(res_1.verified == true)) return [3 /*break*/, 5];
                config_1.logger.debug('Proof verified');
                delete proof['proof'];
                userObj = new user_service_1.User(__assign({}, proof, { fname: proof.name, publicKey: publicKey.publicKeyBase58 }));
                return [4 /*yield*/, userObj.fetch()];
            case 4:
                userindbstr = _b.sent();
                if (!userindbstr)
                    throw new Error("Invalid user. Please register to login");
                userInDb = JSON.parse(userindbstr);
                generatedHash = sha256hashStr(JSON.stringify(proof));
                if (generatedHash != userInDb.hash)
                    throw new Error("Unauthorized: User's hash did not match.");
                userData_1 = proof;
                return [3 /*break*/, 6];
            case 5:
                config_1.logger.debug('Proof could not verified');
                throw new Error("Unauthorized: Proof can not be verified!");
            case 6:
                // Generating Authorization token
                jsonwebtoken_1.default.sign(userData_1, config_1.jwtSecret, { expiresIn: '30s' }, function (err, token) {
                    if (err)
                        throw new Error(err);
                    res.status(200).send({ status: 200, message: {
                            m: "Sussfully loggedIn",
                            jwtToken: token,
                            user: userData_1
                        }, error: null });
                });
                return [3 /*break*/, 8];
            case 7:
                e_2 = _b.sent();
                res.status(500).send({ status: 500, message: null, error: e_2.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var recover = function (req, res) {
    config_1.logger.debug('Recover ap called');
    res.send('Recover ap called!');
};
var getNewChallenge = function (req, res) {
    var challenge = lds_sdk_1.getChallange();
    jsonwebtoken_1.default.sign({ challenge: challenge }, config_1.jwtSecret, { expiresIn: '30s' }, function (err, token) {
        if (err)
            throw new Error(err);
        res.status(200).send({ status: 200, message: {
                JWTChallenge: token,
                challenge: challenge
            }, error: null });
    });
    // res.status(200).send({ status: 200, message: getChallange() });
};
exports.default = {
    check: check,
    register: register,
    login: login,
    recover: recover,
    getNewChallenge: getNewChallenge
};
