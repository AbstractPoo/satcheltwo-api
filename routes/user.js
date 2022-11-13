const { DatabaseClient } = require("../helpers/auth.js")

async function createUser(decodedToken) {
    try {
        const { name, email, uid } = decodedToken
        const userData = {
            uid: uid,
            email: email,
            name: name,
            level: 0,
            classes: []
        }
        if (!(await DatabaseClient.find("users", { uid: uid }))) {
            if (!(name && email && uid)) {
                console.log("user.js:18 missing argument", name, email, uid)
                return { error: "Name, email or uid was not provided" }
            } else {
                await DatabaseClient.insertOne("users", userData)
                return { message: "User created successfully" }
            }
        } else {
            return { error: "Account already created" }
        }
    }
    catch (e) {
        return { error: "There was a problem creating the user" }
    }
}

async function get(req) {
    try {
        if (req.userToCreate) {
            const creationStatus = (await createUser(req.userToCreate))
            if (creationStatus.error) {
                return creationStatus
            } else {
                await get(req)
            }
        }
        else if (req.userData) {
            return req.userData
        } else {
            return { error: "User Data could not be found" }
        }
    } catch (e) {
        return { error: "There was a problem fetching userdata" }
    }
}

exports.get = get;