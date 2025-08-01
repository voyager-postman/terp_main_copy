import axios from "../../Url/Api";
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
import moment from "moment";
import MySwal from "../../swal";
const BillingNote = () => {
  const [t, i18n] = useTranslation("global");
  const [errorMessage, setErrorMessage] = useState("");

  const [roundingData, setRoundingData] = useState("");
  const [VATTotal, setVATTotal] = useState(0);
  const [WHTTotal, setWHTTotal] = useState(0);
  const [TotalBeforeTaxTotal, setTotalBeforeTaxTotal] = useState(0);
  const [sumAmountToPay, setSumAmountToPay] = useState(0);
  const [singleFilterData, setSingleFilterData] = useState("");
  const [paymentAmmountNew, setPaymentAmmountNew] = useState("");
  const [roundingNew, setRoundingNew] = useState("");
  const [hasUserChangedValues, setHasUserChangedValues] = useState(false);
  const [procesureResult, setProcesureResult] = useState("");
  const [amountToPayNew, setAmountToPayNew] = useState("");
  const [depositAvailableNew, setDepositAvailableNew] = useState("");
  const [columns, setColumns] = useState([]);

  const [depositUsedNew, newDepositUsedNew] = useState("");
  const [vatNew, setVatNew] = useState("");
  const [whtNew, setWhtNew] = useState("");
  const [singlePodId, setSinglePodId] = useState("");
  const [basePayment, setBasePayment] = useState(0); // from left_pay
  const [roundingNew1, setRoundingNew1] = useState("0");
  const [totalBeforText, setTotalBeforText] = useState("0");
  const [leftRoundingNew, setLeftRoundingNew] = useState("");
  const [show1, setShow1] = useState("");

  const handleClose1 = () => setShow1(false);
  const closeIcon1 = () => {
    setShow1(false);
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
      setFormData({});
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
        // setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCombinedPayment();
  }, []);
  const billingNote = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 0 : 1;

    axios
      .post(`${API_BASE_URL}/BillingNoteView`, {
        LANG: langValue,
      })
      .then((response) => {
        const { data: rows = [], head = {} } = response.data;

        // Step 1: Create dynamic columns from head
        const generatedColumns = Object.entries(head)
          .filter(([key]) => key !== "ID")
          .map(([key, label]) => ({
            Header: t(label || key),
            accessor: key,
          }));

        // Step 2: Add actions column
        generatedColumns.push({
          Header: t("actions"),
          accessor: "actions",
          Cell: ({ row }) => {
            const a = row.original;
            return (
              <>
                <div className="editIcon">
                  <button
                    onClick={() =>
                      navigate("/billingNoteView", { state: { from: a } })
                    }
                  >
                    <i className="mdi mdi-eye" />
                  </button>
                  {!(a.Payment_Status === 3 || a.Payment_Status === 4) && (
                    <>
                      {/* <Link to="/billingNoteCreate" state={{ from: a }}>
                        <i className="mdi mdi-pencil pl-2" />
                      </Link> */}

                      <button
                        onClick={async () => {
                          try {
                            const res = await axios.post(
                              `${API_BASE_URL}/Checkeaccessfile`,
                              {
                                id: a.ID,
                                accesstype: 5, // Mark as in use
                              }
                            );

                            if (res?.data?.success) {
                              navigate("/billingNoteCreate", {
                                state: { from: a },
                              });
                            } else {
                              toast.warning(res?.data?.message);
                            }
                          } catch (error) {
                            console.error("Access API error:", error);
                            toast.error(t("genericError"));
                          }
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <i className="mdi mdi-pencil pl-2" />
                      </button>

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
                  <button
                    type="button"
                    className="SvgAnchor"
                    data-bs-toggle="modal"
                    data-bs-target="#modalCombine"
                    onClick={() => everyDataSet(a)}
                  >
                    <svg
                      className="SvgPdf"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#203764"
                    >
                      <title>pdf-generate</title>
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M14 9V3.5L19.5 9H14M7 12H8.5C9.3 12 10 12.67 10 13.5S9.3 15 8.5 15H7V12M8.5 13.2H8V14.3H8.5C8.8 14.3 9 14.05 9 13.8C9 13.45 8.8 13.2 8.5 13.2M11 12H12V13H13V12H14V15H13V14H12V15H11V12M15 12H16.5C17.33 12 18 12.67 18 13.5S17.33 15 16.5 15H15V12M16.5 13.2H16V14.3H16.5C16.8 14.3 17 14.05 17 13.8C17 13.45 16.8 13.2 16.5 13.2Z" />
                    </svg>
                  </button>
                </div>
              </>
            );
          },
        });

        setColumns(generatedColumns);
        setData(rows);
      })
      .catch((error) => {
        console.error("Error fetching Debit Note:", error);
        toast.error(t("genericError"));
      });
  };
  useEffect(() => {
    billingNote();
  }, []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("delete"),
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/DeleteBN`, {
            bn_id: id,
          });

          // Handle response
          if (response.data.success === false) {
            // Set modal message and show modal
            setErrorMessage(response.data);
            setShow1(true); // open modal
          } else {
            getCombinedPayment();
            billingNote();
            toast.success(t("combinedPaymentDeleteSuccess"));
          }
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };

  useEffect(() => {
    const deposit = parseFloat(depositAvailableNew) || 0;
    const finalPayment = basePayment - deposit;
    setPaymentAmmountNew(finalPayment >= 0 ? finalPayment.toFixed(2) : 0);
  }, [depositAvailableNew, basePayment]);

  useEffect(() => {
    console.log("payableDATA:", payableDATA);
    console.log("roundingAmount:", roundingAmount);
    console.log("depositAvailable:", depositAvailable);

    setTotalPaymentAmount(
      (Number(payableDATA) || 0) - (Number(depositAvailable) || 0)
    );
  }, [payableDATA, depositAvailable]);
  const everyDataSet = async (a) => {
    console.log(a);
    setSingleFilterData(a);
    setHasUserChangedValues(false); // reset change flag
    setSinglePodId(a);
    setDepositAvailableNew(a?.Available_deposit);
    setBasePayment(a?.left_pay || 0); // set it once
    setVatNew(a?.Vat_payment || 0);
    setWhtNew(a?.wht_payment || 0);
    setRoundingNew1(a?.Rounding || 0);
    setTotalBeforText(a?.Total_Before_Tax || 0);
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
    if (!selectedPaymentDate) {
      setShow2(true);
      return;
    }
    if (!selectedPaymentChannel) {
      setShow2(true);
      return;
    }

    const paymentData = {
      vendor_id: singlePodId.Vendor,
      Payment_Date: selectedPaymentDate,
      Payment_Channel: selectedPaymentChannel,
      Bank_Fees: bankChargeAmount,
      Rounding: roundingAmount,
      available_Deposit: depositAvailable,
      Payment_Amount: paymentAmmountNew,
      Notes: paymentNotes,
      Bank_Ref: bankReference,
      CPN_id: singlePodId.ID,
      amount_to_pay: (
        Number(paymentAmmountNew) +
        (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
          Number(vatNew) -
        (Number(paymentAmmountNew) + Number(depositAvailableNew)) *
          Number(whtNew) +
        (Number(roundingNew1) + Number(roundingNew))
      ).toFixed(2),
      Deposit_Used: Number(depositAvailableNew),
      VAT: (
        (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
        Number(vatNew)
      ).toFixed(2),
      WHT: (
        (Number(depositAvailableNew) + Number(paymentAmmountNew)) *
        Number(whtNew)
      ).toFixed(2),
      left_Rounding: Number(roundingNew1) + Number(roundingNew),
      Total_Before_Tax: Number(depositAvailableNew) + Number(paymentAmmountNew),
      User_id: localStorage.getItem("id"),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/POPayments`,
        paymentData
      );
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
      }
      getCombinedPayment();
      const updatedCollectPaymentId = response?.data.data;
      setCollectPaymentId(updatedCollectPaymentId);
    } catch (error) {
      console.error("Error submitting payment data", error);
    }
  };
  const inputRef = useRef(null); // Ref for input field

  return (
    <>
      <Card
        title={t("billingNoteManagement")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/billingNoteCreate")}
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
              <button
                type="button"
                onClick={paymentDataClear}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-9">
                  <div className="row">
                    {/* Payment Date */}
                    <div className="col-lg-6">
                      <div className="parentFormPayment">
                        <p>{t("paymentDate")}</p>
                        <DatePicker
                          selected={selectedPaymentDate}
                          onChange={(date) => setSelectedPaymentDate(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText={t("clickToSelectDate")}
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>

                    {/* Payment Channel */}
                    <div className="col-lg-6">
                      <div className="parentFormPayment autoComplete">
                        <p>{t("paymentChannel")}</p>
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
                            setSelectedPaymentChannel(newValue?.bank_id || "")
                          }
                          sx={{ width: 300 }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={t("searchChannel")}
                              InputLabelProps={{ shrink: false }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Bank Ref */}
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>{t("bankRef")}</p>
                        <input
                          type="text"
                          value={bankReference}
                          onChange={(e) => setBankReference(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Bank Charges */}
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>{t("bankCharges")}</p>
                        <input
                          type="text"
                          value={bankChargeAmount}
                          onChange={(e) => setBankChargeAmount(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Available Deposit */}
                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>{t("availableDeposit")}</p>
                        <input
                          type="text"
                          value={depositAvailableNew}
                          onChange={(e) => {
                            setHasUserChangedValues(true);
                            setDepositAvailableNew(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="parentFormPayment mt-3">
                        <p>{t("rounding")}</p>
                        <input
                          type="text"
                          value={roundingNew}
                          onChange={(e) => {
                            setHasUserChangedValues(true);
                            setRoundingNew(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="parentFormPayment mt-3">
                        <p>{t("paymentAmount")}</p>
                        <input
                          type="text"
                          value={paymentAmmountNew}
                          onChange={(e) => {
                            setHasUserChangedValues(true);
                            setPaymentAmmountNew(e.target.value); // Optional override
                          }}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 mt-3">
                      <div className="parentFormPayment">
                        <p>{t("notes")}</p>
                        <textarea
                          type="text"
                          value={paymentNotes}
                          onChange={(e) => setPaymentNotes(e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    {/* Rounding */}
                    {/* <div className="col-lg-6 mt-3">
                       <div className="parentFormPayment">
                         <p>Rounding</p>
                         <input
                           type="text"
                           value={roundingAmount}
                           onChange={(e) => setRoundingAmount(e.target.value)}
                         />
                       </div>
                     </div> */}

                    {/* Payment Amount */}
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="flex mt-5 pt-5 ps-3 totalBefore">
                    <div style={{ width: "85%" }}>
                      {/* Total Before Tax */}
                      <div className="flexBefore">
                        <div>
                          <strong>{t("totalBeforeTax")} </strong>
                        </div>
                        <div>
                          <span>
                            {Number(depositAvailableNew) +
                              Number(paymentAmmountNew)}
                          </span>
                        </div>
                      </div>

                      {/* VAT */}
                      <div className="flexBefore">
                        <div>
                          <strong>{t("vat")} : </strong>
                        </div>
                        <div>
                          <span>
                            {" "}
                            {(
                              (Number(depositAvailableNew) +
                                Number(paymentAmmountNew)) *
                              Number(vatNew)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* WHT */}
                      <div className="flexBefore">
                        <div>
                          <strong>{t("wht")} :</strong>
                        </div>
                        <div>
                          <span>
                            {(
                              (Number(depositAvailableNew) +
                                Number(paymentAmmountNew)) *
                              Number(whtNew)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Rounding Input */}
                      <div className="flexBefore">
                        <div>
                          <strong>{t("rounding")} :</strong>
                        </div>
                        <div>
                          <span>
                            {Number(roundingNew1) + Number(roundingNew)}
                          </span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>{t("deposit")} : </strong>
                        </div>
                        <div>
                          <span>{Number(depositAvailableNew)}</span>
                        </div>
                      </div>
                      {/* <div className="d-flex flexBefore">
                         <div className="me-3">
                           <strong>Rounding</strong>
                         </div>
                         {/* <input
                           type="number"
                           name="rounding"
                           value={roundingData}
                           onChange={handleRoundingChange}
                           onBlur={handleRoundingBlur}
                         /> */}
                      {/* <input
                           type="text"
                           value={roundingAmount}
                           onChange={(e) => setRoundingAmount(e.target.value)}
                         />
                       </div> */}

                      {/* Amount to Pay */}
                      <div className="flexBefore">
                        <div>
                          <strong>{t("amountToPay")} : </strong>
                        </div>
                        <div>
                          {/* <span>
                             {formatterTwo.format(
                               (Number(totalPaymentAmount) || 0) +
                                 (Number(totalPaymentAmount) || 0) *
                                   ((Number(singleFilterData?.VAT) || 0) /
                                     (Number(
                                       singleFilterData?.Total_Before_Tax
                                     ) || 1)) -
                                 (Number(totalPaymentAmount) || 0) *
                                   ((Number(singleFilterData?.WHT) || 0) /
                                     (Number(
                                       singleFilterData?.Total_Before_Tax
                                     ) || 1)) -
                                 roundingAmount
                             )}
                           </span> */}
                          <span>
                            {(
                              Number(paymentAmmountNew) +
                              (Number(paymentAmmountNew) +
                                Number(depositAvailableNew)) *
                                Number(vatNew) -
                              (Number(paymentAmmountNew) +
                                Number(depositAvailableNew)) *
                                Number(whtNew) +
                              (Number(roundingNew1) + Number(roundingNew))
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flexBefore">
                        <div>
                          <strong>{t("remainder")} : </strong>
                        </div>
                        <div>
                          <span>
                            {(
                              (Number(totalBeforText) -
                                (Number(depositAvailableNew) +
                                  Number(paymentAmmountNew))) *
                              (1 + Number(vatNew))
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
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
      <Modal
        className="modalError receiveModal"
        show={show1}
        onHide={handleClose1}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{
              backgroundColor: color,
            }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              {t("billingNote")}
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={closeIcon1}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body pt-0"
            style={{
              backgroundColor: color,
            }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              <p
                style={{
                  backgroundColor: color ? "" : "#631f37",
                }}
                className="mt-0 pt-0"
              >
                {errorMessage?.Message_EN}
              </p>
              <p
                style={{
                  backgroundColor: color ? "" : "#631f37",
                }}
                className="mt-0 pt-0"
              >
                {errorMessage?.Message_TH}
              </p>

              <div className="closeBtnRece">
                <button onClick={closeIcon1}>{t("close")}</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{
              backgroundColor: color,
            }}
          ></div>
        </div>
      </Modal>
    </>
  );
};

export default BillingNote;
