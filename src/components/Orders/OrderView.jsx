import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
const OrderView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  const [data1, setData1] = useState("");

  console.log(from);
  useEffect(() => {
    setData(from);
  }, []);
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/getOrderById`, {
        params: {
          order_id: from?.Order_ID,
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
  }, [from?.Order_ID]);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getOrdersDetails?id=${from?.Order_ID}`,
    {
      enabled: !!from?.Order_ID,
    }
  );
  console.log(details);
  const { data: summary, refetch: getSummary } = useQuery(
    `getOrderSummary?quote_id=${from?.Order_ID}`,
    {
      enabled: !!from?.Order_ID,
    }
  );
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
  console.log(summary);
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
                        Orders / View Form
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
                          <p>{data?.Order_Number}</p>
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
                          {data?.Airport} [{data?.Airport_IATA_code}]{" "}
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
                          EX Rate <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {twoDecimal.format(data?.fx_rate)}</p>
                      </div>
                    </div>
                    {localStorage.getItem("level") !== "Level 5" && (
                      <>
                        <div className="parentPurchaseView">
                          <div className="me-3">
                            <strong>
                              Markup Rate <span>:</span>
                            </strong>
                          </div>
                          <div>
                            <p> {twoDecimal.format(data?.mark_up)}</p>
                          </div>
                        </div>
                        <div className="parentPurchaseView">
                          <div className="me-3">
                            <strong>
                              Rebate <span>:</span>
                            </strong>
                          </div>
                          <div>
                            <p>{data?.rebate}</p>
                          </div>
                        </div>
                      </>
                    )}
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
                        <p>{data?.Freight_ship_date}</p>
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
                          <th> Unit Price</th>
                          <th> Adjust Price</th>
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
                            <td>{item.ITF_Name}</td>
                            <td>{item.Brand_name}</td>
                            <td>{threeDecimal.format(item.OD_QTY)}</td>
                            <td>{item.Unit_Name}</td>
                            <td>{NoDecimal.format(item.OD_Box)}</td>
                            <td>{threeDecimal.format(item.OD_NW)}</td>
                            {twoDecimal.format(
                              item.QOD_FP === "0.00" || item.QOD_FP === null
                                ? item.OD_CP
                                : item.QOD_FP
                            )}
                            <td>
                              {item.OD_OP ? twoDecimal.format(item.OD_OP) : ""}
                            </td>

                            {!(
                              (localStorage.getItem("level") === "Level 1" &&
                                localStorage.getItem("role") === "Admin") ||
                              localStorage.getItem("level") === "Level 5"
                            ) && <td>{v.OD_Profit_Percentage}%</td>}
                          </tr>
                        );
                      })}
                    </table>
                    <div className="row py-4 px-4">
                      <div className="col-lg-3">
                        <div>
                          <b> Total NW : </b>
                          {(+data1?.O_NW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total GW : </b>
                          {(+data1?.O_GW || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total Box : </b>
                          {(+data1?.O_Box || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CBM : </b>
                          {(+data1?.O_CBM || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total ITF : </b>
                          {(+data1?.O_Items || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b>Freight : </b>
                          {(+data1?.O_Freight || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>TransPort : </b>
                          {(+data1?.O_Transport || 0).toLocaleString()}
                        </div>
                        <div>
                          <b>Clearance : </b>
                          {(+data1?.O_Clearance || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total FOB : </b>
                          {(+data1?.O_FOB || 0).toLocaleString()}
                        </div>
                        <div>
                          <b> Total CNF : </b>
                          {(+data1?.O_CNF || 0).toLocaleString()}
                        </div>
                        {!(
                          (localStorage.getItem("level") === "Level 1" &&
                            localStorage.getItem("role") === "Admin") ||
                          localStorage.getItem("level") === "Level 5"
                        ) && (
                          <div className="">
                            <b> Total Profit : </b>
                            {(+data1?.O_Profit || 0).toLocaleString()}
                          </div>
                        )}

                        {localStorage.getItem("level") !== "Level 5" && (
                          <div style={{ marginLeft: "2px" }}>
                            <b> Profit % : </b>
                            {(
                              +data1?.O_Profit_Percentage || 0
                            ).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b> Total CNF FX : </b>
                          {(+data1?.O_CNF_FX || 0).toLocaleString()}
                        </div>
                        <div>
                          <div>
                            <b> Total Commission FX: </b>
                            {(+data1?.O_Commission_FX || 0).toLocaleString()}
                          </div>
                          <div>
                            <b> Total Rebate FX : </b>
                            {(+data1?.O_Rebate_FX || 0).toLocaleString()}
                          </div>
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
              <Link className="btn btn-danger" to={"/orders"}>
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
