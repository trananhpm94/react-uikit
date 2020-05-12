export const groupBy = (source, key) => {
  return source.reduce((rv, item) => {
    (rv[item[key]] = rv[item[key]] || []).push(item);
    return rv;
  }, {});
};

export const distinctByKey = (array, key) => {
  return [...new Map(array.map((item) => [item[key], item])).values()];
};
