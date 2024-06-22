import axios from "axios";
const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_NAME}/auto/upload`;

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-app-file");

  const response = await axios.post(url, formData);

  return response;
};
