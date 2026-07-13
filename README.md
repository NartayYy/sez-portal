# Цифровая система управления СЭЗ / ИЗ

Веб-визитка / прототип портала специальных экономических и индустриальных зон Казахстана.

Стек: **React 19 + Vite + TypeScript + Tailwind CSS**.

## Локальный запуск

**Требования:** Node.js 18+

```bash
npm install
npm run dev
```

Приложение откроется на [http://localhost:3000](http://localhost:3000).

```bash
npm run build    # production-сборка в dist/
npm run preview  # локальный просмотр dist/
```

## Деплой на Render

1. Залейте репозиторий на GitHub (уже настроено через `render.yaml`).
2. Откройте [https://dashboard.render.com/](https://dashboard.render.com/).
3. **New → Blueprint** и подключите этот репозиторий  
   **или** **New → Static Site** и укажите:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
4. После деплоя сайт будет доступен по адресу вида  
   `https://sez-portal-vizitka.onrender.com`.

### Важно

- Тип сервиса: **Static Site** (не Web Service / Node).
- API-ключи не требуются — фронтенд полностью статический.
