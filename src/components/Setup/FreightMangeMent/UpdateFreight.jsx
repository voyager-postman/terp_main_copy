import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { toast } from "react-toastify";
import MySwal from "../../../swal";
const UpdateFreight = () => {
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const defaultState = {
    user_id: localStorage.getItem("id"),
    id: from?.ID || "",
    Freight_provider: from?.Freight_provider,
    liner: from?.liner,
    from_port: from?.from_port,
    destination_port: from?.destination_port,
    range1: from?.range1,
    range2: from?.range2,
    range3: from?.range3,
    range4: from?.range4,
    price1: from?.price1,
    price2: from?.price2,
    price3: from?.price3,
    price4: from?.price4,
  };

  const [state, setState] = useState(defaultState);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const [vendorList, setVendorList] = useState([]);
  const [portList, setportList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [minWeight, setMinWeight] = useState();
  const [minWeight1, setMinWeight1] = useState();

  const [tableId, setTableID] = useState();

  const [rate, setRate] = useState();
  const [rate1, setRate1] = useState();

  const [linerList, setlinerList] = useState([]);

  const currentportType = useMemo(() => {
    return portList?.find((item) => item.port_id == state.from_port)
      ?.port_type_id;
  }, [state.from_port, portList]);

  const update = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/${from?.ID ? "updateFreight" : "addFreight"}`, {
        ...state,
        port_type: currentportType,
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Freight Added Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/freightNew");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const tableData = () => {
    axios
      .post(`${API_BASE_URL}/GetfreightRouteCost`, {
        freight_route_id: from?.ID,
      })
      .then((response) => {
        console.log(response);
        setTableList(response.data.freightData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleEditClick = (item) => {
    setMinWeight(item.Min_Weight);
    setRate(item.Cost);
    setTableID(item.ID); // Optionally, store the selected item
  };
  const updateData = () => {
    console.log(rate);
    console.log(minWeight);
    axios
      .post(`${API_BASE_URL}/EditfreightRouteCost`, {
        freight_route_cost_id: tableId,
        Min_Weight: minWeight,
        Cost: rate,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        toast.success("Freight  Update Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        tableData();
        let modalElement = document.getElementById("exampleModal");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went Wrong ");
      });
  };
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/DeletefreightRouteCost`,
            {
              freight_cost_id: id,
            }
          );
          console.log(response);
          tableData();
          toast.success("Freight delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const dataClear = () => {
    setMinWeight1("");
    setRate1("");
  };
  const updateData1 = () => {
    console.log(rate);
    console.log(minWeight);
    axios
      .post(`${API_BASE_URL}/AddfreightRouteCost`, {
        Freight_Route_ID: from?.ID,
        Min_Weight: minWeight1,
        Cost: rate1,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
        setMinWeight1("");
        setRate1("");
        toast.success("Freight Added Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        tableData();
        let modalElement = document.getElementById("exampleModal1");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went Wrong ");
      });
  };

  useEffect(() => {
    tableData();
  }, []);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/getAllVendor`)
      .then((response) => {
        setVendorList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${API_BASE_URL}/getAllAirports`)
      .then((response) => {
        setportList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${API_BASE_URL}/getLiner`)
      .then((response) => {
        setlinerList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Card title={`Frieght Management / ${from?.ID ? "Update" : "Edit"} Form`}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="d-flex exportPopupBtn"></div>
              <div className="formCreate">
                <form action="">
                  <div>
                    <div className=" d-flex">
                      <div className=" d-flex pe-5">
                        <h6 className="me-2">Vendor : </h6>
                        <p> {from?.Freight_provider_name}</p>
                      </div>
                      <div className=" d-flex">
                        <h6 className="me-2">Liner : </h6>
                        <p>{from?.Airline}</p>
                      </div>
                    </div>
                    <div className=" d-flex">
                      <div className=" d-flex pe-5">
                        <h6 className="me-2">Port of Origin : </h6>
                        <p> {from?.FromPort}</p>
                      </div>
                      <div className=" d-flex">
                        <h6 className="me-2">Destination Port : </h6>
                        <p> {from?.DestinationPort}</p>
                      </div>
                    </div>
                  </div>
                </form>
                <button
                  className="btn btn-primary"
                  type="submit"
                  name="signup"
                  // onClick={update}
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal1"
                >
                  Add
                </button>
                <div
                  className="modal fade"
                  id="exampleModal1"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          ADD Freight
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={dataClear}
                        >
                          <i className="mdi mdi-close" />
                        </button>
                      </div>
                      <div className="modal-body modalFreightNew">
                        <div className="formCreate">
                          <div>
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-6">
                                  <h6>Min Weight</h6>
                                  <div>
                                    <input
                                      type="text"
                                      value={minWeight1}
                                      onChange={(e) =>
                                        setMinWeight1(e.target.value)
                                      }
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <h6>Rate</h6>
                                  <div>
                                    <input
                                      type="text"
                                      value={rate1}
                                      onChange={(e) => setRate1(e.target.value)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer justify-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={updateData1}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                >
                  <table
                    id="example"
                    className="display table table-hover table-striped borderTerpProduce table-responsive modalFreightNew"
                    style={{ width: "100%" }}
                  >
                    <tr>
                      <th>Min Weight</th>
                      <th>Rate</th>
                      <th>Action</th>
                    </tr>

                    {tableList?.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="formCreate">
                            <div className="thbFrieght">
                              <td>{item.Min_Weight}</td>
                            </div>
                          </div>
                        </td>
                        <td>{item.Cost}</td>
                        <td>
                          <>
                            <i
                              className="mdi mdi-pencil"
                              style={{
                                width: "20px",
                                color: "#203764",
                                fontSize: "22px",
                                marginTop: "10px",
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              onClick={() => handleEditClick(item)}
                            />
                            <button
                              type="button"
                              onClick={() => deleteOrder(item.ID)}
                            >
                              <i
                                className="mdi mdi-delete"
                                style={{
                                  color: "rgb(32, 55, 100)",
                                  fontSize: 30,
                                  marginTop: 10,
                                  paddingBottom: 8,
                                }}
                              />
                            </button>
                          </>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer ps-0">
            {/* Modal */}
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Edit Freight
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
                    </button>
                  </div>
                  <div className="modal-body modalFreightNew">
                    <div className="formCreate">
                      <form action="">
                        <div>
                          <div className="form-group">
                            <div className="row">
                              <div className="col-lg-6">
                                <h6>Min Weight</h6>
                                <div>
                                  <input
                                    type="text"
                                    value={minWeight}
                                    onChange={(e) =>
                                      setMinWeight(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <h6>Rate</h6>
                                <div>
                                  <input
                                    type="text"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="modal-footer justify-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={updateData}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Link className="btn btn-danger" to={"/freightNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateFreight;
