import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { register as registerImpl0 } from "../../../../../src/auth/auth";
import { login as loginImpl1 } from "../../../../../src/auth/auth";
import { refresh as refreshImpl2 } from "../../../../../src/auth/auth";
import { logout as logoutImpl3 } from "../../../../../src/auth/auth";
import * as auth_service from "../../../../../src/auth/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "auth",
            name:              "register",
            handler:           registerImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "login",
            handler:           loginImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "refresh",
            handler:           refreshImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "auth",
            name:              "logout",
            handler:           logoutImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
