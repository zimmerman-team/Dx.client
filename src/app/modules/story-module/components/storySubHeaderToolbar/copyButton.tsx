import React from "react";
import Button from "@material-ui/core/Button";
import { LinkIcon } from "@app/assets/icons/Link";

const CopyButton = ({ handleCopy }: { handleCopy: (link: string) => void }) => {
  const copyButtonRef = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    console.log(copyButtonRef.current, "copy button ref");
    if (copyButtonRef.current) {
      console.log("focusing copy button");
      setTimeout(() => {
        copyButtonRef.current?.focus();
      }, 0);
    }
  }, [copyButtonRef?.current]);
  return (
    <Button
      startIcon={<LinkIcon />}
      onClick={() => handleCopy(window.location.href)}
      ref={copyButtonRef}
      onLoad={() => {
        console.log("button loaded");
      }}
      onLoadStart={() => {
        console.log("button load started");
      }}
    >
      Copy link
    </Button>
  );
};

export default CopyButton;
