import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import cors from 'cors';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import type { Context, PubSubWithAsyncIterator } from './types.js';
import { InMemoryStore } from './store.js';
const PORT = process.env.PORT || 4000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  if (IS_PRODUCTION) {
    const code = formattedError.extensions?.code;
    if (
      code === 'BAD_USER_INPUT' ||
      code === 'NOT_FOUND' ||
      code === 'FORBIDDEN' ||
      code === 'UNAUTHENTICATED'
    ) {
      return formattedError;
    }
    console.error('Internal Server Error:', error);
    return new GraphQLError('Internal Server Error');
  }
  return formattedError;
};
async function bootstrap() {
  try {
    const store = new InMemoryStore();
    const pubsub = new PubSub() as unknown as PubSubWithAsyncIterator;
    const app = express();
    const httpServer = createServer(app);
    const schema = makeExecutableSchema({ 
      typeDefs, 
      resolvers
    });
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: '/graphql',
    });

    const serverCleanup = useServer(
      {
        schema,
        context: async () => ({
          store,
          pubsub,
          userId: undefined
        }),
      },
      wsServer
    );


    const server = new ApolloServer<Context>({
      schema,
      formatError,
      plugins: [
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
    app.use(cors<cors.CorsRequest>());
    app.use(express.json());
    
    app.use(
      '/graphql',
      expressMiddleware(server, {
        context: async () => ({
          userId: undefined,
          store,
          pubsub
        }),
      }) as unknown as express.RequestHandler
    );
    app.get('/', (req, res) => {
      res.redirect('/graphql');
    });

    httpServer.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
      console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
bootstrap();
