const EVENTS = {
  DRAW_CARD: "draw-card",
  CLOSE_CARD: "close-card",
};

const drawCardEvent = () => {
  const event = new CustomEvent(EVENTS.DRAW_CARD);
  window.dispatchEvent(event);
};

const closeCardEvent = () => {
  const event = new CustomEvent(EVENTS.CLOSE_CARD);
  window.dispatchEvent(event);
};

export { EVENTS, drawCardEvent, closeCardEvent };
