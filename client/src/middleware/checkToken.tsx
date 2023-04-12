import axios from 'axios';

const checkToken = async (token: string) => {
  const endpoint = process.env.NEXT_PUBLIC_AWS_CHECK_TOKEN!;

  const url = `${endpoint}/${token}`;

  const response = await axios.get(url);

  return response;
};

export default checkToken;
