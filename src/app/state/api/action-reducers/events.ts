import axios from "axios";

export interface GoogleEvent {
  kind: string;
  etag: string;
  id: string;
  status: "confirmed";
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  creator: {
    email: string;
  };
  organizer: {
    email: string;
    displayName: string;
    self: boolean;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
  }>;
  iCalUID: string;
  sequence: number;
  hangoutLink: string;
  conferenceData?: {
    entryPoints: Array<{
      entryPointType: string;
      uri: string;
      label?: string;
      pin?: string;
      regionCode?: string;
    }>;
    conferenceSolution: {
      key: {
        type: string;
      };
      name: string;
      iconUri: string;
    };
    conferenceId: string;
  };
  reminders: {
    useDefault: boolean;
  };
  eventType: string;
}

export const getWebinarEvents = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/webinar-events`
    );

    return (response.data || []) as GoogleEvent[];
  } catch (error) {
    console.error("Failed to fetch webinar events:", error);
    throw error;
  }
};

export interface Attendee {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  jobTitle?: string;
  experienceLevel?: string;
  addToNewsletter?: boolean;
}

export const addAttendeeToEvent = async (
  eventId: string,
  attendee: Attendee
) => {
  try {
    const response = await axios.post<{ message?: string; error?: string }>(
      `${process.env.REACT_APP_API}/webinar-events/${eventId}/attendees`,
      {
        ...attendee,
      }
    );

    if (response.data.error) {
      console.error("Failed to add attendee to event:", response.data.error);
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (error) {
    console.error("Failed to add attendee to event:", error);
    throw error;
  }
};
