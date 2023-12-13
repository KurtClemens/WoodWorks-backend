const firebase = require("../firebase.js");
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

exports.getUsers = async (req, res, next) => {
  try {
    const users = await getDocs(collection(db, "users"));
    const userArray = [];

    if (users.empty) {
      res.status(400).send("No Users found!");
    } else {
      users.forEach((doc) => {
        const user = new User(
          doc.id,
          doc.data().email,
          doc.data().password,
          doc.data().firstName,
          doc.data().lastName
        );
        userArray.push(user);
      });

      res.status(200).send(userArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const data = req.body;

    const userQuery = query(
      collection(db, "users"),
      where("email", "==", data.email)
    );

    const users = await getDocs(userQuery);

    if (users.empty) {
      await addDoc(collection(db, "users"), data);
      res.status(200).send("User created successfully!");
    } else {
      res.status(403).send("User already exists!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = doc(db, "users", id);

    const userData = await getDoc(user);
    if (userData.data() !== undefined) {
      res.status(200).send(data.data());
    } else {
      res.status(404).send("User not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = doc(db, "users", id);
    const userData = await getDoc(user);
    if (userData.data() !== undefined) {
      await updateDoc(user, data);
      res.status(200).send("User updated successfully!");
    } else {
      res.status(404).send("User not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = doc(db, "users", id);
    const userData = await getDoc(user);
    if (userData.data() !== undefined) {
      await deleteDoc(doc(db, "users", id));
      res.status(200).send("User deleted successfully!");
    } else {
      res.status(404).send("User not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
