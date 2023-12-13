const express = require("express");
const cors = require("cors");

const config = require("./config.js");
const userRoute = require("./routes/userRoute.js");
const customerRoute = require("./routes/customerRoute.js");
const invoiceRoute = require("./routes/invoiceRoute.js");

const app = express();

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// });

//routes
app.use("/user", userRoute);
app.use("/customer", customerRoute);
app.use("/invoice", invoiceRoute);

app.listen(config.default.port, () =>
  console.log(`Server is live @ ${config.default.hostUrl}`)
);
