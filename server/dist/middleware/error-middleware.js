"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const extraDetails = err.extraDetails || '';
    res.status(500).send({ message, extraDetails });
};
exports.default = errorMiddleware;
