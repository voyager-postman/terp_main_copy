import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const InvoiceView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data1, setData1] = useState("");
  const { from } = location.state || {};
  const [data, setData] = useState("");
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
  console.log(summary);
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
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
                              Invoice / View Form
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
                                  Invoice Number <span>:</span>{" "}
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
                                  Client <span>:</span>{" "}
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
                                  Ship To <span>:</span>{" "}
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
                        <h5 className="itemInfo">Items Info :</h5>
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
                                <th> Final Price</th>
                                <th> Calculated Price</th>
                                {!(
                                  (localStorage.getItem("level") ===
                                    "Level 1" &&
                                    localStorage.getItem("role") === "Admin") ||
                                  localStorage.getItem("level") === "Level 5"
                                ) && <th>Profit</th>}
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
                                    <td>{item.itf_unit_name}</td>
                                    <td>
                                      {NoDecimal.format(item.Number_of_boxes)}
                                    </td>
                                    <td>
                                      {threeDecimal.format(item.net_weight)}
                                    </td>
                                    <td>
                                      {twoDecimal.format(item.Final_Price)}
                                    </td>
                                    <td>
                                      {twoDecimal.format(item.calculated_price)}
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
                    <Link className="btn btn-danger" to={"/invoice"}>
                      Close
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;
