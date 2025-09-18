import * as fs from 'fs';
import * as path from 'path';

interface ServiceConfig {
  name: string;
  methods: Array<{
    name: string;
    params: Array<{ name: string; type: string }>;
    requestInterface?: string;
    validationFields?: string[];
  }>;
}

const services: ServiceConfig[] = [
  {
    name: 'Product',
    methods: [
      {
        name: 'addProduct',
        params: [
          { name: 'name', type: 'string' },
          { name: 'price', type: 'number' },
        ],
        requestInterface: 'AddProductRequest',
        validationFields: ['name', 'price'],
      },
      {
        name: 'getProduct',
        params: [{ name: 'name', type: 'string' }],
        requestInterface: 'GetProductRequest',
        validationFields: ['name'],
      },
    ],
  },
  {
    name: 'User',
    methods: [
      {
        name: 'createUser',
        params: [
          { name: 'username', type: 'string' },
          { name: 'email', type: 'string' },
        ],
        requestInterface: 'CreateUserRequest',
        validationFields: ['username', 'email'],
      },
      {
        name: 'getUser',
        params: [{ name: 'username', type: 'string' }],
        requestInterface: 'GetUserRequest',
        validationFields: ['username'],
      },
    ],
  },
  {
    name: 'Inventory',
    methods: [
      {
        name: 'updateStock',
        params: [
          { name: 'productId', type: 'string' },
          { name: 'quantity', type: 'number' },
        ],
        requestInterface: 'UpdateStockRequest',
        validationFields: ['productId', 'quantity'],
      },
      {
        name: 'getStock',
        params: [{ name: 'productId', type: 'string' }],
        requestInterface: 'GetStockRequest',
        validationFields: ['productId'],
      },
    ],
  },
];

function generateController(service: ServiceConfig): string {
  const interfaces = service.methods
    .filter(m => m.requestInterface)
    .map(method => {
      const props = method.params.map(p => `  ${p.name}: ${p.type};`).join('\n');
      return `interface ${method.requestInterface} {\n${props}\n}`;
    })
    .join('\n\n');

  const methods = service.methods
    .map(method => {
      const paramsStr = method.params.map(p => p.name).join(', ');
      return `
  ${method.name}(req: ${method.requestInterface}): string {
    try {
      const validated = this.validateRequest<${method.requestInterface}>(req, [${method.validationFields?.map(f => `'${f}'`).join(', ')}]);
      const result = this.service.${method.name}(${method.params.map(p => `validated.${p.name}`).join(', ')});
      return this.formatResponse(result).data;
    } catch (error) {
      const errorResponse = this.handleError(error);
      throw new Error(errorResponse.error);
    }
  }`;
    })
    .join('\n');

  return `import { BaseController } from '../../packages/shared-utils/src/base';
import { ${service.name}Service } from './service';

${interfaces}

export class ${service.name}Controller extends BaseController<${service.name}Service> {
  constructor() {
    super(${service.name}Service);
  }
${methods}
}
`;
}

function generateService(service: ServiceConfig): string {
  const methods = service.methods
    .map(method => {
      const paramsStr = method.params.map(p => `${p.name}: ${p.type}`).join(', ');
      const entityName = service.name.toLowerCase();

      // Generar lógica específica según el método
      let methodBody = '';

      if (method.name.includes('create') || method.name.includes('add')) {
        methodBody = `
    try {
      ${method.params
        .map(
          p =>
            `const validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)} = this.validateRequired(${p.name}, '${p.name}');`
        )
        .join('\n      ')}
      
      this.log('Creating ${entityName}', { ${method.params.map(p => p.name).join(', ')} });
      
      return this.createSuccessMessage(
        '${service.name}',
        'created',
        \`with ${method.params.map(p => `\${validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)}}`).join(' and ')}\`
      );
    } catch (error) {
      return this.handleServiceError(error, '${method.name}');
    }`;
      } else if (method.name.includes('update')) {
        methodBody = `
    try {
      ${method.params
        .map(p => {
          if (p.name.includes('Id')) {
            return `const validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)} = this.validateId(${p.name}, '${entityName}');`;
          } else {
            return `const validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)} = this.validateRequired(${p.name}, '${p.name}');`;
          }
        })
        .join('\n      ')}
      
      this.log('Updating ${entityName}', { ${method.params.map(p => p.name).join(', ')} });
      
      return this.createSuccessMessage(
        '${service.name}',
        'updated',
        \`${method.params.map(p => `\${validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)}}`).join(' to ')}\`
      );
    } catch (error) {
      return this.handleServiceError(error, '${method.name}');
    }`;
      } else {
        methodBody = `
    try {
      ${method.params
        .map(p => {
          if (p.name.includes('Id') || p.name === 'username' || p.name === 'name') {
            return `const validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)} = this.validateId(${p.name}, '${p.name}');`;
          } else {
            return `const validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)} = this.validateRequired(${p.name}, '${p.name}');`;
          }
        })
        .join('\n      ')}
      
      this.log('Getting ${entityName}', { ${method.params.map(p => `${p.name}: validated${p.name.charAt(0).toUpperCase() + p.name.slice(1)}`).join(', ')} });
      
      return this.createSuccessMessage(
        '${service.name}',
        'retrieved',
        validated${method.params[0].name.charAt(0).toUpperCase() + method.params[0].name.slice(1)}
      );
    } catch (error) {
      return this.handleServiceError(error, '${method.name}');
    }`;
      }

      return `
  ${method.name}(${paramsStr}): string {${methodBody}
  }`;
    })
    .join('\n');

  return `import { BaseService } from '../../packages/shared-utils/src/base';

export class ${service.name}Service extends BaseService {
  constructor() {
    super('${service.name}Service');
  }
${methods}
}
`;
}

// Generar archivos refactorizados
services.forEach(service => {
  const servicePath = path.join(__dirname, `../apps/${service.name.toLowerCase()}-service`);

  // Crear controller refactorizado
  const controllerContent = generateController(service);
  const controllerPath = path.join(servicePath, 'controller.ts');
  fs.writeFileSync(controllerPath, controllerContent);
  console.log(`✅ Refactorizado: ${controllerPath}`);

  // Crear service refactorizado
  const serviceContent = generateService(service);
  const servicePath2 = path.join(servicePath, 'service.ts');
  fs.writeFileSync(servicePath2, serviceContent);
  console.log(`✅ Refactorizado: ${servicePath2}`);
});

console.log('\n🎯 Refactorización completada para reducir duplicación de código');
console.log(
  '📊 Esto debería reducir significativamente el porcentaje de líneas duplicadas en SonarQube'
);
