import { Express } from "express-serve-static-core";
import * as fs from "fs";

type App = Express;
type AppGetCallback = Parameters<App["get"]>[1];

const logError = (error: unknown) => {
    const now = new Date();
    fs.appendFile(
        "src/logs/errors.txt",
        `[${now.toISOString()}]: ${error}\n`,
        () => {},
    );
};

const logRequest = (request: Parameters<AppGetCallback>[0]) => {
    const now = new Date();
    const nowStr = now.toISOString().split("T")[0];
    const fileName = `src/logs/${nowStr}.txt`;

    fs.readFile(fileName, "utf-8", error => {
        if (!error) return;

        fs.writeFile(fileName, "", error => {
            if (error) logError(error);
        });
    });

    try {
        const data = JSON.stringify({
            originalUrl: request.originalUrl,
            query: request.query,
        });

        fs.appendFile(fileName, `[${now.toISOString()}]: ${data}\n`, error => {
            if (error) logError(error);
        });
    } catch (error) {
        logError(error);
    }
};

export { logError, logRequest };
