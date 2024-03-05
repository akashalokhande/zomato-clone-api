const express = require("express");
const router = express.Router();
const location = require("../Controller/LocationController");
const restaurant = require("../Controller/RestaurantController");
const mealtype = require("../Controller/MealTypeController");
const payment  = require("../Controller/PaymentController")


router.get("/api/get-location-list", location.getLocationList);

router.get("/api/get-meal-types-list", mealtype.getMealTypeList);

router.post("/api/search-restaurant", restaurant.searchRestaurant);
router.get(
  "/api/get-restaurant-list-loc-id/:loc_id",
  restaurant.getRestaurantListByLocID
);

router.get(
  "/api/get-restaurant-details-by-id/:id",
  restaurant.getRestaurantDetailsByID
);

router.post("/api/filter", restaurant.filter);

router.get("/api/get-menu-items/:rest_id", restaurant.getMenuItems);

router.post("/api/gen-order-id", payment.genOrderId);
router.post("/api/verify-payment", payment.verifyPayment);
router.get("/api/my-order/:email", payment.OrderList);

module.exports = router;
