import { registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";
import { Worker, isMainThread } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { availableParallelism } from "node:os";

import * as _service from "../../../../../src/crud/encore.service";

const handlers: Handler[] = [
];

registerHandlers(handlers);

await run(import.meta.url);
