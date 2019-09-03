var db = require("../models");
var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(function () {
  db.coinType.bulkCreate([
    {
      name: "Bitcoin",
      price: 10520.99
    },
    {
      name: "Ethereum",
      price: 222.34
    },
    {
      name: "Tether",
      price: 1.01
    },
    {
      name: "Litecoin",
      price: 96.45
    }
  ]).then(function (coins) {
    console.log(coins);
  });
  db.user.create(
    {
      username:"test",
      email:"test@test.com",
      password:"test"
    }
  ).then(function(user){
    console.log(user);
  });
});