import React from "react";
import get from "lodash/get";
import { useUpdateEffect } from "react-use";
import { useStoreActions, useStoreState } from "@app/state/store/hooks";
import { CMSDataValueModel } from "@app/state/api/action-reducers/sync";

interface UseCMSDataProps {
  loadData?: boolean;
  returnData?: boolean;
}

export function useCMSData(props: UseCMSDataProps) {
  const cmsData = useStoreState((state) => state.CMSData.value);
  const setCMSData = useStoreActions((actions) => actions.CMSData.setValue);

  const currentLanguage = "en";
  // COMPONENTS
  const componentsFooterCMSAction = useStoreActions(
    (actions) => actions.cms.componentsFooter.fetch
  );
  const componentsFooterCMSData = useStoreState(
    (state) => state.cms.componentsFooter.data
  );
  const componentsHeaderCMSAction = useStoreActions(
    (actions) => actions.cms.componentsHeader.fetch
  );
  const componentsHeaderCMSData = useStoreState(
    (state) => state.cms.componentsHeader.data
  );

  // PAGES

  const pagesHomeCMSAction = useStoreActions(
    (actions) => actions.cms.pagesHome.fetch
  );
  const pagesHomeCMSData = useStoreState((state) => state.cms.pagesHome.data);

  const pagesDashboardCMSAction = useStoreActions(
    (actions) => actions.cms.pagesDashboard.fetch
  );
  const pagesDashboardCMSData = useStoreState(
    (state) => state.cms.pagesDashboard.data
  );

  const pagesAboutCMSAction = useStoreActions(
    (actions) => actions.cms.pagesAbout.fetch
  );
  const pagesAboutCMSData = useStoreState((state) => state.cms.pagesAbout.data);

  const pagesWhyDataxplorerCMSAction = useStoreActions(
    (actions) => actions.cms.pagesWhyDataxplorer.fetch
  );
  const pagesWhyDataxplorerCMSData = useStoreState(
    (state) => state.cms.pagesWhyDataxplorer.data
  );

  const pagesPricingCMSAction = useStoreActions(
    (actions) => actions.cms.pagesPricing.fetch
  );
  const pagesPricingCMSData = useStoreState(
    (state) => state.cms.pagesPricing.data
  );

  const pagesPartnersCMSAction = useStoreActions(
    (actions) => actions.cms.pagesPartners.fetch
  );
  const pagesPartnersCMSData = useStoreState(
    (state) => state.cms.pagesPartners.data
  );

  const pagesContactCMSAction = useStoreActions(
    (actions) => actions.cms.pagesContact.fetch
  );
  const pagesContactCMSData = useStoreState(
    (state) => state.cms.pagesContact.data
  );

  const pagesWebinarCMSAction = useStoreActions(
    (actions) => actions.cms.pagesWebinar.fetch
  );
  const pagesWebinarCMSData = useStoreState(
    (state) => state.cms.pagesWebinar.data
  );

  React.useEffect(() => {
    if (props.loadData) {
      // COMPONENTS

      componentsFooterCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      componentsHeaderCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
      // PAGES

      pagesHomeCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesDashboardCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesAboutCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesWhyDataxplorerCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesPricingCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesPartnersCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesContactCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });

      pagesWebinarCMSAction({
        isCMSfetch: true,
        filterString: `locale=${currentLanguage}`,
      });
    }
  }, []);

  function formatCMSData() {
    let newData = {};
    const items = [
      // COMPONENTS
      {
        key: "componentsFooter",
        data: componentsFooterCMSData || null,
      },
      {
        key: "componentsHeader",
        data: componentsHeaderCMSData || null,
      },
      // PAGES
      {
        key: "pagesHome",
        data: pagesHomeCMSData || null,
      },
      {
        key: "pagesDashboard",
        data: pagesDashboardCMSData || null,
      },
      {
        key: "pagesAbout",
        data: pagesAboutCMSData || null,
      },
      {
        key: "pagesWhyDataxplorer",
        data: pagesWhyDataxplorerCMSData || null,
      },
      {
        key: "pagesPricing",
        data: pagesPricingCMSData || null,
      },
      {
        key: "pagesPartners",
        data: pagesPartnersCMSData || null,
      },
      {
        key: "pagesContact",
        data: pagesContactCMSData || null,
      },
      {
        key: "pagesWebinar",
        data: pagesWebinarCMSData || null,
      },
    ];
    items.forEach((item) => {
      newData = {
        ...newData,
        [item.key]: get(item, "data.data"),
      };
    });
    setCMSData(newData as CMSDataValueModel);
  }

  useUpdateEffect(() => {
    if (props.loadData) {
      formatCMSData();
    }
  }, [
    // COMPONENTS
    componentsFooterCMSData,
    componentsHeaderCMSData,

    // PAGES
    pagesHomeCMSData,
    pagesDashboardCMSData,
    pagesAboutCMSData,
    pagesWhyDataxplorerCMSData,
    pagesPricingCMSData,
    pagesPartnersCMSData,
    pagesContactCMSData,
    pagesWebinarCMSData,
  ]);

  if (props.returnData) {
    return cmsData;
  }

  return null;
}
