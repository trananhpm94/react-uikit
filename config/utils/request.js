import { message } from 'antd';
export default {
  // default exception ApiError
  handleRequestError: response => {
    if (!response || !response.data || !response.data.message || response.data.message === '') {
      return;
    }
    message.error(response.data.message);
  },
};
