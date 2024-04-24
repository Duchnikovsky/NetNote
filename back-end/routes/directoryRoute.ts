import { Router } from "express";
import {
  createDirectory,
  editDirectory,
  getDirectories,
  getDirectory,
  removeDirectory,
} from "../controller/directoryController";
const express = require("express");

const router: Router = express.Router();

router.get("/getAll", getDirectories);

router.get("/get", getDirectory);

router.post("/create", createDirectory);

router.put("/edit", editDirectory);

router.delete("/remove", removeDirectory);

module.exports = router;
