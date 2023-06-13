export const generateRandomArray = (length = 90, max = 90) => {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(Math.ceil(Math.random() * max));
  }
  return arr;
};
