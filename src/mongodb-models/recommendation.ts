import mongoose from "mongoose";

export type TRecommendation = {
    accountId: string;
    htmlContent: string;
    templateId: string;
    createdAt?: Date;
};

const RecommendationSchema = new mongoose.Schema<TRecommendation>({
    accountId: { type: String, require: true },
    htmlContent: { type: String, require: true },
    templateId: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, require: false },
});

const RecommendationModel = mongoose.model(
    "recommendation-list",
    RecommendationSchema,
);

export default RecommendationModel;
