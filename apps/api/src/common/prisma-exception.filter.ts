import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client';

/** Turns common database errors into clear HTTP responses instead of 500s. */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(err: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();
    const [status, message] = describe(err);
    res.status(status).json({ statusCode: status, message });
  }
}

function describe(err: Prisma.PrismaClientKnownRequestError): [number, string] {
  switch (err.code) {
    case 'P2002': {
      const target = (err.meta?.['target'] as string[] | string | undefined) ?? 'value';
      const fields = Array.isArray(target) ? target.join(', ') : target;
      return [HttpStatus.CONFLICT, `A record with this ${fields} already exists`];
    }
    case 'P2025':
      return [HttpStatus.NOT_FOUND, 'Record not found'];
    case 'P2003':
      return [HttpStatus.BAD_REQUEST, 'A referenced record does not exist'];
    default:
      return [HttpStatus.INTERNAL_SERVER_ERROR, 'Database error'];
  }
}
