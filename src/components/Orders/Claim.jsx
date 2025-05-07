import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import MySwal from "../../swal";
import { toast } from "react-toastify";

const Claim = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const listClaim = () => {
    axios.get(`${API_BASE_URL}/getClaim`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    listClaim();
  }, []);
  // const { data } = useQuery("getViewToReceving");
  console.log(data);
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
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
          const response = await axios.post(`${API_BASE_URL}/DeleteClaim`, {
            claim_id: id,
          });
          console.log(response);
          listClaim();
          toast.success(response.data.messageEN);
          toast.success(response.data.messageTH);
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "Claim Date",
        accessor: "Claim_date",
        Cell: ({ value }) => formatDate(value), // Use the formatting function here
      },
      {
        Header: "Claim Number",
        accessor: "Claim_Number",
      },
      {
        Header: "Client",
        accessor: "client_name",
      },

      {
        Header: "Consignee",
        accessor: "consignee_name",
      },
      {
        Header: "Invoice",
        accessor: "Invoice_number",
      },
      {
        Header: "Claimed Amount",
        accessor: "Claimed_amount",
      },
      {
        Header: "Currency",
        accessor: "fx_currency",
      },
      {
        Header: "THB Claim",
        accessor: "THB_Claim",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link
              className="SvgAnchor"
              to="/claimPdf"
              state={{ from: { ...a } }}
            >
              <svg
                className="SvgQuo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>invoice-text-check-outline</title>
                <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
              </svg>
            </Link>
            <button type="button" onClick={() => deleteOrder(a.Claim_id)}>
              <i
                className="mdi mdi-delete "
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </button>
          </>
        ),
      },
    ],
    []
  );
  return (
    <Card title="Claim">
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default Claim;
