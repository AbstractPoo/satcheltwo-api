/*function checkAuth(req, res, next) {

    if (getToken(req)) {
        next()https://www.w3schools.com/react/react_class.asp
    } else {
        res.status(403).send("Unauthorized")
    }
}*/
const { MongoClient, ObjectId } = require("mongodb");
const admin = require("firebase-admin")
const config = require("../config.js");
const serviceAccount = config.firebase
const mongoConfig = config.mongo

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const uri = mongoConfig.uri;

class DatabaseClient {

    constructor() {

        //this.clientCache = new DatabaseCache()
        // create a cache so there are less requests to db
    }

    async insertOne(collection, document) {
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.insertOne(document)
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async find(collection, document) {
        try {
            const client = new MongoClient(uri);
            try {

                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.findOne(document)
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async findMany(collection, document) {
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.find(document).toArray()
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async updateOne(collection, query, document) {
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.updateOne(query, document)
                return doc
            } catch (e) {
                console.log(e)
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async deleteMany(collection, query) {
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.deleteMany(query)
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async deleteOne(collection, query) {
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.deleteOne(query)
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    async aggregate(collection, query) {
        //https://www.stackchief.com/tutorials/%24lookup%20Examples%20%7C%20MongoDB
        //https://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-36-lookup-expr
        try {
            const client = new MongoClient(uri);
            try {
                await client.connect()
                const col = client.db("project").collection(collection)
                const doc = await col.aggregate(query).toArray()
                return doc
            }
            finally {
                await client.close()
            }
        }
        catch (e) {
            return { error: "Could not connect to the database" }
        }
    }

    ObjectId(id) {
        return new ObjectId(id)
    }
}

const dbClient = new DatabaseClient()

function authorise(routeLevel, tokenRequired) {
    return async function(req, res, next) {
        if (routeLevel === undefined && !tokenRequired) {
            next()
        } else {
            const { authtoken } = req.headers

            try {
                const decodedToken = await admin.auth().verifyIdToken(authtoken)
                const user = await dbClient.find("users", { uid: decodedToken.uid })
                if (user) {
                    const { level } = user
                    if (level >= (routeLevel || 0)) {
                        req.userData = user
                        next()
                    } else {
                        res.json({ error: "You are not authorised to access this route" })
                    }
                } else {
                    if (decodedToken && tokenRequired && routeLevel === undefined) {
                        req.userToCreate = decodedToken
                        next()
                    }
                }
            }
            catch (e) {
                res.json({ message: "There was a problem authorising the user" })
            }
        }
    }
}

exports.DatabaseClient = dbClient
exports.authorise = authorise
