'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormProgress = FormProgress;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
function FormProgress({ currentStep, totalSteps, stepLabels }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 flex items-center justify-between", children: stepLabels.map((label, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col items-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: `mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${index < currentStep
                                ? 'bg-green-500 text-white'
                                : index === currentStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500'}`, initial: { scale: 0.8 }, animate: { scale: index <= currentStep ? 1 : 0.8 }, transition: { duration: 0.3 }, children: index < currentStep ? '✓' : index + 1 }), (0, jsx_runtime_1.jsx)("span", { className: `text-xs ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`, children: label })] }, index))) }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-full rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600", initial: { width: 0 }, animate: { width: `${(currentStep / (totalSteps - 1)) * 100}%` }, transition: { duration: 0.5 } }) })] }));
}
//# sourceMappingURL=form-progress.js.map