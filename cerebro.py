"""
Cerebro - Sistema de actualización automática de datos para Requin & Asociados
Versión 4.0 - Optimizado para GitHub Pages

Este script:
1. Obtiene indicadores económicos desde mindicador.cl
2. Obtiene noticias económicas desde Google News RSS
3. Inyecta los datos en index.html usando tags de marcado
"""

import feedparser
import requests
import ssl
import os
from datetime import datetime, timezone, timedelta

# Configuración SSL para feeds
if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

# Rutas
RUTA_BASE = os.getcwd()
RUTA_INDEX = os.path.join(RUTA_BASE, 'index.html')

# Fuentes de noticias y cantidad a obtener por región
FEEDS_NOTICIAS = {
    'CHILE': {
        'url': 'https://news.google.com/rss/search?q=Chile+Economía+Negocios+when:1d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 3
    },
    'USA': {
        'url': 'https://news.google.com/rss/search?q=USA+Economy+Business+when:1d&hl=es&gl=US&ceid=US:es',
        'cantidad': 1
    },
    'EUROPA': {
        'url': 'https://news.google.com/rss/search?q=Europa+Economía+Negocios+when:1d&hl=es&gl=ES&ceid=ES:es',
        'cantidad': 1
    },
    'ESPAÑA': {
        'url': 'https://news.google.com/rss/search?q=España+Economía+Negocios+when:1d&hl=es&gl=ES&ceid=ES:es',
        'cantidad': 1
    },
    'LEGAL CHILE': {
        'url': 'https://news.google.com/rss/search?q=Chile+Normativa+Legal+Ley+Regulación+when:2d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 2
    }
}

# Tags de marcado en HTML
TICKER_START = '<!--TICKER_START-->'
TICKER_END = '<!--TICKER_END-->'
NOTICIAS_START = '<!--NOTICIAS_START-->'
NOTICIAS_END = '<!--NOTICIAS_END-->'


