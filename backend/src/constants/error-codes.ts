export const ERROR_CODES = {
  UNAUTHORIZED_ACCESS: {
    code: 403,
    message: 'Authorization token is invalid',
    isSuccess: false,
  },
  AUTH_TOKEN_NOT_FOUND: {
    code: 401,
    message: 'Authorization token not found.',
    isSuccess: false,
  },
  AUTH_ADMIN_ONLY: {
    code: 403,
    message: 'Authorized user is not admin',
    isSuccess: false,
  },
};
