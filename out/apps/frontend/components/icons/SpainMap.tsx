

import React from 'react';

const SpainMap: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg version="1.1" id="spain-map" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 595.28 595.28" {...props}>
        <style type="text/css">
            {`
            .andalucia {
                fill: #FBBF24; /* amber-400, close to a4coYellow */
                stroke: #1F2937; /* gray-800, close to a4coBlack */
                stroke-width: 2;
                transition: fill 0.3s ease;
            }
            .andalucia:hover {
                fill: #27FF9F; /* a4coGreen */
            }
            .spain {
                fill: #F3F4F6; /* gray-100 */
                stroke: #D1D5DB; /* gray-300 */
                stroke-width: 1;
            }
            `}
        </style>
        <g id="provinces">
            {/* Minimalist Spain map with Andalusia provinces highlighted */}
            {/* This is a simplified representation for demonstration */}
            {/* Non-Andalusia parts of Spain */}
            <path className="spain" d="M226.3,91.5l-50.6-23.7L109,83.9l-38.3,27.9L32.2,162.7l17.7,64.8l-18.4,49.2l49.9,64.8l77.1,13.8 l49.2-22.3l43.8,20.9l50.6,56.9l80.9-10.3l37.6-56.2l12.4-71.7l-29.3-56.9l-58.3-25.1L400.1,91.5H226.3z" />
            
            {/* Huelva */}
            <path className="andalucia" d="M152.1,357.2l-30.7,4.8l-12.4-23l-10.3-34.5l37.6,1.4L152.1,357.2z">
                {/* FIX: Replaced title attribute with a nested <title> element for SVG accessibility and to resolve TS error. */}
                <title>Huelva</title>
            </path>
            {/* Sevilla */}
            <path className="andalucia" d="M198.3,348.1l-46.2,9.1l15.9,51.3l58.3-9.6L198.3,348.1z">
                <title>Sevilla</title>
            </path>
            {/* Cádiz */}
            <path className="andalucia" d="M179.6,408.5l-11.7-27.6l-29.3-13.8l-8.9,25.8l20.2,28.3L179.6,408.5z">
                <title>Cádiz</title>
            </path>
            {/* Córdoba */}
            <path className="andalucia" d="M256.6,338.5l-58.3,9.6l23.7,39.7l64.8-5.5L256.6,338.5z">
                <title>Córdoba</title>
            </path>
            {/* Málaga */}
            <path className="andalucia" d="M251.1,382.7l-27.6,25.8l25.1,17l36.2-14.5l-10.3-33.1L251.1,382.7z">
                <title>Málaga</title>
            </path>
            {/* Jaén */}
            <path className="andalucia" d="M321.4,344l-64.8,5.5l14.5,49.9l71.7-10.3L321.4,344z">
                <title>Jaén</title>
            </path>
            {/* Granada */}
            <path className="andalucia" d="M342.8,389.1l-22.3,10.3l13.1,25.1l54.5-6.9l-11-40.4L342.8,389.1z">
                <title>Granada</title>
            </path>
            {/* Almería */}
            <path className="andalucia" d="M377.3,427.7l-24.4-13.1l-34.5,12.4l11,40.4l45.5-1.4L377.3,427.7z">
                <title>Almería</title>
            </path>
        </g>
    </svg>
);

export default SpainMap;
