
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/store/api.generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-rtk-query"
      ],
      config: {
        importBaseApiFrom: './api',
        exportHooks: true,
        overrideExisting: false // Don't override the base API file, just extend it
      }
    }
  }
};

export default config;
