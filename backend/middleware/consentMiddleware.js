export const checkConsent = (req, res, next) => {
  const consent = req.cookies.userConsent; // Assuming consent is stored in a cookie
  if (consent === 'true') {
    next(); // Proceed with storing interactions
  } else {
    res.status(403).json({ msg: 'User has not given consent' });
  }
};