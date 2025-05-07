// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "../../../Url/Url";
// import { API_IMAGE_URL } from "../../../Url/Url";
// import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
// import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
// import { useQuery } from "react-query";
// import { Card } from "../../../card";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";

// const AddItf = () => {
//   const location = useLocation();
//   const { from } = location.state || {};
//   const [imagePath, setImagePath] = useState(from?.images || "");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [itfId, setItfId] = useState("");

//   console.log(from);
//   const navigate = useNavigate();
//   const defaultState = {
//     itf_id: from?.ID || "",
//     itf_code: from?.ITFCODE || "",
//     itf_name_en: from?.Name_EN,
//     itf_name_th: from?.ITF_name_th,
//     Notes: from?.Notes,
//     brand_id: from?.Brand,
//     ITF_ean_adjustment: from?.Weight_Adjustment,
//   };

//   const [formValues, setFormValues] = useState([
//     {
//       detail_type: 0,
//       item_id: 0,
//       qty_per_itf: "",
//     },
//   ]);
//   const addFieldHandleChange = (i, e) => {
//     const newFormValues = [...formValues];
//     newFormValues[i][e.target.name] = e.target.value;
//     setFormValues(newFormValues);
//   };

//   const addFormFields = () => {
//     setFormValues([
//       ...formValues,
//       {
//         detail_type: 0,
//         item_id: 0,
//         qty_per_itf: "",
//       },
//     ]);
//   };

//   const removeFormFields = (i) => {
//     const newFormValues = [...formValues];
//     newFormValues.splice(i, 1);
//     setFormValues(newFormValues);
//   };

//   const [editEan, setEditEan] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedItfDetailsId, setSelectedItfDetailsId] = useState(null);
//   const handleClickOpen = (itfDetailsId) => {
//     setSelectedItfDetailsId(itfDetailsId);
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedItfDetailsId(null);
//   };
//   // const getItfEan = () => {
//   //   if (!from?.ID) return;
//   //   axios
//   //     .post(`${API_BASE_URL}/getItfDetails/`, { itf_id: from?.ID })
//   //     .then((response) => {
//   //       console.log(response);
//   //       const mappedData = response.data.data.map((item) => ({
//   //         itf_details_id: item.ID,
//   //         detail_type: item.TYPE, // Ensure this field is correctly set
//   //         item_id: item.Item_ID, // Ensure proper field mapping
//   //         qty_per_itf: item.QTY_Per_ITF || "", // Ensure default value if empty
//   //       }));
//   //       setEditEan(mappedData);
//   //     });
//   // };

//   const coaMapping = {
//     46: "1", // Packaging
//     47: "1",
//     62: "1",
//     48: "2", // Box
//     71: "3", // EAN
//   };
//   const getItfEan = () => {
//     if (!from?.ID) return;
//     axios
//       .post(`${API_BASE_URL}/getItfDetails/`, { itf_id: from?.ID })
//       .then((response) => {
//         console.log(response);
//         const mappedData = response.data.data.map((item) => ({
//           itf_details_id: item.ID,
//           detail_type: coaMapping[item.COA] || "", // <-- use mapped COA value
//           item_id: item.Item_ID, // Ensure proper field mapping
//           qty_per_itf: item.QTY_Per_ITF || "", // Ensure default value if empty
//           COA: item.COA || "",
//         }));
//         setEditEan(mappedData);
//       });
//   };
//   // const handleEditEan = (index, e) => {
//   //   const { name, value } = e.target;

//   //   setEditEan((prevEditEan) => {
//   //     const newEditEan = [...prevEditEan];

//   //     // If changing detail_type, reset item_id
//   //     if (name === "detail_type") {
//   //       newEditEan[index] = {
//   //         ...newEditEan[index],
//   //         [name]: value,
//   //         item_id: "",
//   //       };
//   //     } else {
//   //       newEditEan[index] = { ...newEditEan[index], [name]: value };
//   //     }

//   //     return newEditEan;
//   //   });
//   // };
//   const handleEditEan = (index, e) => {
//     const { name, value } = e.target;

//     setEditEan((prevEditEan) => {
//       const newEditEan = [...prevEditEan];

//       if (name === "detail_type") {
//         newEditEan[index] = {
//           ...newEditEan[index],
//           [name]: value,
//           item_id: "",
//           COA: "", // Reset COA as well when changing type
//         };
//       } else if (name === "item_id") {
//         // Update item_id and COA when item_id changes
//         const detailType = newEditEan[index].detail_type;
//         let selectedItem = null;

//         if (detailType == "1") {
//           selectedItem = packagingList.find((item) => item.ID == value);
//         } else if (detailType == "2") {
//           selectedItem = boxList.find((item) => item.ID == value);
//         } else if (detailType == "3") {
//           selectedItem = eanList.find((item) => item.ID == value);
//         }

//         newEditEan[index] = {
//           ...newEditEan[index],
//           [name]: value,
//           COA: selectedItem?.COA || "", // Update COA based on selected item
//         };
//       } else {
//         newEditEan[index] = {
//           ...newEditEan[index],
//           [name]: value,
//         };
//       }

//       return newEditEan;
//     });
//   };

//   const { data: eanList } = useQuery("GetITFEanList");
//   const { data: packagingList } = useQuery("GetITFPackagingList");
//   const { data: boxList } = useQuery("GetITFBoxList");
//   const { data: brands } = useQuery("getBrand");

