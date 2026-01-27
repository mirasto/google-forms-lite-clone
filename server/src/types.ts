import type { PubSubEngine } from 'graphql-subscriptions';

export * from '@forms/shared';

export interface PubSubWithAsyncIterator extends PubSubEngine {
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>;
}