def obtener_indicadores():
    """
    Obtiene indicadores económicos desde mining.cl API
    
    Returns:
        str: HTML formateado con indicadores o None si hay error
    """
    print("💰 Consultando indicadores económicos...")
    try:
        response = requests.get('https://mindicador.cl/api', timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Validar que los datos necesarios existen
        required_fields = ['uf', 'dolar', 'euro']
        for field in required_fields:
            if field not in data or 'valor' not in data[field]:
                raise ValueError(f"Falta el campo '{field}' en la respuesta de la API")
        
        # Obtener valores
        uf_valor = int(data['uf']['valor'])
        usd_valor = data['dolar']['valor']
        eur_valor = data['euro']['valor']
        # Zona horaria de Chile (UTC-3)
        chile_tz = timezone(timedelta(hours=-3))
        timestamp = datetime.now(chile_tz).strftime('%d/%m %H:%M')
        
        # Construir HTML del ticker
        html = f"""
            <span class="mx-10 text-yellow-500 italic uppercase">
                UF: ${uf_valor:,.0f} <span class="up">▲</span>
            </span>
            <span class="mx-10 text-yellow-500 italic uppercase">
                USD/CLP: ${usd_valor:,.0f} <span class="down">▼</span>
            </span>
            <span class="mx-10 text-yellow-500 italic uppercase">
                EUR/CLP: ${eur_valor:,.0f} <span class="up">▲</span>
            </span>
            <span class="mx-10 text-gray-400 text-[10px] italic uppercase">
                ACTUALIZADO: {timestamp}
            </span>
        """.replace(",", ".")
        
        print(f"✅ Indicadores obtenidos: UF=${uf_valor:,.0f}, USD=${usd_valor:,.0f}, EUR=${eur_valor:,.0f}")
        return html.strip()
        
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Error de red al obtener indicadores: {e}")
        return None
    except (KeyError, ValueError) as e:
        print(f"⚠️ Error procesando datos de indicadores: {e}")
        return None
    except Exception as e:
        print(f"⚠️ Error inesperado en indicadores: {type(e).__name__}: {e}")
        return None


def obtener_noticias():
    """
    Obtiene noticias económicas desde Google News RSS
    
    Returns:
        str: HTML formateado con noticias
    """
    print("📰 Obteniendo noticias económicas...")
    html_noticias = ""
    noticias_count = 0
    
    for region, config in FEEDS_NOTICIAS.items():
        try:
            url = config['url']
            cantidad = config['cantidad']
            
            print(f"  📡 Consultando feed: {region}...")
            feed = feedparser.parse(url)
            
            if not feed.entries:
                print(f"  ⚠️ {region}: No hay entradas en el feed")
                continue
            
            # Obtener la cantidad especificada de noticias para esta región
            for item in feed.entries[:cantidad]:
                # Limpiar título (remover fuente al final)
                titulo = item.title
                if ' - ' in titulo:
                    titulo = titulo.split(' - ')[0]
                
                # Generar HTML de la tarjeta
                html_noticias += f"""
                <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-yellow-600">
                    <span class="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-2 block">{region}</span>
                    <h4 class="text-slate-900 text-sm font-bold mb-3 leading-snug">{titulo}</h4>
                    <a href="{item.link}" target="_blank" class="text-xs text-slate-600 hover:text-yellow-600 transition flex items-center gap-2 uppercase font-bold">
                        Leer artículo completo
                        <i class="fas fa-external-link-alt text-[10px]"></i>
                    </a>
                </div>
                """
                noticias_count += 1
            
            print(f"  ✅ {region}: {min(cantidad, len(feed.entries))} noticias obtenidas")
            
        except Exception as e:
            print(f"  ⚠️ Error obteniendo noticias de {region}: {type(e).__name__}: {e}")
            continue
    
    print(f"📊 Total de noticias obtenidas: {noticias_count}")
    return html_noticias.strip() if html_noticias else None


def inyectar_contenido(html_content, html_ticker, html_noticias):
    """
    Inyecta ticker y noticias en el HTML usando tags de marcado
    
    Args:
        html_content (str): Contenido HTML completo
        html_ticker (str): HTML del ticker a inyectar
        html_noticias (str): HTML de noticias a inyectar
    
    Returns:
        str: HTML actualizado
    """
    content = html_content
    
    # Inyectar ticker si está disponible
    if html_ticker:
        idx_start = content.find(TICKER_START)
        idx_end = content.find(TICKER_END)
        
        if idx_start != -1 and idx_end != -1:
            before = content[:idx_start + len(TICKER_START)]
            after = content[idx_end:]
            content = f"{before}\n            {html_ticker}\n            {after}"
            print("✅ Ticker inyectado correctamente")
        else:
            print("⚠️ No se encontraron los tags del ticker en el HTML")
    
    # Inyectar noticias si están disponibles
    if html_noticias:
        idx_start = content.find(NOTICIAS_START)
        idx_end = content.find(NOTICIAS_END)
        
        if idx_start != -1 and idx_end != -1:
            before = content[:idx_start + len(NOTICIAS_START)]
            after = content[idx_end:]
            content = f"{before}\n                {html_noticias}\n                {after}"
            print("✅ Noticias inyectadas correctamente")
        else:
            print("⚠️ No se encontraron los tags de noticias en el HTML")
    
    return content


def main():
    """Función principal"""
    print("=" * 60)
    print("🧠 CEREBRO v4.0 - Sistema de Actualización Automática")
    print("=" * 60)
    print()
    
    # Verificar que existe index.html
    if not os.path.exists(RUTA_INDEX):
        print(f"❌ ERROR: No se encuentra el archivo: {RUTA_INDEX}")
        print("   Asegúrate de ejecutar este script desde la raíz del proyecto")
        return 1
    
    # 1. Obtener datos
    html_ticker = obtener_indicadores()
    html_noticias = obtener_noticias()
    
    # Verificar si obtuvimos al menos algo
    if not html_ticker and not html_noticias:
        print()
        print("❌ ERROR: No se pudo obtener ningún dato")
        print("   El archivo HTML no será actualizado")
        return 1
    
    # 2. Leer HTML
    print()
    print("📂 Leyendo index.html...")
    try:
        with open(RUTA_INDEX, 'r', encoding='utf-8') as f:
            html_original = f.read()
    except Exception as e:
        print(f"❌ ERROR al leer index.html: {e}")
        return 1
    
    # 3. Inyectar contenido
    print()
    print("💉 Inyectando datos en HTML...")
    html_actualizado = inyectar_contenido(html_original, html_ticker, html_noticias)
    
    # 4. Guardar HTML actualizado
    try:
        with open(RUTA_INDEX, 'w', encoding='utf-8') as f:
            f.write(html_actualizado)
        print()
        print("=" * 60)
        print("✅ ¡PROCESO COMPLETADO EXITOSAMENTE!")
        print("=" * 60)
        print(f"   Archivo actualizado: {RUTA_INDEX}")
        chile_tz = timezone(timedelta(hours=-3))
        print(f"   Timestamp: {datetime.now(chile_tz).strftime('%Y-%m-%d %H:%M:%S')}")
        print()
        return 0
        
    except Exception as e:
        print(f"❌ ERROR al guardar index.html: {e}")
        return 1


if __name__ == "__main__":
    exit(main())
