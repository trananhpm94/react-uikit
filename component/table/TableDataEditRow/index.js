import React, { Component, Fragment } from 'react';
import { Table, Form } from 'antd';
import { BtnEdit, BtnSave, BtnCancel } from '../../button';
import EditableCell, { EditableContext } from './EditableCell';

class TableData extends Component {
  static defaultProps = {
    allowGetData: true,
    rowKey: 'id',
    customBtnAction: false,
  };

  state = {
    editingKey: '',
    data: [],
    loading: false,
    pagination: {
      pageSize: 10,
    },
  };
  componentWillMount = () => {};

  componentDidMount() {
    const { paramSearch } = this.props;
    if (!paramSearch) {
      this.actionGetData(this.props);
    }
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.reload !== this.props.reload) {
      this.actionGetData({ ...nextProps });
    }
    if (nextProps.paramSearch !== this.props.paramSearch) {
      this.actionGetData({ ...nextProps });
    }
  };

  getConfigCol = () => {
    const columns = [...this.props.columns];
    const { rowKey } = this.props;
    columns.push({
      title: 'Thao tác',
      dataIndex: 'operation',
      key: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        const btnAction = editable ? (
          <span>
            <EditableContext.Consumer>
              {form => <BtnSave onClick={() => this.handleClickSave(form, record[rowKey])} />}
            </EditableContext.Consumer>
            <BtnCancel onClick={() => this.handleClickCancel(record[rowKey])} />
          </span>
        ) : (
          <BtnEdit
            disabled={editingKey !== ''}
            onClick={() => this.handleClickEdit(record[rowKey])}
          />
        );

        return (
          <Fragment>
            {!this.props.customBtnAction
              ? btnAction
              : this.props.customBtnAction({ record, editable, btnAction })}
          </Fragment>
        );
      },
    });
    return columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          renderFormItemEdit: col.renderFormItemEdit,
          dataIndex: col.dataIndex,
          editing: this.isEditing(record),
        }),
      };
    });
  };

  actionGetData = async (props, { page } = {}) => {
    const { allowGetData, paramSearch, service } = props;
    if (this.state.loading || !allowGetData) {
      return;
    }
    this.setState({
      loading: true,
    });
    try {
      const res = await service({ page, ...paramSearch });
      const pagination = { ...this.state.pagination };
      pagination.total = res.data.totalResults;
      this.setState({
        data: res.data.items,
        loading: false,
        pagination,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };

  handleClickCancel = () => {
    this.setState({ editingKey: '' });
  };

  handleClickEdit(key) {
    this.setState({ editingKey: key });
  }

  handleClickSave = (form, key) => {
    form.validateFields(async (error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item[this.props.rowKey]);
      if (index === -1) {
        console.error(`Không tìm thấy data key[${key}]`);
        return;
      }
      const item = newData[index];
      const newItem = { ...item, ...row };
      // handle save  data
      let itemSaved = newItem;
      if (this.props.handleSaveRowData) {
        itemSaved = await this.props.handleSaveRowData(newItem, item);
      }
      if (!itemSaved) {
        return;
      }
      newData.splice(index, 1, itemSaved);
      this.setState({ data: newData, editingKey: '' });
    });
  };

  handleTableChange = pagination => {
    this.actionGetData(this.props, { page: pagination.current });
  };

  isEditing = record => record[this.props.rowKey] === this.state.editingKey;

  render() {
    const columns = this.getConfigCol();
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          {...this.props}
          bordered
          scroll={{ x: true }}
          components={components}
          loading={this.state.loading}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
          dataSource={this.state.data}
          columns={columns}
        />
      </EditableContext.Provider>
    );
  }
}

export default Form.create()(TableData);
