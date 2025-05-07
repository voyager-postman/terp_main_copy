import { useState,useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "../../card";
import { TableView } from "../table";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";

export const EANAvailable = () => {
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
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Quantity Available",
        accessor: "qty_available",
      },
      {
        Header: "Average Weight(g)",
        accessor: "Average Weight(g)",
      },
      {
        Header: "Average Cost",
        accessor: "avg_cost",
      },
      {
        Header: "Actions",
        accessor: "id", // or any unique field you have
        Cell: ({ row }) => (
          <div className="editIcon gap-2">
            {/* You can add real buttons or icons here */}
            Action
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card title={"EAN Available"}>
      <TableView columns={columns} data={data} />
    </Card>
  );
};
