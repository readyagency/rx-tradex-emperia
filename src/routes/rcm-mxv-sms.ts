import express from "express";
import { RcmDb } from "../databases/lowdb.js";
import { logError } from "../utils/logger.js";
import findLast from "lodash/findLast.js";
import RecommendationModel from "../mongodb-models/recommendation.js";

const router = express.Router();
const rcmDb = RcmDb;

router.get("/rc/:id", async (req, res) => {
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
