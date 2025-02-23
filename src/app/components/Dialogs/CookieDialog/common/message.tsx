import Box from "@material-ui/core/Box";
import styled from "styled-components/macro";
import Typography from "@material-ui/core/Typography";
import { PrimaryButton } from "app/components/Styled/button";

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
        <a
          href={`https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view?usp=drive_link`}
          target="_blank"
          rel="noopener noreferrer"
        >
          cookies
        </a>
        . Review{" "}
        <a
          href={`https://drive.google.com/file/d/1andhlQEoaEq5qDxMbtnApXiZborsg-bG/view?usp=drive_link`}
          target="_blank"
          rel="noopener noreferrer"
        >
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
