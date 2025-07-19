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
import { useTranslation } from "react-i18next";

const DebitNotes = () => {
  const [t, i18n] = useTranslation("global");
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
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("delete"),
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
          toast.error(t("genericError"));
        }
      }
    });
  };

   const columns = React.useMemo(
    () => [
      {
        Header: t("claimDate"),
        accessor: "Claim_date",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: t("claimNumber"),
        accessor: "Claim_Number",
      },
      {
        Header: t("vendor"),
        accessor: "client_name",
      },
      {
        Header: t("invoice"),
        accessor: "Invoice_number",
      },
      {
        Header: t("claimedAmount"),
        accessor: "Claimed_amount",
      },
      {
        Header: t("currency"),
        accessor: "fx_currency",
      },
      {
        Header: t("thbClaim"),
        accessor: "THB_Claim",
      },
      {
        Header: t("actions"),
        accessor: "actions",
        Cell: ({ row }) => {
          const a = row.original;
          return (
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
                  <path d="..." />
                </svg>
              </Link>
              <button type="button" onClick={() => deleteOrder(a.Claim_id)}>
                <i
                  className="mdi mdi-delete"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
            </>
          );
        },
      },
    ],
    [t]
  );
  return (
    <div>
      <Card title={t("debitNote")}>
        <TableView columns={columns} data={data} />
      </Card>
    </div>
  );
};

export default DebitNotes;
