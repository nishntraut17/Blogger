"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        const newUser = new user_1.default({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        const user = yield newUser.save();
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).json("user not found");
            return;
        }
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(400).json("wrong password");
            return;
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id, name: user.name }, process.env.JWT_TOKEN);
        res.status(200).json(token);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
