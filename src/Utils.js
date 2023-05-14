import axios from "axios";

const getData = async (url) => {
  return await axios.get(url);
};

const postData = async (url, obj) => {
  return await axios.post(url, obj);
};

const putData = async (url, obj) => {
  return await axios.put(url, obj);
};

const deleteData = async (url) => {
  return await axios.delete(url);
};

export default { getData, postData, putData, deleteData };