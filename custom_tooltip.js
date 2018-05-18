
Chart.defaults.global.pointHitDetectionRadius = 1;

        var customTooltips = function(tooltip) {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                this._chart.canvas.parentNode.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltip.yAlign) {
                tooltipEl.classList.add(tooltip.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
                return bodyItem.lines;
            }

            // Set Text
            if (tooltip.body) {
                var titleLines = tooltip.title || [];
                var bodyLines = tooltip.body.map(getBody);

                var innerHtml = '<thead>';

                titleLines.forEach(function(title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>';
                });
                innerHtml += '</thead><tbody>';

                bodyLines.forEach(function(body, i) {
                    var colors = tooltip.labelColors[i];
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + body + '</td></tr>';
                });
                innerHtml += '</tbody>';

                var tableRoot = tooltipEl.querySelector('table');
                tableRoot.innerHTML = innerHtml;
            }

            var positionY = this._chart.canvas.offsetTop;
            var positionX = this._chart.canvas.offsetLeft;

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 2;
            tooltipEl.style.left = positionX + tooltip.caretX + 'px';
            tooltipEl.style.top = positionY + tooltip.caretY + 'px';
            tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
            tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
        };

        var lineChartData = {
            labels: ['28May - 8Jun', '9Jun - 24Jun', '25Jun - 10Jul', '11Jul - 26Jul', '27Jul - 11Aug', '12Aug - 27Aug', '28Aug - 12Sep'],
            datasets: [{
                label: 'NDVI 2016',
                borderColor: window.chartColors.red,
                pointBackgroundColor: window.chartColors.red,
                fill: false,
                data: [
                    0.38, 0.45, 0.43, 0.41, 0.50, 0.68, 0.46
                ]
            }, {
                label: 'NDVI 2017',
                borderColor: window.chartColors.blue,
                pointBackgroundColor: window.chartColors.blue,
                fill: false,
                data: [
                    0.11, 0.61, 0.25, 0.22, 0.47, 0.52, 0.22
                ]
            },
                {
                label: 'NDVI 2018',
                borderColor: 'darkgreen',
                pointBackgroundColor: 'darkgreen',
                fill: false,
                data: [
                    0.51, 0.36, 0.48, 0.58, 0.53, 0.41, 0.61
                ]
            }
            ]
        };

        window.onload = function() {
            var chartEl = document.getElementById('ndvi');
            window.myLine = new Chart(chartEl, {
                type: 'line',
                data: lineChartData,
                options: {
                                      title: {
                        display: true,
                        text: 'NDVI',
                        fontSize: 17,
                        fontFamily : 'Alegreya'

                    },
                    tooltips: {
                        backgroundColor: 'rgba(91, 91, 92, 0.87)',
                        enabled: true,
                        mode: 'index',
                        position: 'nearest',
                        xPadding: 16,
                            yPadding: 10,
                            bodyFontSize: 10,
                            bodyFontColor: '#ffffff',
                            fontFamily: 'Alegreya',
                            bodyFontWeight: 600,
                            lineHeight: 1,
                            bodySpacing: 10,
                            titleDisplay: false,
                        //custom: customTooltips
                    },
                    legend : {
            display : true,
            position : "bottom",
            labels : {
            boxWidth : 20,
            fill: true,
            borderRadius: 20,
            fontFamily: 'sans-serif',
            fontSize: 10
        },
         
                }
            }});
        };





