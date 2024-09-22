export function AppError(
  message: string = 'Server error.',
  statusCode: number = 500,
) {
  return { message, statusCode }
}
