import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { FormsModule } from './forms/forms.module.js';
import { typeDefs } from './schema.js';
import { print } from 'graphql';

@Module({
  imports: [
    FormsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: print(typeDefs),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: '/',
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
})
export class AppModule {}
