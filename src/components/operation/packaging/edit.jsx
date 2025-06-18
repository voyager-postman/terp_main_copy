import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
import { Button, Modal } from "react-bootstrap";
export const OrderPackagingEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [editRowIndex, setEditRowIndex] = useState(null);
  const [editedValue, setEditedValue] = useState({});
  const { from } = location.state || {};
  console.log(from);

  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowIndex1, setEditRowIndex1] = useState(null);
  const [editRowIndex2, setEditRowIndex2] = useState(null);

  const [editBoxes, setEditBoxes] = useState("");
  const showEditBoxes = (index) => {
    setEditBoxes(index);
  };
  const showEditEan = (index) => {
    setEditRowIndex(index);
  };
  const showEditEan1 = (index) => {
    setEditRowIndex1(index);
  };
  const showEditEan2 = (index) => {
    setEditRowIndex2(index);
  };
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const isReadOnly = from?.isReadOnly;
  const [isLoading, setIsLoading] = useState(false);
  const [stock, setStock] = useState("");
  const [details, setDetails] = useState([]);
  const [tableHeader, setTableHeader] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [bonus, setBonus] = useState("");
  const [adjustedId, setAdjustedId] = useState("");
  const [disabledButtons, setDisabledButtons] = useState([]);
  const [disabledPackagingButtons, setDisabledPackagingButtons] = useState([]);

  const getOrdersDetails = () => {
    axios
      .get(`${API_BASE_URL}/getOrderPackingDetails`, {
        params: {
          id: from?.Order_ID,
        },
      })
      .then((response) => {
        console.log(response);
        setDetails(response.data.data || []);
        setTableHeader(response.data.table_head);
      })
      .catch((e) => {});
  };

  // const handleEditValues = (index, e) => {
  //   if (isReadOnly || isLoading) return;
  //   const newEditProduce = [...details];
  //   newEditProduce[index][e.target.name] = e.target.value;
  //   setDetails(newEditProduce);
  // };
  const handleEditValues = async (index, e) => {
    if (isReadOnly || isLoading) return;

    const { name, value } = e.target;
    const newEditProduce = [...details];
    newEditProduce[index][name] = value;
    setDetails(newEditProduce);

    const updatedRow = newEditProduce[index];

    // Dynamically set payload based on input name
    const payload = {
      OD_ID: updatedRow.col2,
    };

    if (name === "col7") {
      payload.ean_required = value;
    } else if (name === "col15") {
      payload.bonus = value;
    } else if (name === "col16") {
      payload.adjusted_gw_od = value;
    }

    try {
      await axios.post(`${API_BASE_URL}/updatedoOrderPacking`, payload);
      // Optional: Refresh or notify
    } catch (error) {
      console.error("Failed to update packing:", error);
    }
  };

  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");

  const getDetails = async (orderId, odId) => {
    // try {
    //   const response = await axios.post(`${API_BASE_URL}/getOrderPacking`, {
    //     order_id: orderId,
    //     od_id: odId,
    //   });
    //   console.log(response);
    //   if (response.data.data.buns !== undefined) {
    //     // Merge the new bonus and adjusted_gw_od values with the existing details array
    //     setDetails((prevDetails) =>
    //       prevDetails.map((item) =>
    //         item.order_id === orderId && item.od_id === odId
    //           ? {
    //               ...item,
    //               bonus: response.data.data.buns,
    //               adjusted_gw_od: response.data.data.adjusted_gw_od,
    //               order_packing_id: response.data.data.order_packing_id,
    //               ean_per_od: response.data.data.new_pc_od,
    //               Number_of_boxes: response.data.data.new_box_od,
    //               net_weight: response.data.data.new_nw_od,
    //             }
    //           : item
    //       )
    //     );
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    // }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getOrdersDetails();
    details.forEach((v) => {
      if (+v.status !== 1 && !v.bonus && !v.adjusted_gw_od) {
        getDetails(v.order_id, v.od_id); // Call getDetails with orderId and odId
      }
    });
  }, []);
  console.log(stock);
  console.log(bonus, adjustedId);
  const doPackaging = async (index, orderId) => {
    const data = details[index];
    console.log(data);

    setIsLoading(true);
    loadingModal.fire();

    try {
      // Replace the key EAN_To_Pack with ean_per_od in the data object

      await axios
        .post(`${API_BASE_URL}/doOrderPacking`, {
          od_id: orderId,
          user_id: localStorage.getItem("id"),
        })
        .then((response) => {
          console.log(response);
          setDetails(response.data.data || []);
        })
        .then((response) => {
          console.log(response);
          toast.success("Order packaged successfully", {
            theme: "colored",
          });
          getOrdersDetails();
        });
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 400) {
        console.log(e.response.data.message);
        setStock(e.response.data.message);
        console.log(">>>>>>>>>>>>");
        // Open a modal here
        setShow(true);
      } else {
        toast.error("Something went wrong", {
          theme: "colored",
        });
      }
    } finally {
      loadingModal.close();
      setIsLoading(false);

      // Disable the button after it's clicked
      setDisabledPackagingButtons((prevDisabledButtons) => [
        ...prevDisabledButtons,
        index,
      ]);
    }
  };

  const restoreOrderPackaging = (id, id1, index) => {
    console.log(id);
    // Check if the button is already disabled
    // if (disabledButtons.includes(index)) {
    //   return;
    // }

    // Disable the button
    // setDisabledButtons((prevDisabledButtons) => [
    //   ...prevDisabledButtons,
    //   index,
    // ]);

    axios
      .post(`${API_BASE_URL}/RestoreOrderPacking`, {
        order_id: id,
        od_id: id1,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        if (response?.data?.success == false) {
          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getOrdersDetails();
        }
        console.log(response);
        if (response?.data?.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getOrdersDetails();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatterThree = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 3,
    maxmumFractionDigits: 3,
  });
  //  const formatterNo = new Intl.NumberFormat("en-US", {
  //   style: "decimal",
  //   minimumFractionDigits: 0,
  //   maxmumFractionDigits: 0,
  // });

  const formatterNo = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const handleSaveEdit = async (index) => {
    if (isReadOnly || isLoading) return;

    const row = details[index];
    const payload = {
      OD_ID: row.col2,
    };

    if (editedValue.col7 !== undefined) payload.ean_required = editedValue.col7;
    if (editedValue.col15 !== undefined) payload.bonus = editedValue.col15;
    if (editedValue.col16 !== undefined)
      payload.adjusted_gw_od = editedValue.col16;

    try {
      await axios.post(`${API_BASE_URL}/updatedoOrderPacking`, payload);

      // Update the main state only after successful update
      const updatedDetails = [...details];
      updatedDetails[index] = {
        ...updatedDetails[index],
        ...editedValue,
      };
      setDetails(updatedDetails);
      setEditRowIndex(null);
      setEditRowIndex1(null);
      setEditRowIndex2(null);

      setEditedValue({});
      getOrdersDetails();
      toast.success("Value updated successfully!");
    } catch (error) {
      console.error("Failed to update packing:", error);
    }
  };
  const [editBuns, setEditBuns] = useState(null);
  const showEditBuns = (index) => {
    setEditBuns(index);
  };
  return (
    <>
      <Card title="Expense Item Management / Edit Form">
        <div
          id="datatable_wrapper"
          className="information_dataTables dataTables_wrapper dt-bootstrap4 px-4"
        >
          <div className="formCreate ">
            <form action="">
              <div className="row formEan">
                <div className="col-lg-3 form-group">
                  <h6> Order Code </h6>
                  <input
                    readOnly
                    className="border-0"
                    value={from?.Order_Number || ""}
                  />
                </div>
                <div className="col-lg-3 form-group">
                  <h6>Shipment Ref </h6>
                  <input
                    readOnly
                    className="border-0"
                    value={from?.Shipment_ref || ""}
                  />
                </div>
                <div className="col-lg-3 form-group">
                  <h6> Load Date </h6>
                  <input
                    readOnly
                    className="border-0"
                    value={
                      from?.load_date
                        ? new Date(from?.load_date).toLocaleDateString()
                        : ""
                    }
                  />
                </div>
                <div className="col-lg-3 form-group">
                  <h6> Load Time </h6>
                  <input
                    readOnly
                    className="border-0"
                    value={
                      from?.load_date
                        ? new Date(from?.load_date).toLocaleTimeString()
                        : ""
                    }
                  />
                </div>
              </div>
              <div
                id="datatable_wrapper"
                className="orderPackingEdit information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
              >
                <table
                  id="example"
                  className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      {tableHeader &&
                        Object.entries(tableHeader)
                          .filter(
                            ([key]) =>
                              !["Order_ID", "OD ID", "Status"].includes(key)
                          )
                          .map(([key, label]) => <th key={key}>{label}</th>)}
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {details.map((v, i) => {
                      if (+v.status !== 1 && !v.bonus && !v.adjusted_gw_od) {
                        getDetails(v.order_id, v.od_id);
                      }

                      return (
                        <tr className="rowCursorPointer align-middle" key={i}>
                          <td className="text-start">{v.col3}</td>
                          <td className="text-center">
                            <>{v.col4}</>
                          </td>
                          <td className="text-center">
                            <>{v.col5}</>
                          </td>
                          <td className="text-center">
                            <>{formatterThree.format(v.col6)}</>
                          </td>

                          <td className="text-end">
                            <div className="eanReq">
                              <div>
                                {v.col17 === 0 ? (
                                  editRowIndex === i ? (
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="number"
                                        className="mb-0"
                                        onChange={handleInputChange}
                                        defaultValue={v.col7}
                                        name="col7"
                                      />
                                      <i
                                        className="mdi mdi-check ps-2 cursor-pointer"
                                        onClick={() => handleSaveEdit(i)}
                                      ></i>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-end">
                                      <p className="mb-0">{v.col7}</p>
                                      <i
                                        onClick={() => showEditEan(i, v)}
                                        className="mdi mdi-pencil ps-2 cursor-pointer"
                                      ></i>
                                    </div>
                                  )
                                ) : (
                                  <>
                                    {formatterNo.format(
                                      parseFloat(v.col7) || 0
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="text-end">
                            <>{formatterThree.format(v.col8)}</>
                          </td>
                          <td className="text-end">
                            <>{formatterThree.format(v.col9)}</>
                          </td>
                          <td className="text-end">
                            <>{formatterThree.format(v.col10)}</>
                          </td>
                          <td className="text-end">
                            <>{formatterThree.format(v.col11)}</>
                          </td>
                          <td className="text-end">
                            <>{formatterThree.format(v.col12)}</>
                          </td>
                          <td className="text-end">
                            {formatterThree.format(parseFloat(v.col13) || 0)}
                          </td>
                          <td className="text-end">
                            {formatterNo.format(parseFloat(v.col14) || 0)}
                          </td>

                          {/* <td className="text-end">
                            <div className="eanReq">
                              <div>
                                {editBoxes === i ? (
                                  <div>
                                    {v.col17 === 1 ? (
                                      <div>
                                        <input
                                          type="number"
                                          className="mb-0"
                                          onBlur={() => setEditBoxes(null)}
                                          onChange={(e) =>
                                            handleEditValues(i, e)
                                          }
                                          value={v.col15}
                                          name="col15"
                                        />
                                        <i className="mdi mdi-check ps-2"></i>
                                      </div>
                                    ) : (
                                      formatterNo.format(
                                        parseFloat(v.col15) || 0
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="d-flex">
                                    <p>{v.col15}</p>
                                    <i
                                      onClick={() => showEditBoxes(i)}
                                      className="mdi mdi-pencil ps-2"
                                    ></i>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td> */}
                          <td className="text-end">
                            <div className="eanReq">
                              <div>
                                {v.col17 === 1 ? (
                                  editRowIndex1 === i ? (
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="number"
                                        className="mb-0"
                                        onChange={handleInputChange}
                                        defaultValue={v.col15}
                                        name="col15"
                                      />
                                      <i
                                        className="mdi mdi-check ps-2 cursor-pointer"
                                        onClick={() => handleSaveEdit(i)}
                                      ></i>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-end">
                                      <p className="mb-0">{v.col15}</p>
                                      <i
                                        onClick={() => showEditEan1(i, v)}
                                        className="mdi mdi-pencil ps-2 cursor-pointer"
                                      ></i>
                                    </div>
                                  )
                                ) : (
                                  <>
                                    {formatterNo.format(
                                      parseFloat(v.col15) || 0
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="eanReq">
                              <div>
                                {v.col17 === 1 ? (
                                  editRowIndex2 === i ? (
                                    <div className="d-flex align-items-center">
                                      <input
                                        type="number"
                                        className="mb-0"
                                        onChange={handleInputChange}
                                        defaultValue={v.col16}
                                        name="col16"
                                      />
                                      <i
                                        className="mdi mdi-check ps-2 cursor-pointer"
                                        onClick={() => handleSaveEdit(i)}
                                      ></i>
                                    </div>
                                  ) : (
                                    <div className="d-flex align-items-center justify-content-end">
                                      <p className="mb-0">{v.col16}</p>
                                      <i
                                        onClick={() => showEditEan2(i, v)}
                                        className="mdi mdi-pencil ps-2 cursor-pointer"
                                      ></i>
                                    </div>
                                  )
                                ) : (
                                  <>
                                    {formatterNo.format(
                                      parseFloat(v.col16) || 0
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>
                            {!isReadOnly && +v.col17 === 0 && (
                              <button
                                type="button"
                                className="py-1"
                                onClick={() => doPackaging(i, v.col2)}
                              >
                                <i className="mdi mdi-package-variant-closed text-2xl"></i>
                              </button>
                            )}
                            {!isReadOnly && +v.col17 === 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  restoreOrderPackaging(v.col1, v.col2, i);
                                }}
                              >
                                <i
                                  className="mdi mdi-restore"
                                  style={{
                                    width: "20px",
                                    color: "#203764",
                                    fontSize: "22px",
                                    marginTop: "10px",
                                  }}
                                />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>
        <div className="card-footer">
          <Link className="btn btn-danger" to={"/orderPackaging"}>
            Cancel
          </Link>
        </div>
        <Modal className="modalError" show={show} onHide={handleClose}>
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Stock Check
              </h1>
              <button
                style={{ color: "#fff", fontSize: "30px" }}
                type="button"
                onClick={() => setShow(false)}
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="eanCheck errorMessage">
                <p>{stock.message ? stock.message : "NULL"}</p>
                <p>{stock.message2 ? stock.message2 : "NULL"}</p>
                {/* <p>{stock.message3 ? stock.message3 : "NULL"}</p> */}
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </Modal>
      </Card>
    </>
  );
};
