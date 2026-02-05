import feedparser
import requests
import ssl
import os
from datetime import datetime

# --- 1. CONFIGURACIÓN DE SEGURIDAD Y RUTAS ---
# Evitar errores de certificado SSL en servidores remotos
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

# Localizar el archivo index.html de forma absoluta
RUTA_BASE = os.getcwd()
RUTA_INDEX = os.path.join(RUTA_BASE, 'index.html')

# --- 2. FUENTES DE NOTICIAS (Google News RSS) ---
FEEDS = {
    'CHILE': 'https://news.google.com/rss/search?q=Chile+Economia+Negocios+when:1d&hl=es-419&gl=CL&ceid=CL:es-419',
    'USA': 'https://news.google.com/rss/search?q=Wall+Street+Finanzas+when:1d&hl=es-419&gl=US&ceid=US:es-419',
    'EUROPA': 'https://news.google.com/rss/search?q=Banco+Central+Europeo+Economia+when:1d&hl=es-419&gl=ES&ceid=ES:es-419',
    'ESPANA': 'https://news.google.com/rss/search?q=IBEX35+Economia+when:1d&hl=es-419&gl=ES&ceid=ES:es-419'
}

def obtener_noticia(url, etiqueta):
    try:
        feed = feedparser.parse(url)
        if len(feed.entries) > 0:
            item = feed.entries[0]
            return {
                'pais': etiqueta,
                'titulo': item.title.split(' - ')[0], 
                'link': item.link,
                'resumen': item.title
            }
    except: return None
    return None

# --- 3. INDICADORES ECONÓMICOS (Mindicador.cl) ---
def obtener_indicadores():
    print("💰 Consultando indicadores oficiales (Mindicador.cl)...")
    try:
        r = requests.get('https://mindicador.cl/api', timeout=10)
        data = r.json()
        
        uf = int(data['uf']['valor'])
        dolar = data['dolar']['valor']
        euro = data['euro']['valor']
        bitcoin = data['bitcoin']['valor']
        
        # HTML del Ticker con formato chileno
        html_ticker = f"""
                <span class="mx-8 text-gold">UF: ${uf:,.0f} <span class="up">▲</span></span>
                <span class="mx-8 text-gold">USD: ${dolar:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-gold">EUR: ${euro:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-gold">BTC: ${bitcoin:,.0f} <span class="up">▲</span></span>
                <span class="mx-8 text-gold text-[9px]">ACTUALIZADO: {datetime.now().strftime('%d/%m %H:%M')}</span>
        """.replace(",", ".") 
        return html_ticker
    except Exception as e:
        print(f"⚠️ No se pudieron obtener los indicadores: {e}")
        return None

# --- 4. EJECUCIÓN PRINCIPAL ---
print("🔍 Iniciando recolección de datos...")

# Recolección de Noticias
noticias = []
feed_cl = feedparser.parse(FEEDS['CHILE'])
for i in range(min(3, len(feed_cl.entries))):
    item = feed_cl.entries[i]
    noticias.append({'pais': 'Chile / Mercado', 'titulo': item.title.split(' - ')[0], 'link': item.link, 'resumen': item.title})

noticias.append(obtener_noticia(FEEDS['USA'], 'EE.UU. / Wall Street'))
noticias.append(obtener_noticia(FEEDS['EUROPA'], 'Europa / Zona Euro'))
noticias.append(obtener_noticia(FEEDS['ESPANA'], 'España / IBEX 35'))
noticias = [n for n in noticias if n is not None]

# Generación de HTML para Noticias
html_noticias = ""
for n in noticias:
    html_noticias += f"""
            <div class="news-card shadow-lg min-h-[250px] text-left">
                <div>
                    <span class="text-[9px] text-gold uppercase mb-1 block">{n['pais']}</span>
                    <h4 class="text-brandNav text-sm mb-2 uppercase font-bold">{n['titulo']}</h4>
                    <p class="text-gray-600 text-[11px] mb-4">{n['resumen']}</p>
                </div>
                <a href="{n['link']}" target="_blank" class="text-gold text-[10px] uppercase hover:underline">Leer Reporte →</a>
            </div>"""

# Obtener Ticker
html_ticker = obtener_indicadores()

# --- 5. INYECCIÓN EN EL ARCHIVO INDEX.HTML ---
try:
    if not os.path.exists(RUTA_INDEX):
        print(f"❌ ERROR CRÍTICO: No se encuentra el archivo en {RUTA_INDEX}")
        exit(1)

    with open(RUTA_INDEX, 'r', encoding='utf-8') as f:
        contenido = f.read()

    # Reemplazo de Noticias
    if "" in contenido and "" in contenido:
        partes = contenido.split("")
        parte_superior = partes[0]
        parte_inferior = partes[1].split("")[1]
        contenido = parte_superior + "\n" + html_noticias + "\n            " + parte_inferior
        print("✅ Noticias preparadas.")

    # Reemplazo de Ticker
    if html_ticker and "" in contenido and "" in contenido:
        partes = contenido.split("")
        parte_inferior = partes[1].split("")[1]
        contenido = partes[0] + "\n" + html_ticker + "\n                " + parte_inferior
        print("✅ Indicadores económicos preparados.")

    # Guardar cambios
    with open(RUTA_INDEX, 'w', encoding='utf-8') as f:
        f.write(contenido)
    
    print(f"🎉 ÉXITO: {RUTA_INDEX} actualizado correctamente.")

except Exception as e:
    print(f"❌ ERROR DURANTE LA ACTUALIZACIÓN: {e}")
    exit(1)