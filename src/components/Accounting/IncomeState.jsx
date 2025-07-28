import React, { useState, useEffect } from "react";

export default function AccountTable() {
  const [periods, setPeriods] = useState([]);
  const [data, setData] = useState([
    { "Account Number": "1001", "Account Name": "Cash" },
    { "Account Number": "1002", "Account Name": "Bank" },
    { "Account Number": "1002", "Account Name": "Bank" },
    { "Account Number": "1002", "Account Name": "Bank" },
    { "Account Number": "1002", "Account Name": "Bank" },
    { "Account Number": "1002", "Account Name": "Bank" },
  ]);

  const baseColumns = ["Account Number", "Account Name"];

  const getStaticPeriodData = () => [
    { debit: 30, credit: 53 },
    { debit: 150345340, credit: 500 },
    { debit: 1555500, credit: 500 },
    { debit: 1500, credit: 500 },
    { debit: 500, credit: 500 },
    { debit: 1500, credit: 500 },
    { debit: 15030000, credit: 333333 },
  ];

  const getNextPeriodLabel = () => String.fromCharCode(65 + periods.length);

  const handleAddPeriod = () => {
    const newLabel = getNextPeriodLabel();
    const newPeriodData = getStaticPeriodData();

    const updatedData = data.map((row, idx) => {
      const { debit = 0, credit = 0 } = newPeriodData[idx] || {};
      return {
        ...row,
        [`${newLabel} - Debit`]: debit,
        [`${newLabel} - Credit`]: credit,
        [`${newLabel} - Total`]: debit - credit,
      };
    });

    const updatedPeriods = [...periods, newLabel];

    // Update state
    setPeriods(updatedPeriods);
    setData(updatedData);

    // Save to localStorage
    localStorage.setItem("periods", JSON.stringify(updatedPeriods));
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleDeletePeriod = (label) => {
    const updatedPeriods = periods.filter((p) => p !== label);
    const updatedData = data.map((row) => {
      const newRow = { ...row };
      ["Debit", "Credit", "Total"].forEach((type) => {
        delete newRow[`${label} - ${type}`];
      });
      return newRow;
    });

    setPeriods(updatedPeriods);
    setData(updatedData);

    localStorage.setItem("periods", JSON.stringify(updatedPeriods));
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedPeriods = JSON.parse(localStorage.getItem("periods")) || [];
    const savedData = JSON.parse(localStorage.getItem("data")) || data;

    setPeriods(savedPeriods);
    setData(savedData);
  }, []);

  return (
    <div className="incomeState">
      <button className="addPeriod" onClick={handleAddPeriod}>
        Add Period
      </button>

      <div
        className="table-responsive table-striped bg-white"
        style={{ marginTop: "10px", borderTop: "3px solid #fff" }}
      >
        <table border="1" cellPadding="5">
          <thead>
            <tr className="outerBorderAcc">
              {baseColumns.map((col, idx) => (
                <th key={idx} rowSpan="2">
                  {col}
                </th>
              ))}

              {periods.map((label) => (
                <th
                  key={label}
                  colSpan={3}
                  style={{ textAlign: "center", position: "relative" }}
                >
                  <i
                    className="mdi mdi-delete"
                    onClick={() => handleDeletePeriod(label)}
                    style={{
                      color: "white",
                      cursor: "pointer",
                      position: "absolute",
                      top: "20px",
                      right: "2px",
                      fontSize: "16px",
                    }}
                  />
                  <div>
                    <p style={{ margin: 0 }}>
                      <strong>From:</strong> 1/2/2023
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>To:</strong> 25/2/2023
                    </p>
                  </div>
                </th>
              ))}
            </tr>

            <tr className="innerBorderDebit">
              {periods.map((label) =>
                ["Debit", "Credit", "Total"].map((type) => (
                  <th key={`${label}-${type}`}>{type}</th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {baseColumns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col]}</td>
                ))}
                {periods.map((label) =>
                  ["Debit", "Credit", "Total"].map((type, idx) => (
                    <td key={`${rowIndex}-${label}-${type}`}>
                      {row[`${label} - ${type}`] ?? ""}
                    </td>
                  ))
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
