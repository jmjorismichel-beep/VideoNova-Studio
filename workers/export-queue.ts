// workers/export-queue.ts — VideoNova Studio
// File BullMQ pour les exports vidéo

import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
};

export const exportQueue = new Queue("video-export", {
  connection,
  defaultJobOptions: {
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 20 },
  },
});
