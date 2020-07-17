const app = require("express")();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const { authorize } = require("./middlewares/auth");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const { NODE_PORT, NODE_ENV, DATABASE_URL } = process.env;
const PORT = NODE_PORT || 8000;

const isDevelopment = NODE_ENV === "development";

if (isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

if (isDevelopment) {
  // production
  // app.use(cors({ origin: CLIENT_URL, optionsSuccessStatus: 200 }));
  app.use(cors());
}

app.use("/api", authRoutes);
app.use("/api/users", authorize, userRoutes);

mongoose
  .connect(DATABASE_URL, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `DB connected and the server is runnning at ${PORT}-${NODE_ENV}`
      );
    });
  })
  .catch((err) => {
    console.error("Db connection failed", err);
  });
