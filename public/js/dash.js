$(document).ready(function(){
  var $buyBtn = $("#buyBtn");
  var $sellBtn = $("#sellBtn");
  var $buyCoin = $("#inputBuyCoin");
  var $buyAmt = $("#inputBuyAmount");
  var $sellCoin = $("#inputSellCoin");
  var $sellAmt = $("#inputSellAmount");
  var $history = $("#tradeHistory");
  var $portfolio = $("#folio");
  var $bal = $("#buyBalance");
  var $ance = $("#sellBalance")

  function buyCoin(coin, amount){
    console.log(coin);
    console.log(amount);
    $.ajax({
      method: "GET",
      url: "/api/coins/" + coin
    }).then(function(dat){
      console.log(dat);
      coinId = dat.id;
      $.ajax({
        method: "POST",
        url: "/api/coins/buy/" + coinId,
        data: amount
      }).then(function(response){
        console.log(response);
        var $tr = $("<tr></tr>");
        var $td = $("<td></td>").text(`Bought ${amount} ${coin}`);
        $tr.prepend($td);
        $history.prepend($tr);
        $.ajax({
          method: "GET",
          url: "/api/portfolio/"
        }).then(function(resp){
          console.log(resp);
          $bal.text(resp.usdBalance);
          $ance.text(resp.usdBalance);
          // var $row = $("<tr></tr>");
          // var $cell = $("<td></td>").text(`${resp}`)
        }).catch(function(err){
          console.log(err.stack);
        });
        // location.reload();
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
        // location.reload();
        var $tr = $("<tr></tr>");
        var $td = $("<td></td>").text(`Sold ${amt} ${coin}`);
        $tr.prepend($td);
        $history.prepend($tr);
        $.ajax({
          method: "GET",
          url: "/api/portfolio/"
        }).then(function(resp){
          console.log(resp);
          $bal.text(resp.usdBalance);
          $ance.text(resp.usdBalance);
        }).catch(function(err){
          console.log(err.stack);
        });
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
    buyCoin(coin, amount);
  }

  function handleSell(event){
    event.preventDefault();
    var coin = $sellCoin.val();
    var amt = $sellAmt.val();
    sellCoin(coin, amt);
  }

  $buyBtn.on("click", handleBuy);
  $sellBtn.on("click", handleSell);
});