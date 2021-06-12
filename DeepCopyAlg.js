
function superDeep(obj) {
  const clone = {};
  // для new Date() значения в принципе нет необходимости делать проверку, тк в под.большинстве приходит стандарт в примитиве
  if (Array.isArray(obj) == false && typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj) == true) {
    return obj.map((i) => superDeep(i));
  } else if (typeof obj == "object") {
    for (const key in obj) {
      clone[`${key}`] = superDeep(obj[`${key}`]);
    }
  }
  return clone;
}

// функция должна работать исправно. 

const clone = superDeep();
