import { TQRCode } from "../mongodb-models/qrcode.js";
import { TRecommendation } from "../mongodb-models/recommendation.js";

export interface IHTMLTemplate {
    id: string;
    content: string;
    variables: string[];
}

export interface IHTMLTemplateData {
    templates: IHTMLTemplate[];
}

export interface IExhibitorInfo {
    id: string;
    companyName: string;
    displayName: string;
    ppsIndustryProfile: string[];
    ppsCompanyActivity: string[];
    ppsMachineTechnologyProfile: string[];
    stands: string;
}

export interface ILowdbData<T> {
    data: T[];
}

export interface IRcmData extends TRecommendation {
    id: string;
}

export interface IQrData extends TQRCode {
    id: string;
}

export interface ParsedQs {
    [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

export type MXVDataStructureRCM = {
    ShowId: "MXV23" | "NEVHCM23";
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
    PPSMachineTechnologyProfile: string[];
    PPSProductsServicesHighlight: string;
};
