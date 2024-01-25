const MealTypesModel = require("../Model/MealTypesModel");

module.exports.getMealTypeList = async (request, response) => {
  let result = await MealTypesModel.find();
  response.send({
    status: true,
    meal_types: result,
  });
};
