$(function () {

  let salesChart = null;
  let paymentChart = null;
  let categoryChart = null;
  let productChart = null;
 

  const fetchDashBoardData = async (timeFrame) => {
    const rawData = await fetch(`/admin/dashboard-data?time=${timeFrame}`);
    if (rawData.ok) {
      const data = await rawData.json();
      if (data.status === "success") {
        const { customers, payment,  sales,salesDetails } = data;
        
        document.getElementById('AmountTotal').innerHTML = sales.totalAmount
        // document.getElementById('amountTotal').innerHTML = sales.totalAmount

        console.log(customers)
        console.log(payment.online)
        console.log(payment.cod)
        // console.log(salesDetails{totalAmount});

        salesGraph(sales, salesDetails);
        paymentGraph(payment);

      }
    }
  };




  // =====================================
  // Profit
  // =====================================
  // function salesGraph(sale) {

  //   let totalAmount = sale.totalAmount
  //   let orderCount = sale.orderCount
  //   let label = sale.label
  //   console.log("ggg", label);
  //   var chart = {
  //     series: [
  //       { name: "Orders this month:", data: orderCount },
  //       // { name: "Expense this month:", data: [280, 250, 325, 215, 250, 310, 280, 250] },
  //     ],

  //     chart: {
  //       type: "bar",
  //       height: 345,
  //       offsetX: -15,
  //       toolbar: { show: true },
  //       foreColor: "#adb0bb",
  //       fontFamily: 'inherit',
  //       sparkline: { enabled: false },
  //     },


  //     colors: ["#5D87FF", "#49BEFF"],


  //     plotOptions: {
  //       bar: {
  //         horizontal: false,
  //         columnWidth: "35%",
  //         borderRadius: [6],
  //         borderRadiusApplication: 'end',
  //         borderRadiusWhenStacked: 'all'
  //       },
  //     },
  //     markers: { size: 0 },

  //     dataLabels: {
  //       enabled: false,
  //     },


  //     legend: {
  //       show: false,
  //     },


  //     grid: {
  //       borderColor: "rgba(0,0,0,0.1)",
  //       strokeDashArray: 3,
  //       xaxis: {
  //         lines: {
  //           show: false,
  //         },
  //       },
  //     },

  //     xaxis: {
  //       type: "category",
  //       categories: label,
  //       labels: {
  //         style: { cssClass: "grey--text lighten-2--text fill-color" },
  //       },
  //     },


  //     yaxis: {
  //       show: true,
  //       min: 0,
  //       max: 10,
  //       tickAmount: 4,
  //       labels: {
  //         style: {
  //           cssClass: "grey--text lighten-2--text fill-color",
  //         },
  //       },
  //     },
  //     stroke: {
  //       show: true,
  //       width: 3,
  //       lineCap: "butt",
  //       colors: ["transparent"],
  //     },


  //     tooltip: { theme: "light" },

  //     responsive: [
  //       {
  //         breakpoint: 600,
  //         options: {
  //           plotOptions: {
  //             bar: {
  //               borderRadius: 3,
  //             }
  //           },
  //         }
  //       }
  //     ]


  //   };

  //   var chart = new ApexCharts(document.querySelector("#chart"), chart);
  //   chart.render();




// Initialize a global variable to store the ApexCharts instance


function salesGraph(sale , salesDetails) {
  let orderCount = sale.orderCount;
  let label = sale.label;
 

  // Check if the chart instance is already created
  if (!salesChart) {
    // If not, create a new instance
    salesChart = new ApexCharts(document.querySelector("#chart"), {
      series: [{ name: "Orders ", data: orderCount }],
      chart: {
        type: "bar",
        height: 345,
        offsetX: -15,
        toolbar: { show: true },
        foreColor: "#adb0bb",
        fontFamily: "inherit",
        sparkline: { enabled: false },
      },
      colors: ["#5D87FF", "#49BEFF"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "35%",
          borderRadius: [6],
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'all'
        },
      },
      markers: { size: 0 },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      xaxis: {
        type: "category",
        categories: label,
        labels: {
          style: { cssClass: "grey--text lighten-2--text fill-color" },
        },
      },
      yaxis: {
        show: true,
        min: 0,
        max: Math.max(...orderCount) + 2, // Adjust the max value based on your data
        tickAmount: 4,
        labels: {
          style: {
            cssClass: "grey--text lighten-2--text fill-color",
          },
        },
      },
      stroke: {
        show: true,
        width: 3,
        lineCap: "butt",
        colors: ["transparent"],
      },
      tooltip: { theme: "light" },
      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              }
            },
          }
        }
      ]
    });

    // Render the chart
    salesChart.render();
  } else {
    // If the chart instance already exists, update its configuration and data
    salesChart.updateOptions({
      xaxis: {
        categories: label,
      },
      yaxis: {
        max: Math.max(...orderCount) + 2,
      },
    });

    salesChart.updateSeries([{ data: orderCount }]);
  }






    // =====================================
    // Earning
    // =====================================
    var earning = {

      

      chart: {
        id: "sparkline3",
        type: "area",
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: "sparklines",
        fontFamily: "Plus Jakarta Sans', sans-serif",
        foreColor: "#adb0bb",
      },
      series: [
        {
          name: "Orders",
          color: "#49BEFF",
          data: orderCount,
        },
      ],
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        colors: ["#f3feff"],
        type: "solid",
        opacity: 0.05,
      },

      markers: {
        size: 0,
      },
      tooltip: {
        theme: "dark",
        fixed: {
          enabled: true,
          position: "right",
        },
        x: {
          show: false,
        },
      },
    };
    new ApexCharts(document.querySelector("#earning"), earning).render();

  }





  // =====================================
  // Breakup
  // =====================================
  // var breakup = {
  //   color: "#adb5bd",
  //   series: COD,online,
  //   labels: ["COD","Online"],
  //   chart: {
  //     width: 180,
  //     type: "donut",
  //     fontFamily: "Plus Jakarta Sans', sans-serif",
  //     foreColor: "#adb0bb",
  //   },
  //   plotOptions: {
  //     pie: {
  //       startAngle: 0,
  //       endAngle: 360,
  //       donut: {
  //         size: '75%',
  //       },
  //     },
  //   },
  //   stroke: {
  //     show: false,
  //   },

  //   dataLabels: {
  //     enabled: false,
  //   },

  //   legend: {
  //     show: false,
  //   },
  //   colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],

  //   responsive: [
  //     {
  //       breakpoint: 991,
  //       options: {
  //         chart: {
  //           width: 150,
  //         },
  //       },
  //     },
  //   ],
  //   tooltip: {
  //     theme: "dark",
  //     fillSeriesColor: false,
  //   },
  // };

  // var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
  // chart.render();




