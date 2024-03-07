"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileStream = exports.uploadFile = void 0;
require('dotenv').config();
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const fs_1 = __importDefault(require("fs"));
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_S3_REGION;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET_KEY;
const s3 = new s3_1.default({
    region,
    accessKeyId,
    secretAccessKey,
});
function uploadFile(file) {
    const fileStream = fs_1.default.createReadStream(file.path);
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // Add this line
    if (!bucketName) {
        throw new Error('AWS S3 bucket name is not defined.');
    }
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;
function getFileStream(fileKey) {
    const bucketName = process.env.AWS_S3_BUCKET_NAME; // Add this line
    if (!bucketName) {
        throw new Error('AWS S3 bucket name is not defined.');
    }
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };
    return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
