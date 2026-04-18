# Bot Telegram — Requin & Asociados

## Qué hace este bot

Bot de pre-calificación comercial para Requin & Asociados.  
Flujo guiado: Segmento → Necesidad → País → Objetivo → Etapa → Urgencia → Conversión.  
Al finalizar, envía un lead estructurado al chat ID del administrador.

---

## Archivos

| Archivo | Descripción |
|---------|-------------|
| `telegram-webhook.php` | Webhook principal del bot |
| `sessions/` | Estado de conversación por usuario (JSON) — excluido de Git |

---

## Configuración (ya incluida en el PHP)

| Variable | Valor |
|----------|-------|
| `BOT_TOKEN` | En el archivo PHP |
| `ADMIN_CHAT_ID` | `2130037013` |
| `WEBHOOK_SECRET` | `ReQu1n_W3bh00k_S3cr3t_2025` |
| URL webhook | `https://www.requinspa.com/telegram/telegram-webhook.php` |

---

## Paso 1: Permisos de la carpeta sessions/

Después del deploy, asegúrate que la carpeta `sessions/` tenga permisos de escritura en Hostinger.  
Desde el panel de Hostinger → Administrador de archivos → selecciona `public_html/telegram/sessions/` → CHMOD 755.

---

## Paso 2: Registrar el Webhook con Telegram

Ejecuta **una sola vez** este comando (con el token real):

```bash
curl "https://api.telegram.org/bot8603881267:AAH03oaJqV4f30KXJXhfif2Cj9vfB8iwY0g/setWebhook?url=https://www.requinspa.com/telegram/telegram-webhook.php&secret_token=ReQu1n_W3bh00k_S3cr3t_2025"
```

Respuesta esperada:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

---

## Paso 3: Configurar comandos en BotFather

Abre BotFather en Telegram → `/mybots` → selecciona `@Requinspa_Bot` → **Edit Bot** → **Edit Commands** y pega:

```
start - Iniciar diagnóstico
servicios - Ver áreas de asesoría
espana - Consultas expansión a España
auditoria - Auditoría y control de gestión
honorarios - Modelo de trabajo y honorarios
asesor - Solicitar contacto humano
nda - Política de confidencialidad
contacto - Datos de contacto
```

---

## Paso 4: Verificar funcionamiento

1. Abre `https://t.me/Requinspa_Bot?start=web_requinspa` en el navegador o móvil.
2. El bot debe responder con el menú de bienvenida y botones inline.
3. Completa el flujo → al finalizar, debes recibir la notificación en tu Telegram.

---

## Flujo del bot

```
/start (web_requinspa)
  └─ Bienvenida + segmentación [botones]
       └─ Necesidad [botones]
            └─ País [texto libre]
                 └─ Objetivo [texto libre]
                      └─ Etapa [botones]
                           └─ Urgencia [botones]
                                └─ Conversión [botones]
                                     ├─ Reunión → Confirmación + Notificación admin
                                     ├─ Asesor → Confirmación + Notificación admin
                                     └─ Info → Menú de servicios
```

---

## Comandos rápidos disponibles en cualquier momento

- `/servicios` — Menú de áreas
- `/espana` — Info expansión España
- `/auditoria` — Info auditoría
- `/honorarios` — Modelo de honorarios
- `/nda` — Confidencialidad
- `/contacto` — Datos de contacto
- `/asesor` — Solicitar contacto humano (envía notificación inmediata)
