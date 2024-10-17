const { Kafka } = require("kafkajs");
const { downloadVideo } = require("../Controllers/api");
const { writeFileToLocalDirectory } = require("../Controllers/mp4conversion");
const kafka = new Kafka({
  brokers: ["kafka:9093"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "video" });

const connectProducer = async (data) => {
  await producer.connect();
  await producer.send({
    topic: "videos",
    messages: [
      {
        value: Buffer.from(JSON.stringify(data)),
      },
    ],
  });
  await producer.disconnect();
};

const consumeKafka = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "videos", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message, topic, heartbeat }) => {
      const decodedMessage = message.value.toString();
      const video_url = JSON.parse(decodedMessage);
      console.log('message received');
      const resp = await downloadVideo(video_url);
      if (resp.status == 200) {
        const parts = video_url.split("/");
        var video_name = parts[parts.length - 1];

       await writeFileToLocalDirectory(video_name, resp);
      } else {
        console.log("Error while trying to download the video");
      }
    },
    autoCommit: true,
  });
};

module.exports = { connectProducer, consumeKafka };
