import axios from 'axios';

const IMGBB_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
    formData
  );
  return res.data.data.display_url;
};
