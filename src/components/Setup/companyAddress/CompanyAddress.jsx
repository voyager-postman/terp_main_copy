import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "../../../card";
import { TableView } from "../../table";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
 import { useTranslation } from "react-i18next";

import logo from "../../../assets/logoNew.png";

const CompanyAddress = () => {
  const [t, i18n] = useTranslation("global");
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/getCompanyAddress`)
      .then((response) => {
        console.log(response);
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
        if (resp.data.success === true) {
          toast.success(t("statusUpdated"), {
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

  const formatterTwo = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatterZero = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Defining the static values for the table columns
  const columns = useMemo(
    () => [
      {
        Header: t("line_1"),
        accessor: "Line_1",
      },
      {
        Header: t("line_2"),
        accessor: "Line_2",
      },
      {
        Header: t("line_3"),
        accessor: "Line_3",
      },
      {
        Header: t("line_4"),

        accessor: "Line_4",
      },
      {
        Header: t("logo"),
        accessor: (a) => (
          <div className="logoCompany">
            <img
              src={`${API_IMAGE_URL}/${a.logo}`}
              crossorigin="anonymous"
              alt=""
            />
          </div>
        ),
        width: 100, // Adjust width for logo column
      },
      {
        Header: t("action"),
        accessor: (a) => (
          <div className="editIcon">
            <Link to="/editcompanyaddress" state={{ from: a }}>
              <i className="mdi mdi-pencil"></i>
            </Link>
          </div>
        ),
        width: 80, // Adjust width for action column
      },
    ],
    [t]
  );

  return (
    <Card
      title={t("company_address_management")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createcompanyAddress")}
          className="btn button btn-info"
        >
          {" "}
          {t("create")}
        </button>
      }
    >
      <div className="addressTable">
        <TableView columns={columns} data={data} />
      </div>
    </Card>
  );
};

export default CompanyAddress;