// Create the chart
var chart = Highcharts.chart({
    chart: { height: 445,
        type: 'column',
        renderTo: 'container7',
        style : {
            fontFamily : 'Alegreya',

        }
    },
    title: {
        text: 'Field Survey',
    },
    subtitle: {
        text: 'Total Survey = 2308'
    },
    xAxis: {
        type: 'category',
        title: {
            text: 'District'
        }  
    },
    yAxis: {
        title: {
            text: 'Survey'
        }

    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            borderRadius: 5,
            color: "#4d88ff",
            dataLabels: {
                enabled: true,
                format: '{point.y:1f}'
            }
        }
    },

    tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{red}">{point.name}</span>: <b>{point.y:.2f}</b><br/>'
    },

    "series": [
        {
            "name": "District",
            
            "data": [
                {
                    "name": "AL",
                    "y": 90,
                    "drilldown": "AL"
                },
                {
                    "name": "BD",
                    "y": 200,
                    "drilldown": "Firefox"
                },
                {
                    "name": "BB",
                    "y": 130,
                    "drilldown": "Internet Explorer"
                },
                {
                    "name": "BU",
                    "y": 289,
                    "drilldown": "Safari"
                },
                {
                    "name": "FA",
                    "y": 103,
                    "drilldown": "Edge"
                },
                {
                    "name": "GO",
                    "y": 194,
                    "drilldown": "Opera"
                },
                {
                    "name": "GR",
                    "y": 100,
                    "drilldown": null
                },
                    {
                    "name": "HD",
                    "y": 99,
                    "drilldown": "AL"
                },
               ,
               
            ]
        }
    ],
    "drilldown": {
        "series": [
            {
                "name": "Chrome",
                "id": "Chrome",
                "data": [
                    [
                        "v65.0",
                        0.1
                    ],
                    [
                        "v64.0",
                        1.3
                    ],
                    [
                        "v63.0",
                        53.02
                    ],
                    [
                        "v62.0",
                        1.4
                    ],
                    [
                        "v61.0",
                        0.88
                    ],
                    [
                        "v60.0",
                        0.56
                    ],
                    [
                        "v59.0",
                        0.45
                    ],
                    [
                        "v58.0",
                        0.49
                    ],
                    [
                        "v57.0",
                        0.32
                    ],
                    [
                        "v56.0",
                        0.29
                    ],
                    [
                        "v55.0",
                        0.79
                    ],
                    [
                        "v54.0",
                        0.18
                    ],
                    [
                        "v51.0",
                        0.13
                    ],
                    [
                        "v49.0",
                        2.16
                    ],
                    [
                        "v48.0",
                        0.13
                    ],
                    [
                        "v47.0",
                        0.11
                    ],
                    [
                        "v43.0",
                        0.17
                    ],
                    [
                        "v29.0",
                        0.26
                    ]
                ]
            },
            {
                "name": "Firefox",
                "id": "Firefox",
                "data": [
                    [
                        "v58.0",
                        1.02
                    ],
                    [
                        "v57.0",
                        7.36
                    ],
                    [
                        "v56.0",
                        0.35
                    ],
                    [
                        "v55.0",
                        0.11
                    ],
                    [
                        "v54.0",
                        0.1
                    ],
                    [
                        "v52.0",
                        0.95
                    ],
                    [
                        "v51.0",
                        0.15
                    ],
                    [
                        "v50.0",
                        0.1
                    ],
                    [
                        "v48.0",
                        0.31
                    ],
                    [
                        "v47.0",
                        0.12
                    ]
                ]
            },
            {
                "name": "Internet Explorer",
                "id": "Internet Explorer",
                "data": [
                    [
                        "v11.0",
                        6.2
                    ],
                    [
                        "v10.0",
                        0.29
                    ],
                    [
                        "v9.0",
                        0.27
                    ],
                    [
                        "v8.0",
                        0.47
                    ]
                ]
            },
            {
                "name": "Safari",
                "id": "Safari",
                "data": [
                    [
                        "v11.0",
                        3.39
                    ],
                    [
                        "v10.1",
                        0.96
                    ],
                    [
                        "v10.0",
                        0.36
                    ],
                    [
                        "v9.1",
                        0.54
                    ],
                    [
                        "v9.0",
                        0.13
                    ],
                    [
                        "v5.1",
                        0.2
                    ]
                ]
            },
            {
                "name": "Edge",
                "id": "Edge",
                "data": [
                    [
                        "v16",
                        2.6
                    ],
                    [
                        "v15",
                        0.92
                    ],
                    [
                        "v14",
                        0.4
                    ],
                    [
                        "v13",
                        0.1
                    ]
                ]
            },
            {
                "name": "Opera",
                "id": "Opera",
                "data": [
                    [
                        "v50.0",
                        0.96
                    ],
                    [
                        "v49.0",
                        0.82
                    ],
                    [
                        "v12.1",
                        0.14
                    ]
                ]
            }
        ]
    }
});

