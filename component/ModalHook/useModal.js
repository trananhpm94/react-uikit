import { useDispatch, useSelector } from 'react-redux';

export default (modalId) => {
  const modalData = useSelector((state) => state.compModalHook[modalId]);
  const dispatchModalHook = useDispatch().compModalHook;

  const showModal = (data) => {
    dispatchModalHook.showModal(modalId, data);
  };

  const hiddenModal = (data) => {
    dispatchModalHook.hiddenModal(modalId, data);
  };
  return [modalData, showModal, hiddenModal];
};
