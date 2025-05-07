import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Url/Url";
import { useQuery } from "react-query";

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const CreateUser = () => {
  const navigate = useNavigate();

  const { data: SelectClient } = useQuery("getClientDataAsOptions");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [consignees, setConsignees] = useState([]);
  const [role, setRole] = useState("");
  const [client, setClient] = useState("");
  const [consignee, setConsignee] = useState("");
  const [status, setStatus] = useState("");
  const [permission, setPermission] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [emailId, setEmailId] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consigneeId, setConsigneeId] = useState("");
  const fetchConsignees = async () => {
    console.log(selectedClientId);
    try {
      const response = await axios.post(`${API_BASE_URL}/getClientConsignee`, {
        client_id: selectedClientId,
      });
      console.log(response);
      setConsignees(response.data.data);
    } catch (error) {
      console.error("Error fetching consignees:", error);
    }
  };

  const handleClientChange = (event) => {
    setSelectedClientId(event.target.value);
  };

  useEffect(() => {
    if (selectedClientId) {
      fetchConsignees();
    }
  }, [selectedClientId]);

  const createForm = () => {
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match");
      return;
    }
    // Use all individual states here as needed
    console.log({
      selectedClientId,
      consignee,
      status,
      permission,
      name,
      userName,
      password,
      confirmPassword,
    });
    axios
      .post(`${API_BASE_URL}/CreateUser`, {
        name: name,
        user_name: userName,
        client: selectedClientId,
        consignee: consignee,
        permission: permission,
        User_name: userName,
        email: emailId,
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
        toast.success("User Create Successfully");
        navigate("/user");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const statusOptions = [
    { status: "Pending" },
    { status: "Active" },
    { status: "Inactive" },
    { status: "Banned" },
  ];
  // password generator
  const [generatedPassword, setGeneratedPassword] = useState("");

  // Function to generate a random password
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
        <div className=" p-4">
          <div className="databaseTableSection pt-0">
            <div className="grayBgColor p-4 pt-2 pb-2">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="font-weight-bolder mb-0 pt-2">
                    User Management / Create Form
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
                              disablePortal
                              options={[
                                "Client",
                                "Operation",
                                "Sales",
                                "Admin",
                                "Shipping",
                                "Staff",
                                "Consignee",
                              ]}
                              sx={{ width: 300 }}
                              value={role || null} // Ensure null when no value is selected
                              onChange={(event, newValue) =>
                                setRole(newValue || "")
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Please select Role"
                                />
                              )}
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Permission</h6>
                            <Autocomplete
                              value={
                                permission
                                  ? { label: permission, value: permission } // Create option object if permission exists
                                  : null // Use null for no selection
                              }
                              onChange={(event, newValue) =>
                                setPermission(newValue ? newValue.value : "")
                              } // Update the permission value
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
                              ]}
                              getOptionLabel={(option) => option.label} // Display the label for each option
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              } // Match option to value
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select Permission"
                                />
                              )}
                              disableClearable // Prevent clearing the selected value by clicking on the input
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Select Client</h6>
                            <Autocomplete
                              options={SelectClient || []} // Provide options for autocomplete
                              getOptionLabel={(option) =>
                                option.client_name || ""
                              } // The text to display for each option
                              onChange={(event, newValue) => {
                                // Handle client change
                                setSelectedClientId(
                                  newValue ? newValue.client_id : ""
                                );
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Client" // Set placeholder text
                                  variant="outlined"
                                />
                              )}
                              value={
                                // Find the client object corresponding to the selected ID
                                Array.isArray(SelectClient)
                                  ? SelectClient.find(
                                      (client) =>
                                        client.client_id === selectedClientId
                                    ) || null
                                  : null
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.client_id === value.client_id
                              } // Ensure the option matches the selected value
                            />
                          </div>
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Consignee</h6>
                            <Autocomplete
                              options={consignees || []} // Provide options for autocomplete
                              getOptionLabel={(option) =>
                                option.consignee_name || ""
                              } // The text to display for each option
                              onChange={(event, newValue) => {
                                // Handle consignee change
                                setConsigneeId(
                                  newValue ? newValue.consignee_id : ""
                                ); // Update consigneeId with the selected consignee_id or empty string
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Consignee" // Placeholder text
                                  variant="outlined"
                                />
                              )}
                              value={
                                consignees.find(
                                  (item) => item.consignee_id === consigneeId
                                ) || null // Find the consignee object based on consigneeId
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.consignee_id === value.consignee_id
                              } // Ensure the option matches the selected value by consignee_id
                            />
                          </div>

                          <div className="form-group col-lg-3">
                            <h6>Username</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="harry potter"
                              onChange={(e) => setUserName(e.target.value)}
                            />
                          </div>

                          <div className="form-group col-lg-3">
                            <h6>Name</h6>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="name"
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
                          <div className="form-group col-lg-3 autoComplete mb-3">
                            <h6>Status</h6>
                            <Autocomplete
                              options={statusOptions}
                              getOptionLabel={(option) => option.status || ""}
                              onChange={(event, newValue) => {
                                setStatus(newValue ? newValue.status : "");
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select Status" // Placeholder text for the input
                                  variant="outlined"
                                />
                              )}
                              value={
                                statusOptions.find(
                                  (option) => option.status === status
                                ) || null
                              } // Find and set selected status value
                              isOptionEqualToValue={(option, value) =>
                                option.status === value.status
                              } // Check if the option matches the selected value
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
                          <div className="form-group col-lg-4">
                            <h6> Password</h6>
                            <input
                              type="password"
                              className="form-control"
                              placeholder={123456}
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
                    onClick={createForm}
                    className="btn btn-primary"
                    type="submit"
                    name="signup"
                  >
                    Create
                  </button>
                  <a className="btn btn-danger" href="#">
                    Cancel
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
