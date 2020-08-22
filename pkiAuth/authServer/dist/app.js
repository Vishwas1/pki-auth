"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var config_1 = require("./config");
var auth_1 = __importDefault(require("./routes/auth"));
var blog_1 = __importDefault(require("./routes/blog"));
var path_1 = __importDefault(require("path"));
var db_setup_1 = __importDefault(require("./setup/db.setup"));
var setupArgList = [{
        name: 'newdb',
        desc: 'It will delete the database (if exists) and recreate.'
    },
    {
        name: 'log',
        desc: 'Will just print hello!'
    }];
function setArgument() {
    switch (process.argv[2]) {
        case 'newdb': {
            var obj = setupArgList.find(function (x) { return x.name == 'newdb'; });
            if (obj) {
                config_1.logger.info("WARNING!!!!!!!");
                config_1.logger.info("-> " + obj.name + " : " + obj.desc + " I hope you know what you doing.");
                db_setup_1.default();
                return;
            }
            else {
                config_1.logger.error('No such argument exist. check list of argument by --help');
            }
        }
        case '--help': {
            config_1.logger.info("Argument list====================");
            setupArgList.forEach(function (e) {
                config_1.logger.info("-> " + e.name + " : " + e.desc);
            });
            config_1.logger.info("================================");
            return;
        }
        case undefined: {
            config_1.logger.info("No argument passed. Proceeding with default params");
            break;
        }
    }
}
setArgument();
var app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(cookie_parser_1.default());
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
app.use('/api/auth', auth_1.default);
app.use('/api/blog', blog_1.default);
app.get('/', function (req, res) { res.sendFile(path_1.default.join(__dirname, '/index.html')); });
app.listen(config_1.port, function () { return config_1.logger.info("The server is running on port " + config_1.port); });
