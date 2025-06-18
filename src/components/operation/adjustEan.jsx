// import { useMemo, useState, useEffect } from "react";
// import { useForm } from "@tanstack/react-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { API_BASE_URL } from "../../Url/Url";
// import { Link, useNavigate } from "react-router-dom";
// import { Card } from "../../card";
// import { TableView } from "../table";
// import { toast } from "react-toastify";

// export const AdjustEan = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [restoredRows, setRestoredRows] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   // const form = useForm({
//   //   defaultValues: {
//   //     sortingid: id,
//   //     adjustqty: "",
//   //     crates: "",
//   //   },
//   //   onSubmit: async ({ value }) => {
//   //     try {
//   //       await axios.post(`${API_BASE_URL}/aslWastage`, {
//   //         ...value,
//   //       });
//   //       toast.success("Order update successfully");
//   //       refetch();
//   //     } catch (e) {
//   //       toast.error("Something went wrong");
//   //     }
//   //   },
//   // });

//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   const openModal = ( ) => {
//     setIsOpen(true);
//   };

//   const getAdustEan = () => {
//     axios.get(`${API_BASE_URL}/getAdjustEanStock`).then((res) => {
//       setData(res.data.data || []);
//     });
//   };
//   useEffect(() => {
//     getAdustEan();
//   }, []);

//   const restoreAdjustEan = (id) => {
//     if (restoredRows.includes(id)) {
//       return; // Do nothing if already restored
//     }

