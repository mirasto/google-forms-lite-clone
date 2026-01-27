import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { createServer } from 'http';
import express from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import cors from 'cors';
import { PubSub } from 'graphql-subscriptions';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { InMemoryStore } from './store.js';

const PORT = 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);


const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});


const serverCleanup = useServer({ 
    schema,
    context: async () => {
        return {
            store,
            pubsub,
        };
    },
}, wsServer);


const server = new ApolloServer({
  schema,
  plugins: [

    ApolloServerPluginDrainHttpServer({ httpServer }),


    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});


await server.start();

const store = new InMemoryStore();
const pubsub = new PubSub();

// Global middleware
app.use(cors<cors.CorsRequest>({
  origin: ['http://localhost:5173', 'https://studio.apollographql.com'],
  credentials: true,
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async () => ({
      store,
      pubsub,
    }),
  }) as unknown as express.RequestHandler
);


app.get('/', (req, res) => {
  res.send('Server is running! GraphQL endpoint is at /graphql');
});

// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is now running on http://localhost:${PORT}/graphql`);
});
