import { useDispatch, useSelector } from 'react-redux';

export default (modalId) => {
  const modalData = useSelector((state) => state.compModalHook[modalId]);
  const dispatchModalHook = useDispatch().compModalHook;
  const { showModal, hiddenModal } = dispatchModalHook.showModal;
  return [modalData, showModal, hiddenModal];
};
