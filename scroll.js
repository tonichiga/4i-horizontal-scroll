class Scroll {
  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  start = "0vh";
  top = 0;
  finishCoords = 0;
  target = null;
  observer = null;
  root = null;
  parentTarget = null;
  onScrollEvent = null;
  direction = "left";
  pagePositionY = 0;

  connect({ root, target, start = 0, onScrollEvent }) {
    this.start = start;
    this.target = target;
    this.root = root;
    this.onScrollEvent = onScrollEvent;
    this.setDefaultStyles();
    this.calculateOffsettarget();
    this.resizeInit();
  }

  setDefaultStyles() {
    const parentNode = this.target.parentNode;
    const wrapper = document.createElement("div");
    parentNode.replaceChild(wrapper, this.target);
    wrapper.appendChild(this.target);
    this.parentTarget = wrapper;

    this.root.style.position = "relative";
    this.root.style.width = "100%";
    this.target.style.transition = "transform 150ms ease-out";
    document.body.style.overflowX = "hidden";

    this.parentTarget.style.display = "block";
    this.parentTarget.style.position = "sticky";
    this.parentTarget.style.overflow = "hidden";
    this.parentTarget.style.top = this.start;
    this.parentTarget.style.minHeight = `70vh`;

    this.setRootHeight();
  }

  setRootHeight() {
    const height = this.target.clientWidth - window.innerWidth;
    const percent = height * 0.05;
    this.root.style.height = `${height + percent}px`;
  }

  calculateOffsettarget() {
    let rect = this.target.getBoundingClientRect();
    this.top = rect.top + window.scrollY;
    this.finishCoords = rect.width - window.innerHeight;

    this.onScroll();
  }

  handleScroll() {
    const lastKnownScrollPosition = window.scrollY - this.top;
    let differenceOffset =
      (this.root.clientWidth / this.target.clientWidth) * 100;
    const offset = 100 - differenceOffset;

    if (lastKnownScrollPosition < 0) return;

    if (this.pagePositionY > lastKnownScrollPosition) {
      //direction
      this.direction = "left";
    } else {
      this.direction = "right";
    }

    this.pagePositionY = lastKnownScrollPosition;

    let progress = (lastKnownScrollPosition / this.finishCoords) * 100;
    let progressWithOffset = (progress / offset) * 100;

    if (typeof this.onScrollEvent === "function") {
      this.onScrollEvent(progressWithOffset);
    }

    if (progress >= offset) {
      progress = offset;
    }

    if (Math.abs(progress) < 3) {
      progress = 0;
    }

    this.scrollAnimation(this.target, progress, this.duration);
  }

  onScroll() {
    document.addEventListener("scroll", this.handleScroll);
  }

  disconnect() {
    document.removeEventListener("scroll", this.handleScroll);
  }

  observe({ target, options, onEntryCallback }) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
      ...options,
    };

    this.observeInitialize(target, observerOptions, onEntryCallback);
  }

  unobserve() {
    if (this.observer) {
      this.observer.unobserve(this.parentTarget);
    }
  }

  observeInitialize(target, options, cb) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (typeof cb === "function") {
          cb(entry);
        }

        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (Array.isArray(target)) {
      target.forEach((item) => {
        if (item) {
          this.observer.observe(item);
        }
      });
    } else {
      this.observer.observe(target);
    }
  }

  resizeHandler() {
    this.setRootHeight();
    this.calculateOffsettarget();
  }

  resizeInit() {
    window.addEventListener("resize", this.resizeHandler);
  }

  scrollAnimation(target, to, duration = 150) {
    target.style.transform = `translate3d(-${to}%, 0, 0)`;
  }
}

export default Scroll;
