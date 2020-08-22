"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.Router();
// This protected route
router.post('/create', auth_1.default, function (req, res) {
    res.status(200).send({
        status: 200,
        message: {
            m: "The blog post got created..",
            user: res.locals.data
        },
        error: null
    });
});
exports.default = router;
