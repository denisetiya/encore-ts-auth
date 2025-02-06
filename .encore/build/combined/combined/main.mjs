// This file was bundled by Encore v1.46.4
//
// https://encore.dev

// encore.gen/internal/entrypoints/combined/main.ts
import { registerGateways, registerHandlers, run } from "encore.dev/internal/codegen/appinit";

// src/auth/authorize.ts
import { Gateway } from "encore.dev/api";
import { APIError } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
var JWT_SECRET = process.env.JWT_SECRET;
var auth = authHandler(
  async (params) => {
    try {
      const authHeader = params.authorization;
      if (!authHeader) {
        console.log("No authorization header found");
        throw APIError.unauthenticated("bad credentials");
        ;
      }
      const [bearer, token] = authHeader.split(" ");
      if (bearer !== "Bearer" || !token) {
        console.log("Invalid authorization format");
        throw APIError.unauthenticated("Bearer token not found");
        ;
      }
      const decoded = jwt.verify(token, JWT_SECRET);
      return {
        userID: decoded.userID
      };
    } catch (error) {
      console.log(error);
      throw APIError.unauthenticated(`bad credentials ${error}`);
    }
  }
);
var gateway = new Gateway({
  authHandler: auth
});

// src/auth/auth.ts
import { api } from "encore.dev/api";

// src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var prisma_default = prisma;

// src/auth/jwt.logic.ts
import jwt2 from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();
var ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
var REFRESH_TOKEN_SECRET = process.env.JWT_SECRET;
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}
var generateAccessToken = (user) => {
  try {
    return jwt2.sign(
      {
        userID: user.id,
        email: user.email
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  } catch (error) {
    console.error("Error generating access token:", error);
    throw error;
  }
};
var generateRefreshToken = async (user) => {
  try {
    const refreshToken = jwt2.sign(
      {
        userID: user.id,
        email: user.email
      },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    await prisma_default.refreshToken.upsert({
      where: { userId: user.id },
      update: { token: refreshToken },
      create: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3) }
    });
    return refreshToken;
  } catch (error) {
    console.error("Error generating refresh token:", error);
    throw error;
  }
};

// src/auth/auth.ts
import bcrypt from "bcrypt";
import * as jwt3 from "jsonwebtoken";
var REFRESH_TOKEN_SECRET2 = "your-refresh-token-secret";
var register = api({
  method: "POST",
  path: "/auth/register",
  expose: true
}, async (req) => {
  try {
    const hashedPassword = await bcrypt.hash(req.password, 10);
    const user = await prisma_default.user.create({
      data: {
        email: req.email,
        password: hashedPassword
      }
    });
    return {
      status: "success",
      message: `User ${user.email} registered successfully`
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      status: "failed",
      message: "An error occurred during registration"
    };
  }
});
var login = api({
  method: "POST",
  path: "/auth/login",
  expose: true
}, async (req) => {
  try {
    const user = await prisma_default.user.findUnique({
      where: {
        email: req.email
      }
    });
    if (!user) {
      return {
        status: "failed",
        message: "Invalid email or password"
      };
    }
    const passwordMatch = await bcrypt.compare(req.password, user.password);
    if (!passwordMatch) {
      return {
        status: "failed",
        message: "Invalid email or password"
      };
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);
    return {
      status: "success",
      token: {
        accessToken,
        refreshToken
      },
      data: user
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      status: "failed",
      message: "An error occurred during login"
    };
  }
});
var refresh = api({
  method: "POST",
  path: "/auth/refresh",
  expose: true
}, async (req) => {
  try {
    const storedToken = await prisma_default.refreshToken.findFirst({
      where: {
        token: req.refreshToken,
        expiresAt: {
          gt: /* @__PURE__ */ new Date()
        }
      },
      include: {
        user: true
      }
    });
    if (!storedToken) {
      return {
        status: "failed",
        message: "Invalid refresh token"
      };
    }
    try {
      jwt3.verify(req.refreshToken, REFRESH_TOKEN_SECRET2);
    } catch (error) {
      await prisma_default.refreshToken.delete({
        where: {
          id: storedToken.id
        }
      });
      return {
        status: "failed",
        message: "Invalid refresh token"
      };
    }
    const accessToken = generateAccessToken(storedToken.user);
    return {
      status: "success",
      accessToken
    };
  } catch (error) {
    console.error("Refresh token error:", error);
    return {
      status: "failed",
      message: "An error occurred while refreshing token"
    };
  }
});
var logout = api({
  method: "POST",
  path: "/auth/logout",
  expose: true
}, async (req) => {
  try {
    await prisma_default.refreshToken.deleteMany({
      where: {
        token: req.refreshToken
      }
    });
    return {
      status: "success"
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      status: "failed",
      message: "An error occurred during logout"
    };
  }
});

// src/crud/main.ts
import { api as api2 } from "encore.dev/api";
var data = [1, 2, 3];
var getData = api2({
  method: "GET",
  path: "/data",
  expose: true,
  auth: true
}, async () => {
  return {
    data
  };
});
var createData = api2({
  method: "POST",
  path: "/data",
  expose: true
}, async (req) => {
  data.push(req.data);
  return {
    data
  };
});
var editData = api2({
  method: "PUT",
  path: "/data/:id",
  expose: true
}, async (req) => {
  data[req.id] = req.data;
  return {
    data
  };
});

// src/auth/encore.service.ts
import { Service } from "encore.dev/service";
var encore_service_default = new Service("auth");

// src/crud/encore.service.ts
import { Service as Service2 } from "encore.dev/service";
var encore_service_default2 = new Service2("main");

// encore.gen/internal/entrypoints/combined/main.ts
var gateways = [
  gateway
];
var handlers = [
  {
    apiRoute: {
      service: "auth",
      name: "register",
      handler: register,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "login",
      handler: login,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "refresh",
      handler: refresh,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "auth",
      name: "logout",
      handler: logout,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "main",
      name: "getData",
      handler: getData,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": true, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "main",
      name: "createData",
      handler: createData,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  },
  {
    apiRoute: {
      service: "main",
      name: "editData",
      handler: editData,
      raw: false,
      streamingRequest: false,
      streamingResponse: false
    },
    endpointOptions: { "expose": true, "auth": false, "isRaw": false, "isStream": false, "tags": [] },
    middlewares: encore_service_default2.cfg.middlewares || []
  }
];
registerGateways(gateways);
registerHandlers(handlers);
await run(import.meta.url);
//# sourceMappingURL=main.mjs.map
