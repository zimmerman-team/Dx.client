// cc:application base#;application routes

// base

import React, { Suspense, lazy } from "react";
import { socialAuth } from "app/utils/socialAuth";
import { useScrollToTop } from "app/hooks/useScrollToTop";
import { useRouteListener } from "app/hooks/useRouteListener";
import { PageLoader } from "app/modules/common/page-loader";
import { RouteWithAppBar } from "app/utils/RouteWithAppBar";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { NoMatchPage } from "app/modules/common/no-match-page";
import { useGoogleOneTapLogin } from "react-google-one-tap-login";
import {
  AppState,
  Auth0Provider,
  User,
  WithAuthenticationRequiredOptions,
  useAuth0,
  withAuthenticationRequired,
} from "@auth0/auth0-react";
import axios from "axios";
import { AuthProtectedRoute } from "./utils/AuthProtectedRoute";
import {
  PaymentSuccessCallbackModule,
  PaymentCanceledCallbackModule,
} from "app/modules/callback-module/payment";
import { useRecoilValue } from "recoil";
import { fetchPlanLoadingAtom } from "./state/recoil/atoms";
import { APPLICATION_JSON } from "./state/api";

const LandingModule = lazy(
  () => import("app/modules/home-module/sub-modules/landing")
);
const HomeModule = lazy(() => import("app/modules/home-module"));
const PartnersModule = lazy(
  () => import("app/modules/home-module/sub-modules/partners")
);
const ContactModule = lazy(
  () => import("app/modules/home-module/sub-modules/contact")
);
const AboutModule = lazy(
  () => import("app/modules/home-module/sub-modules/about")
);
const WhyDXModule = lazy(
  () => import("app/modules/home-module/sub-modules/why-dx")
);

const PricingModule = lazy(
  () => import("app/modules/home-module/sub-modules/pricing")
);
const EmbedChartModule = lazy(
  () => import("app/modules/embed-module/embedChart")
);

const ChartModule = lazy(() => import("app/modules/chart-module"));
const StoryModule = lazy(() => import("app/modules/story-module"));

const AuthCallbackModule = lazy(() => import("app/modules/callback-module"));
const OnboardingModule = lazy(() => import("app/modules/onboarding-module"));
const UserProfileModule = lazy(() => import("app/modules/user-profile-module"));
const DatasetModule = lazy(() => import("app/modules/dataset-module"));
const DashboardModule = lazy(
  () => import("app/modules/home-module/sub-modules/dashboard")
);

const ProtectedRoute = (props: {
  component: React.ComponentType<any>;
  args?: WithAuthenticationRequiredOptions;
}) => {
  const Component = withAuthenticationRequired(props.component, props.args);

  return <Component />;
};

const Auth0ProviderWithRedirectCallback = (props: {
  domain: string;
  clientId: string;
  authorizationParams: {
    audience: string;
    redirect_uri: string;
  };
  children: React.ReactNode;
}) => {
  const history = useHistory();

  const onRedirectCallback = (appState?: AppState, user?: User) => {
    history.push(
      appState && appState.returnTo
        ? appState.returnTo
        : window.location.pathname
    );
  };

  return (
    <Auth0Provider
      cacheLocation={
        process.env.REACT_APP_CYPRESS_TEST === "true"
          ? "localstorage"
          : "memory"
      }
      onRedirectCallback={onRedirectCallback}
      {...props}
    >
      {props.children}
    </Auth0Provider>
  );
};

const PlanLoader = () => {
  const planLoading = useRecoilValue(fetchPlanLoadingAtom);

  if (planLoading) {
    return <PageLoader />;
  }
  return null;
};

const AuthLoader = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div
        css={`
          > div {
            background: #fff;
          }
        `}
      >
        <PageLoader />;
      </div>
    );
  }

  return null;
};

const OneTapLoginComponent = () => {
  const { isLoading, isAuthenticated } = useAuth0();
  const loadRef = React.useRef<HTMLDivElement>(null);

  useGoogleOneTapLogin({
    disabled: isLoading || isAuthenticated,
    onError: (error) => console.log(error),
    onSuccess: (response) => socialAuth("google-oauth2", response.email),
    googleAccountConfigs: {
      client_id: process.env.REACT_APP_GOOGLE_API_CLIENT_ID!,
      cancel_on_tap_outside: false,
      // @ts-ignore
      use_fedcm_for_prompt: true,
    },
  });

  const onBeforeUnload = () => {
    if (loadRef.current) {
      loadRef.current.style.display = "block";
    }
  };

  React.useEffect(() => {
    window.onbeforeunload = onBeforeUnload;
  }, []);

  return (
    <div ref={loadRef} style={{ display: "none" }}>
      <PageLoader />
    </div>
  );
};

