import React, { useRef, useEffect } from "react";

type View = { key: string; name: string };

export function SubscriptionToggle({
  VIEWS,
  subscriptionPlan,
  setSubscriptionPlan,
}: {
  VIEWS: View[];
  subscriptionPlan: string;
  setSubscriptionPlan: (key: string) => void;
}) {
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Keep focus aligned with the selected radio
  useEffect(() => {
    const idx = VIEWS.findIndex((v) => v.key === subscriptionPlan);
    if (idx >= 0) buttonsRef.current[idx]?.focus();
  }, [subscriptionPlan, VIEWS]);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % VIEWS.length; // ✅ wraps around
      setSubscriptionPlan(VIEWS[nextIndex].key);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + VIEWS.length) % VIEWS.length; // ✅ wraps around
      setSubscriptionPlan(VIEWS[prevIndex].key);
    } else if (e.key === "Home") {
      e.preventDefault();
      setSubscriptionPlan(VIEWS[0].key);
    } else if (e.key === "End") {
      e.preventDefault();
      setSubscriptionPlan(VIEWS[VIEWS.length - 1].key);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Subscription Plan Toggle"
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
      {VIEWS.map((view, index) => {
        const isSelected = subscriptionPlan === view.key;
        return (
          <button
            key={view.key}
            ref={(el) => (buttonsRef.current[index] = el)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1} // only one tabbable
            css={`
              ${isSelected
                ? `
              border-radius: 51px;
              background: #FFF;
              box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);}`
                : ""}
              border: none;

              :focus-visible {
                border: 3px solid #000;
              }
            `}
            onClick={() => setSubscriptionPlan(view.key)}
            onKeyDown={(e) => onKeyDown(e, index)}
          >
            {view.name}
          </button>
        );
      })}
    </div>
  );
}

export default SubscriptionToggle;
