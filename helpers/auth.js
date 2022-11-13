/*function checkAuth(req, res, next) {

    if (getToken(req)) {
        next()https://www.w3schools.com/react/react_class.asp
    } else {
        res.status(403).send("Unauthorized")
    }
}*/
// ADD HOMEWORKS WORKING IN THEIR OWN COLLECTION
const { MongoClient, ObjectId } = require("mongodb");
const admin = require("firebase-admin")
const config = require("../config.js");
const serviceAccount = config.firebase
const mongoConfig = config.mongo

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const uri = mongoConfig.uri;

class DatabaseCache {
    constructor(length) {
        this.cache = []
        this.length = length
    }

    push(document) {
        this.check()
        this.cache.push(document)
    }

    check() {
        if (this.cache.length === this.length) {
            this.cache.shift()
        }
    }

    search(document) {

    }
}

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

    async aggregate(many, one, as) {
        //https://www.stackchief.com/tutorials/%24lookup%20Examples%20%7C%20MongoDB
        //https://thecodebarbarian.com/a-nodejs-perspective-on-mongodb-36-lookup-expr
        try {
            await this.client.connect()
            const col = await this.client.db("project").collection(one.collection)
            const docs = await col.aggregate(
                [
                    {
                        $lookup: {
                            from: many.collection,
                            localField: one.field,
                            foreignField: many.field,
                            as: as
                        }
                    }

                ]
            ).toArray()
            return docs
        }
        finally {
            await this.client.close()
        }
    }

    ObjectId(id) {
        return new ObjectId(id)
    }
}

/*(async function() {
    try {
        await client.connect()
        console.log(1)
        col = client.db("project").collection("users")
        console.log(2)
        const doc = await col.findOne({ uid: "qGRBC1gsvNSzyrNQfto6706IUXC3" })
        console.log(doc)
    }
    finally {
        await client.close()
    }
})()*/

const dbClient = new DatabaseClient()

dbClient


function authorise(routeLevel, tokenRequired) {
    return async function(req, res, next) {
        if (routeLevel === undefined && !tokenRequired) {
            next()
        } else {
            const { authtoken } = req.headers

            //try {
            const decodedToken = await admin.auth().verifyIdToken(authtoken)
            const user = await dbClient.find("users", { uid: decodedToken.uid })
            if (user) {
                const { level } = user
                if (level >= (routeLevel || 0)) {
                    req.userData = user
                    next()
                } else {
                    //res.status(403).send("Unauthorised")
                    res.json({ error: "You are not authorised to access this route" })
                }
            } else {
                if (decodedToken && tokenRequired && routeLevel === undefined) {
                    req.userToCreate = decodedToken
                    next()
                }
            }
        }
        //} catch (e) {
        //    res.json({ message: "There was a problem authorising the user" })
        //}
    }
}

exports.DatabaseClient = dbClient
exports.authorise = authorise
