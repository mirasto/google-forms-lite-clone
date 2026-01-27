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

// Configuration
const PORT = process.env.PORT || 4000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Custom error formatter to hide internal implementation details in production
 */
const formatError = (formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError => {
  if (IS_PRODUCTION) {
    // Allow known user-facing errors
    const code = formattedError.extensions?.code;
    if (
      code === 'BAD_USER_INPUT' ||
      code === 'NOT_FOUND' ||
      code === 'FORBIDDEN' ||
      code === 'UNAUTHENTICATED'
    ) {
      return formattedError;
    }
    
    // Log and mask internal errors
    console.error('Internal Server Error:', error);
    return new GraphQLError('Internal Server Error');
  }
  
  // In development, return the full error details
  return formattedError;
};

/**
 * Bootstrap the Apollo Server and Express application
 */
async function bootstrap() {
  try {
    // 1. Initialize core dependencies
    const store = new InMemoryStore();
    const pubsub = new PubSub() as unknown as PubSubWithAsyncIterator;
    const app = express();
    const httpServer = createServer(app);

    // 2. Setup GraphQL Schema
    const schema = makeExecutableSchema({ 
      typeDefs, 
      resolvers
    });

    // 3. Setup WebSocket Server for Subscriptions
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

    // 4. Setup Apollo Server
    const server = new ApolloServer<Context>({
      schema,
      formatError,
      plugins: [
        // Proper shutdown for WebSocket server
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

    // 5. Setup Express Middleware
    app.use(cors<cors.CorsRequest>());
    app.use(express.json());

    // Ensure req.body is set (Apollo Server 4 requirement)
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.body) {
        req.body = {};
      }
      next();
    });
    
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

    // Add root route for convenience
    app.get('/', (req, res) => {
      res.redirect('/graphql');
    });

    // 6. Start the HTTP Server
    httpServer.listen(PORT, () => {
      console.log(`Server ready at http://localhost:${PORT}/graphql`);
      console.log(`Subscriptions ready at ws://localhost:${PORT}/graphql`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
bootstrap();
