import React from 'react';
import { Input } from 'antd';

const InputOnlyNumber = ({ isDecimals = true, canNegative = true, ...props }) => {
  const valid = e => {
    const { value } = e.target;

    let reg = /^-?\d*\.?\d*$/;

    if (isDecimals && canNegative) {
      reg = /^-?\d*\.?\d*$/;
    }

    if (isDecimals && !canNegative) {
      reg = /^\d*\.?\d*$/;
    }

    if (!isDecimals && canNegative) {
      reg = /^-?\d*$/;
    }

    if (!isDecimals && !canNegative) {
      reg = /^\d*$/;
    }

    if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
      props.onChange(value);
    }
  };

  return <Input {...props} onChange={valid} />;
};

export default InputOnlyNumber;
