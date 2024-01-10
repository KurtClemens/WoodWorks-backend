const express = require("express");

const userController = require("../controllers/userController.js");

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.post("/new", userController.createUser);
router.put("/:id/update", userController.updateUser);
router.delete("/:id/delete", userController.deleteUser);

module.exports = router;
