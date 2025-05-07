import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";

const EanNew = () => {
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const navigate = useNavigate();

  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/getEan`)
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
          toast.success("Status Updated Successfully", {
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

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "EAN_Internal_EN",
      },

      {
        Header: "EAN Code",
        accessor: (a) => (
          <div>
            <Barcode width={0.8} height={30} value={a.EANCODE} />
          </div>
        ),
      },

      {
        Header: "Net Weight",
        accessor: (a) => <div>{a.NW}</div>,
      },

      {
        Header: "Gross Weight",
        accessor: (a) => <div>{a.GW}</div>,
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
          >
            <input
              checked={a.Available == "1" ? true : false}
              onChange={() => {
                setIsOn(!isOn);
              }}
              onClick={() => updateEanStatus(a.ID)}
              value={a.Available}
              type="checkbox"
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
    []
  );

  return (
    <Card
      title={"EAN Setup Management"}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_ean")}
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

export default EanNew;
