import { CgMoreO } from "react-icons/cg";
import { GiBoxUnpacking } from "react-icons/gi";
import { MdGroupAdd, MdInventory2 } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import BugReportIcon from "@mui/icons-material/BugReport";
const email = localStorage.getItem("email");
const role = localStorage.getItem("role");
const level = localStorage.getItem("level");
import { BsPersonWorkspace } from "react-icons/bs";
const baseLinks = [
  ...(role == "Operation"
    ? [
        {
          name: "Expenses",
          icon: <GiBoxUnpacking />,
          submenu: true,
          sublinks: [
            {
              sublink: [
                { name: "Purchase Order", link: "/purchase_orders" },
                { name: "Vendor", link: "/vendor" },
                { name: "Update Price", link: "/update_price" },
              ],
            },
          ],
        },
        {
          name: "Operations",
          icon: <GiBoxUnpacking />,
          submenu: true,
          sublinks: [
            {
              sublink: [
                { name: "Dashboard", link: "/dashboardOperation" },
                { name: "Receiving", link: "/receiving" },
                { name: "Sorting", link: "/sorting" },
                { name: "EAN Packing", link: "/eanPacking" },
                { name: "Adjust EAN", link: "/adjustEan" },
                { name: "Order Packing", link: "/orderPackaging" },
              ],
            },
          ],
        },
        {
          name: "Inventory",
          icon: <RiUserSettingsFill />,
          submenu: true,
          sublinks: [
            {
              sublink: [
                { name: "Available EAN", link: "/eanAvailable" },
                { name: "Available Produce", link: "/inventoryProduce" },
                { name: "Available Boxes", link: "/inventoryBoxes" },
                { name: "Available Packaging", link: "/inventoryPackaging" },
              ],
            },
          ],
        },
      ]
    : []),
];

const showAdditionalLinks = !(
  // (email == "Plaew" && role == "Operation") ||
  // (email == "Gam" && role == "Operation") ||
  (role == "Operation")
);

const additionalLinks = [
  {
    name: "Expenses",
    icon: <GiBoxUnpacking />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Purchase Order", link: "/purchase_orders" },
          { name: "Vendor", link: "/vendor" },
          { name: "Update Price", link: "/update_price" },
          { name: "Last Purchase", link: "/last_purchase" },
          {
            name: "Suggested Purchase Order",
            link: "/Suggested_Purchase_Order",
          },
          { name: "Debit Notes", link: "/debitnote" },
          { name: "Combined Payment", link: "/combinePayment" },
        ],
      },
    ],
  },
  {
    name: "Operations",
    icon: <GiBoxUnpacking />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Dashboard", link: "/dashboardOperation" },
          { name: "Receiving", link: "/receiving" },
          { name: "Sorting", link: "/sorting" },
          { name: "Packing", link: "/eanPacking" },
          { name: "EAN", link: "/adjustEan" },
          { name: "Order Packing", link: "/orderPackaging" },
        ],
      },
    ],
  },
  {
    name: "Client Management",
    icon: <MdGroupAdd />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Clients", link: "/clientNew" },
          { name: "Consignee", link: "/shipToNew" },
        ],
      },
    ],
  },
  {
    name: "Revenue",
    icon: <MdInventory2 />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Quotation", link: "/quotation_test" },
          { name: "Orders", link: "/test" },
          { name: "Invoice", link: "/invoice" },
          { name: "Claim", link: "/claim" },
        ],
      },
    ],
  },
  {
    name: "Statistics",
    icon: <CgMoreO />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "HPL", link: "/hpl" },
          { name: "ASL", link: "/asl" },
          { name: "Trend", link: "/trend" },
        ],
      },
    ],
  },
  {
    name: "Inventory",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Available EAN", link: "/eanAvailable" },
          { name: "Available Produce", link: "/inventoryProduce" },
          { name: "Available Boxes", link: "/inventoryBoxes" },
          { name: "Available Packaging", link: "/inventoryPackaging" },
        ],
      },
    ],
  },
  {
    name: "Financials",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Accounting", link: "/dashboard" },
          { name: "Currency Exchange Update", link: "/currencyex" },
          { name: "Income Statement", link: "/incomeState" },
          { name: "Accounts", link: "/accounts" },
        ],
      },
    ],
  },
  {
    name: "Setup",
    icon: <RiUserSettingsFill />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Produce", link: "/produceNew" },
          { name: "Boxes", link: "/boxes" },
          { name: "Packaging", link: "/packagingNew" },
          { name: "EAN", link: "/eanNew" },
          { name: "Liner Management", link: "/airlineNew" },
          { name: "Location", link: "/location" },
          { name: "Bank", link: "/bankNew" },
          { name: "Wages", link: "/hourly" },
          { name: "ITF", link: "/itfNew" },
          { name: "Port Management", link: "/airportNew" },
          { name: "Clearance Management", link: "/clearanceNew" },
          { name: "Transport Management", link: "/transportNew" },
          { name: "Freight Management", link: "/freightNew" },
          { name: "Users", link: "/user" },
          { name: "Journey", link: "/journey" },
          { name: "Notification", link: "/notification" },
          { name: "Other  Expenses", link: "/expenseItem" },
          { name: "Upload Logos", link: "/uploadlogo" },
          { name: "Company Address Details", link: "/companyaddress" },
        ],
      },
    ],
  },
  {
    name: "HR",
    icon: <BsPersonWorkspace />,
    submenu: true,
    sublinks: [
      {
        sublink: [
          { name: "Employee", link: "/employee" },
          { name: "Salary", link: "/salary" },
          { name: "Attendance", link: "/attendance" },
          { name: "Vacation", link: "/vacation" },
          { name: " Advance Payments", link: "/advance_payment" },
          { name: " Bonus and Deduction", link: "/bonous_detection" },
          { name: "Contract", link: "/contract" },
          { name: "User", link: "/userHr" },
          { name: "Menu", link: "/menu_management" },
        ],
      },
    ],
  },
];
const filteredAdditionalLinks = additionalLinks
  .filter((link) => {
    if (level === "Level 5") {
      return !["Setup"].includes(link.name); // Hides "Setup" for Level 5
    }
    return true;
  })
  .map((link) => {
    if (level === "Level 5") {
      if (link.name === "Financials" || link.name === "Operations") {
        return {
          ...link,
          sublinks: link.sublinks.map((sub) => ({
            ...sub,
            sublink: sub.sublink.filter(
              (item) =>
                !["Income Statement", "Accounting"].includes(item.name) && // Hide "Income Statement" & "Accounting"
                !(link.name === "Operations" && item.name === "Dashboard") // Hide "Dashboard" in "Operations"
            ),
          })),
        };
      }
    }
    return link;
  });
export const links = [
  ...baseLinks,
  ...(showAdditionalLinks ? filteredAdditionalLinks : []),
];
