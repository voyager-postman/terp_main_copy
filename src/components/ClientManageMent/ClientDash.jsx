import axios from "axios"
import React, { useEffect, useState } from "react"

import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import { API_BASE_URL } from "../../Url/Url"
import { Card } from "../../card"
import { TableView } from "../table"
import ChartConsi from "./ChartConsi";


const ClientDash = () => {
    const location = useLocation();

    const { from } = location.state || {};
    console.log(from);
    const [consigneeData, setConsigneeData] = useState("");
  const [orderItem, setOrderItem] = useState([]);
    const getClientDetails = () => {
        axios
          .post(`${API_BASE_URL}/getClientStatistics`, {
            client_id: from?.client_id,
          })
          .then((res) => {
            console.log(res);
    
            // setData(res.data.data);
            setConsigneeData(res.data.data);
            setOrderItem(res.data.items);
          })
          .catch((error) => {
            console.log("There was an error fetching the data!", error);
          });
      };
      useEffect(() => {
        getClientDetails();
      }, []);
      const formatter = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 0,
      });
    
    return (
        <div className="bg-white p-5 clientDashRad">
            <div>
                <div className="row dashCard53 consigneeCard">
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                        <div className="card  ">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons  mdi mdi-calendar-range" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Date of First Shipment</p>
                                    <h4 className="mb-0" />
                                    {consigneeData?.First_Shipment}
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">+55% </span>
                                    than lask week
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb- mb20">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons mdi mdi-calendar-range" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Date of Last Shipment</p>
                                    <h4 className="mb-0" />  {consigneeData?.Last_Shipment}
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">+3% </span>
                                    than lask month
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb-xl-0 mb-4 mb20">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons  mdi mdi-pipe" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">
                                        {" "}
                                        Shipments in Pipe Line{" "}
                                    </p>
                                    <h4 className="mb-0">   {formatter.format(consigneeData?.Pipe_Line)}{" "}</h4>
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">-2%</span>{" "}
                                    than yesterday
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons  mdi mdi-weight" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">
                                        Total Net Weigt Shipped
                                    </p>
                                    <h4 className="mb-0"> {formatter.format(consigneeData?.Total_NW)}{" "}</h4>
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">+5% </span>
                                    than yesterday
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons mdi mdi-weight-gram" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">
                                        Total Gross Weight Shipped
                                    </p>
                                    <h4 className="mb-0">   {formatter.format(consigneeData?.Total_GW)}{" "}</h4>
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">+5% </span>
                                    than yesterday
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-sm-6 mb20">
                        <div className="card">
                            <div className="card-header p-3 pt-2">
                                <div className="icon icon-lg icon-shape bg-gradient-primary shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                                    <i className=" material-icons  mdi mdi-checkbox-multiple-blank-outline" />
                                </div>
                                <div className="text-end pt-1">
                                    <p className="text-sm mb-0 text-capitalize">Total Boxes Shipped</p>
                                    <h4 className="mb-0"> {formatter.format(consigneeData?.Total_Box)}{" "} </h4>
                                </div>
                            </div>
                            <hr className="dark horizontal my-0" />
                            <div className="card-footer p-3">
                                <p className="mb-0">
                                    <span className="text-success text-sm font-weight-bolder">+5% </span>
                                    than yesterday
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="row">
                <div className="col-lg-6 mb20">
                    <h3 className="itemOrder">Top 5 Items Ordered</h3>
                    <div className="tableCreateClient">
                        <table>
                            <tr>
                                <th> ITF Name</th>
                                <th> Total Kg</th>
                            </tr>

                            {orderItem?.map((item) => {
                                return (
                                    <>
                                        {" "}
                                        <tr>
                                            <td>{item?.itf_name}</td>
                                            <td>{item?.Total_Kg}</td>
                                        </tr>
                                    </>
                                );
                            })}
                        </table>
                    </div>
                </div>
                <div className="col-lg-6 mb20 ">
                    <div className="chartConsignee">
                        <ChartConsi />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ClientDash
