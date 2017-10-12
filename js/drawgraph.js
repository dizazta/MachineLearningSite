$(document).ready(function(){
  draw_graph();

  var it;
  $('#run-constant').click(function(){
      if (checkXY()) {
        if($(this).html() != "Stop"){
          it = setInterval(function () {
              runLR();
          },1000);
          $(this).html("Stop");
          $(this).removeClass("w3-purple");
          $(this).addClass("w3-red");
          $('#X-values').attr('disabled', true);
          $('#Y-values').attr('disabled', true);
        } else {
          clearInterval(it);
          $(this).html("Run Constant");
          $(this).removeClass("w3-red");
          $(this).addClass("w3-purple");
          $('#X-values').attr('disabled', false);
          $('#Y-values').attr('disabled', false);
        }
      }
  });

  $('#reset').click(function(){
    $('#error').html(0);
    $('#w0').html(0);
    $('#w1').html(0);
    $('#iteration-number').html(0);
  });

  $('#run').click(function(){
      if (checkXY()) {
        runLR();
      }
  });

});

function checkXY(){
  X = getXValue();
  X = X.split(",");
  Y = getYValue();
  Y = Y.split(",");
  if (Y.length != X.length){
    $('#error').css('color', 'red');
    $('#error').html("Please make sure you have the same number of inputs as outputs")
    return false;
  }
  return true;
}

function runLR(){
  y = getYValue();
  x = getXValue();
  w = getWValue();
  a = getAValue();
  $.ajax({
      type: 'POST',
      //url: "pyfolder/php_link.php",
      url: "pyfolder/test.py",
      data: {"W": w, "X": x, "Y": y, "A": a}, //passing some input here
      dataType: "text",
      success: function(data){
          data = data.split(":");

          y = data[0].split(",");
          y0 = y[0];
          yn = y[1];

          w = data[1].split(",");
          w0 = w[0];
          w1 = w[1];

          $('#w0').html(w0);
          $('#w1').html(w1);

          $('#error').html(data[2]);

          iteration_number = parseInt($('#iteration-number').html());
          $('#iteration-number').html(iteration_number+ 1);

          draw_graph(y0, yn);
      }
  });
}


function getXValue(){
  x = $('#X-values').val();

  return x;
}

function getYValue(){
  y = $('#Y-values').val();
  return y;
}

function getWValue(){
  w0 = $('#w0').html();
  w1 = $('#w1').html();
  w = w0+","+w1;
  return w;
}

function getAValue(){
  return $('#alpha').val();
}




function draw_graph(y0, yn){
  X = getXValue();
  X = X.split(",");
  Y = getYValue();
  Y = Y.split(",");
  data_xy = []
  for (i = 0; i < X.length; i++){
    data_xy.push({
      x: X[i],
      y: Y[i]
    });
  }

  var ctx = $('#myChart');
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'scatter',
    // The data for our dataset
    data: {
      datasets: [{
        type: 'scatter',
        label: "Points",
        pointBackgroundColor: "rgb(255, 12, 244)",
        data: data_xy,
        fill: false,
        showLine: false,
      }, {
        type: 'line',
        label: 'Linear Regression',
        fill: false,
        data: [ {x: 0, y: y0},
                {x: X[X.length-1], y: yn}],
      }]
    },

    // Configuration options go here
    options: {
        animation: false,
          scales: {
              xAxes: [{
                  type: 'linear',
                  position: 'bottom'
              }]
          }
      }
  });
}
