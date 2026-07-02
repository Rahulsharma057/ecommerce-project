const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");


const validateCartStock = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ userId }).populate("productId");

    let outOfStockItems = [];
    let adjustedCart = [];

    for (let item of cart) {
      const product = item.productId;

      if (!product) continue;

      // ❌ out of stock
      if (product.stock === 0) {
        outOfStockItems.push({
          productId: product._id,
          name: product.name,
          available: 0,
        });
        continue;
      }

      // ⚠️ less stock than cart quantity
      if (item.quantity > product.stock) {
        adjustedCart.push({
          productId: product._id,
          name: product.name,
          requested: item.quantity,
          available: product.stock,
          correctedQuantity: product.stock,
        });
      }
    }

    return res.json({
      ok: outOfStockItems.length === 0 && adjustedCart.length === 0,
      outOfStockItems,
      adjustedCart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();

      return res.json({ message: "Updated", cart: existing });
    }

    const cart = await Cart.create({
      userId,
      productId,
      quantity
    });

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ userId }).populate("productId");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// REMOVE
const removeFromCart = async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE QUANTITY
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.id;
    const { type } = req.body;

    const cartItem = await Cart.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (type === "inc") {
      cartItem.quantity += 1;
    } else if (type === "dec") {
      cartItem.quantity -= 1;

      if (cartItem.quantity <= 0) {
        await Cart.findByIdAndDelete(cartId);
        return res.json({ message: "Removed" });
      }
    }

    await cartItem.save();

    res.json({ message: "Updated", cart: cartItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.validateCartStock = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.find({ userId }).populate("productId");

    let updatedCart = [];
    let changes = [];

    for (let item of cart) {
      const product = item.productId;

      if (!product) continue;

      if (product.stock === 0) {
        changes.push({
          productId: item.productId._id,
          message: `${product.name} is out of stock`,
          removed: true,
        });
        continue;
      }

      if (item.quantity > product.stock) {
        changes.push({
          productId: product._id,
          message: `${product.name} reduced to ${product.stock}`,
          oldQty: item.quantity,
          newQty: product.stock,
        });

        item.quantity = product.stock;
      }

      updatedCart.push(item);
    }

    // save updated quantities
    for (let item of updatedCart) {
      await item.save();
    }

    res.json({
      cart: updatedCart,
      changes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔥 IMPORTANT EXPORT
module.exports = {
  addToCart,
  getCart,
  removeFromCart,updateCart ,validateCartStock
};