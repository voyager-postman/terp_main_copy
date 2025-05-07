import axios from "axios";
import { useMemo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";

export const OrderPackagingList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const getOrders = () => {
    axios.get(`${API_BASE_URL}/getOrdersPacking`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    getOrders();
  }, []);
  // const { data, refetch: getOrders } = useQuery("getOrdersPacking");
  const confirmQuotation = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/confirmOrder`, { quote_id: id });
      toast.success("Order confirmed successfully");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };
  const generateInvoice = (id, id1, id2) => {
    axios
      .post(`${API_BASE_URL}/GenerateInvoiceTick`, {
        order_id: id,
        fx_id: id1,
        fx_rate: id2,
        USER: localStorage.getItem("id"),
      })
      .then((response) => {
        if (response?.data?.success == false) {
          toast.warn(response.data.checkmessage, {
            autoClose: 1000,
            theme: "colored",
          });
          getOrders();
        }
        console.log(response);
        if (response?.data?.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getOrders();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const columns = useMemo(
    () => [
      {
        Header: "Number",
        accessor: "Order_Number",
      },
      {
        Header: "TTREF",
        accessor: "Shipment_ref",
      },
      {
        Header: "Consignee Name",
        accessor: "consignee_name",
      },
      {
        Header: "Load Date",
        accessor: (a) => {
          return a.load_date
            ? new Date(a.load_date).toLocaleDateString()
            : "NA";
        },
      },
      {
        Header: "Load Time",
       accessor: "Freight_load_time",
      },
      {
        Header: "Supplier",
        accessor: (a) => a.supplier_name,
      },
      {
        Header: "Freight BL",
        accessor: (a) => a.Freight_bl,
      },
      {
        Header: "Status",
        // accessor: (a) => ({ 2: "Confirmed" })[a.Status] || "Pending",
        accessor: (a) => a.Packing_status,
      },
      {
        Header: "Actions",
        accessor: (a) => (
          <div className="editIcon gap-2">
            {/* <Link
							to="/createOrder"
							state={{ from: { ...a, isReadOnly: true } }}>
							<i className="mdi mdi-eye"></i>
						</Link> */}
            {+a.Status == 1 && (
              <Link to="/orderPackagingEdit" state={{ from: { ...a } }}>
                <i className="mdi mdi-pencil" />
              </Link>
            )}
            {+a.Status == 1 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    // MySwal.fire({
                    // 	title: "Are you sure?",
                    // 	text: "You won't be able to revert this!",
                    // 	icon: "warning",
                    // 	showCancelButton: true,
                    // 	confirmButtonColor: "#3085d6",
                    // 	cancelButtonColor: "#d33",
                    // 	confirmButtonText: "Yes, confirm it!",
                    // }).then((result) => {
                    // 	if (result.isConfirmed) confirmQuotation(a.quote_id)
                    // })
                  }}
                >
                  {/* <i class="mdi mdi-delete "></i> */}
                </button>
                {+a.go_to_invoice == 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      generateInvoice(a.Order_ID, a.FX_ID, a.O_FX_Rate)
                    }
                  >
                    <i className="mdi mdi-check" />
                    {/* <i className="mdi mdi-restore" /> */}
                  </button>
                )}
              </>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <Card
      title={"Order Packaging Management"}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/orderPackagingEdit")}
          className="btn button btn-info"
        >
          Create
        </button>
      }
    >
      <TableView columns={columns} data={data} />
    </Card>
  );
};
