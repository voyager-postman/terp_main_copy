 import axios from "axios";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../Url/Url";
import { Card } from "../../card";
import { TableView } from "../table";
import { format } from "date-fns"; // Make sure to install and import date-fns
import { useTranslation } from "react-i18next";


const LastPurchase = () => {
    const [t, i18n] = useTranslation("global");
  
  const { data, refetch } = useQuery("LastPurchase"); // Add refetch
  const [editableData, setEditableData] = useState([]);

  const handleUpdate = (item) => {
    console.log("Updating item:", item);
    axios
      .post(`${API_BASE_URL}/updatePrice`, {
        produce_id: item.Produce_ID,
        Update_price: item.Update_price,
        Available: item.Available,
        user: localStorage.getItem("id"),
      })
      .then((response) => {
        console.log("Update successful", response.data);
        refetch(); // Fetch the updated data
        toast.success(t("updateSuccess"));
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
        toast.error(t("updateFailed"));
      });
  };

  useMemo(() => {
    if (data) {
      setEditableData(
        data.map((item) => ({
          ...item,
          Update_price: item.Update_price || "", // Ensure the field is initialized
        }))
      );
    }
  }, [data]);

  const handlePriceChange = (index) => (e) => {
    const updatedData = [...editableData];
    updatedData[index].Update_price = e.target.value; // Update the price value for the specific row
    setEditableData(updatedData); // Update state with the new editable data
  };

  const columns = useMemo(
    () => [
      {
        Header: t("produce"),
        accessor: (a) => a.Produce,
      },
      {
        Header: t("date1"),
        accessor: (a) => a.date1, // Format Date1
      },
      {
        Header: t("count1"),
        accessor: (a) => a.count1,
      },
      {
        Header: t("dailyPrice1"),
        accessor: (a) => a.Daily_price1,
      },
      {
        Header: t("date2"),
        accessor: (a) => a.date2, // Format Date2
      },
      {
        Header: t("count2"),
        accessor: (a) => a.count2,
      },
      {
        Header: t("dailyPrice2"),
        accessor: (a) => a.Daily_price2,
      },
      {
        Header: t("priceChange"),
        accessor: (a) => a.Price_Change,
      },
      {
        Header: t("percentageChange"),
        accessor: (a) => a.Percetage_change,
      },
      {
        Header: " ",
        accessor: (a, index) => (
          <>
            <div className="lastPurchase">
              <div className="form-group formCreate mt-0">
                <input
                  className="mb-0 w-full"
                  style={{ width: "70px" }}
                  type="text"
                  value={editableData[index].Update_price || ""} // Use the editableData for the input value
                  onChange={handlePriceChange(index)} // Handle input change for each specific row
                />
              </div>
            </div>
          </>
        ),
      },
      {
        Header: t("action"),
        accessor: (a) => (
          <>
            <div className="lastPurchase">
              <div className="btnUpdate">
                <button onClick={() => handleUpdate(a)}>{t("update")}</button>
              </div>
            </div>
          </>
        ),
      },
    ],
    [editableData,t] // Ensure columns are memoized with editableData
  );

  return (
    <>
      <Card title={t("lastPurchaseManagement")}>
        <TableView columns={columns} data={editableData || []} />
      </Card>
    </>
  );
};

export default LastPurchase;
