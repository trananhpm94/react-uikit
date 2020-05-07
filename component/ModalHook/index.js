import React from 'react';
import { Modal } from 'antd';
import useModal from './useModal';

export default ({ id, title = '', ...props }) => {
  const [modalData, , hiddenModal] = useModal(id);
  return (
    <Modal
      title={title}
      visible={modalData.visible}
      onCancel={() => hiddenModal()}
      style={{ top: 20 }}
      {...props}
    >
      {props.children}
    </Modal>
  );
};
