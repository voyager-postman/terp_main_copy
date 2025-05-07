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
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import moment from "moment";

const BonousDetection = () => {
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
    quantity: "",
    notes: "",
    bonusDeduction_id: "",
  });
  const [bonusDetection, setBonusDetection] = useState([]);
  const [allEmployeeList, setAllEmployeeList] = useState([]); // List of provinces
  const [paymentDetailsType, setPaymentDetailsType] = useState([]); // List of provinces

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  const [empDetails, setempDetails] = useState("");
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);

  const getAllBonusDetection = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}GetAllbonusAndDeduction`
      );
      console.log("bonusDetection data:", response.data.data);
      setBonusDetection(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching bonusDetection:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllBonusDetection();
  }, []);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}GetAllEmployee`)
      .then((response) => {
        // Assuming the response contains data in the form { data: [ ... ] }
        const employees = response.data.data.map((employee) => ({
          employee_id: employee.employee_id,
          full_name: `${employee.f_name} ${employee.l_name}`, // Combine f_name and l_name
        }));
        setAllEmployeeList(employees); // Set the formatted employee list
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);
  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}
GetBonusTransactionsType`
      )
      .then((response) => {
        console.log(response);
        setPaymentDetailsType(response.data.data); // Assuming the response has a data array
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;

    setFormData({
      ...formData,
      leave_type: selectedProvince,
    });
  };
  const handleChange = (e, newValue) => {
    const { name, value, type } = e.target;

    // Handle Autocomplete component (employee selection)
    if (name === "employee" && newValue) {
      // If the change is from the Autocomplete, update the employee data
      setFormData((prevData) => ({
        ...prevData,
        employee: newValue.employee_id, // Set the employee_id
        Name_Surname: newValue.full_name, // Set the full name
      }));
    }
    // Handle file input for picture
    else if (type === "file" && e.target.files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0], // Set the binary file data directly
      }));
    }
    // Handle DatePicker (for date input)
    else if (name === "startDate" && newValue) {
      // If it's a DatePicker (startDate), update the selected date
      setFormData((prevData) => ({
        ...prevData,
        startDate: newValue, // Set the selected date
      }));
    }
    // Handle all other text and input fields
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Set the field value for text inputs
      }));
    }
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

  const handlepaymentDetails = (e) => setpaymentDetails(e.target.value);
  const handleempDetails = (e) => setempDetails(e.target.value);
  // Filter data based on search input

  const filteredData = bonusDetection.filter(
    (row) =>
      (row.employee_id && row.employee_id.toString().includes(search)) ||
      (row.f_name && row.f_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.leaves_type &&
        row.leaves_type.toLowerCase().includes(search.toLowerCase())) ||
      (row.created_at && formatDate(row.created_at).includes(search)) ||
      (row.days && row.days.toString().includes(search))
  );

  useEffect(() => {
    console.log("vacations:", bonusDetection);
  }, [bonusDetection]);

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
  const handleSubmit = async () => {
    try {
      // Prepare the payload

      const payload = {
        employee_id: formData.employee,
        transactions_id: formData.leave_type,
        transactions_date: moment(formData.startDate).format("YYYY-MM-DD"),
        amount: formData.quantity,
        reason: formData.notes,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}AddbonusDeduction`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllBonusDetection();
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
        quantity: "",
        notes: "",
        bonusDeduction_id: "",
      });

      Swal.fire({
        title: "Success!",
        text: "BonusDetection created successfully!",
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
      //   period: new Date(row.month).toISOString().slice(0, 7) || "", // "YYYY-MM"
      employee: row.employee_id || "",
      leave_type: row.transactions_id || "",
      startDate:
        new Date(row.transactions_date).toISOString().split("T")[0] || "",
      quantity: row.amount || "",
      notes: row.reason || "",
      bonusDeduction_id: row.bonusDeduction_id || "",
    });
  };
  const updateSubmitData = async () => {
    try {
      // Prepare the payload
      const payload = {
        employee_id: formData.employee,
        transactions_id: formData.leave_type,
        transactions_date: moment(formData.startDate).format("YYYY-MM-DD"),
        amount: formData.quantity,
        reason: formData.notes,
        bonusDeduction_id: formData.bonusDeduction_id,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}UpdatebonusDeduction`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllBonusDetection();
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
        quantity: "",
        notes: "",
        bonusDeduction_id: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Bonus Detection Updated  successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error during Advance Payment creation:", error);

      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while creating the Advance Payment."
        : "An unexpected error occurred. Please try again.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };
  const clearAllData = () => {
    setFormData({
      employee: "",
      leave_type: "",
      startDate: "",
      quantity: "",
      notes: "",
      bonusDeduction_id: "",
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
          const response = await axios.post(
            `${API_BASE_URL}DeletebonusDeduction`,
            {
              bonusDeduction_id: id,
            }
          );
          console.log(response);
          getAllBonusDetection();
          toast.success("Bonus Detection delete successfully");
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
                <h6 className="font-weight-bolder mb-0">
                  Bonus and Deduction Management
                </h6>
                <button
                  type="button"
                  className="btn button btn-info"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  Create
                </button>
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
                          Bonus Detection Create
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
                                <h6> วัน/เดือน/ปี </h6>
                                {/* <input
                                  type="date"
                                  name="startDate"
                                  value={formData.startDate}
                                  onChange={handleChange}
                                /> */}
                                <DatePicker
                                  selected={formData.startDate}
                                  onChange={(date) =>
                                    handleChange({
                                      target: {
                                        name: "startDate",
                                        value: date,
                                      },
                                    })
                                  }
                                  dateFormat="dd/MM/yyyy"
                                  placeholderText="Click to select a date"
                                  customInput={<CustomInput />}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6> จำนวน </h6>
                                <input
                                  type="number"
                                  name="quantity"
                                  value={formData.quantity}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ประเภท </h6>
                                <select
                                  value={formData.leave_type}
                                  onChange={handleProvinceChange}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="">- เลือกตำบล -</option>
                                  {paymentDetailsType.map((type) => (
                                    <option
                                      key={type.transactions_id}
                                      value={type.transactions_id}
                                    >
                                      {type.transactions_type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="createFormInput">
                                <h6> หมายเหตุ </h6>
                                <input
                                  type="text"
                                  name="notes"
                                  value={formData.notes}
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
                          <th style={{ width: "155px" }}>หมายเลขพนักงาน </th>

                          <th style={{ width: "300px" }}>พนักงาน </th>
                          <th style={{ width: "155px" }}>วัน/เดือน/ปี</th>
                          <th style={{ width: "155px" }}>จำนวน(บาท) </th>
                          <th style={{ width: "155px" }}>ประเภท </th>
                          <th style={{ width: "155px" }}>หมายเหตุ </th>
                          <th style={{ width: "155px" }}>Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.map((row) => (
                          <tr>
                            <td>{row.employee_id}</td>
                            <td>{row.f_name}</td>
                            <td>{formatDate(row.transactions_date)}</td>
                            <td>{row.amount}</td>
                            <td>{row.transactions_type} </td>
                            <td>{row.reason} </td>
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
                                    deleteEmployee(row.bonusDeduction_id)
                                  }
                                >
                                  <i className="mdi mdi-delete ps-2"></i>
                                </button>
                              </div>
                              {/* edit modal */}
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
                                        Bonus Detection Edit
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
                                              <h6> วัน/เดือน/ปี </h6>
                                              {/* <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                              /> */}
                                              <DatePicker
                                                selected={formData.startDate}
                                                onChange={(date) =>
                                                  handleChange({
                                                    target: {
                                                      name: "startDate",
                                                      value: date,
                                                    },
                                                  })
                                                }
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Click to select a date"
                                                customInput={<CustomInput />}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6> จำนวน </h6>
                                              <input
                                                type="number"
                                                name="quantity"
                                                value={formData.quantity}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>ประเภท </h6>
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
                                                      key={type.transactions_id}
                                                      value={
                                                        type.transactions_id
                                                      }
                                                    >
                                                      {type.transactions_type}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-lg-12">
                                            <div className="createFormInput">
                                              <h6> หมายเหตุ </h6>
                                              <input
                                                type="text"
                                                name="notes"
                                                value={formData.notes}
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

export default BonousDetection;
