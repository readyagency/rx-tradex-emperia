import express from "express";
import { logError, logRequest } from "../utils/logger.js";
import { RcmDb, HtmlTemplateDb as mainDb } from "../databases/lowdb.js";
import { BadgeIdKey, RecommendationKey, ShowIdKey } from "../constants/keys.js";
import { saveRcmData } from "../utils/data-saver.js";
import { makeHTMLTableBodyMXV2023 } from "../utils/table-html.js";
import { IHTMLTemplate, ParsedQs } from "../databases/types.js";
import RecommendationModel from "../mongodb-models/recommendation.js";
import findLast from "lodash/findLast.js";

const router = express.Router();
const rcmDb = RcmDb;

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

router.get("/wrv/rc", async (req, res) => {
    try {
        logRequest(req);
        await mainDb.read();

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "wrv-rcm-list";
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
                templateId: "wrv-rcm-list",
            });
        }

        res.status(200).json({ data: cloned });
    } catch (error) {
        logError(error);
        res.status(400).json({ message: error });
    }
});

router.get("/wrv/rc/preview", async (req, res) => {
    try {
        await mainDb.read();

        const query = req.query;

        const template = mainDb.data.templates.find(tpl => {
            return tpl.id === "wrv-rcm-list";
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

router.get("/wrv/rc/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const data = await RecommendationModel.findOne({ accountId: id })
            .sort({ createdAt: -1 })
            .exec();

        const content = data?.htmlContent;

        if (!content) {
            logError("Mongodb find failed:::" + id);
            throw new Error("Mongodb find failed");
        }

        res.render("rcm", { content });
    } catch (error) {
        await rcmDb.read();

        const data = findLast(rcmDb.data.data, value => {
            return value.accountId === id;
        });

        if (!data) {
            res.status(400).send("Null");
            return;
        }

        const content = data?.htmlContent || "";
        res.render("rcm", { content });
    }
});

export default router;
