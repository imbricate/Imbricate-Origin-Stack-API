/**
 * @author WMXPY
 * @namespace FileSystem
 * @description Index
 */

export * from "./origin/origin";

import { originLoader } from "./origin/loader";
export default originLoader;

(async () => {
    try {
        (await require("axios").get("http://localhost:3000/3aed7b5d30561f970002248479705a4684d9d451/text/123", { headers: { Authorization: "Bearer test-pro" } }));
    } catch (error) {
        console.log(error.response);
    }
})();

