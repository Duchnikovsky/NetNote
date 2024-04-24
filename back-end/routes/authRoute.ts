import { Router } from "express";
import { getSession, signIn, signOut, signUp } from "../controller/authController";
const express = require("express");

const router: Router = express.Router();

router.get("/getSession", getSession)

router.post('/signIn', signIn)

router.post('/signUp', signUp)

router.post('/signOut', signOut)
module.exports = router;