$(document).ready(function () {

    var ctx = document.getElementById("bar-chartcanvas");
    ctx.height = 220;

    var data = {
        labels : [],
        datasets : [
            {
                label : "",
                data : [],
                backgroundColor : [ ],
                borderColor : [],   
                borderWidth : 1
            },
            {
                label : "",
                data : [],
                backgroundColor : [ ],
                borderColor : [
                    
                ],
                borderWidth : 1
            }
        ]
    };

    var options = {
        title : {
            display : true,
            position : "top",
            text : "Crop Risk Map",
            fontSize : 18,
            fontColor : '#00004d',
            fontFamily : 'Alegreya'
        },
        legend : {
            display : false,
            position : "bottom"
        },
        elements : {
            center : {
                text: 'Test',
                color: 'black',
                fontStyle: 'Helvetica',
            }
        },
        scales : {
            yAxes : [{
                ticks : {
                    min : 0
                }
            }]
        }
    };

    var chart = new Chart( ctx, {
        type : "bar",
        data : data,
        options : options
    });

});


Chart.defaults.global.pointHitDetectionRadius = 1;

        var customTooltips = function(tooltip) {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<table></table>';
                this._chart.canvas.parentNode.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltip.yAlign) {
                tooltipEl.classList.add(tooltip.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
                return bodyItem.lines;
            }

            // Set Text
            if (tooltip.body) {
                var titleLines = tooltip.title || [];
                var bodyLines = tooltip.body.map(getBody);

                var innerHtml = '<thead>';

                titleLines.forEach(function(title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>';
                });
                innerHtml += '</thead><tbody>';

                bodyLines.forEach(function(body, i) {  function datafeed(did){

                                    var searchForm = "<table width= '100%';>"
                                          +"</br>"
                                          +"<tr>Crop harvesting completed. Yield loss of 20-30% is expected as high temperatures have hindered grain formation and it has adversely impacted the crop.</tr>"
                                          
                                          +"<tr>" +"</tr>"
                                         
                                          +"<tr>"
                                          +"<th  width='100';>Rainfall Status</th>"
                                          +"<th  width='120';>Soil Moisture Stress</th>"
                                          +"<th  width='100';>Wet Spell</th>"
                                          +"</tr>"
                                          
                                          +"<tr>"
                                           +"<td>Moderated Wet Condition</td>"
                                          +"<td>Normal Condition</td>"
                                          +"<td>3 Heavy Spells in all phases</td>"
                                          +"</tr>"
                                          
                                           +"<tr>"
                                          +"<th  width='100';>NDVI</th>"
                                          +"<th  width='100';>Dry Spell</th>"
                                          +"<th  width='100';>Insurer</th>"
                                          +"</tr>"
                                          
                                          +"<tr>"
                                          +"<td>Overall District at No Risk</td>"
                                          +"<td>Dry Condition for 4 times in all phases</td>"
                                          +"<td>RGIC</td>"
                                          +"</tr>"
                                          +"</table>";

                                          return searchForm;  

                                    }

                    var colors = tooltip.labelColors[i];
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    var span = '<span class="chartjs-tooltip-key" style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + body + datafeed() + '</td></tr>';
                });
                innerHtml += '</tbody>';

                var tableRoot = tooltipEl.querySelector('table');
                tableRoot.innerHTML = innerHtml;
            }

            var positionY = this._chart.canvas.offsetTop;
            var positionX = this._chart.canvas.offsetLeft;

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 2;
            tooltipEl.style.left = positionX + tooltip.caretX + 'px';
            tooltipEl.style.top = positionY + tooltip.caretY + 'px';
            tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
            tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
        };



