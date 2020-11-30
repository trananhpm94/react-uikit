export const onAppearElement = (el, callback) => {
  const stepTime = 100;
  const maxTime = 2000;
  let totalTime = 0;
  const intervalCheck = setInterval(() => {
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
