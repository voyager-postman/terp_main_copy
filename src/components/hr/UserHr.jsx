import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const paymentOptions = [
  { id: "1", name: "Active" },
  { id: "2", name: "Banned" },
];
const options = [
  { value: "staff", label: "Staff" },
  { value: "admin", label: "Admin" },
];
const handlePaymentDetailChange = (e) => {
  setSelectedPaymentDetail(e.target.value);
};
const UserHr = () => {
  const [formData, setFormData] = useState({
    role: "",
    status: "",
    name: "",
    userName: "",
    password: "",
    confirmPassword: "",
    user_id: "",
  });
  const [userList, setUserList] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  const [selectedPaymentDetail, setSelectedPaymentDetail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userPassword, setUserPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Changed from 'showPassword'

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleVisibilityToggle = () => {
    setIsPasswordVisible((prevState) => !prevState); // Changed function name
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  const getAllUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getUsers`);
      console.log("bonusDetection data:", response.data.data);
      setUserList(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching bonusDetection:", error);
      throw error; // Propagate the error
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for dropdowns
  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    getAllUser();
  }, []);
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add any additional validation if needed here
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right" });
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}CreateUsers`, {
        role: formData.role,
        status: formData.status,
        name: formData.name,
        email: formData.userName,
        password: formData.password,
      });
      console.log("User Created Successfully:", response.data);
      toast.success("User Created Successfully:", { position: "top-right" });
      getAllUser();
      let modalElement = document.getElementById("exampleModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      // Reset the form after successful submission
      setFormData({
        role: "",
        status: "",
        name: "",
        userName: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };
  const updateSubmitData = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}UpdateUsers`, {
        id: formData.user_id,
        role: formData.role,
        status: formData.status,
        name: formData.name,
      });
      console.log("User Update Successfully:", response.data);
      toast.success("User Update Successfully:", { position: "top-right" });

      let modalElement = document.getElementById("exampleModalEdit");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      getAllUser();
      // Reset the form after successful submission
      setFormData({
        role: "",
        status: "",
        name: "",
        userName: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user.");
    }
  };
  const defaultStateSet = (row) => {
    // date_of_birth: new Date(row.birthdate).toISOString().split("T")[0] || "",
    // Log the row to check the data structure
    console.log(row);

    // Update formData state with the row data
    setFormData({
      user_id: row.id,
      role: row.role,
      status: row.status,
      name: row.name,
    });
  };

  const handlepaymentDetails = (e) => setpaymentDetails(e.target.value);
  const filteredData = userList.filter(
    (row) =>
      (row.name && row.name.toLowerCase().includes(search.toLowerCase())) || // Filter by name
      (row.last_login && formatDate(row.last_login).includes(search)) || // Filter by formatted date
      (row.role && row.role.toLowerCase().includes(search.toLowerCase())) // Filter by role
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const currentEntries = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const [isButtonDisabled, setButtonDisabled] = useState(true);
  const handleCheckboxChange = (e) => {
    setButtonDisabled(!e.target.checked);
    alert("hello");
  };
  const updateEanStatus = (eanID) => {
    const request = {
      user_id: eanID,
    };

    axios
      .post(`${API_BASE_URL}/UserStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          getAllUser();
          toast.success("Status Updated Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id) => {
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
          const response = await axios.post(`${API_BASE_URL}DeleteUser`, {
            id: id,
          });
          console.log(response);
          getAllUser();
          toast.success("User delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const clearAllData = () => {
    setFormData({
      role: "",
      status: "",
      name: "",
      userName: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="dashboardMain px-4 mt-4 mb-4">
            <div className="grayBgColor">
              <div className="d-flex justify-content-between  px-4 py-3 items-center exportPopupBtn">
                <h6 className="font-weight-bolder mb-0">User Management</h6>
                <div>
                  <button
                    type="button"
                    className="btn button btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    disabled={isButtonDisabled}
                    className="btn button btn-info ms-2"
                  >
                    Delete
                  </button>
                </div>
                {/* create modal */}
                <div
                  className="modal fade createModal"
                  id="exampleModal"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          User Create
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllData}
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          {/* Role Dropdown */}
                          <div className="col-lg-6">
                            <div className="createFormInput">
                              <h6>Role</h6>
                              <select
                                name="role"
                                value={formData.role}
                                onChange={handleDropdownChange}
                                style={{ width: 300, padding: "8px" }}
                              >
                                <option value="" disabled>
                                  Select Role
                                </option>
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                          </div>

                          {/* Status Dropdown */}
                          <div className="col-lg-6">
                            <div className="createFormInput autocompleteField">
                              <h6>Status</h6>
                              <select
                                name="status"
                                value={formData.status}
                                onChange={handleDropdownChange}
                                style={{ width: 300, padding: "8px" }}
                              >
                                <option value="" disabled>
                                  Select Status
                                </option>
                                <option value="Active">Active</option>
                                <option value="Banned">Banned</option>
                              </select>
                            </div>
                          </div>

                          {/* Name */}
                          <div className="col-lg-12">
                            <div className="createFormInput">
                              <h6>Name</h6>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          {/* Username */}
                          <div className="col-lg-12">
                            <div className="createFormInput">
                              <h6>Username</h6>
                              <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div className="col-lg-6 userPass">
                            <div className="createFormInput">
                              <h6>Password</h6>
                              <div
                                style={{
                                  position: "relative",
                                  width: "100%",
                                }}
                              >
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="password"
                                  value={formData.password}
                                  onChange={handleChange}
                                />
                                <span
                                  onClick={togglePasswordVisibility}
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                  }}
                                >
                                  {showPassword ? "👁️" : "👁️‍🗨️"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="col-lg-6 userPass">
                            <div className="createFormInput">
                              <h6>Confirm Password</h6>
                              <div style={{ position: "relative" }}>
                                <input
                                  type={isPasswordVisible ? "text" : "password"}
                                  name="confirmPassword"
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                />
                                <span
                                  onClick={handleVisibilityToggle}
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                  }}
                                >
                                  {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* create modal end */}
              </div>
              <div className="tableMain bg-white">
                <div className="table-container p-4">
                  <div className="controls ">
                    <div className="paratntEntrySearch d-flex justify-content-between">
                      <div className="entries">
                        <label>
                          <span>Show</span>
                          <select
                            value={entriesPerPage}
                            onChange={handleEntriesChange}
                          >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                          </select>
                          <span>entries</span>
                        </label>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Search..."
                          value={search}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table
                      className=" table table-striped"
                      style={{ width: "100%", marginTop: "10px" }}
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleCheckboxChange}
                            />{" "}
                          </th>
                          <th className="text-start">Username </th>
                          <th>Date registered </th>
                          <th>Role</th>
                          <th style={{ width: "150px" }}>Status</th>
                          <th>Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.map((row) => (
                          <tr>
                            <td>{row.id}</td>
                            <td className="">
                              {" "}
                              <input type="checkbox" className="ms-2" />
                            </td>
                            <td className="text-start">{row.name}</td>
                            <td>{formatDate(row.last_login)}</td>
                            <td>{row.role} </td>
                            <td>
                              <label
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop: "10px",
                                }}
                                className="toggleSwitch large"
                              >
                                <input
                                  checked={row.status == "on" ? true : false}
                                  onChange={() => {
                                    setIsOn(!isOn);
                                  }}
                                  onClick={() => updateEanStatus(row.id)}
                                  value={row.status}
                                  type="checkbox"
                                />
                                <span>
                                  <span>OFF</span>
                                  <span>ON</span>
                                </span>
                                <a></a>
                              </label>
                            </td>
                            <td>
                              <div className="editIcon">
                                <i
                                  type="button"
                                  className="mdi mdi-pencil"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModalEdit"
                                  onClick={() => defaultStateSet(row)}
                                >
                                  {" "}
                                </i>
                                <i className="ps-2  fas fa-sync-alt"></i>

                                <button
                                  type="button"
                                  onClick={() => deleteUser(row.id)}
                                >
                                  <i className="mdi mdi-delete ps-2"></i>
                                </button>
                              </div>
                              {/* create modal */}
                              <div
                                className="modal fade createModal"
                                id="exampleModalEdit"
                                tabIndex={-1}
                                aria-labelledby="exampleModalLabel"
                                aria-hidden="true"
                              >
                                <div className="modal-dialog modal-xl">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        User Edit
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      >
                                        <i className="mdi mdi-close"></i>
                                      </button>
                                    </div>
                                    <div className="modal-body">
                                      <div className="row">
                                        {/* Role Dropdown */}
                                        <div className="col-lg-6">
                                          <div className="createFormInput">
                                            <h6>Role</h6>
                                            <select
                                              name="role"
                                              value={formData.role}
                                              onChange={handleDropdownChange}
                                              style={{
                                                width: 300,
                                                padding: "8px",
                                              }}
                                            >
                                              <option value="" disabled>
                                                Select Role
                                              </option>
                                              <option value="staff">
                                                Staff
                                              </option>
                                              <option value="admin">
                                                Admin
                                              </option>
                                              <option value="superadmin">
                                                SuperAdmin
                                              </option>
                                            </select>
                                          </div>
                                        </div>

                                        {/* Status Dropdown */}
                                        <div className="col-lg-6">
                                          <div className="createFormInput autocompleteField">
                                            <h6>Status</h6>
                                            <select
                                              name="status"
                                              value={formData.status}
                                              onChange={handleDropdownChange}
                                              style={{
                                                width: 300,
                                                padding: "8px",
                                              }}
                                            >
                                              <option value="" disabled>
                                                Select Status
                                              </option>
                                              <option value="on">Active</option>
                                              <option value="off">
                                                Banned
                                              </option>
                                            </select>
                                          </div>
                                        </div>

                                        {/* Name */}
                                        <div className="col-lg-12">
                                          <div className="createFormInput">
                                            <h6>Name</h6>
                                            <input
                                              type="text"
                                              name="name"
                                              value={formData.name}
                                              onChange={handleChange}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                      <button
                                        type="submit"
                                        className="btn btn-primary"
                                        onClick={updateSubmitData}
                                      >
                                        Update
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* create modal end */}
                            </td>
                          </tr>
                        ))}
                        {currentEntries.length === 0 && (
                          <tr>
                            <td colSpan="7">No data found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="pagination" style={{ marginTop: "10px" }}>
                    <button
                      className="btnPre"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    {/* Display numbered pagination */}
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={currentPage === index + 1 ? "active" : ""}
                        >
                          <span>{index + 1}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      className="btnPre"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHr;
