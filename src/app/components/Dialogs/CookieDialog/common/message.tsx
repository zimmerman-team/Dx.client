import Box from "@material-ui/core/Box";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import { PrimaryButton } from "app/components/Styled/button";
import {
  COOKIE_POLICY_LINK,
  DATA_POLICY_LINK,
} from "app/modules/chart-module/util/constants";

const MessageContainer = styled((props) => <Box {...props} />)`
  align-items: center;
  justify-content: space-between;
  @media (max-width: 425px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

const Typo = styled((props) => <Typography {...props} />)`
  && {
    align-self: center;
  }
`;

type MessageProps = {
  onClose?: () => void;
};

export const Message = (props: MessageProps) => {
  return (
    <MessageContainer display="flex">
      <Typo
        variant="body1"
        css={`
          color: #231d2c;

          a {
            color: #231d2c;
          }
        `}
      >
        The website makes use of{" "}
        <a href={COOKIE_POLICY_LINK} target="_blank" rel="noopener noreferrer">
          cookies
        </a>
        . Review{" "}
        <a href={DATA_POLICY_LINK} target="_blank" rel="noopener noreferrer">
          data privacy
        </a>{" "}
        for more details.
      </Typo>
      <PrimaryButton
        type="button"
        bg="dark"
        size="big"
        data-cy="cookie-btn"
        onClick={props.onClose}
      >
        Agree
      </PrimaryButton>
    </MessageContainer>
  );
};
