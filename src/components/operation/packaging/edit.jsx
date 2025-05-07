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

  const { from } = location.state || {};
  console.log(from);

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
      })
      .catch((e) => {});
  };

  const handleEditValues = (index, e) => {
    if (isReadOnly || isLoading) return;
    const newEditProduce = [...details];
    newEditProduce[index][e.target.name] = e.target.value;
    setDetails(newEditProduce);
  };

  const { data: unit } = useQuery("getAllUnit");
  const { data: itf } = useQuery("getItf");

  const getDetails = async (orderId, odId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getOrderPacking`, {
        order_id: orderId,
        od_id: odId,
      });
      console.log(response);

      if (response.data.data.buns !== undefined) {
        // Merge the new bonus and adjusted_gw_od values with the existing details array
        setDetails((prevDetails) =>
          prevDetails.map((item) =>
            item.order_id === orderId && item.od_id === odId
              ? {
                  ...item,
                  bonus: response.data.data.buns,
                  adjusted_gw_od: response.data.data.adjusted_gw_od,
                  order_packing_id: response.data.data.order_packing_id,
                  ean_per_od: response.data.data.new_pc_od,
                  Number_of_boxes: response.data.data.new_box_od,
                  net_weight: response.data.data.new_nw_od,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
  const doPackaging = async (index, orderId, odId) => {
    console.log(index, orderId, odId);
    const data = details[index];
    console.log(data);
    if (!data.bonus || !data.adjusted_gw_od)
      return toast.error("Please enter all values", {
        theme: "colored",
      });
    setIsLoading(true);
    loadingModal.fire();

    try {
      // Replace the key EAN_To_Pack with ean_per_od in the data object
      const modifiedData = {
        ...data,
        ean_per_od: data.EAN_To_Pack,
        net_weight: data.NW_To_Pack,
        Number_of_boxes: data.Boxes,
        user_id: localStorage.getItem("id"),
        // Replace EAN_To_Pack with ean_per_od
      };

      await axios
        .post(`${API_BASE_URL}/doOrderPacking`, {
          ...modifiedData,
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

  const restoreOrderPackaging = (id, index) => {
    console.log(id);
    // Check if the button is already disabled
    if (disabledButtons.includes(index)) {
      return;
    }

    // Disable the button
    setDisabledButtons((prevDisabledButtons) => [
      ...prevDisabledButtons,
      index,
    ]);

    axios
      .post(`${API_BASE_URL}/RestoreOrderPacking`, {
        opid: id,
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
                className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
              >
                <table
                  id="example"
                  className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>ITF</th>
                      <th> Brand </th>
                      <th>% Completed</th>
                      <th>EAN Required</th>
                      <th>EAN Packed</th>
                      <th>EAN to Pack</th>
                      <th>Net weight Required</th>
                      <th>Net weight Packed</th>
                      <th>Net weight to Pack</th>
                      <th>Number of Box</th>
                      <th>Buns</th>
                      <th>Weight Adjustment</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((v, i) => {
                      if (+v.status !== 1 && !v.bonus && !v.adjusted_gw_od) {
                        getDetails(v.order_id, v.od_id); // Call getDetails with orderId and odId
                      }

                      return (
                        <tr className="rowCursorPointer align-middle" key={i}>
                          <td className="">{v.ITF}</td>
                          <td>
                            <>{v.Name_exp_3}</>
                          </td>
                          <td>
                            <>{v.Percentage_Packed}</>
                          </td>
                          <td>
                            <>{v.EAN_Required}</>
                          </td>
                          <td>
                            <>{v.Packed}</>
                          </td>
                          <td>
                            {+v.status != 1 ? (
                              <>{v.EAN_To_Pack}</>
                            ) : (
                              <input
                                type="number"
                                className="!w-24 mb-0"
                                onChange={(e) => handleEditValues(i, e)}
                                value={v.EAN_To_Pack}
                                defaultValue="0"
                                name="EAN_To_Pack"
                              />
                            )}
                          </td>
                          <td>
                            <>{v.Net_Weight}</>
                          </td>
                          <td>
                            <>{v.Packed_NW}</>
                          </td>
                          <td>
                            {+v.status != 1 ? (
                              <>{v.NW_To_Pack || 0}</>
                            ) : (
                              <input
                                type="number"
                                className="!w-24 mb-0"
                                onChange={(e) => handleEditValues(i, e)}
                                value={v.NW_To_Pack}
                                defaultValue="0"
                                name="NW_To_Pack"
                              />
                            )}
                          </td>
                          <td>
                            {+v.status != 1 ? (
                              <>{v.Boxes}</>
                            ) : (
                              <input
                                type="number"
                                className="!w-24 mb-0"
                                onChange={(e) => handleEditValues(i, e)}
                                value={v.Boxes}
                                defaultValue="0"
                                name="Boxes"
                              />
                            )}
                          </td>

                          <td>
                            {+v.status !== 1 ? (
                              v.bonus || 0
                            ) : (
                              <input
                                type="number"
                                className="!w-24 mb-0"
                                onChange={(e) => handleEditValues(i, e)}
                                defaultValue="0"
                                value={v.bonus}
                                name="bonus"
                              />
                            )}
                          </td>
                          <td>
                            {+v.status !== 1 ? (
                              v.adjusted_gw_od || 0
                            ) : (
                              <input
                                type="number"
                                className="!w-24 mb-0"
                                onChange={(e) => handleEditValues(i, e)}
                                defaultValue="0"
                                value={v.adjusted_gw_od}
                                name="adjusted_gw_od"
                              />
                            )}
                          </td>

                          <td>
                            {!isReadOnly && +v.status === 1 && (
                              <button
                                type="button"
                                disabled={disabledPackagingButtons.includes(i)}
                                className="py-1"
                                onClick={() => doPackaging(i)}
                              >
                                <i className="mdi mdi-package-variant-closed text-2xl"></i>
                              </button>
                            )}

                            {!isReadOnly && +v.status === 0 && (
                              <button
                                type="button"
                                disabled={disabledButtons.includes(i)}
                                onClick={() => {
                                  restoreOrderPackaging(v.order_packing_id, i);
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
                <p>{stock.message3 ? stock.message3 : "NULL"}</p>
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </Modal>
      </Card>
    </>
  );
};
