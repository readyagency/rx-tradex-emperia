import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { HtmlTemplateDb as mainDb } from "../databases/lowdb.js";
import { BadgeIdKey, RecommendationKey, ShowIdKey } from "../constants/keys.js";
import { saveRcmData } from "../utils/data-saver.js";
import { makeHTMLTableBodyMXV2023 } from "../utils/table-html.js";
import { IHTMLTemplate, ParsedQs } from "../databases/types.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const _convertRCMTemplate = (
    template: IHTMLTemplate,
    query: ParsedQs,
): string => {
    let cloned = template.content;

    template.variables.forEach(variable => {
        let value = query[variable];

        if (Array.isArray(value)) {
            const clonedValue = value;
            value = clonedValue[0];
        }

        if (typeof value !== "string") return;

        if (variable === RecommendationKey) {
            return;
        }

        const regex = new RegExp(`{{${variable}}}`, "g");
        cloned = cloned.replace(regex, value);
    });

    const rcmVariables = query[RecommendationKey];
    const showId = query[ShowIdKey];

    const keywords =
        typeof rcmVariables === "string" ? rcmVariables.split(",") : [];

    const tbody = makeHTMLTableBodyMXV2023(
        showId === "MXV23" ? "MXV23" : "NEVHCM23",
        keywords,
    );

    const regex = new RegExp(`{{${RecommendationKey}}}`, "g");
    cloned = cloned.replace(regex, tbody);

    return cloned;
};

router.get("/mxv-recommendation-list", async (req, res) => {
    try {
        await mainDb.read();
        logRequest(req);

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-rcm-list";
        });

        if (!template) {
            res.status(200).json({ data: "" });
            return;
        }

        const cloned = _convertRCMTemplate(template, query);

        if (typeof query[BadgeIdKey] === "string") {
            await saveRcmData({
                accountId: query[BadgeIdKey],
                htmlContent: cloned,
                templateId: "mxv-rcm-list",
            });
        }

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv-recommendation-list/preview", async (req, res) => {
    try {
        await mainDb.read();

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "mxv-rcm-list";
        });

        if (!template) {
            res.status(200).send("");
            return;
        }

        const cloned = _convertRCMTemplate(template, query);
        res.status(200).send(cloned);
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/mxv/ghm", async (_, res) => {
    res.status(200)
        .type("jpg")
        .sendFile(
            path.join(
                __dirname,
                "../../src/assets/GHM GROUP_Logo_4c_ohne_slogan.jpg",
            ),
        );
});

export default router;
