# -*- coding: utf-8 -*-
"""Genera el diagrama de componentes UML (SVG) del Sistema de Gestion de Biblioteca."""
import os

W, H = 1700, 1130

C_COMP_FILL, C_COMP_LINE = "#E3EDF9", "#2E5C8A"
C_EXE_FILL,  C_EXE_LINE  = "#D2E4F6", "#1F4E79"
C_LIB_FILL,  C_LIB_LINE  = "#E9E3F8", "#5B3E96"
C_DOC_FILL,  C_DOC_LINE  = "#FADCDC", "#A63A4A"
C_TAB_FILL,  C_TAB_LINE  = "#FCEBC8", "#B7791F"
C_PKG_FILL,  C_PKG_LINE  = "#F6F4FC", "#5B3E96"
C_NAME, C_SOFT, C_IFACE = "#10243B", "#4A5A6E", "#1F4E79"

parts = []


def add(s):
    parts.append(s)


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def text(x, y, t, size=12, fill=C_SOFT, weight=400, anchor="start", style="normal", ls=0):
    add(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" '
        f'text-anchor="{anchor}" font-style="{style}" letter-spacing="{ls}">{esc(t)}</text>')


def rect(x, y, w, h, fill, stroke, rx=7, sw=1.8, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" '
        f'stroke="{stroke}" stroke-width="{sw}"{d}/>')


def line(x1, y1, x2, y2, stroke=C_IFACE, sw=1.8, dash=None, arrow=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#dep)"' if arrow else ""
    add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" '
        f'stroke-width="{sw}"{d}{m} stroke-linecap="round"/>')


