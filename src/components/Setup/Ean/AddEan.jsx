 import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const AddEan = () => {
  const [t, i18n] = useTranslation("global");
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [items, setItems] = useState([]);
  const [itfId, setItfId] = useState("");
  const [packagingData, setPackagingData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      detail_type: "",
      item_id: "",
      quantity_per_ean: "",
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
    ean_name_en: "",
    ean_name_th: "",
    ean_code: "",
    estimated_EAN_PER_HOUR: "",
    estimated_EAN_PER_KG: "",
    type: "",
    Notes: "",
  };

  const [state, setState] = useState(defaultState);

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

  const addEanPackagingData = (eanId) => {
    axios
      .post(`${API_BASE_URL}/addEanDetails`, {
        ean_id: eanId,
        data: formValues,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createEan = () => {
    const formData = new FormData();
    formData.append("ean_name_en", state.ean_name_en);
    formData.append("ean_name_th", state.ean_name_th);
    formData.append("ean_unit", state.ean_unit);
    formData.append("ean_code", state.ean_code);
    formData.append("user", localStorage.getItem("id"));
    formData.append("estimated_EAN_PER_HOUR", state.estimated_EAN_PER_HOUR);
    formData.append("estimated_EAN_PER_KG", state.estimated_EAN_PER_KG);
    formData.append("Notes", state.Notes);
    if (state.box_image) {
      formData.append("images", state.box_image); // Append image file if it exists
    }
    const fieldCheck = state.ean_unit === "" || state.ean_code === "";

    if (fieldCheck) {
      toast.warn(t("pleaseFillAllFields"), {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/createEan`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.success === true) {
          toast.success(t("success"), {
            autoClose: 1000,
            theme: "colored",
          });
          addEanPackagingData(response.data.data);
          setItfId(response.data.data);
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
        EAN_ID: itfId,
        unit_id: state.ean_unit,
      })
      .then((response) => {
        console.log(response?.data?.eanData?.Estimated_EAN_PER_HOUR);
        // setState((prevState) => {
        //   return {
        //     ...prevState,
        //     ean_name_en: response?.data?.eanData?.Name_EN,
        //     ean_name_th: response?.data?.eanData?.Name_TH,
        //     estimated_EAN_PER_HOUR:
        //       response?.data?.eanData?.Estimated_EAN_PER_HOUR,
        //     estimated_EAN_PER_KG: response?.data?.eanData?.Estimated_EAN_PER_KG,
        //   };
        // });
        setState((prevState) => {
          const eanData = response?.data?.eanData;

          console.log(
            "Estimated_EAN_PER_HOUR:",
            eanData?.Estimated_EAN_PER_HOUR
          );
          console.log("Estimated_EAN_PER_KG:", eanData?.Estimated_EAN_PER_KG);

          return {
            ...prevState,
            ean_name_en: eanData?.Name_EN,
            ean_name_th: eanData?.Name_TH,
            estimated_EAN_PER_HOUR: eanData?.Estimated_EAN_PER_HOUR || "", // fallback
            estimated_EAN_PER_KG: eanData?.Estimated_EAN_PER_KG || "", // fallback
          };
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const cancelData = () => {
    axios
      .post(`${API_BASE_URL}/deleteItf`, {
        itf_id: itfId,
      })
      .then((response) => {
        console.log(response);
        toast.success(t("eanCancelSuccess"), {
          autoClose: 1000,
          theme: "colored",
        });
        navigate("/eanNew");
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("networkError"), {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const confirmCloseWindow = () => {
    toast.success(t("eanConfirmSuccess"), {
      autoClose: 1000,
      theme: "colored",
    });
    navigate("/eanNew");
  };
  return (
    <Card title={t("eanCreateForm")}>
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
                      <h6>{t("eanCode")}</h6>
                      <input
                        onChange={handleChange}
                        name="ean_code"
                        type="text"
                        placeholder={t("eanCode")}
                      />
                    </div>

                    <div className="col-lg-4 form-group autoComplete">
                      <h6>{t("unit")}</h6>
                      <Autocomplete
                        options={unitDropdown.map((item) => ({
                          id: item.ID,
                          name: item.Name_EN,
                        }))} // Transform unitDropdown to Autocomplete-friendly format
                        getOptionLabel={(option) =>
                          option.name || "Select unit"
                        } // Display the unit name
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "ean_unit", // Match the `name` attribute of the original select
                              value: newValue ? newValue.id : "", // Set the selected value
                            },
                          }); // Mimic the event structure
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectUnit")}
                            variant="outlined"
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Custom equality check
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("nameEn")}</h6>
                      <input
                        type="text"
                        placeholder={t("nameEn")}
                        name="ean_name_en"
                        value={state.ean_name_en}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("nameTh")}</h6>
                      <input
                        type="text"
                        placeholder={t("nameTh")}
                        name="ean_name_th"
                        value={state.ean_name_th}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("estimatedEanHour")}</h6>
                      <input
                        type="text"
                        placeholder={t("estimatedEanHour")}
                        name="estimated_EAN_PER_HOUR"
                        value={state.estimated_EAN_PER_HOUR}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("estimatedEanKg")}</h6>
                      <input
                        type="text"
                        placeholder={t("estimatedEanKg")}
                        name="estimated_EAN_PER_KG"
                        value={state.estimated_EAN_PER_KG}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("notes")} </h6>
                      <input
                        type="text"
                        placeholder={t("notes")}
                        name="Notes"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-lg-12 form-group">
                      <h6>{t("image")}</h6>
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
                                {t("chooseImage")} <CloudUploadIcon />{" "}
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
                    <div className="row">
                      <div className="addBtnEan">
                        <button
                          className="mt-0 mb-5"
                          onClick={generateName}
                          type="button"
                        >
                          {t("generateName")}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    id="datatable_wrapper"
                    className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive mt-"
                  >
                    <div className="eanTop">
                      <div className="eanTableAddHead">
                        <h6>{t("type")}</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>{t("name")}</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>{t("quantity")}</h6>
                      </div>
                      <div className="eanTableAddHead">
                        <h6>{t("actions")}</h6>
                      </div>
                    </div>

                    {formValues.map((element, index) => (
                      <div className="EanAdd" key={`aaa_${index}`}>
                        <div className="">
                          <div
                            className="ceateTransport autoComplete"
                            style={{ width: "280px" }}
                          >
                            <Autocomplete
                              disablePortal
                              options={[
                                { label: t("selectType"), value: "0" },

                                { label: t("setupProduce"), value: "45" },
                                { label: t("setupPackaging"), value: "47" },
                              ]}
                              getOptionLabel={(option) =>
                                option.label || "Select Type"
                              }
                              value={
                                [
                                  { label: t("selectType"), value: "0" },
                                  { label: t("setupProduce"), value: "45" },
                                  { label: t("setupPackaging"), value: "47" },
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
                                  placeholder={t("selectType")}
                                  variant="outlined"
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div value={element.name || ""}>
                          {element.detail_type == 45 ? (
                            <div
                              className="ceateTransport autoComplete"
                              style={{ width: "280px" }}
                            >
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
                                    placeholder={t("selectProduce")}
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
                                    placeholder={t("selectPackaging")}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </div>
                          ) : (
                            <div
                              className="ceateTransport autoComplete"
                              style={{ width: "280px" }}
                            >
                              <Autocomplete
                                disablePortal
                                options={[{ label: t("select"), value: 0 }]}
                                getOptionLabel={(option) =>
                                  option.label || "Select"
                                }
                                value={{ label: t("select"), value: 0 }}
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
                                    placeholder={t("select")}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <div
                            className="ceateTransport"
                            style={{ width: "280px" }}
                          >
                            <input
                              type="number"
                              name="quantity_per_ean"
                              value={element.quantity_per_ean}
                              onChange={(e) => addFieldHandleChange(index, e)}
                            />
                          </div>
                        </div>
                        {index == formValues.length - 1 ? (
                          <button
                            type="button"
                            className="text-2xl"
                            onClick={addFormFields}
                          >
                            <i className="mdi mdi-plus" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="text-2xl"
                            onClick={() => removeFormFields(index)}
                          >
                            <i className="mdi mdi-trash-can-outline" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={createEan}
            >
              Create
            </button>
            <Link className="btn btn-danger" to={"/eanNew"}>
              Cancel
            </Link>
          </div> */}

          <div className="card-footer">
            {itfId ? (
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={confirmCloseWindow}
              >
{t("confirmClose")}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={createEan}
              >
                {t("create")}
              </button>
            )}
            {itfId ? (
              <button className="btn btn-danger" onClick={cancelData}>
               {t("cancel")}
              </button>
            ) : (
              <Link className="btn btn-danger" to="/itfNew">
                {t("close")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddEan;
