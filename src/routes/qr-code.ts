import express from "express";
import QRCode from "qrcode";
import { logError } from "../utils/logger.js";

const router = express.Router();
const invalidStr = "invalid_data";
const defaultSize = "250";

router.get("/qr-code", async (req, res) => {
    try {
        const query = req.query;
        const data = query.data?.toString() || invalidStr;
        const size = query.size?.toString() || defaultSize;

        const qrImage = await QRCode.toBuffer(data, {
            width: Number.isNaN(Number(size)) ? 250 : Number(size),
            errorCorrectionLevel: "H",
            
        });

        // Set response content type to image/png
        res.set("Content-Type", "image/png");

        // Send QR code image as response
        res.send(qrImage);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
