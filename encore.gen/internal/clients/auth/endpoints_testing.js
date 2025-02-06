import { apiCall, streamIn, streamOut, streamInOut } from "encore.dev/internal/codegen/api";
import { registerTestHandler } from "encore.dev/internal/codegen/appinit";

import * as auth_service from "../../../../src/auth/encore.service";

export async function register(params) {
    const handler = (await import("../../../../src/auth/auth")).register;
    registerTestHandler({
        apiRoute: { service: "auth", name: "register", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "register", params);
}

export async function login(params) {
    const handler = (await import("../../../../src/auth/auth")).login;
    registerTestHandler({
        apiRoute: { service: "auth", name: "login", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "login", params);
}

export async function refresh(params) {
    const handler = (await import("../../../../src/auth/auth")).refresh;
    registerTestHandler({
        apiRoute: { service: "auth", name: "refresh", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "refresh", params);
}

export async function logout(params) {
    const handler = (await import("../../../../src/auth/auth")).logout;
    registerTestHandler({
        apiRoute: { service: "auth", name: "logout", raw: false, handler, streamingRequest: false, streamingResponse: false },
        middlewares: auth_service.default.cfg.middlewares || [],
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
    });

    return apiCall("auth", "logout", params);
}

