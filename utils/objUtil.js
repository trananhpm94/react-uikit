export const pick = (sourceObject, keys) => {
  if (!sourceObject) {
    return sourceObject;
  }
  const newObject = {};
  (keys || []).forEach(key => {
    if (typeof key === 'string') {
      newObject[key] = sourceObject[key];
    } else if (typeof key === 'object') {
      Object.entries(key).forEach(([oldKey, newKey]) => {
        newObject[newKey] = sourceObject[oldKey];
      });
    }
  });
  return newObject;
};
