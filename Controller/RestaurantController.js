const RestaurantModel = require("../Model/RestaurantModel");
const MenuItemsModel = require("../Model/MenuItemsModel");
const { mongoDbError } = require("../Routes/debugger");

module.exports.getRestaurantListByLocID = async (request, response) => {
  let { loc_id } = request.params;
  try {
    let result = await RestaurantModel.find(
      { location_id: loc_id },
      { locality: 1, name: 1, city: 1, image: 1 }
    );
    if (result.length === 0) {
      response.send({
        status: false,
        message: "restaurant is not available for given location",
      });
    } else {
      response.send({
        status: true,
        restaurants: result,
      });
    }
  } catch (error) {
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
      error: error.message,
    });
  }
};

module.exports.getRestaurantDetailsByID = async (request, response) => {
  let { id } = request.params;
  try {
    let result = await RestaurantModel.findById(id); // .findOne({_id:id})
    response.send({
      status: true,
      restaurants: result,
    });
  } catch (error) {
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
      error: error.message,
    });
  }
};

module.exports.filter = async (request, response) => {
  let {
    location,
    mealtype,
    l_cost,
    h_cost,
    sort,
    cuisine,
    page,
    itemsPerPage
  } = request.body;
  page = page ? page : 1;
  sort = sort ? sort : 1;
  itemsPerPage = itemsPerPage ? itemsPerPage : 2;

  let staringIndex = page * itemsPerPage - itemsPerPage;
  let lastIndex = page * itemsPerPage;

  let filterData = {};

  if (location) filterData["location_id"] = location;
  if (mealtype) filterData["mealtype_id"] = mealtype;
  if (l_cost && l_cost) filterData["min_price"] = { $gte: l_cost, $lte: h_cost };
  cuisine && (filterData["cuisine_id"] = { $in: cuisine });

  console.log(filterData);
  try {
    let result = await RestaurantModel.find(filterData, {
      name: 1,
      city: 1,
      locality: 1,
      location_id: 1,
      min_price: 1,
      image: 1,
      cuisine_id: 1,
      cuisine: 1,
    }).sort({ min_price: sort });

    const filterResult = result.slice(staringIndex, lastIndex);
    response.status(200).send({
      status: true,
      result: filterResult,
      pageCount: Math.ceil(result.length / 2),
    });
  } catch (error) {
    response.status(500).send({
      status: false,
      message: "server error",
      error,
    });
  }
};

module.exports.getMenuItems = async (request, response) => {
  let { rest_id } = request.params;
  try {
    let result = await MenuItemsModel.find({ restaurantId: rest_id });
    response.status(200).send({
      status: true,
      menu_items: result,
    });
  } catch (error) {
    mongoDbError(error.message);
    response.status(500).send({
      status: false,
      message: "Invalid id is passed",
    });
  }
};

module.exports.searchRestaurant = async (request, response) => {
  let { restaurant, loc_id } = request.body;

  let result = await RestaurantModel.find({
    name: { $regex: restaurant + ".*", $options: "i" },
    location_id: Number(loc_id),
  });
  response.send({
    status: true,
    result,
  });
};