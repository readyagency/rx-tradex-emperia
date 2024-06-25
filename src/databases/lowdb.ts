import { JSONFile } from "lowdb/node";
import { IHTMLTemplateData, ILowdbData, IQrData, IRcmData } from "./types.js";
import { Low } from "lowdb";

const htmlTemplateAdapter = new JSONFile<IHTMLTemplateData>(
    "src/databases/templates.json",
);
const HtmlTemplateDb = new Low<IHTMLTemplateData>(htmlTemplateAdapter, {
    templates: [],
});

const rcmAdapter = new JSONFile<ILowdbData<IRcmData>>("src/databases/rcm.json");
const RcmDb = new Low<ILowdbData<IRcmData>>(rcmAdapter, { data: [] });

const qrAdapter = new JSONFile<ILowdbData<IQrData>>("src/databases/qr.json");
const QrDb = new Low<ILowdbData<IQrData>>(qrAdapter, { data: [] });

export { HtmlTemplateDb, RcmDb, QrDb };
