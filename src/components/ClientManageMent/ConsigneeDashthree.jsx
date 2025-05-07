import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import { toast } from "react-toastify";
import { Card } from "../../card";
import Select from "react-select";
import { API_BASE_URL } from "../../Url/Url";
import TextField from "@mui/material/TextField";
import ReactApexChart from "react-apexcharts";

const ConsigneeDashtwo = () => {
  const location = useLocation();

  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedcomparison, setSelectedComparison] = useState("");

  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [date4, setDate4] = useState("");
  const [boxsData, setBoxsData] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedDataset, setSelectedDataset] = useState(""); // Default dataset

  const [value, setValue] = useState([]);
  const [topFiveValue, setTopFiveValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [consigeeDetails, setconsigeeDetails] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [orderItem, setOrderItem] = useState([]);

  const [toDate, setToDate] = useState("");
  console.log(selectedItemId);
  const role = localStorage.getItem("role");
  const client = localStorage.getItem("client");
  const consignee = localStorage.getItem("consignee");

  const getAllTimePeriod = () => {
    axios.get(`${API_BASE_URL}/statisticsDateSelection1`).then((res) => {
      console.log(res);
      setDataPeriod(res.data.details || []);
    });
  };
  const orderData2 = () => {
    axios
      .get(`${API_BASE_URL}/statisticsDropdownGraphSelection`)
      .then((res) => {
        const fetchedData = res.data.data || [];

        // Transform data for Select component
        const selectOptions = fetchedData.map((item) => ({
          value: item.ID,
          label: item.Name,
        }));
        setOptions(selectOptions);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    orderData2();
  }, []);
  // const confirmData2 = () => {
  //   if (!date1) {
  //     toast.error("Start Date is required");
  //     return;
  //   }
  //   if (!date2) {
  //     toast.error("Stop Date is required");
  //     return;
  //   }
  //   if (!date3) {
  //     toast.error("Compare Start DATE is required");
  //     return;
  //   }
  //   if (!date4) {
  //     toast.error("Compare End DATE is required");
  //     return;
  //   }

  //   axios
  //     .post(`${API_BASE_URL}/ConsigneeStatisticsGraph`, {
  //       Selection_id: selectedDataset,
  //       Client_id: from?.client_id,
  //       Consignee_id: from?.consignee_id,
  //       Start_Date: date1,
  //       End_Date: date2,
  //       Compare_Start_DATE: date3,
  //       Compare_END_DATE: date4,
  //     })
  //     .then((res) => {
  //       const { GraphData, MinMinusOne, MaxPlusOne } = res.data;

  //       // Combine all unique dates with readable labels
  //       const allDates = Array.from(
  //         new Set([...GraphData[0], ...GraphData[1]].map((item) => item.y))
  //       );

  //       // Align data for Compared_To_Period
  //       const comparedToPeriodData = allDates.map((date) => {
  //         const item = GraphData[0].find((entry) => entry.y === date);
  //         return {
  //           x: date,
  //           y: item
  //             ? parseFloat(
  //                 selectedDataset === 4
  //                   ? item.Selected_Period
  //                   : item.Compared_To_Period
  //               )
  //             : 0, // Default to 0 if no data
  //         };
  //       });

  //       // Align data for Selected_Period
  //       const selectedPeriodData = allDates.map((date) => {
  //         const item = GraphData[1].find((entry) => entry.y === date);
  //         return {
  //           x: date,
  //           y: item
  //             ? parseFloat(
  //                 selectedDataset === 4
  //                   ? item.Compared_To_Period
  //                   : item.Selected_Period
  //               )
  //             : 0, // Default to 0 if no data
  //         };
  //       });

  //       // Set chart options
  //       setChartOptions({
  //         series: [
  //           {
  //             name: "Compared Period",
  //             data: comparedToPeriodData,
  //             color: "#32CD32",
  //           },
  //           {
  //             name: "Selected Period",
  //             data: selectedPeriodData,
  //             color: "#1E90FF",
  //           },
  //         ],
  //         xaxis: {
  //           categories: allDates, // Use readable date strings from `y`
  //           title: {
  //             text: "Dates",
  //           },
  //         },
  //         yaxis: {
  //           min: MinMinusOne,
  //           max: MaxPlusOne,
  //           title: {
  //             text: "Values",
  //           },
  //         },
  //         tooltip: {
  //           custom: function ({ series, seriesIndex, dataPointIndex }) {
  //             const dataPoint =
  //               seriesIndex === 0
  //                 ? comparedToPeriodData[dataPointIndex]
  //                 : selectedPeriodData[dataPointIndex];

  //             if (!dataPoint) return "<div>No data available</div>";

  //             return (
  //               `<div class="apexcharts-tooltip-custom" style="padding: 8px; border: 1px solid #ccc; background: #fff;">` +
  //               `<strong>${series[seriesIndex].name}:</strong> ${dataPoint.y}<br/>` +
  //               `<strong>Date:</strong> ${dataPoint.x}` +
  //               `</div>`
  //             );
  //           },
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       toast.error("An error occurred while fetching data.");
  //     });
  // };
  const confirmData2 = () => {
    if (!date1) {
      toast.error("Start Date is required");
      return;
    }
    if (!date2) {
      toast.error("Stop Date is required");
      return;
    }
    if (!date3) {
      toast.error("Compare Start DATE is required");
      return;
    }
    if (!date4) {
      toast.error("Compare End DATE is required");
      return;
    }

    axios
      .post(`${API_BASE_URL}/ConsigneeStatisticsGraph`, {
        Selection_id: selectedDataset,
        Client_id: from?.client_id,
        Consignee_id: from?.consignee_id,
        Start_Date: date1,
        End_Date: date2,
        Compare_Start_DATE: date3,
        Compare_END_DATE: date4,
      })
      .then((res) => {
        const { GraphData, MinMinusOne, MaxPlusOne } = res.data;

        // Combine all X-axis values and ensure uniqueness
        const allDates = Array.from(
          new Set([
            ...GraphData[0].map((item) => item.X),
            ...GraphData[1].map((item) => item.X),
          ])
        ).sort((a, b) => new Date(a) - new Date(b)); // Sort dates
        console.log(allDates);
        // Align data for Compared_To_Period
        const comparedToPeriodData = allDates.map((date) => {
          const item = GraphData[0].find((entry) => entry.X === date);

          console.log(date);
          return {
            x: date,
            y: item
              ? parseFloat(
                  selectedDataset === 4
                    ? item.Selected_Period
                    : item.Compared_To_Period
                )
              : 0, // Default to 0 if no data
            date,
          };
        });

        // Align data for Selected_Period
        const selectedPeriodData = allDates.map((date) => {
          console.log(GraphData[1]);
          console.log(date);
          const item = GraphData[1].find((entry) => entry.X === date);
          console.log(item);
          return {
            x: date,
            y: item
              ? parseFloat(
                  selectedDataset === 4
                    ? item.Compared_To_Period
                    : item.Selected_Period
                )
              : 0, // Default to 0 if no data
            date,
          };
        });

        setChartOptions({
          series: [
            {
              name: "Compared Period",
              data: comparedToPeriodData,
              color: "#32CD32",
            },
            {
              name: "Selected Period",
              data: selectedPeriodData,
              color: "#1E90FF",
            },
          ],
          xaxis: {
            categories: allDates,
            title: {
              text: "X-Axis Data",
            },
          },
          yaxis: {
            min: MinMinusOne,
            max: MaxPlusOne,
            title: {
              text: "Values",
            },
          },
          tooltip: {
            custom: function ({ series, seriesIndex, dataPointIndex }) {
              const dataPoint =
                seriesIndex === 0
                  ? comparedToPeriodData[dataPointIndex]
                  : selectedPeriodData[dataPointIndex];

              if (!dataPoint) return "<div>No data available</div>";

              return (
                `<div class="apexcharts-tooltip-custom" style="padding: 8px; border: 1px solid #ccc; background: #fff;">` +
                `<strong>${series[seriesIndex].name}:</strong> ${dataPoint.y}<br/>` +
                `<strong>X:</strong> ${dataPoint.x}` +
                `</div>`
              );
            },
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("An error occurred while fetching data.");
      });
  };

  useEffect(() => {
    if (selectedDataset) {
      confirmData2();
    }
  }, [selectedDataset]);
  const confirmData = async () => {
    let obj = {
      Start_Date: date1,
      Stop_Date: date2,
    };

    console.log("confirm data is", obj);

    if (!date1) {
      toast.error("Start Date is required");
      return;
    }
    if (!date2) {
      toast.error("Stop Date is required");
      return;
    }

    // API payload

    const payload = {
      Client_id: from?.client_id,
      Consignee_id: from?.consignee_id,
      Selection_id: selectedId,
      Start_Date: date1,
      End_Date: date2,
      Compare_Start_DATE: date3, // You need to define `compareDate1` and `compareDate2` if used
      Compare_END_DATE: date4,
    };

    try {
      // API call
      const response = await axios.post(
        `${API_BASE_URL}/ConsigneeStatisticsAll`,
        payload
      );
      console.log("API Response:", response.data.data);
      setBoxsData(response.data.data);
      // Handle success
      toast.success("Data fetched successfully!");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/statisticsDropdownGraphSelection`)
      .then((res) => {
        setValue(res.data.data || []);
        // Transform data for Select component
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    orderData1();
  }, []);
  const handleDropdownChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedDataset(selectedOption.value); // Set ID as selected dataset
  };
  const getAllProduce = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      console.log(res);
    });
  };
  const getComparisonPeriod = () => {
    axios.get(`${API_BASE_URL}/StatisticsDATESelection2`).then((res) => {
      console.log(res);
      setDataComparison(res.data.details || []);
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
  useEffect(() => {
    getData();
  }, [selectedId]);
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
  useEffect(() => {
    getData2();
  }, [selectedId, selectedcomparison, date1, date2]);
  const handlePeriodClick = (period, id) => {
    setSelectedPeriod(period);
    setSelectedId(id);
  };

  useEffect(() => {
    getAllProduce();
    getAllTimePeriod();
    getComparisonPeriod();
  }, []);
  const confirmData1 = async () => {
    // Validation checks
    if (!date1) {
      toast.error("Start Date is required");
      return;
    }
    if (!date2) {
      toast.error("Stop Date is required");
      return;
    }
    if (!date3) {
      toast.error("Compare Start DATE is required");
      return;
    }
    if (!date4) {
      toast.error("Compare End DATE is required");
      return;
    }

    // API payload
    const payload = {
      Selection_id: selectedInvoiceId,
      Client_id: from?.client_id,
      Consignee_id: from?.consignee_id,
      Start_Date: date1,
      End_Date: date2,
      Compare_Start_DATE: date3,
      Compare_END_DATE: date4,
    };

    try {
      // API call
      const response = await axios.post(
        `${API_BASE_URL}/ConsigneeStatisticsTopITF`,
        payload
      );
      console.log("API Response:", response);
      setTopFiveValue(response.data);
      toast.success("Data fetched successfully!");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  // Trigger API call when selectedInvoiceId changes
  useEffect(() => {
    if (selectedInvoiceId) {
      confirmData1();
    }
  }, [selectedInvoiceId]); // Only runs when `selectedInvoiceId` changes
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
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
        text: "Produce Price Consignee",
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
    <div className="bg-white clientDashRad newSmallCard">
      <div className="top-space-search-reslute">
        <div className="tab-content md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div class="tab-content" id="myTabContent">
              <div className="py-3 px-2">
                <div className="row newSmallCard ">
                  <div className="flex flex-wrap">
                    <div>
                      <div className="selectTimeHead">
                        <h6>Select Time Period :</h6>
                      </div>
                      <div className="selectTimeParent">
                        {dataPeriod.map((item) => (
                          <div
                            key={item.ID}
                            className="timeMonth timePeriod"
                            onClick={() =>
                              handlePeriodClick(item.Period, item.ID)
                            }
                          >
                            <p>{item.Period}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="selectProduce comparisonNone mt-2">
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
                          <TextField
                            {...params}
                            placeholder="Comparison Period"
                          />
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
                <div className="row dashCard53 consigneeCard">
                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                    <div className="card  ">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <div
                            style={{
                              fontSize: "25px",
                              color: "#d2d7e0",
                              paddingTop: "13px",
                            }}
                          >
                            {/* {consigeeDetails?.Total_shipments} */}
                            {boxsData?.CNF?.Count ? boxsData?.CNF?.Count : 0}
                          </div>
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Shipments
                          </p>
                          <h4 className="mb-0">
                            {boxsData?.CNF?.Total ? boxsData?.CNF?.Total : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.CNF?.Difference
                              ? boxsData?.CNF?.Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <div
                            style={{
                              fontSize: "25px",
                              color: "#d2d7e0",
                              paddingTop: "13px",
                            }}
                          >
                            {boxsData?.Claims?.Count
                              ? boxsData?.Claims?.Count
                              : 0}
                          </div>
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Claims
                          </p>
                          <h4 className="mb-0">
                            {" "}
                            {boxsData?.Claims?.Total
                              ? boxsData?.Claims?.Total
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.Claims?.Difference
                              ? boxsData?.Claims?.Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <div
                            style={{
                              fontSize: "25px",
                              color: "#d2d7e0",
                              paddingTop: "13px",
                            }}
                          >
                            {boxsData?.Payments?.Count
                              ? boxsData?.Payments?.Count
                              : 0}
                          </div>
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            {" "}
                            Total Payment{" "}
                          </p>
                          <h4 className="mb-0">
                            {" "}
                            {boxsData?.Payments?.Total
                              ? boxsData?.Payments?.Total
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.Payments?.Difference
                              ? boxsData?.Payments?.Difference
                              : 0}
                          </span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <div
                            style={{
                              fontSize: "25px",
                              color: "#d2d7e0",
                              paddingTop: "13px",
                            }}
                          >
                            {boxsData?.Pending?.Count
                              ? boxsData?.Pending?.Count
                              : 0}
                          </div>{" "}
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Pending Payment
                          </p>
                          <h4 className="mb-0">
                            {boxsData?.Pending?.Total
                              ? boxsData?.Pending?.Total
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.Pending?.Difference
                              ? boxsData?.Pending?.Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row dashCard53 consigneeCard">
                  <div className="col-xl-3 col-sm-6 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <i className=" material-icons  mdi mdi-weight" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Net Weigt Shipped
                          </p>
                          <h4 className="mb-0">
                            {boxsData?.NetWeight?.Total_GW
                              ? boxsData?.NetWeight?.Total_GW
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.NetWeight?.Total_GW_Difference
                              ? boxsData?.NetWeight?.Total_GW_Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <i className=" material-icons mdi mdi-weight-gram" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Gross Weight Shipped
                          </p>
                          <h4 className="mb-0">
                            {boxsData?.grossWeight?.Total_GW
                              ? boxsData?.grossWeight?.Total_GW
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.grossWeight?.Total_GW_Difference
                              ? boxsData?.grossWeight?.Total_GW_Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-sm-6 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Boxes Shipped
                          </p>
                          <h4 className="mb-0">
                            {boxsData?.Box?.Total_GW
                              ? boxsData?.Box?.Total_GW
                              : 0}
                          </h4>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                      <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            {boxsData?.Box?.Total_GW_Difference
                              ? boxsData?.Box?.Total_GW_Difference
                              : 0}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                    <div className="card">
                      <div className="card-header p-3 pt-2">
                        <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                          <i className=" material-icons  mdi mdi-pipe" />
                        </div>
                        <div className="text-end pt-1">
                          <p className="text-sm mb-0 text-capitalize">
                            Total Shipments
                          </p>
                          <div className="parentFirstShip mt-4">
                            <p>Date of First Shipment</p>
                            <p>
                              {" "}
                              {boxsData?.Shipments?.First_Shipment
                                ? boxsData?.Shipments?.First_Shipment
                                : 0}{" "}
                            </p>
                          </div>
                          <div className="parentFirstShip">
                            <p>Date of Last Shipment</p>
                            <p>
                              {" "}
                              {boxsData?.Shipments?.Last_Shipment
                                ? boxsData?.Shipments?.Last_Shipment
                                : 0}{" "}
                            </p>
                          </div>
                          <div className="parentFirstShip">
                            <p> Shipments in Pipe Line</p>
                            <p>
                              {boxsData?.Shipments?.Pipe_Line
                                ? boxsData?.Shipments?.Pipe_Line
                                : 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="dark horizontal my-0" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6 mb20">
                    <div className="itemsOrderSearch">
                      <h3 className="itemOrder">Top 5 Items Ordered</h3>

                      <div className="selectProduce">
                        <Autocomplete
                          disablePortal
                          options={value.slice(0, 3)} // Only the top three options
                          value={
                            value.find(
                              (item) => item.ID === selectedInvoiceId
                            ) || null
                          }
                          getOptionLabel={(option) => option.Name || ""}
                          sx={{ width: 200 }}
                          onChange={(event, value) => {
                            setSelectedInvoiceId(value ? value.ID : null);
                            // setProduceImages(value ? value.images : null); // Update images state
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Invoice Value"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="tableCreateClient">
                      <table>
                        <tr>
                          <th>ITF Name</th>
                          <th> Last Period Kg</th>
                          <th> Current Period Kg</th>
                          <th> DIFF </th>
                          <th> % Change </th>
                        </tr>
                        <tbody>
                          {topFiveValue?.Top5Data?.map((item, index) => (
                            <tr key={index}>
                              <td>{item.itf_name}</td>
                              <td>{item.Last_Period}</td>
                              <td>{item.Current_Period}</td>
                              <td>{item.DIFF}</td>
                              <td>{item["% CHANGE"]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="col-lg-6 mb20 ">
                    <div className="chartConsignee">
                      <div className="searchGraph">
                        <Select
                          options={options}
                          onChange={handleDropdownChange}
                          value={options.find(
                            (option) => option.value === selectedDataset
                          )}
                          placeholder="Select..."
                          isSearchable
                          styles={{
                            container: (provided) => ({
                              ...provided,
                              marginBottom: "20px",
                              maxWidth: "300px",
                            }),
                          }}
                        />
                        <ReactApexChart
                          options={chartOptions.options}
                          series={chartOptions.series}
                          type="area"
                          height={350}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer text-center">
                <Link className="btn btn-danger" to="/shipToNew">
                  Close
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsigneeDashtwo;
