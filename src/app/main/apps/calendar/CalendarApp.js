import { styled, useTheme } from "@mui/material/styles";
import withReducer from "app/store/withReducer";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FusePageSimple from "@fuse/core/FusePageSimple";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import CalendarHeader from "./CalendarHeader";
import EventDialog from "./dialogs/event/EventDialog";
import { useNavigate } from "react-router-dom";
import reducer from "./store";
import {
  getEvents,
  openEditEventDialog,
  openNewEventDialog,
  selectFilteredEvents,
  updateEvent,
} from "./store/eventsSlice";
import { getLabels, selectLabels } from "./store/labelsSlice";
import LabelsDialog from "./dialogs/labels/LabelsDialog";
import CalendarAppSidebar from "./CalendarAppSidebar";
import CalendarAppEventContent from "./CalendarAppEventContent";
import { selectUser } from "app/store/userSlice";
import { setupKey } from "src/configurationKeys";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& a": {
    color: `${theme.palette.text.primary}!important`,
    textDecoration: "none!important",
  },
  "&  .fc-media-screen": {
    minHeight: "100%",
    width: "100%",
  },
  "& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th": {
    borderColor: `${theme.palette.divider}!important`,
  },
  "&  .fc-scrollgrid-section > td": {
    border: 0,
  },
  "& .fc-daygrid-day": {
    "&:last-child": {
      borderRight: 0,
    },
  },
  "& .fc-col-header-cell": {
    borderWidth: "0 1px 0 1px",
    padding: "8px 0 0 0",
    "& .fc-col-header-cell-cushion": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      textTransform: "uppercase",
    },
  },
  "& .fc-view ": {
    "& > .fc-scrollgrid": {
      border: 0,
    },
  },
  "& .fc-daygrid-day.fc-day-today": {
    backgroundColor: "transparent!important",
    "& .fc-daygrid-day-number": {
      borderRadius: "100%",
      backgroundColor: `${theme.palette.secondary.main}!important`,
      color: `${theme.palette.secondary.contrastText}!important`,
    },
  },
  "& .fc-daygrid-day-top": {
    justifyContent: "center",

    "& .fc-daygrid-day-number": {
      color: theme.palette.text.secondary,
      fontWeight: 500,
      fontSize: 12,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      margin: "4px 0",
      borderRadius: "50%",
      float: "none",
      lineHeight: 1,
    },
  },
  "& .fc-h-event": {
    background: "initial",
  },
  "& .fc-event": {
    border: 0,
    padding: "0 ",
    fontSize: 12,
    margin: "0 6px 4px 6px!important",
  },
}));

function CalendarApp(props) {
  const [currentDate, setCurrentDate] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const dispatch = useDispatch();
  const events = useSelector(selectFilteredEvents);

  const calendarRef = useRef();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [userAllData, setUserAllData] = useState({});
  const [idToFilterAppointment, setIdToFilterAppointments] =
    useState("All Appointments");
  const theme = useTheme();
  const labels = useSelector(selectLabels);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.organizations?.length === 0) {
      navigate("/projects/new");
    }
    dispatch(getEvents());
    dispatch(getLabels());
    async function getAllData() {
      const accessToken = window.localStorage.getItem("jwt_access_token");
      const requestBody = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      var res = await fetch(
        `${setupKey}${user?.selectedOrganization?.id}/userInformation`,
        requestBody
      ).then((data) => data.json());

      setUserAllData({ ...res });
    }
    getAllData();
  }, [dispatch]);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    setTimeout(() => {
      calendarRef.current?.getApi()?.updateSize();
    }, 300);
  }, [leftSidebarOpen]);

  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;
    dispatch(openNewEventDialog(selectInfo));
  };

  const handleEventDrop = (eventDropInfo) => {
    const { id, title, allDay, start, end, extendedProps } =
      eventDropInfo.event;
    dispatch(
      updateEvent({
        id,
        title,
        allDay,
        start,
        end,
        extendedProps,
      })
    );
  };
  const handleEventClick = (clickInfo) => {
    dispatch(openEditEventDialog(clickInfo));
  };

  const handleDates = (rangeInfo) => {
    setCurrentDate(rangeInfo);
  };

  const handleEventAdd = (addInfo) => { };

  const handleEventChange = (changeInfo) => { };

  const handleEventRemove = (removeInfo) => { };

  function handleToggleLeftSidebar() {
    setLeftSidebarOpen(!leftSidebarOpen);
  }

  useEffect(() => {
    if (idToFilterAppointment !== "All Appointments") {
      if (idToFilterAppointment.user_roles) {
        console.log(events)
        const fiterEvents = events.filter(
          (item) => item.extendedProps.provider_id === idToFilterAppointment.id
        );
        setFilteredEvents([...fiterEvents]);
      } else {
        const fiterEvents = events.filter(
          (item) => item.extendedProps.service_id === idToFilterAppointment.id
        );
        setFilteredEvents([...fiterEvents]);
      }
    } else {
      console.log(events)
      setFilteredEvents([...events]);
    }
  }, [idToFilterAppointment, events]);

  return (
    <>
      <Root
        header={
          <CalendarHeader
            calendarRef={calendarRef}
            currentDate={currentDate}
            userAllData={userAllData}
            setUserAllData={setUserAllData}
            onToggleLeftSidebar={handleToggleLeftSidebar}
            setIdToFilterAppointments={setIdToFilterAppointments}
            idToFilterAppointment={idToFilterAppointment}
          />
        }
        content={
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="timeGridWeek"
            editable
            selectable
            selectMirror
            dayMaxEvents
            weekends
            datesSet={handleDates}
            select={handleDateSelect}
            idToFilterAppointment={idToFilterAppointment}
            events={filteredEvents}
            eventContent={(eventInfo) => (
              <CalendarAppEventContent eventInfo={eventInfo} />
            )}
            
            eventClick={handleEventClick}
            eventAdd={handleEventAdd}
            eventChange={handleEventChange}
            eventRemove={handleEventRemove}
            eventDrop={handleEventDrop}
            initialDate={new Date()}
            ref={calendarRef}
          />
        }
        scroll="content"
      />
      <EventDialog userAllData={userAllData} setUserAllData={setUserAllData} />
      <LabelsDialog idToFilterAppointment={idToFilterAppointment} />
    </>
  );
}

export default withReducer("calendarApp", reducer)(CalendarApp);
