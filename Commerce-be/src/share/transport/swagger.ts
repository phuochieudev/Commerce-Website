import fs from 'fs';
import path from 'path';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

interface RouteDef {
  method: HttpMethod;
  path: string;
  authRequired: boolean;
  adminRequired: boolean;
  tag: string;
}

const ROUTE_REGEX = /router\.(get|post|put|patch|delete)\(\s*['"`]([^'"`]+)['"`]([\s\S]*?)\);/g;

function normalizeTag(dirName: string): string {
  return dirName.replace(/-/g, ' ');
}

function readModuleRouteDefs(modulesDir: string): RouteDef[] {
  const routeDefs: RouteDef[] = [];

  if (!fs.existsSync(modulesDir)) {
    return routeDefs;
  }

  const moduleDirs = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const moduleDir of moduleDirs) {
    const indexFile = path.join(modulesDir, moduleDir, 'index.ts');
    if (!fs.existsSync(indexFile)) {
      continue;
    }

    const source = fs.readFileSync(indexFile, 'utf8');
    let match: RegExpExecArray | null;

    while ((match = ROUTE_REGEX.exec(source)) !== null) {
      const method = match[1] as HttpMethod;
      const routePath = match[2];
      const argsTail = match[3] || '';

      routeDefs.push({
        method,
        path: routePath,
        authRequired: argsTail.includes('authMiddleware'),
        adminRequired: argsTail.includes('adminMiddleware'),
        tag: normalizeTag(moduleDir),
      });
    }
  }

  return routeDefs;
}

function withV1Prefix(routePath: string): string {
  if (routePath.startsWith('/v1/')) {
    return routePath;
  }
  return `/v1${routePath}`;
}

function openApiPath(routePath: string): string {
  return routePath.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

export function buildSwaggerDocument(port: string | number) {
  const modulesDir = path.resolve(process.cwd(), 'src/modules');
  const routes = readModuleRouteDefs(modulesDir);

  const paths: Record<string, Record<string, unknown>> = {};

  for (const route of routes) {
    const fullPath = openApiPath(withV1Prefix(route.path));

    if (!paths[fullPath]) {
      paths[fullPath] = {};
    }

    const operation: Record<string, unknown> = {
      tags: [route.tag],
      summary: `${route.method.toUpperCase()} ${fullPath}`,
      responses: {
        200: {
          description: 'Success',
        },
      },
    };

    if (route.authRequired || route.adminRequired) {
      operation.security = [{ bearerAuth: [] }];
    }

    if (route.adminRequired) {
      operation.description = 'Admin role required';
    }

    paths[fullPath][route.method] = operation;
  }

  paths['/'] = {
    get: {
      tags: ['system'],
      summary: 'Health check',
      responses: {
        200: {
          description: 'Server is alive',
        },
      },
    },
  };

  return {
    openapi: '3.0.3',
    info: {
      title: 'Commerce-be API',
      version: '1.0.0',
      description: 'Auto-generated endpoint catalog from Express route definitions.',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    paths,
  };
}