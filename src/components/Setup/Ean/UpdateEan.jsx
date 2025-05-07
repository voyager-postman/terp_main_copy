import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { API_IMAGE_URL } from "../../../Url/Url";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Autocomplete, TextField } from "@mui/material";

const UpdateEan = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const [imagePath, setImagePath] = useState(from?.images || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [packagingData, setPackagingData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      detail_type: "",
      item_id: "",
      quantity_per_ean: "",
    },
  ]);
  const [openProd, setOpenProd] = useState(false);
  console.log(from);
  const addFieldHandleChange = (i, e) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        detail_type: "",
        item_id: "",
        quantity_per_ean: "",
      },
    ]);
  };

  const removeFormFields = (i) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const addEanPackagingData = (eanId) => {
    if (formValues.filter((v) => v.item_id).length == 0) return;
    axios
      .post(`${API_BASE_URL}/addEanDetails`, {
        ean_id: eanId,
        data: formValues.filter((v) => v.item_id),
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  const [editProduce, setEditProduce] = useState([]);
  const handleEditProduce = (index, e) => {
    const newEditProduce = [...editProduce];
    newEditProduce[index][e.target.name] = e.target.value;
    setEditProduce(newEditProduce);
  };

  const editEanPackaging = (eanId) => {
    axios
      .post(`${API_BASE_URL}/updateEanDetails`, {
        ean_id: eanId,
        data: editProduce,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenProduce = () => {
    setOpenProd(true);
  };

  const handleCloseProduce = () => {
    setOpenProd(false);
  };
  const deleteEanProduce = (eanProduceID) => {
    axios
      .post(`${API_BASE_URL}/deleteEanProduce`, {
        ean_produce_id: eanProduceID,
      })
      .then((resp) => {
        if (resp.data.success == true) {
          toast.success("Deleted Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          handleCloseProduce();
          getEanProduceData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProduceItems = () => {
    axios
      .get(`${API_BASE_URL}/getProduceItemForEan`)
      .then((response) => {
        setItems(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPackagingData = () => {
    axios
      .get(`${API_BASE_URL}/getPackaginItemForEan`)
      .then((response) => {
        setPackagingData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProduceItems();
    getPackagingData();
  }, []);

  const defaultState = {
    ean_name_en: from?.Name_EN || "",
    ean_name_th: from?.Name_TH || "",
    ean_code: from?.EANCODE || "",
    estimated_EAN_PER_HOUR: from?.Estimated_EAN_PER_HOUR || "",
    estimated_EAN_PER_KG: from?.Estimated_EAN_PER_KG || "",
    ean_unit: from?.Unit || "",
    Notes: from?.Notes || "",
  };

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

  const getEanProduceData = () => {
    axios
      .get(`${API_BASE_URL}/getEanDetails?id=${from?.ID}`)
      .then((resp) => {
        const mappedData = resp.data.data.map((item) => ({
          ean_detail_id: item.ID,
          detail_type: item.COA, // Ensure this field is correctly set
          item_id: item.Item, // Ensure proper field mapping
          quantity_per_ean: item.QTY_Per_EAN || "", // Ensure default value if empty
        }));
        setEditProduce(mappedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getEanProduceData();
  }, []);

  const EditEan = () => {
    console.log("function call");
    const formData = new FormData();
    formData.append("ean_id", from?.ID);
    formData.append("ean_name_en", state.ean_name_en);
    formData.append("ean_name_th", state.ean_name_th);
    formData.append("ean_unit", state.ean_unit);
    formData.append("ean_code", state.ean_code);
    formData.append("estimated_EAN_PER_HOUR", state.estimated_EAN_PER_HOUR);
    formData.append("estimated_EAN_PER_KG", state.estimated_EAN_PER_KG);
    formData.append("Notes", state.Notes);

    if (state.box_image instanceof File) {
      formData.append("images", state.box_image);
    }

    axios
      .post(`${API_BASE_URL}/editEan`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          toast.success("Success", {
            autoClose: 1000,
            theme: "colored",
          });
          addEanPackagingData(from?.ID);
          editEanPackaging(from?.ID);
          navigate("/eanNew");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [unitDropdown, setUnitDropDown] = useState([]);
  const getUnitDropdown = () => {
    axios
      .get(`${API_BASE_URL}/getAllUnit`)
      .then((resp) => {
        setUnitDropDown(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useState(() => {
    getUnitDropdown();
  }, []);

  const generateName = () => {
    axios
      .post(`${API_BASE_URL}/eanNameGenerate`, {
        EAN_ID: from?.ID,
        unit_id: state.ean_unit,
      })
      .then((response) => {
        console.log(response.data.eanData);
        setState((prevState) => {
          return {
            ...prevState,
            ean_name_en: response?.data?.eanData?.Name_EN,
            ean_name_th: response?.data?.eanData?.Name_TH,
            estimated_EAN_PER_HOUR:
              response?.data?.eanData?.Estimated_EAN_PER_HOUR,
            estimated_EAN_PER_KG: response?.data?.eanData?.Estimated_EAN_PER_KG,
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(editProduce);
  return (
    <Card title="EAN Management / Edit Form">
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
                    <div className="col-lg-4 form-group">
                      <h6>EAN Code</h6>
                      <input
                        onChange={handleChange}
                        name="ean_code"
                        type="text"
                        value={state.ean_code}
                        placeholder="ean code"
                      />
                    </div>

                    <div className="col-lg-4 form-group autoComplete">
                      <h6>Unit</h6>
                      <Autocomplete
                        options={
                          Array.isArray(unitDropdown)
                            ? unitDropdown.map((item) => ({
                                unit_id: item.ID,
                                unit_name_en: item.Name_EN,
                              }))
                            : []
                        }
                        getOptionLabel={(option) =>
                          option.unit_name_en || "Select Unit"
                        }
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "ean_unit",
                              value: newValue ? newValue.unit_id : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Unit"
                            variant="outlined"
                          />
                        )}
                        value={
                          unitDropdown
                            .map((item) => ({
                              unit_id: item.ID,
                              unit_name_en: item.Name_EN,
                            }))
                            .find((unit) => unit.unit_id === state.ean_unit) ||
                          null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option.unit_id === value?.unit_id
                        }
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Name En</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        name="ean_name_en"
                        value={state.ean_name_en}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Name Th</h6>
                      <input
                        type="text"
                        placeholder="product name"
                        name="ean_name_th"
                        value={state.ean_name_th}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Estimated Ean/ Hour</h6>
                      <input
                        type="text"
                        placeholder="Estimated Ean/ Hour"
                        value={state.estimated_EAN_PER_HOUR}
                        name="estimated_EAN_PER_HOUR"
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Estimated Ean/ Kg</h6>
                      <input
                        type="text"
                        placeholder="Estimated Ean/ Kg"
                        name="estimated_EAN_PER_KG"
                        value={state.estimated_EAN_PER_KG}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>Notes </h6>
                      <input
                        type="text"
                        placeholder="Notes"
                        name="Notes"
                        value={state.Notes}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-12 form-group">
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
                            <div style={{ marginTop: "5px" }}>
                              <img
                                src={selectedImage}
                                alt="Uploaded"
                                style={{ width: "200px", height: "200px" }}
                              />
                            </div>
                          )}
                          {!selectedImage && imagePath && (
                            <div style={{ marginTop: "10px" }}>
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
                  <div className="row">
                    <div className="addBtnEan">
                      <button
                        className="mt-2 mb-5"
                        type="button"
                        onClick={generateName}
                      >
                        Generate Name
                      </button>
                    </div>
                  </div>
                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <table
                      id="example"
                      className="display table table-hover table-striped borderTerpProduce"
                      style={{ width: "100%" }}
                    >
                      <thead>
                        <tr>
                          <th>
                            <h6>Type</h6>
                          </th>
                          <th>
                            <h6>Name</h6>
                          </th>
                          <th>
                            <h6>Quantity</h6>
                          </th>
                          <th>
                            <h6>Actions</h6>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {editProduce?.map((produceItem, index) => {
                          return (
                            <tr
                              className="rowCursorPointer"
                              key={`tx_${index}`}
                            >
                              <td
                                className="autoComplete"
                                style={{ width: "280px" }}
                              >
                                <Autocomplete
                                  options={[
                                    { detail_type: 0, label: "Select Type" },
                                    { detail_type: 45, label: "Setup produce" },
                                    {
                                      detail_type: 47 || 62,
                                      label: "Setup packaging",
                                    },
                                  ]} // Define the options
                                  getOptionLabel={(option) => option.label} // The text to display for each option
                                  onChange={(event, newValue) => {
                                    // Create an event-like object for handleEditProduce
                                    handleEditProduce(index, {
                                      target: {
                                        name: "detail_type",
                                        value: newValue
                                          ? newValue.detail_type
                                          : 0, // Default to 0 if no selection
                                      },
                                    });
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      placeholder="Select Type" // Placeholder text for the input
                                      variant="outlined"
                                    />
                                  )}
                                  value={
                                    [
                                      { detail_type: 0, label: "Select Type" },
                                      {
                                        detail_type: 45,
                                        label: "Setup produce",
                                      },
                                      {
                                        detail_type: 47,
                                        label: "Setup packaging",
                                      },
                                    ].find(
                                      (option) =>
                                        option.detail_type ===
                                        (produceItem.detail_type === 62
                                          ? 47
                                          : produceItem.detail_type)
                                    ) || null
                                  } // Map 62 to 47
                                  isOptionEqualToValue={(option, value) =>
                                    option.detail_type ===
                                    (value.detail_type === 62
                                      ? 47
                                      : value.detail_type)
                                  } // Ensure the option matches the selected value
                                />
                              </td>

                              <td style={{ width: "280px" }}>
                                {produceItem.detail_type == 45 ? (
                                  <div
                                    className="ceateTransport autoComplete"
                                    style={{ width: "280px" }}
                                  >
                                    <Autocomplete
                                      options={
                                        items?.map((item) => ({
                                          produce_id: item.ID, // Ensure IDs match correctly
                                          produce_name_en: item.Name_EN,
                                        })) || []
                                      }
                                      getOptionLabel={(option) =>
                                        option.produce_name_en ||
                                        "Select Produce"
                                      }
                                      onChange={(event, newValue) => {
                                        handleEditProduce(index, {
                                          target: {
                                            name: "item_id",
                                            value: newValue
                                              ? newValue.produce_id
                                              : "",
                                          },
                                        });
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Produce"
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        items
                                          ?.map((item) => ({
                                            produce_id: item.ID,
                                            produce_name_en: item.Name_EN,
                                          }))
                                          .find(
                                            (option) =>
                                              option.produce_id ===
                                              produceItem.item_id
                                          ) || null
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.produce_id === value?.produce_id
                                      }
                                    />
                                  </div>
                                ) : produceItem.detail_type == 47 || 62 ? (
                                  <div
                                    className="ceateTransport autoComplete"
                                    style={{ width: "280px" }}
                                  >
                                    <Autocomplete
                                      options={
                                        packagingData?.map((item) => ({
                                          packaging_id: item.ID, // Ensure IDs match correctly
                                          packaging_name: item.Name_EN,
                                        })) || []
                                      }
                                      getOptionLabel={(option) =>
                                        option.packaging_name ||
                                        "Select Packaging"
                                      }
                                      onChange={(event, newValue) => {
                                        handleEditProduce(index, {
                                          target: {
                                            name: "item_id",
                                            value: newValue
                                              ? newValue.packaging_id
                                              : "",
                                          },
                                        });
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder="Select Packaging"
                                          variant="outlined"
                                        />
                                      )}
                                      value={
                                        packagingData
                                          ?.map((item) => ({
                                            packaging_id: item.ID,
                                            packaging_name: item.Name_EN,
                                          }))
                                          .find(
                                            (option) =>
                                              option.packaging_id ===
                                              produceItem.item_id
                                          ) || null
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.packaging_id ===
                                        value?.packaging_id
                                      } // Ensure it doesn't break if value is null
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="ceateTransport autoComplete"
                                    style={{ width: "280px" }}
                                  >
                                    <Autocomplete
                                      options={[
                                        { item_id: 0, label: "Select" },
                                      ]}
                                      getOptionLabel={(option) => option.label} // The text to display for each option
                                      onChange={(event, newValue) => {
                                        // Handle the change event by passing the new value
                                        handleEditProduce(index, {
                                          target: {
                                            name: "item_id",
                                            value: newValue
                                              ? newValue.item_id
                                              : 0, // Default to 0 if nothing is selected
                                          },
                                        });
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select" // Placeholder text
                                        />
                                      )}
                                      value={
                                        [
                                          { item_id: 0, label: "Select" },
                                          // Define other options here if needed
                                        ].find(
                                          (option) =>
                                            option.item_id ===
                                            produceItem.item_id
                                        ) || null // Find the selected option based on item_id
                                      }
                                      isOptionEqualToValue={(option, value) =>
                                        option.item_id === value.item_id
                                      } // Ensure the option matches the selected value
                                    />
                                  </div>
                                )}
                              </td>

                              <td style={{ width: "280px" }}>
                                <div
                                  className="ceateTransport"
                                  style={{ width: "280px" }}
                                >
                                  <input
                                    type="number"
                                    name="quantity_per_ean"
                                    value={produceItem.quantity_per_ean}
                                    onChange={(e) =>
                                      handleEditProduce(index, e)
                                    }
                                  />
                                </div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="text-2xl"
                                  onClick={handleOpenProduce}
                                >
                                  <i className="mdi mdi-trash-can-outline" />
                                </button>
                                <Dialog
                                  fullWidth
                                  open={openProd}
                                  onClose={handleCloseProduce}
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
                                      onClick={() =>
                                        deleteEanProduce(
                                          produceItem.ean_detail_id
                                        )
                                      }
                                    >
                                      Yes
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-lg btn-block make-an-offer-btn me-1"
                                      onClick={handleCloseProduce}
                                    >
                                      No
                                    </button>
                                  </DialogActions>
                                </Dialog>
                              </td>
                            </tr>
                          );
                        })}
                        {formValues.map((element, index) => (
                          <tr className="rowCursorPointer" key={`td_${index}`}>
                            <td
                              className="autoComplete autoComplete"
                              style={{ width: "280px" }}
                            >
                              <Autocomplete
                                disablePortal
                                options={[
                                  { label: "Select Type", value: "0" },
                                  { label: "Setup produce", value: "45" },
                                  { label: "Setup packaging", value: "47" },
                                ]}
                                getOptionLabel={(option) =>
                                  option.label || "Select Type"
                                }
                                value={
                                  [
                                    { label: "Select Type", value: "0" },
                                    { label: "Setup produce", value: "45" },
                                    { label: "Setup packaging", value: "47" },
                                  ].find(
                                    (item) => item.value === element.detail_type
                                  ) || null
                                }
                                onChange={(event, value) => {
                                  addFieldHandleChange(index, {
                                    target: {
                                      name: "detail_type",
                                      value: value?.value || "0", // Default to "0" if no value is selected
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
                            <td style={{ width: "280px" }}>
                              {element.detail_type == 45 ? (
                                <div
                                  className="ceateTransport autoComplete"
                                  style={{ width: "280px" }}
                                >
                                  {/* <select
                                    name="item_id"
                                    id=""
                                    onChange={(e) => {
                                      addFieldHandleChange(index, e);
                                    }}
                                  >
                                    {items?.map((item, i) => (
                                      <option
                                        key={item.produce_id}
                                        value={item.produce_id}
                                      >
                                        {item.produce_name_en}
                                      </option>
                                    ))}
                                  </select> */}
                                  <Autocomplete
                                    disablePortal
                                    options={items?.map((item) => ({
                                      label: item.Name_EN,
                                      value: item.ID,
                                    }))}
                                    getOptionLabel={(option) =>
                                      option.label || "Select Produce"
                                    }
                                    value={
                                      items
                                        ?.map((item) => ({
                                          label: item.Name_EN,
                                          value: item.ID,
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
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Produce"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </div>
                              ) : element.detail_type == 47 ? (
                                <div
                                  className="ceateTransport autoComplete"
                                  style={{ width: "280px" }}
                                >
                                  <Autocomplete
                                    disablePortal
                                    options={packagingData?.map((item) => ({
                                      label: item.Name_EN,
                                      value: item.ID,
                                    }))}
                                    getOptionLabel={(option) =>
                                      option.label || "Select Packaging"
                                    }
                                    value={
                                      packagingData
                                        ?.map((item) => ({
                                          label: item.Name_EN,
                                          value: item.ID,
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
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select Packaging"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                  {/* <select
                                    name="item_id"
                                    id=""
                                    onChange={(e) => {
                                      addFieldHandleChange(index, e);
                                    }}
                                  >
                                    <option selected>Select Packaging</option>

                                    {packagingData?.map((item) => (
                                      <option value={item.packaging_id}>
                                        {item.packaging_name}
                                      </option>
                                    ))}
                                  </select> */}
                                </div>
                              ) : (
                                <div
                                  className="ceateTransport autoComplete"
                                  style={{ width: "280px" }}
                                >
                                  {/* <select
                                    name="item_id"
                                    id=""
                                    onChange={(e) => {
                                      addFieldHandleChange(index, e);
                                    }}
                                  >
                                    <option value={0}>Select</option>
                                  </select> */}
                                  <Autocomplete
                                    disablePortal
                                    options={[{ label: "Select", value: 0 }]}
                                    getOptionLabel={(option) =>
                                      option.label || "Select"
                                    }
                                    value={{ label: "Select", value: 0 }}
                                    onChange={(event, value) => {
                                      addFieldHandleChange(index, {
                                        target: {
                                          name: "item_id",
                                          value: value?.value || 0,
                                        },
                                      });
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        placeholder="Select"
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </div>
                              )}
                            </td>
                            <td style={{ width: "280px" }}>
                              <div
                                className="ceateTransport"
                                style={{ width: "280px" }}
                              >
                                <input
                                  type="number"
                                  name="quantity_per_ean"
                                  value={element.quantity_per_ean}
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
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={EditEan}
            >
              Update
            </button>
            <Link className="btn btn-danger" to={"/eanNew"}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UpdateEan;
