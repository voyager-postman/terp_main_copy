import axios from "axios";
import { useEffect, useMemo, useState, useRef } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { Button, Modal } from "react-bootstrap";
import { useQuery } from "react-query";
import DatePicker from "react-datepicker";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import MySwal from "../../swal";
const CombinePayment = () => {
  const [t, i18n] = useTranslation("global");
  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [paymentSections, setPaymentSections] = useState({
    labels: {},
    data: {},
  });
  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [sumAmountToPay, setSumAmountToPay] = useState(0);
  const [singleFilterData, setSingleFilterData] = useState("");
  const [paymentAmmountNew, setPaymentAmmountNew] = useState("");
  const [roundingNew, setRoundingNew] = useState("");
  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [procesureResult, setProcesureResult] = useState("");
  const [amountToPayNew, setAmountToPayNew] = useState("");
  const [depositAvailableNew, setDepositAvailableNew] = useState("");
  const [depositValue, setDepositValue] = useState("");
  const [depositUsedNew, newDepositUsedNew] = useState("");
  const [vatNew, setVatNew] = useState("");
  const [whtNew, setWhtNew] = useState("");
  const [singlePodId, setSinglePodId] = useState("");
  const [basePayment, setBasePayment] = useState(0); // from left_pay
  const [roundingNew1, setRoundingNew1] = useState("0");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [lastInseartId, setLastInseartId] = useState("");

  const [leftRoundingNew, setLeftRoundingNew] = useState("");
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
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  const handleRoundingBlur = (e) => {
    // Reset to 0 if input is empty or only "-" on blur
    if (e.target.value === "" || e.target.value === "-") {
      setRoundingData(0);
    }
  };
  useEffect(() => {
    const modal = document.getElementById("modalCombine");
    modal?.addEventListener("hidden.bs.modal", () => {
      // setFormData({});
    });

    return () => {
      modal?.removeEventListener("hidden.bs.modal", () => {});
    };
  }, []);

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
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);

  const [singleDataShow, setSingleDataShow] = useState("");

  const [selectedPaymentDate, setSelectedPaymentDate] = useState(null);
  const { data: paymentChannle } = useQuery("PaymentChannela");
  const [paymentChannel, setPaymentChannel] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [bankChargeAmount, setBankChargeAmount] = useState("0");
  const [depositAvailable, setDepositAvailable] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");

  const [roundingAmount, setRoundingAmount] = useState("0");
  const [totalPaymentAmount, setTotalPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [payableDATA, setPayableData] = useState("");
  const [show2, setShow2] = useState(false);
  const [color, setColor] = useState(false);

  const navigate = useNavigate();
  const closeIcon2 = () => {
    setShow2(false);
    // navigate("/purchase_orders");
  };
  const newFormatter5 = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const handleClose2 = () => setShow2(false);
  const getCombinedPayment = () => {
    axios
      .get(`${API_BASE_URL}/getCombinedPayment`)
      .then((response) => {
        console.log(response);
        setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCombinedPayment();
  }, []);

  const updateEanStatus = (eanID) => {
    const request = {
      ean_id: eanID,
    };
    axios
      .post(`${API_BASE_URL}/eanStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success(t("statusUpdated"), {
            autoClose: 1000,
            theme: "colored",
          });
          getCombinedPayment();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
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
      confirmButtonText: "delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeleteCpnPayment`,
            {
              id: id,
            }
          );
          console.log(response);
          getCombinedPayment();
          toast.success(t("combinedPaymentDeleteSuccess"));
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  const deleteOrderWithPayment = async () => {
    try {
      // ✅ Delete API
      await axios.post(`${API_BASE_URL}/EXPPaymentDelete`, {
        Expense_Payment_ID: lastInseartId || "",
      });

      // ✅ Hide modal after delete
      const modal1 = document.getElementById("modalCombine");
      if (modal1) {
        const modalInstance1 = bootstrap.Modal.getInstance(modal1);
        modalInstance1?.hide();
      }
      navigate("/combinePayment");
      toast.success(t("deleteSuccess"));
    } catch (e) {
      console.error("Delete error:", e);
      toast.error(t("deleteError"));
    }
  };
  useEffect(() => {
    const deposit = parseFloat(depositAvailableNew) || 0;
    const finalPayment = basePayment - deposit;
    setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  }, [depositAvailableNew, basePayment]);
  const columns = useMemo(
    () => [
      {
        Header: t("cpnNumber"),
        accessor: "CPNCODE",
      },
      {
        Header: t("vendor"),
        accessor: "vendor_name",
      },
      {
        Header: t("date"),
        accessor: (a) => {
          const formattedDate = new Date(a.CPN_Date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          );
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: t("dueDate"),
        accessor: (a) => {
          const formattedDate = new Date(a.Due_Date).toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }
          );
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: t("count"),
        accessor: (a) => <div>{a.POCount}</div>,
      },
      {
        Header: t("amount"),
        accessor: (a) => (
          <div style={{ textAlign: "right" }}>
            {formatterTwo.format(a.Total_After_Tax)}
          </div>
        ),
      },
      {
        Header: t("payable"),
        accessor: (a) => (
          <div style={{ textAlign: "right" }}>
            {formatterTwo.format(a.Payable)}
          </div>
        ),
      },
      {
        Header: t("actions"),
        accessor: (a) => (
          <div className="editIcon">
            <button
              onClick={() =>
                navigate("/combinePaymentView", { state: { from: a } })
              }
            >
              <i className="mdi mdi-eye" />
            </button>
            {!(a.Payment_Status === 3 || a.Payment_Status === 4) && (
              <>
                <Link to="/combinePaymenEdit" state={{ from: a }}>
                  <i className="mdi mdi-pencil pl-2" />
                </Link>

                <button type="button" onClick={() => deleteOrder(a.ID)}>
                  <i className="mdi mdi-delete " />
                </button>
              </>
            )}

            {!(a.Payment_Status === 4) && (
              <button
                type="button"
                className="SvgAnchor"
                data-bs-toggle="modal"
                data-bs-target="#modalCombine"
                onClick={() => everyDataSet(a)}
              >
                <svg
                  className="SvgQuo"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>cash-check</title>
                  <path d="M3 6V18H13.32C13.1 17.33 13 16.66 13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3M12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61C14.85 10.28 13.59 8.97 12 9M21.63 12.27L17.76 16.17L16.41 14.8L15 16.22L17.75 19L23.03 13.68L21.63 12.27Z"></path>
                </svg>
              </button>
            )}
          </div>
        ),
      },
    ],
    [t]
  );
  const handlePaymentChange = (field, value) => {
    // Update state
    switch (field) {
      case "Payment_Date":
        setSelectedPaymentDate(value);
        break;
      case "Payment_Channel":
        setSelectedPaymentChannel(value);
        break;
      case "Bank_Ref":
        setBankReference(value);
        break;
      case "Bank_Fees":
        setBankChargeAmount(value);
        break;
      case "available_Deposit":
        setDepositAvailableNew(value);
        break;
      case "Rounding":
        setRoundingNew(value);
        break;
      case "Payment_Amount":
        setPaymentAmmountNew(value);
        break;
      case "Notes":
        setPaymentNotes(value);
        break;
      default:
        break;
    }

    // Build payload with only the changed field
    const payload = {
      Expense_Payment_ID: lastInseartId,
      User_ID: localStorage.getItem("id"),
      [field]: value, // ✅ only the changed field gets sent
    };

    axios
      .post(`${API_BASE_URL}/POCPNPayment`, payload)
      .then((res) => {
        console.log(`✅ Updated ${field}:`, res.data);
        if (res?.data?.success) {
          toast.success(res?.data?.message || "Field updated successfully ✅");
        }

        paymentViewSection();
      })
      .catch((err) => {
        console.error(`❌ Failed to update ${field}:`, err);
      });
  };
  const paymentViewSection = () => {
    axios
      .post(`${API_BASE_URL}/EXPPaymentView`, {
        PO_ID: "", // ✅ your PO_ID
        CPN: singlePodId?.ID, // ✅ CPN if required
      })
      .then((res) => {
        setPaymentSections({
          labels: res.data.section_label || {},
          data: res.data.section_data || {},
        });
        console.log("Payment updated ✅", res.data);
      })
      .catch((err) => {
        console.error("Payment update failed ❌", err);
      });
  };
  useEffect(() => {
    paymentViewSection();
  }, []);
  useEffect(() => {
    console.log("payableDATA:", payableDATA);
    console.log("roundingAmount:", roundingAmount);
    console.log("depositAvailable:", depositAvailable);

    setTotalPaymentAmount(
      (Number(payableDATA) || 0) - (Number(depositAvailable) || 0)
    );
  }, [payableDATA, depositAvailable]);
  const everyDataSet = async (a) => {
    // setDepositAvailableNew(a?.Available_deposit);
    setDepositValue(a?.Available_deposit);
    console.log("everyDataSet called with:", a);

    try {
      setHasUserChangedValues(false);
      setSinglePodId(a);

      const payload = {
        PO_ID: a?.PO_ID,
        CPN: a?.ID, // ✅ use correct field
        User_ID: localStorage.getItem("id"),
      };

      console.log("Payload sent:", payload);

      const res1 = await axios.post(`${API_BASE_URL}/EXPPaymentStep1`, payload);

      console.log("EXPPaymentStep1 response:", res1.data);

      if (res1?.data?.success) {
        const newId = res1?.data?.data?.last_insert_id;

        setLastInseartId(newId);

        paymentViewSection();
      }
    } catch (err) {
      console.error("Error in EXPPaymentStep1:", err);
    }
  };

  const paymentDataClear = () => {
    // Fix these lines:
    setDepositAvailableNew("");
    setRoundingNew("");
    setPaymentAmmountNew("");
    setSelectedPaymentDate(null);
    setSelectedPaymentChannel("");
    setBankReference("");
    setBankChargeAmount("0");
    setDepositAvailable("");
    setRoundingAmount("");
    setTotalPaymentAmount("");
    setPaymentNotes("");
  };

  const submitPaymentData = async () => {
    // if (!selectedPaymentDate) {
    //   setShow2(true);
    //   return;
    // }
    // if (!selectedPaymentChannel) {
    //   setShow2(true);
    //   return;
    // }

    // const paymentData = {
    //   vendor_id: singlePodId.Vendor,
    //   Payment_Date: selectedPaymentDate,
    //   Payment_Channel: selectedPaymentChannel,
    //   Bank_Fees: bankChargeAmount,
    //   Rounding: roundingAmount,
    //   available_Deposit: depositAvailable,
    //   Payment_Amount: paymentAmmountNew,
    //   Notes: paymentNotes,
    //   Bank_Ref: bankReference,
    //   CPN_id: singlePodId.ID,
    //   amount_to_pay: (
    //     Number(paymentAmmountNew) +
    //     (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
    //       Number(vatNew) -
    //     (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
    //       Number(whtNew) +
    //     (Number(roundingNew1) + Number(roundingNew))
    //   ).toFixed(2),
    //   Deposit_Used: Number(depositAvailableNew),
    //   VAT: (
    //     (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
    //     Number(vatNew)
    //   ).toFixed(2),
    //   WHT: (
    //     (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
    //     Number(whtNew)
    //   ).toFixed(2),
    //   left_Rounding: Number(roundingNew1) + Number(roundingNew),
    //   Total_Before_Tax: Number(depositAvailableNew) + Number(paymentAmmountNew),
    //   User_id: localStorage.getItem("id"),
    // };

    // console.log(paymentData);

    try {
      // Send POST request to insertClientPayment endpoint (first API)
      const response = await axios.post(`${API_BASE_URL}/EXPPaymentStep2`, {
        ID: lastInseartId,
      });
      console.log("Payment data submitted successfully", response);
      getCombinedPayment();

      if (response?.data?.success) {
        // If success = true, show success toast
        setPaymentAmmountNew("");
        setProcesureResult("");
        setRoundingNew("");
        setSelectedPaymentDate(null);
        setSelectedPaymentChannel("");
        setBankReference("");
        setBankChargeAmount("0");
        setDepositAvailable("");
        setRoundingAmount("");
        setTotalPaymentAmount("");
        setPaymentNotes("");
        toast.success(response.data?.message);
        let modalElement = document.getElementById("modalCombine");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      } else {
        toast.warning(response.data.message);
        // If success = false, show modal with API message
        // setShow1(true);
        // setStock1(response.data || "Procedure returned an error");
      }
      getCombinedPayment();
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);

      // Hide modal after successful submission
    } catch (error) {
      // Handle error case for first API
      console.error("Error submitting payment data", error);
      // toast.error("Something went wrong");
    }
  };
  const inputRef = useRef(null); // Ref for input field

  const handleChangeAmount = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    setTotalPaymentAmount(rawValue);
  };

  return (
    <>
      <Card
        title={t("combinedPaymentManagement")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/combinePaymenEdit")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>

      {/* paymentIcon */}
      <div
        className="modal fade "
        id="modalCombine"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("payment")}
              </h1>
              {/* <button
                type="button"
                onClick={paymentDataClear}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button> */}
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-9">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="parentFormPayment">
                        <p> {t("paymentDate")}</p>
                        <DatePicker
                          selected={
                            selectedPaymentDate &&
                            !isNaN(new Date(selectedPaymentDate))
                              ? new Date(selectedPaymentDate)
                              : null
                          }
                          onChange={(date) => {
                            const formattedDate = date
                              ? date.toISOString().split("T")[0] // ✅ store as YYYY-MM-DD
                              : null;

                            setSelectedPaymentDate(formattedDate);

                            // ✅ trigger API call like before
                            handlePaymentChange("Payment_Date", formattedDate);
                          }}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Click to select a date"
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="parentFormPayment autoComplete">
                        <p> {t("paymentChannel")}</p>
                        <Autocomplete
                          disablePortal
                          options={paymentChannle || []}
                          value={
                            (paymentChannle || []).find(
                              (channel) =>
                                channel.bank_id === selectedPaymentChannel
                            ) || null
                          }
                          getOptionLabel={(option) =>
                            option.Bank_nick_name || ""
                          }
                          onChange={(e, newValue) =>
                            handlePaymentChange(
                              "Payment_Channel",
                              newValue?.bank_id || ""
                            )
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search Payment Channel"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("bankRef")}</p>
                        <input
                          type="text"
                          value={bankReference}
                          onChange={(e) =>
                            handlePaymentChange("Bank_Ref", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("bankCharges")}</p>
                        <input
                          type="text"
                          value={bankChargeAmount}
                          onChange={(e) =>
                            handlePaymentChange("Bank_Fees", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>
                          {t("availableDeposit")} ({depositValue}){" "}
                        </p>
                        <input
                          type="number"
                          value={depositAvailableNew}
                          onChange={(e) =>
                            handlePaymentChange(
                              "available_Deposit",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("rounding")}</p>
                        <input
                          type="text"
                          value={roundingNew}
                          onChange={(e) =>
                            handlePaymentChange("Rounding", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="parentFormPayment col-lg-6 mt-3">
                      <p> {t("paymentAmount")}</p>
                      <input
                        type="text"
                        value={paymentAmmountNew}
                        onChange={(e) =>
                          handlePaymentChange("Payment_Amount", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p> {t("notes")}</p>
                        <textarea
                          value={paymentNotes}
                          onChange={(e) =>
                            handlePaymentChange("Notes", e.target.value)
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="flex ps-3 pt-5 mt-4 totalBefore">
                    <div className="pe-3" style={{ width: "85%" }}>
                      {Object.keys(paymentSections.labels).map((key) => (
                        <div className="flexBefore" key={key}>
                          <div>
                            <strong>{paymentSections.labels[key]}</strong>
                          </div>
                          <div>
                            <span>{paymentSections.data[key]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={submitPaymentData}
                className="btn btn-primary"
              >
                {t("submit")}
              </button>
              <button
                type="button"
                onClick={deleteOrderWithPayment}
                className="btn btn-primary"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* paymentIcon end */}

      <Modal
        className="modalError receiveModal"
        show={show2}
        onHide={handleClose2}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("purchasePaymentCheck")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon2}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              {!selectedPaymentDate ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {t("paymentDateRequired")}
                </p>
              ) : (
                ""
              )}

              {!selectedPaymentChannel ? (
                <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                  {"Payment Channel is Required"}
                </p>
              ) : (
                ""
              )}

              <div className="closeBtnRece">
                <button onClick={closeIcon2}>{"close"}</button>
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

export default CombinePayment;
