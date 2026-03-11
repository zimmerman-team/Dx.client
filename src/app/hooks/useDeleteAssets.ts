import { APPLICATION_JSON } from "@app/state/api";
import { useStoreState } from "@app/state/store/hooks";
import axios from "axios";
import { get } from "lodash";
import React, { useEffect } from "react";

type AssetDeleteItem = { assetType: string; id: string };
type DeleteAssetsRequest = {
  assets?: AssetDeleteItem[];
  deleteAllCharts?: boolean;
  deleteAllDatasets?: boolean;
  deleteAllStories?: boolean;
};

const useDeleteAssets = () => {
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    chartsCount: 0,
    storiesCount: 0,
  });

  async function mutate(body: DeleteAssetsRequest) {
    setLoading(true);
    return await axios
      .post(`${import.meta.env.VITE_API}/assets/delete`, body, {
        headers: {
          "Content-Type": APPLICATION_JSON,
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        setLoading(false);
        setData(response.data);
      })
      .catch(async (error) => {
        console.log("deleteAssets error: " + error);
      });
  }

  return { data, loading, mutate };
};

export default useDeleteAssets;
