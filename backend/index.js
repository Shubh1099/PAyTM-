require("dotenv").config();
const express = require("express");
const cors = require("cors");

const accountRouter = require("./routes/accounts");
const rootRouter = require("./routes/index");
const userRouter = require("./routes/user");

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", rootRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/account", accountRouter);

app.listen(PORT, console.log(`App is Lsitening on port : ${PORT}`));
