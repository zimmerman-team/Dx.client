import React from "react";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import {
  templates,
  TemplateItem,
  StoryInitialViewProps,
  StoryTemplateModel,
} from "app/modules/story-module/views/initial/data";
import { StoryModel, emptyStory } from "app/modules/story-module/data";
import StoriesGrid from "app/modules/home-module/components/AssetCollection/Stories/storiesGrid";
import { useHistory } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useMount, useTitle, useUpdateEffect } from "react-use";
import { isEmpty } from "lodash";
import Filter from "app/modules/home-module/components/Filter";
import { useMediaQuery } from "@material-ui/core";

function StoryInitialView(props: Readonly<StoryInitialViewProps>) {
  useTitle("Dataxplorer - New Story");

  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const [storiesView, setStoriesView] = React.useState<"grid" | "table">(
    "grid"
  );
  const [searchValue, setSearchValue] = React.useState<undefined | string>(
    undefined
  );
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = React.useState("updatedDate");
  const [filterValue, setFilterValue] = React.useState("allAssets");

  const storyCreateSuccess = useStoreState(
    (state) => state.stories.StoryCreate.success
  );

  const storyCreateData = useStoreState(
    (state) => (state.stories.StoryCreate.crudData ?? emptyStory) as StoryModel
  );
  const clearStoryEdit = useStoreActions(
    (actions) => actions.stories.StoryUpdate.clear
  );
  const clearStoryCreate = useStoreActions(
    (actions) => actions.stories.StoryCreate.clear
  );
  const handleTemplateSelected = (option: StoryTemplateModel) => {
    props.handleSetButtonActive(option.value);
  };

  React.useEffect(() => {
    props.resetStory();
  }, []);

  useMount(() => {
    clearStoryCreate();
    clearStoryEdit();
  });

  useUpdateEffect(() => {
    if (storyCreateSuccess && !isEmpty(storyCreateData?.id)) {
      history.push(`/story/${storyCreateData.id}/edit`);
    }
  }, [storyCreateSuccess, storyCreateData]);

  return (
    <Container maxWidth="lg">
      <div>
        <h4
          css={`
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 24px;
            font-weight: 400;
            color: #231d2c;
            margin: 0;
          `}
        >
          Select your story template
        </h4>
      </div>
      <div
        css={`
          height: 48px;
        `}
      />
      <Grid container spacing={isMobile ? 4 : 7} justifyContent="space-between">
        {templates.map((option) => (
          <Grid key={option.value} item lg={"auto"} md={4} sm={6} xs={12}>
            <TemplateItem
              name={option.name}
              value={option.value}
              available={option.available}
              description={option.description}
              templateImg={option.templateImg}
              handleClick={() => handleTemplateSelected(option)}
            />
          </Grid>
        ))}
      </Grid>
      <div
        css={`
          height: 114px;
        `}
      />
      <hr
        css={`
          border: 0.1px solid #adb5bd;
        `}
      />
      <div
        css={`
          height: 81px;
        `}
      />
      <Grid
        container
        alignContent="space-between"
        alignItems="center"
        css={`
          width: 100%;
          margin-bottom: 44px;
        `}
      >
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <h4
            css={`
              font-size: 18px;
              line-height: 22px;
              color: #000000;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            Explore or duplicate stories
          </h4>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Filter
            searchValue={searchValue as string}
            setSearchValue={setSearchValue}
            setSortValue={setSortValue}
            setAssetsView={setStoriesView}
            sortValue={sortValue}
            assetsView={storiesView}
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            searchIconCypressId="open-search-button"
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            hasSearch
          />
        </Grid>
      </Grid>
      <StoriesGrid
        sortBy={sortValue}
        searchStr={searchValue as string}
        view={storiesView}
        showMenuButton
      />
    </Container>
  );
}

export default StoryInitialView;
