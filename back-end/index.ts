const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

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

const port = process.env.APP_PORT || 3001;

app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
