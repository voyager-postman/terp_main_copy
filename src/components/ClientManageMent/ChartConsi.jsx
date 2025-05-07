import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Select from "react-select";
import { API_BASE_URL } from "../../Url/Url";
import axios from "axios";

const ChartConsi = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("1"); // Default dataset
  console.log(selectedDataset);
  const xValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
  const dataOptions = {
    1: [300, 700, 2000, 5000, 6000, 4000, 2000, 1000, 200, 100], // Net Weight
    2: [100, 600, 1200, 4000, 5500, 3500, 1800, 900, 300, 150], // Box
    3: [500, 800, 2100, 4600, 6400, 4300, 2300, 1200, 500, 300], // Invoice Value
    4: [500, 800, 2100, 4600, 6400, 4300, 2300, 1200, 500, 300], // Shipments
  };

  // Fetch data from API and map to options for dropdown
  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/statisticsDropdownGraphSelection`)
      .then((res) => {
        const fetchedData = res.data.data || [];
        setData(fetchedData);

        // Transform data for Select component
        const selectOptions = fetchedData.map((item) => ({
          value: item.ID,
          label: item.Name,
        }));
        setOptions(selectOptions);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    orderData1();
  }, []);

  useEffect(() => {
    const chartData = {
      labels: xValues,
      datasets: [
        {
          data: dataOptions[selectedDataset] || [], // Default to empty if dataset is undefined
          borderColor: "#203764",
          fill: false,
        },
      ],
    };

    const myChart = new Chart(chartRef.current, {
      type: "line",
      data: chartData,
      options: {
        plugins: {
          legend: { display: false },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, [selectedDataset]);

  const handleDropdownChange = (selectedOption) => {
    setSelectedDataset(selectedOption.value); // Set ID as selected dataset
  };

  return (
    <div className="searchGraph">
      <Select
        options={options}
        onChange={handleDropdownChange}
        value={options.find((option) => option.value === selectedDataset)}
        placeholder="Select..."
        isSearchable
        styles={{
          container: (provided) => ({
            ...provided,
            marginBottom: "20px",
            maxWidth: "300px",
          }),
        }}
      />
      <canvas
        ref={chartRef}
        id="myChart"
        style={{ width: "100%", maxWidth: "1000px" }}
      />
    </div>
  );
};

export default ChartConsi;
