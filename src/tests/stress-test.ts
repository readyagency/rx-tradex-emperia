import axios from "axios";
import * as fs from "fs";
import { delay } from "../local-utils/common.js";

const stressTestApi = async (options: {
    times: number;
    frequency: number;
    delayms?: number;
}) => {
    const { times, frequency, delayms = 0 } = options;

    for (let index = 0; index < times; index++) {
        let succeed = 0;
        let failed = 0;

        const requests = Array.from({ length: frequency }).map((_, index) => {
            let url =
                "http://localhost:3000/api/get-html-template/d953eb32-c3a3-4d21-a9bd-ba43731b4b3f?contact_title=Mr.&contact_first_name=NGUY%E1%BB%84N%20QUANG%20T%C3%99NG&contact_full_name=NGUY%E1%BB%84N%20QUANG%20T%C3%99NG&company_name=BAO%20AN%20AUTOMATION&scan_qr_image=https%3A%2F%2Fchart.googleapis.com%2Fchart%3Fcht%3Dqr%26chs%3D250x250%26chl%3D4433256000001719009%26style%3D197%26type%3DC128B%26width%3D271%26height%3D50%26xres%3D1%26font%3D3&contact_email=bao@gmail.com";

            url += "&account_id=BaoBao";
            url += `&type=${index % 2 === 0 ? "i" : "g"}`;

            return axios
                .get(url)
                .then(res => {
                    succeed++;
                    return res.data;
                })
                .catch(error => {
                    if (failed < 2) {
                        console.log("error:::", error);
                    }
                    failed++;
                });
        });

        const results = await Promise.all(requests);

        fs.writeFile(
            `src/tests/attempt_${index}` + ".json",
            JSON.stringify({
                succeed,
                failed,
                results,
            }),
            error => {
                console.log(error, "FAIL::", failed + " / " + results.length);
            },
        );

        await delay(delayms);
    }
};

stressTestApi({
    times: 2,
    frequency: 1000,
    delayms: 1000,
});
