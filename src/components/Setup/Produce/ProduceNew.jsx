import React, { useState, useEffect } from "react";
import BarCode from "react-barcode";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../../card";
import { TableView } from "../../table";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url";
import { toast } from "react-toastify";

const ProduceNew = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getData = () => {
    axios.get(`${API_BASE_URL}/getAllProduceItem`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getData();
  }, []);

  const updateAirportStatus = (airportId) => {
    const request = {
      produceId: airportId,
    };

    axios
      .post(`${API_BASE_URL}/UpdateStatusProcedure`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // const { data } = useQuery("getAllProduceItem")
  const [isOn, setIsOn] = useState(true);

  const columns = React.useMemo(
    () => [
      {
        Header: "Code",
        accessor: (a) => (
          <BarCode width={0.8} height={30} value={a.Inventory_code} />
        ),
      },
      {
        Header: "Name",
        accessor: (a) => a.Name_EN,
      },
      {
        Header: "Status",
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
              onChange={() => updateAirportStatus(a.ID)}
              type="checkbox"
              defaultChecked={a.Available == "1" ? true : false}
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
        Header: "Actions",
        accessor: (a) => (
          <Link to="/updateProduce" state={{ from: a }}>
            <i
              i
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
    ],
    []
  );
  return (
    <>
      <Card
        title={"Produce Items"}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/produceCreateNew")}
            className="btn button btn-info"
          >
            Create
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>
    </>
  );
};

export default ProduceNew;
