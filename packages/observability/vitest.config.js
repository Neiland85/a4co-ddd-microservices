<<<<<<< HEAD
'use strict';
var __importDefault = (this && this.__importDefault) || function(mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const config_1 = require('vitest/config');
const path_1 = __importDefault(require('path'));
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const path_1 = __importDefault(require("path"));
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
exports.default = (0, config_1.defineConfig)({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/mockData', 'examples/'],
        },
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
        },
    },
});
<<<<<<< HEAD
//# sourceMappingURL=vitest.config.js.map
=======
//# sourceMappingURL=vitest.config.js.map
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
