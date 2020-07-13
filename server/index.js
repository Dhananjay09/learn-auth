const app = require("express")();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/auth");

const PORT = process.env.NODE_PORT || 8000;

app.use(morgan("dev"));

app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(cors({ origin: process.env.CLIENT_URL, optionsSuccessStatus: 200 }));
}

mongoose
  .connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB connection failed", err));

// Middlewares or routes
app.use("/api", authRoutes);

app.listen(PORT, () => {
  console.log(`The server is running at ${PORT}-${process.env.NODE_ENV}`);
});
