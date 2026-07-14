require("dns").setDefaultResultOrder("ipv4first");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const careerRoutes = require("./routes/careerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const lookbookRoutes = require("./routes/lookbookRoutes");
const luxuryStoryRoutes = require("./routes/luxuryStoryRoutes");
const pressRoutes = require("./routes/pressRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const homeCollectionRoutes = require("./routes/homeCollectionRoutes");
const categoryHighlightRoutes = require("./routes/categoryHighlightRoutes");
const advertisementRoutes = require("./routes/advertisementRoutes");
const affiliateRoutes = require("./routes/affiliateRoutes");
const modelShowcaseRoutes = require("./routes/modelShowcaseRoutes");
const fashionSectionRoutes = require("./routes/fashionSectionRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentWebhookRoutes =
require("./routes/paymentWebhookRoutes");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/luxury-story", luxuryStoryRoutes);
app.use("/api/home-collections", homeCollectionRoutes);
app.use("/api/category-highlights", categoryHighlightRoutes);
app.use("/api/lookbook", lookbookRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", userRoutes);
app.use("/api/advertisements", advertisementRoutes);
app.use("/api/coupons", require("./routes/couponRoutes"));
app.use(
"/api/payment/webhook",
paymentWebhookRoutes
);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/model-showcase", modelShowcaseRoutes);
app.use("/api/attributes", require("./routes/attributeRoutes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/fashion-section", fashionSectionRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/press", pressRoutes);
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/invoice", invoiceRoutes);
app.use("/api/career", careerRoutes);
app.get("/", (req, res) => {
  res.send("🚀 Backend Running Successfully");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "API working fine 🚀",
  });
});

/* mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err)); */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });
