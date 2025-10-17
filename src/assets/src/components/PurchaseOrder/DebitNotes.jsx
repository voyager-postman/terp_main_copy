import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import MySwal from "../../swal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const DebitNotes = () => {
  const [t] = useTranslation("global");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const listClaim = () => {
    const lang = localStorage.getItem("language");
    const langValue = lang === "en" ? 0 : 1;

    axios
      .post(`${API_BASE_URL}/DebitNoteView`, {
        LANG: langValue,
      })
      .then((response) => {
        const { data: rows = [], head = {} } = response.data;

        // Step 1: Create dynamic columns from head
        const generatedColumns = Object.entries(head).map(([key, label]) => ({
          Header: t(label || key), // fallback to key if label is empty
          accessor: key,
        }));

        // Step 2: Add actions column
        generatedColumns.push({
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
                    <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
                  </svg>
                </Link>
                <button type="button" onClick={() => deleteOrder(a.ID)}>
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
        });

        setColumns(generatedColumns);
        setData(rows);
      })
      .catch((error) => {
        console.error("Error fetching Debit Note:", error);
        toast.error(t("genericError"));
      });
  };
  // const listClaim = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE_URL}/getClaim`);
  //     const { data: rows = [], head = {} } = res.data;

  //     // Step 1: Create dynamic columns from head
  //     const generatedColumns = Object.entries(head).map(
  //       ([key, label], index) => ({
  //         Header: t(label), // Support translation
  //         accessor: `Col${index + 1}`,
  //       })
  //     );

  //     // Step 2: Add actions column
  //     generatedColumns.push({
  //       Header: t("actions"),
  //       accessor: "actions",
  //       Cell: ({ row }) => {
  //         const a = row.original;
  //         return (
  //           <>
  //             <Link
  //               className="SvgAnchor"
  //               to="/claimPdf"
  //               state={{ from: { ...a } }}
  //             >
  //               <svg
  //                 className="SvgQuo"
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 viewBox="0 0 24 24"
  //               >
  //                 <title>invoice-text-check-outline</title>
  //                 <path d="M12 20L13.3 20.86C13.1 20.28 13 19.65 13 19C13 18.76 13 18.5 13.04 18.29L12 17.6L9 19.6L6 17.6L5 18.26V5H19V13C19.7 13 20.37 13.12 21 13.34V3H3V22L6 20L9 22L12 20M17 9V7H7V9H17M15 13V11H7V13H15M15.5 19L18.25 22L23 17.23L21.84 15.82L18.25 19.41L16.66 17.82L15.5 19Z"></path>
  //               </svg>
  //             </Link>
  //             <button type="button" onClick={() => deleteOrder(a.ID)}>
  //               <i
  //                 className="mdi mdi-delete"
  //                 style={{
  //                   width: "20px",
  //                   color: "#203764",
  //                   fontSize: "22px",
  //                   marginTop: "10px",
  //                 }}
  //               />
  //             </button>
  //           </>
  //         );
  //       },
  //     });

  //     setColumns(generatedColumns);
  //     setData(rows);
  //   } catch (error) {
  //     console.error("Error fetching claims:", error);
  //     toast.error(t("genericError"));
  //   }
  // };

  useEffect(() => {
    listClaim();
  }, []);

  const deleteOrder = async (id) => {
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("delete"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/deleteDebitNotes`,
            {
              Debit_Note_ID: id,
            }
          );
          listClaim();
          toast.success(response.data.messageEN);
          toast.success(response.data.messageTH);
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  const navigate = useNavigate();
  return (
    <div>
      <Card
        title={t("debitNote")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createDebit")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>
    </div>
  );
};

export default DebitNotes;
