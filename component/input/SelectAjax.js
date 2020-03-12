import React, { Component } from 'react';
import { Select } from 'antd';
import { objectEquals } from 'react-uikit/utils/functionUtil';
import { SelectAjax as defaultConfig } from 'react-uikit/config';

let defaultProps = defaultConfig;
try {
  const { SelectAjax: customConfig } = require('react-uikit-config').default;
  defaultProps = { ...defaultProps, ...customConfig };
} catch (e) {}

const { Option } = Select;
export default class SelectAjax extends Component {
  static defaultProps = {
    keyValue: 'id',
    keyLabel: 'name',
    handleGetDataResponse: res => res.data.content,
    allowClear: true,
    allowGetData: true,
    allowGetObjSelected: false,
    typeValue: 'string',
    ...defaultConfig,
  };
  state = {
    data: [],
    loading: false,
  };

  componentDidMount = () => {
    this.actionGetData(this.props);
  };

  componentWillReceiveProps = nextProps => {
    if (!objectEquals(nextProps.params, this.props.params)) {
      this.actionGetData(nextProps);
    }
    this.checkValueNumber(nextProps);
  };

  setObjSelected = value => {
    const { allowGetObjSelected, form } = this.props;
    if (!allowGetObjSelected && !form) {
      return;
    }
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      [this.createFieldObjSelectedName()]:
        this.state.data.filter(item => value === this.valueOpt(item))[0] || {},
    });
  };

  checkValueNumber = props => {
    const { value, typeValue, onChange } = props;
    if (typeValue === 'string') {
      return;
    }
    if (!value || typeof value === 'number') {
      return;
    }
    if (typeValue === 'int') {
      const numberValue = parseInt(value);
      onChange(numberValue);
    }
  };

  createFieldObjSelectedName = () => {
    const { name: fieldName } = this.props['data-__field'];
    return `objSelected.${fieldName}`;
  };

  createFieldObjSelected = () => {
    const { allowGetObjSelected, form } = this.props;
    if (!allowGetObjSelected && !form) {
      return;
    }
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator(this.createFieldObjSelectedName(), { initialValue: {} });
  };

  removeValue = () => {
    const { name: fieldName } = this.props['data-__field'];
    const { setFieldsValue, value } = this.props;
    if (value && setFieldsValue) {
      setFieldsValue({ [fieldName]: undefined });
    }
  };

  actionGetData = async (props = {}) => {
    this.removeValue();
    const { allowGetData, params, service, handleGetDataResponse } = props;
    if (!allowGetData) {
      this.setState({
        data: [],
      });
      return;
    }
    this.setState({
      loading: true,
    });
    const res = await service({ ...params });
    const data = handleGetDataResponse(res);
    this.setState(
      {
        data,
        loading: false,
      },
      () => {
        this.checkValueNumber(props);
        this.setObjSelected(props.value);
      }
    );
  };

  valueOpt = item => {
    const { keyValue, setValue } = this.props;
    const value = setValue ? setValue(item) : item[keyValue];
    return value;
  };

  labelOpt = item => {
    const { keyLabel, setLabel } = this.props;
    return setLabel ? setLabel(item) : item[keyLabel];
  };

  handleSelectChange = value => {
    this.props.onChange(value);
    this.setObjSelected(value);
  };

  render() {
    const { data, loading } = this.state;
    this.createFieldObjSelected();
    return (
      <Select
        showSearch
        style={{ width: '100%' }}
        loading={loading}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        {...this.props}
        onChange={this.handleSelectChange}
      >
        {data.map(item => (
          <Option key={this.valueOpt(item)} value={this.valueOpt(item)}>
            {this.labelOpt(item)}
          </Option>
        ))}
      </Select>
    );
  }
}
