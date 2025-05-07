import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const ProduceCreateNew = () => {
  const navigate = useNavigate();
  const defaultState = {
    produce_name_en: "",
    produce_name_th: "",
    produce_scientific_name: "",
    produce_hscode: "",
    produce_classification_id: "",
    produce_classification_id1: "",
    produce_classification_id2: "",
    produce_classification_id3: "",
    produce_classification_id4: "",

    box_image: null, // For storing the uploaded image file
  };
  const [state, setState] = useState(defaultState);
  const [classification, setClassification] = useState([]);
  const [classification1, setClassification1] = useState([]);

  const [classification2, setClassification2] = useState([]);

  const [classification3, setClassification3] = useState([]);
  const [classification4, setClassification4] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null); // For previewing the selected image
  const [selectedClassification, setSelectedClassification] =
    React.useState(null);
  const [selectedClassification1, setSelectedClassification1] =
    React.useState(null);

  const [selectedClassification2, setSelectedClassification2] =
    React.useState(null);

  const [selectedClassification3, setSelectedClassification3] =
    React.useState(null);

  const [selectedClassification4, setSelectedClassification4] =
    React.useState(null);
  useEffect(() => {
    if (classification1.length > 0) {
      const defaultOption = classification1.find((item) => item.ID === 45);
      if (defaultOption) {
        setSelectedClassification1({
          id: defaultOption.ID,
          name: defaultOption.Name_EN,
        });

        handleChange({
          target: {
            name: "produce_classification_id1",
            value: defaultOption.ID,
          },
        });
      }
    }
  }, [classification1]); // Runs when classification1 updates

  useEffect(() => {
    if (classification2.length > 0) {
      const defaultOption2 = classification2.find((item) => item.ID === 1);
      if (defaultOption2) {
        setSelectedClassification2({
          id: defaultOption2.ID,
          name: defaultOption2.Name_EN,
        });

        handleChange({
          target: {
            name: "produce_classification_id2",
            value: defaultOption2.ID,
          },
        });
      }
    }
  }, [classification2]); // Runs when classification2 updates
  useEffect(() => {
    if (classification3.length > 0) {
      const defaultOption3 = classification3.find((item) => item.ID === 1);
      if (defaultOption3) {
        setSelectedClassification3({
          id: defaultOption3.ID,
          name: defaultOption3.Name_EN,
        });

        handleChange({
          target: {
            name: "produce_classification_id3",
            value: defaultOption3.ID,
          },
        });
      }
    }
  }, [classification3]);

  useEffect(() => {
    if (classification4.length > 0) {
      const defaultOption4 = classification4.find((item) => item.ID === 1);
      if (defaultOption4) {
        setSelectedClassification4({
          id: defaultOption4.ID,
          name: defaultOption4.Name_EN,
        });

        handleChange({
          target: {
            name: "produce_classification_id4",
            value: defaultOption4.ID,
          },
        });
      }
    }
  }, [classification4]);
  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image") {
      setState((prevState) => ({
        ...prevState,
        box_image: files[0], // Handle file input
      }));
      if (files[0]) {
        setSelectedImage(URL.createObjectURL(files[0])); // Set selected image for preview
      }
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const produceCreate = async () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("id"));
    formData.append("produce_name_en", state.produce_name_en);
    formData.append("produce_name_th", state.produce_name_th);
    formData.append("produce_scientific_name", state.produce_scientific_name);
    formData.append("produce_hscode", state.produce_hscode);
    formData.append("expense_Type", state.produce_classification_id1);
    formData.append("VAT", state.produce_classification_id2);
    formData.append("Inventory_Type", state.produce_classification_id3);
    formData.append("WHT", state.produce_classification_id4);
    formData.append(
      "produce_classification_id",
      state.produce_classification_id
    );
    formData.append("images", state.box_image);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createProduce`,
        formData
      );
      if (response.data.success) {
        toast.success(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/produceNew");
      } else {
        toast.error(response.data.message, {
          autoClose: 1000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getClassificationData = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownProduceClassification`)
      .then((response) => {
        if (response.data.success) {
          setClassification(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClassificationData1 = () => {
    axios
      .get(`${API_BASE_URL}/getExpenseType `)
      .then((response) => {
        if (response.data.success) {
          setClassification1(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getClassificationData2 = () => {
    axios
      .get(`${API_BASE_URL}/getVAT `)
      .then((response) => {
        if (response.data.success) {
          setClassification2(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getClassificationData3 = () => {
    axios
      .get(`${API_BASE_URL}/getInventoryType `)
      .then((response) => {
        if (response.data.success) {
          setClassification3(response.data.data);
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
          setClassification4(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getClassificationData();
    getClassificationData1();
    getClassificationData2();
    getClassificationData3();
    getClassificationData4();
  }, []);

  return (
    <Card title="Produce Management / Create Form">
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>Classification</h6>
                      <Autocomplete
                        options={
                          classification.map((item) => ({
                            id: item.produce_classification_id,
                            name: item.produce_classification_name_en,
                          })) || []
                        }
                        getOptionLabel={(option) => option.name || ""} // Text to display for each option
                        onChange={(event, newValue) => {
                          setSelectedClassification(newValue); // Update the selected value state
                          handleChange({
                            target: {
                              name: "produce_classification_id",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event object to call handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Classification" // Placeholder text
                            variant="outlined"
                            style={{ padding: "10px" }} // Add padding similar to the original select
                          />
                        )}
                        value={selectedClassification} // Bind the selected value to the state
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Ensure proper value matching
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>Name TH</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_th"
                        name="produce_name_th"
                        className="form-control"
                        placeholder="Name TH"
                        value={state.produce_name_th}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Name EN</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="name_en"
                        name="produce_name_en"
                        className="form-control"
                        placeholder="Name EN"
                        value={state.produce_name_en}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>HS Code</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_code"
                        name="produce_hscode"
                        className="form-control"
                        placeholder="HS Code"
                        value={state.produce_hscode}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Scientific Name</h6>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="hs_name"
                        name="produce_scientific_name"
                        className="form-control"
                        placeholder="Scientific Name"
                        value={state.produce_scientific_name}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>
                        Charts of Accounting
                      </h6>
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
                        value={selectedClassification1}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>VAT Type</h6>
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
                            placeholder="Select Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification2}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>Inventory Type</h6>
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
                            placeholder="Select Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification3}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>WHT Type</h6>
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
                            placeholder="Select Classification"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification4}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group">
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
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              onClick={produceCreate}
              className="btn btn-primary"
              type="button"
              name="signup"
            >
              Create
            </button>
            <Link className="btn btn-danger" to="/produceNew">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProduceCreateNew;
