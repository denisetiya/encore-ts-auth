import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as main_service from "../../../../src/crud/encore.service";

export async function getData(params) {
    const handler = (await import("../../../../src/crud/main")).getData;
    registerTestHandler({
        apiRoute: { service: "main", name: "getData", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: main_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":true,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("main", "getData", params);
}

export async function createData(params) {
    const handler = (await import("../../../../src/crud/main")).createData;
    registerTestHandler({
        apiRoute: { service: "main", name: "createData", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: main_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("main", "createData", params);
}

export async function editData(params) {
    const handler = (await import("../../../../src/crud/main")).editData;
    registerTestHandler({
        apiRoute: { service: "main", name: "editData", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: main_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("main", "editData", params);
}

