import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import { useTranslation } from "react-i18next";

export const OrderPackagingList = () => {
  const { t, i18n } = useTranslation("global");

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getOrders = () => {
    axios.get(`${API_BASE_URL}/getOrdersPacking`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getOrders();
  }, []);
  // const { data, refetch: getOrders } = useQuery("getOrdersPacking");
  const confirmQuotation = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/confirmOrder`, { quote_id: id });
      toast.success(t("order_confirm_success"));
    } catch (e) {
      toast.error(t("genericError"));
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: t("number"),
        accessor: "Order_Number",
      },
      {
        Header: t("ttref"),
        accessor: "Shipment_ref",
      },
      {
        Header: t("consigneeName"),
        accessor: "Consignee_name",
      },
      {
        Header: t("loadDate"),
        accessor: (a) => {
          return a.load_date
            ? new Date(a.load_date).toLocaleDateString()
            : "NA";
        },
      },
      {
        Header: t("loadTime"),
        accessor: "Freight_load_time",
      },
      {
        Header: t("supplier"),
        accessor: (a) => a.supplier_name,
      },
      {
        Header: t("freight_bl"),
        accessor: (a) => a.Freight_bl,
      },
      {
        Header: t("status"),
        // accessor: (a) => ({ 2: "Confirmed" })[a.Status] || "Pending",
        accessor: (a) => a.Packing_status,
      },
      {
        Header: t("actions"),
        accessor: (a) => (
          <div className="editIcon gap-2">
            {[4, 5, 6].includes(+a.Status) && (
              <Link to="/orderPackagingEdit" state={{ from: { ...a } }}>
                <i className="mdi mdi-pencil" />
              </Link>
            )}

        
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card
    title={t("order_packaging_management")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/orderPackagingEdit")}
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
