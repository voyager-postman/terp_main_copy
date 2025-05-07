import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";

const Users = () => {

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getAllUser = () => {
    axios.get(`${API_BASE_URL}/getAllUsers`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getAllUser();
  }, []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      console.log(result);
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`${API_BASE_URL}/deleteUser`, {
            user_id: id,
          });
          console.log(response);
          getAllUser();
          toast.success("Order delete successfully");
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  // const { data } = useQuery("getViewToReceving");
  console.log(data);
  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "index",
        accessor: (row, i) => i + 1,
      },
      {
        Header: "Username",
        accessor: "email",
      },
      {
        Header: "Company",
        accessor: "produce_name",
        Cell: () => "Siam Eats",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Status",
        accessor: "status",
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <>
            {/* {/ <Link state={{ from: a }} to="/updateUser"> /} */}
            {/* <i
                className="mdi mdi-check"
                style={{
                  width: "20px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              /> */}{" "}
            <div className="userIcon ">
              <Link to="/updateUser" state={{ from: a }}>
                <i
                  i
                  className="mdi mdi-pencil"
                  style={{
                    width: "20px",
                    color: "#203764",
                    marginTop: "10px",
                    paddingTop: "8px",
                    fontSize: "22px",
                  }}
                />
              </Link>

              <button type="button" onClick={() => deleteOrder(a.id)}>
                <i className="mdi mdi-delete " />
              </button>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                state={{ from: a }}
              >
                <i className=" ps-2 mdi mdi-restore" />
              </button>
            </div>
            {/* {/ </Link> /} */}
          </>
        ),
      },
    ],
    []
  );

  //  restore

  const location = useLocation();
  const { from } = location.state || {};
  console.log(from?.id);
  // const [username, setUsername] = mailto:usestate("admin@admin.com");
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
    <Card
      title="User Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createUser")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modalShipTo  modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Reset User Form
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                >
                  <div className="d-flex exportPopupBtn" />
                  <div className="resetForm">
                    <div className="row">
                      <div className="form-group col-lg-12">
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
                            <button type="btn" onClick={handleGenerateClick}>
                              Generate
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <h6>Password</h6>
                        <input
                          type="password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <h6>Confirm Password</h6>
                        <input
                          type="password"
                          placeholder="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="resetBtn d-flex justify-content-center">
                        <div>
                          <button onClick={handleReset}>Reset</button>
                        </div>
                        <div>
                          <Link to="/user" className="btn btn-danger">
                            Cancel
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default Users;
