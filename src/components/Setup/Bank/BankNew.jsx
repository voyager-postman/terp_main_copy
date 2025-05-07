import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";
const BankNew = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isOn, setIsOn] = useState(true);

  const getBankData = () => {
    axios
      .get(`${API_BASE_URL}/getBank`)
      .then((response) => {
        if (response.data.success == true) {
          setData(response.data.bankData);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBankData();
  }, []);
  const deleteOrder = (id) => {
    console.log(id);
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/DeleteBank`, { bank_id: id });
          toast.success("Bank delete successfully");
          getBankData();
        } catch (e) {
          toast.error("Something went wrong");
        }
      }
    });
  };
  const updateBankStatus = (bankID) => {
    const request = {
      bank_id: bankID,
    };

    axios
      .post(`${API_BASE_URL}/updateBankStatus`, request)
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, {
            autoClose: 1000,
            theme: "colored",
          });
          getBankData();
          return;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        id: "index",
        accessor: (_row, i) => <>{i + 1}</>,
      },
      {
        Header: "Bank Code",

        accessor: (a) => <>{a.Bank_nick_name}</>,
      },

      {
        Header: "Name",
        accessor: (a) => <>{a.bank_name}</>,
      },

      {
        Header: "Branch",
        accessor: (a) => <>{a.Bank_Address}</>,
      },

      {
        Header: "Account",
        accessor: (a) => <>{a.Account_Name}</>,
      },

      {
        Header: "Account Number",
        accessor: (a) => <>{a.bank_account_number}</>,
      },

      {
        Header: "Status",
        accessor: (a) => (
          <label
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
            }}
            className="toggleSwitch large"
            onclick=""
          >
            <input
              onClick={() => updateBankStatus(a.bank_id)}
              checked={a.status == "1" ? true : false}
              type="checkbox"
            />
            <span>
              <span>OFF</span>
              <span>ON</span>
            </span>
            <a></a>
          </label>
        ),
      },

      {
        Header: "Actions",
        accessor: (a) => (
          <>
            <Link to="/update_bank" state={{ from: a }}>
              <i
                i
                className="mdi mdi-pencil"
                style={{
                  width: "22px",
                  color: "#203764",
                  fontSize: "22px",
                  marginTop: "10px",
                }}
              />
            </Link>
            <button
              type="button"
              style={{
                width: "20px",
                color: "#203764",
                fontSize: "22px",
                marginTop: "10px",
              }}
              onClick={() => deleteOrder(a.bank_id)}
            >
              <i className="mdi mdi-delete " />
            </button>
          </>
        ),
      },

      {
        Header: "Balance",
        accessor: (a) => <>{a.balance}</>,
      },
    ],
    []
  );

  return (
    <Card
      title="Bank Management"
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_bank")}
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

export default BankNew;
