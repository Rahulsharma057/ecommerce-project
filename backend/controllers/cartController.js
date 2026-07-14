const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    // FIX: color/size now accepted from the request body — before, these
    // were silently dropped even if the frontend sent them.
    const { productId, quantity, color = "", size = "" } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    // Same product + same color + same size = same cart line (quantity bumps).
    // Same product but different color/size = a NEW separate cart line.
    const existing = await Cart.findOne({ userId, productId, color, size });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();

      const populated = await existing.populate("productId");
      return res.json({ message: "Updated", cart: populated });
    }

    const cart = await Cart.create({
      userId,
      productId,
      quantity: quantity || 1,
      color,
      size,
    });

    const populated = await cart.populate("productId");
    res.status(201).json(populated);
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

// VALIDATE CART STOCK (before checkout) — also auto-corrects quantities
// that now exceed available stock, and drops fully out-of-stock items.
const validateCartStock = async (req, res) => {
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
          productId: product._id,
          message: `${product.name} is out of stock`,
          removed: true,
        });
        await Cart.findByIdAndDelete(item._id);
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
        await item.save();
      }

      updatedCart.push(item);
    }

    res.json({
      ok: changes.length === 0,
      cart: updatedCart,
      changes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
  validateCartStock,
};