const Invoice = require("../models/invoiceModel.js");
const {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

const db = getFirestore();

exports.getInvoices = async (req, res, next) => {
  try {
    const id = req.params.customerId;
    const customer = doc(db, "customers", id);
    //const customerData = (await getDoc(customer)).data();

    const invoices = await getDocs(collection(customer, "invoices"));
    const invoiceArray = [];

    if (invoices.empty) {
      res.status(400).send("No invoices found!");
    } else {
      invoices.forEach((doc) => {
        const invoice = new Invoice(
          doc.id,
          doc.data().number,
          doc.data().content,
          doc.data().amount,
          doc.data().signed,
          doc.data().signature,
          doc.data().payed
        );
        invoiceArray.push(invoice);
      });

      res.status(200).send(invoiceArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.createInvoice = async (req, res, next) => {
  try {
    const id = req.params.customerId;
    const data = req.body;

    const customer = doc(db, "customers", id);
    const customerData = await getDoc(customer);
    if (customerData.data() !== undefined) {
      await addDoc(collection(db, "customers", id, "invoices"), data);
      res.status(200).send("Invoice created successfully!");
    } else {
      res.status(404).send("Customer not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    const invoiceId = req.params.id;

    const customer = doc(db, "customers", customerId);
    //const customerData = await getDoc(customer);
    const invoice = doc(customer, "invoices", invoiceId);
    const invoiceData = await getDoc(invoice);

    if (invoiceData.data() !== undefined) {
      res.status(200).send(invoiceData.data());
    } else {
      res.status(404).send("Invoice for customer not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    const invoiceId = req.params.id;

    const customer = doc(db, "customers", customerId);
    //const customerData = await getDoc(customer);
    const invoice = doc(customer, "invoices", invoiceId);
    const invoiceData = await getDoc(invoice);

    if (invoiceData.data() !== undefined) {
      const data = req.body;
      await updateDoc(invoice, data);
      res.status(200).send("Invoice updated successfully!");
    } else {
      res.status(404).send("Invoice not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const customerId = req.params.customerId;
    const invoiceId = req.params.id;

    const customer = doc(db, "customers", customerId);
    //const customerData = await getDoc(customer);
    const invoice = doc(customer, "invoices", invoiceId);
    const invoiceData = await getDoc(invoice);

    if (invoiceData.data() !== undefined) {
      await deleteDoc(doc(db, "customers", customerId, "invoices", invoiceId));
      res.status(200).send("Invoice deleted successfully!");
    } else {
      res.status(404).send("Invoice not found!");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
