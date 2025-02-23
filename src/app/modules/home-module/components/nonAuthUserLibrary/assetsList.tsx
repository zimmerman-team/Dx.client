import React from "react";
import AssetsGrid from "app/modules/home-module/components/AssetCollection/All/assetsGrid";

export default function AssetsList() {
  return (
    <div
      css={`
        margin-top: 32px;
        @media (max-width: 960px) {
          padding: 0 32px;
        }
        @media (max-width: 744px) {
          padding: 0 16px;
        }
      `}
    >
      <AssetsGrid sortBy={"updatedDate"} searchStr={""} view={"grid"} />
    </div>
  );
}
