import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { HtmlTemplateDb as mainDb } from "../databases/lowdb.js";
import { baseConvertTemplate } from "../utils/converter.js";

const router = express.Router();

router.get("/vip-pass", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "vip-pass";
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = baseConvertTemplate(template, query);

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/vip-pass/preview", async (req, res) => {
    try {
        await mainDb.read();
        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "vip-pass";
        });

        if (!template) {
            res.status(200).json({ data: "" });
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
