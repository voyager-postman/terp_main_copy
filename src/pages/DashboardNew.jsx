import CodeIcon from "@mui/icons-material/Code";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logoNew.png";
import { ComboBox } from "../components/combobox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import axios from "axios";
import { API_BASE_URL } from "../Url/Url";
import { API_IMAGE_URL } from "../Url/Url";
import jsPDF from "jspdf";
import "jspdf-autotable";
import pic from "../assets/pic.jpg";
import "./dashboard.css";
import { useQuery } from "react-query";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import Dashboard from "./Dashboard";
const DashboardNew = () => {
  const [t, i18n] = useTranslation("global");
  const location = useLocation();

  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedcomparison, setSelectedComparison] = useState("");
  const [consignees1, setConsignees1] = useState([]);
  const [selectedConsigneeId, setSelectedConsigneeId] = useState("");
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
  const [formState, setFormState] = useState({
    client_id: "",
  });
  const handleChange5 = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log(selectedConsigneeId);
  const fetchConsignees5 = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: formState?.client_id,
      });
      setConsignees1(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };
  useEffect(() => {
    if (formState?.client_id) {
      fetchConsignees5();
    }
  }, [formState?.client_id]);
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

  //       // Combine all X-axis values and ensure uniqueness
  //       const allDates = Array.from(
  //         new Set([
  //           ...GraphData[0].map((item) => item.X),
  //           ...GraphData[1].map((item) => item.X),
  //         ])
  //       ).sort((a, b) => new Date(a) - new Date(b)); // Sort dates

  //       // Align data for Compared_To_Period
  //       const comparedToPeriodData = allDates.map((date) => {
  //         const item = GraphData[0].find((entry) => entry.X === date);
  //         return {
  //           x: date,
  //           y: item
  //             ? parseFloat(
  //                 selectedDataset === 4
  //                   ? item.Selected_Period
  //                   : item.Compared_To_Period
  //               )
  //             : 0, // Default to 0 if no data
  //           date,
  //         };
  //       });

  //       // Align data for Selected_Period
  //       const selectedPeriodData = allDates.map((date) => {
  //         const item = GraphData[1].find((entry) => entry.X === date);
  //         return {
  //           x: date,
  //           y: item
  //             ? parseFloat(
  //                 selectedDataset === 4
  //                   ? item.Compared_To_Period
  //                   : item.Selected_Period
  //               )
  //             : 0, // Default to 0 if no data
  //           date,
  //         };
  //       });

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
  //           categories: allDates,
  //           title: {
  //             text: "X-Axis Data",
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
  //               `<strong>X:</strong> ${dataPoint.x}` +
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
  //       Client_id: formState?.client_id,
  //       Consignee_id: selectedConsigneeId,
  //       Start_Date: date1,
  //       End_Date: date2,
  //       Compare_Start_DATE: date3,
  //       Compare_END_DATE: date4,
  //     })
  //     .then((res) => {
  //       const { GraphData, MinMinusOne, MaxPlusOne } = res.data;

  //       // Combine all unique y-axis values
  //       const allYValues = Array.from(
  //         new Set([
  //           ...GraphData[0].map((item) => item.y),
  //           ...GraphData[1].map((item) => item.y),
  //         ])
  //       ).sort((a, b) => a - b); // Sort numerically

  //       // Align data for Compared_To_Period
  //       const comparedToPeriodData = allYValues.map((yValue) => {
  //         const item = GraphData[0].find((entry) => entry.y === yValue);
  //         return {
  //           x: yValue, // Use yValue as x-axis value
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
  //       const selectedPeriodData = allYValues.map((yValue) => {
  //         const item = GraphData[1].find((entry) => entry.y === yValue);
  //         return {
  //           x: yValue, // Use yValue as x-axis value
  //           y: item
  //             ? parseFloat(
  //                 selectedDataset === 4
  //                   ? item.Compared_To_Period
  //                   : item.Selected_Period
  //               )
  //             : 0, // Default to 0 if no data
  //         };
  //       });

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
  //           categories: allYValues, // Use y-values as categories
  //           title: {
  //             text: "Y-Axis Data",
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
  //               `<strong>Y:</strong> ${dataPoint.x}` +
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
        Client_id: formState?.client_id,
        Consignee_id: selectedConsigneeId,
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
      Client_id: formState?.client_id,
      Consignee_id: selectedConsigneeId,
      Selection_id: selectedId,
      Start_Date: date1,
      End_Date: date2,
      Compare_Start_DATE: date3, // You need to define `compareDate1` and `compareDate2` if used
      Compare_END_DATE: date4,
    };

    try {
      // API call
      const response = await axios.post(
        `${API_BASE_URL}/MainStatisticsAll`,
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
      Client_id: formState?.client_id,
      Consignee_id: selectedConsigneeId,
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
  // const [chartOptions, setChartOptions] = useState({
  //   series: [
  //     {
  //       name: "Produce Trend",
  //       data: [],
  //     },
  //   ],
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
  //     colors: ["#203764"],
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     markers: {
  //       size: 0,
  //     },
  //     title: {
  //       text: t("dashboard.graphHead"),
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
  //       title: {
  //         text: t("dashboard.price"),
  //       },
  //     },
  //     xaxis: {
  //       type: "datetime",
  //       labels: {
  //         formatter: function (val) {
  //           const date = new Date(val);
  //           const day = date.getDate();
  //           const month = date.toLocaleString("default", { month: "short" });
  //           return `${day} ${month}`; // e.g., "12 Jul"
  //         },
  //       },
  //     },
  //     tooltip: {
  //       shared: false,
  //       y: {
  //         formatter: function (val) {
  //           return val.toFixed(0);
  //         },
  //       },
  //     },
  //   },
  // });
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Produce Trend",
        data: [],
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
        text: "",
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
          text: "",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: function (val) {
            const date = new Date(val);
            const day = date.getDate();
            const month = date.toLocaleString("default", { month: "short" });
            return `${day} ${month}`;
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

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        title: {
          ...prev.options.title,
          text: t("dashboard.graphHead"),
        },
        yaxis: {
          ...prev.options.yaxis,
          title: {
            ...prev.options.yaxis.title,
            text: t("dashboard.price"),
          },
        },
      },
    }));
  }, [t, i18n.language]);
  const [data, setData] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: clients } = useQuery("getClientDataAsOptions");
  const { data: consigneeS } = useQuery("getConsignee");
  const [clientIdSet, setClientIdSet] = useState("");
  const [consigneeIdSet, setConsigneeIdSet] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [collectPaymentId, setCollectPaymentId] = useState("");
  // const [selectedItemId, setSelectedItemId] = useState(null);
  const [consigneeData, setConsigneeData] = useState("");
  // const [fromDate, setFromDate] = useState("");
  // const [orderItem, setOrderItem] = useState([]);
  const [paymentTable1, setPaymentTable1] = useState([]);
  const [paidAmounts, setPaidAmounts] = useState({});
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [clientId, setClientId] = useState("");
  const [consigneeId, setConsigneeId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [clientPaymentRef, setClientPaymentRef] = useState("");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [fxPayment, setFxPayment] = useState("");
  const [fxRate, setFxRate] = useState("");
  const [fxId, setFxId] = useState("");
  const [intermittentBankCharges, setIntermittentBankCharges] = useState("");
  const [localBankCharges, setLocalBankCharges] = useState("");
  const [thbReceived, setThbReceived] = useState("");
  const [lossGainOnExchangeRate, setLossGainOnExchangeRate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [paidAmount, setPaidAmount] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  // const [toDate, setToDate] = useState("");
  console.log(clientId);
  // const { from } = location.state || {};
  console.log(from);
  // const navigate = useNavigate();
  const fetchConsignees1 = async () => {
    console.log(clientIdSet);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: clientIdSet,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  useEffect(() => {
    if (clientIdSet) {
      fetchConsignees1();
    }
  }, [clientIdSet]);

  const fetchConsignees = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: clientId,
      });
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchConsignees();
    }
  }, [clientId]);
  useEffect(() => {
    if (clientId && consigneeId) {
      paymentTable();
    }
  }, [clientId, consigneeId]);

  const getClientDetails = () => {
    axios
      .post(`${API_BASE_URL}/getClientStatistics`, {
        client_id: from?.client_id,
      })
      .then((res) => {
        console.log(res);

        // setData(res.data.data);
        setConsigneeData(res.data.data);
        setOrderItem(res.data.items);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };
  //
  const paymentTable = () => {
    axios
      .post(`${API_BASE_URL}/getInvoiceByClientID`, {
        Client_id: clientId,
        Consignee_id: consigneeId,
      })
      .then((res) => {
        console.log(res);
        setPaymentTable1(res.data.data);
        // setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getClientDetails();
  }, []);
  const handleSubmit = async () => {
    const payload = {
      client_id: clientIdSet, // Use selected client_id
      consignee_id: consigneeIdSet,
      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getConsigneeStatement`,
        payload
      );
      console.log(response.data.data);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
        const doc = new jsPDF("landscape");
        const addLogoWithDetails = async () => {
          const imgData = logo;
          doc.addImage(imgData, "JPEG", 7, 5.7, 20, 20);
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text("Siam Eats Co.,Ltd. (0395561000010)", 30, 10);
          doc.text("16/8 Mu 11 ", 30, 14);
          const longTextOne =
            "Khlong Nueng, Khlong Luang, Pathum Thani 12120 THAILAND";
          const maxWidthOne = 59;
          const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
          let startXOne = 30;
          let startYOne = 18;
          linesOne.forEach((lineOne, index) => {
            doc.text(lineOne, startXOne, startYOne + index * 4.2); // Adjust the line height (10) as needed
          });
          // adddress
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 140, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text("Start Date:", 252, 9);
          doc.text("End date:", 252, 13);
          doc.text("Printed On:", 252, 17);

          doc.text(`${formatDate(fromDate)}`, 272.5, 9);
          doc.text(`${formatDate(toDate)}`, 272, 13);
          doc.text(`${formatDate(new Date())}`, 272, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 27, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 32);
        doc.text("Consignee Details", 216.5, 32);
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        function renderWrappedText(
          doc,
          text,
          startX,
          startY,
          maxWidth,
          lineHeight
        ) {
          const lines = doc.splitTextToSize(text, maxWidth);
          lines.forEach((line, index) => {
            doc.text(line, startX, startY + index * lineHeight);
          });
          return startY + lines.length * lineHeight; // Return the new Y position after rendering the text
        }

        // Common starting Y position
        let startY = 36.5;

        // First set of texts (Client details)
        const maxWidth1 = 72;
        const startX1 = 7;
        const lineHeight1 = 4.2;

        const longText1_1 = `${response.data.clientAdress?.client_name}(${response.data.clientAdress?.client_tax_number})`;
        const longText1_2 = `${response.data.clientAdress?.client_address}`;
        const longText1_3 = `${response.data.clientAdress?.client_email} / ${response.data.clientAdress?.client_phone}`;

        // Render client details
        startY = renderWrappedText(
          doc,
          longText1_1,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        doc.setFontSize(10);
        startY = renderWrappedText(
          doc,
          longText1_2,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );
        startY = renderWrappedText(
          doc,
          longText1_3,
          startX1,
          startY,
          maxWidth1,
          lineHeight1
        );

        // Consignee details
        const maxWidth2 = 72;
        const startX2 = 216.5; // Start X position for the consignee details
        const lineHeight2 = 4.2;
        doc.setFontSize(11);

        const longText2_1 = `${response.data.consigneeAddress?.consignee_name}(${response.data.consigneeAddress?.consignee_tax_number})`;
        const longText2_2 = `${response.data.consigneeAddress?.consignee_address}`;
        const longText2_3 = `${response.data.consigneeAddress?.consignee_email}/${response.data.consigneeAddress?.consignee_phone}`;

        // Reset the startY position for consignee details to align with client details
        let startY2 = 36.5;

        // Render consignee details using the same startY for alignment
        startY2 = renderWrappedText(
          doc,
          longText2_1,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        doc.setFontSize(10);
        startY2 = renderWrappedText(
          doc,
          longText2_2,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        startY2 = renderWrappedText(
          doc,
          longText2_3,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );

        // Determine the maximum Y position to avoid overlap
        startY = Math.max(startY, startY2);

        const formatterNg = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 3,
        });
        const formatterNo = new Intl.NumberFormat("en-US", {
          style: "decimal",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Pre Statement", 7, startY + 0.5);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          startY + 5
        );
        doc.text("Claim : ", 58, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          startY + 5
        );
        doc.text("Payment : ", 100, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          startY + 5
        );
        doc.text("Total : ", 150, startY + 5);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          startY + 5
        );
        await addLogoWithDetails();
        let yTop = startY + 7.5;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount
            ? newFormatter.format(item.Invocied_Amount)
            : "",
          Paid_Amount: item.Paid_Amount,
          Client_Reference: item.Client_Reference,
          TT_Reference: item.TT_Reference,
        }));
        doc.autoTable({
          head: [
            [
              "Date",
              "AWB / BL",
              "Transaction Ref",
              "Currency",
              "Invoiced Amount",
              "Payment",
              "Client Reference",
              "TT Reference",
            ],
          ],
          body: rows.map((row) => [
            row.index,
            row.AWB,
            row.Transaction_Ref,
            row.Currnecy,
            row.Invocied_Amount,
            row.Paid_Amount,
            row.Client_Reference,
            row.TT_Reference,
          ]),
          startY: yTop,
          headStyles: {
            fillColor: "#203764",
            textColor: "#FFFFFF",
            halign: "center",
          },
          bodyStyles: {
            valign: "top",
          },
          styles: {
            overflow: "linebreak",
            textColor: "#000000",
            cellWidth: "wrap",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#203764",
          },
          margin: {
            left: 7,
            right: 7,
          },
          tableWidth: "auto", // Adjust to ensure the table fits within the page
          columnStyles: {
            0: { halign: "left", cellWidth: 25 },
            1: { halign: "left", cellWidth: 42, overflow: "linebreak" },
            2: { halign: "left", cellWidth: 50, overflow: "linebreak" },
            3: { halign: "center", cellWidth: 25 },
            4: { halign: "right" },
            5: { halign: "right", cellWidth: 30 },
            6: { halign: "right", cellWidth: 40, overflow: "linebreak" },
            7: { halign: "right", cellWidth: 35, overflow: "linebreak" },
          },
        });

        yTop = doc.autoTable.previous.finalY + 1;
        const finalY = doc.autoTable.previous.finalY + 4;
        // middle part

        const valueWidth = 20; // Set the fixed width for the value column

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);

        // Invoices
        doc.text(`Invoices :  `, 75, finalY + 1);
        doc.text(
          formatter.format(response.data.data?.statement_Invoices),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_Invoices)
            ),
          finalY + 1
        );

        // Claims
        doc.text(`Claims :`, 75, finalY + 5);
        doc.text(
          formatter.format(response.data.data?.statement_claims),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_claims)
            ),
          finalY + 5
        );

        // Payments
        doc.text(`Payments :`, 75, finalY + 9);
        doc.text(
          formatter.format(response.data.data?.statement_payments),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_payments)
            ),
          finalY + 9
        );

        // Line
        doc.rect(75, finalY + 11, 50, 0.5, "FD");

        // Total
        doc.text("Total :", 75, finalY + 16);
        doc.text(
          formatter.format(response.data.data?.statement_Totals),
          105 +
            valueWidth -
            doc.getTextWidth(
              formatter.format(response.data.data?.statement_Totals)
            ),
          finalY + 16
        );

        // bottom part
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Total History", 7, finalY + 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Invoices),
          24,
          finalY + 24
        );
        doc.text("Claim : ", 58, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Claims),
          71,
          finalY + 24
        );
        doc.text("Payment : ", 100, finalY + 24);
        doc.text(
          formatter.format(response.data.data?.Total_Payment),
          119,
          finalY + 24
        );
        doc.text("Total : ", 150, finalY + 24);
        doc.text(formatter.format(response.data.data?.Total), 162, finalY + 24);
        // page number
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const addPageNumbers = (doc) => {
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`${i} out  of ${pageCount}`, 274, 3.1);
          }
        };
        // Add page numbers
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        // Upload the PDF to the server
        await uploadPDF(pdfBlob);
      }
      // Handle the response data as needed
      setFromDate("");
      setConsigneeIdSet("");
      setClientIdSet("");
      setToDate("");
      toast.success("Statement Added successful");
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  const uploadPDF = async (pdfBlob) => {
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `_Statement_${formatDate(new Date())}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_Statement_${formatDate(new Date())}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  }
  // const formatter = new Intl.NumberFormat("en-US", {
  //   style: "decimal",
  //   minimumFractionDigits: 2, // Ensures at least 2 digits after the decimal point
  //   maximumFractionDigits: 2, // Ensures no more than 2 digits after the decimal point
  // });

  const newFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const newFormatter3 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
  });
  const [state, setState] = useState({
    consignee_id: from?.consignee_id || "",
    CODE: from?.CODE || "",
    brand: from?.brand || "",
    client_id: from?.client_id || "",
    client_name: from?.client_name || "",
    client_tax_number: from?.client_tax_number || "",
    client_email: from?.client_email || "",
    client_phone: from?.client_phone || "",
    client_address: from?.client_address || "",
    Default_location: from?.Default_location || "",
    currency: from?.currency || "",
    port_of_orign: from?.port_of_orign || "",
    destination_port: from?.destination_port || "",
    Commission_Currency: from?.Commission_Currency || "FX",
    liner_Drop: from?.liner_Drop || "",
    profit: from?.profit || "",
    rebate: from?.rebate || "",
    commission: from?.commission || "",
    commission_value: from?.commission_value || "",
    notify_name: from?.notify_name || "",
    notify_tax_number: from?.notify_tax_number || "",
    notify_email: from?.notify_email || "",
    client_email: from?.client_email || "",
    notify_phone: from?.notify_phone || "",
    client_phone: from?.client_phone || "",
    notify_address: from?.notify_address || "",
    user_id: localStorage.getItem("id"),
    client_bank_account: from?.client_bank_account || "",
    client_bank_name: from?.client_bank_name || "",
    client_bank_number: from?.client_bank_number || "",
  });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? (checked ? "THB" : "FX") : value;
    setState((prevState) => ({
      ...prevState,
      [name]: name === "Commission_Currency" && value === "" ? "FX" : newValue,
    }));
  };
  const [dataCustomization, setDataCustomization] = useState({
    Consignee_id: from?.consignee_id || "",
    ITF: "",
    Custom_Name: "",
    Dummy_Price: "",
  });
  const { data: brands } = useQuery("getBrand");
  const { data: paymentChannle } = useQuery("PaymentChannela");

  // const { data: client } = useQuery("getAllClients");
  const { data: getItf } = useQuery("getItf");
  console.log(getItf);
  const { data: port } = useQuery("getAllAirports");
  const { data: liner } = useQuery("getLiner");
  const { data: commission } = useQuery("getDropdownCommissionType");
  const { data: locations } = useQuery("getLocation");
  const { data: contactType } = useQuery("DropdownContactType ");
  const [state1, setState1] = useState({
    client_id: "",
    contact_type_id: "",
    contact_id: "",
    consignee_id: from?.consignee_id || "", // Assuming you want to capture this in the form as well
    first_name: "",
    last_name: "",
    position: "",
    Email: "",
    mobile: "",
    landline: "",
    birthday: "",
    Notes: "",
    Nick_name: "",
  });
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setState1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const summaryTable = async (Payment_ID) => {
    const dataToSubmit = paymentTable1
      .filter((item) => checkedItems[item.transaction_ref]) // Filter only checked items
      .map((item) => ({
        Invoice_ID: item.invoice_id,
        FX_Payment: paidAmounts[item.transaction_ref] || 0,
        Payment_ID: Payment_ID,
      }));

    try {
      const response = await axios.post(
        `${API_BASE_URL}/insertInvoicePayment`,
        {
          datas: dataToSubmit,
        }
      );
      toast.success("Payment data submitted successfully");
      console.log(response);
      // Handle successful response
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      // Handle error
    }
  };

  const handleSubmit1 = async () => {
    // Calculate totalPaidAmount based on checked rows
    const totalPaidAmount = paymentTable1.reduce((total, item) => {
      if (checkedItems[item.transaction_ref]) {
        return total + (parseFloat(paidAmounts[item.transaction_ref]) || 0);
      }
      return total;
    }, 0);

    // Convert fxPayment to float for accurate comparison
    const parsedFxPayment = parseFloat(fxPayment);
    console.log(parsedFxPayment.toFixed(2));
    console.log(totalPaidAmount.toFixed(2));

    // Check if parsedFxPayment is not equal to totalPaidAmount
    if (parsedFxPayment.toFixed(2) !== totalPaidAmount.toFixed(2)) {
      toast.error("Total Paid Amount does not match FX Payment value.");
      return;
    }

    // Filter and map selected payment details for submission
    const selectedPaymentDetails = paymentTable1
      .filter((item) => checkedItems[item.transaction_ref])
      .map((item) => ({
        transaction_ref: item.transaction_ref,
        Ship_date: item.Ship_date,
        awb: item.awb,
        CNF_FX: item.CNF_FX,
        amount_to_Pay: item.amount_to_Pay,
        paidAmount: paidAmounts[item.transaction_ref] || 0,
      }));

    // Prepare payment data object
    const paymentData = {
      user_id: localStorage.getItem("id"),
      Client_id: clientId,
      Consignee_ID: consigneeId,
      Payment_date: paymentDate,
      Payment_Channel: paymentChannel,
      FX_Payment: parsedFxPayment, // Use parsedFxPayment instead of fxPayment
      FX_ID: fxId,
      FX_Rate: fxRate,
      Intermittent_bank_charges: intermittentBankCharges,
      Local_bank_Charges: localBankCharges,
      THB_Received: thbReceived,
      Client_payment_ref: clientPaymentRef,
      Bank_Ref: bankRef,
      paymentDetails: selectedPaymentDetails,
    };

    try {
      // Send POST request to insertClientPayment endpoint
      const response = await axios.post(
        `${API_BASE_URL}/insertClientPayment`,
        paymentData
      );
      console.log("Payment data submitted successfully", response);

      // Update client details and summary table
      getClientDetails();
      setCollectPaymentId(response?.data.data.payment_id);
      summaryTable(response?.data.data.payment_id);

      // Show success toast message
      // toast.success("Payment data submitted successfully");

      // Hide modal after successful submission
      let modalElement = document.getElementById("modalPayment");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        clearAllFields();
        modalInstance.hide();
      }

      // Clear form fields and state after successful submission
      setClientId("");
      setConsigneeId("");
      setPaymentDate("");
      setClientPaymentRef("");
      setPaymentChannel("");
      setBankRef("");
      setFxPayment("");
      setFxRate("");
      setFxId("");
      setIntermittentBankCharges("");
      setLocalBankCharges("");
      setThbReceived("");
      setLossGainOnExchangeRate("");
      setPaidAmounts({});
      setCheckedItems({});
      setPaymentTable1([]);
    } catch (error) {
      // Handle error case
      console.error("Error submitting payment data", error);
      toast.error("Something went wrong");
    }
  };

  // Function to clear all form fields
  const clearAllFields = () => {
    setClientId("");
    setConsigneeId("");
    setPaymentDate("");
    setClientPaymentRef("");
    setPaymentChannel("");
    setBankRef("");
    setFxPayment("");
    setFxRate("");
    setFxId("");
    setIntermittentBankCharges("");
    setLocalBankCharges("");
    setThbReceived("");
    setLossGainOnExchangeRate("");
    setPaidAmounts({});
    setCheckedItems({});
  };
  const closeData = () => {
    navigate("/");
    setClientId((prevClientId) => "");
    setConsigneeId((prevConsigneeId) => "");
    console.log(clientId);
    console.log(consigneeId);
    setClientId("");
    setConsigneeId("");
    setPaymentDate("");
    setClientPaymentRef("");
    setPaymentChannel("");
    setBankRef("");
    setFxPayment("");
    setFxRate("");
    setFxId("");
    setIntermittentBankCharges("");
    setLocalBankCharges("");
    setThbReceived("");
    setLossGainOnExchangeRate("");
    setPaidAmounts({});
    setCheckedItems({});
    setPaymentTable1([]);
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setDataCustomization((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { data: currency } = useQuery("getCurrency");
  const [data1, setData1] = useState([]);
  const [customization, setCustomization] = useState([]);

  const getAllContact = () => {
    axios
      .post(`${API_BASE_URL}/getContactList`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        setData1(res.data.data || []);
      });
  };
  const getAllCustomization = () => {
    axios
      .post(`${API_BASE_URL}/getConsigneeCustomization`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        setCustomization(res.data.data || []);
      });
  };
  useEffect(() => {
    getAllContact();
    getAllCustomization();
  }, []);
  const handlePaidAmountChange = (invoiceNumber, value) => {
    setPaidAmounts((prev) => {
      const updatedPaidAmounts = {
        ...prev,
        [invoiceNumber]: value,
      };

      // Calculate the total of all paid amounts for checked items only
      const totalPaidAmount = paymentTable1.reduce((sum, item) => {
        if (checkedItems[item.transaction_ref]) {
          return (
            sum + (parseFloat(updatedPaidAmounts[item.transaction_ref]) || 0)
          );
        }
        return sum;
      }, 0);

      setTotalPaidAmount(totalPaidAmount);
      setFxPayment(totalPaidAmount.toFixed(2));
      return updatedPaidAmounts;
    });
  };

  // const handlePaidAmountChange = (invoiceNumber, value) => {
  //   setPaidAmounts((prev) => {
  //     const updatedPaidAmounts = {
  //       ...prev,
  //       [invoiceNumber]: value,
  //     };

  //     // Calculate the total of all paid amounts
  //     const totalPaidAmount = Object.values(updatedPaidAmounts).reduce(
  //       (sum, amount) => sum + (parseFloat(amount) || 0),
  //       0
  //     );

  //     setTotalPaidAmount(totalPaidAmount);
  //     setFxPayment(totalPaidAmount)
  //     return updatedPaidAmounts;
  //   });
  // };
  // const handlePaidAmountChange = (invoiceNumber, value) => {
  //   setPaidAmounts((prev) => {
  //     const updatedPaidAmounts = {
  //       ...prev,
  //       [invoiceNumber]: value,
  //     };

  //     const totalPaidAmount = Object.values(updatedPaidAmounts).reduce(
  //       (sum, amount) => sum + (parseFloat(amount) || 0),
  //       0
  //     );

  //     setTotalPaidAmount(totalPaidAmount);

  //     return updatedPaidAmounts;
  //   });
  // };
  const submitCusomizationData = () => {
    console.log(dataCustomization);
    axios
      .post(
        `${API_BASE_URL}/createConsigneeCustomize`,
        dataCustomization // Use the updated state directly
      )
      .then((response) => {
        console.log(response);
        toast.success("Customization Data Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        getAllCustomization();
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
        let modalElement = document.getElementById("exampleModalCustomization");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const update = () => {
    axios
      .post(
        `${API_BASE_URL}/${from?.client_id ? "updateClientData" : "addClient"}`,
        state // Use the updated state directly
      )
      .then((response) => {
        navigate("/clientNew");
        toast.success("Updated", {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const customizationDataSubmit = (e) => {
    console.log(dataCustomization);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateConsigneeCustomize`, dataCustomization)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Customize Update  Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // Close the modal
        getAllCustomization();
        let modalElement = document.getElementById(
          "exampleModalCustomizationEdit"
        );
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Clear the form fields
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const contactDataSubmit = (e) => {
    console.log(state1);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/addContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        // Close the modal
        let modalElement = document.getElementById("exampleModalContact");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Clear the form fields
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  // const handleCheckboxChange = (invoiceNumber, isChecked) => {
  //   setCheckedItems((prev) => ({ ...prev, [invoiceNumber]: isChecked }));
  // };
  const handleCheckboxChange = (invoiceNumber, isChecked) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [invoiceNumber]: isChecked };

      // Automatically set Paid Amount to the corresponding amount_to_pay if checked
      const amountToPay = isChecked
        ? paymentTable1.find((item) => item.transaction_ref === invoiceNumber)
            ?.amount_to_pay || 0
        : "";

      // Update Paid Amounts
      setPaidAmounts((prevPaidAmounts) => {
        const updatedPaidAmounts = {
          ...prevPaidAmounts,
          [invoiceNumber]: amountToPay,
        };

        // Calculate the total of all paid amounts for checked items only
        const totalPaidAmount = paymentTable1.reduce((sum, item) => {
          if (updatedCheckedItems[item.transaction_ref]) {
            return (
              sum + (parseFloat(updatedPaidAmounts[item.transaction_ref]) || 0)
            );
          }
          return sum;
        }, 0);

        setTotalPaidAmount(totalPaidAmount);
        setFxPayment(totalPaidAmount.toFixed(2));

        return updatedPaidAmounts;
      });

      return updatedCheckedItems;
    });
  };

  const contactDetailsEdit = (e) => {
    console.log(state1);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateContactDetails`, state1)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success("Contact Update Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        setState1({
          client_id: "",
          contact_type_id: "",
          contact_id: "",
          consignee_id: from?.consignee_id || "",
          first_name: "",
          last_name: "",
          position: "",
          Email: "",
          mobile: "",
          landline: "",
          birthday: "",
          Notes: "",
          Nick_name: "",
        });

        // Close the modal
        let modalElement = document.getElementById("exampleModalEdit");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const handleCurrencyChange = (e) => {
    const selectedCurrencyId = e.target.value;
    setFxId(selectedCurrencyId);
    const selectedCurrency = currency.find(
      (item) => item.currency_id === parseInt(selectedCurrencyId)
    );
    if (selectedCurrency) {
      setFxRate(selectedCurrency.fx_rate);
    } else {
      setFxRate("");
    }
  };
  const handleEditClick = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = data?.find((item) => item.contact_id === id);

    setState1((prevData) => ({
      ...prevData,
      client_id: selectedUser?.client_id || "",
      contact_type_id: selectedUser?.contact_type_id || "",
      consignee_id: selectedUser?.consignee_id || "",
      contact_id: contactId,
      first_name: selectedUser?.first_name || "",
      last_name: selectedUser?.last_name || "",
      position: selectedUser?.position || "",
      Email: selectedUser?.Email || "",
      mobile: selectedUser?.mobile || "",
      landline: selectedUser?.landline || "",
      birthday: selectedUser
        ? new Date(selectedUser.birthday).toISOString().split("T")[0]
        : "",
      Notes: selectedUser?.Notes || "",
      Nick_name: selectedUser?.Nick_name || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  const handleEditClickCustomization = (id) => {
    const contactId = id;
    console.log(contactId);
    const selectedUser = customization?.find((item) => item.Id === id);
    console.log(selectedUser);
    setDataCustomization((prevData) => ({
      ...prevData,
      Consignee_Customize_id: contactId || "",
      ITF: selectedUser?.ITF || "",
      Custom_Name: selectedUser?.Custom_Name || "",
      Dummy_Price: selectedUser?.Dummy_Price || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };

  // const formatDate = (dateString) => {
  //   if (!dateString) return "";
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  //   const year = date.getFullYear();
  //   return `${day}-${month}-${year}`;
  // };
  console.log(state.Commission_Currency);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const getDashboard = () => {
    axios
      .get(`${API_BASE_URL}/AccountingStatistics`)
      .then((res) => {
        console.log(res);
        // setData(res.data.data);
        setData(res.data.data);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getDashboard();
  }, []);
  // const formatter = new Intl.NumberFormat("en-US", {
  //   style: "decimal",
  //   minimumFractionDigits: 0,
  // });

  const email = localStorage.getItem("email");
  // const role = localStorage.getItem("role");
  return (
    <div>
      {role == "Operation" ? (
        ""
      ) : (
        <main className="main-content position-relative  border-radius-lg ">
          <div className="container-fluid">
            <nav
              className=" flexNavAcc navbar navbar-main navbar-expand-lg px-0  shadow-none border-radius-xl"
              id="navbarBlur"
              navbar-scroll="true"
            >
              <div className="container-fluid py-1 px-0">
                <nav aria-label="breadcrumb" style={{ width: "100%" }}>
                  <h6 className="font-weight-bolder mb-0">
                    {t("dashboard.DashboardHead")}
                  </h6>
                </nav>

                {/* Button trigger modal */}

                {/* <div
                                className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                                id="navbar"
                            >
                                <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                                    <div className="input-group input-group-outline">
                                        <label className="form-label">Type here...</label>
                                        <input type="text" className="form-control" />
                                    </div>
                                </div>
                                <ul className="navbar-nav  justify-content-end">
                                    <li className="nav-item dropdown pe-2 d-flex align-items-center">
                                        <a
                                            className="nav-link text-body p-0"
                                            id="dropdownSettingButton"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa fa-cog fixed-plugin-button-nav cursor-pointer"></i>
                                        </a>
                                        <ul
                                            className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
                                            aria-labelledby="dropdownSettingButton"
                                        >
                                            <li className="mb-2">
                                                <a className="dropdown-item border-radius-md">
                                                    <div className="d-flex py-1">
                                                        <div className="my-auto">
                                                            <img
                                                                src="../assets/img/team-2.jpg"
                                                                className="avatar avatar-sm  me-3 "
                                                            />
                                                        </div>
                                                        <div className="d-flex flex-column justify-content-center">
                                                            <h6 className="text-sm font-weight-normal mb-1">
                                                                {" "}
                                                                <span className="font-weight-bold">
                                                                    New message
                                                                </span>
                                                                from Laur{" "}
                                                            </h6>
                                                            <p className="text-xs text-secondary mb-0">
                                                                {" "}
                                                                <i className="fa fa-clock me-1"></i> 13 minutes
                                                                ago{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a className="dropdown-item border-radius-md">
                                                    <div className="d-flex py-1">
                                                        <div className="my-auto">
                                                            <img
                                                                src="../assets/img/small-logos/logo-spotify.svg"
                                                                className="avatar avatar-sm bg-gradient-dark  me-3 "
                                                            />
                                                        </div>
                                                        <div className="d-flex flex-column justify-content-center">
                                                            <h6 className="text-sm font-weight-normal mb-1">
                                                                {" "}
                                                                <span className="font-weight-bold">
                                                                    New album
                                                                </span>
                                                                by Travis Scott{" "}
                                                            </h6>
                                                            <p className="text-xs text-secondary mb-0">
                                                                {" "}
                                                                <i className="fa fa-clock me-1"></i> 1 day{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown pe-2 d-flex align-items-center">
                                        <a
                                            className="nav-link text-body p-0"
                                            id="dropdownMenuButton"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="fa fa-bell cursor-pointer"></i>
                                        </a>
                                        <ul
                                            className="dropdown-menu  dropdown-menu-end  px-2 py-3 me-sm-n4"
                                            aria-labelledby="dropdownMenuButton"
                                        >
                                            <li className="mb-2">
                                                <a className="dropdown-item border-radius-md">
                                                    <div className="d-flex py-1">
                                                        <div className="my-auto">
                                                            <img
                                                                src="../assets/img/team-2.jpg"
                                                                className="avatar avatar-sm  me-3 "
                                                            />
                                                        </div>
                                                        <div className="d-flex flex-column justify-content-center">
                                                            <h6 className="text-sm font-weight-normal mb-1">
                                                                {" "}
                                                                <span className="font-weight-bold">
                                                                    New message
                                                                </span>
                                                                from Laur{" "}
                                                            </h6>
                                                            <p className="text-xs text-secondary mb-0">
                                                                {" "}
                                                                <i className="fa fa-clock me-1"></i> 13 minutes
                                                                ago{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="mb-2">
                                                <a className="dropdown-item border-radius-md">
                                                    <div className="d-flex py-1">
                                                        <div className="my-auto">
                                                            <img
                                                                src="../assets/img/small-logos/logo-spotify.svg"
                                                                className="avatar avatar-sm bg-gradient-dark  me-3 "
                                                            />
                                                        </div>
                                                        <div className="d-flex flex-column justify-content-center">
                                                            <h6 className="text-sm font-weight-normal mb-1">
                                                                {" "}
                                                                <span className="font-weight-bold">
                                                                    New album
                                                                </span>
                                                                by Travis Scott{" "}
                                                            </h6>
                                                            <p className="text-xs text-secondary mb-0">
                                                                {" "}
                                                                <i className="fa fa-clock me-1"></i> 1 day{" "}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div> */}
              </div>
            </nav>
            <div className="row newSmallCard ">
              <div className="selectTimeHead">
                <h6>{t("dashboard.timePeriod")} :</h6>
              </div>
              <div className="flex flex-wrap">
                <div>
                  <div className="selectTimeParent">
                    <div className="ceateTransport quotationSelectSer me-2">
                      <Autocomplete
                        options={clients || []}
                        getOptionLabel={(option) => option.client_name || ""}
                        onChange={(event, newValue) => {
                          handleChange5({
                            target: {
                              name: "client_id",
                              value: newValue ? newValue.client_id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("dashboard.SelectClient")}
                            variant="outlined"
                          />
                        )}
                      />
                    </div>

                    <div className="ceateTransport quotationSelectSer me-2">
                      <Autocomplete
                        options={
                          consignees1?.map((v) => ({
                            id: v.consignee_id,
                            name: v.consignee_name,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedConsigneeId(newValue ? newValue.id : "");
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("dashboard.SelectConsignee")}
                            variant="outlined"
                          />
                        )}
                      />
                    </div>

                    {dataPeriod.map((item) => (
                      <div
                        key={item.ID}
                        className="timeMonth timePeriod"
                        onClick={() => handlePeriodClick(item.Period, item.ID)}
                      >
                        <p>{item.Period}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="selectProduce">
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
                        placeholder={t("dashboard.ComparisonPeriod")}
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
                    {t("dashboard.ConfirmBtn")}
                  </button>
                </div>
              </div>
            </div>
            <div className="container-fluid py-4 px-0">
              <div className="row dashCard53">
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card  ">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        {/* <i className=" material-icons  mdi mdi-account-multiple"></i> */}
                        <div
                          style={{
                            fontSize: "25px",
                            color: "#d2d7e0",
                            paddingTop: "13px",
                          }}
                        >
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Income?.Count_
                            ? boxsData?.Income?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {" "}
                          {boxsData?.Income?.Title
                            ? boxsData?.Income?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Income?.Total
                            ? boxsData?.Income?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Income?.Difference
                            ? boxsData?.Income?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
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
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Expenses?.Count_
                            ? boxsData?.Expenses?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Expenses?.Title
                            ? boxsData?.Expenses?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Expenses?.Total
                            ? boxsData?.Expenses?.Total
                            : 0}{" "}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Expenses?.Difference
                            ? boxsData?.Expenses?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        {/* <i className=" material-icons  mdi mdi-account-multiple"></i> */}
                        {/* <i className=" material-icons mdi mdi-purse"></i> */}
                        <div
                          style={{
                            fontSize: "25px",
                            color: "#d2d7e0",
                            paddingTop: "13px",
                          }}
                        >
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Claim?.Count_
                            ? boxsData?.Claim?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Claim?.Title ? boxsData?.Claim?.Title : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Claim?.Total ? boxsData?.Claim?.Total : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Claim?.Difference
                            ? boxsData?.Claim?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
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
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Profit?.Count_
                            ? boxsData?.Profit?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Profit?.Title
                            ? boxsData?.Profit?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Profit?.Total
                            ? boxsData?.Profit?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Profit?.Difference
                            ? boxsData?.Profit?.Difference
                            : 0}
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        {/* <i className=" material-icons  mdi mdi-account-multiple"></i> */}
                        {/* <i className=" material-icons mdi mdi-purse"></i> */}

                        <div
                          style={{
                            fontSize: "25px",
                            color: "#d2d7e0",
                            paddingTop: "13px",
                          }}
                        >
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Receivable?.Count_
                            ? boxsData?.Receivable?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Receivable?.Title
                            ? boxsData?.Receivable?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {" "}
                          {boxsData?.Receivable?.Total
                            ? boxsData?.Receivable?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Receivable?.Difference
                            ? boxsData?.Receivable?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        {/* <i className=" material-icons  mdi mdi-account-multiple"></i> */}
                        <div
                          style={{
                            fontSize: "25px",
                            color: "#d2d7e0",
                            paddingTop: "13px",
                          }}
                        >
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Payables?.Count_
                            ? boxsData?.Payables?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Payables?.Title
                            ? boxsData?.Payables?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Payables?.Total
                            ? boxsData?.Payables?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Payables?.Difference
                            ? boxsData?.Payables?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
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
                          {/* {consigeeDetails?.Total_shipments} */}
                          {boxsData?.Freight?.Count_
                            ? boxsData?.Freight?.Count_
                            : 0}{" "}
                        </div>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Freight?.Title
                            ? boxsData?.Freight?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Freight?.Total
                            ? boxsData?.Freight?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Freight?.Difference
                            ? boxsData?.Freight?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mt-5">
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
                          {boxsData?.Manhour?.Count_
                            ? boxsData?.Manhour?.Count_
                            : 0}{" "}
                        </div>{" "}
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.Manhour?.Title
                            ? boxsData?.Manhour?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.Manhour?.Total
                            ? boxsData?.Manhour?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Manhour?.Difference
                            ? boxsData?.Manhour?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="statics_title mb-4">
                  <h6 className="font-weight-bolder mb-0">Statics</h6>
                </div> */}

                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        <i className=" material-icons  mdi mdi-account-multiple"></i>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.NW?.Title ? boxsData?.NW?.Title : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.NW?.Total ? boxsData?.NW?.Total : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.NW?.Difference
                            ? boxsData?.NW?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        <i className=" material-icons  mdi mdi-account-multiple"></i>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {boxsData?.GW?.Title ? boxsData?.GW?.Title : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.GW?.Total ? boxsData?.GW?.Total : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.GW?.Difference
                            ? boxsData?.GW?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        <i className=" material-icons  mdi mdi-account-multiple"></i>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {" "}
                          {boxsData?.AR_Ratios?.Title
                            ? boxsData?.AR_Ratios?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {boxsData?.AR_Ratios?.Total
                            ? boxsData?.AR_Ratios?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.AR_Ratios?.Difference
                            ? boxsData?.AR_Ratios?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                  <div className="card">
                    <div className="card-header p-3 pt-2">
                      <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                        <i className=" material-icons  mdi mdi-account-multiple"></i>
                      </div>
                      <div className="text-end pt-1">
                        <p className="text-sm mb-0 text-capitalize">
                          {" "}
                          {boxsData?.Ratios?.Title
                            ? boxsData?.Ratios?.Title
                            : ""}
                        </p>
                        <h4 className="mb-0">
                          {" "}
                          {boxsData?.Ratios?.Total
                            ? boxsData?.Ratios?.Total
                            : 0}
                        </h4>
                      </div>
                    </div>
                    <hr className="dark horizontal my-0" />
                    <div className="card-footer p-3">
                      <p className="mb-0">
                        <span className="text-success text-sm font-weight-bolder">
                          {boxsData?.Ratios?.Difference
                            ? boxsData?.Ratios?.Difference
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 mb20">
                  <div className="itemsOrderSearch">
                    <h3 className="itemOrder">
                      {t("dashboard.itemOrderHead")}
                    </h3>

                    <div className="selectProduce">
                      <Autocomplete
                        disablePortal
                        options={value.slice(0, 3)} // Only the top three options
                        value={
                          value.find((item) => item.ID === selectedInvoiceId) ||
                          null
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
                            placeholder={t("dashboard.invoiceValue")}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="tableCreateClient">
                    <table>
                      <tr>
                        <th>{t("dashboard.topH1")}</th>
                        <th>{t("dashboard.topH2")}</th>
                        <th>{t("dashboard.topH3")}</th>
                        <th>{t("dashboard.topH4")}</th>
                        <th>{t("dashboard.topH5")}</th>
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
                        placeholder={t("dashboard.select")}
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
          </div>
        </main>
      )}
    </div>
  );
};

export default DashboardNew;
