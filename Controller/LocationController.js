const LocationsModel = require("../Model/LocationsModel");

module.exports.welcome = (request, response) => {
  response.send("Welcome to api");
};

module.exports.getLocationList = async (request, response) => {
  let result = await LocationsModel.find();
  response.send({
    status: true,
    location: result,
  });
};
