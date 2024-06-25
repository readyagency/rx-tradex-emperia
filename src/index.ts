import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import getTemplateLocalRoute from "./routes/get-template-local.js";
import emperiaEncryptRoute from "./routes/emperia-encrypt.js";
import getHtmlTemplateRoute from "./routes/get-html-template.js";
import retrieveDataRoute from "./routes/retrieve-data.js";
import mxvConfirmRoute from "./routes/mxv-confirm.js";
import qrConfirmRoute from "./routes/qr-confirm-hcm.js";
import rcmMxvRoute from "./routes/mxv-rcm-list.js";
import rcmMxvSmsRoute from "./routes/rcm-mxv-sms.js";
import vipPassRoute from "./routes/vip-pass.js";
import htbfRoute from "./routes/htbf-confirm.js";
import wrvRcmRoute from "./routes/wrv-rcm-list.js";
import wrvConfirmRoute from "./routes/wrv-confirm.js";
import qrWrvRoute from "./routes/qr-confirm-wrv.js";
import qrCodeRoute from "./routes/qr-code.js";
import mongodb from "./databases/mongodb.js";

dotenv.config();

const app = express();
const port = 3000;

app.set("views", "src/views");
app.set("view engine", "ejs");
app.use("/assets", express.static("src/assets"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/get-template-local", getTemplateLocalRoute);
app.use("/api/emperia-encrypt", emperiaEncryptRoute);
app.use("/api/get-html-template", getHtmlTemplateRoute);
app.use(retrieveDataRoute);
app.use(mxvConfirmRoute);
app.use(qrConfirmRoute);
app.use(rcmMxvRoute);
app.use(rcmMxvSmsRoute);
app.use(vipPassRoute);
app.use(htbfRoute);
app.use(wrvRcmRoute);
app.use(wrvConfirmRoute);
app.use(qrWrvRoute);
app.use(qrCodeRoute);

app.get("/api", (_, res) => {
    res.status(200).json({ data: "Welcome 7!" });
});

mongodb.once("open", () => {
    console.log("Connected to MongoDB!");
});
