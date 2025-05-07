import { useState, useEffect, React } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { toast } from "react-toastify";
import ReactApexChart from "react-apexcharts";
import { useQuery } from "react-query";

import { Autocomplete, TextField, Box } from "@mui/material";
const CurrencyExchange = () => {
  const { data: currency } = useQuery("getCurrency");
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [rangeValue, setRangeValue] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const currencies = ["THB", "USD", "EUR", "GBP"]; // Simple currency codes
  // State for chart data
  const [chartData, setChartData] = useState({
    series: [
      { name: "Desktops", data: [] },
      { name: "Mobile", data: [] },
    ],
    options: {
      chart: { height: 200, type: "line", zoom: { enabled: false } },

      dataLabels: { enabled: false },
      xaxis: { categories: [] }, // Initially empty
      stroke: { curve: "straight" },
      title: { text: "Product Trends by Month", align: "left" },
      grid: { row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 } },
      colors: [
        "#203764", // Dark Blue
        "#ffc300", // Yellow
        "#2ecc71", // Green
        "#e74c3c", // Red
        "#8e44ad", // Purple
        "#3498db", // Light Blue
        "#f39c12", // Orange
        "#2c3e50", // Dark Grey
        "#d35400", // Pumpkin
        "#27ae60", // Emerald Gre,
      ],
      yaxis: {
        title: { text: "Exchange Rate" },
        labels: { formatter: (value) => `${value}` },
        max: rangeValue.overallMax, // Using value from API
        min: rangeValue.overallMin, // Using value from API
        tickAmount: 3, // Optional: one tick per integer (31 to 37)
      },
    },
  });
  // const getFxRateHistoryGraph = (fx_id) => {
  //   axios
  //     .get(`${API_BASE_URL}/getFxRateHistoryGraph?fx_id=${fx_id}`)
  //     .then((res) => {
  //       console.log("Graph Data:", res.data);
  //       // Handle graph data here
  //     })
  //     .catch((err) => console.error(err));
  // };
  // const getFxRateHistoryGraph = (fx_id) => {
  //   axios
  //     .get(`${API_BASE_URL}/getFxRateHistoryGraph?fx_id=${fx_id}`)
  //     .then((res) => {
  //       const { data, overall } = res.data;

  //       if (data.length > 0 && data[0]?.rates?.length > 0) {
  //         const currencyData = data[0];
  //         const seriesData = currencyData.rates.map((rate) => rate.value);
  //         const categories = currencyData.rates.map((rate) => rate.date);

  //         setState((prevState) => ({
  //           ...prevState,
  //           series: [
  //             {
  //               name: currencyData.currency,
  //               data: seriesData,
  //             },
  //           ],
  //           options: {
  //             ...prevState.options,
  //             xaxis: {
  //               ...prevState.options.xaxis,
  //               categories: categories,
  //             },
  //             yaxis: {
  //               ...prevState.options.yaxis,
  //               min: Math.floor(overall.overallMin),
  //               max: Math.ceil(overall.overallMax),
  //             },
  //             title: {
  //               ...prevState.options.title,
  //               text: `Exchange Rate History - ${currencyData.currency}`,
  //             },
  //           },
  //         }));
  //       } else {
  //         // ✅ If no data is returned, clear the chart
  //         setState((prevState) => ({
  //           ...prevState,
  //           series: [],
  //           options: {
  //             ...prevState.options,
  //             xaxis: {
  //               ...prevState.options.xaxis,
  //               categories: [],
  //             },
  //             title: {
  //               ...prevState.options.title,
  //               text: `No exchange rate data available`,
  //             },
  //           },
  //         }));
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching graph data:", err);
  //     });
  // };
  const getFxRateHistoryGraph = (fx_id = null) => {
    const url = fx_id
      ? `${API_BASE_URL}/getFxRateHistoryGraph?fx_id=${fx_id}`
      : `${API_BASE_URL}/getFxRateHistoryGraph`;

    axios
      .get(url)
      .then((res) => {
        const { data, overall } = res.data;

        if (data.length > 0) {
          const newSeries = data.map((currencyItem) => ({
            name: currencyItem.currency,
            data: currencyItem.rates.map((rate) => rate.value),
          }));

          // Use the dates of the first currency's data for x-axis
          const categories = data[0].rates.map((rate) => rate.date) || [];

          setState((prevState) => ({
            ...prevState,
            series: newSeries,
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: categories,
              },
              yaxis: {
                ...prevState.options.yaxis,
                min: Math.floor(overall.overallMin),
                max: Math.ceil(overall.overallMax),
              },
              title: {
                ...prevState.options.title,
                text: fx_id
                  ? `Exchange Rate History - ${data[0].currency}`
                  : "Combined Exchange Rate History",
              },
            },
          }));
        } else {
          // Clear chart if no data
          setState((prevState) => ({
            ...prevState,
            series: [],
            options: {
              ...prevState.options,
              xaxis: {
                ...prevState.options.xaxis,
                categories: [],
              },
              title: {
                ...prevState.options.title,
                text: "No exchange rate data available",
              },
            },
          }));
        }
      })
      .catch((err) => {
        console.error("Error fetching graph data:", err);
      });
  };
  useEffect(() => {
    getFxRateHistoryGraph(); // No fx_id = all currencies
  }, []);

  const handleCurrencyChange = (event, newValue) => {
    setSelectedCurrency(newValue);
    if (newValue?.ID) {
      getFxRateHistoryGraph(newValue.ID);
    }
  };

  const getAllFx = () => {
    axios
      .get(`${API_BASE_URL}/GetFxRate`)
      .then((res) => {
        setData(res.data.data);
        setSearchApiData(res.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  // const getAllFx1 = () => {
  //   axios
  //     .get(`${API_BASE_URL}/getFxRateHistoryGraph`)
  //     .then((res) => {
  //       console.log(res);
  //       setRangeValue(res.data);

  //       const graphDataArray = res.data.data; // Assuming your API response contains an array of objects
  //       const categories = graphDataArray[0]?.rates.map((item) => item.date); // Extract categories (dates) from the first data item

  //       // Map through the data dynamically to construct series array
  //       const dynamicSeries = graphDataArray.map((item) => ({
  //         name: item.currency, // Get currency name dynamically
  //         data: item.rates.map((rate) => rate.value), // Get values dynamically
  //       }));

  //       console.log(categories);

  //       // Update chart data dynamically
  //       setChartData({
  //         ...chartData,
  //         series: dynamicSeries, // Use dynamically generated series
  //         options: {
  //           ...chartData.options,
  //           xaxis: {
  //             categories, // Categories for tooltips, but axis will be hidden
  //             labels: {
  //               show: false, // Hide the x-axis labels
  //             },
  //             axisBorder: {
  //               show: false, // Hide the x-axis border
  //             },
  //             axisTicks: {
  //               show: false, // Hide the x-axis ticks
  //             },
  //           },
  //           tooltip: {
  //             x: {
  //               show: true, // Show the x-axis categories in the tooltip on hover
  //             },
  //           },
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the graph data!", error);
  //     });
  // };

  useEffect(() => {
    getAllFx();
    // getAllFx1();
  }, []);

  const handlePriceChange = (index) => (e) => {
    const updatedData = [...data];
    updatedData[index].fx_rate = e.target.value;
    setData(updatedData);
  };

  const handleUpdate = (item) => {
    axios
      .post(`${API_BASE_URL}/updateFxRateHistory`, {
        fx_id: item.fx_id,
        fx_rate: item.fx_rate,
      })
      .then((response) => {
        getAllFx();
        toast.success("Update successful");
      })
      .catch((error) => {
        toast.error("Update failed");
      });
  };

  const handleFilter = (event) => {
    if (event.target.value === "") {
      setData(searchApiData);
    } else {
      const filterResult = searchApiData.filter((item) => {
        return item.currency_name
          .toLowerCase()
          .includes(event.target.value.toLowerCase());
      });
      setData(filterResult);
    }
    setFilterValue(event.target.value);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
  };
  //

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // const [state, setState] = useState({
  //   series: [], // Empty initially
  //   options: {
  //     chart: {
  //       type: "area",
  //       stacked: false,
  //       height: 350,
  //       zoom: {
  //         type: "x",
  //         enabled: true,
  //         autoScaleYaxis: true,
  //       },
  //       toolbar: {
  //         autoSelected: "zoom",
  //       },
  //     },
  //     colors: ["#ea6658", "#203764", "#4dd486", "#ffcc26"],
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     markers: {
  //       size: 0,
  //     },
  //     title: {
  //       text: "Exchange Rate History",
  //       align: "left",
  //     },
  //     fill: {
  //       type: "gradient",
  //       gradient: {
  //         shadeIntensity: 1,
  //         inverseColors: false,
  //         opacityFrom: 0.5,
  //         opacityTo: 0,
  //         stops: [0, 90, 100],
  //       },
  //     },
  //     yaxis: {
  //       min: 0,
  //       max: 100,
  //       title: {
  //         text: "Exchange Rate",
  //       },
  //     },
  //     xaxis: {
  //       categories: [], // ✅ Start with empty categories
  //     },
  //     tooltip: {
  //       shared: true,
  //       y: {
  //         formatter: function (val) {
  //           return val?.toFixed(2);
  //         },
  //       },
  //     },
  //     legend: {
  //       position: "bottom",
  //       horizontalAlign: "center",
  //       floating: false,
  //       offsetX: 0,
  //       offsetY: 10,
  //     },
  //     annotations: {
  //       position: "back",
  //       xaxis: [],
  //     },
  //   },
  // });

  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        id: "exchange-rate-chart", // ✅ Required for exec()
        type: "area",
        stacked: false,
        height: 350,
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: "zoom",
        },
        events: {
          zoomed: function () {
            // ✅ Show labels when zoomed
            window.ApexCharts.exec(
              "exchange-rate-chart",
              "updateOptions",
              {
                xaxis: {
                  labels: {
                    show: true,
                  },
                },
              },
              false,
              true
            );
          },
          beforeResetZoom: function () {
            // ✅ Hide labels when zoom is reset
            window.ApexCharts.exec(
              "exchange-rate-chart",
              "updateOptions",
              {
                xaxis: {
                  labels: {
                    show: false,
                  },
                },
              },
              false,
              true
            );
          },
        },
      },

      colors: ["#ea6658", "#203764", "#4dd486", "#ffcc26"],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "Exchange Rate History",
        align: "left",
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: "Exchange Rate",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          show: false, // ✅ Initially hidden
          datetimeUTC: false,
        },
      },
      tooltip: {
        shared: true,
        x: {
          format: "dd MMM yyyy",
        },
        y: {
          formatter: function (val) {
            return val?.toFixed(2);
          },
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        floating: false,
        offsetX: 0,
        offsetY: 10,
      },
      annotations: {
        position: "back",
        xaxis: [],
      },
    },
  });
  return (
    <div>
      <div className="container-fluid">
        <div>
          <main className="main-content">
            <div>
              <div className="px-0">
                <div className="row">
                  <div className="col-lg-12 col-md-12 mb-4">
                    <div className="bg-white">
                      <div className="databaseTableSection pt-0">
                        <div className="grayBgColor p-4 pb-2">
                          <div className="row">
                            <div className="col-md-6">
                              <h6 className="font-weight-bolder mb-0 pt-2">
                                Currency Exchange Update
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="top-space-search-reslute">
                          <div className="tab-content px-2 md:!px-4">
                            <div className="parentProduceSearch">
                              <div className="entries">
                                <small>Show</small>{" "}
                                <select
                                  value={entriesPerPage}
                                  onChange={handleEntriesChange}
                                >
                                  <option value={10}>10</option>
                                  <option value={25}>25</option>
                                  <option value={50}>50</option>
                                  <option value={100}>100</option>
                                </select>{" "}
                                <small>entries</small>
                              </div>
                              <div className="autoComplete currencyAuto">
                                {/* <Autocomplete
                                  value={selectedCurrency}
                                  onChange={(event, newValue) =>
                                    setSelectedCurrency(newValue)
                                  }
                                  options={currency}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Currency"
                                    />
                                  )}
                                /> */}

                                {/* <Autocomplete
                                  value={selectedCurrency}
                                  onChange={handleCurrencyChange}
                                  options={currency}
                                  getOptionLabel={(option) => option.FX || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Currency"
                                    />
                                  )}
                                /> */}
                                {/* <Autocomplete
                                  value={selectedCurrency}
                                  onChange={(event, newValue) => {
                                    setSelectedCurrency(newValue);
                                    if (newValue?.ID) {
                                      getFxRateHistoryGraph(newValue.ID);
                                    }
                                  }}
                                  options={currency||[]}
                                  getOptionLabel={(option) => option.FX || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Currency"
                                    />
                                  )}
                                /> */}
                                <Autocomplete
                                  value={selectedCurrency}
                                  onChange={(event, newValue) => {
                                    setSelectedCurrency(newValue);
                                    if (newValue?.ID) {
                                      getFxRateHistoryGraph(newValue.ID);
                                    } else {
                                      getFxRateHistoryGraph(); // fallback to all if cleared
                                    }
                                  }}
                                  options={currency || []}
                                  getOptionLabel={(option) => option.FX || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Currency"
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 currencySec">
                                <div
                                  className="tab-pane active"
                                  id="header"
                                  role="tabpanel"
                                >
                                  <div
                                    id="datatable_wrapper"
                                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                                  >
                                    <div className="d-flex exportPopupBtn" />
                                    <table
                                      id="example"
                                      className="display updatePriceTable table table-hover table-striped borderTerpProduce"
                                      style={{ width: "50%" }}
                                    >
                                      <thead>
                                        <tr>
                                          <th className="fiftyPer">
                                            <table>
                                              <tbody>
                                                <tr>
                                                  <th
                                                    colSpan={3}
                                                    style={{
                                                      textAlign: "left",
                                                    }}
                                                  >
                                                    Updated Price
                                                  </th>
                                                </tr>
                                                {data
                                                  .slice(0, entriesPerPage)
                                                  .map((item, index) => (
                                                    <tr key={index}>
                                                      <td>
                                                        {item.currency_name}
                                                      </td>
                                                      <td>
                                                        <div className="form-group col-lg-3 formCreate mt-0">
                                                          <input
                                                            className="mb-0 w-full"
                                                            name="fx_rate"
                                                            value={
                                                              item.fx_rate || ""
                                                            }
                                                            onChange={handlePriceChange(
                                                              index
                                                            )}
                                                            style={{
                                                              width: 250,
                                                            }}
                                                          />
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div className="btnUpdate">
                                                          <button
                                                            onClick={() =>
                                                              handleUpdate(item)
                                                            }
                                                          >
                                                            Update
                                                          </button>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  ))}
                                              </tbody>
                                            </table>
                                          </th>
                                        </tr>
                                      </thead>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="currecyGraph">
                                  <div>
                                    <div id="chart">
                                      <ReactApexChart
                                        options={state.options}
                                        series={state.series}
                                        type="area"
                                        height={350}
                                      />
                                    </div>
                                    <div id="html-dist"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CurrencyExchange;
