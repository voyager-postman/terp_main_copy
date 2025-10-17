import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import { useTranslation } from "react-i18next";

const Hourly = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const getLocationData = () => {
    axios
      .get(`${API_BASE_URL}/getAllWage`)
      .then((response) => {
        setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLocationData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: t("id"),
        id: "index",
        accessor: (_row, i) => _row.wages_id,
      },
      {
        Header: t("from"),
        accessor: "from_time",
      },

      {
        Header: t("to"),
        accessor: "to_time",
      },

      {
        Header: t("name"),
        accessor: "shift_name_en",
      },
      {
        Header: t("monday"),
        accessor: "Monday",
      },
      {
        Header: t("tuesday"),
        accessor: "Tuesday",
      },
      {
        Header: t("wednesday"),
        accessor: "Wednesday",
      },
      {
        Header: t("thursday"),
        accessor: "Thursday",
      },
      {
        Header: t("friday"),
        accessor: "Friday",
      },
      {
        Header: t("saturday"),
        accessor: "Saturday",
      },
      {
        Header: t("sunday"),
        accessor: "Sunday",
      },

      {
        Header: t("wage"),
        accessor: "wage",
      },

      {
        Header: t("actions"),
        accessor: (a) => (
          <Link to="/updateHourly" state={{ from: a }}>
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
      title={t("wageManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/addHourly")}
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

export default Hourly;
