"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    mode: process.env.MODE || 'development',
    devPort: process.env.DEV_PORT || 3001,
    prodPort: process.env.PRO_PORT || 444,
    domain: process.env.DOMAIN || 'localhost',
};
