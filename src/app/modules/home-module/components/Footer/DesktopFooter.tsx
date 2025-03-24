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
  return (
    <div css={homeFootercss}>
      <Container maxWidth="lg" data-cy="home-footer">
        {props.mini ? null : (
          <div
            css={`
              border-bottom: 1px solid #d9d9d9;
              padding-top: 27px;
              padding-bottom: 40px;
            `}
          >
            <p
              data-cy="footer-logo"
              css={`
                margin-bottom: 40px;
              `}
            >
              <Link to="/">
                <LogoIcon />
              </Link>
            </p>
            <Grid
              container
              alignContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Grid item lg={3} md={3} sm={2}>
                <ul
                  css={`
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    margin: 0;
                    a {
                      font-size: 16px;
                      @media (max-width: 945px) {
                        font-size: 14px;
                      }
                      text-decoration: none;
                      font-weight: 400;
                      color: #000;
                      font-family: "GothamNarrow-Bold", sans-serif;
                    }
                  `}
                >
                  <li>
                    <Link to="/">Explore</Link>{" "}
                  </li>
                  <li>
                    <Link to="/why-dataxplorer"> Why Dataxplorer</Link>{" "}
                  </li>
                  <li>
                    <Link to="/about">About</Link>
                  </li>
                  <li>
                    <Link to="/partners">Partners</Link>
                  </li>
                  <li>
                    <Link to="/pricing">Pricing</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
              </Grid>
              <Grid
                item
                lg={3}
                md={3}
                sm={4}
                css={`
                  ul {
                    color: #000;
                    font-weight: 325;
                    font-family: "GothamNarrow-Medium", sans-serif;
                    @media (max-width: 945px) {
                      /* padding-left: 40px; */
                    }
                  }
                  a {
                    text-decoration: none;
                    color: #000;
                  }
                  li {
                    font-size: 12px;
                    p {
                      margin: 0px;
                      line-height: normal;
                    }
                  }
                `}
              >
                <ul
                  css={`
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                  `}
                >
                  <li>Tel: +3185 401 5241</li>
                  <li>
                    {" "}
                    <a href="mailto:contact@dataxplorer.org">
                      Email: contact@dataxplorer.org
                    </a>{" "}
                  </li>
                  <li>
                    <p>Keizersgracht 520H</p>

                    <p>1017 EK Amsterdam</p>

                    <p>The Netherlands</p>
                  </li>
                </ul>
              </Grid>

              <Grid item lg={6} md={6} sm={6}>
                <p
                  css={`
                    font-size: 18px;
                    font-weight: 400;
                    color: #000;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    margin: 0;
                    margin-bottom: 16px;
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
                    border-radius: 40px;
                    background: #f7f7f7;
                    /* width: 611px; */
                    width: 100%;
                    height: 47px;
                    display: flex;

                    input {
                      outline: none;
                      border: none;
                      border-radius: 34.5px 0 0 34.5px;
                      flex: 1;
                      font-size: 18px;
                      padding-left: 24px;
                      background: #f7f7f7;
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      font-weight: 325;
                      ::placeholder {
                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif;
                        font-weight: 325;
                        color: #000;
                      }
                    }
                    button {
                      border: none;
                      outline: none;
                      border-radius: 0 34.5px 34.5px 0;
                      background: #231d2c;
                      text-transform: uppercase;
                      color: #fff;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                      font-size: 16px;
                      padding: 0 24px;
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
                    line-height: normal;
                    font-size: 12px;
                    height: 30px;
                  `}
                >
                  {isSubscribed
                    ? "Thank you for subscribing!"
                    : isSubscriptionFailed
                    ? "Oops! Something went wrong with the request! Please fill your email again."
                    : "  You will receive occasional emails from Dataxplorer. You always have choice to unsubscribe within every Email."}
                </p>
              </Grid>
            </Grid>
          </div>
        )}

        <div
          css={`
            display: flex;
            gap: 16px;
            align-items: center;
            font-size: 12px;
            padding: 24px 0;
            line-height: normal;

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
          <p
            css={`
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <CopyIcon />
            {moment(new Date()).format("YYYY")} Dataxplorer All Rights Reserved
          </p>
          <p>
            {" "}
            <a
              href="https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view"
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
              href="https://drive.google.com/file/d/1wgY5HYdE5-redIOF85E5fZZJT_YueOWP/view?usp=sharing"
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
  );
}
