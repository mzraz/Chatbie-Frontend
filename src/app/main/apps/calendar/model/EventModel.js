import _ from "@lodash";

const EventModel = (data) =>
  _.defaults(data || {}, {
    title: "",
    allDay: false,
    start: new Date(),
    end: new Date(),
    extendedProps: {
      desc: "",
      label: "",
      customer_id: "",
      provider_id: "",
      service_id: "",
    },
  });

export default EventModel;
