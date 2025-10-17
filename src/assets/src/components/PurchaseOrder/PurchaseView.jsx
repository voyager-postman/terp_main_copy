import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Url/Url";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { ComboBox } from "../combobox";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "../../Url/Api";
import { useTranslation } from "react-i18next";
const PurchaseView = () => {
  const { t, i18n } = useTranslation("global");
  const [poData, setPoData] = useState(null);
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
  const { data: vendorList } = useQuery("getAllVendor");
  const { data: dropdownType } = useQuery("getDropdownType");
  const { data: produceList } = useQuery("getAllProduceItem");
  const { data: packagingList } = useQuery("getAllPackaging");
  const { data: BoxList } = useQuery("getAllBoxes");
  const { data: unitType } = useQuery("getAllUnit");
  console.log(dropdownType);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const [details, setDetails] = React.useState([]);
  const [data, setData] = React.useState("");
  const [orderDetails, setOrderDetails] = React.useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const getDetils = () => {
    if (from?.PO_ID) {
      axios
        .post(`${API_BASE_URL}/purchaseOrderView`, { po_id: from?.PO_ID })
        .then((response) => {
          console.log(response);
          setDetails(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const getDetils1 = () => {
    if (from?.PO_ID) {
      axios
        .post(`${API_BASE_URL}/getNewPurchaseOrderDetails`, {
          po_id: from?.PO_ID,
        })
        .then((response) => {
          console.log(response);
          setOrderDetails(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    getDetils();
    getDetils1();
    setData(from);
  }, []);
  const summaryDeatils = () => {
    axios
      .post(`${API_BASE_URL}/PO_Bottom_View_EN`, {
        po_id:from?.PO_ID,
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
  const renderSection = (labels, values) => {
    if (!labels || !values) return null;

    return Object.keys(labels).map((key, i) => (
      <div key={i}>
        <b>{labels[key]}</b> {values[key] || ""}
      </div>
    ));
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updatePurchaseOrder`, {
        po_id: from?.PO_ID,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
        due_date: dueDate,
      });

      if (response.status === 200) {
        toast.success("Invoice updated successfully!");
        setInvoiceNumber("");
        setInvoiceDate("");
        setDueDate("");
        // Close modal
        var modalElement = document.getElementById("exampleModal");
        var modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice.");
    }
  };
  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const formatNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format;
  const [rounding, setRounding] = useState(0);

  // Fixed values
  const totalBeforeTax = 12;
  const vat = 130;
  const wht = 12;

  // Calculate total amount
  const amountToPay = totalBeforeTax + vat + wht + Number(rounding);
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
                        {t("purchaseOrderView")}
                      </h6>
                      {/* <i class="mdi mdi-view-headline"></i> */}
                    </div>
                  </div>
                </div>

                <div className=" mt-5 borderBottompurchase">
                  <div className="row">
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            {t("code")}
                            <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p> {data?.POCODE}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="parentPurchaseView">
                        <div className="me-3">
                          <strong>
                            {t("createBy")}
                            <span>:</span>{" "}
                          </strong>
                        </div>
                        <div>
                          <p> {orderDetails?.created_by}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row purchaseViewRow">
                  <div className="col-lg-3">
                    <h6>{t("vendorInfo")}</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("name")}
                          <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.Vendor_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("address")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{orderDetails?.vendor_address}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("contact")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {orderDetails?.vendor_phone}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("lineId")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {orderDetails?.vendor_line_id} </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6>{t("orderHistory")}</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("createDate")}
                          <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p> {data?.created}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("deliveryDate")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {data?.po_delivery_date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6> {t("payment")}</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("totals")}
                          <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p> {data?.Total_}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("bankName")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {orderDetails?.vendor_bank_name}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("accountName")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {orderDetails?.vendor_bank_account}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("accountNumber")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p> {orderDetails?.vendor_bank_number}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <h6> {t("invoiceDetails")}</h6>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("invoiceNumber")}
                          <span>:</span>{" "}
                        </strong>
                      </div>
                      <div>
                        <p>{data?.supplier_invoice_number}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          {t("invoiceDate")}
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{data?.supplier_invoice_date}</p>
                      </div>
                    </div>
                    <div className="invoicePopup mt-3">
                      {/* Button trigger modal */}
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                      >
                        {t("invoiceDetails")}
                      </button>
                      {/* Modal */}
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex={-1}
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modalShipTo ">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h1
                                className="modal-title fs-5"
                                id="exampleModalLabel"
                              >
                                {t("invoiceDetails")}({data?.POCODE})
                              </h1>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              >
                                {" "}
                                <i class="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div>
                                <label htmlFor="invoiceNumber">
                                  {t("invoiceNumber")}
                                </label>
                              </div>
                              <div>
                                <input
                                  type="text"
                                  id="invoiceNumber"
                                  value={invoiceNumber}
                                  onChange={(e) =>
                                    setInvoiceNumber(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="invoiceDate">
                                  {t("invoiceDate")}
                                </label>
                              </div>
                              <div>
                                <DatePicker
                                  selected={invoiceDate}
                                  onChange={(date) => setInvoiceDate(date)}
                                  dateFormat="dd-MM-yyyy" // Matches the format of <input type="date">
                                  placeholderText="Click to select a date"
                                  customInput={<CustomInput />}
                                />
                              </div>
                              <div className="mt-3">
                                <label htmlFor="invoiceDate">
                                  {t("dueDate")}
                                </label>
                              </div>
                              <div>
                                {/* <input
                                  type="date"
                                  id="dueDate"
                                  value={dueDate}
                                  onChange={(e) => setDueDate(e.target.value)}
                                /> */}
                                <DatePicker
                                  selected={dueDate}
                                  onChange={(date) => setDueDate(date)}
                                  dateFormat="dd-MM-yyyy" // Matches the format of <input type="date">
                                  placeholderText={t("clickToSelectDate")}
                                  customInput={<CustomInput />}
                                />
                              </div>
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
                    </div>
                  </div>
                </div>
                <div className="row my-3">
                  <h5 className="itemInfo"> {t("itemsInfo")}:</h5>
                </div>
                <div className="row">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                    >
                      {/*---------------------------table data---------------------*/}
                      <div className="d-flex exportPopupBtn" />
                      <table
                        id="example"
                        className="tableLr display table table-hover table-striped borderTerpProduce"
                        style={{ width: "100%" }}
                      >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t("account")}</th>
                            <th>{t("item")}</th>
                            <th> {t("barcode")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("unit")}</th>
                            <th>{t("price")}</th>
                            <th>{t("vat")}</th>
                            <th>{t("total")}</th>
                            <th>{t("wht")}</th>
                            <th>{t("crate")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {details?.map((item,i) => {
                            return (
                              <tr
                                className="rowCursorPointer"
                                data-bs-toggle="modal"
                                data-bs-target="#myModal"
                              >
                                <td scope="row">{i+1}</td>
                                <td>{item.type_name_en}</td>
                                <td>{item.packaging_name}</td>
                                <td>{item.pod_code}</td>
                                <td>{item.pod_quantity} </td>
                                <td>{item.unit_name_en} </td>
                                <td>{item.pod_price}</td>
                                <td>{item.pod_vat}</td>
                                <td>{item.pod_line_total}</td>
                                <td>{item.pod_wht_id}</td>
                                <td>{item.pod_crate}</td>
                              </tr>
                            );
                          })} */}
                          {details?.map((v, i) => (
                            <tr key={`b_${i}`} className="rowCursorPointer">
                              <td className="text-center">{i + 1}</td>
                              <td>
                                <>
                                  {/* {
                                    dropdownType.find(
                                      (item) => item.type_id == v.pod_type_id
                                    )?.type_name_en
                                  } */}
                                  {v.typeNameen}
                                </>
                              </td>
                              <td>
                                {/* <ComboBox
                              containerStyle={{ width: "130px" }}
                              options={
                                v.pod_type_id == "1"
                                  ? packagingList?.map((v) => ({
                                      id: v.packaging_id,
                                      name: v.packaging_name,
                                    }))
                                  : v.pod_type_id == "2"
                                  ? BoxList?.map((v) => ({
                                      id: v.box_id,
                                      name: v.box_name,
                                    }))
                                  : v.pod_type_id == "3"
                                  ? produceList?.map((v) => ({
                                      id: v.produce_id,
                                      name: v.produce_name_en,
                                    }))
                                  : []
                              }
                              value={v.pod_item}
                              onChange={(e) => {
                                if (+v.pod_status != 1) return;
                                const newEditPackaging = [...details];
                                newEditPackaging[i].pod_item = e;
                                setDetails(newEditPackaging);
                              }}
                            /> */}

                                <>
                                  {/* {" "}
                                  {v.pod_type_id == "1"
                                    ? packagingList?.find(
                                        (item) =>
                                          item.packaging_id == v.pod_item
                                      )?.packaging_name
                                    : v.pod_type_id == "2"
                                    ? BoxList?.find(
                                        (item) => item.box_id == v.pod_item
                                      )?.box_name
                                    : v.pod_type_id == "3"
                                    ? produceList?.find(
                                        (item) => item.produce_id == v.pod_item
                                      )?.produce_name_en
                                    : ""} */}
                                  {v.produceENname}
                                </>
                              </td>
                              <td className="borderUnsetPod text-center">
                                {/* {v.pod_status === "1" ? (
                              <input
                                style={{ width: "130px" }}
                                className="border-0"
                                value={v.pod_code}
                              />
                            ) : (
                              <>{v.pod_code}</>
                            )} */}
                                {v.pod_status == "1" ? (
                                  <input
                                    className="border-0"
                                    value={v.PODCODE}
                                  />
                                ) : (
                                  <>{v.PODCODE}</>
                                )}
                              </td>
                              <td className="text-right">
                                {formatterTwo.format(v.Qty)}
                              </td>
                              <td className="text-center">{v.Unit_Name_EN}</td>
                              <td className="text-right">
                                {formatterTwo.format(v.pod_price)}
                              </td>
                              <td className="text-right">
                                <> {formatterTwo.format(v.VAT_value)}</>
                              </td>
                              {/* <td className="text-right">
                                {formatterTwo
                                  .format(
                                    +(+v.pod_price  +v.Qty  (v.VAT / 100)) +
                                      +v.pod_price * +v.Qty
                                  )
                                  .toLocaleString("en-us")}
                              </td> */}
                              <td className="text-right">
                                {formatterTwo.format(
                                  v.Qty * v.pod_price
                                  // +v.pod_price +
                                  //   +v.Qty * (v.VAT / 100) +
                                  //   +v.pod_price * +v.Qty
                                )}
                              </td>

                              <td className="text-right">
                                {formatterTwo.format(v.WHT_value)}
                              </td>
                              <td className="text-right">
                                {formatterTwo.format(v.Crates)}
                              </td>
                              {/* <td className="editIcon">
                            {+v.pod_status == 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const i = window.confirm(
                                    "Do you want to delete this Order details?"
                                  );
                                  if (i) {
                                    deleteDetails(v.pod_id);
                                  }
                                }}
                              >
                                <i className="mdi mdi-trash-can-outline" />
                              </button>
                            ) : (
                              <> </>
                            )}
                          </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/*--------------------------- table data end--------------------------------*/}
                    </div>
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
                    {/* <div className="row selectPurchase">
                      <div className="col-lg-3">
                        <select name="" id="">
                          <option value="">Pending</option>
                          <option value="">Picked Up</option>
                          <option value="">Delivery</option>
                        </select>
                      </div>
                    </div> */}
                  </div>
                </div>
                {/*--------------------------- table data end--------------------------------*/}
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
              <Link className="btn btn-danger" to={"/reciept"}>
                {t("close")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseView;
