import React from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import { useStoreState } from "app/state/store/hooks";
import { PageLoader } from "app/modules/common/page-loader";
import { billingcss } from "app/modules/user-profile-module/style";
import { InvoiceTable } from "app/modules/user-profile-module/component/table";
import { APPLICATION_JSON } from "app/state/api";
import { PrimaryButton } from "app/components/Styled/button";

export default function Billing() {
  const { user } = useAuth0();
  const history = useHistory();

  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState<null | {
    method: string;
    number: string;
  }>(null);
  const [billingInfo, setBillingInfo] = React.useState<null | {
    city: string;
    country: string;
    line1: string;
    line2: string;
    postal_code: string;
    state: string;
  }>(null);
  const [invoices, setInvoices] = React.useState<
    { id: string; name: string; url: string; hostedUrl: string; date: string }[]
  >([]);
  const [currentPlan, setCurrentPlan] = React.useState("");
  const [planMessage, setPlanMessage] = React.useState("");

  const token = useStoreState((state) => state.AuthToken.value);
  const isInUpgradeFlow =
    new URLSearchParams(window.location.search).get("flow") === "upgrade";
  React.useEffect(() => {
    // If we're not in the upgrade flow but have the localStorage item, clean it up
    if (!isInUpgradeFlow && localStorage.getItem("upgradeReturnRoute")) {
      localStorage.removeItem("upgradeReturnRoute");
    }
  }, [isInUpgradeFlow]);

  const getStripePaymentMethod = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/payment-method/${user?.sub}`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPaymentMethod(response.data.data);
    setLoading(false);
  };

  const getStripeBillingInfo = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/${user?.sub}/billing`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBillingInfo(response.data.data);
    setLoading(false);
  };

  const changePaymentMethod = async () => {
    setLoading(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/stripe/portal-session`,
      {
        userId: user?.sub,
        flowDataType: "payment_method_update",
        returnUrl: `${window.location.origin}/user-management/billing`,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.data) {
      window.location.href = response.data.data;
      setLoading(false);
    }
  };

  const getGenericPortal = async () => {
    if (!isOnPaidPlan) {
      history.push("/pricing");
    }
    setLoading(true);
    const response = await axios.post(
      `${process.env.REACT_APP_API}/stripe/portal-session`,
      {
        userId: user?.sub,
        returnUrl: `${window.location.origin}/stripe-return`,
      },
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.data) {
      window.location.href = response.data.data;
      setLoading(false);
    }
  };

  const getStripeInvoices = async () => {
    setLoading(true);
    const response = await axios.get(
      `${process.env.REACT_APP_API}/stripe/invoices/${user?.sub}`,
      {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setInvoices(response.data.data);
    setLoading(false);
  };

  const getCurrentSubscriptionPlan = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/stripe/subscription/${user?.sub}`, {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCurrentPlan(response.data.data.plan);
        setPlanMessage(response.data.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isOnPaidPlan = React.useMemo(() => {
    return currentPlan !== "Free" && currentPlan !== "";
  }, [currentPlan]);

  React.useEffect(() => {
    getStripePaymentMethod();
    getStripeBillingInfo();
    getStripeInvoices();
    getCurrentSubscriptionPlan();
  }, []);

  return (
    <React.Fragment>
      {loading && <PageLoader />}
      <div>
        <h4 css={billingcss.heading}>Billing</h4>
        <div css={billingcss.section}>
          <p>Dataxplorer Plan</p>

          <div
            css={`
              ${billingcss.end}
              p {
                font-size: 18px;
              }
            `}
          >
            <p>
              {currentPlan}
              {planMessage ? ` (${planMessage})` : ""}
            </p>
            <div css={billingcss.planButtons}>
              <PrimaryButton
                bg="dark"
                size="small"
                disabled={!isOnPaidPlan}
                onClick={getGenericPortal}
              >
                RENEW PLAN
              </PrimaryButton>
              <PrimaryButton bg="dark" size="small" onClick={getGenericPortal}>
                UPGRADE PLAN
              </PrimaryButton>
              <PrimaryButton
                bg="dark"
                size="small"
                disabled={!isOnPaidPlan}
                onClick={getGenericPortal}
              >
                CANCEL PLAN
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div css={billingcss.section}>
          <p>Payment method</p>{" "}
          <div css={billingcss.end}>
            <p
              css={`
                text-transform: uppercase;
              `}
            >
              {isOnPaidPlan
                ? `${paymentMethod?.method} ••${paymentMethod?.number}`
                : "-"}
            </p>
            <div>
              <PrimaryButton
                bg="dark"
                size="small"
                disabled={!isOnPaidPlan}
                onClick={changePaymentMethod}
              >
                CHANGE PAYMENT METHOD
              </PrimaryButton>
            </div>
          </div>
        </div>

        <div css={billingcss.section}>
          <p>Billing info</p>

          <div
            css={`
              ${billingcss.end}
              p:nth-child(1) {
                margin-bottom: 0px;
              }
              p:nth-child(2) {
                margin-bottom: 8px;
              }
            `}
          >
            {isOnPaidPlan ? (
              <React.Fragment>
                <p>
                  {billingInfo?.line1},
                  {billingInfo?.line2 ? (
                    <React.Fragment>
                      <br />
                      <p>{billingInfo?.line2},</p>
                    </React.Fragment>
                  ) : (
                    <React.Fragment />
                  )}
                </p>
                <p>
                  {billingInfo?.postal_code} {billingInfo?.city}{" "}
                  {billingInfo?.state}, {billingInfo?.country}
                </p>
              </React.Fragment>
            ) : (
              "-"
            )}
            <div>
              <PrimaryButton
                bg="dark"
                size="small"
                disabled={!isOnPaidPlan}
                onClick={getGenericPortal}
              >
                CHANGE BILLING INFO
              </PrimaryButton>
            </div>
          </div>
        </div>
        <div
          css={`
            height: 48px;
          `}
        />
        <InvoiceTable tableData={invoices} />
      </div>
    </React.Fragment>
  );
}
