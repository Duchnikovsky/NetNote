const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoute = require("./routes/authRoute");
const directoryRoute = require("./routes/directoryRoute");
const notesRoute = require("./routes/noteRoute");

app.use("/auth", authRoute);
app.use("/directory", directoryRoute);
app.use("/note", notesRoute);

async function cleanup() {
  await prisma.$disconnect();
  console.log("Prisma client disconnected.");
}

process.on("beforeExit", async () => {
  await cleanup();
});

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
