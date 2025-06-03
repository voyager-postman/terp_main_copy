import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { API_IMAGE_URL } from "../../../Url/Url";
import { Autocomplete, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const UpdateBox = () => {
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [classification1, setClassification1] = useState([]);
  const [selectedClassification1, setSelectedClassification1] = useState(null);
  const [classification1Id, setClassification1Id] = useState("");
  const [classification2, setClassification2] = useState([]);
  const [selectedClassification2, setSelectedClassification2] = useState(null);
  const [classification2Id, setClassification2Id] = useState("");
  const [classification3, setClassification3] = useState([]);
  const [selectedClassification3, setSelectedClassification3] = useState(null);
  const [classification3Id, setClassification3Id] = useState("");
  const [classification4, setClassification4] = useState([]);
  const [selectedClassification4, setSelectedClassification4] = useState(null);
  const [classification4Id, setClassification4Id] = useState("");

  const [classification5, setClassification5] = useState([]);
  const [selectedClassification5, setSelectedClassification5] = useState(null);
  const [classification5Id, setClassification5Id] = useState("");

  const navigate = useNavigate();
  const defaultState = {
    box_name: from?.Name_EN || "",
    External_Ref: from?.External_Ref || "",

    box_height: from?.box_height || "",
    box_weight: from?.box_weight || "",
    box_width: from?.box_width || "",
    box_length: from?.box_length || "",
    box_pallet: from?.box_pallet || "",
    box_cbm: from?.box_cbm || "",
    box_mlw: from?.box_mlw || "",
    Per_Bun: from?.Per_Bun || "",
  };
  const [editBoxData, setEditBoxData] = useState(defaultState);
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file));
      setImagePath("");
      setEditBoxData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setEditBoxData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  // Edit Box Api

  const getClassificationData1 = () => {
    axios
      .get(`${API_BASE_URL}/getExpenseType`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification1(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data.find(
            (item) => item.ID === from?.expense_Type
          );
          if (defaultSelection) {
            const formattedSelection = {
              id: defaultSelection.ID,
              name: defaultSelection.Name_EN,
            };
            setSelectedClassification1(formattedSelection);
            setClassification1Id(formattedSelection.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClassificationData2 = () => {
    axios
      .get(`${API_BASE_URL}/getVAT`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification2(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data.find((item) => item.ID === from?.VAT);
          if (defaultSelection) {
            const formattedSelection = {
              id: defaultSelection.ID,
              name: defaultSelection.Name_EN,
            };
            setSelectedClassification2(formattedSelection);
            setClassification2Id(formattedSelection.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClassificationData3 = () => {
    axios
      .get(`${API_BASE_URL}/getInventoryType`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification3(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data.find(
            (item) => item.ID === from?.Inventory_Type
          );
          if (defaultSelection) {
            const formattedSelection = {
              id: defaultSelection.ID,
              name: defaultSelection.Name_EN,
            };
            setSelectedClassification3(formattedSelection);
            setClassification3Id(formattedSelection.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClassificationData4 = () => {
    axios
      .get(`${API_BASE_URL}/getWHT`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification4(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data?.find((item) => item.ID === from?.WHT);
          if (defaultSelection) {
            const formattedSelection = {
              id: defaultSelection.ID,
              name: defaultSelection.Name_EN,
            };
            setSelectedClassification4(formattedSelection);
            setClassification4Id(formattedSelection.id);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClassificationData5 = () => {
    axios
      .get(`${API_BASE_URL}/getBrand`)
      .then((response) => {
        const data = response.data.data;
        setClassification5(data);

        // Find and set the default selection (ID 9)
        const defaultSelection = data?.find((item) => item.ID === from?.Brand);
        if (defaultSelection) {
          const formattedSelection = {
            id: defaultSelection.ID,
            name: defaultSelection.Name_EN,
          };
          setSelectedClassification5(formattedSelection);
          setClassification5Id(formattedSelection.id);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Call getClassificationData1 when component mounts
  useEffect(() => {
    getClassificationData1();
    getClassificationData2();
    getClassificationData3();
    getClassificationData4();
    getClassificationData5();
  }, []);
  const updateBoxData = async () => {
    const formData = new FormData();
    formData.append("box_id", from?.ID);

    formData.append("box_name", editBoxData.box_name);
    formData.append("External_Ref", editBoxData.External_Ref);

    formData.append("box_height", editBoxData.box_height);
    formData.append("box_weight", editBoxData.box_weight);
    formData.append("box_pallet", editBoxData.box_pallet);
    formData.append("box_width", editBoxData.box_width);
    formData.append("box_length", editBoxData.box_length);
    formData.append("box_cbm", editBoxData.box_cbm);
    formData.append("box_mlw", editBoxData.box_mlw);
    formData.append("expense_Type", classification1Id);
    formData.append("VAT", classification2Id);
    formData.append("Inventory_Type", classification3Id);
    formData.append("WHT", classification4Id);
    formData.append("Brand", classification5Id);
    formData.append("Per_Bun", editBoxData.Per_Bun);
    if (editBoxData.box_image instanceof File) {
      formData.append("images", editBoxData.box_image);
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/editBoxes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/boxes");
      } else {
        toast.error(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Network Error", {
        autoClose: 1000,
        theme: "colored",
      });
    }
  };
  const boxwidth = editBoxData.box_width;
  const boxlength = editBoxData.box_length;
  const boxheight = editBoxData.box_height;
  const cal =
    (0.0001 *
      (parseFloat(boxwidth) * parseFloat(boxlength) * parseFloat(boxheight))) /
    1000000 /
    0.0001;
  const cbm = cal.toFixed(4);
  const cal_min = (cbm * 1000) / 6;
  const minload = cal_min.toFixed(2);
  return (
    <Card title={"Boxes Management / Edit Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4 "
            >
              <div className="d-flex exportPopupBtn"></div>
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>Name</h6>
                      <input
                        type="text"
                        id="name_th"
                        name="box_name"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name"
                        defaultValue={editBoxData.box_name}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>External Reference</h6>
                      <input
                        type="text"
                        id="name_th"
                        name="External_Ref"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name"
                        defaultValue={editBoxData.External_Ref}
                      />
                    </div>
                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>Brand</h6>
                      <Autocomplete
                        options={
                          classification5?.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification5(newValue);
                          setClassification5Id(newValue ? newValue.id : "");
                          handleChange({
                            target: {
                              name: "produce_classification_id5",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Brand"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification5} // Default value applied here
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6> Per Bun</h6>
                      <input
                        type="number"
                        id="name_th"
                        name="Per_Bun"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Per Bun"
                        defaultValue={editBoxData.Per_Bun}
                      />
                    </div>
                    {/* <div className="form-group col-lg-3">
                      {" "}
                      <input
                        type="number"
                        id="name_th"
                        name="Per_Bun"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Per Bun"
                        defaultValue={editBoxData.Per_Bun}
                      />
                    </div> */}
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>Width</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_width"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="width"
                            defaultValue={editBoxData.box_width}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Length</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_length"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="length"
                            defaultValue={editBoxData.box_length}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-lg-3">
                      <h6>Height</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_height"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="height"
                            defaultValue={editBoxData.box_height}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>cm</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>CBM</h6>
                      <input
                        type="text"
                        id="hs_name"
                        name="hs_name"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={cbm}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <h6>Weight</h6>
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="box_weight"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="weight"
                            defaultValue={editBoxData.box_weight}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>g</span>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>MinLoad</h6>
                      <input
                        type="text"
                        id="name_en"
                        name="name_en"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={minload}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Box/Pallet</h6>
                      <input
                        type="text"
                        id="name_en"
                        name="box_pallet"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Box/Pallet"
                        defaultValue={editBoxData.box_pallet}
                      />
                    </div>
                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>Charts of Accounting</h6>
                      <Autocomplete
                        options={
                          classification1.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification1(newValue);
                          setClassification1Id(newValue ? newValue.id : "");
                          handleChange({
                            target: {
                              name: "produce_classification_id1",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification1} // Default value applied here
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>VAT Type</h6>
                      <Autocomplete
                        options={
                          classification2.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification2(newValue);
                          setClassification2Id(newValue ? newValue.id : "");
                          handleChange({
                            target: {
                              name: "produce_classification_id2",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select VAT Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification2} // Default value applied here
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>

                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>Inventory Type</h6>
                      <Autocomplete
                        options={
                          classification3.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification3(newValue);
                          setClassification3Id(newValue ? newValue.id : "");
                          handleChange({
                            target: {
                              name: "produce_classification_id3",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Inventory Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification3} // Default value applied here
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>

                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6> WHT Type</h6>
                      <Autocomplete
                        options={
                          classification4?.map((item) => ({
                            id: item.ID,
                            name: item.Name_EN,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification4(newValue);
                          setClassification4Id(newValue ? newValue.id : "");
                          handleChange({
                            target: {
                              name: "produce_classification_id4",
                              value: newValue ? newValue.id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select WHT Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification4} // Default value applied here
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="form-group col-lg-12">
                      <h6>Image</h6>
                      <input
                        type="file"
                        id="box_image"
                        name="box_image"
                        onChange={handleChange}
                        accept="image/*"
                        className="d-none"
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
                    </div>
                    <div className="form-group col-lg-12">
                      <div className="d-flex mt-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100px btn-adddev"
                          onClick={updateBoxData}
                        >
                          Update
                        </button>
                        <Link
                          to="/boxes"
                          className="btn btn-light w-100px ms-3"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-3">
                <nav></nav>
              </div>
              <div className="table-responsive"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateBox;
