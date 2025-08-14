import axios from "../../Url/Api";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
const AddVendor = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const location = useLocation();
  const { from } = location.state || {};
  console.log(from);
  const navigate = useNavigate();
  const { data: massengerTypeList } = useQuery("getMessengerType");
  console.log(massengerTypeList);
  const messengerOptions =
    massengerTypeList?.map((item) => ({
      label: item.Name_EN,
      value: item.ID,
    })) || [];
  const [state1, setState1] = useState({
    VCID: from?.ID || "",
    Name_First: "",
    Name_Last: "",
    Email: "",
    Phone: "",
    Mobile: "",
    Messenger_Type: "",
    Messenger_ID: "",
    Notes: "",
    Accounting: false,
    Invoice: false,
    Logitics: false,
  });
  const [state, setState] = useState({
    User_ID: localStorage.getItem("id"),
    Supplier: from?.Supplier ?? 1,
    vendor_id: from?.ID ?? undefined,
    name: from?.Name ?? "",
    taxId: from?.TAX ?? "",
    Entity: from?.Legal_Entity ?? "",
    phone: from?.Phone_Main ?? "",
    email: from?.Email_Main ?? "",
    Messenger_Type: from?.Messenger_Type ?? "",
    messangerId: from?.Messenger_Main_ID ?? "",
    address1: from?.Address1 ?? "",
    address2: from?.Address2 ?? "",
    Bank_Name: from?.Bank_Name ?? "",
    Bank_Branch: from?.Bank_Branch ?? "",
    Bank_Account: from?.Bank_Account ?? "",
    Bank_IBAN: from?.Bank_IBAN ?? "",
    Bank_Swift: from?.Bank_Swift ?? "",
    Bank_Country: from?.Bank_Country ?? "",
    Bank_Address: from?.Bank_Address ?? "",
  });
  const { data: dropdownVendor } = useQuery("getDropdownVendor");
  const { data: dropdownDistrict } = useQuery("getDropdownAddressDistrict");
  const { data: dropdownSubDistrict } = useQuery(
    "getDropdownAddressSub-district"
  );
  const availableDistrict = useMemo(() => {
    return dropdownDistrict?.filter((item) => item._id == state.provinces);
  }, [state.provinces, dropdownDistrict]);

  const availableSubDistrict = useMemo(() => {
    return dropdownSubDistrict?.filter((item) => item._id == state.district);
  }, [state.provinces, dropdownDistrict, state.district, dropdownSubDistrict]);
  console.log(availableSubDistrict);
  useEffect(() => {
    const p = dropdownSubDistrict?.find(
      (item) => item.code == state.id
    )?.zipcode;
    if (p)
      setState((prevState) => {
        return {
          ...prevState,
          postcode: p,
        };
      });
  }, [state.subdistrict, dropdownSubDistrict]);
  const handleChange1 = (e) => {
    const { name, value, type, checked } = e.target;
    setState1((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        ...state1, // assuming your state variable is `state`
        User_ID: localStorage.getItem("id"), // Get from localStorage
      };

      const res = await axios.post(`${API_BASE_URL}/AddVcContact`, payload);
      console.log("Response:", res.data);

      // Reset form
      setState1({
        VCID: "",
        Name_First: "",
        Name_Last: "",
        Email: "",
        Phone: "",
        Mobile: "",
        Messenger_Type: "",
        Messenger_ID: "",
        Notes: "",
        Accounting: false,
        Invoice: false,
        Logitics: false,
      });

      // Hide modal
      const modalElement = document.getElementById("exampleModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.hide();
      }

      // Success toast (using message from API if available)
      toast.success(res.data?.message, {
        autoClose: 1000,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error(t("networkError"), {
        autoClose: 1000,
        theme: "colored",
      });
      return false;
    }
  };
  const clearAllData = () => {
    setState1({
      VCID: "",
      Name_First: "",
      Name_Last: "",
      Email: "",
      Phone: "",
      Mobile: "",
      Messenger_Type: "",
      Messenger_ID: "",
      Notes: "",
      Accounting: false,
      Invoice: false,
      Logitics: false,
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const updateVendor = async () => {
    try {
      setIsButtonClicked(true); // Set button clicked state to true
      await axios.post(
        `${API_BASE_URL}/${
          typeof state.vendor_id == "undefined" ? "addVC" : "updateVC"
        }`,
        {
          id: state.vendor_id,
          User_ID: state.User_ID,
          name: state.name,
          taxId: state.taxId,
          Phone_Main: state.phone,
          Email_Main: state.email,
          Messenger_Type: state.Messenger_Type,
          Messenger_Main_ID: state.messangerId,
          Country: selectedCountry?.name || "",
          Province: selectedProvince?.name || "",
          District: selectedDistrict?.name || "",
          Subdistrict: selectedSubdistrict?.name || "",
          Postcode: postalCode,
          Address1: state.address1,
          Address2: state.address2,
          Bank_Name: state.Bank_Name,
          Legal_Entity: state.Entity,
          Bank_Branch: state.Bank_Branch,
          Bank_Account: state.Bank_Account,
          Bank_IBAN: state.Bank_IBAN,
          Bank_Swift: state.Bank_Swift,
          Bank_Country: state.Bank_Country,
          Bank_Address: state.Bank_Address,
          Supplier: state.Supplier || 1,
        }
      );
      toast.success(t("success"));

      navigate("/vendor");
    } catch (error) {
      toast.error(t("errorWhileSaving"));
    }
  };

  const [t, i18n] = useTranslation("global");
  const countries = ["WhatsApp", "Telegram"];
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [countryList, setCountryList] = useState([]);
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/countries`)
      .then((res) => {
        if (Array.isArray(res.data?.countries)) {
          setCountryList(res.data.countries);
        } else {
          console.error("Expected countries array not found", res.data);
        }
      })
      .catch((err) => console.error("Axios error:", err));
  }, []);
  const [provinceList, setProvinceList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  useEffect(() => {
    const fetchProvinces = async () => {
      if (!selectedCountry?.id) {
        setProvinceList([]);
        setSelectedProvince(null);
        return;
      }

      try {
        const { data } = await axios.get(
          `https://r3.siameats.net/api/provinces/${selectedCountry.id}`
        );
        if (Array.isArray(data?.provinces)) {
          setProvinceList(data.provinces);
        } else {
          console.error("Expected 'provinces' to be an array", data);
          setProvinceList([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinceList([]);
      }
    };

    fetchProvinces();
  }, [selectedCountry]);
  // district
  const [districtList, setDistrictList] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  useEffect(() => {
    if (!selectedProvince?.id) {
      setDistrictList([]);
      setSelectedDistrict(null);
      return;
    }

    axios
      .get(`${API_BASE_URL}/districts/${selectedProvince.id}`)
      .then(({ data }) => {
        console.log("", data);
        if (Array.isArray(data?.districts)) {
          setDistrictList(data.districts);
        } else {
          console.error("Expected districts array", data);
          setDistrictList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching districts:", err);
        setDistrictList([]);
      });
  }, [selectedProvince]);
  // sub district
  const [subdistrictList, setSubdistrictList] = useState([]);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);
  useEffect(() => {
    if (!selectedDistrict?.id) {
      setSubdistrictList([]);
      setSelectedSubdistrict(null);
      return;
    }

    axios
      .get(`${API_BASE_URL}/subdistricts/${selectedDistrict.id}`)
      .then(({ data }) => {
        console.log("pratimaDis", data);
        if (Array.isArray(data?.Subdistricts)) {
          setSubdistrictList(data.Subdistricts);
        } else {
          console.error("pratima", data);
          setSubdistrictList([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching subdistricts:", err);
        setSubdistrictList([]);
      });
  }, [selectedDistrict]);

  const [postalCode, setPostalCode] = useState(null);

  useEffect(() => {
    if (!selectedSubdistrict?.lat || !selectedSubdistrict?.lng) {
      setPostalCode("");
      return;
    }

    axios
      .get(
        `${API_BASE_URL}/postal-code?lat=${selectedSubdistrict.lat}&lng=${selectedSubdistrict.lng}`
      )
      .then(({ data }) => {
        if (data?.date?.postal_code) {
          setPostalCode(data.date.postal_code);
        } else {
          setPostalCode("");
        }
      })
      .catch(() => {
        setPostalCode("");
      });
  }, [selectedSubdistrict]);
  // Pre-fill form for update mode
  useEffect(() => {
    if (!from || countryList.length === 0) return;

    // 1️⃣ Find Country
    const countryObj = countryList.find((c) => c.name === from.Country);
    if (countryObj) {
      setSelectedCountry(countryObj);

      // Fetch provinces and set province
      axios
        .get(`https://r3.siameats.net/api/provinces/${countryObj.id}`)
        .then(({ data }) => {
          if (Array.isArray(data?.provinces)) {
            setProvinceList(data.provinces);
            const provinceObj = data.provinces.find(
              (p) => p.name === from.Province
            );
            if (provinceObj) {
              setSelectedProvince(provinceObj);

              // Fetch districts and set district
              axios
                .get(`${API_BASE_URL}/districts/${provinceObj.id}`)
                .then(({ data }) => {
                  if (Array.isArray(data?.districts)) {
                    setDistrictList(data.districts);
                    const districtObj = data.districts.find(
                      (d) => d.name === from.District
                    );
                    if (districtObj) {
                      setSelectedDistrict(districtObj);

                      // Fetch subdistricts and set subdistrict
                      axios
                        .get(`${API_BASE_URL}/subdistricts/${districtObj.id}`)
                        .then(({ data }) => {
                          if (Array.isArray(data?.Subdistricts)) {
                            setSubdistrictList(data.Subdistricts);
                            const subdistrictObj = data.Subdistricts.find(
                              (s) => s.name === from.Subdistrict
                            );
                            if (subdistrictObj) {
                              setSelectedSubdistrict(subdistrictObj);
                              setPostalCode(from.Postcode || "");
                            }
                          }
                        });
                    }
                  }
                });
            }
          }
        });
    }
  }, [from, countryList]);

  return (
    <Card
      title={`${t("vendorManagement")} / ${
        typeof state?.vendor_id !== "undefined" ? t("update") : t("create")
      } ${t("form")}`}
    >
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="vc_form formCreate ">
            <div className="row">
              <div className="row justify-content-between">
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-4 form-group">
                      <h6>{t("name")}</h6>
                      <input
                        type="text"
                        id="name"
                        onChange={handleChange}
                        name="name"
                        className="form-control"
                        placeholder="Name"
                        defaultValue={state.name}
                      />
                    </div>

                    <div className="col-lg-4 form-group">
                      <h6>{t("taxId")}</h6>
                      <input
                        type="text"
                        id="taxId"
                        value={state.taxId || ""}
                        onChange={handleChange}
                        name="taxId"
                        className="form-control"
                        placeholder="Tax"
                      />
                    </div>
                    <div className="form-group col-lg-4 autoComplete">
                      <h6>{t("Entity")}</h6>

                      <Autocomplete
                        options={dropdownVendor || []} // Populate with the list of vendors
                        getOptionLabel={(option) => option.entity_name_en || ""} // Display the English name of the entity
                        value={
                          dropdownVendor?.find(
                            (vendor) => vendor.id === state.Entity
                          ) || null
                        } // Match the current entity ID in state with the options
                        onChange={(e, newValue) => {
                          handleChange({
                            target: {
                              name: "Entity",
                              value: newValue?.id || "",
                            },
                          }); // Trigger handleChange with the selected entity's ID
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("SelectEntity")} // Adds a placeholder
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Ensure proper matching
                        sx={{ width: 300 }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="text-end">
                    <button
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Add Contact
                    </button>
                  </div>
                  {/* add-contact-modal */}
                  <div
                    class="modal fade"
                    id="exampleModal"
                    tabindex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div class="modal-dialog modalShipTo modal-xl">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Add Contact
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            onClick={clearAllData}
                            aria-label="Close"
                          >
                            <i class="mdi mdi-close"></i>
                          </button>
                        </div>
                        <div class="modal-body">
                          <div className="formCreate">
                            <form action="">
                              <div className="row">
                                <div class="form-group col-lg-4">
                                  <h6>First Name</h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="Name_First"
                                      value={state1.Name_First}
                                      onChange={handleChange1}
                                      placeholder="first name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-4">
                                  <h6>Last Name</h6>
                                  <div class=" ">
                                    <input
                                      type="text"
                                      name="Name_Last"
                                      value={state1.Name_Last}
                                      onChange={handleChange1}
                                      placeholder="last name"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-4">
                                  <h6>Email</h6>
                                  <div class=" ">
                                    <input
                                      type="email"
                                      name="Email"
                                      value={state1.Email}
                                      onChange={handleChange1}
                                      placeholder="email"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Mobile</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="Mobile"
                                      value={state1.Mobile}
                                      onChange={handleChange1}
                                      placeholder="mobile"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Phone</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="Phone"
                                      value={state1.Phone}
                                      onChange={handleChange1}
                                      placeholder="phone"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Messenger type</h6>
                                  <div class="ceateTransport autoComplete">
                                   
                                    <Autocomplete
                                      options={messengerOptions}
                                      getOptionLabel={(option) => option.label} // what to display in dropdown
                                      value={
                                        messengerOptions.find(
                                          (opt) =>
                                            opt.value ===
                                            Number(state1.Messenger_Type)
                                        ) || null
                                      }
                                      onChange={(event, newValue) =>
                                        setState1({
                                          ...state1,
                                          Messenger_Type: newValue
                                            ? newValue.value
                                            : "",
                                        })
                                      }
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          placeholder={t("messengerType")}
                                          variant="outlined"
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-3">
                                  <h6>Messenger Id</h6>
                                  <div class=" ">
                                    <input
                                      type="number"
                                      name="Messenger_ID"
                                      value={state1.Messenger_ID}
                                      onChange={handleChange1}
                                      placeholder="messenger id"
                                    />
                                  </div>
                                </div>
                                <div class="form-group col-lg-12">
                                  <h6>Notes</h6>
                                  <div>
                                    <textarea
                                      name="Notes"
                                      value={state1.Notes}
                                      onChange={handleChange1}
                                      cols="30"
                                      rows="4"
                                    ></textarea>
                                  </div>
                                </div>
                                <div className="form-group col-lg-12">
                                  <div className="invoiceModal">
                                    <div>
                                      <input
                                        type="checkbox"
                                        id="dap"
                                        name="Accounting"
                                        checked={state1.Accounting}
                                        onChange={handleChange1}
                                      />
                                      <label htmlFor="dap">Accounting</label>
                                    </div>
                                    <div>
                                      <input
                                        type="checkbox"
                                        id="cnf"
                                        name="Invoice"
                                        checked={state1.Invoice}
                                        onChange={handleChange1}
                                      />
                                      <label htmlFor="cnf">Invoice</label>
                                    </div>
                                    <input
                                      type="checkbox"
                                      id="cif"
                                      name="Logitics"
                                      checked={state1.Logitics}
                                      onChange={handleChange1}
                                    />
                                    <label htmlFor="cif">Logitics</label>
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-primary mb-0"
                            onClick={handleSubmit}
                          >
                            submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>{t("phone")}</h6>
                <input
                  type="text"
                  id="phone"
                  value={state.phone || ""}
                  onChange={handleChange}
                  name="phone"
                  className="form-control"
                  placeholder="Phone"
                />
              </div>
              <div className="col-lg-3 form-group">
                <h6>{t("email")}</h6>
                <input
                  type="text"
                  id="phone"
                  value={state.email || ""}
                  onChange={handleChange}
                  name="email"
                  className="form-control"
                  placeholder="Email"
                />
              </div>
              <div className="col-lg-3 form-group autoComplete">
                <h6>{t("messengerType")}</h6>
                <div>
                  {/* <Autocomplete
                    options={countries}
                    value={state.Messenger_Type || ""}
                    onChange={(event, newValue) =>
                      setState({ ...state, Messenger_Type: newValue })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("messengerType")}
                        variant="outlined"
                      />
                    )}

                  /> */}
                  <Autocomplete
                    options={messengerOptions}
                    getOptionLabel={(option) => option.label} // what to display in dropdown
                    value={
                      messengerOptions.find(
                        (opt) => opt.value === Number(state.Messenger_Type)
                      ) || null
                    }
                    onChange={(event, newValue) =>
                      setState({
                        ...state,
                        Messenger_Type: newValue ? newValue.value : "",
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("messengerType")}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-3 form-group">
                <h6>{t("messangerId")}</h6>
                <div>
                  <input
                    type="text"
                    id="messangerId"
                    value={state.messangerId || ""}
                    onChange={handleChange}
                    name="messangerId"
                    className="form-control"
                    placeholder="Messanger ID"
                  />
                </div>
              </div>

              <div className="col-lg-3 form-group autoComplete mb-3">
                <h6>{t("country")}</h6>
                <div>
                  <Autocomplete
                    options={countryList}
                    getOptionLabel={(option) => option.name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    value={selectedCountry}
                    onChange={(event, newValue) => setSelectedCountry(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("country")}
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="form-group col-lg-3 autoComplete mb-3">
                <h6>{t("province")}</h6>
                <Autocomplete
                  options={provinceList}
                  getOptionLabel={(opt) => opt.name ?? ""}
                  isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                  value={selectedProvince}
                  onChange={(e, newProv) => setSelectedProvince(newProv)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("province")}
                      variant="outlined"
                    />
                  )}
                  style={{ marginTop: 16 }}
                />
              </div>
              <div className="form-group col-lg-3 autoComplete mb-3">
                <h6>{t("district")}</h6>
                <Autocomplete
                  options={districtList}
                  getOptionLabel={(opt) => opt.name ?? ""}
                  isOptionEqualToValue={(opt, val) => opt.id === val?.id}
                  value={selectedDistrict}
                  onChange={(e, dis) => setSelectedDistrict(dis)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("district")}
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="col-lg-3 form-group autoComplete">
                <h6>{t("subDistrict")}</h6>
                <Autocomplete
                  options={subdistrictList || []}
                  getOptionLabel={(opt) => opt?.name ?? ""}
                  isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                  value={selectedSubdistrict || null}
                  onChange={(e, sub) => setSelectedSubdistrict(sub)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Subdistrict"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="col-lg-3 form-group">
                <h6>{t("postCode")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={postalCode || ""}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>

              <div className="col-lg-3 form-group">
                <h6>{t("address")} 1</h6>
                <input
                  type="text"
                  id="address1"
                  value={state.address1 || ""}
                  onChange={handleChange}
                  name="address1"
                  className="form-control"
                  placeholder="Address1"
                />
              </div>
              <div className="col-lg-3 form-group">
                <h6>{t("address")} 2</h6>
                <input
                  type="text"
                  id="address2"
                  value={state.address2 || ""}
                  onChange={handleChange}
                  name="address2"
                  className="form-control"
                  placeholder="Address2"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 form-group autoComplete">
                <h6 style={{ fontWeight: "bold" }}> {t("BankDetails")}:</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 form-group">
                <h6>{t("bankName")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={state.Bank_Name || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_Name: e.target.value })
                  }
                />
              </div>

              <div className="col-lg-4 form-group">
                <h6>{t("bankBranch")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={state.Bank_Branch || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_Branch: e.target.value })
                  }
                />
              </div>

              <div className="col-lg-4 form-group">
                <h6>{t("bankAccount")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={state.Bank_Account || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_Account: e.target.value })
                  }
                />
              </div>

              <div className="col-lg-4 form-group">
                <h6>{t("bankIbon")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={state.Bank_IBAN || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_IBAN: e.target.value })
                  }
                />
              </div>

              <div className="col-lg-4 form-group">
                <h6>{t("bankSwift")}</h6>
                <input
                  type="text"
                  className="form-control"
                  value={state.Bank_Swift || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_Swift: e.target.value })
                  }
                />
              </div>

              <div className="col-lg-4 form-group autoComplete">
                <h6>{t("bankCountry")}</h6>
                <Autocomplete
                  options={countryList}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  value={
                    countryList.find(
                      (c) => String(c.id) === String(state.Bank_Country)
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setState({
                      ...state,
                      Bank_Country: newValue ? newValue.id : "",
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("bankCountry")}
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="col-lg-12 form-group">
                <h6>{t("bankAddress")}</h6>
                <textarea
                  className="form-control p-2"
                  placeholder={t("bankAddress")}
                  value={state.Bank_Address || ""}
                  onChange={(e) =>
                    setState({ ...state, Bank_Address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button
              className="btn btn-primary"
              type="submit"
              name="signup"
              onClick={updateVendor}
              disabled={isButtonClicked}
            >
              {typeof state.vendor_id !== "undefined"
                ? t("update")
                : t("create")}
            </button>
            <Link className="btn btn-danger" to={"/vendor"}>
              {t("cancel")}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AddVendor;