//     axios
//       .post(`${API_BASE_URL}/restorePackingCommon`, {
//         packingCommonid: id,
//       })
//       .then((response) => {
//         toast.success("EAN Packing Restore Successfully", {
//           autoClose: 1000,
//           theme: "colored",
//         });
//         setRestoredRows([...restoredRows, id]);
//         getAdustEan();
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const columns = useMemo(
//         () => [
//       {
//         Header: "Name",
//         accessor: "name",
//       },
//       {
//         Header: "Brand",
//         accessor: "brand",
//       },
//       {
//         Header: "Quantity Available",
//         accessor: "qty_available",
//       },
//       {
//         Header: "Average Weight(g)",
//         accessor: "Average_Weight_g",
//       },
//       {
//         Header: "Average Cost",
//         accessor: "avg_cost",
//       },
//       {
//         Header: "Actions",
//         accessor: (a) => (
//           <div className="editIcon gap-2">
//             <i className="mdi mdi-eye"></i>
//             <Link
//               to="/repackEan"
//               state={{
//                 from: a,
//               }}
//             >
//               <i className="mdi mdi-pencil" />
//             </Link>
//             <i className="mdi mdi-delete" onClick={() => openModal(1)}/>

//             <button
//               type="button"
//               onClick={() => restoreAdjustEan(a.packing_common_id)}
//               disabled={restoredRows.includes(a.packing_common_id)}
//             >
//               <i className="mdi mdi-restore" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     [restoredRows]
//   );

//   return (
//     <>
//       <Card title={"Adjust EAN"}>
//         <TableView columns={columns} data={data} />
//       </Card>
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
//           <div
//             className="fixed w-screen h-screen bg-black/20"
//             onClick={closeModal}
//           />
//           <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
//             <h3>Edit Details</h3>
//             <form.Provider>
//               <form
//                 className="formEan formCreate"
//                 onSubmit={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   void form.handleSubmit();
//                 }}
//               >
//                 <div className="form-group">
//                   <label>Quantity on Hand</label>
//                   <form.Field
//                     name="adjustqty"
//                     children={(field) => (
//                       <input
//                         type="number"
//                         name={field.name}
//                         // value={field.state.value}
//                         // onBlur={field.handleBlur}
//                         // onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label>Crates on Hand</label>
//                   <form.Field
//                     name="crates"
//                     children={(field) => (
//                       <input
//                         type="number"
//                         // name={field.name}
//                         // value={field.state.value}
//                         // onBlur={field.handleBlur}
//                         // onChange={(e) => field.handleChange(e.target.value)}
//                       />
//                     )}
//                   />
//                 </div>
//                 <div className="flex gap-2 justify-end">
//                   <button
//                     type="button"
//                     className="bg-gray-300 px-4 py-2 rounded"
//                     onClick={closeModal}
//                   >
//                     Close
//                   </button>

//                   <button
//                     type="submit"
//                     className="bg-black text-white px-4 py-2 rounded"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </form>
//             </form.Provider>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { format } from "date-fns";

export const AdjustEan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};

  //  const [data, setData] = useState("");
  console.log(from);
  const [tableData, setTableData] = useState([]);
  const [totalDetails, setTotalDetails] = useState("");
  const [dataId, setDataId] = useState("");

  const adjustView = () => {
    axios
      .post(`${API_BASE_URL}/getAdjustEanView`, {
        packing_common_id: dataId?.packing_common_id,
      })
      .then((response) => {
        console.log(response);
        setTotalDetails(response?.data?.details);
        // setData(response?.data?.data);

        setTableData(response?.data?.tableData);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
        return false;
      });
  };

  useEffect(() => {
    adjustView();
  }, []);
  const { data: details, refetch: getOrdersDetails } = useQuery(
    `getOrdersDetails?id=${dataId?.order_id}`,
    {
      enabled: !!dataId?.order_id,
    }
  );
  // for view

  const [data, setData] = useState([]);
  const [restoredRows, setRestoredRows] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [crates, setCrates] = useState("");

  const getAdjustEan = () => {
    axios.get(`${API_BASE_URL}/getAdjustEanStock`).then((res) => {
      console.log(res);
      setData(res.data.data || []);
    });
  };

  useEffect(() => {
    getAdjustEan();
  }, []);
  console.log(data);

  const openModal = (id) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelectedId(null);
    setIsOpen(false);
  };

  const deleteAdjustEan = (id) => {
    setSelectedId(id);
    setIsOpen(true);
    // Further logic for deletion can be added here if needed
  };

  const restoreAdjustEan = (id) => {
    if (restoredRows.includes(id)) {
      return;
    }

    axios
      .post(`${API_BASE_URL}/restorePackingCommon`, {
        packingCommonid: id,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        if (response?.data?.success == false) {
          toast.warn(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getAdjustEan();
        }
        console.log(response);
        if (response?.data?.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getAdjustEan();
        }
        setRestoredRows([...restoredRows, id]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // const handleSave = async () => {
  //   try {
  //     await axios.post(`${API_BASE_URL}/aslWastage`, {
  //       sortingid: selectedId,
  //       adjustqty: adjustQty,
  //       crates: crates,
  //     });
  //     toast.success("Order updated successfully");
  //     closeModal();
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   }
  // };
  const handleSave = () => {
    axios
      .post(`${API_BASE_URL}/deleteAdjustEAN`, {
        packing_ean_id: selectedId,
        Deleted_Quantity: adjustQty,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);

        setIsOpen(false);
        if (response.status === 200) {
          toast.success("Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
        }
        setAdjustQty("");
        getAdjustEan();
      })
      .catch((error) => [console.log(error)]);
  };
  useEffect(() => {
    if (dataId) {
      console.log("Updated dataId:", dataId); // ✅ Logs updated value after state changes
    }
  }, [dataId]);

  const { data: orderDetails, refetch: getOrdersDetail } = useQuery(
    ["getOrdersDetails", dataId?.order_id],
    () =>
      axios
        .get(`${API_BASE_URL}/getOrdersDetails?id=${dataId?.order_id}`)
        .then((res) => res.data),
    {
      enabled: false, // prevent automatic fetch
    }
  );

  const viewPacking = (a) => {
    setDataId(a); // update state

    axios
      .post(`${API_BASE_URL}/getAdjustEanView`, {
        packing_common_id: a?.packing_common_id,
      })
      .then((response) => {
        console.log(response);
        setTotalDetails(response?.data?.details);
        setTableData(response?.data?.tableData);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });

    if (a?.order_id) {
      getOrdersDetail(); // manually trigger the query
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date_",
      },
      {
        Header: "Code",
        accessor: "pod_code",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Brand",
        accessor: "brand",
      },
      {
        Header: "Quantity Available",
        accessor: "qty_available",
      },
      {
        Header: "Unit",
        accessor: "unit",
      },
      {
        Header: "Average Weight(g)",
        accessor: "average_weight",
      },
      {
        Header: "Average Cost",
        accessor: "avg_cost",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon gap-2">
            <button onClick={() => viewPacking(a)}>
              <i
                type="button"
                className="mdi mdi-eye"
                data-bs-toggle="modal"
                data-bs-target="#adjustEanView"
              ></i>
            </button>
            <button onClick={() => deleteAdjustEan(a.packing_ean_id)}>
              <i className="mdi mdi-delete" />
            </button>
            <Link
              to="/repackEan"
              state={{
                from: a,
              }}
            >
              <i className="mdi mdi-pencil" />
            </Link>

            {parseFloat(a.qty_available) === parseFloat(a.Packed) && (
              <button
                type="button"
                onClick={() => restoreAdjustEan(a.packing_common_id)}
                disabled={restoredRows.includes(a.packing_common_id)}
              >
                <i className="mdi mdi-restore" />
              </button>
            )}
          </div>
        ),
      },
    ],
    [restoredRows]
  );
  return (
    <>
      {/* view modal */}

      <div
        className="modal fade"
        id="adjustEanView"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modalShipTo">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Adjust Ean View
              </h1>
              <button
                type="button"
                className="btn-close btnCloseAdjust"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="mdi mdi-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <div>
                {/* End databaseTableSection */}

                <div className="tab-content pt-0 pb-0">
                  <div className="tab-pane active" id="header" role="tabpanel">
                    <div
                      id="datatable_wrapper"
                      className="information_dataTables dataTables_wrapper dt-bootstrap4 "
                    >
                      {/*---------------------------table data---------------------*/}

                      <div className="adjustEanQuan">
                        <div className="row">
                          <div className="col-lg-3">
                            <p>
                              <span>Used Quantity :</span>
                              <strong>{totalDetails?.Qty}</strong>
                            </p>

                            <p>
                              {" "}
                              <span>Number of Staff :</span>{" "}
                              <strong>{totalDetails?.Staff} </strong>
                            </p>

                            <p>
                              <span>Start Time :</span>
                              <strong>
                                {totalDetails?.Start_Time
                                  ? format(
                                      new Date(totalDetails?.Start_Time),
                                      "HH:mm dd-MM-yyyy"
                                    )
                                  : "N/A"}{" "}
                              </strong>
                            </p>

                            <p>
                              {" "}
                              <span>End Time :</span>{" "}
                              <strong>
                                {totalDetails?.End_Time
                                  ? format(
                                      new Date(totalDetails?.End_Time),
                                      "HH:mm dd-MM-yyyy"
                                    )
                                  : "N/A"}{" "}
                              </strong>
                            </p>
                          </div>
                          <div className="col-lg-3">
                            <p>
                              <span>Name :</span>
                              <strong>{dataId?.name}</strong>
                            </p>

                            <p>
                              {" "}
                              <span>Brand :</span>{" "}
                              <strong>{dataId?.brand} </strong>
                            </p>

                            <p>
                              <span>Quantity:</span>
                              <strong>{dataId?.Qty}</strong>
                            </p>

                            <p>
                              {" "}
                              <span>Unit :</span>
                              <strong>{dataId?.unit}</strong>
                            </p>
                          </div>
                          {/* <div className="col-lg-3">
                                            <p>
                                              {" "}
                                              <span> Name :</span> <strong>{from?.name}</strong>
                                            </p>
                                            <p>
                                              {" "}
                                              <span> Quantity :</span>{" "}
                                              <strong>{from?.qty_available}</strong>
                                            </p>
                                            <p>
                                              {" "}
                                              <span>Unit :</span> <strong></strong>
                                            </p>
                                          </div> */}
                        </div>
                      </div>
                      <div
                        id="datatable_wrapper"
                        className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                      >
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
                              <th>EAN Cost</th>
                              <th>Average Weight</th>
                              <th>EAN Per Kg</th>
                              <th>EAN Per Hour </th>
                              <th>Wastage </th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData?.map((item, i) => {
                              return (
                                <tr
                                  className="rowCursorPointer"
                                  data-bs-toggle="modal"
                                  data-bs-target="#myModal"
                                >
                                  <td>{item.ean_name_en}</td>
                                  <td>{item.Qty}</td>
                                  <td>{item.unit_name}</td>
                                  <td>{item.EAN_COST}</td>
                                  <td>{item.average_weight}</td>
                                  <td>{item.EanPerKg}</td>
                                  <td>{item.EanPerHour}</td>
                                  <td>{item.Wasted}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    {/* <button className="btn btn-primary" type="submit" name="signup">
                                      Create
                                    </button> */}
                    <Link
                      className="btn btn-danger"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    >
                      Close
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {/* <button type="button" className="btn btn-primary">
                          Save changes
                        </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* view modal  end*/}
      <Card title={"EAN"}>
        <TableView columns={columns} data={data} />
      </Card>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal}
          />
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full z-50">
            <h3>Edit Details</h3>
            <div className="formEan formCreate">
              <div className="form-group">
                <label>Quantity on Hand</label>
                <input
                  type="Quantity"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded submitButton"
                  onClick={handleSave}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
