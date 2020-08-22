"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = __importDefault(require("../controllers/auth"));
var auth_2 = __importDefault(require("../middleware/auth"));
var router = express_1.Router();
router.get('/', auth_1.default.check);
router.post('/register', auth_1.default.register);
router.post('/login', auth_1.default.login);
router.post('/login_pki', auth_2.default, auth_1.default.login);
router.post('/recover', auth_1.default.recover);
router.get('/challenge', auth_1.default.getNewChallenge);
router.post('/verify', auth_2.default, function (req, res) {
    res.status(200).send({
        status: 200,
        message: {
            m: "The token is verified",
            user: res.locals.data
        },
        error: null
    });
});
exports.default = router;
