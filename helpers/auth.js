const admin = require("firebase-admin");
const config = require("../config");
const serviceAccount = config.firebase;
const { DatabaseClient } = require("./databaseclient");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function decodeToken(authtoken) {
  const decodedToken = await admin.auth().verifyIdToken(authtoken);
  const user = await DatabaseClient.find("users", { uid: decodedToken.uid });
  return [decodedToken, user];
}

function authorise(routeLevel, tokenRequired) {
  return async function (req, res, next) {
    if (routeLevel === undefined && !tokenRequired) {
      next();
      return;
    }
    const { authtoken } = req.headers;
    if (!authtoken) {
      res.json({ error: "No authtoken present in header" });
    }
    try {
      const [decodedToken, user] = await decodeToken(authtoken);
      if (!user) {
        if (decodedToken && tokenRequired && routeLevel === undefined) {
          req.userToCreate = decodedToken;
          next();
        }

        return;
      }
      const { level } = user;
      if (level < (routeLevel || 0)) {
        res.json({ error: "You are not authorised to access this route" });
        return;
      }
      req.userData = user;
      next();
      return;
    } catch (e) {
      console.log(e);
      res.json({ error: "There was a problem authorising the user" });
    }
  };
}

exports.authorise = authorise;
