export const scrollToTop = () => {
    const container =
      document.querySelector("#dashboardContent") || document.scrollingElement;
    container?.scrollTo({ top: 0, behavior: "smooth" });
  };
  