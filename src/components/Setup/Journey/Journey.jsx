import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const Journey = () => {
  const [t, i18n] = useTranslation("global");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);

  const getFreight = () => {
    axios
      .get(`${API_BASE_URL}/getjourneyDetails`)
      .then((response) => {
        console.log(response);
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateAirportStatus = (airportId) => {
    const request = {
      journey_id: airportId,
    };

    axios
      .post(`${API_BASE_URL}/JourneyStatusUpdate`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getFreight();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/DeleteJourney`, { journey_id: id });
          toast.success("Journey delete successfully");
          getFreight();
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  useEffect(() => getFreight(), []);

  const columns = useMemo(
    () => [
      {
        Header: t("fromPort"),
        Id: "index",
        accessor: (_rows, i) => _rows.from_port,
      },
      {
        Header: t("destinationPort"),
        accessor: (a) => a.destination_port,
      },
      {
        Header: t("liner"),
        accessor: (a) => a.liner_name,
      },
      {
        Header: t("journeyNumber"),
        accessor: (a) => a.journey_number,
      },
      {
        Header: t("loadTime"),
        accessor: (a) => a.Load_time,
      },
      {
        Header: t("transitToDeparture"),
        accessor: (a) => a.Transit_to_Departure,
      },
      {
        Header: t("etd"),
        accessor: (a) => a.ETD,
      },
      {
        Header: t("transitToArrival"),
        accessor: (a) => a.Transit_to_arrival,
      },
      {
        Header: t("eta"),
        accessor: (a) => a.ETA,
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
            onclick=""
          >
            <input
              onChange={() => updateAirportStatus(a.ID)}
              type="checkbox"
              defaultChecked={a.Available == "1" ? true : false}
            />
            <span>
              <span>{t("off")}</span>
              <span>{t("no")}</span>
            </span>
            <a></a>
          </label>
        ),
      },
      {
        Header: t("actions"),
        accessor: (a) => (
          <>
            <Link to="/openEditjourney" state={{ from: { ...a } }}>
              <i
                className="mdi mdi-pencil"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              ></i>
            </Link>
            <button
              type="button"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
              onClick={() => deleteOrder(a.ID)}
            >
              <i className="mdi mdi-delete " />
            </button>
          </>
        ),
      },
    ],
    [t]
  );

  return (
    <Card
      title={t("journeySetupManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/openjourney")}
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

export default Journey;
