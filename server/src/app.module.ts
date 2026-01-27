import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPlugin } from '@apollo/server';
import { print } from 'graphql'; 
import { FormsModule } from './forms/forms.module.js';
import { typeDefs } from './schema.js';


const apolloPlugins: ApolloServerPlugin[] = [
  ApolloServerPluginLandingPageLocalDefault(),
];

@Module({
  imports: [
    FormsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typeDefs: print(typeDefs), 
      playground: false,
      plugins: apolloPlugins as ApolloDriverConfig['plugins'],
      path: '/',
      subscriptions: {
        'graphql-ws': true,
      },
    }),
  ],
})
export class AppModule {}