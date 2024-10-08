import React from "react";
import CloseOutlined from "@material-ui/icons/ClearOutlined";
import { createStyles, IconButton, makeStyles, Modal } from "@material-ui/core";

interface Props {
  cardId?: string;

  modalDisplay: boolean;
  enableButton: boolean;
  handleDelete: (id: string) => void;
  setModalDisplay: (value: any) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
      width: 544,
      borderRadius: "10px",
      paddingRight: "2rem",
      position: "absolute",
      paddingLeft: "3.5rem",
      backgroundColor: "#fff",
      boxShadow:
        "0px 14.8787px 22.318px rgba(0, 0, 0, 0.05), 0px 4.4636px 7.43933px rgba(0, 0, 0, 0.05), 0px 0.743933px 7.43933px rgba(0, 0, 0, 0.05)",
    },
  })
);

export default function DeleteReportDialog(props: Props) {
  const classes = useStyles();

  const onInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value === "DELETE") {
      props.handleDelete(props.cardId as string);
    }
  };

  return (
    <Modal
      open={props.modalDisplay}
      className={classes.modal}
      onClose={() => props.setModalDisplay(false)}
    >
      <div className={classes.paper}>
        <form
          onSubmit={() => props.handleDelete(props.cardId as string)}
          data-cy="delete-report-item-form"
          aria-label="form"
        >
          <div
            css={`
              width: 80%;
              position: relative;
            `}
          >
            <IconButton
              onClick={() => props.setModalDisplay(false)}
              css={`
                position: absolute;
                right: -93px;
                top: -16px;
              `}
            >
              <CloseOutlined htmlColor="#231D2C" />
            </IconButton>
            <p
              css={`
                font-weight: 400;
                font-size: 34px;
                color: #231d2c;
                line-height: 41px;
                margin-bottom: 0px;
              `}
            >
              Delete report
            </p>
            <p
              css={`
                margin-top: 3px;
              `}
            >
              Absolutely sure you want to delete the report(s)? <br />{" "}
              <b>This action is irreversible!</b>
            </p>
            <div
              css={`
                margin-top: 3rem;
              `}
            >
              <input
                autoFocus
                type="text"
                placeholder='Type "DELETE" to confirm'
                onChange={props.handleInputChange}
                onKeyPress={onInputEnter}
                data-cy="delete-report-item-input"
                css={`
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
              />
            </div>
          </div>
          <div
            css={`
              display: flex;
              justify-content: flex-end;
              margin-top: 3rem;

              margin-bottom: 2rem;
              padding-right: 1rem;
            `}
          >
            <button
              type="submit"
              disabled={!props.enableButton}
              css={`
                background: ${props.enableButton ? "#231D2C" : "#e4e4e4"};
                border-radius: 30px;
                width: 107px;
                height: 41px;
                outline: none;
                border: none;
                text-transform: uppercase;
                color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
              `}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
