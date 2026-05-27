const JWT_SECRET = process.env.JWT_SECRET || 'TUquemirasBOBO';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export default {
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
