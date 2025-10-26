import React, {
  useState,
  useRef,
  useEffect,
  ReactElement,
  ChangeEvent,
  KeyboardEvent,
  ComponentType,
} from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import EditorUtils from "@draft-js-plugins/utils";
import { EditorState } from "draft-js";
import URLUtils from "app/modules/common/RichEditor/anchor/utils/URLUtils";
import { AnchorPluginTheme } from "app/modules/common/RichEditor/anchor/theme";
import { getEntityKey } from "app/utils/draftjs/getEntityKey";

export interface OverrideContentProps {
  getEditorState: () => EditorState;
  setEditorState: (editorState: EditorState) => void;
  onOverrideContent: (content: ComponentType<unknown> | undefined) => void;
}

interface AddLinkFormParams extends OverrideContentProps {
  validateUrl?(url: string): boolean;
  theme: AnchorPluginTheme;
  placeholder?: string;
}

const getHrefFromEditorState = (
  editorState: EditorState
): string | undefined => {
  const entityKey = getEntityKey(editorState);
  const contentState = editorState.getCurrentContent();

  const entity = entityKey ? contentState.getEntity(entityKey) : null;
  const entityData = entity ? entity.getData() : undefined;
  return entityData?.url;
};

const AddLinkForm = (props: AddLinkFormParams): ReactElement => {
  const href = getHrefFromEditorState(props.getEditorState());
  const isUrl = (urlValue: string): boolean => {
    if (props.validateUrl) {
      return props.validateUrl(urlValue);
    }

    return URLUtils.isUrl(urlValue);
  };

  const [value, setValue] = useState(href ?? "");
  const [isValid, setIsValid] = useState(isUrl(href!!));

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current!.focus();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    setIsValid(isUrl(URLUtils.normalizeUrl(newValue)));
    setValue(newValue);
  };

  const onClose = (): void => props.onOverrideContent(undefined);

  const submit = (): void => {
    const { getEditorState, setEditorState } = props;

    let url = value;

    if (!URLUtils.isMail(URLUtils.normaliseMail(url))) {
      url = URLUtils.normalizeUrl(url);
      if (!isUrl(url)) {
        setIsValid(false);
        return;
      }
    } else {
      url = URLUtils.normaliseMail(url);
    }
    setEditorState(EditorUtils.createLinkAtSelection(getEditorState(), url));
    input.current!.blur();
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  const { theme, placeholder } = props;
  const className = isValid
    ? theme.input
    : clsx(theme.input, theme.inputInvalid);

  return (
    <input
      css={`
        height: 34px;
        width: 220px;
        padding: 0 12px;
        font-size: 15px;
        font-family: inherit;
        background-color: transparent;
        border: none;
        color: ${!isValid ? "#e65757" : "#444"};
        &:focus {
          outline: none;
        }
        &::placeholder {
          color: #888;
        }
      `}
      onBlur={onClose}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      ref={input}
      type="text"
      value={value}
    />
  );
};

AddLinkForm.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  getEditorState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  setEditorState: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  onOverrideContent: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  validateUrl: PropTypes.func,
};

AddLinkForm.defaultProps = {
  placeholder: "Enter a URL and press enter",
};

export default AddLinkForm;
