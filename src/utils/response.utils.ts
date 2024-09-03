import { HttpStatus } from '@nestjs/common';

export const emptyResponse = {
  response: [],
  message: "No data found.",
  statusCode: HttpStatus.OK,
};