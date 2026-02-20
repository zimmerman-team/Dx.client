import get from "lodash/get";
import React from "react";

export function getCMSDataField<T>(
  cmsData: T,
  field: keyof T | string,
  defaultValue: string,
  replacements?: Record<string, string | number>
): string;

export function getCMSDataField<T>(
  cmsData: T,
  field: keyof T | string,
  defaultValue: string,
  replacements: Record<string, React.ReactNode>,
  jsx: boolean
): React.ReactNode;

export function getCMSDataField<T>(
  cmsData: T,
  field: keyof T | string,
  defaultValue: string = "",
  replacements: Record<string, React.ReactNode> = {},
  jsx: boolean = false
) {
  const value = get(cmsData, field, defaultValue);

  if (!replacements) return String(value);

  const regex = /{(.*?)}/g;

  if (!jsx) {
    return String(value).replace(regex, (_, key) => {
      return String(replacements[key] ?? "");
    });
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    const [full, key] = match;
    const start = match.index;

    // Push plain text before the placeholder
    if (start > lastIndex) {
      parts.push(value.slice(lastIndex, start));
    }

    // Push replacement (string or ReactNode)
    parts.push(replacements[key] ?? "");

    lastIndex = start + full.length;
  }

  // Push any remaining text
  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}
