# -*- coding: utf-8 -*-
"""Genera el documento HTML de resolucion (A4 horizontal) e incrusta el SVG."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE, "Diagrama_Componentes_Biblioteca.svg"), encoding="utf-8") as f:
    svg = f.read()

svg = svg.replace('viewBox="0 0 1700 1130"', 'viewBox="0 105 1700 1025"', 1).replace('width="1700" height="1130"', 'width="100%" height="auto"', 1)

CSS = """
  @page { size: A4 landscape; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", Calibri, Arial, sans-serif;
    color: #1B2A3A; font-size: 9.2pt; line-height: 1.42;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  .page {
    width: 297mm; height: 210mm; padding: 13mm 15mm 11mm 15mm;
    position: relative; overflow: hidden; page-break-after: always;
    background: #FFFFFF;
  }
  .page:last-child { page-break-after: auto; }
  .eyebrow { font-size: 8pt; letter-spacing: 2.4px; text-transform: uppercase; color: #2E5C8A; font-weight: 700; }
  h1 { font-size: 25pt; margin: 3mm 0 1.5mm 0; color: #10243B; letter-spacing: -0.3px; }
  .sub { font-size: 10.5pt; color: #5A6B80; margin: 0; }
  .rule { height: 2.4px; background: #1F4E79; width: 100%; margin: 5mm 0 6mm 0; }
  h2 { font-size: 12.5pt; margin: 6mm 0 2mm 0; color: #10243B; }
  h2 .num { color: #2E5C8A; margin-right: 2mm; }
  p { margin: 0 0 2.5mm 0; }
  .lead { font-size: 9.6pt; color: #33475B; }
  table { width: 100%; border-collapse: collapse; font-size: 8.4pt; }
  thead th {
    background: #E8F0F9; color: #10243B; text-align: left; font-size: 7.6pt;
    text-transform: uppercase; letter-spacing: 0.7px; padding: 2.1mm 2.4mm;
    border-bottom: 1.2px solid #2E5C8A; font-weight: 700;
  }
  tbody td { padding: 2mm 2.4mm; border-bottom: 0.6px solid #DCE4EE; vertical-align: top; }
  tbody tr:nth-child(even) td { background: #F7FAFD; }
  td.k { font-weight: 700; color: #10243B; }
  .tag { font-size: 7.6pt; color: #4A5A6E; }
  code { font-family: Consolas, "Courier New", monospace; font-size: 7.8pt; color: #1F4E79; }
  .cards { display: flex; gap: 3mm; margin-top: 4mm; }
  .card { flex: 1; border: 1px solid #D5DFEB; border-left: 3px solid #2E5C8A; border-radius: 2px;
          padding: 2.5mm 3mm; background: #FBFCFE; }
  .card .n { font-size: 16pt; font-weight: 700; color: #1F4E79; line-height: 1.1; }
  .card .l { font-size: 7.6pt; color: #5A6B80; text-transform: uppercase; letter-spacing: 0.6px; }
  .cols { display: flex; gap: 8mm; }
  .col { flex: 1; }
  ul { margin: 0; padding-left: 4.5mm; }
  li { margin-bottom: 1.6mm; }
  .check { list-style: none; padding-left: 0; }
  .check li { display: flex; gap: 2.5mm; align-items: flex-start; margin-bottom: 2mm; }
  .tick { width: 4.6mm; height: 4.6mm; border-radius: 50%; background: #1F4E79; color: #fff;
          font-size: 7pt; display: flex; align-items: center; justify-content: center; font-weight: 700; flex: none; }
  .diagram-page { padding: 10mm 12mm 8mm 12mm; }
  .diagram-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2mm; }
  .diagram-title h2 { margin: 0; }
  .diagram-title span { font-size: 8pt; color: #6B7C90; }
  .fig { width: 100%; }
  .fig svg { width: 100%; height: auto; display: block; }
  .caption { font-size: 7.6pt; color: #5A6B80; margin-top: 2mm; display: flex; flex-wrap: wrap; gap: 1.5mm 7mm; }
  .caption b { color: #10243B; }
  .gloss { display: flex; gap: 2.5mm; margin-top: 5mm; }
  .gloss div { flex: 1; border: 1px solid #D5DFEB; border-radius: 2px; padding: 2mm 2.5mm;
               background: #FBFCFE; font-size: 7.3pt; color: #4A5A6E; line-height: 1.35; }
  .gloss b { display: block; color: #10243B; font-size: 7.9pt; margin-bottom: 0.6mm; }
  .footer { position: absolute; left: 15mm; right: 15mm; bottom: 5.5mm;
            display: flex; justify-content: space-between; font-size: 7.2pt; color: #8494A6;
            border-top: 0.6px solid #E2E8F0; padding-top: 1.8mm; }
  .note { border-left: 3px solid #B7791F; background: #FDF8EC; padding: 2.5mm 3mm; font-size: 8.2pt; color: #5B4519; }
  .kicker { font-size: 8pt; color: #5A6B80; margin-top: 1mm; }
  .pill { display: inline-block; border: 1px solid #C9D4E2; border-radius: 10px; padding: 0.4mm 2mm;
          font-size: 7.4pt; color: #33475B; background: #F4F8FC; margin-right: 1.2mm; }
"""

P1 = """
<div class="page">
  <div class="eyebrow">Ingeniería de Software · UML 2.5</div>
  <h1>Sistema de Gestión de Biblioteca</h1>
  <p class="sub">Resolución de la consigna de diagrama de componentes</p>
  <div class="rule"></div>

  <h2><span class="num">1.</span>Lectura del enunciado y decisiones de diseño</h2>
  <p class="lead">La consigna pide modelar la arquitectura de un sistema que administra préstamos y devoluciones,
  consulta la disponibilidad de ejemplares, mantiene el catálogo, valida los datos de los libros con una biblioteca
  dinámica externa, persiste la información en una base de datos y genera un comprobante en PDF. Cada frase del
  enunciado se tradujo en un elemento del diagrama:</p>

  <table>
    <thead>
      <tr><th style="width:33%">Requerimiento del enunciado</th><th>Respuesta en el modelo</th></tr>
    </thead>
    <tbody>
      <tr><td class="k">Administrar préstamos y devoluciones</td>
          <td><b>Servicio de Préstamos</b> («executable»): orquesta ambas operaciones y expone la interfaz <code>IPrestamos</code>.</td></tr>
      <tr><td class="k">El bibliotecario interactúa con el sistema</td>
          <td><b>Punto de Atención</b> («executable»), aplicación de escritorio asociada al actor; consume <code>IPrestamos</code>.</td></tr>
      <tr><td class="k">Verificar la disponibilidad de los ejemplares</td>
          <td><b>Gestión de Catálogo</b> responde <code>verificarDisponibilidad()</code> por <code>ICatalogo</code>; el dato se lee de la tabla <b>Ejemplar</b>.</td></tr>
      <tr><td class="k">Validar que los datos de los libros sean correctos</td>
          <td><b>ValidadorLibros.dll</b> («library»), biblioteca dinámica externa que provee <code>IValidacionLibros</code>.</td></tr>
      <tr><td class="k">Módulos independientes comunicados por interfaces</td>
          <td>Cinco interfaces entre los módulos (<code>IPrestamos</code>, <code>ICatalogo</code>, <code>IValidacionLibros</code>, <code>IAccesoCatalogo</code> e <code>IRegistroPrestamos</code>), con conectores de ensamble bola–socket.</td></tr>
      <tr><td class="k">Libros, autores y ejemplares almacenados en una base de datos</td>
          <td><b>Repositorio Biblioteca</b> como único acceso a datos y paquete «database» con las tablas <b>Libro</b>, <b>Autor</b>, <b>Ejemplar</b> y <b>Prestamo</b>.</td></tr>
      <tr><td class="k">Comprobante en PDF al registrar un préstamo</td>
          <td>Artefacto «document» <b>ComprobantePrestamo.pdf</b>, generado por el servicio (dependencia «genera»).</td></tr>
      <tr><td class="k">El servicio de préstamos debe ejecutarse en producción</td>
          <td><b>Servicio de Préstamos</b> se modela como «executable», desplegable en el servidor de producción.</td></tr>
    </tbody>
  </table>

  <div class="cards">
    <div class="card"><div class="n">4</div><div class="l">Componentes de software</div></div>
    <div class="card"><div class="n">5</div><div class="l">Interfaces</div></div>
    <div class="card"><div class="n">4</div><div class="l">Tablas de la base</div></div>
    <div class="card"><div class="n">6</div><div class="l">Estereotipos UML</div></div>
  </div>

  <div class="note" style="margin-top:5mm">
    <b>Frontera y supuestos.</b> El sistema modelado es la biblioteca; el bibliotecario es el único actor humano y el
    usuario final solo recibe el comprobante. Se asume que la base de datos y la biblioteca dinámica ya existen en el
    entorno de producción. No se modelan el proveedor de libros ni el servicio de impresión.
  </div>

  <div class="footer"><span>Sistema de Gestión de Biblioteca · Diagrama de componentes</span><span>1 / 4</span></div>
</div>
"""

P2 = """
<div class="page">
  <h2 style="margin-top:0"><span class="num">2.</span>Componentes y responsabilidades</h2>
  <table>
    <thead>
      <tr><th style="width:17%">Elemento</th><th style="width:14%">Estereotipo</th><th style="width:35%">Responsabilidad</th>
          <th style="width:17%">Interfaz provista</th><th>Interfaz requerida</th></tr>
    </thead>
    <tbody>
      <tr><td class="k">Punto de Atención</td><td class="tag">«executable»</td>
          <td>Interfaz de usuario del bibliotecario: registra préstamos y devoluciones, consulta disponibilidad y mantiene el catálogo.</td>
          <td>—</td><td><code>IPrestamos</code> · <code>ICatalogo</code></td></tr>
      <tr><td class="k">Servicio de Préstamos</td><td class="tag">«executable»</td>
          <td>Orquesta el préstamo y la devolución, controla plazos y dispara la generación del comprobante.</td>
          <td><code>IPrestamos</code></td><td><code>ICatalogo</code> · <code>IRegistroPrestamos</code></td></tr>
      <tr><td class="k">Gestión de Catálogo</td><td class="tag">«component»</td>
          <td>Mantiene libros, autores y ejemplares; valida los datos y responde por la disponibilidad.</td>
          <td><code>ICatalogo</code></td><td><code>IAccesoCatalogo</code> · <code>IValidacionLibros</code></td></tr>
      <tr><td class="k">Repositorio Biblioteca</td><td class="tag">«component»</td>
          <td>Único punto de acceso a la base; traduce las operaciones de los módulos a consultas sobre las tablas.</td>
          <td><code>IAccesoCatalogo</code> · <code>IRegistroPrestamos</code></td><td>—</td></tr>
      <tr><td class="k">ValidadorLibros.dll</td><td class="tag">«library»</td>
          <td>Biblioteca dinámica externa con las reglas de validación de los datos bibliográficos.</td>
          <td><code>IValidacionLibros</code></td><td>—</td></tr>
    </tbody>
  </table>

  <h2><span class="num">3.</span>Servicios e interfaces</h2>
  <p class="lead">Las interfaces se dibujan como interfaz provista (círculo o <i>lollipop</i>) del lado de quien ofrece el
  servicio y como interfaz requerida (<i>socket</i>) del lado de quien lo consume. Las operaciones concretas son:</p>
  <table>
    <thead>
      <tr><th style="width:21%">Interfaz</th><th style="width:19%">Proveedor</th><th style="width:19%">Consumidor</th><th>Operaciones principales</th></tr>
    </thead>
    <tbody>
      <tr><td class="k">IPrestamos</td><td>Servicio de Préstamos</td><td>Punto de Atención</td>
          <td><code>registrarPrestamo()</code> · <code>registrarDevolucion()</code> · <code>consultarDisponibilidad()</code> · <code>consultarPrestamo()</code></td></tr>
      <tr><td class="k">ICatalogo</td><td>Gestión de Catálogo</td><td>Punto de Atención · Servicio de Préstamos</td>
          <td><code>verificarDisponibilidad(idLibro)</code> · <code>validarLibro(datos)</code> · <code>obtenerEjemplares(idLibro)</code> · <code>registrarLibro()</code> · <code>actualizarEjemplar()</code></td></tr>
      <tr><td class="k">IValidacionLibros</td><td>ValidadorLibros.dll</td><td>Gestión de Catálogo</td>
          <td><code>validarDatosLibro(datos)</code> → <code>ResultadoValidacion</code></td></tr>
      <tr><td class="k">IAccesoCatalogo</td><td>Repositorio Biblioteca</td><td>Gestión de Catálogo</td>
          <td><code>buscarLibro()</code> · <code>guardarLibro()</code> · <code>actualizarEjemplar()</code></td></tr>
      <tr><td class="k">IRegistroPrestamos</td><td>Repositorio Biblioteca</td><td>Servicio de Préstamos</td>
          <td><code>guardarPrestamo()</code> · <code>registrarDevolucion()</code> · <code>consultarPrestamos()</code></td></tr>
    </tbody>
  </table>

  <div class="note" style="margin-top:5mm">
    <b>Criterio de acoplamiento:</b> cada módulo depende solo de las operaciones que realmente usa. El Servicio de
    Préstamos no accede directamente a la base ni a la biblioteca de validación; lo hace a través de <code>ICatalogo</code>
    y de <code>IRegistroPrestamos</code>. Así, reemplazar la biblioteca dinámica o cambiar el motor de base de datos no
    obliga a modificar el resto del sistema.
  </div>

  <div class="footer"><span>Sistema de Gestión de Biblioteca · Diagrama de componentes</span><span>2 / 4</span></div>
</div>
"""

P3 = """
<div class="page">
  <h2 style="margin-top:0"><span class="num">4.</span>Artefactos tecnológicos y su simbología UML</h2>
  <table>
    <thead>
      <tr><th style="width:21%">Artefacto</th><th style="width:13%">Estereotipo</th><th style="width:18%">Tipo / formato</th><th>Rol en la arquitectura</th></tr>
    </thead>
    <tbody>
      <tr><td class="k">Punto de Atención</td><td class="tag">«executable»</td><td>Aplicación de escritorio (.exe)</td>
          <td>Cliente instalado en el puesto del bibliotecario; no contiene reglas de negocio.</td></tr>
      <tr><td class="k">Servicio de Préstamos</td><td class="tag">«executable»</td><td>Servicio (.exe / .jar)</td>
          <td>Se despliega y ejecuta en el entorno de producción, tal como exige el enunciado.</td></tr>
      <tr><td class="k">ValidadorLibros.dll</td><td class="tag">«library»</td><td>Biblioteca dinámica (.dll)</td>
          <td>Reglas de validación externas; puede reemplazarse sin recompilar el sistema.</td></tr>
      <tr><td class="k">ComprobantePrestamo.pdf</td><td class="tag">«document»</td><td>Documento PDF</td>
          <td>Se genera en cada préstamo y se entrega al usuario.</td></tr>
      <tr><td class="k">Biblioteca (base de datos)</td><td class="tag">«database»</td><td>Esquema relacional</td>
          <td>Agrupa las tablas del sistema y separa el esquema físico del componente que lo accede.</td></tr>
      <tr><td class="k">Libro · Autor · Ejemplar · Prestamo</td><td class="tag">«table»</td><td>Tablas</td>
          <td>Persistencia del catálogo, del stock disponible y de los préstamos con sus fechas de devolución.</td></tr>
    </tbody>
  </table>

  <div class="cols" style="margin-top:6mm">
    <div class="col">
      <h2 style="margin-top:0"><span class="num">5.</span>Decisiones de diseño</h2>
      <ul>
        <li><b>Dos ejecutables y no uno:</b> el cliente (<i>Punto de Atención</i>) se separa del servicio de negocio
        (<i>Servicio de Préstamos</i>), porque el enunciado exige que el servicio de préstamos corra en producción
        mientras el bibliotecario lo usa desde su puesto. El cliente consume <code>IPrestamos</code> para el circuito de
        préstamos e <code>ICatalogo</code> para mantener el catálogo, que es un caso de uso independiente.</li>
        <li><b>Una sola dependencia hacia la biblioteca dinámica:</b> la validación se concentra en
        <i>Gestión de Catálogo</i>; el servicio la invoca a través de <code>ICatalogo</code>. Se evita así duplicar el
        artefacto en el diagrama.</li>
        <li><b>Se agregó la tabla Prestamo:</b> sin ella no puede registrarse una devolución ni conocerse qué ejemplar
        está prestado y desde cuándo.</li>
        <li><b>Repositorio con dos interfaces:</b> <code>IAccesoCatalogo</code> e <code>IRegistroPrestamos</code>
        segregan las operaciones para que cada módulo dependa solo de las suyas.</li>
        <li><b>Conectores de ensamble bola–socket:</b> muestran en un solo trazo quién provee y quién requiere la
        interfaz, en lugar de flechas sueltas con la etiqueta «usa».</li>
        <li><b>Base modelada como «database»:</b> el paquete contiene las cuatro «table», de modo que el esquema físico
        queda separado del componente que lo consulta.</li>
      </ul>
    </div>
    <div class="col" style="flex:0 0 108mm">
      <h2 style="margin-top:0"><span class="num">6.</span>Verificación de la consigna</h2>
      <ul class="check">
        <li><span class="tick">1</span><div><b>Componentes identificados.</b> Cuatro componentes de software —dos de ellos
          ejecutables— con responsabilidades separadas.</div></li>
        <li><span class="tick">2</span><div><b>Servicios ofrecidos y requeridos.</b> Cada componente declara qué provee y
          qué necesita (tabla de la página 2).</div></li>
        <li><span class="tick">3</span><div><b>Interfaces de comunicación.</b> Cinco interfaces con sus operaciones:
          <code>IPrestamos</code>, <code>ICatalogo</code>, <code>IValidacionLibros</code>,
          <code>IAccesoCatalogo</code> e <code>IRegistroPrestamos</code>.</div></li>
        <li><span class="tick">4</span><div><b>Artefactos tecnológicos.</b> «executable» ×2, «library», «document»,
          «database» y «table» ×4, con la simbología UML correspondiente.</div></li>
        <li><span class="tick">5</span><div><b>Diagrama UML.</b> En la página 4, con interfaces provistas y requeridas y
          las dependencias «genera» y «accede».</div></li>
      </ul>
      <p class="kicker" style="margin-top:4mm">Entregables: diagrama en PDF/SVG/PNG y este documento de resolución.</p>
    </div>
  </div>

  <div class="gloss">
    <div><b>«executable»</b>Artefacto que se ejecuta en un nodo de despliegue.</div>
    <div><b>«library»</b>Biblioteca dinámica reutilizable, externa al código propio.</div>
    <div><b>«component»</b>Módulo lógico reemplazable, agrupado por responsabilidad.</div>
    <div><b>«database»</b>Esquema físico que contiene las tablas del sistema.</div>
    <div><b>«table»</b>Tabla relacional persistente.</div>
    <div><b>«document»</b>Archivo generado por el sistema en tiempo de ejecución.</div>
  </div>

  <div class="footer"><span>Sistema de Gestión de Biblioteca · Diagrama de componentes</span><span>3 / 4</span></div>
</div>
"""

P4 = f"""
<div class="page diagram-page">
  <div class="diagram-title">
    <h2 style="margin-top:0"><span class="num">7.</span>Diagrama de componentes UML</h2>
    <span>Vista de alto nivel · notación UML 2.5</span>
  </div>
  <div class="fig">{svg}</div>
  <div class="caption">
    <span><b>Bola:</b> interfaz provista.</span>
    <span><b>Socket:</b> interfaz requerida.</span>
    <span><b>Línea punteada:</b> dependencia «genera» / «accede».</span>
    <span><b>Azul:</b> componentes y ejecutables · <b>violeta:</b> biblioteca y base · <b>ámbar:</b> tablas · <b>rojo:</b> documento.</span>
  </div>
  <div class="footer"><span>Sistema de Gestión de Biblioteca · Diagrama de componentes</span><span>4 / 4</span></div>
</div>
"""

html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Resolución — Diagrama de componentes · Sistema de Gestión de Biblioteca</title>
<style>{CSS}</style>
</head>
<body>
{P1}
{P2}
{P3}
{P4}
</body>
</html>
"""

with open(os.path.join(BASE, "Resolucion_Diagrama_Componentes.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("OK")

