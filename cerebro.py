import feedparser
import requests
import ssl
import os
from datetime import datetime

# 1. Configuración para evitar errores de certificado SSL
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

RUTA_BASE = os.getcwd()
RUTA_INDEX = os.path.join(RUTA_BASE, 'index.html')

# 2. Fuentes de Noticias
FEEDS = {
    'CHILE': 'https://news.google.com/rss/search?q=Chile+Economia+Negocios+when:1d&hl=es-419&gl=CL&ceid=CL:es-419',
    'GLOBAL': 'https://news.google.com/rss/search?q=Mercados+Financieros+Globales+when:1d&hl=es-419&gl=US&ceid=US:es-419'
}

def obtener_indicadores():
    print("💰 Consultando indicadores...")
    try:
        # Usamos un Timeout para que no se quede pegado
        r = requests.get('https://mindicador.cl/api', timeout=10)
        data = r.json()
        html = f"""
                <span class="mx-8 text-brandGold">UF: ${int(data['uf']['valor']):,.0f} <span class="up">▲</span></span>
                <span class="mx-8 text-brandGold">USD: ${data['dolar']['valor']:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-brandGold">EUR: ${data['euro']['valor']:,.0f} <span class="down">▼</span></span>
                <span class="mx-8 text-brandGold">BTC: ${data['bitcoin']['valor']:,.0f} <span class="up">▲</span></span>
                <span class="mx-8 text-brandGold text-[9px]">ACTUALIZADO: {datetime.now().strftime('%d/%m %H:%M')}</span>
        """.replace(",", ".")
        return html
    except Exception as e:
        print(f"⚠️ Error en indicadores: {e}")
        return None

print("🔍 Iniciando Cerebro (Versión Web)...")

# 3. Obtener Datos
html_ticker = obtener_indicadores()

html_noticias = ""
print("📰 Leyendo noticias...")
for pais, url in FEEDS.items():
    try:
        feed = feedparser.parse(url)
        if feed.entries:
            # Tomamos solo las 2 primeras de cada fuente para llenar las 4 cajas
            for item in feed.entries[:2]:
                titulo = item.title.split(' - ')[0] if ' - ' in item.title else item.title
                html_noticias += f"""
                <div class="bg-gray-50 p-6 rounded shadow-sm hover:shadow-md transition border-l-4 border-brandGold">
                    <span class="text-[10px] text-brandGold font-bold uppercase tracking-wider mb-2 block">{pais}</span>
                    <h4 class="text-brandDark text-sm font-bold mb-3 leading-snug">{titulo}</h4>
                    <a href="{item.link}" target="_blank" class="text-xs text-gray-500 hover:text-brandGold transition flex items-center gap-1">
                        Leer nota completa <i class="fas fa-external-link-alt text-[10px]"></i>
                    </a>
                </div>"""
    except Exception as e:
        print(f"⚠️ Error leyendo feed {pais}: {e}")

# 4. Inyectar en el HTML
try:
    if not os.path.exists(RUTA_INDEX):
        print(f"❌ ERROR CRÍTICO: No encuentro {RUTA_INDEX}")
        exit(1)
    
    with open(RUTA_INDEX, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inyectar Noticias
    if html_noticias and "" in content:
        parts = content.split("")
        if len(parts) > 1:
            final_part = parts[1].split("")[1]
            content = parts[0] + "\n" + html_noticias + "\n                " + final_part
            print("✅ Noticias inyectadas.")

    # Inyectar Ticker
    if html_ticker and "" in content:
        parts = content.split("")
        if len(parts) > 1:
            final_part = parts[1].split("")[1]
            content = parts[0] + "\n" + html_ticker + "\n                " + final_part
            print("✅ Ticker inyectado.")

    with open(RUTA_INDEX, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("🚀 PROCESO TERMINADO CON ÉXITO.")

except Exception as e:
    print(f"❌ Error guardando archivo: {e}")
    exit(1)
