import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { HtmlTemplateDb as mainDb } from "../databases/lowdb.js";
import { baseConvertTemplate, convertToString } from "../utils/converter.js";
import { BadgeIdKey } from "../constants/keys.js";
import { saveQrData } from "../utils/data-saver.js";
import { TQRCode } from "../mongodb-models/qrcode.js";

const router = express.Router();

router.get("/mxv-group-confirm", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-group-confirm";
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = baseConvertTemplate(template, query);

        if (typeof query[BadgeIdKey] === "string") {
            const type: TQRCode["type"] = "Group";

            await saveQrData({
                accountId: query[BadgeIdKey] + type,
                htmlContent: query[BadgeIdKey],
                fullName: convertToString(query["full_name"]),
                companyName: convertToString(query["company_name"]),
                type,
            });
        }

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv-ind-confirm", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-ind-confirm";
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        if (typeof query[BadgeIdKey] === "string") {
            const type: TQRCode["type"] = "Individual";

            await saveQrData({
                accountId: query[BadgeIdKey] + type,
                htmlContent: query[BadgeIdKey],
                fullName: convertToString(query["full_name"]),
                companyName: convertToString(query["company_name"]),
                type,
            });
        }

        const cloned = baseConvertTemplate(template, query);

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv-:type-confirm/preview", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const type = req.params.type;
        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === `mxv-${type}-confirm`;
        });

        if (!template) {
            res.status(200).send("");
            return;
        }

        const cloned = baseConvertTemplate(template, query);
        res.status(200).send(cloned);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
