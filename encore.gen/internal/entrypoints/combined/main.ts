import { registerGateways, registerHandlers, run, type Handler } from "encore.dev/internal/codegen/appinit";

import { gateway as api_gatewayGW } from "../../../../src/auth/authorize";
import { register as auth_registerImpl0 } from "../../../../src/auth/auth";
import { login as auth_loginImpl1 } from "../../../../src/auth/auth";
import { refresh as auth_refreshImpl2 } from "../../../../src/auth/auth";
import { logout as auth_logoutImpl3 } from "../../../../src/auth/auth";
import { getData as main_getDataImpl4 } from "../../../../src/crud/main";
import { createData as main_createDataImpl5 } from "../../../../src/crud/main";
import { editData as main_editDataImpl6 } from "../../../../src/crud/main";
import * as main_service from "../../../../src/crud/encore.service";
import * as auth_service from "../../../../src/auth/encore.service";

const gateways: any[] = [
    api_gatewayGW,
];

const handlers: Handler[] = [
    {
        apiRoute: {
            service:           "auth",
            name:              "register",
            handler:           auth_registerImpl0,
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
            handler:           auth_loginImpl1,
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
            handler:           auth_refreshImpl2,
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
            handler:           auth_logoutImpl3,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: auth_service.default.cfg.middlewares || [],
    },
    {
        apiRoute: {
            service:           "main",
            name:              "getData",
            handler:           main_getDataImpl4,
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
            handler:           main_createDataImpl5,
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
            handler:           main_editDataImpl6,
            raw:               false,
            streamingRequest:  false,
            streamingResponse: false,
        },
        endpointOptions: {"expose":true,"auth":false,"isRaw":false,"isStream":false,"tags":[]},
        middlewares: main_service.default.cfg.middlewares || [],
    },
];

registerGateways(gateways);
registerHandlers(handlers);

await run(import.meta.url);
