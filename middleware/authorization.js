const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("in authorization ",)

  const authHeader = req.get('Authorization');
  console.log(req.get('Authorization'))
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "$2y$19$Y1DLSzV3AiN6wiVjXUF0we9seu1LrJkthB1eXGL9c993g8SJThZFO");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}

//   const authHeader = req.get("Authorization");
//   if (!authHeader) {
//     req.isAuth = false;
//     return next();
//   }
//   const token = authHeader.split(" ")[1];
//   let decodedToken;
//   try {
//     decodedToken = jwt.verify(token, "$2y$19$Y1DLSzV3AiN6wiVjXUF0we9seu1LrJkthB1eXGL9c993g8SJThZFO");
//   } catch (err) {
//     req.isAuth = false;
//     return next();
//   }
//   if (!decodedToken) {
//     req.isAuth = false;
//     return next();
//   }
//   req.userId = decodedToken.userId;
//   req.isAuth = true;
//   next();
// };
