const cartLocks = new Map();

exports.acquireCartLock = async function (userId) {
    return new Promise((resolve, reject) => {
        const lock = setInterval(() => {
            if (!cartLocks.has(userId)) {
                cartLocks.set(userId, true);
                clearInterval(lock);
                resolve(lock);
            }
        }, 10);
    });
};

exports.releaseCartLock = async function (userId, lock) {
    cartLocks.delete(userId);
    clearInterval(lock);
};
