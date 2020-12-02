export const onAppearElement = (getEl, callback) => {
  const stepTime = 100;
  const maxTime = 2000;
  let totalTime = 0;
  const intervalCheck = setInterval(() => {
    const el = getEl();
    if (totalTime > maxTime) {
      clearInterval(intervalCheck);
    }
    if (el) {
      callback();
      clearInterval(intervalCheck);
    }
    totalTime += stepTime;
  }, stepTime);
};
