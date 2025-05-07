import { useQuery } from "react-query";
import { useMemo } from "react";
import { Card } from "../../card";
import { TableView } from "../table";
import { format } from "date-fns"; // Make sure to install and import date-fns

const Hpl = () => {
  const { data } = useQuery("HPLList");
  console.log(data);

  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: (a) => a.pod_code,
      },
      {
        Header: "Date",

        accessor: (a) => format(new Date(a.date), "dd/MM/yyyy"), // Format Date2
      },

      {
        Header: "Brand",
        accessor: (a) => a.brand,
      },
      {
        Header: "EAN",
        accessor: (a) => a.ean_name_en,
      },
      {
        Header: "Quantity",
        accessor: (a) => a.ean_qty,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Packing Unit",
        accessor: (a) => a.packing_ean_unit,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>
            {value}
          </div>
        ),
      },

      {
        Header: "Packaging Cost",
        accessor: (a) => a.Packaging_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Wages Quantity",
        accessor: (a) => a.wages_per_qty_packed,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Product  Cost",
        accessor: (a) => a.cal_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: " Cost",
        accessor: (a) => a.Cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },

      {
        Header: "Average Weight",
        accessor: (a) => a.average_weight,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Raw Kg Cost",
        accessor: (a) => a.Raw_Kg_Cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Wastage",
        accessor: (a) => a.Wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Average Wastage",
        accessor: (a) => a.Average_wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "EPH",
        accessor: (a) => a.EPH,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Average EPH",
        accessor: (a) => a.Average_EPH,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
    ],
    []
  );
  console.log(data);
  return (
    <Card title={"Packing History"}>
      <TableView columns={columns} data={data || []} />
    </Card>
  );
};

export default Hpl;
