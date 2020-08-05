
export const actionGetData = async ({props, { page } = { pageSize: 10 }) => {
  const {
    allowGetData,
    paramSearch,
    service,
    handleGetDataResponse,
    getPageIndexForSevice,
  } = props;

  if (!service) {
    return;
  }

  if (this.state.loading || !allowGetData) {
    return;
  }

  this.setState({
    loading: true,
  });
  try {
    const res = await service({
      page: getPageIndexForSevice(page) || 0,
      size: this.state.pagination.pageSize,
      ...paramSearch,
    });
    const { content, total } = handleGetDataResponse(res);
    const pagination = { ...this.state.pagination };
    pagination.total = total;
    pagination.current = page;
    this.setState({
      data: content,
      pagination,
    });
  } finally {
    this.setState({
      loading: false,
    });
  }
};
