import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
const UpdatePackaging = () => {
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
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
  console.log(classification5);
  console.log(from?.Brand);
  const [selectedClassification5, setSelectedClassification5] = useState(null);
  const [selected, setSelected] = useState(
    from?.packaging_inventory_type_id || ""
  );

  const radioHandleChange = (event) => {
    setSelected(event.target.value);
  };

  const defalutState = {
    packaging_name: from?.Name_EN || "",
    packaging_weight: from?.packaging_weight || "",
    Inventory_ID: from?.Inventory_code || "",
    packaging_inventory_type_id: from?.packaging_inventory_type_id || "",
  };

  const [editPackageData, setEditPackageData] = useState(defalutState);
  useEffect(() => {
    console.log("classification5:", classification5);
    console.log("from?.Brand:", from?.Brand);

    if (classification5?.length) {
      const selectedBrand = classification5.find(
        (brand) => brand.ID === Number(from?.Brand) // Ensure matching types
      );

      console.log("selectedBrand:", selectedBrand);

      // Convert selectedBrand to match the Autocomplete options format
      if (selectedBrand) {
        setSelectedClassification5({
          id: selectedBrand.ID,
          name: selectedBrand.Name_EN,
        });
      } else {
        setSelectedClassification5(null);
      }
    }
  }, [classification5, from?.Brand]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditPackageData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const EditPackaging = async () => {
    const request = {
      packaging_id: from?.ID,
      packaging_name: editPackageData.packaging_name,
      packaging_weight: editPackageData.packaging_weight,
      Inventory_ID: editPackageData.Inventory_ID,
      packaging_inventory_type_id: editPackageData.packaging_inventory_type_id,
      expense_Type: classification1Id,
      VAT: classification2Id,
      Inventory_Type: classification3Id,
      WHT: classification4Id,
      Brand: selectedClassification5?.id,
    };

    await axios
      .post(`${API_BASE_URL}/updatePackaging`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/packagingNew");
          return;
        }

        if (response.data.success == false) {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Edit Packaging Api

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
          const defaultSelection = data.find((item) => item.ID === from?.WHT);
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
  // Call getClassificationData1 when component mounts
  useEffect(() => {
    getClassificationData1();
    getClassificationData2();
    getClassificationData3();
    getClassificationData4();
    getClassificationData5();
  }, []);
  return (
    <Card title="Packaging Management / Edit Form">
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
                              name="packaging_name"
                              defaultValue={from?.Name_EN}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6>Weight</h6>
                      {/* <div className="thbFrieght">
                                                                    <div className="parentthb">
                                                                        <div className="childThb">
                                                                            <input type="text" onChange={handleChange} name='packaging_weight' defaultValue={from?.packaging_weight}/>
                                                                        </div>
                                                                        <div className="childThbBtn">
                                                                            <p>g</p>
                                                                        </div>
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
                            defaultValue={editPackageData.packaging_weight}
                          />
                        </div>
                        <div className="shipPercent">
                          <span>g</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 form-group">
                      <h6> Inventory Id </h6>
                      <div className="thbFrieght">
                        <div className="parentthb packParent">
                          <div className="childThb">
                            <input
                              onChange={handleChange}
                              name="Inventory_ID"
                              type="text"
                              defaultValue={from?.Inventory_code}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-lg-3 form-group">
                      <h6>Inventory Type</h6>
                      <div className="parentInventory ">
                        <label htmlFor="html1">Non Inventory</label>
                        <input
                          onChange={(e) => {
                            handleChange(e);
                            radioHandleChange(e);
                          }}
                          className="radio"
                          checked={selected == 0}
                          type="radio"
                          id="html1"
                          name="packaging_inventory_type_id"
                          value={0}
                        />
                        <label htmlFor="css1"> Inventory </label>
                        <input
                          onChange={(e) => {
                            handleChange(e);
                            radioHandleChange(e);
                          }}
                          type="radio"
                          checked={selected == 1}
                          id="css1"
                          name="packaging_inventory_type_id"
                          value={1}
                        />
                      </div>
                    </div> */}
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

                    <div className="form-group col-lg-2 form-group autoComplete classificationSelect mb-3">
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

                    <div className="form-group col-lg-2 form-group autoComplete classificationSelect mb-3">
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
                    <div className="col-lg-2 autoComplete classificationSelect">
                      <h6>Brand</h6>
                      <Autocomplete
                        options={
                          classification5
                            ? classification5.map((item) => ({
                                id: item.ID,
                                name: item.Name_EN,
                              }))
                            : []
                        }
                        getOptionLabel={(option) => option.name || ""}
                        onChange={(event, newValue) => {
                          setSelectedClassification5(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select Brand"
                            variant="outlined"
                            style={{ padding: "10px" }}
                          />
                        )}
                        value={selectedClassification5} // Ensure correct selection
                        isOptionEqualToValue={(option, value) =>
                          option.id === value?.id
                        } // Fix equality check
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <div className="card-footer ">
              <button
                onClick={EditPackaging}
                className="btn btn-primary"
                type="submit"
                name="signup"
              >
                Update
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

export default UpdatePackaging;
