exports.mongo = {
  uri:
    "mongodb+srv://" +
    process.env["username"] +
    ":" +
    process.env["password"] +
    "@project.usqvgth.mongodb.net/?retryWrites=true&w=majority",
};

const privateKey = process.env["firebaseKey"];

exports.firebase = {
  type: "service_account",
  project_id: "btg-showmyhomework",
  private_key_id: "c316f1fc6d85faafc21aebfdf217396c60e117db",
  private_key: privateKey,
  client_email: "auth-840@btg-showmyhomework.iam.gserviceaccount.com",
  client_id: "111829535360100985109",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/auth-840%40btg-showmyhomework.iam.gserviceaccount.com",
};
