import { PrimaryButton, TertiaryButton } from "@app/components/Styled/button";
import { TABLET_STARTPOINT } from "@app/theme";
import { useHistory } from "react-router-dom";

export const UpgradeCard = (props: { onClose: () => void }) => {
  const history = useHistory();

  return (
    <div
      css={`
        width: 93%;
        position: absolute;
        right: 13px;
        bottom: 21px;
        padding: 26px;
        border-radius: 10px;
        background: #fff;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
        z-index: 1;
      `}
    >
      <h2
        css={`
          margin: 0;
          color: #231d2c;
          font-family: "GothamNarrow-Bold", sans-serif;
          font-size: 24px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
          @media (max-width: ${TABLET_STARTPOINT}) {
            font-size: 18px;
          }
        `}
      >
        Enhance Your Stories with Multimedia!
      </h2>
      <p
        css={`
          margin: 0;
          margin-top: 8px;
          font-family: "GothamNarrow-Book", sans-serif;
          font-size: 18px;
          font-style: normal;
          font-weight: 325;
          line-height: normal;
          @media (max-width: ${TABLET_STARTPOINT}) {
            font-size: 14px;
          }
        `}
      >
        Currently, adding videos and images to stories is a feature exclusive to
        our premium plans. Upgrade now to bring your data to life with engaging
        visuals and make your stories more impactful.
      </p>

      <div
        css={`
          display: flex;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          justify-content: flex-end;
          @media (max-width: ${TABLET_STARTPOINT}) {
            flex-direction: column;
            gap: 16px;
            button {
              width: 100%;
              font-size: 16px;
            }
          }
        `}
      >
        <PrimaryButton
          size="big"
          bg="light"
          type="button"
          onClick={() => {
            history.push("/pricing");
            props.onClose();
          }}
        >
          Upgrade
        </PrimaryButton>
        <TertiaryButton size="big" bg="light" onClick={props.onClose}>
          Not Now
        </TertiaryButton>
      </div>
    </div>
  );
};
