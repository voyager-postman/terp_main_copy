import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../Url/Url";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { ComboBox } from "../combobox";
import axios from "axios";
const CombinePaymentView = () => {
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
  const [totalDataDetails, setTotalDataDetails] = React.useState("");
  const [totalDataDetails1, setTotalDataDetails1] = React.useState("");

  const [data, setData] = React.useState("");
  const [orderDetails, setOrderDetails] = React.useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
  const getDetils = () => {
    if (from?.ID) {
      axios
        .get(`${API_BASE_URL}/GetCombinedPaymentByID`, {
          params: { cpn_id: from.ID }, // ✅ Correct way to send query params
        })
        .then((response) => {
          console.log(response);
          setDetails(response.data.cpn_details);
          setTotalDataDetails(response.data.totaldata);
          setTotalDataDetails1(response.data.cpn_data);
        })
        .catch((error) => {
          console.error("Error fetching details:", error);
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

  const [state, setState] = React.useState({
    po_id: from?.PO_ID,
    vendor_id: from?.Vendor,
    rounding: from?.rounding,
    vendor_name: from?.Vendor_name,
    created: from?.created || "0000-00-00",
    // `${new Date().getFullYear()}-${new Date().getMonth()}${1}-${new Date().getDate()}`,
    supplier_invoice_number: from?.supplier_invoice_number,
    supplier_invoice_date: from?.supplier_invoice_date,
    supplier_dua_date: from?.supplier_dua_date,

    user_id: localStorage.getItem("id"),
  });
  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/updatePurchaseOrder`, {
        po_id: from?.PO_ID,
        invoice_number: invoiceNumber,
        invoice_date: invoiceDate,
      });

      if (response.status === 200) {
        toast.success("Invoice updated successfully!");
        setInvoiceNumber("");
        setInvoiceDate("");
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
  const [rounding, setRounding] = useState(0);

  // Fixed values
  const totalBeforeTax = 12;
  const vat = 12;
  const wht = 12;

  // Calculate total amount
  const amountToPay = totalBeforeTax + vat + wht + Number(rounding);
  const [parentChecked, setParentChecked] = useState(false);
  const [childChecked, setChildChecked] = useState({
    1: false, // Row 1 checkbox
    2: false, // Row 2 checkbox
    3: false, // Row 3 checkbox
  });

  const handleParentChange = () => {
    const newCheckedState = !parentChecked;
    setParentChecked(newCheckedState);

    const newChildChecked = {};
    Object.keys(childChecked).forEach((key) => {
      newChildChecked[key] = newCheckedState;
    });
    setChildChecked(newChildChecked);
  };

  // Handle individual child checkbox change
  const handleChildChange = (id) => {
    const newChildChecked = { ...childChecked, [id]: !childChecked[id] };
    setChildChecked(newChildChecked);

    // Check if all checkboxes are checked to update parent checkbox
    const allChecked = Object.values(newChildChecked).every((value) => value);
    setParentChecked(allChecked);
  };
  function formatNumber(num) {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }
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
                        Combined Payment / View Form
                      </h6>
                      {/* <i class="mdi mdi-view-headline"></i> */}
                    </div>
                  </div>
                </div>

                <div className="row purchaseViewRow mt-4  mb-4">
                  <div className="col-lg-3">
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Vendor
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{totalDataDetails1?.vendor_name}</p>
                      </div>
                    </div>

                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Combined Payment Number
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>{totalDataDetails1?.CPNCODE}</p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Combined Payment Date
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>
                          {new Date(
                            totalDataDetails1?.CPN_Date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="parentPurchaseView">
                      <div className="me-3">
                        <strong>
                          Due Date
                          <span>:</span>
                        </strong>
                      </div>
                      <div>
                        <p>
                          {new Date(
                            totalDataDetails1?.Due_Date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
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
                        <th style={{ width: "170px" }}>Amount to Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.map((items, index) => {
                        return (
                          <>
                            <tr key={index}>
                              <td className="text-center">{items.POCODE}</td>
                              <td className="text-center">
                                {new Date(items.PO_date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="text-center">
                                {new Date(items.Due_Date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className="text-right">
                                {formatNumber(items.Total_Before_Tax)}
                              </td>
                              <td className="text-right">
                                {formatNumber(items.Payment_amount)}
                              </td>
                              <td className="text-right">
                                {formatNumber(items.Payable)}
                              </td>
                              <td className="text-right">
                                {/* {formatNumber(1232.3434)} */}THB
                              </td>
                              <td className="text-right">
                                {formatNumber(items.Payment)}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>

                    {/* <tbody>
                              {details?.map((v, i) => (
                                <tr key={`b_${i}`} className="rowCursorPointer">
                                  <td className="borderUnsetPod">
                                    {v.pod_status == "1" ? (
                                      <input
                                        className="border-0"
                                        value={v.pod_code}
                                      />
                                    ) : (
                                      <>{v.pod_code}</>
                                    )}
                                  </td>

                                  <td className="autoFull">
                                    {v.pod_status == "1" ? (
                                      <Autocomplete
                                        className="unsetPurchaseWidth"
                                        value={
                                          dropdownItems?.find(
                                            (item) => item.ID === v.dropDown_id
                                          ) || null
                                        }
                                        options={dropdownItems}
                                        getOptionLabel={(option) =>
                                          option.produce_name_en || ""
                                        }
                                        onChange={(event, newValue) => {
                                          if (+v.pod_status !== 1) return;
                                          const newEditPackaging = [...details];
                                          newEditPackaging[i].dropDown_id =
                                            newValue?.ID || null;
                                          setDetails(newEditPackaging);
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Select Item"
                                            // label="Select Produce"
                                          />
                                        )}
                                      />
                                    ) : (
                                      <> {v.produce_name_en} </>
                                    )}
                                  </td>

                                  <td clas>
                                    {v.pod_status == "1" ? (
                                      <input
                                        className="border-0"
                                        type="text"
                                        name="pod_quantity"
                                        disabled={+v.pod_status != 1}
                                        value={v.pod_quantity}
                                        onChange={(e) => handleEditDatils(i, e)}
                                      />
                                    ) : (
                                      <> {v.pod_quantity}</>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <Autocomplete
                                        options={unitType}
                                        value={
                                          unitType?.find(
                                            (item) =>
                                              item.unit_id === v.unit_count_id
                                          ) || null
                                        }
                                        getOptionLabel={(option) =>
                                          option.unit_name_en || ""
                                        }
                                        onChange={(event, newValue) => {
                                          if (+v.pod_status !== 1) return;
                                          const newEditPackaging = [...details];
                                          newEditPackaging[i].unit_count_id =
                                            newValue?.unit_id || null;
                                          setDetails(newEditPackaging);
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Select Unit"
                                            // label="Select Unit"
                                          />
                                        )}
                                      />
                                    ) : (
                                      // <ComboBox
                                      //   options={unitType?.map((v) => ({
                                      //     id: v.unit_id,
                                      //     name: v.unit_name_en,
                                      //   }))}
                                      //   value={v.unit_count_id}
                                      //   onChange={(e) => {
                                      //     if (+v.pod_status != 1) return;
                                      //     const newEditPackaging = [...details];
                                      //     newEditPackaging[i].unit_count_id = e;
                                      //     setDetails(newEditPackaging);
                                      //   }}
                                      // />
                                      <> {v.unit_count_id}</>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <input
                                        type="number"
                                        name="pod_price"
                                        className="border-0"
                                        defaultValue={v.pod_price}
                                        disabled={+v.pod_status != 1}
                                        onChange={(e) => handleEditDatils(i, e)}
                                      />
                                    ) : (
                                      <> {v.pod_price}</>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <input
                                        type="number"
                                        name="pod_vat"
                                        className="border-0"
                                        defaultValue={v.pod_vat}
                                        disabled={+v.pod_status != 1}
                                        onChange={(e) => handleEditDatils(i, e)}
                                        style={{ width: "50px" }}
                                      />
                                    ) : (
                                      <> {v.pod_vat}</>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <input
                                        type="text"
                                        readOnly
                                        className="border-0"
                                        disabled={+v.pod_status != 1}
                                        value={(
                                          +(
                                            +v.pod_price *
                                            +v.pod_quantity *
                                            (v.pod_vat / 100)
                                          ) +
                                          +v.pod_price * +v.pod_quantity
                                        ).toLocaleString("en-us")}
                                      />
                                    ) : (
                                      <>
                                        {" "}
                                        {(
                                          +(
                                            +v.pod_price *
                                            +v.pod_quantity *
                                            (v.pod_vat / 100)
                                          ) +
                                          +v.pod_price * +v.pod_quantity
                                        ).toLocaleString("en-us")}
                                      </>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <input
                                        type="text"
                                        name="pod_wht_id"
                                        className="border-0"
                                        disabled={+v.pod_status != 1}
                                        style={{ width: "50px" }}
                                        value={v.pod_wht_id}
                                        onChange={(e) => handleEditDatils(i, e)}
                                      />
                                    ) : (
                                      <> {v.pod_wht_id}</>
                                    )}
                                  </td>
                                  <td>
                                    {v.pod_status == "1" ? (
                                      <input
                                        type="text"
                                        name="pod_crate"
                                        className="border-0"
                                        style={{ width: "70px" }}
                                        disabled={+v.pod_status != 1}
                                        value={v.pod_crate}
                                        onChange={(e) => handleEditDatils(i, e)}
                                      />
                                    ) : (
                                      <> {v.pod_crate}</>
                                    )}
                                  </td>
                                  <td className="editIcon">
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
                                  </td>
                                </tr>
                              ))}
                              {formsValue?.map((element, index) => (
                                <tr
                                  key={`a_${index}`}
                                  className="rowCursorPointer"
                                >
                                  <td> </td>
                                  <td>
                                    <Autocomplete
                                      value={
                                        dropdownItems?.find(
                                          (item) =>
                                            item.ID === element.POD_Selection
                                        ) || null
                                      }
                                      options={dropdownItems}
                                      getOptionLabel={(option) =>
                                        option.Name_EN || ""
                                      }
                                      onChange={(event, newValue) =>
                                        addFieldHandleChangeWname(
                                          index,
                                          "POD_Selection",
                                          newValue?.ID || null
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Item"
                                          variant="outlined"
                                          // label="Select POD"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      name="pod_quantity"
                                      className="border-0"
                                      onChange={(e) =>
                                        addFieldHandleChange(index, e)
                                      }
                                      defaultValue={element.pod_quantity}
                                    />
                                  </td>
                                  <td>
                                    <Autocomplete
                                      value={
                                        unitType?.find(
                                          (item) =>
                                            item.ID === element.unit_count_id
                                        ) || null
                                      }
                                      options={unitType}
                                      getOptionLabel={(option) =>
                                        option.Name_EN || ""
                                      }
                                      onChange={(event, newValue) =>
                                        addFieldHandleChangeWname(
                                          index,
                                          "unit_count_id",
                                          newValue?.ID || null
                                        )
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select Unit"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      name="pod_price"
                                      className="border-0"
                                      onChange={(e) =>
                                        addFieldHandleChange(index, e)
                                      }
                                      defaultValue={element.pod_price}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      name="pod_vat"
                                      className="border-0"
                                      style={{ width: "50px" }}
                                      onChange={(e) =>
                                        addFieldHandleChange(index, e)
                                      }
                                      defaultValue={element.pod_vat}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      readOnly
                                      className="border-0"
                                      value={(
                                        +(
                                          +element.pod_price *
                                          +element.pod_quantity *
                                          (element.pod_vat / 100)
                                        ) +
                                        +element.pod_price *
                                          +element.pod_quantity
                                      ).toLocaleString("en-us")}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      name="pod_wht_id"
                                      style={{ width: "50px" }}
                                      className="border-0"
                                      onChange={(e) =>
                                        addFieldHandleChange(index, e)
                                      }
                                      defaultValue={element.pod_wht_id}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      name="pod_crate"
                                      className="border-0"
                                      style={{ width: "70px" }}
                                      onChange={(e) =>
                                        addFieldHandleChange(index, e)
                                      }
                                      defaultValue={element.pod_crate}
                                    />
                                  </td>
                                  <td>
                                    {index == formsValue.length - 1 ? (
                                      <button
                                        type="button"
                                        onClick={addFormFields}
                                        className="cursor-pointer"
                                      >
                                        <i className="mdi mdi-plus text-xl" />
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="cursor-pointer"
                                        onClick={() => removeFormFields(index)}
                                      >
                                        <i className="mdi mdi-trash-can-outline text-xl" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody> */}
                  </table>
                </div>
                {/* table new end */}
                {/*--------------------------- table data end--------------------------------*/}
              </div>
              <div className="flex justify-content-end mt-4 totalBefore">
                <div style={{ width: "250px" }}>
                  {/* <div className="flexBefore">
                    <div>
                      <strong>Payable : </strong>
                    </div>
                    <div>
                      <span>
                        {formatterTwo.format(totalDataDetails?.total_payable)}
                      </span>
                    </div>
                  </div> */}
                  <div className="flexBefore">
                    <div>
                      <strong>Total Before Tax : </strong>
                    </div>
                    <div>
                      <span>
                        {" "}
                        {formatterTwo.format(
                          totalDataDetails?.total_before_tax
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flexBefore">
                    <div>
                      <strong>VAT : </strong>
                    </div>
                    <div>
                      <span>
                        {formatterTwo.format(totalDataDetails?.total_vat)}
                      </span>
                    </div>
                  </div>
                  <div className="flexBefore">
                    <div>
                      <strong>WHT : </strong>
                    </div>
                    <div>
                      <span>
                        {formatterTwo.format(totalDataDetails?.total_wht)}
                      </span>
                    </div>
                  </div>
                  <div className=" d-flex flexBefore">
                    <div>
                      <strong>Rounding</strong>
                    </div>
                    <div>
                      <span> {totalDataDetails?.total_rounding}</span>
                    </div>
                  </div>
                  <div className="flexBefore">
                    <div>
                      <strong>Amount to Pay : </strong>
                    </div>
                    <div>
                      <span>
                        {formatterTwo.format(
                          (totalDataDetails?.total_before_tax || 0) +
                            (totalDataDetails?.total_vat || 0) -
                            (totalDataDetails?.total_wht || 0) +
                            (totalDataDetails?.total_rounding || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {/* <button className="btn btn-primary" type="submit" name="signup">
                Create
              </button> */}
              <Link className="btn btn-danger" to={"/combinePayment"}>
                Close
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinePaymentView;
