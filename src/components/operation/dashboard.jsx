import { useMemo, useState, useEffect } from "react";
import { API_BASE_URL } from "../../Url/Url";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "react-modal";
import axios from "axios";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "react-query";
import { useForm } from "@tanstack/react-form";
import { ComboBox } from "../combobox";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon

import { Autocomplete, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
const localizer = momentLocalizer(moment);
export const OperationDashboard = () => {
  const [t, i18n] = useTranslation("global");
  const [allData, setAllData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedLinerId, setSelectedLinerId] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedLoadData, setSelectedLoadDate] = useState("");
  const [orderId, setOrderId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startDate1, setStartDate1] = useState(null);
  const [startDate2, setStartDate2] = useState(null);
  const [Journey, setJourney] = useState([]);
  const [notes, setNotes] = useState("");
  const [journeyId, setJourneyId] = useState(null);
  const [consigneeId, setConsigneeId] = useState("");

  console.log(selectedLinerId);
  // const { data, refetch } = useQuery("getOrders");

  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    setStatus(event.target.value);
  };
  const CustomInput = ({ value, onClick }) => (
    <div
      className="custom-input"
      onClick={onClick}
      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
    >
      <input
        type="text"
        value={value}
        readOnly
        style={{
          padding: "10px",
          paddingLeft: "35px",
          width: "250px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "unset !important",
        }}
      />
      <FaCalendarAlt
        style={{
          position: "absolute",
          right: "10px",
          fontSize: "18px",
          color: "#888",
          marginBottom: "unset !important",
        }}
      />
    </div>
  );
  const [data, setData] = useState([]);

  const orderData1 = () => {
    axios
      .get(`${API_BASE_URL}/getOrders`, {
        params: {
          status, // This will pass the selected status value
        },
      })
      .then((res) => {
        setData(res.data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  // Optionally call the API on component mount or when the status changes
  useEffect(() => {
    if (status !== "") {
      orderData1();
    }
  }, [status]);
  const orderData = () => {
    axios.get(`${API_BASE_URL}/getOrders`).then((res) => {
      setData(res.data.data || []);
    });
  };
  useEffect(() => {
    orderData();
  }, []);
  const [isOpenModal, setIsOpenModal] = useState(false);
  useEffect(() => {
    if (modalIsOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [modalIsOpen]);

  const { data: liner } = useQuery("getLiner");
  const [totalDetails, setTotalDetails] = useState("");

  const handleChange5 = (e) => {
    setInputValue(e.target.value); // Update state with the input value
  };
  const [id, setID] = useState(null);
  const dataFind = useMemo(() => {
    console.log(data);
    console.log(id);
    return data?.find((v) => +v.Order_ID == +selectedOrderId);
  }, [selectedOrderId, data]);
  console.log(dataFind);
  const form = useForm({
    defaultValues: {
      Liner: totalDetails?.Liner_ID || "",
      journey_number: totalDetails?.journey_id || "",
      Customer_ref: inputValue,
      bl: totalDetails?.BL || "",
      // Customer_ref: totalDetails?.Customer_ref || "",
      Load_date: moment(startDate).format("YYYY-MM-DD"),
      Load_time: totalDetails?.Load_time || "",
      Ship_date: moment(startDate1).format("YYYY-MM-DD"),
      ETD: totalDetails?.ETD || "",
      Arrival_date: moment(startDate2).format("YYYY-MM-DD"),
      ETA: totalDetails?.ETA || "",
    },

    onSubmit: async ({ value }) => {
      if (totalDetails?.Order_ID) {
        try {
          await axios.post(`${API_BASE_URL}/NewupdateOrderFreight`, {
            order_id: totalDetails?.Order_ID,
            consignee_id: consigneeId,
            ...value,
          });
          oneQoutationDAta();
          toast.success(t("orderUpdateSuccess"));
          setInputValue("");
          orderData();
          refetch();
        } catch (e) {
          console.log(e);
          // toast.error("Something went wrong");
        }
      }
      closeModal();
    },
  });

  useEffect(() => {
    if (selectedLinerId !== null || totalDetails?.Liner_ID) {
      const linerId =
        selectedLinerId !== null ? selectedLinerId : totalDetails?.Liner_ID;
      axios
        .post(`${API_BASE_URL}/getjourneyNumber`, { liner_id: linerId })
        .then((response) => {
          setJourney(response.data.data || []);
          console.log(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedLinerId, totalDetails?.Liner_ID]);
  const closeModal1 = () => {
    setIsOpenModal(false);
  };
  useEffect(() => {
    if (totalDetails) {
      setInputValue(totalDetails?.Customer_ref || ""); // Update inputValue when totalDetails changes
    }
  }, [totalDetails]);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>", id);
  const oneQoutationDAta = () => {
    axios
      .get(`${API_BASE_URL}/NewgetOrdersById`, {
        params: {
          order_id: id,
        },
      })
      .then((response) => {
        console.log(response);
        setTotalDetails(response.data.data);
        setConsigneeId(response.data.data?.Consignee_ID);
        setStartDate(new Date(response.data.data.load_date));
        setStartDate1(new Date(response.data.data.Ship_date));
        setStartDate2(new Date(response.data.data.Arrival_date));
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    oneQoutationDAta();
  }, [id]);
  useEffect(() => {
    oneQoutationDAta();
  }, []);
  const openModal = (id = null) => {
    setModalIsOpen(false);
    setID(id);
    console.log(id);
    form.reset();
    setIsOpenModal(true);
  };
  const handleJourneySelection = async (selectedJourneyId) => {
    console.log(selectedJourneyId);
    const journey_id = selectedJourneyId; // assuming selectedJourneyId comes directly as the ID
    const order_id = id; // Assuming 'id' is already storing the order_id you need
    const load_date = newDate
      ? moment(newDate).format("YYYY-MM-DD")
      : moment(startDate, "YYYY-MM-DD").format("YYYY-MM-DD");
    console.log(journey_id);
    console.log(order_id);

    setJourneyId(selectedJourneyId);
    try {
      // Sending a POST request to the server with journey_id and order_id
      const response = await axios.post(
        `${API_BASE_URL}/NewgetorderFreightDetails`,
        {
          journey_id,
          order_id,
          load_date,
        }
      );
      // Logging the entire response object to see all details
      console.log("Response from NewgetorderFreightDetails:", response);

      // Show success message

      // Check if data is available and update form fields
      const data = response.data;
      if (data) {
        // Log the data object to see its structure and values
        console.log("Received data:", data.data);

        // Updating form fields with the received data
        form.setFieldValue("Load_time", data.data.Load_time);
        form.setFieldValue("ETD", data.data.ETD);
        form.setFieldValue("ETA", data.data.ETA);
        form.setFieldValue(
          "Ship_date",
          new Date(data.data.Freight_ship_date).toISOString().split("T")[0]
        );
        form.setFieldValue(
          "Arrival_date",
          new Date(data.data.Freight_arrival_date).toISOString().split("T")[0]
        );
      } else {
        // Log if data is missing or undefined
        console.log("No data received in response");
      }
    } catch (error) {
      // Log the error if the request fails
      console.error("Failed to fetch freight details:", error);
      toast.error(t("errorFetchingFreightDetails"));
    }
  };

  const handleLoadDateSelection = async (loadDate) => {
    const journey_id = journeyId || totalDetails?.Freight_journey_number; // assuming selectedJourneyId comes directly as the ID
    const order_id = id; // Assuming 'id' is already storing the order_id you need
    const load_date = loadDate;
    setNewDate(load_date);
    try {
      // Sending a POST request to the server with journey_id and order_id
      const response = await axios.post(
        `${API_BASE_URL}/NewgetorderFreightDetails`,
        {
          journey_id,
          order_id,
          load_date,
        }
      );
      // Logging the entire response object to see all details
      console.log("Response from getOrderFreightDetails:", response);

      // Show success message

      // Check if data is available and update form fields
      const data = response.data;
      if (data) {
        // Log the data object to see its structure and values
        console.log("Received data:", data.data);

        // Updating form fields with the received data
        form.setFieldValue("Load_time", data.data.Load_time);
        form.setFieldValue("ETD", data.data.ETD);
        form.setFieldValue("ETA", data.data.ETA);
        form.setFieldValue(
          "Ship_date",
          new Date(data.data.Freight_ship_date).toISOString().split("T")[0]
        );
        form.setFieldValue(
          "Arrival_date",
          new Date(data.data.Freight_arrival_date).toISOString().split("T")[0]
        );
      } else {
        // Log if data is missing or undefined
        console.log("No data received in response");
      }
    } catch (error) {
      // Log the error if the request fails
      console.error("Failed to fetch freight details:", error);
      toast.error(t("errorFetchingFreightDetails"));
    }
  };
  // const handleLoadDateSelection = async (loadDate) => {
  //   const journey_id = journeyId || dataFind?.Freight_journey_number; // assuming selectedJourneyId comes directly as the ID
  //   const order_id = selectedOrderId; // Assuming 'id' is already storing the order_id you need
  //   const load_date = loadDate;
  //   try {
  //     // Sending a POST request to the server with journey_id and order_id
  //     const response = await axios.post(
  //       `${API_BASE_URL}/getOrderFreightDetails`,
  //       {
  //         journey_id,
  //         order_id,
  //         load_date,
  //       }
  //     );
  //     // Logging the entire response object to see all details
  //     console.log("Response from getOrderFreightDetails:", response);

  //     // Show success message

  //     // Check if data is available and update form fields
  //     const data = response.data;
  //     if (data) {
  //       // Log the data object to see its structure and values
  //       console.log("Received data:", data.data);

  //       // Updating form fields with the received data
  //       form.setFieldValue("Load_time", data.data.Load_time);
  //       form.setFieldValue("ETD", data.data.ETD);
  //       form.setFieldValue("ETA", data.data.ETA);
  //       form.setFieldValue(
  //         "Ship_date",
  //         new Date(data.data.Freight_ship_date).toISOString().split("T")[0]
  //       );
  //       form.setFieldValue(
  //         "Arrival_date",
  //         new Date(data.data.Freight_arrival_date).toISOString().split("T")[0]
  //       );
  //     } else {
  //       // Log if data is missing or undefined
  //       console.log("No data received in response");
  //     }
  //   } catch (error) {
  //     // Log the error if the request fails
  //     console.error("Failed to fetch freight details:", error);
  //     toast.error(t("fetchFreight"));
  //   }
  // };
  const handleEditClick = async (order_id) => {
    loadingModal.fire();
    try {
      const response = await axios.post(`${API_BASE_URL}/copyOrder`, {
        order_id: order_id,
        user: localStorage.getItem("id"),
        // Other data you may need to pass
      });
      console.log("API response:", response);
      loadingModal.close();
      orderData();
      toast.success(t("copyOrderProcedureSuccessfully"));
      // Handle the response as needed
    } catch (error) {
      console.error("API call error:", error);
      loadingModal.close();
      toast.error(t("copyOrderFailed"));
    }
  };
  const handleChange2 = (e) => {
    setNotes(e.target.value);
  };
  const dataSubmit = () => {
    axios
      .post(`${API_BASE_URL}/OrderNotes`, {
        order_id: orderId,
        notes: notes,
      })
      .then((response) => {
        console.log(response);
        let modalElement = document.getElementById("exampleModal");
        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
        }
        console.log(response);
        toast.success(t("orderNoteUpdated"), {
          autoClose: 1000,
          theme: "colored",
        });
        orderData();
        setNotes("");
        // Clear the quantity field after successful update
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Network Error", {
        //   autoClose: 1000,
        //   theme: "colored",
        // });
      });
  };
  const [view, setView] = useState(Views.MONTH); // Track the current calendar view
  // Fetch data from API
  const getData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/dashboardOpertation`);
      setAllData(data.Orders_pipline);
      console.log(data.Orders_pipline);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  const getEventTimes = (event) => {
    const loadingDate = moment(event.Loading_Date);

    return {
      start: loadingDate.startOf("day").toDate(),
      end: loadingDate.endOf("day").toDate(), // Show the event for the entire day
    };
  };

  // Map API data to events for the calendar
  const events = allData.map((event) => {
    const { start, end } = getEventTimes(event);
    return {
      title: event.Small,
      start,
      end,
      color: event.color,
      description: event.description,
      Expanded: event.Expanded, // Add additional fields as necessary
      order_id: event.order_id, // Include order_id in event
      Loading_Date: event.Loading_Date, // Include order_id in event
    };
  });

  // Event wrapper for customizing event display
  const EventWrapper = ({ event }) => (
    <div
      className="event-title"
      dangerouslySetInnerHTML={{
        __html: (event.title || "")
          .replace(/\r\n/g, "<br/>")
          .replace(/\n/g, "<br/>"),
      }}
    />
  );

  // Handle event click to open modal
  const handleEventClick = (event) => {
    console.log(event);
    setSelectedEvent(event);
    setModalIsOpen(true);
    setSelectedOrderId(event.order_id);
    setSelectedLoadDate(event.Loading_Date);
    setID(event.order_id);
    console.log("Selected order_id:", event.order_id); // Log the order_id on click
    console.log("Selected order_id:", event.Loading_Date); // Log the order_id on click
  };
  console.log(selectedOrderId);
  // Close modal
  const closeModal = () => {
    setIsOpenModal(false);
    setInputValue("");
  };
  return (
    <>
      <div className="dashboardOperation">
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              className="nav-link active"
              id="nav-home-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-home"
              type="button"
              role="tab"
              aria-controls="nav-home"
              aria-selected="true"
            >
              {t("calendar")}
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-home"
            role="tabpanel"
            aria-labelledby="nav-home-tab"
            tabIndex={0}
          >
            <div className="bg-white rounded w-full flex-col flex divide-y">
              <div className="font-bold text-lg py-3 px-3">
                {t("orderPipeline")}
              </div>
              <div className="App" style={{ padding: "8px" }}>
                <Calendar
                  localizer={localizer}
                  startAccessor="start"
                  events={events}
                  endAccessor="end"
                  style={{ height: "1000px" }}
                  eventPropGetter={(event) => ({
                    style: {
                      backgroundColor: event.color, // Event color
                    },
                  })}
                  onSelectEvent={handleEventClick}
                  views={[Views.MONTH, Views.WEEK, Views.DAY]}
                  components={{ event: EventWrapper }}
                  onView={(newView) => setView(newView)} // Capture the current view (month, week, or day)
                  min={new Date(1970, 1, 1, 0, 0)} // Same start time
                  max={new Date(1970, 1, 1, 0, 0)} // Same end time to hide time slots
                />
                <div onClick={() => openModal()}>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Event Details"
                    ariaHideApp={false}
                    style={{
                      content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: selectedEvent?.color || "white",
                        padding: "20px",
                        borderRadius: "10px",
                        maxWidth: "500px",
                        width: "90%",
                      },
                      overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    <h2
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedEvent?.Expanded?.replace(
                            /\r\n/g,
                            "<br/>"
                          ).replace(/\n/g, "<br/>") || "",
                      }}
                    />
                    <p>
                      {moment(selectedEvent?.start).format(
                        "DD MMMM YYYY hh:mm A"
                      )}{" "}
                      -{" "}
                      {moment(selectedEvent?.end).format(
                        "DD MMMM YYYY hh:mm A"
                      )}
                    </p>
                    <button onClick={closeModal}>
                      <CloseIcon />
                    </button>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenModal && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: 999 }}
        >
          <div
            className="fixed w-screen h-screen bg-black/20"
            onClick={closeModal1}
          />
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full ">
            <div className="crossArea">
              <h3>{t("editDetails")}</h3>
              <p onClick={closeModal}>
                <CloseIcon />
              </p>
            </div>
            <form.Provider>
              <form
                className="formEan formCreate mt-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void form.handleSubmit();
                }}
              >
                <div className="p-3 bottomOrderSp">
                  <div className="form-group">
                    <label>{t("consigneeRef")}</label>

                    <input
                      type="text"
                      value={inputValue}
                      onChange={handleChange5}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label> {t("liner")}</label>
                    <form.Field
                      name="Liner"
                      children={(field) => (
                        <ComboBox
                          options={liner?.map((v) => ({
                            id: v.liner_id,
                            name: v.liner_name,
                          }))}
                          value={field.state.value}
                          onChange={(e) => {
                            // Here, `e` is expected to be the ID of the selected item if ComboBox passes it like that,
                            // otherwise you might need to adjust how you retrieve the value
                            field.handleChange(e);
                            setSelectedLinerId(e); // Assuming `e` directly is the liner_id, adjust if needed
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label>{t("journeyNumber")}</label>

                    <form.Field
                      name="journey_number"
                      children={(field) => (
                        <ComboBox
                          options={Journey?.map((v) => ({
                            id: v.ID,
                            name: v.journey_number,
                          }))}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e);
                            handleJourneySelection(e);
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="form-group">
                    <label> {t("bl")}</label>
                    <form.Field
                      name="bl"
                      children={(field) => (
                        <input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>{t("loadDate")}</label>
                      <form.Field name="Load_date">
                        {(field) => {
                          const value = field.state.value;
                          const isValidDate =
                            value && !isNaN(Date.parse(value));

                          return (
                            <DatePicker
                              selected={isValidDate ? new Date(value) : null}
                              onChange={(date) => {
                                const formattedDate = date
                                  ?.toISOString()
                                  .split("T")[0]; // yyyy-MM-dd
                                field.handleChange(formattedDate); // Update form state
                                handleLoadDateSelection(formattedDate); // Trigger API logic
                              }}
                              onBlur={field.handleBlur}
                              dateFormat="dd/MM/yyyy"
                              placeholderText={t("selectDate")}
                              customInput={<CustomInput />}
                            />
                          );
                        }}
                      </form.Field>
                    </div>
                    <div className="form-group loadTimeS">
                      <label>{t("loadTime")}</label>
                      <form.Field
                        name="Load_time"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>{t("shipDate")}</label>
                      <form.Field name="Ship_date">
                        {(field) => {
                          const value = field.state.value;
                          const isValidDate =
                            value && !isNaN(Date.parse(value));

                          return (
                            <DatePicker
                              selected={isValidDate ? new Date(value) : null}
                              onChange={(date) => {
                                const formattedDate = date
                                  ?.toISOString()
                                  .split("T")[0];
                                field.handleChange(formattedDate);
                              }}
                              onBlur={field.handleBlur}
                              dateFormat="dd/MM/yyyy"
                              placeholderText={t("selectDate")}
                              customInput={<CustomInput />}
                            />
                          );
                        }}
                      </form.Field>
                    </div>
                    <div className="form-group">
                      <label>{t("etd")}</label>
                      <form.Field
                        name="ETD"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="form-group w-full">
                      <label>{t("arrivalDate")}</label>
                      <form.Field name="Arrival_date">
                        {(field) => {
                          const value = field.state.value;
                          const isValidDate =
                            value && !isNaN(Date.parse(value));

                          return (
                            <DatePicker
                              selected={isValidDate ? new Date(value) : null}
                              onChange={(date) => {
                                const formattedDate = date
                                  ?.toISOString()
                                  .split("T")[0];
                                field.handleChange(formattedDate);
                              }}
                              onBlur={field.handleBlur}
                              dateFormat="dd/MM/yyyy"
                              placeholderText={t("selectDate")}
                              customInput={<CustomInput />}
                            />
                          );
                        }}
                      </form.Field>
                    </div>
                    <div className="form-group">
                      <label>{t("eta")}</label>
                      <form.Field
                        name="ETA"
                        children={(field) => (
                          <input
                            type="time"
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer justify-center">
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded"
                  >
                    {t("save")}
                  </button>
                </div>
              </form>
            </form.Provider>
          </div>
        </div>
      )}
    </>
  );
};
