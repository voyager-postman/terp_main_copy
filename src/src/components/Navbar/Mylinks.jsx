import { CgMoreO } from "react-icons/cg";
import { GiBoxUnpacking } from "react-icons/gi";
import { MdGroupAdd, MdInventory2 } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { useTranslation } from "react-i18next";

const email = localStorage.getItem("email");
const role = localStorage.getItem("role");
const level = localStorage.getItem("level");

export const getLinks = () => {
  const { t } = useTranslation("global");

  const baseLinks = [
    ...(role === "Operation"
      ? [
          {
            name: t("client_management"),
            icon: <GiBoxUnpacking />,
            submenu: true,
            sublinks: [
              {
                sublink: [
                  { name: t("purchase_order"), link: "/purchase_orders" },
                  { name: t("vendor"), link: "/vendor" },
                  { name: t("update_price"), link: "/update_price" },
                ],
              },
            ],
          },
          {
            name: t("operations"),
            icon: <GiBoxUnpacking />,
            submenu: true,
            sublinks: [
              {
                sublink: [
                  { name: t("dashboard"), link: "/dashboardOperation" },
                  { name: t("receiving"), link: "/receiving" },
                  { name: t("sorting"), link: "/sorting" },
                  { name: t("ean_packing"), link: "/eanPacking" },
                  { name: t("adjust_ean"), link: "/adjustEan" },
                  { name: t("order_packing"), link: "/orderPackaging" },
                ],
              },
            ],
          },
          {
            name: t("inventory"),
            icon: <RiUserSettingsFill />,
            submenu: true,
            sublinks: [
              {
                sublink: [
                  { name: t("available_ean"), link: "/eanAvailable" },
                  {
                    name: t("available_produce"),
                    link: "/inventoryProduce",
                  },
                  { name: t("available_boxes"), link: "/inventoryBoxes" },
                  {
                    name: t("available_packaging"),
                    link: "/inventoryPackaging",
                  },
                ],
              },
            ],
          },
        ]
      : []),
  ];

  const showAdditionalLinks = role !== "Operation";

  const additionalLinks = [
    {
      name: t("expenses"),
      icon: <GiBoxUnpacking />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("purchase_order"), link: "/purchase_orders" },
            { name: t("vendor"), link: "/vendor" },
            { name: t("update_price"), link: "/update_price" },
            { name: t("last_purchase"), link: "/last_purchase" },
            { name: t("suggested_po"), link: "/Suggested_Purchase_Order" },
            { name: t("debit_notes"), link: "/debitnote" },
            { name: t("combined_payment"), link: "/combinePayment" },
          ],
        },
      ],
    },
    {
      name: t("operations"),
      icon: <GiBoxUnpacking />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("dashboard"), link: "/dashboardOperation" },
            { name: t("receiving"), link: "/receiving" },
            { name: t("sorting"), link: "/sorting" },
            { name: t("ean_packing"), link: "/eanPacking" },
            { name: t("adjust_ean"), link: "/adjustEan" },
            { name: t("order_packing"), link: "/orderPackaging" },
            { name: t("wastage"), link: "/wastage" },
          ],
        },
      ],
    },
    {
      name: t("client_management"),
      icon: <MdGroupAdd />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("clients"), link: "/clientNew" },
            { name: t("consignee"), link: "/shipToNew" },
          ],
        },
      ],
    },
    {
      name: t("revenue"),
      icon: <MdInventory2 />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("quotation"), link: "/quotation" },
            { name: t("orders"), link: "/order" },
            { name: t("invoice"), link: "/invoice" },
            { name: t("claim"), link: "/claim" },
            { name: t("receipts"), link: "/reciept" },
               { name: t("billingNote"), link: "/billing_note" },
          ],
        },
      ],
    },
    {
      name: t("statistics"),
      icon: <CgMoreO />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("hpl"), link: "/hpl" },
            { name: t("asl"), link: "/asl" },
            { name: t("trend"), link: "/trend" },
          ],
        },
      ],
    },
    {
      name: t("inventory"),
      icon: <RiUserSettingsFill />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("available_ean"), link: "/eanAvailable" },
            { name: t("available_produce"), link: "/inventoryProduce" },
            { name: t("available_boxes"), link: "/inventoryBoxes" },
            {
              name: t("available_packaging"),
              link: "/inventoryPackaging",
            },
          ],
        },
      ],
    },
    {
      name: t("financials"),
      icon: <RiUserSettingsFill />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("accounting"), link: "/dashboard" },
            { name: t("currency_exchange"), link: "/currencyex" },
            { name: t("income_statement"), link: "/incomeState" },
            { name: t("accounts"), link: "/accounts" },
            { name: t("accounting_ledger"), link: "/accountLedger" },
          ],
        },
      ],
    },
    {
      name: t("setup"),
      icon: <RiUserSettingsFill />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("produce"), link: "/produceNew" },
            { name: t("boxes"), link: "/boxes" },
            { name: t("packaging"), link: "/packagingNew" },
            { name: t("ean"), link: "/eanNew" },
            { name: t("liner_management"), link: "/airlineNew" },
            { name: t("location"), link: "/location" },
            { name: t("bank"), link: "/bankNew" },
            { name: t("wages"), link: "/hourly" },
            { name: t("itf"), link: "/itfNew" },
            { name: t("port_management"), link: "/airportNew" },
            { name: t("clearance_management"), link: "/clearanceNew" },
            { name: t("transport_management"), link: "/transportNew" },
      { name: t("freight_management"), link: "/freight" },
 
            { name: t("users"), link: "/user" },
            { name: t("journey"), link: "/journey" },
            { name: t("notification"), link: "/notification" },
            { name: t("other_expenses"), link: "/expenseItem" },
            { name: t("upload_logos"), link: "/uploadlogo" },
            { name: t("company_address"), link: "/companyaddress" },
          ],
        },
      ],
    },
    {
      name: t("hr"),
      icon: <BsPersonWorkspace />,
      submenu: true,
      sublinks: [
        {
          sublink: [
            { name: t("employee"), link: "/employee" },
            { name: t("salary"), link: "/salary" },
            { name: t("attendance"), link: "/attendance" },
            { name: t("vacation"), link: "/vacation" },
            { name: t("advance_payments"), link: "/advance_payment" },
            { name: t("bonus_deduction"), link: "/bonous_detection" },
            { name: t("contract"), link: "/contract" },
            { name: t("user"), link: "/userHr" },
            { name: t("menu"), link: "/menu_management" },
          ],
        },
      ],
    },
  ];

  const filteredAdditionalLinks = additionalLinks
    .filter((link) => {
      if (level === "Level 5") {
        return link.name !== t("setup");
      }
      return true;
    })
    .map((link) => {
      if (level === "Level 5") {
        if ([t("financials"), t("operations")].includes(link.name)) {
          return {
            ...link,
            sublinks: link.sublinks.map((sub) => ({
              ...sub,
              sublink: sub.sublink.filter(
                (item) =>
                  ![t("income_statement"), t("accounting")].includes(
                    item.name
                  ) &&
                  !(
                    link.name === t("operations") &&
                    item.name === t("dashboard")
                  )
              ),
            })),
          };
        }
      }
      return link;
    });

  return [
    ...baseLinks,
    ...(showAdditionalLinks ? filteredAdditionalLinks : []),
  ];
};
