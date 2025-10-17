import axios from "axios";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";

const PackagingUpdate = () => {
  const location = useLocation();
  const { from } = location.state || {};
  const navigate = useNavigate();

  const defalutState = {
    packaging_name: from && from?.packaging_name,
    packaging_weight: from && from?.packaging_weight,
  };

  const [editPackageData, setEditPackageData] = useState(defalutState);

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
      packaging_id: from && from?.packaging_id,
      packaging_name: editPackageData.packaging_name,
      packaging_weight: editPackageData.packaging_weight,
    };
    await axios
      .post(`${API_BASE_URL}/updatePackaging`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          navigate("/packaging");
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
        if (error) {
          toast.error("Network Error", {
            autoClose: 1000,
            theme: "colored",
          });
          return false;
        }
      });
  };

  return (
    <>
      {/* <Navbar/> */}
      <div className="bg-gray-100 mx-4 my-20 shadow-md shadow-gray-700/40 hover:shadow-gray-900/40">
        <div
          style={{ borderBottom: "2px solid gray" }}
          className="flex justify-start px-4 uppercase py-4"
        >
          <p className="text-blue-600">Packaging Management</p>
          <span className="text-gray-800">/ Update Form</span>
        </div>

        <div
          className="flex grid grid-cols-2 gap-4 py-4 px-4"
          style={{ borderBottom: "2px solid gray" }}
        >
          <div className="inputBox py-4 flex flex-col">
            <span className="uppercase font-medium flex justify-start pb-2">
              Pack
            </span>
            <input
              onChange={handleChange}
              name="packaging_name"
              defaultValue={from && from?.packaging_name}
              className="py-2 px-2 border-2 border-blue-900 rounded"
              type="text"
              placeholder="Pack"
            />
            <i></i>
          </div>
          <div className="inputBox py-4 flex flex-col">
            <span className="uppercase font-medium flex justify-start pb-2">
              Weight
            </span>
            <input
              onChange={handleChange}
              name="packaging_weight"
              defaultValue={from && from?.packaging_weight}
              className="py-2 px-2 border-2 border-blue-900 rounded"
              type="text"
              placeholder="Weight"
            />
            <i></i>
          </div>
          <div className="inputBox py-4 my-4 flex flex-col">
            <span className="uppercase font-medium flex justify-start pb-2">
              Wrap Cost
            </span>
            <input
              className="py-2 px-2 border-2 border-blue-900 rounded"
              type="text"
              placeholder="Wrap Cost"
            />
            <i></i>
          </div>
          <div className="inputBox py-4 my-4 flex flex-col">
            <span className="uppercase font-medium flex justify-start pb-2">
              Wrap Weight
            </span>
            <input
              className="py-2 px-2 border-2 border-blue-900 rounded"
              type="text"
              placeholder="Wrap Weight"
            />
            <i></i>
          </div>
        </div>

        <div className="flex justify-start gap-4 py-4 px-4 my-4">
          <Link
            onClick={EditPackaging}
            className="bg-primary text-white  px-6 py-2 rounded uppercase hover:bg-blue-500"
          >
            Update
          </Link>
          <Link
            to="/packaging"
            className="bg-red-500 hover:bg-red-700 text-white  px-6 py-2 rounded uppercase"
          >
            Cancel
          </Link>
        </div>
      </div>
    </>
  );
};

export default PackagingUpdate;
