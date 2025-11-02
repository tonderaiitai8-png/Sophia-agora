import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"]
});

fastify.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString()
}));

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Backend running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
