import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Optional: for notifications
import { API_BASE_URL } from "../../Url/Url";

const CreateAccounts = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    account_number: "",
    account_lvl1: "",
    account_lvl2: "",
    account_lvl3: "",
    account_lvl4: "",
    type_name_en: "",
    type_name_th: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createChartOfAccount`,
        {
          account_number: formData.account_number,
          account_lvl1: formData.account_lvl1,
          account_lvl2: formData.account_lvl2,
          account_lvl3: formData.account_lvl3,
          account_lvl4: formData.account_lvl4,
          type_name_en: formData.type_name_en,
          type_name_th: formData.type_name_th,
        }
      );

      // Success notification
      toast.success("Account created successfully!");
      navigate("/accounts");
      console.log(response.data);

      // Reset form after successful submission
      setFormData({
        account_number: "",
        account_lvl1: "",
        account_lvl2: "",
        account_lvl3: "",
        account_lvl4: "",
        type_name_en: "",
        type_name_th: "",
      });
    } catch (error) {
      // Error notification
      toast.error("Error creating account.");
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <div className="bg-white rounded border">
        <div className="grayBgColor px-4 py-3 rounded-t">
          <div className="flex justify-between items-center exportPopupBtn">
            <h6 className="font-weight-bolder mb-0">Accounts / Create Form</h6>
          </div>
        </div>
        <div className="px-2 md:px-4">
          <div className="top-space-search-reslute">
            <div className="tab-content px-2 md:!px-4">
              <div className="tab-pane active" id="header" role="tabpanel">
                <div
                  id="datatable_wrapper"
                  className="information_dataTables dataTables_wrapper dt-bootstrap4"
                >
                  <div className="formCreate">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="form-group col-lg-3">
                          <h6>Account Number</h6>
                          <input
                            type="text"
                            name="account_number"
                            className="form-control"
                            placeholder="Account Number"
                            value={formData.account_number}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Account lvl1</h6>
                          <input
                            type="text"
                            name="account_lvl1"
                            className="form-control"
                            placeholder="Account lvl1"
                            value={formData.account_lvl1}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Account lvl2</h6>
                          <input
                            type="text"
                            name="account_lvl2"
                            className="form-control"
                            placeholder="Account lvl2"
                            value={formData.account_lvl2}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Account lvl3</h6>
                          <input
                            type="text"
                            name="account_lvl3"
                            className="form-control"
                            placeholder="Account lvl3"
                            value={formData.account_lvl3}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="form-group col-lg-3">
                          <h6>Account lvl4</h6>
                          <input
                            type="text"
                            name="account_lvl4"
                            className="form-control"
                            placeholder="Account lvl4"
                            value={formData.account_lvl4}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Type Name (en)</h6>
                          <input
                            type="text"
                            name="type_name_en"
                            className="form-control"
                            placeholder="Type Name (en)"
                            value={formData.type_name_en}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-group col-lg-3">
                          <h6>Type Name (th)</h6>
                          <input
                            type="text"
                            name="type_name_th"
                            className="form-control"
                            placeholder="Type Name (th)"
                            value={formData.type_name_th}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="card-footer text-center">
                        <button className="btn btn-primary" type="submit">
                          Create
                        </button>
                        <Link className="btn btn-danger" to="/accounts">
                          Cancel
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccounts;
