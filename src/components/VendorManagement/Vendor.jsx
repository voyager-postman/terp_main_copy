 // import axios from "axios"
import { useMemo } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import axios from "../../Url/Api";
import { useTranslation } from "react-i18next";
const Vendor = () => {
  const [t, i18n] = useTranslation("global");
  const { data } = useQuery("getAllVendor");
  const navigate = useNavigate();
  const updateVendorStatus = (id) => {
    const request = {
      vendor_id: id,
    };
 
    axios
      .post(`${API_BASE_URL}/updateVendorStatus`, request)
      .then((response) => {
        toast[response.data.success ? "success" : "error"](
          response.data.message,
          {
            autoClose: 1000,
            theme: "colored",
          }
        );
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error(t("networkError"), {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      })
      .finally(() => {
        // setLoading(false)
      });
  };
 const columns = useMemo(
  () => [
    {
      Header: t("id"),
      id: "index",
      accessor: (_row, i) => _row.vendor_id,
    },
    {
      Header: t("name"),
      accessor: (a) => a.name,
    },
    {
      Header: t("phone"),
      accessor: (a) => a.phone || <i className="text-gray-400">N/A</i>,
    },
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
        >
          <input
            onChange={() => updateVendorStatus(a.ID)}
            type="checkbox"
            defaultChecked={a.status === "on"}
          />
          <span>
            <span>{t("off")}</span>
            <span>{t("on")}</span>
          </span>
          <a></a>
        </label>
      ),
    },
    {
      Header: t("actions"),
      accessor: (a) => (
        <Link to="/update_vendor" state={{ from: a }}>
          <i
            className="mdi mdi-pencil"
            style={{
              width: "20px",
              color: "#203764",
              marginTop: "10px",
              paddingTop: "8px",
              fontSize: "22px",
            }}
          />
        </Link>
      ),
    },
    {
      Header:t("lineId"),
      accessor: (a) => a.line_id || <i className="text-gray-400">N/A</i>,
    },
  ],
  [t] // <-- Add this!
);
 
 
  return (
    <>
      <Card
        title={t("vendorManagement")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/add_vendor")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <TableView columns={columns} data={data || []} />
      </Card>
    </>
  );
};
 
export default Vendor;