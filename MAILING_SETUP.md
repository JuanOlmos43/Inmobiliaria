# Configuración del Sistema de Envío de Correos (Gmail API)

Este proyecto utiliza la API de Gmail con OAuth2 para enviar correos electrónicos (notificaciones de contacto) sin necesidad de exponer contraseñas ni usar SMTP tradicional.

Sigue estos pasos para configurar el entorno de desarrollo o producción.

## Requisitos Previos

- Una cuenta de Google/Gmail (preferiblemente una cuenta técnica para el sistema).
- Acceso a [Google Cloud Console](https://console.cloud.google.com/).

## Paso 1: Configuración en Google Cloud

1.  Crea un nuevo proyecto en Google Cloud Console (ej. `Sistema Inmobiliaria`).
2.  Ve a **APIs y servicios** > **Biblioteca**.
3.  Busca y habilita la **Gmail API**.
4.  Ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**.
    -   Tipo: **Externo** (o Interno si usas Google Workspace).
    -   Completa los campos obligatorios (Nombre, email soporte, etc.).
    -   **Usuarios de prueba**: Agrega la dirección de correo Gmail que usarás para enviar los mails. DEBES hacer esto para poder generar el token sin verificar la app.
5.  Ve a **APIs y servicios** > **Credenciales**.
    -   Haz clic en **Crear credenciales** > **ID de cliente de OAuth**.
    -   Tipo de aplicación: **Aplicación de escritorio**.
    -   Nombre: (ej. `Cliente Node.js`).
    -   Haz clic en **Crear** y descarga el archivo JSON.

## Paso 2: Colocar Credenciales

1.  Crea una carpeta `config_google` en la raíz del proyecto (si no existe).
2.  Renombra el archivo JSON descargado a `credentials.json`.
3.  Colócalo en:
    ```
    /config_google/credentials.json
    ```

> **Nota:** Este archivo está ignorado en `.gitignore` y NO debe subirse al repositorio.

## Paso 3: Generar Token de Acceso

El sistema necesita un token persistente (`token.json`) para autenticarse.

1.  Ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    npm run generate-token
    ```
2.  La consola mostrará una URL. Ábrela en tu navegador.
3.  Inicia sesión con la cuenta de Gmail autorizada (la que agregaste en "Usuarios de prueba").
4.  Si aparece una advertencia de "Google no ha verificado esta aplicación", haz clic en **Continuar** (es tu propia app).
5.  Concede los permisos solicitados (Enviar correos y Ver mensajes).
6.  Copia el código que aparece al final (o en la URL de redirección `localhost/?code=...`) y pégalo en la consola.
7.  El script generará el archivo `config_google/token.json`.

## Paso 4: Verificación

1.  Asegúrate de que existan ambos archivos:
    -   `config_google/credentials.json`
    -   `config_google/token.json`
2.  Inicia el servidor backend (`npm run dev:backend`).
3.  Prueba el formulario de contacto en `http://localhost:3000/contacto`.

## Solución de Problemas

-   **Token Expirado**: Si el token expira o es revocado, borra el archivo `token.json` y repite el **Paso 3**.
-   **Error de Permisos**: Asegúrate de haber habilitado la Gmail API en la consola de Google.
-   **Error "Insufficient Permission"**: Asegúrate de haber aceptado todos los scopes (incluyendo `gmail.readonly`) al generar el token.
