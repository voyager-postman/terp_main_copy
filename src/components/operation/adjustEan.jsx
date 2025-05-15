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
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export const AdjustEan = () => {
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
            <Link to="/adjustView" state={{ from: { ...a } }}>
              <i className="mdi mdi-eye"></i>
            </Link>

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
  console.log;
  return (
    <>
      <Card title={"Adjust EAN"}>
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
