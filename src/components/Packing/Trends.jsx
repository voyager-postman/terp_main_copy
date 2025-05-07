import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import trendImg from "../../assets/pic-2.jpg";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";

const ApexChart = () => {
  const [data, setData] = useState([]);
  const [selectedProduceId, setSelectedProduceId] = useState(null);
  const [produceImages, setProduceImages] = useState("");
  console.log(produceImages);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [selectedcomparison, setSelectedComparison] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [date4, setDate4] = useState("");
  const handlePeriodClick = (period, id) => {
    setSelectedPeriod(period);
    setSelectedId(id);
  };
  console.log(selectedId);
  const getAllProduce = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      setData(res.data.data || []);
    });
  };
  const getAllTimePeriod = () => {
    axios.get(`${API_BASE_URL}/statisticsDateSelection1`).then((res) => {
      console.log(res);
      setDataPeriod(res.data.details || []);
    });
  };

  const getData = () => {
    if (selectedId) {
      axios
        .post(`${API_BASE_URL}/StatisticsDATEselection`, {
          Period_id: selectedId,
        })
        .then((res) => {
          console.log(res.data.data[0]); // Log the response data
          setDate1(res.data.data[0]?.Start_DATE || "");
          setDate2(res.data.data[0]?.END_DATE || "");
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Handle errors
        });
    }
  };

  const getData2 = () => {
    if (selectedId) {
      axios
        .post(`${API_BASE_URL}/StatisticsDATEComparision`, {
          Period_id: selectedId,
          Selection_id: selectedcomparison,
          Start_DATE: date1,
          END_DATE: date2,
        })
        .then((res) => {
          console.log(res.data.data[0]); // Log the response data
          setDate3(res.data.data[0]?.Compare_Start_DATE || "");
          setDate4(res.data.data[0]?.Compare_END_DATE || "");
        })
        .catch((error) => {
          console.error("Error fetching data:", error); // Handle errors
        });
    }
  };

  // const confirmData = () => {
  //   // Validate required fields
  //   if (!selectedProduceId) {
  //     toast.error("Produce  is required");
  //     return; // Stop the function if validation fails
  //   }

  //   if (!date1) {
  //     toast.error("Start Date is required");
  //     return;
  //   }

  //   if (!date2) {
  //     toast.error("Stop Date is required");
  //     return;
  //   }

  //   // If all fields are valid, proceed with the API call
  //   axios
  //     .post(`${API_BASE_URL}/ProduceTrendGraph`, {
  //       Produce_ID: selectedProduceId,
  //       Start_Date: date1,
  //       Stop_Date: date2,
  //     })
  //     .then((res) => {
  //       console.log(res); // Log the response data

  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error); // Handle errors
  //     });
  // };
  const confirmData = () => {
    // Validate required fields
    if (!selectedProduceId) {
      toast.error("Produce is required");
      return;
    }
    if (!date1) {
      toast.error("Start Date is required");
      return;
    }
    if (!date2) {
      toast.error("Stop Date is required");
      return;
    }

    // If all fields are valid, proceed with the API call
    axios
      .post(`${API_BASE_URL}/ProduceTrendGraph`, {
        Produce_ID: selectedProduceId,
        Start_Date: date1,
        Stop_Date: date2,
      })
      .then((res) => {
        console.log(res.data); // Log the response data

        const { dataAll, prices, wastages, rawKgCosts, minPrice, maxPrice } =
          res.data;

        // Extract dates and ensure that they are formatted correctly
        const formattedDates = [
          ...dataAll[0].map((item) => new Date(item.Date1).getTime()), // For Price
          ...dataAll[1].map((item) => new Date(item.Date2).getTime()), // For Wastage
        ];

        // Create series data based on the available prices, wastages, and rawKgCosts
        const priceData = dataAll[0].map((item, index) => ({
          x: new Date(item.Date1).getTime(),
          y: parseFloat(prices[index]),
        }));

        const wastageData = dataAll[1].map((item, index) => ({
          x: new Date(item.Date2).getTime(),
          y: parseFloat(wastages[index]),
        }));

        const rawKgCostData = dataAll[1].map((item, index) => ({
          x: new Date(item.Date2).getTime(),
          y: parseFloat(rawKgCosts[index]),
        }));

        // Update the chart with three different series
        setChartOptions((prevOptions) => ({
          ...prevOptions,
          series: [
            {
              name: "Price",
              data: priceData,
              color: "#1E90FF", // Set color for Price series
            },
            {
              name: "Wastage",
              data: wastageData,
              color: "#32CD32", // Set color for Wastage series
            },
            {
              name: "Raw Kg Cost",
              data: rawKgCostData,
              color: "#FFA500", // Set color for Raw Kg Cost series
            },
          ],
          yaxis: {
            min: minPrice,
            max: maxPrice,
            title: {
              text: "Values",
            },
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
              const price = prices[dataPointIndex];
              const wastage = wastages[dataPointIndex];
              const rawKgCost = rawKgCosts[dataPointIndex];

              return (
                '<div class="apexcharts-tooltip-custom">' +
                `<strong>Price:</strong> ${price}<br/>` +
                `<strong>Wastage:</strong> ${wastage}<br/>` +
                `<strong>Raw Kg Cost:</strong> ${rawKgCost}` +
                "</div>"
              );
            },
          },
        }));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      });
  };

  useEffect(() => {
    getData2();
  }, [selectedId, selectedcomparison, date1, date2]);
  useEffect(() => {
    getData();
  }, [selectedId]);
  const getComparisonPeriod = () => {
    axios.get(`${API_BASE_URL}/StatisticsDATESelection2`).then((res) => {
      console.log(res);
      setDataComparison(res.data.details || []);
    });
  };
  useEffect(() => {
    getAllProduce();
    getAllTimePeriod();
    getComparisonPeriod();
  }, []);

  const dates = [
    [1627555200000, 100],
    [1627641600000, 120],
    [1627728000000, 140],
  ];

  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Produce Trend",
        data: [], // Initial empty data
      },
    ],
    options: {
      chart: {
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
      },
      colors: ["#203764"],
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: "Produce Price Trend",
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
        title: {
          text: "Price",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: function (val) {
            const date = new Date(val);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "short" });
            return `${day} ${month}`; // e.g., "12 Jul"
          },
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return val.toFixed(0);
          },
        },
      },
    },
  });

  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="row">
          <div className="flex flex-wrap">
            <div className="selectProduce me-3">
              <h6 className="mb-2"> Select Produce</h6>
              <Autocomplete
                disablePortal
                options={data}
                getOptionLabel={(option) => option.produce_name_en || ""}
                sx={{ width: 300 }}
                onChange={(event, value) => {
                  setSelectedProduceId(value ? value.produce_id : null);
                  setProduceImages(value ? value.images : null); // Update images state
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Produce" />
                )}
              />
            </div>
            <div>
              <div className="selectTimeHead">
                <h6>Select Time Period :</h6>
              </div>
              <div className="selectTimeParent">
                {dataPeriod.map((item) => (
                  <div
                    key={item.ID}
                    className="timeMonth"
                    onClick={() => handlePeriodClick(item.Period, item.ID)}
                  >
                    <p>{item.Period}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="selectProduce comparisonNone">
              <h6 style={{ color: "#fff" }}>Comparison Period</h6>
              <Autocomplete
                disablePortal
                options={dataComparison}
                getOptionLabel={(option) => option.Name_EN || ""}
                sx={{ width: 300 }}
                onChange={(event, value) => {
                  setSelectedComparison(value ? value.ID : null);
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Comparison Period" />
                )}
              />
            </div>
          </div>
          <div className="dateSelect row">
            <div className="col-lg-3">
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
              />
            </div>
            <div className="col-lg-3">
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
              />
            </div>
            <div className="col-lg-3">
              <input
                type="date"
                value={date3}
                onChange={(e) => setDate3(e.target.value)}
              />
            </div>
            <div className="col-lg-3">
              <input
                type="date"
                value={date4}
                onChange={(e) => setDate4(e.target.value)}
              />
            </div>
          </div>
          <div className="dateSelect row">
            <div className="col-lg-3">
              <button
                className="btn btn-primary"
                type="submit"
                onClick={confirmData}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-5">
            <div className="d-flex align-items-center h-100">
              <div className="trendImg">
                {produceImages ? (
                  <img
                    crossorigin="anonymous"
                    src={`${API_IMAGE_URL}/${produceImages}`}
                    alt=""
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-7 trendChart">
            <div id="chart">
              <ReactApexChart
                options={chartOptions.options}
                series={chartOptions.series}
                type="area"
                height={350}
              />
            </div>
            <div id="html-dist"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApexChart;
