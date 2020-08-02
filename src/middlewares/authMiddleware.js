const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const jwtToken = req.header("Authorization");

  if (!jwtToken)
    return res.status(401).send("Access denied, valid token needed");

  try {
    const verified = jwt.verify(jwtToken, process.env.TOKEN_KEY);
    req.user = verified;

    next();
  } catch (error) {
    res.status(400).send("Access denied, Invalid Token");
  }
}

module.exports = auth;
