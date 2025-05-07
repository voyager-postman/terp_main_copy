import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL, API_IMAGE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Autocomplete, TextField } from "@mui/material";
const UpdateProduce = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultState = {
    produce_id: from?.ID || "",
    produce_name_en: from?.Name_EN || "",
    produce_name_th: from?.Name_TH || "",
    produce_scientific_name: from?.produce_scientific_name || "",
    produce_hscode: from?.produce_hscode || "",
    produce_classification_id: from?.produce_classification_id || "",
    produce_classification_id1: from?.expense_Type || "",
    produce_classification_id2: from?.VAT || "",
    produce_classification_id3: from?.Inventory_Type || "",
    produce_classification_id4: from?.WHT || "",
    box_image: "", // Added a default value for box_image
  };
  console.log(from);
  const [editProduceData, setEditProduceData] = useState(defaultState);
  const [classification, setClassification] = useState([]);
  const [classification1, setClassification1] = useState([]);

  const [classification2, setClassification2] = useState([]);

  const [classification3, setClassification3] = useState([]);
  const [classification4, setClassification4] = useState([]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "box_image" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const updateProduceItems = () => {
    const formData = new FormData();
    formData.append("user_id", localStorage.getItem("id"));

    formData.append("produce_id", editProduceData.produce_id);
    formData.append("produce_name_en", editProduceData.produce_name_en);
    formData.append("produce_name_th", editProduceData.produce_name_th);
    formData.append(
      "produce_scientific_name",
      editProduceData.produce_scientific_name
    );
    formData.append("produce_hscode", editProduceData.produce_hscode);
    formData.append(
      "produce_classification_id",
      editProduceData.produce_classification_id
    );
    formData.append("expense_Type", editProduceData.produce_classification_id1);
    formData.append("VAT", editProduceData.produce_classification_id2);
    formData.append(
      "Inventory_Type",
      editProduceData.produce_classification_id3
    );
    formData.append("WHT", editProduceData.produce_classification_id4);
    if (editProduceData.box_image) {
      formData.append("images", editProduceData.box_image); // Append the selected image
    }

    axios
      .post(`${API_BASE_URL}/updateProduce`, formData)
      .then((response) => {
        if (response.data.success === true) {
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
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const getClassificationData = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownProduceClassification`)
      .then((response) => {
        if (response.data.success === true) {
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
    <Card title={"Produce Management / Edit Form"}>
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
                    <div className="col-lg-6 form-group autoComplete mb-3">
                      <h6>Classification</h6>
                      <Autocomplete
                        options={classification.map((item) => ({
                          id: item.produce_classification_id,
                          name: item.produce_classification_name_en,
                        }))}
                        getOptionLabel={(option) => option.name || ""} // Display the name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "produce_classification_id",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event structure to work with handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose"
                            variant="outlined"
                            className="form-control"
                          />
                        )}
                        value={
                          classification
                            .map((item) => ({
                              id: item.produce_classification_id,
                              name: item.produce_classification_name_en,
                            }))
                            .find(
                              (option) =>
                                option.id ===
                                editProduceData.produce_classification_id
                            ) || null
                        } // Find the corresponding value
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Correct equality check
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>Name TH</h6>
                      <input
                        type="text"
                        id="name_th"
                        onChange={handleChange}
                        name="produce_name_th"
                        className="form-control"
                        placeholder="Name TH"
                        value={editProduceData.produce_name_th}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Name EN</h6>
                      <input
                        type="text"
                        id="name_en"
                        onChange={handleChange}
                        name="produce_name_en"
                        className="form-control"
                        placeholder="Name EN"
                        value={editProduceData.produce_name_en}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-6">
                      <h6>HS Code</h6>
                      <input
                        type="text"
                        id="hs_code"
                        name="produce_hscode"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="HS Code"
                        value={editProduceData.produce_hscode}
                      />
                    </div>
                    <div className="form-group col-lg-6">
                      <h6>Scientific Name</h6>
                      <input
                        type="text"
                        id="hs_name"
                        name="produce_scientific_name"
                        className="form-control"
                        placeholder="Scientific Name"
                        onChange={handleChange}
                        value={editProduceData.produce_scientific_name}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>
                        Charts of Accounting
                      </h6>
                      {/* <Autocomplete
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
                      /> */}

                      <Autocomplete
                        options={classification1.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN,
                        }))}
                        getOptionLabel={(option) => option.name || ""} // Display the name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "produce_classification_id1",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event structure to work with handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose"
                            variant="outlined"
                            className="form-control"
                          />
                        )}
                        value={
                          classification1
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find(
                              (option) =>
                                option.id ===
                                editProduceData.produce_classification_id1
                            ) || null
                        } // Find the corresponding value
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Correct equality check
                      />
                    </div>
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>VAT Type</h6>

                      <Autocomplete
                        options={classification2.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN,
                        }))}
                        getOptionLabel={(option) => option.name || ""} // Display the name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "produce_classification_id2",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event structure to work with handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose"
                            variant="outlined"
                            className="form-control"
                          />
                        )}
                        value={
                          classification2
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find(
                              (option) =>
                                option.id ===
                                editProduceData.produce_classification_id2
                            ) || null
                        } // Find the corresponding value
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Correct equality check
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>Inventory Type</h6>
                      <Autocomplete
                        options={classification3.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN,
                        }))}
                        getOptionLabel={(option) => option.name || ""} // Display the name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "produce_classification_id3",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event structure to work with handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose"
                            variant="outlined"
                            className="form-control"
                          />
                        )}
                        value={
                          classification3
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find(
                              (option) =>
                                option.id ===
                                editProduceData.produce_classification_id3
                            ) || null
                        } // Find the corresponding value
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Correct equality check
                      />
                    </div>
                    <div className="col-lg-6 form-group autoComplete classificationSelect mb-3">
                      <h6 style={{ paddingBottom: "2px" }}>WHT Type</h6>
                      <Autocomplete
                        options={classification4.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN,
                        }))}
                        getOptionLabel={(option) => option.name || ""} // Display the name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "produce_classification_id4",
                              value: newValue ? newValue.id : "",
                            },
                          }); // Mimic the event structure to work with handleChange
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Choose"
                            variant="outlined"
                            className="form-control"
                          />
                        )}
                        value={
                          classification4
                            .map((item) => ({
                              id: item.ID,
                              name: item.Name_EN,
                            }))
                            .find(
                              (option) =>
                                option.id ===
                                editProduceData.produce_classification_id4
                            ) || null
                        } // Find the corresponding value
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Correct equality check
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
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              onClick={updateProduceItems}
              className="btn btn-primary"
              type="button" // Change type to "button" to prevent form submission on click
            >
              Update
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

export default UpdateProduce;
