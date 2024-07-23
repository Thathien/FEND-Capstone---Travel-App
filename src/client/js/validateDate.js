/**
 * Count the number of days from start date and end date
 * @param {*} d1
 * @param {*} d2
 * @returns number Day
 */
const validateDate = (d1, d2) => {
    let dTime1 = new Date(d1).getTime();
    let dTime2 = new Date(d2).getTime();
    const dayInMs = 24 * 60 * 60 * 1000;
  
    return parseInt((dTime2 - dTime1) / dayInMs);
  };

  
  export { validateDate }