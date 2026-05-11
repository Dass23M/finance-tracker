const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message = 'Something went wrong') => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };