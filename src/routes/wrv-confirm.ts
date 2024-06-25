import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { convertToString } from "../utils/converter.js";
import { BadgeIdKey, QrCodeType, ScanQRImageKey } from "../constants/keys.js";
import { saveQrData } from "../utils/data-saver.js";

const router = express.Router();

router.get("/wrv/cf", async (req, res) => {
    try {
        const query = req.query;
        logRequest(req);

        if (
            typeof query[BadgeIdKey] === "string" &&
            typeof query[ScanQRImageKey] === "string" &&
            typeof query[QrCodeType] === "string"
        ) {
            await saveQrData({
                accountId: query[BadgeIdKey],
                htmlContent: query[ScanQRImageKey],
                fullName: convertToString(query["full_name"]),
                companyName: convertToString(query["company_name"]),
                type: query[QrCodeType] === "ind" ? "Individual" : "Group",
            });
        }

        res.status(200).json({
            data: `https://port.rx-vietnamshows.com/wrv/cf/${query[QrCodeType]}/${query[BadgeIdKey]}`,
        });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
