import { RcmDb, QrDb } from "../databases/lowdb.js";
import RecommendationModel, {
    TRecommendation,
} from "../mongodb-models/recommendation.js";
import { v4 as uuidv4 } from "uuid";
import { logError } from "./logger.js";
import QrCodeModel, { TQRCode } from "../mongodb-models/qrcode.js";

const rcmDb = RcmDb;
const qrDb = QrDb;

export const saveRcmData = async (data: TRecommendation) => {
    try {
        const rcm = new RecommendationModel(data);
        await rcm.save();

        await rcmDb.read();
        rcmDb.data.data.push({ id: uuidv4(), ...data });
        await rcmDb.write();
    } catch (error) {
        logError(`Backup failed ${error}`);
    }
};

export const saveQrData = async (data: TQRCode) => {
    try {
        const qr = new QrCodeModel(data);
        await qr.save();

        await qrDb.read();
        qrDb.data.data.push({ id: uuidv4(), ...data });
        await qrDb.write();
    } catch (error) {
        logError(`Backup failed ${error}`);
    }
};
