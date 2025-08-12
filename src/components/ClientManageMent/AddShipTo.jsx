import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import Select from "react-select";
import ReactApexChart from "react-apexcharts";
import MySwal from "../../swal";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Card } from "../../card";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
const AddShipTo = () => {
  const [t, i18n] = useTranslation("global");
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [unitDropdown, setUnitDropDown] = useState([]);
  const getUnitDropdown = () => {
    axios
      .get(`${API_BASE_URL}/getAllUnit`)
      .then((resp) => {
        console.log(resp);

        setUnitDropDown(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useState(() => {
    getUnitDropdown();
  }, []);

  //
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [consigeeDetails, setconsigeeDetails] = useState("");
  const [useAgreedPricing, setUseAgreedPricing] = useState(
    from?.agreed_price !== undefined ? from.agreed_price : false
  );
  const [itemDetails, setItemDetails] = useState(
    from?.custom_name !== undefined ? from.custom_name : false
  );
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(
    from?.invoice_options !== undefined ? from.invoice_options : "invoice only"
  );
  const [selectedDeliveryTerm, setSelectedDeliveryTerm] = useState(
    from?.delivery_terms !== undefined ? from.delivery_terms : "CIF"
  );
  const [exchangeRate, setExchangeRate] = useState(
    from?.exchange_rate !== undefined ? from.exchange_rate : false
  );
  const [cbm, setCbm] = useState(
    from?.gw_cbm !== undefined ? from.gw_cbm : true
  );
  const [selectedInvoice, setSelectedInvoice] = useState(
    from?.invoice_name !== undefined ? from.invoice_name : "Client"
  );
  const [options, setOptions] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(""); // Default dataset
  console.log(selectedDataset);
  const [fromDate, setFromDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [orderItem, setOrderItem] = useState([]);
  const [claimValue, setClaimvalue] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [claimValue1, setClaimvalue1] = useState("");
  const [toDate, setToDate] = useState("");
  // new statics
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [date4, setDate4] = useState("");
  const [selectedcomparison, setSelectedComparison] = useState("");
  const [value, setValue] = useState([]);
  const [boxsData, setBoxsData] = useState("");
  const [topFiveValue, setTopFiveValue] = useState("");
  const [exchangeRate1, setExchangeRate1] = useState(
    from?.barcode !== undefined ? from.barcode : false
  );
  // new statistic end
  const [state7, setState7] = useState({
    User_ID: localStorage.getItem("id"),
    Consignee: from?.Consignee ?? 1,
    vendor_id: from?.ID ?? undefined,
    name: from?.Name ?? "",
    taxId: from?.TAX ?? "",
    Entity: from?.Legal_Entity ?? "",
    phone: from?.Phone_Main ?? "",
    email: from?.Email_Main ?? "",
    Messenger_Type: from?.Messenger_Type ?? "",
    messangerId: from?.Messenger_Main_ID ?? "",
    address1: from?.Address1 ?? "",
    address2: from?.Address2 ?? "",
    Bank_Name: from?.Bank_Name ?? "",
    Bank_Branch: from?.Bank_Branch ?? "",
    Bank_Account: from?.Bank_Account ?? "",
    Bank_IBAN: from?.Bank_IBAN ?? "",
    Bank_Swift: from?.Bank_Swift ?? "",
    Bank_Country: from?.Bank_Country ?? "",
    Bank_Address: from?.Bank_Address ?? "",
  });
  const { data: dropdownVendor } = useQuery("getDropdownVendor");
  const { data: dropdownDistrict } = useQuery("getDropdownAddressDistrict");
  const { data: dropdownSubDistrict } = useQuery(
    "getDropdownAddressSub-district"
  );
  const availableDistrict = useMemo(() => {
    return dropdownDistrict?.filter((item) => item._id == state7.provinces);
  }, [state7.provinces, dropdownDistrict]);

  const availableSubDistrict = useMemo(() => {
    return dropdownSubDistrict?.filter((item) => item._id == state7.district);
  }, [
    state7.provinces,
    dropdownDistrict,
    state7.district,
    dropdownSubDistrict,
  ]);
  console.log(availableSubDistrict);
  useEffect(() => {
    const p = dropdownSubDistrict?.find(
      (item) => item.code == state7.id
    )?.zipcode;
    if (p)
      setState7((prevState) => {
        return {
          ...prevState,
          postcode: p,
        };
      });
  }, [state7.subdistrict, dropdownSubDistrict]);

  const handleChange9 = (event) => {
    const { name, value } = event.target;
    setState7((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updateVendor = async () => {
    try {
      setIsButtonClicked(true); // Set button clicked state to true
      await axios.post(
        `${API_BASE_URL}/${
          typeof state7.vendor_id == "undefined" ? "addVC" : "updateVC"
        }`,
        {
          id: state7.vendor_id,
          User_ID: state7.User_ID,
          name: state7.name,
          taxId: state7.taxId,
          Phone_Main: state7.phone,
          Email_Main: state7.email,
          Messenger_Type: state7.Messenger_Type,
          Messenger_Main_ID: state7.messangerId,
          Country: selectedCountry?.name || "",
          Province: selectedProvince?.name || "",
          District: selectedDistrict?.name || "",
          Subdistrict: selectedSubdistrict?.name || "",
          Postcode: postalCode,
          Address1: state7.address1,
          Address2: state7.address2,
          Bank_Name: state7.Bank_Name,
          Legal_Entity: state7.Entity,
          Bank_Branch: state7.Bank_Branch,
          Bank_Account: state7.Bank_Account,
          Bank_IBAN: state7.Bank_IBAN,
          Bank_Swift: state7.Bank_Swift,
          Bank_Country: state7.Bank_Country,
          Bank_Address: state7.Bank_Address,
          Consignee: state7.Consignee || 1,
        }
      );
      toast.success(t("success"));

      navigate("/shipToNew");
    } catch (error) {
      toast.error(t("errorWhileSaving"));
    }
  };

  const countries = ["WhatsApp", "Telegram"];
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [countryList, setCountryList] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/countries`)
      .then((res) => {
        if (Array.isArray(res.data?.countries)) {
          setCountryList(res.data.countries);
        } else {
          console.error("Expected countries array not found", res.data);
        }
      })
      .catch((err) => console.error("Axios error:", err));
  }, []);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  useEffect(() => {
    const fetchProvinces = async () => {
      if (!selectedCountry?.id) {
        setProvinceList([]);
        setSelectedProvince(null);
        return;
      }

      try {
        const { data } = await axios.get(
          `https://r3.siameats.net/api/provinces/${selectedCountry.id}`
        );
        if (Array.isArray(data?.provinces)) {
          setProvinceList(data.provinces);
        } else {
          console.error("Expected 'provinces' to be an array", data);
          setProvinceList([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinceList([]);
      }
    };

    fetchProvinces();
  }, [selectedCountry]);
  // district
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  useEffect(() => {
    if (!selectedProvince?.id) {
      setDistrictList([]);
      setSelectedDistrict(null);
      return;
    }

    axios
      .get(`${API_BASE_URL}/districts/${selectedProvince.id}`)
      .then(({ data }) => {
        console.log("", data);
        if (Array.isArray(data?.districts)) {
          setDistrictList(data.districts);
        } else {
          console.error("Expected districts array", data);
          setDistrictList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching districts:", err);
        setDistrictList([]);
      });
  }, [selectedProvince]);
  // sub district
  const [subdistrictList, setSubdistrictList] = useState([]);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
  useEffect(() => {
    if (!selectedDistrict?.id) {
      setSubdistrictList([]);
      setSelectedSubdistrict(null);
      return;
    }

    axios
      .get(`${API_BASE_URL}/subdistricts/${selectedDistrict.id}`)
      .then(({ data }) => {
        console.log("pratimaDis", data);
        if (Array.isArray(data?.Subdistricts)) {
          setSubdistrictList(data.Subdistricts);
        } else {
          console.error("pratima", data);
          setSubdistrictList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching subdistricts:", err);
        setSubdistrictList([]);
      });
  }, [selectedDistrict]);

  const [postalCode, setPostalCode] = useState(null);

  useEffect(() => {
    if (!selectedSubdistrict?.lat || !selectedSubdistrict?.lng) {
      setPostalCode("");
      return;
    }

    axios
      .get(
        `${API_BASE_URL}/postal-code?lat=${selectedSubdistrict.lat}&lng=${selectedSubdistrict.lng}`
      )
      .then(({ data }) => {
        if (data?.date?.postal_code) {
          setPostalCode(data.date.postal_code);
        } else {
          setPostalCode("");
        }
      })
      .catch(() => {
        setPostalCode("");
      });
  }, [selectedSubdistrict]);
  // Pre-fill form for update mode
  useEffect(() => {
    if (!from || countryList.length === 0) return;

    // 1️⃣ Find Country
    const countryObj = countryList.find((c) => c.name === from.Country);
    if (countryObj) {
      setSelectedCountry(countryObj);

      // Fetch provinces and set province
      axios
        .get(`https://r3.siameats.net/api/provinces/${countryObj.id}`)
        .then(({ data }) => {
          if (Array.isArray(data?.provinces)) {
            setProvinceList(data.provinces);
            const provinceObj = data.provinces.find(
              (p) => p.name === from.Province
            );
            if (provinceObj) {
              setSelectedProvince(provinceObj);

              // Fetch districts and set district
              axios
                .get(`${API_BASE_URL}/districts/${provinceObj.id}`)
                .then(({ data }) => {
                  if (Array.isArray(data?.districts)) {
                    setDistrictList(data.districts);
                    const districtObj = data.districts.find(
                      (d) => d.name === from.District
                    );
                    if (districtObj) {
                      setSelectedDistrict(districtObj);

                      // Fetch subdistricts and set subdistrict
                      axios
                        .get(`${API_BASE_URL}/subdistricts/${districtObj.id}`)
                        .then(({ data }) => {
                          if (Array.isArray(data?.Subdistricts)) {
                            setSubdistrictList(data.Subdistricts);
                            const subdistrictObj = data.Subdistricts.find(
                              (s) => s.name === from.Subdistrict
                            );
                            if (subdistrictObj) {
                              setSelectedSubdistrict(subdistrictObj);
                              setPostalCode(from.Postcode || "");
                            }
                          }
                        });
                    }
                  }
                });
            }
          }
        });
    }
  }, [from, countryList]);
  const getAllTimePeriod = () => {
    axios.get(`${API_BASE_URL}/statisticsDateSelection1`).then((res) => {
      console.log(res);
      setDataPeriod(res.data.details || []);
    });
  };
  const getComparisonPeriod = () => {
    axios.get(`${API_BASE_URL}/StatisticsDATESelection2`).then((res) => {
      console.log(res);
      setDataComparison(res.data.details || []);
    });
  };
  const handleDropdownChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedDataset(selectedOption.value); // Set ID as selected dataset
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

  const handleRadioChange = (event) => {
    setSelectedInvoice(event.target.value);
  };
  const handleAgreedPricingChange3 = (e) => {
    setExchangeRate(e.target.checked);
    console.log(exchangeRate);
  };
  const handleChange7 = (event) => {
    setSelectedDeliveryTerm(event.target.value);
  };
  const handleChange8 = (event) => {
    setSelectedInvoiceOrder(event.target.value);
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
  useEffect(() => {
    getData2();
  }, [selectedId, selectedcomparison, date1, date2]);
  const getAllProduce = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      console.log(res);
    });
  };

  // Fetch data from API and map to options for dropdown
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
  const handleAgreedPricingChange4 = (e) => {
    setExchangeRate1(e.target.checked);
    console.log(exchangeRate1);
  };
  useEffect(() => {
    orderData1();
  }, []);
  useEffect(() => {
    getData();
  }, [selectedId]);
  useEffect(() => {
    getAllProduce();
    getAllTimePeriod();
    getComparisonPeriod();
  }, []);
  const handleAgreedPricingChange = (e) => {
    setUseAgreedPricing(e.target.checked);
    console.log(useAgreedPricing);
  };
  const handleAgreedPricingChange1 = (e) => {
    setItemDetails(e.target.checked);
    console.log(itemDetails);
  };
  const handleAgreedPricingChange2 = (e) => {
    setCbm(e.target.checked);
    console.log(cbm);
  };
  const confirmData = async () => {
    let obj = {
      Start_Date: date1,
      Stop_Date: date2,
    };

    console.log("confirm data is", obj);

    if (!date1) {
      toast.error(t("startDateRequired"));
      return;
    }
    if (!date2) {
      toast.error(t("stopDateRequired"));
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
      toast.success(t("dataFetchedSuccess"));
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("failedToFetch"));
    }
  };
  const confirmData1 = async () => {
    // Validation checks
    if (!date1) {
      toast.error(t("startDateRequired"));
      return;
    }
    if (!date2) {
      toast.error(t("stopDateRequired"));
      return;
    }
    if (!date3) {
      toast.error(t("compareStartDateRequired"));
      return;
    }
    if (!date4) {
      toast.error(t("compareEndDateRequired"));
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
      toast.success(t("dataFetchedSuccess"));
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("dataFetchFailed"));
    }
  };

  // Trigger API call when selectedInvoiceId changes
  useEffect(() => {
    if (selectedInvoiceId) {
      confirmData1();
    }
  }, [selectedInvoiceId]); // Only runs when `selectedInvoiceId` changes

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

  //       // Correctly map Selected_Period and Compared_To_Period data
  //       const comparedToPeriodData = GraphData[0].map((item) => ({
  //         x: item.X,
  //         y: parseFloat(item.Compared_To_Period),
  //         date: item.X, // Use X directly as the date since no Date field is available
  //       }));

  //       const selectedPeriodData = GraphData[1].map((item) => ({
  //         x: item.X,
  //         y: parseFloat(item.Selected_Period),
  //         date: item.X, // Use X directly as the date since no Date field is available
  //       }));

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
  //           categories: [
  //             ...new Set([
  //               ...comparedToPeriodData.map((item) => item.x),
  //               ...selectedPeriodData.map((item) => item.x),
  //             ]),
  //           ],
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
  const dataClear = () => {
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
  };

  const dataClear1 = () => {
    setDataCustomization({
      Consignee_id: "",
      ITF: "",
      brand: "",
      Custom_Name: "",
      Dummy_Price: "",
      Barcode: "",
      Unit: from?.Invoice_Unit,
    });
  };
  const updatedata = async () => {
    console.log(
      selectedInvoiceOrder,
      selectedDeliveryTerm,
      exchangeRate,
      selectedInvoice,
      cbm,
      itemDetails,
      useAgreedPricing
    );

    const payload = {
      consignee_id: from?.consignee_id,
      agreed_price: useAgreedPricing ? 1 : 0,
      custom_name: itemDetails ? 1 : 0,
      gw_cbm: cbm ? 1 : 0,
      invoice_name: selectedInvoice,
      exchange_rate: exchangeRate ? 1 : 0,
      delivery_terms: selectedDeliveryTerm,
      barcode: exchangeRate1 ? 1 : 0,
      invoice_options: selectedInvoiceOrder,
    };

    try {
      // API call
      const response = await axios.post(
        `${API_BASE_URL}/updateConsigneeInvoiceOptions`,
        payload
      );
      console.log("API Response:", response);

      toast.success(t("invoiceSetupUpdated"));
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("fetchDataFailed"));
    }
  };

  const confirmData2 = () => {
    if (!date1) {
      toast.error(t("startDateRequired"));
      return;
    }
    if (!date2) {
      toast.error(t("stopDateRequired"));
      return;
    }
    if (!date3) {
      toast.error(t("compareStartDateRequired"));
      return;
    }
    if (!date4) {
      toast.error(t("compareEndDateRequired"));
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
          const item = GraphData[0]?.find((entry) => entry.X === date);

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
          const item = GraphData[1]?.find((entry) => entry.X === date);
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
        toast.error(t("fetchDataFailed"));
      });
  };

  useEffect(() => {
    if (selectedDataset) {
      confirmData2();
    }
  }, [selectedDataset]);
  console.log(selectedItemId);

  console.log(from);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    notify_name: "",
    notify_tax_number: "",
    notify_email: "",
    notify_phone: "",
    notify_address: "",
  });
  const [state5, setState5] = useState({
    invoiceCurrency: "",
    markup: "",
    rebate: "",
    commissionType: "",
    Invoice_Unit: "",
    commissionValue: "",
    commissionCurrency: "",
    chargeVolume: "",
    deliveryTerms: "",
    paymentTerms: "",
    statementDueDate: 1,
    extraCost: "",
    markupValue: "",
    freightAdjust: "",
    rebateValue: "",
    quotation: "",
    claim: "",
    other: "",
    final: "",
    Rounding: "",
  });
  const oneQoutationData = () => {
    if (from?.consignee_id) {
      axios
        .get(`${API_BASE_URL}/getConsigneeByID`, {
          params: {
            consignee_id: from.consignee_id,
          },
        })
        .then((response) => {
          const data = response.data.data;
          console.log(data);
          // Update formData with fetched values
          setFormData({
            notify_name: data.notify_name || "",
            notify_tax_number: data.notify_tax_number || "",
            notify_email: data.notify_email || "",
            notify_phone: data.notify_phone || "",
            notify_address: data.notify_address || "",
          });
          setState5({
            invoiceCurrency: data?.currency,
            Invoice_Unit: data?.Invoice_Unit,
            markup: "",
            rebate: data?.rebate,
            commissionType: data?.commission,
            commissionValue: data?.commission_value,
            commissionCurrency: data?.Commission_Currency,
            chargeVolume: data?.Charge_Volume,
            deliveryTerms: data?.Incoterms,
            paymentTerms: data?.Payment_Terms,
            statementDueDate: 1,
            extraCost: data?.Extra_cost,
            markupValue: data?.profit,
            rebateValue: data?.rebate,
            quotation: data?.Quotation_Margin,
            claim: claimValue,
            other: data?.Extra_Margin,
            freightAdjust: data?.Freight_Adjustment,
            Rounding: data?.Rounding,
            final: "",
          });
        })
        .catch((error) => {
          console.error("Error fetching consignee data:", error);
        });
    }
  };

  // Call API when component mounts or `from?.consignee_id` changes
  useEffect(() => {
    oneQoutationData();
  }, [from?.consignee_id]);
  console.log(from?.quotation_id);
  const getCongineeDetails1 = () => {
    axios
      .post(`${API_BASE_URL}/MarginandPayments`, {
        Consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res.data.Consignee_Margin);
        setClaimvalue(res.data.Consignee_Margin);
        setClaimvalue1(res.data.Consignee_Claim_Percentage);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  const handleChange6 = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmit6 = (e) => {
    axios
      .post(`${API_BASE_URL}/updateConsigneeNotify`, {
        consignee_id: from?.consignee_id,
        notify_name: formData.notify_name,
        notify_tax_number: formData.notify_tax_number,
        notify_email: formData.notify_email,
        notify_phone: formData.notify_phone,
        notify_address: formData.notify_address,
      })
      .then(() => {
        oneQoutationData();
        getCongineeDetails1();
        toast.success(t("updatedSuccessfully"), {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        toast.error(t("updateFailed"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };
  const handleChange5 = (e) => {
    const { name, type, checked, value } = e.target;
    if (name === "commissionCurrency") {
      // Toggle between "THB" and "FX"
      setState5((prevState) => ({
        ...prevState,
        commissionCurrency: checked ? "THB" : "FX",
      }));
    } else if (name === "chargeVolume") {
      setState5((prevState) => ({
        ...prevState,
        chargeVolume: checked ? 1 : 0,
      }));
    } else {
      setState5((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // const handleChange5 = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setState5((prevState) => ({
  //     ...prevState,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };
  const getCongineeDetails = () => {
    axios
      .post(`${API_BASE_URL}/getConsigneeStatistics`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        // setData(res.data.data);
        setconsigeeDetails(res.data.data);
        setOrderItem(res.data.items);
      })
      .catch((error) => {
        console.log("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getCongineeDetails();
    getCongineeDetails1();
  }, []);
  const handlePeriodClick = (period, id) => {
    setSelectedPeriod(period);
    setSelectedId(id);
  };
  const handleSubmit = async () => {
    const payload = {
      client_id: from?.client_id,
      consignee_id: from?.consignee_id,
      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getConsigneeStatement`,
        payload
      );
      console.log(response);
      let modalElement = document.getElementById("modalState");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        const doc = new jsPDF();

        const addLogoWithDetails = async () => {
          doc.setFontSize(17);
          doc.setTextColor(0, 0, 0);
          doc.text(`Statement`, 125, 11.5);
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(0, 0, 0);
          doc.text(`Start Date:${fromDate}`, 166.5, 9);
          doc.text(`End date: ${toDate}`, 166.5, 13);
          doc.text(`Printed On :${formatDate(new Date())}`, 166.5, 17);
        };
        doc.setFillColor(32, 55, 100);
        doc.rect(7, 19, doc.internal.pageSize.width - 15, 0.5, "FD");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("Invoice to", 7, 24);
        doc.text("Consignee Details", 127.2, 24);
        doc.setFillColor(32, 55, 100);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        function renderWrappedText1(
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

        function renderWrappedText2(
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

        // First set of texts
        const maxWidth1 = 72;
        const startX1 = 7;
        let startY1 = 29;
        const lineHeight1 = 4.2;

        const longText1_1 = `${response.data.clientAdress?.client_name}(${response.data.clientAdress?.client_tax_number})`;
        const longText1_2 = `${response.data.clientAdress?.client_address}`;
        const longText1_3 = `${response.data.clientAdress?.client_email} / ${response.data.clientAdress?.client_phone}`;

        startY1 = renderWrappedText1(
          doc,
          longText1_1,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );
        doc.setFontSize(10);
        startY1 = renderWrappedText1(
          doc,
          longText1_2,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );
        startY1 = renderWrappedText1(
          doc,
          longText1_3,
          startX1,
          startY1,
          maxWidth1,
          lineHeight1
        );

        // Consignee detail
        const maxWidth2 = 72;
        const startX2 = 127.2;
        let startY2 = 29;
        const lineHeight2 = 4.2;
        doc.setFontSize(11);

        const longText2_1 = `${from?.consignee_name}(${from?.consignee_tax_number})`;
        const longText2_2 = `${from?.consignee_address}`;
        const longText2_3 = `${from?.consignee_email}/${from?.consignee_phone}`;

        startY2 = renderWrappedText2(
          doc,
          longText2_1,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        doc.setFontSize(10);
        startY2 = renderWrappedText2(
          doc,
          longText2_2,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );
        startY2 = renderWrappedText2(
          doc,
          longText2_3,
          startX2,
          startY2,
          maxWidth2,
          lineHeight2
        );

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
        doc.text("Pre Statement", 7, 60);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Invoices : ", 7, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Invoices),
          24,
          65
        );
        doc.text("Claim : ", 58, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_claims),
          71,
          65
        );
        doc.text("Payment : ", 100, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_payments),
          119,
          65
        );
        doc.text("Total : ", 150, 65);
        doc.text(
          formatter.format(response.data.data?.pre_statement_Totals),
          162,
          65
        );
        await addLogoWithDetails();
        let yTop = 67;
        const rows = response?.data?.result.map((item, index) => ({
          index: formatDate(item.Date),
          AWB: item.AWB,
          Transaction_Ref: item.Transaction_Ref,
          Currnecy: item.Currnecy,
          Invocied_Amount: item.Invocied_Amount,
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
              "Paid Amount",
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
            0: { halign: "left" },
            1: { halign: "left", cellWidth: 20, overflow: "linebreak" },
            2: { halign: "left", cellWidth: 30, overflow: "linebreak" },
            3: { halign: "center" },
            4: { halign: "right", cellWidth: 20 },
            5: { halign: "right" },
            6: { halign: "right", cellWidth: 30, overflow: "linebreak" },
            7: { halign: "right", cellWidth: 30, overflow: "linebreak" },
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
            doc.text(`${i} out  of ${pageCount}`, 185.2, 3.1);
          }
        };
        // Add page numbers
        addPageNumbers(doc);
        const pdfBlob = doc.output("blob");
        // Upload the PDF to the server
        await uploadPDF(pdfBlob);
        modalInstance.hide();
      }
      // Handle the response data as needed
      setFromDate("");
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
      `${from?.consignee_name || "default"}_Statement_${formatDate(
        new Date()
      )}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.consignee_name}_Statement_${formatDate(
            new Date()
          )}.pdf`
        );
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
    consignee_name: from?.consignee_name || "",
    consignee_tax_number: from?.consignee_tax_number || "",
    consignee_email: from?.consignee_email || "",
    consignee_phone: from?.consignee_phone || "",
    consignee_address: from?.Address1 || "",
    consignee_address1: from?.Address2 || "",
    consignee_address2: from?.Address3 || "",
    consignee_address3: from?.Address4 || "",
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
    notify_phone: from?.notify_phone || "",
    notify_address: from?.notify_address || "",
    user_id: localStorage.getItem("id"),
    // bank_name: from?.bank_name || "",
    // account_name: from?.account_name || "",
    // account_number: from?.account_number || "",
    client_bank_account: from?.bank_name || "",
    client_bank_name: from?.account_name || "",
    client_bank_number: from?.account_number || "",
  });
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? (checked ? "THB" : "FX") : value;
    setState((prevState) => ({
      ...prevState,
      [name]: name === "Commission_Currency" && value === "" ? "FX" : newValue,
    }));
  };
  console.log(from);
  const [dataCustomization, setDataCustomization] = useState({
    Consignee_id: from?.consignee_id || "",
    Client_ID: from?.client_id || "",
    ITF: "",
    Custom_Name: "",
    Dummy_Price: "",
    Unit: from?.Invoice_Unit,
    Barcode: "",
  });
  const { data: brands } = useQuery("getBrand");
  const { data: client } = useQuery("getAllClients");
  const { data: getItf } = useQuery("getItf");
  console.log(getItf);
  const { data: port } = useQuery("getAllAirports");
  const { data: liner } = useQuery("getLiner");
  const { data: commission } = useQuery("getDropdownCommissionType");
  const { data: locations } = useQuery("getLocation");
  const { data: contactType } = useQuery("DropdownContactType ");
  const { data: FXCorrection } = useQuery("FXCorrection");

  const [state1, setState1] = useState({
    client_id: from?.client_id || "",
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
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setState1((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setDataCustomization((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { data: currency } = useQuery("getCurrency");
  const { data: DropdownDelivery } = useQuery("DropdownDelivery");
  const { data: RoundingDataList } = useQuery("GetRoundingTable");

  const [data, setData] = useState([]);
  const [customization, setCustomization] = useState([]);

  const getAllContact = () => {
    axios
      .post(`${API_BASE_URL}/getContactList`, {
        consignee_id: from?.consignee_id,
      })
      .then((res) => {
        console.log(res);
        setData(res.data.data || []);
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

  const deleteOrder1 = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteContactDetails`,
            {
              contact_id: id,
            }
          );
          console.log(response);
          getAllContact();
          toast.success(t("contactDeletedSuccessfully"));
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteConsigneeCustomization`,
            {
              Customize_id: id,
            }
          );
          console.log(response);
          getAllCustomization();
          toast.success(t("orderDeleted"));
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };

  const submitCustomizationData = () => {
    if (!dataCustomization.ITF) {
      toast.warn(t("enterITF"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!dataCustomization.Unit) {
      toast.warn(t("enterUnit"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    console.log(dataCustomization);
    axios
      .post(
        `${API_BASE_URL}/createConsigneeCustomize`,

        {
          ...dataCustomization,
          Client_ID: from?.client_id,
          Consignee_id: from?.consignee_id,
        }
        // Use the updated state directly
      )
      .then((response) => {
        if (response.data?.success) {
          console.log(response);
          toast.success(t("customizationAdd"), {
            autoClose: 1000,
            theme: "colored",
          });
          let modalElement = document.getElementById(
            "exampleModalCustomization"
          );
          let modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
          setDataCustomization({
            Consignee_id: from?.consignee_id || "",
            Client_ID: from?.client_id || "",
            ITF: "",
            brand: "",
            Custom_Name: "",
            Dummy_Price: "",
            Unit: from?.Invoice_Unit,
            Barcode: "",
          });
          getAllCustomization();
        } else {
          toast.warn(t("itfExists"), {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  const update = () => {
    axios
      .post(
        `${API_BASE_URL}/${
          from?.consignee_id ? "updateConsignee" : "createConsignee"
        }`,
        state // Use the updated state directly
      )
      .then((response) => {
        navigate("/shipToNew");
        toast.success(t("updatedSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  const updatePaymentValue = () => {
    axios
      .post(
        `${API_BASE_URL}/updateMarginPaymentConsignee`, // Fixed the URL string
        {
          consignee_id: from?.consignee_id,
          profit: state5.markupValue,
          rebate: state5.rebateValue,
          commission: state5.commissionType,
          Invoice_Unit: state5.Invoice_Unit,
          commission_value: state5.commissionValue,
          Charge_Volume: state5.chargeVolume ? 1 : 0,
          Commission_Currency: state5.commissionCurrency,
          currency: parseInt(state5.invoiceCurrency),
          Incoterms: state5.deliveryTerms,
          Payment_Terms: state5.paymentTerms,
          Extra_cost: state5.extraCost,
          Quotation_Margin: state5.quotation,
          Extra_Margin: state5.other,
          Freight_Adjustment: state5.freightAdjust,
          Rounding: state5.Rounding,
        }
      )
      .then((response) => {
        console.log(response);
        oneQoutationData();
        getCongineeDetails1();
        toast.success(t("updatedSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
      })
      .catch((error) => {
        console.error(error); // Use console.error for better error tracking
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  const customizationDataSubmit = (e) => {
    if (!dataCustomization.ITF) {
      toast.warn(t("enterITF"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!dataCustomization.Unit) {
      toast.warn(t("enterUnit"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    console.log(dataCustomization);
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/updateConsigneeCustomize`, dataCustomization)
      .then((response) => {
        console.log(response);
        getAllContact();
        toast.success(t("customizeUpdateSuccess"), {
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
          Client_ID: from?.client_id || "",
          ITF: "",
          brand: "",
          Custom_Name: "",
          Dummy_Price: "",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("networkError"), {
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
        toast.success(t("contactAddSuccess"), {
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
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
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
        toast.success(t("contactUpdate"), {
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
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
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
      brand: selectedUser?.Brand || "",
      Custom_Name: selectedUser?.Custom_Name || "",
      Dummy_Price: selectedUser?.Dummy_Price || "",
      Unit: selectedUser?.Unit || "",
      Barcode: selectedUser?.Barcode || "",
    }));

    console.log(selectedUser);
    // Open the modal using jQuery or another method here
  };
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });
  console.log(state.Commission_Currency);

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
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: "Produce Trend",
        data: [],
      },
    ],
    options: {}, // initially empty
  });

  useEffect(() => {
    setChartOptions((prev) => ({
      ...prev,
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
          text: t("producePriceConsignee"),
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
            text: t("price"),
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
    }));
  }, [t]); // run again if t() changes due to language switch

  return (
    <Card
      title={`${t("consignee")} / ${
        from?.consignee_id ? t("update") : t("create")
      } ${t("form")}`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="first-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#first-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="first-tab-pane"
                >
                  {t("details")}
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                >
                  {t("contact")}
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                >
                  {t("customization")}
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link "
                  id="notify-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#notify-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="notify-tab-pane"
                >
                  {t("notify")}
                </button>
              </li>
              {localStorage.getItem("level") !== "Level 5" && (
                <>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#contact-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="contact-tab-pane"
                      aria-selected="false"
                    >
                      {t("portfolio")}
                    </button>
                  </li>
                  <li class="nav-item" role="presentation">
                    <button
                      class="nav-link"
                      id="margins-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#margins-tab-pane"
                      type="button"
                      role="tab"
                      aria-controls="margins-tab-pane"
                      aria-selected="false"
                    >
                      {t("marginsAndPayments")}
                    </button>
                  </li>
                </>
              )}
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="invoiceSetup-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#invoiceSetup-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="invoiceSetup-tab-pane"
                  aria-selected="false"
                >
                  {t("invoiceSetup")}
                </button>
              </li>
            </ul>
            <div class="tab-content" id="myTabContent">
              {/* invoiceSetup */}
              <div
                class="tab-pane fade"
                id="invoiceSetup-tab-pane"
                role="tabpanel"
                aria-labelledby="invoiceSetup-tab"
                tabindex="0"
              >
                <div className="formCreate pt-3">
                  <div className="d-flex flex-wrap invAutoGen">
                    <div>
                      <h6>{t("clientAutoGenerate")}</h6>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>Invoice only</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("packingListOnly")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("statement")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap invAutoGen">
                    <div>
                      <h6>{t("consigneeAutoGenerate")}</h6>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>Invoice only</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("packingListOnly")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("statement")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-wrap invAutoGen">
                    <div>
                      <h6>{t("shippingDocumentsAutoGenerate")}</h6>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>Invoice only</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("packingListOnly")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex">
                        <p>{t("statement")}</p>
                        <div className="ms-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input type="checkbox" name="Commission_Currency" />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-4">
                    <div className="form-group col-lg-6 invOptionSetup">
                      <div className="row">
                        <div className="col-lg-6">
                          <h6>Invoice Options</h6>
                        </div>

                        <div className="col-lg-2">
                          <h6>{t("clients")}</h6>
                        </div>
                        <div className="col-lg-2">
                          <h6>{t("consignee")}</h6>
                        </div>
                        <div className="col-lg-2">
                          <h6>{t("shipping")}</h6>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("useAgreedPricing")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("useCustomName")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("showGrossWeightAndCBM")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="invoiceModal">
                            <p>{t("invoiceNameCanBe")} -</p>
                            <input
                              type="radio"
                              id="html1"
                              name="fav_language"
                              value="Client"
                              checked={selectedInvoice === "Client"}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="html1">{t("client")}</label>

                            <input
                              type="radio"
                              id="css1"
                              name="fav_language"
                              value="Consignee"
                              checked={selectedInvoice === "Consignee"}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="css1">{t("consignee")}</label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("showExchangeRate")} </p>
                        </div>
                        <div className="col-lg-2">
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={exchangeRate}
                              onChange={handleAgreedPricingChange3}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="invoiceModal">
                          <p>{t("deliveryTerms")} -</p>
                          <div>
                            <input
                              type="radio"
                              id="dap"
                              name="delivery_term"
                              value="DAP"
                              checked={selectedDeliveryTerm === "DAP"}
                              onChange={handleChange7}
                            />
                            <label htmlFor="dap">{t("dap")}</label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="cnf"
                              name="delivery_term"
                              value="CNF"
                              checked={selectedDeliveryTerm === "CNF"}
                              onChange={handleChange7}
                            />
                            <label htmlFor="cnf">{t("cnf")}</label>
                          </div>
                          <input
                            type="radio"
                            id="cif"
                            name="delivery_term"
                            value="CIF"
                            checked={selectedDeliveryTerm === "CIF"}
                            onChange={handleChange7}
                          />
                          <label htmlFor="cif">{t("cif")}</label>

                          <div>
                            <input
                              type="radio"
                              id="fob"
                              name="delivery_term"
                              value="FOB"
                              checked={selectedDeliveryTerm === "FOB"}
                              onChange={handleChange7}
                            />
                            <label htmlFor="fob">{t("fob")}</label>
                          </div>
                        </div>
                      </div>
                      {/* <div className="invoiceModal d-flex justify-content-between invoiceShip">
                        <h6>  {t("useAgreedPricing")}</h6>
                        <div>
                           <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={useAgreedPricing}
                              onChange={handleAgreedPricingChange}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                      <div className="invoiceModal d-flex justify-content-between">
                        <h6>{t("useCustomName")}</h6>
                        <div>
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={itemDetails}
                              onChange={handleAgreedPricingChange1}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                      <div className="invoiceModal d-flex justify-content-between  ">
                        <h6>{t("showGrossWeightAndCBM")} </h6>
                        <div>
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={cbm}
                              onChange={handleAgreedPricingChange2}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                      <div className="invoiceModal">
                        <h6>{t("invoiceNameCanBe")} -</h6>
                        <input
                          type="radio"
                          id="html1"
                          name="fav_language"
                          value="Client"
                          checked={selectedInvoice === "Client"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="html1">{t("client")}</label>
                        <input
                          type="radio"
                          id="css1"
                          name="fav_language"
                          value="Consignee"
                          checked={selectedInvoice === "Consignee"}
                          onChange={handleRadioChange}
                        />
                        <label htmlFor="css1">{t("consignee")}</label>
                      </div>
                      <div className="invoiceModal d-flex justify-content-between">
                        <h6>{t("showExchangeRate")} </h6>
                        <div>
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={exchangeRate}
                              onChange={handleAgreedPricingChange3}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>
                      <div className="invoiceModal">
                        <h6>{t("deliveryTerms")} -</h6>
                        <input
                          type="radio"
                          id="cif"
                          name="delivery_term"
                          value="CIF"
                          checked={selectedDeliveryTerm === "CIF"}
                          onChange={handleChange7}
                        />
                        <label htmlFor="cif">{t("cif")}</label>
                        <input
                          type="radio"
                          id="cnf"
                          name="delivery_term"
                          value="CNF"
                          checked={selectedDeliveryTerm === "CNF"}
                          onChange={handleChange7}
                        />
                        <label htmlFor="cnf">{t("cnf")}</label>
                        <input
                          type="radio"
                          id="dap"
                          name="delivery_term"
                          value="DAP"
                          checked={selectedDeliveryTerm === "DAP"}
                          onChange={handleChange7}
                        />
                        <label htmlFor="dap">{t("dap")}</label>
                        <input
                          type="radio"
                          id="fob"
                          name="delivery_term"
                          value="FOB"
                          checked={selectedDeliveryTerm === "FOB"}
                          onChange={handleChange7}
                        />
                        <label htmlFor="fob">{t("fob")}</label>
                      </div>

                      <div className="invoiceModal d-flex justify-content-between">
                        <h6>{t("barcode")} </h6>
                        <div>
                          <label
                            className="toggleSwitch large"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              padding: 10,
                            }}
                          >
                            <input
                              type="checkbox"
                              name="Commission_Currency"
                              checked={exchangeRate1}
                              onChange={handleAgreedPricingChange4}
                            />
                            <span>
                              <span>{t("no")}</span>
                              <span>{t("yes")}</span>
                            </span>
                            <a> </a>
                          </label>
                        </div>
                      </div>

                      <div className="invoiceModal">
                        <h6>{t("invoiceOptions")}</h6>

                        <input
                          type="radio"
                          id="fob"
                          name="invoice_option"
                          value="invoice only"
                          checked={selectedInvoiceOrder === "invoice only"}
                          onChange={handleChange8}
                        />
                        <label htmlFor="invoiceOnly">{t("invoiceOnly")}</label>

                        <input
                          type="radio"
                          id="fob"
                          name="invoice_option"
                          value="packing list only"
                          checked={selectedInvoiceOrder === "packing list only"}
                          onChange={handleChange8}
                        />
                        <label htmlFor="packingListOnly">
                          {t("packingListOnly")}
                        </label>

                        <input
                          type="radio"
                          id="fob"
                          name="invoice_option"
                          value="invoice and packing list"
                          checked={
                            selectedInvoiceOrder === "invoice and packing list"
                          }
                          onChange={handleChange8}
                        />
                        <label htmlFor="invoicePackingList">
                          {t("invoiceAndPackingList")}
                        </label>
                      </div>
                      <div className="card-footer ">
                        <button
                          className="btn btn-primary"
                          onClick={updatedata}
                        >
                          {t("update")}
                        </button>
                      </div> */}
                    </div>
                    <div className="form-group col-lg-6">
                      <div className="row">
                        <div className="col-lg-6">
                          <h6>Packing List Options</h6>
                        </div>

                        <div className="col-lg-2">
                          <h6>{t("clients")}</h6>
                        </div>
                        <div className="col-lg-2">
                          <h6>{t("consignee")}</h6>
                        </div>
                        <div className="col-lg-2">
                          <h6>{t("shipping")}</h6>
                        </div>

                        <div className="col-lg-6">
                          <p>{t("useCustomName")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("showGrossWeightAndCBM")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="invoiceModal">
                            <p>{t("invoiceNameCanBe")} -</p>
                            <input
                              type="radio"
                              id="html1"
                              name="fav_language"
                              value="Client"
                              checked={selectedInvoice === "Client"}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="html1">{t("client")}</label>

                            <input
                              type="radio"
                              id="css1"
                              name="fav_language"
                              value="Consignee"
                              checked={selectedInvoice === "Consignee"}
                              onChange={handleRadioChange}
                            />
                            <label htmlFor="css1">{t("consignee")}</label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("bardcode")} </p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("customBarcode")}</p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <p>{t("notes")} </p>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                        <div className="col-lg-2">
                          <div>
                            <label
                              className="toggleSwitch large"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <input
                                type="checkbox"
                                name="Commission_Currency"
                              />
                              <span>
                                <span>{t("no")}</span>
                                <span>{t("yes")}</span>
                              </span>
                              <a> </a>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* invoiceSetup end */}
              <div
                class="tab-pane fade show active"
                id="first-tab-pane"
                role="tabpanel"
                aria-labelledby="first-tab"
                tabindex="0"
              >
                {/* <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                >
                  <div className="formCreate">
                    <form action="">
                      <div className="row">
                        <div className="form-group col-lg-4 autoComplete">
                          <h6>{t("client")}</h6>
                          <div className=" ">
                            <Autocomplete
                              options={client || []} // List of client options
                              getOptionLabel={(option) =>
                                option.client_name || ""
                              } // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "client_id",
                                    value: newValue ? newValue.client_id : "",
                                  }, // Update selected client_id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectClient")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                client?.find(
                                  (item) => item.client_id === state.client_id
                                ) || null
                              } // Set value based on selected client_id
                              isOptionEqualToValue={(option, value) =>
                                option.client_id === value.client_id
                              } // Option comparison
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>{t("code")}</h6>
                          <input
                            type="text"
                            name="CODE"
                            className="w-full"
                            value={state.CODE}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>{t("name")}</h6>
                          <input
                            type="text"
                            name="consignee_name"
                            className="w-full"
                            value={state.consignee_name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="form-group col-lg-4">
                          <div>
                            <h6>{t("address")}</h6>
                            <input
                              name="consignee_address"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.consignee_address}
                            />
                          </div>
                          <div>
                            <input
                              name="consignee_address1"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.consignee_address1}
                            />
                          </div>
                          <div>
                            <input
                              name="consignee_address2"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.consignee_address2}
                            />
                          </div>
                          <div>
                            <input
                              name="consignee_address3"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.consignee_address3}
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <div>
                            <h6>{t("taxNumber")}</h6>
                            <input
                              type="text"
                              className="w-full"
                              name="consignee_tax_number"
                              value={state.consignee_tax_number}
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <h6>{t("phoneNumber")}</h6>
                            <input
                              type="text"
                              className="w-full"
                              name="consignee_phone"
                              value={state.consignee_phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-group col-lg-4">
                          <h6>{t("brand")}</h6>
                          <div className="ceateTransport autoComplete mb-2">
                            <Autocomplete
                              options={brands || []} // List of brand options
                              getOptionLabel={(option) => option.Name_EN || ""} // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "brand",
                                    value: newValue ? newValue.ID : "",
                                  }, // Update selected brand_id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectBrand")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                brands?.find(
                                  (item) => item.ID === state.brand
                                ) || null
                              } // Set value based on selected brand_id
                              isOptionEqualToValue={(option, value) =>
                                option.ID === value.ID
                              } // Option comparison
                            />
                          </div>
                          <div>
                            <h6>{t("email")}</h6>
                            <input
                              type="email"
                              className="w-full"
                              name="consignee_email"
                              value={state.consignee_email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="form-group col-lg-3">
                          <h6>{t("location")}</h6>
                          <div className="ceateTransport autoComplete">
                            <Autocomplete
                              options={locations || []} // List of location options
                              getOptionLabel={(option) => option.name || ""} // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "Default_location",
                                    value: newValue ? newValue.id : "",
                                  }, // Update selected location id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectLocation")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                locations?.find(
                                  (item) => item.id === state.Default_location
                                ) || null
                              } // Set value based on selected location id
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              } // Option comparison
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>{t("portOfOrigin")}</h6>
                          <div className="ceateTransport autoComplete">
                            <Autocomplete
                              options={port || []} // List of port options
                              getOptionLabel={(option) =>
                                option.port_name || ""
                              } // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "port_of_orign",
                                    value: newValue ? newValue.port_id : "",
                                  }, // Update selected port_id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectAirport")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                port?.find(
                                  (item) => item.port_id === state.port_of_orign
                                ) || null
                              } // Set value based on selected port_id
                              isOptionEqualToValue={(option, value) =>
                                option.port_id === value.port_id
                              } // Option comparison
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-3 autoComplete">
                          <h6>{t("portOfDestination")}</h6>
                          <div className="ceateTransport">
                            <Autocomplete
                              options={port || []} // List of port options
                              getOptionLabel={(option) =>
                                option.port_name || ""
                              } // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "destination_port",
                                    value: newValue ? newValue.port_id : "",
                                  }, // Update selected port_id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectAirport")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                port?.find(
                                  (item) =>
                                    item.port_id === state.destination_port
                                ) || null
                              } // Set value based on selected port_id
                              isOptionEqualToValue={(option, value) =>
                                option.port_id === value.port_id
                              } // Option comparison
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>{t("airline")}</h6>
                          <div className="ceateTransport autoComplete">
                            <Autocomplete
                              options={liner || []} // List of airline options
                              getOptionLabel={(option) =>
                                option.liner_name || ""
                              } // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "liner_Drop",
                                    value: newValue ? newValue.liner_id : "",
                                  }, // Update selected liner_id
                                });
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder={t("selectAirline")}
                                  variant="outlined"
                                />
                              )}
                              value={
                                liner?.find(
                                  (item) => item.liner_id === state.liner_Drop
                                ) || null
                              } // Set value based on selected liner_id
                              isOptionEqualToValue={(option, value) =>
                                option.liner_id === value.liner_id
                              } // Option comparison
                            />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <h6
                            className="mt-4"
                            style={{
                              fontWeight: "600",
                              marginBottom: "10px",
                              fontSize: "20px",
                            }}
                          >
                            {t("bankInformations")}
                          </h6>
                          <div className="row ">
                            <div className="form-group col-lg-4">
                              <h6>{t("bankName")}</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_account"
                                className="form-control"
                                placeholder={t("bankName")}
                                value={state.client_bank_account}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>{t("accountName")}</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_name"
                                className="form-control"
                                placeholder={t("accountName")}
                                value={state.client_bank_name}
                              />
                            </div>
                            <div className="form-group col-lg-4">
                              <h6>{t("accountNumber")}</h6>
                              <input
                                onChange={handleChange}
                                type="text"
                                id="name_en"
                                name="client_bank_number"
                                className="form-control"
                                placeholder={t("accountNumber")}
                                value={state.client_bank_number}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="card-footer text-center">
                    <button
                      className="btn btn-primary"
                      onClick={update}
                      type="button"
                    >
                      {from?.consignee_id ? t("update") : t("create")}
                    </button>
                    <Link className="btn btn-danger" to="/shipToNew">
                      {t("cancel")}
                    </Link>
                  </div>
                </div> */}
                <div className="tab-content px-2 md:!px-4">
                  <div className="vc_form formCreate ">
                    <div className="row">
                      <div className="row justify-content-between">
                        <div className="col-lg-8">
                          <div className="row">
                            <div className="col-lg-4 form-group">
                              <h6>{t("name")}</h6>
                              <input
                                type="text"
                                id="name"
                                onChange={handleChange9}
                                name="name"
                                className="form-control"
                                placeholder="Name"
                                defaultValue={state7.name}
                              />
                            </div>

                            <div className="col-lg-4 form-group">
                              <h6>{t("taxId")}</h6>
                              <input
                                type="text"
                                id="taxId"
                                value={state7.taxId || ""}
                                onChange={handleChange9}
                                name="taxId"
                                className="form-control"
                                placeholder="Tax"
                              />
                            </div>
                            <div className="form-group col-lg-4 autoComplete">
                              <h6>{t("Entity")}</h6>

                              <Autocomplete
                                options={dropdownVendor || []} // Populate with the list of vendors
                                getOptionLabel={(option) =>
                                  option.entity_name_en || ""
                                } // Display the English name of the entity
                                value={
                                  dropdownVendor?.find(
                                    (vendor) => vendor.id === state7.Entity
                                  ) || null
                                } // Match the current entity ID in state with the options
                                onChange={(e, newValue) => {
                                  handleChange9({
                                    target: {
                                      name: "Entity",
                                      value: newValue?.id || "",
                                    },
                                  }); // Trigger handleChange with the selected entity's ID
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder={t("SelectEntity")} // Adds a placeholder
                                    InputLabelProps={{ shrink: false }} // Prevents floating label
                                  />
                                )}
                                isOptionEqualToValue={(option, value) =>
                                  option.id === value.id
                                } // Ensure proper matching
                                sx={{ width: 300 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="text-end">
                            <button className="btn btn-danger">
                              Add Contact
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>{t("phone")}</h6>
                        <input
                          type="text"
                          id="phone"
                          value={state7.phone || ""}
                          onChange={handleChange9}
                          name="phone"
                          className="form-control"
                          placeholder="Phone"
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>{t("email")}</h6>
                        <input
                          type="text"
                          id="phone"
                          value={state7.email || ""}
                          onChange={handleChange9}
                          name="email"
                          className="form-control"
                          placeholder="Email"
                        />
                      </div>
                      <div className="col-lg-3 form-group autoComplete">
                        <h6>{t("messengerType")}</h6>
                        <div>
                          <Autocomplete
                            options={countries}
                            value={state7.Messenger_Type || ""}
                            onChange={(event, newValue) =>
                              setState7({ ...state7, Messenger_Type: newValue })
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("messengerType")}
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>{t("messangerId")}</h6>
                        <div>
                          <input
                            type="text"
                            id="messangerId"
                            value={state7.messangerId || ""}
                            onChange={handleChange9}
                            name="messangerId"
                            className="form-control"
                            placeholder="Messanger ID"
                          />
                        </div>
                      </div>

                      <div className="col-lg-3 form-group autoComplete mb-3">
                        <h6>{t("country")}</h6>
                        <div>
                          <Autocomplete
                            options={countryList}
                            getOptionLabel={(option) => option.name || ""}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value?.id
                            }
                            value={selectedCountry}
                            onChange={(event, newValue) =>
                              setSelectedCountry(newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={t("country")}
                                variant="outlined"
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-group col-lg-3 autoComplete mb-3">
                        <h6>{t("province")}</h6>
                        <Autocomplete
                          options={provinceList}
                          getOptionLabel={(opt) => opt.name ?? ""}
                          isOptionEqualToValue={(opt, val) =>
                            opt.id === val?.id
                          }
                          value={selectedProvince}
                          onChange={(e, newProv) =>
                            setSelectedProvince(newProv)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("province")}
                              variant="outlined"
                            />
                          )}
                          style={{ marginTop: 16 }}
                        />
                      </div>
                      <div className="form-group col-lg-3 autoComplete mb-3">
                        <h6>{t("district")}</h6>
                        <Autocomplete
                          options={districtList}
                          getOptionLabel={(opt) => opt.name ?? ""}
                          isOptionEqualToValue={(opt, val) =>
                            opt.id === val?.id
                          }
                          value={selectedDistrict}
                          onChange={(e, dis) => setSelectedDistrict(dis)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("district")}
                              variant="outlined"
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3 form-group autoComplete">
                        <h6>{t("subDistrict")}</h6>
                        <Autocomplete
                          options={subdistrictList || []}
                          getOptionLabel={(opt) => opt?.name ?? ""}
                          isOptionEqualToValue={(opt, val) =>
                            opt?.id === val?.id
                          }
                          value={selectedSubdistrict || null}
                          onChange={(e, sub) => setSelectedSubdistrict(sub)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Subdistrict"
                              variant="outlined"
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-3 form-group">
                        <h6>{t("postCode")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={postalCode || ""}
                          onChange={(e) => setPostalCode(e.target.value)}
                        />
                      </div>

                      <div className="col-lg-3 form-group">
                        <h6>{t("address")} 1</h6>
                        <input
                          type="text"
                          id="address1"
                          value={state7.address1 || ""}
                          onChange={handleChange9}
                          name="address1"
                          className="form-control"
                          placeholder="Address1"
                        />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>{t("address")} 2</h6>
                        <input
                          type="text"
                          id="address2"
                          value={state7.address2 || ""}
                          onChange={handleChange9}
                          name="address2"
                          className="form-control"
                          placeholder="Address2"
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 form-group autoComplete">
                        <h6 style={{ fontWeight: "bold" }}>
                          {" "}
                          {t("BankDetails")}:
                        </h6>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 form-group">
                        <h6>{t("bankName")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={state7.Bank_Name || ""}
                          onChange={(e) =>
                            setState7({ ...state7, Bank_Name: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-lg-4 form-group">
                        <h6>{t("bankBranch")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={state7.Bank_Branch || ""}
                          onChange={(e) =>
                            setState7({
                              ...state7,
                              Bank_Branch: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-lg-4 form-group">
                        <h6>{t("bankAccount")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={state7.Bank_Account || ""}
                          onChange={(e) =>
                            setState7({
                              ...state7,
                              Bank_Account: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-lg-4 form-group">
                        <h6>{t("bankIbon")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={state7.Bank_IBAN || ""}
                          onChange={(e) =>
                            setState7({ ...state7, Bank_IBAN: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-lg-4 form-group">
                        <h6>{t("bankSwift")}</h6>
                        <input
                          type="text"
                          className="form-control"
                          value={state7.Bank_Swift || ""}
                          onChange={(e) =>
                            setState7({ ...state7, Bank_Swift: e.target.value })
                          }
                        />
                      </div>

                      <div className="col-lg-4 form-group autoComplete">
                        <h6>{t("bankCountry")}</h6>
                        <Autocomplete
                          options={countryList}
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option.id === value?.id
                          }
                          value={
                            countryList.find(
                              (c) =>
                                String(c.id) === String(state7.Bank_Country)
                            ) || null
                          }
                          onChange={(event, newValue) =>
                            setState7({
                              ...state7,
                              Bank_Country: newValue ? newValue.id : "",
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("bankCountry")}
                              variant="outlined"
                            />
                          )}
                        />
                      </div>

                      <div className="col-lg-12 form-group">
                        <h6>{t("bankAddress")}</h6>
                        <textarea
                          className="form-control p-2"
                          placeholder={t("bankAddress")}
                          value={state7.Bank_Address || ""}
                          onChange={(e) =>
                            setState7({
                              ...state7,
                              Bank_Address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      name="signup"
                      onClick={updateVendor}
                      disabled={isButtonClicked}
                    >
                      {typeof state7.vendor_id !== "undefined"
                        ? t("update")
                        : t("create")}
                    </button>
                    <Link className="btn btn-danger" to={"/shipToNew"}>
                      {t("cancel")}
                    </Link>
                  </div>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="home-tab-pane"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th>{t("firstName")}</th>
                      <th>{t("lastName")}</th>
                      <th>{t("nickName")}</th>
                      <th>{t("position")}</th>
                      <th>{t("type")}</th>
                      <th>{t("email")}</th>
                      <th>{t("mobile")}</th>
                      <th>{t("action")}</th>
                    </tr>

                    {data?.map((item) => {
                      return (
                        <tr>
                          <td>{item.first_name}</td>
                          <td>{item.last_name}</td>
                          <td>{item.Nick_name}</td>
                          <td>{item.position}</td>
                          <td>{item.type}</td>
                          <td>{item.Email}</td>
                          <td>{item.mobile}</td>
                          <td>
                            <div>
                              {/* edit popup */}
                              <button
                                type="button"
                                onClick={() => handleEditClick(item.contact_id)}
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalEdit"
                              >
                                {" "}
                                <i class="mdi mdi-pencil"></i>
                                {/* edit popup */}
                              </button>
                              <div
                                class="modal fade"
                                id="exampleModalEdit"
                                tabindex="-1"
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div class="modal-dialog modalShipTo modal-xl">
                                  <div class="modal-content">
                                    <div class="modal-header">
                                      <h1
                                        class="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        {t("contactUp")}
                                      </h1>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={dataClear}
                                      >
                                        <i class="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div class="modal-body">
                                      <div className="formCreate">
                                        <form action="">
                                          <div className="row">
                                            <div class="form-group col-lg-3">
                                              <h6>{t("contactType")}</h6>
                                              <div class="ceateTransport autoComplete">
                                                {/* <select
                                                  name="contact_type_id"
                                                  onChange={handleChange1}
                                                  value={state1.contact_type_id}
                                                >
                                                  <option value="">
                                                    Select Type
                                                  </option>
                                                  {contactType?.map((item) => (
                                                    <option
                                                      key={item.contact_type_id}
                                                      value={
                                                        item.contact_type_id
                                                      }
                                                    >
                                                      {item.type_en}
                                                    </option>
                                                  ))}
                                                </select> */}
                                                <Autocomplete
                                                  disablePortal
                                                  options={contactType || []}
                                                  getOptionLabel={(option) =>
                                                    option.type_en || ""
                                                  }
                                                  onChange={(e, newValue) =>
                                                    setState1((prevState) => ({
                                                      ...prevState,
                                                      contact_type_id:
                                                        newValue?.contact_type_id ||
                                                        "",
                                                    }))
                                                  }
                                                  value={
                                                    contactType?.find(
                                                      (item) =>
                                                        item.contact_type_id ===
                                                        state1.contact_type_id
                                                    ) || null
                                                  }
                                                  sx={{ width: 300 }}
                                                  renderInput={(params) => (
                                                    <TextField
                                                      {...params}
                                                      placeholder={t(
                                                        "selectType"
                                                      )}
                                                      InputLabelProps={{
                                                        shrink: false,
                                                      }}
                                                    />
                                                  )}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("firstName")}</h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="first_name"
                                                  onChange={handleChange1}
                                                  value={state1.first_name}
                                                  placeholder={t("firstName")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("lastName")}</h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="last_name"
                                                  onChange={handleChange1}
                                                  value={state1.last_name}
                                                  placeholder={t("lastName")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("nickName")}</h6>
                                              <div>
                                                <input
                                                  type="text"
                                                  name="Nick_name"
                                                  onChange={handleChange1}
                                                  value={state1.Nick_name}
                                                  placeholder={t("nickName")}
                                                />
                                              </div>
                                            </div>

                                            <div class="form-group col-lg-3">
                                              <h6>{t("position")} </h6>
                                              <div class=" ">
                                                <input
                                                  type="text"
                                                  name="position"
                                                  onChange={handleChange1}
                                                  value={state1.position}
                                                  placeholder={t("position")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("email")}</h6>
                                              <div class=" ">
                                                <input
                                                  type="email"
                                                  name="Email"
                                                  onChange={handleChange1}
                                                  value={state1.Email}
                                                  placeholder={t("email")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("mobile")}</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="mobile"
                                                  onChange={handleChange1}
                                                  value={state1.mobile}
                                                  placeholder={t("mobile")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-3">
                                              <h6>{t("landline")}</h6>
                                              <div class=" ">
                                                <input
                                                  type="number"
                                                  name="landline"
                                                  onChange={handleChange1}
                                                  value={state1.landline}
                                                  placeholder={t("landline")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-4">
                                              <h6>{t("birthday")}</h6>
                                              <div>
                                                <input
                                                  type="date"
                                                  name="birthday"
                                                  onChange={handleChange1}
                                                  value={state1.birthday}
                                                  placeholder={t("birthday")}
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-8">
                                              <h6>{t("notes")}</h6>
                                              <div>
                                                <textarea
                                                  name="Notes"
                                                  onChange={handleChange1}
                                                  value={state1.Notes}
                                                  cols="30"
                                                  rows="5"
                                                ></textarea>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </div>
                                    <div class="modal-footer justify-center">
                                      <button
                                        onClick={contactDetailsEdit}
                                        type="button"
                                        class="btn btn-primary mb-0"
                                      >
                                        {t("update")}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* edit popup end */}
                              <button
                                type="button"
                                onClick={() => deleteOrder1(item.contact_id)}
                              >
                                <i class="mdi mdi-delete "></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <div className="row">
                  <Link
                    style={{ width: "170px" }}
                    className="btn btn-danger mb-4"
                    to="/"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalContact"
                  >
                    {t("addContact")}
                  </Link>
                  {/* modal */}
                  <div
                    class="modal fade"
                    id="exampleModalContact"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modalShipTo modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            {t("contact")}
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i class="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div class="form-group col-lg-3">
                                  <h6>{t("contactType")}</h6>
                                  <div class="ceateTransport autoComplete">
                                    <Autocomplete
                                      options={contactType || []} // List of contact types
                                      getOptionLabel={(option) =>
                                        option.type_en || ""
                                      } // Label to display (type_en for each contact type)
                                      onChange={(event, newValue) => {
                                        handleChange1({
                                          target: {
                                            name: "contact_type_id",
                                            value: newValue
                                              ? newValue.contact_type_id
                                              : "",
                                          }, // Update contact_type_id in state
                                        });
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder={t("selectType")}
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        contactType?.find(
                                          (item) =>
                                            item.contact_type_id ===
                                            state1.contact_type_id
                                        ) || null
                                      } // Set selected value based on contact_type_id
                                      isOptionEqualToValue={(option, value) =>
                                        option.contact_type_id ===
                                        value.contact_type_id
                                      } // Option comparison by contact_type_id
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6> {t("firstName")} </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="first_name"
                                      onChange={handleChange1}
                                      value={state1.first_name}
                                      placeholder={t("firstName")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>{t("lastName")}</h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="last_name"
                                      onChange={handleChange1}
                                      value={state1.last_name}
                                      placeholder={t("lastName")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>{t("nickName")}</h6>
                                  <div>
                                    <input
                                      type="text"
                                      name="Nick_name"
                                      onChange={handleChange1}
                                      value={state1.Nick_name}
                                      placeholder={t("nickName")}
                                    />
                                  </div>
                                </div>

                                <div class="form-group col-lg-3">
                                  <h6>{t("position")} </h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="position"
                                      onChange={handleChange1}
                                      value={state1.position}
                                      placeholder={t("position")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>{t("email")}</h6>
                                  <div class=" ">
                                    <input
                                      type="email"
                                      name="Email"
                                      onChange={handleChange1}
                                      value={state1.Email}
                                      placeholder={t("email")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>{t("mobile")}</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="mobile"
                                      onChange={handleChange1}
                                      value={state1.mobile}
                                      placeholder={t("mobile")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>{t("landline")}</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="landline"
                                      onChange={handleChange1}
                                      value={state1.landline}
                                      placeholder={t("landline")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-4">
                                  <h6>{t("birthday")}</h6>
                                  <div>
                                    <input
                                      type="date"
                                      name="birthday"
                                      onChange={handleChange1}
                                      value={state1.birthday}
                                      placeholder={t("birthday")}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-8">
                                  <h6>{t("notes")}</h6>
                                  <div>
                                    <textarea
                                      name="Notes"
                                      onChange={handleChange1}
                                      value={state1.Notes}
                                      cols="30"
                                      rows="5"
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-primary mb-0"
                            onClick={contactDataSubmit}
                          >
                            {t("submit")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* modal end */}
                </div>
              </div>
              {/* statics */}
              <div
                class="tab-pane fade"
                id="notify-tab-pane"
                role="tabpanel"
                aria-labelledby="notify-tab"
                tabindex="0"
              >
                <div className="statisticsContent formCreate">
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>{t("name")}</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.notify_name}
                        name="notify_name"
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>{t("taxNumber")}</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.notify_tax_number}
                        name="notify_tax_number"
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>{t("email")}</h6>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.notify_email}
                        name="notify_email"
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>{t("phoneNumber")}</h6>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.notify_phone}
                        name="notify_phone"
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="form-group col-lg-12">
                      <h6>{t("address")}</h6>
                      <textarea
                        className="border-2 rounded-md border-[#203764] w-full"
                        value={formData.notify_address}
                        name="notify_address"
                        onChange={handleChange6}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit6}
                    type="button"
                  >
                    {from?.consignee_id ? t("update") : t("create")}
                  </button>
                  <Link className="btn btn-danger" to="/shipToNew">
                    {t("cancel")}
                  </Link>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="profile-tab-pane"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabindex="0"
              >
                <div className="table-responsive">
                  <table className="  tableContact striped  table borderTerpProduce">
                    <tr className="">
                      <th>{t("itfName")}</th>
                      <th>{t("customName")}</th>
                      <th>{t("dummyPrice")}</th>
                      <th>{t("customMargin")}</th>
                      <th>{t("maxPrice")}</th>
                      <th>{t("brand")}</th>
                      <th>{t("unit")}</th>
                      <th>{t("barcode")}</th>
                      <th>{t("action")}</th>
                    </tr>
                    {customization?.map((item) => {
                      return (
                        <tr>
                          <td>{item.Name_EN}</td>
                          <td>{item.Custom_Name}</td>
                          <td>{item.Dummy_Price}</td>
                          <td>{item.Custom_Margin}</td>
                          <td>{item.MAX_Price}</td>
                          <td>{item.brand_name}</td>
                          <td>{item.unit_name}</td>
                          <td>{item.Barcode}</td>
                          <td>
                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditClickCustomization(item.Id)
                                }
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModalCustomizationEdit"
                              >
                                <i class="mdi mdi-pencil"></i>
                              </button>
                              <div
                                className="modal fade"
                                id="exampleModalCustomizationEdit"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className=" modal-dialog modalShipTo">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        {t("updateCustomization")}
                                      </h1>
                                      <button
                                        type="button"
                                        class="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                        onClick={dataClear1}
                                      >
                                        <i class="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="formCreate">
                                        <div className="row">
                                          <div className="form-group col-lg-12 mb-2">
                                            <h6>{t("itfName")}</h6>
                                            <div className="ceateTransport autoComplete">
                                              {/* <select
                                                name="ITF"
                                                onChange={handleChange2}
                                                value={dataCustomization.ITF}
                                              >
                                                <option value="">
                                                  Select ITF
                                                </option>
                                                {getItf?.map((item) => (
                                                  <option
                                                    key={item.ID}
                                                    value={item.ID}
                                                  >
                                                    {item.ITF_Internal_Name_EN}
                                                  </option>
                                                ))}
                                              </select> */}
                                              <Autocomplete
                                                disablePortal
                                                options={getItf || []}
                                                getOptionLabel={(option) =>
                                                  option.ITF_Internal_Name_EN ||
                                                  ""
                                                }
                                                onChange={(e, newValue) =>
                                                  setDataCustomization(
                                                    (prevState) => ({
                                                      ...prevState,
                                                      ITF: newValue?.ID || "",
                                                    })
                                                  )
                                                }
                                                value={
                                                  getItf?.find(
                                                    (item) =>
                                                      item.ID ===
                                                      dataCustomization.ITF
                                                  ) || null
                                                }
                                                sx={{ width: 300 }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder={t("selectItf")}
                                                    InputLabelProps={{
                                                      shrink: false,
                                                    }}
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6>{t("customName")}</h6>
                                            <div className=" ">
                                              <input
                                                type="text"
                                                name="Custom_Name"
                                                className="mb-2"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Custom_Name
                                                }
                                                placeholder={t("customName")}
                                              />
                                            </div>
                                          </div>
                                          <div class="form-group col-lg-12">
                                            <h6>{t("agreedPrice")}</h6>
                                            <div className=" ">
                                              <input
                                                type="number"
                                                name="Dummy_Price"
                                                onChange={handleChange2}
                                                value={
                                                  dataCustomization.Dummy_Price
                                                }
                                                placeholder={t("agreedPrice")}
                                              />
                                            </div>
                                          </div>
                                          <div className="form-group col-lg-12 ">
                                            <h6>{t("brand")} </h6>
                                            <div className="ceateTransport autoComplete">
                                              <Autocomplete
                                                options={brands || []} // List of brand options
                                                getOptionLabel={(option) =>
                                                  option.Name_EN || ""
                                                } // Label to display
                                                onChange={(event, newValue) => {
                                                  handleChange2({
                                                    target: {
                                                      name: "brand",
                                                      value: newValue
                                                        ? newValue.ID
                                                        : "",
                                                    }, // Update selected brand_id
                                                  });
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder={t(
                                                      "selectBrand"
                                                    )}
                                                    variant="outlined"
                                                  />
                                                )}
                                                value={
                                                  brands?.find(
                                                    (item) =>
                                                      item.ID ===
                                                      dataCustomization.brand
                                                  ) || null
                                                } // Set value based on selected brand_id
                                                isOptionEqualToValue={(
                                                  option,
                                                  value
                                                ) => option.ID === value.ID} // Option comparison
                                              />
                                            </div>
                                          </div>

                                          <div className="form-group col-lg-12 ">
                                            <h6>{t("unit")}</h6>
                                            <div className="ceateTransport autoComplete">
                                              <Autocomplete
                                                options={unitDropdown || []} // List of ITFs
                                                getOptionLabel={(option) =>
                                                  option.Name_EN || ""
                                                } // Label to display (itf_name_en for each ITF)
                                                onChange={(event, newValue) => {
                                                  handleChange2({
                                                    target: {
                                                      name: "Unit",
                                                      value: newValue
                                                        ? newValue.ID
                                                        : "",
                                                    }, // Update ITF in state
                                                  });
                                                }}
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder={t(
                                                      "selectUnit"
                                                    )}
                                                    variant="outlined"
                                                  />
                                                )}
                                                value={
                                                  unitDropdown?.find(
                                                    (item) =>
                                                      item.ID ===
                                                      dataCustomization.Unit
                                                  ) || null
                                                } // Set selected value based on ITF
                                                isOptionEqualToValue={(
                                                  option,
                                                  value
                                                ) => option.ID === value.ID} // Option comparison by itf_id
                                              />
                                            </div>
                                            <div class="form-group col-lg-12 mt-2">
                                              <h6> {t("barcode")} </h6>
                                              <div className=" ">
                                                <input
                                                  type="text"
                                                  name="Barcode"
                                                  onChange={handleChange2}
                                                  value={
                                                    dataCustomization.Barcode
                                                  }
                                                  placeholder={t("barcode")}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-footer">
                                      <button
                                        type="button "
                                        onClick={customizationDataSubmit}
                                        className="btn mb-0 btn-primary"
                                      >
                                        {t("update")}{" "}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => deleteOrder(item.Id)}
                              >
                                <i class="mdi mdi-delete "></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
                <Link
                  style={{ width: "100px" }}
                  className="btn btn-danger mb-4"
                  to="/"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalCustomization"
                >
                  {t("add")}
                </Link>
                {/* customixation modal */}
                <div
                  className="modal fade"
                  id="exampleModalCustomization"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className=" modal-dialog  modalShipTo">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          {t("addCustomization")}
                        </h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={dataClear1}
                        >
                          <i class="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="formCreate">
                          <div className="row">
                            <div className="form-group col-lg-12 mb-3">
                              <h6>{t("itfName")}</h6>
                              <div className="ceateTransport autoComplete">
                                <Autocomplete
                                  options={getItf || []} // List of ITFs
                                  getOptionLabel={(option) =>
                                    option.ITF_Internal_Name_EN || ""
                                  } // Label to display (itf_name_en for each ITF)
                                  onChange={(event, newValue) => {
                                    handleChange2({
                                      target: {
                                        name: "ITF",
                                        value: newValue ? newValue.ID : "",
                                      }, // Update ITF in state
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={t("selectItf")}
                                      variant="outlined"
                                    />
                                  )}
                                  value={
                                    getItf?.find(
                                      (item) =>
                                        item.ID === dataCustomization.ITF
                                    ) || null
                                  } // Set selected value based on ITF
                                  isOptionEqualToValue={(option, value) =>
                                    option.ID === value.ID
                                  } // Option comparison by itf_id
                                />
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6>{t("customName")}</h6>
                              <div className=" ">
                                <input
                                  type="text"
                                  name="Custom_Name"
                                  onChange={handleChange2}
                                  value={dataCustomization.Custom_Name}
                                  placeholder={t("customName")}
                                  className="mb-3"
                                />
                              </div>
                            </div>
                            <div class="form-group col-lg-12">
                              <h6>{t("agreedPrice")}</h6>
                              <div className=" ">
                                <input
                                  type="number"
                                  name="Dummy_Price"
                                  onChange={handleChange2}
                                  value={dataCustomization.Dummy_Price}
                                  placeholder={t("agreedPrice")}
                                />
                              </div>
                            </div>
                            <div className="form-group col-lg-12 ">
                              <h6>{t("brand")}</h6>
                              <div className="ceateTransport autoComplete">
                                <Autocomplete
                                  options={brands || []} // List of brand options
                                  getOptionLabel={(option) =>
                                    option.Name_EN || ""
                                  } // Label to display
                                  onChange={(event, newValue) => {
                                    handleChange2({
                                      target: {
                                        name: "brand",
                                        value: newValue ? newValue.ID : "",
                                      }, // Update selected brand_id
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={t("selectBrand")}
                                      variant="outlined"
                                    />
                                  )}
                                  value={
                                    brands?.find(
                                      (item) =>
                                        item.ID === dataCustomization.brand
                                    ) || null
                                  } // Set value based on selected brand_id
                                  isOptionEqualToValue={(option, value) =>
                                    option.ID === value.ID
                                  } // Option comparison
                                />
                              </div>
                            </div>
                            <div className="form-group col-lg-12 ">
                              <h6>{t("unit")}</h6>
                              <div className="ceateTransport autoComplete">
                                <Autocomplete
                                  options={unitDropdown || []} // List of ITFs
                                  getOptionLabel={(option) =>
                                    option.Name_EN || ""
                                  } // Label to display (itf_name_en for each ITF)
                                  onChange={(event, newValue) => {
                                    handleChange2({
                                      target: {
                                        name: "Unit",
                                        value: newValue ? newValue.ID : "",
                                      }, // Update ITF in state
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder={t("selectUnit")}
                                      variant="outlined"
                                    />
                                  )}
                                  value={
                                    unitDropdown?.find(
                                      (item) =>
                                        item.ID === dataCustomization.Unit
                                    ) || null
                                  } // Set selected value based on ITF
                                  isOptionEqualToValue={(option, value) =>
                                    option.ID === value.ID
                                  } // Option comparison by itf_id
                                />
                              </div>
                              <div class="form-group col-lg-12 mt-2">
                                <h6> {t("barcode")} </h6>
                                <div className=" ">
                                  <input
                                    type="text"
                                    name="Barcode"
                                    onChange={handleChange2}
                                    value={dataCustomization.Barcode}
                                    placeholder={t("barcode")}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button "
                          onClick={submitCustomizationData}
                          className="btn mb-0 btn-primary"
                        >
                          {t("add")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* customization modal end */}
              </div>
              <div
                class="tab-pane fade"
                id="invoiceSetup-tab-pane"
                role="tabpanel"
                aria-labelledby="invoiceSetup-tab"
                tabindex="0"
              >
                <p cls>{t("invoiceSetup")}</p>
              </div>

              <div
                class="tab-pane fade"
                id="margins-tab-pane"
                role="tabpanel"
                aria-labelledby="margins-tab"
                tabindex="0"
              >
                {/* payment and channel */}
                <div className="formCreate createPackage">
                  <form>
                    <div className="row justify-content-center">
                      <div className="col-lg-3 form-group autoComplete">
                        <h6>{t("invoiceCurrency")}</h6>
                        <Autocomplete
                          options={currency || []} // List of currencies
                          getOptionLabel={(option) => option.FX || ""} // Label to display (currency name for each item)
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "invoiceCurrency",
                                value: newValue ? newValue.ID : "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectCurrency")}
                              variant="outlined"
                            />
                          )}
                          value={
                            currency?.find(
                              (item) => item.ID === state5.invoiceCurrency
                            ) || null
                          } // Set selected value based on invoiceCurrency
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          }
                        />
                      </div>
                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("invoiceUnit")}</h6>

                        <Autocomplete
                          options={unitDropdown || []}
                          getOptionLabel={(option) => option.Name_EN || ""} // Use Name_EN from API
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "Invoice_Unit",
                                value: newValue ? newValue.ID : "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectUnit")}
                              variant="outlined"
                            />
                          )}
                          value={
                            unitDropdown?.find(
                              (item) => item.ID === state5.Invoice_Unit
                            ) || null
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          }
                        />
                      </div>
                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("commission")}</h6>

                        <Autocomplete
                          options={commission || []}
                          getOptionLabel={(option) =>
                            option.commission_name_en || ""
                          }
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "commissionType",
                                value: newValue ? newValue.id : "",
                              },
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectCommission")}
                              variant="outlined"
                            />
                          )}
                          value={
                            commission?.find(
                              (item) => item.id === state5.commissionType
                            ) || null
                          } // Set selected value based on commissionType
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          } // Option comparison by id
                        />
                      </div>
                      <div className="col-lg-2 form-group">
                        <h6>{t("commissionValue")}</h6>
                        <div className="parentthb packParent">
                          <div className="childThb">
                            <input
                              type="text"
                              name="commissionValue"
                              placeholder={t("commissionValue")}
                              value={state5.commissionValue}
                              onChange={handleChange5}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-1 shipToToggle">
                        <h6>{t("commission")}</h6>
                        <label
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                          }}
                          className="toggleSwitch large"
                        >
                          <input
                            type="checkbox"
                            checked={state5.commissionCurrency === "THB"}
                            onChange={handleChange5}
                            name="commissionCurrency"
                          />
                          <span>
                            <span>{t("fx")}</span>
                            <span> {t("thb")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>
                      <div className="col-lg-2 shipToToggle">
                        <h6>{t("chargeVolume")}</h6>
                        <label
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "10px",
                          }}
                          className="toggleSwitch large"
                        >
                          <input
                            type="checkbox"
                            checked={state5.chargeVolume == 1}
                            onChange={handleChange5}
                            name="chargeVolume"
                          />
                          <span>
                            <span>{t("no")}</span>
                            <span>{t("yes")}</span>
                          </span>
                          <a> </a>
                        </label>
                      </div>

                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("deliveryTermsIncoterms")}</h6>
                        <Autocomplete
                          options={DropdownDelivery || []} // List of delivery terms and incoterms
                          getOptionLabel={(option) => option.Incoterms || ""} // Label to display (Incoterms)
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "deliveryTerms",
                                value: newValue ? newValue.id : "",
                              }, // Update deliveryTerms in state
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectDeliveryTermsIncoterms")}
                              variant="outlined"
                            />
                          )}
                          value={
                            DropdownDelivery?.find(
                              (item) => item.id === state5.deliveryTerms
                            ) || null
                          } // Set selected value based on deliveryTerms
                          isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                          } // Option comparison by id
                        />
                      </div>

                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("paymentTerms")}</h6>
                        <Autocomplete
                          options={FXCorrection || []} // List of payment terms
                          getOptionLabel={(option) =>
                            `${option.DAYS} DAYS` || ""
                          } // Label to display (e.g., "30 DAYS")
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "paymentTerms",
                                value: newValue ? newValue.ID : "",
                              }, // Update paymentTerms in state
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectPaymentTerms")}
                              variant="outlined"
                            />
                          )}
                          value={
                            FXCorrection?.find(
                              (item) => item.ID === state5.paymentTerms
                            ) || null
                          } // Set selected value based on paymentTerms
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          } // Option comparison by ID
                        />
                      </div>

                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("statementDueDate")}</h6>
                        <Autocomplete
                          disablePortal
                          options={[
                            { id: 1, label: "Pre Shipment" },
                            { id: 2, label: "Seaport" },
                          ]} // Define the options array
                          getOptionLabel={(option) => option.label} // Display the `label` for each option
                          onChange={handleChange5} // Use the handleChange function
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectStatementDueDate")}
                              InputLabelProps={{ shrink: false }} // Prevents floating label
                            />
                          )}
                          sx={{ width: 300 }}
                        />
                      </div>

                      {/* <div className="col-lg-2 form-group">
                        <h6>Rounding</h6>
                        <input
                          type="text"
                          name="Rounding"
                          className="form-control"
                          placeholder="15.000"
                          value={state5.extraCost}
                          onChange={handleChange5}
                        />
                      </div> */}
                      <div className="col-lg-2 form-group autoComplete">
                        <h6>{t("rounding")}</h6>
                        <Autocomplete
                          options={RoundingDataList || []} // List of delivery terms and incoterms
                          getOptionLabel={(option) => option.DropDown || ""} // Label to display (Incoterms)
                          onChange={(event, newValue) => {
                            handleChange5({
                              target: {
                                name: "Rounding",
                                value: newValue ? newValue.ID : "",
                              }, // Update deliveryTerms in state
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectRounding")}
                              variant="outlined"
                            />
                          )}
                          value={
                            RoundingDataList?.find(
                              (item) => item.ID === state5.Rounding
                            ) || null
                          } // Set selected value based on deliveryTerms
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          } // Option comparison by id
                        />
                      </div>
                      <div className="col-lg-2 form-group">
                        <h6>{t("extraCost")}</h6>
                        <input
                          type="text"
                          name="extraCost"
                          className="form-control"
                          placeholder={t("extraCost")}
                          value={state5.extraCost}
                          onChange={handleChange5}
                        />
                      </div>
                      <div className="col-lg-2 form-group  ">
                        <h6>{t("freightAdjustment")}</h6>
                        <input
                          type="text"
                          name="freightAdjust"
                          className="form-control"
                          placeholder={t("freightAdjustment")}
                          value={state5.freightAdjust}
                          onChange={handleChange5}
                        />
                      </div>
                      <div className="col-lg-2 form-group">
                        <h6>{t("markupValue")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="markupValue"
                              className="form-control"
                              placeholder={t("markupValue")}
                              value={state5.markupValue}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 form-group">
                        <h6>{t("rebateValue")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="rebateValue"
                              className="form-control"
                              placeholder={t("rebateValue")}
                              value={state5.rebateValue}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 form-group">
                        <h6>{t("quotation")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="quotation"
                              className="form-control"
                              placeholder={t("quotation")}
                              value={state5.quotation}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 form-group">
                        <h6>{t("claim")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="claim"
                              className="form-control"
                              placeholder={t("claim")}
                              value={claimValue1}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 form-group">
                        <h6>{t("other")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="other"
                              className="form-control"
                              placeholder={t("other")}
                              value={state5.other}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 form-group">
                        <h6>{t("final")}</h6>
                        <div className="parentShip">
                          <div className="markupShip">
                            <input
                              type="text"
                              name="final"
                              className="form-control"
                              placeholder={t("final")}
                              value={claimValue}
                              onChange={handleChange5}
                            />
                          </div>
                          <div className="shipPercent">
                            <span>%</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={updatePaymentValue}
                          type="button"
                        >
                          {from?.consignee_id ? t("update") : t("create")}
                        </button>
                        <Link className="btn btn-danger" to="/shipToNew">
                          {t("cancel")}
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="contact-tab-pane"
                role="tabpanel"
                aria-labelledby="contact-tab"
                tabindex="0"
              >
                <div className="py-3">
                  <div className="row newSmallCard ">
                    <div className="flex flex-wrap">
                      <div>
                        <div className="selectTimeHead">
                          <h6>{t("selectTimePeriod")} :</h6>
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
                              placeholder={t("comparisonPeriod")}
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
                          {t("confirm")}
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
                              {t("totalShipments")}
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
                              {t("totalClaims")}
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
                              {t("totalPayment")}{" "}
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
                              {t("pendingPayment")}
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
                              {t("totalNetWeightShipped")}
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
                              {t("totalGrossWeightShipped")}
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
                              {t("totalBoxesShipped")}
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
                              {t("totalShipments")}
                            </p>
                            <div className="parentFirstShip mt-4">
                              <p>{t("dateOfFirstShipment")}</p>
                              <p>
                                {" "}
                                {boxsData?.Shipments?.First_Shipment
                                  ? boxsData?.Shipments?.First_Shipment
                                  : 0}{" "}
                              </p>
                            </div>
                            <div className="parentFirstShip">
                              <p>{t("dateOfLastShipment")}</p>
                              <p>
                                {" "}
                                {boxsData?.Shipments?.Last_Shipment
                                  ? boxsData?.Shipments?.Last_Shipment
                                  : 0}{" "}
                              </p>
                            </div>
                            <div className="parentFirstShip">
                              <p>{t("shipmentsInPipeLine")}</p>
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
                        <h3 className="itemOrder">{t("topItems")}</h3>

                        <div className="selectProduce">
                          <Autocomplete
                            disablePortal
                            options={value.slice(0, 3)} // Only the top three options
                            value={
                              value?.find(
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
                                placeholder={t("invoiceValue")}
                              />
                            )}
                          />
                        </div>
                      </div>

                      <div className="tableCreateClient">
                        <table>
                          <tr>
                            <th>{t("itfName")}</th>
                            <th>{t("lastPeriodKg")}</th>
                            <th>{t("currentPeriodKg")}</th>
                            <th>{t("diff")}</th>
                            <th>{t("percentChange")}</th>
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
                            value={options?.find(
                              (option) => option.value === selectedDataset
                            )}
                            placeholder={t("select")}
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
                    {t("close")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddShipTo;
