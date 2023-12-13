const express = require("express");

const customerController = require("../controllers/customerController.js");

const router = express.Router();

router.get("/", customerController.getCustomers);
router.get("/:id", customerController.getCustomer);
router.post("/new", customerController.createCustomer);
router.put("/update/:id", customerController.updateCustomer);
router.delete("/delete/:id", customerController.deleteCustomer);

module.exports = router;
