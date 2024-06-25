import intersectionBy from "lodash/intersectionBy.js";
import sampleSize from "lodash/sampleSize.js";

import { ExhibitorData } from "../databases/exhibitor-sheet.js";
import { ExhibitorDataMXV } from "../databases/exhibitor-sheet-mxv.js";
import { MXVDataStructureRCM } from "../databases/types.js";

export const makeHTMLTableBody = (keywords: string[]) => {
    const collectData = ExhibitorData.filter(exhibitor => {
        const intersect = intersectionBy(
            exhibitor.ppsMachineTechnologyProfile,
            keywords,
        );

        return intersect.length > 0;
    });

    let randomExhibitors = sampleSize(collectData, 10);

    if (randomExhibitors.length < 10) {
        randomExhibitors = sampleSize(ExhibitorData, 10);
    }

    let trs = "";

    randomExhibitors.forEach((exhibitor, index) => {
        const { companyName, stands } = exhibitor;

        trs += `<tr>
            <td>${index + 1}</td>
            <td>${companyName}</td>
            <td>${stands}</td>
        </tr>`;
    });

    return `<tbody>${trs}</tbody>`;
};

export const makeHTMLTableBodyMXV2023 = (
    showId: MXVDataStructureRCM["ShowId"],
    keywords: string[],
) => {
    const fixedExhibitor: MXVDataStructureRCM = {
        EventEditionName: "METALEX Vietnam VND",
        EventEditionID: "eve-49b5aebd-0180-417d-b112-cb412f3e8097",
        ExhibitorID: "exh-bb04d8fc-298c-475e-ba81-6fd7193c802d",
        CompanyName: "NEWTON GMBH",
        DisplayName: "GHM GROUP",
        ExhibitorStatus: "ACTIVE",
        ExhibitorType: "EXHIBITOR",
        PackageName: "Bronze",
        Stands: "R02",
        SortOrderAlias: "NEWTON GMBH",
        ProfileCompleteness: "100",
        ExhibitorDetailPageURL:
            "https://www.metalexvietnam.com/en-gb/for-visitor/exhibitor-list/exhibitor-details.org-6000f756-77a8-41f4-881f-a67c0f48e093.html",
        Description:
            "The GHM GROUP is a specialist in measurement technology. Our business unit “Industry” offers sensors for flow, level, pressure, temperature, and liquid analysis, the electronics part of the portfolio comprises analytical measuring technology, safety-related assemblies, automation technology, and indicators. Our business unit “Portable” offers a wide range of portable instruments, sensors, and probes. Our business unit “Environmental” focuses on environmental technology, like weather stations, meteo stations, pyranometers, anemomenters, albedimeters, and microclimate data loggers.",
        WhyVisitOurStand:
            "We showcase high-quality measurement technology developed and manufactured in Europe. Our product range covers industrial sensors and electronics, portable instruments, and environmental technology.",
        Brands: "",
        PPSCompanyActivity: "Manufacturer",
        PPSIndustryProfile:
            "Oil & Gas | Chemical | Automotive | Auto Parts | Electric | Electronic | Automation | Machinery",
        PPSMachineTechnologyProfile: [
            "Automation",
            "Tools and Tooling",
            "Metrology",
            "Testing device",
            "Chemical",
            "Safety Equipment",
        ],
        PPSProductsServicesHighlight:
            "First Time In Vietnam | Industry 4.0 Technology Supported",
        ShowId: "MXV23",
    };

    const filteredData = ExhibitorDataMXV.filter(exhibitor => {
        return exhibitor.ShowId === showId;
    });

    const collectData = filteredData.filter(exhibitor => {
        const intersect = intersectionBy(
            exhibitor.PPSMachineTechnologyProfile,
            keywords,
        );

        return intersect.length > 0;
    });

    let randomExhibitors = sampleSize(collectData, 9);

    if (randomExhibitors.length < 10) {
        randomExhibitors = sampleSize(filteredData, 9);
    }

    let trs = "";

    [fixedExhibitor, ...randomExhibitors].forEach((exhibitor, index) => {
        const { DisplayName, Stands } = exhibitor;

        if (DisplayName === fixedExhibitor.DisplayName) {
            trs += `<tr>
                <td>${index + 1}</td>
                <td>
                    <div
                        style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        "
                    >
                        <span>${DisplayName}</span>
                        <img height="20px" src="https://port.rx-vietnamshows.com/mxv/ghm"/>
                    </div>
                </td>
                <td>${Stands}</td>
            </tr>`;
        } else {
            trs += `<tr>
            <td>${index + 1}</td>
            <td>${DisplayName}</td>
            <td>${Stands}</td>
        </tr>`;
        }
    });

    return `<tbody>${trs}</tbody>`;
};
