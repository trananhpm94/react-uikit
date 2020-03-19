export const getConfig = path => {
  let defaultConfig = require('react-uikit/' + path).default;
  try {
    const customConfig = require('react-uikit-config/' + path);
    defaultConfig = { ...defaultConfig, ...customConfig };
  } catch (e) {}
  return defaultConfig;
};
