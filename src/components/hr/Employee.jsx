import { React, useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../Url/Url";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom"; // Import navigation hook
const MySwal = withReactContent(Swal);

const Employee = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    employee_id: "",
    card_number: "",
    name: "",
    surname: "",
    nickname: "",
    nicknameEn: "",
    date_of_birth: "",
    address: "",
    province: "",
    district: "",
    subDistrict: "",
    zip_code: "",
    telephone_number: "",
    line_type: "",
    date_of_employment: "",
    trial_period: "",
    bank_account_number: "",
    bank_name: "",
    picture: null,
  });
  const [provinces, setProvinces] = useState([]); // List of provinces
  const [districts, setDistricts] = useState([]); // List of districts
  const [subDistricts, setSubDistricts] = useState([]); // List of sub-districts
  const [employees, setEmployees] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [contactDataShow, setContactDataShow] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);

  const getAllEmployee = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GetAllEmployee`);
      console.log("Employee data:", response.data.data);
      setEmployees(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllEmployee();
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}GetProvinces`)
      .then((response) => {
        console.log(response);
        setProvinces(response.data.data); // Assuming the response has a data array
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);
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
          const response = await axios.post(`${API_BASE_URL}DeleteEmployee`, {
            employee_id: id,
          });
          console.log(response);
          getAllEmployee();
          toast.success("Employee delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  // Handle Province Change
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;

    setFormData({
      ...formData,
      province: selectedProvince,
      district: "",
      subDistrict: "",
    });
    setDistricts([]); // Clear districts
    setSubDistricts([]); // Clear sub-districts

    // Fetch districts based on the selected province
    axios
      .get(`${API_BASE_URL}GetDistrict`, {
        params: { provinces_id: selectedProvince },
      })
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching districts:", error);
      });
  };
  const defaultStateSet = (row) => {
    // Log the row to check the data structure
    console.log(row);

    // Update formData state with the row data
    setFormData({
      employee_id: row.employee_id || "",
      card_number: row.thai_id || "",
      name: row.f_name || "",
      surname: row.l_name || "",
      nickname: row.n_name || "",
      nicknameEn: row.en_name || "",
      date_of_birth: new Date(row.birthdate).toISOString().split("T")[0] || "",
      address: row.address || "",
      province: row.province || "",
      district: row.district || "",
      subDistrict: row.sub_district || "",
      zip_code: row.code || "",
      telephone_number: row.phone_number || "",
      line_type: row.line_id || "",
      date_of_employment:
        new Date(row.employee_startdate).toISOString().split("T")[0] || "",
      trial_period: row.probation || "",
      bank_account_number: row.banknum || "",
      bank_name: row.bankname || "",
      picture: row.photo_file || null,
    });

    // Fetch districts if province exists
    if (row.province) {
      axios
        .get(`${API_BASE_URL}GetDistrict`, {
          params: { provinces_id: row.province },
        })
        .then((response) => {
          setDistricts(response.data.data);

          // Fetch sub-districts if district exists
          if (row.district) {
            axios
              .get(`${API_BASE_URL}GetSubDistrict`, {
                params: { district_id: row.district },
              })
              .then((subResponse) => {
                setSubDistricts(subResponse.data.data);
              })
              .catch((error) => {
                console.error("Error fetching sub-districts:", error);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  };

  const contactDetails = (row) => {
    axios
      .post(`${API_BASE_URL}GetContractByEmplId`, {
        employee_id: row, // Data is sent in the request body
      })
      .then((response) => {
        console.log(response);
        setContactDataShow(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching sub-districts:", error);
      });
  };

  console.log(formData.picture);
  // Handle District Change
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;

    setFormData({ ...formData, district: selectedDistrict, subDistrict: "" });
    setSubDistricts([]); // Clear sub-districts

    // Fetch sub-districts based on the selected district
    axios
      .get(`${API_BASE_URL}GetSubDistrict`, {
        params: { district_id: selectedDistrict },
      })
      .then((response) => {
        setSubDistricts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching sub-districts:", error);
      });
  };

  const handleSubDistrictChange = (e) => {
    const selectedSubDistrict = e.target.value;

    setFormData({ ...formData, subDistrict: selectedSubDistrict });
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Handle file input for "picture"
    if (type === "file" && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0], // Set the binary file data directly
      }));
    } else {
      // Handle text and other input fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();

      // Append all fields to FormData
      formDataToSend.append("card_number", formData.card_number);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("nickname_en", formData.nicknameEn);
      formDataToSend.append("dob", formData.date_of_birth);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("sub_district", formData.subDistrict);
      formDataToSend.append("zip_code", formData.zip_code);
      formDataToSend.append("telephone_number", formData.telephone_number);
      formDataToSend.append("line_id", formData.line_type);
      formDataToSend.append("Work_start_date", formData.date_of_employment);
      formDataToSend.append("probation_period", formData.trial_period);
      formDataToSend.append(
        "bank_account_number",
        formData.bank_account_number
      );
      formDataToSend.append("bank_name", formData.bank_name);
      formDataToSend.append("profile", formData.picture); // Attach the file

      // Send the FormData using axios
      const response = await axios.post(
        `${API_BASE_URL}CreateEmployee`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllEmployee();
      let modalElement = document.getElementById("exampleModal");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      setFormData({
        card_number: "",
        name: "",
        surname: "",
        nickname: "",
        nicknameEn: "",
        date_of_birth: "",
        address: "",
        province: "",
        district: "",
        subDistrict: "",
        zip_code: "",
        telephone_number: "",
        line_type: "",
        date_of_employment: "",
        trial_period: "",
        bank_account_number: "",
        bank_name: "",
        picture: null, // Reset file input
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear the file input
      }
      navigate("/employee");
      Swal.fire({
        title: "Success!",
        text: "Employee created successfully!",
        icon: "success",
      });
    } catch (error) {
      // Handle API or network errors
      console.error("Error during employee creation:", error);

      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while creating the employee."
        : "An unexpected error occurred. Please try again.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }

    console.log("Form Data Submitted:", formData);
  };

  const updateSubmitData = async () => {
    try {
      // Create a new FormData object
      const formDataToSend = new FormData();

      // Append all fields to FormData
      formDataToSend.append("employee_id", formData.employee_id);
      formDataToSend.append("card_number", formData.card_number);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("surname", formData.surname);
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("nickname_en", formData.nicknameEn);
      formDataToSend.append("dob", formData.date_of_birth);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("province", formData.province);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("sub_district", formData.subDistrict);
      formDataToSend.append("zip_code", formData.zip_code);
      formDataToSend.append("telephone_number", formData.telephone_number);
      formDataToSend.append("line_id", formData.line_type);
      formDataToSend.append("Work_start_date", formData.date_of_employment);
      formDataToSend.append("probation_period", formData.trial_period);
      formDataToSend.append(
        "bank_account_number",
        formData.bank_account_number
      );
      formDataToSend.append("bank_name", formData.bank_name);
      formDataToSend.append("profile", formData.picture); // Attach the file

      // Send the FormData using axios
      const response = await axios.post(
        `${API_BASE_URL}UpdateEmployee`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllEmployee();
      let modalElement = document.getElementById("exampleModalEdit");
      let modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }
      setFormData({
        card_number: "",
        employee_id: "",
        name: "",
        surname: "",
        nickname: "",
        nicknameEn: "",
        date_of_birth: "",
        address: "",
        province: "",
        district: "",
        subDistrict: "",
        zip_code: "",
        telephone_number: "",
        line_type: "",
        date_of_employment: "",
        trial_period: "",
        bank_account_number: "",
        bank_name: "",
        picture: null, // Reset file input
      });
      navigate("/employee");
      Swal.fire({
        title: "Success!",
        text: "Employee Update successfully!",
        icon: "success",
      });
    } catch (error) {
      // Handle API or network errors
      console.error("Error during employee creation:", error);

      const errorMessage = error.response
        ? error.response.data.message ||
          "An error occurred while creating the employee."
        : "An unexpected error occurred. Please try again.";

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }

    console.log("Form Data Submitted:", formData);
  };
  const clearAllData = () => {
    setFormData({
      card_number: "",
      name: "",
      surname: "",
      nickname: "",
      nicknameEn: "",
      date_of_birth: "",
      address: "",
      province: "",
      district: "",
      subDistrict: "",
      zip_code: "",
      telephone_number: "",
      line_type: "",
      date_of_employment: "",
      trial_period: "",
      bank_account_number: "",
      bank_name: "",
      picture: null, // Reset file input
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
  };
  const updateEanStatus = (eanID) => {
    const request = {
      employee_id: eanID,
    };

    axios
      .post(`${API_BASE_URL}/EmployeeStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          getAllEmployee();
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

  const filteredData = employees.filter(
    (row) =>
      (row.f_name && row.f_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.n_name && row.n_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.phone_number && row.phone_number.includes(search)) ||
      (row.employee_startdate &&
        formatDate(row.employee_startdate).includes(search)) ||
      (row.employee_id && row.employee_id.toString().includes(search))
  );
  useEffect(() => {
    console.log("Employees:", employees);
  }, [employees]);
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

  return (
    <div>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="dashboardMain px-4 mt-4 mb-4">
            <div className="grayBgColor">
              <div className="d-flex justify-content-between  px-4 py-3 items-center exportPopupBtn">
                <h6 className="font-weight-bolder mb-0">Employee Management</h6>
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
                          Employee Create
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={clearAllData}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>เลขบัตรประจำตัวประชาชน</h6>
                              <input
                                type="text"
                                name="card_number"
                                value={formData.card_number}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6> ชื่อ</h6>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>นามสกุล</h6>
                              <input
                                type="text"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>ชื่อเล่น</h6>
                              <input
                                type="text"
                                name="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>ชื่อเล่น(ภาษาอังกฤษ)</h6>
                              <input
                                type="text"
                                name="nicknameEn"
                                value={formData.nicknameEn}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>วัน/เดือน/ปี เกิด</h6>
                              <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>ที่อยู่ </h6>
                              <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>จังหวัด</h6>
                              <select
                                value={formData.province}
                                onChange={handleProvinceChange}
                                style={{ width: 300, padding: "8px" }}
                              >
                                <option value="" disabled>
                                  - เลือกจังหวัด -
                                </option>
                                {provinces.map((province) => (
                                  <option key={province.id} value={province.id}>
                                    {province.name_th}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>อำเภอ</h6>
                              <select
                                value={formData.district}
                                onChange={handleDistrictChange}
                                style={{ width: 300, padding: "8px" }}
                                disabled={!formData.province} // Disable if province isn't selected
                              >
                                <option value="" disabled>
                                  - เลือกอำเภอ -
                                </option>
                                {districts.map((district) => (
                                  <option key={district.id} value={district.id}>
                                    {district.name_en}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>ตำบล</h6>
                              <select
                                value={formData.subDistrict}
                                onChange={handleSubDistrictChange}
                                style={{ width: 300, padding: "8px" }}
                                disabled={!formData.district} // Disable if district isn't selected
                              >
                                <option value="" disabled>
                                  - เลือกตำบล -
                                </option>
                                {subDistricts.map((subDistrict) => (
                                  <option
                                    key={subDistrict.id}
                                    value={subDistrict.id}
                                  >
                                    {subDistrict.name_en}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>รหัสไปรษณีย์</h6>
                              <input
                                type="text"
                                name="zip_code"
                                value={formData.zip_code}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-3">
                            <div className="createFormInput">
                              <h6>เบอร์โทรศัพท์ </h6>
                              <input
                                type="text"
                                name="telephone_number"
                                value={formData.telephone_number}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="createFormInput">
                              <h6>ไลน์ไอดี </h6>
                              <input
                                type="text"
                                name="line_type"
                                value={formData.line_type}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="createFormInput">
                              <h6>วันที่เริ่มงาน </h6>
                              <input
                                type="date"
                                name="date_of_employment"
                                value={formData.date_of_employment}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="createFormInput">
                              <h6>ระยะเวลาทดลองงาน </h6>
                              <input
                                type="text"
                                name="trial_period"
                                value={formData.trial_period}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="createFormInput">
                              <h6>เลขบัญชีธนาคาร </h6>
                              <input
                                type="text"
                                name="bank_account_number"
                                value={formData.bank_account_number}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="createFormInput">
                              <h6>ชื่อธนาคาร </h6>
                              <input
                                type="text"
                                name="bank_name"
                                value={formData.bank_name}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="createFormInput">
                              <h6>รูปภาพ </h6>
                              <input
                                type="file"
                                name="picture"
                                accept="image/*"
                                onChange={handleChange}
                                ref={fileInputRef} // Attach the ref to the file input
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="btn btn-primary"
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
                  <div className="row dashCard53 mt-5 py-3 mb-4">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card  ">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Picture
                            </p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">Name</p>
                            <h4 className="mb-0">0 </h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Employment Details
                            </p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              {" "}
                              Holiday Balance{" "}
                            </p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Loan Balance
                            </p>
                            <h4 className="mb-0"> 0</h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13,
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">
                              Documents Expirey Dates
                            </p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>

                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">
                              0
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mt-5">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13
                              }}
                            >
                              0{" "}
                            </div>
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">Freight</p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>
                         
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">0</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mt-5">
                      <div className="card">
                        <div className="card-header p-3 pt-2">
                          <div className="icon icon-lg icon-shape bg-gradient-primary  text-center border-radius-xl mt-n4 absolute">
                            <div
                              style={{
                                fontSize: 25,
                                color: "rgb(210, 215, 224)",
                                paddingTop: 13
                              }}
                            >
                              0{" "}
                            </div>{" "}
                          </div>
                          <div className="text-end pt-1">
                            <p className="text-sm mb-0 text-capitalize">ManHours</p>
                            <h4 className="mb-0">0</h4>
                          </div>
                        </div>
                         
                        <div className="card-footer p-3">
                          <p className="mb-0">
                            <span className="text-success text-sm font-weight-bolder">0</span>
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="table-responsive">
                    <table
                      className=" table table-striped"
                      style={{ width: "100%", marginTop: "10px" }}
                    >
                      <thead>
                        <tr>
                          <th>รหัสพนักงาน </th>
                          <th>ชื่อ</th>
                          <th> วันที่เริ่มต้น</th>
                          <th>ชื่อเล่น</th>
                          <th>เบอร์โทรศัพท์ </th>
                          <th>สถานะการทำงาน </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.length > 0 ? (
                          currentEntries.map((row) => (
                            <tr key={row.employee_id}>
                              <td>{row.employee_id}</td>

                              <td>
                                {row.f_name} {row.l_name}
                              </td>
                              <td>{formatDate(row.employee_startdate)}</td>
                              <td>{row.n_name}</td>
                              <td>{row.phone_number}</td>
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
                                    checked={
                                      row.employee_status == "on" ? true : false
                                    }
                                    onChange={() => {
                                      setIsOn(!isOn);
                                    }}
                                    onClick={() =>
                                      updateEanStatus(row.employee_id)
                                    }
                                    value={row.employee_status}
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
                                    onClick={() => defaultStateSet(row)} // Set the selected row's data
                                  >
                                    {" "}
                                  </i>
                                  <i
                                    class="mdi mdi-file-document-edit ps-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalContract"
                                    onClick={() =>
                                      contactDetails(row.employee_id)
                                    } // Set the selected row's data
                                  ></i>
                                  {/* <button
                                    type="button"
                                    onClick={() =>
                                      deleteEmployee(row.employee_id)
                                    }
                                  >
                                    <i className="mdi mdi-delete ps-2"></i>
                                  </button> */}
                                </div>

                                <div
                                  className="modal fade createModal"
                                  id="exampleModalContract"
                                  tabIndex={-1}
                                  aria-labelledby="exampleModalLabelEdit"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-xl">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h1
                                          className="modal-title fs-5"
                                          id="exampleModalLabel"
                                        >
                                          สัญญา{" "}
                                        </h1>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                          onClick={() => setContactDataShow("")}
                                        >
                                          <i className="mdi mdi-close"></i>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <form action="">
                                          <div className="createFormInput autocompleteField">
                                            <div className="row mt-4">
                                              <div className="col-lg-4">
                                                <div className="parantEmpView">
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        พนักงาน{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {
                                                        contactDataShow.employee_id
                                                      }
                                                      : {contactDataShow.f_name}{" "}
                                                      {contactDataShow.l_name}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        ประเภทพนักงาน
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {
                                                        contactDataShow.worker_type
                                                      }
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        วันที่ทำสัญญา
                                                      </strong>
                                                    </h6>
                                                    <p>
                                                      {" "}
                                                      {formatDate(
                                                        contactDataShow.contract_date
                                                      )}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div className="parantEmpView">
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        อัตราเงินเดือน{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {
                                                        contactDataShow.basic_salary
                                                      }
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        อัตราโอที/ชั่วโมง{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {contactDataShow.ot_rate}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>SSO</strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {contactDataShow.sso_rate ==
                                                      1
                                                        ? "Yes"
                                                        : "No"}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-4">
                                                <div className="parantEmpView">
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        SSO Rate
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>{contactDataShow.sso}</p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        WHT{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {" "}
                                                      {contactDataShow.WHT_rate ==
                                                      1
                                                        ? "Yes"
                                                        : "No"}
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        {" "}
                                                        ค่าที่พักอาศัย{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {contactDataShow.housing}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-4 mt-4">
                                                <div className="parantEmpView">
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        จำนวนวันลาป่วยทั้งหมด/ปี{" "}
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {
                                                        contactDataShow.sick_leave
                                                      }
                                                    </p>
                                                  </div>
                                                  <div>
                                                    <h6>
                                                      {" "}
                                                      <strong>
                                                        จำนวนวันลากิจทั้งหมด/ปี
                                                      </strong>{" "}
                                                    </h6>
                                                    <p>
                                                      {
                                                        contactDataShow.personal_leave
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                      <div className="modal-footer justify-content-center py-4">
                                        {/* <button
type="button"
className="btn btn-primary"
onClick={updateSubmitData1}
>
Update
</button> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="editIcon">
                                  <i
                                    type="button"
                                    className="mdi mdi-pencil"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalEdit"
                                    onClick={() => defaultStateSet(row)} // Set the selected row's data
                                  >
                                    {" "}
                                  </i>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteEmployee(row.employee_id)
                                    }
                                  >
                                    <i className="mdi mdi-delete ps-2"></i>
                                  </button>
                                </div> */}
                                {/* edit modal modal */}
                                <div
                                  className="modal fade createModal"
                                  id="exampleModalEdit"
                                  tabIndex={-1}
                                  aria-labelledby="exampleModalLabelEdit"
                                  aria-hidden="true"
                                >
                                  <div className="modal-dialog modal-xl">
                                    <div className="modal-content">
                                      <div className="modal-header">
                                        <h1
                                          className="modal-title fs-5"
                                          id="exampleModalLabelEdit"
                                        >
                                          Employee Update
                                        </h1>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          onClick={clearAllData}
                                          aria-label="Close"
                                        >
                                          <i className="mdi mdi-close"></i>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="row">
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6> รหัสประจำตัวพนักงาน</h6>
                                              <input
                                                type="text"
                                                name="employee_id"
                                                value={formData.employee_id}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>เลขบัตรประจำตัวประชาชน</h6>
                                              <input
                                                type="text"
                                                name="card_number"
                                                value={formData.card_number}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>

                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6> ชื่อ</h6>
                                              <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>นามสกุล</h6>
                                              <input
                                                type="text"
                                                name="surname"
                                                value={formData.surname}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ชื่อเล่น</h6>
                                              <input
                                                type="text"
                                                name="nickname"
                                                value={formData.nickname}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ชื่อเล่น(ภาษาอังกฤษ)</h6>
                                              <input
                                                type="text"
                                                name="nicknameEn"
                                                value={formData.nicknameEn}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>วัน/เดือน/ปี เกิด</h6>
                                              <input
                                                type="date"
                                                name="date_of_birth"
                                                value={formData.date_of_birth}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ที่อยู่ </h6>
                                              <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>จังหวัด</h6>
                                              <select
                                                value={formData.province}
                                                onChange={handleProvinceChange}
                                                style={{
                                                  width: 300,
                                                  padding: "8px",
                                                }}
                                              >
                                                <option value="" disabled>
                                                  - เลือกจังหวัด -
                                                </option>
                                                {provinces.map((province) => (
                                                  <option
                                                    key={province.id}
                                                    value={province.id}
                                                  >
                                                    {province.name_th}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>อำเภอ</h6>
                                              <select
                                                value={formData.district}
                                                onChange={handleDistrictChange}
                                                style={{
                                                  width: 300,
                                                  padding: "8px",
                                                }}
                                                disabled={!formData.province} // Disable if province isn't selected
                                              >
                                                <option value="" disabled>
                                                  - เลือกอำเภอ -
                                                </option>
                                                {districts.map((district) => (
                                                  <option
                                                    key={district.id}
                                                    value={district.id}
                                                  >
                                                    {district.name_en}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>

                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ตำบล</h6>
                                              <select
                                                value={formData.subDistrict}
                                                onChange={
                                                  handleSubDistrictChange
                                                }
                                                style={{
                                                  width: 300,
                                                  padding: "8px",
                                                }}
                                                disabled={!formData.district} // Disable if district isn't selected
                                              >
                                                <option value="" disabled>
                                                  - เลือกตำบล -
                                                </option>
                                                {subDistricts.map(
                                                  (subDistrict) => (
                                                    <option
                                                      key={subDistrict.id}
                                                      value={subDistrict.id}
                                                    >
                                                      {subDistrict.name_en}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>รหัสไปรษณีย์</h6>
                                              <input
                                                type="text"
                                                name="zip_code"
                                                value={formData.zip_code}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>เบอร์โทรศัพท์ </h6>
                                              <input
                                                type="text"
                                                name="telephone_number"
                                                value={
                                                  formData.telephone_number
                                                }
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ไลน์ไอดี </h6>
                                              <input
                                                type="text"
                                                name="line_type"
                                                value={formData.line_type}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>วันที่เริ่มงาน </h6>
                                              <input
                                                type="date"
                                                name="date_of_employment"
                                                value={
                                                  formData.date_of_employment
                                                }
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ระยะเวลาทดลองงาน </h6>
                                              <input
                                                type="text"
                                                name="trial_period"
                                                value={formData.trial_period}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>เลขบัญชีธนาคาร </h6>
                                              <input
                                                type="text"
                                                name="bank_account_number"
                                                value={
                                                  formData.bank_account_number
                                                }
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>ชื่อธนาคาร </h6>
                                              <input
                                                type="text"
                                                name="bank_name"
                                                value={formData.bank_name}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-12">
                                            <div className="createFormInput">
                                              <h6>รูปภาพ </h6>
                                              <input
                                                type="file"
                                                name="picture"
                                                accept="image/*"
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="modal-footer justify-content-center">
                                        <button
                                          type="button"
                                          onClick={updateSubmitData}
                                          className="btn btn-primary"
                                        >
                                          Update
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* edit modal end */}
                              </td>
                            </tr>
                          ))
                        ) : (
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

export default Employee;
