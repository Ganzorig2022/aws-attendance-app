import axios from 'axios';

const checkImage = async (prefix: string, userId: string) => {
  const endpoint = process.env.NEXT_PUBLIC_AWS_CHECK_IMAGE!;
  const query = `${prefix}-${userId}.jpg`; // extension,,,,,,DYNAMIC SOLUTION!!!!!!!!!!!!!!!!!!!!

  const url = `${endpoint}/${query}`;

  const response = await axios.get(url);

  return response;
};

export default checkImage;
