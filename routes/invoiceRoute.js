const express = require("express");

const invoiceController = require("../controllers/invoiceController.js");

const router = express.Router();

router.get("/:customerId", invoiceController.getInvoices);
router.get("/:customerId/:id", invoiceController.getInvoice);
router.post("/:customerId/new", invoiceController.createInvoice);
router.put("/:customerId/:id/update/", invoiceController.updateInvoice);
router.delete("/:customerId/:id/delete", invoiceController.deleteInvoice);

module.exports = router;