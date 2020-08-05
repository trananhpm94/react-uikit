export const actionGetData = async ({
  props,
  page,
  pageSize,
  loading,
  setLoading,
  setData,
  setPagination,
}) => {
  const {
    allowGetData,
    paramSearch,
    service,
    handleGetDataResponse,
    getPageIndexForSevice,
  } = props;
  if (!service || loading || !allowGetData) return;
  setLoading(true);
  try {
    const res = await service({
      page: getPageIndexForSevice(page) || 0,
      size: pageSize,
      ...paramSearch,
    });
    const { content, total } = handleGetDataResponse(res);
    const pagination = { total, current: page };
    setData(content);
    setPagination(pagination);
  } finally {
    setLoading(false);
  }
};
