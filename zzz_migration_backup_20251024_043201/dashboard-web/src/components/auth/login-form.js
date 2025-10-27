'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginForm = LoginForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("@/app/auth/actions");
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const use_sound_effects_1 = require("@/hooks/use-sound-effects");
const use_toast_1 = require("@/hooks/use-toast");
const auth_1 = require("@/lib/validators/auth");
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
function LoginForm() {
    const [state, formAction, isPending] = (0, react_1.useActionState)(actions_1.loginAction, null);
    const { toast } = (0, use_toast_1.useToast)();
    const { playSuccess, playError } = (0, use_sound_effects_1.useSoundEffects)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_1.loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    (0, react_1.useEffect)(() => {
        if (state?.success) {
            playSuccess();
            toast({ title: 'Éxito', description: state.message });
        }
        else if (state?.message) {
            playError();
            toast({
                title: 'Error',
                description: state.message,
                variant: 'destructive',
            });
            if (state.errors) {
                for (const [field, errors] of Object.entries(state.errors)) {
                    form.setError(field, {
                        type: 'manual',
                        message: errors?.join(', '),
                    });
                }
            }
        }
    }, [state, toast, playSuccess, playError, form]);
    return ((0, jsx_runtime_1.jsx)(form_1.Form, { ...form, children: (0, jsx_runtime_1.jsxs)("form", { action: formAction, className: "space-y-6", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "email", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Email" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { type: "email", placeholder: "test@example.com", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "password", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Contrase\u00F1a" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { type: "password", placeholder: "password123", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800", disabled: isPending, children: isPending ? 'Iniciando sesión...' : 'Iniciar Sesión' })] }) }));
}
//# sourceMappingURL=login-form.js.map