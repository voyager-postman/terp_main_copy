 import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card/";
import { TableView } from "../table";
import { useTranslation } from "react-i18next";

const Remarks = () => {
  const [t, i18n] = useTranslation("global");

  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/SuggestedPurchases`)
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
        Header: t("ean"),
        accessor: "EAN", // Static value for Produce
      },
      {
        Header: t("required"),
        accessor: (a) => (
          <div>
            {formatterTwo.format(a.required)} {/* Static value */}
          </div>
        ),
      },
      {
        Header: t("available"),
        accessor: (a) => (
          <div>
            {formatterTwo.format(a.available)} {/* Static value */}
          </div>
        ),
      },
      {
        Header: t("wastage"),
        accessor: (a) => (
          <div>
            {formatterTwo.format(a.Wastage)} {/* Static value */}
          </div>
        ),
      },
      {
        Header: t("suggested"),
        accessor: (a) => (
          <div>
            {formatterZero.format(a.Suggested)} {/* Static value */}
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <Card
      title={t("suggestedPoManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_ean")}
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

export default Remarks;