const IntercomBootupComponent = () => {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const location = useLocation();

  React.useEffect(() => {
    if (window?.Intercom) {
      window.Intercom("update");
    }
  }, [location.pathname]);

  const getIntercomHash = async () => {
    return getAccessTokenSilently().then(async (newToken) => {
      return await axios.get(
        `${process.env.REACT_APP_API}/users/intercom-hash`,
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
    });
  };

  React.useEffect(() => {
    if (window?.Intercom)
      if (isAuthenticated) {
        getIntercomHash()
          .then((res) => {
            if (res.data.error) {
              console.error(res.data.error);
            } else {
              // @ts-ignore
              window.Intercom("boot", {
                api_base: "https://api-iam.intercom.io",
                app_id: process.env.REACT_APP_INTERCOM_APP_ID,
                name: user?.name, // Full name
                email: user?.email, // the email for your user
                user_id: user?.sub, // user_id as a string
                created_at: user?.created_at, // Signup date as a Unix timestamp
                user_hash: res.data.hash,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // @ts-ignore
        window.Intercom("boot", {
          api_base: "https://api-iam.intercom.io",
          app_id: process.env.REACT_APP_INTERCOM_APP_ID,
        });
      }
  }, [isAuthenticated]);

  return <></>;
};

const StripeReturn = () => {
  const history = useHistory();
  React.useEffect(() => {
    // Get the saved return route, remove from LS and redirect
    const returnRoute =
      localStorage.getItem("upgradeReturnRoute") ?? "/user-management/billing";
    localStorage.removeItem("upgradeReturnRoute");
    history.replace(returnRoute);
  }, []);
  return <></>;
};

export function MainRoutes() {
  useScrollToTop();
  useRouteListener();

  return (
    <Auth0ProviderWithRedirectCallback
      domain={process.env.REACT_APP_AUTH0_DOMAIN!}
      clientId={process.env.REACT_APP_AUTH0_CLIENT!}
      authorizationParams={{
        audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
        redirect_uri: `${window.location.origin}/callback`,
      }}
    >
      <AuthLoader />
      <PlanLoader />
      <OneTapLoginComponent />
      {process.env.REACT_APP_ENV_TYPE === "prod" ? (
        <IntercomBootupComponent />
      ) : null}
      <Suspense fallback={<PageLoader />}>
        <Switch>
          <Route exact path="/callback">
            <AuthCallbackModule />
          </Route>
          <Route exact path="/stripe-return">
            <StripeReturn />
          </Route>
          <RouteWithAppBar exact path="/">
            <HomeModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/partners">
            <PartnersModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/contact">
            <ContactModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/why-dataxplorer">
            <WhyDXModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/dashboard">
            <AuthProtectedRoute>
              <DashboardModule />
            </AuthProtectedRoute>
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/story/:page/:view?">
            <AuthProtectedRoute>
              <StoryModule />
            </AuthProtectedRoute>
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/dataset/:page/:view?">
            <AuthProtectedRoute>
              <DatasetModule />
            </AuthProtectedRoute>
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/about">
            <AboutModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/pricing">
            <PricingModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/landing">
            <LandingModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/chart/:page/:view?">
            <AuthProtectedRoute>
              <ChartModule />
            </AuthProtectedRoute>
          </RouteWithAppBar>

          <Route exact path="/chart-embed/:chartId/:datasetId">
            <EmbedChartModule />
          </Route>
          {/* <RouteWithAppBar exact path="/dataset/:id/edit">
            <></>
          </RouteWithAppBar> */}
          <RouteWithAppBar path="/onboarding">
            <OnboardingModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/user-management/:tab?">
            <AuthProtectedRoute>
              <UserProfileModule />
            </AuthProtectedRoute>
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/payment/success">
            <PaymentSuccessCallbackModule />
          </RouteWithAppBar>
          <RouteWithAppBar exact path="/payment/canceled">
            <PaymentCanceledCallbackModule />
          </RouteWithAppBar>

          <RouteWithAppBar path="*">
            <NoMatchPage />
          </RouteWithAppBar>
        </Switch>
      </Suspense>
    </Auth0ProviderWithRedirectCallback>
  );
}
