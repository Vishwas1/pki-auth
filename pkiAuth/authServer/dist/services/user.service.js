"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var db_service_1 = require("./db.service");
var lds_sdk_1 = require("lds-sdk");
var User = /** @class */ (function () {
    function User(_a) {
        var _b = _a.fname, fname = _b === void 0 ? "" : _b, _c = _a.lname, lname = _c === void 0 ? "" : _c, _d = _a.username, username = _d === void 0 ? "" : _d, _e = _a.phoneNumber, phoneNumber = _e === void 0 ? "" : _e, _f = _a.password, password = _f === void 0 ? "" : _f, _g = _a.email, email = _g === void 0 ? "" : _g, publicKey = _a.publicKey, _h = _a.privateKey, privateKey = _h === void 0 ? "" : _h, _j = _a.hash, hash = _j === void 0 ? "" : _j, _k = _a.birthdate, birthdate = _k === void 0 ? "" : _k, _l = _a.jobTitle, jobTitle = _l === void 0 ? "" : _l;
        this.id = lds_sdk_1.getChallange(); // new uuid
        this.fname = fname;
        this.lname = lname;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password; // HASH it first 
        this.email = email;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.hash = hash;
        this.birthdate = birthdate;
        this.jobTitle = jobTitle;
        this.dbSerice = new db_service_1.DBService();
    }
    User.prototype.toString = function (user) {
        return JSON.stringify(user);
    };
    User.prototype.create = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbSerice.add(db_service_1.SchemaType.User, this)];
                    case 1:
                        newUser = _a.sent();
                        return [2 /*return*/, this.toString(newUser)];
                }
            });
        });
    };
    User.prototype.fetch = function (ifPki) {
        if (ifPki === void 0) { ifPki = true; }
        return __awaiter(this, void 0, void 0, function () {
            var obj, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        obj = {};
                        if (ifPki) {
                            obj = { username: this.username, password: this.password, publicKey: this.publicKey };
                        }
                        else {
                            obj = { username: this.username, password: this.password };
                        }
                        return [4 /*yield*/, this.dbSerice.getOne(db_service_1.SchemaType.User, obj)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, this.toString(user)];
                }
            });
        });
    };
    return User;
}());
exports.User = User;
