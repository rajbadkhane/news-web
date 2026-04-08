function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

function sendList(res, data, meta = {}) {
  res.json({
    ok: true,
    count: data.length,
    ...meta,
    data
  });
}

module.exports = {
  badRequest,
  notFound,
  sendList
};
