import React, { Component } from 'react';
import { InputNumber } from 'antd';
import { moneyToString, stringToMoney } from 'utils/formatUtil';

export default class InputMoney extends Component {
  state = {};
  render() {
    return (
      <InputNumber
        formatter={moneyToString}
        parser={stringToMoney}
        ref={this.props.refInput}
        {...this.props}
      />
    );
  }
}
