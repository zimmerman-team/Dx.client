import {
  addAttendeeToEvent,
  Attendee,
  getWebinarEvents,
  GoogleEvent,
} from "@app/state/api/action-reducers/events";
import React, { useEffect } from "react";

export const useGetEvents = () => {
  const [loading, setLoading] = React.useState(true);
  const [events, setEvents] = React.useState<GoogleEvent[]>([]);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await getWebinarEvents();
      setEvents(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { loading, events, refetch };
};

export const useAddAttendee = () => {
  const [loading, setLoading] = React.useState(false);

  const addAttendee = async (eventId: string, attendee: Attendee) => {
    setLoading(true);
    try {
      const response = await addAttendeeToEvent(eventId, attendee);
      setLoading(false);
      return response;
    } catch (err) {
      console.error("Error adding attendee:", err);
      setLoading(false);
      return { error: "Failed to add attendee" };
    }
  };

  return { loading, addAttendee };
};
