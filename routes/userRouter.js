require("dotenv").config;
const auth = require("../middleware/auth");
const express = require("express");
const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser } = require("../middleware/finders");
const { getCart } = require("../middleware/finders");


const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET one user
router.get("/:id", getUser, (req, res, next) => {
  res.send(res.user);
});

// LOGIN user with email + password
router.patch("/", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) res.status(404).json({ message: "Could not find user" });
  if (await bcrypt.compare(password, user.password)) {
    try {
      const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res
      .status(400)
      .json({ message: "Email and password combination do not match" });
  }
});

// REGISTER a user
router.post("/", async (req, res, next) => {
  const { name, email, contact, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    contact,
    password: hashedPassword,
  });

  try {
    const newUser = await user.save();

    try {
      const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.JWT_SECRET_KEY
      );
      res.status(201).json({ jwt: access_token, name: name });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a user
router.put("/:id", getUser, async (req, res, next) => {
  const { name, contact, password, avatar, about } = req.body;
  if (name) res.user.name = name;
  if (contact) res.user.contact = contact;
  if (avatar) res.user.avatar = avatar;
  if (about) res.user.about = about;
  if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    res.user.password = hashedPassword;
  }

  try {
    const updatedUser = await res.user.save();
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a user
router.delete("/:id", getUser, async (req, res, next) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// cart stuff

// GET cart items
router.get("/:id/cart",getCart, auth, async (req, res) => {
  try {
    const cart = await Cart.find();
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// add to cart
router.post("/:id/cart", auth, async (req, res, next) => {
  const { name, price, category, img } = req.body;

  let cart;

  img
    ? (cart = new Cart({
        name,
        price,
        category,
        author: req.user._id,
        img,
      }))
    : (product = new Cart({
      name,
      price,
      category,
        author: req.user._id,
      }));

  try {
    const newCart = await cart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// delete item from cart
router.delete("/:id/cart", [auth, getCart], async (req, res, next) => {
  if (req.user._id !== res.cart.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to delete this cart item" });
  try {
    await res.cart.remove();
    res.json({ message: "Removed cart item" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// updated item from cart

router.put("/:id/cart", [auth, getCart], async (req, res, next) => {
  if (req.user._id !== res.cart.author)
    res
      .status(400)
      .json({ message: "You do not have the permission to update this cart" });
  const { name, price, category, img } = req.body;
  if (name) res.cart.name = name;
  if (price) res.cart.price = price;
  if (category) res.cart.category = category;
  if (img) res.cart.img = img;

  try {
    const updatedCart = await res.cart.save();
    res.status(201).send(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



module.exports = router;
