import React from "react";
import { Checkbox, Container, FormControlLabel } from "@material-ui/core";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { CalendarIcon3 } from "app/modules/home-module/sub-modules/webinar/assets/CalendarIcon";
import { ClockIcon2 } from "app/modules/home-module/sub-modules/webinar/assets/ClockIcon";
import InfoIcon from "app/modules/home-module/sub-modules/webinar/assets/InfoIcon";
import InputField from "app/modules/home-module/sub-modules/contact/components/input";
import { PrimaryButton } from "app/components/Styled/button";
import HomeFooter from "app/modules/home-module/components/Footer";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import { useAddAttendee, useGetEvents } from "app/hooks/useEvents";
import moment from "moment";
import CircleLoader from "app/modules/home-module/components/Loader";

const ReserveYourSpot = () => {
  const [data, setData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    jobTitle: "",
    addToNewsletter: false,
  });

  const [selectedEvent, setSelectedEvent] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const { loading, events, refetch } = useGetEvents();
  const { addAttendee, loading: addingAttendee } = useAddAttendee();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (selectedEvent) {
      try {
        const response = await addAttendee(selectedEvent, data);
        if (response?.message) {
          setMessage(response.message);
          setData({
            firstName: "",
            lastName: "",
            email: "",
            company: "",
            jobTitle: "",
            addToNewsletter: false,
          });
          refetch();
        } else if (response?.error) {
          setMessage(`Failed to register. Please try again later.`);
        }
      } catch (error) {
        console.error("Error registering attendee:", error);
        setMessage("Failed to register. Please try again later.");
      }
    }
  };

  return (
    <div
      css={`
        background-color: #f2f7fd;
      `}
    >
      <Container
        maxWidth="lg"
        css={`
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            padding: 0 32px !important;
          }

          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 0 16px !important;
          }
        `}
      >
        <div
          css={`
            padding: 60px 0;
            h2,
            h3 {
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 64px;
              line-height: normal;
              text-align: center;
              margin: 0;
              padding: 0;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                font-size: 48px;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                font-size: 34px;
              }
            }
            h4 {
              font-family: "GothamNarrow-Book", sans-serif;
              font-weight: 325;
              font-size: 18px;
              line-height: 24px;
              text-align: center;
              margin-top: 10px;
              margin-bottom: 0;
              padding: 0;
            }
            h3 {
              font-size: 34px;
              text-align: left;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                padding: 0 32px !important;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                font-size: 24px;
              }
            }
          `}
        >
          <h2>Reserve Your Spot</h2>
          <h4>
            Choose your preferred time and register to join our next webinar
            session.
          </h4>

          <div
            css={`
              display: flex;
              margin-top: 30px;
              gap: 50px;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                flex-direction: column;
                gap: 80px;
                margin-top: 80px;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                gap: 50px;
                margin-top: 50px;
              }
            `}
          >
            <div
              css={`
                width: 480px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  width: 100%;
                }
              `}
            >
              <h3>Select Your Preferred Time</h3>

              {loading ? <CircleLoader /> : null}

              {events.length ? (
                events.map((slot, index) => {
                  const spots = 100 - (slot?.attendees?.length ?? 0);
                  const slotAvailable = spots > 0;
                  return (
                    <div
                      key={index}
                      css={`
                        padding: 20px;
                        border-radius: 5px;
                        border: 0.5px solid
                          ${slotAvailable ? "#3B6CD3" : "#454545"};
                        background-color: ${selectedEvent === slot.id
                          ? "#f3f3fc"
                          : "#ffffff"};
                        display: flex;
                        gap: 50px;

                        :hover {
                          cursor: pointer;
                          background-color: #f3f3fc;
                        }
                        p {
                          font-family: "GothamNarrow-Book", sans-serif;
                          font-weight: 325;
                          font-size: 14px;
                          line-height: 20px;
                          margin: 0;
                          padding: 0;
                        }
                        @media (max-width: ${DESKTOP_BREAKPOINT}) {
                          justify-content: space-between;
                        }
                      `}
                      onClick={() => setSelectedEvent(slot.id)}
                    >
                      <div
                        css={`
                          width: 217px;
                          @media (max-width: ${MOBILE_BREAKPOINT}) {
                            width: max-content;
                          }
                        `}
                      >
                        <div
                          css={`
                            display: flex;
                            gap: 10px;
                            align-items: center;
                          `}
                        >
                          <CalendarIcon3 dark={!slotAvailable} />
                          <p>
                            {moment(new Date(slot.start.dateTime)).format(
                              "dddd, MMMM D, YYYY"
                            )}
                          </p>
                        </div>
                        <div
                          css={`
                            display: flex;
                            gap: 10px;
                            align-items: center;
                            margin-top: 10px;
                          `}
                        >
                          <ClockIcon2 dark={!slotAvailable} />
                          <p>
                            {moment(new Date(slot.start.dateTime)).format(
                              "h:mm A"
                            )}
                          </p>
                        </div>
                      </div>
                      <div>
                        <div
                          css={`
                            background-color: ${slotAvailable
                              ? "#00802C"
                              : "#B6B6B6"};
                            border-radius: 20px;
                            padding: 4px 10px;
                            width: max-content;
                            color: ${slotAvailable ? "#ffffff" : "#454545"};
                          `}
                        >
                          {spots > 0 ? "Available" : "Not Available"}
                        </div>

                        <p
                          css={`
                            margin-top: 10px;
                          `}
                        >
                          {spots > 0
                            ? `${spots} spots left`
                            : "No spots available"}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No available time slots</p>
              )}

              <p
                css={`
                  font-family: "GothamNarrow-Book", sans-serif;
                  font-weight: 325;
                  font-size: 16px;
                  margin: 0;
                  padding: 0;
                  line-height: 24px;
                  text-align: center;
                `}
              >
                Can't make any of these times?
                <br />
                <a href=".">Contact us</a> to suggest alternative scheduling.
              </p>
            </div>

            <div
              css={`
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 20px;
              `}
            >
              <h3>Registration Details</h3>
              {addingAttendee ? (
                <CircleLoader />
              ) : (
                <form
                  css={`
                    width: 100%;
                    border-radius: 5px;
                    border: 0.5px solid #3b6cd3;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 20px;
                    background-color: #ffffff;
                  `}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                >
                  {selectedEvent ? null : (
                    <div
                      css={`
                        border-radius: 10px;
                        background-color: #f3f3fc;
                        padding: 15px;
                        display: flex;
                        gap: 10px;
                        align-items: center;
                      `}
                    >
                      <InfoIcon />
                      <p
                        css={`
                          margin: 0;
                          padding: 0;
                          line-height: normal;
                          text-align: center;
                          font-family: "Inter", sans-serif;
                          font-weight: 400;
                          font-size: 16px;
                        `}
                      >
                        Please select a time slot first
                      </p>
                    </div>
                  )}
                  {message ? (
                    <div>
                      {message}{" "}
                      <span
                        onClick={() => setMessage(null)}
                        css={`
                          color: #6061e5;
                          font-weight: 700;
                          cursor: pointer;
                        `}
                      >
                        Close
                      </span>
                    </div>
                  ) : (
                    <>
                      <div
                        css={`
                          display: grid;
                          grid-template-columns: 1fr 1fr;
                          gap: 10px;
                          @media (max-width: ${MOBILE_BREAKPOINT}) {
                            grid-template-columns: 1fr;
                            gap: 20px;
                          }
                        `}
                      >
                        <InputField
                          id="first-name-input"
                          label="First Name"
                          placeholder="Enter your first name"
                          name="firstName"
                          value={data.firstName}
                          onChange={handleChange}
                          required
                          darkBackground
                        />
                        <InputField
                          id="last-name-input"
                          label="Last Name"
                          placeholder="Enter your last name"
                          name="lastName"
                          value={data.lastName}
                          onChange={handleChange}
                          required
                          darkBackground
                        />
                      </div>
                      <InputField
                        id="email-input"
                        label="Email"
                        placeholder="Enter your email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        required
                        darkBackground
                      />

                      <div
                        css={`
                          display: grid;
                          grid-template-columns: 1fr 1fr;
                          gap: 10px;
                          @media (max-width: ${MOBILE_BREAKPOINT}) {
                            grid-template-columns: 1fr;
                            gap: 20px;
                          }
                        `}
                      >
                        <InputField
                          id="company-input"
                          label="Company"
                          placeholder="Enter your company name"
                          name="company"
                          value={data.company}
                          onChange={handleChange}
                          required
                          darkBackground
                        />
                        <InputField
                          id="job-title-input"
                          label="Job Title"
                          placeholder="Enter your job title"
                          name="jobTitle"
                          value={data.jobTitle}
                          onChange={handleChange}
                          required
                          darkBackground
                        />
                      </div>

                      <FormControlLabel
                        control={
                          <Checkbox
                            name="tna"
                            color="primary"
                            checked={data.addToNewsletter}
                            onChange={(e) => {
                              setData((prevData) => ({
                                ...prevData,
                                addToNewsletter: e.target.checked,
                              }));
                            }}
                          />
                        }
                        label={
                          <p
                            css={`
                              color: #231d2c;
                              font-size: 16px;
                              font-family: "GothamNarrow-Book", "Helvetica Neue",
                                sans-serif;
                              font-weight: 325;
                              padding: 0;
                              margin: 0;
                            `}
                          >
                            Send me updates about future webinars and platform
                            news
                          </p>
                        }
                      />

                      <PrimaryButton
                        type="submit"
                        size="big"
                        bg="light"
                        disabled={!selectedEvent}
                        css={`
                          height: 44px;
                          padding: 10px 16px;
                          width: 100%;
                        `}
                      >
                        Register for Webinar
                      </PrimaryButton>

                      <p
                        css={`
                          font-family: "GothamNarrow-Book", sans-serif;
                          font-weight: 325;
                          font-size: 16px;
                          margin: 0;
                          padding: 0;
                          line-height: 24px;
                          text-align: center;
                        `}
                      >
                        By registering, you agree to receive webinar-related
                        communications. <br /> You can unsubscribe at any time.
                      </p>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
          <div
            css={`
              height: 30px;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                height: 80px;
              }
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                height: 50px;
              }
            `}
          />
          <TryUsBlock
            title="Join the Beta Program"
            subtitle="Sign in with your preferred method to get started.
By signing in, you agree to participate in our beta testing program and provide feedback"
            signInWith
          />
        </div>
      </Container>
      <HomeFooter />
    </div>
  );
};

export default ReserveYourSpot;
