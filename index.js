
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");

// DB connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to database"));

// express
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(cors());


app.get("/", (req, res, next) => {
  res.send({
    message: "Welcome to my nike api API",

    user_routes: {
      user_register: {
        method: "product",
        route: "/users",
        request_body: {
          name: "String",
          email: "String",
          contact: "String",
          password: "String",
        },
        result: {
          jwt: "String token",
        },
      },
      user_login: {
        method: "PATCH",
        route: "/users",
        request_body: {
          email: "String",
          password: "String",
        },
        result: {
          jwt: "String token",
        },
      },
      all_users: {
        method: "GET",
        route: "/users",
        result: {
          users: "Array",
        },
      },
      single_user: {
        method: "GET",
        route: "/users/:id",
        result: {
          user: "Object",
        },
      },
      update_user: {
        method: "PUT",
        request_body: {
          name: "String",
          email: "String",
          contact: "String",
          password: "String",
          avatar: "String",
          img: "String *optional* (Must be hosted image. I can suggest to host on product Image)",
        },
        route: "/users/:id",
        result: {
          user: "Object",
        },
      },
      delete_user: {
        method: "DELETE",
        route: "/users/:id",
        result: {
          message: "Object",
        },
      },
    },
  product_routes: {
      all_products: {
        method: "GET",
        route: "/products",
        headers: {
          authorization: "Bearer (JWT token)",
        },
        result: {
          products: "Array",
        },
      },
      single_product: {
        method: "GET",
        route: "/products/:id",
        headers: {
          authorization: "Bearer (JWT token)",
        },
        result: {
          product: "Object",
        },
      },
      create_product: {
        method: "product",
        route: "/products/",
        headers: {
          authorization: "Bearer (JWT token)",
        },
        request_body: {
          title: "String",
          body: "String",
          img: "String *optional* (Must be hosted image. I can suggest to host on product Image)",
        },
        result: {
          product: "Object",
        },
      },
      update_product: {
        method: "PUT",
        route: "/products/:id",
        headers: {
          authorization: "Bearer (JWT token)",
        },
        request_body: {
          title: "String *optional*",
          body: "String *optional*",
          img: "String *optional* (Must be hosted image. I can suggest to host on product Image)",
        },
        result: {
          product: "Object",
        },
      },
      delete_product: {
        method: "DELETE",
        route: "/products/:id",
        result: {
          message: "Object",
        },
      },
    },
  });
});
app.use("/users", userRouter);
app.use("/products", productRouter);

app.listen(app.get("port"), (server) => {
  console.info(`Server listen on port ${app.get("port")}`);
  console.info("Press CTRL + C to close the server");
});
// Status code reminders

// 200s => All good
// 400s => User input errors
// 500s => Server errors