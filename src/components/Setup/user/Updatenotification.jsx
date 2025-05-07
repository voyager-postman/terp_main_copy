import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../../Url/Url"; // Adjust the import path as necessary
import Select from "react-select";
import { toast } from "react-toastify";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
export default function Updatenotification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data12 } = location.state || {};
  console.log(data12);
  const [notificationName, setNotificationName] = useState(
    data12 ? data12.notification_name : ""
  );
  const [selectedClient, setSelectedClient] = useState(
    data12 ? data12.client : ""
  );
  const [selectedConsignee, setSelectedConsignee] = useState(
    data12 ? data12.consignee : ""
  );
  const [notifyOnOption, setNotifyOnOption] = useState(
    data12 ? data12.notify_on : ""
  );
  const [notificationMessage, setNotificationMessage] = useState(
    data12 ? data12.notification_message : ""
  );
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(
    data12
      ? data12.users.map((user) => ({
          value: user.user_id,
          label: `${user.name} (${user.email})`, // This includes the email
          name: user.name, // Store just the name
          company: user.company,
          role: user.role,
          status: user.status,
        }))
      : []
  );

  const [consignees, setConsignees] = useState([]);
  const [clients, setClients] = useState([]);
  const [popup, setPopup] = useState([]);

  useEffect(() => {
    getClients();
    getdatapopUp();
    if (selectedClient) {
      getConsignees(selectedClient);
    }
  }, [selectedClient]);

  const getClients = () => {
    axios
      .get(`${API_BASE_URL}/getClientDataAsOptions`)
      .then((response) => {
        const clientData = response.data.data;
        setClients(clientData);
      })
      .catch((error) => {
        console.error("Error fetching clients: ", error);
      });
  };

  const getConsignees = (client_id) => {
    axios
      .post(`${API_BASE_URL}/getClientConsignee`, { client_id })
      .then((response) => {
        setConsignees(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching consignees: ", error);
      });
  };
  console.log(selectedUsers);
  const handleUpdateNotification = () => {
    const payload = {
      notification_id: data12.notification_id,
      notification_name: notificationName,
      notification_message: notificationMessage,
      notify_on: notifyOnOption,
      client: selectedClient,
      consignee: selectedConsignee,
      user_id: selectedUsers.map((user) => user.value),
    };
    console.log(payload);
    axios
      .post(`${API_BASE_URL}/UpdateNotification`, payload)
      .then((response) => {
        console.log(response.data);
        toast.success("Notification Updated Successfully");
        navigate("/notification");
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  const getdatapopUp = () => {
    axios
      .get(`${API_BASE_URL}/getAllUsers`)
      .then((response) => {
        const usersData = response.data.data.map((user) => ({
          value: user.id,
          label: `${user.name} (${user.email})`, // This includes the email
          name: user.name, // Store just the name
          company: user.company,
          role: user.role,
          status: user.status,
        }));
        setPopup(usersData);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  };

  return (
    <div className="container">
      <div className="bg-white rounded border">
        <div className="grayBgColor px-4 py-3 rounded-t">
          <div className="flex justify-between items-center exportPopupBtn">
            <h6 className="font-weight-bolder mb-0">
              Notification / Update Form
            </h6>
          </div>
        </div>
        <div className="top-space-search-reslute">
          <div className="tab-content px-2 md:!px-4">
            <div className="tab-pane active" id="header" role="tabpanel">
              <div
                id="datatable_wrapper"
                className="information_dataTables dataTables_wrapper dt-bootstrap4"
              >
                <div className="formCreate formNotification">
                  <form>
                    <div className="row">
                      <div className="form-group col-lg-4">
                        <div className="ceateTransport ">
                          <h6>Notification Name</h6>
                          <input
                            className="w-100"
                            type="text"
                            placeholder="Please Enter Your Notification Name"
                            value={notificationName}
                            onChange={(e) =>
                              setNotificationName(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group col-lg-4 autoComplete">
                        <div className="ceateTransport">
                          <h6>Client</h6>
                          {/* <select
                            className="form-control"
                            value={selectedClient}
                            onChange={(e) => setSelectedClient(e.target.value)}
                          >
                            <option value="">Select Client</option>
                            {clients &&
                              clients.length > 0 &&
                              clients.map((item, index) => (
                                <option key={index} value={item.client_id}>
                                  {item.client_name}
                                </option>
                              ))}
                          </select> */}
                          <Autocomplete
                            options={
                              clients?.map((item) => ({
                                id: item.client_id,
                                name: item.client_name,
                              })) || []
                            } // Map clients to create options with `id` and `name`
                            getOptionLabel={(option) => option.name || ""} // Display the client name
                            value={
                              clients
                                ?.map((item) => ({
                                  id: item.client_id,
                                  name: item.client_name,
                                }))
                                .find(
                                  (option) => option.id === selectedClient
                                ) || null
                            } // Match the current `selectedClient` with the options
                            onChange={(e, newValue) => {
                              setSelectedClient(newValue?.id || ""); // Update state with selected client's `id`
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            } // Ensure proper option matching
                            sx={{ width: 300 }} // Adjust width as needed
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Client" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-group col-lg-4">
                        <div className="ceateTransport autoComplete">
                          <h6>Consignee</h6>
                          {/* <select
                            className="form-control"
                            value={selectedConsignee}
                            onChange={(e) =>
                              setSelectedConsignee(e.target.value)
                            }
                          >
                            <option value="">Select Consignee</option>
                            {consignees &&
                              consignees.length > 0 &&
                              consignees.map((item, index) => (
                                <option key={index} value={item.consignee_id}>
                                  {item.consignee_name}
                                </option>
                              ))}
                          </select> */}
                          <Autocomplete
                            options={
                              consignees?.map((item) => ({
                                id: item.consignee_id,
                                name: item.consignee_name,
                              })) || []
                            } // Map consignees to create options with `id` and `name`
                            getOptionLabel={(option) => option.name || ""} // Display the consignee name
                            value={
                              consignees
                                ?.map((item) => ({
                                  id: item.consignee_id,
                                  name: item.consignee_name,
                                }))
                                .find(
                                  (option) => option.id === selectedConsignee
                                ) || null
                            } // Match the current `selectedConsignee` with the options
                            onChange={(e, newValue) => {
                              setSelectedConsignee(newValue?.id || ""); // Update state with selected consignee's `id`
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            } // Ensure proper option matching
                            sx={{ width: 300 }} // Adjust width as needed
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Consignee" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-group col-lg-4 mb-3">
                        <div className="ceateTransport autoComplete">
                          <h6>Notify On</h6>
                          <Autocomplete
                            options={[
                              { id: "1", name: "New Quotation Created" },
                              { id: "2", name: "Quotation Adjusted" },
                              { id: "3", name: "Request for Approval" },
                              { id: "4", name: "Quotation Approved" },
                              {
                                id: "5",
                                name: "Create Order from Approved Quotation",
                              },
                              { id: "6", name: "Quotation Expiry" },
                              { id: "7", name: "Order Approved" },
                              { id: "8", name: "Order Update Any Time" },
                              { id: "9", name: "Order Update before set date" },
                              { id: "10", name: "Order Dead Line" },
                              { id: "11", name: "Add Shipment" },
                            ]} // Define options directly
                            getOptionLabel={(option) => option.name || ""} // Display the notification option name
                            value={
                              // Match the current `notifyOnOption` with the options
                              [
                                { id: "1", name: "New Quotation Created" },
                                { id: "2", name: "Quotation Adjusted" },
                                { id: "3", name: "Request for Approval" },
                                { id: "4", name: "Quotation Approved" },
                                {
                                  id: "5",
                                  name: "Create Order from Approved Quotation",
                                },
                                { id: "6", name: "Quotation Expiry" },
                                { id: "7", name: "Order Approved" },
                                { id: "8", name: "Order Update Any Time" },
                                {
                                  id: "9",
                                  name: "Order Update before set date",
                                },
                                { id: "10", name: "Order Dead Line" },
                                { id: "11", name: "Add Shipment" },
                              ].find(
                                (option) => option.id === notifyOnOption
                              ) || null
                            }
                            onChange={(e, newValue) => {
                              setNotifyOnOption(newValue?.id || ""); // Update state with selected option's `id`
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value.id
                            } // Ensure proper option matching
                            sx={{ width: 300 }} // Adjust width as needed
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select Notify On" // Adds a placeholder
                                InputLabelProps={{ shrink: false }} // Prevents floating label
                              />
                            )}
                          />
                          {/* <select
                            className="form-control"
                            value={notifyOnOption}
                            onChange={(e) => setNotifyOnOption(e.target.value)}
                          >
                            <option value="">Select Notify On</option>
                            <option value="1"> New Quotation Created</option>
                            <option value="2">Quotation Adjusted</option>
                            <option value="3">Request for Approval</option>
                            <option value="4"> Quotation Approved</option>
                            <option value="5">
                              {" "}
                              Create Order from Approved Quotation
                            </option>
                            <option value="6"> Quotation Expiry</option>
                            <option value="7"> Order Approved</option>
                            <option value="8"> Order Update Any Time</option>
                            <option value="9">
                              {" "}
                              Order Update before set date
                            </option>
                            <option value="10"> Order Dead Line</option>
                          </select> */}
                        </div>
                      </div>
                      <div className="form-group col-lg-12">
                        <div className="ceateTransport">
                          <h6>Notification Message</h6>
                          <textarea
                            value={notificationMessage}
                            onChange={(e) =>
                              setNotificationMessage(e.target.value)
                            }
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="">
              <div className="d-flex justify-content-between">
                <Link
                  style={{ width: "170px" }}
                  className="btn btn-danger mb-4"
                  to="#"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModalContact"
                >
                  Add User
                </Link>
                {/* modal start */}
                <div
                  className="modal fade"
                  id="exampleModalContact"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modalShipTo">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Add User
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setSelectedUsers([])} // Reset to an empty array
                        >
                          <i className="mdi mdi-close"></i>
                        </button>
                      </div>
                      <div className="modal-body">
                        <div className="formCreate">
                          <div className="col-lg-12">
                            <div className="ceateTransport addUserSelect">
                              <div className="mb-3">
                                <label htmlFor="users" className="form-label">
                                  Search Users:
                                </label>
                                <Select
                                  id="users"
                                  name="users"
                                  options={popup}
                                  isMulti
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  value={selectedUsers}
                                  onChange={setSelectedUsers}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer mt-4">
                        <button
                          type="button"
                          className="btn btn-primary mb-0"
                          data-bs-dismiss="modal"
                          onClick={() => {
                            // Handle Add User functionality
                          }}
                        >
                          Add User
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* modal end */}
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  type="button"
                  name="signup"
                  onClick={handleUpdateNotification}
                >
                  Update
                </button>
                <Link className="btn btn-danger" to="/notifications">
                  Cancel
                </Link>
              </div>
              <div className="table-responsive mt-4">
                <table className="tableContact striped table borderTerpProduce">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.name}</td>
                        <td>{user.company}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
