const { Kafka } = require('kafkajs')
const kafka = new Kafka({
    brokers: ['localhost:9092']
    
})

const producer= kafka.producer();
const consumer=kafka.consumer({groupId:'logs'});

const connectProducer=async(data)=>{
    await producer.connect();
    await   producer.send({ topic:'test-logs', messages:[
        {   
            value:Buffer.from(JSON.stringify(data))
        }
    ],
})
    await producer.disconnect();
}

const consumeKafka = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-logs', fromBeginning: true });
    await consumer.run({
        eachMessage: async ({ message, topic, heartbeat }) => {
            const decodedMessage = message.value.toString();
            const jsonObject = JSON.parse(decodedMessage);
            console.log(jsonObject);
        },
        autoCommit: true,
    });
}


module.exports={connectProducer,consumeKafka}
