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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = __importDefault(require("crypto"));
dotenv_1.default.config();
const randomBytes = crypto_1.default.randomBytes(8).toString('hex');
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
    }
});
const app = (0, express_1.default)();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
app.post('/api/posts', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body", req.body);
    console.log("req.file", req.file);
    if (!req.file) {
        return res.status(400).send({ message: 'Please upload a file' });
    }
    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${randomBytes}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };
    const command = new client_s3_1.PutObjectCommand(params);
    yield s3.send(command);
    const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${params.Key}`;
    console.log("imageUrl", imageUrl);
    res.status(200).send({ message: 'File uploaded successfully', imageUrl });
}));
