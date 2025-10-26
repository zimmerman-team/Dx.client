import React from "react";
import findIndex from "lodash/findIndex";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {
  CssInputLabel,
  CssSelectField,
  metaDatacss,
} from "app/modules/dataset-module/routes/upload-module/style";
import { ChevronRight } from "@material-ui/icons";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";
import Popover from "@material-ui/core/Popover";
import { ReactComponent as CheckMarkIcon } from "app/modules/dataset-module/assets/check-mark.svg";

interface IErrorState {
  name: {
    state: boolean;
    message: string;
  };
  description: {
    state: boolean;
    message: string;
  };
  category: {
    state: boolean;
    message: string;
  };
  source: {
    state: boolean;
    message: string;
  };
  sourceUrl: {
    state: boolean;
    message: string;
  };
}
export interface MetadataProps {
  onSubmit: (data: IFormDetails) => Promise<void>;
  formDetails: {
    name: string;
    description: string;
    category: string;
    public: boolean;
    source: string;
    sourceUrl: string;
  };
  setFormDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      category: string;
      public: boolean;
      source: string;
      sourceUrl: string;
    }>
  >;
  errorState: IErrorState;
  setErrorState: React.Dispatch<React.SetStateAction<IErrorState>>;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface IFormDetails {
  name: string;
  source: string;
  category: string;
  public: boolean;
  sourceUrl: string;
  description: string;
}

export const datasetCategories = [
  "Arts and Culture",
  "Economy",
  "Education",
  "Environment",
  "Healthcare",
  "Technology",
  "Social",
];

const SelectCategoryField = (props: {
  setFormDetails: React.Dispatch<React.SetStateAction<IFormDetails>>;
  formDetails: IFormDetails;
  error: boolean;
  onChange: any;
}) => (
  <FormControl variant="filled" fullWidth>
    <CssInputLabel id="select-label">Data category*</CssInputLabel>
    <CssSelectField
      fullWidth
      id="select"
      value={props.formDetails.category}
      defaultValue={""}
      name="category"
      label="Data category*"
      labelId="select-label"
      data-cy="dataset-metadata-category"
      onChange={props.onChange}
      inputRef={(input) => input && props.error && input.focus()}
      MenuProps={{
        PaperProps: {
          style: {
            borderRadius: "20px",
            marginTop: `${
              (findIndex(datasetCategories, props.formDetails.category) + 1) *
              60
            }px`,
          },
        },
      }}
      css={`
        fieldset {
          border-radius: 10px;
          padding-bottom: 4px;
          border-color: #231d2c !important;
        }
      `}
    >
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {datasetCategories.map((category) => (
        <MenuItem key={category} value={category}>
          {category}
        </MenuItem>
      ))}
    </CssSelectField>
  </FormControl>
);

