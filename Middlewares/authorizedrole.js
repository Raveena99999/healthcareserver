const authorizedRole = (permittedRole) => {
    return (req, res, next) => {
      const role = req.role;
      if (permittedRole.includes(role)) {
        next();
      } else {
        res
          .status(404)
          .send({ msg: "You are not authorized to access this route" });
      }
    };
  };
  module.exports = { authorizedRole };