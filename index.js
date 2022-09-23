const express = require("express");
const cors = require("cors");
const routesMap = require("./routes/map.js");

//const checkAuth = require("./helpers/auth.js").checkAuth
const admin = require('firebase-admin')
const { authorise } = require("./helpers/auth.js")

const api = express();

api.use(cors());

for (const [namespace, routes] of Object.entries(routesMap)) {
    for (const [route, settings] of Object.entries(routes)) {
        api[settings.method || "get"](
            `/${namespace}/${route}`,
            authorise(settings.authLevel, settings.tokenRequired),
            async (req, res) => {
                //add req param requirements and auth limited routes
                const data = await settings.bind(req)
                res.json(data);
            }
        );
    }
}

api.listen(3000, () => {
    console.log("listening on port 3000");
});
