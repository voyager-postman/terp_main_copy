 // import axios from "axios";
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
  const [state, setState] = useState({
    user_id: localStorage.getItem("id"),

    vendor_id: from?.ID ?? undefined,
    name: from?.name ?? "",
    id_card: from?.id_card ?? "",
    Entity: from?.Entity ?? "",
    address: from?.address ?? "",
    subdistrict: from?.subdistrict ?? "",
    district: from?.district ?? "",
    provinces: from?.provinces ?? "",
    postcode: from?.postcode ?? "",
    country: from?.country ?? "",
    line_id: from?.line_id ?? "",
    phone: from?.phone ?? "",
    email: from?.email ?? "",
    bank_name: from?.bank_name ?? "",
    bank_number: from?.bank_number ?? "",
    bank_account: from?.bank_account ?? "",
  });
  console.log(state.subdistrict);
  console.log(state.district);
  const { data: dropdownVendor } = useQuery("getDropdownVendor");
  const { data: dropdownCountry } = useQuery("getAddressCountry");
  const { data: dropdownProvinces } = useQuery("getDropdownAddressProvinces");
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
          typeof state.vendor_id == "undefined" ? "addVendor" : "vendorUpdate"
        }`,
        state
      );
      toast.success(t("success"));

      navigate("/vendor");
    } catch (error) {
      toast.error(t("errorWhileSaving"));
    }
  };

   const [t, i18n] = useTranslation("global");

  return (
   <Card
  title={`${t("vendorManagement")} / ${
    typeof state?.vendor_id !== "undefined" ? t("update") : t("create")
  } ${t("form")}`}
>
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
                    <div className="form-group col-lg-4">
                      <h6>{t("name")}</h6>
                      <input
                        type="text"
                        id="name_th"
                        onChange={handleChange}
                        name="name"
                        className="form-control"
                        placeholder={t("name")}
                        defaultValue={state.name}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>{t("idCard")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="id_card"
                        className="form-control"
                        placeholder={t("idCard")}
                        defaultValue={state.id_card}
                      />
                    </div>
                    <div className="form-group col-lg-4 autoComplete">
                      <h6>{t("entity")}</h6>
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
                            placeholder={t("selectEntity")} // Adds a placeholder
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
                  <div className="row">
                    <div className="form-group col-lg-12">
                      <h6>{t("address")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="address"
                        className="form-control"
                        placeholder={t("address")}
                        defaultValue={state.address}
                      />
                    </div>
                    <div className="form-group col-lg-2">
                      <h6 className="whitespace-nowrap">{t("postalCode")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="postcode"
                        className="form-control"
                        placeholder={t("postalCode")}
                        defaultValue={state.postcode}
                      />
                    </div>
                    <div className="form-group col-lg-2 autoComplete">
                      <h6>{t("country")}</h6>
                      <Autocomplete
                        options={dropdownCountry || []}
                        getOptionLabel={(option) => option.Name_EN || ""}
                        value={
                          dropdownCountry?.find(
                            (country) =>
                              String(country.ID) === String(state.country)
                          ) || null
                        }
                        onChange={(e, newValue) => {
                          handleChange({
                            target: {
                              name: "country",
                              value: newValue?.ID || "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectCountry")}
                            InputLabelProps={{ shrink: false }}
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          String(option.ID) === String(value.ID)
                        }
                        sx={{ width: 300 }}
                      />
                    </div>
                    <div className="form-group col-lg-2 autoComplete">
                      <h6>{t("province")}</h6>
                      <Autocomplete
                        options={dropdownProvinces || []} // Pass the array of provinces
                        getOptionLabel={(option) => option.name_en || ""} // Display the English name of the province
                        value={
                          dropdownProvinces?.find(
                            (province) => province.id === state.provinces
                          ) || null
                        } // Match the current value in state with the options
                        onChange={(e, newValue) => {
                          handleChange({
                            target: {
                              name: "provinces",
                              value: newValue?.id || "",
                            },
                          }); // Trigger the handleChange function with the selected province ID
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectProvince")} // Adds a placeholder
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Proper option matching
                        sx={{ width: 300 }}
                      />
                    </div>

                    <div className="form-group col-lg-3 autoComplete">
                   <h6>{t("district")}</h6>
                      <Autocomplete
                        options={availableDistrict || []} // Use the array of available districts
                        getOptionLabel={(option) => option.name_en || ""} // Display the English name of the district
                        value={
                          availableDistrict?.find(
                            (district) => district.id === state.district
                          ) || null
                        } // Match the current district ID in state with the options
                        onChange={(e, newValue) => {
                          handleChange({
                            target: {
                              name: "district",
                              value: newValue?.id || "",
                            },
                          }); // Trigger handleChange with the selected district's ID
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                        placeholder={t("selectDistrict")}// Adds a placeholder
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Ensure proper matching
                        sx={{ width: 300 }}
                      />
                    </div>
                    <div className="form-group col-lg-3 autoComplete">
                    <h6>{t("subDistrict")}</h6>
                      <Autocomplete
                        options={availableSubDistrict || []} // Populate with available subdistricts
                        getOptionLabel={(option) => option.name_en || ""} // Display the English name of the subdistrict
                        value={
                          availableSubDistrict?.find(
                            (subdistrict) =>
                              subdistrict.id.toString() ===
                              state.subdistrict.toString()
                          ) || null
                        } // Match the current subdistrict ID in state with the options
                        onChange={(e, newValue) => {
                          handleChange({
                            target: {
                              name: "subdistrict",
                              value: newValue?.id || "",
                            },
                          }); // Trigger handleChange with the selected subdistrict's ID
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("selectSubDistrict")}
                            InputLabelProps={{ shrink: false }} // Prevents floating label
                          />
                        )}
                        isOptionEqualToValue={(option, value) =>
                          option.id === value.id
                        } // Proper option matching
                        sx={{ width: 300 }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-lg-4">
                     <h6>{t("lineId")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="line_id"
                        className="form-control"
                     placeholder={t("lineId")}
                        defaultValue={state.line_id}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                     <h6>{t("phone")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="phone"
                        className="form-control"
                       placeholder={t("phone")}
                        defaultValue={state.phone}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                     <h6>{t("email")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="email"
                        className="form-control"
                        placeholder={t("email")}
                        defaultValue={state.email}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                   <h6>{t("bank")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_name"
                        className="form-control"
                    placeholder={t("bankName")}
                        defaultValue={state.bank_name}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                      <h6>{t("bankNumber")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_number"
                        className="form-control"
                      placeholder={t("bankNumber")}
                        defaultValue={state.bank_number}
                      />
                    </div>
                    <div className="form-group col-lg-4">
                  <h6>{t("bankHolder")}</h6>
                      <input
                        type="text"
                        onChange={handleChange}
                        name="bank_account"
                        className="form-control"
                         placeholder={t("bankHolder")}
                        defaultValue={state.bank_account}
                      />
                    </div>
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
              onClick={updateVendor}
              disabled={isButtonClicked} // Disable button if it has been clicked
            >
              {typeof state.vendor_id !== "undefined" ? t("update") :t("create")}
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
