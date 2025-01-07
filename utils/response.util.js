exports.sendSuccess = (res, data, status = 200) => {
    res.status(status).json({ success: true, data });
  };
  
  exports.sendError = (res, message, status = 500) => {
    res.status(status).json({ success: false, message });
  };
  