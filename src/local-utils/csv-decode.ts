import * as fs from "fs";
import { parse } from "csv-parse";
import { execute } from "../utils/converter.js";
import { Secret_EncryptKey } from "../constants/encrypt.js";
import csvWriteStream from "csv-write-stream";

type DataStructure = {
    ExhibitorCompany: string;
    ExhibitorName: string;
    VIPName: string;
    VIPCompany: string;
    VIPPhonenumber: string;
    VIPEmail: string;
    VIPJobFunction: string;
    VIPJobLevel: string;
    SendEmailStatus: string;
    VisitorID: string;
    EncryptKey: string;
    QRScan: string;
    VIPBadgeID: string;
    BoothNo: string;
    VIPGenAccessCode: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const convertCSVToArray = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });

    const headers: Array<keyof DataStructure> = [
        "ExhibitorCompany",
        "ExhibitorName",
        "VIPName",
        "VIPCompany",
        "VIPPhonenumber",
        "VIPEmail",
        "VIPJobFunction",
        "VIPJobLevel",
        "SendEmailStatus",
        "VisitorID",
        "EncryptKey",
        "QRScan",
        "VIPBadgeID",
        "BoothNo",
        "VIPGenAccessCode",
    ];

    parse(
        fileContent,
        {
            delimiter: ",",
            columns: headers,
            fromLine: 2,
        },
        (error, results) => {
            if (error) {
                console.log(error);
                return;
            }

            const [fileName] = path.split(".");

            fs.writeFile(fileName + ".json", JSON.stringify(results), error => {
                console.log(error);
            });
        },
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analyzeData = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });

    const data: DataStructure[] = JSON.parse(fileContent) as DataStructure[];

    const results: DataStructure[] = [];

    for (const value of data) {
        let decoded = "";

        try {
            decoded = execute("decrypt", value.QRScan, Secret_EncryptKey);
        } catch (error) {
            console.log(error);
        }

        // NEVHN23|{{badgeId}}|{{firstName}}|{{lastName}}|{{position}}|{{company}}|{{email}}|{{phone}}
        const [
            ,
            // showId,
            badgeId,
            firstName,
            lastName,
            position,
            company,
            email,
            phone,
        ] = decoded.split("|");

        results.push({
            ...value,
            VIPName: firstName + lastName,
            VIPCompany: company,
            VIPPhonenumber: phone,
            VIPEmail: email,
            VIPJobFunction: position,
            VIPBadgeID: badgeId,
        });
    }

    const [fileName] = path.split(".");

    fs.writeFile(
        fileName + "_results" + ".json",
        JSON.stringify(results),
        error => {
            console.log(error);
        },
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const writeData = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });
    const data: DataStructure[] = JSON.parse(fileContent) as DataStructure[];

    const [fileName] = path.split(".");
    const writableStream = fs.createWriteStream(fileName + "_output.csv");
    const csvWriter = csvWriteStream();

    writableStream.on("finish", () => {
        console.log("CSV file has been written successfully.");
    });

    csvWriter.pipe(writableStream);

    csvWriter.write({
        ExhibitorCompany: "ExhibitorCompany",
        ExhibitorName: "ExhibitorName",
        VIPName: "VIPName",
        VIPCompany: "VIPCompany",
        VIPPhonenumber: "VIPPhonenumber",
        VIPEmail: "VIPEmail",
        VIPJobFunction: "VIPJobFunction",
        VIPJobLevel: "VIPJobLevel",
        SendEmailStatus: "SendEmailStatus",
        VisitorID: "VisitorID",
        EncryptKey: "EncryptKey",
        QRScan: "QRScan",
        VIPBadgeID: "VIPBadgeID",
        BoothNo: "BoothNo",
        VIPGenAccessCode: "VIPGenAccessCode",
    });

    data.forEach(item => {
        csvWriter.write([
            item.ExhibitorCompany,
            item.ExhibitorName,
            item.VIPName,
            item.VIPCompany,
            item.VIPPhonenumber,
            item.VIPEmail,
            item.VIPJobFunction,
            item.VIPJobLevel,
            item.SendEmailStatus,
            item.VisitorID,
            item.EncryptKey,
            item.QRScan,
            item.VIPBadgeID,
            item.BoothNo,
            item.VIPGenAccessCode,
        ]);
    });

    csvWriter.end();
};

// convertCSVToArray("src/csvs/Report_All VIPs - All_VIPs1.csv");
// analyzeData("src/csvs/Report_All VIPs - All_VIPs1.json");
// writeData("src/csvs/Report_All VIPs - All_VIPs1_results.json");
