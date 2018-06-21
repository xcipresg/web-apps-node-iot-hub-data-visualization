$(document).ready(function () {
    var timeData = [],
    temperatureCPUsData = [],
    totalLoadCPUsData = [];

    var data = {
        labels: timeData,
        datasets: [
            {
                fill: false,
                label: 'Temperatura Total CPUs',
                yAxisID: 'Temperatura Total CPUs',
                borderColor: "rgba(255, 204, 0, 1)",
                pointBoarderColor: "rgba(255, 204, 0, 1)",
                backgroundColor: "rgba(255, 204, 0, 0.4)",
                pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                data: temperatureCPUsData

            },
            {
                fill: false,
                label: 'Carga Total CPUs',
                yAxisID: 'Carga Total CPUs',
                borderColor: "rgba(24, 120, 240, 1)",
                pointBoarderColor: "rgba(24, 120, 240, 1)",
                backgroundColor: "rgba(24, 120, 240, 0.4)",
                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                data: totalLoadCPUsData
            }
        ]
    }

  var basicOption = {
    title: {
      display: true,
      text: 'Dades Temperatura Total CPUs & Carga Total CPUs a Temps Real',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperatura Total',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperatura(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Carga Total',
          type: 'linear',
          scaleLabel: {
            labelString: 'Carga(%)',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
    ws.onmessage = function (message) {
        console.log('receive message' + message.data);
        try {
            var obj = JSON.parse(message.data);
            if (!obj.time || !obj.temperature) {
                return;
            }
            timeData.push(obj.time);
            temperatureCPUsData.push(obj.temperature);
            // only keep no more than 50 points in the line chart
            const maxLen = 50;
            var len = timeData.length;
            if (len > maxLen) {
                timeData.shift();
                temperatureCPUsData.shift();
            }

            if (obj.humidity) {
                totalLoadCPUsData.push(obj.humidity);
            }
            if (totalLoadCPUsData.length > maxLen) {
                totalLoadCPUsData.shift();
            }

            myLineChart.update();
        } catch (err) {
            console.error(err);
        }
    }
});
