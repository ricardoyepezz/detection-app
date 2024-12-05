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
    <div>
      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <h1>Formulario</h1>
          <div>
            <label>Longitud:</label>
            <input type="number" name="longitud" onChange={handleInputChange} required />
          </div>
          <div>
            <label>Ancho:</label>
            <input type="number" name="ancho" onChange={handleInputChange} required />
          </div>
          <div>
            <label>Distancia:</label>
            <input type="number" name="distancia" onChange={handleInputChange} required />
          </div>
          <div>
            <label>Estaciones:</label>
            <input type="number" name="estaciones" onChange={handleInputChange} required />
          </div>
          <div>
            <label>Aplicación:</label>
            <select name="aplicacion" onChange={handleInputChange}>
              <option value="deteccion">Detección</option>
              <option value="monitoreo">Monitoreo</option>
              <option value="dual">Dual</option>
            </select>
          </div>
          <div>
            <label>Topología:</label>
            <select name="topologia" onChange={handleInputChange}>
              <option value="claseA">Clase A</option>
              <option value="claseB">Clase B</option>
            </select>
          </div>
          <div>
            <label>Tipo de Carga:</label>
            <select name="carga" onChange={handleInputChange}>
              <option value="combustible">Combustible</option>
              <option value="noCombustible">No Combustible</option>
            </select>
          </div>
          <div>
            <label>Correa con Retorno:</label>
            <select name="retorno" onChange={handleInputChange}>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label>Tipo de Correa</label>
            <select name="tipoCorrea" onChange={handleInputChange}>
              <option value="estandar">Estándar</option>
              <option value="tubular">Tubular</option>
            </select>
          </div>
          <div>
            <label>Canales de Medición:</label>
            <input
              type="number"
              name="canales"
              min="1"
              max="4"
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Calcular</button>
        </form>
      ) : (
        <div>
          <h1>Resultados</h1>
          <h2>Equipo y Accesorios</h2>
          <table>
            <thead>
              <tr>
                <th>Ítem</th>
                <th>Cantidad</th>
                <th>Código</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {equipoAccesorios.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.codigo}</td>
                  <td>{row.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Sensor Cable & Components</h2>
          <table>
            <thead>
              <tr>
                <th>Ítem</th>
                <th>Cantidad</th>
                <th>Código</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {sensorCableComponents.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.cantidad}</td>
                  <td>{row.codigo}</td>
                  <td>{row.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleReset}>Reiniciar Simulación</button>
        </div>
      )}
    </div>
  );
};

export default CotizadorCorreas;
