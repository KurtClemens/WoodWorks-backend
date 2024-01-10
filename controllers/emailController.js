var nodemailer = require("nodemailer");
const config = require("../config.js");
const User = require("../models/userModel.js");
const {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} = require("firebase/firestore");

const db = getFirestore();

exports.sendEmail = (req, res, next) => {
  const data = req.body;
  console.log("in send email ", req.body);
  var transporter = nodemailer.createTransport({
    service: config.default.emailService,
    host: config.default.emailHost,
    secure: false,
    port: 587,
    auth: {
      user: config.default.emailAddress,
      pass: config.default.emailPassword,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  var mailOptions = {
    from: config.default.emailAddress,
    to: data.recipient,
    subject: data.subject,
    text: data.message,
    html: data.html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send("An error occured sending email");
    } else {
      console.log("Email send: " + info.response);
      res.status(200).send("Email send successfully!");
    }
  });
};

exports.createUser = async (req, res, next) => {
  try {
    const data = req.body;

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", data.email)
    );

    const users = await getDocs(userQuery);
    console.log(users);

    if (users.empty) {
      const email = req.body.email;
      const active = req.body.active;
      const password = req.body.password;
      const hashedPw = await bcrypt.hash(password, 12);

      const user = {
        email: email,
        password: hashedPw,
        active: active,
      };
      await addDoc(collection(db, "users"), user);
      res.status(200).send("User created successfully!");
    } else {
      res.status(403).send("User already exists!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
