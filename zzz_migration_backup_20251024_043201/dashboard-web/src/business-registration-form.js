'use client';
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BusinessRegistrationForm;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const zod_1 = require("@hookform/resolvers/zod");
const z = __importStar(require("zod"));
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const textarea_1 = require("@/components/ui/textarea");
const select_1 = require("@/components/ui/select");
const badge_1 = require("@/components/ui/badge");
const tooltip_1 = require("@/components/ui/tooltip");
const alert_1 = require("@/components/ui/alert");
const business_profile_preview_1 = require("@/components/business-profile-preview");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ACCEPTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const schema = z.object({
    businessName: z.string().min(3, 'El nombre del negocio debe tener al menos 3 caracteres.'),
    description: z.string().max(500, 'La descripción no puede exceder los 500 caracteres.'),
    activity: z.string().min(1, 'Selecciona una actividad.'),
    images: z
        .array(z.instanceof(File))
        .max(5, 'Puedes subir un máximo de 5 imágenes.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada archivo no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Solo se permiten imágenes en formato JPG, PNG o GIF.'),
    additionalInfo: z.string().optional(),
    documents: z
        .array(z.instanceof(File))
        .max(3, 'Puedes subir un máximo de 3 documentos.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada archivo no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_DOCUMENT_TYPES.includes(file.type)), 'Solo se permiten documentos en formato PDF, DOC o DOCX.')
        .optional(),
});
function BusinessRegistrationForm() {
    const [imagePreview, setImagePreview] = (0, react_1.useState)([]);
    const [documentList, setDocumentList] = (0, react_1.useState)([]);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const { control, register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema),
        defaultValues: {
            images: [],
            documents: [],
        },
    });
    const watchedImages = watch('images');
    const watchedDocuments = watch('documents');
    const onSubmit = async (data) => {
        console.log('Datos enviados:', data);
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('¡Negocio registrado exitosamente!');
    };
    const handleImageUpload = (files) => {
        if (!files)
            return;
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE);
        if (validFiles.length + watchedImages.length > 5) {
            alert('Solo puedes subir un máximo de 5 imágenes');
            return;
        }
        setValue('images', [...watchedImages, ...validFiles]);
        // Crear previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                setImagePreview(prev => [...prev, e.target?.result]);
            };
            reader.readAsDataURL(file);
        });
    };
    const handleDocumentUpload = (files) => {
        if (!files)
            return;
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => ACCEPTED_DOCUMENT_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE);
        if (validFiles.length + watchedDocuments.length > 3) {
            alert('Solo puedes subir un máximo de 3 documentos');
            return;
        }
        setValue('documents', [...watchedDocuments, ...validFiles]);
        setDocumentList(prev => [...prev, ...validFiles]);
    };
    const removeImage = (index) => {
        const newImages = watchedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreview.filter((_, i) => i !== index);
        setValue('images', newImages);
        setImagePreview(newPreviews);
    };
    const removeDocument = (index) => {
        const newDocuments = watchedDocuments.filter((_, i) => i !== index);
        const newDocumentList = documentList.filter((_, i) => i !== index);
        setValue('documents', newDocuments);
        setDocumentList(newDocumentList);
    };
    return ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-4xl space-y-6 p-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-2xl font-bold", children: "Registro de Negocio" }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { children: "Completa la informaci\u00F3n de tu negocio para crear tu perfil" })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { htmlFor: "businessName", children: ["Nombre del negocio *", (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "ml-1 inline h-4 w-4 text-gray-400" }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { children: (0, jsx_runtime_1.jsx)("p", { children: "El nombre comercial de tu negocio" }) })] })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "businessName", ...register('businessName'), placeholder: "Ej: Mi Restaurante" }), errors.businessName && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.businessName.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "activity", children: "Actividad principal *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "activity", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona una actividad" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "restaurante", children: "Restaurante" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "tienda", children: "Tienda" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "servicios", children: "Servicios" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "tecnologia", children: "Tecnolog\u00EDa" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "salud", children: "Salud y Bienestar" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "educacion", children: "Educaci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "construccion", children: "Construcci\u00F3n" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "otros", children: "Otros" })] })] })) }), errors.activity && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.activity.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: "Descripci\u00F3n del negocio" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", ...register('description'), placeholder: "Describe tu negocio, servicios que ofreces, etc.", rows: 4, className: "resize-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "M\u00E1ximo 500 caracteres" }), (0, jsx_runtime_1.jsxs)("span", { children: [watch('description')?.length || 0, "/500"] })] }), errors.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.description.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Im\u00E1genes del negocio" }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/jpeg,image/png,image/gif", multiple: true, onChange: e => handleImageUpload(e.target.files), className: "hidden", id: "image-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "image-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "Haz clic para subir im\u00E1genes o arrastra y suelta" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "JPG, PNG, GIF hasta 5MB cada una (m\u00E1ximo 5 im\u00E1genes)" })] })] }), imagePreview.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5", children: imagePreview.map((preview, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "group relative", children: [(0, jsx_runtime_1.jsx)("img", { src: preview || '/placeholder.svg', alt: `Preview ${index + 1}`, className: "h-24 w-full rounded-lg object-cover" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "destructive", size: "sm", className: "absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100", onClick: () => removeImage(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] }, index))) })), errors.images && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.images.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "additionalInfo", children: "Informaci\u00F3n adicional" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "additionalInfo", ...register('additionalInfo'), placeholder: "Horarios de atenci\u00F3n, ubicaci\u00F3n, servicios especiales, etc.", rows: 3, className: "resize-none" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Material adicional (opcional)" }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".pdf,.doc,.docx", multiple: true, onChange: e => handleDocumentUpload(e.target.files), className: "hidden", id: "document-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "document-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "Sube documentos adicionales (men\u00FAs, cat\u00E1logos, etc.)" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "PDF, DOC, DOCX hasta 5MB cada uno (m\u00E1ximo 3 documentos)" })] })] }), documentList.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: documentList.map((doc, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate text-sm", children: doc.name }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: [(doc.size / 1024 / 1024).toFixed(1), " MB"] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeDocument(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, index))) })), errors.documents && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.documents.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", variant: "outline", className: "flex-1 bg-transparent", onClick: () => setShowPreview(!showPreview), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), showPreview ? 'Ocultar vista previa' : 'Ver vista previa'] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "flex-1", size: "lg", disabled: isSubmitting, children: isSubmitting ? 'Registrando...' : 'Registrar negocio' })] })] }) })] }), showPreview && ((0, jsx_runtime_1.jsx)(business_profile_preview_1.BusinessProfilePreview, { businessName: watch('businessName'), description: watch('description'), activity: watch('activity'), additionalInfo: watch('additionalInfo'), images: imagePreview, documents: documentList }))] }) }));
}
//# sourceMappingURL=business-registration-form.js.map