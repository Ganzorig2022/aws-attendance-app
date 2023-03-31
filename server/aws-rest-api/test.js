const { calculateTime } = require('./utils/calculateTime');

async function a() {
  const { subtractedTime, arriveDescription } = await calculateTime();

  console.log('subtractedTime>>>>>>>>', subtractedTime);
  console.log('arriveDescription>>>>>>>>', arriveDescription);
}

a();
