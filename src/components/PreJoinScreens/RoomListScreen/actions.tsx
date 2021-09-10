import axios from 'axios';
export const getRooms = async (token: string) => {
  if (!token) {
    return;
  }
  try {
    const response = await axios.get('https://videopolis.development.telmediq.com/api/videopolis/rooms/', {
      headers: { access_token: token },
    });
    if (response.status === 200 && response.data.results) {
      return response.data.results;
    }
  } catch (err) {
    console.log(err);
  }
};
