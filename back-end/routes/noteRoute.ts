import { Router } from "express";
import { createNote, editNote, removeNote } from "../controller/noteController";
const express = require("express");

const router: Router = express.Router();

router.post("/create", createNote);

router.put("/edit", editNote);

router.delete("/remove", removeNote);

module.exports = router;
