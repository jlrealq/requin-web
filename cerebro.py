"""
Cerebro - Sistema de actualización automática de datos para Requin & Asociados (React/Vite)
Versión 5.0 - Exporta a JSON
"""

import feedparser
import requests
import ssl
import os
import json
from datetime import datetime, timezone, timedelta

if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

RUTA_BASE = os.getcwd()
RUTA_MARKET = os.path.join(RUTA_BASE, 'src', 'data', 'market.json')
RUTA_NEWS = os.path.join(RUTA_BASE, 'src', 'data', 'news.json')

FEEDS_NOTICIAS = {
    'CHILE': {
        'url': 'https://news.google.com/rss/search?q=Chile+Economía+Negocios+when:1d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 3,
        'category': 'TRIBUTARIO'
    },
    'EUROPA': {
        'url': 'https://news.google.com/rss/search?q=Europa+Economía+Negocios+when:1d&hl=es&gl=ES&ceid=ES:es',
        'cantidad': 2,
        'category': 'INTERNACIONAL'
    },
    'LEGAL': {
        'url': 'https://news.google.com/rss/search?q=%22Chile%22+(ley+OR+normativa+OR+proyecto+de+ley+OR+Corte+Suprema+OR+SII)+when:2d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 4,
        'category': 'PLANIFICACIÓN'
    }
}

def obtener_indicadores():
    print("💰 Consultando indicadores económicos...")
    try:
        response = requests.get('https://mindicador.cl/api', timeout=10)
        response.raise_for_status()
        data = response.json()
        
        uf_valor = float(data['uf']['valor'])
        usd_valor = float(data['dolar']['valor'])
        eur_valor = float(data['euro']['valor'])
        
        # Calculate random trends or use historical comparison if available, here we use fixed or simple logic over time
        # Mindicador returns valor. It doesn't return trend intrinsically safely, we'll mark it as 'up' generally or 'down' based on simple logic
        # For a robust solution, we would look at the previous days but for now we set a default
        
        chile_tz = timezone(timedelta(hours=-3))
        timestamp = datetime.now(chile_tz).strftime('%d/%m %H:%M')
        
        market_data = {
            "uf": { "value": uf_valor, "trend": "up" },
            "usd": { "value": usd_valor, "trend": "down" },
            "eur": { "value": eur_valor, "trend": "up" },
            "timestamp": f"ACTUALIZADO {timestamp}"
        }
        
        with open(RUTA_MARKET, 'w', encoding='utf-8') as f:
            json.dump(market_data, f, ensure_ascii=False, indent=2)
            
        print(f"✅ Indicadores guardados: UF=${uf_valor:,.0f}, USD=${usd_valor:,.0f}, EUR=${eur_valor:,.0f}")
        return True
    except Exception as e:
        print(f"⚠️ Error obteniendo indicadores: {e}")
        return False

def obtener_noticias():
    print("📰 Obteniendo noticias económicas...")
    noticias_list = []
    
    for region, config in FEEDS_NOTICIAS.items():
        try:
            url = config['url']
            cantidad = config['cantidad']
            category = config['category']
            
            feed = feedparser.parse(url)
            if not feed.entries:
                continue
            
            for item in feed.entries[:cantidad]:
                titulo = item.title.split(' - ')[0]
                letras = [c for c in titulo if c.isalpha()]
                if letras and all(c.isupper() for c in letras):
                    titulo = titulo.title()
                
                # Fetch date or use now
                try:
                    fecha_pub = datetime.strptime(item.published, '%a, %d %b %Y %H:%M:%S %Z')
                    fecha_str = fecha_pub.strftime('%Y-%m-%d')
                except:
                    fecha_str = datetime.now().strftime('%Y-%m-%d')
                
                noticias_list.append({
                    "date": fecha_str,
                    "title": titulo,
                    "excerpt": "Click para leer la noticia completa en la fuente original sobre las últimas actualizaciones.",
                    "category": category,
                    "url": item.link
                })
                
        except Exception as e:
            print(f"  ⚠️ Error obteniendo noticias de {region}: {e}")
            continue
    
    if noticias_list:
        with open(RUTA_NEWS, 'w', encoding='utf-8') as f:
            json.dump(noticias_list, f, ensure_ascii=False, indent=2)
        print(f"📊 Total de noticias guardadas: {len(noticias_list)}")
        return True
    return False

def main():
    print("=" * 60)
    print("🧠 CEREBRO v5.0 - Generador de JSON")
    print("=" * 60)
    
    os.makedirs(os.path.dirname(RUTA_MARKET), exist_ok=True)
    
    ind_ok = obtener_indicadores()
    not_ok = obtener_noticias()
    
    if not ind_ok and not not_ok:
        print("❌ ERROR: No se generó ningún dato")
        return 1
        
    print("✅ Proceso completado.")
    return 0

if __name__ == "__main__":
    exit(main())
