import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { TableView } from "../table";
import { Card } from "../../card";
import { useTranslation } from "react-i18next";

const InventoryProduce = () => {
  const { t, i18n } = useTranslation("global");
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
  const [selectedPodItem, setSelectedPodItem] = useState("");
  const [data, setData] = useState([]);

  const getProduceList = () => {
    axios.get(`${API_BASE_URL}/getProduceAvailable`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getProduceList();
  }, []);

  const handleChange = (e) => {
    setQuantity(e.target.value);
  };

  const inventoryBoxes = (pod_item) => {
    setSelectedUnitType(pod_item);
    console.log(pod_item);
  };

  const updateBoxes = () => {
    axios
      .post(
        `${API_BASE_URL}/editAvailableProcedure
`,
        {
          user_id: localStorage.getItem("id"),
          item: selectedUnitType,
          qty_on_hand: quantity,
        }
      )
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModalLabel");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success(t("stockAdjustmentSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
        getProduceList();
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
  const formatTwoDecimals = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const columns = React.useMemo(
    () => [
      {
        Header: () => <div style={{ textAlign: "center" }}> {t("produce")}</div>,
        accessor: "Item",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>{t("unit")}</div>,
        accessor: "Unit",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      // optional: prevents growing beyond this
      {
        Header: () => (
          <div style={{ textAlign: "center", }}>
            {t("quantityAvailable")}{" "}
          </div>
        ),

        accessor: "Quantity Available",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>{t("averageCost")} </div>,
        accessor: "Average Cost",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },

      {
        Header: t("actions"),
        accessor: (a) => (
          <>
            <div className="editIcon">
              <i className="ps-2 mdi mdi-eye" />
              <button onClick={() => inventoryBoxes(a.pod_item)}>
                <i
                  className="ps-2 mdi mdi-pencil"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalLabel"
                />
              </button>
            </div>
            <div
              className="modal fade"
              id="exampleModalLabel"
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modalShipTo">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      {t("produceOnHand")}
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      <i className="mdi mdi-close" />
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
                      onClick={updateBoxes}
                      className="btn btn-primary"
                    >
                      {t("update")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ),
      },
    ],
    [quantity, handleChange, t] // Ensure useMemo dependencies are correct
  );

  return (
    <Card
      title={t("produceManagement")}
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
  );
};

export default InventoryProduce;
