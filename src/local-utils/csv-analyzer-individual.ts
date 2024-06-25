import * as fs from "fs";
import { parse } from "csv-parse";
import { ExhibitorData } from "../databases/exhibitor-sheet.js";
import sampleSize from "lodash/sampleSize.js";
import axios from "axios";

type DataStructure = {
    showId: string;
    badgeId: string;
    title: string;
    fullName: string;
    companyName: string;
    position: string;
    phone: string;
    email: string;
};

const convertCSVToArray = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });

    const headers: Array<keyof DataStructure> = [
        "showId",
        "badgeId",
        "title",
        "fullName",
        "companyName",
        "position",
        "phone",
        "email",
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

const getEmailConfirmUrl = async (data: DataStructure[]) => {
    let results = "";

    const rootUrl =
        "http://localhost:3000/api/get-html-template/92baaed6-cb19-404d-baf3-993106451fc5";

    const URL = "https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=";
    const URL2 = "&style=197&type=C128B&width=271&height=50&xres=1&font=3";

    for (const value of data) {
        const { title, fullName, companyName, email, badgeId } = value;

        let finalUrl = rootUrl + "?";
        finalUrl += "contact_title=" + encodeURIComponent(title);
        finalUrl += "&contact_first_name=" + encodeURIComponent(fullName);
        finalUrl += "&contact_full_name=" + encodeURIComponent(fullName);
        finalUrl += "&company_name=" + encodeURIComponent(companyName);
        finalUrl += "&contact_email=" + encodeURIComponent(email);
        finalUrl +=
            "&scan_qr_image=" + encodeURIComponent(URL + badgeId + URL2);

        const { data } = await axios.get(finalUrl);
        results += `'${JSON.stringify(data.data)}'` + "\n";
    }

    fs.writeFile("src/csvs/email-confirm-individual.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const getEmailRecommendUrl = async (data: DataStructure[]) => {
    let results = "";

    const rootUrl =
        "http://localhost:3000/api/get-html-template/77ce4008-0a4d-4231-8023-440974fe3981";

    const techs = ExhibitorData.reduce<string[]>((techProfiles, exhibitor) => {
        techProfiles.push(...exhibitor.ppsMachineTechnologyProfile);
        return techProfiles;
    }, []);

    const uniqueTechs = Array.from(new Set(techs));

    for (const value of data) {
        const { fullName } = value;

        let finalUrl = rootUrl + "?";
        finalUrl += "contact_first_name=" + encodeURIComponent(fullName);

        const random3Techs = sampleSize(uniqueTechs, 3);

        finalUrl +=
            "&recommendation_list=" +
            encodeURIComponent(random3Techs.join(","));

        const { data } = await axios.get(finalUrl);
        results += `'${JSON.stringify(data.data)}'` + "\n";
    }

    fs.writeFile("src/csvs/email-recommend-individual.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const getEncryptKeyUrl = async (data: DataStructure[]) => {
    let results = "";

    const rootUrl = "http://localhost:3000/api/emperia-encrypt";

    for (const value of data) {
        const {
            fullName,
            companyName,
            email,
            badgeId,
            phone,
            showId,
            position,
        } = value;

        let finalUrl = rootUrl + "?";

        // {{showId}}|{{badgeId}}|{{firstName}}|{{lastName}}|{{position}}|{{company}}|{{email}}|{{phone}}
        const formattedData = [
            encodeURIComponent(showId),
            encodeURIComponent(badgeId),
            encodeURIComponent(fullName),
            encodeURIComponent(""),
            encodeURIComponent(position),
            encodeURIComponent(companyName),
            encodeURIComponent(email),
            encodeURIComponent(phone),
        ];

        finalUrl += "data=" + formattedData.join("|");

        const { data } = await axios.get(finalUrl);
        results += JSON.stringify(data.data) + "\n";
    }

    fs.writeFile("src/csvs/encrypt-code-individual.txt", results, error => {
        if (error) console.log("error::", error);
    });
};

const analyzeData = () => {
    const fileContent = fs.readFileSync(
        "src/csvs/Collection Data - Individual.json",
        { encoding: "utf-8" },
    );

    const data: DataStructure[] = JSON.parse(fileContent) as DataStructure[];

    Promise.all([
        getEmailConfirmUrl(data),
        getEmailRecommendUrl(data),
        getEncryptKeyUrl(data),
    ]);
};

convertCSVToArray("src/csvs/Collection Data - Individual.csv");
analyzeData();
