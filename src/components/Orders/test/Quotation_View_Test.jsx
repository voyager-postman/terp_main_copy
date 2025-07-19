import { useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
const Quotation_View_Test = () => {
  
const { t, i18n } = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [data, setData] = useState("");
  const [data1, setData1] = useState("");

  console.log(from);

  const oneQoutationDAta = () => {
    axios
      .post(`${API_BASE_URL}/OrderTopView`, {
        order_id: from?.Order_ID,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);

        setData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [from?.Order_ID]);
  const oneQoutationDAta1 = () => {
    axios
      .post(`${API_BASE_URL}/OrderBottomView`, {
        order_id: from?.Order_ID,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);

        setData1(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta1();
  }, [from?.Order_ID]);
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
  console.log(data.Section1_Labels);
  return (
    <div>
      <div className="databaseTableSection pt-0">
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
                     {t("quotationViewForm")}
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
                            <strong>
                              {data?.Section1_Labels?.["Code : "] || "Code :"}
                            </strong>{" "}
                          </strong>
                        </div>
                        <div>
                          <p>{data?.section1_Values?.Row1 || ""}</p>{" "}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            {data?.Section1_Labels?.["Created By : "] ||
                              "Created By : "}
                          </strong>
                        </div>
                        <div>
                          <p>{data?.section1_Values?.User_name || ""}</p>{" "}
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
                          {data?.section2_Labels?.["Client :"] || "Client :"}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section2_Values?.Row1 || ""}</p>{" "}
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Consignee : "] ||
                            "Consignee : "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section2_Values?.Row2 || ""}</p>{" "}
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Airport : "] ||
                            "Airport : "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section2_Values?.Row3 || ""}</p>{" "}
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Airline :"] || "Airline :"}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section2_Values?.Row4 || ""}</p>{" "}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Currency : "] ||
                            "Currency : "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section3_Values?.Row1 || ""}</p>{" "}
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Invoice Value : "] ||
                            "Invoice Value : "}
                        </strong>
                      </div>
                      <div>
                        <p>
                          {" "}
                          {twoDecimal.format(+data?.section3_Values?.Row2)}
                        </p>
                      </div>
                    </div>
                   
                    {localStorage.getItem("level") !== "Level 5" && (
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            {data?.section2_Labels?.["Commissopn Value :"] ||
                              "Commissopn Value :"}
                          </strong>
                        </div>
                        <div>
                          <p>{data?.section3_Values?.Row3}</p>
                        </div>
                      </div>
                    )}
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {data?.section2_Labels?.["Rebate Value : "] ||
                            "Rebate Value : "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.section3_Values?.Row4}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    {Object.entries(data?.section4_Labels || {}).map(
                      ([labelKey, labelValue], index) => {
                        const value = data?.section4_Values?.[labelKey];

                        if (!value || value.toString().trim() === "")
                          return null;

                        return (
                          <div className="parentPurchaseView" key={index}>
                            <div className="me-3">
                              <strong>
                                {labelValue?.replace(" :", "")} <span>:</span>{" "}
                              </strong>
                            </div>
                            <div>
                              <p>
                                {labelKey.includes("Ship Date")
                                  ? format(new Date(value), "dd/MM/yyyy")
                                  : value}
                              </p>
                            </div>
                          </div>
                        );
                      }
                    )}
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
                        <tr role="row" className="borderTh">
                          {Object.entries(data1.section5_Labels2 || {}).map(
                            ([key, label]) => {
                              if (
                                key === "Profit" &&
                                ((localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                  localStorage.getItem("level") === "Level 5")
                              ) {
                                return null; 
                              }

                              return <th key={key}>{label}</th>;
                            }
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {data1.section5_Values?.map((item, i) => (
                          <tr
                            key={i}
                            className="rowCursorPointer orderViewRoew"
                            data-bs-toggle="modal"
                            data-bs-target="#myModal"
                          >
                            {Object.keys(data1.section5_Labels2).map((key) => {
                              if (
                                key === "Profit" &&
                                ((localStorage.getItem("level") === "Level 1" &&
                                  localStorage.getItem("role") === "Admin") ||
                                  localStorage.getItem("level") === "Level 5")
                              ) {
                                return null;
                              }

                              const keyMap = {
                                Item: "ITF_Name",
                                Brand: "Brand_name",
                                Quantity: "QTY",
                                Unit: "Unit_Name",
                                boxes: "Box",
                                "Net Weight": "NW",
                                "Calculated Price": "Calculated_Price",
                                Price: "Adjusted_Price",
                                Profit: "Profit_Percentage",
                              };

                              const value = item[keyMap[key]];

                              return (
                                <td key={key}>
                                  {key === "Profit" && value != null
                                    ? `${value}%`
                                    : value ?? ""}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="row py-4 px-4">
                      <div className="col-lg-3">
                        <div>
                          <b>
                            {data1?.section6_Labels?.["Total Net Weight :"] ||
                              "Total Net Weight :"}
                          </b>
                          {(
                            +data1?.section6_Values?.Row1 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section6_Labels?.["Total Gross Weight :"] ||
                              "Total Gross Weight :"}
                          </b>

                          {(
                            +data1?.section6_Values?.Row2 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section6_Labels?.["Total Box :"] ||
                              "Total Box :"}
                            {(
                              +data1?.section6_Values?.Row3 || 0
                            ).toLocaleString()}
                          </b>
                        </div>

                        <div className="">
                          <b>
                            {data1?.section6_Labels?.["Total Volume :"] ||
                              "Total Volume :"}
                          </b>
                          {(
                            +data1?.section6_Values?.Row4 || 0
                          ).toLocaleString()}
                        </div>

                        <b>
                          {data1?.section6_Labels?.["Total Items :"] ||
                            "Total Items :"}
                        </b>
                        {(+data1?.section6_Values?.Row5 || 0).toLocaleString()}
                      </div>

                      <div className="col-lg-3">
                        <div>
                          <b>
                            {data1?.section7_Labels?.["Freight :"] ||
                              "Freight :"}
                          </b>
                          {(
                            +data1?.section7_Values?.Row1 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section7_Labels?.["Transport :"] ||
                              "Transport :"}
                          </b>

                          {(
                            +data1?.section7_Values?.Row2 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section7_Labels?.["Clearance :"] ||
                              "Clearance :"}
                            {(
                              +data1?.section7_Values?.Row3 || 0
                            ).toLocaleString()}
                          </b>
                        </div>

                        <div className="">
                          <b>
                            {data1?.section7_Labels?.["Extra :"] || "Extra :"}
                          </b>
                          {(
                            +data1?.section7_Values?.Row4 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section7_Labels?.["Pre Cooling"] ||
                              "Pre Cooling"}
                          </b>
                          {(
                            +data1?.section7_Values?.Row5 || 0
                          ).toLocaleString()}
                        </div>
                        {/* <b>
                          {data1?.section7_Labels?.[""] ||
                            ""}
                        </b>
                        {(+data1?.section7_Values?.Row5 || 0).toLocaleString()} */}
                      </div>
                      <div className="col-lg-3">
                        <div>
                          <b>
                            {data1?.section8_Labels?.["Total CNF :"] ||
                              "Total CNF :"}
                          </b>
                          {(
                            +data1?.section8_Values?.Row1 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section8_Labels?.["Total FOB :"] ||
                              "Total FOB :"}
                          </b>

                          {(
                            +data1?.section8_Values?.Row2 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section8_Labels?.["Total Commission :"] ||
                              "Total Commission :"}
                            {(
                              +data1?.section8_Values?.Row3 || 0
                            ).toLocaleString()}
                          </b>
                        </div>

                        <div className="">
                          <b>
                            {data1?.section8_Labels?.["Total Rebate :"] ||
                              "Total Rebate :"}
                          </b>
                          {(
                            +data1?.section8_Values?.Row4 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>{data1?.section8_Labels?.["Row5"] || "Row5"}</b>
                          {(
                            +data1?.section8_Values?.Row5 || 0
                          ).toLocaleString()}
                        </div>

                        {/* <b>
                          {data1?.section8_Labels?.[""] ||
                            ""}
                        </b>
                        {(+data1?.section8_Values?.Row5 ).toLocaleString()}
                      */}
                      </div>

                      <div className="col-lg-3">
                        <div>
                          <b>
                            {data1?.section9_Labels?.["Profit :"] || "Profit :"}
                          </b>
                          {(
                            +data1?.section9_Values?.Row1 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>
                            {data1?.section9_Labels?.["Profit % :"] ||
                              "Profit % :"}
                          </b>

                          {(
                            +data1?.section9_Values?.Row2 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>{data1?.section9_Labels?.["Row3"] || "Row3"}</b>

                          {(
                            +data1?.section9_Values?.Row4 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>{data1?.section9_Labels?.["Row4"] || "Row4"}</b>

                          {(
                            +data1?.section9_Values?.Row4 || 0
                          ).toLocaleString()}
                        </div>
                        <div className="">
                          <b>{data1?.section9_Labels?.["Row5"] || "Row5"}</b>

                          {(
                            +data1?.section9_Values?.Row5 || 0
                          ).toLocaleString()}
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
             {t("close")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation_View_Test;