$(document).ready(function () {

    var ctx = document.getElementById("bar-chartcanvas2");
    ctx.height = 220;

    var data = { xAxis: {
        title:
    {
        text: 'test'
    }
    },
        labels : ["", "", "", "", "",""],
        datasets : [
            {
                label : "High Risk",
                data : [0,0,0,0,4,0],
                backgroundColor : [
                    "#ff8080",
                    "#ff8080",
                    "#ff8080",
                    "#ff8080",
                    "#ff8080",
                    "#ff8080",

                ],
                borderColor : [
                    "black, "
                ],
                borderWidth : 0

            },
            {
                label : "Moderate Risk",
                data : [0, 3, 0, 0, 0, 3],
                backgroundColor : [
                    "skyblue",
                    "skyblue",
                    "skyblue",
                    "skyblue",
                    "skyblue",
                    "skyblue",

                ],
                borderColor : [
                    "black, "
                ],
                borderWidth : 0,
                borderRadius: 5
            },

            {
                label : "Low Risk",
                data : [0, 0, 0, 2, 0, 0],
                backgroundColor : [
                    "rgb(230, 184, 0)",
                    "rgb(230, 184, 0)",
                    "rgb(230, 184, 0)",
                    "rgb(230, 184, 0)",
                    "rgb(230, 184, 0)",
                    "rgb(230, 184, 0)",
                ],
                borderColor : [
                    "black, "
                ],
                borderWidth : 0
            },
            {
                label : "No Risk",
                data : [1, 0, 1, 0, 0],
                backgroundColor : [
                    "lightgreen",
                    "lightgreen",
                    "lightgreen",
                    "lightgreen",
                    "lightgreen"
                ],
                borderColor : [
                    "darkgreen"
                ],
                borderWidth : 0
            }
        ]
    };

    var options = {
        title : {
            display : true,
            position : "top",
            text : "Risk Rating",
            fontSize : 18,
            fontColor : "#00004d",
            fontFamily : 'Alegreya'
        },
        tooltips: {
            enabled: false,
            mode: 'point',
            position: 'nearest',
            custom: customTooltips,
            //titleFontSize: 16,
            //titleFontColor: 'red',
            xPadding: 16,
            yPadding: 14,
            bodyFontSize: 9,
            bodyFontColor: 'red',
            
            fontFamily: 'AvertaStdPE',
            bodyFontWeight: 400,
            lineHeight: 1,
            //bodySpacing: 10,
                 callbacks: {
                        title: function() {}
                             }
                },

        legend : {
            display : true,
            position : "bottom",
            labels : {
            boxWidth : 15,
            borderRadius: 5,
            fontFamily: 'sans-serif',
            fontSize: 10
        }
    },

    scales : {
            yAxes : [{
                ticks : {
                    min : 0,
                    max : 5,
                },
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Risk Level',
                    fontColor: '#a2a2a2',
                    fontSize: 12,
                    fontweight: 1,

                },
                
            }],
            xAxes: [{
                    gridLines: {
                        display:false
                    },
                    barThickness: 9.5,
                    display: true,
                        scaleLabel: {
                                    display: true,
                                    labelString: '',
                                    fontColor: '#a2a2a2',
                                    fontSize: 12,
                                    fontweight: 600,
                                    lineHeight: 1,
                                    },
                     }],    
        }
    };

    var chart = new Chart( ctx, {
        type : "bar",
        data : data,
        options : options
    });

});




/*------------------- bar-chartcanvas6 ---------------------*/


var randomScalingFactor = function() {
  return (Math.random() > 0.5 ? 1.0 : 1.0) * Math.round(Math.random() * 100);
};
// draws a rectangle with a rounded top
Chart.helpers.drawRoundedTopRectangle = function(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  // top right corner
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  // bottom right   corner
  ctx.lineTo(x + width, y + height);
  // bottom left corner
  ctx.lineTo(x, y + height);
  // top left   
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};
Chart.elements.RoundedTopRectangle = Chart.elements.Rectangle.extend({
  draw: function() {
    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped;
    var borderWidth = vm.borderWidth;

    if (!vm.horizontal) {
      // bar
      left = vm.x - vm.width / 2;
      right = vm.x + vm.width / 2;
      top = vm.y;
      bottom = vm.base;
      signX = 1;
      signY = bottom > top? 1: -1;
      borderSkipped = vm.borderSkipped || 'bottom';
    } else {
      // horizontal bar
      left = vm.base;
      right = vm.x;
      top = vm.y - vm.height / 2;
      bottom = vm.y + vm.height / 2;
      signX = right > left? 1: -1;
      signY = 1;
      borderSkipped = vm.borderSkipped || 'left';
    }
    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
      // borderWidth shold be less than bar width and bar height.
      var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
      borderWidth = borderWidth > barSize? barSize: borderWidth;
      var halfStroke = borderWidth / 2;
      // Adjust borderWidth when bar top position is near vm.base(zero).
      var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
      var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
      var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
      var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
      // not become a vertical line?
      if (borderLeft !== borderRight) {
        top = borderTop;
        bottom = borderBottom;
      }
      // not become a horizontal line?
      if (borderTop !== borderBottom) {
        left = borderLeft;
        right = borderRight;
      }
    }
    // calculate the bar width and roundess
    var barWidth = Math.abs(left - right);
    var roundness = this._chart.config.options.barRoundness || 0.5;
    var radius = barWidth * roundness * 0.5;
    
    // keep track of the original top of the bar
    var prevTop = top;
    
    // move the top down so there is room to draw the rounded top
    top = prevTop + radius;
    var barRadius = top - prevTop;

    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;

    // draw the rounded top rectangle
    Chart.helpers.drawRoundedTopRectangle(ctx, left, (top - barRadius + 1), barWidth, bottom - prevTop, barRadius);

    ctx.fill();
    if (borderWidth) {
      ctx.stroke();
    }
   // restore the original top value so tooltips and scales still work
    top = prevTop;
  },
});

Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);

