import { useQuery } from "react-query";
import { useMemo } from "react";
import { Card } from "../../card";
import { TableView } from "../table";
import { format } from "date-fns"; // Make sure to install and import date-fns
import { useTranslation } from "react-i18next";

const Asll = () => {
  const { t, i18n } = useTranslation("global");
  const { data } = useQuery("AslList");
  const columns = useMemo(
    () => [
      {
        Header: t("code"),
        accessor: (a) => a.pod_code,
      },
      {
        Header: t("name"),

        accessor: (a) => a.Name,
      },
      {
        Header: t("sortTime"),

        accessor: (a) => format(new Date(a.Sort_time), "dd/MM/yyyy"), // Format Date2
      },
      {
        Header: t("sortedQty"),
        accessor: (a) => a.sorted_qty,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("sortedWastage"),
        accessor: (a) => a.sorted_wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("sortedCost"),
        accessor: (a) => a.sorted_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("sortedUnit"),
        accessor: (a) => a.sorted_unit,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("avgWeight"),
        accessor: (a) => a.avg_weight,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
    ],
    [t]
  );
  console.log(data);
  return (
    <Card title={t("afterSortingList")}>
      <TableView columns={columns} data={data || []} />
    </Card>
  );
};

export default Asll;
