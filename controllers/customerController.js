const firebase = require("../firebase.js");
const Customer = require("../models/customerModel.js");
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

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await getDocs(collection(db, "customers"));
    const customerArray = [];

    if (customers.empty) {
      res.status(400).send("No customers found");
    } else {
      customers.forEach((doc) => {
        const customer = new Customer(
          doc.id,
          doc.data().email,
          doc.data().city,
          doc.data().postalCode,
          doc.data().street,
          doc.data().number,
          doc.data().phoneNumber,
          doc.data().lastName,
          doc.data().firstName
        );
        customerArray.push(customer);
      });

      res.status(200).send(customerArray);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const data = req.body;

    const customerQuery = query(
      collection(db, "customers"),
      where("email", "==", data.email)
    );

    const customers = await getDocs(customerQuery);

    if (customers.empty) {
      await addDoc(collection(db, "customers"), data);
      res.status(200).send("Customer created successfully");
    } else {
      res.status(403).send("Customer already exists");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const customer = doc(db, "customers", id);
    const customerData = await getDoc(customer);
    if (customerData.data() !== undefined) {
      res.status(200).send(customerData.data());
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const customer = doc(db, "customers", id);
    const customerData = await getDoc(customer);
    if (customerData.data() !== undefined) {
      await updateDoc(customer, data);
      res.status(200).send("Customer updated successfully");
    } else {
      res.status(404).send("Customer not found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    //const invoiceId = req.params.id;

    const customer = doc(db, "customers", customerId);
    const customerData = await getDoc(customer);
    const invoices = await getDocs(collection(customer, "invoices"));
    //const invoiceData = await getDoc(invoice);

    if (customerData.data() === undefined) {
      res.status(404).send("Customer not found");
    } else {
      if (invoices.empty) {
        await deleteDoc(doc(db, "customers", customerId));
        res.status(200).send("Customer deleted successfully");
      } else {
        res
          .status(403)
          .send("Customer cannot be deleted! Customer still has invoices!");
      }
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
