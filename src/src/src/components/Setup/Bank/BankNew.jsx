import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../Url/Url";
import { Card } from "../../../card";
import { TableView } from "../../table";
import MySwal from "../../../swal";
import { useTranslation } from "react-i18next";

const BankNew = () => {
  const { t } = useTranslation("global");
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
      title: t("areYouSure"),
      text: t("irreversible"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(`${API_BASE_URL}/DeleteBank`, { bank_id: id });
          toast.success(t("bankDeleteSuccess"));
          getBankData();
        } catch (e) {
          toast.error(t("tryAgain"));
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
        Header: t("id"),
        id: "index",
        accessor: (_row, i) => <>{i + 1}</>,
      },
      {
        Header: t("bankCode"),

        accessor: (a) => <>{a.Bank_nick_name}</>,
      },

      {
        Header: t("name"),
        accessor: (a) => <>{a.bank_name}</>,
      },

      {
        Header: t("branch"),
        accessor: (a) => <>{a.Bank_Address}</>,
      },

      {
        Header: t("account"),
        accessor: (a) => <>{a.Account_Name}</>,
      },

      {
        Header: t("accountNumber"),
        accessor: (a) => <>{a.bank_account_number}</>,
      },

      {
        Header: t("status"),
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
              <span>{t("off")}</span>
              <span>{t("on")}</span>
            </span>
            <a></a>
          </label>
        ),
      },

      {
        Header: t("actions"),
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
        Header: t("balance"),
        accessor: (a) => <>{a.balance}</>,
      },
    ],
    [t]
  );

  return (
    <Card
      title={t("bankManagement")}
      endElement={
        <button
          type="button"
          onClick={() => navigate("/add_bank")}
          className="btn button btn-info"
        >
          {t("create")}
        </button>
      }
    >
      <TableView columns={columns} data={data} />
    </Card>
  );
};

export default BankNew;
