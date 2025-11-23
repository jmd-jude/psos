// lib/prisma.ts - Back to V6 Standard

import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

let prisma: PrismaClient;

// Use global variable for singleton pattern to prevent hot-reload creating new instances
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalAny: any = global;
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient();
  }
  prisma = globalAny.prisma;
}

export { PrismaClientKnownRequestError };
export default prisma;