import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
const CreatePackagingNew = () => {
  const defaultState = {
    packaging_name: "",
    Inventory_ID: "",
    packaging_inventory_type_id: 0,
    packaging_weight: "",
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
  const navigate = useNavigate();

  const getClassificationData1 = () => {
    axios
      .get(`${API_BASE_URL}/getExpenseType`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification1(data);

          // Find and set the default selection (ID 9)
          const defaultSelection = data.find((item) => item.ID === 47);
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

  // Call getClassificationData1 when component mounts
  useEffect(() => {
    getClassificationData1();
    getClassificationData2();
    getClassificationData3();
    getClassificationData4();
  }, []);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const addPackaging = () => {
    const request = {
      user_id: localStorage.getItem("id"),
      packaging_name: state.packaging_name,
      Inventory_ID: state.Inventory_ID,
      packaging_inventory_type_id: state.packaging_inventory_type_id,
      packaging_weight: state.packaging_weight,
      expense_Type: classification1Id,
      VAT: classification2Id,
      Inventory_Type: classification3Id,
      WHT: classification4Id,
    };

    console.log(request, "check requestttttt");

    const fieldCheck =
      request.packaging_name == "" ||
      // request.Inventory_ID == "" ||
      // request.packaging_inventory_type_id == "" ||
      request.packaging_weight == "";

    if (fieldCheck) {
      toast.warn("Please Fill All The Fields", {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
    axios
      .post(`${API_BASE_URL}/addPackage`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Created Successfully", {
            autoClose: 1000,
            theme: "colored",
          });

          navigate("/packagingNew");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Card title="Packaging Management / Create Form">
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate createPackage">
                <form action="">
                  <div className="row justify-content-center">
                    <div className="col-lg-4 form-group">
                      <h6>Pack</h6>
                      <div className="thbFrieght">
                        <div className="parentthb packParent">
                          <div className="childThb">
                            <input
                              type="text"
                              onChange={handleChange}
                              placeholder="packaging_name"
                              name="packaging_name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>Weight</h6>
                      {/* <div className="parentShip">
                                                                        <div className="markupShip">
                                                                            <input type="number" placeholder='weight' onChange={handleChange} name='packaging_weight'/>
                                                                        </div>
                                                                        <div className="shipPercent">
                                                                            <span>g</span>
                                                                        </div>
                                                                    </div> */}
                      <div className="parentShip">
                        <div className="markupShip">
                          <input
                            type="text"
                            id="name_en"
                            name="packaging_weight"
                            onChange={handleChange}
                            className="form-control"
                            placeholder="weight"
                          />
                        </div>
                        <div className="shipPercent">
                          <span>g</span>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-4 form-group">
                      <h6>Inventory Type</h6>
                      <div className="parentInventory ">
                        <label htmlFor="html1">Inventory</label>
                        <input
                          onChange={handleChange}
                          className="radio"
                          type="radio"
                          id="html1"
                          name="packaging_inventory_type_id"
                          value={0}
                        />
                        <label htmlFor="css1">Non Inventory </label>
                        <input
                          type="radio"
                          name="packaging_inventory_type_id"
                          onChange={handleChange}
                          id="css1"
                          value={1}
                        />
                      </div>
                    </div> */}
                    <div className="form-group col-lg-4 form-group autoComplete classificationSelect mb-3">
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
                    <div className="form-group col-lg-4 form-group autoComplete classificationSelect mb-3">
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

                    <div className="form-group col-lg-4 form-group autoComplete classificationSelect mb-3">
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

                    <div className="form-group col-lg-4 form-group autoComplete classificationSelect mb-3">
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
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer">
              <button
                className="btn btn-primary"
                type="submit"
                name="signup"
                onClick={addPackaging}
              >
                Create
              </button>
              <Link className="btn btn-danger" to="/packagingNew">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreatePackagingNew;
