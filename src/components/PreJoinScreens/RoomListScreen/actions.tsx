import axios from 'axios';
//Get cors error doing it this way. So using the expressjs server
// export const getRooms = async (token: string) => {
//   if (!token) {
//     return;
//   }
//   try {
//     const response = await axios.get('https://videopolis.development.telmediq.com/api/videopolis/rooms/', {
//       headers: { access_token: token },
//     });
//     if (response.status === 200 && response.data.results) {
//       return response.data.results;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
export const getRooms = async (token: string) => {
  if (!token) {
    return;
  }
  try {
    const response = await axios.get('/getRooms', {
      params: { token },
    });
    if (response.status === 200 && response.data.results) {
      return response.data.results;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getRoomDetails = async (token: string, roomIdentity: string) => {
  if (!token || !roomIdentity) {
    return;
  }
  try {
    const response = await axios.get('/getRoomDetails', {
      params: { roomIdentity, token },
    });
    if (response.status === 200 && response.data) {
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getTwilioToken = async (token: string, roomIdentity: string, participantIdentity: string) => {
  if (!token || !roomIdentity || !participantIdentity) {
    return;
  }
  try {
    const response = await axios.get('/getTwilioToken', {
      params: { token, roomIdentity, participantIdentity },
    });
    if (response.status === 200 && response.data) {
      return response.data;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
