const express = require("express");
const Property = require("../models/Property");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "secret_key", (err, decoded) => {
      if (err) {
        return res.status(403).send("Invalid token");
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(403).send("No token provided");
  }
};

router.post("/", authenticate, async (req, res) => {
  const property = new Property({ ...req.body, sellerId: req.user.id });
  property.likes = 0;
  try {
    await property.save();
    res.status(201).send("Property posted");
  } catch (error) {
    res.status(400).send("Error posting property");
  }
});

router.get("/", async (req, res) => {
  const { city, state, minPrice, maxPrice, bedrooms, bathrooms } = req.query;
  let filters = {};

  if (city) filters.city = city;
  if (state) filters.state = state;
  if (minPrice) filters.rentPrice = { ...filters.rentPrice, $gte: minPrice };
  if (maxPrice) filters.rentPrice = { ...filters.rentPrice, $lte: maxPrice };
  if (bedrooms) filters.bedrooms = bedrooms;
  if (bathrooms) filters.bathrooms = bathrooms;

  try {
    const properties = await Property.find(filters);
    res.json(properties);
  } catch (error) {
    res.status(400).send("Error fetching properties");
  }
});

router.get("/my-properties", authenticate, async (req, res) => {
  try {
    const properties = await Property.find({ sellerId: req.user.id });
    res.json(properties);
  } catch (error) {
    res.status(400).send("Error fetching properties");
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!property) {
      return res.status(404).send("Property not found or unauthorized");
    }
    res.send("Property updated");
  } catch (error) {
    res.status(400).send("Error updating property");
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const property = await Property.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user.id,
    });
    if (!property) {
      return res.status(404).send("Property not found or unauthorized");
    }
    res.send("Property deleted");
  } catch (error) {
    res.status(400).send("Error deleting property");
  }
});

router.get("/:propertyId/seller", authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId).populate(
      "sellerId",
      "firstName lastName email phone"
    );

    if (!property) {
      return res.status(404).send("Property not found");
    }

    const seller = property.sellerId;
    if (!seller) {
      return res.status(404).send("Seller not found");
    }

    res.status(200).json({
      name: `${seller.firstName} ${seller.lastName}`,
      email: seller.email,
      phone: seller.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:propertyId/like", authenticate, async (req, res) => {
  try {
    const property = await Property.findById(req.params.propertyId);
    if (!property) {
      return res.status(404).send("Property not found");
    }

    property.likes += 1;
    await property.save();
    res.send("Property liked");
  } catch (error) {
    res.status(400).send("Error liking property");
  }
});

module.exports = router;
