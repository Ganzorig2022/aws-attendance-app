import axios from 'axios';

const checkAttendance = async (param: string) => {
  const endpoint = process.env.NEXT_PUBLIC_AWS_CHECK_ATTENDANCE!;

  const url = `${endpoint}/${param}`;

  const response = await axios.get(url);

  return response;
};

export default checkAttendance;
