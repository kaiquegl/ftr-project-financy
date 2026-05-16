import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const url = env.DATABASE_URL;

const adapter = new PrismaLibSql({ url });

export const prisma = new PrismaClient({ adapter });
