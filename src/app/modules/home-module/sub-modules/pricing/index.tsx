import React from "react";
import axios from "axios";
import { useTitle } from "react-use";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
import { Box, Container, useMediaQuery } from "@material-ui/core";
import PlanCard from "./components/plan-card";

import HomeFooter from "app/modules/home-module/components/Footer";
import Features from "./components/features";
import MFALogo from "./assets/mfa-logo";
import TGFLogo from "./assets/tgf-logo";
import IATILogo from "./assets/iati-logo";
import { useHistory, useLocation } from "react-router-dom";
import MobilePlanCard from "./components/mobile-plan-card";
import { APPLICATION_JSON } from "app/state/api";
import { PageLoader } from "app/modules/common/page-loader";
import { useCheckPricingActive } from "app/hooks/useCheckPricingActive";
import { DESKTOP_BREAKPOINT } from "app/theme";
import useBackgroundColor from "app/hooks/useBackgroundColor";

const VIEWS = [
  {
    name: "Monthly Plan",
    key: "monthly",
  },
  {
    name: "Annual Plan",
    key: "yearly",
  },
];

const PLANS = [
  {
    name: "Free Plan",
    yearlyPrice: "Free forever",
    monthlyPrice: "Free forever",
    text: "For individuals or teams just getting started in Dataxplorer",
    current: false,
    recommended: true,
    buttonText: "Activate",
    discount: "",
    key: "free",
    available: true,
  },
  {
    name: "Pro",
    yearlyPrice: "€720",
    monthlyPrice: "€75",
    text: "For individual users.",
    current: false,
    recommended: false,
    buttonText: "Activate a free trial",
    discount: "(Save 20%)",
    key: "pro",
    available: true,
  },
  {
    name: "Team",
    yearlyPrice: "€576",
    monthlyPrice: "€60",
    text: "Scale up to 100 users and connect your team.",
    current: false,
    recommended: false,
    buttonText: "Activate free trial",
    discount: "(Save 20%)",
    key: "team",
    available: true,
  },
  {
    name: "Enterprise",
    yearlyPrice: "Custom",
    monthlyPrice: "Custom",
    text: "For organisations looking scale into powerful data visualization, with full support and security",
    current: false,
    recommended: false,
    buttonText: "Contact us",
    discount: "",
    key: "enterprise",
    available: true,
  },
];

