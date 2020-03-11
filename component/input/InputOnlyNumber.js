import React, { Component } from 'react';
import { Input } from 'antd';

export default class InputOnlyNumber extends Component {
  state = {};
  // eslint-disable-next-line consistent-return
  onChange = e => {
    const { value } = e.target;
    console.log('value', value);
    if (parseInt(value) > 100 && this.props.persent) return false;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
      this.props.onChange(value);
    }
  };
  render() {
    return <Input {...this.props} onChange={this.onChange} onBlur={this.onBlur} />;
  }
}
