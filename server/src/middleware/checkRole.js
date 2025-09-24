function checkRole(requiredRole) {
    return function (req, res, next) {
      const user = res.locals.user; 
  
      if (!user) {
        return res.status(401).json({ error: "Не авторизован" });
      }
  
      req.user = user;
  
      if (user.role.name !== requiredRole) {
        return res.status(403).json({ error: "Запрет" });
      }
  
      next();
    };
  }
  module.exports = checkRole;
  


