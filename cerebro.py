"""
Cerebro - Sistema de actualización automática de datos para Requin & Asociados (React/Vite)
Versión 5.2 - Exporta a JSON con alta disponibilidad y resiliencia
"""

import feedparser
import requests
import ssl
import os
import json
import email.utils
from datetime import datetime, timezone, timedelta

if hasattr(ssl, '_create_unverified_context'):
    ssl._create_default_https_context = ssl._create_unverified_context

RUTA_BASE = os.getcwd()
RUTA_MARKET = os.path.join(RUTA_BASE, 'src', 'data', 'market.json')
RUTA_NEWS = os.path.join(RUTA_BASE, 'src', 'data', 'news.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

FEEDS_NOTICIAS = {
    'CHILE': {
        'url': 'https://news.google.com/rss/search?q=Chile+Econom%C3%ADa+Negocios+when:7d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 3,
        'category': 'TRIBUTARIO'
    },
    'EUROPA': {
        'url': 'https://news.google.com/rss/search?q=Europa+Econom%C3%ADa+Negocios+when:7d&hl=es&gl=ES&ceid=ES:es',
        'cantidad': 3,
        'category': 'INTERNACIONAL'
    },
    'LEGAL': {
        'url': 'https://news.google.com/rss/search?q=%22Chile%22+(ley+OR+normativa+OR+proyecto+de+ley+OR+Corte+Suprema+OR+SII)+when:7d&hl=es-419&gl=CL&ceid=CL:es-419',
        'cantidad': 3,
        'category': 'PLANIFICACIÓN'
    }
}

def obtener_indicadores():
    print("💰 Consultando indicadores económicos...")
    chile_tz = timezone(timedelta(hours=-3))
    timestamp = datetime.now(chile_tz).strftime('%d/%m %H:%M')
    
    # Intento 1: mindicador.cl
    try:
        response = requests.get('https://mindicador.cl/api', headers=HEADERS, timeout=12)
        response.raise_for_status()
        data = response.json()
        
        uf_valor = float(data['uf']['valor'])
        usd_valor = float(data['dolar']['valor'])
        eur_valor = float(data['euro']['valor'])
        
        market_data = {
            "uf": { "value": uf_valor, "trend": "up" },
            "usd": { "value": usd_valor, "trend": "down" },
            "eur": { "value": eur_valor, "trend": "up" },
            "timestamp": f"ACTUALIZADO {timestamp}"
        }
        
        with open(RUTA_MARKET, 'w', encoding='utf-8') as f:
            json.dump(market_data, f, ensure_ascii=False, indent=2)
            
        print(f"✅ Indicadores guardados desde mindicador.cl: UF=${uf_valor:,.0f}, USD=${usd_valor:,.0f}, EUR=${eur_valor:,.0f}")
        return True
    except Exception as e:
        print(f"⚠️ mindicador.cl falló ({e}), intentando API de respaldo...")

    # Intento 2: open.er-api.com (Respaldo para USD y EUR)
    try:
        res = requests.get('https://open.er-api.com/v6/latest/USD', headers=HEADERS, timeout=8)
        res.raise_for_status()
        rates = res.json().get('rates', {})
        usd_valor = float(rates.get('CLP', 920))
        eur_rate = float(rates.get('EUR', 0.92))
        eur_valor = usd_valor / eur_rate if eur_rate else 1020.0
        
        # Mantener UF previa si existe
        uf_valor = 38500.0
        if os.path.exists(RUTA_MARKET):
            try:
                with open(RUTA_MARKET, 'r', encoding='utf-8') as f:
                    old_data = json.load(f)
                    uf_valor = old_data.get('uf', {}).get('value', uf_valor)
            except Exception:
                pass

        market_data = {
            "uf": { "value": uf_valor, "trend": "up" },
            "usd": { "value": usd_valor, "trend": "down" },
            "eur": { "value": eur_valor, "trend": "up" },
            "timestamp": f"ACTUALIZADO {timestamp}"
        }
        
        with open(RUTA_MARKET, 'w', encoding='utf-8') as f:
            json.dump(market_data, f, ensure_ascii=False, indent=2)
            
        print(f"✅ Indicadores guardados desde respaldo open.er-api.com: UF=${uf_valor:,.0f}, USD=${usd_valor:,.0f}, EUR=${eur_valor:,.0f}")
        return True
    except Exception as e2:
        print(f"⚠️ Error en API de respaldo: {e2}")

    # Preservar datos anteriores si existen
    if os.path.exists(RUTA_MARKET):
        print("ℹ️ Manteniendo datos de indicadores del archivo previo.")
        return True
        
    return False

def obtener_noticias():
    print("📰 Obteniendo noticias económicas...")
    noticias_list = []
    
    for region, config in FEEDS_NOTICIAS.items():
        try:
            url = config['url']
            cantidad = config['cantidad']
            category = config['category']
            
            response = requests.get(url, headers=HEADERS, timeout=10)
            response.raise_for_status()
            
            feed = feedparser.parse(response.content)
            if not feed.entries:
                print(f"  ⚠️ Feed sin entradas para {region}")
                continue
            
            region_news = []
            seen_titles = set()
            for item in feed.entries:
                titulo = item.title.split(' - ')[0].strip()
                if titulo in seen_titles:
                    continue
                seen_titles.add(titulo)
                
                letras = [c for c in titulo if c.isalpha()]
                if letras and all(c.isupper() for c in letras):
                    titulo = titulo.title()
                
                fecha_str = None
                if hasattr(item, 'published_parsed') and item.published_parsed:
                    try:
                        fecha_str = datetime(*item.published_parsed[:6]).strftime('%Y-%m-%d')
                    except Exception:
                        pass
                if not fecha_str and hasattr(item, 'published'):
                    try:
                        dt = email.utils.parsedate_to_datetime(item.published)
                        fecha_str = dt.strftime('%Y-%m-%d')
                    except Exception:
                        pass
                if not fecha_str:
                    fecha_str = datetime.now().strftime('%Y-%m-%d')
                
                region_news.append({
                    "date": fecha_str,
                    "title": titulo,
                    "excerpt": "Click para leer la noticia completa en la fuente original sobre las últimas actualizaciones.",
                    "category": category,
                    "url": item.link
                })
            
            region_news.sort(key=lambda x: x['date'], reverse=True)
            noticias_list.extend(region_news[:cantidad])
            
        except Exception as e:
            print(f"  ⚠️ Error obteniendo noticias de {region}: {e}")
            continue
    
    if noticias_list:
        noticias_list.sort(key=lambda x: x['date'], reverse=True)
        with open(RUTA_NEWS, 'w', encoding='utf-8') as f:
            json.dump(noticias_list, f, ensure_ascii=False, indent=2)
        print(f"📊 Total de noticias guardadas: {len(noticias_list)}")
        return True
    
    print("⚠️ No se pudieron obtener noticias nuevas.")
    return os.path.exists(RUTA_NEWS)

def main():
    print("=" * 60)
    print("🧠 CEREBRO v5.2 - Generador de JSON")
    print("=" * 60)
    
    os.makedirs(os.path.dirname(RUTA_MARKET), exist_ok=True)
    
    ind_ok = obtener_indicadores()
    not_ok = obtener_noticias()
    
    if not ind_ok and not not_ok:
        print("❌ ERROR: No se generó ningún dato ni existían datos previos")
        return 1
        
    print("✅ Proceso completado exitosamente.")
    return 0

if __name__ == "__main__":
    exit(main())


