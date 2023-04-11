import axios from 'axios';

const checkUser = async (param: string) => {
  const endpoint = process.env.NEXT_PUBLIC_AWS_CHECK_SIGNUP_USER!;

  const url = `${endpoint}/${param}`;

  const response = await axios.get(url);

  return response;
};

export default checkUser;
