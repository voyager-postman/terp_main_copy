import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { TableView } from "../table";
import { Card } from "../../card";
import { useTranslation } from "react-i18next";

const InventoryBoxes = () => {
  const { t, i18n } = useTranslation("global");
  const [quantity, setQuantity] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedPodItem, setSelectedPodItem] = useState("");
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getBoxesList = () => {
    axios.get(`${API_BASE_URL}/getBoxesAvailable`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getBoxesList();
  }, []);
  const formatTwoDecimals = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  const inventoryBoxes = (unit_type, pod_item) => {
    setSelectedUnitType(unit_type);
    setSelectedPodItem(pod_item);
    console.log(pod_item);
  };

  const updatBoxes = () => {
    axios
      .post(`${API_BASE_URL}/StockAdjustmentPB`, {
        user_id: localStorage.getItem("id"),
        type: selectedUnitType,
        item: selectedPodItem,
        qty_on_hand: quantity,
      })
      .then((response) => {
        let modalElement = document.getElementById("modalAdjustBox");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success(t("stockAdjustmentSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
        getBoxesList();
        // Clear the quantity field after successful update
        setQuantity("");
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: () => <div style={{ textAlign: "center" }}>{t("produce")}</div>,
        accessor: "Item",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>{t("unit")}</div>,
        accessor: "Unit",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },

      {
        Header: () => (
          <div style={{ textAlign: "center" }}>{t("quantityAvailable")}</div>
        ),
        accessor: "Quantity Available",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>{t("averageCost")}</div>,
        accessor: "Average Cost",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: t("actions"),
        accessor: (a) => (
          <div className="editIcon">
            <i className="ps-2 mdi mdi-eye" />
            <button onClick={() => inventoryBoxes(a.unit_type, a.pod_item)}>
              <i
                className="ps-2 mdi mdi-pencil"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalAdjustBox"
              />
            </button>
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Card
        title={t("Available_Boxes_Management")}
        endElement={
          <button
            type="button"
            onClick={() => navigate("/createUser")}
            className="btn button btn-info"
          >
            {t("create")}
          </button>
        }
      >
        <TableView columns={columns} data={data} />
      </Card>

      {/* Modal for Stock Adjustment */}
      <div
        className="modal fade"
        id="modalAdjustBox"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
               {t("stockAdjustment")}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setQuantity("")}
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group col-lg-12 formCreate">
                <h6>{t("quantityOnHand")}</h6>
                <div>
                  <input
                    type="text"
                    name="quantity"
                    value={quantity}
                    onChange={handleChange}
                    placeholder="124"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                onClick={updatBoxes}
                className="btn mb-0 btn-primary"
              >
                {t("update")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryBoxes;
