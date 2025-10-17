import { React, useState, useEffect } from "react";
import { API_BASE_URL } from "../../Url/Url";
import { API_IMAGE_URL } from "../../Url/Url";
import logo from "../../assets/logo.png";
import NotoSansThaiRegular from "../../assets/fonts/NotoSansThai-Regular-normal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
const MySwal = withReactContent(Swal);

const Salary = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    salary_id: "",
    period: "",
    employee: "",
    Name_Surname: "",
    Payment_details: 2,
    Bank_details: "",
    Salary_baht: "",
    Total_OT_hours: "",
    OT_pay: "",
    Total_OT_baht: "",
    Cost_of_accommodation: "",
    Special_money: "",
    Total_receipts: "",
    Social_Security: "",
    Other_deduction_items: "",
    Repayment_to_the_company: "",
    Total_deductions: "",
    Total_Receipt_Details: "",
    Details_Notes: "",
    Sick_leave_leave_days1: "",
    Sick_leave_days_leave1: "",
    Sick_leave_leave_days2: "",
    Sick_leave_days_leave2: "",
    Total: "",
    Balance: "",
    hide_bonus: "",
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filterDataVAlue, setFilterDataValue] = useState("");
  const [apiBonus, setApiBonus] = useState("");
  const [apiWht, setApiWht] = useState("");
  const [storeData, setStoreData] = useState([]);
  const [selectedEmployees1, setSelectedEmployees1] = useState([]);
  const [isAllSelected1, setIsAllSelected1] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [paymentDetailsType, setPaymentDetailsType] = useState([]); // List of provinces
  const [workingDetails, setWorkingDetails] = useState(null); // Store API response
  const [search, setSearch] = useState("");
  const [salary, setSalary] = useState([]);
  const [activeEmployeeData, setActiveEmployeeData] = useState([]);
  const [allEmployeeList, setAllEmployeeList] = useState([]); // List of provinces
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOn, setIsOn] = useState(true);
  const [paymentDetails, setpaymentDetails] = useState("");
  // dropdown search

  // useEffect(() => {
  //   if (formData.period && formData.employee) {
  //     fetchEmployeeDetails();
  //   }
  // }, [formData.period, formData.employee]);

  // const fetchEmployeeDetails = async () => {
  //   try {
  //     const payload = {
  //       month: formData.period,
  //       employee: formData.employee,
  //     };

  //     console.log("Sending payload:", payload);

  //     const response = await axios.post(
  //       `${API_BASE_URL}Get_EmployeeWorking`,
  //       payload
  //     );

  //     console.log("API Response:", response.data.data);

  //     if (response.data?.data?.id) {
  //       setFilterData(response.data.data.id);
  //     }

  //     setWorkingDetails(response.data);
  //   } catch (error) {
  //     console.error("Error fetching employee working details:", error);
  //     alert(
  //       error.response?.data?.message ||
  //         "An error occurred while fetching employee working details."
  //     );
  //   }
  // };

  // const handleChange = async (e, newValue) => {
  //   const { name, value } = e.target || {};

  //   let updatedData = { ...formData };

  //   if (name === "employee" && newValue) {
  //     updatedData = {
  //       ...formData,
  //       employee: newValue.employee_id,
  //       Name_Surname: newValue.full_name,
  //     };
  //     setFormData(updatedData);
  //   } else if (name) {
  //     updatedData = {
  //       ...formData,
  //       [name]: value,
  //     };
  //     setFormData(updatedData);
  //   }

  //   console.log("Updated Form Data:", updatedData);

  //   // Create the payload from the updatedData, not the state
  //   const payload = {
  //     month: updatedData.period,
  //     employee: updatedData.employee,
  //     employee_name: updatedData.Name_Surname,
  //     basic_salary: updatedData.Salary_baht,
  //     OT_Hours: updatedData.Total_OT_hours,
  //     OT_Rate: updatedData.OT_pay,
  //     OT_Wage: updatedData.Total_OT_baht,
  //     Fixed_Bonus: updatedData.Cost_of_accommodation,
  //     SSO: updatedData.Social_Security,
  //     Deductions: updatedData.Other_deduction_items,
  //     net_income: updatedData.Total_Receipt_Details,
  //     reason: updatedData.Details_Notes,
  //     paydetails_id: updatedData.Payment_details,
  //     bankname: updatedData.Bank_details,
  //     total_earning: updatedData.Total_receipts,
  //     payback: updatedData.Repayment_to_the_company,
  //     total_deduct: updatedData.Total_deductions,
  //     sick: updatedData.Sick_leave_leave_days1,
  //     sick_balance: updatedData.Sick_leave_days_leave1,
  //     annual: updatedData.Sick_leave_days_leave2,
  //     annual_balance: updatedData.Sick_leave_days_leave2,
  //     Loan_Payment: updatedData.Total,
  //     Loan_Balance: updatedData.Balance,
  //   };

  //   try {
  //     console.log("Sending payload:", payload);
  //     const response = await axios.post(
  //       `${API_BASE_URL}NewupdateSalary`,
  //       payload
  //     );
  //     console.log("Updated Data from API:", response.data);

  //     setFormData(response.data.data);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //     alert(
  //       error.response?.data?.message ||
  //         "An error occurred while updating the data."
  //     );
  //   }
  // };

  useEffect(() => {
    if (formData?.period && formData?.employee) {
      fetchEmployeeDetails();
    }
  }, [formData?.period, formData?.employee]);

  const fetchEmployeeDetails = async () => {
    try {
      const payload = {
        month: formData.period,
        employee: formData.employee, // Pass employee as is
        salary_id: formData.salary_id,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post(
        `${API_BASE_URL}Get_EmployeeWorking`,
        payload
      );

      console.log("API Response:", response);

      if (response.data.success == false) {
        setFilterData(response.data.data);
      }
      if (response.data?.data?.id) {
        setFilterData(response.data.data.id);
        setApiBonus(response.data.data.Total_Loans);
        setApiWht(response.data.data.WHT);
      }

      setWorkingDetails(response.data);
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };

  // const handleChange = async (e, newValue) => {
  //   const { name, value } = e.target || {};

  //   let updatedData = { ...formData };

  //   if (name === "employee" && newValue) {
  //     updatedData = {
  //       ...formData,
  //       employee: newValue.employee_id, // Updated to employee
  //       employee_id: newValue.employee_id, // Add employee_id
  //       Name_Surname: newValue.full_name,
  //     };
  //     setFormData(updatedData);
  //   } else if (name) {
  //     updatedData = {
  //       ...formData,
  //       [name]: value,
  //     };
  //     setFormData(updatedData);
  //   }

  //   console.log("Updated Form Data:", updatedData);

  //   const payload = {
  //     month: updatedData.period,
  //     employee: updatedData.employee,
  //     employee_id: updatedData.employee_id,
  //     employee_name: updatedData.Name_Surname,
  //     basic_salary: updatedData.Salary_baht,
  //     OT_Hours: updatedData.Total_OT_hours,
  //     OT_Rate: updatedData.OT_pay,
  //     OT_Wage: updatedData.Total_OT_baht,
  //     Fixed_Bonus: updatedData.Cost_of_accommodation,
  //     SSO: updatedData.Social_Security,
  //     Deductions: updatedData.Other_deduction_items,
  //     net_income: updatedData.Total_Receipt_Details,
  //     reason: updatedData.Details_Notes,
  //     paydetails_id: updatedData.Payment_details,
  //     bankname: updatedData.Bank_details,
  //     total_earning: updatedData.Total_receipts,
  //     payback: updatedData.Repayment_to_the_company,
  //     total_deduct: updatedData.Total_deductions,
  //     sick: updatedData.Sick_leave_leave_days1,
  //     sick_balance: updatedData.Sick_leave_days_leave1,
  //     annual: updatedData.Sick_leave_days_leave2,
  //     annual_balance: updatedData.Sick_leave_days_leave2,
  //     Loan_Payment: updatedData.Total,
  //     Loan_Balance: updatedData.Balance,
  //   };

  //   try {
  //     console.log("Sending payload:", payload);
  //     const response = await axios.post(
  //       `${API_BASE_URL}NewupdateSalary`,
  //       payload
  //     );
  //     console.log("Updated Data from API:", response.data);

  //     // setFilterData(filterDataVAlue);
  //     // setFormData(response.data.data);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //     // alert(
  //     //   error.response?.data?.message ||
  //     //     "An error occurred while updating the data."
  //     // );
  //   }
  // };

  const handleChange = async (e, newValue) => {
    const { name, value } = e.target || {};

    let updatedData = { ...formData };

    if (name === "employee" && newValue) {
      updatedData = {
        ...formData,
        employee: newValue.employee_id,
        employee_id: newValue.employee_id,
        Name_Surname: newValue.full_name,
      };
    } else if (name) {
      updatedData = {
        ...formData,
        [name]: value,
      };
    }

    // Calculate total_earning and total_deduction
    const basicSalary = parseFloat(updatedData.Salary_baht || 0);
    const otWage = parseFloat(updatedData.Total_OT_baht || 0);
    const fixedBonus = parseFloat(updatedData.Cost_of_accommodation || 0);
    const bonus = parseFloat(updatedData.Special_money || 0);

    updatedData.Total_receipts = basicSalary + otWage + fixedBonus + bonus;

    const wht = parseFloat(apiWht || 0);
    const sso = parseFloat(updatedData.Social_Security || 0);
    const deductions = parseFloat(updatedData.Other_deduction_items || 0);
    const loanPayment = parseFloat(updatedData.Repayment_to_the_company || 0);

    updatedData.Total_deductions = wht + sso + deductions + loanPayment;
    updatedData.Total_Receipt_Details =
      basicSalary + otWage + bonus - (deductions + loanPayment + sso + wht);
    const totalLoanPayment = parseFloat(updatedData.Total || 0);

    updatedData.Balance = apiBonus - totalLoanPayment;
    setFormData(updatedData);
  };

  const [selectedMonth, setSelectedMonth] = useState("");

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
      toast.error("First Select Month");
    }
  };
  const handleMainCheckboxChange = () => {
    if (!selectedMonth) {
      toast.error("First Select Month");
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
      const allEmployeeIds = activeEmployeeData.map((row) => row.id);
      setSelectedEmployees(allEmployeeIds);

      // Fetch filtered data for all employees
      activeEmployeeData.forEach((row) => {
        fetchFilteredData(selectedMonth, row.id, true); // Select each employee
      });
    }

    setIsAllSelected(!isAllSelected); // Toggle main checkbox state
  };
  const handleCheckboxChange1 = (id) => {
    setSelectedEmployees1(
      (prevSelected) =>
        prevSelected.includes(id)
          ? prevSelected.filter((empId) => empId !== id) // Remove ID if already selected
          : [...prevSelected, id] // Add ID if not already selected
    );
  };
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

  const handleGenerateSlip = async () => {
    if (!selectedMonth) {
      toast.error("First Select Month");
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
        month: selectedMonth,
        employee_ids: selectedEmployees1,
      };

      console.log("Sending payload:", payload); // Debug log

      // Send POST request to API
      const response = await axios.post(
        `${API_BASE_URL}NewGetMultipleSalary`,
        payload
      );

      console.log("API Response:", response.data.data); // Debug log
      setIsAllSelected1("");
      setSelectedMonth(""); // Reset the month input
      setSelectedEmployees1([]); // Cle
      const doc = new jsPDF({
        // orientation: 'landscape', // Set to landscape mode
        unit: "mm",
        format: "a4", // Optional: Specify the paper size (default is A4)
      });
      const modal = document.getElementById("exampleModalSlip");
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
      response.data.data.forEach((row, index) => {
        if (index > 0) {
          doc.addPage(); // Add a new page for each subsequent employee
        }
        const totalPages = doc.internal.getNumberOfPages();

        // Add page number to each page

        doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
        doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
        const logoUrl = logo; // Replace with base64 logo or valid URL
        const logoWidth = 25;
        const logoHeight = 17;
        const xPosition = 7;
        const yPosition = 4.5;
        // Add Logo
        try {
          doc.addImage(
            logoUrl,
            "PNG",
            xPosition,
            yPosition,
            logoWidth,
            logoHeight
          );
        } catch (error) {
          console.error("Error adding logo:", error.message);
          doc.text("Logo unavailable", xPosition, yPosition + logoHeight);
        }
        // Company Details
        doc.setFontSize(12);
        doc.text(`Siam Eats Co., Ltd(0395561000010)`, 37, 8);
        doc.setFontSize(10);
        doc.text(`16/8 Moo 11 Soi Thepkunchorn 22`, 37, 12);

        const longTextOne = `Khlong Nueng Subdistrict, Khlong Luang District, Pathum Thani Province 12120`;
        const maxWidthOne = 90;
        const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
        let startXOne = 37;
        let startYOne = 16;

        // Render multi-line text
        linesOne.forEach((lineOne, index) => {
          doc.text(lineOne, startXOne, startYOne + index * 4.2);
        });

        let dynamicY = startYOne + linesOne.length * 4.2 + 1; // Adjust dynamicY after long text
        // Add "Salary Statement" and "/ PAY SLIP"
        const text = "Salary statement";
        const textOne = "/ PAY SLIP";
        const pageWidth = doc.internal.pageSize.getWidth();
        const marginRight = 5;

        // Calculate x positions for right-aligned texts
        const textX = pageWidth - doc.getTextWidth(text) - marginRight;
        const textOneX = pageWidth - doc.getTextWidth(textOne) - marginRight;

        // Add the texts to the PDF
        doc.text(text, textX, 7); // Fixed y-coordinate for "Salary statement"
        doc.text(textOne, textOneX, 11); // Positioned below "Salary statement"
        // First Table: Employee Info
        const data = ["Employee ID", row.employee_id, "Month", row.month];
        doc.autoTable({
          body: [data],
          startY: dynamicY, // Start at the current dynamicY position
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 65 },
            2: { cellWidth: 50, halign: "left" },
            3: { cellWidth: 45 },
          },
        });

        // Update dynamicY after the first table
        dynamicY = doc.lastAutoTable.finalY; // Add some spacing

        // Second Table: Employee Full Name and Payment Details
        doc.setFont("NotoSansThai");
        const dataFull = [
          "Full Name",
          row.employee_name,
          "Payment Details",
          row.Payment_Type,
        ];
        doc.autoTable({
          body: [dataFull],
          startY: dynamicY, // Start at updated dynamicY position
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 65, font: "NotoSansThai" },
            2: { cellWidth: 50, halign: "left" },
            3: { cellWidth: 45, font: "NotoSansThai" },
          },
        });

        const nextY = doc.lastAutoTable?.finalY || 50; // Safe check for finalY, with fallback
        const rectX = 5;
        const rectY = nextY; // Y position of the rectangle
        const rectWidth = doc.internal.pageSize.width - 10;
        const rectHeight = 7;
        doc.setFontSize(12);
        doc.setFillColor(32, 55, 100);
        doc.rect(rectX, rectY, rectWidth, rectHeight, "FD");

        const textSd = "Salary Details";
        const textWidthSl = doc.getTextWidth(textSd);
        const textSl = rectX + (rectWidth - textWidthSl) / 2; // Center horizontally
        const textY = rectY + rectHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
        doc.setTextColor(255, 255, 255); // White text
        doc.text(textSd, textSl, textY);
        // Calculate nextY1 for the table
        const nextY1 = doc.lastAutoTable?.finalY || rectY + rectHeight + 10; // Fallback if finalY is undefined
        const newDataOne = [["Earning List", "Deductible items"]];
        doc.autoTable({
          body: newDataOne,
          startY: nextY1 + 7,
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 105 },
            1: { cellWidth: 95 },
          },
        });
        const formatNumber = (number) => {
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(number);
        };
        const nextY2 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
        const newDataTwo = [
          [
            "Salary / Basic Salary",
            formatNumber(row.Basic_Salary),
            "THB",
            "Social Security / SSO",
            formatNumber(row.SSO),
            "THB",
          ],
        ];
        doc.autoTable({
          body: newDataTwo,
          startY: nextY2,
          margin: { left: 5, right: 5 }, // Set margins
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1, // Border thickness
            halign: "center", // Align text to the center
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            // 0: { cellWidth: 40, halign: "right" },
            1: { cellWidth: 50, halign: "right" },
            2: { cellWidth: 15 },
            3: { cellWidth: 40, halign: "left" },
            4: { cellWidth: 40, halign: "right" },
            5: { cellWidth: 15 },
          },
        });

        const nextY3 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
        const newDataThree = [
          [
            "Total OT / Overtime",
            row.OT_Hours,
            "Hours",
            row.OT_Wage,
            "THB",
            "Pay Back",
            formatNumber(row.Loan_Payment),
            "THB",
          ],
        ];
        doc.autoTable({
          body: newDataThree,
          startY: nextY3,
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 15 },
            2: { cellWidth: 15 },
            3: { cellWidth: 20 },
            4: { cellWidth: 15 },
            5: { cellWidth: 40, halign: "left" },
            6: { cellWidth: 40, halign: "right" },
            7: { cellWidth: 15 },
          },
        });
        const nextY4 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
        const newDataFour = [
          [
            "Housing Cost",
            formatNumber(row.Fixed_Bonus),
            "THB	",
            "Other Deductibles	",
            formatNumber(row.Deductions),
            "THB",
          ],
        ];
        doc.autoTable({
          body: newDataFour, // Only data, no headers
          startY: nextY4, // Start position for the second table
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 50, halign: "right" },
            2: { cellWidth: 15 },
            3: { cellWidth: 40, halign: "left" },
            4: { cellWidth: 40, halign: "right" },
            5: { cellWidth: 15 },
          },
        });
        const nextY5 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

        //
        const newDataFive = [
          [
            "Bonus",
            row.Bonus ? formatNumber(row.Bonus) : "",
            "THB",
            "Withholding Tax",
            formatNumber(row.WHT),
            "THB",
          ],
        ];

        doc.autoTable({
          body: newDataFive, // Only data, no headers
          startY: nextY5, // Start position for this table, dynamically adjusted
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 50, halign: "right" },
            2: { cellWidth: 15 },
            3: { cellWidth: 40, halign: "left" },
            4: { cellWidth: 40, halign: "right" },
            5: { cellWidth: 15 },
          },
        });
        const nextY6 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

        const newDataSix = [
          [
            "Total Earning",
            formatNumber(row.Total_Earning),
            "THB",
            "Total Deduct",
            row.Total_Deductions,
            "THB",
          ],
        ];

        doc.autoTable({
          body: newDataSix, // New table data
          startY: nextY6, // Adjust the Y position to fit below the previous table
          margin: { left: 5, right: 5 },
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
            1: { cellWidth: 50, halign: "right" }, // Adjust the width for the second column
            2: { cellWidth: 15 }, // Adjust the width for the third column
            3: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
            4: { cellWidth: 40, halign: "right" },
            5: { cellWidth: 15 },
          },
        });
        //
        const nextY7 = doc.lastAutoTable.finalY; // Add some space below the last table
        const newDataSeven = [
          ["Net Income", formatNumber(row.Payable), "THB", ""], // Adding your additional data row
        ];
        // Calculate the Y-position after the previous table
        doc.autoTable({
          body: newDataSeven, // Data for the table
          startY: nextY7, // Start position for this table
          margin: { left: 5, right: 5 }, // Set table margins
          styles: {
            fontSize: 10, // Font size for the table text
            lineColor: [0, 0, 0], // Black border color
            lineWidth: 0.1, // Border thickness
            halign: "center", // Align text to the center
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 50, halign: "right" },
            2: { cellWidth: 15 },
            // 3: { cellWidth: 40,},
            4: { cellWidth: 40 },
            // 5: { cellWidth: 15,},
          },
        });
        //
        const nextY8 = doc.lastAutoTable.finalY; // Add some space below the last table
        const rectangleX = 5; // X position of the rectangle
        const rectangleY = nextY8; // Y position of the rectangle
        const rectangleWidth = doc.internal.pageSize.width - 10; // Width of the rectangle
        const rectangleHeight = 7; // Height of the rectangle
        doc.setFontSize(12);
        doc.setFillColor(32, 55, 100);
        doc.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight, "FD");
        const headerText = "Leaves and Loans Details";
        const headerTextWidth = doc.getTextWidth(headerText);
        const headerTextX = rectangleX + (rectangleWidth - headerTextWidth) / 2; // Center horizontally
        const headerTextY = rectangleY + rectangleHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
        // Add the text
        doc.setTextColor(255, 255, 255); // Set text color to white
        doc.text(headerText, headerTextX, headerTextY);

        const nextY9 = doc.lastAutoTable.rectangleY; // Add some space below the last table
        const newDataEight = [
          ["Total annual leave / Leaves", "Loan Details"], // Adding your additional data row
        ];

        // Calculate the Y-position after the previous table
        doc.autoTable({
          body: newDataEight, // Data for the table
          startY: nextY9, // Corrected syntax for startY
          margin: { left: 5, right: 5 }, // Set table margins
          styles: {
            fontSize: 10, // Font size for the table text
            lineColor: [0, 0, 0], // Black border color
            lineWidth: 0.1, // Border thickness
            halign: "center", // Align text to the center
          },
          columnStyles: {
            0: { cellWidth: 105 },
            1: { cellWidth: 95 },
          },
        });
        //
        const nextY10 = doc.lastAutoTable.finalY; // Add some space below the last table
        const newDataTen = [
          [
            "Leave Type",
            "Sick Leave",
            "Annual Leave",
            "Total Loans",
            "00.00",
            "THB",
          ],
        ];
        // Calculate the Y-position after the previous table
        doc.autoTable({
          body: newDataTen, // Data for the table
          startY: nextY10, // Corrected syntax for startY
          margin: { left: 5, right: 5 }, // Set table margins
          styles: {
            fontSize: 10,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            halign: "center",
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" },
            1: { cellWidth: 30 },
            2: { cellWidth: 35 },
            3: { cellWidth: 40, halign: "left" },
            4: { cellWidth: 40, halign: "right" },
            5: { cellWidth: 15, halign: "center" },
          },
        });
        const nextY11 = doc.lastAutoTable.finalY;
        const newDataEleven = [
          [
            "Number of leave days",
            row.sick,
            "Day",
            row.annual,
            "Day",
            "Total Payments",
            formatNumber(row.Total_Loan_Payment),
            "THB",
          ],
        ];
        doc.autoTable({
          body: newDataEleven, // Data for the table
          startY: nextY11, // Y position for the table
          margin: { left: 5, right: 5 }, // Set table margins
          styles: {
            fontSize: 10, // Font size for the table text
            lineColor: [0, 0, 0], // Black border color
            lineWidth: 0.1, // Border thickness
            halign: "center", // Align text to the center
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" }, // Total Payments column
            1: { cellWidth: 15 }, // 0.00 column
            2: { cellWidth: 15 }, // Baht/THB column
            3: { cellWidth: 20 }, // Baht/THB column
            4: { cellWidth: 15 }, // Baht/THB column
            5: { cellWidth: 40, halign: "left" }, // Baht/THB column
            6: { cellWidth: 40, halign: "right" }, // Baht/THB column
            7: { cellWidth: 15 }, // Baht/THB column
          },
        });

        const nextY12 = doc.lastAutoTable.finalY;
        const newDataTwelve = [
          [
            "Days Left",
            row.sick_balance,
            "Day",
            row.annual_balance,
            "Day",
            "Account Balance	",
            formatNumber(row.Loan_Balance),
            "THB",
          ],
        ];
        doc.autoTable({
          body: newDataTwelve, // Data for the table
          startY: nextY12, // Y position for the table
          margin: { left: 5, right: 5 }, // Set table margins
          styles: {
            fontSize: 10, // Font size for the table text
            lineColor: [0, 0, 0], // Black border color
            lineWidth: 0.1, // Border thickness
            halign: "center", // Align text to the center
          },
          columnStyles: {
            0: { cellWidth: 40, halign: "left" }, // Total Payments column
            1: { cellWidth: 15 }, // 0.00 column
            2: { cellWidth: 15 }, // Baht/THB column
            3: { cellWidth: 20 }, // Baht/THB column
            4: { cellWidth: 15 }, // Baht/THB column
            5: { cellWidth: 40, halign: "left" }, // Baht/THB column
            6: { cellWidth: 40, halign: "right" }, // Baht/THB column
            7: { cellWidth: 15 }, // Baht/THB column
          },
        });
        const nextY13 = doc.lastAutoTable.finalY;

        // Set text color to black (RGB: 0, 0, 0)\
        doc.setFontSize(10);
        doc.setTextColor(52, 52, 52);
        doc.setFont("helvetica", "bold");
        doc.text("Note:", 5, nextY13 + 5); // Position for "Note:"
        doc.setFont("helvetica", "normal");
        const textWidth = 195;
        doc.setFont("NotoSansThai");
        const lines = doc.splitTextToSize(
          row.notes ? row.notes : "",
          textWidth
        );
        doc.text(lines, 15, nextY13 + 5); // X position of 20, Y position after the "Note:"
        const pageWidthOne = doc.internal.pageSize.width; // Get the page width
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10); // Set the desired font size
        doc.setFont("helvetica", "normal");
        const payorText = "Payor / Payor";
        const payorTextWidth = doc.getTextWidth(payorText); // Get the width of the text
        const payorX = pageWidthOne - 45 - payorTextWidth; // 5px margin from the right edge
        doc.text(payorText, payorX, nextY13 + 15); // Adjust Y as needed
        const gap = 5; // Set the horizontal gap you want
        const lineText = "----------------------------";
        const lineTextWidth = doc.getTextWidth(lineText); // Get the width of the dashed line text
        const lineX = payorX + payorTextWidth + gap; // Position the dashed line after the "Payor / Payor" text with the gap
        doc.text(lineText, lineX, nextY13 + 25); // Keep the same Y as "Payor / Payor"
        const labelText = "Payor / Payor";
        const labelTextWidth = doc.getTextWidth(labelText); // Get the width of the label text
        const labelX = pageWidthOne - 45 - labelTextWidth; // 5px margin from the right edge

        // Position and render the label text
        doc.text(labelText, labelX, nextY13 + 25); // Adjust Y as needed

        // Set a gap between the label text and the dashed line horizontally (e.g., 5px gap)
        const horizontalGap = 5; // Set the horizontal gap you want
        const dashedLineText = "----------------------------";
        const dashedLineTextWidth = doc.getTextWidth(dashedLineText); // Get the width of the dashed line text

        // Calculate the X position for the dashed line, ensuring it starts after the label text with the gap
        const dashedLineX = labelX + labelTextWidth + horizontalGap; // Position the dashed line after the label text with the gap

        // Position and render the dashed line
        doc.text(dashedLineText, dashedLineX, nextY13 + 15); // Keep the same Y as the label text
        doc.setFontSize(9);
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i); // Set the current page
          doc.text(`${i}`, doc.internal.pageSize.width - 20, 2);
        }
      });

      const pdfBlob = doc.output("blob");
      await uploadPDF2(pdfBlob);
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };

  const handleGenerate = () => {
    if (!selectedMonth) {
      toast.error("First Select Month");
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
    fetch(`${API_BASE_URL}NewAddAllEmployeeSalary`, {
      method: "POST",
      body: JSON.stringify({ salaries }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          getAllSalary();
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

  // Function to fetch data from API
  const setFilterData = async (salary_id) => {
    try {
      // Prepare payload
      const payload = {
        salary_id: salary_id,
      };

      console.log("Sending payload:", payload); // Debug log

      // Send POST request to API
      const response = await axios.post(
        `${API_BASE_URL}NewGetAllSalaryByID`,
        payload
      );

      console.log("API Response:", response.data.data); // Debug log
      setFormData((prevData) => ({
        ...prevData,
        salary_id: response.data.data.id,
        Name_Surname: response.data.data.employee_name,
        Payment_details: response.data.data.Payment_Type == "Transfer" ? 1 : 2,
        Salary_baht: response.data.data.Basic_Salary,
        Total_OT_hours: response.data.data.OT_Hours,
        OT_pay: response.data.data.OT_Rate,
        Total_OT_baht: response.data.data.OT_Wage,
        Cost_of_accommodation: response.data.data.Fixed_Bonus,
        Special_money: response.data.data.Bonus,

        // hide_bonus: response.data.data.Bonus,
        Total_receipts: response.data.data.Total_Earning,
        Social_Security: response.data.data.SSO,

        Other_deduction_items: response.data.data.Deductions,

        Repayment_to_the_company: response.data.data.Loan_Payment,
        Total_deductions: response.data.data.Total_Deductions,

        Total_Receipt_Details: response.data.data.Payable,

        Details_Notes: response.data.data.notes,
        Sick_leave_leave_days1: response.data.data.sick,
        Sick_leave_days_leave1: response.data.data.sick_balance,
        Sick_leave_leave_days2: response.data.data.annual,
        Sick_leave_days_leave2: response.data.data.annual_balance,
        Total: response.data.data.Total_Loan_Payment,
        Balance: response.data.data.Loan_Balance,
      }));
      // Update state with API response
      setWorkingDetails(response.data);
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };

  // const fetchFilteredData = (month, id, isChecked) => {
  //   if (isChecked) {
  //     // Fetch data for the employee and store it
  //     // Example: fetchData(id) -> you would need to fetch and store data accordingly
  //     fetch(`${API_BASE_URL}GetEmployeeWorking`, {
  //       month: month,
  //       employee: id, // Send single employee ID
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setFilteredData1((prevData) => [
  //           ...prevData,
  //           { employeeId: id, data },
  //         ]);

  //         setFormData((prevData) => ({
  //           ...prevData,
  //           Name_Surname: data.data.employee_name,
  //           Salary_baht: data.data.basic_salary,
  //           Total_OT_hours: data.data.overtime,
  //           OT_pay: data.data.ot_rate,
  //           Total_OT_baht: data.data.total_ot,
  //           Cost_of_accommodation: data.data.housing,
  //           Special_money: data.data.total_ot,
  //           hide_bonus: data.data.bonus,
  //           Total_receipts: 0,
  //           Social_Security: data.data.sso,
  //           Other_deduction_items: data.data.deduction,
  //           Repayment_to_the_company: data.data.payback,
  //           Total_Receipt_Details: "",
  //           Details_Notes: data.data.reason,
  //           Sick_leave_leave_days1: data.data.sick,
  //           Sick_leave_days_leave1: data.data.sick_balance,
  //           Sick_leave_leave_days2: data.data.annual,
  //           Sick_leave_days_leave2: data.data.annual_balance,
  //           Total: data.data.advance_borrow,
  //           Balance: data.data.borrow,
  //         }));
  //       });
  //   } else {
  //     // Remove the employee's data
  //     setFilteredData1((prevData) =>
  //       prevData.filter((item) => item.employeeId !== id)
  //     );
  //   }
  // };
  // const fetchFilteredData = (month, id, isChecked) => {
  //   if (isChecked) {
  //     // Fetch data for the employee and store it in an array
  //     fetch(`${API_BASE_URL}GetEmployeeWorking`, {
  //       method: "POST", // Specify the request method
  //       body: JSON.stringify({
  //         month: month,
  //         employee: id, // Send single employee ID
  //       }),
  //       headers: {
  //         "Content-Type": "application/json", // Ensure proper content type
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Check if the response structure is as expected
  //         if (data && data.data) {
  //           const employeeData = {
  //             id, // Include employee ID
  //             ...data.data, // Spread the data directly into the object
  //           };

  //           // Add the employee data to the filtered array
  //           setFilteredData1((prevData) => [...prevData, employeeData]);

  //           // Update formData (optional, depends on whether you want to handle it this way)
  //           setFormData((prevData) => ({
  //             ...prevData,
  //             Name_Surname: data.data.employee_name,
  //             Salary_baht: data.data.basic_salary,
  //             Total_OT_hours: data.data.overtime,
  //             OT_pay: data.data.ot_rate,
  //             Total_OT_baht: data.data.total_ot,
  //             Cost_of_accommodation: data.data.housing,
  //             Special_money: data.data.total_ot,
  //             hide_bonus: data.data.bonus,
  //             Total_receipts: 0,
  //             Social_Security: data.data.sso,
  //             Other_deduction_items: data.data.deduction,
  //             Repayment_to_the_company: data.data.payback,
  //             Total_Receipt_Details: "",
  //             Details_Notes: data.data.reason,
  //             Sick_leave_leave_days1: data.data.sick,
  //             Sick_leave_days_leave1: data.data.sick_balance,
  //             Sick_leave_leave_days2: data.data.annual,
  //             Sick_leave_days_leave2: data.data.annual_balance,
  //             Total: data.data.advance_borrow,
  //             Balance: data.data.borrow,
  //           }));
  //         } else {
  //           console.error("Unexpected response structure:", data);
  //           alert("An error occurred while fetching employee data.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching employee data:", error);
  //         alert("An error occurred while fetching employee data.");
  //       });
  //   } else {
  //     // Remove the employee's data from the filtered array
  //     setFilteredData1((prevData) => prevData.filter((item) => item.id !== id));
  //   }
  // };
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

  console.log(filteredData1);
  console.log(formData);

  // const fetchFilteredData = async (month, employeeId, shouldAdd) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}GetEmployeeWorking`, {
  //       month: month,
  //       employee: employeeId, // Send single employee ID
  //     });

  //     setFilteredData1((prevData) => {
  //       if (shouldAdd) {
  //         // Add the new data for the selected employee
  //         return [...prevData, response.data];
  //       } else {
  //         // Remove data for the unselected employee
  //         return prevData.filter((data) => data.id !== employeeId); // Assuming `data.id` matches `employeeId`
  //       }
  //     });
  //     console.log(filteredData1);
  //   } catch (error) {
  //     console.error("Error fetching employee data", error);
  //   }
  // };
  // const fetchFilteredData = async (month, employeeId) => {
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}GetEmployeeWorking`, {
  //       month: month,
  //       employee: employeeId, // Send single employee ID
  //     });
  //     setFilteredData1((prevData) => [...prevData, response.data]); // Append the new data to the filteredData1 state
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching employee data", error);
  //   }
  // };
  const handleChange1 = (event) => {
    const month = event.target.value;
    setSelectedMonth(month);
  };
  // Example useEffect to trigger fetch on formData change

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}GetPayDetailsDrop`)
      .then((response) => {
        console.log(response);
        setPaymentDetailsType(response.data.data); // Assuming the response has a data array
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);
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
  const data = [
    { empId: "142", name: "KYAW NAING TUN", period: "13/2024" },
    { empId: "162", name: "Khant Mon Kyaw", period: "15/2024" },
    { empId: "13", name: "KYAW NAING TUN", period: "10/2024" },
    { empId: "132", name: "KYAW NAING TUN", period: "10/2024" },
    { empId: "121", name: "KYAW NAING TUN", period: "10/2020" },
    { empId: "142", name: "KYAW NAING TUN", period: "10/202" },
    { empId: "142", name: "KYAW NAING TUN", period: "10/2012" },
    { empId: "142", name: "KYAW NAING TUN", period: "15/2025" },
  ];
  const activeAllEmployee = () => {
    axios
      .get(`${API_BASE_URL}ActiveEmployee`)
      .then((response) => {
        console.log(response.data.data);
        setActiveEmployeeData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  };
  useEffect(() => {
    activeAllEmployee();
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

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;

    setFormData({
      ...formData,
      Payment_details: selectedProvince,
    });
  };

  const filteredData = salary.filter(
    (row) =>
      (row.employee_name &&
        row.employee_name.toLowerCase().includes(search.toLowerCase())) ||
      (row.month && row.month.includes(search)) ||
      (row.employee_id && row.employee_id.toString().includes(search))
  );

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
  const getAllSalary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}NewGetAllSalary`);
      console.log("salary data:", response);
      setSalary(response.data.data);
      return response.data; // Return the data if needed
    } catch (error) {
      console.error("Error fetching salary:", error);
      throw error; // Propagate the error
    }
  };
  useEffect(() => {
    getAllSalary();
  }, []);
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
          const response = await axios.post(`${API_BASE_URL}DeleteSalary`, {
            salary_id: id,
          });
          console.log(response);
          getAllSalary();
          toast.success("Salary delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const handleSubmit = async () => {
    // try {
    //   // Prepare the payload
    //   const payload = {
    //     month: formData.period,
    //     employee_id: formData.employee,
    //     employee_name: formData.Name_Surname,
    //     paydetails_id: formData.Payment_details,
    //     bankname: formData.Bank_details,
    //     basic_salary: formData.Salary_baht,
    //     overtime: formData.Total_OT_hours,
    //     ot_rate: formData.OT_pay,
    //     total_ot: formData.Total_OT_baht,
    //     housing: formData.Cost_of_accommodation,

    //     bonus: formData.Special_money,
    //     total_earning: formData.Total_receipts,

    //     sso: formData.Social_Security,
    //     deduction: formData.Other_deduction_items,
    //     payback: formData.Repayment_to_the_company,
    //     total_deduct: formData.Total_deductions,
    //     net_income: formData.Total_Receipt_Details,
    //     reason: formData.Details_Notes,
    //     sick: formData.Sick_leave_leave_days1,
    //     sick_balance: formData.Sick_leave_days_leave1,
    //     annual: formData.Sick_leave_leave_days2,
    //     annual_balance: formData.Sick_leave_days_leave2,
    //     borrow: formData.Total,
    //     advance_borrow: formData.Balance,
    //   };

    //   // Send the payload to the API
    //   const response = await axios.post(`${API_BASE_URL}AddSalary`, payload);

    //   console.log("API Response:", response); // Log the API response for debugging
    //   getAllSalary();
    //   // Close the modal using React method
    //   const modal = document.getElementById("exampleModal");
    //   if (modal) {
    //     modal.classList.remove("show");
    //     modal.setAttribute("aria-hidden", "true");
    //     modal.style.display = "none";

    //     // Remove the backdrop manually
    //     const modalBackdrops = document.querySelectorAll(".modal-backdrop");
    //     modalBackdrops.forEach((backdrop) => backdrop.remove());

    //     // Remove body class to avoid scroll issues
    //     document.body.classList.remove("modal-open");
    //     document.body.style.overflow = "auto";
    //   }

    //   // Reset form data
    //   setFormData({
    //     period: "",
    //     employee: "",
    //     Name_Surname: "",
    //     Payment_details: "",
    //     Bank_details: "",
    //     Salary_baht: "",
    //     Total_OT_hours: "",
    //     OT_pay: "",
    //     Total_OT_baht: "",
    //     Cost_of_accommodation: "",
    //     Special_money: "",
    //     Total_receipts: "",
    //     Social_Security: "",
    //     Other_deduction_items: "",
    //     Repayment_to_the_company: "",
    //     Total_deductions: "",
    //     Total_Receipt_Details: "",
    //     Details_Notes: "",
    //     Sick_leave_leave_days1: "",
    //     Sick_leave_days_leave1: "",
    //     Sick_leave_leave_days2: "",
    //     Sick_leave_days_leave2: "",
    //     Total: "",
    //     Balance: "",
    //   });

    //   Swal.fire({
    //     title: "Success!",
    //     text: "Salary created successfully!",
    //     icon: "success",
    //   });
    // } catch (error) {
    //   console.error("Error during Salary creation:", error);

    //   const errorMessage = error.response
    //     ? error.response.data.message ||
    //       "An error occurred while creating the Salary."
    //     : "An unexpected error occurred. Please try again.";

    //   Swal.fire({
    //     title: "Error!",
    //     text: errorMessage,
    //     icon: "error",
    //   });
    // }

    console.log("Updated Form Data:", formData);

    const payload = {
      month: formData.period,
      employee: formData.employee,
      employee_id: formData.employee,
      salary_id: formData.salary_id,
      employee_name: formData.Name_Surname,
      basic_salary: formData.Salary_baht,
      OT_Hours: formData.Total_OT_hours,
      OT_Rate: formData.OT_pay,
      OT_Wage: formData.Total_OT_baht,
      Fixed_Bonus: formData.Cost_of_accommodation,
      Bonus: formData.Special_money,
      SSO: formData.Social_Security,
      Deductions: formData.Other_deduction_items,
      Payable: formData.Total_Receipt_Details,
      notes: formData.Details_Notes,
      Payment_Type: formData.Payment_details,
      bankname: formData.Bank_details,
      total_earning: formData.Total_receipts,
      Loan_Payment: formData.Repayment_to_the_company,
      total_deduct: formData.Total_deductions,
      sick: formData.Sick_leave_leave_days1,
      sick_balance: formData.Sick_leave_days_leave1,
      annual: formData.Sick_leave_days_leave2,
      annual_balance: formData.Sick_leave_days_leave2,
      Total_Loan_Payment: formData.Total,
      Loan_Balance: formData.Balance,
    };

    try {
      console.log("Sending payload:", payload);
      const response = await axios.post(
        `${API_BASE_URL}NewupdateSalary`,
        payload
      );
      console.log("Updated Data from API:", response.data);
      getAllSalary();
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
        period: "",
        employee: "",
        Name_Surname: "",
        Payment_details: "",
        Bank_details: "",
        Salary_baht: "",
        Total_OT_hours: "",
        OT_pay: "",
        Total_OT_baht: "",
        Cost_of_accommodation: "",
        Special_money: "",
        Total_receipts: "",
        Social_Security: "",
        Other_deduction_items: "",
        Repayment_to_the_company: "",
        Total_deductions: "",
        Total_Receipt_Details: "",
        Details_Notes: "",
        Sick_leave_leave_days1: "",
        Sick_leave_days_leave1: "",
        Sick_leave_leave_days2: "",
        Sick_leave_days_leave2: "",
        Total: "",
        Balance: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Salary created successfully!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error updating data:", error);

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
      salary_id: row.id,
      period: new Date(row.month).toISOString().slice(0, 7) || "", // "YYYY-MM"
      employee: row.employee_id || "",
      Payment_details: row.paydetails_id,
      Bank_details: row.bankname,
    });
  };

  const updateSubmitData = async () => {
    console.log(formData.salary_id);
    try {
      // Prepare the payload.
      const payload = {
        salary_id: formData.salary_id,
        month: formData.period,
        employee: formData.employee,
        employee_id: formData.employee,
        employee_name: formData.Name_Surname,
        basic_salary: formData.Salary_baht,
        OT_Hours: formData.Total_OT_hours,
        OT_Rate: formData.OT_pay,
        OT_Wage: formData.Total_OT_baht,
        Fixed_Bonus: formData.Cost_of_accommodation,
        Bonus: formData.Special_money,
        SSO: formData.Social_Security,
        Deductions: formData.Other_deduction_items,
        Payable: formData.Total_Receipt_Details,
        notes: formData.Details_Notes,
        Payment_Type: formData.Payment_details,
        bankname: formData.Bank_details,
        total_earning: formData.Total_receipts,
        Loan_Payment: formData.Repayment_to_the_company,
        total_deduct: formData.Total_deductions,
        sick: formData.Sick_leave_leave_days1,
        sick_balance: formData.Sick_leave_days_leave1,
        annual: formData.Sick_leave_days_leave2,
        annual_balance: formData.Sick_leave_days_leave2,
        Total_Loan_Payment: formData.Total,
        Loan_Balance: formData.Balance,
      };

      // Send the payload to the API
      const response = await axios.post(
        `${API_BASE_URL}NewupdateSalary`,
        payload
      );

      console.log("API Response:", response); // Log the API response for debugging
      getAllSalary();
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
        period: "",
        employee: "",
        Name_Surname: "",
        Payment_details: "",
        Bank_details: "",
        Salary_baht: "",
        Total_OT_hours: "",
        OT_pay: "",
        Total_OT_baht: "",
        Cost_of_accommodation: "",
        Special_money: "",
        Total_receipts: "",
        Social_Security: "",
        Other_deduction_items: "",
        Repayment_to_the_company: "",
        Total_deductions: "",
        Total_Receipt_Details: "",
        Details_Notes: "",
        Sick_leave_leave_days1: "",
        Sick_leave_days_leave1: "",
        Sick_leave_leave_days2: "",
        Sick_leave_days_leave2: "",
        Total: "",
        Balance: "",
      });

      Swal.fire({
        title: "Success!",
        text: "Salary Updated  successfully!",
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
      period: "",
      employee: "",
      Name_Surname: "",
      Payment_details: 2,
      Bank_details: "",
      Salary_baht: "",
      Total_OT_hours: "",
      OT_pay: "",
      Total_OT_baht: "",
      Cost_of_accommodation: "",
      Special_money: "",
      Total_receipts: "",
      Social_Security: "",
      Other_deduction_items: "",
      Repayment_to_the_company: "",
      Total_deductions: "",
      Total_Receipt_Details: "",
      Details_Notes: "",
      Sick_leave_leave_days1: "",
      Sick_leave_days_leave1: "",
      Sick_leave_leave_days2: "",
      Sick_leave_days_leave2: "",
      Total: "",
      Balance: "",
    });
  };

  const clearAllDataSalary = () => {
    setIsAllSelected("");
    setSelectedMonth(""); // Reset the month input
    setSelectedEmployees([]); // Clear selected employees
    setIsAllSelected1("");
    setSelectedEmployees1([]); // Cle
  };

  // slip sec
  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  }
  const generatePDF = async (employee_id, month) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/EmpAttendanceByMonth`,
        {
          month: month,
          employee_id: employee_id,
        }
      );

      console.log(response);
      const doc = new jsPDF();

      // Define table data and columns
      const columns = [
        "Date of Employment",
        "Working Hours",
        "Time Off Work",
        "OT",
      ];
      const data = response.data.data.map((item) => [
        item.Date_of_employment,
        item.Working_hours,
        item.Time_off_work,
        item.OT,
      ]);

      doc.autoTable({
        head: [columns],
        body: data,
        startY: 13,
        // margin: { left: startX }, // Use calculated x-coordinate to center the table
        headStyles: {
          fillColor: [32, 55, 100], // Background color (RGB: blue)
          textColor: [255, 255, 255], // Text color (white)
          fontStyle: "bold", // Text style (bold)
          halign: "center",
        },
        styles: {
          fontSize: 10, // Adjust the font size
          lineColor: [32, 55, 100], // Border color (blue)
          lineWidth: 0.1, // Border line width
          halign: "center",
        },
      });
      // Save the PDF
      const pdfBlob = doc.output("blob");
      const addPageNumbers = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
          );
        }
      };

      addPageNumbers(doc);
      // Output PDF as a Blob and open it in a new tab
      // Upload the PDF to the server
      await uploadPDF(pdfBlob, employee_id, month);
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };

  const uploadPDF = async (pdfBlob, employee_id, month) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${employee_id}_salary_attend_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${employee_id}_salary_attend_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const generatePDFSlip = async (row) => {
    console.log(row);

    try {
      const response = await axios.post(`${API_BASE_URL}/NewGetAllSalaryByID`, {
        salary_id: row.id,
      });

      console.log(response.data.notes?.ALL);
      const doc = new jsPDF({
        // orientation: 'landscape', // Set to landscape mode
        unit: "mm",
        format: "a4", // Optional: Specify the paper size (default is A4)
      });
      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      const logoUrl = logo; // Replace with base64 logo or valid URL
      const logoWidth = 25;
      const logoHeight = 17;
      const xPosition = 7;
      const yPosition = 4.5;
      // Add Logo
      try {
        doc.addImage(
          logoUrl,
          "PNG",
          xPosition,
          yPosition,
          logoWidth,
          logoHeight
        );
      } catch (error) {
        console.error("Error adding logo:", error.message);
        doc.text("Logo unavailable", xPosition, yPosition + logoHeight);
      }
      // Company Details
      doc.setFontSize(12);
      doc.text(`Siam Eats Co., Ltd(0395561000010)`, 37, 8);
      doc.setFontSize(10);
      doc.text(`16/8 Moo 11 Soi Thepkunchorn 22`, 37, 12);
      const longTextOne = `Khlong Nueng Subdistrict, Khlong Luang District, Pathum Thani Province 12120`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 37;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2);
      });
      let dynamicY = startYOne + linesOne.length * 4.2 + 1;
      // Salary Statement
      const text = "Salary statement";
      const textOne = "/ PAY SLIP";
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginRight = 5;
      // Calculate x position for both texts
      const textX = pageWidth - doc.getTextWidth(text) - marginRight;
      const textOneX = pageWidth - doc.getTextWidth(textOne) - marginRight;
      // Add the texts to the PDF
      doc.text(text, textX, 7); // Fixed y-coordinate for "Salary statement"
      doc.text(textOne, textOneX, 11); // Position "/ PAY SLIP" below "Salary statement"

      const empY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 25; // Fallback if no previous table
      const data = [
        "Employee ID",
        response.data.data.employee_id,
        "Month",
        response.data.data.month,
      ];
      doc.autoTable({
        body: [data],
        startY: empY,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 65 },
          2: { cellWidth: 50, halign: "left" },
          3: { cellWidth: 45 },
        },
      });
      const empFull = doc.lastAutoTable ? doc.lastAutoTable.finalY : 20;
      // Fallback if no previous table
      doc.setFont("NotoSansThai");
      const dataFull = [
        "Full Name",
        response.data.data.employee_name,
        "Payment Details",
        response.data.data.Payment_Type,
      ];
      doc.autoTable({
        body: [dataFull],
        startY: empFull,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 65, font: "NotoSansThai" },
          2: { cellWidth: 50, halign: "left" },
          3: { cellWidth: 45, font: "NotoSansThai" },
        },
      });

      const nextY = doc.lastAutoTable?.finalY || 50; // Safe check for finalY, with fallback
      const rectX = 5;
      const rectY = nextY; // Y position of the rectangle
      const rectWidth = doc.internal.pageSize.width - 10;
      const rectHeight = 7;
      doc.setFontSize(12);
      doc.setFillColor(32, 55, 100);
      doc.rect(rectX, rectY, rectWidth, rectHeight, "FD");

      const textSd = "Salary Details";
      const textWidthSl = doc.getTextWidth(textSd);
      const textSl = rectX + (rectWidth - textWidthSl) / 2; // Center horizontally
      const textY = rectY + rectHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
      doc.setTextColor(255, 255, 255); // White text
      doc.text(textSd, textSl, textY);
      // Calculate nextY1 for the table
      const nextY1 = doc.lastAutoTable?.finalY || rectY + rectHeight + 10; // Fallback if finalY is undefined
      const newDataOne = [["Earning List", "Deductible items"]];
      doc.autoTable({
        body: newDataOne,
        startY: nextY1 + 7,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 105 },
          1: { cellWidth: 95 },
        },
      });
      const formatNumber = (number) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(number);
      };
      const nextY2 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
      const newDataTwo = [
        [
          "Salary / Basic Salary",
          formatNumber(response.data.data.Basic_Salary),
          "THB",
          "Social Security / SSO",
          formatNumber(response.data.data.SSO),
          "THB",
        ],
      ];
      doc.autoTable({
        body: newDataTwo,
        startY: nextY2,
        margin: { left: 5, right: 5 }, // Set margins
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1, // Border thickness
          halign: "center", // Align text to the center
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          // 0: { cellWidth: 40, halign: "right" },
          1: { cellWidth: 50, halign: "right" },
          2: { cellWidth: 15 },
          3: { cellWidth: 40, halign: "left" },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: 15 },
        },
      });

      const nextY3 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
      const newDataThree = [
        [
          "Total OT / Overtime",
          response.data.data.OT_Hours,
          "Hours",
          response.data.data.OT_Wage,
          "THB",
          "Pay Back",
          formatNumber(response.data.data.Loan_Payment),
          "THB",
        ],
      ];
      doc.autoTable({
        body: newDataThree,
        startY: nextY3,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 20 },
          4: { cellWidth: 15 },
          5: { cellWidth: 40, halign: "left" },
          6: { cellWidth: 40, halign: "right" },
          7: { cellWidth: 15 },
        },
      });
      const nextY4 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
      const newDataFour = [
        [
          "Housing Cost",
          formatNumber(response.data.data.Fixed_Bonus),
          "THB	",
          "Other Deductibles",
          formatNumber(response.data.data.Deductions),
          "THB",
        ],
      ];
      doc.autoTable({
        body: newDataFour, // Only data, no headers
        startY: nextY4, // Start position for the second table
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 50, halign: "right" },
          2: { cellWidth: 15 },
          3: { cellWidth: 40, halign: "left" },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: 15 },
        },
      });
      const nextY5 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

      //
      const newDataFive = [
        [
          "Bonus",
          response.data.data.Bonus
            ? formatNumber(response.data.data.Bonus)
            : "",
          "THB",
          "Withholding Tax",
          formatNumber(response.data.data.WHT),
          "THB",
        ],
      ];

      doc.autoTable({
        body: newDataFive, // Only data, no headers
        startY: nextY5, // Start position for this table, dynamically adjusted
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 50, halign: "right" },
          2: { cellWidth: 15 },
          3: { cellWidth: 40, halign: "left" },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: 15 },
        },
      });
      const nextY6 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

      const newDataSix = [
        [
          "Total Earning",
          formatNumber(response.data.data.Total_Earning),
          "THB",
          "Total Deduct",
          response.data.data.Total_Deductions,
          "THB",
        ],
      ];

      doc.autoTable({
        body: newDataSix, // New table data
        startY: nextY6, // Adjust the Y position to fit below the previous table
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
          1: { cellWidth: 50, halign: "right" }, // Adjust the width for the second column
          2: { cellWidth: 15 }, // Adjust the width for the third column
          3: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: 15 },
        },
      });
      //
      const nextY7 = doc.lastAutoTable.finalY; // Add some space below the last table
      const newDataSeven = [
        ["Net Income", formatNumber(response.data.data.Payable), "THB", ""], // Adding your additional data row
      ];
      // Calculate the Y-position after the previous table
      doc.autoTable({
        body: newDataSeven, // Data for the table
        startY: nextY7, // Start position for this table
        margin: { left: 5, right: 5 }, // Set table margins
        styles: {
          fontSize: 10, // Font size for the table text
          lineColor: [0, 0, 0], // Black border color
          lineWidth: 0.1, // Border thickness
          halign: "center", // Align text to the center
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 50, halign: "right" },
          2: { cellWidth: 15 },
          // 3: { cellWidth: 40,},
          4: { cellWidth: 40 },
          // 5: { cellWidth: 15,},
        },
      });
      //
      const nextY8 = doc.lastAutoTable.finalY; // Add some space below the last table
      const rectangleX = 5; // X position of the rectangle
      const rectangleY = nextY8; // Y position of the rectangle
      const rectangleWidth = doc.internal.pageSize.width - 10; // Width of the rectangle
      const rectangleHeight = 7; // Height of the rectangle
      doc.setFontSize(12);
      doc.setFillColor(32, 55, 100);
      doc.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight, "FD");
      const headerText = "Leaves and Loans Details";
      const headerTextWidth = doc.getTextWidth(headerText);
      const headerTextX = rectangleX + (rectangleWidth - headerTextWidth) / 2; // Center horizontally
      const headerTextY = rectangleY + rectangleHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
      // Add the text
      doc.setTextColor(255, 255, 255); // Set text color to white
      doc.text(headerText, headerTextX, headerTextY);

      const nextY9 = doc.lastAutoTable.rectangleY; // Add some space below the last table
      const newDataEight = [
        ["Total annual leave / Leaves", "Loan Details"], // Adding your additional data row
      ];

      // Calculate the Y-position after the previous table
      doc.autoTable({
        body: newDataEight, // Data for the table
        startY: nextY9, // Corrected syntax for startY
        margin: { left: 5, right: 5 }, // Set table margins
        styles: {
          fontSize: 10, // Font size for the table text
          lineColor: [0, 0, 0], // Black border color
          lineWidth: 0.1, // Border thickness
          halign: "center", // Align text to the center
        },
        columnStyles: {
          0: { cellWidth: 105 },
          1: { cellWidth: 95 },
        },
      });
      //
      const nextY10 = doc.lastAutoTable.finalY; // Add some space below the last table
      const newDataTen = [
        [
          "Leave Type",
          "Sick Leave",
          "Annual Leave",
          "Total Loans",
          "00.00",
          "THB",
        ],
      ];
      // Calculate the Y-position after the previous table
      doc.autoTable({
        body: newDataTen, // Data for the table
        startY: nextY10, // Corrected syntax for startY
        margin: { left: 5, right: 5 }, // Set table margins
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" },
          1: { cellWidth: 30 },
          2: { cellWidth: 35 },
          3: { cellWidth: 40, halign: "left" },
          4: { cellWidth: 40, halign: "right" },
          5: { cellWidth: 15, halign: "center" },
        },
      });
      const nextY11 = doc.lastAutoTable.finalY;
      const newDataEleven = [
        [
          "Number of leave days",
          row.sick,
          "Day",
          row.annual,
          "Day",
          "Total Payments",
          formatNumber(response.data.data.Total_Loan_Payment),
          "THB",
        ],
      ];
      doc.autoTable({
        body: newDataEleven, // Data for the table
        startY: nextY11, // Y position for the table
        margin: { left: 5, right: 5 }, // Set table margins
        styles: {
          fontSize: 10, // Font size for the table text
          lineColor: [0, 0, 0], // Black border color
          lineWidth: 0.1, // Border thickness
          halign: "center", // Align text to the center
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Total Payments column
          1: { cellWidth: 15 }, // 0.00 column
          2: { cellWidth: 15 }, // Baht/THB column
          3: { cellWidth: 20 }, // Baht/THB column
          4: { cellWidth: 15 }, // Baht/THB column
          5: { cellWidth: 40, halign: "left" }, // Baht/THB column
          6: { cellWidth: 40, halign: "right" }, // Baht/THB column
          7: { cellWidth: 15 }, // Baht/THB column
        },
      });

      const nextY12 = doc.lastAutoTable.finalY;
      const newDataTwelve = [
        [
          "Days Left",
          row.sick_balance,
          "Day",
          row.annual_balance,
          "Day",
          "Account Balance	",
          formatNumber(response.data.data.Loan_Balance),
          "THB",
        ],
      ];
      doc.autoTable({
        body: newDataTwelve, // Data for the table
        startY: nextY12, // Y position for the table
        margin: { left: 5, right: 5 }, // Set table margins
        styles: {
          fontSize: 10, // Font size for the table text
          lineColor: [0, 0, 0], // Black border color
          lineWidth: 0.1, // Border thickness
          halign: "center", // Align text to the center
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "left" }, // Total Payments column
          1: { cellWidth: 15 }, // 0.00 column
          2: { cellWidth: 15 }, // Baht/THB column
          3: { cellWidth: 20 }, // Baht/THB column
          4: { cellWidth: 15 }, // Baht/THB column
          5: { cellWidth: 40, halign: "left" }, // Baht/THB column
          6: { cellWidth: 40, halign: "right" }, // Baht/THB column
          7: { cellWidth: 15 }, // Baht/THB column
        },
      });
      const nextY13 = doc.lastAutoTable.finalY;

      // Set text color to black (RGB: 0, 0, 0)\
      doc.setFontSize(10);
      doc.setTextColor(52, 52, 52);
      doc.setFont("helvetica", "bold");
      doc.text("Note:", 5, nextY13 + 5); // Position for "Note:"
      doc.setFont("helvetica", "normal");
      doc.setFont("NotoSansThai");
      const textWidth = 195;
      const lines = doc.splitTextToSize(
        response.data.notes.ALL ? response.data.notes?.ALL : "",
        textWidth
      );
      doc.text(lines, 15, nextY13 + 5); // X position of 20, Y position after the "Note:"
      const pageWidthOne = doc.internal.pageSize.width; // Get the page width
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10); // Set the desired font size
      doc.setFont("helvetica", "normal");
      const payorText = "Payor / Payor";
      const payorTextWidth = doc.getTextWidth(payorText); // Get the width of the text
      const payorX = pageWidthOne - 45 - payorTextWidth; // 5px margin from the right edge
      doc.text(payorText, payorX, nextY13 + 15); // Adjust Y as needed
      const gap = 5; // Set the horizontal gap you want
      const lineText = "----------------------------";
      const lineTextWidth = doc.getTextWidth(lineText); // Get the width of the dashed line text
      const lineX = payorX + payorTextWidth + gap; // Position the dashed line after the "Payor / Payor" text with the gap
      doc.text(lineText, lineX, nextY13 + 25); // Keep the same Y as "Payor / Payor"
      const labelText = "Payor / Payor";
      const labelTextWidth = doc.getTextWidth(labelText); // Get the width of the label text
      const labelX = pageWidthOne - 45 - labelTextWidth; // 5px margin from the right edge

      // Position and render the label text
      doc.text(labelText, labelX, nextY13 + 25); // Adjust Y as needed

      // Set a gap between the label text and the dashed line horizontally (e.g., 5px gap)
      const horizontalGap = 5; // Set the horizontal gap you want
      const dashedLineText = "----------------------------";
      const dashedLineTextWidth = doc.getTextWidth(dashedLineText); // Get the width of the dashed line text

      // Calculate the X position for the dashed line, ensuring it starts after the label text with the gap
      const dashedLineX = labelX + labelTextWidth + horizontalGap; // Position the dashed line after the label text with the gap

      // Position and render the dashed line
      doc.text(dashedLineText, dashedLineX, nextY13 + 15); // Keep the same Y as the label text
      const pdfBlob = doc.output("blob");
      const addPageNumbers = (doc) => {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width - 20,
            doc.internal.pageSize.height - 10
          );
        }
      };

      addPageNumbers(doc);
      // Save PDF
      await uploadPDF1(pdfBlob, row.employee_id);
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("Something went Wrong ");
      // Handle the error as needed
    }
  };
  // const generatePDFSlip = async (row) => {
  //   console.log(row);

  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/NewGetAllSalaryByID`, {
  //       salary_id: row.id,
  //       // employee: row.employee_id,
  //     });

  //     console.log(response.data.data);
  //     const doc = new jsPDF({
  //       // orientation: 'landscape', // Set to landscape mode
  //       unit: "mm",
  //       format: "a4", // Optional: Specify the paper size (default is A4)
  //     });
  //     doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
  //     doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
  //     const logoUrl = logo; // Replace with base64 logo or valid URL
  //     const logoWidth = 25;
  //     const logoHeight = 17;
  //     const xPosition = 7;
  //     const yPosition = 4.5;
  //     // Add Logo
  //     try {
  //       doc.addImage(
  //         logoUrl,
  //         "PNG",
  //         xPosition,
  //         yPosition,
  //         logoWidth,
  //         logoHeight
  //       );
  //     } catch (error) {
  //       console.error("Error adding logo:", error.message);
  //       doc.text("Logo unavailable", xPosition, yPosition + logoHeight);
  //     }
  //     // Company Details
  //     doc.setFontSize(12);
  //     doc.text(`Siam Eats Co., Ltd(0395561000010)`, 37, 8);
  //     doc.setFontSize(10);
  //     doc.text(`16/8 Moo 11 Soi Thepkunchorn 22`, 37, 12);
  //     const longTextOne = `Khlong Nueng Subdistrict, Khlong Luang District, Pathum Thani Province 12120`;
  //     const maxWidthOne = 90;
  //     const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
  //     let startXOne = 37;
  //     let startYOne = 16;
  //     linesOne.forEach((lineOne, index) => {
  //       doc.text(lineOne, startXOne, startYOne + index * 4.2);
  //     });
  //     let dynamicY = startYOne + linesOne.length * 4.2 + 1;
  //     // Salary Statement
  //     const text = "Salary statement";
  //     const textOne = "/ PAY SLIP";
  //     const pageWidth = doc.internal.pageSize.getWidth();
  //     const marginRight = 5;
  //     // Calculate x position for both texts
  //     const textX = pageWidth - doc.getTextWidth(text) - marginRight;
  //     const textOneX = pageWidth - doc.getTextWidth(textOne) - marginRight;
  //     // Add the texts to the PDF
  //     doc.text(text, textX, 7); // Fixed y-coordinate for "Salary statement"
  //     doc.text(textOne, textOneX, 11); // Position "/ PAY SLIP" below "Salary statement"

  //     const empY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 25; // Fallback if no previous table
  //     const data = [
  //       "Employee ID",
  //       response.data.data.employee_id,
  //       "Month",
  //       response.data.data.month,
  //     ];
  //     doc.autoTable({
  //       body: [data],
  //       startY: empY,
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 65 },
  //         2: { cellWidth: 50, halign: "left" },
  //         3: { cellWidth: 45 },
  //       },
  //     });
  //     const empFull = doc.lastAutoTable ? doc.lastAutoTable.finalY : 20;
  //     // Fallback if no previous table
  //     doc.setFont("NotoSansThai");
  //     const dataFull = [
  //       "Full Name",
  //       response.data.data.employee_name,
  //       "Payment Details",
  //       response.data.data.Payment_Type,
  //     ];
  //     doc.autoTable({
  //       body: [dataFull],
  //       startY: empFull,
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 65, font: "NotoSansThai" },
  //         2: { cellWidth: 50, halign: "left" },
  //         3: { cellWidth: 45, font: "NotoSansThai" },
  //       },
  //     });

  //     const nextY = doc.lastAutoTable?.finalY || 50; // Safe check for finalY, with fallback
  //     const rectX = 5;
  //     const rectY = nextY; // Y position of the rectangle
  //     const rectWidth = doc.internal.pageSize.width - 10;
  //     const rectHeight = 7;
  //     doc.setFontSize(12);
  //     doc.setFillColor(32, 55, 100);
  //     doc.rect(rectX, rectY, rectWidth, rectHeight, "FD");

  //     const textSd = "Salary Details";
  //     const textWidthSl = doc.getTextWidth(textSd);
  //     const textSl = rectX + (rectWidth - textWidthSl) / 2; // Center horizontally
  //     const textY = rectY + rectHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
  //     doc.setTextColor(255, 255, 255); // White text
  //     doc.text(textSd, textSl, textY);
  //     // Calculate nextY1 for the table
  //     const nextY1 = doc.lastAutoTable?.finalY || rectY + rectHeight + 10; // Fallback if finalY is undefined
  //     const newDataOne = [["Earning List", "Deductible items"]];
  //     doc.autoTable({
  //       body: newDataOne,
  //       startY: nextY1 + 7,
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 105 },
  //         1: { cellWidth: 95 },
  //       },
  //     });
  //     const formatNumber = (number) => {
  //       return new Intl.NumberFormat("en-US", {
  //         minimumFractionDigits: 2,
  //         maximumFractionDigits: 2,
  //       }).format(number);
  //     };
  //     const nextY2 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
  //     const newDataTwo = [
  //       [
  //         "Salary / Basic Salary",
  //         formatNumber(response.data.data.Basic_Salary),
  //         "THB",
  //         "Social Security / SSO",
  //         formatNumber(response.data.data.SSO),
  //         "THB",
  //       ],
  //     ];
  //     doc.autoTable({
  //       body: newDataTwo,
  //       startY: nextY2,
  //       margin: { left: 5, right: 5 }, // Set margins
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1, // Border thickness
  //         halign: "center", // Align text to the center
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         // 0: { cellWidth: 40, halign: "right" },
  //         1: { cellWidth: 50, halign: "right" },
  //         2: { cellWidth: 15 },
  //         3: { cellWidth: 40, halign: "left" },
  //         4: { cellWidth: 40, halign: "right" },
  //         5: { cellWidth: 15 },
  //       },
  //     });

  //     const nextY3 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
  //     const newDataThree = [
  //       [
  //         "Total OT / Overtime",
  //         response.data.data.OT_Hours,
  //         "Hours",
  //         row.overtime,
  //         "THB",
  //         "Pay Back",
  //         formatNumber(row.payback),
  //         "THB",
  //       ],
  //     ];
  //     doc.autoTable({
  //       body: newDataThree,
  //       startY: nextY3,
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 15 },
  //         2: { cellWidth: 15 },
  //         3: { cellWidth: 20 },
  //         4: { cellWidth: 15 },
  //         5: { cellWidth: 40, halign: "left" },
  //         6: { cellWidth: 40, halign: "right" },
  //         7: { cellWidth: 15 },
  //       },
  //     });
  //     const nextY4 = doc.lastAutoTable.finalY; // Get the final Y position after the first table
  //     const newDataFour = [
  //       [
  //         "Housing Cost",
  //         formatNumber(response.data.data.Fixed_Bonus),
  //         "THB	",
  //         "Other Deductibles	",
  //         formatNumber(response.data.data.Deductions),
  //         "THB",
  //       ],
  //     ];
  //     doc.autoTable({
  //       body: newDataFour, // Only data, no headers
  //       startY: nextY4, // Start position for the second table
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 50, halign: "right" },
  //         2: { cellWidth: 15 },
  //         3: { cellWidth: 40, halign: "left" },
  //         4: { cellWidth: 40, halign: "right" },
  //         5: { cellWidth: 15 },
  //       },
  //     });
  //     const nextY5 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

  //     //
  //     const newDataFive = [
  //       [
  //         "Bonus",
  //         response.data.data.Bonus
  //           ? formatNumber(response.data.data.Bonus)
  //           : "",
  //         "THB",
  //         "Withholding Tax",
  //         formatNumber(response.data.data.WHT),
  //         "THB",
  //       ],
  //     ];

  //     doc.autoTable({
  //       body: newDataFive, // Only data, no headers
  //       startY: nextY5, // Start position for this table, dynamically adjusted
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 50, halign: "right" },
  //         2: { cellWidth: 15 },
  //         3: { cellWidth: 40, halign: "left" },
  //         4: { cellWidth: 40, halign: "right" },
  //         5: { cellWidth: 15 },
  //       },
  //     });
  //     const nextY6 = doc.lastAutoTable.finalY; // Get the final Y position after the first table

  //     const newDataSix = [
  //       [
  //         "Total Earning",
  //         formatNumber(response.data.data.Total_Earning),
  //         "THB",
  //         "Total Deduct",
  //         response.data.data.Total_Deductions,
  //         "THB",
  //       ],
  //     ];

  //     doc.autoTable({
  //       body: newDataSix, // New table data
  //       startY: nextY6, // Adjust the Y position to fit below the previous table
  //       margin: { left: 5, right: 5 },
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
  //         1: { cellWidth: 50, halign: "right" }, // Adjust the width for the second column
  //         2: { cellWidth: 15 }, // Adjust the width for the third column
  //         3: { cellWidth: 40, halign: "left" }, // Adjust the width for the first column
  //         4: { cellWidth: 40, halign: "right" },
  //         5: { cellWidth: 15 },
  //       },
  //     });
  //     //
  //     const nextY7 = doc.lastAutoTable.finalY; // Add some space below the last table
  //     const newDataSeven = [
  //       ["Net Income", formatNumber(response.data.data.Payable), "THB", ""], // Adding your additional data row
  //     ];
  //     // Calculate the Y-position after the previous table
  //     doc.autoTable({
  //       body: newDataSeven, // Data for the table
  //       startY: nextY7, // Start position for this table
  //       margin: { left: 5, right: 5 }, // Set table margins
  //       styles: {
  //         fontSize: 10, // Font size for the table text
  //         lineColor: [0, 0, 0], // Black border color
  //         lineWidth: 0.1, // Border thickness
  //         halign: "center", // Align text to the center
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 50, halign: "right" },
  //         2: { cellWidth: 15 },
  //         // 3: { cellWidth: 40,},
  //         4: { cellWidth: 40 },
  //         // 5: { cellWidth: 15,},
  //       },
  //     });
  //     //
  //     const nextY8 = doc.lastAutoTable.finalY; // Add some space below the last table
  //     const rectangleX = 5; // X position of the rectangle
  //     const rectangleY = nextY8; // Y position of the rectangle
  //     const rectangleWidth = doc.internal.pageSize.width - 10; // Width of the rectangle
  //     const rectangleHeight = 7; // Height of the rectangle
  //     doc.setFontSize(12);
  //     doc.setFillColor(32, 55, 100);
  //     doc.rect(rectangleX, rectangleY, rectangleWidth, rectangleHeight, "FD");
  //     const headerText = "Leaves and Loans Details";
  //     const headerTextWidth = doc.getTextWidth(headerText);
  //     const headerTextX = rectangleX + (rectangleWidth - headerTextWidth) / 2; // Center horizontally
  //     const headerTextY = rectangleY + rectangleHeight / 2 + 1.2; // Center vertically (adjusted for baseline)
  //     // Add the text
  //     doc.setTextColor(255, 255, 255); // Set text color to white
  //     doc.text(headerText, headerTextX, headerTextY);

  //     const nextY9 = doc.lastAutoTable.rectangleY; // Add some space below the last table
  //     const newDataEight = [
  //       ["Total annual leave / Leaves", "Loan Details"], // Adding your additional data row
  //     ];

  //     // Calculate the Y-position after the previous table
  //     doc.autoTable({
  //       body: newDataEight, // Data for the table
  //       startY: nextY9, // Corrected syntax for startY
  //       margin: { left: 5, right: 5 }, // Set table margins
  //       styles: {
  //         fontSize: 10, // Font size for the table text
  //         lineColor: [0, 0, 0], // Black border color
  //         lineWidth: 0.1, // Border thickness
  //         halign: "center", // Align text to the center
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 105 },
  //         1: { cellWidth: 95 },
  //       },
  //     });
  //     //
  //     const nextY10 = doc.lastAutoTable.finalY; // Add some space below the last table
  //     const newDataTen = [
  //       [
  //         "Leave Type",
  //         "Sick Leave",
  //         "Annual Leave",
  //         "Total Loans",
  //         "00.00",
  //         "THB",
  //       ],
  //     ];
  //     // Calculate the Y-position after the previous table
  //     doc.autoTable({
  //       body: newDataTen, // Data for the table
  //       startY: nextY10, // Corrected syntax for startY
  //       margin: { left: 5, right: 5 }, // Set table margins
  //       styles: {
  //         fontSize: 10,
  //         lineColor: [0, 0, 0],
  //         lineWidth: 0.1,
  //         halign: "center",
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" },
  //         1: { cellWidth: 30 },
  //         2: { cellWidth: 35 },
  //         3: { cellWidth: 40, halign: "left" },
  //         4: { cellWidth: 40, halign: "right" },
  //         5: { cellWidth: 15, halign: "center" },
  //       },
  //     });
  //     const nextY11 = doc.lastAutoTable.finalY;
  //     const newDataEleven = [
  //       [
  //         "Number of leave days",
  //         row.sick,
  //         "Day",
  //         row.annual,
  //         "Day",
  //         "Total Payments",
  //         formatNumber(response.data.data.Loan_Balance),
  //         "THB",
  //       ],
  //     ];
  //     doc.autoTable({
  //       body: newDataEleven, // Data for the table
  //       startY: nextY11, // Y position for the table
  //       margin: { left: 5, right: 5 }, // Set table margins
  //       styles: {
  //         fontSize: 10, // Font size for the table text
  //         lineColor: [0, 0, 0], // Black border color
  //         lineWidth: 0.1, // Border thickness
  //         halign: "center", // Align text to the center
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" }, // Total Payments column
  //         1: { cellWidth: 15 }, // 0.00 column
  //         2: { cellWidth: 15 }, // Baht/THB column
  //         3: { cellWidth: 20 }, // Baht/THB column
  //         4: { cellWidth: 15 }, // Baht/THB column
  //         5: { cellWidth: 40, halign: "left" }, // Baht/THB column
  //         6: { cellWidth: 40, halign: "right" }, // Baht/THB column
  //         7: { cellWidth: 15 }, // Baht/THB column
  //       },
  //     });

  //     const nextY12 = doc.lastAutoTable.finalY;
  //     const newDataTwelve = [
  //       [
  //         "Days Left",
  //         row.sick_balance,
  //         "Day",
  //         row.annual_balance,
  //         "Day",
  //         "Account Balance	",
  //         formatNumber(response.data.data.Total_Loan_Payment),
  //         "THB",
  //       ],
  //     ];
  //     doc.autoTable({
  //       body: newDataTwelve, // Data for the table
  //       startY: nextY12, // Y position for the table
  //       margin: { left: 5, right: 5 }, // Set table margins
  //       styles: {
  //         fontSize: 10, // Font size for the table text
  //         lineColor: [0, 0, 0], // Black border color
  //         lineWidth: 0.1, // Border thickness
  //         halign: "center", // Align text to the center
  //       },
  //       columnStyles: {
  //         0: { cellWidth: 40, halign: "left" }, // Total Payments column
  //         1: { cellWidth: 15 }, // 0.00 column
  //         2: { cellWidth: 15 }, // Baht/THB column
  //         3: { cellWidth: 20 }, // Baht/THB column
  //         4: { cellWidth: 15 }, // Baht/THB column
  //         5: { cellWidth: 40, halign: "left" }, // Baht/THB column
  //         6: { cellWidth: 40, halign: "right" }, // Baht/THB column
  //         7: { cellWidth: 15 }, // Baht/THB column
  //       },
  //     });
  //     const nextY13 = doc.lastAutoTable.finalY;

  //     // Set text color to black (RGB: 0, 0, 0)\
  //     doc.setFontSize(10);
  //     doc.setTextColor(52, 52, 52);
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Note:", 5, nextY13 + 5); // Position for "Note:"
  //     doc.setFont("helvetica", "normal");
  //     const textWidth = 195;
  //     const lines = doc.splitTextToSize(
  //       " Father's Day bonuses // Bonus = 9000 // Deduct 1 hour from the 11th month // Deduct withdrawal money",
  //       textWidth
  //     );
  //     doc.text(lines, 15, nextY13 + 5); // X position of 20, Y position after the "Note:"
  //     const pageWidthOne = doc.internal.pageSize.width; // Get the page width
  //     doc.setTextColor(0, 0, 0);
  //     doc.setFontSize(10); // Set the desired font size
  //     doc.setFont("helvetica", "normal");
  //     const payorText = "Payor / Payor";
  //     const payorTextWidth = doc.getTextWidth(payorText); // Get the width of the text
  //     const payorX = pageWidthOne - 45 - payorTextWidth; // 5px margin from the right edge
  //     doc.text(payorText, payorX, nextY13 + 15); // Adjust Y as needed
  //     const gap = 5; // Set the horizontal gap you want
  //     const lineText = "----------------------------";
  //     const lineTextWidth = doc.getTextWidth(lineText); // Get the width of the dashed line text
  //     const lineX = payorX + payorTextWidth + gap; // Position the dashed line after the "Payor / Payor" text with the gap
  //     doc.text(lineText, lineX, nextY13 + 25); // Keep the same Y as "Payor / Payor"
  //     const labelText = "Payor / Payor";
  //     const labelTextWidth = doc.getTextWidth(labelText); // Get the width of the label text
  //     const labelX = pageWidthOne - 45 - labelTextWidth; // 5px margin from the right edge

  //     // Position and render the label text
  //     doc.text(labelText, labelX, nextY13 + 25); // Adjust Y as needed

  //     // Set a gap between the label text and the dashed line horizontally (e.g., 5px gap)
  //     const horizontalGap = 5; // Set the horizontal gap you want
  //     const dashedLineText = "----------------------------";
  //     const dashedLineTextWidth = doc.getTextWidth(dashedLineText); // Get the width of the dashed line text

  //     // Calculate the X position for the dashed line, ensuring it starts after the label text with the gap
  //     const dashedLineX = labelX + labelTextWidth + horizontalGap; // Position the dashed line after the label text with the gap

  //     // Position and render the dashed line
  //     doc.text(dashedLineText, dashedLineX, nextY13 + 15); // Keep the same Y as the label text
  //     const pdfBlob = doc.output("blob");
  //     const addPageNumbers = (doc) => {
  //       const pageCount = doc.internal.getNumberOfPages();
  //       for (let i = 1; i <= pageCount; i++) {
  //         doc.setPage(i);
  //         doc.text(
  //           `Page ${i} of ${pageCount}`,
  //           doc.internal.pageSize.width - 20,
  //           doc.internal.pageSize.height - 10
  //         );
  //       }
  //     };

  //     addPageNumbers(doc);
  //     // Save PDF
  //     await uploadPDF1(pdfBlob, row.employee_id);
  //   } catch (error) {
  //     console.error("Error fetching statement:", error);
  //     toast.error("Something went Wrong ");
  //     // Handle the error as needed
  //   }
  // };
  const uploadPDF1 = async (pdfBlob, employee_id) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append(
      "document",
      pdfBlob,
      `${employee_id}_salary_sleep_${dateTime}.pdf`
    );

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(
          `${API_IMAGE_URL}${employee_id}_salary_sleep_${dateTime}.pdf`
        );
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const uploadPDF2 = async (pdfBlob, employee_id) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_salary_sleep_${dateTime}.pdf`);

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_salary_sleep_${dateTime}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  const handleMonthly = async () => {
    if (!selectedMonth) {
      toast.error("First Select Month");
      return; // Exit the function early if no month is selected
    }

    try {
      // Prepare payload
      const payload = {
        month: selectedMonth,
      };

      console.log("Sending payload:", payload); // Debug log

      // Send POST request to API
      const response = await axios.post(
        `${API_BASE_URL}NewGetAllSalaryByMonth`,
        payload
      );

      console.log("API Response:", response.data.data); // Debug log
      setSelectedMonth(""); // Reset the month input

      const doc = new jsPDF({
        orientation: "landscape", // Set to landscape mode
        unit: "mm",
        format: "a4", // Optional: Specify the paper size (default is A4)
      });
      const modal = document.getElementById("exampleModalmonthly");
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

      doc.addFileToVFS("NotoSansThai-Regular.ttf", NotoSansThaiRegular); // NotoSansThaiRegular is the variable exported from the .js file
      doc.addFont("NotoSansThai-Regular.ttf", "NotoSansThai", "normal");
      const logoUrl = logo; // Replace with base64 logo or valid URL
      const logoWidth = 25;
      const logoHeight = 17;
      const xPosition = 7;
      const yPosition = 4.5;
      // Add Logo
      try {
        doc.addImage(
          logoUrl,
          "PNG",
          xPosition,
          yPosition,
          logoWidth,
          logoHeight
        );
      } catch (error) {
        console.error("Error adding logo:", error.message);
        doc.text("Logo unavailable", xPosition, yPosition + logoHeight);
      }
      // Company Details
      doc.setFontSize(12);
      doc.text(`Siam Eats Co., Ltd(0395561000010)`, 37, 8);
      doc.setFontSize(10);
      doc.text(`16/8 Moo 11 Soi Thepkunchorn 22`, 37, 12);
      const longTextOne = `Khlong Nueng Subdistrict, Khlong Luang District, Pathum Thani Province 12120`;
      const maxWidthOne = 90;
      const linesOne = doc.splitTextToSize(longTextOne, maxWidthOne);
      let startXOne = 37;
      let startYOne = 16;
      linesOne.forEach((lineOne, index) => {
        doc.text(lineOne, startXOne, startYOne + index * 4.2);
      });

      const pageWidth = doc.internal.pageSize.width; // Landscape width (297mm)
      const rightMargin = 7; // 7mm right margin
      const xPositionNew = pageWidth - rightMargin; // Position for right-aligned text
      doc.setFont("helvetica", "bold"); // Set font to Helvetica and bold weight
      doc.text(
        `${moment(selectedMonth)
          .format("MMMM YYYY")
          .toUpperCase()} SALARY REPORT`,
        xPositionNew,
        8,
        {
          align: "right",
        }
      );

      const headers = [
        [
          {
            content: "Earning",
            colSpan: 6,
            rowSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: "Deduction",
            colSpan: 4,
            rowSpan: 1,
            styles: { halign: "center" },
          },
          {
            content: "Payment Details",
            colSpan: 1,
            rowSpan: 1,
            styles: { halign: "center" },
          },
        ],
        [
          { content: "ROW", styles: { halign: "center" } },
          { content: "Name", styles: { halign: "center" } },
          { content: "Basic", styles: { halign: "center" } },
          { content: "Overtime", styles: { halign: "center" } },
          { content: "Bonus", styles: { halign: "center" } },
          { content: "Total", styles: { halign: "center" } },
          { content: "SSO", styles: { halign: "center" } },
          { content: "WHT", styles: { halign: "center" } },
          { content: "Loan", styles: { halign: "center" } },
          { content: "Deduction", styles: { halign: "center" } },
          { content: "Payment", styles: { halign: "center" } },
        ],
      ];
      const formatNumber = (number) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(number);
      };

      const rows = response?.data?.data?.salaryDetails?.map((item, index) => ({
        ROW: index + 1,
        Name: item.employee_name,
        Basic: formatNumber(item.Basic_Salary),
        Overtime: formatNumber(item.OT_Hours),
        Bonus: formatNumber(item.Bonus),
        Total: formatNumber(item.Total_Earning),
        SSO: formatNumber(item.SSO),
        WHT: formatNumber(item.WHT),
        Loan: formatNumber(item.Loan_Payment),
        Deduction: formatNumber(item.Deductions),
        Payment: formatNumber(item.Payable),
      }));
      doc.autoTable({
        head: headers,
        body: rows?.map((row) => [
          row.ROW,
          row.Name,
          row.Basic,
          row.Overtime,
          row.Bonus,
          row.Total,
          row.SSO,
          row.WHT,
          row.Loan,
          row.Deduction,
          row.Payment,
        ]),
        startY: 27,
        theme: "grid",
        headStyles: {
          fillColor: [33, 56, 99], // Set the header background color (light blue in this case)
          textColor: [255, 255, 255], // Set the header text color to white
          halign: "center", // Horizontal alignment of header text
        },
        styles: {
          textColor: [0, 0, 0], // Text color for body cells (black in this case)
          valign: "middle", // Vertical alignment for text inside body cells
          lineWidth: 0.01, // Adjust the border width
          lineColor: [26, 35, 126], // Border color for body cells
        },
        margin: {
          left: 7,
          right: 7,
        },
        tableWidth: "auto",
        columnStyles: {
          0: { halign: "center", cellWidth: 13 }, // Column alignment for the 7th column
          1: { halign: "left", cellWidth: 45, font: "NotoSansThai" }, // Column alignment for the 6th column
          2: { halign: "right", cellWidth: 25 },
          3: { halign: "right", cellWidth: 25 },
          4: { halign: "right", cellWidth: 25 },
          5: { halign: "right", cellWidth: 25 },
          6: { halign: "right", cellWidth: 24 },
          7: { halign: "right", cellWidth: 24 },
          8: { halign: "right", cellWidth: 22 },
          9: { halign: "right", cellWidth: 22 },
          10: { halign: "right", cellWidth: 32 }, // Column alignment for the 6th column
        },
      });
      let lastY1 = doc.lastAutoTable.finalY;

      // doc.text("", 65, lastY1 + 5);
      // doc.text("Overtime", 65, lastY1 + 9);
      // doc.text("Bonus", 65, lastY1 + 13);
      // doc.text("Total Wages", 65, lastY1 + 17);
      // doc.text("SSO", 65, lastY1 + 21);
      // doc.text("WHT", 65, lastY1 + 25);
      // doc.text("Total Payment", 65, lastY1 + 29);
      doc.setFont("helvetica", "normal");

      doc.text(response?.data?.data?.summary[0]?.Basic, 65, lastY1 + 5); // Add x and y positions for the second text
      doc.text(response?.data?.data?.summary[0]?.OT, 65, lastY1 + 9); // Add x and y positions for the second text
      doc.text(response?.data?.data?.summary[0]?.Bonus, 65, lastY1 + 13);
      doc.text(
        response?.data?.data?.summary[0]?.TOTAL_WAGES_COST,
        65,
        lastY1 + 17
      );
      doc.text(response?.data?.data?.summary[0]?.SSO, 65, lastY1 + 21);
      doc.text(response?.data?.data?.summary[0]?.WHT, 65, lastY1 + 25);
      doc.text(response?.data?.data?.summary[0]?.Payable, 65, lastY1 + 29);
      doc.text(response?.data?.data?.summary[0]?.OT_hours, 65, lastY1 + 33);
      doc.text(response?.data?.data?.summary[0]?.Total_Wages, 65, lastY1 + 37);
      // const rowsNew = [
      //   ["1", "Jhon", formatNumber(1400.34534), formatNumber(45.12)],

      // ];

      const rowsNew = response?.data?.data?.salaryDetails?.map(
        (item, index) => ({
          ROW: index + 1,
          Name: item.employee_name,
          Basic: item.employee_bankname,
          bankNumber: item.banknum,
          Overtime: formatNumber(item.Payable),
        })
      );
      // Add a new page for the second table
      doc.addPage();

      // Adding the second table to the PDF
      doc.autoTable({
        head: [
          [
            { content: "Row", styles: { halign: "center" } },
            {
              content: "Name",
              styles: { halign: "center" },
            },
            { content: "Bank", styles: { halign: "center" } },
            { content: "Bank Account", styles: { halign: "center" } },
            { content: "Amount", styles: { halign: "center" } },
          ],
        ], // Header row for table 2
        body: rowsNew?.map((row) => [
          row.ROW,
          row.Name,
          row.Basic,
          row.bankNumber,
          row.Overtime,
        ]),
        startY: 10, // Start at the top of the new page
        theme: "grid",
        headStyles: {
          fillColor: [32, 55, 100], // Header color for the second table
          textColor: [255, 255, 255],
          halign: "center",
        },
        styles: {
          fontSize: 10, // Font size for the table
          textColor: [0, 0, 0], // Text color for body cells
          valign: "middle",
          lineWidth: 0.1, // Border width
          lineColor: [26, 35, 126], // Border color
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 13 }, // Column alignment for the 7th column
          1: { halign: "left", cellWidth: 45, font: "NotoSansThai" }, // Column alignment for the 6th column
          2: { halign: "right", cellWidth: 30, font: "NotoSansThai" },
          3: { halign: "right", cellWidth: 30 },
          4: { halign: "right", cellWidth: 45 },
        },
        margin: {
          left: 7,
          right: 7,
        },
        tableWidth: "auto",
      });
      const pdfBlob = doc.output("blob");
      await uploadPDF3(pdfBlob, selectedMonth);
    } catch (error) {
      console.error("Error fetching employee working details:", error);
      alert(
        error.response?.data?.message ||
          "An error occurred while fetching employee working details."
      );
    }
  };
  const uploadPDF3 = async (pdfBlob, selectedMonth) => {
    const dateTime = `${formatDate(new Date())}_${new Date().getTime()}`;
    const formData = new FormData();
    formData.append("document", pdfBlob, `_month_report_${dateTime}.pdf`);

    try {
      const response = await axios.post(`${API_BASE_URL}/UploadPdf`, formData);
      console.log(response);
      if (response.data.success) {
        console.log("PDF uploaded successfully");
        window.open(`${API_IMAGE_URL}_month_report_${dateTime}.pdf`);
      } else {
        console.log("Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };
  return (
    <div>
      <ToastContainer />
      <div className="container-fluid">
        <div className="row">
          <div className="dashboardMain px-4 mt-4 mb-4">
            <div className="grayBgColor">
              <div className="d-flex justify-content-between  px-4 py-3 items-center exportPopupBtn">
                <h6 className="font-weight-bolder mb-0">Salary Management</h6>
                <div>
                  <button
                    type="button"
                    className=" me-2 btn button btn-info"
                    // onClick={handleMonthly}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalmonthly"
                  >
                    Monthly Report
                  </button>
                  <button
                    type="button"
                    className=" me-2 btn button btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalSlip"
                  >
                    Multiple Salary Slip
                  </button>
                  <button
                    type="button"
                    className=" me-2 btn button btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalFull"
                  >
                    Full
                  </button>
                  <button
                    type="button"
                    className="btn button btn-info"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Create
                  </button>
                </div>
                {/* full modal */}
                <div
                  className="modal fade createModal"
                  id="exampleModalFull"
                  tabIndex={-1}
                  aria-labelledby="exampleModalFull"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          เงินเดือน
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
                        <div className="row">
                          <div className="col-lg-4 createFormInput">
                            <input
                              type="month"
                              id="monthInput"
                              value={selectedMonth}
                              onChange={handleChange1}
                            />
                          </div>
                        </div>

                        <div className="table-responsive tableMain">
                          <table
                            className=" table table-striped"
                            style={{ width: "100%", marginTop: 10 }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "150px" }}>รหัสพนักงาน </th>
                                <th>ชื่อ </th>
                                <th>
                                  <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleMainCheckboxChange}
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
                                        {row.f_name} {row.f_name}
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedEmployees.includes(
                                            row.id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange(row.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="populatebBtn text-center">
                            <button
                              style={{ width: "150px" }}
                              onClick={handleGenerate}
                            >
                              Generate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* full modal  end*/}
                <div
                  className="modal fade createModal"
                  id="exampleModalmonthly"
                  tabIndex={-1}
                  aria-labelledby="exampleModalFull"
                  aria-hidden="true"
                >
                  <div className="modal-dialog ">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          รายงานประจำเดือน
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
                        <div className="row">
                          <div className="col-lg-12 createFormInput">
                            <input
                              type="month"
                              id="monthInput"
                              value={selectedMonth}
                              onChange={handleChange1}
                            />
                          </div>
                        </div>
                        <div className="table-responsive tableMain">
                          <div className="populatebBtn text-center">
                            <button
                              style={{ width: "150px" }}
                              onClick={handleMonthly}
                            >
                              Generate
                            </button>{" "}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                          onClick={clearAllData}
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
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
                                <input
                                  type="month"
                                  name="period"
                                  value={formData?.period}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput autocompleteField">
                                <h6>พนักงาน</h6>
                                <Autocomplete
                                  options={allEmployeeList || []} // Ensure options is always an array
                                  getOptionLabel={(option) =>
                                    option?.employee_id && option?.full_name
                                      ? `${option.employee_id}: ${option.full_name}`
                                      : ""
                                  }
                                  value={
                                    allEmployeeList?.find(
                                      (v) =>
                                        v.employee_id === formData?.employee
                                    ) || null
                                  }
                                  onChange={(event, newValue) => {
                                    setFormData({
                                      ...formData,
                                      employee: newValue?.employee_id || "",
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
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>ชื่อ - นามสกุล </h6>
                                <input
                                  type="text"
                                  name="Name_Surname"
                                  value={formData?.Name_Surname}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รายละเอียดการชำระเงิน </h6>
                                <select
                                  value={formData?.Payment_details}
                                  onChange={handleProvinceChange}
                                  style={{ width: 300, padding: "8px" }}
                                >
                                  <option value="" disabled>
                                    - เลือกตำบล -
                                  </option>
                                  {paymentDetailsType.map((type) => (
                                    <option
                                      key={type.paydetails_id}
                                      value={type.paydetails_id}
                                    >
                                      {type.paydetails_type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            {formData?.Payment_details == 1 ? (
                              <div className="col-lg-3">
                                <div className="createFormInput">
                                  <h6>รายละเอียดธนาคาร </h6>
                                  <input
                                    type="text"
                                    name="Bank_details"
                                    value={formData.Bank_details}
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
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
                                <input
                                  type="text"
                                  name="Salary_baht"
                                  value={formData?.Salary_baht}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รวมโอที(ชั่วโมง) </h6>
                                <input
                                  type="text"
                                  name="Total_OT_hours"
                                  value={formData?.Total_OT_hours}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>เงินโอที(ชั่วโมง/บาท) </h6>
                                <input
                                  type="text"
                                  name="OT_pay"
                                  value={formData?.OT_pay}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-3">
                              <div className="createFormInput">
                                <h6>รวมโอทีทั้งหมด(บาท) </h6>
                                <input
                                  type="text"
                                  name="Total_OT_baht"
                                  value={formData?.Total_OT_baht}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>ค่าที่พักอาศัย(บาท)</h6>
                                <input
                                  type="text"
                                  name="Cost_of_accommodation"
                                  value={formData?.Cost_of_accommodation}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>เงินพิเศษ(บาท)</h6>
                                <input
                                  type="text"
                                  name="Special_money"
                                  value={formData?.Special_money}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-4">
                              <div className="createFormInput">
                                <h6>รวมรายการรับทั้งหมด(บาท)</h6>
                                <input
                                  type="text"
                                  name="Total_receipts"
                                  defaultValue={formData?.Total_receipts}
                                  // value={formData?.Total_receipts}
                                  onChange={handleChange}
                                />
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
                                <input
                                  type="text"
                                  name="Social_Security"
                                  value={formData?.Social_Security}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>รายการหักเงินอื่นๆ</h6>
                                <input
                                  type="text"
                                  name="Other_deduction_items"
                                  value={formData?.Other_deduction_items}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>ชำระเงินคืนบริษัท(บาท)</h6>
                                <input
                                  type="text"
                                  name="Repayment_to_the_company"
                                  value={formData?.Repayment_to_the_company}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>รวมรายการหักทั้งหมด(บาท)</h6>
                                <input
                                  type="text"
                                  name="Total_deductions"
                                  defaultValue={formData?.Total_deductions}
                                  // value={formData?.Total_deductions}
                                  onChange={handleChange}
                                />
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
                                <input
                                  type="text"
                                  name="Total_Receipt_Details"
                                  defaultValue={formData?.Total_Receipt_Details}
                                  // value={formData?.Total_Receipt_Details}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="createFormInput">
                                <h6>
                                  รายละเอียด หมายเหตุ(เงินพิเศษ / เงิกหัก){" "}
                                </h6>
                                <input
                                  type="text"
                                  name="Details_Notes"
                                  value={formData?.Details_Notes}
                                  onChange={handleChange}
                                />
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
                                        <input
                                          type="text"
                                          name="Sick_leave_leave_days1"
                                          value={
                                            formData?.Sick_leave_leave_days1
                                          }
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลาคงเหลือ</h6>
                                        <input
                                          type="text"
                                          name="Sick_leave_days_leave1"
                                          value={
                                            formData?.Sick_leave_days_leave1
                                          }
                                          onChange={handleChange}
                                        />
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
                                        <input
                                          type="text"
                                          name="Sick_leave_leave_days2"
                                          value={
                                            formData?.Sick_leave_leave_days2
                                          }
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput">
                                    <div className="parentSick">
                                      <div>
                                        <h6>จำนวนวันลาคงเหลือ</h6>
                                        <input
                                          type="text"
                                          name="Sick_leave_days_leave2"
                                          value={
                                            formData?.Sick_leave_days_leave2
                                          }
                                          onChange={handleChange}
                                        />
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
                                      <input
                                        type="text"
                                        name="Total"
                                        value={formData?.Total}
                                        onChange={handleChange}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="createFormInput parentSick">
                                    <div>
                                      <h6>ยอดคงเหลือ</h6>
                                      <input
                                        type="text"
                                        name="Balance"
                                        defaultValue={formData?.Balance}
                                        // value={formData?.Balance}
                                        onChange={handleChange}
                                      />
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
                <div
                  className="modal fade createModal"
                  id="exampleModalSlip"
                  tabIndex={-1}
                  aria-labelledby="exampleModalFull"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          เงินเดือน
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
                        <div className="row">
                          <div className="col-lg-4 createFormInput">
                            <input
                              type="month"
                              id="monthInput"
                              value={selectedMonth}
                              onChange={handleChange1}
                            />
                          </div>
                        </div>
                        <div className="table-responsive tableMain">
                          <table
                            className=" table table-striped"
                            style={{ width: "100%", marginTop: 10 }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "150px" }}>รหัสพนักงาน </th>
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
                                        {row.f_name} {row.f_name}
                                      </td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={selectedEmployees1.includes(
                                            row.id
                                          )}
                                          onChange={() =>
                                            handleCheckboxChange1(row.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          </table>
                          <div className="populatebBtn text-center">
                            <button
                              style={{ width: "150px" }}
                              onClick={handleGenerateSlip}
                            >
                              Generate Slip
                            </button>{" "}
                          </div>
                        </div>
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
                          <th>รหัสพนักงาน</th>
                          <th>ชื่อ - นามสกุล</th>
                          <th>ประจำเดือน </th>
                          <th>สถานะ </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentEntries.length > 0 ? (
                          currentEntries.map((row) => (
                            <tr>
                              <td>{row.employee_id}</td>
                              <td>{row.employee_name}</td>
                              <td>{row.month}</td>
                              <td>
                                {" "}
                                <label
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "10px",
                                  }}
                                  className="toggleSwitch large"
                                  onClick={() => console.log("Label clicked!")} // Example function
                                >
                                  <input
                                    onChange={() => setIsOn(!isOn)}
                                    type="checkbox"
                                    defaultChecked
                                  />
                                  <span>
                                    <span>OFF</span>
                                    <span>ON</span>
                                  </span>
                                  <a> </a>
                                </label>
                              </td>
                              <td>
                                <div className="editIcon">
                                  <button onClick={() => generatePDFSlip(row)}>
                                    <i className="mdi mdi-wallet-bifold"></i>
                                  </button>
                                  <button
                                    onClick={() =>
                                      generatePDF(row.employee_id, row.month)
                                    }
                                  >
                                    <i className="mdi mdi-note ps-2"></i>
                                  </button>

                                  <i
                                    type="button"
                                    className=" ps-2 mdi mdi-pencil"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModalEdit"
                                    onClick={() => defaultStateSet(row)}
                                  ></i>
                                  <button
                                    type="button"
                                    onClick={() => deleteSalary(row.id)}
                                  >
                                    <i className="mdi mdi-delete ps-2"></i>
                                  </button>
                                </div>
                                {/* edit  modal */}
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
                                          Salary Edit
                                        </h1>
                                        <button
                                          type="button"
                                          onClick={clearAllData}
                                          className="btn-close"
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        >
                                          <i className="mdi mdi-close"></i>
                                        </button>
                                      </div>
                                      <div className="modal-body">
                                        <form action="">
                                          <div className="row mb-2">
                                            <h5 className="text-start">
                                              รายละเอียดพนักงาน / Employee
                                              Details
                                            </h5>
                                          </div>
                                          <div className="row">
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>ประจำเดือน </h6>
                                                <input
                                                  type="month"
                                                  name="period"
                                                  value={formData?.period}
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>

                                            <div className="col-lg-3">
                                              <div className="createFormInput autocompleteField">
                                                <h6>พนักงาน</h6>

                                                {/* <Autocomplete
                                                  options={
                                                    allEmployeeList || []
                                                  } // Ensure options is always an array
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
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
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
                                                /> */}
                                                <Autocomplete
                                                  options={
                                                    allEmployeeList || []
                                                  } // Ensure options is always an array
                                                  getOptionLabel={(option) =>
                                                    option?.employee_id &&
                                                    option?.full_name
                                                      ? `${option.employee_id}: ${option.full_name}` // Display both employee_id and full name
                                                      : ""
                                                  } // Safely display the label
                                                  value={
                                                    allEmployeeList?.find(
                                                      (v) =>
                                                        v.employee_id ===
                                                        Number(
                                                          formData?.employee
                                                        ) // Convert to number if necessary
                                                    ) || null
                                                  }
                                                  onChange={(
                                                    event,
                                                    newValue
                                                  ) => {
                                                    setFormData({
                                                      ...formData,
                                                      employee:
                                                        newValue?.employee_id ||
                                                        "", // Update employee_id or clear if null
                                                    });
                                                  }}
                                                  isOptionEqualToValue={
                                                    (option, value) =>
                                                      option.employee_id ===
                                                      value?.employee_id // Compare by employee_id for equality
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
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>ชื่อ - นามสกุล </h6>
                                                <input
                                                  type="text"
                                                  name="Name_Surname"
                                                  value={formData?.Name_Surname}
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>รายละเอียดการชำระเงิน </h6>
                                                <select
                                                  value={
                                                    formData?.Payment_details
                                                  }
                                                  onChange={
                                                    handleProvinceChange
                                                  }
                                                  style={{
                                                    width: 300,
                                                    padding: "8px",
                                                  }}
                                                >
                                                  <option value="" disabled>
                                                    - เลือกตำบล -
                                                  </option>
                                                  {paymentDetailsType.map(
                                                    (type) => (
                                                      <option
                                                        key={type.paydetails_id}
                                                        value={
                                                          type.paydetails_id
                                                        }
                                                      >
                                                        {type.paydetails_type}
                                                      </option>
                                                    )
                                                  )}
                                                </select>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="row">
                                            {formData?.Payment_details == 1 ? (
                                              <div className="col-lg-3">
                                                <div className="createFormInput">
                                                  <h6>รายละเอียดธนาคาร </h6>
                                                  <input
                                                    type="text"
                                                    name="Bank_details"
                                                    value={
                                                      formData?.Bank_details
                                                    }
                                                    onChange={handleChange}
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              ""
                                            )}
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
                                                <input
                                                  type="text"
                                                  name="Salary_baht"
                                                  value={formData?.Salary_baht}
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>รวมโอที(ชั่วโมง) </h6>
                                                <input
                                                  type="text"
                                                  name="Total_OT_hours"
                                                  value={
                                                    formData?.Total_OT_hours
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>เงินโอที(ชั่วโมง/บาท) </h6>
                                                <input
                                                  type="text"
                                                  name="OT_pay"
                                                  value={formData?.OT_pay}
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-3">
                                              <div className="createFormInput">
                                                <h6>รวมโอทีทั้งหมด(บาท) </h6>
                                                <input
                                                  type="text"
                                                  name="Total_OT_baht"
                                                  value={
                                                    formData?.Total_OT_baht
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-4">
                                              <div className="createFormInput">
                                                <h6>ค่าที่พักอาศัย(บาท)</h6>
                                                <input
                                                  type="text"
                                                  name="Cost_of_accommodation"
                                                  value={
                                                    formData?.Cost_of_accommodation
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-4">
                                              <div className="createFormInput">
                                                <h6>เงินพิเศษ(บาท)</h6>
                                                <input
                                                  type="text"
                                                  name="Special_money"
                                                  value={
                                                    formData?.Special_money
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-4">
                                              <div className="createFormInput">
                                                <h6>
                                                  รวมรายการรับทั้งหมด(บาท)
                                                </h6>
                                                <input
                                                  type="text"
                                                  name="Total_receipts"
                                                  defaultValue={
                                                    formData?.Total_receipts
                                                  }
                                                  // value={
                                                  //   formData?.Total_receipts
                                                  // }
                                                  onChange={handleChange}
                                                />
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
                                                <input
                                                  type="text"
                                                  name="Social_Security"
                                                  value={
                                                    formData?.Social_Security
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <div className="createFormInput">
                                                <h6>รายการหักเงินอื่นๆ</h6>
                                                <input
                                                  type="text"
                                                  name="Other_deduction_items"
                                                  value={
                                                    formData?.Other_deduction_items
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <div className="createFormInput">
                                                <h6>ชำระเงินคืนบริษัท(บาท)</h6>
                                                <input
                                                  type="text"
                                                  name="Repayment_to_the_company"
                                                  value={
                                                    formData?.Repayment_to_the_company
                                                  }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <div className="createFormInput">
                                                <h6>
                                                  รวมรายการหักทั้งหมด(บาท)
                                                </h6>
                                                <input
                                                  type="text"
                                                  name="Total_deductions"
                                                  defaultValue={
                                                    formData?.Total_deductions
                                                  }
                                                  // value={
                                                  //   formData?.Total_deductions
                                                  // }
                                                  onChange={handleChange}
                                                />
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
                                                <input
                                                  type="text"
                                                  name="Total_Receipt_Details"
                                                  defaultValue={
                                                    formData?.Total_Receipt_Details
                                                  }
                                                  // value={
                                                  //   formData?.Total_Receipt_Details
                                                  // }
                                                  onChange={handleChange}
                                                />
                                              </div>
                                            </div>
                                            <div className="col-lg-6">
                                              <div className="createFormInput">
                                                <h6>
                                                  รายละเอียด หมายเหตุ(เงินพิเศษ
                                                  / เงิกหัก){" "}
                                                </h6>
                                                <input
                                                  type="text"
                                                  name="Details_Notes"
                                                  value={
                                                    formData?.Details_Notes
                                                  }
                                                  onChange={handleChange}
                                                />
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
                                                        <input
                                                          type="text"
                                                          name="Sick_leave_leave_days1"
                                                          value={
                                                            formData?.Sick_leave_leave_days1
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div className="createFormInput">
                                                    <div className="parentSick">
                                                      <div>
                                                        <h6>
                                                          จำนวนวันลาคงเหลือ
                                                        </h6>
                                                        <input
                                                          type="text"
                                                          name="Sick_leave_days_leave1"
                                                          value={
                                                            formData?.Sick_leave_days_leave1
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="row mt-2">
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
                                                        <input
                                                          type="text"
                                                          name="Sick_leave_leave_days2"
                                                          value={
                                                            formData?.Sick_leave_leave_days2
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div className="createFormInput">
                                                    <div className="parentSick">
                                                      <div>
                                                        <h6>
                                                          จำนวนวันลาคงเหลือ
                                                        </h6>
                                                        <input
                                                          type="text"
                                                          name="Sick_leave_days_leave2"
                                                          value={
                                                            formData?.Sick_leave_days_leave2
                                                          }
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
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
                                                      <input
                                                        type="text"
                                                        name="Total"
                                                        value={formData?.Total}
                                                        onChange={handleChange}
                                                      />
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="col-lg-6">
                                                  <div className="createFormInput parentSick">
                                                    <div>
                                                      <h6>ยอดคงเหลือ</h6>
                                                      <input
                                                        type="text"
                                                        name="Balance"
                                                        defaultValue={
                                                          formData?.Balance
                                                        }
                                                        // value={
                                                        //   formData?.Balance
                                                        // }
                                                        onChange={handleChange}
                                                      />
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
                                          onClick={updateSubmitData}
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

export default Salary;
