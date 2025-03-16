import React, { useEffect } from "react";
import {
  avicss,
  flexContainercss,
  inputcss,
  profilecss,
} from "app/modules/user-profile-module/style";
import { useTitle } from "react-use";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useStoreState } from "app/state/store/hooks";
import { ReactComponent as GoogleIcon } from "app/modules/onboarding-module/asset/google-img.svg";
import { ReactComponent as LinkedInIcon } from "app/modules/onboarding-module/asset/linkedIn-img.svg";
import { ReactComponent as MicrosoftIcon } from "app/modules/onboarding-module/asset/microsoft-img.svg";
import { InfoIcon } from "app/modules/user-profile-module/component/icons";
import DeleteAccountDialog from "app/components/Dialogs/deleteAccountDialog";
import { PrimaryButton } from "app/components/Styled/button";
import useProfileSettings from "./settings-hook";
import { PageLoader } from "app/modules/common/page-loader";

interface State {
  password: string;
  showPassword: boolean;
}

export default function Profile() {
  useTitle("Dataxplorer - User Profile");
  const { user, getAccessTokenSilently } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);

  const [loading, setLoading] = React.useState(false);

  const [values, setValues] = React.useState({
    name: user?.name || `${user?.given_name} ${user?.family_name}`,
  });

  const [hasNameChanged, setHasNameChanged] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (
      values.name !== (user?.name || `${user?.given_name} ${user?.family_name}`)
    ) {
      setHasNameChanged(true);
    } else {
      setHasNameChanged(false);
    }
  }, [values]);

  const {
    modalDisplay,
    setModalDisplay,
    handleDelete,
    enableButton,
    handleInputChange,
  } = useProfileSettings();

  const authObj = React.useMemo(() => {
    if (user?.sub?.includes("google")) {
      return {
        type: "google",
        icon: <GoogleIcon />,
        name: "Google",
      };
    } else if (user?.sub?.includes("windows")) {
      return {
        type: "windows",
        icon: <MicrosoftIcon />,
        name: "Microsoft",
      };
    } else if (user?.sub?.includes("linkedin")) {
      return {
        type: "linkedin",
        icon: <LinkedInIcon />,
        name: "LinkedIn",
      };
    } else {
      return null;
    }
  }, [user]);

  const updateUserProfile = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/users/update-profile`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.error) {
      } else {
        getAccessTokenSilently().then(() => {
          if (user) {
            user["name"] = response.data.name;
            setHasNameChanged(false);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handleSubmit = async (
    event:
      | React.FormEvent<HTMLFormElement>
      | React.FocusEventHandler<HTMLInputElement>
  ) => {
    if ("preventDefault" in event) {
      event.preventDefault();
    }
    updateUserProfile();
  };
  const handleSave = () => {
    updateUserProfile();
  };

  return (
    <div
      css={`
        width: 100%;
        height: calc(100vh - 162px - 64px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        @media (max-width: 1024px) {
          height: max-content;
          gap: 72px;
        }
      `}
    >
      {loading && <PageLoader />}
      <div css={profilecss}>
        <h4>Profile</h4>
        <form onSubmit={handleSubmit}>
          <div css={flexContainercss}>
            <p>Name</p>
            <input
              type="text"
              name="name"
              css={inputcss}
              onChange={handleChange}
              value={values.name}
            />
          </div>
          <div css={flexContainercss}>
            <p>Email</p>

            <input
              type="text"
              name="email"
              css={inputcss}
              value={user?.email}
              disabled
            />
          </div>
          {authObj && (
            <div
              css={`
                width: 320px;
                margin-left: auto;
                margin-top: -16px;
                margin-bottom: 24px;
                @media (max-width: 600px) {
                  margin-left: 0;
                  width: 100%;
                }
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 12px;
                  line-height: normal;
                `}
              >
                {authObj.icon}
                Signed in with {authObj.name}
              </div>
              <div
                css={`
                  margin-top: 8px;
                  border-radius: 16px;
                  background: #dadaf8;
                  padding: 16px;
                `}
              >
                <div
                  css={`
                    display: flex;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 12px;
                    gap: 8px;
                    align-items: center;
                    line-height: normal;
                  `}
                >
                  <InfoIcon width={14} height={14} />
                  Connected account
                </div>
                <span
                  css={`
                    font-size: 12px;
                    line-height: normal;
                    color: #231d2c;
                    margin: 0;
                    margin-top: 8px;
                  `}
                >
                  Your account is connected to a {authObj.name} account.
                </span>
              </div>
            </div>
          )}{" "}
          <div
            css={`
              ${flexContainercss}
              margin-bottom: 0;
            `}
          >
            <p>Account</p>
            <div
              css={`
                display: flex;
                gap: 16px;
                align-items: center;
                width: 320px;
                @media (max-width: 600px) {
                  width: 100%;
                }
              `}
            >
              <PrimaryButton
                type="button"
                bg="dark"
                size="big"
                onClick={() => setModalDisplay(true)}
                css={`
                  padding: 12px 24px;
                  height: 35px;
                  font-size: 16px;
                `}
              >
                Delete account
              </PrimaryButton>
            </div>
          </div>
        </form>
        <DeleteAccountDialog
          enableButton={enableButton}
          handleDelete={handleDelete}
          handleInputChange={handleInputChange}
          modalDisplay={modalDisplay}
          setModalDisplay={setModalDisplay}
        />
      </div>

      {hasNameChanged ? (
        <div
          css={`
            margin-left: 620px;
            @media (max-width: 1024px) {
              margin: 0 auto;
            }
          `}
        >
          <PrimaryButton
            type="button"
            bg="dark"
            size="big"
            onClick={handleSave}
            css={`
              padding: 18.5px 24px;
              height: 48px;
              font-size: 16px;
            `}
          >
            Save
          </PrimaryButton>
        </div>
      ) : null}
    </div>
  );
}