Chart.controllers.roundedBar = Chart.controllers.bar.extend({
  dataElementType: Chart.elements.RoundedTopRectangle
}); 
    
var ctx = document.getElementById("bar-chartcanvas6").getContext('2d');
ctx.height = 360;
    var myChart = new Chart(ctx, {
                    type: 'roundedBar',
                                data: {
                                    labels: ["Aligarh", "Badaun", "Bara Banki", "Bulandshahr", "Faizabad"],
                                        datasets: [{
                                            label: 'Normal area',
                                            data: [28000, 28000, 28000, 28000, 28000],
                                            backgroundColor: [
                                                        '#417505',
                                                        '#417505',
                                                        '#417505',
                                                        '#417505',
                                                        '#417505'
                                                                                            ],
                                        },  {
                                             label: 'Last year area (2017)',
                                            data: [40000, 40000, 40000, 40000, 40000],
                                            backgroundColor: [
                                                '#f5a623',
                                                '#f5a623',
                                                '#f5a623',
                                                '#f5a623',
                                                '#f5a623'
                                            ],
                                        },{
                                             label: 'Progress area in 2019',
                                            data: [20000, 20000, 20000, 20000, 20000],
                                            backgroundColor: [
                                                '#c72a53',
                                                '#c72a53',
                                                '#c72a53',
                                                '#c72a53',
                                                '#c72a53'
                                            ],
                                        }]
                                                        },
                        options: {
                            title: {
                        display: true,
                        text: 'Sub-District Wise Acreages',
                        fontSize: 17,
                        fontFamily : 'Alegreya'

                    },
                            tooltips: {
                            backgroundColor: 'rgba(91, 91, 92, 0.87)',
                            enabled: true,
                            mode: 'index',
                            position: 'nearest',
                            //custom: customTooltips,
                            xPadding: 16,
                            yPadding: 10,
                            bodyFontSize: 12,
                            bodyFontColor: '#ffffff',
                            fontFamily: 'AvertaStdPE',
                            bodyFontWeight: 600,
                            lineHeight: 1,
                            bodySpacing: 10,
                            titleDisplay: false,
                            //titleFontSize: 20,
                            //cornerRadius: 16,
                            //caretSize: 5,
                            //caretX: 5,
                                },
                            
                            barRoundness: 1,
                                responsive: true,
                                        legend: {
                                                position: 'bottom',
                                                display: true,
                                                    labels: {
                                                        fontColor:  '#a2a2a2',
                                                        fontSize: 8,
                                                        fontweight: 600,
                                                        lineHeight: 1,
                                                        boxWidth: 10,
                                                        }
                                                    },
                                                 hover: {
                                                        mode: 'index'
                                                         },                          
                                scales: {
                                    yAxes: [{
                                        ticks: {
                                                min: 0,
                                                max: 45000,
                                                stepSize: 5000,
                                                },
                                            display: true,
                                                  scaleLabel: {
                                                            display: true,
                                                            labelString: 'AREA (Ha)',
                                                            fontColor: '#a2a2a2',
                                                            fontSize: 12,
                                                            fontweight: 600,
                                                            lineHeight: 1,
                                                            },  
                                            }],
                                        xAxes: [{
                                            gridLines: {
                                                display:false
                                            },
                                            barPercentage: 0.4,
                                            display: true,
                                                scaleLabel: {
                                                            display: true,
                                                            labelString: 'DISTRICT',
                                                            fontColor: '#a2a2a2',
                                                            fontSize: 12,
                                                            fontweight: 600,
                                                            lineHeight: 1,
                                                            },
                                                }], 
                            }
                        }
                    });
/*------------------ end bar-chartcanvas6 -----------------*/


