import express from "express";
import { Secret_EncryptKey } from "../constants/encrypt.js";
import { logError, logRequest } from "../utils/logger.js";
import { execute } from "../utils/converter.js";

const router = express.Router();

router.get("", async (req, res) => {
    try {
        const query = req.query;
        const data = query.data;

        logRequest(req);

        if (typeof data !== "string") {
            res.status(200).json({ data: "" });
            return;
        }

        const result = execute("encrypt", data, Secret_EncryptKey);

        res.status(200).json({ data: result });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
