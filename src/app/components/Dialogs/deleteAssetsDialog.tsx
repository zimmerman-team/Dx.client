import { IconButton, Modal, createStyles, makeStyles } from "@material-ui/core";
import { CloseOutlined } from "@material-ui/icons";
import useGetChartsStoriesCountByDataset from "@app/hooks/useGetChartsStoriesCountByDataset";
import CircleLoader from "@app/modules/home-module/components/Loader";
import React from "react";
import { PrimaryButton } from "@app/components/Styled/button";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (value: boolean) => void;
  handleDelete: () => void;
  datasetCount: number;
  chartsCount: number;
  storiesCount: number;
}

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
    },
    paper: {
      outline: 0,
      width: 646,
      borderRadius: "16px",
      position: "relative",
      padding: "2.5rem 81px",
      backgroundColor: "#fff",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
      "@media (max-width: 650px)": {
        width: "80%",
        padding: "2.5rem 48px",
      },
    },
  })
);

export default function DeleteAssetsDialog(props: Props) {
  const classes = useStyles();
  const [enableButton, setEnableButton] = React.useState(false);

  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value === "DELETE") {
      props.handleDelete();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  return (
    <div>
      <Modal
        open={props.modalDisplay}
        onClose={() => props.setModalDisplay(false)}
        className={classes.modal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.handleDelete();
            }}
            data-cy="delete-assets-form"
            aria-label="form"
          >
            <div>
              <IconButton
                onClick={() => props.setModalDisplay(false)}
                css={`
                  position: absolute;
                  right: 8px;
                  top: 6px;
                `}
              >
                <CloseOutlined htmlColor="#231D2C" />
              </IconButton>
              <p
                css={`
                  font-size: 40px;
                  padding: 0;
                  margin: 0;
                  color: #231d2c;
                  line-height: 41px;
                  margin-bottom: 0px;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                `}
              >
                Delete assets
              </p>
              <p
                css={`
                  margin-top: 16px;
                  font-size: 18px;
                `}
              >
                You’re about to permanently delete{" "}
                {props.datasetCount + props.chartsCount + props.storiesCount}{" "}
                assets.
                <br /> This includes:
                <ul
                  css={`
                    padding-left: 30px;
                    margin: 0;
                  `}
                >
                  <li>
                    {props.datasetCount} dataset
                    {props.datasetCount !== 1 ? "s" : ""}
                  </li>
                  <li>
                    {props.chartsCount} chart
                    {props.chartsCount !== 1 ? "s" : ""}
                  </li>
                  <li>
                    {props.storiesCount} stor
                    {props.storiesCount !== 1 ? "ies" : "y"}
                  </li>
                </ul>
                <b>This action is irreversible.</b>
              </p>

              <input
                autoFocus
                type="text"
                placeholder='Type "DELETE" to confirm'
                onChange={handleInputChange}
                onKeyPress={onInputEnter}
                css={`
                  margin-top: 32px;
                  border: 1px solid #231d2c;
                  border-radius: 10px;
                  background: #ffffff;
                  height: 48px;
                  width: 100%;
                  padding: 0px 24px;
                  :focus,
                  :active,
                  :hover {
                    outline: 1px solid #6061e5;
                  }
                `}
                data-cy="delete-assets-input"
              />
              <div
                css={`
                  display: flex;
                  justify-content: flex-end;
                  margin-top: 36px;
                  gap: 16px;
                `}
              >
                <PrimaryButton
                  bg="light"
                  size="big"
                  type="submit"
                  disabled={!enableButton}
                >
                  Delete
                </PrimaryButton>
                <PrimaryButton
                  bg="dark"
                  size="big"
                  type="submit"
                  onClick={() => props.setModalDisplay(false)}
                >
                  Not Now
                </PrimaryButton>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
