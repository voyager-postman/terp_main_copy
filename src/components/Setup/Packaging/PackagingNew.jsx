import axios from "axios";
import React, { useEffect, useState } from "react";
import BarCode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";

const PackagingNew = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOn, setIsON] = useState(true);
  const updateAirportStatus = (airportId) => {
		const request = {
			packagingId: airportId,
		}

		axios
			.post(`${API_BASE_URL}/UpdateStatuspackaging`, request)
			.then((response) => {
				if (response.data.success == true) {
					toast.success(response.data.message, {
						autoClose: 1000,
						theme: "colored",
					})
          getAllPackages();
					return
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}
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
        Header: "Pack",
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
          <Link to="/updatePackaging" state={{ from: a }}>
            <i
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
            />
          </Link>,
          
        ],
      },

    
    ],
    []
  );

  // Get All Packaging Api

  const getAllPackages = () => {
    axios
      .get(`${API_BASE_URL}/getAllPackaging`)
      .then((response) => {
        // console.log(response, "Check Responseeee")
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

  useEffect(() => {
    getAllPackages();
  }, []);

  return (
    <Card
      title="Packaging Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createPackagingNew")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default PackagingNew;
