import { React, useState, useEffect } from "react";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import moment from "moment";
const Attendance = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    attendance_id: "",
    employee: "",
    Working_days: "",
    Working_hours_morning: "",
    Break_time_noon: "",
    Working_hours_afternoon: "",
    Time_off_work: "",
    Break_time_OT_min: "",
    Hours_worked_hr: "",
    OT_hours_hr: "",
    Work_day: "",
    first_name: "",
    last_name: "",
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [workingDay, setWorkingDay] = useState("");
  const [workingHour, setWorkingHour] = useState("");
  const [breakTime, setBreakTime] = useState("");
  const [workingHourAfterNoon, setWorkingHourAfterNoon] = useState("");
  const [timeOfWork, setTimeOfWork] = useState("");
  const [breakTimeOtMinute, setBreakTimeOtMinute] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [allEmployeeList, setAllEmployeeList] = useState([]); // List of provinces
  const [attendanceListData, setAttendanceListData] = useState([]); // List of provinces

  const [isOn, setIsOn] = useState(true);
  const [attendance, setAttendance] = useState([]);

  const [paymentDetails, setpaymentDetails] = useState("");
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);
  // const handleChange = (event) => {
  //   setSelectedOption(event.target.value);
  // };
  const empData = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
    {
      label: "The Lord of the Rings: The Return of the King",
      year: 2003,
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}ActiveEmployee`)
      .then((response) => {
        // Assuming the response contains data in the form { data: [ ... ] }
        const employees = response.data.data.map((employee) => ({
          employee_id: employee.id,
          full_name: `${employee.f_name} ${employee.l_name}`, // Combine f_name and l_name
        }));
        setAllEmployeeList(employees); // Set the formatted employee list
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);
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
  const handleChange = (e, newValue) => {
    const { name, value, type } = e.target;

    if (name === "employee" && newValue) {
      // If the change is from the Autocomplete, update the employee data
      setFormData((prevData) => ({
        ...prevData,
        employee: newValue.employee_id, // Set the employee_id
        Name_Surname: newValue.full_name, // Set the full name
      }));
    } else if (type === "file" && e.target.files.length > 0) {
      // Handle file input for "picture"
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0], // Set the binary file data directly
      }));
    } else if (name === "Working_days" && value instanceof Date) {
      // Handle the Working_days date input
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Set the date value directly
      }));
    } else {
      // Handle other text and inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Update the text field values
      }));
    }
  };

  const populateData = async () => {
    try {
      // Prepare the payload
      const payload = {
        working_day: moment(formData.Working_days).format("YYYY-MM-DD"),
        Work_time_morning: formData.Working_hours_morning,
        lunch_break_out: formData.Break_time_noon,
        lunch_break_in: formData.Working_hours_afternoon,
        afternoon_out: formData.Time_off_work,
        overtime_break: formData.Break_time_OT_min,
        hours_worked: formData.Hours_worked_hr,
        overtime: formData.OT_hours_hr,
        day_worked: formData.Work_day,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}CreateAllAttendance`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      setAttendanceListData(response.data.data);
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
      getAllAttendance();
      // Swal.fire({
      //   title: "Success!",
      //   text: "Attendance created successfully!",
      //   icon: "success",
      // });
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
  const handleSubmit = async () => {
    try {
      // Prepare the payload
      const payload = {
        employee_id: formData.employee,
        working_day: moment(formData.Working_days).format("YYYY-MM-DD"),
        Work_time_morning: formData.Working_hours_morning,
        lunch_break_out: formData.Break_time_noon,
        lunch_break_in: formData.Working_hours_afternoon,
        afternoon_out: formData.Time_off_work,
        overtime_break: formData.Break_time_OT_min,
        hours_worked: formData.Hours_worked_hr,
        overtime: formData.OT_hours_hr,
        day_worked: formData.Work_day,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}CreateAttendance`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllAttendance();
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
        attendance_id: "",
        employee: [],
        Working_days: "",
        Working_hours_morning: "",
        Break_time_noon: "",
        Working_hours_afternoon: "",
        Time_off_work: "",
        Break_time_OT_min: "",
        Hours_worked_hr: "",
        OT_hours_hr: "",
        Work_day: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Attendance created successfully!",
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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };
  const deleteAttendance = (id) => {
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
          const response = await axios.post(`${API_BASE_URL}DeleteAttendance`, {
            attendance_id: id,
          });
          console.log(response);
          // Remove the deleted row from the state
          setAttendanceListData((prevData) =>
            prevData.filter((row) => row.id !== id)
          );
          getAllAttendance();
          toast.success("Attendance delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const convertDecimalToTime = (decimal) => {
    const hours = Math.floor(decimal); // Extract whole hours
    const minutes = Math.round((decimal - hours) * 60); // Convert decimal part to minutes
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}`;
  };
  const updateEanStatus = (attendanceId, newStatus) => {
    const request = {
      attendance_id: attendanceId,
    };

    axios
      .post(`${API_BASE_URL}/updateWeekDay`, request)
      .then((resp) => {
        console.log(resp);
        if (resp.data.success === true) {
          toast.success("Status Updated Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
        } else {
          toast.error("Failed to update status. Please try again.", {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        toast.error("An error occurred while updating status.", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const defaultStateSet = (row) => {
    console.log(row);
    console.log(moment(row.workday).format("YYYY-MM-DD"));
    // Clear the current form data first
    setFormData((prev) => ({
      ...prev,
      attendance_id: null,
      employee: null,
      Working_days: null,
      Working_hours_morning: null,
      Break_time_noon: null,
      Working_hours_afternoon: null,
      Time_off_work: null,
      Break_time_OT_min: null,
      Hours_worked_hr: null,
      OT_hours_hr: null,
      Work_day: null,
    }));

    // Set new form data
    const newFormData = {
      attendance_id: row.id,
      employee: row.employee_id,
      Working_days: row.workday,
      Working_hours_morning: row.morning_in,
      Break_time_noon: row.lunch_break_out,
      Working_hours_afternoon: row.lunch_break_in,
      Time_off_work: row.afternoon_out,
      Break_time_OT_min: row.overtime_break,
      Hours_worked_hr: row.hours_worked,
      OT_hours_hr: row.overtime,
      Work_day: row.day_worked,
      first_name: row.f_name,
      last_name: row.l_name,
    };

    setFormData(newFormData);

    calculateDeductions({
      morning_in: newFormData.Working_hours_morning || "",
      lunch_break_out: newFormData.Break_time_noon || "",
      lunch_break_in: newFormData.Working_hours_afternoon || "",
      afternoon_out: newFormData.Time_off_work || "",
      overtime_break: newFormData.Break_time_OT_min || "",
    });
  };

  const updateSubmitData = async () => {
    console.log(formData.salary_id);
    try {
      // Prepare the payload
      const payload = {
        attendance_id: formData.attendance_id,
        employee_id: formData.employee,
        working_day: moment(formData.Working_days).format("YYYY-MM-DD"),
        Work_time_morning: formData.Working_hours_morning,
        lunch_break_out: formData.Break_time_noon,
        lunch_break_in: formData.Working_hours_afternoon,
        afternoon_out: formData.Time_off_work,
        overtime_break: formData.Break_time_OT_min,
        hours_worked: formData.Hours_worked_hr,
        overtime: formData.OT_hours_hr,
        day_worked: formData.Work_day,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}UpdateAttendance`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllAttendance();
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
        attendance_id: "",
        employee: [],
        Working_days: "",
        Working_hours_morning: "",
        Break_time_noon: "",
        Working_hours_afternoon: "",
        Time_off_work: "",
        Break_time_OT_min: "",
        Hours_worked_hr: "",
        OT_hours_hr: "",
        Work_day: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Attendance Updated  successfully!",
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
  const updateSubmitData1 = async () => {
    console.log(formData.salary_id);
    try {
      // Prepare the payload
      const payload = {
        attendance_id: formData.attendance_id,
        employee_id: formData.employee,
        working_day: moment(formData.Working_days).format("YYYY-MM-DD"),
        Work_time_morning: formData.Working_hours_morning,
        lunch_break_out: formData.Break_time_noon,
        lunch_break_in: formData.Working_hours_afternoon,
        afternoon_out: formData.Time_off_work,
        overtime_break: formData.Break_time_OT_min,
        hours_worked: formData.Hours_worked_hr,
        overtime: formData.OT_hours_hr,
        day_worked: formData.Work_day,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}UpdateAttendance`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllAttendance();
      setIsModalOpen(false);

      setFormData({
        attendance_id: "",
        employee: [],
        Working_days: "",
        Working_hours_morning: "",
        Break_time_noon: "",
        Working_hours_afternoon: "",
        Time_off_work: "",
        Break_time_OT_min: "",
        Hours_worked_hr: "",
        OT_hours_hr: "",
        Work_day: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Attendance Updated  successfully!",
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
  const getAllAttendance = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GetAllAttendance`);
      console.log("Attendance data:", response.data.data);
      setAttendance(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllAttendance();
  }, []);

  const filteredData = attendance.filter((row) => {
    const searchLower = search.toLowerCase();

    return (
      (row.employee_id &&
        row.f_name &&
        row.f_name.toLowerCase().includes(searchLower)) ||
      (row.hours_worked &&
        row.hours_worked.toString().toLowerCase().includes(searchLower)) ||
      (row.day_worked && row.day_worked.toString().includes(search)) ||
      (row.overtime && row.overtime.toString().includes(search)) ||
      (row.workday && formatDate(row.workday).includes(search)) // Apply formatDate and check if it includes the search term
    );
  });

  useEffect(() => {
    console.log("Attendance:", attendance);
  }, [attendance]);
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
  const clearAllData = () => {
    getAllAttendance();
    setAttendanceListData([]);
    setFormData({
      attendance_id: "",
      employee: [],
      Working_days: "",
      Working_hours_morning: "",
      Break_time_noon: "",
      Working_hours_afternoon: "",
      Time_off_work: "",
      Break_time_OT_min: "",
      Hours_worked_hr: "",
      OT_hours_hr: "",
      Work_day: "",
    });
  };

  useEffect(() => {
    // Stable fallback values

    if (
      formData.Working_hours_morning ||
      formData.Break_time_noon ||
      formData.Working_hours_afternoon ||
      formData.Time_off_work ||
      formData.Break_time_OT_min
    ) {
      const morningIn = formData.Working_hours_morning || workingHour;
      const lunchBreakOut = formData.Break_time_noon || breakTime;
      const lunchBreakIn =
        formData.Working_hours_afternoon || workingHourAfterNoon;
      const afternoonOut = formData.Time_off_work || timeOfWork;
      const overtimeBreak = formData.Break_time_OT_min || breakTimeOtMinute;

      // Call the calculation function with the clean values
      calculateDeductions({
        morning_in: morningIn,
        lunch_break_out: lunchBreakOut,
        lunch_break_in: lunchBreakIn,
        afternoon_out: afternoonOut,
        overtime_break: overtimeBreak,
      });
    }
  }, [
    formData.Working_hours_morning,
    formData.Break_time_noon,
    formData.Working_hours_afternoon,
    formData.Time_off_work,
    formData.Break_time_OT_min,
    workingHour,
    breakTime,
    workingHourAfterNoon,
    timeOfWork,
    breakTimeOtMinute,
  ]);

  function calculateDeductions({
    morning_in,
    lunch_break_out,
    lunch_break_in,
    afternoon_out,
    overtime_break,
  }) {
    // Check if all required fields are valid time strings
    if (
      morning_in &&
      lunch_break_out &&
      lunch_break_in &&
      afternoon_out &&
      overtime_break
    ) {
      // Parse the time into Date objects
      console.log("call All Time ");
      function normalizeTimeString(time) {
        // Ensure time is in the format "HH:MM:SS"
        if (!time.includes(":")) {
          throw new Error("Invalid time format");
        }
        const parts = time.split(":");
        if (parts.length === 2) {
          // Append seconds if missing
          return `${time}:00`;
        }
        return time; // Already in "HH:MM:SS" format
      }

      const morningInDateTime = new Date(
        `1970-01-01T${normalizeTimeString(morning_in)}Z`
      );
      const lunchBreakOutDateTime = new Date(
        `1970-01-01T${normalizeTimeString(lunch_break_out)}Z`
      );
      const lunchBreakInDateTime = new Date(
        `1970-01-01T${normalizeTimeString(lunch_break_in)}Z`
      );
      const afternoonOutDateTime = new Date(
        `1970-01-01T${normalizeTimeString(afternoon_out)}Z`
      );

      // Validate all Date objects

      if (
        isNaN(morningInDateTime) ||
        isNaN(lunchBreakOutDateTime) ||
        isNaN(lunchBreakInDateTime) ||
        isNaN(afternoonOutDateTime)
      ) {
        return returnDefaultValues();
      }

      // Calculate time differences in hours
      const diffin =
        (lunchBreakOutDateTime - morningInDateTime) / (1000 * 60 * 60);
      const diffout =
        (afternoonOutDateTime - lunchBreakInDateTime) / (1000 * 60 * 60);

      // Calculate total hours worked
      const hoursWorked = diffin + diffout;
      console.log(hoursWorked);
      let overtime = 0;
      let totalOvertimeBreak = 0;
      let dayWorked = 0;

      // Calculate overtime and day worked
      if (hoursWorked >= 8) {
        overtime = hoursWorked - 8;
        totalOvertimeBreak =
          overtime_break > 0 ? overtime - overtime_break / 60 : overtime;
      }

      dayWorked = hoursWorked < 8 ? parseFloat(hoursWorked / 8).toFixed(2) : 1;

      // Update form data
      setFormData((prevData) => ({
        ...prevData,
        Hours_worked_hr: hoursWorked.toFixed(2), // Total hours worked
        OT_hours_hr: totalOvertimeBreak > 0 ? totalOvertimeBreak.toFixed(2) : 0, // Overtime
        Work_day: dayWorked, // Days worked
      }));

      console.log({
        day_worked: dayWorked,
        hours_worked: hoursWorked.toFixed(2),
        overtime: totalOvertimeBreak > 0 ? totalOvertimeBreak.toFixed(2) : 0,
      });

      return {
        day_worked: dayWorked,
        hours_worked: hoursWorked.toFixed(2),
        overtime: totalOvertimeBreak > 0 ? totalOvertimeBreak.toFixed(2) : 0,
      };
    }
  }

  return (
    <>
      <div>
        <ToastContainer />
        <div className="container-fluid">
          <div className="row">
            <div className="dashboardMain px-4 mt-4 mb-4">
              <div className="grayBgColor">
                <div className="d-flex justify-content-between  px-4 py-3 items-center exportPopupBtn">
                  <h6 className="font-weight-bolder mb-0">
                    Attendance Management
                  </h6>
                  <div>
                    <button
                      type="button"
                      className="btn button btn-info me-2"
                      data-bs-toggle="modal"
                      onClick={clearAllData}
                      data-bs-target="#exampleModal"
                    >
                      Individual
                    </button>
                    <button
                      type="button"
                      className="btn button btn-info"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalFull"
                    >
                      Full
                    </button>
                  </div>
                  {/* individual modal */}
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
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            บันทึกการเข้าร่วมงาน 1 คน
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
                                        (v) =>
                                          v.employee_id === formData.employee
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
                                  <h6>วันที่ทำงาน </h6>

                                  {/* <input
                                    type="date"
                                    name="Working_days"
                                    value={formData.Working_days}
                                    onChange={handleChange}
                                  /> */}

                                  <DatePicker
                                    selected={formData.Working_days} // Set the selected date from formData
                                    onChange={(date) =>
                                      handleChange({
                                        target: {
                                          name: "Working_days", // Name of the field
                                          value: date, // New date value
                                        },
                                      })
                                    }
                                    dateFormat="dd/MM/yyyy" // Set the date format
                                    placeholderText="Click to select a date" // Placeholder text
                                    customInput={<CustomInput />} // Optional: custom input component
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเข้างาน(เช้า) </h6>
                                  <input
                                    type="time"
                                    name="Working_hours_morning"
                                    value={formData.Working_hours_morning}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาพัก(เที่ยง) </h6>
                                  <input
                                    type="time"
                                    name="Break_time_noon"
                                    value={formData.Break_time_noon}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเข้างาน(บ่าย) </h6>
                                  <input
                                    type="time"
                                    name="Working_hours_afternoon"
                                    value={formData.Working_hours_afternoon}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเลิกงาน </h6>
                                  <input
                                    type="time"
                                    name="Time_off_work"
                                    value={formData.Time_off_work}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6>เวลาเบรกโอที/นาที </h6>
                                  <input
                                    type="text"
                                    name="Break_time_OT_min"
                                    value={formData.Break_time_OT_min}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6> ชั่วโมงที่ทำงาน/ชม. </h6>
                                  <input
                                    type="text"
                                    // readOnly
                                    name="Hours_worked_hr"
                                    value={formData.Hours_worked_hr}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6> ชั่วโมงโอที/ชม. </h6>
                                  <input
                                    type="text"
                                    // readOnly
                                    name="OT_hours_hr"
                                    value={formData.OT_hours_hr}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6>ทำงาน/วัน </h6>
                                  <input
                                    type="text"
                                    // readOnly
                                    name="Work_day"
                                    value={formData.Work_day}
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
                  {/* individual modal end */}

                  {/* full modal */}
                  <div
                    className="modal fade createModal"
                    id="exampleModalFull"
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
                            บันทึกการเข้าร่วมงาน 1 คน
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
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>วันที่ทำงาน </h6>
                                <DatePicker
                                  selected={formData.Working_days} // Set the selected date from formData
                                  onChange={(date) =>
                                    handleChange({
                                      target: {
                                        name: "Working_days", // Name of the field
                                        value: date, // New date value
                                      },
                                    })
                                  }
                                  dateFormat="dd/MM/yyyy" // Set the date format
                                  placeholderText="Click to select a date" // Placeholder text
                                  customInput={<CustomInput />} // Optional: custom input component
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-2">
                              <div className="createFormInput">
                                <h6>เวลาเข้างาน(เช้า) </h6>
                                <input
                                  type="time"
                                  name="Working_hours_morning"
                                  value={formData.Working_hours_morning}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="createFormInput">
                                <h6>เวลาพัก(เที่ยง) </h6>
                                <input
                                  type="time"
                                  name="Break_time_noon"
                                  value={formData.Break_time_noon}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="createFormInput">
                                <h6> เวลาเข้างาน(บ่าย) </h6>
                                <input
                                  type="time"
                                  name="Working_hours_afternoon"
                                  value={formData.Working_hours_afternoon}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="createFormInput">
                                <h6> เวลาเลิกงาน </h6>
                                <input
                                  type="time"
                                  name="Time_off_work"
                                  value={formData.Time_off_work}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-2">
                              <div className="createFormInput">
                                <h6>เวลาเบรกโอที/นาที </h6>
                                <input
                                  type="text"
                                  name="Break_time_OT_min"
                                  value={formData.Break_time_OT_min}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="col-lg-2">
                              <div className="populatebBtn">
                                <button onClick={populateData}>Populate</button>
                              </div>
                            </div>
                          </div>

                          <div className="table-responsive tableMain">
                            <table
                              className=" table table-striped"
                              style={{ width: "100%", marginTop: 10 }}
                            >
                              <thead>
                                <tr>
                                  <th>หมายเลขพนักงาน </th>
                                  <th>พนักงาน </th>
                                  <th>วันที่ทำงาน </th>
                                  <th>เวลาเข้างาน </th>
                                  <th>เวลาออกงาน </th>
                                  <th>จำนวนโอที </th>
                                  <th>สุดสัปดาห์</th>
                                  <th>Action </th>
                                </tr>
                              </thead>
                              <tbody>
                                {attendanceListData.map((row, index) => (
                                  <tr key={index}>
                                    <td>{row.employee_id}</td>
                                    <td style={{ textAlign: "left" }}>
                                      {row.f_name}
                                      {row.l_name}
                                    </td>
                                    <td>{formatDate(row.workday)}</td>
                                    <td>{row.morning_in}</td>
                                    <td>{row.afternoon_out}</td>
                                    <td>{row.overtime}</td>
                                    <td>
                                      <label
                                        className="toggleSwitch large"
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          marginTop: 10,
                                        }}
                                      >
                                        {row.Unworked_Day == "3" ? (
                                          <input
                                            type="checkbox"
                                            defaultChecked
                                            onChange={(e) => {
                                              const newStatus = e.target.checked
                                                ? "3"
                                                : "0";
                                              updateEanStatus(
                                                row.id,
                                                newStatus
                                              );
                                            }}
                                            value={row.id}
                                          />
                                        ) : (
                                          <input
                                            type="checkbox"
                                            // checked={row.Unworked_Day === "3"} // Set checkbox state based on Unworked_Day value
                                            onChange={(e) => {
                                              const newStatus = e.target.checked
                                                ? "3"
                                                : "0"; // "3" for ON, "0" for OFF
                                              updateEanStatus(
                                                row.id,
                                                newStatus
                                              ); // Pass the attendance ID and new status
                                            }}
                                            value={row.id}
                                          />
                                        )}

                                        <span>
                                          <span>OFF</span>
                                          <span>ON</span>
                                        </span>
                                        <a />
                                      </label>
                                    </td>
                                    <td>
                                      <div className="editIcon">
                                        <i
                                          type="button"
                                          className="mdi mdi-pencil"
                                          onClick={() => {
                                            defaultStateSet(row);
                                            setIsModalOpen(true);
                                          }}
                                        ></i>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            deleteAttendance(row.id)
                                          }
                                        >
                                          <i className="mdi mdi-delete ps-2"></i>
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* full modal end */}

                  {/* full modal edit */}
                  <div
                    className="modal fade createModal"
                    id="modalFullEdit"
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
                            บันทึกการเข้าร่วมงาน 1 คน
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          >
                            <i className="mdi mdi-close"></i>{" "}
                          </button>
                        </div>
                        <div className="modal-body">
                          <form action="">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="createFormInput autocompleteField">
                                  <h6>พนักงาน </h6>
                                  <Autocomplete
                                    disablePortal
                                    options={empData}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                      <TextField {...params} />
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>วันที่ทำงาน </h6>
                                  <input type="date" />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเข้างาน(เช้า) </h6>
                                  <input type="time" />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาพัก(เที่ยง) </h6>
                                  <input type="time" />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเข้างาน(บ่าย) </h6>
                                  <input type="time" />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="createFormInput">
                                  <h6>เวลาเลิกงาน </h6>
                                  <input type="time" />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6>เวลาเบรกโอที/นาที </h6>
                                  <input type="time" />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6> ชั่วโมงที่ทำงาน/ชม. </h6>
                                  <input type="text" readOnly />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6> ชั่วโมงโอที/ชม. </h6>
                                  <input type="text" readOnly />
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6>ทำงาน/วัน </h6>
                                  <input type="text" readOnly />
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
                  {/* full modal end */}
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

                    <div className="table-responsive ">
                      <table
                        className=" table table-striped"
                        style={{ width: "100%", marginTop: "10px" }}
                      >
                        <thead>
                          <tr>
                            <th>หมายเลขพนักงาน </th>
                            <th>พนักงาน </th>
                            <th>วันที่ทำงาน </th>
                            <th>เวลาเข้างาน </th>
                            <th>เวลาออกงาน </th>
                            <th>จำนวนโอที </th>
                            <th>Action </th>
                          </tr>
                        </thead>

                        <tbody>
                          {currentEntries.length > 0 ? (
                            currentEntries.map((row) => (
                              <tr>
                                <td>{row.employee_id}</td>
                                <td>
                                  {row.f_name} {row.l_name}
                                </td>
                                <td>{formatDate(row.workday)}</td>
                                <td>{row.morning_in}</td>
                                <td>{row.afternoon_out}</td>
                                <td>{row.overtime}</td>
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
                                      data-bs-toggle="modal"
                                      data-bs-target="#exampleModalView"
                                      onClick={() => defaultStateSet(row)}
                                    >
                                      {" "}
                                      <i class=" ps-2 mdi mdi-eye"></i>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteAttendance(row.id)}
                                    >
                                      <i className="mdi mdi-delete ps-2"></i>
                                    </button>
                                  </div>
                                  {/* edit modal */}

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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                บันทึกการเข้าร่วมงาน 1 คน
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
                <div className="row">
                  <div className="col-lg-6">
                    <div className="createFormInput autocompleteField">
                      <h6>พนักงาน </h6>
                      <Autocomplete
                        options={allEmployeeList || []} // Ensure options is always an array
                        getOptionLabel={(option) =>
                          option?.employee_id && option?.full_name
                            ? `${option.employee_id}: ${option.full_name}` // Display both employee_id and full name
                            : ""
                        } // Safely display the label
                        value={
                          allEmployeeList?.find(
                            (v) => v.employee_id === Number(formData.employee) // Convert to number if necessary
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            employee: newValue?.employee_id || "", // Update employee_id or clear if null
                          });
                        }}
                        isOptionEqualToValue={
                          (option, value) =>
                            option.employee_id === value?.employee_id // Compare by employee_id for equality
                        }
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
                      <h6>วันที่ทำงาน </h6>

                      <DatePicker
                        selected={formData.Working_days} // Set the selected date from formData
                        onChange={(date) =>
                          handleChange({
                            target: {
                              name: "Working_days", // Name of the field
                              value: date, // New date value
                            },
                          })
                        }
                        dateFormat="dd/MM/yyyy" // Set the date format
                        placeholderText="Click to select a date" // Placeholder text
                        customInput={<CustomInput />} // Optional: custom input component
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเข้างาน(เช้า) </h6>
                      <input
                        type="time"
                        name="Working_hours_morning"
                        value={formData.Working_hours_morning}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาพัก(เที่ยง) </h6>
                      <input
                        type="time"
                        name="Break_time_noon"
                        value={formData.Break_time_noon}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเข้างาน(บ่าย) </h6>
                      <input
                        type="time"
                        name="Working_hours_afternoon"
                        value={formData.Working_hours_afternoon}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเลิกงาน </h6>
                      <input
                        type="time"
                        name="Time_off_work"
                        value={formData.Time_off_work}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6>เวลาเบรกโอที/นาที </h6>
                      <input
                        type="text"
                        name="Break_time_OT_min"
                        value={formData.Break_time_OT_min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6> ชั่วโมงที่ทำงาน/ชม. </h6>
                      <input
                        type="text"
                        // readOnly
                        name="Hours_worked_hr"
                        value={formData.Hours_worked_hr}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6> ชั่วโมงโอที/ชม. </h6>
                      <input
                        type="text"
                        // readOnly
                        name="OT_hours_hr"
                        value={formData.OT_hours_hr}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6>ทำงาน/วัน </h6>
                      <input
                        type="text"
                        // readOnly
                        name="Work_day"
                        value={formData.Work_day}
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
      {/* view attendance */}

      <div
        className="modal fade createModal"
        id="exampleModalView"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                การเข้าร่วมประชุม / ดูแบบฟอร์ม{" "}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>{" "}
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
                            <strong>พนักงาน</strong>{" "}
                          </h6>
                          <p>
                            {formData.employee} : {formData.first_name} &nbsp;
                            {formData.last_name}
                          </p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong>วันที่ทำงาน</strong>{" "}
                          </h6>
                          <p> {formatDate(formData.Working_days)}</p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong>เวลาเข้างาน(เช้า)</strong>
                          </h6>
                          <p>{formData.Working_hours_morning}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parantEmpView">
                        <div>
                          <h6>
                            {" "}
                            <strong>เวลาพัก(เที่ยง)</strong>{" "}
                          </h6>
                          <p>{formData.Break_time_noon}</p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong>เวลาเข้างาน(บ่าย)</strong>{" "}
                          </h6>
                          <p>{formData.Working_hours_afternoon}</p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong>เวลาเลิกงาน</strong>{" "}
                          </h6>
                          <p>{formData.Time_off_work}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parantEmpView">
                        <div>
                          <h6>
                            {" "}
                            <strong>เวลาเบรกโอที/นาที</strong>{" "}
                          </h6>
                          <p>{formData.Break_time_OT_min}</p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong> ชั่วโมงที่ทำงาน/ชม.</strong>{" "}
                          </h6>
                          <p>{formData.Hours_worked_hr}</p>
                        </div>
                        <div>
                          <h6>
                            {" "}
                            <strong>ชั่วโมงโอที/ชม.</strong>{" "}
                          </h6>
                          <p>{formData.OT_hours_hr}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="parantEmpView">
                        <div>
                          <h6>
                            {" "}
                            <strong> ทำงาน/วัน</strong>{" "}
                          </h6>
                          <p>{formData.Work_day}</p>
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

      {/* view attendance end */}

      <div
        className={`modal fade createModal ${isModalOpen ? "show" : ""}`}
        id="exampleModalEdit1"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden={!isModalOpen}
        style={{ display: isModalOpen ? "block" : "none" }}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                บันทึกการเข้าร่วมงาน 1 คน
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
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
                            ? `${option.employee_id}: ${option.full_name}` // Display both employee_id and full name
                            : ""
                        } // Safely display the label
                        value={
                          allEmployeeList?.find(
                            (v) => v.employee_id === Number(formData.employee) // Convert to number if necessary
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          setFormData({
                            ...formData,
                            employee: newValue?.employee_id || "", // Update employee_id or clear if null
                          });
                        }}
                        isOptionEqualToValue={
                          (option, value) =>
                            option.employee_id === value?.employee_id // Compare by employee_id for equality
                        }
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
                      <h6>วันที่ทำงาน </h6>

                      <DatePicker
                        selected={formData.Working_days} // Set the selected date from formData
                        onChange={(date) =>
                          handleChange({
                            target: {
                              name: "Working_days", // Name of the field
                              value: date, // New date value
                            },
                          })
                        }
                        dateFormat="dd/MM/yyyy" // Set the date format
                        placeholderText="Click to select a date" // Placeholder text
                        customInput={<CustomInput />} // Optional: custom input component
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเข้างาน(เช้า) </h6>
                      <input
                        type="time"
                        name="Working_hours_morning"
                        value={formData.Working_hours_morning}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาพัก(เที่ยง) </h6>
                      <input
                        type="time"
                        name="Break_time_noon"
                        value={formData.Break_time_noon}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเข้างาน(บ่าย) </h6>
                      <input
                        type="time"
                        name="Working_hours_afternoon"
                        value={formData.Working_hours_afternoon}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createFormInput">
                      <h6>เวลาเลิกงาน </h6>
                      <input
                        type="time"
                        name="Time_off_work"
                        value={formData.Time_off_work}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6>เวลาเบรกโอที/นาที </h6>
                      <input
                        type="text"
                        name="Break_time_OT_min"
                        value={formData.Break_time_OT_min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6> ชั่วโมงที่ทำงาน/ชม. </h6>
                      <input
                        type="text"
                        // readOnly
                        name="Hours_worked_hr"
                        value={formData.Hours_worked_hr}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6> ชั่วโมงโอที/ชม. </h6>
                      <input
                        type="text"
                        // readOnly
                        name="OT_hours_hr"
                        value={formData.OT_hours_hr}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="createFormInput">
                      <h6>ทำงาน/วัน </h6>
                      <input
                        type="text"
                        // readOnly
                        name="Work_day"
                        value={formData.Work_day}
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
                onClick={updateSubmitData1}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Attendance;
