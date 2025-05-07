import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
const MySwal = withReactContent(Swal);
const Vacation = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const handleChangeDate = (date) => {
    setStartDate(date);
  };
  const handleChangeDateOne = (date) => {
    setStartDate(date);
  };
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
  const [formData, setFormData] = useState({
    employee: "",
    leave_type: "",
    startDate: "",
    endDate: "",
    numberOfLeaveDays: "",
    vacation_id: "",
  });
  const [allEmployeeList, setAllEmployeeList] = useState([]); // List of provinces
  const [paymentDetailsType, setPaymentDetailsType] = useState([]); // List of provinces

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}GetAllEmployee`)
      .then((response) => {
        const employees = response.data.data.map((employee) => ({
          employee_id: employee.employee_id,
          full_name: `${employee.f_name} ${employee.l_name}`,
        }));
        setAllEmployeeList(employees);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}GetLeaves`)
      .then((response) => {
        console.log(response);
        setPaymentDetailsType(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  const handleStartDateChange = (date) => {
    console.log(date);
    setStartDate(date);
    calculateLeaveDays(date, endDate);
  };

  const handleEndDateChange = (date) => {
    console.log(date);
    setEndDate(date);
    calculateLeaveDays(startDate, date);
  };

  // const calculateLeaveDays = (start, end) => {
  //   if (start && end) {
  //     const differenceInTime = end.getTime() - start.getTime();
  //     const differenceInDays =
  //       Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       numberOfLeaveDays: differenceInDays > 0 ? differenceInDays : 0,
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       numberOfLeaveDays: "", // Clear the field if no valid dates are selected
  //     }));
  //   }
  // };

  const calculateLeaveDays = (start, end) => {
    if (start && end) {
      const differenceInTime = end.getTime() - start.getTime();
      const differenceInDays =
        Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1; // Include both start and end dates
      setFormData((prevData) => ({
        ...prevData,
        numberOfLeaveDays: differenceInDays > 0 ? differenceInDays : 0,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        numberOfLeaveDays: "", // Clear the field if no valid dates are selected
      }));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleChange = (e, newValue) => {
  //   const { name, value, type } = e.target;

  //   if (name === "employee" && newValue) {
  //     // If the change is from the Autocomplete, update the employee data
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       employee: newValue.employee_id, // Set the employee_id
  //       Name_Surname: newValue.full_name, // Set the full name
  //     }));
  //   } else if (type === "file" && e.target.files.length > 0) {
  //     // Handle file input for "picture"
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: e.target.files[0], // Set the binary file data directly
  //     }));
  //   } else {
  //     // Handle text and other input fields
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;

    setFormData({
      ...formData,
      leave_type: selectedProvince,
    });
  };
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [vacations, setVacations] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);

  const getAllVacation = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GetAllVacations`);
      console.log("Vacation data:", response.data.data);
      setVacations(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching Vacation:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllVacation();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  // Filter data based on search input
  const filteredData = vacations.filter(
    (row) =>
      (row.employee_id && row.employee_id.toString().includes(search)) ||
      (row.f_name && row.f_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.leaves_type &&
        row.leaves_type.toLowerCase().includes(search.toLowerCase())) ||
      (row.created_at && formatDate(row.created_at).includes(search)) ||
      (row.days && row.days.toString().includes(search))
  );

  useEffect(() => {
    console.log("vacations:", vacations);
  }, [vacations]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Get the current entries based on pagination
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
  const handleSubmit = async () => {
    console.log(startDate);
    console.log(endDate);
    try {
      // Prepare the payload
      const payload = {
        employee_id: formData.employee,
        leaves_id: formData.leave_type,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
        days: formData.numberOfLeaveDays,
      };

      // Send the payload to the API
      const response = await axios.post(`${API_BASE_URL}AddVacation`, payload);

      console.log("API Response:", response); // Log the API response for debugging
      getAllVacation();
      // Close the modal using React method
      const modal = document.getElementById("exampleModal");
      if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        modal.style.display = "none";

        // Remove the backdrop manually
        const modalBackdrops = document.querySelectorAll(".modal-backdrop");
        modalBackdrops.forEach((backdrop) => backdrop.remove());

        // Remove body class to avoid scroll issues
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      }

      // Reset form data
      setFormData({
        employee: "",
        leave_type: "",
        startDate: "",
        endDate: "",
        numberOfLeaveDays: "",
        vacation_id: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Vacation created successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error during Salary creation:", error);

      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while creating the Salary."
        : "An unexpected error occurred. Please try again.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };
  const defaultStateSet = (row) => {
    // date_of_birth: new Date(row.birthdate).toISOString().split("T")[0] || "",
    // Log the row to check the data structure
    console.log(row);

    // Update formData state with the row data
    setFormData({
      salary_id: row.salary_id,
      //   period: new Date(row.month).toISOString().slice(0, 7) || "", // "YYYY-MM"
      employee: row.employee_id || "",
      leave_type: row.leaves_id || "",
      // startDate: new Date(row.start_date).toISOString().split("T")[0] || "",
      // endDate: new Date(row.end_date).toISOString().split("T")[0] || "",
      numberOfLeaveDays: row.days || "",
      vacation_id: row.vacation_id || "",
    });
    // setStartDate(row.start_date);
    // setEndDate(row.end_date);
    setStartDate(new Date(row.start_date));
    setEndDate(new Date(row.end_date));
  };
  const updateSubmitData = async () => {
    console.log(formData.salary_id);
    try {
      // Prepare the payload
      const payload = {
        vacation_id: formData.vacation_id,
        employee_id: formData.employee,
        leaves_id: formData.leave_type,
        start_date: moment(startDate).format("YYYY-MM-DD"),
        end_date: moment(endDate).format("YYYY-MM-DD"),
        days: formData.numberOfLeaveDays,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}UpdateVacation`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllVacation();
      // Close the modal using React method
      const modal = document.getElementById("exampleModalEdit");
      if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        modal.style.display = "none";

        // Remove the backdrop manually
        const modalBackdrops = document.querySelectorAll(".modal-backdrop");
        modalBackdrops.forEach((backdrop) => backdrop.remove());

        // Remove body class to avoid scroll issues
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      }

      // Reset form data
      setFormData({
        employee: "",
        leave_type: "",
        startDate: "",
        endDate: "",
        numberOfLeaveDays: "",
        vacation_id: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Vacation Updated  successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error during Salary creation:", error);

      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while creating the Salary."
        : "An unexpected error occurred. Please try again.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };
  const clearAllData = () => {
    setStartDate("");
    setEndDate("");
    setFormData({
      employee: "",
      leave_type: "",
      startDate: "",
      endDate: "",
      numberOfLeaveDays: "",
      vacation_id: "",
    });
  };
  const deleteEmployee = (id) => {
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
          const response = await axios.post(`${API_BASE_URL}DeleteVacation`, {
            vacation_id: id,
          });
          console.log(response);
          getAllVacation();
          toast.success("Vacation delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
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
                <h6 className="font-weight-bolder mb-0">Vacation Management</h6>
                <button
                  type="button"
                  className="btn button btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Create
                </button>
                {/* create modal */}
                {/* <div
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
                          Vacation Management Create Form
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllData}
                        />
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="createFormInput autocompleteField">
                                <h6>พนักงาน </h6>
                                <Autocomplete
                                  options={allEmployeeList || []} // Ensure options is always an array
                                  getOptionLabel={(option) =>
                                    option?.employee_id && option?.full_name
                                      ? `${option.employee_id}: ${option.full_name}`
                                      : ""
                                  } // Safely display the label
                                  value={
                                    allEmployeeList?.find(
                                      (v) => v.employee_id === formData.employee
                                    ) || null
                                  } // Match selected value
                                  onChange={(event, newValue) => {
                                    setFormData({
                                      ...formData,
                                      employee: newValue?.employee_id || "", // Set employee_id or clear if null
                                    });
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.employee_id === value?.employee_id
                                  } // Safely compare employee_id
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Employee"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ประเภทการลา </h6>
                                <select
                                  value={formData.leave_type}
                                  onChange={handleProvinceChange}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="">- เลือกตำบล -</option>
                                  {paymentDetailsType.map((type) => (
                                    <option
                                      key={type.leaves_id}
                                      value={type.leaves_id}
                                    >
                                      {type.leaves_type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>เริ่มวันที่ </h6>
                                <input
                                  type="date"
                                  name="startDate"
                                  value={formData.startDate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6> สิ้นสุดวันที่</h6>
                                <input
                                  type="date"
                                  name="endDate"
                                  value={formData.endDate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="createFormInput">
                                <h6> จำนวนวันที่ลา</h6>
                                <input
                                  type="text"
                                  name="numberOfLeaveDays"
                                  value={formData.numberOfLeaveDays}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div> */}
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
                          Vacation Management Create Form
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
                        <form action="">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="createFormInput autocompleteField">
                                <h6>พนักงาน </h6>
                                <Autocomplete
                                  options={allEmployeeList || []} // Ensure options is always an array
                                  getOptionLabel={(option) =>
                                    option?.employee_id && option?.full_name
                                      ? `${option.employee_id}: ${option.full_name}`
                                      : ""
                                  } // Safely display the label
                                  value={
                                    allEmployeeList?.find(
                                      (v) => v.employee_id === formData.employee
                                    ) || null
                                  } // Match selected value
                                  onChange={(event, newValue) => {
                                    setFormData({
                                      ...formData,
                                      employee: newValue?.employee_id || "", // Set employee_id or clear if null
                                    });
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option.employee_id === value?.employee_id
                                  } // Safely compare employee_id
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Employee"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ประเภทการลา </h6>
                                <select
                                  value={formData.leave_type}
                                  onChange={handleProvinceChange}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="">- เลือกตำบล -</option>
                                  {paymentDetailsType.map((type) => (
                                    <option
                                      key={type.leaves_id}
                                      value={type.leaves_id}
                                    >
                                      {type.leaves_type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput datePicker">
                                <h6>เริ่มวันที่ </h6>

                                <DatePicker
                                  selected={startDate}
                                  onChange={handleStartDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Click to select a date"
                                  customInput={<CustomInput />}
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6> สิ้นสุดวันที่</h6>

                                <DatePicker
                                  selected={endDate}
                                  onChange={handleEndDateChange}
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Click to select a date"
                                  customInput={<CustomInput />}
                                />
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="createFormInput">
                                <h6> จำนวนวันที่ลา</h6>
                                <input
                                  type="text"
                                  name="numberOfLeaveDays"
                                  value={formData.numberOfLeaveDays}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          type="button"
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
                          <th>หมายเลขพนักงาน </th>
                          <th>พนักงาน </th>
                          <th>ประเภทการลา </th>
                          <th>วันที่ลา</th>
                          <th>จำนวนวันที่ลา </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.map((row) => (
                          <tr>
                            <td>{row.employee_id}</td>
                            <td>{row.f_name}</td>
                            <td>{row.leaves_type}</td>
                            <td>
                              {row.start_date1}-{row.end_date2}
                            </td>
                            <td>{row.days} </td>
                            <td>
                              <div className="editIcon">
                                <i
                                  type="button"
                                  className=" mdi mdi-pencil"
                                  data-bs-toggle="modal"
                                  data-bs-target="#exampleModalEdit"
                                  onClick={() => defaultStateSet(row)}
                                >
                                  {" "}
                                </i>
                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteEmployee(row.vacation_id)
                                  }
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
                                        Vacation Management Edit Form
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
                                      <form action="">
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="createFormInput autocompleteField">
                                              <h6>พนักงาน </h6>
                                              <Autocomplete
                                                options={allEmployeeList || []} // Ensure options is always an array
                                                getOptionLabel={(option) =>
                                                  option?.employee_id &&
                                                  option?.full_name
                                                    ? `${option.employee_id}: ${option.full_name}`
                                                    : ""
                                                } // Safely display the label
                                                value={
                                                  allEmployeeList?.find(
                                                    (v) =>
                                                      v.employee_id ===
                                                      formData.employee
                                                  ) || null
                                                } // Match selected value
                                                onChange={(event, newValue) => {
                                                  setFormData({
                                                    ...formData,
                                                    employee:
                                                      newValue?.employee_id ||
                                                      "", // Set employee_id or clear if null
                                                  });
                                                }}
                                                isOptionEqualToValue={(
                                                  option,
                                                  value
                                                ) =>
                                                  option.employee_id ===
                                                  value?.employee_id
                                                } // Safely compare employee_id
                                                renderInput={(params) => (
                                                  <TextField
                                                    {...params}
                                                    placeholder="Select Employee"
                                                    variant="outlined"
                                                  />
                                                )}
                                              />
                                            </div>
                                          </div>

                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>ประเภทการลา </h6>
                                              <select
                                                value={formData.leave_type}
                                                onChange={handleProvinceChange}
                                                style={{
                                                  width: 300,
                                                  padding: "8px",
                                                }}
                                              >
                                                <option value="">
                                                  - เลือกตำบล -
                                                </option>
                                                {paymentDetailsType.map(
                                                  (type) => (
                                                    <option
                                                      key={type.leaves_id}
                                                      value={type.leaves_id}
                                                    >
                                                      {type.leaves_type}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>เริ่มวันที่ </h6>
                                              {/* <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                              /> */}
                                              <DatePicker
                                                selected={startDate}
                                                onChange={handleStartDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Click to select a date"
                                                customInput={<CustomInput />}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6> สิ้นสุดวันที่</h6>
                                              {/* <input
                                                type="date"
                                                name="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                              /> */}
                                              <DatePicker
                                                selected={endDate}
                                                onChange={handleEndDateChange}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Click to select a date"
                                                customInput={<CustomInput />}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-12">
                                            <div className="createFormInput">
                                              <h6> จำนวนวันที่ลา</h6>
                                              <input
                                                type="text"
                                                name="numberOfLeaveDays"
                                                value={
                                                  formData.numberOfLeaveDays
                                                }
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                      <button
                                        type="button"
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
                            <td colSpan="6">No data found</td>
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

                    <div className="overflowPagination">
                      <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageIndex = index + 1;
                          if (totalPages > 10) {
                            if (
                              pageIndex === 1 || // Always show the first page
                              pageIndex === totalPages || // Always show the last page
                              (pageIndex >= currentPage - 2 &&
                                pageIndex <= currentPage + 2) // Show current page ±2
                            ) {
                              return (
                                <button
                                  key={pageIndex}
                                  onClick={() => setCurrentPage(pageIndex)}
                                  className={
                                    currentPage === pageIndex ? "active" : ""
                                  }
                                >
                                  <span>{pageIndex}</span>
                                </button>
                              );
                            } else if (
                              (pageIndex === 2 && currentPage > 5) || // Add ellipsis for hidden pages after the first page
                              (pageIndex === totalPages - 1 &&
                                currentPage < totalPages - 4) // Add ellipsis for hidden pages before the last page
                            ) {
                              return <span key={pageIndex}>...</span>;
                            } else {
                              return null; // Hide other page numbers
                            }
                          } else {
                            return (
                              <button
                                key={pageIndex}
                                onClick={() => setCurrentPage(pageIndex)}
                                className={
                                  currentPage === pageIndex ? "active" : ""
                                }
                              >
                                <span>{pageIndex}</span>
                              </button>
                            );
                          }
                        })}
                      </div>
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

export default Vacation;
