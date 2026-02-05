import feedparser
import requests
import ssl
import os
from datetime import datetime

# 1. Configuración SSL
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

RUTA_BASE = os.getcwd()
RUTA_INDEX = os.path.join(RUTA_BASE, 'index.html')

# 2. Fuentes
FEEDS = {
    'CHILE': 'https://news.google.com/rss/search?q=Chile+Economia+Negocios+when:1d&hl=es-419&gl=CL&ceid=CL:es-419',
    'GLOBAL': 'https://news.google.com/rss/search?q=Mercados+Financieros+Globales+when:1d&hl=es-419&gl=US&ceid=US:es-419'
}

def obtener_indicadores():
    print("💰 Consultando indicadores económicos...")
    try:
        r = requests.get('https://mindicador.cl/api', timeout=10)
        r.raise_for_status()  # Lanza excepción si hay error HTTP
        data = r.json()
        
        # Validar que los datos existen
        if 'uf' not in data or 'dolar' not in data or 'euro' not in data:
            raise ValueError("Datos incompletos desde la API")
        
        # Construimos el HTML del ticker
        html = f"""
                <span class="mx-8 text-brandGold">UF: ${int(data['uf']['valor']):,.0f} <span class="up">▲</span></span>
                <span class="mx-8 text-brandGold">USD: ${data['dolar']['valor']:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-brandGold">EUR: ${data['euro']['valor']:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-brandGold text-[9px]">ACTUALIZADO: {datetime.now().strftime('%d/%m %H:%M')}</span>
        """.replace(",", ".")
        
        print(f"✅ Indicadores obtenidos: UF=${int(data['uf']['valor']):,.0f}, USD=${data['dolar']['valor']:,.0f}, EUR=${data['euro']['valor']:,.0f}")
        return html
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error de red al obtener indicadores: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"⚠️ Error procesando datos de indicadores: {e}")
        return None
    except Exception as e:
        print(f"⚠️ Error inesperado en indicadores: {e}")
        return None

# --- EJECUCIÓN ---
print("🔍 Iniciando Cerebro v3.0...")

# A. Obtener datos
html_ticker = obtener_indicadores()
html_noticias = ""

print("📰 Obteniendo noticias...")
noticias_count = 0
for pais, url in FEEDS.items():
    try:
        print(f"  Consultando feed: {pais}...")
        feed = feedparser.parse(url)
        if feed.entries:
            for item in feed.entries[:2]:
                # Limpieza simple del título
                titulo = item.title
                if ' - ' in titulo:
                    titulo = titulo.split(' - ')[0]
                
                html_noticias += f"""
                <div class="bg-gray-50 p-6 rounded shadow-sm hover:shadow-md transition border-l-4 border-brandGold">
                    <span class="text-[10px] text-brandGold font-bold uppercase tracking-wider mb-2 block">{pais}</span>
                    <h4 class="text-brandDark text-sm font-bold mb-3 leading-snug">{titulo}</h4>
                    <a href="{item.link}" target="_blank" class="text-xs text-gray-500 hover:text-brandGold transition flex items-center gap-1">
                        Leer nota completa <i class="fas fa-external-link-alt text-[10px]"></i>
                    </a>
                </div>"""
                noticias_count += 1
            print(f"  ✅ {pais}: {min(2, len(feed.entries))} noticias obtenidas")
        else:
            print(f"  ⚠️ {pais}: No hay entradas en el feed")
    except Exception as e:
        print(f"  ⚠️ Error obteniendo noticias de {pais}: {e}")

print(f"📊 Total de noticias obtenidas: {noticias_count}")

# B. Inyectar en HTML (MÉTODO SEGURO SIN SPLIT)
try:
    if not os.path.exists(RUTA_INDEX):
        print("❌ No encuentro index.html")
        exit(1)
    
    with open(RUTA_INDEX, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inyectar Noticias
    tag_inicio_noticias = ""
    tag_fin_noticias = ""
    
    idx_inicio = content.find(tag_inicio_noticias)
    idx_fin = content.find(tag_fin_noticias)

    if html_noticias and idx_inicio != -1 and idx_fin != -1:
        # Reemplazamos exactamente lo que está entre las etiquetas
        nuevo_contenido = content[:idx_inicio + len(tag_inicio_noticias)] + "\n" + html_noticias + "\n                " + content[idx_fin:]
        content = nuevo_contenido
        print("✅ Noticias inyectadas.")

    # 2. Inyectar Ticker
    tag_inicio_ticker = ""
    tag_fin_ticker = ""
    
    idx_inicio_t = content.find(tag_inicio_ticker)
    idx_fin_t = content.find(tag_fin_ticker)

    if html_ticker and idx_inicio_t != -1 and idx_fin_t != -1:
        nuevo_contenido = content[:idx_inicio_t + len(tag_inicio_ticker)] + "\n" + html_ticker + "\n                " + content[idx_fin_t:]
        content = nuevo_contenido
        print("✅ Ticker inyectado.")

    with open(RUTA_INDEX, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("🚀 TODO LISTO. GUARDANDO...")

except Exception as e:
    print(f"❌ Error crítico: {e}")
    exit(1)

