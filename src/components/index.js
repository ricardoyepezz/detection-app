import React, { useState } from "react";

const CotizadorCorreas = () => {
  const [formData, setFormData] = useState({
    longitud: "",
    ancho: "",
    distancia: "",
    estaciones: "",
    aplicacion: "deteccion",
    topologia: "claseA",
    carga: "combustible",
    tipoCorrea: "estandar",
    retorno: "si",
    canales: 1,
  });

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleReset = () => {
    setFormData({
      longitud: "",
      ancho: "",
      distancia: "",
      estaciones: "",
      aplicacion: "deteccion",
      topologia: "claseA",
      carga: "combustible",
      tipoDeCorrea: "estandar",
      retorno: "si",
      canales: 1,
    });
    setShowResults(false);
  };

  const calcularResultados = () => {
    let vueltas = 0;
    const { longitud, ancho, distancia, estaciones, retorno, carga, topologia } = formData;

    // Cálculo de vueltas
    if (retorno === "si" && carga === "combustible") vueltas = 4;
    else if (retorno === "si" && carga === "noCombustible") vueltas = 3;
    else if (retorno === "no" && carga === "combustible") vueltas = 3;
    else if (retorno === "no" && carga === "noCombustible") vueltas = 2;

    if (carga === "combustible" && ancho >= 2) vueltas += Math.floor(ancho / 2);
    if (topologia === "claseA" && vueltas % 2 !== 0) vueltas += 1;

    // Cálculo de metros de FO
    const A = topologia === "claseA" ? distancia * 2 : distancia;
    const B = longitud * vueltas;
    const C = estaciones * 3;
    const metrosFO = A + B + C;

    return { metrosFO };
  };

  const generarTablas = (metrosFO) => {
    const { aplicacion, canales, topologia } = formData;
    const parsedCanales = parseInt(canales)
    const parsedMetrosFO = parseFloat(metrosFO)

    // Lógica para la tabla "Equipo y Accesorios"
    const equipo = aplicacion === "deteccion" || aplicacion === "dual" ? "LHD" : "DTS";
    const codigoEquipo = equipo === "LHD" ? "N4587A" : "N4585A";
    const descripcionEquipo =
      equipo === "LHD"
        ? "Detección Lineal de Calor por F.O. (LHD)"
        : "Distributed Temperature Sensing (DTS)";
    const tarjeta = parsedCanales <= 2 ? "N458xA-C02" : "N458xA-C04";

    // Lógica para la tabla "Sensor Cable & Components"
    const A = Math.ceil(parsedMetrosFO * 1.1);
    const B = Math.ceil(parsedMetrosFO / 3000);
    const C = topologia === "claseB" ? 2 * parsedCanales : 1 * parsedCanales;
    const D = topologia === "claseB" ? 2 * parsedCanales : 1 * parsedCanales;
    const E = topologia === "claseB" ? parsedCanales : 0;
    const F = topologia === "claseB" ? 2 * parsedCanales : 1 * parsedCanales;
    const G = Math.ceil(parsedMetrosFO / 100);

    return {
      equipoAccesorios: [
        { item: 1, cantidad: 1, codigo: codigoEquipo, descripcion: descripcionEquipo },
        { item: 2, cantidad: 1, codigo: tarjeta, descripcion: `${parsedCanales} Canales de Sensores` },
        { item: 3, cantidad: 1, codigo: "N45xxA-DW", descripcion: "Carcasa de Montaje en Pared" },
        { item: 4, cantidad: 1, codigo: "N45XXA-P01", descripcion: "Interfaz Modbus TCP/IP" },
        { item: 5, cantidad: 1, codigo: "N45XXA-SR0", descripcion: "Tablero de Relés" },
        { item: 6, cantidad: 1, codigo: "A4500A", descripcion: "Tablero exterior con ventana" },
        { item: 7, cantidad: 1, codigo: "A1026A", descripcion: "Juego de Cables de Salida" },
      ],
      sensorCableComponents: [
        { item: 1, cantidad: A, codigo: "S2002A", descripcion: "Sensor Cable - Steel FRNC (m)" },
        { item: 2, cantidad: B, codigo: "S2000A-999", descripcion: "Cable Drum" },
        { item: 3, cantidad: C, codigo: "S2008A", descripcion: "E2000 8° APC Pigtail 5M" },
        { item: 4, cantidad: D, codigo: "S2008A", descripcion: "E2000 8° APC Pigtail 30M" },
        { item: 5, cantidad: E, codigo: "S2011A", descripcion: "E2000 APC Adapter" },
        { item: 6, cantidad: F, codigo: "A2501A", descripcion: "Heavy Duty Splice Box" },
        { item: 7, cantidad: G, codigo: "A2406A-009", descripcion: "Self Locking Polyamide Clamp" },
      ],
    };
  };

  const { metrosFO } = calcularResultados();
  const { equipoAccesorios, sensorCableComponents } = generarTablas(metrosFO);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-[800px] bg-white rounded-lg shadow-lg p-8">

        {!showResults ? (
          <form onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold text-center text-[#CD1B1B] mb-6">Cotizador de Correas Transportadoras
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="longitud" className="block text-sm font-medium text-gray-700">
                  Longitud de la correa (m)
                </label>
                <input
                  type="number"
                  name="longitud"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ancho:</label>
                <input
                  type="number"
                  name="ancho"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Distancia:</label>
                <input
                  type="number"
                  name="distancia"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Estaciones:</label>
                <input
                  type="number"
                  name="estaciones"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aplicación:</label>
                <select
                  name="aplicacion"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                >
                  <option value="deteccion">Detección</option>
                  <option value="monitoreo">Monitoreo</option>
                  <option value="dual">Dual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Topología:</label>
                <select
                  name="topologia"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                >
                  <option value="claseA">Clase A</option>
                  <option value="claseB">Clase B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Carga:</label>
                <select
                  name="carga"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                >
                  <option value="combustible">Combustible</option>
                  <option value="noCombustible">No Combustible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correa con Retorno:</label>
                <select
                  name="retorno"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                >
                  <option value="si">Sí</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Correa</label>
                <select
                  name="tipoCorrea"
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                >
                  <option value="estandar">Estándar</option>
                  <option value="tubular">Tubular</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Canales de Medición:</label>
                <input
                  type="number"
                  name="canales"
                  min="1"
                  max="4"
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#CD1B1B] focus:border-[#CD1B1B]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                className="bg-[#CD1B1B] text-white py-2 px-6 rounded-lg hover:bg-[#a31212] transition"
              >
                Calcular
              </button>
            </div>
          </form>
        ) : (
          <div>
            <h1 className="text-xl font-bold text-center text-[#CD1B1B] mb-6">Resultados</h1>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">Equipo y Accesorios</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-[#CD1B1B] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Ítem</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Cantidad</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Código</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {equipoAccesorios.map((row) => (
                    <tr key={row.item} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-700">{row.item}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.codigo}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Sensor Cable & Componentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-[#CD1B1B] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Ítem</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Cantidad</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Código</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Descripción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sensorCableComponents.map((row) => (
                    <tr key={row.item} className="hover:bg-gray-100">
                      <td className="px-4 py-2 text-sm text-gray-700">{row.item}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.cantidad}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.codigo}</td>
                      <td className="px-4 py-2 text-sm text-gray-700">{row.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleReset}
              className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-black transition mt-8"
            >
              Reiniciar Simulación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CotizadorCorreas;
