/// <reference types="astro/client" />

declare module 'astro:middleware' {
    export const defineMiddleware: typeof import('astro/dist/core/middleware/index.js').defineMiddleware;
    export const sequence: typeof import('astro/dist/core/middleware/index.js').sequence;
}
