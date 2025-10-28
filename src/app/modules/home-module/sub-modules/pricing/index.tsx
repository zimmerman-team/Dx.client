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
import SubscriptionToggle from "./components/subscription-toggle";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function PricingModule() {
  useTitle("Dataxplorer - Pricing");

  const cmsData = useCMSData({ returnData: true });

  const { user, isAuthenticated } = useAuth0();
  useBackgroundColor("#FFF", []);

  const isMobile = useMediaQuery(`(max-width: ${DESKTOP_BREAKPOINT})`);
  const location = useLocation();

  const [subscriptionPlan, setSubscriptionPlan] = React.useState("monthly");
  const [currentPlan, setCurrentPlan] = React.useState(
    isAuthenticated ? "free" : ""
  );

  const { loading: pricingActiveLoading, pricingActive } =
    useCheckPricingActive();

  const [loading, setLoading] = React.useState(false);

  const token = useStoreState((state) => state.AuthToken.value);

  const history = useHistory();

  const VIEWS = React.useMemo(
    () => [
      {
        name: getCMSDataField(
          cmsData,
          "pagesPricing.subscriptionToggleMonthly",
          "Monthly Plan"
        ),
        key: "monthly",
      },
      {
        name: getCMSDataField(
          cmsData,
          "pagesPricing.subscriptionToggleYearly",
          "Annual Plan"
        ),
        key: "yearly",
      },
    ],
    [cmsData]
  );

  const PLANS = React.useMemo(
    () => [
      {
        name: getCMSDataField(cmsData, "pagesPricing.freePlanName", "Free"),
        yearlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.freePlanYearlyPrice",
          "Free forever"
        ),
        monthlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.freePlanMonthlyPrice",
          "Free forever"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesPricing.freePlanText",
          "For individuals or teams just getting started in Dataxplorer"
        ),
        current: false,
        recommended: false,
        buttonText: getCMSDataField(
          cmsData,
          "pagesPricing.freePlanButtonText",
          "Activate"
        ),
        discount: "",
        key: "free",
        available: true,
      },
      {
        name: getCMSDataField(cmsData, "pagesPricing.proPlanName", "Pro"),
        yearlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.proPlanYearlyPrice",
          "€720"
        ),
        monthlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.proPlanMonthlyPrice",
          "€75"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesPricing.proPlanText",
          "For individual users."
        ),
        current: false,
        recommended: false,
        buttonText: getCMSDataField(
          cmsData,
          "pagesPricing.proPlanButtonText",
          "Activate a free trial"
        ),
        discount: getCMSDataField(
          cmsData,
          "pagesPricing.proPlanDiscount",
          "(Save 20%)"
        ),
        key: "pro",
        available: true,
      },
      {
        name: getCMSDataField(cmsData, "pagesPricing.teamPlanName", "Team"),
        yearlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.teamPlanYearlyPrice",
          "€576"
        ),
        monthlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.teamPlanMonthlyPrice",
          "€60"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesPricing.teamPlanText",
          "Scale up to 100 users and connect your team."
        ),
        current: false,
        recommended: false,
        buttonText: getCMSDataField(
          cmsData,
          "pagesPricing.teamPlanButtonText",
          "Activate free trial"
        ),
        discount: getCMSDataField(
          cmsData,
          "pagesPricing.teamPlanDiscount",
          "(Save 20%)"
        ),
        key: "team",
        available: true,
      },
      {
        name: getCMSDataField(
          cmsData,
          "pagesPricing.enterprisePlanName",
          "Enterprise"
        ),
        yearlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.enterprisePlanYearlyPrice",
          "Custom"
        ),
        monthlyPrice: getCMSDataField(
          cmsData,
          "pagesPricing.enterprisePlanMonthlyPrice",
          "Custom"
        ),
        text: getCMSDataField(
          cmsData,
          "pagesPricing.enterprisePlanText",
          "For organisations looking scale into powerful data visualization, with full support and security"
        ),
        current: false,
        recommended: false,
        buttonText: getCMSDataField(
          cmsData,
          "pagesPricing.enterprisePlanButtonText",
          "Contact us"
        ),
        discount: "",
        key: "enterprise",
        available: true,
      },
    ],
    [cmsData]
  );

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
          response.data.data.plan === "Free" ? "free" : response.data.data.plan
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

  const plans = React.useMemo(() => {
    return PLANS.map((plan) => {
      return {
        ...plan,
        current: pricingActive
          ? plan.key === currentPlan
          : currentPlan
          ? plan.key === "free"
          : false,
        available: plan.key === "free" ? true : pricingActive,
        recommended: pricingActive ? plan.key === "pro" : false,
      };
    });
  }, [currentPlan, pricingActive, PLANS]);

  const handlePlanButtonClick = async (key: string) => {
    if (!isAuthenticated) {
      return history.replace(
        `/onboarding/signin?to=${window.location.pathname}${window.location.search}`
      );
    }
    const isInUpgradeFlow =
      new URLSearchParams(location.search).get("flow") === "upgrade";
    if (currentPlan !== plans[0].key) {
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

  React.useEffect(() => {
    if (isAuthenticated) {
      getCurrentSubscriptionPlan();
    } else {
      setCurrentPlan("");
    }
  }, [isAuthenticated]);

  return (
    <main
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
            margin-top: 100px;
            font-size: 64px;
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
          {getCMSDataField(
            cmsData,
            "pagesPricing.title",
            "Create stories that aren't a pain to build"
          )}
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
          {getCMSDataField(
            cmsData,
            "pagesPricing.subtitle",
            "Dataxplorer simplifies and empowers visual data storytelling for all. Free for all."
          )}
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
              {getCMSDataField(
                cmsData,
                "pagesPricing.chooseYourSubscriptionText",
                "Choose Your Subscription"
              )}
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
              {getCMSDataField(
                cmsData,
                "pagesPricing.subscriptionDiscountText",
                "Save 20% for annual plans"
              )}
            </p>
          </div>
          <SubscriptionToggle
            VIEWS={VIEWS}
            subscriptionPlan={subscriptionPlan}
            setSubscriptionPlan={setSubscriptionPlan}
          />
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
              aria-label="Subscription Plans"
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
    </main>
  );
}
