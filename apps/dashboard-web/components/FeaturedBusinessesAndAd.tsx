import React from 'react';
import { motion } from 'framer-motion';

const FeaturedBusinessesAndAd: React.FC = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Negocios Destacados */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Negocios Destacados del Mes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tres negocios que pagaron más */}
          {['Negocio 1', 'Negocio 2', 'Negocio 3'].map((business) => (
            <div key={business} className="bg-blue-100 p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{business}</h3>
              <p className="text-sm text-gray-600">
                Categoría: Productos Alimenticios
              </p>
            </div>
          ))}
          {/* Ganador por votaciones */}
          <div className="bg-green-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Ganador del Mes</h3>
            <p className="text-sm text-gray-600">
              Categoría: Actividades con IA
            </p>
          </div>
        </div>
      </section>

      {/* Anuncio del Festival */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 relative overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 opacity-20"
        >
          <img
            src="/images/festival-banner.jpg"
            alt="Festival de Música Electrónica"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            ¡No te pierdas el Festival de Música Electrónica del Año!
          </h2>
          <p className="text-lg mb-4">
            Con Oscar Mulero como Headliner y Lady San en el cartel.
          </p>
          <p className="text-sm mb-6">
            Fecha: 15 de Agosto, Lugar: Sala Kharma
          </p>
          <button className="bg-white text-purple-700 font-bold py-2 px-4 rounded-lg shadow hover:bg-purple-100">
            Comprar Entradas
          </button>
        </div>
      </section>
    </div>
  );
};

export default FeaturedBusinessesAndAd;
