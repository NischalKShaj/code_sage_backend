// file for the retry wait utility function

export const retryWait = (delay) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};
