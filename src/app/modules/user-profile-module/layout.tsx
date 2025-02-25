import React from "react";
import Tab from "./component/tab";
import Profile from "./sub-module/profile";
import { useAuth0 } from "@auth0/auth0-react";
import { bigAvicss, layoutcss } from "./style";
import { Box, Container, Grid } from "@material-ui/core";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { LogOutIcon, RightIcon } from "./component/icons";
import LogOutDialog from "app/components/Dialogs/logOutDialog";
import Billing from "app/modules/user-profile-module/sub-module/billing";
import HomeFooter from "app/modules/home-module/components/Footer";

export default function UserProfileLayout() {
  const { user } = useAuth0();
  const history = useHistory();

  const [logoutModalDisplay, setLogoutModalDisplay] =
    React.useState<boolean>(false);
  const { tab: activeTab } = useParams<{ tab: string }>();

  const tabList = [
    {
      title: "profile",
      component: (active: boolean) => <RightIcon active={active} />,
      testId: "",
    },
    {
      title: "billing",
      component: (active: boolean) => <RightIcon active={active} />,
      testId: "",
    },
    {
      title: "Sign Out",
      component: (active: boolean) => <LogOutIcon active={active} />,
      testId: "sign-out-btn",
    },
  ];

  const handleTabClick = (index: number, title: string) => {
    if (title === "Sign Out") {
      setLogoutModalDisplay(true);
    } else {
      history.push(`/user-management/${title}`);
    }
  };

  return (
    <div css={layoutcss}>
      <Container maxWidth="lg">
        <div
          css={`
            height: 56px;
          `}
        />
        <div
          css={`
            display: flex;
            gap: 120px;
            @media (max-width: 960px) {
              flex-direction: column;
              gap: 72px;
            }
            @media (max-width: 600px) {
              gap: 40px;
            }
          `}
        >
          <div
            css={`
              @media (max-width: 960px) {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
            `}
          >
            <Box height={20} />
            <div css={bigAvicss}>
              <p>
                {user?.given_name?.slice(0, 1)}
                {user?.family_name?.slice(0, 1)}
              </p>
            </div>
            <Box height={64} />
            <div
              css={`
                @media (max-width: 960px) {
                  width: 100%;
                }
              `}
            >
              {tabList.map((tab, index) => (
                <div key={tab.title} data-cy={tab.testId}>
                  <Tab
                    title={tab.title}
                    active={tab.title === activeTab}
                    handleClick={() => handleTabClick(index, tab.title)}
                    component={() => tab.component(tab.title === activeTab)}
                    disabled={false}
                  />
                  <Box height={10} />
                </div>
              ))}
            </div>
          </div>
          <div
            css={`
              flex: 1;
            `}
          >
            <Switch>
              <Route path="/user-management/profile">
                <Profile />
              </Route>
              <Route path="/user-management/billing">
                <Billing />
              </Route>
            </Switch>
          </div>
        </div>
        <LogOutDialog
          modalDisplay={logoutModalDisplay}
          setModalDisplay={setLogoutModalDisplay}
        />
        <div
          css={`
            height: 56px;
          `}
        />
      </Container>

      <HomeFooter mini />
    </div>
  );
}
