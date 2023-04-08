// const { calculateTime } = require('./utils/calculateTime');

// async function a() {
//   const { subtractedTime, arriveDescription } = await calculateTime();

//   console.log('subtractedTime>>>>>>>>', subtractedTime);
//   console.log('arriveDescription>>>>>>>>', arriveDescription);
// }

// a();

const { randomImageName } = require('./utils/randomImageName');

const fileExtension = 'png';
const random = `${randomImageName(10)}.${fileExtension}`;

console.log(random); // 7f4a7081b700dfe9bf8c
