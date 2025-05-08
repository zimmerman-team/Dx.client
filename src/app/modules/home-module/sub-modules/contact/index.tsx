import React from "react";
import { Box, Container, useMediaQuery } from "@material-ui/core";
import HomeFooter from "app/modules/home-module/components/Footer";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useTitle } from "react-use";
import { PageLoader } from "app/modules/common/page-loader";
import { APPLICATION_JSON } from "app/state/api";
import { PrimaryButton } from "app/components/Styled/button";
import Hero from "app/modules/home-module/components/hero";
import SignInButtons from "app/modules/home-module/components/SignInButtons";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import InputField, { TextField } from "./components/input";
import { ReactComponent as SuccessIcon } from "./assets/success-icon.svg";
import TryUsBlock from "app/modules/home-module/components/TryUsBlock";
import { ChevronRight } from "@material-ui/icons";
import { MOBILE_BREAKPOINT } from "app/theme";

export default function ContactModule() {
  useTitle("Dataxplorer - Contact");

  const { isAuthenticated } = useAuth0();
  const md = useMediaQuery("(max-width: 940px)");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const [contactFormDetails, setContactFormDetails] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    message: "",
  });

  const resetForm = () => {
    setContactFormDetails({
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      message: "",
    });
  };
  const [_contactFormFailed, setContactFormFailed] = React.useState(false);

  const handleContactFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setContactFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContactFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(
        `${process.env.REACT_APP_API}/users/send-contact-form-to-intercom`,
        contactFormDetails,
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
          },
        }
      )
      .then((response: AxiosResponse) => {
        setLoading(false);
        if (response.status === 200) {
          if (response.data.error) {
            return setContactFormFailed(true);
          }
          setMessage(response.data.message);
          setIsSubscribed(true);
          resetForm();
        } else {
          setContactFormFailed(true);
        }
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        console.log(error);
        setContactFormFailed(true);
      });
  };
  return (
    <>
      {loading && <PageLoader />}
      <div
        css={`
          margin-top: 50px;
          min-height: calc(100vh - 50px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        `}
      >
        <Hero title="Contact Us">
          {isAuthenticated ? (
            <div>
              <p>
                Questions, inquiries, feedback, or future requests. — Have
                something to share? We're listening.
              </p>
              <Box height={"40px"} />
              <div
                css={`
                  display: flex;
                  column-gap: 24px;
                  row-gap: 8px;
                  justify-content: center;
                  align-items: center;
                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                    flex-direction: column;
                  }
                `}
              >
                <Link
                  to="/"
                  data-cy="empower-block-explore-stories-link"
                  css={`
                    text-decoration: none;
                  `}
                >
                  <PrimaryButton
                    css={`
                      height: 48px;
                      @media (max-width: ${MOBILE_BREAKPOINT}) {
                        width: 194px;
                        height: 41px;
                      }
                    `}
                    size="big"
                    bg="light"
                    type="button"
                  >
                    Explore the Dashboard
                  </PrimaryButton>
                </Link>
                <Link
                  to="/contact"
                  css={`
                    text-decoration: none;
                  `}
                >
                  <PrimaryButton
                    css={`
                      height: 48px;
                      width: 141px;
                      @media (max-width: ${MOBILE_BREAKPOINT}) {
                        width: 194px;
                        height: 41px;
                      }
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                    `}
                    size="big"
                    bg="light"
                    type="button"
                  >
                    Email Us
                    <ChevronRight
                      css={`
                        margin-right: -12px;
                      `}
                    />
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p>
                Questions, inquiries, feedback, or future requests. — Have
                something to share? We're listening.
                <br />
                Sign in to get the most out of <InlineLogo /> and keep things
                connected.
              </p>
              <Box height={"40px"} />
              <SignInButtons />
            </div>
          )}
        </Hero>
        <div
          css={`
            background: #ffffff;
            padding: 80px 0;
            @media (max-width: 1439px) {
              padding: 60px 0;
            }
            @media (max-width: 743px) {
              padding: 50px 0;
            }
          `}
        >
          <Container maxWidth="lg">
            <div
              css={`
                display: flex;
                flex-direction: row;
                gap: 50px;
                @media (max-width: 1439px) {
                  flex-direction: column;
                  gap: 30px;
                }
              `}
            >
              <div
                css={`
                  flex: 1;
                  display: flex;
                  flex-direction: column;
                  gap: 30px;
                  p {
                    font-size: 18px;
                    font-style: normal;
                    font-weight: 325;
                    line-height: 24px;
                    margin: 0;
                  }
                  @media (max-width: 743px) {
                    gap: 20px;
                    p {
                      font-size: 14px;
                      line-height: 20px;
                    }
                  }
                `}
              >
                <h4
                  css={`
                    font-size: 48px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: normal;
                    color: #231d2c;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    margin: 0;
                  `}
                >
                  Send Us a Message
                </h4>
                <p>
                  We like to get out and know about you to see our clients –
                  we're more than happy to sit down and discuss a project. If
                  you'd like to meet up, talk through a project, feel free to
                  get in touch.
                </p>

                <p>Fill in the details and our team will get back to you.</p>
              </div>
              {isSubscribed ? (
                <div
                  css={`
                    width: 682px;
                    border-radius: 10px;
                    background: #f2f7fd;
                    box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
                    padding: 50px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    @media (max-width: 1439px) {
                      width: 100%;
                    }
                  `}
                >
                  <SuccessIcon />
                  <p
                    css={`
                      font-size: 18px;
                      font-style: normal;
                      font-weight: 325;
                      line-height: 24px;
                      margin: 0;
                      margin-top: 20px;
                    `}
                  >
                    Message successfully sent.
                  </p>
                  <PrimaryButton
                    type="submit"
                    size="big"
                    bg="light"
                    css={`
                      margin-top: 10px;
                      height: 41px;
                      padding: 10px 16px;
                      @media (max-width: 744px) {
                        height: 48px;
                      }
                      @media (max-width: 425px) {
                        width: max-content;
                      }
                    `}
                    onClick={() => {
                      setIsSubscribed(false);
                      resetForm();
                    }}
                  >
                    Send Another Message
                  </PrimaryButton>
                </div>
              ) : (
                <form
                  onSubmit={handleContactFormSubmit}
                  css={`
                    width: 682px;
                    padding: 20px;
                    border-radius: 10px;
                    background: #f2f7fd;
                    box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                    @media (max-width: 1439px) {
                      width: 100%;
                    }
                  `}
                >
                  <InputField
                    id="email-input"
                    label="E-mail"
                    placeholder="Enter your email"
                    required
                    name="email"
                    type="email"
                    onChange={handleContactFormChange}
                    value={contactFormDetails.email}
                    maxLength={100}
                  />
                  <InputField
                    id="first-name-input"
                    label="First Name"
                    placeholder="Enter your first name"
                    name="firstName"
                    value={contactFormDetails.firstName}
                    onChange={handleContactFormChange}
                    required
                    maxLength={100}
                  />
                  <InputField
                    id="last-name-input"
                    label="Last Name"
                    placeholder="Enter your last name"
                    name="lastName"
                    value={contactFormDetails.lastName}
                    onChange={handleContactFormChange}
                    required
                    maxLength={100}
                  />

                  <TextField
                    id="message-input"
                    label="Message"
                    placeholder="Enter your message"
                    name="message"
                    value={contactFormDetails.message}
                    onChange={handleContactFormChange}
                    maxLength={300}
                  />

                  <div
                    css={`
                      width: 100%;
                      @media (max-width: 600px) {
                        button {
                          font-size: 16px;
                        }
                      }
                    `}
                  >
                    <PrimaryButton
                      type="submit"
                      size="big"
                      bg="light"
                      css={`
                        height: 41px;
                        padding: 10px 16px;
                        @media (max-width: 744px) {
                          height: 48px;
                        }
                        @media (max-width: 425px) {
                          width: max-content;
                        }
                      `}
                    >
                      Send Message
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </div>
          </Container>{" "}
        </div>

        <div
          css={`
            background: #f2f7fd;
            padding: 80px 0;
            @media (max-width: 1439px) {
              padding: 60px 0;
            }
            @media (max-width: 743px) {
              padding: 50px 0;
            }
          `}
        >
          <Container maxWidth="lg">
            <div
              css={`
                display: flex;
                flex-direction: column;
                gap: 80px;
              `}
            >
              <div
                css={`
                  display: flex;
                  gap: 50px;
                  @media (max-width: 1439px) {
                    flex-direction: column-reverse;
                  }
                  @media (max-width: 743px) {
                    gap: 30px;
                  }
                `}
              >
                <div>
                  <iframe
                    css={`
                      border-radius: 10px;
                      border: 1px solid #6061e5;
                      width: 500px;
                      height: 400px;
                      @media (max-width: 1439px) {
                        width: 100%;
                        height: 544px;
                      }
                      @media (max-width: 743px) {
                        height: 262px;
                      }
                    `}
                    title="address"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=4.884522557258606%2C52.364800565927666%2C4.888063073158265%2C52.366279512578515&layer=mapnik&marker=52.3655399,4.8866280"
                  ></iframe>
                </div>
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                    p {
                      font-size: 18px;
                      font-style: normal;
                      font-weight: 325;
                      line-height: 24px;
                      margin: 0;
                      color: #231d2c;
                      font-family: "GothamNarrow-Book", sans-serif;
                    }
                  `}
                >
                  <div
                    css={`
                      display: flex;
                      align-items: center;
                      gap: 18px;
                      flex-wrap: wrap;
                    `}
                  >
                    <InlineLogo
                      width={"309px"}
                      height={"50px"}
                      css={`
                        flex-shrink: 0;
                      `}
                    />
                    <h3
                      css={`
                        font-size: 48px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: normal;
                        color: #231d2c;
                        font-family: "GothamNarrow-Bold", sans-serif;
                        margin: 0;
                      `}
                    >
                      Headquarters
                    </h3>
                  </div>
                  <p>Feel free to contact us for any question you may have</p>

                  <p>
                    Zimmerman B.V. <br />
                    Keizersgracht 520
                    <br />
                    1017 EK Amsterdam
                    <br />
                    The Netherlands
                  </p>

                  <p>
                    Tel: +3120 213 4466
                    <br />
                    info@zimmerman.team
                  </p>
                </div>
              </div>

              <TryUsBlock
                title="Give Dataxplorer a try, on us"
                subtitle="Dataxplorer turns data into impact in minutes"
                signInWith
              />
            </div>
          </Container>
        </div>
      </div>
      <HomeFooter />
    </>
  );
}
