const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const userAuthentication = async (req, res, next) => {
  try {

    const { token } = req.cookies;
    if(!token) return res.status(401).send("Please Login with credentials");

    const decodedMsg = jwt.verify(token, JWT_SECRET);

    const { emailID } = decodedMsg;

    const [user] = await pool.query(
        "Select * from users where emailID = ?",
        [emailID]
    );

    if(user.length < 1) throw new Error("Please create the Account");

    req.user = user[0];
    next();
  }
  catch (err) {
    res.status(500).send("Something went wrong with error: " + err.message);
  }
};

module.exports = { userAuthentication };
