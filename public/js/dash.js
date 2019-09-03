$(document).ready(function(){
  var $buyBtn = $("#buyBtn");
  var $sellBtn = $("#sellBtn");
  var $buyCoin = $("#inputBuyCoin");
  var $buyAmt = $("#inputBuyAmount");
  var $sellCoin = $("#inputSellCoin");
  var $sellAmt = $("#inputSellAmount");  

  function buyCoin(coin, amount){
    console.log(coin);
    console.log(amount);
    $.ajax({
      method: "GET",
      url: "/api/coins/" + coin
    }).then(function(dat){
      coinId = dat.id;
      $.ajax({
        method: "POST",
        url: "/api/coins/buy/" + coinId,
        data: amount
      }).then(function(response){
        console.log(response);
        location.reload();
      }).catch(function(err){
        console.log(err.stack);
      });
    }).catch(function(err){
      console.log(err.stack);
    });
  }

  function sellCoin(coin, amt){
    $.ajax({
      method: "GET",
      url: "/api/coins/" + coin
    }).then(function(data){
      console.log(data);
      coinId = data.id;
      $.ajax({
        method: "POST",
        url: "/api/coins/sell/" + coinId,
        data: amt
      }).then(function(response){
        console.log(response);
        location.reload();
      }).catch(function(err){
        console.log(err.stack);
      });
    }).catch(function(err){
      console.log(err.stack);
    });
  }

  function handleBuy(event){
    event.preventDefault();
    var coin = $buyCoin.val();
    var amount = $buyAmt.val();
    console.log(amount);
    buyCoin(coin, amount);
  }

  function handleSell(event){
    event.preventDefault();
    var coin = $sellCoin.val();
    var amt = $sellAmt.val();
    console.log(coin);
    console.log(amount);
    sellCoin(coin, amt);
  }

  $buyBtn.on("click", handleBuy);
  $sellBtn.on("click", handleSell);
});