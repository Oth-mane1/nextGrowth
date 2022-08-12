import productRouter from "./productRoute.js";
import express from "express";

const appRouter = express.Router();

// Deny access for unauthenticated request
appRouter.use((req, res, next) => {
    const autHeader = req.headers?.authorization || null;
    if (autHeader && autHeader == process.env.APIKEY) {
        return next()
    }

    return res.status(401).json({
        message: 'Unauthorized! Api key provided is either null or incorrect.'
    });
})

appRouter.use('/product', productRouter)

export default appRouter