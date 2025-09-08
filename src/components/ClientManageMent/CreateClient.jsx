import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import MySwal from "../../swal";
import { Card } from "../../card";
import jsPDF from "jspdf";
import dayjs from "dayjs";

import "jspdf-autotable";
import ChartConsi from "./ChartConsi";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
const CreateClient = () => {
  const [t, i18n] = useTranslation("global");
  const location = useLocation();
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const { data: massengerTypeList } = useQuery("getMessengerType");
  console.log(massengerTypeList);
  const messengerOptions =
    massengerTypeList?.map((item) => ({
      label: item.Name_EN,
      value: item.ID,
    })) || [];
  const [showModal, setShowModal] = useState(false);
  const [showFirst, setShowFirst] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "update"

  const { data: clients } = useQuery("getClientDataAsOptions");

  const { data: consignee } = useQuery("getConsignee");
  const { data: DropdownDelivery } = useQuery("DropdownDelivery");
  const [claimValue, setClaimvalue] = useState("");

  const { data: FXCorrection } = useQuery("FXCorrection");
  const { data: RoundingDataList } = useQuery("GetRoundingTable");
  const [claimValue1, setClaimvalue1] = useState("");
  const [data1, setData1] = useState([]);
  const [consignees, setConsignees] = useState([]);
  const [collectPaymentId, setCollectPaymentId] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [consigneeData, setConsigneeData] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [orderItem, setOrderItem] = useState([]);
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
  // new statics
  const [isEdit, setIsEdit] = useState(false); // false = add, true = edit
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [dataPeriod, setDataPeriod] = useState([]);
  const [dataComparison, setDataComparison] = useState([]);
  const [date1, setDate1] = useState("");
  const [updateId, setUpdateId] = useState("");
  const [date2, setDate2] = useState("");
  const [date3, setDate3] = useState("");
  const [date4, setDate4] = useState("");
  const [consigeeDetails, setconsigeeDetails] = useState("");
  const [selectedcomparison, setSelectedComparison] = useState("");
  const [value, setValue] = useState([]);
  // new statistic end
  const [toDate, setToDate] = useState("");
  console.log(selectedItemId);
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  // new

  const [state5, setState5] = useState({
    User_ID: localStorage.getItem("id"),
    Client: from?.Client ?? 1,
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
  const [state6, setState6] = useState({
    brand: "",
    port_of_orign: "",
    Default_location: "",
    destination_port: "",
    liner_Drop: "",
    invoiceCurrency: "",
    clientId: from?.ID ?? undefined,
    markup: "",
    rebate: "",
    commissionType: "",
    consigneeType: "",
    consigneeCode: "",
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
  const [state8, setState8] = useState({
    VCID: "",
    Name_First: "",
    Name_Last: "",
    Email: "",
    Phone: "",
    Mobile: "",
    Messenger_Type: "",
    Messenger_ID: "",
    Title: "",
    Position: "",
    Notes: "",
    Accounting: false,
    Invoice: false,
    Logitics: false,
  });
  const [updateId1, setUpdateId1] = useState(null);

  const [dataCustomization, setDataCustomization] = useState({
    Consignee_Customize_id: "",
    Client_ID: from?.Client,
    Consignee_id: "",
    ITF: "",
    Custom_Name: "",
    max_Price: "",
    Unit: "",
    Barcode: "",
    brand: "",
    Custom_Code: "",
    Custom_Margin: "",
    Dummy_Price: "",
  });
  const handleChange8 = (e) => {
    const { name, value, type, checked } = e.target;
    setState8((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    if (from?.ID) {
      console.log(from?.ID);
      setState8((prev) => ({
        ...prev,
        VCID: from.ID,
      }));
    }
  }, [from]);
  const handleSubmit8 = async () => {
    try {
      const payload = {
        ...state8, // assuming your state variable is `state`
        VCID: from?.ID || state8.VCID, // ✅ ensure VCID is sent
        User_ID: localStorage.getItem("id"), // Get from localStorage
      };

      const res = await axios.post(`${API_BASE_URL}/AddVcContact`, payload);
      console.log("Response:", res.data);

      // Reset form
      setState8({
        VCID: "",
        Name_First: "",
        Name_Last: "",
        Email: "",
        Phone: "",
        Mobile: "",
        Messenger_Type: "",
        Messenger_ID: "",
        Notes: "",
        Accounting: false,
        Invoice: false,
        Logitics: false,
      });

      // Hide modal
      const modalElement = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      getAllContact();
      // Success toast (using message from API if available)
      toast.success(res.data?.message, {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error(t("networkError"), {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
  };
  const customizationDataSubmit = async () => {
    if (!dataCustomization.ITF) {
      toast.warn(t("enterItf"), { autoClose: 1000, theme: "colored" });
      return;
    }
    if (!dataCustomization.Unit) {
      toast.warn(t("enterUnit"), { autoClose: 1000, theme: "colored" });
      return;
    }

    try {
      let payload = {};
      if (modalMode === "add") {
        payload = {
          Consignee_id: updateId1,
          Client_ID: from?.Client,
          ITF: dataCustomization.ITF,
          Custom_Name: dataCustomization.Custom_Name,
          max_Price: dataCustomization.max_Price,
          Unit: dataCustomization.Unit,
          Barcode: dataCustomization.Barcode,
          brand: dataCustomization.brand,
          Custom_Code: dataCustomization.Custom_Code,
          Custom_Margin: dataCustomization.Custom_Margin,
          Dummy_Price: dataCustomization.Dummy_Price,
        };

        await axios.post(`${API_BASE_URL}/createConsigneeCustomize`, payload);
        getAllCustomization(updateId1);
        toast.success("Customization added successfully");
      } else {
        payload = {
          Consignee_Customize_id: dataCustomization.Consignee_Customize_id,
          ITF: dataCustomization.ITF,
          Custom_Name: dataCustomization.Custom_Name,
          max_Price: dataCustomization.max_Price,
          Unit: dataCustomization.Unit,
          Barcode: dataCustomization.Barcode,
          brand: dataCustomization.brand,
          Custom_Code: dataCustomization.Custom_Code,
          Custom_Margin: dataCustomization.Custom_Margin,
          Dummy_Price: dataCustomization.Dummy_Price,
        };

        await axios.post(`${API_BASE_URL}/updateConsigneeCustomize`, payload);
        getAllCustomization(updateId1);
        toast.success("Customization updated successfully");
      }

      setShowModal(false);
      // refresh list here if needed
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const clearAllData8 = () => {
    setState8({
      VCID: "",
      Name_First: "",
      Name_Last: "",
      Email: "",
      Phone: "",
      Mobile: "",
      Messenger_Type: "",
      Messenger_ID: "",
      Notes: "",
      Accounting: false,
      Invoice: false,
      Logitics: false,
    });
  };
  const { data: dropdownVendor } = useQuery("getDropdownVendor");
  const { data: brands } = useQuery("getBrand");
  const { data: locations } = useQuery("getLocation");
  const { data: port } = useQuery("getAllAirports");
  const { data: dropdownDistrict } = useQuery("getDropdownAddressDistrict");
  const { data: dropdownSubDistrict } = useQuery(
    "getDropdownAddressSub-district"
  );
  const availableDistrict = useMemo(() => {
    return dropdownDistrict?.filter((item) => item._id == state5.provinces);
  }, [state5.provinces, dropdownDistrict]);

  const availableSubDistrict = useMemo(() => {
    return dropdownSubDistrict?.filter((item) => item._id == state5.district);
  }, [
    state5.provinces,
    dropdownDistrict,
    state5.district,
    dropdownSubDistrict,
  ]);
  console.log(availableSubDistrict);
  useEffect(() => {
    const p = dropdownSubDistrict?.find(
      (item) => item.code == state5.id
    )?.zipcode;
    if (p)
      setState5((prevState) => {
        return {
          ...prevState,
          postcode: p,
        };
      });
  }, [state5.subdistrict, dropdownSubDistrict]);

  const handleChange5 = (event) => {
    const { name, value } = event.target;
    setState5((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit6 = () => {
    axios
      .post(`${API_BASE_URL}/updateConsigneeNotify`, {
        consignee_id: updateId1,
        notify_name: formData.notify_name,
        notify_tax_number: formData.notify_tax_number,
        notify_email: formData.notify_email,
        notify_phone: formData.notify_phone,
        notify_address: formData.notify_address,
      })
      .then(() => {
        getAllContact1();
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
  const handleChange7 = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleChange6 = (e) => {
    const { name, type, checked, value } = e.target;
    if (name === "commissionCurrency") {
      // Toggle between "THB" and "FX"
      setState6((prevState) => ({
        ...prevState,
        commissionCurrency: checked ? "THB" : "FX",
      }));
    } else if (name === "chargeVolume") {
      setState6((prevState) => ({
        ...prevState,
        chargeVolume: checked ? 1 : 0,
      }));
    } else {
      setState6((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCloseAddModal = () => {
    setShowModal(false);
    dataClear1(); // clear form on close
  };

  const updateVendor = async () => {
    try {
      setIsButtonClicked(true); // Set button clicked state to true
      await axios.post(
        `${API_BASE_URL}/${
          typeof state5.vendor_id == "undefined" ? "addVC" : "updateVC"
        }`,
        {
          id: state5.vendor_id,
          User_ID: state5.User_ID,
          name: state5.name,
          taxId: state5.taxId,
          Phone_Main: state5.phone,
          Email_Main: state5.email,
          Messenger_Type: state5.Messenger_Type,
          Messenger_Main_ID: state5.messangerId,
          Country: selectedCountry?.name || "",
          Province: selectedProvince?.name || "",
          District: selectedDistrict?.name || "",
          Subdistrict: selectedSubdistrict?.name || "",
          Postcode: postalCode,
          Address1: state5.address1,
          Address2: state5.address2,
          Bank_Name: state5.Bank_Name,
          Legal_Entity: state5.Entity,
          Bank_Branch: state5.Bank_Branch,
          Bank_Account: state5.Bank_Account,
          Bank_IBAN: state5.Bank_IBAN,
          Bank_Swift: state5.Bank_Swift,
          Bank_Country: state5.Bank_Country,
          Bank_Address: state5.Bank_Address,
          Client: state5.Client || 1,
        }
      );
      toast.success(t("success"));

      navigate("/clientNew");
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
  const getAllProduce = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      setValue(res?.value?.value || []);
    });
  };
  useEffect(() => {
    getAllProduce();
    getAllTimePeriod();
    getComparisonPeriod();
  }, []);
  const confirmData = () => {
    let obj = {
      Produce_ID: selectedProduceId,
      Start_Date: date1,
      Stop_Date: date2,
    };
    console.log("confirm data is", obj);
    // Validate required fields
    if (!selectedProduceId) {
      toast.error(t("produceRequired"));
      return;
    }
    if (!date1) {
      toast.error(t("startDateRequired"));
      return;
    }
    if (!date2) {
      toast.error(t("stopDateRequired"));
      return;
    }
  };
  //new statics end
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
  const dataClear2 = () => {
    setFromDate("");
    setToDate("");
    setClientId("");
  };
  const handleSubmit = async () => {
    const payload = {
      client_id: from?.client_id,

      from_date: fromDate,
      to_date: toDate,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/getClientStatement`,
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
        // doc.text("Consignee Details", 127.2, 24);

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
        const longText1_1 = `${from?.client_name}(${from?.client_tax_number})`;
        const longText1_2 = `${from?.client_address}`;
        const longText1_3 = `${from?.client_email} / ${from?.client_phone}`;

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
        // doc.setFontSize(11);

        // const longText2_1 = `${data?.consignee_name}(${data?.consignee_tax_number})`;
        // const longText2_2 = `${data?.consignee_address}`;
        // const longText2_3 = `${data?.consignee_email}/${data?.consignee_phone}`;

        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_1,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );
        // doc.setFontSize(10);
        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_2,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );
        // startY2 = renderWrappedText2(
        //   doc,
        //   longText2_3,
        //   startX2,
        //   startY2,
        //   maxWidth2,
        //   lineHeight2
        // );

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
          index: formatDate(item.Date_),
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
      `${from?.client_name || "default"}_Statement_${formatDate(
        new Date()
      )}.pdf`
    );
    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${from?.client_name}_Statement_${formatDate(
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
    client_name: from?.client_name || "",
    client_tax_number: from?.client_tax_number || "",
    client_email: from?.client_email || "",
    client_phone: from?.client_phone || "",
    client_address: from?.Address1 || "",
    client_address1: from?.Address2 || "",
    client_address2: from?.Address3 || "",
    client_address3: from?.Address4 || "",
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
    // bank_name: from?.bank_name || "",
    // account_name: from?.account_name || "",
    // account_number: from?.account_number || "",
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
  console.log(from);

  const { data: paymentChannle } = useQuery("PaymentChannela");

  const { data: client } = useQuery("getAllClients");
  const { data: getItf } = useQuery("getItf");
  console.log(getItf);
  const { data: liner } = useQuery("getLiner");
  const { data: commission } = useQuery("getDropdownCommissionType");
  const { data: getVcConsigneeList } = useQuery("getVcConsignee");

  const { data: contactType } = useQuery("DropdownContactType ");
  const [state1, setState1] = useState({
    client_id: from?.client_id || "",
    contact_type_id: "",
    contact_id: "",
    consignee_id: from?.consignee_id || null, // Assuming you want to capture this in the form as well
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
  const [formData, setFormData] = useState({
    notify_name: "",
    notify_tax_number: "",
    notify_email: "",
    notify_phone: "",
    notify_address: "",
  });
  const handleAddClick = () => {
    setIsEdit(false);
    setState8({
      Title: "",
      Name_First: "",
      Name_Last: "",
      Position: "",
      Accounting: false,
      Invoice: false,
      Logitics: false,
      Email: "",
      Mobile: "",
      Phone: "",
      Messenger_Type: "",
      Messenger_ID: "",
      Notes: "",
      Nick_name: "",
    });
  };
  // Open Add modal
  const handleOpenAddModal = () => {
    setModalMode("add");
    setDataCustomization({
      Consignee_Customize_id: "",
      ITF: "",
      Custom_Name: "",
      max_Price: "",
      Unit: "",
      Barcode: "",
      brand: "",
      Custom_Code: "",
      Custom_Margin: "",
      Dummy_Price: "",
    });
    setShowModal(true);
  };

  // Open Update modal (pass selected row data)
  const handleOpenUpdateModal = (row) => {
    setModalMode("update");
    setDataCustomization({
      Consignee_Customize_id: row.Consignee_Customize_id,
      ITF: row.ITF,
      Custom_Name: row.Custom_Name,
      max_Price: row.max_Price,
      Unit: row.Unit,
      Barcode: row.Barcode,
      brand: row.brand,
      Custom_Code: row.Custom_Code,
      Custom_Margin: row.Custom_Margin,
      Dummy_Price: row.Dummy_Price,
    });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
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
      console.log(response);
      // Handle successful response
    } catch (error) {
      console.error(error);
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
      toast.error(t("paymentMismatch"));
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
      toast.error(t("genericError"));
    }
  };
  const updatePaymentValue = () => {
    console.log(updateId);

    // Determine create mode based on updateId
    const isCreate = !updateId;

    axios
      .post(
        `${API_BASE_URL}/${
          isCreate
            ? "AddMarginPaymentClientConsignee"
            : "updateMarginPaymentClientConsignee"
        }`,
        {
          id: updateId, // only send id if updating
          client_id: from?.ID,
          brand: state6?.brand,
          Default_location: state6.Default_location,
          port_of_orign: state6.port_of_orign,
          destination_port: state6.destination_port,
          Liner: state6.liner_Drop,
          consignee_id: state6?.consigneeType,
          profit: state6.markupValue,
          Consignee_Code: state6.consigneeCode,
          rebate: state6.rebateValue,
          commission: state6.commissionType,
          Invoice_Unit: state6.Invoice_Unit,
          commission_value: state6.commissionValue,
          Charge_Volume: state6.chargeVolume ? 1 : 0,
          Commission_Currency: state6.commissionCurrency,
          currency: parseInt(state6.invoiceCurrency),
          Incoterms: state6.deliveryTerms,
          Payment_Terms: state6.paymentTerms,
          Extra_cost: state6.extraCost,
          Quotation_Margin: state6.quotation,
          Extra_Margin: state6.other,
          Freight_Adjustment: state6.freightAdjust,
          Rounding: state6.Rounding,
        }
      )
      .then((response) => {
        console.log("API Response:", response.status, response.data);

        if (response.data?.success) {
          getAllContact1();

          // Close modal (create instance if null)
          let modalElement = document.getElementById("exampleModalContact");
          let modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);

          if (isCreate) {
            clearAllFields1();
          }
          modalInstance.hide();

          toast.success(isCreate ? t("createdSuccess") : t("updatedSuccess"), {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          toast.error(t(response.data?.message || "networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.error("Axios Error:", error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

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
  const clearAllFields1 = () => {
    setShowFirst(false);
    setState6({
      clientId: "",
      consigneeType: "",
      markupValue: "",
      consigneeCode: "",
      rebateValue: "",
      commissionType: "",
      Invoice_Unit: "",
      commissionValue: "",
      chargeVolume: 0,
      commissionCurrency: "",
      invoiceCurrency: "",
      deliveryTerms: "",
      paymentTerms: "",
      extraCost: "",
      quotation: "",
      other: "",
      freightAdjust: "",
      Rounding: "",
      brand: "",
      Default_location: "",
      port_of_orign: "",
      destination_port: "",
      liner_Drop: "",
    });
  };
  const clearAllFields2 = () => {
    setState6({
      clientId: "",
      consigneeType: "",
      markupValue: "",
      consigneeCode: "",
      rebateValue: "",
      commissionType: "",
      Invoice_Unit: "",
      commissionValue: "",
      chargeVolume: 0,
      commissionCurrency: "",
      invoiceCurrency: "",
      deliveryTerms: "",
      paymentTerms: "",
      extraCost: "",
      quotation: "",
      other: "",
      freightAdjust: "",
      Rounding: "",
      brand: "",
      Default_location: "",
      port_of_orign: "",
      destination_port: "",
      liner_Drop: "",
    });
  };
  const closeData = () => {
    navigate("/clientNew");
    setClientId((prevClientId) => "");
    setConsigneeId((prevConsigneeId) => "");
    console.log(clientId);
    console.log(consigneeId);
    // Update client details and summary table

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
  const [data, setData] = useState([]);
  const [customization, setCustomization] = useState([]);
  const [customization1, setCustomization1] = useState([]);

  const [headers, setHeaders] = useState({});
  const getAllContact = () => {
    axios
      .post(`${API_BASE_URL}/getVCConstact`, {
        VCID: from?.ID,
      })
      .then((res) => {
        const { head, data } = res.data;
        setHeaders(head || {});
        setData(data || []);
      })
      .catch((err) => {
        console.error("Error fetching data", err);
      });
  };
  const getAllContact1 = async () => {
    axios
      .post(`${API_BASE_URL}/clientConsigneeTableEN`, {
        client_id: from?.ID,
      })
      .then((res) => {
        const { head, data } = res.data;
        setHeaders(head || {});
        setData1(data || []);
      })
      .catch((err) => {
        console.error("Error fetching data", err);
      });
  };
  useEffect(() => {
    getAllContact1();
  }, [from?.ID]);
  // const getAllContact = () => {
  //   axios
  //     .post(`${API_BASE_URL}/clientConsigneeTableEN`, {
  //       client_id: from?.ID,
  //     })
  //     .then((res) => {
  //       const { head, data } = res.data;
  //       setHeaders(head || {});
  //       setData(data || []);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching data", err);
  //     });
  // };

  const getAllCustomization = (rowData) => {
    axios
      .post(`${API_BASE_URL}/getConsigneeCustomization`, {
        consignee_id: rowData,
      })
      .then((res) => {
        console.log(res);
        setCustomization(res.data.data || []);
      });
  };

  const getAllCustomization1 = () => {
    axios
      .post(`${API_BASE_URL}/getVCConstact`, {
        VCID: from?.ID,
      })
      .then((res) => {
        console.log(res);
        setCustomization1(res.data.data || []);
      });
  };
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
          getAllCustomization(updateId1);
          toast.success("Order delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
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
          toast.success("Contact delete successfully");
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };

  const deleteOrder3 = (id) => {
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
          const response = await axios.post(`${API_BASE_URL}/deleteVCContact`, {
            ID: id,
          });
          console.log(response);
          getAllContact();
          toast.success("Contact delete successfully");
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  const deleteOrder2 = (id) => {
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
            `${API_BASE_URL}/DeleteClientConsignee`,
            {
              ID: id,
            }
          );
          console.log(response);
          getAllContact1();
          toast.success("Contact delete successfully");
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  useEffect(() => {
    getAllContact();
    getAllCustomization();
    getAllCustomization1();
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

  const dataClear1 = () => {
    setDataCustomization({
      Consignee_id: "",
      brand: "",
      ITF: "",
      Custom_Name: "",
      Dummy_Price: "",
      Unit: "",
      Barcode: "",
    });
  };

  const submitCusomizationData = () => {
    if (!dataCustomization.ITF) {
      toast.warn(t("enterItf"), {
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
      .post(`${API_BASE_URL}/createConsigneeCustomize`, {
        ...dataCustomization, // keep all existing fields
        Consignee_id: updateId1, // add your new field
        Client_ID: from?.Client,
      })
      .then((response) => {
        console.log(response);
        toast.success(t("customizationAdd"), {
          autoClose: 1000,
          theme: "colored",
        });
        getAllCustomization();
        setDataCustomization({
          Consignee_id: from?.consignee_id || "",
          brand: "",
          ITF: "",
          Custom_Name: "",
          Dummy_Price: "",
          Unit: "",
          Barcode: "",
        });
        let modalElement = document.getElementById("exampleModalCustomization");
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
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };
  // const customizationDataSubmit = (e) => {
  //   if (!dataCustomization.ITF) {
  //     toast.warn(t("enterItf"), {
  //       autoClose: 1000,
  //       theme: "colored",
  //     });
  //     return;
  //   }

  //   if (!dataCustomization.Unit) {
  //     toast.warn(t("enterUnit"), {
  //       autoClose: 1000,
  //       theme: "colored",
  //     });
  //     return;
  //   }

  //   console.log(dataCustomization);
  //   e.preventDefault();
  //   axios
  //     .post(`${API_BASE_URL}/updateConsigneeCustomize`, dataCustomization)
  //     .then((response) => {
  //       console.log(response);
  //       getAllContact();
  //       toast.success(t("customizationUpdate"), {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       // Close the modal
  //       getAllCustomization();
  //       let modalElement = document.getElementById(
  //         "exampleModalCustomizationEdit"
  //       );
  //       let modalInstance = bootstrap.Modal.getInstance(modalElement);
  //       if (modalInstance) {
  //         modalInstance.hide();
  //       }
  //       // Clear the form fields
  //       setDataCustomization({
  //         Consignee_id: from?.consignee_id || "",
  //         ITF: "",
  //         brand: "",
  //         Custom_Name: "",
  //         Dummy_Price: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error(t("networkError"), {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       return false;
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
  const contactDataSubmit = (e) => {
    e.preventDefault();

    // Check for required fields
    const { contact_type_id, first_name, last_name, Email, mobile } = state1;

    if (!contact_type_id) {
      toast.error(t("contactTypeRequired"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!first_name) {
      toast.error(t("firstNameRequired"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!last_name) {
      toast.error(t("lastNameRequired"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!Email) {
      toast.error(t("emailRequired"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    if (!mobile) {
      toast.error(t("mobileRequired"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      toast.error(t("invalidEmail"), {
        autoClose: 1000,
        theme: "colored",
      });
      return;
    }

    // Make the API call if validation passes
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
        let modalElement = document.getElementById("exampleModalContact1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        // let modalElement1 = document.getElementById("exampleModalContactAdd");
        // let modalInstance1 = bootstrap.Modal.getInstance(modalElement1);
        // if (modalInstance1) {
        //   modalInstance1.hide();
        // }
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

  // const contactDataSubmit = (e) => {
  //   console.log(state1);
  //   e.preventDefault();
  //   axios
  //     .post(`${API_BASE_URL}/addContactDetails`, state1)
  //     .then((response) => {
  //       console.log(response);
  //       getAllContact();
  //       toast.success("Contact added Successfully", {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       // Close the modal
  //       let modalElement = document.getElementById("exampleModalContact");
  //       let modalInstance = bootstrap.Modal.getInstance(modalElement);
  //       if (modalInstance) {
  //         modalInstance.hide();
  //       }
  //       // Clear the form fields
  //       setState1({
  //         client_id: "",
  //         contact_type_id: "",
  //         contact_id: "",
  //         consignee_id: from?.consignee_id || "",
  //         first_name: "",
  //         last_name: "",
  //         position: "",
  //         Email: "",
  //         mobile: "",
  //         landline: "",
  //         birthday: "",
  //         Notes: "",
  //         Nick_name: "",
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       toast.error("Network Error", {
  //         autoClose: 1000,
  //         theme: "colored",
  //       });
  //       return false;
  //     });
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
    const selectedUser = data?.find((item) => item.ID === id);
    if (!selectedUser) return;

    setIsEdit(true);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", selectedUser);
    setState8({
      ID: selectedUser?.ID || "", // keep ID for update
      Title: selectedUser?.Title || "",
      Name_First: selectedUser?.Name_First || "",
      Name_Last: selectedUser?.Name_Last || "",
      Position: selectedUser?.Position || "",
      Accounting: selectedUser?.Accounting === 1,
      Invoice: selectedUser?.Invoice === 1,
      Logitics: selectedUser?.Logitics === 1,
      Email: selectedUser?.Email || "",
      Mobile: selectedUser?.Mobile || "",
      Phone: selectedUser?.Phone || "",
      Messenger_Type: selectedUser?.Messenger_Type || "",
      Messenger_ID: selectedUser?.Messenger_ID || "",
      Notes: selectedUser?.Notes || "",
      Nick_name: selectedUser?.Nick_name || "",
    });
  };

  console.log(updateId);

  const handleEditClick1 = (updateId1) => {
    console.log(updateId1);
    getAllCustomization(updateId1);
    setUpdateId(updateId1);
    axios
      .get(`${API_BASE_URL}/getClientConsigneeByID`, {
        params: { ID: updateId1 },
      })
      .then((res) => {
        const d = res.data?.data || {};
        setState6({
          clientId: d.ID || "",
          consigneeType: d.Consignee || "",
          markupValue: d.profit || "",
          consigneeCode: d.Consignee_Code || "",
          rebateValue: d.rebate || "",
          commissionType: d.commission || "",
          Invoice_Unit: d.Invoice_Unit || "",
          commissionValue: d.commission_value || "",
          chargeVolume: d.Charge_Volume || 0,
          commissionCurrency: d.Commission_Currency || "",
          invoiceCurrency: d.currency || "",
          deliveryTerms: d.Incoterms || "",
          paymentTerms: d.Payment_Terms || "",
          extraCost: d.Extra_cost || "",
          quotation: d.Quotation_Margin || "",
          other: d.Extra_Margin || "",
          freightAdjust: d.Freight_Adjustment || "",
          Rounding: d.Rounding || "",
          brand: d?.brand || "",
          Default_location: d.Default_location || "",
          port_of_orign: d.port_of_orign || "",
          destination_port: d.destination_port || "",
          liner_Drop: d.Liner || "",
        });
        setFormData({
          notify_name: d.notify_name || "",
          notify_tax_number: d.notify_tax_number || "",
          notify_email: d.notify_email || "",
          notify_phone: d.notify_phone || "",
          notify_address: d.notify_address || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching consignee by ID", err);
      });
  };

  const handleEditClickCustomization = (item) => {
    // set modal mode to edit
    setModalMode("edit");
    console.log(item);
    // prefill form state with row data
    setDataCustomization({
      Consignee_Customize_id: item.Id, // your table row primary key
      ITF: item.ITF || "",
      Custom_Name: item.Custom_Name || "",
      max_Price: item.MAX_Price || "", // agreed price
      Unit: item.Unit || "",
      Barcode: item.Barcode || "",
      brand: item.Brand || "",
      Custom_Code: item.Custom_Code || "",
      Custom_Margin: item.Custom_Margin || "",
      Dummy_Price: item.Dummy_Price || "",
    });

    // finally open modal
    setShowModal(true);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  });

  console.log(state.Commission_Currency);
  return (
    <>
      <Card
        title={`${t("clients")} / ${
          from?.consignee_id ? t("update") : t("create")
        } ${t("form")}`}
      >
        <div className="top-space-search-reslute newSmallCard">
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
                    class="nav-link"
                    id="profile-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#consigneeTab"
                    type="button"
                    role="tab"
                    aria-controls="consigneeTab"
                    aria-selected="false"
                  >
                    {t("consignee")}
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
                    {t("statistics")}
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button
                    class="nav-link "
                    id="notifyNew"
                    data-bs-toggle="tab"
                    data-bs-target="#notifyNew-pane"
                    type="button"
                    role="tab"
                    aria-controls="notifyNew-pane"
                  >
                    {t("notify")}
                  </button>
                </li>
                {localStorage.getItem("level") !== "Level 5" && (
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
                      {t("accounting")}
                    </button>
                  </li>
                )}
              </ul>

              <div class="tab-content" id="myTabContent">
                {/* consignee tab detail */}
                <div
                  class="tab-pane fade show"
                  id="consigneeTab"
                  role="tabpanel"
                  aria-labelledby="consigneeTab"
                  tabindex="0"
                >
                  <div className="table-responsive">
                    <table className="tableContact striped table borderTerpProduce">
                      <thead>
                        <tr>
                          {/* Dynamic headers from API (excluding ID) */}
                          {Object.entries(headers)
                            .filter(
                              ([key]) => key !== "ID" && key !== "consignee_ID"
                            ) // exclude ID
                            .map(([_, headerTitle], index) => (
                              <th key={index}>{headerTitle}</th>
                            ))}

                          {/* Fixed Action Header */}
                          <th>{t("action")}</th>
                        </tr>
                      </thead>

                      <tbody>
                        {data1?.map((item, rowIndex) => (
                          <tr key={rowIndex}>
                            {/* Dynamic row data (excluding ID) */}
                            {Object.keys(headers)
                              .filter(
                                (key) => key !== "ID" && key !== "consignee_ID"
                              ) // exclude ID
                              .map((key, colIndex) => (
                                <td key={colIndex}>{item[key]}</td>
                              ))}

                            {/* Action column */}
                            <td>
                              <div>
                                {/* Edit button */}
                                <button
                                  type="button"
                                  // onClick={() => handleEditClick1(item.ID)}
                                  // data-bs-toggle="modal"
                                  // data-bs-target="#exampleModalContactEdit"

                                  onClick={() => {
                                    setUpdateId1(item.Consignee_ID); // store the ID
                                    getAllCustomization(item.Consignee_ID); // call API with that ID
                                    handleEditClick1(item.ID);
                                    setShowFirst(true); // open modal
                                  }}
                                >
                                  <i className="mdi mdi-pencil"></i>
                                </button>

                                {/* Delete button */}
                                <button
                                  type="button"
                                  onClick={() => deleteOrder2(item.ID)}
                                >
                                  <i className="mdi mdi-delete "></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
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
                      {t("add_consignee")}
                    </Link>
                  </div>
                </div>
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
                        <div className="form-group col-lg-4">
                          <h6>{t("name")}</h6>
                          <input
                            type="text"
                            name="client_name"
                            className="w-full"
                            value={state.client_name}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>{t("taxNumber")}</h6>
                          <input
                            type="text"
                            className="w-full"
                            name="client_tax_number"
                            value={state.client_tax_number}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-4">
                          <h6> {t("brand")}</h6>
                          <div className="ceateTransport autoComplete">
                            <Autocomplete
                              options={brands || []}
                              getOptionLabel={(option) => option.Name_EN || ""} // Label to display
                              onChange={(event, newValue) => {
                                handleChange({
                                  target: {
                                    name: "brand",
                                    value: newValue ? newValue.ID : "",
                                  },
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
                                  (item) => item.ID === (state.brand || "")
                                ) || null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.ID === value.ID
                              }
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <h6>{t("address")}</h6>
                          <div>
                            <input
                              name="client_address"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.client_address}
                            />
                          </div>
                          <div>
                            <input
                              name="client_address1"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.client_address1}
                            />
                          </div>
                          <div>
                            <input
                              name="client_address2"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.client_address2}
                            />
                          </div>
                          <div>
                            <input
                              name="client_address3"
                              className="border-2 rounded-md border-[#203764] w-full"
                              onChange={handleChange}
                              value={state.client_address3}
                            />
                          </div>
                        </div>
                        <div className="form-group col-lg-4">
                          <div>
                            <h6>{t("email")}</h6>
                            <input
                              type="email"
                              className="w-full"
                              value={state.client_email}
                              name="client_email"
                              onChange={handleChange}
                            />
                          </div>
                          <div>
                            <h6>{t("phoneNumber")}</h6>
                            <input
                              type="email"
                              className="w-full"
                              value={state.client_phone}
                              name="client_phone"
                              onChange={handleChange}
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
                      {from?.client_id ? t("update") : t("create")}
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
                                  onChange={handleChange5}
                                  name="name"
                                  className="form-control"
                                  placeholder="Name"
                                  defaultValue={state5.name}
                                />
                              </div>

                              <div className="col-lg-4 form-group">
                                <h6>{t("taxId")}</h6>
                                <input
                                  type="text"
                                  id="taxId"
                                  value={state5.taxId || ""}
                                  onChange={handleChange5}
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
                                      (vendor) => vendor.id === state5.Entity
                                    ) || null
                                  } // Match the current entity ID in state with the options
                                  onChange={(e, newValue) => {
                                    handleChange5({
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
                              <button
                                style={{ width: "170px" }}
                                className="btn btn-danger mb-4"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={handleAddClick}
                              >
                                {t("addContact")}
                              </button>
                            </div>
                            {/* add-contact-modal */}
                          </div>
                        </div>
                        <div className="col-lg-3 form-group">
                          <h6>{t("phone")}</h6>
                          <input
                            type="text"
                            id="phone"
                            value={state5.phone || ""}
                            onChange={handleChange5}
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
                            value={state5.email || ""}
                            onChange={handleChange5}
                            name="email"
                            className="form-control"
                            placeholder="Email"
                          />
                        </div>
                        <div className="col-lg-3 form-group autoComplete">
                          <h6>{t("messengerType")}</h6>
                          <div>
                            <Autocomplete
                              options={messengerOptions}
                              getOptionLabel={(option) => option.label} // what to display in dropdown
                              value={
                                messengerOptions.find(
                                  (opt) =>
                                    opt.value === Number(state5.Messenger_Type)
                                ) || null
                              }
                              onChange={(event, newValue) =>
                                setState5({
                                  ...state5,
                                  Messenger_Type: newValue
                                    ? newValue.value
                                    : "",
                                })
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
                              value={state5.messangerId || ""}
                              onChange={handleChange5}
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
                            value={state5.address1 || ""}
                            onChange={handleChange5}
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
                            value={state5.address2 || ""}
                            onChange={handleChange5}
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
                            value={state5.Bank_Name || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
                                Bank_Name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-lg-4 form-group">
                          <h6>{t("bankBranch")}</h6>
                          <input
                            type="text"
                            className="form-control"
                            value={state5.Bank_Branch || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
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
                            value={state5.Bank_Account || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
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
                            value={state5.Bank_IBAN || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
                                Bank_IBAN: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-lg-4 form-group">
                          <h6>{t("bankSwift")}</h6>
                          <input
                            type="text"
                            className="form-control"
                            value={state5.Bank_Swift || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
                                Bank_Swift: e.target.value,
                              })
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
                                  String(c.id) === String(state5.Bank_Country)
                              ) || null
                            }
                            onChange={(event, newValue) =>
                              setState5({
                                ...state5,
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
                            value={state5.Bank_Address || ""}
                            onChange={(e) =>
                              setState5({
                                ...state5,
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
                        {typeof state.vendor_id !== "undefined"
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
                            <td>{item.Name_First}</td>
                            <td>{item.Name_Last}</td>
                            <td>{item.Nick_name}</td>
                            <td>{item.Position}</td>
                            <td>{item.type}</td>
                            <td>{item.Email}</td>
                            <td>{item.Mobile}</td>
                            <td>
                              <div>
                                {/* edit popup */}
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(item.ID)}
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModal"
                                >
                                  <i className="mdi mdi-pencil"></i>
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
                                        >
                                          <i class="mdi mdi-close"></i>
                                        </button>
                                      </div>
                                      <div class="modal-body">
                                        <div className="formCreate">
                                          <form action="">
                                            <div className="row">
                                              {/* <div className="col-lg-12">
                                               <div class="form-group col-lg-3">
                                                 <h6>Client </h6>
                                                 <div class="ceateTransport">
                                                   <select
                                                     name="client_id"
                                                     onChange={handleChange1}
                                                     value={state1.client_id}
                                                   >
                                                     <option value="">
                                                       Select Client
                                                     </option>
                                                     {client?.map((item) => (
                                                       <option
                                                         key={item.client_id}
                                                         value={item.client_id}
                                                       >
                                                         {item.client_name}
                                                       </option>
                                                     ))}
                                                   </select>
                                                 </div>
                                               </div>
                                             </div> */}
                                              <div class="form-group col-lg-3">
                                                <h6>{t("contactType")}</h6>
                                                <div class="ceateTransport autoComplete">
                                                  <Autocomplete
                                                    disablePortal
                                                    options={contactType || []} // Use your contactType array as options
                                                    getOptionLabel={(option) =>
                                                      option.type_en || ""
                                                    }
                                                    onChange={(e, newValue) =>
                                                      setState1(
                                                        (prevState) => ({
                                                          ...prevState,
                                                          contact_type_id:
                                                            newValue?.contact_type_id ||
                                                            "",
                                                        })
                                                      )
                                                    }
                                                    value={
                                                      (contactType || []).find(
                                                        (item) =>
                                                          item.contact_type_id ===
                                                          state1.contact_type_id
                                                      ) || null
                                                    }
                                                    sx={{ width: 300 }} // Customize the width as needed
                                                    renderInput={(params) => (
                                                      <TextField
                                                        {...params}
                                                        placeholder={t(
                                                          "selectType"
                                                        )}
                                                        InputLabelProps={{
                                                          shrink: false,
                                                        }} // Prevents floating label
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
                                                <h6>{t("position")}</h6>
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
                                  onClick={() => deleteOrder3(item.ID)}
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
                    <button
                      style={{ width: "170px" }}
                      className="btn btn-danger mb-4"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={handleAddClick}
                    >
                      {t("addContact")}
                    </button>
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
                  <div className="py-3">
                    <div className="row newSmallCard ">
                      <div className="flex flex-wrap">
                        {/* <div className="selectProduce me-3">
             <h6 className="mb-2"> Select Produce</h6>
             <Autocomplete
               disablePortal
               options={data}
         value={data.find((item) => item.produce_id === selectedProduceId) || null}
 
               getOptionLabel={(option) => option.produce_name_en || ""}
               sx={{ width: 300 }}
               onChange={(event, value) => {
                 setSelectedProduceId(value ? value.produce_id : null);
                 // setProduceImages(value ? value.images : null); // Update images state
               }}
               renderInput={(params) => (
                 <TextField {...params} placeholder="Select Produce" />
               )}
             />
           </div> */}
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
                          <h6 style={{ color: "#fff" }}>
                            {t("comparisonPeriod")}
                          </h6>
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
                                {consigeeDetails?.Total_shipments}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalShipments")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(
                                  consigeeDetails?.Total_invoiced_value
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +55%{" "}
                              </span>
                              {t("thanLastWeek")}
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
                                {consigeeDetails?.Total_Claims}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalClaims")}
                              </p>
                              <h4 className="mb-0">
                                {" "}
                                {formatter.format(
                                  consigeeDetails?.Total_Claims_value
                                )}{" "}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%{" "}
                              </span>
                              {t("thanYesterday")}
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
                                {formatter.format(
                                  consigeeDetails?.Average_Payment
                                    ? consigeeDetails?.Average_Payment
                                    : 0
                                )}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalPayment")}
                              </p>
                              <h4 className="mb-0">
                                {" "}
                                {formatter.format(
                                  consigeeDetails?.Total_payments_value
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                -2%
                              </span>{" "}
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6 mb20">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              <i className=" material-icons  mdi mdi-credit-card-outline" />
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("pendingPayment")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(consigeeDetails?.Balance)}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%{" "}
                              </span>
                              {t("thanYesterday")}
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
                                {formatter.format(consigeeDetails?.Total_NW)}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%
                              </span>{" "}
                              {t("thanYesterday")}{" "}
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
                                {formatter.format(consigeeDetails?.Total_GW)}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%
                              </span>{" "}
                              {t("thanYesterday")}
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
                                {formatter.format(consigeeDetails?.Total_Box)}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%
                              </span>{" "}
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
             <div className="card  ">
               <div className="card-header p-3 pt-2">
                 <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                   <i className=" material-icons  mdi mdi-calendar-range" />
                 </div>
                 <div className="text-end pt-1">
                   <p className="text-sm mb-0 text-capitalize">
                     Date of First Shipment
                   </p>
                   <h4 className="mb-0" />
                   {consigeeDetails?.First_Shipment}
                 </div>
               </div>
               <hr className="dark horizontal my-0" />
               <div className="card-footer p-3">
                 <p className="mb-0">
                   <span className="text-success text-sm font-weight-bolder">
                     +55%{" "}
                   </span>
                   than lask week
                 </p>
               </div>
             </div>
           </div> */}
                      {/* <div className="col-xl-3 col-sm-6 mb-xl-0 mb- mb20">
             <div className="card">
               <div className="card-header p-3 pt-2">
                 <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                   <i className=" material-icons mdi mdi-calendar-range" />
                 </div>
                 <div className="text-end pt-1">
                   <p className="text-sm mb-0 text-capitalize">
                     Date of Last Shipment
                   </p>
                   <h4 className="mb-0" /> {consigeeDetails?.Last_Shipment}
                 </div>
               </div>
               <hr className="dark horizontal my-0" />
               <div className="card-footer p-3">
                 <p className="mb-0">
                   <span className="text-success text-sm font-weight-bolder">
                     +3% 
                   </span>
                   than lask month
                 </p>
               </div>
             </div>
           </div> */}
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
                                <p> {consigeeDetails?.First_Shipment} </p>
                              </div>
                              <div className="parentFirstShip">
                                <p>{t("dateOfLastShipment")}</p>
                                <p>{consigeeDetails?.Last_Shipment}</p>
                              </div>
                              <div className="parentFirstShip">
                                <p>{t("shipmentsInPipeLine")}</p>
                                <p>
                                  {formatter.format(consigeeDetails?.Pipe_Line)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          {/* <div className="card-footer ps-3 pe-3 pt-1 pb-1">
                 <p className="mb-0">
                   <span className="text-success text-sm font-weight-bolder">
                     -2%
                   </span>
                   than yesterday
                 </p>
               </div> */}
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
                              options={value}
                              value={
                                value.find(
                                  (item) =>
                                    item.produce_id === selectedInvoiceId
                                ) || null
                              }
                              getOptionLabel={(option) =>
                                option.produce_name_en || ""
                              }
                              sx={{ width: 200 }}
                              onChange={(event, value) => {
                                setSelectedInvoiceId(
                                  value ? value.produce_id : null
                                );
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
                              <tr>
                                <td>Dragon Fruit Red-Kg x 15</td>
                                <td>1,320.00</td>
                                <td>1,320.00</td>
                                <td>1,320.00</td>
                                <td>1,320.00</td>
                              </tr>
                              <tr>
                                <td>Chilli Red-100g x 60</td>
                                <td>840.00</td>
                                <td>840.00</td>
                                <td>840.00</td>
                                <td>840.00</td>
                              </tr>
                            </tbody>
                            {/* {orderItem?.map((item) => {
                 return (
                   <tr key={item?.id}>
                    
                     <td>{item?.itf_name}</td>
                     <td>{item?.Total_Kg}</td>
                     <td>{item?.Total_Kg}</td>
                     <td>{item?.Total_Kg}</td>
                   </tr>
                   
                 );
               })} */}
                          </table>
                        </div>
                      </div>
                      <div className="col-lg-6 mb20 ">
                        <div className="chartConsignee">
                          <ChartConsi />
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
                {/* customization */}
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
                                {/* customixation modal */}
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
                                                      placeholder={t(
                                                        "selectItf"
                                                      )}
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
                                              <div>
                                                <input
                                                  type="text"
                                                  name="Custom_Name"
                                                  onChange={handleChange2}
                                                  value={
                                                    dataCustomization.Custom_Name
                                                  }
                                                  placeholder={t("customName")}
                                                  className="mb-2"
                                                />
                                              </div>
                                            </div>
                                            <div class="form-group col-lg-12">
                                              <h6>{t("agreedPrice")}</h6>
                                              <div>
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
                                              <h6>{t("brand")}</h6>
                                              <div className="ceateTransport autoComplete">
                                                <Autocomplete
                                                  options={brands || []} // List of brand options
                                                  getOptionLabel={(option) =>
                                                    option.Name_EN || ""
                                                  } // Label to display
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
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
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
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
                                                <h6>{t("barcode")}</h6>
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
                                          // onClick={customizationDataSubmit}
                                          className="btn mb-0 btn-primary"
                                        >
                                          {t("update")}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* customization modal end */}
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

                  {/* customization modal end */}
                </div>
                {/* notify Section */}
                <div
                  class="tab-pane fade"
                  id="notifyNew-pane"
                  role="tabpanel"
                  aria-labelledby="notifyNew-tab"
                  tabindex="0"
                >
                  <div className="row formCreate my-3">
                    <div className="form-group col-lg-6">
                      <h6>{t("name")}</h6>
                      <input
                        type="text"
                        id="name_en"
                        className="form-control"
                        placeholder={t("name")}
                        value={state.notify_name}
                        name="notify_name"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>{t("taxNumber")}</h6>
                      <input
                        type="number"
                        id="name_en"
                        className="form-control"
                        placeholder={t("taxNumber")}
                        value={state.notify_tax_number}
                        name="notify_tax_number"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6> {t("email")}</h6>
                      <input
                        onChange={handleChange}
                        type="email"
                        id="hs_name"
                        className="form-control"
                        placeholder={t("email")}
                        value={state.notify_email}
                        name="notify_email"
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>{t("phoneNumber")}</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={t("phoneNumber")}
                        value={state.notify_phone}
                        name="notify_phone"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group col-lg-12">
                      <h6>{t("address")}</h6>
                      <textarea
                        className="col-lg-12 rounded h-20 w-full"
                        style={{ border: "2px solid #245486" }}
                        value={state.notify_address}
                        name="notify_address"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* accounting */}
                <div
                  class="tab-pane fade"
                  id="contact-tab-pane"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                  tabindex="0"
                >
                  <div className="card-footer text-center d-flex justify-content-center flex-wrap">
                    {/* Button trigger modal */}
                    <button
                      type="button"
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#modalState"
                    >
                      {t("statement")}
                    </button>
                    {/* Modal */}
                    <div
                      className="modal fade "
                      id="modalState"
                      tabIndex={-1}
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modalShipTo">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1
                              className="modal-title fs-5"
                              id="exampleModalLabel"
                            >
                              {t("statement")}
                            </h1>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                              onClick={dataClear2}
                            >
                              <i className="mdi mdi-close"></i>
                            </button>
                          </div>
                          <div className="modal-body">
                            <label htmlFor="fromDate">{t("fromDate")}</label>
                            <input
                              type="date"
                              className="form-control"
                              id="fromDate"
                              value={fromDate}
                              onChange={(e) => setFromDate(e.target.value)}
                            />
                            <label className="mt-2" htmlFor="toDate">
                              {t("toDate")}
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              id="toDate"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleSubmit}
                            >
                              {t("submit")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="paymentSec">
                     <button
                       type="button"
                       className="btn btn-danger"
                       data-bs-toggle="modal"
                       data-bs-target="#modalPayment"
                     >
                       Payment
                     </button>
                     <div
                       className="modal fade"
                       id="modalPayment"
                       tabIndex={-1}
                       aria-labelledby="exampleModalLabel"
                       aria-hidden="true"
                     >
                       <div className="modal-dialog modalShipTo modal-xl">
                         <div className="modal-content">
                           <div className="modal-header">
                             <h1
                               className="modal-title fs-5"
                               id="exampleModalLabel"
                             >
                               Payment
                             </h1>
                             <button
                               type="button"
                               className="btn-close"
                               data-bs-dismiss="modal"
                               aria-label="Close"
                             >
                               <i className="mdi mdi-close"></i>
                             </button>
                           </div>
                           <div className="modal-body">
                             <form onSubmit={handleSubmit1}>
                               <div className="row">
                                 <div className="col-lg-4">
                                   <div className="parentFormPayment">
                                     <p>Client </p>
                                     <select
                                       value={clientId}
                                       onChange={(e) =>
                                         setClientId(e.target.value)
                                       }
                                     >
                                       <option value="0">
                                         select client Id
                                       </option>
                                       <option value="1">
                                         select client Id
                                       </option>
                                       <option value="2">
                                         select client Id
                                       </option>
                                     </select>
                                   </div>
                                 </div>
                                 <div className="col-lg-4">
                                   <div className="parentFormPayment">
                                     <p>Consignee Id</p>
                                     <select
                                       value={consigneeId}
                                       onChange={(e) =>
                                         setConsigneeId(e.target.value)
                                       }
                                     >
                                       <option value="0">
                                         select Consignee Id
                                       </option>
                                       <option value="1">option 1</option>
                                       <option value="2">option 2</option>
                                     </select>
                                   </div>
                                 </div>
                                 <div className="col-lg-4">
                                   <div className="parentFormPayment">
                                     <p>Payment Date</p>
                                     <input
                                       type="date"
                                       value={paymentDate}
                                       onChange={(e) =>
                                         setPaymentDate(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Client Payment Ref</p>
                                     <input
                                       type="text"
                                       value={clientPaymentRef}
                                       onChange={(e) =>
                                         setClientPaymentRef(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Payment Channel</p>
                                     <input
                                       type="text"
                                       value={paymentChannel}
                                       onChange={(e) =>
                                         setPaymentChannel(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Bank Ref</p>
                                     <input
                                       type="text"
                                       value={bankRef}
                                       onChange={(e) =>
                                         setBankRef(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p>FX Payment</p>
                                     <input
                                       type="text"
                                       value={fxPayment}
                                       onChange={(e) =>
                                         setFxPayment(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p>FX Rate</p>
                                     <input
                                       type="text"
                                       value={fxRate}
                                       onChange={(e) =>
                                         setFxRate(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-4 mt-3">
                                   <div className="parentFormPayment">
                                     <p> FX Id</p>
                                     <select
                                       value={fxId}
                                       onChange={(e) => setFxId(e.target.value)}
                                     >
                                       <option value="0">234</option>
                                       <option value="1">4534</option>
                                       <option value="2">#435</option>
                                     </select>
                                   </div>
                                 </div>
                                 <div className="col-lg-6 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Intermittent Bank Charges</p>
                                     <input
                                       type="text"
                                       value={intermittentBankCharges}
                                       onChange={(e) =>
                                         setIntermittentBankCharges(
                                           e.target.value
                                         )
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-6 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Local Bank Charges</p>
                                     <input
                                       type="text"
                                       value={localBankCharges}
                                       onChange={(e) =>
                                         setLocalBankCharges(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-6 mt-3">
                                   <div className="parentFormPayment">
                                     <p>THB Received</p>
                                     <input
                                       type="text"
                                       value={thbReceived}
                                       onChange={(e) =>
                                         setThbReceived(e.target.value)
                                       }
                                     />
                                   </div>
                                 </div>
                                 <div className="col-lg-6 mt-3">
                                   <div className="parentFormPayment">
                                     <p>Loss/Gain on Exchange Rate</p>
                                     <input
                                       type="text"
                                       value={lossGainOnExchangeRate}
                                       onChange={(e) =>
                                         setLossGainOnExchangeRate(
                                           e.target.value
                                         )
                                       }
                                     />
                                   </div>
                                 </div>
                               </div>
                             </form>
 
                             <div className="row mt-4">
                               <div className="tableCreateClient tablepayment">
                                 <table>
                                   <tr>
                                     <th>Check</th>
                                     <th>Document Number</th>
                                     <th>Ship Date</th>
                                     <th>AWB Number</th>
                                     <th>Net Amount</th>
                                     <th>Amount To Pay</th>
                                     <th>Paid Amount</th>
                                   </tr>
                                   <tbody>
                                     <tr>
                                       <td>
                                         <input type="checkbox" />
                                       </td>
                                       <td>
                                         <input
                                           type="text"
                                           value={documentNumber}
                                           onChange={(e) =>
                                             setDocumentNumber(e.target.value)
                                           }
                                         />
                                       </td>
                                       <td>
                                         <input
                                           type="date"
                                           value={shipDate}
                                           onChange={(e) =>
                                             setShipDate(e.target.value)
                                           }
                                         />
                                       </td>
                                       <td>
                                         <input
                                           type="text"
                                           value={awbNumber}
                                           onChange={(e) =>
                                             setAwbNumber(e.target.value)
                                           }
                                         />
                                       </td>
                                       <td>
                                         <input
                                           type="text"
                                           value={netAmount}
                                           onChange={(e) =>
                                             setNetAmount(e.target.value)
                                           }
                                         />
                                       </td>
                                       <td>
                                         <input
                                           type="text"
                                           value={amountToPay}
                                           onChange={(e) =>
                                             setAmountToPay(e.target.value)
                                           }
                                         />
                                       </td>
                                       <td>
                                         <input
                                           type="text"
                                           value={paidAmount}
                                           onChange={(e) =>
                                             setPaidAmount(e.target.value)
                                           }
                                         />
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                               </div>
                             </div>
                             <div className="modal-footer">
                               <button type="button" className="btn btn-primary">
                                 Submit
                               </button>
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div> */}
                    <div className="paymentSec">
                      <>
                        {/* Button trigger modal */}
                        <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#modalPayment"
                        >
                          {t("payment")}
                        </button>
                        {/* Modal */}
                        <div
                          className="modal fade "
                          id="modalPayment"
                          tabIndex={-1}
                          aria-labelledby="exampleModalLabel"
                          aria-hidden="true"
                        >
                          <div className="modal-dialog modalShipTo  modal-xl">
                            <div className="modal-content">
                              <div class="modal-header">
                                <h1
                                  class="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  {t("payment")}
                                </h1>
                                <button
                                  type="button"
                                  class="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                  onClick={closeData}
                                >
                                  <i class="mdi mdi-close"></i>
                                </button>
                              </div>
                              <div className="modal-body">
                                <div className="row">
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment autoComplete">
                                      <p>{t("client")}</p>
                                      <Autocomplete
                                        options={clients || []}
                                        getOptionLabel={(option) =>
                                          option.client_name || ""
                                        }
                                        onChange={(event, newValue) =>
                                          setClientId(
                                            newValue ? newValue.client_id : ""
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder={t("selectClient")} // Use placeholder instead of label
                                            variant="outlined"
                                          />
                                        )}
                                        value={
                                          Array.isArray(clients)
                                            ? clients.find(
                                                (item) =>
                                                  item.client_id === clientId
                                              ) || null
                                            : null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          option.client_id === value.client_id
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment autoComplete">
                                      <p>{t("consignee")}</p>
                                      <Autocomplete
                                        options={consignees || []}
                                        getOptionLabel={(option) =>
                                          option.consignee_name || ""
                                        }
                                        onChange={(event, newValue) =>
                                          setConsigneeId(
                                            newValue
                                              ? newValue.consignee_id
                                              : ""
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder={t("selectConsignee")}
                                            variant="outlined"
                                          />
                                        )}
                                        value={
                                          consignees.find(
                                            (item) =>
                                              item.consignee_id === consigneeId
                                          ) || null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          option.consignee_id ===
                                          value.consignee_id
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("paymentDate")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="date"
                                          value={paymentDate}
                                          onChange={(e) =>
                                            setPaymentDate(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("clientPaymentRef")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={clientPaymentRef}
                                          onChange={(e) =>
                                            setClientPaymentRef(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    {/* <div className="parentFormPayment">
                                     <div>
                                       <p>Payment Channel</p>
                                     </div>
                                     <div>
                                       <input
                                         type="text"
                                         value={paymentChannel}
                                         onChange={(e) =>
                                           setPaymentChannel(e.target.value)
                                         }
                                       />
                                     </div>
                                   </div> */}
                                    <div className="parentFormPayment autoComplete">
                                      <p>{t("paymentChannel")}</p>
                                      <Autocomplete
                                        options={paymentChannle || []}
                                        getOptionLabel={(option) =>
                                          option.bank_name || ""
                                        }
                                        onChange={(event, newValue) =>
                                          setPaymentChannel(
                                            newValue ? newValue.bank_id : ""
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder={t(
                                              "selectPaymentChannel"
                                            )}
                                            variant="outlined"
                                          />
                                        )}
                                        value={
                                          Array.isArray(paymentChannle)
                                            ? paymentChannle.find(
                                                (item) =>
                                                  item.bank_id ===
                                                  paymentChannel
                                              ) || null
                                            : null
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                          option.bank_id === value.bank_id
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("bankRef")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={bankRef}
                                          onChange={(e) =>
                                            setBankRef(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("fxPayment")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={fxPayment}
                                          onChange={(e) =>
                                            setFxPayment(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment autoComplete">
                                      <p>{t("fx")}</p>
                                      <div>
                                        <Autocomplete
                                          options={currency || []}
                                          getOptionLabel={(option) =>
                                            option.currency || ""
                                          }
                                          onChange={(event, newValue) =>
                                            handleCurrencyChange({
                                              target: {
                                                value: newValue
                                                  ? newValue.currency_id
                                                  : "",
                                              },
                                            })
                                          }
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              placeholder={t("selectFx")}
                                              variant="outlined"
                                            />
                                          )}
                                          value={
                                            currency?.find(
                                              (item) =>
                                                item.currency_id === fxId
                                            ) || null
                                          }
                                          isOptionEqualToValue={(
                                            option,
                                            value
                                          ) =>
                                            option.currency_id ===
                                            value.currency_id
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-4 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("fxRate")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={fxRate}
                                          onChange={(e) =>
                                            setFxRate(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("interBankCharges")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={intermittentBankCharges}
                                          onChange={(e) =>
                                            setIntermittentBankCharges(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("localBankCharges")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={localBankCharges}
                                          onChange={(e) =>
                                            setLocalBankCharges(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        <p>{t("thbReceived")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={thbReceived}
                                          onChange={(e) =>
                                            setThbReceived(e.target.value)
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 mt-3">
                                    <div className="parentFormPayment">
                                      <div>
                                        {/* <p>Loss/Gain on Exchange Rate</p> */}
                                        <p>{t("lossGainExchange")}</p>
                                      </div>
                                      <div>
                                        <input
                                          type="text"
                                          value={lossGainOnExchangeRate}
                                          onChange={(e) =>
                                            setLossGainOnExchangeRate(
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="row mt-4">
                                  <div className="tableCreateClient tablepayment">
                                    <table>
                                      <tr>
                                        <th>{t("check")}</th>
                                        <th>{t("documentNumber")}</th>
                                        <th>{t("shipDate")}</th>
                                        <th>{t("awbNumber")}</th>
                                        <th>{t("netAmount")}</th>
                                        <th>{t("amountToPay")}</th>
                                        <th>{t("paidAmount")}</th>
                                      </tr>
                                      {paymentTable1?.map((item) => {
                                        return (
                                          <>
                                            <tr>
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  checked={
                                                    !!checkedItems[
                                                      item.transaction_ref
                                                    ]
                                                  }
                                                  onChange={(e) =>
                                                    handleCheckboxChange(
                                                      item.transaction_ref,
                                                      e.target.checked
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td> {item.transaction_ref}</td>
                                              <td>{formatDate(item.date)}</td>
                                              <td>{item.bl}</td>
                                              <td> {item.invoice_amount}</td>
                                              <td>{item.amount_to_pay}</td>
                                              <td>
                                                <input
                                                  type="number"
                                                  value={
                                                    paidAmounts[
                                                      item.transaction_ref
                                                    ] || ""
                                                  }
                                                  onChange={(e) =>
                                                    handlePaidAmountChange(
                                                      item.transaction_ref,
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  onClick={handleSubmit1}
                                  className="btn btn-primary"
                                >
                                  {t("submit")}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn btn-danger"
                        data-bs-toggle="modal"
                        data-bs-target="#modalClaim"
                      >
                        {t("claimList")}
                      </button>

                      <div
                        className="modal fade"
                        id="modalClaim"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modalShipTo modal-xl">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                {t("claim")}
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                <i className="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div className="claimParent">
                                <div>
                                  <strong>{t("invoiceNumber")} : </strong>
                                  <span>INV-202407019</span>
                                </div>
                                <div>
                                  <strong>{t("client")} :</strong>
                                  <span>Finley DWC-LLC</span>
                                </div>
                                <div>
                                  <strong>{t("shipTo")} :</strong>
                                  <span> Cape Fresh Industries LLC</span>
                                </div>
                                <div>
                                  <strong>{t("currency")} : </strong>{" "}
                                  <span>USD</span>
                                </div>
                                <div>
                                  <strong>{t("itemsInfo")} : </strong>{" "}
                                  <span>USD</span>
                                </div>
                                <div>
                                  <strong>{t("claimDate")}</strong>
                                  <input type="date" />{" "}
                                </div>
                              </div>
                              <div className="tableClaim">
                                <table>
                                  <tr>
                                    <th className="text-start">{t("itf")}</th>
                                    <th>{t("brandName")}</th>
                                    <th>{t("quantity")}</th>
                                    <th>{t("unit")}</th>
                                    <th>{t("numberBox")}</th>
                                    <th>{t("claimQuantity")}</th>
                                    <th>{t("unit")}</th>
                                    <th>{t("amount")}</th>
                                  </tr>
                                  <tr>
                                    <td className="text-start">
                                      {" "}
                                      Papaya Holland - Kg x 3 (Frutulip)
                                    </td>
                                    <td>None</td>
                                    <td>16.00</td>
                                    <td>KG</td>
                                    <td>32.000</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-start">
                                      Lemongrass - 500g (38cm) x 20 (F) 1,600.00
                                    </td>
                                    <td>None</td>
                                    <td>16.00</td>
                                    <td>KG</td>
                                    <td>32.000</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="text-start">
                                      Lemongrass - 500g (38cm) x 20 (F) 1,600.00
                                    </td>
                                    <td>None</td>
                                    <td>16.00</td>
                                    <td>KG</td>
                                    <td>32.000</td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                    <td>
                                      <input type="number" />
                                    </td>
                                  </tr>
                                </table>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-primary"
                                // onClick={handleSubmit}
                              >
                                {t("submit")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="statisticsContent">
                    <div className="row dashCard53 consigneeCard">
                      <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card  ">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              {/* <i className=" material-icons  mdi mdi-package" /> */}
                              <div
                                style={{
                                  fontSize: "25px",
                                  color: "#d2d7e0",
                                  paddingTop: "13px",
                                }}
                              >
                                {consigneeData?.Total_shipments}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalPayment")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(
                                  consigneeData?.Total_invoiced_value
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +55%
                              </span>{" "}
                              {t("totalShipments")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              {/* <i className=" material-icons mdi mdi-weight-gram" /> */}
                              <div
                                style={{
                                  fontSize: "25px",
                                  color: "#d2d7e0",
                                  paddingTop: "13px",
                                }}
                              >
                                {consigneeData?.Total_Claims}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalClaims")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(
                                  consigneeData?.Total_Claims_value
                                )}{" "}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%
                              </span>{" "}
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              {/* <i className=" material-icons mdi mdi-cash" /> */}
                              <div
                                style={{
                                  fontSize: "25px",
                                  color: "#d2d7e0",
                                  paddingTop: "13px",
                                }}
                              >
                                {parseInt(consigneeData?.Average_Payment)}{" "}
                              </div>
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("totalPayment")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(
                                  consigneeData?.Total_payments_value
                                )}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                -2%
                              </span>{" "}
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              <i className=" material-icons  mdi mdi-credit-card-outline" />
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {t("pendingPayment")}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(consigneeData?.Balance)}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%
                              </span>{" "}
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              <i className=" material-icons mdi mdi-invoice" />
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {/* Total Invoices */}
                              </p>
                              <h4 className="mb-0">
                                {/* {" "}
                               {formatter.format(
                                 consigneeData?.Total_invoiced_value
                               )} */}
                                0
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +3%{" "}
                              </span>

                              {t("thanLastMonth")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {/* Total Profits */}
                              </p>
                              <h4 className="mb-0">0</h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%{" "}
                              </span>
                              {t("thanYesterday")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-3 col-sm-6">
                        <div className="card">
                          <div className="card-header p-3 pt-2">
                            <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                              <i className=" material-icons mdi mdi-air-humidifier" />
                            </div>
                            <div className="text-end pt-1">
                              <p className="text-sm mb-0 text-capitalize">
                                {/* average Time of Payment{" "} */}
                              </p>
                              <h4 className="mb-0">
                                {formatter.format(
                                  consigneeData?.Average_Payment
                                )}{" "}
                              </h4>
                            </div>
                          </div>
                          <hr className="dark horizontal my-0" />
                          <div className="card-footer p-3">
                            <p className="mb-0">
                              <span className="text-success text-sm font-weight-bolder">
                                +5%{" "}
                              </span>
                              {t("thanYesterday")}
                            </p>
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

                {/* accounting end */}
              </div>
            </div>
          </div>
        </div>
      </Card>
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
            {/* <div className="modal-body">
              <div className="formCreate">
                <div className="row">
                  <div className="form-group col-lg-12 mb-3">
                    <h6>{t("itfName")}</h6>
                    <div className="ceateTransport autoComplete">
                      <Autocomplete
                        options={getItf || []}
                        getOptionLabel={(option) =>
                          option.ITF_Internal_Name_EN || ""
                        }
                        onChange={(event, newValue) => {
                          setDataCustomization((prevState) => ({
                            ...prevState,
                            ITF: newValue ? newValue.ID : "",
                          }));
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
                            (item) => item.ID === dataCustomization.ITF
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        }
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
                        getOptionLabel={(option) => option.Name_EN || ""} // Label to display
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
                            (item) => item.ID === dataCustomization.brand
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
                        getOptionLabel={(option) => option.Name_EN || ""} // Label to display (itf_name_en for each ITF)
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
                            (item) => item.ID === dataCustomization.Unit
                          ) || null
                        } // Set selected value based on ITF
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        } // Option comparison by itf_id
                      />
                    </div>
                    <div class="form-group col-lg-12 mt-2">
                      <h6>{t("barcode")}</h6>
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
            </div> */}
            <div className="modal-body">
              <div className="formCreate mt-0">
                <div className="row">
                  <div className="form-group col-lg-12">
                    <h6>{t("itfName")}</h6>
                    <div className="ceateTransport autoComplete">
                      <Autocomplete
                        options={getItf || []}
                        getOptionLabel={(option) =>
                          option.ITF_Internal_Name_EN || ""
                        }
                        onChange={(event, newValue) => {
                          setDataCustomization((prevState) => ({
                            ...prevState,
                            ITF: newValue ? newValue.ID : "",
                          }));
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
                            (item) => item.ID === dataCustomization.ITF
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group col-lg-12 ">
                    <h6>{t("unit")}</h6>
                    <div className="ceateTransport autoComplete">
                      <Autocomplete
                        options={unitDropdown || []} // List of ITFs
                        getOptionLabel={(option) => option.Name_EN || ""} // Label to display (itf_name_en for each ITF)
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
                            (item) => item.ID === dataCustomization.Unit
                          ) || null
                        } // Set selected value based on ITF
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        } // Option comparison by itf_id
                      />
                    </div>
                  </div>
                  <div className="form-group col-lg-12 ">
                    <h6>{t("brand")}</h6>
                    <div className="ceateTransport autoComplete">
                      <Autocomplete
                        options={brands || []} // List of brand options
                        getOptionLabel={(option) => option.Name_EN || ""} // Label to display
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
                            (item) => item.ID === dataCustomization.brand
                          ) || null
                        } // Set value based on selected brand_id
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        } // Option comparison
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
                      />
                    </div>
                  </div>
                  <div class="form-group col-lg-12">
                    <h6>{t("customCode")}</h6>
                    <div className=" ">
                      <input
                        type="text"
                        name="Custom_Name"
                        onChange={handleChange2}
                        value={dataCustomization.Custom_Name}
                        placeholder={t("customCode")}
                      />
                    </div>
                  </div>
                  <div class="form-group col-lg-12">
                    <h6>{t("customMargin")}</h6>
                    <div className=" ">
                      <input
                        type="text"
                        name="Custom_Name"
                        onChange={handleChange2}
                        value={dataCustomization.Custom_Name}
                        placeholder={t("customMargin")}
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

                  <div class="form-group col-lg-12">
                    <h6>{t("dummyPrice")}</h6>
                    <div className=" ">
                      <input
                        type="text"
                        name="Barcode"
                        onChange={handleChange2}
                        value={dataCustomization.Barcode}
                        placeholder={t("dummyPrice")}
                      />
                    </div>
                  </div>
                  <div class="form-group col-lg-12">
                    <h6>{t("barcode")}</h6>
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
            <div className="modal-footer">
              <button
                type="button "
                onClick={submitCusomizationData}
                className="btn mb-0 btn-primary"
              >
                {t("add")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal */}
      <div
        class="modal fade"
        id="exampleModalContact"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modalShipTo modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                {t("add_consignee")}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={clearAllFields}
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div class="modal-body">
              <div className="formCreate createPackage">
                <form>
                  <div className="row justify-content-center">
                    <div className="col-lg-4 form-group autoComplete">
                      <h6>{t("selectConsignee")}</h6>

                      <Autocomplete
                        options={getVcConsigneeList || []}
                        getOptionLabel={(option) => option.Name || ""}
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "consigneeType",
                              value: newValue ? newValue.ID : "", // ✅ use capital ID
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectConsignee")}
                            variant="outlined"
                          />
                        )}
                        value={
                          (getVcConsigneeList || []).find(
                            (item) => item.ID === state6.consigneeType // ✅ use capital ID
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        } // ✅ use capital ID
                      />
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>{t("Consignee Code")}</h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="consigneeCode"
                            placeholder={t("Consignee Code")}
                            value={state6.consigneeCode}
                            onChange={handleChange6}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group autoComplete">
                      <h6>{t("brand")}</h6>
                      <Autocomplete
                        options={brands || []} // API data array
                        getOptionLabel={(option) => option.Name_EN || ""} // Display English name
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "brand",
                              value: newValue ? newValue.ID : "", // Store selected brand ID
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Brand"
                            variant="outlined"
                          />
                        )}
                        value={
                          brands?.find((item) => item.ID === state6.brand) ||
                          null
                        } // Match by ID
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        } // Comparison by ID
                      />
                    </div>

                    <div className="col-lg-3 form-group autoComplete">
                      <h6>Port of origin</h6>

                      <Autocomplete
                        options={port || []} // List of port options
                        getOptionLabel={(option) => option.port_name || ""} // Label to display
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "port_of_orign",
                              value: newValue ? newValue.port_id : "",
                            }, // Update selected port_id
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Airport"
                            variant="outlined"
                          />
                        )}
                        value={
                          port?.find(
                            (item) => item.port_id === state6.port_of_orign
                          ) || null
                        } // Set value based on selected port_id
                        isOptionEqualToValue={(option, value) =>
                          option.port_id === value.port_id
                        } // Option comparison
                      />
                    </div>
                    <div className="col-lg-3 form-group autoComplete">
                      <h6>Port of Destination</h6>

                      <Autocomplete
                        options={port || []} // List of port options
                        getOptionLabel={(option) => option.port_name || ""} // Label to display
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "destination_port",
                              value: newValue ? newValue.port_id : "",
                            }, // Update selected port_id
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Airport"
                            variant="outlined"
                          />
                        )}
                        value={
                          port?.find(
                            (item) => item.port_id === state6.destination_port
                          ) || null
                        } // Set value based on selected port_id
                        isOptionEqualToValue={(option, value) =>
                          option.port_id === value.port_id
                        } // Option comparison
                      />
                    </div>

                    <div className="col-lg-3 form-group autoComplete">
                      <h6>Liner</h6>

                      <Autocomplete
                        options={liner || []} // List of airline options
                        getOptionLabel={(option) => option.liner_name || ""} // Label to display
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "liner_Drop",
                              value: newValue ? newValue.liner_id : "",
                            }, // Update selected liner_id
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Liner"
                            variant="outlined"
                          />
                        )}
                        value={
                          liner?.find(
                            (item) => item.liner_id === state6.liner_Drop
                          ) || null
                        } // Set value based on selected liner_id
                        isOptionEqualToValue={(option, value) =>
                          option.liner_id === value.liner_id
                        } // Option comparison
                      />
                    </div>

                    <div className="col-lg-3 form-group autoComplete">
                      <h6>Location</h6>

                      <Autocomplete
                        options={locations || []} // List of location options
                        getOptionLabel={(option) => option.name || ""} // Label to display
                        onChange={(event, newValue) => {
                          handleChange6({
                            target: {
                              name: "Default_location",
                              value: newValue ? newValue.id : "",
                            }, // Update selected location id
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Location"
                            variant="outlined"
                          />
                        )}
                        value={
                          locations?.find(
                            (item) => item.id === state6.Default_location
                          ) || null
                        } // Set value based on selected location id
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Option comparison
                      />
                    </div>

                    <div className="col-lg-6 form-group autoComplete">
                      <h6>{t("invoiceCurrency")}</h6>
                      <Autocomplete
                        options={currency || []} // List of currencies
                        getOptionLabel={(option) => option.FX || ""} // Label to display (currency name for each item)
                        onChange={(event, newValue) => {
                          handleChange6({
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
                            (item) => item.ID === state6.invoiceCurrency
                          ) || null
                        } // Set selected value based on invoiceCurrency
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        }
                      />
                    </div>
                    <div className="col-lg-6 form-group autoComplete">
                      <h6>{t("invoiceUnit")}</h6>

                      <Autocomplete
                        options={unitDropdown || []}
                        getOptionLabel={(option) => option.Name_EN || ""} // Use Name_EN from API
                        onChange={(event, newValue) => {
                          handleChange6({
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
                            (item) => item.ID === state6.Invoice_Unit
                          ) || null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value.ID
                        }
                      />
                    </div>

                    <div className="col-lg-4 form-group autoComplete">
                      <h6>{t("commission")}</h6>

                      <Autocomplete
                        options={commission || []}
                        getOptionLabel={(option) =>
                          option.commission_name_en || ""
                        }
                        onChange={(event, newValue) => {
                          handleChange6({
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
                            (item) => item.id === state6.commissionType
                          ) || null
                        } // Set selected value based on commissionType
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Option comparison by id
                      />
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>{t("commissionValue")}</h6>
                      <div className="parentthb packParent">
                        <div className="childThb">
                          <input
                            type="text"
                            name="commissionValue"
                            placeholder={t("commissionValue")}
                            value={state6.commissionValue}
                            onChange={handleChange6}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 shipToToggle">
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
                          checked={state6.commissionCurrency === "THB"}
                          onChange={handleChange6}
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
                          checked={state6.chargeVolume == 1}
                          onChange={handleChange6}
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
                          handleChange6({
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
                            (item) => item.id === state6.deliveryTerms
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
                        getOptionLabel={(option) => `${option.DAYS} DAYS` || ""} // Label to display (e.g., "30 DAYS")
                        onChange={(event, newValue) => {
                          handleChange6({
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
                            (item) => item.ID === state6.paymentTerms
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
                        onChange={handleChange6} // Use the handleChange function
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

                    <div className="col-lg-2 form-group autoComplete">
                      <h6>{t("rounding")}</h6>
                      <Autocomplete
                        options={RoundingDataList || []} // List of delivery terms and incoterms
                        getOptionLabel={(option) => option.DropDown || ""} // Label to display (Incoterms)
                        onChange={(event, newValue) => {
                          handleChange6({
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
                            (item) => item.ID === state6.Rounding
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
                        value={state6.extraCost}
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="col-lg-2 form-group  ">
                      <h6>{t("freightAdjustment")}</h6>
                      <input
                        type="text"
                        name="freightAdjust"
                        className="form-control"
                        placeholder={t("freightAdjustment")}
                        value={state6.freightAdjust}
                        onChange={handleChange6}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>{t("markupValue")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="markupValue"
                            className="form-control"
                            placeholder={t("markupValue")}
                            value={state6.markupValue}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>{t("rebateValue")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="rebateValue"
                            className="form-control"
                            placeholder={t("rebateValue")}
                            value={state6.rebateValue}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>{t("quotation")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="quotation"
                            className="form-control"
                            placeholder={t("quotation")}
                            value={state6.quotation}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-lg-2 form-group">
                      <h6>{t("claim")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="claim"
                            className="form-control"
                            placeholder={t("claim")}
                            value={claimValue1}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div> */}

                    <div className="col-lg-3 form-group">
                      <h6>{t("other")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="other"
                            className="form-control"
                            placeholder={t("other")}
                            value={state6.other}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-2 form-group">
                      <h6>{t("final")}</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            name="final"
                            className="form-control"
                            placeholder={t("final")}
                            value={claimValue}
                            onChange={handleChange6}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>%</span>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <hr className="border-line"></hr>
                  <div className="formCreate">
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
                              />
                              <label htmlFor="html1">{t("client")}</label>

                              <input
                                type="radio"
                                id="css1"
                                name="fav_language"
                                value="Consignee"
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
                              />
                              <label htmlFor="dap">{t("dap")}</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                id="cnf"
                                name="delivery_term"
                                value="CNF"
                              />
                              <label htmlFor="cnf">{t("cnf")}</label>
                            </div>
                            <input
                              type="radio"
                              id="cif"
                              name="delivery_term"
                              value="CIF"
                            />
                            <label htmlFor="cif">{t("cif")}</label>

                            <div>
                              <input
                                type="radio"
                                id="fob"
                                name="delivery_term"
                                value="FOB"
                              />
                              <label htmlFor="fob">{t("fob")}</label>
                            </div>
                          </div>
                        </div>
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
                              />
                              <label htmlFor="html1">{t("client")}</label>

                              <input
                                type="radio"
                                id="css1"
                                name="fav_language"
                                value="Consignee"
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
                </form>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary mb-0"
                onClick={updatePaymentValue}
              >
                {t("submit")}{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal end */}
      {/* modal */}
      {showFirst && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ zIndex: 1050 }}
        >
          <div class="modal-dialog modalShipTo modal-xl modal-dialog-scrollable">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  {t("updateConsignee")}
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={clearAllFields1}
                >
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              <div class="modal-body">
                <div className="formCreate createPackage">
                  <form>
                    <div className="row">
                      <div className="consigneeEditTab">
                        <ul
                          className="nav nav-tabs"
                          id="consigneeTabNew"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link active"
                              id="consignee-customization-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#consignee-customization-pane"
                              type="button"
                              role="tab"
                              aria-controls="consignee-customization-pane"
                              aria-selected="true"
                            >
                              {t("customization")}
                            </button>
                          </li>

                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="consignee-notify-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#consignee-notify-pane"
                              type="button"
                              role="tab"
                              aria-controls="consignee-notify-pane"
                              aria-selected="false"
                            >
                              {t("notify")}
                            </button>
                          </li>

                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="consignee-margins-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#consignee-margins-pane"
                              type="button"
                              role="tab"
                              aria-controls="consignee-margins-pane"
                              aria-selected="false"
                            >
                              {t("marginsAndPayments")}
                            </button>
                          </li>

                          <li className="nav-item" role="presentation">
                            <button
                              className="nav-link"
                              id="consignee-invoice-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#consignee-invoice-pane"
                              type="button"
                              role="tab"
                              aria-controls="consignee-invoice-pane"
                              aria-selected="false"
                            >
                              {t("invoiceSetup")}
                            </button>
                          </li>
                        </ul>

                        <div
                          className="tab-content"
                          id="consigneeTabContentNew"
                        >
                          <div
                            className="tab-pane fade show active"
                            id="consignee-customization-pane"
                            role="tabpanel"
                            aria-labelledby="consignee-customization-tab"
                            tabIndex="0"
                          >
                            <div className="table-responsive">
                              <table className="  tableContact striped  table borderTerpProduce">
                                <tbody>
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
                                        <td>{item.Custom_Margin}</td>
                                        <td>{item.MAX_Price}</td>
                                        <td>{item.Dummy_Price}</td>
                                        <td>{item.brand_name}</td>
                                        <td>{item.unit_name}</td>
                                        <td>{item.Barcode}</td>
                                        <td>
                                          <div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleEditClickCustomization(
                                                  item
                                                )
                                              }
                                            >
                                              <i className="mdi mdi-pencil"></i>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                deleteOrder(item.Id)
                                              }
                                            >
                                              <i class="mdi mdi-delete "></i>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>

                            <button
                              style={{ width: "100px" }}
                              className="btn btn-danger mb-4"
                              type="button"
                              onClick={handleOpenAddModal}
                            >
                              {t("add")}
                            </button>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="consignee-notify-pane"
                            role="tabpanel"
                            aria-labelledby="consignee-notify-tab"
                            tabIndex="0"
                          >
                            <div className="row formCreate my-3">
                              <div className="form-group col-lg-6">
                                <h6>{t("name")}</h6>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={formData.notify_name}
                                  name="notify_name"
                                  onChange={handleChange7}
                                />
                              </div>
                              <div className="form-group col-lg-6">
                                <h6>{t("taxNumber")}</h6>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={formData.notify_tax_number}
                                  name="notify_tax_number"
                                  onChange={handleChange7}
                                />
                              </div>
                              <div className="form-group col-lg-6">
                                <h6> {t("email")}</h6>
                                <input
                                  type="email"
                                  className="form-control"
                                  value={formData.notify_email}
                                  name="notify_email"
                                  onChange={handleChange7}
                                />
                              </div>
                              <div className="form-group col-lg-6">
                                <h6>{t("phoneNumber")}</h6>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={formData.notify_phone}
                                  name="notify_phone"
                                  onChange={handleChange7}
                                />
                              </div>

                              <div className="form-group col-lg-12">
                                <h6>{t("address")}</h6>
                                <textarea
                                  className="col-lg-12 rounded h-20 w-full"
                                  style={{
                                    border: "2px solid #245486",
                                  }}
                                  value={formData.notify_address}
                                  name="notify_address"
                                  onChange={handleChange7}
                                />
                              </div>
                              <div className="col-lg-12 mt-3 text-center">
                                <button
                                  className="btn btn-danger"
                                  type="button"
                                  onClick={handleSubmit6}
                                >
                                  {t("submit")}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="consignee-margins-pane"
                            role="tabpanel"
                            aria-labelledby="consignee-margins-tab"
                            tabIndex="0"
                          >
                            <div className="formCreate createPackage">
                              <div className="row">
                                <div className="col-lg-3 form-group autoComplete">
                                  <h6>{t("invoiceCurrency")}</h6>
                                  <Autocomplete
                                    options={currency || []} // List of currencies
                                    getOptionLabel={(option) => option.FX || ""} // Label to display (currency name for each item)
                                    onChange={(event, newValue) => {
                                      handleChange6({
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
                                        (item) =>
                                          item.ID === state6.invoiceCurrency
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
                                    getOptionLabel={(option) =>
                                      option.Name_EN || ""
                                    } // Use Name_EN from API
                                    onChange={(event, newValue) => {
                                      handleChange6({
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
                                        (item) =>
                                          item.ID === state6.Invoice_Unit
                                      ) || null
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option.ID === value.ID
                                    }
                                  />
                                </div>
                                {/* <div className="col-lg-3 form-group autoComplete">
                                          <h6>{t("selectConsignee")}</h6>

                                          <Autocomplete
                                            options={getVcConsigneeList || []}
                                            getOptionLabel={(option) =>
                                              option.Name || ""
                                            }
                                            onChange={(event, newValue) => {
                                              handleChange6({
                                                target: {
                                                  name: "consigneeType",
                                                  value: newValue
                                                    ? newValue.ID
                                                    : "", // ✅ use capital ID
                                                },
                                              });
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                placeholder={t(
                                                  "selectConsignee"
                                                )}
                                                variant="outlined"
                                              />
                                            )}
                                            value={
                                              (getVcConsigneeList || []).find(
                                                (item) =>
                                                  item.ID ===
                                                  state6.consigneeType // ✅ use capital ID
                                              ) || null
                                            }
                                            isOptionEqualToValue={(
                                              option,
                                              value
                                            ) => option.ID === value.ID} // ✅ use capital ID
                                          />
                                        </div>
                                        <div className="col-lg-3 form-group">
                                          <h6>{t("Consignee Code")}</h6>
                                          <div className="parentthb packParent">
                                            <div className="childThb">
                                              <input
                                                type="text"
                                                name="consigneeCode"
                                                placeholder={t(
                                                  "Consignee Code"
                                                )}
                                                value={state6.consigneeCode}
                                                onChange={handleChange6}
                                              />
                                            </div>
                                          </div>
                                        </div> */}
                                <div className="col-lg-2 form-group autoComplete">
                                  <h6>{t("commission")}</h6>

                                  <Autocomplete
                                    options={commission || []}
                                    getOptionLabel={(option) =>
                                      option.commission_name_en || ""
                                    }
                                    onChange={(event, newValue) => {
                                      handleChange6({
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
                                        (item) =>
                                          item.id === state6.commissionType
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
                                        value={state6.commissionValue}
                                        onChange={handleChange6}
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
                                      checked={
                                        state6.commissionCurrency === "THB"
                                      }
                                      onChange={handleChange6}
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
                                      checked={state6.chargeVolume == 1}
                                      onChange={handleChange6}
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
                                    getOptionLabel={(option) =>
                                      option.Incoterms || ""
                                    } // Label to display (Incoterms)
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "deliveryTerms",
                                          value: newValue ? newValue.id : "",
                                        }, // Update deliveryTerms in state
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder={t(
                                          "selectDeliveryTermsIncoterms"
                                        )}
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      DropdownDelivery?.find(
                                        (item) =>
                                          item.id === state6.deliveryTerms
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
                                      handleChange6({
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
                                        (item) =>
                                          item.ID === state6.paymentTerms
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
                                      {
                                        id: 1,
                                        label: "Pre Shipment",
                                      },
                                      { id: 2, label: "Seaport" },
                                    ]} // Define the options array
                                    getOptionLabel={(option) => option.label} // Display the `label` for each option
                                    onChange={handleChange6} // Use the handleChange function
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder={t(
                                          "selectStatementDueDate"
                                        )}
                                        InputLabelProps={{
                                          shrink: false,
                                        }} // Prevents floating label
                                      />
                                    )}
                                    sx={{ width: 300 }}
                                  />
                                </div>

                                <div className="col-lg-2 form-group autoComplete">
                                  <h6>{t("rounding")}</h6>
                                  <Autocomplete
                                    options={RoundingDataList || []} // List of delivery terms and incoterms
                                    getOptionLabel={(option) =>
                                      option.DropDown || ""
                                    } // Label to display (Incoterms)
                                    onChange={(event, newValue) => {
                                      handleChange6({
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
                                        (item) => item.ID === state6.Rounding
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
                                    value={state6.extraCost}
                                    onChange={handleChange6}
                                  />
                                </div>
                                <div className="col-lg-2 form-group  ">
                                  <h6>{t("freightAdjustment")}</h6>
                                  <input
                                    type="text"
                                    name="freightAdjust"
                                    className="form-control"
                                    placeholder={t("freightAdjustment")}
                                    value={state6.freightAdjust}
                                    onChange={handleChange6}
                                  />
                                </div>
                                <div className="col-lg-3 form-group">
                                  <h6>{t("markupValue")}</h6>
                                  <div className="parentShip">
                                    <div className="markupShip">
                                      <input
                                        type="text"
                                        name="markupValue"
                                        className="form-control"
                                        placeholder={t("markupValue")}
                                        value={state6.markupValue}
                                        onChange={handleChange6}
                                      />
                                    </div>
                                    <div className="shipPercent">
                                      <span>%</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-3 form-group">
                                  <h6>{t("rebateValue")}</h6>
                                  <div className="parentShip">
                                    <div className="markupShip">
                                      <input
                                        type="text"
                                        name="rebateValue"
                                        className="form-control"
                                        placeholder={t("rebateValue")}
                                        value={state6.rebateValue}
                                        onChange={handleChange6}
                                      />
                                    </div>
                                    <div className="shipPercent">
                                      <span>%</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-lg-3 form-group">
                                  <h6>{t("quotation")}</h6>
                                  <div className="parentShip">
                                    <div className="markupShip">
                                      <input
                                        type="text"
                                        name="quotation"
                                        className="form-control"
                                        placeholder={t("quotation")}
                                        value={state6.quotation}
                                        onChange={handleChange6}
                                      />
                                    </div>
                                    <div className="shipPercent">
                                      <span>%</span>
                                    </div>
                                  </div>
                                </div>

                                {/* <div className="col-lg-2 form-group">
                                <h6>{t("claim")}</h6>
                                <div className="parentShip">
                                  <div className="markupShip">
                                    <input
                                      type="text"
                                      name="claim"
                                      className="form-control"
                                      placeholder={t("claim")}
                                      value={claimValue1}
                                      onChange={handleChange6}
                                    />
                                  </div>
                                  <div className="shipPercent">
                                    <span>%</span>
                                  </div>
                                </div>
                              </div> */}

                                <div className="col-lg-3 form-group">
                                  <h6>{t("other")}</h6>
                                  <div className="parentShip">
                                    <div className="markupShip">
                                      <input
                                        type="text"
                                        name="other"
                                        className="form-control"
                                        placeholder={t("other")}
                                        value={state6.other}
                                        onChange={handleChange6}
                                      />
                                    </div>
                                    <div className="shipPercent">
                                      <span>%</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 text-center mt-3">
                                  <button
                                    type="button"
                                    class="btn btn-primary mb-0"
                                    onClick={updatePaymentValue}
                                  >
                                    {t("submit")}{" "}
                                  </button>
                                </div>

                                {/* <div className="col-lg-2 form-group">
                                <h6>{t("final")}</h6>
                                <div className="parentShip">
                                  <div className="markupShip">
                                    <input
                                      type="text"
                                      name="final"
                                      className="form-control"
                                      placeholder={t("final")}
                                      value={claimValue}
                                      onChange={handleChange6}
                                    />
                                  </div>
                                  <div className="shipPercent">
                                    <span>%</span>
                                  </div>
                                </div>
                              </div> */}
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="consignee-invoice-pane"
                            role="tabpanel"
                            aria-labelledby="consignee-invoice-tab"
                            tabIndex="0"
                          >
                            <div className="formCreate">
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
                                        />
                                        <label htmlFor="html1">
                                          {t("client")}
                                        </label>

                                        <input
                                          type="radio"
                                          id="css1"
                                          name="fav_language"
                                          value="Consignee"
                                        />
                                        <label htmlFor="css1">
                                          {t("consignee")}
                                        </label>
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
                                        />
                                        <label htmlFor="dap">{t("dap")}</label>
                                      </div>
                                      <div>
                                        <input
                                          type="radio"
                                          id="cnf"
                                          name="delivery_term"
                                          value="CNF"
                                        />
                                        <label htmlFor="cnf">{t("cnf")}</label>
                                      </div>
                                      <input
                                        type="radio"
                                        id="cif"
                                        name="delivery_term"
                                        value="CIF"
                                      />
                                      <label htmlFor="cif">{t("cif")}</label>

                                      <div>
                                        <input
                                          type="radio"
                                          id="fob"
                                          name="delivery_term"
                                          value="FOB"
                                        />
                                        <label htmlFor="fob">{t("fob")}</label>
                                      </div>
                                    </div>
                                  </div>
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
                                        />
                                        <label htmlFor="html1">
                                          {t("client")}
                                        </label>

                                        <input
                                          type="radio"
                                          id="css1"
                                          name="fav_language"
                                          value="Consignee"
                                        />
                                        <label htmlFor="css1">
                                          {t("consignee")}
                                        </label>
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
                                <div className="col-lg-12 text-center mt-3">
                                  <button
                                    type="button"
                                    class="btn btn-primary mb-0"
                                    onClick={updatePaymentValue}
                                  >
                                    {t("submit")}{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="row justify-content-center">
                                <div className="col-lg-4 form-group autoComplete">
                                  <h6>{t("brand")}</h6>
                                  <Autocomplete
                                    options={brands || []}
                                    getOptionLabel={(option) =>
                                      option.Name_EN || ""
                                    } // Display English name
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "brand",
                                          value: newValue ? newValue.ID : "", // Store selected brand ID
                                        },
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Brand"
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      brands?.find(
                                        (item) => item.ID === state6.brand
                                      ) || null
                                    } // Match by ID
                                    isOptionEqualToValue={(option, value) =>
                                      option.ID === value.ID
                                    } // Comparison by ID
                                  />
                                </div>
                                <div className="col-lg-4 form-group autoComplete">
                                  <h6>Port of origin</h6>

                                  <Autocomplete
                                    options={port || []} // List of port options
                                    getOptionLabel={(option) =>
                                      option.port_name || ""
                                    } // Label to display
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "port_of_orign",
                                          value: newValue
                                            ? newValue.port_id
                                            : "",
                                        }, // Update selected port_id
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Airport"
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      port?.find(
                                        (item) =>
                                          item.port_id === state6.port_of_orign
                                      ) || null
                                    } // Set value based on selected port_id
                                    isOptionEqualToValue={(option, value) =>
                                      option.port_id === value.port_id
                                    } // Option comparison
                                  />
                                </div>
                                <div className="col-lg-4 form-group autoComplete">
                                  <h6>Port of Destination</h6>

                                  <Autocomplete
                                    options={port || []} // List of port options
                                    getOptionLabel={(option) =>
                                      option.port_name || ""
                                    } // Label to display
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "destination_port",
                                          value: newValue
                                            ? newValue.port_id
                                            : "",
                                        }, // Update selected port_id
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Airport"
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      port?.find(
                                        (item) =>
                                          item.port_id ===
                                          state6.destination_port
                                      ) || null
                                    } // Set value based on selected port_id
                                    isOptionEqualToValue={(option, value) =>
                                      option.port_id === value.port_id
                                    } // Option comparison
                                  />
                                </div>

                                <div className="col-lg-6 form-group autoComplete">
                                  <h6>Liner</h6>

                                  <Autocomplete
                                    options={liner || []} // List of airline options
                                    getOptionLabel={(option) =>
                                      option.liner_name || ""
                                    } // Label to display
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "liner_Drop",
                                          value: newValue
                                            ? newValue.liner_id
                                            : "",
                                        }, // Update selected liner_id
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Liner"
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      liner?.find(
                                        (item) =>
                                          item.liner_id === state6.liner_Drop
                                      ) || null
                                    } // Set value based on selected liner_id
                                    isOptionEqualToValue={(option, value) =>
                                      option.liner_id === value.liner_id
                                    } // Option comparison
                                  />
                                </div>

                                <div className="col-lg-6 form-group autoComplete">
                                  <h6>Location</h6>

                                  <Autocomplete
                                    options={locations || []} // List of location options
                                    getOptionLabel={(option) =>
                                      option.name || ""
                                    } // Label to display
                                    onChange={(event, newValue) => {
                                      handleChange6({
                                        target: {
                                          name: "Default_location",
                                          value: newValue ? newValue.id : "",
                                        }, // Update selected location id
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Location"
                                        variant="outlined"
                                      />
                                    )}
                                    value={
                                      locations?.find(
                                        (item) =>
                                          item.id === state6.Default_location
                                      ) || null
                                    } // Set value based on selected location id
                                    isOptionEqualToValue={(option, value) =>
                                      option.id === value.id
                                    } // Option comparison
                                  />
                                </div>
                              </div> */}
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                {/* <button
                  type="button"
                  class="btn btn-primary mb-0"
                  onClick={updatePaymentValue}
                >
                  {t("submit")}{" "}
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* modal end */}
      <div
        class="modal fade"
        id="exampleModalContact1"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modalShipTo modal-xl ">
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
                        <Autocomplete
                          disablePortal
                          options={contactType}
                          getOptionLabel={(option) => option.type_en}
                          isOptionEqualToValue={(option, value) =>
                            option.contact_type_id === value.contact_type_id
                          }
                          onChange={(e, newValue) =>
                            handleChange1({
                              target: {
                                name: "contact_type_id",
                                value: newValue?.contact_type_id || "",
                              },
                            })
                          }
                          value={
                            contactType?.find(
                              (item) =>
                                item.contact_type_id === state1?.contact_type_id
                            ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // label="Select Type"
                              placeholder={t("selectType")}
                              variant="outlined"
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
                      <h6>{t("position")}</h6>

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
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modalShipTo modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 className="modal-title fs-5">
                {isEdit ? t("editContact") : t("addContact")}
              </h1>

              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                onClick={clearAllData8}
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div class="modal-body">
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div class="form-group col-lg-2">
                      <h6>{t("title")}</h6>
                      <div class=" ">
                        <input
                          type="text"
                          name="Title"
                          value={state8.Title}
                          onChange={handleChange8}
                          placeholder={t("title")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-2">
                      <h6>{t("firstName")}</h6>
                      <div class=" ">
                        <input
                          type="text"
                          name="Name_First"
                          value={state8.Name_First}
                          onChange={handleChange8}
                          placeholder={t("firstName")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-2">
                      <h6>{t("lastName")}</h6>
                      <div class=" ">
                        <input
                          type="text"
                          name="Name_Last"
                          value={state8.Name_Last}
                          onChange={handleChange8}
                          placeholder={t("lastName")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-3">
                      <h6> {t("position")} </h6>
                      <div class=" ">
                        <input
                          type="text"
                          name="Position"
                          value={state8.Position}
                          onChange={handleChange8}
                          placeholder={t("position")}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 d-flex align-items-center">
                      <div className="invoiceModal d-flex">
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id="dap"
                            name="Accounting"
                            checked={state8.Accounting}
                            onChange={handleChange8}
                          />
                          <label htmlFor="dap">{t("accounting")}</label>
                        </div>
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id="cnf"
                            name="Invoice"
                            checked={state8.Invoice}
                            onChange={handleChange8}
                          />
                          <label htmlFor="cnf">{t("invoice")}</label>
                        </div>
                        <div className="d-flex">
                          <input
                            type="checkbox"
                            id="cif"
                            name="Logitics"
                            checked={state8.Logitics}
                            onChange={handleChange8}
                          />
                          <label htmlFor="cif">{t("logistics")}</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group col-lg-3">
                      <h6>{t("email")}</h6>
                      <div class=" ">
                        <input
                          type="email"
                          name="Email"
                          value={state8.Email}
                          onChange={handleChange8}
                          placeholder={t("email")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-2">
                      <h6>{t("mobile")}</h6>
                      <div class=" ">
                        <input
                          type="number"
                          name="Mobile"
                          value={state8.Mobile}
                          onChange={handleChange8}
                          placeholder={t("mobile")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-2">
                      <h6>{t("phone")}</h6>
                      <div class=" ">
                        <input
                          type="number"
                          name="Phone"
                          value={state8.Phone}
                          onChange={handleChange8}
                          placeholder={t("phone")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-3">
                      <h6>{t("messengerType")}</h6>
                      <div class="ceateTransport autoComplete">
                        <Autocomplete
                          options={messengerOptions}
                          getOptionLabel={(option) => option.label} // what to display in dropdown
                          value={
                            messengerOptions.find(
                              (opt) =>
                                opt.value === Number(state8.Messenger_Type)
                            ) || null
                          }
                          onChange={(event, newValue) =>
                            setState8({
                              ...state8,
                              Messenger_Type: newValue ? newValue.value : "",
                            })
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
                    <div class="form-group col-lg-2">
                      <h6>{t("messengerId")}</h6>
                      <div class=" ">
                        <input
                          type="number"
                          name="Messenger_ID"
                          value={state8.Messenger_ID}
                          onChange={handleChange8}
                          placeholder="messenger id"
                        />
                      </div>
                    </div>

                    <div class="form-group col-lg-12">
                      <h6>{t("notes")}</h6>
                      <div>
                        <textarea
                          name="Notes"
                          value={state8.Notes}
                          onChange={handleChange8}
                          cols="30"
                          rows="4"
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
                className="btn btn-primary mb-0"
                onClick={handleSubmit8}
              >
                {isEdit ? t("update") : t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* customixation modal */}

      {showModal && (
        <div
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1060,
          }}
          className="modal fade show d-block"
          tabIndex="-1"
        >
          <div className=" modal-dialog modalShipTo">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  {modalMode === "add"
                    ? t("addCustomization")
                    : t("updateCustomization")}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddModal}
                  aria-label="Close"
                >
                  <i class="mdi mdi-close"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="formCreate mt-0">
                  <div className="row">
                    <div className="form-group col-lg-12">
                      <h6>{t("itfName")}</h6>
                      <div className="ceateTransport autoComplete">
                        <Autocomplete
                          disablePortal
                          options={getItf || []}
                          getOptionLabel={(option) =>
                            option.ITF_Internal_Name_EN || ""
                          }
                          onChange={(e, newValue) =>
                            setDataCustomization((prevState) => ({
                              ...prevState,
                              ITF: newValue?.ID || "",
                            }))
                          }
                          value={
                            getItf?.find(
                              (item) => item.ID === dataCustomization.ITF
                            ) || null
                          }
                          sx={{
                            width: 300,
                          }}
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

                    <div className="form-group col-lg-12 ">
                      <h6>{t("unit")}</h6>
                      <div className="ceateTransport autoComplete">
                        <Autocomplete
                          options={unitDropdown || []} // List of ITFs
                          getOptionLabel={(option) => option.Name_EN || ""} // Label to display (itf_name_en for each ITF)
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
                              (item) => item.ID === dataCustomization.Unit
                            ) || null
                          } // Set selected value based on ITF
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          } // Option comparison by itf_id
                        />
                      </div>
                    </div>
                    <div className="form-group col-lg-12 ">
                      <h6>{t("brand")}</h6>
                      <div className="ceateTransport autoComplete">
                        <Autocomplete
                          options={brands || []} // List of brand options
                          getOptionLabel={(option) => option.Name_EN || ""} // Label to display
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
                              (item) => item.ID === dataCustomization.brand
                            ) || null
                          } // Set value based on selected brand_id
                          isOptionEqualToValue={(option, value) =>
                            option.ID === value.ID
                          } // Option comparison
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-12">
                      <h6>{t("customName")}</h6>
                      <div>
                        <input
                          type="text"
                          name="Custom_Name"
                          onChange={handleChange2}
                          value={dataCustomization.Custom_Name}
                          placeholder={t("customName")}
                          className="mb-2"
                        />
                      </div>
                    </div>
                    <div className="form-group col-lg-12">
                      <h6>{t("customCode")}</h6>
                      <div>
                        <input
                          type="text"
                          name="Custom_Code"
                          onChange={handleChange2}
                          value={dataCustomization.Custom_Code}
                          placeholder={t("customCode")}
                        />
                      </div>
                    </div>

                    <div className="form-group col-lg-12">
                      <h6>{t("customMargin")}</h6>
                      <div>
                        <input
                          type="text"
                          name="Custom_Margin"
                          onChange={handleChange2}
                          value={dataCustomization.Custom_Margin}
                          placeholder={t("customMargin")}
                        />
                      </div>
                    </div>
                    <div className="form-group col-lg-12">
                      <h6>{t("agreedPrice")}</h6>
                      <div>
                        <input
                          type="number"
                          name="max_Price"
                          onChange={handleChange2}
                          value={dataCustomization.max_Price}
                          placeholder={t("agreedPrice")}
                        />
                      </div>
                    </div>

                    <div className="form-group col-lg-12">
                      <h6>{t("dummyPrice")}</h6>
                      <div>
                        <input
                          type="text"
                          name="Dummy_Price"
                          onChange={handleChange2}
                          value={dataCustomization.Dummy_Price}
                          placeholder={t("dummyPrice")}
                        />
                      </div>
                    </div>
                    <div class="form-group col-lg-12">
                      <h6>{t("barcode")}</h6>
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
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={customizationDataSubmit}
                  className="btn mb-0 btn-primary"
                >
                  {modalMode === "add" ? t("add") : t("update")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* customization modal end */}
    </>
  );
};

export default CreateClient;
