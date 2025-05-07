import React, { useState } from "react";
import { useLocation, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";

const UserResetPass = () => {
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from?.id);
  const navigate = useNavigate();

  const [username, setUsername] = useState("admin@admin.com");
  const [newUsername, setNewUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChecked, setIsChecked] = useState(true);

  const editInput = () => {
    setIsChecked(!isChecked);
  };

  const handleReset = () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }

    axios
      .post(`${API_BASE_URL}/UserReset`, {
        user_id: from?.id,
        user_name: newUsername,
        password: password,
      })
      .then((response) => {
        console.log(response);

        toast.success("User Reset Successfully");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container-fluid pt-1 py-4 px-0">
        <div className="row">
          <div className="col-lg-12 col-md-12 mb-4">
            <div className="card p-4">
              <div className="databaseTableSection pt-0">
                <div className="grayBgColor p-4 pt-2 pb-2">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="font-weight-bolder mb-0 pt-2">
                        Reset User Form
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="top-space-search-reslute">
                  <div className="tab-content p-4 pt-0 pb-0">
                    <div
                      className="tab-pane active"
                      id="header"
                      role="tabpanel"
                    >
                      <div
                        id="datatable_wrapper"
                        className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                      >
                        <div className="d-flex exportPopupBtn" />
                        <div className="resetForm">
                          <div className="row">
                            <div className="col-lg-6">
                              <h6>Username</h6>
                              <input
                                type="text"
                                // placeholder="admin@admin.com"
                                value={from?.user_name}
                                // onChange={(e) => setUsername(e.target.value)}
                              />
                            </div>
                            <div className="col-lg-6">
                              <h6>
                                {" "}
                                <input
                                  type="checkbox"
                                  id="userCheck"
                                  onClick={editInput}
                                  checked={!isChecked}
                                />{" "}
                                New Username
                              </h6>
                              <input
                                type="text"
                                placeholder="username"
                                id="activeUserField"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                disabled={isChecked}
                              />
                            </div>
                            <div className="col-lg-12">
                              <h6>Password</h6>
                              <input
                                type="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                              />
                            </div>
                            <div className="col-lg-12">
                              <h6>Confirm Password</h6>
                              <input
                                type="password"
                                placeholder="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                            </div>
                            <div className="resetBtn">
                              <button onClick={handleReset}>Reset</button>
                              <Link to="/user" className="btn btn-danger mt-3">Cancel</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserResetPass;
