import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import MySwal from "../../../swal";
const UpdateTransport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tableList, setTableList] = useState([]);

  const { from } = location.state || {};
  console.log(from);
  const [formData, setFormData] = useState({
    Transport_Route_ID: "",
    truck: "",
    max_weight: "",
    max_cbm: "",
    max_pallet: "",
    Cost: "",
  });
  const [formData1, setFormData1] = useState({
    Transport_Route_ID: "",
    truck: "",
    max_weight: "",
    max_cbm: "",
    max_pallet: "",
    Cost: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChange1 = (e) => {
    const { name, value } = e.target;
    setFormData1({ ...formData1, [name]: value });
  };
  // Function to handle the click on the pencil (edit) button
  const handleEditClick = (data) => {
    setFormData({
      transport_route_cost_id: data.transport_id,
      truck: data.truck,
      max_weight: data.max_weight,
      max_cbm: data.max_cbm,
      max_pallet: data.max_pallet,
      Cost: data.Cost,

      user_id: localStorage.getItem("id"),
    });
  };
  const tableData = () => {
    axios
      .post(`${API_BASE_URL}/getTransportRouteCost`, {
        transport_id: from?.transport_id,
      })
      .then((response) => {
        console.log(response);
        setTableList(response.data.transportData);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    tableData();
  }, []);
  // Function to call the API on form submit
  const updatePort = async () => {
    console.log(formData);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/EditTransportRouteCost`,
        formData
      );
      console.log(response.data); // Log the response
      tableData();
      toast.success("Transport  Update Successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      let modalElement = document.getElementById("exampleModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went Wrong ");
    }
  };
  const dataClear = () => {
    setFormData1({
      Transport_Route_ID: "",
      truck: "",
      max_weight: "",
      max_cbm: "",
      max_pallet: "",
      Cost: "",
    });
  };
  const updatePort1 = async () => {
    console.log(formData1);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/AddTransportRouteCost`,
        {
          Transport_Route_ID: from.transport_id,
          truck: formData1.truck,
          max_weight: formData1.max_weight,
          max_cbm: formData1.max_cbm,
          max_pallet: formData1.max_pallet,
          Cost: formData1.Cost,
          user_id: localStorage.getItem("id"),
        }
      );
      console.log(response.data); // Log the response
      tableData();
      setFormData1({
        Transport_Route_ID: "",
        truck: "",
        max_weight: "",
        max_cbm: "",
        max_pallet: "",
        Cost: "",
      });
      toast.success("Transport Added Successfully", {
        autoClose: 1000,
        theme: "colored",
      });
      let modalElement = document.getElementById("exampleModalAdd");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went Wrong ");
    }
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
            `${API_BASE_URL}/DeleteTransportRouteCost`,
            {
              Transportation_cost_id: id,
            }
          );
          console.log(response);
          tableData();
          toast.success("Transport delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  return (
    <Card
      title={`Transportation Management / ${
        typeof from?.transport_id == "undefined" ? "Create" : "Update"
      } Form`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="d-flex">
                    <div className=" form-group">
                      <div className="flex pe-5">
                        <h6 className="me-2">Vendor : </h6>
                        <p>{from.Transportation_provider_name}</p>
                      </div>
                    </div>
                    <div className="d-flex">
                      <h6 className="me-2">From location : </h6>
                      <p>{from.location}</p>
                    </div>
                  </div>

                  <div className="d-flex  form-group">
                    <h6 className="me-2">Depature Port : </h6>
                    <p>{from.port}</p>
                  </div>

                  <button
                    className="btn btn-primary"
                    type="button"
                    // name="signup"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalAdd"
                  >
                    Add
                  </button>
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
                        <th> Truck</th>
                        <th>Max Weight</th>
                        <th>Max CBM</th>
                        <th>Max Pallet </th>
                        <th>Cost</th>
                        <th>KG Cost</th>
                        <th>CBM Cost</th>
                        <th>Action</th>
                      </tr>
                      {tableList?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="formCreate">
                              <div className="thbFrieght">
                                <td>{item.truck}</td>
                              </div>
                            </div>
                          </td>
                          <td>{item.max_weight}</td>
                          <td>{item.max_cbm}</td>
                          <td>{item.max_pallet}</td>
                          <td>{item.Cost}</td>
                          <td>{item.KG_Cost}</td>
                          <td>{item.CBM_Cost}</td>
                          <td>
                            <>
                              <div>
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
                                  onClick={() => deleteOrder(item.transport_id)}
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
                              </div>
                            </>
                          </td>
                        </tr>
                      ))}
                    </table>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Edit Transport
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
                          <div className="row bottomUnset">
                            <div className="col-lg-6">
                              <h6>Truck</h6>
                              <div>
                                <input
                                  type="text"
                                  name="truck"
                                  value={formData.truck}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6>Max Weight</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_weight"
                                  value={formData.max_weight}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6>Max CBM</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_cbm"
                                  value={formData.max_cbm}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6> Max Pallet</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_pallet"
                                  value={formData.max_pallet}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <h6> Cost</h6>
                              <div>
                                <input
                                  type="text"
                                  name="Cost"
                                  value={formData.Cost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            {/* <div className="col-lg-12">
                              <h6> KG Cost</h6>
                              <div>
                                <input
                                  type="text"
                                  name="KG_Cost"
                                  value={formData.KG_Cost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div> */}
                            {/* <div className="col-lg-12">
                              <h6> CBM Cost</h6>
                              <div>
                                <input
                                  type="text"
                                  name="CBM_Cost"
                                  value={formData.CBM_Cost}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div> */}
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
                    onClick={updatePort}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="exampleModalAdd"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalAdd">
                    Add Transport
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
                    <form action="">
                      <div>
                        <div className="form-group">
                          <div className="row bottomUnset">
                            <div className="col-lg-6">
                              <h6>Truck</h6>
                              <div>
                                <input
                                  type="text"
                                  name="truck"
                                  value={formData1.truck}
                                  onChange={handleInputChange1}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6>Max Weight</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_weight"
                                  value={formData1.max_weight}
                                  onChange={handleInputChange1}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6>Max CBM</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_cbm"
                                  value={formData1.max_cbm}
                                  onChange={handleInputChange1}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <h6> Max Pallet</h6>
                              <div>
                                <input
                                  type="text"
                                  name="max_pallet"
                                  value={formData1.max_pallet}
                                  onChange={handleInputChange1}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <h6> Cost</h6>
                              <div>
                                <input
                                  type="text"
                                  name="Cost"
                                  value={formData1.Cost}
                                  onChange={handleInputChange1}
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
                    onClick={updatePort1}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              //   onClick={updatePort}
            >
              {typeof from?.transport_id == "undefined" ? "Create" : "Update"}
            </button>
            <Link className="btn btn-danger" to={"/transportNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateTransport;
