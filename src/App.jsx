import { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { IsLoginAuthenticateContext } from "./Contexts/LoginContext";
import PrivateRoute from "./PrivateRoute";
import Trends from "./components/Packing/Trends";
import ConsigneeDashthree from "./components/ClientManageMent/ConsigneeDashthree";
import Asll from "./components/Asl/Asll";
import Hpl from "./components/Asl/Hpl";
import AddClient from "./components/ClientManageMent/AddClient";
import AddShipTo from "./components/ClientManageMent/AddShipTo";
import Client from "./components/ClientManageMent/Client";
import ClientNew from "./components/ClientManageMent/ClientNew";
import CreateClient from "./components/ClientManageMent/CreateClient";
import EditClient from "./components/ClientManageMent/EditClient";
import ShipTo from "./components/ClientManageMent/ShipTo";
import ShipToNew from "./components/ClientManageMent/ShipToNew";
import Footer from "./components/Footer/Footer";
import Inventory from "./components/Inventory/Inventory";
import Language from "./components/Language";
import Login from "./components/Login/Login";
import Navbar from "./components/Navbar/Navbar";
import Claim from "./components/Orders/Claim";
import ClaimDetails from "./components/Orders/ClaimDetails";
import CreateQutoation from "./components/Orders/CreateQutoation";
import Invoice from "./components/Orders/Invoice";
import InvoiceDetails from "./components/Orders/InvoiceDetails";
import Operation from "./components/Orders/Operation";
import OperationDetails from "./components/Orders/OperationDetails";
import Quotation from "./components/Orders/Quotation";
import UpdateOperation from "./components/Orders/UpdateOperation";
import CreateOrder from "./components/Orders/order/CreateOrder";
import Orders from "./components/Orders/order/list";
import { OrderPdfView } from "./components/Orders/order/pdfView";
import InvoiceFirst from "./components/Orders/InvoiceFirst";
import AdjudtEanView from "./components/operation/AdjustEanView";
import AddPacking from "./components/Packing/AddPacking";
// import Hpl from "./components/Packing/Hpl";
import HplDetails from "./components/Packing/HplDetails";
import HplNew from "./components/Packing/HplNew";
import Packing from "./components/Packing/Packing";
import EanPacking from "./components/Packing/Packing";
import PackingDetails from "./components/Packing/PackingDetails";
import PackingNew from "./components/Packing/PackingNew";
import NewEanPacking from "./components/Packing/newEanPacking";
import CreatePurchaseOrder from "./components/PurchaseOrder/CreatePurchaseOrder";
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";
import Receiving from "./components/Receiving/Receiving";
import Acceptreceiving from "./components/Receiving/acceptReceving";
import AddAirline from "./components/Setup/AirlineManageMent/AddAirline";
import AirlineNew from "./components/Setup/AirlineManageMent/AirlineNew";
import AirportCreate from "./components/Setup/AirportManagement/AirportCreate";
import AirportNew from "./components/Setup/AirportManagement/AirportNew";
import AddBank from "./components/Setup/Bank/AddBank";
import BankNew from "./components/Setup/Bank/BankNew";
import UpdateBank from "./components/Setup/Bank/UpdateBank";
import BoxesNew from "./components/Setup/Boxes/BoxesNew";
import CreateBoxNew from "./components/Setup/Boxes/CreateBoxNew";
import UpdateBox from "./components/Setup/Boxes/UpdateBox";
import ClearanceNew from "./components/Setup/ClearanceManagement/ClearanceNew";
import UpdateClearanceNew from "./components/Setup/ClearanceManagement/UpdateClearanceNew";
import AddCurrency from "./components/Setup/CurrencyManageMent/AddCurrency";
import CurrencyNew from "./components/Setup/CurrencyManageMent/CurrencyNew";
import UpdateCurrency from "./components/Setup/CurrencyManageMent/UpdateCurrency";
import AddEan from "./components/Setup/Ean/AddEan";
import EanNew from "./components/Setup/Ean/EanNew";
import UpdateEan from "./components/Setup/Ean/UpdateEan";
import AddExtra from "./components/Setup/ExtraManageMent/AddExtra";
import Extra from "./components/Setup/ExtraManageMent/Extra";
import FreightMangement from "./components/Setup/FreightMangeMent/FreightMangement";
import FreightNew from "./components/Setup/FreightMangeMent/FreightNew";
import UpdateFreight from "./components/Setup/FreightMangeMent/UpdateFreight";
import Hourly from "./components/Setup/HourlyRate/Hourly";
import UpdateHourly from "./components/Setup/HourlyRate/updateHourly";
import AddItf from "./components/Setup/Itf/AddItf";
import Itf from "./components/Setup/Itf/Itf";
import ItfNew from "./components/Setup/Itf/ItfNew";
import CreateLocation from "./components/Setup/Location/CreateLocation";
import Location from "./components/Setup/Location/Location";
import UpdateLocation from "./components/Setup/Location/UpdateLocation";
import CreatePackagingNew from "./components/Setup/Packaging/CreatePackagingNew";
import PackagingUpdate from "./components/Setup/Packaging/EditPackaging";
import PackagingCreate from "./components/Setup/Packaging/PackagingCreate";
import PackagingNew from "./components/Setup/Packaging/PackagingNew";
import UpdatePackaging from "./components/Setup/Packaging/UpdatePackaging";
import AddPallet from "./components/Setup/Pallets/AddPallet";
import EditPallet from "./components/Setup/Pallets/EditPalet";
import Pallet from "./components/Setup/Pallets/Pallet";
import ProduceCreateNew from "./components/Setup/Produce/ProduceCreateNew";
import ProduceNew from "./components/Setup/Produce/ProduceNew";
import UpdateProduce from "./components/Setup/Produce/UpdateProduce";
import TransportNew from "./components/Setup/TransportManagement/TransportNew";
import UpdateTransport from "./components/Setup/TransportManagement/UpdateTransport";
import UnitCreate from "./components/Setup/UnitCount/CreateUnit";
import EditUnit from "./components/Setup/UnitCount/EditUnit";
import UnitCountNew from "./components/Setup/UnitCount/UnitCountNew";
import Sorting from "./components/Sorting/Sorting";
import NewSorting from "./components/Sorting/addSorting";
import AddVendor from "./components/VendorManagement/AddVendor";
import Vendor from "./components/VendorManagement/Vendor";
import EditExpenseItems from "./components/expenseItem/edit";
import { ExpenseItemList } from "./components/expenseItem/list";
import { AdjustEan } from "./components/operation/adjustEan";
import { OperationDashboard } from "./components/operation/dashboard";
import { EANAvailable } from "./components/operation/eanAvailable";
import { OrderPackagingEdit } from "./components/operation/packaging/edit";
import { OrderPackagingList } from "./components/operation/packaging/list";
import DashboardNew from "./pages/DashboardNew";
import { Pdf_View } from "./components/Orders/order/Pdf_View";
import Users from "./components/Setup/user/Users";
import CreateUser from "./components/Setup/user/CreateUser";
import UserResetPass from "./components/Setup/user/UserResetPass";
import InventoryProduce from "./components/operation/InventoryProduce";
import InventoryPackaging from "./components/operation/InventoryPackaging";
import OrderView from "./components/Orders/OrderView";
import PurchaseView from "./components/PurchaseOrder/PurchaseView";
import QuotationView from "./components/Orders/QuotationView";
import Journey from "./components/Setup/Journey/Journey";
import CreateJourney from "./components/Setup/Journey/CreateJourney";
import EditJourney from "./components/Setup/Journey/EditJourney";
import InventoryBoxes from "./components/operation/InventoryBoxes";
import UpdateUser from "./components/Setup/user/UpdateUser";
import Notification from "./components/Setup/notification/Notification";
import CreateNotification from "./components/Setup/notification/CreateNotification";
import Updatenotification from "./components/Setup/user/Updatenotification";
import InvoiceSecPdf from "./components/Orders/InvoiceSecPdf";
import UpdateQutoation from "./components/Orders/UpdateQutoation";
import UpdateOrder from "./components/Orders/order/UpdateOrder";
import UpdatePrice from "./components/updatePrice/UpdatePrice";
import InvoiceThird from "./components/Orders/InvoiceThird";
import InvoiceView from "./components/Orders/InvoiceView";
import InvoiceEdit from "./components/Orders/InvoiceEdit";
import QuotaionPdf from "./components/Orders/QuotaionPdf";
import CurrencyExchange from "./components/Accounting/CurrencyExchange";
import QuotationProforma from "./components/Orders/QuotationProforma";
import ProformaInvoice from "./components/Orders/ProformaInvoice";
import ProformaInvoiceTest from "./components/Orders/test/ProformaInvoiceTest";
import ForgotPassword from "./components/Login/ForgotPassword";
import OtpPage from "./components/Login/OtpPage";
import GeneratePassword from "./components/Login/GeneratePassword";
import ClientDash from "./components/ClientManageMent/ClientDash";
import ClientDashtwo from "./components/ClientManageMent/ClientDashtwo";
import ConsigneeDash from "./components/ClientManageMent/ConsigneeDash";
import ConsigneeDashtwo from "./components/ClientManageMent/ConsigneeDashtwo";
import ClaimPdf from "./components/Orders/ClaimPdf";
import EanRepack from "./components/operation/eanRepack";
import LastPurchase from "./components/VendorManagement/LastPurchase";
import Remarks from "./components/Remarks/Remarks";
import CompanyAddress from "./components/Setup/companyAddress/CompanyAddress";
import CreateCompanyAddress from "./components/Setup/companyAddress/CreateCompanyAddress";
import EditcompanyAddress from "./components/Setup/companyAddress/EditcompanyAddress";
import Accounts from "./components/Accounting/Accounts";
import CreateAccounts from "./components/Accounting/CreateAccounts";
import DebitNotes from "./components/PurchaseOrder/DebitNotes";
import EditAccount from "./components/Accounting/EditAccount";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "./Url/Url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Test from "./components/Orders/test/Test";
import { CreateTwoTone } from "@mui/icons-material";
import CreateTest from "./components/Orders/test/CreateTest";
import UpdateTest from "./components/Orders/test/UpdateTest";
import QuotationTest from "./components/Orders/test/QuotationTest";
import UpdateQuotationTest from "./components/Orders/test/UpdateQuotationTest";
import CreateQuotationTest from "./components/Orders/test/CreateQuotationTest";
import { Pdf_View_Test } from "./components/Orders/test/Pdf_View_Test";
import { PdfView_Test } from "./components/Orders/test/PdfView_Test";
import OrderViewTest from "./components/Orders/test/OrderViewTest";
import Quotation_View_Test from "./components/Orders/test/Quotation_View_Test";
import QuotaionPdfTest from "./components/Orders/test/QuotaionPdfTest";
import QuotationProformaTest from "./components/Orders/test/QuotationProformaTest";
import CombinePayment from "./components/combinePayement/CombinePayment";
import CombinePaymentView from "./components/combinePayement/CombinePaymentView";
import CombinePaymentEdit from "./components/combinePayement/CombinePaymentEdit";
import AdvancePayment from "./components/hr/AdvancePayment";
import Employee from "./components/hr/Employee";
import Attendance from "./components/hr/Attendance";
import Salary from "./components/hr/Salary";
import Vacation from "./components/hr/Vacation";
import BonousDetection from "./components/hr/BonousDetection";
import Contract from "./components/hr/Contract";
import UserHr from "./components/hr/UserHr";
import MenuManagement from "./components/hr/MenuManagement";

function App() {
  const location = useLocation(); // Hook to get the current URL location
  const navigate = useNavigate();
  console.log(location);
  const [isAuthenticate] = useContext(IsLoginAuthenticateContext);
  useEffect(() => {
    const level = localStorage.getItem("level");

    // 🔹 If Level 5 users visit `/`, immediately redirect them to `/purchase_orders`
    if (level === "Level 5" && location.pathname === "/") {
      navigate("/purchase_orders", { replace: true });
    }

    const checkIsActive = async () => {
      const user_id = localStorage.getItem("id");

      try {
        const response = await axios.post(`${API_BASE_URL}/CheckIsActive`, {
          user_id,
        });

        // If user is inactive, log them out
        if (response.data.isActive == "0") {
          localStorage.clear();
          navigate("/login", { replace: true });
          window.location.reload();
        }
      } catch (error) {
        console.error("Error checking if user is active:", error);
      }
    };

    if (isAuthenticate) {
      checkIsActive();
    }
  }, [isAuthenticate, location.pathname, navigate]);
  // useEffect(() => {
  //   // Function to call the API
  //   const checkIsActive = async () => {
  //     const user_id = localStorage.getItem("id"); // Assuming you store user_id in localStorage
  //     const level = localStorage.getItem("level");
  //     try {
  //       const response = await axios.post(`${API_BASE_URL}/CheckIsActive`, {
  //         user_id,
  //       });
  //       console.log("CheckIsActive response:", response.data.isActive);
  //       console.log("falseeeeeeeeeeeeeee");
  //       // Condition to check if the user is inactive
  //       if (response.data.isActive == "0") {
  //         console.log("trueeeeeeeeeee");
  //         localStorage.clear(); // Clear localStorage if user is inactive
  //         window.location.reload(navigate("/login"));
  //       }
  //     } catch (error) {
  //       console.error("Error checking if user is active:", error);
  //     }
  //     if (level === "Level 5" && location.pathname === "/") {
  //       navigate("/purchase_orders", { replace: true });
  //     }
  //   };

  //   // Only call the API if the user is authenticated
  //   if (isAuthenticate) {
  //     checkIsActive(); // Check user activity status
  //   }
  // }, [isAuthenticate, location.pathname, navigate]);
  return (
    <>
      {isAuthenticate ? <Navbar /> : ""}
      <div className="py-4 main-content loginMain">
        <div className="container-fluid loginContainer">
          <Routes>
            {isAuthenticate ? (
              <Route element={<PrivateRoute isAuthenticate={isAuthenticate} />}>
                <Route path="/dashboard" element={<DashboardNew />} />
                <Route path="/" element={<DashboardNew />} />
                <Route path="/unit_create" element={<UnitCreate />} />
                <Route path="/Suggested_Purchase_Order" element={<Remarks />} />
                <Route path="/companyaddress" element={<CompanyAddress />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/createaccounts" element={<CreateAccounts />} />
                <Route path="/editaccounts" element={<EditAccount />} />
                <Route
                  path="/createcompanyAddress"
                  element={<CreateCompanyAddress />}
                />
                <Route
                  path="/editcompanyaddress"
                  element={<EditcompanyAddress />}
                />
                <Route path="/unit_edit" element={<EditUnit />} />
                <Route path="/packaging_create" element={<PackagingCreate />} />
                <Route path="/packaging_update" element={<PackagingUpdate />} />
                <Route path="/airport_create" element={<AirportCreate />} />
                <Route path="/airport_update" element={<AirportCreate />} />
                <Route
                  path="/create_clearance"
                  element={<UpdateClearanceNew />}
                />
                <Route
                  path="/update_clearance"
                  element={<UpdateClearanceNew />}
                />
                <Route
                  path="/createNotification"
                  element={<CreateNotification />}
                />
                <Route
                  path="/updateNotification"
                  element={<Updatenotification />}
                />

                <Route path="/freight" element={<FreightMangement />} />
                <Route path="/add_freight" element={<UpdateFreight />} />
                <Route path="/update_freight" element={<UpdateFreight />} />
                <Route path="/add_ean" element={<AddEan />} />
                <Route path="/update_ean" element={<UpdateEan />} />
                <Route path="/itf" element={<Itf />} />
                <Route path="/add_itf" element={<AddItf />} />
                <Route path="/edit_itf" element={<AddItf />} />
                <Route path="/add_currency" element={<AddCurrency />} />
                <Route path="/udpate_currency" element={<UpdateCurrency />} />
                <Route path="/add_airline" element={<AddAirline />} />
                <Route path="/update_airline" element={<AddAirline />} />
                <Route path="/add_bank" element={<AddBank />} />
                <Route path="/update_bank" element={<UpdateBank />} />
                <Route path="/pallet" element={<Pallet />} />
                <Route path="/add_pallet" element={<AddPallet />} />
                <Route path="/edit_pallet" element={<EditPallet />} />
                <Route path="/hourly" element={<Hourly />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/client" element={<Client />} />
                <Route path="/add_client" element={<AddClient />} />
                <Route path="/edit_client" element={<EditClient />} />
                <Route path="/vendor" element={<Vendor />} />
                <Route path="/last_purchase" element={<LastPurchase />} />
                <Route path="/add_vendor" element={<AddVendor />} />
                <Route path="/update_vendor" element={<AddVendor />} />
                <Route path="/packing" element={<Packing />} />
                <Route path="/packing_details" element={<PackingDetails />} />
                <Route path="/add_packing" element={<AddPacking />} />
                <Route path="/hpl_details" element={<HplDetails />} />
                <Route path="/purchase_orders" element={<PurchaseOrder />} />
                <Route path="/purchaseview" element={<PurchaseView />} />
                <Route path="/receiving" element={<Receiving />} />
                <Route path="/ship_to" element={<ShipTo />} />
                <Route path="/add_ship_to" element={<AddShipTo />} />
                <Route path="/edit_ship_to" element={<AddShipTo />} />
                <Route path="/quotation" element={<Quotation />} />
                <Route
                  path="/operation_details"
                  element={<OperationDetails />}
                />
                <Route path="/journey" element={<Journey />} />
                <Route path="/proformainvoice" element={<ProformaInvoice />} />
                <Route
                  path="/proforma_invoice_test"
                  element={<ProformaInvoiceTest />}
                />

                <Route path="/openjourney" element={<CreateJourney />} />
                <Route path="/openEditjourney" element={<EditJourney />} />
                <Route path="/claim" element={<Claim />} />
                <Route path="/claimPdf" element={<ClaimPdf />} />

                <Route path="/claim_details" element={<ClaimDetails />} />
                <Route path="/invoice" element={<Invoice />} />
                <Route path="/invoice_details" element={<InvoiceDetails />} />
                <Route path="/operations" element={<Operation />} />
                <Route path="/update_operation" element={<UpdateOperation />} />
                <Route path="/asl" element={<Asll />} />
                <Route path="/hpl" element={<Hpl />} />

                <Route path="/orderview" element={<OrderView />} />
                <Route path="/order_view_test" element={<OrderViewTest />} />
                <Route path="/sorting" element={<Sorting />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/language" element={<Language />} />
                <Route path="/produceNew" element={<ProduceNew />} />
                <Route path="/quotationpdf" element={<QuotaionPdf />} />
                <Route
                  path="/qoutation_pdf_test"
                  element={<QuotaionPdfTest />}
                />

                <Route path="/unitCount" element={<UnitCountNew />} />
                <Route path="/boxes" element={<BoxesNew />} />
                <Route path="/packagingNew" element={<PackagingNew />} />
                <Route path="updatePackaging" element={<UpdatePackaging />} />
                <Route path="/invoice_edit" element={<InvoiceEdit />} />
                <Route path="/airlineNew" element={<AirlineNew />} />
                <Route path="/airportNew" element={<AirportNew />} />
                <Route path="/bankNew" element={<BankNew />} />
                <Route path="/clearanceNew" element={<ClearanceNew />} />
                <Route path="/currencyNew" element={<CurrencyNew />} />
                <Route path="/eanNew" element={<EanNew />} />
                <Route path="/freightNew" element={<FreightNew />} />
                <Route path="/itfNew" element={<ItfNew />} />
                <Route path="/transportNew" element={<TransportNew />} />
                <Route path="/invoice_pdf" element={<InvoiceFirst />} />
                <Route path="/update_price" element={<UpdatePrice />} />
                <Route
                  path="/produceCreateNew"
                  element={<ProduceCreateNew />}
                />
                <Route path="/createBoxNew" element={<CreateBoxNew />} />
                <Route path="/updateProduce" element={<UpdateProduce />} />
                <Route path="/updateBox" element={<UpdateBox />} />
                <Route
                  path="/createClearanceNew"
                  element={<UpdateClearanceNew />}
                />
                <Route
                  path="/updateClearanceNew"
                  element={<UpdateClearanceNew />}
                />
                <Route path="/custom_invoice_pdf" element={<InvoiceThird />} />
                <Route path="/invoiceview" element={<InvoiceView />} />

                <Route path="/quotationview" element={<QuotationView />} />
                <Route
                  path="/quotation_view_test"
                  element={<Quotation_View_Test />}
                />
                <Route path="/adjustView" element={<AdjudtEanView />} />
                <Route path="/extra" element={<Extra />} />
                <Route path="/addExtra" element={<AddExtra />} />
                <Route
                  path="/createPackagingNew"
                  element={<CreatePackagingNew />}
                />
                <Route path="/addTransport" element={<UpdateTransport />} />
                <Route
                  path="/quotationproforma"
                  element={<QuotationProforma />}
                />
                <Route
                  path="/quotation_proforma_test"
                  element={<QuotationProformaTest />}
                />
                <Route path="/notification" element={<Notification />} />
                <Route path="/updateTransport" element={<UpdateTransport />} />
                <Route path="/location" element={<Location />} />
                <Route path="/createLocation" element={<CreateLocation />} />
                <Route path="/updateLocation" element={<UpdateLocation />} />
                <Route path="/clientNew" element={<ClientNew />} />
                <Route path="/clientDash" element={<ClientDash />} />
                <Route path="/Clientdashtwo" element={<ClientDashtwo />} />
                <Route path="/consigneeDash" element={<ConsigneeDash />} />
                <Route path="/consigneetwo" element={<ConsigneeDashtwo />} />
                <Route path="/createClient" element={<CreateClient />} />
                <Route path="/updateClient" element={<CreateClient />} />
                <Route path="/shipToNew" element={<ShipToNew />} />
                <Route
                  path="/consigneethree"
                  element={<ConsigneeDashthree />}
                />

                <Route path="/createOrder" element={<CreateOrder />} />
                <Route path="/updateOrder" element={<UpdateOrder />} />
                <Route path="/test" element={<Test />} />
                <Route path="/createTestOrder" element={<CreateTest />} />
                <Route path="/updateTestOrder" element={<UpdateTest />} />
                <Route path="/quotation_test" element={<QuotationTest />} />
                <Route
                  path="/createTestQuotation"
                  element={<CreateQuotationTest />}
                />
                <Route
                  path="/updateTestQuotation"
                  element={<UpdateQuotationTest />}
                />
                <Route path="/trend" element={<Trends />} />

                <Route
                  path="/createPurchaseOrder"
                  element={<CreatePurchaseOrder />}
                />
                <Route
                  path="/updatePurchaseOrder"
                  element={<CreatePurchaseOrder />}
                />
                <Route path="/debitnote" element={<DebitNotes />} />
                <Route path="/hplNew" element={<HplNew />} />
                <Route path="/createQutation" element={<CreateQutoation />} />
                <Route path="/updateQutation" element={<UpdateQutoation />} />
                <Route path="/currencyex" element={<CurrencyExchange />} />

                <Route path="/createUser" element={<CreateUser />} />
                <Route path="/updateUser" element={<UpdateUser />} />
                <Route path="/userResetPass" element={<UserResetPass />} />
                <Route path="/packingNew" element={<PackingNew />} />
                <Route path="/updateHourly" element={<UpdateHourly />} />
                <Route path="/addHourly" element={<UpdateHourly />} />
                <Route path="/acceptReceiving" element={<Acceptreceiving />} />
                <Route path="/eanPacking" element={<EanPacking />} />
                <Route path="/newEanPacking" element={<NewEanPacking />} />
                <Route path="/combinePayment" element={<CombinePayment />} />
                <Route
                  path="/combinePaymentView"
                  element={<CombinePaymentView />}
                />
                <Route
                  path="/combinePaymenEdit"
                  element={<CombinePaymentEdit />}
                />
                <Route
                  path="/orderPackaging"
                  element={<OrderPackagingList />}
                />
                <Route
                  path="/orderPackagingEdit"
                  element={<OrderPackagingEdit />}
                />
                <Route path="/operation" element={<Operation />} />
                <Route path="/newSorting" element={<NewSorting />} />
                <Route
                  path="/dashboardOperation"
                  element={<OperationDashboard />}
                />
                <Route path="/eanAvailable" element={<EANAvailable />} />
                <Route path="/adjustEan" element={<AdjustEan />} />
                <Route path="/repackEan" element={<EanRepack />} />
                <Route path="/operationPdf" element={<OrderPdfView />} />
                <Route path="/operationPdf_test" element={<PdfView_Test />} />

                <Route
                  path="/order_custom_pdf_test"
                  element={<Pdf_View_Test />}
                />

                <Route path="/order_custom_pdf" element={<Pdf_View />} />
                <Route path="/packing_list_pdf" element={<InvoiceSecPdf />} />
                <Route path="/expenseItem" element={<ExpenseItemList />} />
                <Route path="/expenseItemEdit" element={<EditExpenseItems />} />
                <Route path="/user" element={<Users />} />
                <Route
                  path="/inventoryProduce"
                  element={<InventoryProduce />}
                />
                <Route
                  path="/inventoryPackaging"
                  element={<InventoryPackaging />}
                />
                <Route path="/inventoryBoxes" element={<InventoryBoxes />} />
                {/* hr  */}

                <Route path="/advance_payment" element={<AdvancePayment />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/salary" element={<Salary />} />
                <Route path="/vacation" element={<Vacation />} />
                <Route path="/bonous_detection" element={<BonousDetection />} />
                <Route path="/contract" element={<Contract />} />
                <Route path="/userHr" element={<UserHr />} />
                <Route path="/menu_management" element={<MenuManagement />} />
                {/* hr end */}
              </Route>
            ) : (
              <>
                <Route path="/*" element={<Login />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route path="/generatepass" element={<GeneratePassword />} />
              </>
            )}
          </Routes>
        </div>
      </div>

      {isAuthenticate && <Footer />}
      <ToastContainer autoClose={1000} theme="colored" />
    </>
  );
}

export default App;
