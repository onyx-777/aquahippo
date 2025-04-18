"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bundler_webpack_1 = require("@payloadcms/bundler-webpack");
const db_mongodb_1 = require("@payloadcms/db-mongodb");
const richtext_slate_1 = require("@payloadcms/richtext-slate");
const path_1 = __importDefault(require("path"));
const config_1 = require("payload/config");
const User_1 = require("./collections/User");
const dotenv_1 = __importDefault(require("dotenv"));
const Products_1 = require("./collections/Products/Products");
const Media_1 = require("./collections/Media");
const ProductFiles_1 = require("./collections/ProductFiles");
const Orders_1 = require("./collections/Orders");
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../.env')
});
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
    collections: [User_1.Users, Products_1.Products, Media_1.Media, ProductFiles_1.ProductFiles, Orders_1.Orders],
    routes: {
        admin: '/sell'
    },
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
    },
    rateLimit: {
        max: 2000
    },
    editor: (0, richtext_slate_1.slateEditor)({}),
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    }
});
