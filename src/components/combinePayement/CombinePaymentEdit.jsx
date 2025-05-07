import axios from "axios";
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
const CombinePaymentEdit = () => {
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const location = useLocation();
  const [dropdownItems, setDropdownItems] = useState([]);
  const [editDataShow, setEditDataShow] = useState([]);
  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [sumAmountToPay, setSumAmountToPay] = useState(0);

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
    navigate("/combinePayment");
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
  // const itemData1 = async () => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/PurchaseTypeItemsList`
  //     );
  //     setDropdownItems(response.data.data || []);
  //   } catch (error) {
  //     console.error("Error fetching purchase type items:", error);
  //   }
  // };
  // useEffect(() => {
  //   itemData1();
  // }, []);
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
      toast.success("Deleted Successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      getDetils(podId);
    } catch (e) {}
  };

  const [state, setState] = React.useState({
    ID: from?.ID,
    vendor_id: from?.Vendor,
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
    // No need to close the modal initially, keep it open until success
    // setModalOne(false);  <-- Removed
    console.log(editDataShow);
    const selectedRows = editDataShow
      .map((child, index) => ({
        CPN: from?.ID,
        PO_ID: child.PO_ID,
        Payment: Number.isNaN(parseFloat(amountToPay[index]))
          ? 0
          : parseFloat(amountToPay[index]),
      }))
      .filter((_, index) => childChecked?.[index]); // Ensure `childChecked` exists

    if (selectedRows.length === 0) {
      toast.error("Please select at least one record before submitting.");
      return;
    }

    const payload = { datas: selectedRows };
    console.log("Submitting Payload:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/AddCPNDetails`, {
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
        toast.success("CPN Details submitted successfully!");
        paymentTable10();

        setModalOne(false); // Close modal only when success is true
      } else {
        toast.error(result.message || "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  // const addPurchaseOrderDetails = async (id) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/addPurchaseOrderDetails`,
  //       {
  //         ID: id || from?.ID,
  //         data: formDataAdd, // Send the object directly
  //         user_id: localStorage.getItem("id"),
  //       }
  //     );
  //     getDetils(id);
  //     setModalOne(false);
  //     console.log(response.data);
  //     toast.success("Successfully", {
  //       autoClose: 5000,
  //       theme: "colored",
  //     });
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  useEffect(() => {
    if (state.vendor_id) {
      paymentTable10();
    }
  }, [state.vendor_id]);
  const paymentTable10 = () => {
    console.log(state.vendor_id);

    if (from?.ID) {
      axios
        .get(`${API_BASE_URL}/GetCombinedPaymentByID`, {
          params: { cpn_id: from.ID }, // ✅ Correct way to send query params
        })
        .then((response) => {
          console.log(response);
          setPaymentTableVender(response.data.cpn_details);
          setTotalDataDetails(response.data.totaldata);
          setTotalDataDetails1(response.data.cpn_data);
        })
        .catch((error) => {
          console.error("Error fetching details:", error);
        });
    }
    // axios
    //   .post(`${API_BASE_URL}/VendorCombinedPaymentDetails`, {
    //     vendor_id: state.vendor_id,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     setPaymentTableVender(res.data.data);
    //     // setTableSummary(res.data.totaldata);
    //   })
    //   .catch((error) => {
    //     console.log("There was an error fetching the data!", error);
    //   });
  };
  const deleteOrder = async (id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/DeletePurchase`, {
        ID: id,
        user_id: localStorage.getItem("id"),
      });
      console.log(response);
      // toast.success(response.data.Message_EN);
      // toast.success(response.data.Message_TH);
      navigate("/combinePayment");
    } catch (e) {
      toast.error("Something went wrong");
      console.log(e);
    }
  };
  const update = async (e) => {
    console.log(totalDataDetails1);
    setButtonClicked(false);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${"VendorFilteredPaymentDetails"}`,
        { vendor_id: totalDataDetails1?.Vendor, cpn_id: totalDataDetails1?.ID }
      );
      console.log(response);
      setEditDataShow(response?.data?.data);
      setStock(response?.data);

      // 🔥 Clear the item form fields for new entry
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

      // ✅ Keep the purchase order ID and vendor details
      setState((prevState) => ({
        ...prevState,
        ID: response.data?.ID || from?.ID || prevState.ID,
        vendor_id: prevState.vendor_id,
        created: prevState.created,
        supplier_invoice_number: prevState.supplier_invoice_number,
        supplier_invoice_date: prevState.supplier_invoice_date,
        supplier_dua_date: prevState.supplier_dua_date,

        rounding: prevState.rounding,
      }));
      setModalOne(true); // Show the modal
      if (response.status === 200) {
        if (response.data.success) {
          const id = response.data?.ID || from?.ID;
          console.log(id);

          setPodId(id); //  Clear podId to avoid fetching last item data
          setModalOne(true);
          // toast.success("Create Purchase Orders", {
          //   autoClose: 5000,
          //   theme: "colored",
          // });
        }

        // else {
        //   setShow(true);
        // }
      }
    } catch (e) {
      console.log(e);
      toast.error("An error has occurred", {
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

      // 🔥 Clear the item form fields for new entry
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

      // ✅ Keep the purchase order ID and vendor details
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
          navigate("/combinePayment");
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
      toast.error("An error has occurred", {
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

      // ✅ Ensure VAT updates dynamically when price, quantity, or VAT_Rate changes
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
    setFormDataAdd(item); // Set the selected item’s data
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
            `${API_BASE_URL}/DeleteCpnDetails`,
            {
              CPN_Details_id: id,
            }
          );
          console.log(response);
          paymentTable10();
          toast.success("Combined Payment  delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
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

  // Handle parent checkbox change
  // const handleParentChange = () => {
  //   const newCheckedState = !parentChecked;
  //   setParentChecked(newCheckedState);

  //   // Sync child checkboxes with parent
  //   const newChildChecked = {};
  //   Object.keys(childChecked).forEach((key) => {
  //     newChildChecked[key] = newCheckedState;
  //   });
  //   setChildChecked(newChildChecked);
  // };

  // // Handle individual child checkbox change
  // const handleChildChange = (id) => {
  //   const newChildChecked = { ...childChecked, [id]: !childChecked[id] };
  //   setChildChecked(newChildChecked);

  //   // Check if all checkboxes are checked to update parent checkbox
  //   const allChecked = Object.values(newChildChecked).every((value) => value);
  //   setParentChecked(allChecked);
  // };
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

    // Update all child checkboxes
    const updatedChildren = {};
    editDataShow.forEach((_, index) => {
      updatedChildren[index] = newChecked;
    });

    setChildChecked(updatedChildren);

    // Calculate sum when selecting all
  };
  const handleChildChange = (index) => {
    const updatedChildren = {
      ...childChecked,
      [index]: !childChecked[index], // Toggle individual checkbox
    };

    setChildChecked(updatedChildren);

    // Check if all children are selected
    const allChecked = Object.values(updatedChildren).every(Boolean);
    setParentChecked(allChecked);

    // Update sum based on selection
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
    setAmountToPay((prev) => {
      const updatedAmounts = {
        ...prev,
        [index]: value, // Update specific index
      };

      // Recalculate VAT & WHT dynamically after updating amountToPay

      return updatedAmounts;
    });
  };

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

  // useEffect(() => {
  //   let sumAmountToPay = 0;
  //   let sumVAT = 0;
  //   let sumWHT = 0;
  //   let sumTotalBeforeTax = 0;
  //   let sumRounding = 0;

  //   paymentTableVender.forEach((child, index) => {
  //     const amountToPayValue = parseFloat(amountToPay[index] || 0);
  //     const totalBeforeTax = parseFloat(child.Total_Before_Tax || 1); // Avoid division by zero
  //     const vatValue = parseFloat(child.VAT || 0);
  //     const whtValue = parseFloat(child.WHT || 0);

  //     sumAmountToPay += amountToPayValue;
  //     sumVAT += (amountToPayValue * vatValue) / totalBeforeTax;
  //     sumWHT += (amountToPayValue * whtValue) / totalBeforeTax;
  //     sumTotalBeforeTax += totalBeforeTax;
  //     sumRounding += parseFloat(child.Rounding || 0);
  //   });
  //   console.log(sumVAT);
  //   console.log(sumWHT);
  //   console.log(sumTotalBeforeTax);
  //   console.log(sumRounding);
  //   setVATTotal(sumVAT);
  //   setWHTTotal(sumWHT);
  //   setTotalBeforeTaxTotal(sumTotalBeforeTax);
  //   setRoundingData(sumRounding);
  // }, [amountToPay]); // Runs every time "Amount to Pay" changes
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
    if (!state.supplier_dua_date || !state.supplier_invoice_date) {
      toast.error("Missing required fields! Please check the form.");
      return;
    }

    const selectedRows = paymentTableVender.map((child, index) => ({
      ID: child?.ID ?? null, // Ensure ID exists
      CPN: totalDataDetails1?.ID ?? "", // Ensure valid CPN
      PO_ID: child?.PO_ID ?? "", // Ensure PO_ID exists
      Payment: parseFloat(amountToPay[index] || 0), // Ensure it's a valid number
    }));

    const userId = localStorage.getItem("id");

    const payload = {
      vendor_id: totalDataDetails1.Vendor,
      Payment_Date: state.supplier_dua_date,
      due_date: state.supplier_invoice_date,
      user_id: userId,
      cpn_id: totalDataDetails1?.ID ?? "",
      datas: selectedRows,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/AddCombinedPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      toast.success("Payment Updated  successfully!");
      paymentTable10();
      navigate("/combinePayment");
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <>
      <Card
        title={`Combined Payment / ${from?.ID ? " Update" : "Create"} Form`}
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
                          <h6 className="me-2">Combine Payment Number : </h6>
                          <p>{from?.CPNCODE}</p>
                        </div>

                        <div className="d-flex">
                          <h6 className="me-2">Vendor : </h6>
                          <p>{from?.vendor_name}</p>
                        </div>
                      </div>

                      <div className="col-lg-3 form-group">
                        <h6>Combined Payment Date</h6>
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
                          customInput={<CustomInput />} // Ensure you have the `CustomInput` component defined or imported
                        />
                      </div>
                      <div className="col-lg-3 form-group">
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
                          placeholderText="dd/MM/yyyy"
                          customInput={<CustomInput />} // Ensure `CustomInput` is defined or remove this line if not needed
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row cratePurchase">
                      <div className="col-lg-3 form-group autoComplete">
                        <div className="d-flex">
                          <h6 className="me-2">Vendor : </h6>
                        </div>

                        <Autocomplete
                          options={
                            vendorList?.map((vendor) => ({
                              id: vendor.ID,
                              name: vendor.name,
                            })) || []
                          } // Map the vendor list to create options with `id` and `name`
                          getOptionLabel={(option) => option.name || ""} // Display the vendor name
                          value={
                            vendorList
                              ?.map((vendor) => ({
                                id: vendor.ID,
                                name: vendor.name,
                              }))
                              .find(
                                (option) => option.id === state.vendor_id
                              ) || null
                          } // Find the selected vendor by `vendor_id`
                          onChange={(e, newValue) => {
                            setState({
                              ...state,
                              vendor_id: newValue?.id || "",
                              vendor_name: newValue?.name || "",
                            }); // Update `state.vendor_id` with the selected option's `id`
                          }}
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Vendor" // Adds a placeholder
                              InputLabelProps={{ shrink: false }} // Prevents floating label
                            />
                          )}
                        />
                      </div>
                      <div className="col-lg-3">
                        <h6 className="me-2">Combined Payment Number : </h6>
                        <input type="number" />
                      </div>
                      <div className="col-lg-3 form-group">
                        <h6>Combined Payment Date</h6>
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
                          customInput={<CustomInput />} // Ensure you have the `CustomInput` component defined or imported
                        />
                      </div>
                      <div className="col-lg-3 form-group">
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
                          placeholderText="dd/MM/yyyy"
                          customInput={<CustomInput />} // Ensure `CustomInput` is defined or remove this line if not needed
                        />
                      </div>
                    </div>
                  )}
                  <div className="addButton">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={update}
                    >
                      Add
                    </button>
                    {modalOne && (
                      <div
                        className="fixed inset-0 flex items-center justify-center"
                        style={{ zIndex: "999" }}
                      >
                        <div
                          className="fixed w-screen h-screen bg-black/20"
                          onClick={handleCloseModalOne}
                        />
                        <div
                          className="bg-white rounded-lg shadow-lg max-w-md w-full"
                          style={{ maxWidth: "1530px" }}
                        >
                          <div className="crossArea">
                            <h3>Edit Details</h3>
                            <p onClick={handleCloseModalOne}>
                              <CloseIcon />
                            </p>
                          </div>
                          <div className="formEan formCreate">
                            <div className="modal-body modalShipTo p-0 ">
                              {/* {/ <h1>hello</h1> /} */}

                              <div className="addMOdalContent formCreate mt-0 px-2">
                                <div className="row mt-4 tableCombinePayment">
                                  <div className="tableCreateClient tableLr tablepayment">
                                    <table>
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
                                          {" "}
                                          CPN Number
                                        </th>
                                        <th style={{ width: "130px" }}>
                                          {" "}
                                          Issue Date{" "}
                                        </th>
                                        <th style={{ width: "130px" }}>
                                          {" "}
                                          Due Date
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          Total Before Tax
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          Past Payment
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          Net Payable{" "}
                                        </th>
                                        <th
                                          className="text-center"
                                          style={{ width: "150px" }}
                                        >
                                          FX
                                        </th>
                                        <th
                                          style={{ width: "150px" }}
                                          className="text-center"
                                        >
                                          Amount To Pay
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
                                          <td className="text-center">THB</td>
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
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer justify-center">
                            <button
                              type="button"
                              className="UpdatePopupBtn btn btn-primary mb-4"
                              onClick={() => handleSubmitVenderData()}
                            >
                              Submit
                            </button>
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
                          <th>CPN Number</th>
                          <th>Issue Date</th>
                          <th>Due Date</th>
                          <th>Total Before Tax</th>
                          <th>Past Payment</th>
                          <th>Net Payment</th>
                          <th>FX</th>
                          <th>Amount to Pay</th>
                          <th>Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentTableVender?.map((child, index) => (
                          <tr>
                            <td className="text-center">{child.POCODE}</td>
                            <td className="text-center">
                              {new Date(child.PO_date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="text-center">
                              {new Date(child.Due_Date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="text-right">
                              {formatNumber(child.Total_Before_Tax)}
                            </td>
                            <td className="text-right">
                              {formatNumber(child.Payment_amount)}
                            </td>
                            <td className="text-right">
                              {formatNumber(child.Payable)}
                            </td>
                            <td className="text-right">THB</td>
                            <td style={{ width: "250px" }}>
                              <input
                                style={{ border: "2px solid #203764" }}
                                type="number"
                                value={amountToPay[index] || 0}
                                onChange={(e) =>
                                  handleAmountChange(
                                    index,
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </td>
                            <td>
                              <div className="userIcon ">
                                <button
                                  type="button"
                                  onClick={() => deleteOrderPayment(child.ID)}
                                >
                                  <i className="mdi mdi-delete " />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* table new end */}
                  <div className="flex justify-content-end mt-4 totalBefore">
                    <div>
                      {/* <div className="flexBefore">
                        <div>
                          <strong>Payable : </strong>
                        </div>
                        <div>
                          <span>{formatterTwo.format(sumAmountToPay)}</span>
                        </div>
                      </div> */}
                      <div className="flexBefore">
                        <div>
                          <strong>Total Before Tax : </strong>
                        </div>
                        <div>
                          <span> {formatterTwo.format(sumAmountToPay)}</span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>VAT : </strong>
                        </div>
                        <div>
                          <span>{formatterTwo.format(VATTotal)}</span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>WHT : </strong>
                        </div>
                        <div>
                          <span>{formatterTwo.format(WHTTotal)}</span>
                        </div>
                      </div>
                      <div className=" d-flex flexBefore">
                        <div>
                          <strong>Rounding</strong>
                        </div>
                        <input
                          type="number"
                          name="rounding"
                          value={roundingData}
                          onChange={handleRoundingChange}
                          onBlur={handleRoundingBlur}
                        />
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>Amount to Pay : </strong>
                        </div>
                        <div>
                          <span>
                            {formatterTwo.format(
                              (sumAmountToPay ?? 0) +
                                (VATTotal ?? 0) -
                                (WHTTotal ?? 0) +
                                roundingData
                            )}
                          </span>
                        </div>
                      </div>
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
              {from?.ID ? "Update" : "Create"}
            </button>
            <Link
              className="btn btn-danger"
              to={from?.ID ? "/combinePayment" : "/combinePayment"} // Redirect if ID
              exists
              onClick={(e) => {
                if (!podId) return; // Do nothing if podId is missing
                e.preventDefault(); // Prevent navigation if deleting
                deleteOrder(podId); // Call delete function
              }}
            >
              Cancel
            </Link>
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
              Purchase Order Check
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
                <button onClick={closeIcon}>Close</button>
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

export default CombinePaymentEdit;
