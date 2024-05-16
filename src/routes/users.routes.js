const express = require("express");
const router = express.Router();

const userService = require("../services/users.service");

router.get("/", userService.getAllUsers);
router.post("/", userService.createUser);
router.delete("/:id", userService.removeUser);
router.patch("/:id", userService.updateUser);

module.exports = router;
