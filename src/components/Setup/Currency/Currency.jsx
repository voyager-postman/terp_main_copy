import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";
import { useTranslation } from "react-i18next";

const Currency = () => {
  const [t, i18n] = useTranslation("global");
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const getAllUser = () => {
    axios.get(`${API_BASE_URL}/getFxCorrections`).then((res) => {
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
      title: t("areYouSure"),
      text: t("irreversible"),
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
          toast.success(t("orderDeleted"));
        } catch (e) {
          toast.error(t("genericError"));
        }
      }
    });
  };
  // const { data } = useQuery("getViewToReceving");

  console.log(data);
  const columns = React.useMemo(
    () => [
        {
        Header: t("fx"),
        accessor: "FX_Name",
       
      },
      {
        Header: t("days"),
        accessor: "DAYS",
      },
      {
        Header: t("fxCorrection"),
        accessor: "FX_Correction",
        width: 120, // fixed width in pixels
        maxWidth: 120, // optional: prevent expanding
        minWidth: 120, // optional: prevent shrinking
      },

      {
        Header: t("actions"),
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

              <button type="button" onClick={() => deleteOrder(a.ID)}>
                <i className="mdi mdi-delete " />
              </button>
            </div>
            {/* {/ </Link> /} */}
          </>
        ),
      },
    ],
    [t]
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
      toast.error(t("passwordMismatch"));
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

        toast.success(t("userResetSuccess"));
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
    alert(t("passwordCopied"));
  };

  const handleGenerateClick = (event) => {
    event.preventDefault(); // Prevent page reload
    createPassword(12); // Call password generator
  };
  useEffect(() => {
    createPassword(12);
  }, []);
  return (
    <Card
      title={t("currencyManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/currency_create")}
          className="btn button btn-info"
        >
          {t("create")}
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
                {t("resetUserForm")}
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
                        <h6>{t("passwordGenerator")}</h6>
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
                              {t("generate")}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <h6>{t("password")}</h6>
                        <input
                          type="password"
                          placeholder={t("password")}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-lg-6">
                        <h6>{t("confirmPassword")}</h6>
                        <input
                          type="password"
                          placeholder={t("confirmPassword")}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <div className="resetBtn d-flex justify-content-center">
                        <div>
                          <button onClick={handleReset}>{t("reset")}</button>
                        </div>
                        <div>
                          <Link to="/user" className="btn btn-danger">
                            {t("cancel")}
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
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default Currency;
