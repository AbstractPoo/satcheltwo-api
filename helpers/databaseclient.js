const { MongoClient, ObjectId } = require("mongodb");
const config = require("../config.js");

const mongoConfig = config.mongo;

const uri = mongoConfig.uri;

function wrapDatabaseClient(method) {
  return async function (...args) {
    try {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        return await method(client, ...args);
      } finally {
        await client.close();
      }
    } catch (e) {
      return { error: "Could not connect to the database" };
    }
  };
}

const blackListMethods = ["ObjectId"];

function wrapClassMethods(cl) {
  Object.getOwnPropertyNames(cl.prototype)
    .filter((method) => {
      return !blackListMethods.includes(method);
    })
    .forEach((method) => {
      const oldMethod = cl.prototype[method];
      cl.prototype[method] = wrapDatabaseClient(oldMethod);
    });
}

class DatabaseClient {
  async find(client, collection, document) {
    return await client.db("project").collection(collection).findOne(document);
  }

  async insertOne(client, collection, document) {
    return await client
      .db("project")
      .collection(collection)
      .insertOne(document);
  }

  async findMany(client, collection, document) {
    return await client
      .db("project")
      .collection(collection)
      .find(document)
      .toArray();
  }

  async updateOne(client, collection, query, document) {
    return await client
      .db("project")
      .collection(collection)
      .updateOne(query, document);
  }

  async deleteMany(client, collection, query) {
    return await client.db("project").collection(collection).deleteMany(query);
  }

  async deleteOne(client, collection, query) {
    return await client.db("project").collection(collection).deleteOne(query);
  }

  async aggregate(client, collection, query) {
    const res = await client
      .db("project")
      .collection(collection)
      .aggregate(query)
      .toArray();
    return res;
  }

  ObjectId(id) {
    return new ObjectId(id);
  }
}

const dbClient = new DatabaseClient();

wrapClassMethods(DatabaseClient);

exports.DatabaseClient = dbClient;
