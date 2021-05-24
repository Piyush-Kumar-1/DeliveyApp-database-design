const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");

const redis = require("redis");
const RedisStore = require("connect-redis")(session);

const redisClient = redis.createClient();

const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    name: "qid",
    store: new RedisStore({ client: redisClient }),
    cookie: {
      sameSite: "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      secure: false,
    },
    saveUninitialized: false,
    secret: "keyboard cat",
    resave: false,
  })
);

mongoose.connect(
  "mongodb+srv://piyush:rhino11@cluster0.uzcmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log("connected")
);

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

app.use("/", authRoute);
app.use("/", productRoute);
app.use("/order", orderRoute);

app.get("/", (req, res) => {
  res.json("hello");
});
const port = process.env.PORT || 5000;
app.listen(port);
