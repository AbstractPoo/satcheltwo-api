const express = require("express");
const cors = require("cors");
const routesMap = require("./routes/map.js");

//const checkAuth = require("./helpers/auth.js").checkAuth
const admin = require('firebase-admin')
const { authorise, DatabaseClient } = require("./helpers/auth.js")


const api = express();

api.use(cors());
api.use(express.json());

for (const [namespace, routes] of Object.entries(routesMap)) {
    for (const [route, settings] of Object.entries(routes)) {
        api[settings.method || "get"](
            `/${namespace}/${route}`,
            authorise(settings.level, settings.tokenRequired),
            async (req, res) => {
                //add req param requirements and auth limited routes
                const data = await settings.bind(req)
                res.json(data);
            }
        );
    }
}

api.get("/", async (req, res) => {
    //await DatabaseClient.deleteMany("users", { uid: "lt1RyO5L3xWcZaeczdY3qHuoFNu1" })
    res.send("deleted")
})

api.listen(3000, () => {
    console.log("listening on port 3000");
});
