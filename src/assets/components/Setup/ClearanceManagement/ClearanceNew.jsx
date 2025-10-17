import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import { useTranslation } from "react-i18next";

const ClearanceNew = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [status, setStatus] = useState("on");
  const [isOn, setIsOn] = useState(true);

  const getClearanceData = () => {
    axios
      .get(`${API_BASE_URL}/Clearance_EN`)
      .then((res) => {
        console.log(res);

        const { head, data, title } = res.data;
        // Remove unwanted columns from table (Order_ID, Status_value)
        const columnsToHide = ["ID"];

        // Create dynamic columns excluding hidden ones
        const dynamicColumns = Object.keys(head)
          .filter((key) => !columnsToHide.includes(key))
          .map((key) => ({
            Header: t(head[key]), // Translate header if needed
            accessor: key,
          }));
        dynamicColumns.push({
          Header: t("status"),
          accessor: (a) => (
            <label
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "6px",
              }}
              className="toggleSwitch large"
              onclick=""
            >
              <input
                onChange={() => setIsOn(!isOn)}
                onClick={() => updateStatus(a.clearance_id)}
                type="checkbox"
                checked={a.status == "on" ? true : false}
              />
              <span>
                <span>{t("off")}</span>
                <span>{t("on")}</span>
              </span>
              <a></a>
            </label>
          ),
        });
        dynamicColumns.push({
          Header: t("actions"),

          accessor: (a) => (
            <div><Link to="/updateClearanceNew" state={{ from: a }}>
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
              <button
                type="button"
                onClick={() => deleteDetails(item.pod_id)}
              >
                <i className="mdi mdi-delete text-2xl" />
              </button></div>

          ),
        });

        setColumns(dynamicColumns);
        setData(data || []);
      })
      .catch((err) => {
        console.error("Error fetching quotations:", err);
      });
  };
  useEffect(() => {
    getClearanceData();
  }, [i18n]);
  const updateStatus = (clearance_id) => {
    axios
      .post(`${API_BASE_URL}/updateClearanceStatus`, {
        clearance_id: clearance_id,
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getClearanceData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card
      title={t("clearance_management")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createClearanceNew")}
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

export default ClearanceNew;