//   const deleteItfEan = (eanDetailID) => {
//     console.log(eanDetailID);
//     axios
//       .post(`${API_BASE_URL}/deleteItfPb`, {
//         itf_details_id: eanDetailID,
//       })
//       .then((resp) => {
//         if (resp.data.success == true) {
//           toast.success("Deleted Successfully", {
//             autoClose: 1000,
//             theme: "colored",
//           });
//           handleClose();
//           getItfEan();
//           return;
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   const calculateItf = (id) => {
//     // axios
//     // 	.post(`${API_BASE_URL}/updateItfDetails`, {
//     // 		id: id,
//     // 	})
//     // 	.then((response) => {})
//     // 	.catch((error) => {
//     // 		console.log(error)
//     // 	})
//   };
//   const cancelData = () => {
//     axios
//       .post(`${API_BASE_URL}/deleteItf`, {
//         itf_id: itfId,
//       })
//       .then((response) => {
//         console.log(response);
//         toast.success("Itf Cancel Successfully", {
//           autoClose: 1000,
//           theme: "colored",
//         });
//         navigate("/itfNew");
//       })
//       .catch((error) => {
//         console.log(error);
//         toast.error("Network Error", {
//           autoClose: 1000,
//           theme: "colored",
//         });
//       });
//   };
//   const updateEan = () => {
//     if (!from?.ID) return;

//     axios
//       .post(`${API_BASE_URL}/updateItfDetails`, {
//         itf_id: from?.ID,
//         data: editEan,
//       })
//       .then((response) => {})
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   useEffect(() => {
//     getItfEan();
//   }, []);
//   const [state, setState] = useState(defaultState);
//   const handleChange = (event) => {
//     const { name, value, files } = event.target;
//     if (name === "box_image" && files.length > 0) {
//       const file = files[0];
//       setSelectedImage(URL.createObjectURL(file)); // Update the image preview
//       setImagePath(""); // Clear the image path since a new image is selected
//       setState((prevState) => ({
//         ...prevState,
//         [name]: file, // Store the file object
//       }));
//     } else {
//       setState((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   };

//   const addItfEanData = (itf_id) => {
//     if (formValues.filter((v) => v.item_id != 0).length == 0) return;
//     axios
//       .post(`${API_BASE_URL}/addItfDetails`, {
//         user_id: localStorage.getItem("id"),
//         itf_id: itf_id,
//         data: formValues,
//       })
//       .then((response) => {
//         // generateName(itf_id);
//         console.log(response);
//         // navigate("/itfNew");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
//   const update = (e) => {
//     e.preventDefault();
//     // if (state.itf_name_en.trim() == "" || state.itf_name_th.trim() == "")

//     // if (state.itf_name_en.trim() == "")
//     //   return toast.error("Please enter product name");

//     const formData = new FormData();
//     formData.append("itf_id", state.itf_id);
//     formData.append("itf_name_en", state.itf_name_en);
//     formData.append("itf_name_th", state.itf_name_th);
//     formData.append("itf_code", state.itf_code);
//     formData.append("ITF_ean_adjustment", state.ITF_ean_adjustment);
//     formData.append("Notes", state.Notes ? state.Notes : "");
//     formData.append("user_id", localStorage.getItem("id"));
//     formData.append("brand", state.brand_id);
//     formData.append("images", state.box_image);
//     axios
//       .post(`${API_BASE_URL}/${from?.ID ? "updateItf" : "addItf"}`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       })
//       .then((response) => {
//         if (response.data.success == true) {
//           toast.success("Success", {
//             autoClose: 1000,
//             theme: "colored",
//           });
//           if (from?.ID) {
//             navigate("/itfNew");
//           }
//           const id = response.data?.itf_id || from?.ID;
//           setItfId(id);
//           if (id) {
//             addItfEanData(id);
//             // addItfPbData(id)
//             updateEan();
//             calculateItf(id);
//             // updatePb()
//           }
//         }
//       })
//       .catch((error) => {
//         console.log(error);
//         toast.error("Network Error", {
//           autoClose: 1000,
//           theme: "colored",
//         });
//       });
//   };

//   const confirmCloseWindow = () => {
//     toast.success("Itf Confirm Successful", {
//       autoClose: 1000,
//       theme: "colored",
//     });
//     navigate("/itfNew");
//   };

//   const generateName = async () => {
//     try {
//       console.log(state.brand_id);

//       // Call the first API
//       await axios.post(`${API_BASE_URL}/updateItfDetails`, {
//         itf_id: from?.ID || itfId,
//         data: editEan,
//       });
//       console.log("First API call completed.");

//       // Call the second API
//       const response = await axios.post(`${API_BASE_URL}/ITFgenerateName`, {
//         ITF_ID: itfId || from?.ID,
//         brand: state.brand_id,
//       });

//       // Destructure the response
//       const { ITF_name_th, itf_name_en } = response.data.itfData;
//       console.log(ITF_name_th);

//       // Show a success toast
//       toast.success("Successfully", {
//         autoClose: 1000,
//         theme: "colored",
//       });

//       // Update the state
//       setState((prevState) => ({
//         ...prevState, // Preserve other state properties
//         itf_name_th: ITF_name_th, // Update the Thai name
//         itf_name_en: itf_name_en, // Update the English name
//       }));
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }
//   };
//   console.log(editEan);
//   return (
//     <Card title={`ITF Management / ${from?.ID ? "Update" : "Add"} Form`}>
//       <div className="top-space-search-reslute">
//         <div className="tab-content px-2 md:!px-4">
//           <div className="tab-pane active" id="header" role="tabpanel">
//             <div
//               id="datatable_wrapper"
//               className="information_dataTables dataTables_wrapper dt-bootstrap4"
//             >
//               <div className="formCreate ">
//                 <form action="">
//                   <div className="row formEan">
//                     <div className="col-lg-3 form-group">
//                       <h6>ITF Code</h6>
//                       <input
//                         type="text"
//                         placeholder="ean code"
//                         value={state.itf_code}
//                         name="itf_code"
//                         onChange={handleChange}
//                       />
//                     </div>

//                     <div className="col-lg-3 form-group">
//                       <h6>Product Name EN</h6>
//                       <input
//                         type="text"
//                         placeholder="product name"
//                         value={state.itf_name_en}
//                         name="itf_name_en"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-lg-3 form-group">
//                       <h6>Product Name TH</h6>
//                       <input
//                         type="text"
//                         placeholder="product name"
//                         value={state.itf_name_th}
//                         name="itf_name_th"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-lg-3 form-group">
//                       <h6>Extra Weight</h6>
//                       <input
//                         type="number"
//                         placeholder="Extra weight"
//                         value={state.ITF_ean_adjustment}
//                         name="ITF_ean_adjustment"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-lg-3 form-group itfAutoComplete">
//                       <h6>Brand</h6>
//                       <Autocomplete
//                         disablePortal
//                         options={brands || []} // Ensure brands is defined
//                         getOptionLabel={(option) => option.Name_EN || ""}
//                         value={
//                           brands?.find((item) => item.ID === state.brand_id) ||
//                           null
//                         } // Ensure correct comparison
//                         onChange={(event, value) => {
//                           setState({
//                             ...state,
//                             brand_id: value ? value.ID : "", // Use the correct ID property
//                           });
//                         }}
//                         renderInput={(params) => (
//                           <TextField
//                             {...params}
//                             placeholder="Please select Brand"
//                             style={{ padding: "10px" }}
//                           />
//                         )}
//                       />
//                     </div>

//                     <div className="col-lg-3 form-group">
//                       <h6>Image</h6>
//                       <input
//                         type="file"
//                         id="box_image"
//                         name="box_image"
//                         onChange={handleChange}
//                         // key={fileInputKey}
//                         accept="image/*"
//                         className="d-none"
//                         // onChange={handleFileSelect}
//                       />
//                       <div className="imgFlex">
//                         <div className="pe-4">
//                           <label htmlFor="box_image">
//                             <div className="uploadBorder">
//                               <span>
//                                 Choose Image <CloudUploadIcon />{" "}
//                               </span>
//                             </div>
//                           </label>
//                         </div>
//                       </div>
//                       <div>
//                         {selectedImage && (
//                           <div>
//                             <img
//                               src={selectedImage}
//                               alt="Uploaded"
//                               style={{ width: "200px", height: "200px" }}
//                             />
//                           </div>
//                         )}
//                         {!selectedImage && imagePath && (
//                           <div>
//                             <img
//                               crossorigin="anonymous"
//                               src={`${API_IMAGE_URL}/${imagePath}`}
//                               alt="Existing"
//                               style={{ width: "200px", height: "200px" }}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                     <div className="col-lg-3 form-group">
//                       <h6>Notes</h6>
//                       <input
//                         type="text"
//                         placeholder="notes"
//                         value={state.Notes}
//                         name="Notes"
//                         onChange={handleChange}
//                       />
//                     </div>
//                     <div className="col-lg-3 form-group">
//                       <h6>ITF vvsw</h6>
//                       <p
//                         className={
//                           `${from?.vvsw}`.toLowerCase() == "volume over weight"
//                             ? "text-red-400"
//                             : ""
//                         }
//                       >
//                         {from?.vvsw || "Weight within Limits"}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="addBtnEan">
//                       {itfId || from?.ID ? (
//                         <button
//                           className="my-5"
//                           type="button"
//                           onClick={generateName}
//                         >
//                           Generate Name
//                         </button>
//                       ) : (
//                         ""
//                       )}
//                     </div>
//                   </div>
//                   <div
//                     id="datatable_wrapper"
//                     className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
//                   >
//                     <table
//                       id="example"
//                       className="display transPortCreate table table-hover table-striped borderTerpProduce table-responsive"
//                       style={{ width: "100%" }}
//                     >
//                       <thead>
//                         <tr>
//                           <th>Type</th>
//                           <th>Name</th>
//                           <th className="w-5">Quantity</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {editEan.map((element, index) => (
//                           <tr className="rowCursorPointer">
//                             <td style={{ width: "280px" }}>
//                               <select
//                                 name="detail_type"
//                                 value={element.detail_type}
//                                 onChange={(e) => handleEditEan(index, e)}
//                               >
//                                 <option value="1">Packaging</option>
//                                 <option value="2">Boxes</option>
//                                 <option value="3">EAN</option>
//                               </select>
//                             </td>
//                             <td style={{ width: "280px" }}>
//                               {element.detail_type == "3" ? (
//                                 <select
//                                   name="item_id"
//                                   onChange={(e) => handleEditEan(index, e)}
//                                   value={element.item_id}
//                                 >
//                                   <option value="">Select EAN</option>
//                                   {eanList?.map((item) => (
//                                     <option value={item.ID}>
//                                       {item.Name_EN}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : element.detail_type == "1" ? (
//                                 <select
//                                   name="item_id"
//                                   onChange={(e) => handleEditEan(index, e)}
//                                   value={element.item_id}
//                                 >
//                                   <option value="">Select Packaging</option>
//                                   {packagingList?.map((item) => (
//                                     <option value={item.ID}>
//                                       {item.Name_EN}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : element.detail_type == "2" ? (
//                                 <select
//                                   name="item_id"
//                                   onChange={(e) => handleEditEan(index, e)}
//                                   value={element.item_id}
//                                 >
//                                   <option value="">Select Box</option>
//                                   {boxList?.map((item) => (
//                                     <option value={item.ID}>
//                                       {item.Name_EN}
//                                     </option>
//                                   ))}
//                                 </select>
//                               ) : (
//                                 <></>
//                               )}
//                             </td>
//                             <td>
//                               <input
//                                 type="number"
//                                 name="qty_per_itf"
//                                 value={element.qty_per_itf}
//                                 onChange={(e) => handleEditEan(index, e)}
//                               />
//                             </td>
//                             <td className="editIcon">
//                               <a
//                                 onClick={() =>
//                                   handleClickOpen(element.itf_details_id)
//                                 }
//                               >
//                                 <i className="mdi mdi-trash-can-outline" />
//                               </a>
//                               <Dialog
//                                 fullWidth
//                                 open={open}
//                                 onClose={handleClose}
//                                 aria-labelledby="alert-dialog-title"
//                                 aria-describedby="alert-dialog-description"
//                               >
//                                 <DialogTitle
//                                   id="alert-dialog-title"
//                                   className="text-center"
//                                 >
//                                   {"Are you sure you want to delete?"}
//                                 </DialogTitle>
//                                 <DialogContent className="text-center p-0 m-0 alertDel">
//                                   <DialogContentText id="alert-dialog-description">
//                                     <DeleteSweepIcon
//                                       style={{
//                                         color: "#AF2655",
//                                         fontSize: "70px",
//                                         marginBottom: "20px",
//                                       }}
//                                     />
//                                   </DialogContentText>
//                                 </DialogContent>
//                                 <DialogActions className="text-center d-flex align-items-center justify-content-center">
//                                   <button
//                                     type="button"
//                                     className="btn btn-primary btn-lg btn-block make-an-offer-btn"
//                                     onClick={() => {
//                                       deleteItfEan(selectedItfDetailsId);
//                                       handleClose();
//                                     }}
//                                   >
//                                     Yes
//                                   </button>
//                                   <button
//                                     type="button"
//                                     className="btn btn-primary btn-lg btn-block make-an-offer-btn me-1"
//                                     onClick={handleClose}
//                                   >
//                                     No
//                                   </button>
//                                 </DialogActions>
//                               </Dialog>
//                             </td>
//                           </tr>
//                         ))}
//                         {formValues.map((element, index) => (
//                           <tr className="rowCursorPointer">
//                             <td
//                               style={{ width: "280px" }}
//                               className="itfAutoComplete"
//                             >
//                               <Autocomplete
//                                 disablePortal
//                                 options={[
//                                   { label: "Packaging", value: "1" },
//                                   { label: "Boxes", value: "2" },
//                                   { label: "EAN", value: "3" },
//                                 ]}
//                                 getOptionLabel={(option) =>
//                                   option.label || "Select Type"
//                                 }
//                                 value={
//                                   [
//                                     { label: "Packaging", value: "1" },
//                                     { label: "Boxes", value: "2" },
//                                     { label: "EAN", value: "3" },
//                                   ].find(
//                                     (item) => item.value === element.detail_type
//                                   ) || null
//                                 }
//                                 onChange={(event, value) => {
//                                   addFieldHandleChange(index, {
//                                     target: {
//                                       name: "detail_type",
//                                       value: value?.value || "",
//                                     },
//                                   });
//                                 }}
//                                 renderInput={(params) => (
//                                   <TextField
//                                     {...params}
//                                     placeholder="Select Type"
//                                     variant="outlined"
//                                   />
//                                 )}
//                               />
//                             </td>
//                             <td
//                               style={{ width: "280px" }}
//                               className="itfAutoComplete"
//                             >
//                               {element.detail_type === "3" ? (
//                                 <Autocomplete
//                                   disablePortal
//                                   options={eanList?.map((item) => ({
//                                     label: item.Name_EN,
//                                     value: item.ID,
//                                   }))}
//                                   getOptionLabel={(option) =>
//                                     option.label || "Select EAN"
//                                   }
//                                   value={
//                                     eanList
//                                       ?.map((item) => ({
//                                         label: item.Name_EN,
//                                         value: item.ID,
//                                       }))
//                                       .find(
//                                         (option) =>
//                                           option.value === element.item_id
//                                       ) || null
//                                   }
//                                   onChange={(event, value) => {
//                                     addFieldHandleChange(index, {
//                                       target: {
//                                         name: "item_id",
//                                         value: value?.value || "",
//                                       },
//                                     });
//                                     if (value?.value) {
//                                       const selectedItem = eanList.find(
//                                         (item) => item.ID === value.value
//                                       );
//                                       addFieldHandleChange(index, {
//                                         target: {
//                                           name: "COA",
//                                           value: selectedItem?.COA || "", // set the COA directly
//                                         },
//                                       });
//                                     }
//                                   }}
//                                   renderInput={(params) => (
//                                     <TextField
//                                       {...params}
//                                       placeholder="Select EAN"
//                                       variant="outlined"
//                                     />
//                                   )}
//                                 />
//                               ) : element.detail_type === "1" ? (
//                                 <Autocomplete
//                                   disablePortal
//                                   options={packagingList?.map((item) => ({
//                                     label: item.Name_EN,
//                                     value: item.ID,
//                                   }))}
//                                   getOptionLabel={(option) =>
//                                     option.label || "Select Packaging"
//                                   }
//                                   value={
//                                     packagingList
//                                       ?.map((item) => ({
//                                         label: item.Name_EN,
//                                         value: item.ID,
//                                       }))
//                                       .find(
//                                         (option) =>
//                                           option.value === element.item_id
//                                       ) || null
//                                   }
//                                   onChange={(event, value) => {
//                                     addFieldHandleChange(index, {
//                                       target: {
//                                         name: "item_id",
//                                         value: value?.value || "",
//                                       },
//                                     });
//                                     if (value?.value) {
//                                       const selectedItem = packagingList.find(
//                                         (item) => item.ID === value.value
//                                       );
//                                       addFieldHandleChange(index, {
//                                         target: {
//                                           name: "COA",
//                                           value: selectedItem?.COA || "",
//                                         },
//                                       });
//                                     }
//                                   }}
//                                   renderInput={(params) => (
//                                     <TextField
//                                       {...params}
//                                       placeholder="Select Packaging"
//                                       variant="outlined"
//                                     />
//                                   )}
//                                 />
//                               ) : element.detail_type === "2" ? (
//                                 <Autocomplete
//                                   disablePortal
//                                   options={boxList?.map((item) => ({
//                                     label: item.Name_EN,
//                                     value: item.ID,
//                                   }))}
//                                   getOptionLabel={(option) =>
//                                     option.label || "Select Box"
//                                   }
//                                   value={
//                                     boxList
//                                       ?.map((item) => ({
//                                         label: item.Name_EN,
//                                         value: item.ID,
//                                       }))
//                                       .find(
//                                         (option) =>
//                                           option.value === element.item_id
//                                       ) || null
//                                   }
//                                   onChange={(event, value) => {
//                                     addFieldHandleChange(index, {
//                                       target: {
//                                         name: "item_id",
//                                         value: value?.value || "",
//                                       },
//                                     });
//                                     if (value?.value) {
//                                       const selectedItem = boxList.find(
//                                         (item) => item.ID === value.value
//                                       );
//                                       addFieldHandleChange(index, {
//                                         target: {
//                                           name: "COA",
//                                           value: selectedItem?.COA || "",
//                                         },
//                                       });
//                                     }
//                                   }}
//                                   renderInput={(params) => (
//                                     <TextField
//                                       {...params}
//                                       placeholder="Select Box"
//                                       variant="outlined"
//                                     />
//                                   )}
//                                 />
//                               ) : (
//                                 <></>
//                               )}
//                             </td>
//                             <td>
//                               <div className="ceateTransport">
//                                 <input
//                                   type="number"
//                                   name="qty_per_itf"
//                                   value={element.qty_per_itf}
//                                   onChange={(e) =>
//                                     addFieldHandleChange(index, e)
//                                   }
//                                 />
//                               </div>
//                             </td>
//                             <td className="editIcon">
//                               {index == formValues.length - 1 ? (
//                                 <button type="button" onClick={addFormFields}>
//                                   <i className="mdi mdi-plus" />
//                                 </button>
//                               ) : (
//                                 <button
//                                   type="button"
//                                   onClick={() => removeFormFields(index)}
//                                 >
//                                   <i className="mdi mdi-trash-can-outline" />
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//           <div className="card-footer">
//             {itfId ? (
//               <button
//                 className="btn btn-primary"
//                 type="submit"
//                 name="signup"
//                 onClick={confirmCloseWindow}
//               >
//                 Confirm and Close
//               </button>
//             ) : (
//               <button
//                 className="btn btn-primary"
//                 type="submit"
//                 name="signup"
//                 onClick={update}
//               >
//                 {from?.ID ? "Update" : "Create"}
//               </button>
//             )}
//             {itfId ? (
//               <button className="btn btn-danger" onClick={cancelData}>
//                 Cancel
//               </button>
//             ) : (
//               <Link className="btn btn-danger" to="/itfNew">
//                 Close
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default AddItf;
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { API_IMAGE_URL } from "../../../Url/Url";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useQuery } from "react-query";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AddItf = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [itfId, setItfId] = useState("");

  console.log(from);
  const navigate = useNavigate();
  const defaultState = {
    itf_id: from?.ID || "",
    itf_code: from?.ITFCODE || "",
    itf_name_en: from?.Name_EN,
    itf_name_th: from?.ITF_name_th,
    Notes: from?.Notes,
    brand_id: from?.Brand,
    ITF_ean_adjustment: from?.Weight_Adjustment,
  };

  const [formValues, setFormValues] = useState([
    {
      detail_type: 0,
      item_id: 0,
      qty_per_itf: "",
    },
  ]);
  const addFieldHandleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        detail_type: 0,
        item_id: 0,
        qty_per_itf: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const [editEan, setEditEan] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItfDetailsId, setSelectedItfDetailsId] = useState(null);
  const handleClickOpen = (itfDetailsId) => {
    setSelectedItfDetailsId(itfDetailsId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItfDetailsId(null);
  };
  // const getItfEan = () => {
  //   if (!from?.ID) return;
  //   axios
  //     .post(`${API_BASE_URL}/getItfDetails/`, { itf_id: from?.ID })
  //     .then((response) => {
  //       console.log(response);
  //       const mappedData = response.data.data.map((item) => ({
  //         itf_details_id: item.ID,
  //         detail_type: item.TYPE, // Ensure this field is correctly set
  //         item_id: item.Item_ID, // Ensure proper field mapping
  //         qty_per_itf: item.QTY_Per_ITF || "", // Ensure default value if empty
  //       }));
  //       setEditEan(mappedData);
  //     });
  // };

  const coaMapping = {
    46: "1", // Packaging
    47: "1",
    62: "1",
    48: "2", // Box
    71: "3", // EAN
  };
  const getItfEan = () => {
    if (!from?.ID) return;
    axios
      .post(`${API_BASE_URL}/getItfDetails/`, { itf_id: from?.ID })
      .then((response) => {
        console.log(response);
        const mappedData = response.data.data.map((item) => ({
          itf_details_id: item.ID,
          detail_type: coaMapping[item.COA] || "", // <-- use mapped COA value
          item_id: item.Item_ID, // Ensure proper field mapping
          qty_per_itf: item.QTY_Per_ITF || "", // Ensure default value if empty
          COA: item.COA || "",
        }));
        setEditEan(mappedData);
      });
  };
  // const handleEditEan = (index, e) => {
  //   const { name, value } = e.target;

  //   setEditEan((prevEditEan) => {
  //     const newEditEan = [...prevEditEan];

  //     // If changing detail_type, reset item_id
  //     if (name === "detail_type") {
  //       newEditEan[index] = {
  //         ...newEditEan[index],
  //         [name]: value,
  //         item_id: "",
  //       };
  //     } else {
  //       newEditEan[index] = { ...newEditEan[index], [name]: value };
  //     }

  //     return newEditEan;
  //   });
  // };
  const handleEditEan = (index, e) => {
    const { name, value } = e.target;

    setEditEan((prevEditEan) => {
      const newEditEan = [...prevEditEan];

      if (name === "detail_type") {
        newEditEan[index] = {
          ...newEditEan[index],
          [name]: value,
          item_id: "",
          COA: "", // Reset COA as well when changing type
        };
      } else if (name === "item_id") {
        // Update item_id and COA when item_id changes
        const detailType = newEditEan[index].detail_type;
        let selectedItem = null;

        if (detailType == "1") {
          selectedItem = packagingList.find((item) => item.Item == value);
        } else if (detailType == "2") {
          selectedItem = boxList.find((item) => item.Item == value);
        } else if (detailType == "3") {
          selectedItem = eanList.find((item) => item.Item == value);
        }

        newEditEan[index] = {
          ...newEditEan[index],
          [name]: value,
          COA: selectedItem?.COA || "", // Update COA based on selected item
        };
      } else {
        newEditEan[index] = {
          ...newEditEan[index],
          [name]: value,
        };
      }

      return newEditEan;
    });
  };

  const { data: eanList } = useQuery("GetITFEanList");
  const { data: packagingList } = useQuery("GetITFPackagingList");
  const { data: boxList } = useQuery("GetITFBoxList");
  const { data: brands } = useQuery("getBrand");

  const deleteItfEan = (eanDetailID) => {
    console.log(eanDetailID);
    axios
      .post(`${API_BASE_URL}/deleteItfPb`, {
        itf_details_id: eanDetailID,
      })
      .then((resp) => {
        if (resp.data.success == true) {
          toast.success("Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          handleClose();
          getItfEan();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const calculateItf = (id) => {
    // axios
    // 	.post(`${API_BASE_URL}/updateItfDetails`, {
    // 		id: id,
    // 	})
    // 	.then((response) => {})
    // 	.catch((error) => {
    // 		console.log(error)
    // 	})
  };
  const cancelData = () => {
    axios
      .post(`${API_BASE_URL}/deleteItf`, {
        itf_id: itfId,
      })
      .then((response) => {
        console.log(response);
        toast.success("Itf Cancel Successfully", {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/itfNew");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };
  const updateEan = () => {
    if (!from?.ID) return;

    axios
      .post(`${API_BASE_URL}/updateItfDetails`, {
        itf_id: from?.ID,
        data: editEan,
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getItfEan();
  }, []);
  const [state, setState] = useState(defaultState);
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setState((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const addItfEanData = (itf_id) => {
    // Filter out invalid entries
    const filteredFormValues = formValues.filter((v) => v.item_id != 0);

    // If no valid items, exit early
    if (filteredFormValues.length === 0) return;

    // Proceed with API call
    axios
      .post(`${API_BASE_URL}/addItfDetails`, {
        user_id: localStorage.getItem("id"),
        itf_id: itf_id,
        data: filteredFormValues,
      })
      .then((response) => {
        console.log(response);
        // navigate("/itfNew");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const update = (e) => {
    e.preventDefault();
    // if (state.itf_name_en.trim() == "" || state.itf_name_th.trim() == "")

    // if (state.itf_name_en.trim() == "")
    //   return toast.error("Please enter product name");

    const formData = new FormData();
    formData.append("itf_id", state.itf_id);
    formData.append("itf_name_en", state.itf_name_en);
    formData.append("itf_name_th", state.itf_name_th);
    formData.append("itf_code", state.itf_code);
    formData.append("ITF_ean_adjustment", state.ITF_ean_adjustment);
    formData.append("Notes", state.Notes ? state.Notes : "");
    formData.append("user_id", localStorage.getItem("id"));
    formData.append("brand", state.brand_id);
    formData.append("images", state.box_image);
    axios
      .post(`${API_BASE_URL}/${from?.ID ? "updateItf" : "addItf"}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Success", {
            autoClose: 1000,
            theme: "colored",
          });
          if (from?.ID) {
            navigate("/itfNew");
          }
          const id = response.data?.itf_id || from?.ID;
          setItfId(id);
          if (id) {
            addItfEanData(id);
            // addItfPbData(id)
            updateEan();
            calculateItf(id);
            // updatePb()
          }
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const confirmCloseWindow = () => {
    toast.success("Itf Confirm Successful", {
      autoClose: 1000,
      theme: "colored",
    });
    navigate("/itfNew");
  };
  const generateName = async () => {
    try {
      console.log(state.brand_id);

      // Call the first API
      await axios.post(`${API_BASE_URL}/updateItfDetails`, {
        itf_id: from?.ID || itfId,
        data: editEan,
      });
      console.log("First API call completed.");

      // Call the second API
      const response = await axios.post(`${API_BASE_URL}/ITFgenerateName`, {
        ITF_ID: itfId || from?.ID,
        brand: state.brand_id,
      });

      // Destructure the response
      const { ITF_name_th, Name_EN } = response.data.itfData;
      console.log(ITF_name_th);

      // Show a success toast
      toast.success("Successfully", {
        autoClose: 1000,
        theme: "colored",
      });

      // Update the state
      setState((prevState) => ({
        ...prevState, // Preserve other state properties
        itf_name_th: ITF_name_th, // Update the Thai name
        itf_name_en: Name_EN, // Update the English name
      }));
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  // const generateName = async () => {
  //   try {
  //     console.log(state.brand_id);

  //     // Call the first API
  //     await axios.post(`${API_BASE_URL}/updateItfDetails`, {
  //       itf_id: from?.ID || itfId,
  //       data: editEan,
  //     });
  //     console.log("First API call completed.");

  //     // Call the second API
  //     const response = await axios.post(`${API_BASE_URL}/ITFgenerateName`, {
  //       ITF_ID: itfId || from?.ID,
  //       brand: state.brand_id,
  //     });

  //     // Destructure the response
  //     const { ITF_name_th, itf_name_en } = response.data.itfData;
  //     console.log(ITF_name_th);

  //     // Show a success toast
  //     toast.success("Successfully", {
  //       autoClose: 1000,
  //       theme: "colored",
  //     });

  //     // Update the state
  //     setState((prevState) => ({
  //       ...prevState, // Preserve other state properties
  //       itf_name_th: ITF_name_th, // Update the Thai name
  //       itf_name_en: itf_name_en, // Update the English name
  //     }));
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };
  console.log(editEan);
  return (
    <Card title={`ITF Management / ${from?.ID ? "Update" : "Add"} Form`}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate ">
                <form action="">
                  <div className="row formEan">
                    <div className="col-lg-3 form-group">
                      <h6>ITF Code</h6>
                      <input
                        type="text"
                        placeholder="ean code"
                        value={state.itf_code}
                        name="itf_code"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>Product Name EN</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        value={state.itf_name_en}
                        name="itf_name_en"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Product Name TH</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        value={state.itf_name_th}
                        name="itf_name_th"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Extra Weight</h6>
                      <input
                        type="number"
                        placeholder="Extra weight"
                        value={state.ITF_ean_adjustment}
                        name="ITF_ean_adjustment"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group itfAutoComplete">
                      <h6>Brand</h6>
                      <Autocomplete
                        disablePortal
                        options={brands || []} // Ensure brands is defined
                        getOptionLabel={(option) => option.Name_EN || ""}
                        value={
                          brands?.find((item) => item.ID === state.brand_id) ||
                          null
                        } // Ensure correct comparison
                        onChange={(event, value) => {
                          setState({
                            ...state,
                            brand_id: value ? value.ID : "", // Use the correct ID property
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Please select Brand"
                            style={{ padding: "10px" }}
                          />
                        )}
                      />
                    </div>

                    <div className="col-lg-3 form-group">
                      <h6>Image</h6>
                      <input
                        type="file"
                        id="box_image"
                        name="box_image"
                        onChange={handleChange}
                        // key={fileInputKey}
                        accept="image/*"
                        className="d-none"
                        // onChange={handleFileSelect}
                      />
                      <div className="imgFlex">
                        <div className="pe-4">
                          <label htmlFor="box_image">
                            <div className="uploadBorder">
                              <span>
                                Choose Image <CloudUploadIcon />{" "}
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div>
                        {selectedImage && (
                          <div>
                            <img
                              src={selectedImage}
                              alt="Uploaded"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </div>
                        )}
                        {!selectedImage && imagePath && (
                          <div>
                            <img
                              crossorigin="anonymous"
                              src={`${API_IMAGE_URL}/${imagePath}`}
                              alt="Existing"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>Notes</h6>
                      <input
                        type="text"
                        placeholder="notes"
                        value={state.Notes}
                        name="Notes"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-3 form-group">
                      <h6>ITF vvsw</h6>
                      <p
                        className={
                          `${from?.vvsw}`.toLowerCase() == "volume over weight"
                            ? "text-red-400"
                            : ""
                        }
                      >
                        {from?.vvsw || "Weight within Limits"}
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="addBtnEan">
                      {itfId || from?.ID ? (
                        <button
                          className="my-5"
                          type="button"
                          onClick={generateName}
                        >
                          Generate Name
                        </button>
                      ) : (
                        ""
                      )}
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
                          <th>Type</th>
                          <th>Name</th>
                          <th className="w-5">Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {editEan.map((element, index) => (
                          <tr className="rowCursorPointer">
                            <td style={{ width: "280px" }}>
                              <select
                                name="detail_type"
                                value={element.detail_type}
                                onChange={(e) => handleEditEan(index, e)}
                              >
                                <option value="1">Packaging</option>
                                <option value="2">Boxes</option>
                                <option value="3">EAN</option>
                              </select>
                            </td>
                            <td style={{ width: "280px" }}>
                              {element.detail_type == "3" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select EAN</option>
                                  {eanList?.map((item) => (
                                    <option value={item.Item}>
                                      {item.Name_EN}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "1" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select Packaging</option>
                                  {packagingList?.map((item) => (
                                    <option value={item.Item}>
                                      {item.Name_EN}
                                    </option>
                                  ))}
                                </select>
                              ) : element.detail_type == "2" ? (
                                <select
                                  name="item_id"
                                  onChange={(e) => handleEditEan(index, e)}
                                  value={element.item_id}
                                >
                                  <option value="">Select Box</option>
                                  {boxList?.map((item) => (
                                    <option value={item.Item}>
                                      {item.Name_EN}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                name="qty_per_itf"
                                value={element.qty_per_itf}
                                onChange={(e) => handleEditEan(index, e)}
                              />
                            </td>
                            <td className="editIcon">
                              <a
                                onClick={() =>
                                  handleClickOpen(element.itf_details_id)
                                }
                              >
                                <i className="mdi mdi-trash-can-outline" />
                              </a>
                              <Dialog
                                fullWidth
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                              >
                                <DialogTitle
                                  id="alert-dialog-title"
                                  className="text-center"
                                >
                                  {"Are you sure you want to delete?"}
                                </DialogTitle>
                                <DialogContent className="text-center p-0 m-0 alertDel">
                                  <DialogContentText id="alert-dialog-description">
                                    <DeleteSweepIcon
                                      style={{
                                        color: "#AF2655",
                                        fontSize: "70px",
                                        marginBottom: "20px",
                                      }}
                                    />
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions className="text-center d-flex align-items-center justify-content-center">
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-lg btn-block make-an-offer-btn"
                                    onClick={() => {
                                      deleteItfEan(selectedItfDetailsId);
                                      handleClose();
                                    }}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary btn-lg btn-block make-an-offer-btn me-1"
                                    onClick={handleClose}
                                  >
                                    No
                                  </button>
                                </DialogActions>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                        {formValues.map((element, index) => (
                          <tr className="rowCursorPointer">
                            <td
                              style={{ width: "280px" }}
                              className="itfAutoComplete"
                            >
                              <Autocomplete
                                disablePortal
                                options={[
                                  { label: "Packaging", value: "1" },
                                  { label: "Boxes", value: "2" },
                                  { label: "EAN", value: "3" },
                                ]}
                                getOptionLabel={(option) =>
                                  option.label || "Select Type"
                                }
                                value={
                                  [
                                    { label: "Packaging", value: "1" },
                                    { label: "Boxes", value: "2" },
                                    { label: "EAN", value: "3" },
                                  ].find(
                                    (item) => item.value === element.detail_type
                                  ) || null
                                }
                                onChange={(event, value) => {
                                  addFieldHandleChange(index, {
                                    target: {
                                      name: "detail_type",
                                      value: value?.value || "",
                                    },
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Select Type"
                                    variant="outlined"
                                  />
                                )}
                              />
                            </td>
                            <td
                              style={{ width: "280px" }}
                              className="itfAutoComplete"
                            >
                              {element.detail_type === "3" ? (
                                <Autocomplete
                                  disablePortal
                                  options={eanList?.map((item) => ({
                                    label: item.Name_EN,
                                    value: item.Item,
                                  }))}
                                  getOptionLabel={(option) =>
                                    option.label || "Select EAN"
                                  }
                                  value={
                                    eanList
                                      ?.map((item) => ({
                                        label: item.Name_EN,
                                        value: item.Item,
                                      }))
                                      .find(
                                        (option) =>
                                          option.value === element.item_id
                                      ) || null
                                  }
                                  onChange={(event, value) => {
                                    addFieldHandleChange(index, {
                                      target: {
                                        name: "item_id",
                                        value: value?.value || "",
                                      },
                                    });
                                    if (value?.value) {
                                      const selectedItem = eanList.find(
                                        (item) => item.Item === value.value
                                      );
                                      addFieldHandleChange(index, {
                                        target: {
                                          name: "COA",
                                          value: selectedItem?.COA || "", // set the COA directly
                                        },
                                      });
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select EAN"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              ) : element.detail_type === "1" ? (
                                <Autocomplete
                                  disablePortal
                                  options={packagingList?.map((item) => ({
                                    label: item.Name_EN,
                                    value: item.Item,
                                  }))}
                                  getOptionLabel={(option) =>
                                    option.label || "Select Packaging"
                                  }
                                  value={
                                    packagingList
                                      ?.map((item) => ({
                                        label: item.Name_EN,
                                        value: item.Item,
                                      }))
                                      .find(
                                        (option) =>
                                          option.value === element.item_id
                                      ) || null
                                  }
                                  onChange={(event, value) => {
                                    addFieldHandleChange(index, {
                                      target: {
                                        name: "item_id",
                                        value: value?.value || "",
                                      },
                                    });
                                    if (value?.value) {
                                      const selectedItem = packagingList.find(
                                        (item) => item.Item === value.value
                                      );
                                      addFieldHandleChange(index, {
                                        target: {
                                          name: "COA",
                                          value: selectedItem?.COA || "",
                                        },
                                      });
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Packaging"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              ) : element.detail_type === "2" ? (
                                <Autocomplete
                                  disablePortal
                                  options={boxList?.map((item) => ({
                                    label: item.Name_EN,
                                    value: item.Item,
                                  }))}
                                  getOptionLabel={(option) =>
                                    option.label || "Select Box"
                                  }
                                  value={
                                    boxList
                                      ?.map((item) => ({
                                        label: item.Name_EN,
                                        value: item.Item,
                                      }))
                                      .find(
                                        (option) =>
                                          option.value === element.item_id
                                      ) || null
                                  }
                                  onChange={(event, value) => {
                                    addFieldHandleChange(index, {
                                      target: {
                                        name: "item_id",
                                        value: value?.value || "",
                                      },
                                    });
                                    if (value?.value) {
                                      const selectedItem = boxList.find(
                                        (item) => item.Item === value.value
                                      );
                                      addFieldHandleChange(index, {
                                        target: {
                                          name: "COA",
                                          value: selectedItem?.COA || "",
                                        },
                                      });
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Box"
                                      variant="outlined"
                                    />
                                  )}
                                />
                              ) : (
                                <></>
                              )}
                            </td>
                            <td>
                              <div className="ceateTransport">
                                <input
                                  type="number"
                                  name="qty_per_itf"
                                  value={element.qty_per_itf}
                                  onChange={(e) =>
                                    addFieldHandleChange(index, e)
                                  }
                                />
                              </div>
                            </td>
                            <td className="editIcon">
                              {index == formValues.length - 1 ? (
                                <button type="button" onClick={addFormFields}>
                                  <i className="mdi mdi-plus" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => removeFormFields(index)}
                                >
                                  <i className="mdi mdi-trash-can-outline" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            {itfId ? (
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={confirmCloseWindow}
              >
                Confirm and Close
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={update}
              >
                {from?.ID ? "Update" : "Create"}
              </button>
            )}
            {itfId ? (
              <button className="btn btn-danger" onClick={cancelData}>
                Cancel
              </button>
            ) : (
              <Link className="btn btn-danger" to="/itfNew">
                Close
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddItf;
