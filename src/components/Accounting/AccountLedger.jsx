import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { useTranslation } from "react-i18next";

const AccountLedger = () => {
  const { t, i18n } = useTranslation("global");

  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const [columns, setColumns] = useState([]);

  const navigate = useNavigate();

  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/AccountingLedger`)
      .then((response) => {
        const { data: data = [], header = {} } = response.data;

        // Step 1: Create dynamic columns from head
        const generatedColumns = Object.entries(header)
          .filter(
            ([key]) => key !== "ID" && key !== "Payment_Status" && key !== "RID"
          )
          .map(([key, label]) => ({
            Header: t(label || key),
            accessor: key,
            Cell: ({ value }) => {
              // ✅ Format only Col1 (date column)
              if (key === "Col1" && value) {
                return new Date(value).toISOString().split("T")[0]; // "2025-08-17"
              }
              return value ?? ""; // fallback for null values
            },
          }));

        // Step 2: Add actions column
        generatedColumns.push({
          Header: t("actions"),
          accessor: "actions",
          Cell: ({ row }) => {
            const a = row.original;
            return (
              <>
                <Link to="/update_ean" state={{ from: a }}>
                  <i
                    i
                    className="mdi mdi-pencil"
                    style={{
                      width: "20px",
                      color: "#203764",
                      fontSize: "22px",
                      marginTop: "10px",
                    }}
                  />
                </Link>
              </>
            );
          },
        });

        setColumns(generatedColumns);
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching Debit Note:", error);
        toast.error(t("genericError"));
      });
  };
  useEffect(() => {
    getEanData();
  }, []);

  const updateEanStatus = (eanID) => {
    const request = {
      ean_id: eanID,
    };

    axios
      .post(`${API_BASE_URL}/eanStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success(t("statusUpdated"), {
            autoClose: 1000,
            theme: "colored",
          });
          getEanData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatTwoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: t("AL_Date"),
  //       accessor: (row) => {
  //         const date = new Date(row.AL_Date);
  //         const day = String(date.getDate()).padStart(2, "0");
  //         const month = String(date.getMonth() + 1).padStart(2, "0");
  //         const year = String(date.getFullYear()).slice(-2); // last 2 digits
  //         return `${day}-${month}-${year}`; // dd-mm-yy
  //       },
  //     },
  //     {
  //       Header: t("AL_Number"),
  //       accessor: (a) => <div>{a.AL_Number}</div>,
  //     },

  //     {
  //       Header: t("Account_No"),
  //       accessor: (a) => <div>{a.Account_No}</div>,
  //     },

  //     {
  //       Header: t("client"),
  //       accessor: (a) => <div>{a.client_name}</div>,
  //     },
  //     {
  //       Header: t("consignee"),
  //       accessor: (a) => <div>{a.consignee_name}</div>,
  //     },
  //     {
  //       Header: t("vendor"),
  //       accessor: (a) => <div>{a.vendor_name}</div>,
  //     },
  //     {
  //       Header: t("Debit"),
  //       accessor: (a) => (
  //         <div style={{ textAlign: "right" }}>
  //           {formatTwoDecimal.format(a.Debit)}
  //         </div>
  //       ),
  //     },
  //     {
  //       Header:  t("Transaction_Description"),
  //       accessor: (a) => <div>{a.Transaction_Description}</div>,
  //     },

  //     {
  //       Header: t("actions"),
  //       accessor: (a) => (
  //         <Link to="/update_ean" state={{ from: a }}>
  //           <i
  //             i
  //             className="mdi mdi-pencil"
  //             style={{
  //               width: "20px",
  //               color: "#203764",
  //               fontSize: "22px",
  //               marginTop: "10px",
  //             }}
  //           />
  //         </Link>
  //       ),
  //     },

  //   ],
  //   [t]
  // );

  return (
    <Card
      title={t("AccountingLedgerManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_ean")}
          className="btn button btn-info"
        >
          {t("create")}
        </button>
      }
    >
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default AccountLedger;
