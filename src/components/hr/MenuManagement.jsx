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
const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
];

const MenuManagement = () => {
  const [menuList, setMenuList] = useState([]);

  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const data = [
    { id: 1, userName: "Joy	", dateRegister: "13/2024" },
    { id: 5, userName: "allen	", dateRegister: "13/2024" },
    { id: 6, userName: "james	", dateRegister: "13/2024" },
    { id: 7, userName: "Joy	", dateRegister: "13/2024" },
    { id: 9, userName: "Joy	", dateRegister: "13/2024" },
    { id: 10, userName: "Joy	", dateRegister: "13/2024" },
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  const getAllMenu = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GetMenu`);
      console.log("bonusDetection data:", response.data.data);
      setMenuList(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching bonusDetection:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllMenu();
  }, []);
  const handlepaymentDetails = (e) => setpaymentDetails(e.target.value);
  const filteredData = menuList.filter((row) => {
    const searchTerm = search.toLowerCase(); // Normalize search term for case-insensitive comparison

    return (
      (row.menu_id ?? "").toString().includes(searchTerm) || // Check ID
      (row.name ?? "").toLowerCase().includes(searchTerm) || // Check Name
      (row.created
        ? new Date(row.created).toLocaleDateString().includes(searchTerm) // Format and check Date
        : false)
    );
  });

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
  };
  const deleteSalary = (id) => {
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
          const response = await axios.post(`${API_BASE_URL}DeleteMenu`, {
            menu_id: id,
          });
          console.log(response);
          getAllMenu();
          toast.success("Menu delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const updateEanStatus = (eanID) => {
    const request = {
      menu_id: eanID,
    };

    axios
      .post(`${API_BASE_URL}/ChangeMenuStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          getAllMenu();
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
  return (
    <div>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="dashboardMain px-4 mt-4 mb-4">
            <div className="grayBgColor">
              <div className="d-flex justify-content-between  px-4 py-3 items-center exportPopupBtn">
                <h6 className="font-weight-bolder mb-0">Menu Management</h6>
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
                    className=" ms-2 btn button btn-info"
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
                          Salary Create
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row mb-2">
                            <h5 className="text-start">
                              รายละเอียดพนักงาน / Employee Details
                            </h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>ประจำเดือน </h6>
                                <input type="date" />
                              </div>
                            </div>

                            <div className="col-lg-3">
                              <div className="createFormInput autocompleteField">
                                <h6>พนักงาน</h6>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>ชื่อ - นามสกุล </h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รายละเอียดการชำระเงิน </h6>
                                <select
                                  value={paymentDetails}
                                  onChange={handlepaymentDetails}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="" disabled>
                                    - เลือกตำบล -
                                  </option>
                                  {options.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2 mt-2">
                            <h5 className="text-start">
                              รายละเอียดเงินเดือน (รายละเอียดการรับเงิน ){" "}
                            </h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>เงินเดือน(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รวมโอที(ชั่วโมง) </h6>
                                <input type="date" />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>เงินโอที(ชั่วโมง/บาท) </h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รวมโอทีทั้งหมด(บาท) </h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>ค่าที่พักอาศัย(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>เงินพิเศษ(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>รวมรายการรับทั้งหมด(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2 mb-2">
                            <h5 className="text-start">รายละเอียดการหักเงิน</h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ประกันสังคม(บาท) </h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>รายการหักเงินอื่นๆ</h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ชำระเงินคืนบริษัท(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>รวมรายการหักทั้งหมด(บาท)</h6>
                                <input type="text" />
                              </div>
                            </div>
                          </div>
                          <div className="row mb-2 mt-2">
                            <h5 className="text-start">
                              รายละเอียดการรับเงินทั้งหมด
                            </h5>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>รายละเอียดการรับเงินทั้งหมด(บาท) </h6>
                                <input type="text" />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>
                                  รายละเอียด หมายเหตุ(เงินพิเศษ / เงิกหัก){" "}
                                </h6>
                                <input type="text" />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <h5 className="text-start">
                              รายละเอียดการลาและการกู้ยืม
                            </h5>
                            <h5 className="text-start">
                              ยอดการลางานรวมประจำปี
                            </h5>
                          </div>
                          <div className="row mt-1">
                            <div className="col-lg-1">
                              <p className="text-start">ลาป่วย </p>
                            </div>
                            <div className="col-lg-11">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลา </h6>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลาคงเหลือ</h6>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row mt-2">
                            <div className="col-lg-1">
                              <p className="text-start">ลาป่วย </p>
                            </div>
                            <div className="col-lg-11">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลา </h6>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลาคงเหลือ</h6>
                                        <input type="text" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <h5 className="text-start">
                              รายละเอียดการกู้ยืมเงิน
                            </h5>
                            <div className="col-lg-1">
                              <p className="text-start">เงินค้างชำระบริษัท</p>
                            </div>
                            <div className="col-lg-11 mt-1">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="createFormInput parentSick">
                                    <div>
                                      <h6>ยอดทั้งหมด </h6>
                                      <input type="text" />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput parentSick">
                                    <div>
                                      <h6>ยอดคงเหลือ</h6>
                                      <input type="text" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-primary">
                          Update
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
                              className="ms-2"
                            />
                          </th>
                          <th className="text-start">Name of menu </th>
                          <th>Created </th>

                          <th style={{ width: "150px" }}>Status</th>
                          <th>Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.map((row) => (
                          <tr>
                            <td>{row.menu_id}</td>
                            <td className="">
                              {" "}
                              <input type="checkbox" className="ms-2" />
                            </td>
                            <td className="text-start">{row.name}</td>
                            <td>{formatDate(row.created)}</td>
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
                                  onClick={() => updateEanStatus(row.menu_id)}
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
                                >
                                  {" "}
                                </i>
                                <button
                                  type="button"
                                  onClick={() => deleteSalary(row.menu_id)}
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
                                        Salary Create
                                      </h1>
                                      <button
                                        type="button"
                                        className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                      />
                                    </div>
                                    <div className="modal-body">
                                      <form action="">
                                        <div className="row mb-2">
                                          <h5 className="text-start">
                                            รายละเอียดพนักงาน / Employee Details
                                          </h5>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ประจำเดือน </h6>
                                              <input type="date" />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput autocompleteField">
                                              <h6>พนักงาน</h6>{" "}
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ชื่อ - นามสกุล </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>รายละเอียดการชำระเงิน </h6>
                                              <select
                                                value={paymentDetails}
                                                onChange={handlepaymentDetails}
                                                style={{
                                                  width: 300,
                                                  padding: "8px",
                                                }}
                                              >
                                                <option value="" disabled>
                                                  - เลือกตำบล -
                                                </option>
                                                {options.map((option) => (
                                                  <option
                                                    key={option.value}
                                                    value={option.value}
                                                  >
                                                    {option.label}
                                                  </option>
                                                ))}
                                              </select>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mb-2 mt-2">
                                          <h5 className="text-start">
                                            รายละเอียดเงินเดือน
                                            (รายละเอียดการรับเงิน ){" "}
                                          </h5>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>เงินเดือน(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>รวมโอที(ชั่วโมง) </h6>
                                              <input type="date" />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>เงินโอที(ชั่วโมง/บาท) </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>รวมโอทีทั้งหมด(บาท) </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>ค่าที่พักอาศัย(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>เงินพิเศษ(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>รวมรายการรับทั้งหมด(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mt-2 mb-2">
                                          <h5 className="text-start">
                                            รายละเอียดการหักเงิน
                                          </h5>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>ประกันสังคม(บาท) </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>รายการหักเงินอื่นๆ</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>ชำระเงินคืนบริษัท(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>รวมรายการหักทั้งหมด(บาท)</h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mb-2 mt-2">
                                          <h5 className="text-start">
                                            รายละเอียดการรับเงินทั้งหมด
                                          </h5>
                                        </div>
                                        <div className="row">
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>
                                                รายละเอียดการรับเงินทั้งหมด(บาท){" "}
                                              </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                          <div className="col-lg-6">
                                            <div className="createFormInput">
                                              <h6>
                                                รายละเอียด หมายเหตุ(เงินพิเศษ /
                                                เงิกหัก){" "}
                                              </h6>
                                              <input type="text" />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <h5 className="text-start">
                                            รายละเอียดการลาและการกู้ยืม
                                          </h5>
                                          <h5 className="text-start">
                                            ยอดการลางานรวมประจำปี
                                          </h5>
                                        </div>
                                        <div className="row mt-1">
                                          <div className="col-lg-1">
                                            <p className="text-start">
                                              ลาป่วย{" "}
                                            </p>
                                          </div>
                                          <div className="col-lg-11">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="createFormInput">
                                                  <div className="parentSick">
                                                    <div>
                                                      <h6>จำนวนวันลา </h6>
                                                      <input type="text" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="createFormInput">
                                                  <div className="parentSick">
                                                    <div>
                                                      <h6>จำนวนวันลาคงเหลือ</h6>
                                                      <input type="text" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row mt-2">
                                          <div className="col-lg-1">
                                            <p className="text-start">ลาป่วย</p>
                                          </div>
                                          <div className="col-lg-11">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="createFormInput">
                                                  <div className="parentSick">
                                                    <div>
                                                      <h6>จำนวนวันลา </h6>
                                                      <input type="text" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="createFormInput">
                                                  <div className="parentSick">
                                                    <div>
                                                      <h6>จำนวนวันลาคงเหลือ</h6>
                                                      <input type="text" />
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <h5 className="text-start">
                                            รายละเอียดการกู้ยืมเงิน
                                          </h5>
                                          <div className="col-lg-1">
                                            <p className="text-start">
                                              เงินค้างชำระบริษัท
                                            </p>
                                          </div>
                                          <div className="col-lg-11 mt-1">
                                            <div className="row">
                                              <div className="col-lg-6">
                                                <div className="createFormInput parentSick">
                                                  <div>
                                                    <h6>ยอดทั้งหมด </h6>
                                                    <input type="text" />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="col-lg-6">
                                                <div className="createFormInput parentSick">
                                                  <div>
                                                    <h6>ยอดคงเหลือ</h6>
                                                    <input type="text" />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </form>
                                    </div>
                                    <div className="modal-footer justify-content-center">
                                      <button
                                        type="button"
                                        className="btn btn-primary"
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

export default MenuManagement;
