export const pick = (sourceObject, keys) => {
  if (!sourceObject) {
    return sourceObject;
  }
  const newObject = {};
  (keys || []).forEach(key => {
    newObject[key] = sourceObject[key];
  });
  return newObject;
};
