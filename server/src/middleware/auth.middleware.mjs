import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const protect = (req, res, next) => {
  try {
    // Try to get userId from x-user-id header first
    const userIdHeader = req.headers['x-user-id'];
    if (userIdHeader) {
      req.userId = userIdHeader;
      return next();
    }

    // Check for Authorization header with Bearer token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // Extract token from Bearer
    const token = authHeader.substring(7);

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id || decoded._id || decoded.sub;
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const optional = (req, res, next) => {
  try {
    const userIdHeader = req.headers['x-user-id'];
    if (userIdHeader) {
      req.userId = userIdHeader;
      return next();
    }

    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id || decoded._id || decoded.sub;
      } catch (err) {
        // Token is invalid, but we allow the request to continue
      }
    }
    next();
  } catch (error) {
    next();
  }
};
