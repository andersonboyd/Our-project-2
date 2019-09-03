var db = require("../models");
var passport = require("../config/passport.js");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app){
  // ------- API/REGISTER
  app.post("/api/register", function (req, res) {
    db.user.create(req.body).then(function (dbUser) {
      res.json(dbUser);
      db.portfolio.create({name: dbUser.username, userId: dbUser.id});
    }).catch(function(err){
      console.log(err.stack);
    });
  });

  // ------- API/LOGIN
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // ------- API/USERS
  app.get("/api/users", isAuthenticated, function (req, res) {
    db.user.findAll({
      include: [{model: db.portfolio}, {as: "portfolio"}]
    }).then(function (dbUser) {
      res.json(dbUser);
    }).catch(function(err){
      console.log(err.stack);
    });
  });
  // ------- API/USERS/:ID - FIND
  app.get("/api/users/:id", isAuthenticated, function (req, res) {
    db.user.findOne({
      where: {
        id: req.params.id
      },
      include: [{model: db.portfolio}, {as: "portfolio"}]
    }).then(function (dbUser) {
      res.json(dbUser);
    }).catch(function(err){
      console.log(err.stack);
    });
  });
  // ------- API/USERS/:ID - DELETE
  app.delete("/api/users/:id", isAuthenticated, function (req, res) {
    db.user.destroy({ where: { id: req.params.id } }).then(function (dbUser) {
      res.json(dbUser);
    }).catch(function(err){
      console.log(err.stack);
    });
  });
  
  // ------- API/COINS
  app.get("/api/coins", isAuthenticated, function(req, res) {
    var query= {};
    if(req.query.portfolioId){
      query.UserId = req.query.portfolioId;
    }
    db.coin.findAll({
      where: query
    }).then(function(dbCoin) {
      res.json(dbCoin);
    }).catch(function(err){
      console.log(err.stack);
    });
  });
  // ------- API/COINS/:NAME 
  app.get("/api/coins/:name", isAuthenticated, function(req, res){
    db.coinType.findOne({
      where: {
        name: req.params.name
      }
    }).then(function(dbCt){
      res.json(dbCt);
    });
  });
    
  // -----------------------------------
  app.post("/api/coins/buy/:id", isAuthenticated, function(req, res) {
    var coinId = req.params.id;
    var amount = 1;
    console.log(amount);    
    db.portfolio.findOne({where: {userId: req.user.id}
    }).then(function(dbP){
      db.coinType.findOne({where:{id: coinId}}).then(function(newCoin){
        var totalCost = newCoin.price * amount;
        console.log(dbP.usdBalance);
        console.log(totalCost);
        if(dbP.usdBalance > totalCost){
          var newBalance = parseFloat(dbP.usdBalance) - parseFloat(totalCost);
          console.log(newBalance);
          db.coin.findOne({where: {portfolioId: dbP.id, coinTypeId: newCoin.id }}).then(function(dbCoin){
            if(!dbCoin){
              db.coin.create({
                name: newCoin.name,
                price: newCoin.price,
                amount: amount,
                coinTypeId: newCoin.id,
                portfolioId: dbP.id
              }).then(function(dbC){
                db.portfolio.update({usdBalance: newBalance}, 
                  {where: {id: dbP.id}}).then(function(dbPo){
                  console.log(dbPo);
                  res.status(200).json(dbPo, dbC);
                });
              }).catch(function(err){
                console.log(err.stack);
              });
            }else{
              db.coin.update({amount: dbCoin.amount + amount},
                {where: {id: dbCoin.id}
                }).then(function(dbC){
                db.portfolio.update({usdBalance: newBalance}, 
                  {where: {id: dbP.id}});
                res.status(200).json(dbC);
                console.log("also a success!");
              }).catch(function(err){
                console.log(err.stack);
              });
            }
          }).catch(function(err){
            console.log(err.stack);
          });
        }else{
          res.status(403).send("Sorry! Not enough money");
          console.log("Sorry!");
        }
      }).catch(function(err){
        console.log(err.stack);
      });
    }).catch(function(err){
      console.log(err.stack);
    });
  });

  app.post("/api/coins/sell/:id", isAuthenticated, function(req, res) {
    var coinId = req.params.id;
    var amount = 1;  
    db.portfolio.findOne({where: {userId: req.user.id}
    }).then(function(dbP){
      db.coinType.findOne({where:{id: coinId}}).then(function(sellCoin){
        var totalCost = sellCoin.price * amount;
        var newBalance = parseFloat(dbP.usdBalance) + parseFloat(totalCost);
        db.coin.findOne({where: {portfolioId: dbP.id, coinTypeId: sellCoin.id }}).then(function(dbCoin){
          if(amount > dbCoin.amount){
            return res.status(403).send("You don't have enough coins to sell!");
          }else{
            db.coin.update({amount: dbCoin.amount - amount},
              {where: {id: dbCoin.id}
              }).then(function(dbC){
              db.portfolio.update({usdBalance: newBalance}, 
                {where: {id: dbP.id}});
              res.status(200).json(dbC);
            }).catch(function(err){
              console.log(err.stack);
            });
          }
        }).catch(function(err){
          console.log(err.stack);
        });
      }).catch(function(err){
        console.log(err.stack);
      });
    }).catch(function(err){
      console.log(err.stack);
    });
  });
};