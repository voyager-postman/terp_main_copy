import { useQuery } from "react-query";
import { useMemo } from "react";
import { Card } from "../../card";
import { TableView } from "../table";
import { format } from "date-fns"; // Make sure to install and import date-fns
import { useTranslation } from "react-i18next";

const Hpl = () => {
  const { t, i18n } = useTranslation("global");
  const { data } = useQuery("HPLList");
  console.log(data);

  const columns = useMemo(
    () => [
      {
        Header: t("code"),
        accessor: (a) => a.pod_code,
      },
      {
        Header: t("date"),

        accessor: (a) => format(new Date(a.date), "dd/MM/yyyy"), // Format Date2
      },

      {
        Header: t("brand"),
        accessor: (a) => a.brand,
      },
      {
        Header: t("ean"),
        accessor: (a) => a.ean_name_en,
      },
      {
        Header: t("quantity"),
        accessor: (a) => a.ean_qty,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("packingUnit"),
        accessor: (a) => a.packing_ean_unit,
        Cell: ({ value }) => (
          <div style={{ textAlign: "center" }}>
            {value}
          </div>
        ),
      },

      {
        Header: t("packagingCost"),
        accessor: (a) => a.Packaging_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("wagesQuantity"),
        accessor: (a) => a.wages_per_qty_packed,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("productCost"),
        accessor: (a) => a.cal_cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("cost"),
        accessor: (a) => a.Cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },

      {
        Header: t("averageWeight"),
        accessor: (a) => a.average_weight,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("rawKgCost"),
        accessor: (a) => a.Raw_Kg_Cost,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("wastage"),
        accessor: (a) => a.Wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("averageWastage"),
        accessor: (a) => a.Average_wastage,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("eph"),
        accessor: (a) => a.EPH,
        Cell: ({ value }) => (
          <div style={{ textAlign: "right" }}>
            {value}
          </div>
        ),
      },
      {
        Header: t("averageEph"),
        accessor: (a) => a.Average_EPH,
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
    <Card title={t("packingHistory")}>
      <TableView columns={columns} data={data || []} />
    </Card>
  );
};

export default Hpl;
