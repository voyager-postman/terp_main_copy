import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Barcode from "react-barcode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
 
const AccountLedger = () => {
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);
  const navigate = useNavigate();
 
  const getEanData = () => {
    axios
      .get(`${API_BASE_URL}/getEan`)
      .then((response) => {
        setData(response.data.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  useEffect(() => {
    getEanData();
  }, []);
 
  const updateEanStatus = (eanID) => {
    const request = {
      ean_id: eanID,
    };
 
    axios
      .post(`${API_BASE_URL}/eanStatus`, request)
      .then((resp) => {
        // console.log(resp, "Check Resp")
        if (resp.data.success == true) {
          toast.success("Status Updated Successfully", {
            autoClose: 1000,
            theme: "colored",
          });
          getEanData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const formatTwoDecimal = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const columns = useMemo(
    () => [
      {
        Header: "AL Date",
        accessor: () => {
          const rawDate = "02/08/2023"; // Original format: DD/MM/YYYY
          const [day, month, year] = rawDate.split("/");
          const formattedDate = `${day}-${month}-${year}`;
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "AL Number",
        accessor: (a) => <div>AL-202570001</div>,
      },
 
      {
        Header: "Account No",
        accessor: (a) => <div>{a.NW}</div>,
      },
 
      {
        Header: "Client",
        accessor: (a) => <div>HLB Tropical Food GmbH</div>,
      },
      {
        Header: "Consignee",
        accessor: (a) => <div>Costco Wholesale UK Ltd</div>,
      },
      {
        Header: "Vendor",
        accessor: (a) => <div>Siam Eats </div>,
      },
      {
        Header: "Debit",
        accessor: () => (
          <div style={{ textAlign: "right" }}>
            {formatTwoDecimal.format(6725.3453)}
          </div>
        ),
      },
      {
        Header: "Transaction Description",
        accessor: (a) => <div>Lorem ipsum</div>,
      },
 
      {
        Header: "Actions",
        accessor: (a) => (
          <Link to="/update_ean" state={{ from: a }}>
            <i
              i
              className="mdi mdi-pencil"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
            />
          </Link>
        ),
      },
 
      // {
      //   Header: "Salary",
      //   accessor: (a) => <>{"10000000"}</>,
      // },
    ],
    []
  );
 
  return (
    <Card
      title={"Accounting Ledger Management"}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_ean")}
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
 
export default AccountLedger;