export default function MetaData(props: Readonly<MetadataProps>) {
  const characterCount = props.formDetails.description?.length;
  const handleChange = (event: { target: { name: string; value: string } }) => {
    const { public: isPublic, ...rest } = props.formDetails;
    //reset error state to release focus on input field before typing new value
    if (Object.values(props.errorState).some((value) => value.state === true)) {
      for (const key in rest) {
        props.setErrorState((prev) => ({
          ...prev,
          [key]: { state: false, message: "" },
        }));
      }
    }
    const { name, value } = event.target;
    props.setFormDetails({
      ...props.formDetails,
      [name]: value,
    });
  };

  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    activeIndex,
    closeMenu,
  } = useMenuNavigation({
    items: datasetCategories,
  });

  const handleClosePopover = () => {
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenState(openState ? null : event.currentTarget);
  };
  return (
    <div css={metaDatacss}>
      <div
        css={`
          width: 100%;
        `}
      >
        <Grid container spacing={3}>
          <Grid lg={12} xs={12} md={12} item>
            <div>
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                  margin-bottom: 9px;
                  p {
                    color: #231d2c;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    line-height: normal;
                    margin: 0;
                    font-size: 16px;
                  }
                `}
              >
                <p>The Title of the Dataset*</p>
                <p
                  css={`
                    font-size: 14px;
                  `}
                >
                  0/25
                </p>
              </div>
              <input
                type="text"
                onChange={handleChange}
                name="name"
                value={props.formDetails.name}
                data-cy="dataset-metadata-title"
                maxLength={50}
                // ref={}
                css={`
                  border-radius: 10px;
                  border: none;
                  border-bottom: 1px solid #98a1aa;
                  background: #f1f3f5;
                  outline: none;
                  padding: 14px 16px;
                  width: 100%;
                `}
              />
            </div>
          </Grid>
          <div
            css={`
              height: 20px;
            `}
          />
          <Grid lg={12} xs={12} md={12} item>
            <div
              css={`
                position: relative;
                width: 100%;
              `}
            >
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                  margin-bottom: 9px;
                  p {
                    color: #231d2c;
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    line-height: normal;
                    margin: 0;
                    font-size: 16px;
                  }
                `}
              >
                <p>Data Description*</p>
                <p
                  css={`
                    font-size: 14px;
                  `}
                >
                  {characterCount}/150
                </p>
              </div>
              <div>
                <textarea
                  onChange={handleChange}
                  name="description"
                  maxLength={150}
                  value={props.formDetails.description}
                  data-cy="dataset-metadata-description"
                  css={`
                    border-radius: 10px;
                    border: none;
                    border-bottom: 1px solid #98a1aa;
                    background: #f1f3f5;
                    outline: none;
                    padding: 16px;
                    width: 100%;
                    height: 141px;
                  `}
                />
              </div>
            </div>
          </Grid>
          <div
            css={`
              height: 20px;
            `}
          />
          <Grid lg={5} xs={12} md={5} item>
            <p
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                margin: 0;
                margin-bottom: 9px;

                font-size: 16px;
              `}
            >
              Data Category
            </p>

            <button
              ref={triggerRef}
              onClick={togglePopover}
              onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
              aria-haspopup="menu"
              aria-expanded={!!openState}
              aria-label="filter-button"
              data-cy="dataset-metadata-category"
              css={`
                border-radius: 10px;
                border: none;
                border-bottom: 1px solid #98a1aa;
                background: #f1f3f5;
                outline: none;
                padding: 12.5px 16px;
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                svg {
                  transform: ${openState ? "rotate(-90deg)" : "rotate(90deg)"};
                  margin-left: auto;
                }
                :focus-visible {
                  border-bottom: 1px solid #6061e5;
                }
              `}
            >
              {props.formDetails.category} <ChevronRight />
            </button>
            <Popover
              open={!!openState}
              anchorEl={openState}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              css={`
                .MuiPaper-root {
                  margin-top: 4px;
                  border-radius: 6px;
                  height: auto;
                  border: 1px solid #868e96;
                  background: #f1f3f5;
                  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.25);
                  width: ${triggerRef.current?.offsetWidth}px;
                }
              `}
            >
              <div
                role="menu"
                onKeyDown={handleMenuKeyDown}
                css={`
                  display: flex;
                  flex-direction: column;

                  button {
                    border: none;
                    outline: none;
                    text-align: left;
                    line-height: 20px;
                    font-size: 14px;
                    cursor: pointer;
                    &:focus-visible {
                      border: 2px solid #231d2c;
                      :nth-of-type(3) {
                        border-bottom-left-radius: 6px;
                        border-bottom-right-radius: 6px;
                      }
                    }
                  }
                `}
              >
                <div
                  css={`
                    height: 24px;
                    width: 100%;
                    background: #f1f3f5;
                    padding-left: 4px;
                  `}
                >
                  <CheckMarkIcon />
                </div>
                {datasetCategories.map((option, i) => (
                  <button
                    ref={(el) => (itemRefs.current[i] = el)}
                    role="menuitem"
                    key={option}
                    tabIndex={activeIndex === i ? 0 : -1}
                    onClick={() => {
                      handleChange({
                        target: { name: "category", value: option },
                      });
                      closeMenu();
                    }}
                    css={`
                      padding: 1px 16px 1px 22px;
                      height: 20px;
                      display: flex;
                      align-items: center;
                      margin-bottom: 2px;
                    `}
                    data-cy="dataset-metadata-category-option"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </Popover>
          </Grid>
          <Grid lg={7} xs={12} md={7} item>
            <p
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                margin: 0;
                margin-bottom: 9px;

                font-size: 16px;
              `}
            >
              Source of Your Data
            </p>
            <input
              type="text"
              onChange={handleChange}
              name="source"
              value={props.formDetails.source}
              data-cy="dataset-metadata-source"
              data-testid="Source-of-the-data"
              css={`
                border-radius: 10px;
                border: none;
                border-bottom: 1px solid #98a1aa;
                background: #f1f3f5;
                outline: none;
                padding: 14px 16px;
                width: 100%;
              `}
            />
          </Grid>
          <Grid lg={12} xs={12} md={12} item>
            <p
              css={`
                color: #231d2c;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
                margin: 0;
                font-size: 16px;
                margin-bottom: 9px;
              `}
            >
              Source Link*
            </p>
            <input
              type="text"
              onChange={handleChange}
              name="sourceUrl"
              data-cy="dataset-metadata-link"
              data-testid="Link-to-data-source"
              value={props.formDetails.sourceUrl}
              // ref={}
              css={`
                border-radius: 10px;
                border: none;
                border-bottom: 1px solid #98a1aa;
                background: #f1f3f5;
                outline: none;
                padding: 14px 16px;
                width: 100%;
              `}
            />
            {/* <CssTextField
              id="outlined-basic"
              label="Link to data source"
              variant="filled"
              onChange={handleChange}
              name="sourceUrl"
              helperText={props.errorState.sourceUrl.message}
              fullWidth
              data-cy="dataset-metadata-link"
              inputProps={{
                "data-testid": "Link-to-data-source",
              }}
              inputRef={(input) =>
                input && props.errorState.sourceUrl.state && input.focus()
              }
              value={props.formDetails.sourceUrl}
            /> */}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
