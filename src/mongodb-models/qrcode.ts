import mongoose from "mongoose";

export type TQRCode = {
    accountId: string;
    htmlContent: string;
    fullName: string;
    companyName: string;
    type: "Individual" | "Group";
    createdAt?: Date;
};

const QrCodeSchema = new mongoose.Schema<TQRCode>({
    accountId: { type: String, require: true },
    htmlContent: { type: String, require: true },
    type: { type: String, require: true },
    fullName: { type: String, require: true },
    companyName: { type: String, require: true },
    createdAt: { type: Date, default: Date.now },
});

const QrCodeModel = mongoose.model("qr-code-list", QrCodeSchema);
export default QrCodeModel;
