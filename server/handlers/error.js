// Error Handler
module.exports = function errorHandler(err, req, res, next) {
    return res.status(err.status || 500).json({
        error: {
<<<<<<< HEAD
            message: err.message || 'Not Found',
=======
            message: err.message || "Not Found",
>>>>>>> develop
        },
    });
};
