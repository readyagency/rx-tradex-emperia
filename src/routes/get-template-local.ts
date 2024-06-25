import express from "express";
import { HTMLTemplateV1, HTMLTemplateV2 } from "../constants/html-templates.js";
import { logError, logRequest } from "../utils/logger.js";

const router = express.Router();

router.get("/v1", async (req, res) => {
    try {
        const query = req.query;
        logRequest(req);

        const variables = [
            "contact_title",
            "contact_first_name",
            "contact_full_name",
            "company_name",
            "contact_email",
            "scan_qr_image",
        ];

        let cloned = HTMLTemplateV1;

        variables.forEach(variable => {
            const value = query[variable];
            if (typeof value !== "string") return;

            const regex = new RegExp(`{{${variable}}}`, "g");
            cloned = cloned.replace(regex, value);
        });

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/v2", async (req, res) => {
    try {
        const query = req.query;
        logRequest(req);

        const variables = [
            "contact_title",
            "contact_first_name",
            "contact_full_name",
            "company_name",
            "contact_email",
            "scan_qr_image",
        ];

        let cloned = HTMLTemplateV2;

        variables.forEach(variable => {
            const value = query[variable];
            if (typeof value !== "string") return;

            const regex = new RegExp(`{{${variable}}}`, "g");
            cloned = cloned.replace(regex, value);
        });

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

export default router;
