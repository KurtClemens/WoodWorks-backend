const express = require("express");
const authorization = require("../middleware/authorization");
const authorizationController = require("../controllers/authorizationController");
const User = require("../models/userModel");

const { check, body } = require("express-validator");
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

const router = express.Router();

//router.get("/login", authorization, authorizationController.getLogin);

//router.get("/signup", authorization, authorizationController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
  ],
  authorizationController.postLogin
);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value, { req }) => {
        const userQuery = query(
          collection(db, "users"),
          where("email", "==", value)
        );

        const users = await getDocs(userQuery);

        if (!users.empty) {
          return Promise.reject(
            "E-Mail exists already, please pick a different one."
          );
        }
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authorizationController.postSignup
);

router.post("/logout", authorizationController.postLogout);

// router.get("/reset", authorizationController.getReset);

// router.post("/reset", authorizationController.postReset);

// router.get("/reset/:token", authorizationController.getNewPassword);

// router.post("/new-password", authorizationController.postNewPassword);

module.exports = router;
