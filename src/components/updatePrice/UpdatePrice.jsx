import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../Url/Url";
import { toast } from "react-toastify";
const UpdatePrice = () => {
  const [data, setData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [searchApiData, setSearchApiData] = useState([]);
  const [availabilityOn, setAvailabilityOn] = useState([]);
  const [filteredAvailabilityOn, setFilteredAvailabilityOn] = useState([]);
  const [availabilityOff, setAvailabilityOff] = useState([]);
  const [filteredAvailabilityOff, setFilteredAvailabilityOff] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // store selected row item
  const [cost, setCost] = useState(""); // input value

  const getProduce = () => {
    axios
      .get(`${API_BASE_URL}/GetProduceName`)
      .then((res) => {
        console.log(res.data.data);
        setAvailabilityOn(res.data.availability_on);
        setFilteredAvailabilityOn(res.data.availability_on);
        setAvailabilityOff(res.data.availability_off);
        setFilteredAvailabilityOff(res.data.availability_off);

        const updatedData = res.data.data.map((item) => ({
          ...item,
          Update_price: "", // Initialize Update_price to an empty string
        }));
        setData(updatedData);
        setSearchApiData(updatedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    getProduce();
  }, []);

  const handleAvailabilityChange = (index, type) => (e) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setModalOpen(true);
    }

    const updatedAvailability = [
      ...(type === "on" ? filteredAvailabilityOn : filteredAvailabilityOff),
    ];
    updatedAvailability[index].Available = e.target.checked ? 1 : 0;

    // Make API call with produce_id and availability status
    axios
      .post(`${API_BASE_URL}/updateProduceAvailability`, {
        produce_id: updatedAvailability[index].ID,
        Available: updatedAvailability[index].Available,
        user_id: localStorage.getItem("id"),
      })
      .then((response) => {
        getProduce();
        console.log("Availability update successful", response.data);
        toast.success("Availability update successful");
      })
      .catch((error) => {
        console.error("There was an error updating the availability!", error);
        toast.error("Availability update failed");
      });

    type === "on"
      ? setFilteredAvailabilityOn(updatedAvailability)
      : setFilteredAvailabilityOff(updatedAvailability);

    console.log(updatedAvailability);
  };
  const handleAvailabilityChange1 = (index, item, type) => (e) => {
    const isChecked = e.target.checked;
    const availabilityCopy = [
      ...(type === "on" ? filteredAvailabilityOn : filteredAvailabilityOff),
    ];

    // update availability temporarily
    if (availabilityCopy[index]) {
      availabilityCopy[index].Available = isChecked ? 1 : 0;
    }

    // update UI
    type === "on"
      ? setFilteredAvailabilityOn(availabilityCopy)
      : setFilteredAvailabilityOff(availabilityCopy);

    // open modal and store selected item
    if (isChecked) {
      setSelectedItem(availabilityCopy[index]);
      setModalOpen(true);
    }
  };
  const handleModalClose = () => {
    console.log(selectedItem);
    if (selectedItem) {
      // First API call with cost
      axios
        .post(`${API_BASE_URL}/UpdateProduceCost`, {
          produce_id: selectedItem.ID,
          user_id: localStorage.getItem("id"),
          cost: cost, // include cost in first call
        })
        // .then((response) => {
        //   setCost("");
        //   // Second API call without cost
        //   return axios.post(`${API_BASE_URL}/updateProduceAvailability`, {
        //     produce_id: selectedItem.ID,
        //     Available: selectedItem.Available,
        //   });
        // })
        .then((response) => {
          setCost("");
          toast.success("Second availability update successful");
          console.log("Second update response:", response.data);
          getProduce(); // refresh data after both calls
        })
        .catch((error) => {
          console.error(
            "Error during availability update:",
            error?.response?.data?.message
          );
          toast.error(error?.response?.data?.message);
        });
    }

    setModalOpen(false);
    setSelectedItem(null);
    setCost("");
  };

  const handlePriceChange = (index) => (e) => {
    const updatedData = [...data];
    updatedData[index].Update_price = e.target.value;
    setData(updatedData);
  };

  const handleUpdate = (item) => {
    console.log("Updating item:", item);
    axios
      .post(`${API_BASE_URL}/updatePrice`, {
        produce_id: item.produce,
        Update_price: item.Update_price,
        Available: item.Available,
        user: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log("Update successful", response.data);
        getProduce();
        toast.success("Update successful");
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
        toast.error("Update failed");
      });
  };
  const handleFilter = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterValue(value);

    if (value === "") {
      // Reset to original unfiltered data
      setData(searchApiData);
      setFilteredAvailabilityOn(availabilityOn);
      setFilteredAvailabilityOff(availabilityOff);
    } else {
      // Filter Updated Price table
      const filteredData = searchApiData.filter((item) =>
        item.name?.toLowerCase().includes(value)
      );
      setData(filteredData);

      // Filter Available and Not Available tables
      const filteredOn = availabilityOn.filter((item) =>
        item.Name_EN?.toLowerCase().includes(value)
      );
      const filteredOff = availabilityOff.filter((item) =>
        item.Name_EN?.toLowerCase().includes(value)
      );

      setFilteredAvailabilityOn(filteredOn);
      setFilteredAvailabilityOff(filteredOff);
    }
  };

  // const handleFilter = (event) => {
  //   const value = event.target.value.toLowerCase();
  //   setFilterValue(value);

  //   if (value === "") {
  //     // Reset to original data when filter is cleared
  //     setData(searchApiData); // Reset to original unfiltered data
  //     setFilteredAvailabilityOn(availabilityOn);
  //     setFilteredAvailabilityOff(availabilityOff);
  //   } else {
  //     // Filter based on the input value
  //     const filteredData = searchApiData.filter((item) =>
  //       item.name.toLowerCase().includes(value)
  //     );

  //     const filteredOn = availabilityOn.filter((item) =>
  //       item.produce_name_en.toLowerCase().includes(value)
  //     );

  //     const filteredOff = availabilityOff.filter((item) =>
  //       item.produce_name_en.toLowerCase().includes(value)
  //     );

  //     setData(filteredData);
  //     setFilteredAvailabilityOn(filteredOn);
  //     setFilteredAvailabilityOff(filteredOff);
  //   }
  // };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const clearModal = () => {
    setModalOpen(false);
    setCost("");
  };
  return (
    <div>
      <main className="main-content">
        <div>
          <div className="px-0">
            <div className="row">
              <div className="col-lg-12 col-md-12 mb-4">
                <div className="bg-white">
                  <div className="databaseTableSection pt-0">
                    <div className="grayBgColor p-4 pb-2">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="font-weight-bolder mb-0 pt-2">
                            Update Price Management
                          </h6>
                        </div>
                        <div className="col-md-6">
                          <div className="exportPopupBtn create_btn_style"></div>
                        </div>
                      </div>
                    </div>
                    <div className="top-space-search-reslute">
                      <div className="tab-content px-3">
                        <div className="parentProduceSearch">
                          <div>
                            <input
                              type="text"
                              placeholder="search"
                              value={filterValue}
                              onChange={handleFilter}
                            />
                          </div>
                        </div>
                        <div
                          className="tab-pane active"
                          id="header"
                          role="tabpanel"
                        >
                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                          >
                            <div className="d-flex exportPopupBtn"></div>
                            <table
                              id="example"
                              className="display updatePriceTable table table-hover table-striped borderTerpProduce"
                              style={{ width: "100%" }}
                            >
                              <thead>
                                <tr>
                                  <td>
                                    <div className="row">
                                      <div className="col-3 pe-0 ps-0">
                                        <th
                                          className="fiftyPer"
                                          style={{ padding: "0 5px" }}
                                        >
                                          <table className="table-striped">
                                            <tr>
                                              <th colSpan={2}>Not Available</th>
                                            </tr>
                                            {filteredAvailabilityOff.map(
                                              (item, index) => (
                                                <tr key={item.ID}>
                                                  <td>{item.Name_EN}</td>
                                                  <td
                                                    style={{
                                                      paddingBottom: 0,
                                                    }}
                                                  >
                                                    <label
                                                      className="toggleSwitch large"
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        padding: 10,
                                                      }}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        name="Commission_CurrencyNew"
                                                        checked={
                                                          item.Available === 1
                                                        }
                                                        onChange={handleAvailabilityChange1(
                                                          index,
                                                          "off"
                                                        )}
                                                      />
                                                      <span>
                                                        <span>OFF</span>
                                                        <span> ON</span>
                                                      </span>
                                                      <a> </a>
                                                    </label>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </table>
                                        </th>
                                      </div>
                                      <div className="col-3 pe-0 ps-0">
                                        <th
                                          className="fiftyPer"
                                          style={{ padding: "0 5px" }}
                                        >
                                          <table className="table-striped">
                                            <tr>
                                              <th colSpan={2}>Available</th>
                                            </tr>
                                            {filteredAvailabilityOn.map(
                                              (item, index) => (
                                                <tr key={item.ID}>
                                                  <td>{item.Name_EN}</td>
                                                  <td
                                                    style={{
                                                      paddingBottom: 0,
                                                    }}
                                                  >
                                                    <label
                                                      className="toggleSwitch large"
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        padding: 10,
                                                      }}
                                                    >
                                                      <input
                                                        type="checkbox"
                                                        name="Commission_CurrencyNew"
                                                        checked={
                                                          item.Available === 1
                                                        }
                                                        onChange={handleAvailabilityChange(
                                                          index,
                                                          "on"
                                                        )}
                                                      />
                                                      <span>
                                                        <span>OFF</span>
                                                        <span> ON</span>
                                                      </span>
                                                      <a> </a>
                                                    </label>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </table>
                                        </th>
                                      </div>
                                      <div className="col-6 pe-0 ps-0">
                                        <th
                                          className="fiftyPer"
                                          style={{ padding: "0 5px" }}
                                        >
                                          <table>
                                            <tr>
                                              <th
                                                style={{ textAlign: "" }}
                                                colSpan={7}
                                              >
                                                Updated Price
                                              </th>
                                            </tr>
                                            <tr>
                                              <td>Name</td>
                                              <td>Date</td>
                                              <td>Unit Value</td>
                                              <td>Wastage</td>
                                              <td>Price</td>
                                              <td></td>
                                              <td>Action</td>
                                            </tr>
                                            {data.map((item, index) => (
                                              <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.transaction_date}</td>
                                                <td>{item.unit_value}</td>
                                                <td>{item.wastage}</td>
                                                <td>{item.price}</td>
                                                <td>
                                                  <div className="form-group formCreate mt-0">
                                                    <input
                                                      className="mb-0 w-full"
                                                      style={{ width: "70px" }}
                                                      type="text"
                                                      name="Update_price"
                                                      value={
                                                        item.Update_price || ""
                                                      }
                                                      onChange={handlePriceChange(
                                                        index
                                                      )}
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="btnUpdate">
                                                    <button
                                                      onClick={() =>
                                                        handleUpdate(item)
                                                      }
                                                    >
                                                      Update
                                                    </button>
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </table>
                                        </th>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </thead>
                              <tbody></tbody>
                            </table>
                          </div>
                        </div>
                        <div className="tab-pane" id="menu" role="tabpanel">
                          <div
                            id="datatable_wrapper"
                            className="information_dataTables dataTables_wrapper dt-bootstrap4 table-responsive"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="seperate-line"></div>
                    {modalOpen && (
                      <div
                        className="modal fade show formCreate"
                        style={{
                          display: "block",
                          background: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="modal-dialog  modalShipTo">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Cost</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={clearModal}
                              >
                                <i className="mdi mdi-close"></i>
                              </button>
                            </div>
                            <div className="modal-body">
                              <h6>Enter Cost</h6>
                              <input
                                type="text"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                              />
                            </div>
                            <div className="modal-footer justify-content-center">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleModalClose}
                              >
                                submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpdatePrice;
