import React from 'react';
import { motion } from 'framer-motion';

const FeaturedBusinessesAndAd: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Negocios Destacados */}
      <section className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">Negocios Destacados del Mes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Tres negocios que pagaron más */}
          {['Negocio 1', 'Negocio 2', 'Negocio 3'].map(business => (
            <div key={business} className="rounded-lg bg-blue-100 p-4 shadow">
              <h3 className="text-lg font-semibold">{business}</h3>
              <p className="text-sm text-gray-600">Categoría: Productos Alimenticios</p>
            </div>
          ))}
          {/* Ganador por votaciones */}
          <div className="rounded-lg bg-green-100 p-4 shadow">
            <h3 className="text-lg font-semibold">Ganador del Mes</h3>
            <p className="text-sm text-gray-600">Categoría: Actividades con IA</p>
          </div>
        </div>
      </section>

      {/* Anuncio del Festival */}
      <section className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 opacity-20"
        >
          <img
            src="/images/festival-banner.jpg"
            alt="Festival de Música Electrónica"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="relative z-10">
          <h2 className="mb-2 text-3xl font-bold">
            ¡No te pierdas el Festival de Música Electrónica del Año!
          </h2>
          <p className="mb-4 text-lg">Con Oscar Mulero como Headliner y Lady San en el cartel.</p>
          <p className="mb-6 text-sm">Fecha: 15 de Agosto, Lugar: Sala Kharma</p>
          <button className="rounded-lg bg-white px-4 py-2 font-bold text-purple-700 shadow hover:bg-purple-100">
            Comprar Entradas
          </button>
        </div>
      </section>
    </div>
  );
};

export default FeaturedBusinessesAndAd;
