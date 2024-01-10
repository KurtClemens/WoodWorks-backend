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

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
//const nodemailer = require("nodemailer");
//const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require("express-validator");

const User = require("../models/userModel");

// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         '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'
//     }
//   })
// );

// exports.getLogin = (req, res, next) => {
//   //let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/login", {
//     path: "/login",
//     pageTitle: "Login",
//     errorMessage: message,
//     oldInput: {
//       email: "",
//       password: "",
//     },
//     validationErrors: [],
//   });
// };

// exports.getSignup = (req, res, next) => {
//  // let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/signup", {
//     path: "/signup",
//     pageTitle: "Signup",
//     errorMessage: message,
//     oldInput: {
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationErrors: [],
//   });
// };

exports.postLogin = async (req, res, next) => {
  try {
    console.log("in post login", req.body);
    const email = req.body.email;
    //const password = req.body.password;
    let loadedUser;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).send(errors.array()[0].msg);
      // return res.status(422).render("auth/login", {
      //   path: "/login",
      //   pageTitle: "Login",
      //   errorMessage: errors.array()[0].msg,
      //   oldInput: {
      //     email: email,
      //     password: password,
      //   },
      //   validationErrors: errors.array(),
      // });
    }

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    //const foundUser = (await getDocs(userQuery)).docs.map((doc)=> doc.data());
    const foundUser = await getDocs(userQuery);
    const userArray = [];
    foundUser.forEach((doc) => {
      const user = {
        id: doc.id,
        email: doc.data().email,
        password: doc.data().password,
        isActive: doc.data().active
      };
      userArray.push(user);
    });

    if (foundUser.empty) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = userArray[0];
    // const isEqual = await bcrypt.compare(password, userArray[0].password);
    // if (!isEqual) {
    //   const error = new Error("Wrong password!");
    //   error.statusCode = 401;
    //   throw error;
    // }
console.log("user ",loadedUser);
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser.id,
      },
      "$2y$19$Y1DLSzV3AiN6wiVjXUF0we9seu1LrJkthB1eXGL9c993g8SJThZFO",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, user: loadedUser });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const email = req.body.email;
    const confirmPassword = req.body.confirmPassword;
    const password = req.body.password;

    if (!errors.isEmpty()) {
      return res.status(403).send(errors.array()[0].msg);
      //   res.render("/signup", {
      //     path: "/signup",
      //     pageTitle: "Signup",
      //     errorMessage: errors.array()[0].msg,
      //     oldInput: {
      //       email: email,
      //       password: password,
      //       confirmPassword: confirmPassword,
      //     },
      //     validationErrors: errors.array(),
      //   });
    }

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const foundUser = await getDocs(userQuery);

    if (foundUser.empty) {
      const hashedPw = await bcrypt.hash(password, 12);

      const user = {
        email: email,
        password: hashedPw,
      };
      await addDoc(collection(db, "users"), user);
      //let message = req.flash("error");
      //   if (message.length > 0) {
      //     message = message[0];
      //   } else {
      //     message = null;
      //   }
      // res.redirect(200, "/login");
      res.status(201).send("user created successfully");

      //   res.render('/login', {
      //     path: '/login',
      //     //pageTitle: 'Login',
      //     errorMessage: message,
      //     oldInput: {
      //       email: '',
      //       password: ''
      //     },
      //     validationErrors: []
      //   });
    } else {
      res.status(403).send("User already exists!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
  //     .then(result => {
  //       res.redirect('/login');
  //       // return transporter.sendMail({
  //       //   to: email,
  //       //   from: 'shop@node-complete.com',
  //       //   subject: 'Signup succeeded!',
  //       //   html: '<h1>You successfully signed up!</h1>'
  //       // });
  //     })
  //     .catch(err => {
  //       const error = new Error(err);
  //       error.httpStatusCode = 500;
  //       return next(error);
  //     });
  // };
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
  });
};

// exports.getReset = (req, res, next) => {
//   let message = req.flash("error");
//   if (message.length > 0) {
//     message = message[0];
//   } else {
//     message = null;
//   }
//   res.render("auth/reset", {
//     path: "/reset",
//     pageTitle: "Reset Password",
//     errorMessage: message,
//   });
// };

// exports.postReset = (req, res, next) => {
//   crypto.randomBytes(32, (err, buffer) => {
//     if (err) {
//       console.log(err);
//       return res.redirect("/reset");
//     }
//     const token = buffer.toString("hex");
//     User.findOne({ email: req.body.email })
//       .then((user) => {
//         if (!user) {
//           req.flash("error", "No account with that email found.");
//           return res.redirect("/reset");
//         }
//         user.resetToken = token;
//         user.resetTokenExpiration = Date.now() + 3600000;
//         return user.save();
//       })
//       .then((result) => {
//         res.redirect("/");
//         transporter.sendMail({
//           to: req.body.email,
//           from: "shop@node-complete.com",
//           subject: "Password reset",
//           html: `
//             <p>You requested a password reset</p>
//             <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
//           `,
//         });
//       })
//       .catch((err) => {
//         const error = new Error(err);
//         error.httpStatusCode = 500;
//         return next(error);
//       });
//   });
// };

// exports.getNewPassword = (req, res, next) => {
//   const token = req.params.token;
//   User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
//     .then((user) => {
//       let message = req.flash("error");
//       if (message.length > 0) {
//         message = message[0];
//       } else {
//         message = null;
//       }
//       res.render("auth/new-password", {
//         path: "/new-password",
//         pageTitle: "New Password",
//         errorMessage: message,
//         userId: user._id.toString(),
//         passwordToken: token,
//       });
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postNewPassword = (req, res, next) => {
//   const newPassword = req.body.password;
//   const userId = req.body.userId;
//   const passwordToken = req.body.passwordToken;
//   let resetUser;

//   User.findOne({
//     resetToken: passwordToken,
//     resetTokenExpiration: { $gt: Date.now() },
//     _id: userId,
//   })
//     .then((user) => {
//       resetUser = user;
//       return bcrypt.hash(newPassword, 12);
//     })
//     .then((hashedPassword) => {
//       resetUser.password = hashedPassword;
//       resetUser.resetToken = undefined;
//       resetUser.resetTokenExpiration = undefined;
//       return resetUser.save();
//     })
//     .then((result) => {
//       res.redirect("/login");
//     })
//     .catch((err) => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
