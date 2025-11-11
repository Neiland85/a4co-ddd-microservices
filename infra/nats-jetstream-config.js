/**
 * NATS JetStream Configuration Script
 * 
 * Este script configura los streams, subjects y consumers necesarios
 * para el flujo Order → Inventory → Payment
 * 
 * Ejecutar: node infra/nats-jetstream-config.js
 */

const { connect, StringCodec } = require('nats');

const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';

const streams = [
  {
    name: 'ORDERS',
    subjects: ['order.*'],
    retention: 'workqueue',
    maxAge: 86400000, // 24 horas
    maxMsgs: 100000,
    maxBytes: 1024 * 1024 * 100, // 100MB
    storage: 'file',
    replicas: 1,
  },
  {
    name: 'PAYMENTS',
    subjects: ['payment.*'],
    retention: 'workqueue',
    maxAge: 86400000, // 24 horas
    maxMsgs: 100000,
    maxBytes: 1024 * 1024 * 100, // 100MB
    storage: 'file',
    replicas: 1,
  },
  {
    name: 'INVENTORY',
    subjects: ['inventory.*'],
    retention: 'workqueue',
    maxAge: 86400000, // 24 horas
    maxMsgs: 100000,
    maxBytes: 1024 * 1024 * 100, // 100MB
    storage: 'file',
    replicas: 1,
  },
];

const consumers = [
  // Order Service Consumers
  {
    stream: 'ORDERS',
    name: 'order-service-consumer',
    filter: 'order.created',
    queue: 'order-service-queue',
  },
  {
    stream: 'ORDERS',
    name: 'order-service-payment-consumer',
    filter: 'payment.succeeded',
    queue: 'order-service-queue',
  },
  {
    stream: 'ORDERS',
    name: 'order-service-inventory-consumer',
    filter: 'inventory.reserved',
    queue: 'order-service-queue',
  },
  
  // Payment Service Consumers
  {
    stream: 'PAYMENTS',
    name: 'payment-service-consumer',
    filter: 'order.created',
    queue: 'payment-service-queue',
  },
  
  // Inventory Service Consumers
  {
    stream: 'INVENTORY',
    name: 'inventory-service-consumer',
    filter: 'order.created',
    queue: 'inventory-service-queue',
  },
  {
    stream: 'INVENTORY',
    name: 'inventory-service-release-consumer',
    filter: 'order.cancelled',
    queue: 'inventory-service-queue',
  },
];

async function setupJetStream() {
  let nc;
  try {
    console.log(`🔌 Conectando a NATS en ${NATS_URL}...`);
    nc = await connect({ servers: NATS_URL });
    console.log('✅ Conectado a NATS');

    const js = nc.jetstream();

    // Crear streams
    console.log('\n📦 Creando streams...');
    for (const streamConfig of streams) {
      try {
        await js.streams.add({
          name: streamConfig.name,
          subjects: streamConfig.subjects,
          retention: streamConfig.retention,
          max_age: streamConfig.maxAge,
          max_msgs: streamConfig.maxMsgs,
          max_bytes: streamConfig.maxBytes,
          storage: streamConfig.storage,
          num_replicas: streamConfig.replicas,
        });
        console.log(`  ✅ Stream '${streamConfig.name}' creado`);
      } catch (error) {
        if (error.message.includes('stream name already in use')) {
          console.log(`  ⚠️  Stream '${streamConfig.name}' ya existe`);
        } else {
          throw error;
        }
      }
    }

    // Crear consumers
    console.log('\n👥 Creando consumers...');
    for (const consumerConfig of consumers) {
      try {
        const stream = await js.streams.info(consumerConfig.stream);
        await stream.config.consumers.add({
          durable_name: consumerConfig.name,
          filter_subject: consumerConfig.filter,
          deliver_group: consumerConfig.queue,
          ack_policy: 'explicit',
          max_deliver: 5,
        });
        console.log(`  ✅ Consumer '${consumerConfig.name}' creado`);
      } catch (error) {
        if (error.message.includes('consumer name already in use')) {
          console.log(`  ⚠️  Consumer '${consumerConfig.name}' ya existe`);
        } else {
          console.error(`  ❌ Error creando consumer '${consumerConfig.name}':`, error.message);
        }
      }
    }

    console.log('\n✅ Configuración de JetStream completada');
    console.log('\n📊 Resumen:');
    console.log(`  - Streams: ${streams.length}`);
    console.log(`  - Consumers: ${consumers.length}`);

  } catch (error) {
    console.error('❌ Error configurando JetStream:', error);
    process.exit(1);
  } finally {
    if (nc) {
      await nc.close();
      console.log('\n🔌 Desconectado de NATS');
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupJetStream().catch(console.error);
}

module.exports = { setupJetStream };
