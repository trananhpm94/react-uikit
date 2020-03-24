export default {
  handleGetDataResponse: res => ({
    content: res.data.content,
    total: res.data.totalElements,
  }),
};
