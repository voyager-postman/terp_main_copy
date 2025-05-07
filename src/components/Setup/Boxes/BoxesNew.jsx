import axios from "axios";
import React, { useEffect, useState } from "react";
import BarCode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";

const BoxesNew = () => {
  const navigate = useNavigate();
  const [isOn, setIsOn] = useState(true);

  const [data, setData] = useState([]);

  const getBoxData = () => {
    axios
      .get(`${API_BASE_URL}/getAllBoxes`)
      .then((response) => {
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return;
        }
      });
  };
  const updateAirportStatus = (airportId) => {
    const request = {
      boxId: airportId,
    };

    axios
      .post(`${API_BASE_URL}/UpdateStatusBox`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getBoxData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBoxData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: "Code",
        accessor: (a) => (
          <div>
            <BarCode width={0.8} height={30} value={a.Inventory_code} />
          </div>
        ),
      },

      {
        Header: "Name",
        accessor: "Name_EN",
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
        accessor: (a) => [
          <Link to="/updateBox" state={{ from: a }}>
            <i
              className="mdi mdi-pencil"
              style={{
                color: "#203764",
                fontSize: "30px",
                marginTop: "10px",
                paddingBottom: "8px",
              }}
            />
          </Link>,
        
        ],
      },
    ],
    []
  );

  return (
    <>
      <Card
        title="Boxes Management"
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createBoxNew")}
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

export default BoxesNew;
