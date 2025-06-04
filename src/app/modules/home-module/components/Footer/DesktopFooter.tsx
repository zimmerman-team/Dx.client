import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { homeFootercss } from "app/modules/home-module/components/Footer/style";
import { ReactComponent as CopyIcon } from "app/modules/home-module/components/Footer/asset/copy.svg";
import { ReactComponent as LogoIcon } from "app/modules/home-module/components/Footer/asset/logo.svg";
import { Link } from "react-router-dom";
import NewsletterForm from "app/modules/common/newsletterForm";
import { FieldErrors } from "react-hook-form";
import moment from "moment";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { useMediaQuery } from "usehooks-ts";
import {
  PRIVACY_POLICY_LINK,
  TERMS_AND_CONDITION_LINK,
} from "app/modules/chart-module/util/constants/links";

interface Props {
  mini?: boolean;
}

export default function DesktopFooter(props: Props) {
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [isSubscriptionFailed, setIsSubscriptionFailed] = React.useState(false);
  const [formError, setFormError] = React.useState<
    FieldErrors<{
      email: string;
    }>
  >({});
  const mobile = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT})`);
  const tablet = useMediaQuery(`(max-width:${DESKTOP_BREAKPOINT})`);
  return (
    <div css={homeFootercss}>
      <Container
        maxWidth="lg"
        data-cy="home-footer"
        css={`
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            padding: 0 32px !important;
          }

          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 0 16px !important;
          }
        `}
      >
        {props.mini ? null : (
          <div
            css={`
              padding: 24px 0;
              display: flex;
              justify-content: space-between;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                flex-direction: column;
                justify-content: center;
                gap: 24px;
              }
            `}
          >
            <div
              css={`
                display: flex;
                flex-direction: column;
                gap: 40px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  gap: 24px;
                }
              `}
            >
              <p
                data-cy="footer-logo"
                css={`
                  margin: 0;
                  margin-top: 12px;
                `}
              >
                <Link
                  to="/"
                  css={`
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  `}
                >
                  <LogoIcon />
                  <div
                    css={`
                      font-family: "Inter", sans-serif;
                      color: #e75656;
                      font-size: 14.978px;
                      font-weight: 500;
                      line-height: 14.978px;
                      padding: 3.329px 10.922px;
                      border-radius: 20.803px;
                      border: 0.993px solid #e75656;
                    `}
                  >
                    beta
                  </div>
                </Link>
              </p>
              <ul
                css={`
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  color: #000;
                  font-weight: 325;
                  font-family: "GothamNarrow-Medium", sans-serif;
                  @media (max-width: ${DESKTOP_BREAKPOINT}) {
                    flex-direction: row-reverse;
                    justify-content: space-between;
                  }
                  a {
                    text-decoration: none;
                    color: #000;
                  }
                  li {
                    font-size: 14px;
                    p {
                      margin: 0px;
                      line-height: normal;
                    }
                  }
                `}
              >
                <li
                  css={`
                    @media (max-width: ${DESKTOP_BREAKPOINT}) {
                      display: none;
                    }
                  `}
                >
                  Tel: +3185 401 5241
                </li>

                <li
                  css={`
                    @media (max-width: ${MOBILE_BREAKPOINT}) {
                      display: none;
                    }
                  `}
                >
                  {" "}
                  <a href="mailto:contact@dataxplorer.org">
                    Email: contact@dataxplorer.org
                  </a>{" "}
                </li>

                <li
                  css={`
                    display: none;
                    @media (max-width: ${DESKTOP_BREAKPOINT}) {
                      display: block;
                    }
                  `}
                >
                  Tel: +3185 401 5241
                  <a
                    css={`
                      display: none;
                      @media (max-width: ${MOBILE_BREAKPOINT}) {
                        display: block;
                      }
                    `}
                    href="mailto:contact@dataxplorer.org"
                  >
                    Email: contact@dataxplorer.org
                  </a>{" "}
                </li>
                <li>
                  <p>
                    Keizersgracht 520H
                    {mobile ? <br /> : tablet ? ", " : <br />}
                    1017 EK Amsterdam <br /> The Netherlands
                  </p>
                </li>
              </ul>
            </div>

            <div
              css={`
                display: none;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  display: block;
                  border-bottom: 1px solid #dadaf8;
                }
              `}
            />
            <div>
              <ul
                css={`
                  display: none;
                  @media (max-width: ${DESKTOP_BREAKPOINT}) {
                    display: grid;
                    grid-template-columns: 40% 60%;
                    gap: 16px;
                    margin: 0;
                    a {
                      font-size: 16px;
                      text-decoration: none;
                      font-weight: 400;
                      color: #000;
                      font-family: "GothamNarrow-Bold", sans-serif;
                    }
                  }
                `}
              >
                <li>
                  <Link to="/">Dashboard</Link>{" "}
                </li>
                <li>
                  <Link to="/about">Who We Are</Link>
                </li>

                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link
                    to="/why-dataxplorer"
                    css={`
                      display: flex;
                      gap: 6px;
                      align-items: center;
                    `}
                  >
                    Why
                    <InlineLogo
                      css={`
                        width: 103px;
                        height: 12px;
                      `}
                    />
                  </Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/partners">Our Partners</Link>
                </li>
              </ul>

              <ul
                css={`
                  display: flex;
                  flex-direction: column;
                  gap: 16px;
                  margin: 0;
                  @media (max-width: ${DESKTOP_BREAKPOINT}) {
                    display: none;
                  }
                  a {
                    font-size: 16px;
                    text-decoration: none;
                    font-weight: 400;
                    color: #000;
                    font-family: "GothamNarrow-Bold", sans-serif;
                  }
                `}
              >
                <li>
                  <Link to="/">Dashboard</Link>{" "}
                </li>
                <li>
                  <Link to="/about">Who We Are</Link>
                </li>
                <li>
                  <Link
                    to="/why-dataxplorer"
                    css={`
                      display: flex;
                      gap: 6px;
                      align-items: center;
                    `}
                  >
                    Why
                    <InlineLogo
                      css={`
                        width: 103px;
                        height: 12px;
                      `}
                    />
                  </Link>
                </li>

                <li>
                  <Link to="/partners">Our Partners</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>
            <div
              css={`
                display: none;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  display: block;
                  border-bottom: 1px solid #dadaf8;
                }
              `}
            />
            <div
              css={`
                width: 606px;
                @media (max-width: ${DESKTOP_BREAKPOINT}) {
                  width: 100%;
                }
              `}
            >
              <p
                css={`
                  font-size: 16px;
                  font-weight: 400;
                  color: #000;
                  font-family: "GothamNarrow-Bold", sans-serif;
                  margin: 0;
                  margin: 12px 0;
                `}
              >
                Stay Up To Date
              </p>
              {formError.email && (
                <label
                  css={`
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    font-size: 12px;
                    text-align: left;
                    width: 100%;
                    padding-left: 10px;
                    color: #e75656;
                  `}
                >
                  Please enter a valid email address.
                </label>
              )}
              <div
                css={`
                  width: 100%;
                  display: flex;
                  gap: 16px;

                  input {
                    outline: none;
                    border: none;
                    border-radius: 10px;
                    flex: 1;
                    font-size: 16px;
                    padding: 11px 16px;
                    border-bottom: 1px solid #98a1aa;
                    background: #f1f3f5;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    font-weight: 325;
                    ::placeholder {
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      font-weight: 325;
                      color: #98a1aa;
                    }
                  }
                  button {
                    border: none;
                    outline: none;
                    border-radius: 10px;
                    background: #6061e5;
                    color: #fff;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 16px;
                    height: 41px;
                    padding: 10px 16px;
                    font-weight: 400;
                    cursor: pointer;
                  }
                `}
              >
                <NewsletterForm
                  setIsSubscribed={setIsSubscribed}
                  setIsSubscriptionFailed={setIsSubscriptionFailed}
                  setFormError={setFormError}
                />
              </div>
              <p
                css={`
                  font-size: 14px;
                  line-height: 20px;
                `}
              >
                {isSubscribed
                  ? "Thank you for subscribing!"
                  : isSubscriptionFailed
                  ? "Oops! Something went wrong with the request! Please fill your email again."
                  : "You will receive occasional emails from DataXplorer. You can unsubscribe anytime."}
              </p>
            </div>
          </div>
        )}{" "}
      </Container>
      <div
        css={`
          background: #f2f7fd;
        `}
      >
        <Container
          maxWidth="lg"
          data-cy="home-footer"
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
              display: flex;
              gap: 20px;
              align-items: center;
              font-size: 12px;
              padding: 8px 0;
              line-height: normal;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-weight: 325;
              color: #373d43;
              flex-wrap: wrap;
              @media (max-width: ${MOBILE_BREAKPOINT}) {
                row-gap: 12px;
              }

              a {
                text-decoration: none;
                color: #000;
              }
              p {
                margin: 0;
                padding: 0;
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
              <CopyIcon />
              <p
                css={`
                  display: flex;
                  align-items: center;
                  gap: 4px;
                `}
              >
                {moment(new Date()).format("YYYY")}
                <InlineLogo
                  css={`
                    width: 78.41px;
                    height: 11px;
                  `}
                />
                All Rights Reserved
              </p>
            </div>

            <div
              css={`
                width: 3px;
                height: 3px;
                background: #373d43;
                border-radius: 50%;
              `}
            />
            <p>
              {" "}
              <a
                href={PRIVACY_POLICY_LINK}
                className="privacy-link"
                target="_blank"
                rel="noreferrer"
              >
                Privacy
              </a>{" "}
            </p>
            <p>
              {" "}
              <a
                href={TERMS_AND_CONDITION_LINK}
                className="privacy-link"
                target="_blank"
                rel="noreferrer"
              >
                Terms and conditions
              </a>{" "}
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
