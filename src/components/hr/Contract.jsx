import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import withReactContent from "sweetalert2-react-content";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
const MySwal = withReactContent(Swal);
import moment from "moment";

const Contract = () => {
  const [isAllSelected1, setIsAllSelected1] = useState(false);
  const [isAllSelected2, setIsAllSelected2] = useState(false);

  const [activeEmployeeData, setActiveEmployeeData] = useState([]);
  const [activeEmployeeData1, setActiveEmployeeData1] = useState([]);

  const [selectedEmployees1, setSelectedEmployees1] = useState([]);

  const [selectedEmployees2, setSelectedEmployees2] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [filteredData1, setFilteredData1] = useState([]);

  const fetchFilteredData = (month, id, isChecked) => {
    if (isChecked) {
      // Check if the employee is already in filteredData1 to avoid duplicates
      setFilteredData1((prevData) => {
        if (prevData.some((item) => item.id === id)) {
          return prevData; // If already exists, do nothing
        }
        return prevData;
      });

      fetch(`${API_BASE_URL}GetEmployeeWorking`, {
        method: "POST",
        body: JSON.stringify({
          month: month,
          employee: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.data) {
            const employeeData = {
              id,
              ...data.data,
            };

            // Safely update the state
            setFilteredData1((prevData) => {
              if (prevData.some((item) => item.id === id)) {
                return prevData; // Avoid duplicates
              }
              return [...prevData, employeeData];
            });
          } else {
            console.error("Unexpected response structure:", data);
            alert("An error occurred while fetching employee data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
          alert("An error occurred while fetching employee data.");
        });
    } else {
      // Remove the employee's data from the filtered array
      setFilteredData1((prevData) => prevData.filter((item) => item.id !== id));
    }
  };
  const handleMainCheckboxChange = () => {
    if (!selectedMonth) {
      toast.error("First Select Daily Rate");
      return; // Exit the function early if no month is selected
    }

    if (isAllSelected) {
      // Uncheck all checkboxes
      setSelectedEmployees([]);
      setFilteredData1([]); // Clear all filtered data
      activeEmployeeData.forEach((row) => {
        fetchFilteredData(selectedMonth, row.id, false); // Unselect each employee
      });
    } else {
      // Check all checkboxes
      console.log(activeEmployeeData);
      const allEmployeeIds = activeEmployeeData.map((row) => row.id);
      setSelectedEmployees(allEmployeeIds);

      // Fetch filtered data for all employees
      activeEmployeeData.forEach((row) => {
        fetchFilteredData(selectedMonth, row.id, true); // Select each employee
      });
    }

    setIsAllSelected(!isAllSelected); // Toggle main checkbox state
  };

  const handleChange1 = (event) => {
    const month = event.target.value;
    setDailyRatedata(month);
  };
  const handleChange2 = (event) => {
    const month = event.target.value;
    setOvertime(month);
  };
  const handleCheckboxChange = (id) => {
    if (selectedMonth) {
      setSelectedEmployees((prev) => {
        const isAlreadySelected = prev.includes(id);

        // Fetch or remove data for the individual employee
        if (isAlreadySelected) {
          // Remove the employee's data if unchecked
          setFilteredData1(
            (prevData) => prevData.filter((data) => data.id !== id) // Change from employeeId to id
          );
          fetchFilteredData(selectedMonth, id, false); // Unselect this employee
          return prev.filter((empId) => empId !== id);
        } else {
          // Add the employee's data if checked
          fetchFilteredData(selectedMonth, id, true);
          return [...prev, id];
        }
      });
    } else {
      toast.error("First Select Daily Rate");
    }
  };
  const handleGenerate = () => {
    if (!selectedMonth) {
      toast.error("First Select Daily Rate");
      return; // Exit the function early if no month is selected
    }

    if (filteredData1.length === 0) {
      toast.error("No employees selected to generate salaries.");
      return;
    }

    console.log(filteredData1);
    // Map filtered data to the required payload structure
    const salaries = filteredData1.map((data) => ({
      month: selectedMonth,
      employee_id: data.id,
      employee_name: data.employee_name,
      paydetails_id: 0, // Assuming this exists in your fetched data
      bankname: data.bankname, // Assuming this exists in your fetched data
      basic_salary: data.basic_salary,
      overtime: data.overtime,
      ot_rate: data.ot_rate,
      advanceBorrowShow: 0,
      total_ot: data.total_ot,
      housing: data.housing,
      bonus: data.bonus,

      total_earning: 0,
      sso: data.sso,
      deduction: data.deduction,
      payback: data.payback,
      total_deduct: 0,

      net_income: 0,
      reason: data.reason,
      sick: data.sick,
      sick_balance: data.sick_balance,
      annual: data.annual,
      annual_balance: data.annual_balance,
      borrow: data.borrow,
      advance_borrow: data.advance_borrow,
    }));

    // API call
    fetch(`${API_BASE_URL}AddAllEmployeeSalary`, {
      method: "POST",
      body: JSON.stringify({ salaries }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          // getAllSalary();
          toast.success("Salaries generated successfully!");
          const modal = document.getElementById("exampleModalFull");
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

          // Optional: Clear selected employees and filtered data
          setSelectedMonth("");
          setSelectedEmployees([]);
          setFilteredData1([]);
        } else {
          alert("Failed to generate salaries. Please try again.");
          console.error("API response:", result);
        }
      })
      .catch((error) => {
        console.error("Error generating salaries:", error);
        alert("An error occurred while generating salaries.");
      });
  };

  const handleCheckboxChange1 = (id) => {
    setSelectedEmployees1(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((empId) => empId !== id) // Remove ID if already selected
          : [...prevSelected, id] // Add ID if not already selected
    );
  };
  const handleCheckboxChange2 = (id) => {
    setSelectedEmployees2(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((empId) => empId !== id) // Remove ID if already selected
          : [...prevSelected, id] // Add ID if not already selected
    );
  };
  const clearAllDataSalary = () => {
    getAllContactSsoRate();

    setIsAllSelected("");
    setSelectedMonth(""); // Reset the month input
    setSelectedEmployees([]); // Clear selected employees
    setIsAllSelected1("");
    setIsAllSelected2("");
    setSelectedEmployees1([]); // Cle
    setSelectedEmployees2([]); // Cle
  };
  const activeAllEmployee = () => {
    axios
      .get(`${API_BASE_URL}ActiveEmployee`)
      .then((response) => {
        console.log(response.data.data);
        setActiveEmployeeData(response.data.data);
        setActiveEmployeeData1(response.data.data1);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };
  useEffect(() => {
    activeAllEmployee();
  }, []);
  const handleMainCheckboxChange1 = (e) => {
    setIsAllSelected1(e.target.checked);
    if (e.target.checked) {
      // Select all employee IDs
      const allEmployeeIds = activeEmployeeData.map((employee) => employee.id);
      setSelectedEmployees1(allEmployeeIds);
    } else {
      // Deselect all
      setSelectedEmployees1([]);
    }
  };
  const handleMainCheckboxChange2 = (e) => {
    setIsAllSelected2(e.target.checked);
    if (e.target.checked) {
      // Select all employee IDs
      const allEmployeeIds = activeEmployeeData1.map((employee) => employee.id);
      setSelectedEmployees2(allEmployeeIds);
    } else {
      // Deselect all
      setSelectedEmployees2([]);
    }
  };
  console.log(selectedEmployees2);

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
  const handleGenerateSlip = async () => {
    if (!dailyRateData) {
      toast.error("First filled Daily Rate");
      return; // Exit the function early if no month is selected
    }
    if (selectedEmployees2.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }
    console.log(selectedEmployees2);

    try {
      // Prepare payload
      const payload = {
        DailyRate: dailyRateData,
        employees: selectedEmployees2,
      };

      console.log("Sending payload:", payload); // Debug log

      // Send POST request to API
      const response = await axios.post(
        `${API_BASE_URL}AddtDailyRate`,
        payload
      );
      getAllContactSsoRate();

      setIsAllSelected2("");
      setSelectedMonth(""); // Reset the month input
      setSelectedEmployees1([]);
      getAllContact();
      setDailyRatedata("");
      toast.success("Update successfully!");
      const modal = document.getElementById("exampleModalDailyRate");
      if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        modal.style.display = "none";

        // Remove the backdrop manually
        const modalBackdrops = document.querySelectorAll(".modal-backdrop");
        modalBackdrops.forEach((backdrop) => backdrop.remove());
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      }
      console.log("API Response:", response.data.data); // Debug log
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };

  // const handleGenerateSlip = async () => {
  //   if (!dailyRateData) {
  //     toast.error("First filled Daily Rate");
  //     return; // Exit the function early if no month is selected
  //   }
  //   if (selectedEmployees1.length === 0) {
  //     toast.error("Please select at least one employee.");
  //     return;
  //   }
  //   console.log(selectedEmployees1);

  //   try {
  //     // Prepare payload
  //     const payload = {
  //       DailyRate: dailyRateData,
  //       employees: selectedEmployees1,
  //     };

  //     console.log("Sending payload:", payload); // Debug log

  //     // Send POST request to API
  //     const response = await axios.post(
  //       `${API_BASE_URL}AddtDailyRate`,
  //       payload
  //     );
  //     getAllContactSsoRate();

  //     setIsAllSelected1("");
  //     setSelectedMonth(""); // Reset the month input
  //     setSelectedEmployees1([]);
  //     getAllContact();
  //     setDailyRatedata("");
  //     toast.success("Update successfully!");
  //     const modal = document.getElementById("exampleModalDailyRate");
  //     if (modal) {
  //       modal.classList.remove("show");
  //       modal.setAttribute("aria-hidden", "true");
  //       modal.style.display = "none";

  //       // Remove the backdrop manually
  //       const modalBackdrops = document.querySelectorAll(".modal-backdrop");
  //       modalBackdrops.forEach((backdrop) => backdrop.remove());
  //       document.body.classList.remove("modal-open");
  //       document.body.style.overflow = "auto";
  //     }
  //     console.log("API Response:", response.data.data); // Debug log
  //   } catch (error) {
  //     console.error("Error fetching employee working details:", error);
  //     alert(
  //       error.response?.data?.message ||
  //         "An error occurred while fetching employee working details."
  //     );
  //   }
  // };
  const handleGenerateSlip1 = async () => {
    if (!overTimeData) {
      toast.error("First filled Over Time");
      return; // Exit the function early if no month is selected
    }
    if (selectedEmployees1.length === 0) {
      toast.error("Please select at least one employee.");
      return;
    }
    console.log(selectedEmployees1);

    try {
      // Prepare payload
      const payload = {
        OverTimeRate: overTimeData,
        employees: selectedEmployees1,
      };

      console.log("Sending payload:", payload); // Debug log

      // Send POST request to API
      const response = await axios.post(`${API_BASE_URL}AddOverTime`, payload);
      getAllContactSsoRate();

      setIsAllSelected1("");
      setSelectedMonth(""); // Reset the month input
      setSelectedEmployees1([]);
      setOvertime("");
      getAllContact();
      console.log("API Response:", response.data.data); // Debug log
      toast.success("Update successfully!");
      const modal = document.getElementById("exampleModalOverTime");
      if (modal) {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        modal.style.display = "none";

        // Remove the backdrop manually
        const modalBackdrops = document.querySelectorAll(".modal-backdrop");
        modalBackdrops.forEach((backdrop) => backdrop.remove());
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      }
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };
  const [formData, setFormData] = useState({
    contract_id: "",
    employee: "",
    leave_type: "",
    contact_Data: "",
    Salary_rate: "",
    ot_hour_rate: "",
    social_security: "",
    sso_rate: "",
    wth_rate: "",
    housing_cost: "",
    total_number_sick_day1: "",
    total_number_sick_day2: "",
  });
  const [allEmployeeList, setAllEmployeeList] = useState([]); // List of provinces
  const [paymentDetailsType, setPaymentDetailsType] = useState([]); // List of provinces
  const [empDetails, setempDetails] = useState("");
  const [contactList, setContactList] = useState([]);
  const [ssoRate, setSsoRate] = useState("");
  const [dailyRateData, setDailyRatedata] = useState("");
  const [overTimeData, setOvertime] = useState("");

  const [ssoData, setSsoData] = useState("");
  const [wthData, setWthData] = useState("");

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  // dropdown search
  const [selectedOption, setSelectedOption] = useState(null);

  const handleempDetails = (e) => setempDetails(e.target.value);

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
      .get(`${API_BASE_URL}GetWorkerType`)
      .then((response) => {
        console.log(response);
        setPaymentDetailsType(response.data.data); // Assuming the response has a data array
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;

    setFormData({
      ...formData,
      leave_type: selectedProvince,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // This will output as DD/MM/YYYY
  };

  const handlepaymentDetails = (e) => setpaymentDetails(e.target.value);
  // Filter data based on search input
  const filteredData = contactList.filter(
    (row) =>
      (row.employee_id && row.employee_id.toString().includes(search)) ||
      (row.f_name && row.f_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.worker_type &&
        row.worker_type.toLowerCase().includes(search.toLowerCase())) ||
      (row.contract_date && formatDate(row.contract_date).includes(search)) ||
      (row.basic_salary && row.basic_salary.toString().includes(search)) ||
      (row.ot_rate && row.ot_rate.toString().includes(search))
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

  const getAllContact = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}GetAllcontract`);
      console.log("bonusDetection data:", response.data.data);
      setContactList(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching bonusDetection:", error);
      throw error; // Propagate the error
    }
  };
  const getAllContactSsoRate = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}getLatestSSORate`);
      console.log("ssoRate data:", response.data.data);
      setSsoRate(response.data.data.rate);
      setSsoData(response.data.data.rate);
      setWthData(response.data.existingWHT.rate);
      setDailyRatedata(response.data.existingDailyRate.rate);
      setOvertime(response.data.existingOverTime.rate);

      getAllContact();
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching bonusDetection:", error);

      // throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllContact();
    getAllContactSsoRate();
  }, []);
  const handleChange = (e, newValue) => {
    const { name, value, type, checked } = e.target;

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
      setFormData((prevData) => ({
        ...prevData,
        startDate: newValue, // Set the selected date
      }));
    }
    // Handle checkboxes (SSO, WHT rate, etc.)
    else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked, // Set the checkbox value as boolean (checked or unchecked)
      }));
    }
    // Handle Salary_rate and dynamically calculate sso_rate
    else if (name === "Salary_rate") {
      // Calculate sso_rate based on the formula Salary_rate * ssoRate
      const calculatedSsoRate = (parseFloat(value) * ssoRate) / 100;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Update Salary_rate field
        sso_rate: calculatedSsoRate, // Update sso_rate field with calculated value
      }));
    }
    // Handle all other text and input fields
    else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Set the field value for text inputs
      }));
    }
    console.log(formData.wth_rate);
  };
  useEffect(() => {
    // Automatically update sso_rate when Salary_rate changes
    if (formData.Salary_rate) {
      const calculatedSsoRate =
        (parseFloat(formData.Salary_rate) * ssoRate) / 100; // Adjust formula as needed
      setFormData((prevData) => ({
        ...prevData,
        sso_rate: calculatedSsoRate || 0,
      }));
    }
  }, [formData.Salary_rate]);
  // const handleChange = (e, newValue) => {
  //   const { name, value, type, checked } = e.target;

  //   // Handle Autocomplete component (employee selection)
  //   if (name === "employee" && newValue) {
  //     // If the change is from the Autocomplete, update the employee data
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       employee: newValue.employee_id, // Set the employee_id
  //       Name_Surname: newValue.full_name, // Set the full name
  //     }));
  //   }
  //   // Handle file input for picture
  //   else if (type === "file" && e.target.files.length > 0) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: e.target.files[0], // Set the binary file data directly
  //     }));
  //   }
  //   // Handle DatePicker (for date input)
  //   else if (name === "startDate" && newValue) {
  //     // If it's a DatePicker (startDate), update the selected date
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       startDate: newValue, // Set the selected date
  //     }));
  //   }
  //   // Handle checkboxes (SSO, WHT rate, etc.)
  //   else if (type === "checkbox") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: checked, // Set the checkbox value as boolean (checked or unchecked)
  //     }));
  //   }
  //   // Handle all other text and input fields
  //   else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value, // Set the field value for text inputs
  //     }));
  //   }
  // };

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
  const handleSubmit = async () => {
    try {
      // Prepare the payload
      const payload = {
        employee_id: formData.employee,
        worker_id: formData.leave_type,
        contract_date: moment(formData.contact_Data).format("YYYY-MM-DD"),
        basic_salary: formData.Salary_rate,
        ot_rate: formData.ot_hour_rate,
        ssoRate: formData.social_security,
        sso: formData.sso_rate,
        WHTRate: formData.wth_rate,
        housing: formData.housing_cost,
        sick_leave: formData.total_number_sick_day1,
        personal_leave: formData.total_number_sick_day2,
      };

      // Send the payload to the API
      const response = await axios.post(`${API_BASE_URL}Addcontract`, payload);

      console.log("API Response:", response); // Log the API response for debugging
      getAllContact();
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
        contract_id: "",
        employee: "",
        leave_type: "",
        contact_Data: "",
        Salary_rate: "",
        sso_rate: false,
        wth_rate: false,
        ot_hour_rate: "",
        social_security: "",
        housing_cost: "",
        total_number_sick_day1: "",
        total_number_sick_day2: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Contact created successfully!",
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

  const handleSubmitDailyRate = async () => {
    try {
      // Prepare the payload
      const payload = {
        DailyRate: dailyRateData,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}AddtDailyRate`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllContactSsoRate();
      getAllContact();
      // Close the modal using React method
      const modal = document.getElementById("exampleModalDailyRate");
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
      setDailyRatedata("");
      Swal.fire({
        title: "Success!",
        text: "Daily Rate Updated successfully!",
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
  const handleSubmitOverTime = async () => {
    try {
      // Prepare the payload
      const payload = {
        OverTimeRate: overTimeData,
      };

      // Send the payload to the API
      const response = await axios.post(`${API_BASE_URL}AddOverTime`, payload);

      console.log("API Response:", response); // Log the API response for debugging
      getAllContactSsoRate();
      getAllContact();
      // Close the modal using React method
      const modal = document.getElementById("exampleModalOverTime");
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
      setSsoData("");
      Swal.fire({
        title: "Success!",
        text: "Over Time  Updated successfully!",
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
  const handleSubmitSso = async () => {
    try {
      // Prepare the payload
      const payload = {
        ssoRate: ssoData,
      };

      // Send the payload to the API
      const response = await axios.post(`${API_BASE_URL}AddSSORate`, payload);

      console.log("API Response:", response); // Log the API response for debugging
      getAllContactSsoRate();
      getAllContact();
      // Close the modal using React method
      const modal = document.getElementById("exampleModalsso");
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
      setSsoData("");
      Swal.fire({
        title: "Success!",
        text: "SSO  Updated successfully!",
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
  const handleSubmitWth = async () => {
    try {
      // Prepare the payload
      const payload = {
        WHTRate: wthData,
      };

      // Send the payload to the API
      const response = await axios.post(`${API_BASE_URL}AddWHTRate`, payload);

      console.log("API Response:", response); // Log the API response for debugging
      getAllContactSsoRate();
      getAllContact();
      // Close the modal using React method
      const modal = document.getElementById("exampleModalwht");
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
      setWthData("");
      Swal.fire({
        title: "Success!",
        text: "WTH Updated successfully!",
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
      leave_type: row.worker_id || "",
      //   startDate: new Date(row.start_date).toISOString().split("T")[0] || "",
      //   endDate: new Date(row.end_date).toISOString().split("T")[0] || "",
      //   numberOfLeaveDays: new Date(row.days).toISOString().split("T")[0] || "",
      //   vacation_id: row.vacation_id || "",
      contract_id: row.contract_id,
      contact_Data:
        new Date(row.contract_date).toISOString().split("T")[0] || "",
      Salary_rate: row.basic_salary || "",
      ot_hour_rate: row.ot_rate || "",
      social_security: row.ssoRate || "",
      sso_rate: row.sso || "",
      wth_rate: row.WHTRate || "",
      housing_cost: row.housing || "",
      total_number_sick_day1: row.sick_leave || "",
      total_number_sick_day2: row.personal_leave || "",
    });
  };
  const updateSubmitData = async () => {
    console.log(formData.salary_id);
    try {
      // Prepare the payload
      const payload = {
        contract_id: formData.contract_id,
        employee_id: formData.employee,
        worker_id: formData.leave_type,
        contract_date: moment(formData.contact_Data).format("YYYY-MM-DD"),
        basic_salary: formData.Salary_rate,
        ot_rate: formData.ot_hour_rate,
        ssoRate: formData.social_security,
        sso: formData.sso_rate,
        WHTRate: formData.wth_rate,
        housing: formData.housing_cost,
        sick_leave: formData.total_number_sick_day1,
        personal_leave: formData.total_number_sick_day2,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}Updatecontract`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllContact();
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
        contract_id: "",
        employee: "",
        leave_type: "",
        contact_Data: "",
        Salary_rate: "",
        ot_hour_rate: "",
        sso_rate: false,
        wth_rate: false,
        social_security: "",
        housing_cost: "",
        total_number_sick_day1: "",
        total_number_sick_day2: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Contact Updated  successfully!",
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
    setFormData({
      contract_id: "",
      employee: "",
      leave_type: "",
      contact_Data: "",
      sso_rate: "",
      wth_rate: false, // Set to false for unchecked
      Salary_rate: "",
      ot_hour_rate: "",
      social_security: false, // Set to false for unchecked
      housing_cost: "",
      total_number_sick_day1: "",
      total_number_sick_day2: "",
    });
    console.log(formData.wth_rate);
  };

  const clearAllDataSso = () => {
    // setSsoData("");
  };
  const clearAllDataDailyRate = () => {
    setIsAllSelected1("");

    setSelectedEmployees1([]); // Clear selected employees
    setIsAllSelected1("");
    setSelectedEmployees1([]); // Cle
  };
  const clearAllDataOverTime = () => {
    // setSsoData("");
  };
  const clearAllDataWth = () => {
    // setWthData("");
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
          const response = await axios.post(`${API_BASE_URL}Deletecontract`, {
            contract_id: id,
          });
          console.log(response);
          getAllContact();
          toast.success("Contact delete successfully");
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
                <h6 className="font-weight-bolder mb-0">Contract Management</h6>
                <div>
                  <button
                    type="button"
                    className="btn button btn-info me-2"
                    data-bs-toggle="modal"
                    onClick={clearAllData}
                    data-bs-target="#exampleModalDailyRate"
                  >
                    Daily Rate
                  </button>
                  <button
                    type="button"
                    className="btn button btn-info me-2"
                    data-bs-toggle="modal"
                    onClick={clearAllData}
                    data-bs-target="#exampleModalOverTime"
                  >
                    Over Time
                  </button>
                  <button
                    type="button"
                    className=" btn button btn-info me-2"
                    data-bs-toggle="modal"
                    onClick={clearAllData}
                    data-bs-target="#exampleModalsso"
                  >
                    SSO
                  </button>
                  <button
                    type="button"
                    className=" btn button btn-info me-2"
                    data-bs-toggle="modal"
                    onClick={clearAllData}
                    data-bs-target="#exampleModalwht"
                  >
                    WHT
                  </button>
                  <button
                    type="button"
                    className="  btn button btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Create
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
                          Contract Create
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
                            <div className="col-lg-4">
                              <div className="createFormInput autocompleteField">
                                <h6>พนักงาน</h6>
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
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>ประเภทพนักงาน</h6>
                                <select
                                  value={formData.leave_type}
                                  onChange={handleProvinceChange}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="">- เลือกตำบล -</option>
                                  {paymentDetailsType.map((type) => (
                                    <option
                                      key={type.worker_id}
                                      value={type.worker_id}
                                    >
                                      {type.worker_type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>วันที่ทำสัญญา </h6>

                                <DatePicker
                                  selected={formData.contact_Data}
                                  onChange={(date) =>
                                    handleChange({
                                      target: {
                                        name: "contact_Data",
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
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>อัตราเงินเดือน</h6>
                                <input
                                  type="number"
                                  name="Salary_rate"
                                  value={formData.Salary_rate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>อัตราโอที/ชั่วโมง</h6>
                                <input
                                  type="text"
                                  name="ot_hour_rate"
                                  value={formData.ot_hour_rate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-1">
                              <div className="createFormInput">
                                <h6>SSO</h6>
                                <div className="ssoCheckBox">
                                  <input
                                    type="checkbox"
                                    name="social_security"
                                    value={formData.social_security}
                                    checked={formData.social_security == 1}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>SSO Rate </h6>
                                <input
                                  type="text"
                                  name="sso_rate"
                                  value={formData.sso_rate}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-1">
                              <div className="createFormInput">
                                <h6>WHT</h6>
                                <div className="ssoCheckBox">
                                  <input
                                    type="checkbox"
                                    name="wth_rate"
                                    value={formData.wth_rate}
                                    checked={formData.wth_rate == 1}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            </div>{" "}
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>ค่าที่พักอาศัย </h6>
                                <input
                                  type="text"
                                  name="housing_cost"
                                  value={formData.housing_cost}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>จำนวนวันลาป่วยทั้งหมด/ปี </h6>
                                <input
                                  type="text"
                                  name="total_number_sick_day1"
                                  value={formData.total_number_sick_day1}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>{" "}
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>จำนวนวันลากิจทั้งหมด/ปี</h6>
                                <input
                                  type="text"
                                  name="total_number_sick_day2"
                                  value={formData.total_number_sick_day2}
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

                <div
                  className="modal fade createModal"
                  id="exampleModalDailyRate"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content small_modal">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Update Daily Rate
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllDataSalary}
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="createFormInput">
                                <h6>Daily Rate</h6>
                                <div className="row">
                                  <div className="col-lg-6">
                                    <input
                                      type="number"
                                      id="monthInput"
                                      value={dailyRateData}
                                      onChange={handleChange1}
                                    />
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
                                      <th style={{ width: "150px" }}>
                                        รหัสพนักงาน{" "}
                                      </th>
                                      <th>ชื่อ </th>
                                      <th>
                                        <input
                                          type="checkbox"
                                          checked={isAllSelected2}
                                          onChange={handleMainCheckboxChange2}
                                        />
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {activeEmployeeData1?.map((row) => {
                                      return (
                                        <>
                                          <tr>
                                            <td>{row.id}</td>
                                            <td>
                                              {row.f_name} {row.l_name}
                                            </td>
                                            <td>
                                              <input
                                                type="checkbox"
                                                checked={selectedEmployees2.includes(
                                                  row.id
                                                )}
                                                onChange={() =>
                                                  handleCheckboxChange2(row.id)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        </>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer justify-content-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleGenerateSlip}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade createModal"
                  id="exampleModalOverTime"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content small_modal">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Update Over Time
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllDataSalary}
                        >
                          <i className="mdi mdi-close"></i>
                          </button>
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="row">
                                <div className=" col-lg-6 createFormInput">
                                  <h6>Over Time</h6>

                                  <input
                                    type="number"
                                    id="monthInput"
                                    value={overTimeData}
                                    onChange={handleChange2}
                                  />
                                </div>
                                <div className="table-responsive tableMain">
                                  <table
                                    className=" table table-striped"
                                    style={{ width: "100%", marginTop: 10 }}
                                  >
                                    <thead>
                                      <tr>
                                        <th style={{ width: "150px" }}>
                                          รหัสพนักงาน{" "}
                                        </th>
                                        <th>ชื่อ </th>
                                        <th>
                                          <input
                                            type="checkbox"
                                            checked={isAllSelected1}
                                            onChange={handleMainCheckboxChange1}
                                          />
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activeEmployeeData?.map((row) => {
                                        return (
                                          <>
                                            <tr>
                                              <td>{row.id}</td>
                                              <td>
                                                {row.f_name} {row.l_name}
                                              </td>
                                              <td>
                                                <input
                                                  type="checkbox"
                                                  checked={selectedEmployees1.includes(
                                                    row.id
                                                  )}
                                                  onChange={() =>
                                                    handleCheckboxChange1(
                                                      row.id
                                                    )
                                                  }
                                                />
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                    </tbody>
                                  </table>
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
                          onClick={handleGenerateSlip1}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade createModal"
                  id="exampleModalsso"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog ">
                    <div className="modal-content small_modal">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Update SSO
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllDataSso}
                        >
                          <i className="mdi mdi-close"></i>
                          </button>
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className="createFormInput">
                                <h6>SSO</h6>
                                <input
                                  type="number"
                                  value={ssoData}
                                  onChange={(e) => setSsoData(e.target.value)}
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
                          onClick={handleSubmitSso}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="modal fade createModal"
                  id="exampleModalwht"
                  tabIndex={-1}
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content  small_modal">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Update WHT
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={clearAllDataWth}
                        >
                          <i className="mdi mdi-close"></i>
                          </button>
                      </div>
                      <div className="modal-body">
                        <form action="">
                          <div className="row">
                            <div className="col-lg-12">
                              <div className=" createFormInput">
                                <h6>WHT</h6>
                                <input
                                  type="number"
                                  value={wthData}
                                  onChange={(e) => setWthData(e.target.value)}
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
                          onClick={handleSubmitWth}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
                          <th style={{ width: "300px" }}>พนักงาน</th>
                          <th style={{ width: "155px" }}>ประเภทพนักงาน</th>
                          <th style={{ width: "155px" }}>วันที่เริ่มทำสัญญา</th>
                          <th style={{ width: "155px" }}>อัตราเงินเดือน</th>
                          <th style={{ width: "155px" }}>อัตราโอที/ชั่วโมง</th>
                          <th style={{ width: "155px" }}>Action </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.map((row) => (
                          <tr>
                            <td>{row.employee_id}</td>
                            <td>{row.f_name}</td>
                            <td>{row.worker_type}</td>
                            <td>{formatDate(row.contract_date)}</td>
                            <td>{row.basic_salary} </td>
                            <td>{row.ot_rate} </td>
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
                                    deleteEmployee(row.contract_id)
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
                                <div className="modal-dialog modal-lg">
                                  <div className="modal-content">
                                    <div className="modal-header">
                                      <h1
                                        className="modal-title fs-5"
                                        id="exampleModalLabel"
                                      >
                                        Contract Edit
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
                                          <div className="col-lg-4">
                                            <div className="createFormInput autocompleteField">
                                              <h6>พนักงาน</h6>
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
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>ประเภทพนักงาน</h6>
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
                                                      key={type.worker_id}
                                                      value={type.worker_id}
                                                    >
                                                      {type.worker_type}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>วันที่ทำสัญญา </h6>
                                              {/* <input
                                                type="date"
                                                name="contact_Data"
                                                value={formData.contact_Data}
                                                onChange={handleChange}
                                              /> */}
                                              <DatePicker
                                                selected={formData.contact_Data}
                                                onChange={(date) =>
                                                  handleChange({
                                                    target: {
                                                      name: "contact_Data",
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
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>อัตราเงินเดือน</h6>
                                              <input
                                                type="text"
                                                name="Salary_rate"
                                                value={formData.Salary_rate}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>อัตราโอที/ชั่วโมง</h6>
                                              <input
                                                type="text"
                                                name="ot_hour_rate"
                                                value={formData.ot_hour_rate}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          {/* <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>ประกันสังคม</h6>
                                              <input
                                                type="text"
                                                name="social_security"
                                                value={formData.social_security}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div> */}
                                          <div className="col-lg-1">
                                            <div className="createFormInput">
                                              <h6>SSO</h6>
                                              <div className="ssoCheckBox">
                                                <input
                                                  type="checkbox"
                                                  name="social_security"
                                                  value={
                                                    formData.social_security
                                                  }
                                                  checked={
                                                    formData.social_security ==
                                                    1
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>SSO Rate </h6>
                                              <input
                                                type="text"
                                                name="sso_rate"
                                                value={formData.sso_rate}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-1">
                                            <div className="createFormInput">
                                              <h6>WHT </h6>
                                              <div className="ssoCheckBox">
                                                <input
                                                  type="checkbox"
                                                  name="wth_rate"
                                                  value={formData.wth_rate}
                                                  checked={
                                                    formData.wth_rate == 1
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                          </div>{" "}
                                          <div className="col-lg-3">
                                            <div className="createFormInput">
                                              <h6>ค่าที่พักอาศัย </h6>
                                              <input
                                                type="text"
                                                name="housing_cost"
                                                value={formData.housing_cost}
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>จำนวนวันลาป่วยทั้งหมด/ปี </h6>
                                              <input
                                                type="text"
                                                name="total_number_sick_day1"
                                                value={
                                                  formData.total_number_sick_day1
                                                }
                                                onChange={handleChange}
                                              />
                                            </div>
                                          </div>{" "}
                                          <div className="col-lg-4">
                                            <div className="createFormInput">
                                              <h6>จำนวนวันลากิจทั้งหมด/ปี</h6>
                                              <input
                                                type="text"
                                                name="total_number_sick_day2"
                                                value={
                                                  formData.total_number_sick_day2
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

export default Contract;
