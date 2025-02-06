import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import { getData as getDataImpl0 } from "../../../../../src/crud/main";
import { createData as createDataImpl1 } from "../../../../../src/crud/main";
import { editData as editDataImpl2 } from "../../../../../src/crud/main";
import * as main_service from "../../../../../src/crud/encore.service";

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "main",
            name:              "getData",
            handler:           getDataImpl0,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: main_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "main",
            name:              "createData",
            handler:           createDataImpl1,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: main_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "main",
            name:              "editData",
            handler:           editDataImpl2,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: main_service.default.cfg.middlewares || [],
    },
];

registerHandlers(handlers);

await run(import.meta.url);
