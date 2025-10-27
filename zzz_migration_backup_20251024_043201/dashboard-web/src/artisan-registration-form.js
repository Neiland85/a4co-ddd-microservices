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
exports.default = ArtisanRegistrationForm;
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
const checkbox_1 = require("@/components/ui/checkbox");
const artisan_profile_preview_1 = require("@/components/artisan-profile-preview");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ACCEPTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const schema = z.object({
    artisanName: z.string().min(3, 'El nombre del artesano/taller debe tener al menos 3 caracteres.'),
    niche: z.string().min(1, 'Selecciona un nicho artesanal.'),
    specialty: z.string().min(1, 'Especifica tu especialidad.'),
    description: z.string().max(800, 'La descripción no puede exceder los 800 caracteres.'),
    culturalOrigin: z.string().optional(),
    techniques: z.array(z.string()).min(1, 'Selecciona al menos una técnica.'),
    materials: z.string().min(1, 'Especifica los materiales que utilizas.'),
    experience: z.string().min(1, 'Indica tu experiencia.'),
    images: z
        .array(z.instanceof(File))
        .min(1, 'Debes subir al menos una imagen de tus productos.')
        .max(8, 'Puedes subir un máximo de 8 imágenes.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada archivo no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Solo se permiten imágenes en formato JPG, PNG o GIF.'),
    priceRange: z.string().min(1, 'Selecciona un rango de precios.'),
    customOrders: z.boolean().default(false),
    workshops: z.boolean().default(false),
    certifications: z.string().optional(),
    additionalInfo: z.string().optional(),
    documents: z
        .array(z.instanceof(File))
        .max(3, 'Puedes subir un máximo de 3 documentos.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada archivo no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_DOCUMENT_TYPES.includes(file.type)), 'Solo se permiten documentos en formato PDF, DOC o DOCX.')
        .optional(),
});
const artisanNiches = [
    { value: 'ceramica', label: 'Cerámica y Alfarería' },
    { value: 'textil', label: 'Textil y Fibras' },
    { value: 'madera', label: 'Carpintería y Tallado' },
    { value: 'metal', label: 'Metalistería y Joyería' },
    { value: 'cuero', label: 'Marroquinería y Cuero' },
    { value: 'vidrio', label: 'Vidrio y Cristal' },
    { value: 'papel', label: 'Papel y Encuadernación' },
    { value: 'piedra', label: 'Cantería y Escultura' },
    { value: 'gastronomia', label: 'Gastronomía Tradicional' },
    { value: 'instrumentos', label: 'Instrumentos Musicales' },
    { value: 'decoracion', label: 'Decoración y Ornamentos' },
    { value: 'otros', label: 'Otros Oficios Tradicionales' },
];
const commonTechniques = [
    'Torno de alfarero',
    'Tejido a mano',
    'Bordado tradicional',
    'Tallado en madera',
    'Forja',
    'Soldadura artística',
    'Repujado',
    'Filigrana',
    'Soplado de vidrio',
    'Grabado',
    'Pintura decorativa',
    'Técnicas ancestrales',
];
function ArtisanRegistrationForm() {
    const [imagePreview, setImagePreview] = (0, react_1.useState)([]);
    const [documentList, setDocumentList] = (0, react_1.useState)([]);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [selectedTechniques, setSelectedTechniques] = (0, react_1.useState)([]);
    const { control, register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema),
        defaultValues: {
            images: [],
            documents: [],
            techniques: [],
            customOrders: false,
            workshops: false,
        },
    });
    const watchedImages = watch('images');
    const watchedDocuments = watch('documents');
    const onSubmit = async (data) => {
        console.log('Datos del artesano enviados:', data);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('¡Perfil de artesano registrado exitosamente!');
    };
    const handleImageUpload = (files) => {
        if (!files)
            return;
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_FILE_SIZE);
        if (validFiles.length + watchedImages.length > 8) {
            alert('Solo puedes subir un máximo de 8 imágenes');
            return;
        }
        setValue('images', [...watchedImages, ...validFiles]);
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
    const handleTechniqueChange = (technique, checked) => {
        let newTechniques;
        if (checked) {
            newTechniques = [...selectedTechniques, technique];
        }
        else {
            newTechniques = selectedTechniques.filter(t => t !== technique);
        }
        setSelectedTechniques(newTechniques);
        setValue('techniques', newTechniques);
    };
    return ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-4xl space-y-6 p-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-center gap-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Palette, { className: "h-8 w-8 text-amber-600" }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-3xl font-bold text-amber-800", children: "Registro de Artesano" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-lg", children: "Comparte tu arte y tradici\u00F3n cultural con el mundo. Registra tu taller artesanal y conecta con quienes valoran el trabajo hecho a mano." })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: "Informaci\u00F3n del Artesano" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { htmlFor: "artisanName", children: ["Nombre del Artesano/Taller *", (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "ml-1 inline h-4 w-4 text-gray-400" }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { children: (0, jsx_runtime_1.jsx)("p", { children: "Tu nombre o el nombre de tu taller artesanal" }) })] })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "artisanName", ...register('artisanName'), placeholder: "Ej: Taller de Cer\u00E1mica Maya" }), errors.artisanName && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.artisanName.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "niche", children: "Nicho Artesanal *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "niche", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona tu nicho" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: artisanNiches.map(niche => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: niche.value, children: niche.label }, niche.value))) })] })) }), errors.niche && (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.niche.message })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "specialty", children: "Especialidad *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "specialty", ...register('specialty'), placeholder: "Ej: Vasijas decorativas, Huipiles bordados" }), errors.specialty && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.specialty.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "culturalOrigin", children: "Origen Cultural" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "culturalOrigin", ...register('culturalOrigin'), placeholder: "Ej: Tradici\u00F3n Maya, Artesan\u00EDa Andaluza" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "experience", children: "Experiencia *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "experience", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona tu nivel de experiencia" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "principiante", children: "Principiante (1-2 a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "intermedio", children: "Intermedio (3-5 a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "avanzado", children: "Avanzado (6-10 a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "maestro", children: "Maestro Artesano (10+ a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "tradicion-familiar", children: "Tradici\u00F3n Familiar (generaciones)" })] })] })) }), errors.experience && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.experience.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: "T\u00E9cnicas y Materiales" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "T\u00E9cnicas que dominas *" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: commonTechniques.map(technique => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: technique, checked: selectedTechniques.includes(technique), onCheckedChange: checked => handleTechniqueChange(technique, checked) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: technique, className: "text-sm font-normal", children: technique })] }, technique))) }), errors.techniques && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.techniques.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "materials", children: "Materiales principales *" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "materials", ...register('materials'), placeholder: "Ej: Arcilla local, pigmentos naturales, madera de cedro, hilos de algod\u00F3n org\u00E1nico...", rows: 3, className: "resize-none" }), errors.materials && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.materials.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: "Descripci\u00F3n de tu Trabajo" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: "Cu\u00E9ntanos sobre tu arte *" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", ...register('description'), placeholder: "Describe tu proceso creativo, la historia detr\u00E1s de tus piezas, qu\u00E9 te inspira, t\u00E9cnicas especiales que utilizas...", rows: 6, className: "resize-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "M\u00E1ximo 800 caracteres" }), (0, jsx_runtime_1.jsxs)("span", { children: [watch('description')?.length || 0, "/800"] })] }), errors.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.description.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: "Galer\u00EDa de Productos" }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 p-6 text-center transition-colors hover:border-amber-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/jpeg,image/png,image/gif", multiple: true, onChange: e => handleImageUpload(e.target.files), className: "hidden", id: "image-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "image-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: "mx-auto h-12 w-12 text-amber-500" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-medium text-amber-700", children: "Sube fotos de tus mejores creaciones" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-amber-600", children: "JPG, PNG, GIF hasta 5MB cada una (m\u00EDnimo 1, m\u00E1ximo 8 im\u00E1genes)" })] })] }), imagePreview.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: imagePreview.map((preview, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "group relative", children: [(0, jsx_runtime_1.jsx)("img", { src: preview || '/placeholder.svg', alt: `Producto ${index + 1}`, className: "h-32 w-full rounded-lg border-2 border-amber-200 object-cover" }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "destructive", size: "sm", className: "absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100", onClick: () => removeImage(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] }, index))) })), errors.images && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.images.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: "Informaci\u00F3n Comercial" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "priceRange", children: "Rango de precios *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "priceRange", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona el rango de precios" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "economico", children: "Econ\u00F3mico (\u20AC10-50)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "medio", children: "Medio (\u20AC50-150)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "premium", children: "Premium (\u20AC150-500)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "lujo", children: "Lujo (\u20AC500+)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "variable", children: "Variable seg\u00FAn pieza" })] })] })) }), errors.priceRange && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.priceRange.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Servicios adicionales" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "customOrders", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "customOrders", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "customOrders", className: "font-normal", children: "Acepto pedidos personalizados" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "workshops", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "workshops", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "workshops", className: "font-normal", children: "Ofrezco talleres y clases" })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "flex items-center gap-2 border-b border-amber-200 pb-2 text-xl font-semibold text-amber-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { className: "h-5 w-5" }), "Certificaciones y Reconocimientos"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "certifications", children: "Certificaciones, premios o reconocimientos" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "certifications", ...register('certifications'), placeholder: "Ej: Certificado de Artesano Tradicional, Premio Regional de Artesan\u00EDa 2023, Denominaci\u00F3n de Origen...", rows: 3, className: "resize-none" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "additionalInfo", children: "Informaci\u00F3n adicional" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "additionalInfo", ...register('additionalInfo'), placeholder: "Horarios de taller, ubicaci\u00F3n, historia familiar, colaboraciones especiales, etc.", rows: 4, className: "resize-none" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Cat\u00E1logos y material adicional" }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".pdf,.doc,.docx", multiple: true, onChange: e => handleDocumentUpload(e.target.files), className: "hidden", id: "document-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "document-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: "Sube cat\u00E1logos, certificados, art\u00EDculos de prensa" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "PDF, DOC, DOCX hasta 5MB cada uno (m\u00E1ximo 3 documentos)" })] })] }), documentList.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: documentList.map((doc, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate text-sm", children: doc.name }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: [(doc.size / 1024 / 1024).toFixed(1), " MB"] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeDocument(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, index))) })), errors.documents && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.documents.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 border-t pt-6 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", variant: "outline", className: "flex-1 border-amber-300 bg-transparent text-amber-700 hover:bg-amber-50", onClick: () => setShowPreview(!showPreview), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), showPreview ? 'Ocultar vista previa' : 'Ver vista previa'] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: "flex-1 bg-amber-600 hover:bg-amber-700", size: "lg", disabled: isSubmitting, children: isSubmitting ? 'Registrando...' : 'Registrar Perfil Artesanal' })] })] }) })] }), showPreview && ((0, jsx_runtime_1.jsx)(artisan_profile_preview_1.ArtisanProfilePreview, { artisanName: watch('artisanName'), niche: watch('niche'), specialty: watch('specialty'), description: watch('description'), culturalOrigin: watch('culturalOrigin'), techniques: selectedTechniques, materials: watch('materials'), experience: watch('experience'), priceRange: watch('priceRange'), customOrders: watch('customOrders'), workshops: watch('workshops'), certifications: watch('certifications'), additionalInfo: watch('additionalInfo'), images: imagePreview, documents: documentList }))] }) }));
}
//# sourceMappingURL=artisan-registration-form.js.map