import React from "react";
import { useDXcss } from "app/modules/home-module/sub-modules/partners/style";

export default function DXBlock() {
  return (
    <div css={useDXcss}>
      <p>Partner Case Study: The Global Fund</p>

      <h3>The Global Fund to fight AIDS, Tuberculosis and Malaria</h3>
      <p>
        The Global Fund is a partnership designed to accelerate the end of AIDS,
        tuberculosis and malaria as epidemics. As an international organization,{" "}
        the Global Fund mobilizes and invests more than US$4 billion a year to
        support programs run by local experts in more than 100 countries.{" "}
      </p>
    </div>
  );
}
