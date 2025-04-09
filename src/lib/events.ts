const EVENTS = {
  DRAW_CARD: "draw-card",
};

const drawCardEvent = () => {
  const event = new CustomEvent(EVENTS.DRAW_CARD);
  window.dispatchEvent(event);
};

export { EVENTS, drawCardEvent };