export default function PricingModule() {
  useTitle("Dataxplorer - Pricing");

  const { user, isAuthenticated } = useAuth0();
  useBackgroundColor("#FFF", []);

  const isMobile = useMediaQuery(`(max-width: ${DESKTOP_BREAKPOINT})`);
  const location = useLocation();

  const [subscriptionPlan, setSubscriptionPlan] = React.useState("monthly");
  const [currentPlan, setCurrentPlan] = React.useState(
    isAuthenticated ? PLANS[0].name : ""
  );

  const { loading: pricingActiveLoading, pricingActive } =
    useCheckPricingActive();

  const [loading, setLoading] = React.useState(false);

  const token = useStoreState((state) => state.AuthToken.value);

  const history = useHistory();

  const createNewStripeCustomer = async () => {
    const customerCreationResponse = await axios.post(
      `${process.env.REACT_APP_API}/stripe/new-customer`,
      {
        name: user?.name,
        email: user?.email,
        authUserId: user?.sub,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return customerCreationResponse.data.data;
  };

  const getCurrentSubscriptionPlan = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API}/stripe/subscription/${user?.sub}`, {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCurrentPlan(
          response.data.data.plan === "Free"
            ? "Free Plan"
            : response.data.data.plan
        );
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  };

  const createStripeCheckoutSession = async (
    customerId: string,
    planName: string
  ) => {
    const checkoutSessionResponse = await axios.post(
      `${process.env.REACT_APP_API}/stripe/checkout-session`,
      {
        planName,
        customerId,
        licensesNumber: 1,
        recurrence: subscriptionPlan,
        domainURL: `${window.location.origin}/payment`,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return checkoutSessionResponse.data.data;
  };

  const handlePlanButtonClick = async (key: string) => {
    if (!isAuthenticated) {
      return history.replace(
        `/onboarding/signin?to=${window.location.pathname}${window.location.search}`
      );
    }
    const isInUpgradeFlow =
      new URLSearchParams(location.search).get("flow") === "upgrade";
    if (currentPlan !== PLANS[0].name) {
      const flowParam = isInUpgradeFlow ? "?flow=upgrade" : "";
      history.push(`/user-management/billing${flowParam}`);
      return;
    }
    switch (key) {
      case plans[0].key:
      case plans[1].key:
      case plans[2].key:
        const customerId = await createNewStripeCustomer();
        if (customerId) {
          const sessionUrl = await createStripeCheckoutSession(customerId, key);
          if (sessionUrl) window.location.href = sessionUrl;
        }
        break;
      case plans[3].key:
        history.push("/contact");
        break;
      default:
        break;
    }
  };

  const plans = React.useMemo(() => {
    return PLANS.map((plan) => {
      return {
        ...plan,
        current: pricingActive
          ? plan.name === currentPlan
          : currentPlan
          ? plan.name === "Free Plan"
          : false,
        available: plan.name === "Free Plan" ? true : pricingActive,
        recommended: pricingActive
          ? plan.name === "Pro"
          : plan.name === "Free Plan",
      };
    });
  }, [currentPlan, pricingActive]);

  React.useEffect(() => {
    if (isAuthenticated) {
      getCurrentSubscriptionPlan();
    } else {
      setCurrentPlan("");
    }
  }, [isAuthenticated]);

  return (
    <section
      css={`
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 50px; // AppBar height
        min-height: calc(100vh - 50px);
      `}
    >
      {(loading || pricingActiveLoading) && <PageLoader />}
      <Container maxWidth="lg">
        <h1
          css={`
            margin: 0;
            padding: 0;
            margin-top: 124px;
            font-size: 48px;
            font-weight: 400;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            line-height: normal;
            color: #231d2c;
            text-align: center;
            @media (max-width: 1300px) {
              font-size: 40px;
            }
          `}
        >
          Create stories that aren't a pain to build
        </h1>
        <p
          css={`
            margin: 0;
            padding: 0;
            font-size: 16px;
            font-weight: 325;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            line-height: normal;
            letter-spacing: 0.5px;
            color: #231d2c;
            text-align: center;
            margin-top: 10px;
            @media (max-width: 1300px) {
              font-size: 18px;
            }
            @media (max-width: 600px) {
              font-size: 16px;
              b {
                font-weight: 350;
              }
            }
          `}
        >
          Dataxplorer simplifies and empowers visual data storytelling for all.
          Free for all.
        </p>
        <Box height={65} />
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            column-gap: 20px;
            @media (max-width: 600px) {
              flex-direction: column;
              row-gap: 8px;
            }
          `}
        >
          <div>
            <p
              css={`
                margin: 0;
                padding: 0;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                color: #231d2c;
                font-size: 18px;
                font-weight: 400;
                line-height: normal;
              `}
            >
              Choose Your Subscription
            </p>
            <p
              css={`
                margin: 0;
                padding: 0;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                font-size: 14px;
                font-style: normal;
                font-weight: 325;
                line-height: normal;
                letter-spacing: 0.5px;
                text-align: center;
              `}
            >
              Save 20% for annual plans
            </p>
          </div>
          <div
            css={`
              border-radius: 51px;
              background: #f1f1f1;
              padding: 5px 8px;
              display: flex;
              align-items: center;
              button {
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: normal;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                display: flex;
                width: 99px;
                height: 32px;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              }
            `}
          >
            {VIEWS.map((view) => (
              <button
                key={view.key}
                css={`
                  ${subscriptionPlan === view.key
                    ? `
                border-radius: 51px;
             
                background: #FFF;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);`
                    : ""}
                  border: none;
                `}
                onClick={() => setSubscriptionPlan(view.key)}
              >
                {view.name}
              </button>
            ))}
          </div>
        </div>
        <Box height={65} />
        {isMobile ? (
          <>
            <MobilePlanCard
              plans={plans}
              subscriptionPlan={subscriptionPlan}
              onButtonClick={handlePlanButtonClick}
            />
          </>
        ) : (
          <>
            <div
              css={`
                display: flex;
                justify-content: flex-end;
                column-gap: 24px;
              `}
            >
              {plans.map((plan) => (
                <PlanCard
                  key={plan.key}
                  plan={plan}
                  activeView={subscriptionPlan}
                  onButtonClick={handlePlanButtonClick}
                />
              ))}
            </div>
            <Features />
          </>
        )}

        <Box
          height={{
            xs: 32,
            lg: 100,
          }}
        />
        <div>
          <h2
            css={`
              font-size: 18px;
              font-style: normal;
              font-weight: 400;
              line-height: 160%;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #262c34;
              text-align: center;
              margin: 0;
            `}
          >
            Trusted by
          </h2>
          <div
            css={`
              margin-top: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              column-gap: 200px;

              @media (max-width: 1024px) {
                column-gap: 85px;
              }
              @media (max-width: 600px) {
                column-gap: 42.5px;
              }
            `}
          >
            <MFALogo /> <TGFLogo /> <IATILogo />
          </div>
        </div>

        <Box height={100} />
      </Container>
      <HomeFooter />
    </section>
  );
}
