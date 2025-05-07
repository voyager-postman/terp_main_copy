import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MySwal from "../../swal";
const Quotation = () => {
  const navigate = useNavigate();
  const loadingModal = MySwal.mixin({
    title: "Loading...",
    didOpen: () => {
      MySwal.showLoading();
    },
    showCancelButton: false,
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const getAllQuotation = () => {
    axios.get(`${API_BASE_URL}/getAllQuotation`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getAllQuotation();
  }, []);
  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/getAllQuotation`, {
        params: {
          status, // This will pass the selected status value
        },
      })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  // Optionally call the API on component mount or when the status changes
  useEffect(() => {
    if (status !== "") {
      orderData1();
    }
  }, [status]);
  const confirmQuotation = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/confirmQuotation`, { quote_id: id });
      toast.success("Quotation confirmed successfully");
    } catch (e) {
      toast.error("Something went wrong");
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
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/deleteQuotation`, {
            quotation_id: id,
          });
          if (response.data.success === true) {
            console.log("API response:", response);
            toast.success("Quotation deleted successfully");
            getAllQuotation();
          } else {
            console.log("API response:", response);
            toast.success(response.data.message.Message_EN);
            getAllQuotation();
          }
        } catch (e) {
          console.error("API call error:", e);
          toast.error("Something went wrong");
        }
      }
    });
  };
  const expireQoutation = async (quotation_id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/ExpireQuotations`, {
        quotationId: quotation_id,
      });
      console.log("API response:", response);
      getAllQuotation();
      toast.success("Quotation Expired  successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      toast.error("Failed to Quotation Expired  ");
    }
  };
  const handleEditClick = async (quotation_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/copyQuotation`, {
        quotation_id: quotation_id,
        user_id: localStorage.getItem("id"),
        // Other data you may need to pass
      });
      console.log("API response:", response);
      loadingModal.close();
      getAllQuotation();
      toast.success("Quotation Copy successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Quotation Copy");
    }
  };
  const quotationConfirmation = async (quotation_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/QuotationConfirmation`,
        {
          quotation_id: quotation_id,
          user_id: localStorage.getItem("id"),
          // Other data you may need to pass
        }
      );
      console.log("API response:", response);
      loadingModal.close();
      getAllQuotation();
      toast.success("Quotation Confirmation successfully");
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error("Failed to Quotation Confirmation");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Number",
        accessor: "Quotation_number",
      },
      {
        Header: "Client Name",
        accessor: "client_name",
      },
      {
        Header: "Destination port ",
        accessor: "port_name",
      },
      {
        Header: "Consignee Name",
        accessor: "consignee_name",
      },
      {
        Header: "Location",
        accessor: "location_name",
      },
      {
        Header: "Load date",
        accessor: "load_Before_date",
        // accessor: (a) => {
        //   return a?.load_Before_date
        //     ? new Date(a?.load_Before_date).toLocaleDateString()
        //     : "NA";
        // },
      },

      {
        Header: "Status",
        accessor: (a) => ({ 2: "Confirmed" }[a.Status] || "Pending"),
      },
      {
        // {(+a.Status === 1 || +a.Status === 2) && (
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon">
            <Link to="/quotationview" state={{ from: { ...a } }}>
              <i className="mdi mdi-eye" />
            </Link>
            {+a.Status === 0 && (
              <Link to="/updateQutation" state={{ from: { ...a } }}>
                <i className="mdi mdi-pencil" />
              </Link>
            )}
            <Link
              className="SvgAnchor"
              to="/quotationpdf"
              state={{ from: { ...a } }}
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>Quotation</title>
                <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8V21C8 21.6 8.4 22 9 22H9.5C9.7 22 10 21.9 10.2 21.7L13.9 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M11 13H7V8.8L8.3 6H10.3L8.9 9H11V13M17 13H13V8.8L14.3 6H16.3L14.9 9H17V13Z"></path>
              </svg>
            </Link>
            {+a.Status !== 2 && (
              <Link
                className="SvgAnchor"
                to="/quotationproforma"
                state={{ from: { ...a } }}
              >
                <i className="fi fi-sr-square-p" />
              </Link>
            )}
            <button
              type="button"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
              onClick={() => handleEditClick(a.Quotation_ID)}
            >
              <i className="mdi mdi-content-copy" />
            </button>

            {(+a.Status === 0 || +a.Status === 1) && (
              <button
                type="button"
                onClick={() => quotationConfirmation(a.Quotation_ID)}
              >
                <i className="mdi mdi-check-circle" />
              </button>
            )}
            {+a.Status == 0 && (
              <button
                type="button"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
                onClick={() => deleteOrder(a.Quotation_ID)}
              >
                <i className="mdi mdi-delete " />
              </button>
            )}
            {+a.Status == 1 && (
              <button
                type="button"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
                onClick={() => expireQoutation(a.Quotation_ID)}
              >
                <i className="mdi mdi-clock-alert" />
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card
      title="Quotation Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createQutation")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <Box sx={{ minWidth: 120 }} className="selectActive">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="4">All</MenuItem>
            <MenuItem value="0">Active</MenuItem>
            <MenuItem value="1">Used </MenuItem>
            <MenuItem value="2">Expired </MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default Quotation;
