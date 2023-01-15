class Scroll {
  constructor(options) {}

  target = null;
  animatedElement = null;
  clientRectContainer = 0;

  connect(animatedElement, options) {
    const { container, threshold, scrollPanel } = options;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    this.animatedElement = animatedElement;
    observerOptions.threshold = threshold || 0.96;

    this.setDefaultStyles(container, scrollPanel);
    this.calculateOffsetScrollPanel(container, scrollPanel);
    this.observeInitialize(animatedElement, observerOptions);
    this.setTransformAnimatedElement(container);
  }

  observeInitialize(target, options) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("entry", entry);
          entry.target.style.position = "sticky";
          entry.target.style.top = "0px";
        }
      });
    }, options);
    observer.observe(target);
  }

  setDefaultStyles(container, scrollPanel) {
    container.style.position = "relative";
    scrollPanel.style.transition = "transform 150ms ease-out";
    this.setContainerHeight(container, scrollPanel.clientWidth);
  }

  setContainerHeight(container, width) {
    container.style.height = `${width}px`;
  }

  setTransformAnimatedElement(container) {
    // container.style.transform = `translate3d(0px, 0px, 0px)`;
  }

  calculateOffsetScrollPanel(container, scrollPanel) {
    let rect = scrollPanel.getBoundingClientRect();
    const finishCoords = rect.width - rect.top + container.clientWidth;
    let progress = 0;
    let lastKnownScrollPosition = 0;
    function onScroll() {
      lastKnownScrollPosition = window.scrollY - rect.top;

      if (lastKnownScrollPosition < 0) return;

      progress = (lastKnownScrollPosition / finishCoords) * 100;
      console.log(progress);

      if (progress >= 83.5) return;
      scrollPanel.style.transform = `translate(-${progress}%, 0px)`;
    }

    document.addEventListener("scroll", onScroll);
  }
}

export default new Scroll();
