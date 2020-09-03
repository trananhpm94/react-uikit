import axios from 'axios';
import { message } from 'antd';

export const hostAPI = process.env.REACT_APP_BE;

export const getHeaderAuthorization = token => {
  const t = !token ? window.localStorage.getItem('app.token') : token;
  return { authorization: `Bearer ${t}` };
};

const messageErrorTrans = {
  'An error occurred while updating the entries. See the inner exception for details.':
    'Thao tác dữ liệu không thành công. Vui lòng kiểm tra lại dữ liệu',
};

const handleMessageError = response => {
  if (!response || !response.status || !response.data || !response.data.reason) {
    return;
  }
  const { status } = response;
  let { reason } = response.data;
  if (status === 422) {
    // reason = reason.substring(reason.indexOf(':') + 2);
    // reason = reason.replace('already exists', 'đã tồn tại');
    // reason = reason.replace('was not found', 'không tồn tại');
  }
  if (status === 500) {
    const messageReason = messageErrorTrans[reason] || reason;
    reason = messageReason;
  }

  if (!reason || reason === '') {
    reason = 'Đã có lỗi xảy ra.Vui lòng thử lại.';
  }
  message.error(reason);
};

export const request = async ({
  prefix,
  url = '',
  method = 'get',
  params,
  data,
  headers = {},
  ...props
}) => {
  try {
    const result = await axios({
      url: `${hostAPI}${prefix || request.prefix || ''}${url}`,
      method,
      data,
      params,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...getHeaderAuthorization(),
        ...headers,
      },
      ...props,
    });
    return result;
  } catch (err) {
    console.log('err', err);
    const { response } = err;
    if (response && response.status === 401) {
      // window.localStorage.clear();
      window.localStorage.setItem('app.Authorization', '');
      window.localStorage.setItem('app.Role', '');
      window.localStorage.setItem('app.token', '');
      window.location.hash = '#login';
    }
    handleMessageError(response);
    throw err;
  }
};

export const requestDownload = async ({
  defaultFileName = 'fileDownload',
  headers = {},
  ...props
}) => {
  try {
    const res = await request({
      ...props,
      responseType: 'blob',
      headers: {
        Accept: '*/*',
        ...headers,
      },
    });
    let fileName = defaultFileName;
    if (res.headers && res.headers['content-disposition']) {
      const contentDisposition = res.headers['content-disposition'];
      const indexFileName = contentDisposition.indexOf('filename=');
      if (indexFileName >= 0) {
        fileName = contentDisposition.substring(indexFileName, contentDisposition.length);
        fileName = fileName.replace('filename="', '');
        fileName = fileName.replace('filename=', '');
        const indexFileNameUTF8 = fileName.indexOf('; filename*=UTF-8');
        if (indexFileNameUTF8 >= 0) {
          fileName = fileName.substring(0, indexFileNameUTF8);
        }
      }
      let indexLastFilename = fileName.indexOf(`"`);
      indexLastFilename = indexLastFilename === -1 ? fileName.length : indexLastFilename;
      fileName = fileName.substring(0, indexLastFilename);
    }
    if (fileName.includes('.pdf')) {
      // const file = new Blob([res.data], {type: 'application/pdf'});
      // const fileURL = window.URL.createObjectURL(file);
      // window.open(fileURL);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
    } else {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    }
    return res;
  } catch (err) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        err.response.data = JSON.parse(reader.result);
        handleMessageError(err.response);
        resolve(Promise.reject(err));
      };
      reader.onerror = () => {
        reject(err);
      };
      reader.readAsText(err.response.data);
    });
  }
};
