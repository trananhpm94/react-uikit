import React, { Component } from 'react';
import { Table } from 'antd';

export default class TableData extends Component {
  static defaultProps = {
    allowGetData: true,
  };

  state = {
    data: [],
    loading: false,
    pagination: {
      pageSize: 10,
    },
    // page: 0,
  };

  componentDidMount() {
    const { paramSearch } = this.props;
    if (!paramSearch) {
      this.actionGetData(this.props);
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.clear !== 0 && nextProps.clear !== this.props.clear) {
      this.setState({
        data: [],
        loading: false,
        pagination: {
          pageSize: 10,
        },
      });
      return;
    }
    if (nextProps.reload !== this.props.reload) {
      this.actionGetData({ ...nextProps });
      this.setState({ pagination: { ...this.state.pagination, ...{ current: 1 } } });
    }
    if (nextProps.paramSearch !== this.props.paramSearch) {
      this.actionGetData({ ...nextProps });
    }
  };

  handleTableChange = pagination => {
    this.actionGetData(this.props, { page: pagination.current });
  };

  actionGetData = async (props, { page } = { pageSize: 10 }) => {
    const { allowGetData, paramSearch, service } = props;

    if (this.state.loading || !allowGetData) {
      return;
    }

    this.setState({
      loading: true,
    });
    const res = await service({ page, ...paramSearch });
    const pagination = { ...this.state.pagination };
    pagination.total = res.data.totalResults;
    pagination.current = page;
    if (this.props.dataTable) {
      this.props.dataTable(res.data.items);
    }
    this.setState({
      data: res.data.items,
      loading: false,
      pagination,
    });
  };

  render() {
    return (
      <Table
        bordered
        scroll={{ x: true }}
        loading={this.state.loading}
        pagination={this.state.pagination}
        onChange={this.handleTableChange}
        dataSource={this.state.data}
        columns={this.props.columns}
        {...this.props}
      />
    );
  }
}
