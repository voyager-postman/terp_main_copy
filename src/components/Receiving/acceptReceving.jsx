import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Button, Modal } from "react-bootstrap";
const Acceptreceiving = () => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [color, setColor] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);

  const [stock, setStock] = useState("");
  const { from } = location.state || {};
  console.log(from);
  const defaultState = {
    pod_code: from?.PODCODE,
    rcv_crate: from?.Crates,
    rcvd_qty: from?.Quantity,
    rcv_crate_weight: "",
    rcv_gross_weight: "",
    rcvd_unit_id: from?.Unit,
    user_id: localStorage.getItem("id"),
  };

  const [state, setState] = useState(defaultState);
  const [unitType, setUnitType] = useState([]);
  const closeIcon = () => {
    setShow(false);
    navigate("/receiving");
  };
  const getUnitType = () => {
    axios
      .get(`${API_BASE_URL}/getAllUnit`)
      .then((response) => {
        setUnitType(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUnitType();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const addBank = () => {
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    axios
      .post(`${API_BASE_URL}/addreceving`, {
        ...state,
        pod_type_id: from?.pod_type_id,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        console.log(response.data.success, "Check response");

        if (response.data.success && response.data.data == "1") {
          console.log(response.data.data.message);
          setStock(response.data.message);
          console.log(">>>>>>>>>>>>");
          setColor(true);
          // Open a modal here
          setShow(true);
        } else if (!response.data.success && response.data.data == "1") {
          console.log(response.data.data.message);
          setStock(response.data.message);
          console.log(">>>>>>>>>>>>");
          // Open a modal here
          setShow(true);
        } else if (response.data.success && response.data.data == "2") {
          toast.success("receiving Added Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/receiving");
        }
      })
      .catch((error) => {
        console.log(error);
        setIsButtonDisabled(false); // Re-enable the button on error
      });
  };

  return (
    <main className="main-content">
      <div>
        <nav
          className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl"
          id="navbarBlur"
          navbar-scroll="true"
        >
          <div className="py-1 px-0">
            <nav aria-label="breadcrumb"></nav>
          </div>
        </nav>

        <div className="  pt-1 py-4 px-0">
          <div className="row">
            <div className="col-lg-12 col-md-12 mb-4">
              <div className="bg-white">
                <div className="databaseTableSection pt-0">
                  <div className="grayBgColor" style={{ padding: "18px" }}>
                    <div className="row">
                      <div className="col-md-6">
                        <h6 className="font-weight-bolder mb-0">
                          Operation / Accept Reciving
                        </h6>
                      </div>
                    </div>
                  </div>

                  <div className="top-space-search-reslute p-3 mt-0">
                    <div className="tab-content px-2 md:!px-4">
                      <div
                        className="tab-pane active"
                        id="header"
                        role="tabpanel"
                      >
                        <div
                          id="datatable_wrapper"
                          className="information_dataTables dataTables_wrapper dt-bootstrap4"
                        >
                          <div className="d-flex exportPopupBtn"></div>
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div className="form-group col-lg-3">
                                  <h6>POD Code</h6>
                                  <input
                                    type="text"
                                    name="rcv_crate"
                                    className="form-control border-0"
                                    readOnly
                                    value={from?.PODCODE}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Name</h6>
                                  <input
                                    type="text"
                                    name="rcv_crate"
                                    className="form-control border-0"
                                    readOnly
                                    value={from?.Name_EN}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Unit</h6>
                                  <input
                                    type="text"
                                    name="rcv_crate"
                                    className="form-control border-0"
                                    readOnly
                                    value={from?.Unit_Name}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="form-group col-lg-3">
                                  <h6>Crate</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_crate"
                                    className="form-control"
                                    value={state.rcv_crate}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Quantity</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcvd_qty"
                                    className="form-control"
                                    value={state.rcvd_qty}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Crate Weight</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_crate_weight"
                                    className="form-control"
                                    value={state.rcv_crate_weight}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Gross Weight</h6>
                                  <input
                                    onChange={handleChange}
                                    type="text"
                                    name="rcv_gross_weight"
                                    className="form-control"
                                    value={state.rcv_gross_weight}
                                  />
                                </div>
                                <div className="form-group col-lg-3">
                                  <h6>Unit</h6>
                                  <select
                                    onChange={handleChange}
                                    name="rcvd_unit_id"
                                    className="form-control"
                                    value={state.rcvd_unit_id}
                                  >
                                    <option value="">Select Unit</option>
                                    {unitType.map((unit) => (
                                      <option value={unit.ID}>
                                        {unit.Name_EN}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button
                          onClick={addBank}
                          className="btn btn-primary"
                          disabled={isButtonDisabled}
                          type="submit"
                          name="signup"
                        >
                          Accept
                        </button>
                        <Link className="btn btn-danger" to="/receiving">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="modalError receiveModal"
        show={show}
        onHide={handleClose}
      >
        <div className="modal-content">
          <div
            className="modal-header border-0"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Receive Check
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              // onClick={() => setShow(false)}
              onClick={closeIcon}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage recheckReceive">
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.Message_EN ? stock.Message_EN : "NULL"}
              </p>
              <p style={{ backgroundColor: color ? "" : "#631f37" }}>
                {stock.Message_TH ? stock.Message_TH : "NULL"}
              </p>
              <div className="closeBtnRece">
                <button onClick={closeIcon}>Close</button>
              </div>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal>
      {/* <Modal className="modalError" show={show} onHide={handleClose}>
        <div className="modal-content">
          <div
            className="modal-header"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <h1 className="modal-title fs-5" id="exampleModalLabel">
            Receive  Check
            </h1>
            <button
              style={{ color: "#fff", fontSize: "30px" }}
              type="button"
              onClick={() => setShow(false)}
            >
              <i class="mdi mdi-close"></i>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          >
            <div className="eanCheck errorMessage">
              <p>{stock.Message_EN ? stock.Message_EN : "NULL"}</p>
              <p>{stock.Message_TH ? stock.Message_TH : "NULL"}</p>
            </div>
          </div>
          <div
            className="modal-footer"
            style={{ backgroundColor: color ? "#2f423c" : "" }}
          ></div>
        </div>
      </Modal> */}
    </main>
  );
};

export default Acceptreceiving;
