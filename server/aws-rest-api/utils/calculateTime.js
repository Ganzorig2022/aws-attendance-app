module.exports.calculateTime = async () => {
  let arriveDescription = '';

  const lessonStarts = new Date(); //Fri Mar 31 2023 11:17:09 GMT+0800 (Ulaanbaatar Standard Time)
  lessonStarts.setHours(9, 0, 0); // Fri Mar 31 2023 09:00:00 GMT+0800 (Ulaanbaatar Standard Time)

  const currentTime = Date.now(); // 1680241641521
  const startTime = lessonStarts.getTime(); // 1680241641521
  const subtractedTime = (currentTime - startTime) / 60000; //130 min etc.

  if (subtractedTime > 0 && subtractedTime < 30) {
    arriveDescription = `Та ${subtractedTime} мин хоцорсон байна. Ерөнхийдээ гайгүй байна.`;
  }
  if (subtractedTime < 0) {
    arriveDescription = 'Цагтаа багтаж ирсэн байна.';
  }
  if (subtractedTime > 120) {
    arriveDescription = `За арай арай. Бүхэл бүтэн ${subtractedTime} мин хоцорсон байна штээ.`;
  }

  return { subtractedTime, arriveDescription };
};
