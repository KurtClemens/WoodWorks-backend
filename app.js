const express = require("express");
const cors = require("cors");

const config = require("./config.js");
const userRoute = require("./routes/userRoute.js");
const customerRoute = require("./routes/customerRoute.js");
const invoiceRoute = require("./routes/invoiceRoute.js");
const authorizationRoute = require("./routes/authorizationRoute");


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


//Authorization
//app.use(authorization);

//routes
app.use(authorizationRoute);
//app.use('/admin', adminRoute);
app.use("/user", userRoute);
app.use("/customer", customerRoute);
app.use("/invoice", invoiceRoute);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(config.default.port, () =>
  console.log(`Server is live @ ${config.default.hostUrl}`)
);
