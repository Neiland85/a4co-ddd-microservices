'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterForm = RegisterForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const actions_1 = require("@/app/auth/actions");
const button_1 = require("@/components/ui/button");
const checkbox_1 = require("@/components/ui/checkbox");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const use_sound_effects_1 = require("@/hooks/use-sound-effects");
const use_toast_1 = require("@/hooks/use-toast");
const auth_1 = require("@/lib/validators/auth");
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
function RegisterForm() {
    const [state, formAction, isPending] = (0, react_1.useActionState)(actions_1.registerAction, null);
    const { toast } = (0, use_toast_1.useToast)();
    const { playSuccess, playError } = (0, use_sound_effects_1.useSoundEffects)();
    const form = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(auth_1.registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
        },
    });
    (0, react_1.useEffect)(() => {
        if (state?.success) {
            playSuccess();
            toast({ title: 'Éxito', description: state.message });
            form.reset();
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
    return ((0, jsx_runtime_1.jsx)(form_1.Form, { ...form, children: (0, jsx_runtime_1.jsxs)("form", { action: formAction, className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "name", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Nombre completo" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { placeholder: "Juan P\u00E9rez", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "email", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Email" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { type: "email", placeholder: "juan@ejemplo.com", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "password", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Contrase\u00F1a" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { type: "password", placeholder: "M\u00EDnimo 6 caracteres", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "confirmPassword", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Confirmar contrase\u00F1a" }), (0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(input_1.Input, { type: "password", placeholder: "Repite tu contrase\u00F1a", ...field }) }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })) }), (0, jsx_runtime_1.jsx)(form_1.FormField, { control: form.control, name: "terms", render: ({ field }) => ((0, jsx_runtime_1.jsxs)(form_1.FormItem, { className: "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", children: [(0, jsx_runtime_1.jsx)(form_1.FormControl, { children: (0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { checked: field.value, onCheckedChange: field.onChange }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1 leading-none", children: [(0, jsx_runtime_1.jsx)(form_1.FormLabel, { children: "Acepto los t\u00E9rminos y condiciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-muted-foreground text-sm", children: "Acepto los T\u00E9rminos de Servicio y la Pol\u00EDtica de Privacidad." }), (0, jsx_runtime_1.jsx)(form_1.FormMessage, {})] })] })) }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700", disabled: isPending, children: isPending ? 'Creando cuenta...' : 'Crear Cuenta' })] }) }));
}
//# sourceMappingURL=register-form.js.map