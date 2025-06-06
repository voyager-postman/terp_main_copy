import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";

const QuotationView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  console.log(from);

  useEffect(() => {
    setData(from);
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getQuotationDetailsView?quotation_id=${from.Quotation_ID}`,
    {
      enabled: !!from.Quotation_ID,
    }
  );
  console.log(details);
  const { data: summary, refetch: getSummary } = useQuery(
    `getQuotationSummary?quote_id=${from?.Quotation_ID}`,
    {
      enabled: !!from?.Quotation_ID,
    }
  );
  console.log(summary);
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
      <div className="databaseTableSection pt-0">
        {/* End databaseTableSection */}
        <div className="top-space-search-reslute">
          <div className="tab-content p-4 pt-0 pb-0">
            <div className="tab-pane active" id="header" role="tabpanel">
              <div
                id="datatable_wrapper"
                className="information_dataTables dataTables_wrapper dt-bootstrap4 "
              >
                {/*---------------------------table data---------------------*/}
                <div className="d-flex exportPopupBtn" />
                <div className="grayBgColor p-4 pt-2 pb-2">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="font-weight-bolder mb-0 pt-2">
                        Quotation / View Form
                      </h6>
                    </div>
                  </div>
                </div>

                <div className=" mt-5 borderBottompurchase">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            Code <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p>{data?.Quotation_number}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            Create By <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p>{data?.created_by}</p>
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
                          Client <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.client_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Ship To <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.consignee_name}</p>
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
                          {" "}
                          {data?.port_name} [{data?.Airport_IATA_code}]{" "}
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
                          {" "}
                          {data?.Airline} [{data?.Airline_liner_code}]{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Currency <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.currency}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Total CNF <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {twoDecimal.format(+summary?.Q_CNF)}</p>
                      </div>
                    </div>
                    {/* <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Markup Rate <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.Q_Markup}</p>
                      </div>
                    </div> */}

                    {localStorage.getItem("level") !== "Level 5" && (
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            Rebate <span>:</span>
                          </strong>
                        </div>
                        <div>
                          <p>{data?.Q_Rebate_FX}</p>
                        </div>
                      </div>
                    )}
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Commission <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.Q_Commission_FX}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Clearance<span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.clearance_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Palletized <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.palletized}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          CO from Chamber <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.Chamber}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Ship Date <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.load_Before_date}</p>
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
                          <th>Calculated Price</th>
                          <th> Quoted Price</th>
                          {!(
                            (localStorage.getItem("level") === "Level 1" &&
                              localStorage.getItem("role") === "Admin") ||
                            localStorage.getItem("level") === "Level 5"
                          ) && <th>Profit</th>}
                        </tr>
                      </thead>
                      {details?.map((item, i) => {
                        return (
                          <tr
                            className="rowCursorPointer orderViewRoew"
                            data-bs-toggle="modal"
                            data-bs-target="#myModal"
                          >
                            <td>{item.itf_name_en}</td>
                            <td>{item.brand_name}</td>
                            <td>{item.QOD_QTY}</td>
                            <td>{item.unit_name_en}</td>
                            <td>{item.QOD_Box}</td>
                            <td>{item.QOD_NW}</td>
                            <td>{item.Calculated_price}</td>
                            <td>{item.Quotation_price}</td>
                            {!(
                              (localStorage.getItem("level") === "Level 1" &&
                                localStorage.getItem("role") === "Admin") ||
                              localStorage.getItem("level") === "Level 5"
                            ) && <td>{v.QOD_Profit_Percentage}%</td>}
                          </tr>
                        );
                      })}
                    </table>
                    <div className="row py-4 px-4">
                      <div className="col-lg-3">
                        <div>
                          <b> Total NW : </b>
                          {(+from?.Q_NW || 0).toLocaleString()}
                        </div>
                        <div className="">
                          <b> Total GW : </b>
                          {(+from?.Q_GW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total Box : </b>
                          {(+from?.Q_Box || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CBM : </b>
                          {(+from?.Q_CBM || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total ITF : </b>
                          {(+from?.Q_Items || 0).toLocaleString()}
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <div>
                          <b>Freight : </b>
                          {(+from?.Q_FREIGHT || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Transport : </b>
                          {(+from?.Q_Transport || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Clearance : </b>
                          {(+from?.Q_Clearance || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b>Total FOB : </b>
                          {(+from?.Q_FOB || 0).toLocaleString()}
                        </div>
                        <div className=" ">
                          <b>Total CNF : </b>
                          {(+from?.Q_CNF || 0).toLocaleString()}
                        </div>

                        {localStorage.getItem("level") !== "Level 5" && (
                          <>
                            <div className=" ">
                              <b>Total Profit : </b>
                              {(+from?.Q_Profit || 0).toLocaleString()}
                            </div>
                            <div className="">
                              <b style={{ marginLeft: "2px" }}>Profit % : </b>
                              {(
                                +from?.Q_Profit_Percentage || 0
                              ).toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="col-lg-3">
                        <b>Total CNF FX : </b>
                        {(+from?.Q_CNF_FX || 0).toLocaleString()}
                        <div>
                          <b>Total Commission FX : </b>
                          {(+from?.Q_Commission_FX || 0).toLocaleString()}{" "}
                        </div>
                        <div className="">
                          <b>Total Rebate FX : </b>
                          {(+from?.Q_Rebate_FX || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
              <Link className="btn btn-danger" to={"/quotation"}>
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationView;
