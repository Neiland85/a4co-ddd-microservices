"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvantagesSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
const advantages = [
    {
        icon: lucide_react_1.Heart,
        title: 'Productos Auténticos',
        description: 'Cada producto cuenta una historia. Artesanía tradicional jiennense elaborada con técnicas ancestrales y materiales de la más alta calidad.',
        color: 'text-red-700', // Rojo terroso
    },
    {
        icon: lucide_react_1.Users,
        title: 'Comunidad Local',
        description: 'Apoyamos directamente a los artesanos de Jaén. Tu compra contribuye al desarrollo económico local y preserva nuestras tradiciones.',
        color: 'text-a4co-olive-600', // Verde oliva
    },
    {
        icon: lucide_react_1.Shield,
        title: 'Calidad Garantizada',
        description: 'Todos nuestros artesanos pasan por un proceso de verificación. Garantizamos la autenticidad y calidad de cada producto.',
        color: 'text-a4co-clay-600', // Arcilla
    },
];
function AdvantagesSection() {
    return ((0, jsx_runtime_1.jsx)("section", { className: "bg-gray-50 py-20", children: (0, jsx_runtime_1.jsxs)("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-16 text-center", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-4 text-3xl font-bold text-gray-900 drop-shadow-sm sm:text-4xl", children: "\u00BFPor qu\u00E9 elegir A4CO?" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-3xl text-xl text-gray-600", children: "Somos m\u00E1s que un marketplace. Somos una plataforma dedicada por y para el peque\u00F1o comercio, conectando la tradici\u00F3n artesanal con el mundo digital." })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid gap-8 md:grid-cols-3", children: advantages.map((advantage, index) => {
                        const IconComponent = advantage.icon;
                        return ((0, jsx_runtime_1.jsxs)(card_1.Card, { className: "shadow-natural-lg hover:shadow-natural-xl transform border-0 transition-all duration-300 hover:-translate-y-1", children: [(0, jsx_runtime_1.jsxs)(card_1.CardHeader, { className: "pb-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "shadow-natural mx-auto mb-4 rounded-full bg-gray-100 p-3", children: (0, jsx_runtime_1.jsx)(IconComponent, { className: `h-8 w-8 ${advantage.color}` }) }), (0, jsx_runtime_1.jsx)(card_1.CardTitle, { className: "text-xl font-semibold text-gray-900", children: advantage.title })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "text-center", children: (0, jsx_runtime_1.jsx)(card_1.CardDescription, { className: "leading-relaxed text-gray-600", children: advantage.description }) })] }, index));
                    }) }), (0, jsx_runtime_1.jsx)("div", { className: "mt-16 text-center", children: (0, jsx_runtime_1.jsxs)("div", { className: "from-a4co-olive-500 to-a4co-clay-500 shadow-mixed-lg hover:shadow-natural-xl rounded-2xl bg-gradient-to-r p-8 text-white transition-all duration-300", children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-4 text-2xl font-bold drop-shadow-md", children: "\u00DAnete a nuestra comunidad" }), (0, jsx_runtime_1.jsx)("p", { className: "mb-6 text-lg opacity-90 drop-shadow-sm", children: "Descubre productos \u00FAnicos y apoya a los artesanos locales de Ja\u00E9n" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center gap-4 sm:flex-row", children: [(0, jsx_runtime_1.jsx)("button", { className: "text-a4co-olive-700 shadow-natural-md hover:shadow-natural-lg transform rounded-lg bg-white px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50", children: "Explorar Productos" }), (0, jsx_runtime_1.jsx)("button", { className: "hover:text-a4co-olive-700 shadow-natural hover:shadow-natural-lg transform rounded-lg border border-white px-6 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white", children: "Registrarse como Artesano" })] })] }) })] }) }));
}
//# sourceMappingURL=advantages-section.js.map