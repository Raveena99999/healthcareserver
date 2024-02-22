const express = require("express");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("./Database/db");
const { userRouter } = require("./Controllers/user.routes");
const { blogRouter } = require("./Controllers/blogs.router");
const Port = process.env.PORT;
const app = express();
app.use(express.json());
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FullStack 1",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./Controllers/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cookieParser());
app.use(
  cors({
    origin:"http://127.0.0.1:5173",
    credentials: true,
    httpOnly: true,
  })
);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.get("/", (req, res) => {
  res.status(200).send(`<h2>Welcome to my Blogging Website...</h2>`);
});
app.listen(Port, async () => {
  try {
    await connection;
    console.log(`server is running on port ${Port} and Mongo Connected...`);
  } catch (error) {
    console.log(error);
  }
});
