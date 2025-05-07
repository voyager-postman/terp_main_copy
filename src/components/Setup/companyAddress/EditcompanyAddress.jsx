import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL, API_IMAGE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const EditCompanyAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || {};
  console.log(from);
  const [imagePath, setImagePath] = useState(from?.logo || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const defaultState = {
    produce_id: from?.ID || "",
    Line_1: from?.Line_1 || "",
    Line_2: from?.Line_2 || "",
    Line_3: from?.Line_3 || "",
    Line_4: from?.Line_4 || "",
    logo: "", // Ensure this matches the API field name
  };

  const [editProduceData, setEditProduceData] = useState(defaultState);
  const [classification, setClassification] = useState([]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "logo" && files.length > 0) {
      const file = files[0];
      setSelectedImage(URL.createObjectURL(file)); // Update the image preview
      setImagePath(""); // Clear the image path since a new image is selected
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: file, // Store the file object
      }));
    } else {
      setEditProduceData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);        
  const line3Ref = useRef(null);
  const line4Ref = useRef(null);

  const adjustTextareaHeight = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
    }
  };

  useEffect(() => {
    // Adjust textarea heights when data from API is loaded or changed
    adjustTextareaHeight(line1Ref.current);
    adjustTextareaHeight(line2Ref.current);
    adjustTextareaHeight(line3Ref.current);
    adjustTextareaHeight(line4Ref.current);
  }, [
    editProduceData.Line_1,
    editProduceData.Line_2,
    editProduceData.Line_3,
    editProduceData.Line_4,
  ]);

  const updateProduceItems = () => {
    const formData = new FormData();
    formData.append("companyId", editProduceData.produce_id);
    formData.append("Line_1", editProduceData.Line_1);
    formData.append("Line_2", editProduceData.Line_2);
    formData.append("Line_3", editProduceData.Line_3);
    formData.append("Line_4", editProduceData.Line_4);
    if (editProduceData.logo) {
      formData.append("logo", editProduceData.logo); // Ensure field name matches API
    }

    axios
      .post(`${API_BASE_URL}/updateCompanyAddress`, formData)
      .then((response) => {
        if (response.data.success === true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/companyaddress");
        } else {
          toast.error(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Network Error", {
          autoClose: 1000,
          theme: "colored",
        });
      });
  };

  const getClassificationData = () => {
    axios
      .get(`${API_BASE_URL}/getDropdownProduceClassification`)
      .then((response) => {
        if (response.data.success === true) {
          setClassification(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getClassificationData();
  }, []);

  return (
    <Card title={"Update CompanyAddress / Edit Form"}>
      <div className="top-space-search-reslute">
        <div className="tab-content px-2 md:!px-4">
          <div className="tab-pane active" id="header" role="tabpanel">
            <div
              id="datatable_wrapper"
              className="information_dataTables dataTables_wrapper dt-bootstrap4"
            >
              <div className="formCreate editCompForm">
                <form action="">
                  <div className="row">
                    {from?.ID >= 1 && (
                      <div className="form-group col-lg-3">
                        <h6>Line 1</h6>
                        <textarea
                          ref={line1Ref}
                          id="line_1"
                          onChange={(e) => {
                            handleChange(e);
                            adjustTextareaHeight(line1Ref.current);
                          }}
                          name="Line_1"
                          className="form-control"
                          placeholder="Enter Line 1"
                          value={editProduceData.Line_1}
                          style={{
                            width: "100%",
                            resize: "none",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    )}
                    {from?.ID >= 2 && (
                      <div className="form-group col-lg-3">
                        <h6>Line 2</h6>
                        <textarea
                          ref={line2Ref}
                          id="line_2"
                          onChange={(e) => {
                            handleChange(e);
                            adjustTextareaHeight(line2Ref.current);
                          }}
                          name="Line_2"
                          className="form-control"
                          placeholder="Enter Line 2"
                          value={editProduceData.Line_2}
                          style={{
                            width: "100%",
                            resize: "none",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    )}
                    {from?.ID >= 3 && (
                      <div className="form-group col-lg-3">
                        <h6>Line 3</h6>
                        <textarea
                          ref={line3Ref}
                          id="line_3"
                          onChange={(e) => {
                            handleChange(e);
                            adjustTextareaHeight(line3Ref.current);
                          }}
                          name="Line_3"
                          className="form-control"
                          placeholder="Enter Line 3"
                          value={editProduceData.Line_3}
                          style={{
                            width: "100%",
                            resize: "none",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    )}
                    {from?.ID >= 4 && (
                      <div className="form-group col-lg-3">
                        <h6>Line 4</h6>
                        <textarea
                          ref={line4Ref}
                          id="line_4"
                          onChange={(e) => {
                            handleChange(e);
                            adjustTextareaHeight(line4Ref.current);
                          }}
                          name="Line_4"
                          className="form-control"
                          placeholder="Enter Line 4"
                          value={editProduceData.Line_4}
                          style={{
                            width: "100%",
                            resize: "none",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-lg-6 form-group">
                      <h6>Upload Logo</h6>
                      <input
                        type="file"
                        id="logo"
                        name="logo"
                        onChange={handleChange}
                        accept="image/*"
                        className="d-none"
                      />
                      <div className="imgFlex">
                        <div className="pe-4">
                          <label htmlFor="logo">
                            <div className="uploadBorder">
                              <span>
                                Choose Image <CloudUploadIcon />{" "}
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
                          {!selectedImage && imagePath && (
                            <div>
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
                </form>
              </div>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-center">
            <button
              onClick={updateProduceItems}
              className="btn btn-primary"
              type="button"
            >
              Update
            </button>
            <Link className="btn btn-danger" to="/companyaddress">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EditCompanyAddress;
