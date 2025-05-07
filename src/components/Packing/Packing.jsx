import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import CloseIcon from "@mui/icons-material/Close";
const EanPacking = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [viewData, setViewData] = useState("");
  const getEanPackaging = () => {
    axios.get(`${API_BASE_URL}/getToPack`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getEanPackaging();
  }, []);
  const formatTwoDecimals = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  const noDecimal = (value) => {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return ""; // if invalid date

    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = String(dateObj.getFullYear()); // last 2 digits

    const hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
  };
  const [id, setId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [restoredRows, setRestoredRows] = useState([]);

  const form = useForm({
    defaultValues: {
      user_id: localStorage.getItem("id"),
      sorting_id: id,
      Quantity_on_Hand: "",
      Crates_on_Hand: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await axios.post(`${API_BASE_URL}/SortingStockWaste`, {
          ...value,
          Quantity_on_Hand: parseInt(value.Qty_on_hand, 10),
          Crates_on_Hand: parseInt(value.Crates_on_hand, 10),
        });
        console.log(response.status); // Log the response object
        if (response.status == 200) {
          const accessResponse = await axios.post(
            `${API_BASE_URL}/ReleaseAccess`,
            {
              id: id,
              accesstype: 4, // Cancel action
            }
          );

          console.log(
            "Access file updated (inside closeButton):",
            accessResponse.data
          );

          toast.success("Ean Packing update successful");
          getEanPackaging();
          setIsOpen(false);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
  });

  // const closeModal = () => {

  //   setIsOpen(false);
  // };
  const closeModal = async () => {
    try {
      // First: update access file
      const accessResponse = await axios.post(`${API_BASE_URL}/ReleaseAccess`, {
        id: id,
        accesstype: 4, // Cancel action
      });

      console.log(
        "Access file updated (inside closeButton):",
        accessResponse.data
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating access file in closeButton:", error);
      toast.error("An error occurred while closing.");
    }
  };
  // const openModal = (id = null) => {
  //   setId(id);
  //   form.reset();
  //   setIsOpen(true);
  // };
  const openModal = async (id = null) => {
    try {
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: id,
          accesstype: 4, // Mark as in use
        }
      );
      console.log(accessResponse);
      // Assuming the API returns something like { success: true } or status code 200
      if (accessResponse?.data?.success) {
        setId(id);
        form.reset();
        setIsOpen(true);
      } else {
        toast.warning(accessResponse?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching statement:", error);
      toast.error("An error occurred while accessing the file.");
    }
  };
  const restoreEanPackage = async (id, id1) => {
    try {
      // Check access
      const accessResponse = await axios.post(
        `${API_BASE_URL}/Checkeaccessfile`,
        {
          id: id,
          accesstype: 4, // Mark as in use
        }
      );

      console.log(accessResponse);

      if (accessResponse?.data?.success) {
        if (restoredRows.includes(id)) return;

        const response = await axios.post(`${API_BASE_URL}/restoreEanPacking`, {
          sorting_id: id,
          pod_code: id1,
          user_id: localStorage.getItem("id"),
        });

        console.log(response);

        if (response?.data?.success === false) {
          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        } else if (response?.data?.success === true) {
          // Release access after successful restore
          const releaseResponse = await axios.post(
            `${API_BASE_URL}/ReleaseAccess`,
            {
              id: id,
              accesstype: 4, // Cancel action
            }
          );
          console.log("Released access:", releaseResponse?.data);

          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        }

        // Refresh and update restored rows
        getEanPackaging();
        setRestoredRows((prev) => [...prev, id]);
      } else {
        toast.warning(accessResponse?.data?.message);
      }
    } catch (error) {
      console.error("Error during restoreEanPackage:", error);
      getEanPackaging();
      toast.error("Something went wrong. Please try again.");
    }
  };

  // const restoreEanPackage = (id, id1) => {
  //   if (restoredRows.includes(id)) {
  //     return;
  //   }

  //   axios
  //     .post(`${API_BASE_URL}/restoreEanPacking`, {
  //       sorting_id: id,
  //       pod_code: id1,
  //       user_id: localStorage.getItem("id"),
  //     })
  //     .then((response) => {
  //       if (response?.data?.success == false) {
  //         toast.warn(response.data.message, {
  //           autoClose: 1000,
  //           theme: "colored",
  //         });
  //         getEanPackaging();
  //       }
  //       console.log(response);
  //       if (response?.data?.success == true) {
  //         getEanPackaging();
  //         toast.success(response.data.message, {
  //           autoClose: 1000,
  //           theme: "colored",
  //         });
  //       }

  //       setRestoredRows([...restoredRows, id]);
  //     })
  //     .catch((error) => {
  //       getEanPackaging();
  //       console.log(error);
  //     });
  // };
  const columns = useMemo(
    () => [
      {
        Header: () => <div style={{ textAlign: "center" }}>PO CODE</div>,
        accessor: "PODCODE",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Vender Name</div>,
        accessor: "Vendor_Name",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        // if your table supports it
      },
      {
        Header: () => <div style={{ textAlign: "center" }}> Name</div>,

        accessor: "Name_EN",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        headerStyle: { textAlign: "left" },
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Date</div>,
        accessor: (row) => new Date(row.Date).toLocaleDateString(),
        id: "Date", // important when using function accessor
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Crates</div>,
        accessor: "Crates",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {formatTwoDecimals(value)}{" "}
            {/* <-- correctly calling the function */}
          </div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Quantity</div>,
        accessor: "Quantity",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Unit</div>,
        accessor: "Unit",
        Cell: ({ value }) => <div style={{ textAlign: "center" }}>{value}</div>,
      },

      {
        Header: () => <div style={{ textAlign: "center" }}>Cost</div>,
        accessor: "Cost",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>QTY / Crate</div>,

        accessor: "Qty/Crate",
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>{formatTwoDecimals(value)}</div>
        ),
      },
      {
        Header: () => <div style={{ textAlign: "center" }}>Status</div>,

        accessor: "Status",
        Cell: ({ value }) => <div style={{ textAlign: "left" }}>{value}</div>,
        headerStyle: { textAlign: "left" },
      },

      {
        Header: "Actions",
        accessor: (a) => {
          return (
            <>
              {/* <Link className="me-2" state={{ from: a }} to="/newEanPacking">
                <i
                  className="mdi mdi-check"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </Link> */}
              <button
                onClick={async () => {
                  try {
                    const res = await axios.post(
                      `${API_BASE_URL}/Checkeaccessfile`,
                      {
                        id: a.sorting_id,
                        accesstype: 4, // Mark as in use
                      }
                    );

                    if (res?.data?.success) {
                      navigate("/newEanPacking", {
                        state: { from: a },
                      });
                    } else {
                      toast.warning(res?.data?.message);
                    }
                  } catch (error) {
                    console.error("Access API error:", error);
                    toast.error(
                      "Something went wrong while checking file access."
                    );
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <i
                  className="mdi mdi-check"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
              <button
                className="me-2"
                type="button"
                onClick={() => openModal(a.sorting_id)}
              >
                <i
                  className="mdi mdi-delete"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
              <button
                className="me-2"
                type="button"
                onClick={() => restoreEanPackage(a.sorting_id, a.pod_code)}
                disabled={restoredRows.includes(a.sorting_id)}
              >
                <i
                  className="mdi mdi-restore"
                  style={{
                    width: "20px",
                    color: "#203764",
                    fontSize: "22px",
                    marginTop: "10px",
                  }}
                />
              </button>
              <button
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#modalView"
                onClick={() => setViewData(a)}
              >
                <i
                  className="mdi mdi-eye"
                  style={{
                    width: 20,
                    color: "rgb(32, 55, 100)",
                    fontSize: 22,
                    marginTop: 10,
                  }}
                />
              </button>
            </>
          );
        },
      },
    ],
    [restoredRows]
  );
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Code",
  //       accessor: "pod_code",
  //       className: "poCode",
  //     },
  //     {
  //       Header: "Name",
  //       accessor: "produce",
  //     },
  //     {
  //       Header: "Quantity",
  //       accessor: "available_qty",
  //     },
  //     {
  //       Header: "Unit",
  //       accessor: "Unit",
  //     },
  //     {
  //       Header: "Cost",
  //       accessor: "sorted_cost",
  //     },
  //     {
  //       Header: "Actions",
  //       accessor: (a) => {
  //         return (
  //           <>
  //             <Link state={{ from: a }} to="/newEanPacking">
  //               <i
  //                 className="mdi mdi-check"
  //                 style={{
  //                   width: "20px",
  //                   color: "#203764",
  //                   fontSize: "22px",
  //                   marginTop: "10px",
  //                 }}
  //               />
  //             </Link>
  //             <button type="button" onClick={() => openModal(a.sorting_id)}>
  //               <i
  //                 className="mdi mdi-delete"
  //                 style={{
  //                   width: "20px",
  //                   color: "#203764",
  //                   fontSize: "22px",
  //                   marginTop: "10px",
  //                 }}
  //               />
  //             </button>
  //             <button
  //               type="button"
  //               onClick={() => restoreEanPackage(a.sorting_id, a.pod_code)}
  //               disabled={restoredRows.includes(a.sorting_id)}
  //             >
  //               <i
  //                 className="mdi mdi-restore"
  //                 style={{
  //                   width: "20px",
  //                   color: "#203764",
  //                   fontSize: "22px",
  //                   marginTop: "10px",
  //                 }}
  //               />
  //             </button>
  //           </>
  //         );
  //       },
  //     },
  //   ],
  //   [restoredRows]
  // );

  return (
    <>
      {/* view modal */}
      <div
        className="modal fade"
        id="modalView"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                View
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
              <div className="row mt-2 inputMarginUnset formCreate">
                <div className="form-group col-lg-6">
                  <div className="parentPurchaseView mb-3">
                    <div className="me-3">
                      <strong>
                        User Name <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.user_name}</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6"></div>
                <div className="form-group col-lg-4">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Name :<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.Name_EN}</p>
                    </div>
                  </div>

                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Quantity <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{viewData?.Quantity}</p>
                    </div>
                  </div>
                </div>
                <div className="form-group col-lg-4">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Quantity used
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatTwoDecimals(viewData?.sorting_quantity)}</p>
                    </div>
                  </div>
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Number of Staff
                        <span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{noDecimal(viewData?.staff_no)}</p>
                    </div>
                  </div>
                </div>

                <div className="form-group col-lg-4">
                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        Start Time<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatDate(viewData?.Start_Time)}</p>
                    </div>
                  </div>

                  <div className="parentPurchaseView">
                    <div className="me-3">
                      <strong>
                        End Time<span>:</span>
                      </strong>
                    </div>
                    <div>
                      <p>{formatDate(viewData?.End_Time)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table-responsive centerTh mt-4">
                <table
                  id="example"
                  className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>EAN</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Ean Cost</th>
                      <th>Average Weight</th>
                      <th>Ean Per KG</th>
                      <th>Ean Per Hour</th>
                      <th>Wastage</th>
                    </tr>
                  </thead>
                  <tbody style={{ border: "unset" }}>
                    <tr>
                      <td>xyz</td>
                      <td style={{ textAlign: "right" }}>
                        {formatTwoDecimals(213.123)}
                      </td>
                      <td style={{ textAlign: "center" }}>Box</td>
                      <td style={{ textAlign: "right" }}>
                        {formatTwoDecimals(23.123)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatTwoDecimals(36.123)}
                      </td>
                      <td style={{ textAlign: "right" }}>3</td>
                      <td style={{ textAlign: "right" }}>
                        {formatTwoDecimals(23213.123)}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {formatTwoDecimals(1300.123)}
                      </td>
                    </tr>
                  </tbody>
                  <tbody />
                </table>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              {/* <button type="button" className="btn btn-primary">
               Submit
              </button> */}
            </div>
          </div>
        </div>
      </div>
      {/* view modal end */}
      <Card title="Packing Management">
        <TableView columns={columns} data={data} />
      </Card>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center modalEanEdit">
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="crossArea">
              <h3>Edit Details</h3>
              <p onClick={closeModal}>
                <CloseIcon />
              </p>
            </div>
            <form.Provider>
              <form
                className="formEan formCreate p-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <div className="p-3">
                  <div className="form-group">
                    <label>Quantity on Hand</label>
                    <form.Field
                      name="Qty_on_hand "
                      children={(field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>Crates on Hand</label>
                    <form.Field
                      name="Crates_on_hand "
                      children={(field) => (
                        <input
                          type="number"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="modal-footer d-flex justify-content-center">
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-gray-300 px-4 py-2 rounded"
                      onClick={closeModal}
                    >
                      Close
                    </button>

                    <button
                      type="submit"
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </form.Provider>
          </div>
        </div>
      )}
    </>
  );
};

export default EanPacking;
