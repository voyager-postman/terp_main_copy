import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import { toast } from "react-toastify";
import MySwal from "../../swal";
import { Link, useLocation, useNavigate } from "react-router-dom";
const InvoiceEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loadingModal = MySwal.mixin({
    title: "Calculating...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const { data: unit } = useQuery("getAllUnit");
  const { from } = location.state || {};
  const [data, setData] = useState("");
  const [unitPrices, setUnitPrices] = useState({});
  const [adjustedPrices, setAdjustedPrices] = useState({});
  const [data1, setData1] = useState("");
  const [calculateListData, setCalculateListData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => {
    setCalculateListData([]);
    setShowModal(false); // Hide the modal
  };
  console.log(from);
  useEffect(() => {
    setData(from);
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getInvoiceDeatilsTable?invoice_id=${from?.Invoice_id}`,
    {
      enabled: !!from?.Invoice_id,
    }
  );
  console.log(details);
  const { data: summary, refetch: getSummary } = useQuery(
    `getInvoiceSummary?invoice_id=${from?.Invoice_id}`,
    {
      enabled: !!from?.Invoice_id,
    }
  );
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/getInvoiceById`, {
        params: {
          invoiceId: from?.Invoice_id,
        },
      })
      .then((response) => {
        console.log(response.data.data);

        setData1(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [from?.Invoice_id]);

  const calculateList = async () => {
    if (from?.Invoice_id) {
      try {
        const response = await axios.post(`${API_BASE_URL}/InvoiceCostModal`, {
          invoice_id: from?.Invoice_id,
        });
        console.log(response);

        setCalculateListData(response.data.data);
      } catch (e) {
        console.error("Something went wrong", e);
      }
    }
  };

  const calculated = async () => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/calculateInvoice`, {
        Invoice_id: from?.Invoice_id,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      loadingModal.close();
      toast.success("Invoice Calculated successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      calculateList();
      setShowModal(true);
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Something went wrong");
    }
  };
  const invoicePrice = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/InvoiceCalculatedPrice`,
        {
          Invoice_ID: from?.Invoice_id,
        }
      );
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Use Invoice Price successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const reduceRebate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RebateReduceInvoice`, {
        Invoice_id: from?.Invoice_id,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Reduce Rebate successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const recordRebate = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/RebateRecord`, {
        Invoice_id: from?.Invoice_id,
      });
      console.log(response);
      getOrdersDetails();
      oneQoutationDAta();
      toast.success("Record Rebate successfully", {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Something went wrong");
    }
  };
  const closeFunction = () => {
    // First navigate to the desired route
    navigate("/invoice");

    // Then call the API
    axios
      .post(`${API_BASE_URL}/calculateInvoice`, {
        Invoice_id: from?.Invoice_id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("API call error:", error);
        toast.error("Something went wrong");
      });
  };

  // const closeFunction = async () => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/calculateInvoice`, {
  //       Invoice_id: from?.Invoice_id,
  //     });
  //     console.log(response);
  //     navigate("/invoice");

  //   } catch (error) {
  //     console.error("API call error:", error);
  //     toast.error("Something went wrong");
  //   }
  // };
  useEffect(() => {
    if (details && details.length > 0) {
      const initialUnitPrices = {};
      const initialAdjustedPrices = {};
      details.forEach((item) => {
        initialUnitPrices[item.id_id] = item.Unit_id;
        initialAdjustedPrices[item.id_id] = item.adjusted_price;
      });
      setUnitPrices(initialUnitPrices);
      setAdjustedPrices(initialAdjustedPrices);
    }
  }, [details]);
  console.log(summary);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  // Handler function to update the state and call the API
  const handleAdjustedPriceChange = async (event, id_id) => {
    const newValue = event.target.value;
    setAdjustedPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        Invoice_id: from?.Invoice_id,
        adjusted_price: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleEditEan = async (event, id_id) => {
    const newValue = event.target.value;
    setUnitPrices((prev) => ({ ...prev, [id_id]: newValue }));

    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        Invoice_id: from?.Invoice_id,
        unit_id: newValue,
      });
      getOrdersDetails();
      console.log("API response:", response);
    } catch (error) {
      console.error("API call error:", error);
    }
  };

  const handleEditClick = async (id_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/EditInvoiceDetails`, {
        id_id: id_id,
        Invoice_id: from?.Invoice_id,
        // Other data you may need to pass
      });
      console.log("API response:", response);
      getOrdersDetails();
      toast.success("Invoice updated successfully");
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to update Invoice");
    }
  };
  const twoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const NoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const threeDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
  return (
    <div>
      <div
        className="px-2 py-4 main-content"
        style={{ minHeight: "calc(-148px + 100vh)" }}
      >
        <div className="container-fluid">
          <div>
            <div className="databaseTableSection pt-0">
              <div className="top-space-search-reslute">
                <div className="tab-content p-4 pt-0 pb-0">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                    >
                      <div className="d-flex exportPopupBtn" />
                      <div className="grayBgColor p-4 pt-2 pb-2">
                        <div className="row">
                          <div className="col-md-6">
                            <h6 className="font-weight-bolder mb-0 pt-2">
                              Invoice / Edit Form
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className=" mt-5 borderBottompurchase">
                        <div className="InvoceViewFlex">
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Invoice Number <span>:</span>
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Invoice_number}</p>
                              </div>
                            </div>
                          </div>
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Client <span>:</span>
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Client_name}</p>
                              </div>
                            </div>
                          </div>
                          <div className="invoiceViewTop">
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Ship To <span>:</span>
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Consignee_name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row purchaseViewRow mt-4">
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Ship Date <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{formatDate(data?.Ship_date)}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                AWB <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.bl}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Airport <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>
                                {data?.Airport} [{data?.Airport_IATA_code}]
                              </p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Airline <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>
                                {data?.Airline} [{data?.Airline_liner_code}]
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total Commission<span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{twoDecimal.format(data?.COMMISION)}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Total Rebate <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p> {data?.REBATE}</p>
                            </div>
                          </div>

                          {!(
                            (localStorage.getItem("level") === "Level 1" &&
                              localStorage.getItem("role") === "Admin") ||
                            localStorage.getItem("level") === "Level 5"
                          ) && (
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Total Profit <span>:</span>
                                </strong>
                              </div>
                              <div>
                                <p>
                                  {" "}
                                  {twoDecimal.format(data?.Invoice_profit)}
                                </p>
                              </div>
                            </div>
                          )}
                          {localStorage.getItem("level") !== "Level 5" && (
                            <div className="parentPurchaseView">
                              <div className="me-3">
                                <strong>
                                  Markup Rate <span>:</span>
                                </strong>
                              </div>
                              <div>
                                <p>{data?.Invoice_profit_percentage}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="col-lg-4">
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Currency <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.currency}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                Exchange Rate <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.fx_rate}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                FX Rebate <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.REBATE_FX}</p>
                            </div>
                          </div>
                          <div className="parentPurchaseView">
                            <div className="me-3">
                              <strong>
                                FX Commission <span>:</span>
                              </strong>
                            </div>
                            <div>
                              <p>{data?.COMMISION_FX}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row my-3">
                        <div className="col-lg-6">
                          <h5 className="itemInfo">Items Info :</h5>
                        </div>
                        <div className="col-lg-6 ">
                          <div className="addBtnEan calculateInvoice text-right">
                            <button
                              type="button"
                              onClick={calculated}
                              className="me-2"
                            >
                              Calculate
                            </button>
                            <button
                              type="button"
                              className="me-2"
                              onClick={invoicePrice}
                            >
                              Use Invoice Price
                            </button>
                            <button
                              type="button"
                              className="me-2"
                              onClick={reduceRebate}
                            >
                              Reduce Rebate
                            </button>
                            <button type="button" onClick={recordRebate}>
                              Record Rebate
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          id="datatable_wrapper"
                          className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                        >
                          <table
                            id="example"
                            className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                            style={{ width: "100%" }}
                          >
                            <thead>
                              <tr role="row " className="borderTh">
                                <th>ITF</th>
                                <th>Brand Name</th>
                                <th>Quantity</th>
                                <th> Unit</th>
                                <th>Number of Box</th>
                                <th>NW</th>
                                <th> Order Price</th>
                                <th> Calculate Price</th>
                                <th> Adjusted Price</th>
                                {!(
                                  (localStorage.getItem("level") ===
                                    "Level 1" &&
                                    localStorage.getItem("role") === "Admin") ||
                                  localStorage.getItem("level") === "Level 5"
                                ) && <th>Profit</th>}
                                <th>Action</th>
                              </tr>
                              {details?.map((item, i) => {
                                return (
                                  <tr
                                    className="rowCursorPointer orderViewRoew"
                                    data-bs-toggle="modal"
                                    data-bs-target="#myModal"
                                  >
                                    <td>{item.ITF_name}</td>
                                    <td>{item.brand_name}</td>
                                    <td>
                                      {threeDecimal.format(item.itf_quantity)}
                                    </td>
                                    <td>
                                      <div className="selectInvoiceView">
                                        <select
                                          name="unit_id"
                                          value={unitPrices[item.id_id] || ""}
                                          onChange={(e) =>
                                            handleEditEan(e, item.id_id)
                                          }
                                        >
                                          {unit?.map((unit) => (
                                            <option
                                              key={unit.unit_id}
                                              value={unit.unit_id}
                                            >
                                              {unit.unit_name_en}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </td>
                                    <td>
                                      {NoDecimal.format(item.Number_of_boxes)}
                                    </td>
                                    <td>
                                      {threeDecimal.format(item.net_weight)}
                                    </td>
                                    <td>
                                      {twoDecimal.format(item.order_price)}
                                    </td>
                                    <td>
                                      {twoDecimal.format(item.calculated_price)}
                                    </td>
                                    <td>
                                      <div className="selectInvoiceView">
                                        <input
                                          type="number"
                                          placeholder="123"
                                          value={
                                            twoDecimal.format(
                                              adjustedPrices[item.id_id]
                                            ) || ""
                                          }
                                          onChange={(e) =>
                                            handleAdjustedPriceChange(
                                              e,
                                              item.id_id
                                            )
                                          }
                                        />
                                      </div>
                                    </td>

                                    {!(
                                      (localStorage.getItem("level") ===
                                        "Level 1" &&
                                        localStorage.getItem("role") ===
                                          "Admin") ||
                                      localStorage.getItem("level") ===
                                        "Level 5"
                                    ) && (
                                      <td>{item.Invoice_profit_percentage}%</td>
                                    )}
                                    <td>
                                      <button
                                        onClick={() =>
                                          handleEditClick(item.id_id)
                                        }
                                        style={{
                                          background: "none",
                                          border: "none",
                                          cursor: "pointer",
                                          padding: 0,
                                        }}
                                      >
                                        <i
                                          className="mdi mdi-autorenew"
                                          style={{
                                            width: "20px",
                                            color: "#203764",
                                            fontSize: "22px",
                                            marginTop: "10px",
                                          }}
                                        />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </thead>
                          </table>
                          <div className="row py-4 px-4">
                            <div className="col-lg-3">
                              <div>
                                <b> Total NW : </b>
                                {(+data1?.nw || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total GW : </b>
                                {(+data1?.gw || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total Box : </b>
                                {(+data1?.box || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total CBM : </b>
                                {(+data1?.cbm || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total ITF : </b>
                                {(+data1?.Items || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b>Freight : </b>
                                {(+data1?.freight || 0).toLocaleString()}
                              </div>
                              <div>
                                <b>TransPort : </b>
                                {(+data1?.transport || 0).toLocaleString()}
                              </div>
                              <div>
                                <b>Clearance : </b>
                                {(+data1?.clearance || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b> Total FOB : </b>
                                {(+data1?.FOB || 0).toLocaleString()}
                              </div>
                              <div>
                                <b> Total CNF : </b>
                                {(+data1?.CNF || 0).toLocaleString()}
                              </div>
                              {!(
                                (localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                localStorage.getItem("level") === "Level 5"
                              ) && (
                                <div className="">
                                  <b> Total Profit : </b>
                                  {(
                                    +data1?.Invoice_profit || 0
                                  ).toLocaleString()}
                                </div>
                              )}
                              {localStorage.getItem("level") !== "Level 5" && (
                                <div style={{ marginLeft: "2px" }}>
                                  <b> Profit % : </b>
                                  {(
                                    +data1?.Invoice_profit_percentage || 0
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-3">
                              <div>
                                <b> Total CNF FX : </b>
                                {(+data1?.CNF_FX || 0).toLocaleString()}
                              </div>
                              <div>
                                <div>
                                  <b> Total Commission FX: </b>
                                  {(+data1?.COMMISION_FX || 0).toLocaleString()}
                                </div>
                                <div>
                                  <b> Total Rebate FX : </b>
                                  {(+data1?.REBATE_FX || 0).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn btn-danger" onClick={closeFunction}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl modalShipTo">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <i className="mdi mdi-close"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row tableCombinePayment">
                  <div className="tableCreateClient tablepayment">
                    <table>
                      <thead>
                        <tr>
                          <th>ITF</th>
                          <th>EXW</th>
                          <th>TC</th>
                          <th>Commission</th>
                          <th>FOB</th>
                          <th>GW</th>
                          <th>Freight</th>
                          <th>CNF</th>
                          <th>Margin</th>
                          <th>Fx Rate</th>
                          <th>Fx Rebate</th>
                          <th>Calculated Price</th>
                          <th>Final Price</th>
                          <th>Rebate</th>
                          <th>Base</th>
                          <th>Profit</th>
                          <th>Profit %</th>
                        </tr>
                        {calculateListData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item.ITF}</td>
                            <td>{item.EXW}</td>
                            <td>{item.TC}</td>
                            <td>{item.Commission}</td>
                            <td>{item.FOB}</td>
                            <td>{item.GW}</td>
                            <td>{item.freight}</td>
                            <td>{item.CNF}</td>
                            <td>{item.Margin}</td>
                            <td>{item.FX_Rate}</td>
                            <td>{item.FX_Rebate}</td>
                            <td>{item.Calculated_price}</td>
                            <td>{item.FInal_Price}</td>
                            <td>{item.Rebate}</td>
                            <td>{item.base}</td>
                            <td>{item.profit}</td>
                            <td>{item.profit_Percentage}</td>
                          </tr>
                        ))}
                      </thead>
                      <tbody>{/* Add dynamic table data here */}</tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceEdit;
