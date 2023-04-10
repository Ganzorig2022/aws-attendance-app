const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();

module.exports.setUserId = async (userId) => {
  const runInAsyncScope = asyncLocalStorage.run(userId, () => {
    asyncLocalStorage.snapShot();
  });

  return runInAsyncScope;
};
