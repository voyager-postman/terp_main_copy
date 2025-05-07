// import {React,useEffect,useState} from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../../Url/Url";
// import axios from 'axios';
// const Notification = () => {
//   const navigate = useNavigate();
//   const showCreatenoti = () => {
//     navigate("/createNotification");
//   };
//   // pp
//   const [data, setData] = useState([]);
  

//   useEffect(() => {
//     axios.get(`${API_BASE_URL}/GetNotificationList`)
//       .then(response => {
//         console.log(response.data.data)
//         setData(response.data.data);
//         setLoading(false);
//       })
//       .catch(error => {
//         setError(error);
//         setLoading(false);
//       });
//   }, []);
  
//   // pp
//   return (
//     <div className="container-fluid">
//       <div className="bg-white rounded border">
//         <div className="grayBgColor px-4 py-3 rounded-t">
//           <div className="flex justify-between items-center exportPopupBtn">
//             <h6 className="font-weight-bolder mb-0">Notification Management</h6>
//             <button
//               type="button"
//               class="btn button btn-info"
//               onClick={showCreatenoti}
//             >
//               Create
//             </button>
//           </div>
//         </div>
//         <div className="px-2 md:px-4">
//           <div className="top-space-search-reslute">
//             <div className="tab-content px-2 md:!px-4">
//               <div className="parentProduceSearch">
//                 <div className="entries">
//                   <small>Show</small>{" "}
//                   <select>
//                     <option value={10}>10</option>
//                     <option value={25}>25</option>
//                     <option value={50}>50</option>
//                     <option value={100}>100</option>
//                   </select>{" "}
//                   <small>entries</small>
//                 </div>
//                 <div>
//                   <input type="search" placeholder="search" />
//                 </div>
//               </div>
//               <div className="tab-pane active" id="header" role="tabpanel">
//                 <div
//                   id="datatable_wrapper"
//                   className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
//                 >
//                   <table
//                     role="table"
//                     id="example"
//                     className="display table table-hover table-striped borderTerpProduce"
//                     style={{ width: "100%" }}
//                   >
//                     <thead>
//                       <tr role="row">
//                         <th colSpan={1} role="columnheader">
//                         Notification Name
//                         </th>
//                         <th colSpan={1} role="columnheader">
//                         Notification Messages
//                         </th>
//                         <th colSpan={1} role="columnheader">
//                         Client
//                         </th>
//                         <th colSpan={1} role="columnheader">
//                         Consignee
//                         </th>
//                         <th colSpan={1} role="columnheader">
//                         Notify on
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody role="rowgroup">
//                       {data.map((info)=>(
//                         <tr className="rowCursorPointer" role="row">
//                         <td role="cell">{info.notification_name}</td>
//                         <td role="cell">{info.notification_message}</td>
//                         <td role="cell">{info.client_name}</td>
//                         <td role="cell">{info.consignee_name}</td>
//                         <td role="cell">{info.notify_on}</td>
//                       </tr>

//                       ))}
                       
//                     </tbody>
//                   </table>
//                   <div className="flex justify-end">
//               <ReactPaginate
//                 previousLabel={"Previous"}
//                 nextLabel={"Next"}
//                 pageCount={pageCount}
//                 onPageChange={changePage}
//                 containerClassName={"paginationBttns"}
//                 previousLinkClassName={"previousBttn"}
//                 nextLinkClassName={"nextBttn"}
//                 disabledClassName={"paginationDisabled"}
//                 activeClassName={"paginationActive"}
//               />
//             </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notification;
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { API_BASE_URL } from "../../../Url/Url";
// import { TableView } from "../../table";
// import { Card } from "../../../card";
// import { Link } from "react-router-dom";
// const Notification = () => {
//   const [data,setData]=useState([])
//   const navigate = useNavigate();
//     useEffect(()=>{
//       getdataNotification()
//     },[])
//   const getdataNotification=()=>{
// axios.get(`${API_BASE_URL}/GetNotificationList`).then((response)=>{
//   console.log(response.data.data)
//   setData(response.data.data)
// }).catch((error)=>{
//   console.log(error.response.data)
// })
//   }
  
//   const handleclicknavi =(a)=>{
//     alert(a)
//     navigate('/updateNotification',{state:{data12:a}})
//   }
//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "#",
//         id: "index",
//         accessor: (row, i) => i + 1,
//       },
//       {
//         Header: "Notification Name",
//         accessor: "notification_name",
//       },
//       {
//         Header: "Notification Messages",
//         accessor: "notification_message",
       
//       },
//       {
//         Header: "Client",
//         accessor: "client_name",
//       },
//       {
//         Header: "Consignee",
//         accessor: "consignee_name",
//       },
//       {
//         Header: "Notify on",
//         accessor: "notify_on",  },
//         {
//           Header: "Actions",
//           accessor: (a) => (
//             <>
//               <div className="userIcon ">
//               {/* <Link to="/updateNotification" state={{ from: a }}> */}
//               <Link onClick={()=>{handleclicknavi(a)}}>
//                 <i
//                   i
//                   className="mdi mdi-pencil"
//                   style={{
//                     width: "20px",
//                     color: "#203764",
//                     marginTop: "10px",
//                     paddingTop: "8px",
//                     fontSize: "22px",
//                   }}
//                 />
//               </Link>
              
//                 {/* <button type="button" onClick={() => deleteOrder(a.id)}>
//                   <i className="mdi mdi-delete " />
//                 </button> */}
//                 {/* <Link to="/userResetPass" state={{ from: a }}>
//                   <i className=" ps-2 mdi mdi-restore" />
//                 </Link> */}
//               </div>
//               {/* </Link> */}
//             </>
//           ),
//         },
//     ],
//     []
//   );
//   return (
//     <Card
//       title="User Management"
//       endElement={
//         <button
//           type="button"
//           onClick={() => navigate("/createNotification")}
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

// export default Notification;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { TableView } from "../../table";
import { Card } from "../../../card";
import { Link } from "react-router-dom";

const Notification = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getdataNotification();
  }, []);

  const getdataNotification = () => {
    axios.get(`${API_BASE_URL}/GetNotificationList`).then((response) => {
      console.log(response.data.data);
      setData(response.data.data);
    }).catch((error) => {
      console.log(error.response.data);
    });
  };

  const handleclicknavi = (a) => {
    navigate('/updateNotification', { state: { data12: a } });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "#",
        id: "index",
        accessor: (row, i) => i + 1,
      },
      {
        Header: "Notification Name",
        accessor: "notification_name",
      },
      {
        Header: "Notification Messages",
        accessor: "notification_message",
      },
      {
        Header: "Client",
        accessor: "client_name",
      },
      {
        Header: "Consignee",
        accessor: "consignee_name",
      },
      {
        Header: "Notify on",
        accessor: "notify_on_description",
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <div className="userIcon">
            <i
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                marginTop: "10px",
                paddingTop: "8px",
                fontSize: "22px",
                cursor: "pointer"
              }}
              onClick={() => handleclicknavi(a)}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card
      title="Notification Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/createNotification")}
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

export default Notification;
