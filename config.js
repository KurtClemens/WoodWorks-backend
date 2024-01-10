const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_SERVICE,
} = process.env;

assert(PORT, "Port is required");
assert(HOST, "Host is required");

exports.default = {
  port: PORT,
  host: HOST,
  emailAddress:EMAIL_ADDRESS,
  emailPassword:EMAIL_PASSWORD,
  emailHost:EMAIL_HOST,
  emailService:EMAIL_SERVICE,
  hostUrl: HOST_URL,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
  },
};
