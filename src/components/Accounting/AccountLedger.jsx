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
  const navigate = useNavigate();

  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/AccountingLedger`)
      .then((response) => {
        setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
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
  const columns = useMemo(
    () => [
      {
        Header: t("AL_Date"),
        accessor: (row) => {
          const date = new Date(row.AL_Date);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear()).slice(-2); // last 2 digits
          return `${day}-${month}-${year}`; // dd-mm-yy
        },
      },
      {
        Header: t("AL_Number"),
        accessor: (a) => <div>{a.AL_Number}</div>,
      },

      {
        Header: t("Account_No"),
        accessor: (a) => <div>{a.Account_No}</div>,
      },

      {
        Header: t("client"),
        accessor: (a) => <div>{a.client_name}</div>,
      },
      {
        Header: t("consignee"),
        accessor: (a) => <div>{a.consignee_name}</div>,
      },
      {
        Header: t("vendor"),
        accessor: (a) => <div>{a.vendor_name}</div>,
      },
      {
        Header: t("Debit"),
        accessor: (a) => (
          <div style={{ textAlign: "right" }}>
            {formatTwoDecimal.format(a.Debit)}
          </div>
        ),
      },
      {
        Header:  t("Transaction_Description"),
        accessor: (a) => <div>{a.Transaction_Description}</div>,
      },

      {
        Header: t("actions"),
        accessor: (a) => (
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
        ),
      },

      // {
      //   Header: "Salary",
      //   accessor: (a) => <>{"10000000"}</>,
      // },
    ],
    [t]
  );

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
