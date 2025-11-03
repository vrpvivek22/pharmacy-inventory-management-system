const expresss = require("express");
const router = expresss.Router();

const login = require("../controllers/auth/user-login");
const register = require("../controllers/auth/user-register");

router.post("/login", login);
router.post("/register", register);

module.exports = router;
