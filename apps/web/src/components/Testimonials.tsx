'use client';

import React from 'react';

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'Laura García',
      role: 'Cliente Frecuente',
      content: 'Los productos artesanales son de excelente calidad. Cada pieza tiene su historia y personalidad única.',
      rating: 5
    },
    {
      id: 2,
      name: 'Miguel Torres',
      role: 'Coleccionista',
      content: 'He encontrado piezas increíbles que no conseguiría en ningún otro lugar. Los artesanos son muy talentosos.',
      rating: 5
    },
    {
      id: 3,
      name: 'Ana Rodríguez',
      role: 'Diseñadora',
      content: 'La variedad de estilos y técnicas artesanales es impresionante. Siempre encuentro inspiración aquí.',
      rating: 5
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="text-yellow-400 text-xl">★★★★★</div>
          </div>
          <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
          <div className="text-sm">
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-gray-600">{testimonial.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
