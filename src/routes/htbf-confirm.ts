import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { convertToString } from "../utils/converter.js";
import { BadgeIdKey, ScanQRImageKey } from "../constants/keys.js";
import { saveQrData } from "../utils/data-saver.js";
import QrCodeModel from "../mongodb-models/qrcode.js";

const router = express.Router();

router.get("/htbf/cf", async (req, res) => {
    try {
        const query = req.query;
        logRequest(req);

        if (
            typeof query[BadgeIdKey] === "string" &&
            typeof query[ScanQRImageKey] === "string"
        ) {
            await saveQrData({
                accountId: query[BadgeIdKey],
                htmlContent: query[ScanQRImageKey],
                fullName: convertToString(query["full_name"]),
                companyName: convertToString(query["company_name"]),
                type: "Individual",
            });
        }

        res.status(200).json({
            data:
                "https://port.rx-vietnamshows.com/htbf/cf/" + query[BadgeIdKey],
        });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/htbf/cf/:id", async (req, res) => {
    const id = req.params.id;
    const ejsName = "qr-individual-hn-2-11";

    try {
        const data = await QrCodeModel.findOne({ accountId: id })
            .sort({ createdAt: -1 })
            .exec();

        const content = data?.htmlContent;
        const fullName = data?.fullName || "";
        const companyName = data?.companyName || "";

        if (!content) {
            logError("Mongodb find failed:::" + id);
            throw new Error("Mongodb find failed");
        }

        const encodeContent = encodeURIComponent(content);

        res.render(ejsName, {
            content: encodeContent,
            fullName,
            companyName,
        });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
