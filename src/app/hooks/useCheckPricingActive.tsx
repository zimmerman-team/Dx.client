import { APPLICATION_JSON } from "app/state/api";
import axios from "axios";
import React from "react";

export function useCheckPricingActive() {
  const [pricingActive, setPricingActive] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API}/users/check-pricing-active`, {
        headers: {
          "Content-Type": APPLICATION_JSON,
        },
      })
      .then((response) => {
        setPricingActive(!!response.data?.active);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { pricingActive, loading };
}
