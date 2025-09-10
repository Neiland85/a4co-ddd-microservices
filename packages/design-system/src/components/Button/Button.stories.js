"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonGroup = exports.FullWidth = exports.WithRightIcon = exports.WithIcon = exports.Disabled = exports.Loading = exports.Large = exports.Medium = exports.Small = exports.Outline = exports.Ghost = exports.Success = exports.Danger = exports.Secondary = exports.Primary = exports.Default = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Button_1 = require("./Button");
const meta = {
    title: 'Components/Button',
    component: Button_1.Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'success', 'ghost', 'outline'],
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        isLoading: {
            control: 'boolean',
        },
        disabled: {
            control: 'boolean',
        },
        fullWidth: {
            control: 'boolean',
        },
    },
};
exports.default = meta;
// Historia por defecto
exports.Default = {
    args: {
        children: 'Button',
    },
};
// Variantes
exports.Primary = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};
exports.Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};
exports.Danger = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
    },
};
exports.Success = {
    args: {
        variant: 'success',
        children: 'Success Button',
    },
};
exports.Ghost = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
    },
};
exports.Outline = {
    args: {
        variant: 'outline',
        children: 'Outline Button',
    },
};
// Tamaños
exports.Small = {
    args: {
        size: 'small',
        children: 'Small Button',
    },
};
exports.Medium = {
    args: {
        size: 'medium',
        children: 'Medium Button',
    },
};
exports.Large = {
    args: {
        size: 'large',
        children: 'Large Button',
    },
};
// Estados
exports.Loading = {
    args: {
        isLoading: true,
        children: 'Loading...',
    },
};
exports.Disabled = {
    args: {
        disabled: true,
        children: 'Disabled Button',
    },
};
// Con iconos
exports.WithIcon = {
    args: {
        children: 'Download',
        leftIcon: ((0, jsx_runtime_1.jsx)("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })),
    },
};
exports.WithRightIcon = {
    args: {
        children: 'Next',
        rightIcon: ((0, jsx_runtime_1.jsx)("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: (0, jsx_runtime_1.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })),
    },
};
// Full width
exports.FullWidth = {
    args: {
        fullWidth: true,
        children: 'Full Width Button',
    },
    decorators: [
        Story => ((0, jsx_runtime_1.jsx)("div", { style: { width: '400px' }, children: (0, jsx_runtime_1.jsx)(Story, {}) })),
    ],
};
// Grupo de botones
exports.ButtonGroup = {
    render: () => ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-4", children: [(0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "primary", children: "Save" }), (0, jsx_runtime_1.jsx)(Button_1.Button, { variant: "outline", children: "Cancel" })] })),
};
//# sourceMappingURL=Button.stories.js.map