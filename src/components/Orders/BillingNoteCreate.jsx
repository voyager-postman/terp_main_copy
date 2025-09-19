import axios from "../../Url/Api";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { ComboBox } from "../combobox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, Modal } from "react-bootstrap";
import CloseIcon from "@mui/icons-material/Close";
import Select, { components } from "react-select";
import { FaCaretDown } from "react-icons/fa"; // Import an icon from react-icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import MySwal from "../../swal";
import { useTranslation } from "react-i18next";

const BillingNoteCreate = () => {
  const [t, i18n] = useTranslation("global");

  const [buttonClicked, setButtonClicked] = React.useState(false);
  const [poData, setPoData] = useState(null);
  const location = useLocation();
  const [dropdownItems, setDropdownItems] = useState([]);
  const [editDataShow, setEditDataShow] = useState([]);
  const [editId, setEditId] = useState("");

  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [sumAmountToPay, setSumAmountToPay] = useState(0);
  const [dynamicHeaders, setDynamicHeaders] = useState({});
  const [tableHead, setTableHead] = useState({});
  const [tableData, setTableData] = useState([]);
  const [amountToPay, setAmountToPay] = useState({});
  const { from } = location.state || {};
  console.log(from);
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [stock, setStock] = useState("");
  const [color, setColor] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [details, setDetails] = React.useState([]);
  const [podId, setPodId] = useState("");
  const [paymentTableVender, setPaymentTableVender] = useState([] || "");

  const [totalDataDetails1, setTotalDataDetails1] = React.useState("");
  const [totalDataDetails2, setTotalDataDetails2] = React.useState("");
  const [dataShow, setDataShow] = useState("");

  const [totalDataDetails, setTotalDataDetails] = React.useState("");

  const getDetils = (podId) => {
    const idToUse = podId || from?.ID;
    axios
      .get(
        `${API_BASE_URL}/getPurchaseOrderDetails?ID
=${idToUse}`
      )
      .then((response) => {
        console.log(response);

        const mappedData = response.data.data.map((item) => ({
          pod_status: item.Receiving_Status,
          pod_id: item.POD_ID,
          pod_code: item.PODCODE,
          pod_type_id: item.POD_Items_ID,
          dropDown_id: item.POD_Items_ID,
          produce_name_en: item.Name_EN,
          pod_quantity: item.Qty,
          unit_count_id: item.Unit,
          Unit_Name_EN: item.Unit_Name_EN,
          Unit_Name_TH: item.Unit_Name_TH,
          item_Name_EN: item.Name_EN,
          item_Name_TH: item.Name_TH,
          pod_price: item.pod_price,
          pod_vat: item.VAT_value,
          pod_wht_id: item.WHT_value,
          pod_crate: item.Crates,
        }));
        setDetails(mappedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getDetils();
  }, [podId, from?.ID]);

  const closeIcon = () => {
    setShow(false);
    navigate("/billing_note");
  };
  const formatTwoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const handleEditDatils = (i, e) => {
    const newEditPackaging = [...details];
    newEditPackaging[i][e.target.name] = e.target.value;
    setDetails(newEditPackaging);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/PurchaseTypeItemsList`
        );
        console.log(response.data);
        setOptionItem(response.data.data); // Assuming data is already an array of objects
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getAllUnit`);
        console.log("API Response:", response.data.data);

        // Assuming response.data.data is the correct array
        setUnitItem(response.data.data || []);
      } catch (error) {
        console.error("Error fetching units:", error);
        setUnitItem([]); // Fallback to an empty array
      }
    };

    fetchUnits();
  }, []);
  const deleteDetails = async (pod_id) => {
    try {
      console.log(pod_id);

      await axios.post(`${API_BASE_URL}/deletePurchaseOrderDetails`, {
        pod_id: pod_id,
      });
      toast.success(t("deleteSuccess"), {
        autoClose: 1000,
        theme: "colored",
      });
      getDetils(podId);
    } catch (e) {}
  };

  const [state, setState] = React.useState({
    ID: from?.ID,
    vendor_id: from?.Vendor,
    ConsigneeID: "",
    ClientID: "",
    rounding: from?.rounding,
    vendor_name: from?.Vendor_name,
    created: from?.created || "0000-00-00",
    supplier_invoice_number: from?.CPNCODE,
    supplier_invoice_date: from?.Due_Date,
    supplier_dua_date: from?.CPN_Date,

    user_id: localStorage.getItem("id"),
  });
  console.log(state);
  const [formsValue, setFormsvalue] = React.useState({
    pod_type_id: 0,
    unit_count_id: 0,
    POD_Selection: 0,
    pod_quantity: 0,
    pod_price: 0,
    pod_vat: 0,
    pod_wht_id: 0,
    pod_crate: 0,
    Unit_Name_EN: 0,
    Unit_Name_TH: 0,
    item_Name_EN: 0,
    item_Name_TH: 0,
  });

  const addFieldHandleChange = (e) => {
    const { name, value } = e.target;
    setFormsvalue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const addFieldHandleChangeWname = (name, value) => {
    setFormsvalue((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const addFormFields = () => {
    setFormsvalue((prevValues) => ({
      ...prevValues,
      pod_type_id: 0,
      unit_count_id: 0,
      POD_Selection: 0,
      pod_quantity: 0,
      pod_price: 0,
      pod_vat: 0,
      pod_wht_id: 0,
      pod_crate: 0,
      Unit_Name_EN: 0,
      Unit_Name_TH: 0,
      item_Name_EN: 0,
      item_Name_TH: 0,
    }));
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formsValue];
    newFormValues.splice(i, 1);
    setFormsvalue(newFormValues);
  };

  const { data: vendorList } = useQuery("getAllVendor");
  const { data: recieptDroupDown } = useQuery("RecieptsDropdown");
  const { data: BNDropDown } = useQuery("BNDropDown");

  const { data: dropdownType } = useQuery("getDropdownType");
  const { data: produceList } = useQuery("getAllProduceItem");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: BoxList } = useQuery("getAllBoxes");
  const { data: unitType } = useQuery("getAllUnit");
  useEffect(() => {
    if (!unitType?.length) return;
    getDetils();
  }, [unitType]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updatePurchaseOrderDetils = (id) => {
    if (!from?.ID) return;
    axios
      .post(`${API_BASE_URL}/updatePurchaseOrderDetails`, {
        ID: id,
        data: details,
      })
      .then((response) => {
        // window.location.reload(navigate("/purchase_orders"));
        navigate("/purchase_orders");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleSubmitVenderData = async () => {
    console.log("Edit Data:", editDataShow);

    // ðŸ” Build selected rows only where checkbox is ticked
    const selectedRows = editDataShow
      ?.map((child, index) => {
        if (!childChecked?.[index]) return null; // Only include checked rows

        return {
          BN: from?.ID || totalDataDetails2,
          IID: child?.ID, // Make sure this key exists in the dynamic row data
          BN_FX: child?.FX_Rate,
          Payment: Number.isNaN(parseFloat(amountToPay[index]))
            ? 0
            : parseFloat(amountToPay[index]),
        };
      })
      .filter(Boolean); // Filter out nulls

    if (!selectedRows.length) {
      toast.error(
        t("selectRecordError") || "Please select at least one record"
      );
      return;
    }

    const payload = { datas: selectedRows };
    console.log("Submitting Payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/AddBNDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        toast.success(
          t("cpnDetailsSuccess") || "Details submitted successfully"
        );
        paymentTable10();
        setModalOne(false); // âœ… Close modal only on success
        setChildChecked({});
        setAmountToPay({});
        setParentChecked(false);
      } else {
        toast.error(
          result.message || t("submissionFailed") || "Submission failed"
        );
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(t("genericError") || "An error occurred");
    }
  };

  useEffect(() => {
    if (from?.ID || totalDataDetails2) {
      paymentTable10();
    }
  }, [from?.ID, totalDataDetails2]);
  const filteredHeaders = Object.fromEntries(
    Object.entries(dynamicHeaders || {}).filter(([key]) => key !== "ID")
  );

  const paymentTable10 = () => {
    console.log("vendor_id:", state.vendor_id);

    const cpnId = from?.ID || totalDataDetails2;

    if (cpnId) {
      axios
        .post(`${API_BASE_URL}/getBNViewList`, { bn_id: cpnId })
        .then((response) => {
          const res = response.data;
          console.log("GetCombinedPaymentByID response:", res);
          setTableHead(res.tableHead || {});
          setTableData(res.tableData || []);
          setEditId(res.data);
          setTotalDataDetails(res);
          setDataShow(res);
        })
        .catch((error) => {
          console.error("Error fetching details:", error);
        });
    } else {
      console.warn("cpn_id not available for GetCombinedPaymentByID request.");
    }
  };
  React.useEffect(() => {
    if (dataShow?.data?.Row3 && dataShow?.data?.Row4) {
      setState((prevState) => ({
        ...prevState,
        supplier_dua_date: new Date(dataShow.data.Row3),
        supplier_invoice_date: new Date(dataShow.data.Row4),
      }));
    }
  }, [dataShow]);

  const deleteOrder = async (id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/DeleteBN`, {
        bn_id: id,
      });
      console.log(response);
      // toast.success(response.data.Message_EN);
      // toast.success(response.data.Message_TH);
      navigate("/billing_note");
    } catch (e) {
      toast.error(t("genericError"));
      console.log(e);
    }
  };
  // const update = async (e) => {
  //   console.log(totalDataDetails1);
  //   setButtonClicked(false);
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/${"VendorFilteredPaymentDetails"}`,
  //       {
  //         vendor_id: totalDataDetails1?.Vendor || state.vendor_id,
  //         cpn_id: totalDataDetails1?.ID,
  //       }
  //     );
  //     console.log(response);
  //     setEditDataShow(response?.data?.data);
  //     setStock(response?.data);

  //     // ðŸ”¥ Clear the item form fields for new entry
  //     setFormDataAdd({
  //       pod_type_id: 0,
  //       unit_count_id: 0,
  //       POD_Selection: 0,
  //       pod_quantity: 0,
  //       pod_price: 0,
  //       pod_vat: 0,
  //       pod_wht_id: 0,
  //       pod_crate: 0,
  //       Unit_Name_EN: 0,
  //       Unit_Name_TH: 0,
  //       item_Name_EN: 0,
  //       item_Name_TH: 0,
  //     });

  //     // âœ… Keep the purchase order ID and vendor details
  //     setState((prevState) => ({
  //       ...prevState,
  //       ID: response.data?.ID || from?.ID || prevState.ID,
  //       vendor_id: prevState.vendor_id,
  //       created: prevState.created,
  //       supplier_invoice_number: prevState.supplier_invoice_number,
  //       supplier_invoice_date: prevState.supplier_invoice_date,
  //       supplier_dua_date: prevState.supplier_dua_date,

  //       rounding: prevState.rounding,
  //     }));
  //     setModalOne(true); // Show the modal
  //     if (response.status === 200) {
  //       if (response.data.success) {
  //         const id = response.data?.ID || from?.ID;
  //         console.log(id);

  //         setPodId(id); //  Clear podId to avoid fetching last item data
  //         setModalOne(true);
  //         // toast.success("Create Purchase Orders", {
  //         //   autoClose: 5000,
  //         //   theme: "colored",
  //         // });
  //       }

  //       // else {
  //       //   setShow(true);
  //       // }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //     toast.error(t("errorOccurred"), {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   }
  // };
  const update = async (e) => {
    console.log("totalDataDetails1:", totalDataDetails1);
    setButtonClicked(false);
    if (!state?.supplier_dua_date) {
      toast.error(
        t("billingNoteDateRequired") || "Billing Note Date is required",
        {
          autoClose: 4000,
          theme: "colored",
        }
      );
      return; // Stop the function if validation fails
    }
    try {
      // Step 1: Call "AddCPN" API first
      const addCpnResponse = await axios.post(`${API_BASE_URL}/AddBN`, {
        vendor_id: totalDataDetails1?.Vendor || state.vendor_id,
        client_id: totalDataDetails1?.client_id || state.ClientID,
        consignee_id: totalDataDetails1?.consignee_id || state.ConsigneeID,
        BN_Date: state?.supplier_dua_date,
        due_date: state?.supplier_invoice_date,
        user_id: localStorage.getItem("id"),
        bn_id: totalDataDetails1?.ID || totalDataDetails2,
      });

      console.log("AddCPN response:", addCpnResponse);

      if (addCpnResponse.status === 200 && addCpnResponse?.data?.success) {
        const newCpnId = addCpnResponse?.data?.data || totalDataDetails1?.ID;
        setTotalDataDetails2(newCpnId);

        // Step 2: Now call "VendorFilteredPaymentDetails" using updated cpn_id
        const response = await axios.post(`${API_BASE_URL}/BN_Create_List`, {
          Client_ID: state.ClientID || editId?.client_id,
          Consignee_ID: state.ConsigneeID || editId?.consignee_id,
          // vendor_id: state.vendor_id,
        });

        const res = response.data;
        console.log("VendorFilteredPaymentDetails response:", response);
        setDynamicHeaders(res.head);
        setEditDataShow(res.data);
        setStock(response?.data);

        // Step 3: Clear item form fields
        setFormDataAdd({
          pod_type_id: 0,
          unit_count_id: 0,
          POD_Selection: 0,
          pod_quantity: 0,
          pod_price: 0,
          pod_vat: 0,
          pod_wht_id: 0,
          pod_crate: 0,
          Unit_Name_EN: 0,
          Unit_Name_TH: 0,
          item_Name_EN: 0,
          item_Name_TH: 0,
        });

        // Step 4: Update state and safely get ID
        if (response?.data) {
          const newId = response.data?.data ?? from?.ID ?? state?.ID;

          setState((prevState) => ({
            ...prevState,
            ID: newId,
            vendor_id: prevState.vendor_id,
            created: prevState.created,
            supplier_invoice_number: prevState.supplier_invoice_number,
            supplier_invoice_date: prevState.supplier_invoice_date,
            supplier_dua_date: prevState.supplier_dua_date,
            rounding: prevState.rounding,
          }));

          // Step 5: Show modal and update pod ID
          if (response?.data?.success && newId) {
            setPodId(newId);
            setModalOne(true);
          }
        } else {
          console.warn("response.data is undefined");
          toast.error(t("errorOccurred"), {
            autoClose: 5000,
            theme: "colored",
          });
        }
      } else {
        toast.error(t("errorOccurred"), {
          autoClose: 5000,
          theme: "colored",
        });
      }
    } catch (e) {
      console.error("Update error:", e);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const updateData = async (e) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${"addPurchaseOrder"}`,
        state
      );
      console.log(response);
      setStock(response?.data);

      // ðŸ”¥ Clear the item form fields for new entry
      setFormDataAdd({
        pod_type_id: 0,
        unit_count_id: 0,
        POD_Selection: 0,
        pod_quantity: 0,
        pod_price: 0,
        pod_vat: 0,
        pod_wht_id: 0,
        pod_crate: 0,
        Unit_Name_EN: 0,
        Unit_Name_TH: 0,
        item_Name_EN: 0,
        item_Name_TH: 0,
      });

      // âœ… Keep the purchase order ID and vendor details
      setState((prevState) => ({
        ...prevState,
        ID: response.data?.ID || from?.ID || prevState.ID,
        vendor_id: prevState.vendor_id,
        created: prevState.created,
        supplier_invoice_number: prevState.supplier_invoice_number,
        supplier_invoice_date: prevState.supplier_invoice_date,
        rounding: prevState.rounding,
      }));

      if (response.status === 200) {
        if (response.data.success) {
          const id = response.data?.ID || from?.ID;
          console.log(id);

          setPodId(id);
          navigate("/billing_note");
          //  Clear podId to avoid fetching last item data
          // toast.success("Create Purchase Orders", {
          //   autoClose: 5000,
          //   theme: "colored",
          // });
        } else {
          setShow(true);
        }
      }
    } catch (e) {
      console.log(e);
      toast.error(t("errorOccurred"), {
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  const [optionItem, setOptionItem] = useState([]);
  const [modalOne, setModalOne] = useState(false);
  const [unitItem, setUnitItem] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const [formDataAdd, setFormDataAdd] = useState({
    pod_type_id: 0,
    unit_count_id: 0,
    POD_Selection: 0,
    pod_quantity: 0,
    pod_price: 0,
    pod_vat: 0,
    pod_wht_id: 0,
    pod_crate: 0,
    Unit_Name_EN: 0,
    Unit_Name_TH: 0,
    item_Name_EN: 0,
    item_Name_TH: 0,
  });
  const handleChangeAdd = (e) => {
    const { name, value } = e.target;

    setFormDataAdd((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // âœ… Ensure VAT updates dynamically when price, quantity, or VAT_Rate changes
      const price = parseFloat(updatedData.pod_price || 0);
      const quantity = parseFloat(updatedData.pod_quantity || 0);
      const vatRate = parseFloat(prev.VAT_Rate || 0);
      const whtRate = parseFloat(prev.WHT_Rate || 0);

      if (vatRate && price && quantity) {
        updatedData.pod_vat = ((vatRate / 100) * price * quantity).toFixed(2);
      } else {
        updatedData.pod_vat = 0;
      }

      if (whtRate && price && quantity) {
        updatedData.pod_wht_id = ((whtRate / 100) * price * quantity).toFixed(
          2
        );
      } else {
        updatedData.pod_wht_id = 0;
      }

      console.log("Updated VAT:", updatedData.pod_vat);
      console.log("Updated WHT:", updatedData.pod_wht_id);

      return updatedData;
    });
  };

  const handleVatChange = (e) => {
    const { value } = e.target;
    setFormDataAdd((prev) => ({
      ...prev,
      pod_vat: parseFloat(value) || 0, // Allow manual edit
    }));
  };
  const handleWhtChange = (e) => {
    const { value } = e.target;
    setFormDataAdd((prev) => ({
      ...prev,
      pod_wht_id: parseFloat(value) || 0, // Allow manual edit
    }));
  };

  const handleEditClick = (item) => {
    setFormDataAdd(item); // Set the selected itemâ€™s data
    setModalOne(true); // Fill the form with item data
    // Open the modal
  };

  const handleItemChange = (newValue) => {
    console.log("Selected Item:", newValue);
    setFormDataAdd((prev) => {
      const updatedData = {
        ...prev,
        pod_type_id: newValue ? newValue.ID : null,
        dropDown_id: newValue ? newValue.ID : null,
        POD_Selection: newValue ? newValue.ID : null,
        item_Name_EN: newValue ? newValue.Name_EN : null,
        item_Name_TH: newValue ? newValue.Name_TH : null,
        VAT_Rate: newValue ? newValue.VAT_Rate : 0,
        WHT_Rate: newValue ? newValue.WHT_Rate : 0,
      };
      console.log("Item Selected - VAT_Rate:", updatedData.VAT_Rate);

      // Ensure VAT is calculated dynamically
      if (updatedData.VAT_Rate && prev.pod_quantity && prev.pod_price) {
        updatedData.pod_vat = (
          parseFloat(updatedData.VAT_Rate / 100) *
          parseFloat(prev.pod_quantity) *
          parseFloat(prev.pod_price)
        ).toFixed(2);
      } else {
        updatedData.pod_vat = 0; // Reset if any value is missing
      }
      if (updatedData.WHT_Rate && prev.pod_quantity && prev.pod_price) {
        updatedData.pod_wht_id = (
          parseFloat(updatedData.WHT_Rate / 100) *
          parseFloat(prev.pod_quantity) *
          parseFloat(prev.pod_price)
        ).toFixed(2);
      } else {
        updatedData.pod_wht_id = 0;
      }
      console.log("Calculated VAT:", updatedData.pod_vat);
      return updatedData;
    });
  };

  //item_Name_EN, item_Name_TH
  const handleUnitChange = (newValue) => {
    setFormDataAdd((prev) => ({
      ...prev,
      unit_count_id: newValue ? newValue.ID : null,
      Unit_Name_EN: newValue ? newValue.Name_EN : null,
      Unit_Name_TH: newValue ? newValue.Name_TH : null,
    }));
  };
  const handleCloseModalOne = () => {
    setModalOne(false); // Hide the modal

    setModalOne(false);
    setChildChecked({});
    setAmountToPay({});
    setParentChecked(false);
  };

  // const openModalOne = () => {
  //   setModalOne(true); // Show the modal
  // };
  const handleChangeCreate = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const deleteOrderPayment = (id) => {
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
            `${API_BASE_URL}/DeleteCpnDetails`,
            {
              CPN_Details_id: id,
            }
          );
          console.log(response);
          paymentTable10();

          toast.success(t("combinedPaymentDeleteSuccess"));
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FaCaretDown style={{ color: "black" }} />
      </components.DropdownIndicator>
    );
  };
  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: "#ccc",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#888",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      opacity: "0", // Initially hide the clear button
      transition: "opacity 0.2s ease", // Smooth transition for visibility
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333",
    }),
    container: (base) => ({
      ...base,
      "&:hover .react-select__clear-indicator": {
        opacity: "1", // Show the clear button on hover
      },
      "&:focus-within .react-select__clear-indicator": {
        opacity: "1", // Show the clear button on focus
      },
    }),
  };
  // Handle Parent Checkbox Change
  const [parentChecked, setParentChecked] = useState(false);
  const [childChecked, setChildChecked] = useState({
    1: false, // Row 1 checkbox
    2: false, // Row 2 checkbox
    3: false, // Row 3 checkbox
  });

  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  const CustomInput = ({ value, onClick }) => (
    <div
      className="custom-input"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        type="text"
        value={value}
        readOnly
        style={{
          padding: "10px",
          paddingLeft: "35px",
          width: "250px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <FaCalendarAlt
        style={{
          position: "absolute",
          right: "10px",
          fontSize: "18px",
          color: "#888",
        }}
      />
    </div>
  );

  const handleParentChange = () => {
    const newChecked = !parentChecked;
    setParentChecked(newChecked);

    const updatedChildren = {};
    const updatedAmounts = {};

    editDataShow?.forEach((row, index) => {
      updatedChildren[index] = newChecked;

      if (newChecked) {
        // âœ… Clean commas and parse correctly
        const rawValue = row?.COL8 || "0";
        const cleanValue = parseFloat(rawValue.toString().replace(/,/g, ""));
        updatedAmounts[index] = cleanValue;
      }
    });

    setChildChecked(updatedChildren);
    setAmountToPay(newChecked ? updatedAmounts : {});
  };

  const handleChildChange = (index) => {
    const isChecked = !childChecked[index];

    setChildChecked((prev) => ({
      ...prev,
      [index]: isChecked,
    }));

    setAmountToPay((prev) => {
      const updated = { ...prev };

      if (isChecked) {
        // âœ… Clean commas and parse correctly
        const rawValue = editDataShow[index]?.COL8 || "0";
        const cleanValue = parseFloat(rawValue.toString().replace(/,/g, ""));
        updated[index] = cleanValue;
      } else {
        delete updated[index];
      }

      return updated;
    });
  };

  useEffect(() => {
    // Initialize state with Payable values
    const initialAmounts = editDataShow.reduce((acc, child, index) => {
      acc[index] = child.Payable;
      return acc;
    }, {});
    setAmountToPay(initialAmounts);
  }, [editDataShow]);
  const handleAmountChange2 = (index, value) => {
    setAmountToPay((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const totalAmountToPay = Object.values(amountToPay).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  useEffect(() => {
    let sumAmountToPay = 0;
    let sumVAT = 0;
    let sumWHT = 0;
    let sumTotalBeforeTax = 0;
    let sumRounding = 0;

    paymentTableVender.forEach((child, index) => {
      const amountToPayValue = parseFloat(amountToPay[index] || 0);
      const totalBeforeTax = parseFloat(child.Total_Before_Tax || 1); // Avoid division by zero
      const vatValue = parseFloat(child.VAT || 0);
      const whtValue = parseFloat(child.WHT || 0);
      sumAmountToPay += amountToPayValue;
      sumVAT += (amountToPayValue * vatValue) / totalBeforeTax;
      sumWHT += (amountToPayValue * whtValue) / totalBeforeTax;
      sumTotalBeforeTax += totalBeforeTax;
      sumRounding += parseFloat(child.Rounding || 0);
      console.log(`Row ${index + 1} - Amount to Pay: ${amountToPayValue}`);
      console.log(`Row ${index + 1} - Total Before Tax: ${totalBeforeTax}`);
      console.log(`Row ${index + 1} - VAT: ${vatValue}`);
      console.log(`Row ${index + 1} - WHT: ${whtValue}`);
    });
    console.log("Final Sum Amount to Pay:", sumAmountToPay);
    console.log("Final Sum VAT:", sumVAT);
    console.log("Final Sum WHT:", sumWHT);
    console.log("Final Sum Total Before Tax:", sumTotalBeforeTax);
    console.log("Final Sum Rounding:", sumRounding);
    setVATTotal(sumVAT);
    setWHTTotal(sumWHT);
    setSumAmountToPay(sumAmountToPay);
    setTotalBeforeTaxTotal(sumTotalBeforeTax);
    setRoundingData(sumRounding);
  }, [amountToPay]);

  useEffect(() => {
    const initialCheckedState = {};
    editDataShow.forEach((_, index) => {
      initialCheckedState[index] = false; // Ensure all checkboxes are initially unchecked
    });
    setChildChecked(initialCheckedState);
  }, [editDataShow]);
  useEffect(() => {
    // Initialize state with Payable values when `paymentTableVender` updates
    setAmountToPay(paymentTableVender?.map((item) => item.Payment));
  }, [paymentTableVender]);

  const handleAmountChange = (index, value) => {
    const updatedAmounts = [...amountToPay];
    updatedAmounts[index] = parseFloat(value) || 0;
    setAmountToPay(updatedAmounts);
    console.log("Updated Amount to Pay Array:", updatedAmounts);
  };

  const handleRoundingChange = (e) => {
    let value = e.target.value;

    // Allow empty input (do not force 0 immediately)
    if (value === "") {
      setRoundingData("");
      return;
    }
    // Allow "-" or "+" at the start for negative/positive input
    if (value === "-" || value === "+") {
      setRoundingData(value);
      return;
    }
    // Convert to float and ensure valid number
    let parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setRoundingData(parsedValue);
    }
  };

  const handleRoundingBlur = (e) => {
    // Reset to 0 if input is empty or only "-" on blur
    if (e.target.value === "" || e.target.value === "-") {
      setRoundingData(0);
    }
  };

  console.log(totalDataDetails);
  const handleSubmitVenderData1 = async () => {
    console.log(state.ID);
    const cpnId = from?.ID || totalDataDetails2;
    try {
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: cpnId,
        accesstype: 5, // 5 = Cancel action
      });

      // âœ… Success: Show toast, refresh table, navigate
      toast.success(t("success"));
      paymentTable10(); // Refresh table or data
      navigate("/billing_note"); // Redirect
    } catch (error) {
      console.error(
        "Error updating access file in handleSubmitVenderData1:",
        error
      );
      toast.error(t("closingError"));
    }
  };

  // const handleSubmitVenderData1 = async () => {
  //   if (!state.supplier_dua_date) {
  //     toast.error(t("missingRequiredFields"));
  //     return;
  //   }

  //   const selectedRows = paymentTableVender.map((child, index) => ({
  //     ID: child?.ID ?? null, // Ensure ID exists
  //     CPN: totalDataDetails1?.ID ?? "", // Ensure valid CPN
  //     PO_ID: child?.PO_ID ?? "", // Ensure PO_ID exists
  //     Payment: parseFloat(amountToPay[index] || 0), // Ensure it's a valid number
  //   }));

  //   const userId = localStorage.getItem("id");

  //   const payload = {
  //     vendor_id: totalDataDetails1.Vendor,
  //     Payment_Date: state.supplier_dua_date,
  //     due_date: state.supplier_invoice_date,
  //     user_id: userId,
  //     cpn_id: totalDataDetails1?.ID ?? "",
  //     datas: selectedRows,
  //   };

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/AddCombinedPayment`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`API Error: ${response.status} ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     console.log("API Response:", result);
  //     toast.success(t("paymentUpdateSuccess"));
  //     paymentTable10();
  //     navigate("/billing_note");
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     toast.error(t("genericError"));
  //   }
  // };
  const options =
    BNDropDown?.map((item) => ({
      value: item.ID, // vendor_id
      label: item.name, // vendor_name
      clientId: item.Client, // clientId
      consigneeId: item.Consignee, // consigneeId
    })) || [];

  // ✅ Set selected option
  const selectedOption = options.find(
    (option) =>
      Number(option.value) === Number(state.vendor_id) &&
      Number(option.clientId) === Number(state.ClientID) &&
      Number(option.consigneeId) === Number(state.ConsigneeID)
  );
  const summaryDeatils = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 1 : 0;
    axios
      .post(`${API_BASE_URL}/BN_Bottom_View`, {
        BN_ID: totalDataDetails2 || from?.ID,
        lang: langValue,
      })
      .then((res) => {
        console.log("poData", res.data);
        setPoData(res.data);
      })
      .catch((err) => {
        console.error("API Error:", err);
      });
  };
  useEffect(() => {
    summaryDeatils();
  }, []);
  // Utility to render each section
  const renderSection = (labels, values) => {
    if (!labels || !values) return null;

    return Object.keys(labels).map((key, i) => (
      <div key={i}>
        <b>{labels[key]}</b> {values[key] || ""}
      </div>
    ));
  };
  return (
    <>
      <Card
        title={`${t("billingNote")} / ${
          from?.ID ? t("update") : t("create")
        } ${t("form")}`}
      >
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  {from?.ID ? (
                    <div className="row cratePurchase">
                      <div className="col-lg-3 form-group autoComplete">
                        <div className="d-flex">
                          <h6 className="me-2">{dataShow?.head?.Row1}:</h6>
                          {dataShow?.data?.Row1}
                        </div>

                        <div className="d-flex">
                          <h6 className="me-2">{dataShow?.head?.Row2}:</h6>
                          <p> {dataShow?.data?.Row2}</p>
                        </div>
                      </div>

                      <div className="col-lg-3 form-group">
                        <h6>{dataShow?.head?.Row3}</h6>
                        <DatePicker
                          selected={state.supplier_dua_date}
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "supplier_dua_date",
                                value: date,
                              },
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/MM/yyyy"
                          customInput={<CustomInput />}
                        />
                      </div>

                      <div className="col-lg-3 form-group">
                        <h6>{dataShow?.head?.Row4}</h6>
                        <DatePicker
                          selected={state.supplier_invoice_date}
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "supplier_invoice_date",
                                value: date,
                              },
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText="dd/MM/yyyy"
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row cratePurchase">
                      <div className="col-lg-4 form-group selectReact">
                        <div className="d-flex">
                          <h6 className="me-2">{t("client")}</h6>
                        </div>

                        {/* <Autocomplete
                          options={
                            recieptDroupDown?.map((item) => ({
                              id: item.VendorID,
                              name: item.Payor,
                            })) || []
                          }
                          getOptionLabel={(option) => option.name || ""}
                          value={
                            recieptDroupDown
                              ?.map((item) => ({
                                id: item.VendorID,
                                name: item.Payor,
                              }))
                              .find(
                                (option) => option.id === state.vendor_id
                              ) || null
                          }
                          onChange={(e, newValue) => {
                            setState({
                              ...state,
                              vendor_id: newValue?.id || "",
                              vendor_name: newValue?.name || "",
                            
                            });
                          }}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("selectClient")}
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        /> */}
                        <Select
                          options={options}
                          value={selectedOption || null}
                          onChange={(selected) => {
                            setState((prev) => ({
                              ...prev,
                              vendor_id: selected?.value || "",
                              vendor_name: selected?.label || "",
                              ClientID: selected?.clientId || "",
                              ConsigneeID: selected?.consigneeId || "",
                            }));
                          }}
                          isClearable
                          placeholder={t("selectClient")}
                          classNamePrefix="select"
                          className="basic-single"
                          styles={{
                            container: (base) => ({ ...base }),
                          }}
                        />
                      </div>
                      {/* <div className="col-lg-3">
                        <h6 className="me-2">{t("billingNoteNumber")}</h6>
                        <input type="number" />
                      </div> */}
                      <div className="col-lg-4 form-group">
                        <h6>{t("billingNoteDate")}</h6>
                        <DatePicker
                          selected={state.supplier_dua_date}
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "supplier_dua_date",
                                value: date,
                              },
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText={"dateFormat"}
                          customInput={<CustomInput />} // Ensure you have the `CustomInput` component defined or imported
                        />
                      </div>
                      <div className="col-lg-4 form-group">
                        <h6>Due Date</h6>
                        <DatePicker
                          selected={state?.supplier_invoice_date || null} // Ensuring it works even if the value is initially undefined
                          onChange={(date) =>
                            handleChange({
                              target: {
                                name: "supplier_invoice_date",
                                value: date,
                              },
                            })
                          }
                          dateFormat="dd/MM/yyyy"
                          placeholderText={"dateFormat"}
                          customInput={<CustomInput />} // Ensure `CustomInput` is defined or remove this line if not needed
                        />
                      </div>
                    </div>
                  )}
                  <div className="addButton">
                    <button
                      type="button"
                      className="btn btn-primary mt-3"
                      onClick={update}
                    >
                      {t("add")}
                    </button>
                    {modalOne && (
                      <div
                        className="fixed inset-0 flex items-center justify-center "
                        style={{ zIndex: "999" }}
                      >
                        <div
                          className="fixed w-screen h-screen bg-black/20 "
                          onClick={handleCloseModalOne}
                        />
                        <div
                          className="bg-white rounded-lg shadow-lg max-w-md w-full modalBillingTable"
                          style={{ maxWidth: "1530px" }}
                        >
                          <div className="formEan">
                            <div className="modal-body modalShipTo p-0 ">
                              {/* {/ <h1>hello</h1> /} */}

                              <div className="addMOdalContent">
                                <div className="row tableCombinePayment">
                                  <div className="tableCreateClient tableLr tablepayment ">
                                    {/* <table>
                                      <tr>
                                        <th style={{ width: "80px" }}>
                                          <input
                                            type="checkbox"
                                            checked={parentChecked}
                                            onChange={handleParentChange}
                                            className="mb-0"
                                          />
                                        </th>
                                        <th style={{ width: "130px" }}>
                                          {t("cpnNumber")}
                                        </th>
                                        <th style={{ width: "130px" }}>
                                          {t("issueDate")}
                                        </th>
                                        <th style={{ width: "130px" }}>
                                          {t("dueDate")}
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          {t("totalBeforeTax")}
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          {t("pastPayment")}
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          {t("netPayable")}
                                        </th>
                                        <th
                                          className="text-center"
                                          style={{ width: "150px" }}
                                        >
                                          {t("fx")}
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          {t("amountToPay")}
                                        </th>
                                      </tr>
                                      <tr>
                                        <td></td>
                                      </tr>

                                      {editDataShow?.map((child, index) => (
                                        <tr key={index}>
                                          <td style={{ textAlign: "center" }}>
                                            <input
                                              type="checkbox"
                                              checked={!!childChecked[index]} // Use index for correct selection
                                              onChange={() =>
                                                handleChildChange(index)
                                              }
                                            />
                                          </td>
                                          <td>{child.POCODE}</td>
                                          <td className="text-center">
                                            {new Date(
                                              child.PO_date
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            })}
                                          </td>
                                          <td className="text-center">
                                            {" "}
                                            {new Date(
                                              child.Due_Date
                                            ).toLocaleDateString("en-GB", {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                            })}
                                          </td>
                                          <td className="text-end">
                                            {formatTwoDecimal.format(
                                              child.Total_Before_Tax
                                            )}
                                          </td>
                                          <td className="text-end">
                                            {formatTwoDecimal.format(
                                              child.Payment_amount
                                            )}
                                          </td>
                                          <td className="text-end">
                                            {formatTwoDecimal.format(
                                              child.Payable
                                            )}
                                          </td>
                                          <td className="text-center">
                                            {t("thb")}
                                          </td>
                                          <td className="pe-3">
                                            <input
                                              type="number"
                                              value={amountToPay[index] ?? ""}
                                              onChange={(e) =>
                                                handleAmountChange2(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </table> */}
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th style={{ width: "80px" }}>
                                            <input
                                              type="checkbox"
                                              checked={parentChecked}
                                              onChange={handleParentChange}
                                              className="mb-0"
                                            />
                                          </th>

                                          {/* ðŸ”½ Render headers dynamically */}
                                          {/* ðŸ”½ Render headers dynamically */}
                                          {Object.entries(filteredHeaders).map(
                                            ([key, label]) => (
                                              <th
                                                key={key}
                                                className="text-center"
                                                style={{ minWidth: "130px" }}
                                              >
                                                {label}
                                              </th>
                                            )
                                          )}

                                          <th
                                            className="text-center"
                                            style={{ width: "150px" }}
                                          >
                                            {t("amountToPay")}
                                          </th>
                                          <th>
                                            <CloseIcon
                                              onClick={handleCloseModalOne}
                                            />
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {editDataShow?.map((row, index) => (
                                          <tr key={index}>
                                            <td className="text-center">
                                              <input
                                                type="checkbox"
                                                checked={!!childChecked[index]}
                                                onChange={() =>
                                                  handleChildChange(index)
                                                }
                                              />
                                            </td>

                                            {/* ðŸ”½ Render row data dynamically */}
                                            {/* ðŸ”½ Render row data dynamically */}
                                            {Object.keys(filteredHeaders).map(
                                              (colKey) => (
                                                <td
                                                  key={colKey}
                                                  className="text-center"
                                                >
                                                  {row[colKey]}
                                                </td>
                                              )
                                            )}

                                            <td className="pe-3" colspan="2">
                                              <input
                                                type="text"
                                                inputMode="decimal"
                                                className="form-control text-end"
                                                defaultValue={
                                                  amountToPay[index] !==
                                                    undefined &&
                                                  amountToPay[index] !== ""
                                                    ? Number(
                                                        amountToPay[index]
                                                      ).toLocaleString(
                                                        "en-US",
                                                        {
                                                          minimumFractionDigits: 2,
                                                          maximumFractionDigits: 2,
                                                        }
                                                      )
                                                    : ""
                                                }
                                                onChange={(e) => {
                                                  const rawValue =
                                                    e.target.value.replace(
                                                      /,/g,
                                                      ""
                                                    );
                                                  const numericValue =
                                                    parseFloat(rawValue);
                                                  handleAmountChange2(
                                                    index,
                                                    isNaN(numericValue)
                                                      ? ""
                                                      : numericValue
                                                  );
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer ">
                            {/* Submit button aligned center (automatically left-aligned here) */}
                            <div className="mx-auto">
                              <button
                                type="button"
                                className="UpdatePopupBtn btn btn-primary"
                                onClick={handleSubmitVenderData}
                              >
                                {t("submit")}
                              </button>
                            </div>

                            <div>
                              <input
                                type="text"
                                readOnly
                                className="form-control text-end"
                                value={Number(totalAmountToPay).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                                style={{ maxWidth: "200px" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* table new */}

                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className=" tableLr display transPortCreate table table-hover table-striped borderTerpProduce table-responsive purchaseCreateTable"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          {Object.values(tableHead).map((headLabel, index) => (
                            <th key={index}>{headLabel}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.keys(tableHead).map((colKey, colIndex) => (
                              <td key={colIndex} className="text-center">
                                {row[colKey]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* table new end */}
                  <div className="row py-4">
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section1_label,
                        poData?.section1_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section2_label,
                        poData?.section2_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section3_label,
                        poData?.section3_values
                      )}
                    </div>
                    <div className="col-lg-3">
                      {renderSection(
                        poData?.section4_label,
                        poData?.section4_values
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={handleSubmitVenderData1}
              disabled={buttonClicked}
            >
              {from?.ID ? t("Close") : t("create")}
            </button>
            {!from?.ID ? (
              <Link
                className="btn btn-danger"
                to={from?.ID ? "/billing_note" : "/billing_note"} // Redirect if ID
                exists
                onClick={(e) => {
                  if (!totalDataDetails2) return; // Do nothing if podId is missing
                  e.preventDefault(); // Prevent navigation if deleting
                  deleteOrder(totalDataDetails2); // Call delete function
                }}
              >
                {t("cancel")}
              </Link>
            ) : (
              ""
            )}
          </div>
        </div>
      </Card>

      <Modal
        className="modalError receiveModal"
        show={show}
        onHide={handleClose}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("purchaseOrderCheck")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.message_en ? stock.message_en : "NULL"}
              </p>
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.message_th ? stock.message_th : "NULL"}
              </p>
              <div className="closeBtnRece">
                <button onClick={closeIcon}>{t("close")}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default BillingNoteCreate;
