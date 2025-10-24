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
exports.default = FoodArtisanRegistrationForm;
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
const food_artisan_profile_preview_1 = require("@/components/food-artisan-profile-preview");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB para imágenes
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB para videos
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/mov', 'video/avi', 'video/webm'];
const ACCEPTED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const schema = z
    .object({
    producerName: z
        .string()
        .min(3, 'El nombre del productor/empresa debe tener al menos 3 caracteres.'),
    activityType: z.enum(['alimentario', 'tecnologico'], {
        required_error: 'Selecciona el tipo de actividad.',
    }),
    foodCategory: z.string().optional(),
    techCategory: z.string().optional(),
    specialty: z.string().min(1, 'Especifica tu especialidad.'),
    description: z.string().max(800, 'La descripción no puede exceder los 800 caracteres.'),
    familyTradition: z.string().optional(),
    productionMethods: z
        .array(z.string())
        .min(1, 'Selecciona al menos un método de producción/trabajo.'),
    ingredients: z.string().optional(),
    techStack: z.string().optional(),
    experience: z.string().min(1, 'Indica tu experiencia.'),
    images: z
        .array(z.instanceof(File))
        .min(1, 'Debes subir al menos una imagen de tus productos/proyectos.')
        .max(8, 'Puedes subir un máximo de 8 imágenes.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada imagen no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), 'Solo se permiten imágenes en formato JPG, PNG o GIF.'),
    videos: z
        .array(z.instanceof(File))
        .max(3, 'Puedes subir un máximo de 3 videos.')
        .refine(files => files.every(file => file.size <= MAX_VIDEO_SIZE), 'Cada video no debe exceder los 50MB.')
        .refine(files => files.every(file => ACCEPTED_VIDEO_TYPES.includes(file.type)), 'Solo se permiten videos en formato MP4, MOV, AVI o WebM.')
        .optional(),
    priceRange: z.string().min(1, 'Selecciona un rango de precios.'),
    organicCertified: z.boolean().default(false),
    localSuppliers: z.boolean().default(false),
    seasonalProduction: z.boolean().default(false),
    openSource: z.boolean().default(false),
    customOrders: z.boolean().default(false),
    tastings: z.boolean().default(false),
    workshops: z.boolean().default(false),
    certifications: z.string().optional(),
    distributionArea: z.string().optional(),
    additionalInfo: z.string().optional(),
    documents: z
        .array(z.instanceof(File))
        .max(3, 'Puedes subir un máximo de 3 documentos.')
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), 'Cada archivo no debe exceder los 5MB.')
        .refine(files => files.every(file => ACCEPTED_DOCUMENT_TYPES.includes(file.type)), 'Solo se permiten documentos en formato PDF, DOC o DOCX.')
        .optional(),
})
    .refine(data => {
    if (data.activityType === 'alimentario' && !data.foodCategory) {
        return false;
    }
    if (data.activityType === 'tecnologico' && !data.techCategory) {
        return false;
    }
    return true;
}, {
    message: 'Selecciona una categoría según el tipo de actividad.',
    path: ['foodCategory'],
});
const foodCategories = [
    { value: 'ochio-pan', label: 'Ochio y Pan' },
    { value: 'quesos', label: 'Quesos Artesanales' },
    { value: 'embutidos', label: 'Embutidos y Charcutería' },
    { value: 'aceite', label: 'Aceite de Oliva' },
    { value: 'carne', label: 'Carne y Productos Cárnicos' },
    { value: 'vino', label: 'Vinos y Licores' },
    { value: 'miel', label: 'Miel y Productos Apícolas' },
    { value: 'conservas', label: 'Conservas y Encurtidos' },
    { value: 'dulces', label: 'Dulces y Repostería' },
    { value: 'cerveza', label: 'Cerveza Artesanal' },
    { value: 'lacteos', label: 'Productos Lácteos' },
    { value: 'otros-alimentarios', label: 'Otros Productos Alimentarios' },
];
const techCategories = [
    { value: 'recetas-ia', label: 'Recetas con Inteligencia Artificial' },
    { value: 'videoclips-ia', label: 'Videoclips con IA' },
    { value: 'codigo-abierto', label: 'Proyectos de Código Open Source' },
    { value: 'subvenciones-ia', label: 'Subvenciones Culturales con IA' },
    { value: 'hackeo-ayuntamiento', label: 'Hackeo al Ayuntamiento con IA' },
    { value: 'video-bromas', label: 'Video-bromas con IA' },
    { value: 'automatizacion-cultural', label: 'Automatización de Procesos Culturales' },
    { value: 'apps-culturales', label: 'Aplicaciones Culturales' },
    { value: 'realidad-virtual', label: 'Realidad Virtual y Aumentada' },
    { value: 'blockchain-cultura', label: 'Blockchain para Cultura' },
    { value: 'otros-tech', label: 'Otros Servicios Tecnológicos' },
];
const foodProductionMethods = [
    'Elaboración tradicional',
    'Fermentación natural',
    'Curado en cuevas naturales',
    'Ahumado artesanal',
    'Prensado manual',
    'Cocción en horno de leña',
    'Maduración controlada',
    'Destilación artesanal',
    'Secado al aire libre',
    'Métodos ancestrales',
    'Producción ecológica',
    'Técnicas familiares',
];
const techMethods = [
    'Desarrollo con IA generativa',
    'Machine Learning',
    'Procesamiento de lenguaje natural',
    'Computer Vision',
    'Automatización con scripts',
    'APIs y microservicios',
    'Blockchain y Web3',
    'Realidad virtual/aumentada',
    'Desarrollo móvil',
    'Cloud computing',
    'DevOps y CI/CD',
    'Open source collaboration',
];
function FoodArtisanRegistrationForm() {
    const [imagePreview, setImagePreview] = (0, react_1.useState)([]);
    const [videoList, setVideoList] = (0, react_1.useState)([]);
    const [documentList, setDocumentList] = (0, react_1.useState)([]);
    const [showPreview, setShowPreview] = (0, react_1.useState)(false);
    const [selectedMethods, setSelectedMethods] = (0, react_1.useState)([]);
    const { control, register, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(schema),
        defaultValues: {
            images: [],
            videos: [],
            documents: [],
            productionMethods: [],
            organicCertified: false,
            localSuppliers: false,
            seasonalProduction: false,
            openSource: false,
            customOrders: false,
            tastings: false,
            workshops: false,
        },
    });
    const watchedImages = watch('images');
    const watchedVideos = watch('videos');
    const watchedDocuments = watch('documents');
    const activityType = watch('activityType');
    const onSubmit = async (data) => {
        console.log('Datos del productor/creador enviados:', data);
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('¡Perfil registrado exitosamente!');
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
    const handleVideoUpload = (files) => {
        if (!files)
            return;
        const fileArray = Array.from(files);
        const validFiles = fileArray.filter(file => ACCEPTED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_VIDEO_SIZE);
        if (validFiles.length + watchedVideos.length > 3) {
            alert('Solo puedes subir un máximo de 3 videos');
            return;
        }
        setValue('videos', [...watchedVideos, ...validFiles]);
        setVideoList(prev => [...prev, ...validFiles]);
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
    const removeVideo = (index) => {
        const newVideos = watchedVideos.filter((_, i) => i !== index);
        const newVideoList = videoList.filter((_, i) => i !== index);
        setValue('videos', newVideos);
        setVideoList(newVideoList);
    };
    const removeDocument = (index) => {
        const newDocuments = watchedDocuments.filter((_, i) => i !== index);
        const newDocumentList = documentList.filter((_, i) => i !== index);
        setValue('documents', newDocuments);
        setDocumentList(newDocumentList);
    };
    const handleMethodChange = (method, checked) => {
        let newMethods;
        if (checked) {
            newMethods = [...selectedMethods, method];
        }
        else {
            newMethods = selectedMethods.filter(m => m !== method);
        }
        setSelectedMethods(newMethods);
        setValue('productionMethods', newMethods);
    };
    const currentMethods = activityType === 'tecnologico' ? techMethods : foodProductionMethods;
    return ((0, jsx_runtime_1.jsx)(tooltip_1.TooltipProvider, { children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-4xl space-y-6 p-6", children: [(0, jsx_runtime_1.jsxs)(card_1.Card, { children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-center justify-center gap-2", children: [activityType === 'tecnologico' ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Cpu, { className: "h-8 w-8 text-blue-600" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.ChefHat, { className: "h-8 w-8 text-green-600" })), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-3xl font-bold text-gray-800", children: "Registro de Productor y Creador" })] }), (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "text-lg", children: "Comparte tus productos alimentarios tradicionales o servicios tecnol\u00F3gicos culturales. Conecta con quienes valoran la calidad artesanal y la innovaci\u00F3n digital." })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { children: (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: "Informaci\u00F3n B\u00E1sica" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)(label_1.Label, { htmlFor: "producerName", children: ["Nombre del Productor/Creador *", (0, jsx_runtime_1.jsxs)(tooltip_1.Tooltip, { children: [(0, jsx_runtime_1.jsx)(tooltip_1.TooltipTrigger, { asChild: true, children: (0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "ml-1 inline h-4 w-4 text-gray-400" }) }), (0, jsx_runtime_1.jsx)(tooltip_1.TooltipContent, { children: (0, jsx_runtime_1.jsx)("p", { children: "Tu nombre o el nombre de tu empresa/proyecto" }) })] })] }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "producerName", ...register('producerName'), placeholder: "Ej: Queser\u00EDa La Tradici\u00F3n / TechCultura Labs" }), errors.producerName && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.producerName.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "activityType", children: "Tipo de Actividad *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "activityType", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona el tipo de actividad" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "alimentario", children: "\uD83C\uDF6F Productos Alimentarios Artesanales" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "tecnologico", children: "\uD83D\uDCBB Servicios Tecnol\u00F3gicos Culturales" })] })] })) }), errors.activityType && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.activityType.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [activityType === 'alimentario' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "foodCategory", children: "Categor\u00EDa de Producto Alimentario *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "foodCategory", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona tu categor\u00EDa alimentaria" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: foodCategories.map(category => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: category.value, children: category.label }, category.value))) })] })) }), errors.foodCategory && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.foodCategory.message }))] })), activityType === 'tecnologico' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "techCategory", children: "Categor\u00EDa de Servicio Tecnol\u00F3gico *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "techCategory", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona tu categor\u00EDa tecnol\u00F3gica" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: techCategories.map(category => ((0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: category.value, children: category.label }, category.value))) })] })) }), errors.techCategory && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.techCategory.message }))] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "specialty", children: "Especialidad *" }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "specialty", ...register('specialty'), placeholder: activityType === 'tecnologico'
                                                                    ? 'Ej: Automatización con ChatGPT, Apps culturales'
                                                                    : 'Ej: Queso de cabra curado, Chorizo ibérico' }), errors.specialty && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.specialty.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "experience", children: "Experiencia *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "experience", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona tu experiencia" }) }), (0, jsx_runtime_1.jsxs)(select_1.SelectContent, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "principiante", children: "Principiante (1-3 a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "intermedio", children: "Intermedio (4-7 a\u00F1os)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "avanzado", children: "Avanzado (8-15 a\u00F1os)" }), (0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: "maestro", children: [activityType === 'tecnologico'
                                                                                            ? 'Tech Lead/Senior'
                                                                                            : 'Maestro Productor', ' ', "(15+ a\u00F1os)"] }), (0, jsx_runtime_1.jsxs)(select_1.SelectItem, { value: "tradicion-familiar", children: [activityType === 'tecnologico'
                                                                                            ? 'Pionero/Innovador'
                                                                                            : 'Tradición Familiar', ' ', "(generaciones/vanguardia)"] })] })] })) }), errors.experience && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.experience.message }))] }), activityType === 'alimentario' && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "familyTradition", children: "Historia y Tradici\u00F3n Familiar" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "familyTradition", ...register('familyTradition'), placeholder: "Cu\u00E9ntanos sobre la historia de tu familia en la producci\u00F3n, recetas ancestrales...", rows: 3, className: "resize-none" })] }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: activityType === 'tecnologico'
                                                    ? 'Métodos y Tecnologías'
                                                    : 'Métodos de Producción' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: activityType === 'tecnologico'
                                                            ? 'Tecnologías que dominas *'
                                                            : 'Métodos que utilizas *' }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3 md:grid-cols-3", children: currentMethods.map(method => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: method, checked: selectedMethods.includes(method), onCheckedChange: checked => handleMethodChange(method, checked) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: method, className: "text-sm font-normal", children: method })] }, method))) }), errors.productionMethods && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.productionMethods.message }))] }), activityType === 'alimentario' ? ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "ingredients", children: "Ingredientes principales" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "ingredients", ...register('ingredients'), placeholder: "Ej: Leche cruda de cabras de la zona, sal marina, cuajo natural...", rows: 3, className: "resize-none" })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "techStack", children: "Stack tecnol\u00F3gico y herramientas" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "techStack", ...register('techStack'), placeholder: "Ej: Python, OpenAI API, React, Node.js, GitHub, Figma, Adobe Premiere...", rows: 3, className: "resize-none" })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: activityType === 'tecnologico'
                                                    ? 'Descripción de tus Servicios'
                                                    : 'Descripción de tus Productos' }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "description", children: activityType === 'tecnologico'
                                                            ? 'Cuéntanos sobre tus servicios *'
                                                            : 'Cuéntanos sobre tus productos *' }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "description", ...register('description'), placeholder: activityType === 'tecnologico'
                                                            ? 'Describe tus servicios, proyectos realizados, cómo ayudas a organizaciones culturales con tecnología...'
                                                            : 'Describe el sabor, textura, proceso de elaboración, lo que hace únicos tus productos...', rows: 6, className: "resize-none" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between text-sm text-gray-500", children: [(0, jsx_runtime_1.jsx)("span", { children: "M\u00E1ximo 800 caracteres" }), (0, jsx_runtime_1.jsxs)("span", { children: [watch('description')?.length || 0, "/800"] })] }), errors.description && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.description.message }))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: activityType === 'tecnologico' ? 'Galería de Proyectos' : 'Galería de Productos' }), (0, jsx_runtime_1.jsxs)("div", { className: `rounded-lg border-2 border-dashed p-6 text-center transition-colors hover:border-gray-400 ${activityType === 'tecnologico'
                                                    ? 'border-blue-300 bg-blue-50'
                                                    : 'border-green-300 bg-green-50'}`, children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "image/jpeg,image/png,image/gif", multiple: true, onChange: e => handleImageUpload(e.target.files), className: "hidden", id: "image-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "image-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Upload, { className: `mx-auto h-12 w-12 ${activityType === 'tecnologico' ? 'text-blue-500' : 'text-green-500'}` }), (0, jsx_runtime_1.jsx)("p", { className: `mt-2 text-sm font-medium ${activityType === 'tecnologico' ? 'text-blue-700' : 'text-green-700'}`, children: activityType === 'tecnologico'
                                                                    ? 'Sube capturas de tus proyectos y aplicaciones'
                                                                    : 'Sube fotos de tus mejores productos' }), (0, jsx_runtime_1.jsx)("p", { className: `text-xs ${activityType === 'tecnologico' ? 'text-blue-600' : 'text-green-600'}`, children: "JPG, PNG, GIF hasta 5MB cada una (m\u00EDnimo 1, m\u00E1ximo 8 im\u00E1genes)" })] })] }), imagePreview.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", children: imagePreview.map((preview, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "group relative", children: [(0, jsx_runtime_1.jsx)("img", { src: preview || '/placeholder.svg', alt: `${activityType === 'tecnologico' ? 'Proyecto' : 'Producto'} ${index + 1}`, className: `h-32 w-full rounded-lg border-2 object-cover ${activityType === 'tecnologico' ? 'border-blue-200' : 'border-green-200'}` }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "destructive", size: "sm", className: "absolute -right-2 -top-2 h-6 w-6 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100", onClick: () => removeImage(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" }) })] }, index))) })), errors.images && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.images.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "flex items-center gap-2 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Video, { className: "h-5 w-5" }), activityType === 'tecnologico' ? 'Videos de Proyectos' : 'Videos de Productos'] }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6 text-center transition-colors hover:border-purple-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: "video/mp4,video/mov,video/avi,video/webm", multiple: true, onChange: e => handleVideoUpload(e.target.files), className: "hidden", id: "video-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "video-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Video, { className: "mx-auto h-12 w-12 text-purple-500" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm font-medium text-purple-700", children: activityType === 'tecnologico'
                                                                    ? 'Sube videos demostrativos de tus proyectos'
                                                                    : 'Sube videos de tu proceso de elaboración' }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-purple-600", children: "MP4, MOV, AVI, WebM hasta 50MB cada uno (m\u00E1ximo 3 videos)" })] })] }), videoList.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: videoList.map((video, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Play, { className: "h-6 w-6 text-purple-600" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "max-w-xs truncate text-sm font-medium text-gray-900", children: video.name }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [(0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: [(video.size / 1024 / 1024).toFixed(1), " MB"] }), (0, jsx_runtime_1.jsx)("span", { children: "\u2022" }), (0, jsx_runtime_1.jsx)("span", { children: video.type.split('/')[1].toUpperCase() })] })] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeVideo(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, index))) })), errors.videos && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.videos.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: "Informaci\u00F3n Comercial" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "priceRange", children: "Rango de precios *" }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "priceRange", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsxs)(select_1.Select, { onValueChange: field.onChange, value: field.value, children: [(0, jsx_runtime_1.jsx)(select_1.SelectTrigger, { children: (0, jsx_runtime_1.jsx)(select_1.SelectValue, { placeholder: "Selecciona el rango de precios" }) }), (0, jsx_runtime_1.jsx)(select_1.SelectContent, { children: activityType === 'tecnologico' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "basico", children: "B\u00E1sico (\u20AC50-200/proyecto)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "intermedio", children: "Intermedio (\u20AC200-800/proyecto)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "avanzado", children: "Avanzado (\u20AC800-2000/proyecto)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "enterprise", children: "Enterprise (\u20AC2000+/proyecto)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "por-horas", children: "Por horas (\u20AC25-100/hora)" })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "economico", children: "Econ\u00F3mico (\u20AC5-15/kg)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "medio", children: "Medio (\u20AC15-30/kg)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "premium", children: "Premium (\u20AC30-60/kg)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "gourmet", children: "Gourmet (\u20AC60+/kg)" }), (0, jsx_runtime_1.jsx)(select_1.SelectItem, { value: "variable", children: "Variable seg\u00FAn producto" })] })) })] })) }), errors.priceRange && ((0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-500", children: errors.priceRange.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "distributionArea", children: activityType === 'tecnologico' ? 'Área de trabajo' : 'Área de distribución' }), (0, jsx_runtime_1.jsx)(input_1.Input, { id: "distributionArea", ...register('distributionArea'), placeholder: activityType === 'tecnologico'
                                                                    ? 'Ej: Remoto, Local, Nacional, Internacional'
                                                                    : 'Ej: Local, Regional, Nacional, Internacional' })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: "Caracter\u00EDsticas y servicios" }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [(0, jsx_runtime_1.jsx)("div", { className: "space-y-3", children: activityType === 'alimentario' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "organicCertified", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "organicCertified", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "organicCertified", className: "font-normal", children: "Certificaci\u00F3n ecol\u00F3gica" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "localSuppliers", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "localSuppliers", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "localSuppliers", className: "font-normal", children: "Proveedores locales" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "seasonalProduction", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "seasonalProduction", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "seasonalProduction", className: "font-normal", children: "Producci\u00F3n estacional" })] })] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "openSource", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "openSource", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "openSource", className: "font-normal", children: "Proyectos Open Source" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "workshops", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "workshops", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "workshops", className: "font-normal", children: "Talleres y formaci\u00F3n" })] })] })) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "customOrders", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "customOrders", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "customOrders", className: "font-normal", children: activityType === 'tecnologico'
                                                                                    ? 'Proyectos personalizados'
                                                                                    : 'Pedidos personalizados' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: "tastings", control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(checkbox_1.Checkbox, { id: "tastings", checked: field.value, onCheckedChange: field.onChange })) }), (0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "tastings", className: "font-normal", children: activityType === 'tecnologico'
                                                                                    ? 'Demos y presentaciones'
                                                                                    : 'Catas y degustaciones' })] })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("h3", { className: "flex items-center gap-2 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-700", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Award, { className: "h-5 w-5" }), "Certificaciones y Reconocimientos"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "certifications", children: activityType === 'tecnologico'
                                                            ? 'Certificaciones técnicas, premios o reconocimientos'
                                                            : 'Certificaciones, premios o denominaciones de origen' }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "certifications", ...register('certifications'), placeholder: activityType === 'tecnologico'
                                                            ? 'Ej: AWS Certified, Google Developer Expert, Premios de hackathons, Certificaciones en IA...'
                                                            : 'Ej: D.O.P. Queso Manchego, Certificación Ecológica, Premio Nacional de Gastronomía 2023...', rows: 3, className: "resize-none" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { htmlFor: "additionalInfo", children: "Informaci\u00F3n adicional" }), (0, jsx_runtime_1.jsx)(textarea_1.Textarea, { id: "additionalInfo", ...register('additionalInfo'), placeholder: activityType === 'tecnologico'
                                                        ? 'Horarios de trabajo, colaboraciones con organizaciones, proyectos destacados, etc.'
                                                        : 'Horarios de producción, visitas a la granja/fábrica, mercados donde vendes, etc.', rows: 4, className: "resize-none" })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)(label_1.Label, { children: activityType === 'tecnologico'
                                                    ? 'Portfolio y documentación'
                                                    : 'Catálogos y certificados' }), (0, jsx_runtime_1.jsxs)("div", { className: "rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-gray-400", children: [(0, jsx_runtime_1.jsx)("input", { type: "file", accept: ".pdf,.doc,.docx", multiple: true, onChange: e => handleDocumentUpload(e.target.files), className: "hidden", id: "document-upload" }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "document-upload", className: "cursor-pointer", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "mx-auto h-12 w-12 text-gray-400" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: activityType === 'tecnologico'
                                                                    ? 'Sube portfolio, documentación técnica, casos de estudio'
                                                                    : 'Sube catálogos de productos, certificados sanitarios, premios' }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: "PDF, DOC, DOCX hasta 5MB cada uno (m\u00E1ximo 3 documentos)" })] })] }), documentList.length > 0 && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: documentList.map((doc, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between rounded-lg bg-gray-50 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-2", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.FileText, { className: "h-4 w-4 text-gray-500" }), (0, jsx_runtime_1.jsx)("span", { className: "truncate text-sm", children: doc.name }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: "secondary", className: "text-xs", children: [(doc.size / 1024 / 1024).toFixed(1), " MB"] })] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "button", variant: "ghost", size: "sm", onClick: () => removeDocument(index), children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] }, index))) })), errors.documents && ((0, jsx_runtime_1.jsx)(alert_1.Alert, { variant: "destructive", children: (0, jsx_runtime_1.jsx)(alert_1.AlertDescription, { children: errors.documents.message }) }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-4 border-t pt-6 sm:flex-row", children: [(0, jsx_runtime_1.jsxs)(button_1.Button, { type: "button", variant: "outline", className: `flex-1 bg-transparent ${activityType === 'tecnologico'
                                                    ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                                                    : 'border-green-300 text-green-700 hover:bg-green-50'}`, onClick: () => setShowPreview(!showPreview), children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "mr-2 h-4 w-4" }), showPreview ? 'Ocultar vista previa' : 'Ver vista previa'] }), (0, jsx_runtime_1.jsx)(button_1.Button, { type: "submit", className: `flex-1 ${activityType === 'tecnologico'
                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                    : 'bg-green-600 hover:bg-green-700'}`, size: "lg", disabled: isSubmitting, children: isSubmitting ? 'Registrando...' : 'Registrar Perfil' })] })] }) })] }), showPreview && ((0, jsx_runtime_1.jsx)(food_artisan_profile_preview_1.FoodArtisanProfilePreview, { producerName: watch('producerName'), activityType: watch('activityType'), foodCategory: watch('foodCategory'), techCategory: watch('techCategory'), specialty: watch('specialty'), description: watch('description'), familyTradition: watch('familyTradition'), productionMethods: selectedMethods, ingredients: watch('ingredients'), techStack: watch('techStack'), experience: watch('experience'), priceRange: watch('priceRange'), organicCertified: watch('organicCertified'), localSuppliers: watch('localSuppliers'), seasonalProduction: watch('seasonalProduction'), openSource: watch('openSource'), customOrders: watch('customOrders'), tastings: watch('tastings'), workshops: watch('workshops'), certifications: watch('certifications'), distributionArea: watch('distributionArea'), additionalInfo: watch('additionalInfo'), images: imagePreview, videos: videoList, documents: documentList }))] }) }));
}
//# sourceMappingURL=food-artisan-registration-form.js.map