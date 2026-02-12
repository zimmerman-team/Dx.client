import { MOBILE_BREAKPOINT } from "@app/theme";
import React, { useEffect, useRef } from "react";

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
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]); // Keep focus aligned with the selected radio
  useEffect(() => {
    const idx = VIEWS.findIndex((v) => v.key === subscriptionPlan);
    if (idx >= 0) buttonsRef.current[idx]?.focus();
  }, [subscriptionPlan, VIEWS]);

  const activeIndex = Math.max(
    0,
    VIEWS.findIndex((v) => v.key === subscriptionPlan)
  );

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % VIEWS.length;
      setSubscriptionPlan(VIEWS[nextIndex].key);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + VIEWS.length) % VIEWS.length;
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
        position: relative;
        border-radius: 20px;
        background: #ffffff;
        padding: 5px 8px;
        display: inline-flex;
        align-items: center;
        border: 0.5px solid #6061e5;

        /* Keep this in sync with button width/height */
        --btn-w: 221px;
        --btn-h: 40px;
        --pad-y: 5px;
        --pad-x: 8px;

        @media (max-width: ${MOBILE_BREAKPOINT}) {
          --btn-w: 159px;
          --btn-h: 40px;
          --pad-y: 5px;
          --pad-x: 8px;
        }
      `}
    >
      {/* ✅ iOS sliding pill (same method as your toggle switch) */}
      <span
        aria-hidden="true"
        css={`
          position: absolute;
          top: var(--pad-y);
          left: var(--pad-x);
          width: var(--btn-w);
          height: var(--btn-h);
          border-radius: 51px;
          background: #6061e5;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);

          transform: translateX(calc(${activeIndex} * var(--btn-w)));
          transition: transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;

          pointer-events: none;
        `}
      />

      {VIEWS.map((view, index) => {
        const isSelected = subscriptionPlan === view.key;

        return (
          <button
            key={view.key}
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1} // only one tabbable
            ref={(el) => (buttonsRef.current[index] = el)}
            css={`
              position: relative;
              z-index: 1; /* above pill */

              font-size: 18px;
              font-style: normal;
              font-weight: 400;
              line-height: normal;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

              display: flex;
              width: var(--btn-w);
              height: var(--btn-h);
              justify-content: center;
              align-items: center;
              cursor: pointer;

              border: none;
              border-radius: 51px;
              background: transparent;
              color: ${isSelected ? "#fff" : "#6061E5"};

              transition: color 200ms ease;
              :focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px #000;
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