//   function paymentGraph(payment) {
//   console.log("Payment:", payment);
//   let online = payment.online;
//   let COD = payment.cod;
//   console.log("Online:", online);
//   console.log("COD:", COD);


//   // document.getElementById('cash').innerHTML ="COD", COD
//   // document.getElementById('onli').innerHTML ="Online", online


//   var breakup = {
//     color: "#adb5bd",
//     series: [COD, online], // Separate series for COD and Online
//     labels: ["COD", "Online"], // Corresponding labels
//     chart: {
//       width: 180,
//       type: "donut",
//       fontFamily: "Plus Jakarta Sans', sans-serif",
//       foreColor: "#adb0bb",
//     },
//     plotOptions: {
//       pie: {
//         startAngle: 0,
//         endAngle: 360,
//         donut: {
//           size: '75%',
//         },
//       },
//     },
//     stroke: {
//       show: false,
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     legend: {
//       show: false,
//     },
//     colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],
//     responsive: [
//       {
//         breakpoint: 991,
//         options: {
//           chart: {
//             width: 150,
//           },
//         },
//       },
//     ],
//     tooltip: {
//       theme: "dark",
//       fillSeriesColor: false,
//     },
//   };

//   var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
//   chart.render();

  
  
// }




// let chart; // Declare a global variable to store the chart instance

// function paymentGraph(payment) {
//     console.log("Payment:", payment);
//     let online = payment.online;
//     let COD = payment.cod;
//     let wallet = payment.wallet
//     console.log("Online:", online);
//     console.log("COD:", COD);
// console.log(wallet,"wallet");
//     // Destroy the existing chart if it exists
//     if (chart) {
//         chart.destroy();
//     }

//     var breakup = {
//         color: "#adb5bd",
//         series: [COD, online],
//         labels: ["COD", "Online"],
//         chart: {
//             width: 180,
//             type: "donut",
//             fontFamily: "Plus Jakarta Sans', sans-serif",
//             foreColor: "#adb0bb",
//         },
//         plotOptions: {
//             pie: {
//                 startAngle: 0,
//                 endAngle: 360,
//                 donut: {
//                     size: '75%',
//                 },
//             },
//         },
//         stroke: {
//             show: false,
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         legend: {
//             show: false,
//         },
//         colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],
//         responsive: [
//             {
//                 breakpoint: 991,
//                 options: {
//                     chart: {
//                         width: 150,
//                     },
//                 },
//             },
//         ],
//         tooltip: {
//             theme: "dark",
//             fillSeriesColor: false,
//         },
//     };

//     chart = new ApexCharts(document.querySelector("#breakup"), breakup);
//     chart.render();
// }

let chart; // Declare a global variable to store the chart instance

function paymentGraph(payment) {
    console.log("Payment:", payment);
    let online = payment.online;
    let COD = payment.cod;
    let wallet = payment.wallet;
    console.log("Online:", online);
    console.log("COD:", COD);
    console.log(wallet, "wallet");

    // Destroy the existing chart if it exists
    if (chart) {
        chart.destroy();
    }

    var breakup = {
        color: "#adb5bd",
        series: [COD, online, wallet],
        labels: ["COD", "Online", "Wallet"], // Added "Wallet" to labels
        chart: {
            width: 180,
            type: "donut",
            fontFamily: "Plus Jakarta Sans', sans-serif",
            foreColor: "#adb0bb",
        },
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '75%',
                },
            },
        },
        stroke: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        colors: ["#5D87FF", "#FFC107", "#FF5733"], // Added color for "Wallet"
        responsive: [
            {
                breakpoint: 991,
                options: {
                    chart: {
                        width: 150,
                    },
                },
            },
        ],
        tooltip: {
            theme: "dark",
            fillSeriesColor: false,
        },
    };

    chart = new ApexCharts(document.querySelector("#breakup"), breakup);
    chart.render();
}








// Vanilla JavaScript
window.addEventListener("load", () => {
  fetchDashBoardData("today");
});




  const timeBtns = document.querySelectorAll("[data-time]");
  timeBtns.forEach((item) => {
    item.addEventListener("click", (event) => {
      timeBtns.forEach((item) => {
        item.classList.remove("time-frame-active");
      });
      fetchDashBoardData(event.currentTarget.dataset.time);
      event.currentTarget.classList.add("time-frame-active");
    });
  });
})



