const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
// ADD PRODUCT
exports.addProduct = async(req,res)=>{

try{


let imageUrls=[];


// uploaded files
if(req.files && req.files.length>0){


for(let file of req.files){


const result =
await cloudinary.uploader.upload(
`data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
{
folder:"products"
}
);


imageUrls.push(result.secure_url);


}

}


// URL images
if(req.body.imageUrls){

if(Array.isArray(req.body.imageUrls)){

imageUrls=[
...imageUrls,
...req.body.imageUrls
];

}
else{

imageUrls.push(req.body.imageUrls);

}

}



const product=await Product.create({

...req.body,

price:Number(req.body.price),

stock:Number(req.body.stock),

images:imageUrls

});


res.status(201).json(product);


}
catch(err){

res.status(500).json({
error:err.message
});

}


};
// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

   const { search = "", category = "", type = "" } = req.query;

let query = {};

// =====================
// 🔍 SEARCH (multi-word)
// =====================
if (search) {
  const words = search.trim().split(" ").filter(Boolean);

  query.$and = words.map((word) => ({
    $or: [
      { name: { $regex: word, $options: "i" } },
      { category: { $regex: word, $options: "i" } },
      { description: { $regex: word, $options: "i" } },
    ],
  }));
}

// =====================
// 📦 CATEGORY FILTER
// =====================
if (category) {
  query.category = { $regex: category, $options: "i" };
}

// =====================
// 🏷️ TYPE FILTER (IMPORTANT FIX)
// =====================
// TYPE FILTER (FIXED)
if (type && type !== "all") {
  if (type === "new-arrivals") {
    query.isNewArrival = true;
  } else if (type === "sale") {
    query.isSale = true;
  }
}
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    return res.json({
      products,
      totalPages: Math.ceil(total / limit),
      total,
      currentPage: page,
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateProduct = async(req,res)=>{

try{


let imageUrls=[];


// old images
const oldProduct =
await Product.findById(req.params.id);


if(oldProduct.images){

imageUrls=[
...oldProduct.images
];

}



// new upload

if(req.files && req.files.length){


for(let file of req.files){


const result =
await cloudinary.uploader.upload(

`data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

{
folder:"products"
}

);


imageUrls.push(
result.secure_url
);


}

}


// URL images

if(req.body.imageUrls){


if(Array.isArray(req.body.imageUrls)){

imageUrls=[
...imageUrls,
...req.body.imageUrls
];

}
else{

imageUrls.push(req.body.imageUrls);

}

}



const product =
await Product.findByIdAndUpdate(

req.params.id,

{

...req.body,

images:imageUrls,

price:Number(req.body.price),

stock:Number(req.body.stock)

},

{
new:true
}

);


res.json(product);


}
catch(err){

res.status(500).json({
error:err.message
});

}


};


exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const alreadyReviewed =
      product.reviews.find(
        (r) =>
          r.userId.toString() ===
          req.user.id
      );

    if (alreadyReviewed) {
      return res.status(400).json({
        message:
          "You already reviewed this product",
      });
    }

 const user = await User.findById(req.user.id);

if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

const review = {
  userId: req.user.id,
  name: user.name,
  rating: Number(rating),
  comment,
};

    product.reviews.push(review);

    product.numReviews =
      product.reviews.length;

    product.ratings =
      product.reviews.reduce(
        (acc, item) =>
          acc + item.rating,
        0
      ) /
      product.reviews.length;

    await product.save();

    res.json({
      message:
        "Review added successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (r) => r.userId.toString() === req.user.id
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Update review
    review.rating = Number(rating);
    review.comment = comment;

    // Recalculate rating & review count
    product.numReviews = product.reviews.length;

    product.ratings =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => acc + item.rating, 0) /
          product.reviews.length
        : 0;

    await product.save();

    res.json({
      message: "Review updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteProductReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (r) => r.userId.toString() === req.user.id
    );

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    product.reviews = product.reviews.filter(
      (r) => r.userId.toString() !== req.user.id
    );

    product.numReviews = product.reviews.length;

    if (product.reviews.length > 0) {
      product.ratings =
        product.reviews.reduce((acc, item) => acc + item.rating, 0) /
        product.reviews.length;
    } else {
      product.ratings = 0;
    }

    await product.save();

    res.json({
      message: "Review deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getRelatedProducts = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const products = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);

  res.json(products);
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { isFeatured: true };

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      products,          // ⭐ MUST be array
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {

    const products = await Product.find({
      isNewArrival: true
    })
    .sort({ createdAt: -1 })
    .limit(Number(req.query.limit) || 20);


    res.status(200).json({
      success: true,
      products
    });


  } catch (error) {

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
};