import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";

const CreateLocation = () => {
  const navigate = useNavigate();
  const defaultState = {
    name: "",
    address: "",
    gps_location: "",
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

  const createLocation = () => {
    const request = {
      user_id: localStorage.getItem("id"),

      name: state.name,
      address: state.address,
      gps_location: state.gps_location,
    };

    if (request.name == "" || request.address == "") {
      toast.warn("Please Fill All The Fields", {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/createLocation`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Location Added Successfully", {
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
    <Card title="Location Management / Create Form">
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row justify-content-center">
                    <div className="form-group col-lg-3">
                      <h6>Name</h6>
                      <input
                        onChange={handleClose}
                        type="text"
                        id="name_th"
                        name="name"
                        className="form-control"
                        placeholder="Maersk"
                        value={state.name}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Address</h6>
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
                      <h6>GPS Location</h6>
                      <input
                        onChange={handleClose}
                        type="text"
                        id="name_th"
                        name="gps_location"
                        className="form-control"
                        placeholder="GPS location"
                        value={state.gps_location}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer">
              <button
                onClick={createLocation}
                className="btn btn-primary"
                type="submit"
                name="signup"
              >
                Create
              </button>
              <Link className="btn btn-danger" to={"/location"}>
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreateLocation;
