import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { ClientError } from "../../domain/erros/client-error";

export function errorHandler(
  error: unknown,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: error.format(),
    });
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message,
    });
  }

  return reply.status(500).send({
    message: "Internal server error",
  });
}
