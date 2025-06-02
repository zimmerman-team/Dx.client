import { PrimaryButton } from "app/components/Styled/button";
import { ReactComponent as Logo } from "app/modules/home-module/assets/logo.svg";
import { ReactComponent as RightArrow } from "app/modules/home-module/assets/right-arr.svg";
import DashboardCarousel from "./carousel";
import { Container } from "@material-ui/core";
import { DESKTOP_BREAKPOINT, MOBILE_BREAKPOINT } from "app/theme";
import { useHistory } from "react-router-dom";

export default function Card() {
  const history = useHistory();
  return (
    <Container maxWidth="lg">
      <div
        css={`
          background: transparent;
          display: flex;
          gap: 40px;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 100px 0;
          > div:nth-of-type(1) {
            width: 56%;
            h2 {
              color: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 48px;
              margin: 0;
              line-height: 100%;
              span {
                background: linear-gradient(90deg, #231d2c, #6061e5);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                height: fit-content;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              }
              svg {
                height: 32px;
              }
            }
            p {
              color: #231d2c;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 18px;
              line-height: 24px;
              margin: 0;
            }
          }
          > div:nth-of-type(2) {
            width: 44%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
          }
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            flex-direction: column-reverse;
            padding: 50px 0;

            > div:nth-of-type(1) {
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              h2 {
                font-size: 32px;
                svg {
                  height: 23px;
                  width: fit-content;
                }
              }
            }
            > div:nth-of-type(2) {
              width: 100%;
              svg {
                height: 335px;
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  height: 209px;
                }
              }
            }
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 40px 0;
          }
        `}
      >
        <div>
          <h2>
            Meet <Logo />, all-in-one workspace for{" "}
            <span>data storytelling</span>{" "}
          </h2>
          <div
            css={`
              height: 30px;
            `}
          />
          <p>
            DataXplorer aims to help governments, nonprofits, and communities
            work with data in a single place. Upload datasets, create
            visualisations, and share insights without needing extra tools or
            technical expertise. No more patchwork solutions. Just a single,
            open-source platform that fits your workflow and scales with your
            mission.
          </p>
          <div
            css={`
              height: 30px;
            `}
          />
          <p>
            Currently in Beta – try it out now for free and help shape what
            comes next. Your feedback will influence the next steps.
          </p>
          <div
            css={`
              display: flex;
              gap: 20px;
              margin-top: 16px;
              align-items: center;
              width: 100%;
              justify-content: flex-start;
              button {
                height: 41px;
                gap: 28px;
              }
            `}
          >
            <PrimaryButton
              bg="light"
              size="small"
              onClick={() => history.push("/about")}
            >
              Learn More
            </PrimaryButton>
            <PrimaryButton
              bg="light"
              size="small"
              onClick={() => history.push("/onboarding/signin")}
            >
              Sign in to try
              <RightArrow />
            </PrimaryButton>
          </div>
        </div>

        <div>
          <DashboardCarousel />
        </div>
      </div>
    </Container>
  );
}
