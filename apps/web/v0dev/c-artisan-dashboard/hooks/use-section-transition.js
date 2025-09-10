'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSectionTransition = useSectionTransition;
const react_1 = require("react");
function useSectionTransition(activeSection) {
    const [isTransitioning, setIsTransitioning] = (0, react_1.useState)(false);
    const [previousSection, setPreviousSection] = (0, react_1.useState)(activeSection);
    (0, react_1.useEffect)(() => {
        if (activeSection !== previousSection) {
            setIsTransitioning(true);
            setPreviousSection(activeSection);
            const timer = setTimeout(() => {
                setIsTransitioning(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [activeSection, previousSection]);
    return { isTransitioning, previousSection };
}
//# sourceMappingURL=use-section-transition.js.map