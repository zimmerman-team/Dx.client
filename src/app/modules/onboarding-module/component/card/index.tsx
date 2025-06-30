import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { socialAuth } from "app/utils/socialAuth";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { socialloginbuttoncss, termsOfServiceCss } from "./style";
import { ReactComponent as GoogleIcon } from "app/modules/home-module/components/SignInButtons/assets/google-icon.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/home-module/components/SignInButtons/assets/linkedin-icon.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/home-module/components/SignInButtons/assets/microsoft-icon.svg";
import { useLocation } from "react-router-dom";

export default function AuthCard(props: { isSignIn?: boolean }) {
  const [checked, setChecked] = React.useState(true);
  const location = useLocation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const storeSignUpState = () => {
    localStorage.setItem("signup-state", "true");
  };

  return (
    <div
      css={`
        display: flex;
        color: #231d2c;
        padding-top: 50px;
        align-items: center;
        flex-direction: column;
        justify-content: center;

        > button {
          opacity: ${checked ? "1" : "0.5"};
          pointer-events: ${checked ? "auto" : "none"};
        }
      `}
    >
      <button
        type="button"
        css={socialloginbuttoncss}
        disabled={!checked}
        onClick={() => {
          if (props.isSignIn) {
            socialAuth("google-oauth2", undefined, location.search);
          } else {
            storeSignUpState();
            socialAuth("google-oauth2", undefined, location.search);
          }
        }}
      >
        <GoogleIcon /> {props.isSignIn ? "Sign in" : "Sign up"} with Google
      </button>
      <button
        type="button"
        css={socialloginbuttoncss}
        disabled={!checked}
        onClick={() => {
          if (props.isSignIn) {
            socialAuth("linkedin", undefined, location.search);
          } else {
            storeSignUpState();
            socialAuth("linkedin", undefined, location.search);
          }
        }}
      >
        <LinkedInIcon />
        {props.isSignIn ? "Sign in" : "Sign up"} with LinkedIn
      </button>
      <button
        type="button"
        css={socialloginbuttoncss}
        disabled={!checked}
        onClick={() => {
          if (props.isSignIn) {
            socialAuth("windowslive", undefined, location.search);
          } else {
            storeSignUpState();
            socialAuth("windowslive", undefined, location.search);
          }
        }}
      >
        <MicrosoftIcon />
        {props.isSignIn ? "Sign in" : "Sign up"} with Microsoft
      </button>
      {props.isSignIn ? null : (
        <FormControlLabel
          control={
            <Checkbox
              name="tna"
              color="default"
              checked={checked}
              onChange={handleChange}
            />
          }
          label={
            <p
              css={`
                color: #231d2c;
                font-size: 12px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              `}
            >
              I agree with Dataxplorer's{" "}
              <a
                href="/"
                target="_blank"
                rel="noreferrer noopener"
                css={`
                  color: #231d2c;
                `}
              >
                terms of services and privacy policy
              </a>
            </p>
          }
          css={termsOfServiceCss}
        />
      )}
    </div>
  );
}
