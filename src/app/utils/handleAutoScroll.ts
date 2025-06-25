export const handleDragOverScroll = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>
) => {
  const scrollElement = document.getElementById("story-edit-view-section");
  if (!scrollElement) return;
  const cursor = { y: e.pageY }; // Cursor YPos
  const papaWindow = window;
  const pxFromTop = papaWindow.scrollY;
  const userScreenHeight = papaWindow.innerHeight;
  const pageHeight = userScreenHeight + pxFromTop;

  const headerHeight = 155;
  const scrollArea = 50;

  if (cursor.y < headerHeight + scrollArea) {
    scrollElement.scrollBy({
      top: -1,
    });
  } else if (pageHeight - cursor.y < scrollArea) {
    scrollElement.scrollBy({
      top: 1,
    });
  }
};
