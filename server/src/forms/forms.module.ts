import { Module } from '@nestjs/common';
import { FormsService } from './forms.service.js';
import { FormsResolver } from './forms.resolver.js';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    FormsService,
    FormsResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [FormsService],
})
export class FormsModule {}
