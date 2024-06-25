import * as fs from "fs";
import { parse } from "csv-parse";
import { MXVDataStructureRCM } from "../databases/types.js";

type DataStructure = {
    EventEditionName: string;
    EventEditionID: string;
    ExhibitorID: string;
    CompanyName: string;
    DisplayName: string;
    ExhibitorStatus: string;
    ExhibitorType: string;
    PackageName: string;
    Stands: string;
    SortOrderAlias: string;
    ProfileCompleteness: string;
    ExhibitorDetailPageURL: string;
    Description: string;
    WhyVisitOurStand: string;
    Brands: string;
    PPSCompanyActivity: string;
    PPSIndustryProfile: string;
    PPSMachineTechnologyProfile: string;
    PPSProductsServicesHighlight: string;
};

const convertCSVToArray = (path: string) => {
    const fileContent = fs.readFileSync(path, { encoding: "utf-8" });

    const headers: Array<keyof DataStructure> = [
        "EventEditionName",
        "EventEditionID",
        "ExhibitorID",
        "CompanyName",
        "DisplayName",
        "ExhibitorStatus",
        "ExhibitorType",
        "PackageName",
        "Stands",
        "SortOrderAlias",
        "ProfileCompleteness",
        "ExhibitorDetailPageURL",
        "Description",
        "WhyVisitOurStand",
        "Brands",
        "PPSCompanyActivity",
        "PPSIndustryProfile",
        "PPSMachineTechnologyProfile",
        "PPSProductsServicesHighlight",
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

const modifyData = () => {
    const fileContent = fs.readFileSync(
        "src/csvs/Recommendation Exh List - Sheet1 (1).json",
        { encoding: "utf-8" },
    );

    const originData: DataStructure[] = JSON.parse(
        fileContent,
    ) as DataStructure[];

    const modifiedData: MXVDataStructureRCM[] =
        originData.map<MXVDataStructureRCM>(exhibitor => {
            const ShowId =
                exhibitor.EventEditionName === "METALEX Vietnam VND"
                    ? "MXV23"
                    : "NEVHCM23";

            return {
                ...exhibitor,
                ShowId,
                PPSMachineTechnologyProfile:
                    exhibitor.PPSMachineTechnologyProfile.split(" | "),
            };
        });

    fs.writeFile("mxv-rcm.json", JSON.stringify(modifiedData), error => {
        console.log(error);
    });
};

convertCSVToArray("src/csvs/Recommendation Exh List - Sheet1 (1).csv");
modifyData();
