import React from "react";
import findIndex from "lodash/findIndex";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {
  CssInputLabel,
  CssSelectField,
  CssTextField,
  metaDatacss,
} from "app/modules/dataset-module/routes/upload-module/style";
import { useLocation } from "react-router-dom";

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
  onSubmit: (data: IFormDetails) => void;
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
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  return (
    <div css={metaDatacss}>
      <div
        css={`
          width: 100%;
        `}
      >
        <Grid container spacing={6}>
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
            {/* <CssTextField
              id="outlined-basic"
              label="Data title*"
              variant="standard"
              helperText="Title must be between 6 and 50 characters in length."
              onChange={handleChange}
              name="name"
              value={props.formDetails.name}
              fullWidth
              data-cy="dataset-metadata-title"
              inputRef={(input) =>
                input && props.errorState.name.state && input.focus()
              }
            /> */}
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

              {/* <CssTextField
                id="outlined-basic"
                label="Brief description of your dataset*  "
                variant="filled"
                fullWidth
                data-cy="dataset-metadata-description"
                multiline
                minRows={3}
                inputProps={{
                  maxLength: 150,
                  "data-testid": "description",
                }}
                onChange={handleChange}
                name="description"
                value={props.formDetails.description}
                inputRef={(input) =>
                  input && props.errorState.description.state && input.focus()
                }
              />
              <p
                css={`
                  position: absolute;
                  bottom: -12px;
                  right: 20px;
                  font-weight: 325;
                  font-size: 12px;
                  color: #231d2c;
                `}
              >
                {characterCount}/150
              </p> */}
            </div>
          </Grid>
          <div
            css={`
              height: 20px;
            `}
          />
          <Grid lg={5} xs={12} md={5} item>
            <SelectCategoryField
              onChange={handleChange}
              setFormDetails={props.setFormDetails}
              formDetails={props.formDetails}
              error={props.errorState.category.state}
            />
          </Grid>
          <Grid lg={7} xs={12} md={7} item>
            <CssTextField
              id="outlined-basic"
              label="Source of the data*"
              variant="filled"
              onChange={handleChange}
              name="source"
              fullWidth
              data-cy="dataset-metadata-source"
              inputProps={{
                "data-testid": "Source-of-the-data",
              }}
              inputRef={(input) =>
                input && props.errorState.source.state && input.focus()
              }
              value={props.formDetails.source}
            />
          </Grid>
          <Grid lg={12} xs={12} md={12} item>
            <CssTextField
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
            />
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
