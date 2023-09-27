const routerAdmin = require("express").Router();
const { authorizeAdmin } = require("../middlewares/authorization");
const { getAllUsers } = require("../controllers/admin");

routerAdmin.get("/", authorizeAdmin, getAllUsers);

module.exports = routerAdmin;
