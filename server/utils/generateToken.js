import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  return jwt.sign({ id, userId: id, role }, process.env.JWT_SECRET || 'techmart_jwt_secret_key_change_me_in_production', {
    expiresIn: '30d',
  });
};

export default generateToken;
