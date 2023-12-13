const express = require("express");

const invoiceController = require("../controllers/invoiceController.js");

const router = express.Router();

router.get("/:customerId", invoiceController.getInvoices);
router.get("/:customerId/:id", invoiceController.getInvoice);
router.post("/:customerId/new", invoiceController.createInvoice);
router.put("/:customerId/update/:id", invoiceController.updateInvoice);
router.delete("/:customerId/delete/:id", invoiceController.deleteInvoice);

module.exports = router;