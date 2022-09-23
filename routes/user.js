const admin = require("firebase-admin")
const serviceAccount = require("../config.js").firebase;
const { DatabaseClient } = require("../helpers/auth.js")

async function createUser(decodedToken) {
    /*try {
        const { name, email, uid } = decodedToken
        const userData = {
            uid: uid,
            email: email,
            name: name,
            level: 0
        }
        if (!(name && email && uid)) {
            console.log("user.js:18 missing argument", name, email, uid)
            return { message: "Name, email or uid was not provided" }
        }
        await users.insertOne(userData)
        return { message: "User created successfully" }
    }
    catch (e) {
        return { message: "There was a problem creating the user", error: "e" }
    }*/
    try {
        const { name, email, uid } = decodedToken
        const userData = {
            uid: uid,
            email: email,
            name: name,
            level: 0
        }
        if (!(name && email && uid)) {
            console.log("user.js:18 missing argument", name, email, uid)
            return { message: "Name, email or uid was not provided" }
        }
        await DatabaseClient.insertOne("users", userData)
        return { message: "User created successfully" }
    }
    catch (e) {
        return { message: "There was a problem creating the user" }
    }
}

async function get(req) {
    /*const { authtoken } = req.headers

    try {
        const decodedToken = await admin.auth().verifyIdToken(authtoken)
        await client.connect()
        const users = await client.db("project").collection("users")
        const user = await users.findOne({ uid: decodedToken.uid })

        if (user) {
            const { email, name, level, } = user
            return { email: email, name: name, level: level }
        } else {
            return await createUser(users, decodedToken)
        }
    }
    catch (e) {
        return { message: "There was a problem logging in", error: e }
    }
    finally {
        await client.close()
    }*/

    try {
        if (req.userToCreate) {
            return (await createUser(req.userToCreate))
        }
        else if (req.userData) {
            return req.userData
        } else {
            return { message: "User Data could not be found" }
        }
    } catch (e) {
        return { message: "There was a problem fetching userdata" }
    }
}

exports.get = get;