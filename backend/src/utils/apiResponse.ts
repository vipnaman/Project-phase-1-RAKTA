export function successResponse<T>(data: T, message = 'Success') {
  return {
    success: true,
    data,
    message,
  };
}

export function errorResponse(code: string, message: string) {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}
