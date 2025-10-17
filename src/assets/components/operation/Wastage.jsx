import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { useTranslation } from "react-i18next";

const Wastage = () => {
  const { t, i18n } = useTranslation("global");
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const navigate = useNavigate();

  const getWastage = () => {
    axios
      .get(`${API_BASE_URL}/getWastage`)
      .then((response) => {
        setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getWastage();
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
          getWastage();
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
        Header: t("poCode"),
        accessor: "PODCODE",
      },
      {
        Header: t("vendorName"),
        accessor: "Vendor_Name",
      },
      {
        Header: t("nameEn"),
        accessor: "Name_EN",
      },

      {
        Header: t("date"),
        accessor: (row) => {
          const date = new Date(row.Date);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear()).slice(-2); // last 2 digits
          return `${day}-${month}-${year}`; // dd-mm-yy
        },
      },
      {
        Header: t("creates"),
        accessor: (row) => formatTwoDecimal.format(row.Crates),
        Cell: ({ value }) => (
          <div style={{ textAlign: "right", width: "100%" }}>{value}</div>
        ),
      },
      {
        Header: t("quantity"),
        accessor: (row) => formatTwoDecimal.format(row.Quantity),
        Cell: ({ value }) => (
          <div style={{ textAlign: "right", width: "100%" }}>{value}</div>
        ),
      },
      {
        Header: t("unit"),
        accessor: (row) => <div>{row.Unit}</div>,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center", width: "100%" }}>{value}</div>
        ),
      },
      // {
      //   Header: "Cost",
      //   accessor: () => formatTwoDecimal.format(3242.324),
      //   Cell: ({ value }) => (
      //     <div style={{ textAlign: "right", width: "100%" }}>{value}</div>
      //   ),
      // },
      {
        Header: t("qtyPerCrate"),
        accessor: "Qty/Crate",
      },
      // {
      //   Header: "Sorting ID",
      //   accessor: "sorting_id",
      // },
      {
        Header: t("status"),
        accessor: (a) => (
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
            className="toggleSwitch large"
            onclick=""
          >
            <input
              onChange={() => updateAirportStatus(a.port_id)}
              type="checkbox"
              defaultChecked={a.status == "on" ? true : false}
            />
            <span>
              <span>OFF</span>
              <span>ON</span>
            </span>
            <a></a>
          </label>
        ),
      },
      {
        Header: t("actions"),
        accessor: (row) => (
          <Link to="/update_ean" state={{ from: row }}>
            <i
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
    ],
    [t]
  );

  return (
    <Card
      title={t("wastageManagement")}
      endElement={
        <button
          type="button"
          //   onClick={() => navigate("/add_ean")}
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

export default Wastage;