def path(d, stroke=C_IFACE, sw=1.8, fill="none"):
    add(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round"/>')


# ---------------- iconos ----------------
def icon_component(x, y, color):
    add(f'<rect x="{x}" y="{y}" width="17" height="21" fill="none" stroke="{color}" stroke-width="1.5"/>')
    add(f'<rect x="{x-6}" y="{y+3}" width="7" height="5" fill="#FFFFFF" stroke="{color}" stroke-width="1.3"/>')
    add(f'<rect x="{x-6}" y="{y+12}" width="7" height="5" fill="#FFFFFF" stroke="{color}" stroke-width="1.3"/>')


def icon_exec(x, y, color):
    add(f'<rect x="{x}" y="{y}" width="22" height="16" rx="2" fill="none" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x}" y1="{y+5}" x2="{x+22}" y2="{y+5}" stroke="{color}" stroke-width="1.4"/>')
    add(f'<path d="M {x+8} {y+8} L {x+15} {y+10.5} L {x+8} {y+13} Z" fill="{color}"/>')


def icon_library(x, y, color):
    add(f'<rect x="{x}" y="{y}" width="6" height="20" rx="1" fill="none" stroke="{color}" stroke-width="1.4"/>')
    add(f'<rect x="{x+9}" y="{y+2}" width="6" height="18" rx="1" fill="none" stroke="{color}" stroke-width="1.4"/>')
    add(f'<path d="M {x+19} {y+4} L {x+23} {y+3} L {x+26} {y+20} L {x+22} {y+21} Z" fill="none" stroke="{color}" stroke-width="1.4"/>')


def icon_table(x, y, color):
    add(f'<rect x="{x}" y="{y}" width="24" height="20" rx="1.5" fill="#FFFFFF" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x}" y1="{y+6.5}" x2="{x+24}" y2="{y+6.5}" stroke="{color}" stroke-width="1.3"/>')
    add(f'<line x1="{x}" y1="{y+13}" x2="{x+24}" y2="{y+13}" stroke="{color}" stroke-width="1.3"/>')
    add(f'<line x1="{x+8}" y1="{y}" x2="{x+8}" y2="{y+20}" stroke="{color}" stroke-width="1.3"/>')
    add(f'<line x1="{x+16}" y1="{y}" x2="{x+16}" y2="{y+20}" stroke="{color}" stroke-width="1.3"/>')


def icon_doc(x, y, color):
    add(f'<path d="M {x} {y} L {x+15} {y} L {x+21} {y+6} L {x+21} {y+21} L {x} {y+21} Z" '
        f'fill="#FFFFFF" stroke="{color}" stroke-width="1.5"/>')
    add(f'<path d="M {x+15} {y} L {x+15} {y+6} L {x+21} {y+6}" fill="none" stroke="{color}" stroke-width="1.4"/>')
    add(f'<line x1="{x+4}" y1="{y+12}" x2="{x+17}" y2="{y+12}" stroke="{color}" stroke-width="1.1"/>')
    add(f'<line x1="{x+4}" y1="{y+16}" x2="{x+14}" y2="{y+16}" stroke="{color}" stroke-width="1.1"/>')


def icon_db(x, y, color):
    add(f'<ellipse cx="{x+11}" cy="{y+4}" rx="11" ry="4" fill="#FFFFFF" stroke="{color}" stroke-width="1.4"/>')
    add(f'<path d="M {x} {y+4} L {x} {y+18} A 11 4 0 0 0 {x+22} {y+18} L {x+22} {y+4}" '
        f'fill="none" stroke="{color}" stroke-width="1.4"/>')
    add(f'<path d="M {x} {y+11} A 11 4 0 0 0 {x+22} {y+11}" fill="none" stroke="{color}" stroke-width="1.2"/>')


def icon_actor(x, y, color="#10243B"):
    add(f'<circle cx="{x}" cy="{y}" r="5" fill="none" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x}" y1="{y+5}" x2="{x}" y2="{y+18}" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x-7}" y1="{y+9}" x2="{x+7}" y2="{y+9}" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x}" y1="{y+18}" x2="{x-6}" y2="{y+26}" stroke="{color}" stroke-width="1.5"/>')
    add(f'<line x1="{x}" y1="{y+18}" x2="{x+6}" y2="{y+26}" stroke="{color}" stroke-width="1.5"/>')


def ball(x, y):
    add(f'<circle cx="{x}" cy="{y}" r="8" fill="#FFFFFF" stroke="{C_IFACE}" stroke-width="1.8"/>')


def socket(x, y, direction):
    """Semicirculo apoyado en el borde, con la abertura hacia el proveedor."""
    if direction == "right":       # borde derecho, abre a la derecha
        path(f"M {x+10} {y-10} A 10 10 0 0 0 {x+10} {y+10}")
    elif direction == "left":      # borde izquierdo, abre a la izquierda
        path(f"M {x-10} {y-10} A 10 10 0 0 1 {x-10} {y+10}")
    elif direction == "down":      # borde inferior, abre hacia abajo
        path(f"M {x-10} {y+10} A 10 10 0 0 0 {x+10} {y+10}")
    elif direction == "up":
        path(f"M {x-10} {y-10} A 10 10 0 0 1 {x+10} {y-10}")


def node(x, y, w, h, stereo, name, desc, fill, stroke, icon, name_size=18):
    rect(x, y, w, h, fill, stroke)
    icon(x + w - 40, y + 17, stroke)
    text(x + 18, y + 30, stereo, 12, C_SOFT)
    text(x + 18, y + 60, name, name_size, C_NAME, 700)
    for i, l in enumerate(desc):
        text(x + 18, y + 84 + i * 15, l, 11.5, C_SOFT)


def table(x, y, w, h, name, cols):
    rect(x, y, w, h, C_TAB_FILL, C_TAB_LINE, rx=5)
    icon_table(x + w - 42, y + 15, C_TAB_LINE)
    text(x + 16, y + 29, "«table»", 11.5, C_SOFT)
    text(x + 16, y + 53, name, 15.5, C_NAME, 700)
    add(f'<line x1="{x+14}" y1="{y+63}" x2="{x+w-14}" y2="{y+63}" stroke="{C_TAB_LINE}" stroke-width="1.1" opacity="0.7"/>')
    for i, c in enumerate(cols):
        text(x + 16, y + 83 + i * 17, c, 10.5, "#6B4E12", 400, style="normal")


# ---------------- lienzo ----------------
add(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
add('<defs>')
add('<marker id="dep" viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="9" markerHeight="9" '
    'orient="auto"><path d="M 1 1 L 11 6 L 1 11" fill="none" stroke="#44546A" stroke-width="1.4" '
    'stroke-linecap="round"/></marker>')
add('</defs>')
add(f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>')

# encabezado
add('<rect x="46" y="30" width="7" height="62" rx="3" fill="#1F4E79"/>')
text(68, 58, "Sistema de Gestión de Biblioteca", 29, C_NAME, 700, ls=0.2)
text(68, 87, "Diagrama de componentes UML 2.5 · Resolución de la consigna", 14.5, "#5A6B80")

# ---------------- actor ----------------
icon_actor(100, 160)
text(100, 292, "Bibliotecario", 13, C_NAME, 600, "middle")
line(126, 207, 180, 207, "#10243B", 1.8)

# ---------------- fila 1 ----------------
node(180, 130, 250, 150, "«executable»", "Punto de Atención",
     ["(aplicación de escritorio", "del bibliotecario)"], C_EXE_FILL, C_EXE_LINE, icon_exec)

node(580, 120, 380, 170, "«executable»", "Servicio de Préstamos",
     ["(servicio ejecutable en el", "entorno de producción)"], C_EXE_FILL, C_EXE_LINE, icon_exec, 19)

node(1280, 140, 300, 140, "«document»", "ComprobantePrestamo.pdf",
     ["(comprobante en PDF", "entregado al usuario)"], C_DOC_FILL, C_DOC_LINE, icon_doc, 16.5)

# ---------------- fila 2 ----------------
node(120, 420, 300, 150, "«library»", "ValidadorLibros.dll",
     ["(biblioteca dinámica externa:", "reglas de validación de libros)"], C_LIB_FILL, C_LIB_LINE, icon_library)

node(580, 420, 300, 150, "«component»", "Gestión de Catálogo",
     ["(mantiene libros, autores", "y ejemplares)"], C_COMP_FILL, C_COMP_LINE, icon_component)

node(990, 420, 300, 150, "«component»", "Repositorio Biblioteca",
     ["(único acceso a la base", "de datos del sistema)"], C_COMP_FILL, C_COMP_LINE, icon_component, 17)

# ---------------- ensambles ----------------
# IPrestamos
socket(430, 207, "right")
line(440, 207, 543, 207)
ball(551, 207)
line(559, 207, 580, 207)
text(491, 190, "IPrestamos", 12.5, C_IFACE, 700, "middle")

# ICatalogo (el servicio y el punto de atención comparten la interfaz provista)
socket(740, 290, "down")
line(740, 300, 740, 390)
ball(740, 398)
line(740, 406, 740, 420)

# ICatalogo: el punto de atención también mantiene el catálogo
socket(250, 280, "down")
path("M 250 290 L 250 398 L 732 398", C_IFACE, 1.8)
text(500, 386, "ICatalogo", 12.5, C_IFACE, 700, "middle")

# IValidacionLibros
ball(442, 495)
line(420, 495, 434, 495)
line(450, 495, 570, 495)
socket(580, 495, "left")
text(510, 478, "IValidacionLibros", 11.5, C_IFACE, 700, "middle")

# IAccesoCatalogo
socket(880, 495, "right")
line(890, 495, 960, 495)
ball(968, 495)
line(976, 495, 990, 495)
text(930, 478, "IAccesoCatalogo", 11, C_IFACE, 700, "middle")

# IRegistroPrestamos
socket(900, 290, "down")
path("M 900 300 L 900 350 L 1140 350", C_IFACE, 1.8)
line(1140, 350, 1140, 390)
ball(1140, 398)
line(1140, 406, 1140, 420)
text(1020, 338, "IRegistroPrestamos", 11.5, C_IFACE, 700, "middle")

# genera comprobante
line(960, 207, 1272, 207, "#44546A", 1.7, "7 5", arrow=True)
text(1120, 190, "«genera»", 12.5, C_IFACE, 700, "middle")

# ---------------- base de datos ----------------
# paquete
path("M 140 640 L 140 610 L 560 610 L 560 640 Z", C_PKG_LINE, 1.8, C_PKG_FILL)
rect(140, 640, 1420, 265, C_PKG_FILL, C_PKG_LINE, rx=0)
add(f'<line x1="140" y1="640" x2="1560" y2="640" stroke="{C_PKG_LINE}" stroke-width="1.8"/>')
text(156, 632, "«database»  Base de datos: biblioteca", 12.5, C_PKG_LINE, 700)

# accede
line(1140, 570, 1140, 633, "#44546A", 1.7, "7 5", arrow=True)
text(1156, 606, "«accede»", 12.5, C_IFACE, 700)

table(175, 690, 300, 160, "Libro",
      ["idLibro : int  «PK»", "titulo : varchar", "isbn : varchar", "idAutor : int  «FK»"])
table(520, 690, 300, 160, "Autor",
      ["idAutor : int  «PK»", "nombre : varchar", "nacionalidad : varchar", "fechaNac : date"])
table(865, 690, 300, 160, "Ejemplar",
      ["idEjemplar : int  «PK»", "idLibro : int  «FK»", "estado : varchar", "disponible : boolean"])
table(1210, 690, 300, 160, "Prestamo",
      ["idPrestamo : int  «PK»", "idEjemplar : int  «FK»", "fechaPrestamo : date", "fechaDevolucion : date"])

# ---------------- leyenda ----------------
rect(90, 930, 1520, 175, "#FBFCFE", "#C9D4E2", rx=10, sw=1.4)
text(112, 958, "Referencias", 13, C_NAME, 700)

cols = [130, 435, 740, 1045, 1350]
labels1 = ["Componente", "Ejecutable", "Interfaz provista (lollipop)", "Interfaz requerida (socket)",
           "Dependencia (usa / accede / genera)"]
y_icon1, y_lab1 = 992, 1019
icon_component(cols[0], y_icon1 - 10, C_COMP_LINE)
icon_exec(cols[1], y_icon1 - 8, C_EXE_LINE)
ball(cols[2], y_icon1)
socket(cols[3], y_icon1 - 9, "right")
line(cols[4], y_icon1, cols[4] + 52, y_icon1, "#44546A", 1.6, "7 5", arrow=True)

for x, l in zip(cols, labels1):
    text(x, y_lab1, l, 11, "#33475B", 400)

y_icon2, y_lab2 = 1048, 1075
cols2 = [130, 435, 740, 1045, 1350]
icon_library(cols2[0], y_icon2 - 10, C_LIB_LINE)
icon_table(cols2[1], y_icon2 - 9, C_TAB_LINE)
icon_doc(cols2[2], y_icon2 - 10, C_DOC_LINE)
icon_db(cols2[3], y_icon2 - 11, C_PKG_LINE)
icon_actor(cols2[4], y_icon2 - 6)

labels2 = ["«library» biblioteca dinámica", "«table» tabla de base de datos",
           "«document» documento generado", "«database» base de datos", "Actor del sistema"]
for x, l in zip(cols2, labels2):
    text(x, y_lab2, l, 11, "#33475B", 400)

add('</svg>')

out_svg = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Diagrama_Componentes_Biblioteca.svg")
with open(out_svg, "w", encoding="utf-8") as f:
    f.write("\n".join(parts))
print("OK", out_svg)
