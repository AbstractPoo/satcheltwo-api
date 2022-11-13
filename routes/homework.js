const { DatabaseClient } = require("../helpers/auth.js")

async function create(req) {
    const { body } = req
    try {
        const { title, description, set, due, classId } = body
        const homeworkData = {
            title: title,
            description: description,
            set: set,
            due: due,
            classId: classId
        }
        await DatabaseClient.insertOne("homeworks", { _id: DatabaseClient.ObjectId(classId) }, { $push: { homeworks: homeworkData } })
        return { message: "Homework added successfully" }
    }
    catch (e) {
        return { error: "There was a problem setting the homework" }
    }
}

async function get(req) {
    try {
        const { uid } = req.userData
        const classes = await DatabaseClient.findMany("classes", {
            "users.uid": uid
        })
        return classes
    }
    catch (e) {
        return { error: "Could not fetch homework information" }
    }
}

exports.create = create
exports.get = get