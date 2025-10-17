import { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "../../card";
import { TableView } from "../table";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { useTranslation } from "react-i18next";

export const EANAvailable = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const getEanAvailableList = () => {
    axios.get(`${API_BASE_URL}/getEanAvailable`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getEanAvailableList();
  }, []);
  const columns = useMemo(
    () => [
      {
        Header: t("name"),
        accessor: "name",
      },
      {
        Header: t("brand"),
        accessor: "Brand_Name",
      },
      {
        Header: t("quantityAvailable"),
        accessor: "Available_EAN",
      },
      {
        Header: t("averageWeightG"),
        accessor: "Average Weight(g)",
      },
      {
        Header: t("averageCost"),
        accessor: "avg_cost",
      },
      {
        Header: t("actions"),
        accessor: "id", // or any unique field you have
        Cell: ({ row }) => (
          <div className="editIcon gap-2">
            {/* You can add real buttons or icons here */}
            {t("poNumber")} Action
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <Card title={t("EAN_Available")
    }>
      <TableView columns={columns} data={data} />
    </Card >
  );
};
