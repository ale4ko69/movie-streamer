export {};

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'Development' | 'Production';
        PORT?: string;
        PWD: string;
        RUTRACKER_USERNAME?: string;
        RUTRACKER_PASSWORD?: string;
      }
    }
  }

