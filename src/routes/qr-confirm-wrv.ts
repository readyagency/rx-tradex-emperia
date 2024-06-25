import express from "express";
import { QrDb } from "../databases/lowdb.js";
import QrCodeModel from "../mongodb-models/qrcode.js";
import { logError } from "../utils/logger.js";
import findLast from "lodash/findLast.js";

const router = express.Router();
const qrDb = QrDb;

router.get("/wrv/cf/ind/:id", async (req, res) => {
    const id = req.params.id;
    const ejsName = "qr-individual-wrv";

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
        await qrDb.read();

        const data = findLast(qrDb.data.data, value => {
            return value.accountId === id;
        });

        if (!data) {
            res.status(400).send("Null");
            return;
        }

        const content = data?.htmlContent || "";
        const fullName = data?.fullName || "";
        const companyName = data?.companyName || "";

        const encodeContent = encodeURIComponent(content);

        res.render(ejsName, {
            content: encodeContent,
            fullName,
            companyName,
        });
    }
});

router.get("/wrv/cf/group/:id", async (req, res) => {
    const id = req.params.id;
    const ejsName = "qr-group-wrv";

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
        await qrDb.read();

        const data = findLast(qrDb.data.data, value => {
            return value.accountId === id;
        });

        if (!data) {
            res.status(400).send("Null");
            return;
        }

        const content = data?.htmlContent || "";
        const fullName = data?.fullName || "";
        const companyName = data?.companyName || "";

        const encodeContent = encodeURIComponent(content);

        res.render(ejsName, {
            content: encodeContent,
            fullName,
            companyName,
        });
    }
});

export default router;
