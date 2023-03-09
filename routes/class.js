const { DatabaseClient } = require("../helpers/auth.js");

async function create(req) {
  try {
    const { uid } = req.userData;
    //const required = setdefaults(req.body, defaults)
    const { name } = req.body;
    if (!name) {
      return { error: "You are missing a required field to create a class" };
    }
    await DatabaseClient.insertOne("classes", {
      creator: uid,
      name: name,
      users: [{ uid: uid }],
    });
    return { message: "Class created successfully" };
  } catch (e) {
    return { error: "Problem creating class" };
  }
}

async function join(req) {
  try {
    const { _id } = req.body;
    const { uid } = req.userData;
    const res = await DatabaseClient.updateOne(
      "classes",
      { _id: DatabaseClient.ObjectId(_id) },
      { $addToSet: { users: { uid: uid } } }
    );
    return res;
  } catch (e) {
    return { error: "Could not join class" };
  }
}

async function getAllUser(req) {
  try {
    const { uid } = req.userData;
    const classes = await DatabaseClient.findMany("classes", {
      "users.uid": uid,
    });
    return classes;
  } catch (e) {
    console.log(e);
    return { error: "Could not fetch homework information" };
  }
}

async function getAll(req) {
  try {
    const { uid } = req.userData;
    const classes = await DatabaseClient.findMany("classes", {});
    return classes;
  } catch (e) {
    console.log(e);
    return { error: "Could not fetch homework information" };
  }
}

async function getAllCreator(req) {
  try {
    const { uid } = req.userData;
    const classes = await DatabaseClient.findMany("classes", {
      creator: uid,
    });
    return classes;
  } catch (e) {
    console.log(e);
    return { error: "Could not fetch homework information" };
  }
}

async function leave(req) {
  try {
    const { uid } = req.userData;
    const { _id } = req.body;
    const classes = await DatabaseClient.updateOne(
      "classes",
      {
        _id: DatabaseClient.ObjectId(_id),
      },
      {
        $pull: { users: { uid: uid } },
      }
    );
    return classes;
  } catch (e) {
    console.log(e);
    return { error: "Could not fetch homework information" };
  }
}

exports.create = create;
exports.getAll = getAll;
exports.join = join;
exports.getAllUser = getAllUser;
exports.getAllCreator = getAllCreator;
exports.leave = leave;
