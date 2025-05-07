import { useQuery } from "react-query";
import { useMemo } from "react";
import { Card } from "../../card";
import { TableView } from "../table";
import { format } from "date-fns"; // Make sure to install and import date-fns
const Asll = () => {
  const { data } = useQuery("AslList");
  const columns = useMemo(
    () => [
      {
        Header: "Code",
        accessor: (a) => a.pod_code,
      },
      {
        Header: "Name",

        accessor: (a) => a.Name,
      },
      {
        Header: "Sort Time",

        accessor: (a) => format(new Date(a.Sort_time), "dd/MM/yyyy"), // Format Date2
      },
      {
        Header: "Sorted Qty",
        accessor: (a) => a.sorted_qty,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Sorted Wastage",
        accessor: (a) => a.sorted_wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Sorted Cost",
        accessor: (a) => a.sorted_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Sorted Unit",
        accessor: (a) => a.sorted_unit,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>
            {value}
          </div>
        ),
      },
      {
        Header: "Avg Weight",
        accessor: (a) => a.avg_weight,
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
    <Card title={"After Sorting List"}>
      <TableView columns={columns} data={data || []} />
    </Card>
  );
};

export default Asll;
