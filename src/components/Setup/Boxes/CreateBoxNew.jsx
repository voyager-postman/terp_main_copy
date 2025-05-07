import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

const CreateBoxNew = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const defaultState = {
    box_name: "",
    External_Ref: "",
    box_height: "",
    box_weight: "",
    box_width: "",
    box_length: "",
    box_pallet: "",
    box_image: null, // State for the image
  };

  const [state, setState] = useState(defaultState);
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
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image") {
      setState((prevState) => ({
        ...prevState,
        box_image: files[0],
      }));
      if (files[0]) {
        setSelectedImage(URL.createObjectURL(files[0]));
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const getClassificationData1 = () => {
    axios
      .get(`${API_BASE_URL}/getExpenseType`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification1(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data.find((item) => item.ID === 48);
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
          const defaultSelection = data.find((item) => item.ID === 2);
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
          const defaultSelection = data.find((item) => item.ID === 1);
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
          const defaultSelection = data.find((item) => item.ID === 1);
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
        console.log(response);

        const data = response.data.data;
        setClassification5(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(classification5);
  // Call getClassificationData1 when component mounts
  useEffect(() => {
    getClassificationData1();
    getClassificationData2();
    getClassificationData3();
    getClassificationData4();
    getClassificationData5();
  }, []);
  const boxCreate = () => {
    const user_id = localStorage.getItem("id");
    const request = new FormData();
    request.append("box_name", state.box_name);
    request.append("External_Ref", state.External_Ref);

    request.append("box_height", state.box_height);
    request.append("box_weight", state.box_weight);
    request.append("box_width", state.box_width);
    request.append("box_length", state.box_length);
    request.append("box_pallet", state.box_pallet);
    request.append("box_cbm", cbm);
    request.append("box_mlw", minload);
    request.append("user_id", user_id);
    request.append("expense_Type", classification1Id);
    request.append("VAT", classification2Id);
    request.append("Inventory_Type", classification3Id);
    request.append("WHT", classification4Id);
    request.append("Brand", classification5Id);

    if (state.box_image) {
      request.append("images", state.box_image);
    }
    const fieldCheck =
      state.box_name === "" ||
      state.External_Ref === "" ||
      state.box_height === "" ||
      state.box_weight === "" ||
      state.box_width === "" ||
      state.box_length === "" ||
      state.box_pallet === "";
    if (fieldCheck) {
      toast.warn("Please Fill All The Fields", {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/addBoxes`, request, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the correct content type for file uploads
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/boxes");
          return;
        }
        if (response.data.success === false) {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };
  const boxwidth = state.box_width;
  const boxlength = state.box_length;
  const boxheight = state.box_height;
  const cal =
    (0.0001 *
      (parseFloat(boxwidth) * parseFloat(boxlength) * parseFloat(boxheight))) /
    1000000 /
    0.0001;
  const cbm = cal.toFixed(4);
  const cal_min = (cbm * 1000) / 6;
  const minload = cal_min.toFixed(2);

  return (
    <Card title={"Boxes Management / Create Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form>
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
                        value={state.box_name}
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
                        value={state.External_Ref}
                      />
                    </div>

                    <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>Brand</h6>
                      <Autocomplete
                        options={
                          classification5.map((item) => ({
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
                            value={state.box_width}
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
                            placeholder="width"
                            value={state.box_length}
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
                            placeholder="width"
                            value={state.box_height}
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
                        name="box_cbm"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={cbm}
                        readOnly
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
                            value={state.box_weight}
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
                        name="box_mlw"
                        className="form-control"
                        placeholder="automatic calculation"
                        value={minload}
                        readOnly
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
                        value={state.box_pallet}
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
                          classification4.map((item) => ({
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
                      <div className="d-flex">
                        <div className="uploadImage">
                          <label htmlFor="box_image">
                            <div className="uploadBorder">
                              <span>
                                Choose Image <CloudUploadIcon />{" "}
                              </span>
                            </div>
                          </label>
                          <input
                            type="file"
                            id="box_image"
                            name="box_image"
                            onChange={handleChange}
                            accept="image/*"
                            className="d-none"
                          />
                        </div>
                        {selectedImage && (
                          <div className="ms-5 imgUpload">
                            <img
                              src={selectedImage}
                              alt="Uploaded"
                              style={{ width: "150px", height: "150px" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              onClick={boxCreate}
              className="btn btn-primary"
              type="button"
              name="signup"
            >
              Create
            </button>
            <Link className="btn btn-danger" to="/boxes">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreateBoxNew;
