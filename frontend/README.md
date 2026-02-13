Este es un proyecto [Next.js](https://nextjs.org) inicializado con [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Empezando

Primero, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando `app/page.tsx`. La página se actualiza automáticamente a medida que editas el archivo.

Este proyecto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para optimizar y cargar automáticamente [Geist](https://vercel.com/font), una nueva familia de fuentes para Vercel.

## Aprende Más

Para aprender más sobre Next.js, echa un vistazo a los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs) - aprende sobre las características y la API de Next.js.
- [Aprende Next.js](https://nextjs.org/learn) - un tutorial interactivo de Next.js.

Puedes revisar [el repositorio de GitHub de Next.js](https://github.com/vercel/next.js) - ¡tus comentarios y contribuciones son bienvenidos!

## Despliegue en Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Revisa nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## 🎨 Estilo y Formato de Código

Este proyecto utiliza **Prettier** con **ordenamiento de Tailwind CSS** para asegurar un estilo de código consistente.

### Auto-Formato

Asumimos que estás utilizando VS Code. Para la mejor experiencia:

1. Instala la extensión **Prettier - Code formatter**.
2. Habilita **"Format On Save"** en la configuración de tu VS Code.
   - Esto ordenará automáticamente tus clases de Tailwind (ej., `p-4 flex` se convierte en `flex p-4`) y corregirá la indentación cada vez que guardes.

### Formato Manual

Puedes ejecutar el formateador manualmente en todo el proyecto:

```bash
# Formatear todos los archivos
npx prettier --write .
```

### Configuración

- **.prettierrc**: Contiene la configuración de Prettier y carga el plugin `prettier-plugin-tailwindcss`.
- **.prettierignore**: Especifica qué archivos/carpetas ignorar (como `.next`, `node_modules`).
