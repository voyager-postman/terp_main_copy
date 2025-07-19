import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Card } from "../../../card";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UpdateLocation = () => {
  const [t, i18n] = useTranslation("global");
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const defaultState = {
    name: from?.name || "",
    address: from?.address || "",
    gps_location: from?.gps_location || "",
  };

  const [state, setState] = useState(defaultState);
  const handleClose = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updateLocation = () => {
    const request = {
      id: from.id,
      name: state.name,
      address: state.address,
      gps_location: state.gps_location,
    };

    if (request.name == "" || request.address == "") {
      toast.warn(t("pleaseFillAllFields"), {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/updateLocation`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(t("Location_Update"), {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/location");
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card title={t("LocationManagementCreate")}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <div className="row justify-content-center">
                  <div className="form-group col-lg-3">
                    <h6>{t("name")}</h6>
                    <input
                      onChange={handleClose}
                      type="text"
                      id="name_th"
                      name="name"
                      className="form-control"
                      placeholder={t("name")}
                      value={state.name}
                    />
                  </div>
                  <div className="form-group col-lg-3">
                    <h6>{t("address")}</h6>
                    <input
                      onChange={handleClose}
                      type="text"
                      id="name_th"
                      name="address"
                      className="form-control"
                      placeholder="Address"
                      value={state.address}
                    />
                  </div>
                  <div className="form-group col-lg-3">
                    <h6>{t("gpsLocation")}</h6>
                    <input
                      onChange={handleClose}
                      type="text"
                      id="name_th"
                      name="gps_location"
                      className="form-control"
                      placeholder={t("gpsLocation")}
                      value={state.gps_location}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer">
              <button
                className="btn btn-primary"
                onClick={updateLocation}
                name="signup"
              >
                {t("update")}
              </button>
              <Link className="btn btn-danger" to={"/location"}>
                {t("cancel")}

              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateLocation;
