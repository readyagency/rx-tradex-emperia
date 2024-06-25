import express from "express";
import { QrDb, RcmDb } from "../databases/lowdb.js";
import QrCodeModel from "../mongodb-models/qrcode.js";
import { logError } from "../utils/logger.js";
import findLast from "lodash/findLast.js";
import RecommendationModel from "../mongodb-models/recommendation.js";

const router = express.Router();
const qrDb = QrDb;
const rcmDb = RcmDb;

router.get("/rcm/:id", async (req, res) => {
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

router.get("/qr/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const data = await QrCodeModel.findOne({ accountId: id })
            .sort({ createdAt: -1 })
            .exec();

        const content = data?.htmlContent;
        const type = data?.type;
        const fullName = data?.fullName || "";
        const companyName = data?.companyName || "";

        if (!content || !type) {
            logError("Mongodb find failed:::" + id);
            throw new Error("Mongodb find failed");
        }

        const encodeContent = encodeURIComponent(content);
        const ejsName = type === "Individual" ? "qr-individual" : "qr-group";

        res.render(ejsName, {
            content: encodeContent,
            fullName,
            companyName,
        });
    } catch (error) {
        await qrDb.read();

        const data = findLast(qrDb.data.data, value => {
            return value.accountId === id;
        });

        if (!data) {
            res.status(400).send("Null");
            return;
        }

        const content = data?.htmlContent || "";
        const type = data?.type || "Individual";
        const fullName = data?.fullName || "";
        const companyName = data?.companyName || "";

        const encodeContent = encodeURIComponent(content);
        const ejsName = type === "Individual" ? "qr-individual" : "qr-group";

        res.render(ejsName, {
            content: encodeContent,
            fullName,
            companyName,
        });
    }
});

export default router;
