// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import Barcode from "react-barcode";
// import { Link, useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../../Url/Url";
// import { Card } from "../../../card";
// import { TableView } from "../../table";
// import { toast } from "react-toastify";

// const ItfNew = () => {
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);
//   const [isOn, setIsOn] = useState(true);
//   const getItfData = () => {
//     axios
//       .get(`${API_BASE_URL}/getItf`)
//       .then((response) => {
//         if (response.data.success == true) {
//           setData(response.data.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   useEffect(() => {
//     getItfData();
//   }, []);
//   const updateBankStatus = (bankID) => {
//     const request = {
//       itf_id: bankID,
//     };

//     axios
//       .post(`${API_BASE_URL}/StatusChangeItf`, request)
//       .then((response) => {
//         if (response.data.success == true) {
//           toast.success(response.data.message, {
//             autoClose: 1000,
//             theme: "colored",
//           });
// 		  getItfData();
//           return;
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: (a) => a.itf_name_en,
//       },
//       {
//         Header: "ITF Code",
//         accessor: (a) => (
//           <div style={{}}>
//             <Barcode width={0.8} height={30} value={"1000000"} />
//           </div>
//         ),
//       },

//       {
//         Header: "ITF NET Weight",
//         accessor: (a) => `${(a.itf_net_weight / 1000).toFixed(1)} KG`,
//       },
//       {
//         Header: "ITF Gross Weight",
//         accessor: (a) => `${(a.itf_gross_weight / 1000).toFixed(1)} KG`,
//       },
//       {
//         Header: "ITF VVSW",
//         accessor: (a) => a.vvsw,
//       },
//       {
//         Header: "Box Pallete",
//         accessor: (a) => a.box_pallet,
//       },
// 	  {
//         Header: "Status",
//         accessor: (a) => (
//           <label
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               marginBottom: "10px",
//             }}
//             className="toggleSwitch large"
//             onclick=""
//           >
//             <input
//               onClick={() => updateBankStatus(a.itf_id)}
//               checked={a.status == "1" ? true : false}
//               type="checkbox"
//             />
//             <span>
//               <span>OFF</span>
//               <span>ON</span>
//             </span>
//             <a></a>
//           </label>
//         ),
//       },
//       {
//         Header: "Actions",
//         accessor: (a) => (
//           <Link to="/edit_itf" state={{ from: a }}>
//             <i
//               i
//               className="mdi mdi-pencil"
//               style={{
//                 width: "20px",
//                 color: "#203764",
//                 fontSize: "22px",
//                 marginTop: "10px",
//               }}
//             />
//           </Link>
//         ),
//       },

//       {
//         Header: "Salaries",
//         accessor: (a) => <div style={{ marginTop: "10px" }}>{"10000000"}</div>,
//       },
//     ],
//     []
//   );

//   return (
//     <Card
//       title="ITF Setup Management"
//       endElement={
//         <button
//           type="button"
//           onClick={() => navigate("/add_itf")}
//           className="btn button btn-info"
//         >
//           Create
//         </button>
//       }
//     >
//       <TableView columns={columns} data={data} />
//     </Card>
//   );
// };

// export default ItfNew;
import axios from "axios";
import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import { toast } from "react-toastify";

const ItfNew = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const getItfData = () => {
    axios
      .get(`${API_BASE_URL}/getItf`)
      .then((response) => {
        if (response.data.success == true) {
          setData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getItfData();
  }, []);
  const updateBankStatus = (bankID) => {
    const request = {
      itf_id: bankID,
    };

    axios
      .post(`${API_BASE_URL}/StatusChangeItf`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getItfData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: (a) => a.ITF_Internal_Name_EN,
      },
      {
        Header: "ITF Code",
        accessor: (a) =>
          a.ITFCODE && a.ITFCODE.trim() ? ( // Check for undefined, null, and empty string
            <div>
              <Barcode width={0.8} height={30} value={a.ITFCODE} />
            </div>
          ) : (
            "" // Return nothing if itf_code is undefined, null, or empty
          ),
      },
      {
        Header: "ITF NET Weight",
        accessor: (a) => {
          const weight = Number(a.itf_Net_Weight);
          return !isNaN(weight) ? `${weight.toFixed(1)} KG` : "N/A"; // Ensure it's a valid number before formatting
        },
      },
      {
        Header: "ITF Gross Weight",
        accessor: (a) => {
          const weight = Number(a.Calculated_ITF_Gross_Weight);
          return !isNaN(weight) ? `${weight.toFixed(1)} KG` : "N/A"; // Ensure it's a valid number before formatting
        },
      },

      {
        Header: "ITF VVSW",
        accessor: (a) => a.ITF_VVSW,
      },
      {
        Header: "Box Pallete",
        accessor: (a) => a.itf_box_pallet,
      },
      {
        Header: "Status",
        accessor: (a) => (
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
            className="toggleSwitch large"
            onclick=""
          >
            <input
              onClick={(e) => {
                e.stopPropagation(); // Ensure only the input click works
                updateBankStatus(a.ID);
              }}
              checked={a.Available == "1" ? true : false}
              type="checkbox"
              style={{
                width: "20px", // Adjust width and height if needed
                height: "20px",
                cursor: "pointer", // Make it clear that this is the clickable area
              }}
            />
            <span
              style={{
                pointerEvents: "none", // Prevent clicks on the surrounding label text
              }}
            >
              <span>OFF</span>
              <span>ON</span>
            </span>
            <a></a>
          </label>
        ),
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <Link to="/edit_itf" state={{ from: a }}>
            <i
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
            />
          </Link>
        ),
      },

    ],
    []
  );

  return (
    <Card
      title="ITF Setup Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_itf")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default ItfNew;
