import axios from "axios";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { ComboBox } from "../combobox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const EditExpenseItems = () => {
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
  const { data: dropdownList } = useQuery("getDropdownType");
  const { data: ChartOfAccounts } = useQuery("getChartOfAccounts");

  const defaultState = {
    name_en: from?.Name_EN || "",
    name_th: from?.Name_TH || "",
    Type: from?.Type || "",
    chart_of_accounts: from?.COA || "",
  };

  const [editBoxData, setEditBoxData] = useState(defaultState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditBoxData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  // Edit Box Api
  const updateBoxData = async () => {
    const request = {
      ID: from?.ID,
      User_ID: localStorage.getItem("id"),
      name_en: editBoxData?.name_en || "",
      name_th: editBoxData.name_th || "",

      chart_of_accounts: editBoxData.chart_of_accounts || "",
      expense_Type: classification1Id,
      VAT: classification2Id,
      Inventory_Type: classification3Id,
      WHT: classification4Id,
    };
    try {
      await axios.post(
        `${API_BASE_URL}/${
          request.ID ? "updateExpenseItems" : "createExpenseItems"
        }`,
        request
      );
      toast.success("Successfully");
      navigate("/expenseItem");
    } catch (e) {
      toast.error("Network Error");
    }
  };
  console.log(selectedClassification1);
  const getClassificationData1 = () => {
    axios
      .get(`${API_BASE_URL}/getExpenseType`)
      .then((response) => {
        if (response.data.success) {
          const data = response.data.data;
          setClassification1(data);

          console.log("Expense Type from state:", from?.expense_Type); // Debugging

          // Find the default selection using a correct condition
          const defaultSelection = data.find(
            (item) => item.ID === (from?.expense_Type ?? 6)
          );

          console.log("Default Selection:", defaultSelection); // Debugging

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
          const defaultSelection = data.find(
            (item) => item.ID === (from?.VAT ?? 1)
          );
          // Find and set the default selection (ID 9)

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
          const defaultSelection = data.find(
            (item) => item.ID === (from?.Inventory_Type ?? 2)
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
          const defaultSelection = data.find(
            (item) => item.ID === (from?.WHT ?? 1)
          );

          // Find and set the default selection (ID 9)

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
  // Edit Box Api
  return (
    <Card title={"Expenses Management / Edit Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4 "
            >
              <div className="formCreate">
                <form action="">
                  <div className="row">
                    <div className="form-group col-lg-3">
                      <label>English Name</label>
                      <input
                        type="text"
                        id="name_en"
                        name="name_en"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name"
                        defaultValue={editBoxData.name_en}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <label>Thai Name</label>
                      <input
                        type="text"
                        id="name_th"
                        name="name_th"
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name"
                        defaultValue={editBoxData.name_th}
                      />
                    </div>

                    <div className="form-group col-lg-3 autoComplete">
                      <label>Charts of Accounting</label>

                      {/* <Autocomplete
                        disablePortal
                        options={
                          ChartOfAccounts?.map((v) => ({
                            accounting_id: v.Account,
                            Name: v.Name,
                          })) || []
                        } // Map `ChartOfAccounts` to structured options, fallback to empty array
                        value={
                          ChartOfAccounts?.find(
                            (item) =>
                              item.Account === editBoxData.chart_of_accounts
                          ) || null
                        } // Match the selected value based on `accounting_id`
                        onChange={(event, newValue) => {
                          setEditBoxData((prevState) => ({
                            ...prevState,
                            chart_of_accounts: newValue
                              ? newValue.Account
                              : null, // Update `chart_of_accounts` with the selected `accounting_id`
                          }));
                        }}
                        getOptionLabel={(option) => option?.Name || ""} // Display `Name` for each option
                        isOptionEqualToValue={(option, value) =>
                          option.Account === value?.Account
                        } // Ensure the option matches the selected value by `accounting_id`
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select Account"
                          />
                        )}
                      /> */}
                      <Autocomplete
                        disablePortal
                        options={ChartOfAccounts || []} // Directly use ChartOfAccounts
                        value={
                          ChartOfAccounts?.find(
                            (item) => item.ID === editBoxData.chart_of_accounts
                          ) || null
                        } // Ensure the correct selection
                        onChange={(event, newValue) => {
                          setEditBoxData((prevState) => ({
                            ...prevState,
                            chart_of_accounts: newValue ? newValue.ID : "", // Store the correct `Account` value
                          }));
                        }}
                        getOptionLabel={(option) => option?.Name_EN || ""} // Display `Name`
                        isOptionEqualToValue={(option, value) =>
                          option.ID === value?.ID
                        } // Compare by `Account`
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Select Account"
                          />
                        )}
                      />
                    </div>

                    {/* <div className="form-group col-lg-3 form-group autoComplete classificationSelect mb-3">
                      <h6>Expense Type</h6>
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
                 
                    </div> */}
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
          <div className="card-footer buttonCreate">
            <button
              onClick={updateBoxData}
              className="btn btn-primary"
              style={{ width: "125px" }}
              type="submit"
              name="signup"
            >
              {from?.ID ? "Update" : "Create"}
            </button>
            <Link className="btn btn-danger" to="/expenseItem">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EditExpenseItems;
