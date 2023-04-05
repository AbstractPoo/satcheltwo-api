const { DatabaseClient } = require("../helpers/databaseclient.js");
// graphql https://www.mongodb.com/docs/realm/web/graphql-apollo-react/
async function create(req) {
  const { body } = req;
  try {
    const {
      title,
      description,
      due,
      classId,
      resources,
      teacherName,
      teacherPhoto,
    } = body;
    if (title && description && due && classId) {
      const homeworkData = {
        title: title,
        description: description,
        set: new Date(),
        due: new Date(due),
        resources: resources || [],
        classId: DatabaseClient.ObjectId(classId),
        usersCompleted: [],
        teacherName: teacherName,
        teacherPhoto: teacherPhoto,
      };
      await DatabaseClient.insertOne("homeworks", homeworkData);
      return { message: "Homework added successfully" };
    } else {
      return { error: "You are missing a field for the homework" };
    }
  } catch (e) {
    return { error: "There was a problem setting the homework" };
  }
}

async function get(req) {
  try {
    const { uid } = req.userData;
    const classes = await DatabaseClient.aggregate("classes", [
      {
        $match: {
          "users.uid": uid,
        },
      },
      {
        $lookup: {
          from: "homeworks",
          localField: "_id",
          foreignField: "classId",
          as: "homeworks",
        },
      },
      {
        $unwind: {
          path: "$homeworks",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$homeworks",
        },
      },
      {
        $sort: {
          due: 1,
        },
      },
    ]);
    return classes;
  } catch (e) {
    return { error: "Could not fetch homework information" };
  }
}

async function getAllCreator(req) {
  try {
    const { uid } = req.userData;
    const classes = await DatabaseClient.aggregate("classes", [
      {
        $match: {
          creator: uid,
        },
      },
      {
        $lookup: {
          from: "homeworks",
          localField: "_id",
          foreignField: "classId",
          as: "homeworks",
        },
      },
      {
        $unwind: {
          path: "$homeworks",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$homeworks",
        },
      },
      {
        $sort: {
          due: 1,
        },
      },
    ]);

    return classes;
  } catch (e) {
    return { error: "Could not fetch homework information" };
  }
}

async function complete(req) {
  try {
    const { uid } = req.userData;
    const { homeworkId } = req.body;
    console.log(homeworkId);
    const res = await DatabaseClient.updateOne(
      "homeworks",
      { _id: DatabaseClient.ObjectId(homeworkId) },
      { $addToSet: { usersCompleted: { uid: uid } } }
    );
    return res;
  } catch (e) {
    return { error: "Could not complete the homework" };
  }
} //https://www.mongodb.com/docs/realm/web/graphql-apollo-react/ graphql

async function unComplete(req) {
  try {
    const { uid } = req.userData;
    const { homeworkId } = req.body;
    const res = await DatabaseClient.updateOne(
      "homeworks",
      { _id: DatabaseClient.ObjectId(homeworkId) },
      { $pull: { usersCompleted: { uid: uid } } }
    );
    return res;
  } catch (e) {
    return { error: "Could not uncomplete the homework" };
  }
}

async function remove(req) {
  try {
    const { homeworkId } = req.body;
    const classes = await DatabaseClient.deleteOne("homeworks", {
      _id: DatabaseClient.ObjectId(homeworkId),
    });

    return classes;
  } catch (e) {
    return { error: "Could not delete the homework" };
  }
}

exports.create = create;
exports.get = get;
exports.getAllCreator = getAllCreator;
exports.remove = remove;
exports.complete = complete;
exports.unComplete = unComplete;
