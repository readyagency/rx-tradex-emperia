import { JSONFile } from "lowdb/node";
import { IHTMLTemplateData } from "../databases/types.js";
import { Low } from "lowdb";
import { v4 as uuidv4 } from "uuid";

const defaultData: IHTMLTemplateData = { templates: [] };
const adapter = new JSONFile<IHTMLTemplateData>("src/databases/templates.json");
const db = new Low<IHTMLTemplateData>(adapter, defaultData);

export const addNewHTMLTemplate = async (
    html: string,
    options: {
        variables: string[];
        id?: string;
    },
) => {
    try {
        await db.read();
        db.data.templates.push({
            id: options.id || uuidv4(),
            content: html,
            variables: options.variables,
        });
    } catch (error) {
        console.log(error);
    }

    await db.write();
};
