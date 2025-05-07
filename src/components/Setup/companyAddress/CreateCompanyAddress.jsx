import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";

const CreateCompanyAddress = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [line3, setLine3] = useState("");
  const [line4, setLine4] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // for preview only

  // Image upload handler
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file); // Store the actual file object for upload
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("Line_1", line1);
    formData.append("Line_2", line2);
    formData.append("Line_3", line3);
    formData.append("Line_4", line4);

    if (selectedImage) {
      formData.append("logo", selectedImage); // Append the actual file
    }

    try {
      // Sending POST request
      const response = await axios.post(
        `${API_BASE_URL}/addCompanyAddress`,
        formData
      );

      if (response.status === 200) {
        toast.success("Company address created successfully!");
        navigate("/companyaddress");
      }
    } catch (error) {
      console.error("Error creating company address:", error);
      toast.error("Failed to create company address.");
    }
  };

  return (
    <Card title={"CompanyAddress / Create Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate editCompForm">
                <form onSubmit={handleSubmit}>
                  <div className="row justify-content-center">
                    <div className="form-group col-lg-3">
                      <h6>Line 1</h6>
                      <textarea
                        onChange={(e) => setLine1(e.target.value)}
                        name="line1"
                        value={line1}
                        className="form-control"
                        placeholder="Enter Line 1"
                        required
                        style={{
                          width: '100%',
                          minHeight: '40px',
                          resize: 'none',
                          overflow: 'hidden',
                        }}
                        rows={1} // Initial rows set to 1
                        onInput={(e) => {
                          e.target.style.height = 'auto'; // Reset the height
                          e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                        }}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Line 2</h6>
                      <textarea
                        type="text"
                        name="line2"
                        value={line2}
                        onChange={(e) => setLine2(e.target.value)}
                        className="form-control"
                        placeholder="Enter Line 2"
                        style={{
                          width: '100%',
                          minHeight: '40px',
                          resize: 'none',
                          overflow: 'hidden',
                        }}
                        rows={1} // Initial rows set to 1
                        onInput={(e) => {
                          e.target.style.height = 'auto'; // Reset the height
                          e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                        }}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Line 3</h6>
                      <textarea
                        type="text"
                        name="line3"
                        value={line3}
                        onChange={(e) => setLine3(e.target.value)}
                        className="form-control"
                        placeholder="Enter Line 3"
                        style={{
                          width: '100%',
                          minHeight: '40px',
                          resize: 'none',
                          overflow: 'hidden',
                        }}
                        rows={1} // Initial rows set to 1
                        onInput={(e) => {
                          e.target.style.height = 'auto'; // Reset the height
                          e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                        }}
                      />
                    </div>
                    <div className="form-group col-lg-3">
                      <h6>Line 4</h6>
                      <textarea
                        type="text"
                        name="line4"
                        value={line4}
                        onChange={(e) => setLine4(e.target.value)}
                        className="form-control"
                        placeholder="Enter Line 4"
                        style={{
                          width: '100%',
                          minHeight: '40px',
                          resize: 'none',
                          overflow: 'hidden',
                        }}
                        rows={1} // Initial rows set to 1
                        onInput={(e) => {
                          e.target.style.height = 'auto'; // Reset the height
                          e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scroll height
                        }}
                      />
                    </div>
                  </div>
                  <div className="row mt-4">
                    <h6>Upload Logo</h6>
                    <div className="uploadLogo d-flex">
                      <div className="me-4">
                        <input type="file" onChange={handleImageUpload} />
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          crossorigin="anonymous"
                          alt="Uploaded Preview"
                          style={{
                            display: "block",
                            maxWidth: "250px",
                            height: "200px",
                            marginTop: "0px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <div className="card-footer">
                      <button className="btn btn-primary" type="submit">
                        Create
                      </button>
                      <Link className="btn btn-danger" to="/companyaddress">
                        Cancel
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CreateCompanyAddress;
