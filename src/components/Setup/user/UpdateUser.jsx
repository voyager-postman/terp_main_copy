import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { useQuery } from "react-query";
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const UpdateUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const { data: SelectClient } = useQuery("getClientDataAsOptions");
  const [selectedClientId, setSelectedClientId] = useState(from?.client || "");
  const [consignees, setConsignees] = useState([]);
  const [role, setRole] = useState(from?.role || "");
  const [client, setClient] = useState(from?.client || "");
  const [consignee, setConsignee] = useState(from?.consignee || "");
  const [status, setStatus] = useState(from?.status || "");
  const [permission, setPermission] = useState(from?.permission || "");
  const [name, setName] = useState(from?.name || "");
  const [name2, setName2] = useState(from?.User_name || "");
  const [userName, setUserName] = useState(from?.User_name || "");
  const [emailId, setEmailId] = useState(from?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (selectedClientId) {
      fetchConsignees();
    }
  }, [selectedClientId]);

  const fetchConsignees = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: selectedClientId,
      });
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

  const updateForm = () => {
    axios
      .post(`${API_BASE_URL}/updateUser`, {
        user_id: from?.ID,
        name: name,
        client: selectedClientId,
        consignee: consignee,
        User_name: name2,
        email: emailId,
        permission: permission,
        password: password,
        role: role,
        status: status,
      })
      .then((response) => {
        console.log(response);

        setRole("");
        setClient("");
        setConsignee("");
        setStatus("");
        setPermission("");
        setName("");
        setUserName("");
        setPassword("");
        setConfirmPassword("");
        toast.success("User update Successfully");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [generatedPassword, setGeneratedPassword] = useState("");

  const createPassword = (length = 12) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setGeneratedPassword(newPassword);
  };

  // Function to copy the password to clipboard
  const copyPasswordToClipboard = (e) => {
    e.preventDefault(); // Prevent page reload
    navigator.clipboard.writeText(generatedPassword);
    alert("Password copied to clipboard!");
  };

  const handleGenerateClick = (event) => {
    event.preventDefault(); // Prevent page reload
    createPassword(12); // Call password generator
  };
  useEffect(() => {
    createPassword(12); // Auto-generate a password with 12 characters
  }, []);
  return (
    <div className="row">
      <div className="col-lg-12 col-md-12 mb-4">
        <div>
          <div className="databaseTableSection pt-0">
            <div className="grayBgColor p-4 pt-2 pb-2">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="font-weight-bolder mb-0 pt-2">
                    User Management / Update Form
                  </h6>
                </div>
              </div>
            </div>
            <div className="top-space-search-reslute">
              <div className="tab-content p-4 pt-0 pb-0">
                <div className="tab-pane active" id="header" role="tabpanel">
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4"
                  >
                    {/*---------------------------table data---------------------*/}
                    <div className="d-flex exportPopupBtn" />
                    <div className="formCreate">
                      <form action="">
                        <div className="row">
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Role</h6>
                            <Autocomplete
                              options={[
                                { label: "Client", value: "Client" },
                                { label: "Operation", value: "Operation" },
                                { label: "Sales", value: "Sales" },
                                { label: "Admin", value: "Admin" },
                                { label: "Shipping", value: "Shipping" },
                                { label: "Staff", value: "Staff" },
                                { label: "Consignee", value: "Consignee" },
                              ]}
                              getOptionLabel={(option) => option?.label || ""}
                              value={role ? { label: role, value: role } : null}
                              onChange={(event, newValue) => {
                                setRole(newValue?.value || null);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Role"
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete">
                            <h6>Permission</h6>
                            <Autocomplete
                              options={[
                                { label: "Level 1", value: "Level 1" },
                                { label: "Level 2", value: "Level 2" },
                                { label: "Level 3", value: "Level 3" },
                                { label: "Level 4", value: "Level 4" },
                                { label: "Level 5", value: "Level 5" },
                                { label: "Level 6", value: "Level 6" },
                                { label: "Level 7", value: "Level 7" },
                                { label: "Level 8", value: "Level 8" },
                                { label: "Level 9", value: "Level 9" },
                                { label: "Level 10", value: "Level 10" },
                              ]} // Directly inside Autocomplete tag
                              getOptionLabel={(option) => option.label} // Display the label of each option
                              value={
                                [
                                  { label: "Level 1", value: "Level 1" },
                                  { label: "Level 2", value: "Level 2" },
                                  { label: "Level 3", value: "Level 3" },
                                  { label: "Level 4", value: "Level 4" },
                                  { label: "Level 5", value: "Level 5" },
                                  { label: "Level 6", value: "Level 6" },
                                  { label: "Level 7", value: "Level 7" },
                                  { label: "Level 8", value: "Level 8" },
                                  { label: "Level 9", value: "Level 9" },
                                  { label: "Level 10", value: "Level 10" },
                                ].find(
                                  (option) => option.value === permission
                                ) || null // Match the current permission
                              }
                              onChange={(e, newValue) => {
                                setPermission(newValue?.value || ""); // Update the selected permission value
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              } // Ensure correct matching
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Permission"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Select Client</h6>
                            <Autocomplete
                              options={SelectClient || []}
                              getOptionLabel={(option) =>
                                option.client_name || ""
                              }
                              value={
                                SelectClient?.find(
                                  (client) =>
                                    client.client_id === selectedClientId
                                ) || null
                              } // Ensure correct selection
                              onChange={(e, newValue) => {
                                setSelectedClientId(newValue?.client_id || ""); // Set the selected client ID
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.client_id === value.client_id
                              }
                              sx={{ width: 300 }}
                              onBlur={() => {
                                // Ensure that selected value is saved when focus is lost
                                if (selectedClientId === "") {
                                  setSelectedClientId(""); // Reset to an empty string if no client is selected
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Client"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Consignee</h6>
                            <Autocomplete
                              options={consignees || []}
                              getOptionLabel={(option) =>
                                option.consignee_name || ""
                              }
                              value={
                                consignees?.find(
                                  (consigneeItem) =>
                                    consignee === consigneeItem.consignee_id
                                ) || null
                              } // Ensure correct selection
                              onChange={(e, newValue) => {
                                setConsignee(newValue?.consignee_id || ""); // Update state with selected consignee ID
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.consignee_id === value.consignee_id
                              }
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Consignee"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          </div>

                          <div className="form-group col-lg-3">
                            <h6>Username</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="name"
                              value={name2}
                              onChange={(e) => setName2(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-3 ">
                            <h6>Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-3">
                            <h6>Email</h6>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="email"
                              onChange={(e) => setEmailId(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete">
                            <h6>Status</h6>
                            <Autocomplete
                              options={[
                                { label: "Pending", value: "Pending" },
                                { label: "Active", value: "Active" },
                                { label: "Inactive", value: "Inactive" },
                                { label: "Banned", value: "Banned" },
                              ]}
                              getOptionLabel={(option) => option.label || ""} // Display the label of each option
                              value={
                                [
                                  { label: "Pending", value: "Pending" },
                                  { label: "Active", value: "Active" },
                                  { label: "Inactive", value: "Inactive" },
                                  { label: "Banned", value: "Banned" },
                                ].find((option) => option.value === status) ||
                                null // Match the current status
                              }
                              onChange={(e, newValue) => {
                                setStatus(newValue?.value || ""); // Update the selected status value
                              }}
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              } // Ensure correct matching
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Status"
                                  InputLabelProps={{ shrink: false }}
                                />
                              )}
                            />
                          </div>
                          <div className="form-group col-lg-4">
                            <h6>Password Generator</h6>
                            <div className="flex">
                              <div className="passwordGenerator me-2">
                                <input
                                  style={{ width: "100%" }}
                                  type="text"
                                  className="form-control"
                                  readOnly
                                  value={generatedPassword}
                                />
                                <button>
                                  {" "}
                                  <i
                                    class="mdi mdi-content-copy"
                                    onClick={copyPasswordToClipboard}
                                  ></i>
                                </button>
                              </div>
                              <div>
                                <button
                                  type="btn"
                                  onClick={handleGenerateClick}
                                >
                                  Generate
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="form-group col-lg-3">
                            <h6>Password</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="form-group col-lg-4">
                            <h6> Confirm Password</h6>
                            <input
                              type="password"
                              className="form-control"
                              placeholder={123456}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                    {/*--------------------------- table data end--------------------------------*/}
                  </div>
                </div>
                <div className="card-footer">
                  <button
                    onClick={updateForm}
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                  >
                    Update
                  </button>
                  <Link className="btn btn-danger" to="/user">
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
