const express = require("express");
const router = express.Router();

const userService = require("../services/users.service");

router.get("/", userService.getAllUsers);
router.post("/", userService.createUser);
router.delete("/", userService.removeUser);
router.patch("/", userService.updateUser);

module.exports = router;
