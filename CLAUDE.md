# CLAUDE.md — ТехПоток Landing

Проект: vite-static лендинг для инжиниринговой группы «ТехПоток», Нижний Новгород.

## Стек и команды

```bash
npm run dev       # dev-сервер (Vite 5)
npm run build     # production build → dist/
npm run preview   # превью build
```

> В macOS терминале `npx vite` не работает из-за `:` в пути. Использовать `./node_modules/.bin/vite build` напрямую, или `npm run build`.

## Структура

```
index.html          # единственная страница, 11 секций
src/
  css/style.css     # вся дизайн-система, CSS-переменные
  js/main.js        # весь интерактив (ES modules)
legal/
  privacy.html      # заглушка политики конфиденциальности
  offer.html        # заглушка публичной оферты
  cookies.html      # заглушка политики cookie
.env.example        # VITE_FORM_ENDPOINT, VITE_METRIKA_ID
project-state.md    # текущее состояние проекта по фазам
```

## Переменные окружения

Всегда через `.env` (копия `.env.example`). Никогда не хардкодить:
- `VITE_FORM_ENDPOINT` — endpoint для отправки форм
- `VITE_METRIKA_ID` — ID счётчика Яндекс.Метрики

## Дизайн-система — ключевые правила

**Шрифты:** `Exo 2` (заголовки, 700/800) + `Golos Text` (текст, 400/500). Inter/Roboto/Arial/system-ui запрещены.

**Цвета:** только через CSS-переменные `--color-*`. Хардкоженые hex запрещены.

**Иконки:** только SVG inline (Lucide-style stroke). Emoji как иконки запрещены.

**Навигация:** только `href="#section-id"`. `scrollIntoView` запрещён.

## Правила контента

`ALLOW_FAKE_DATA: false` — не выдумывать данные, имена, цифры, логотипы, кейсы.
Все незаполненные места — плейсхолдеры вида `[Название компании]`, `[phone]`, `[case-image]` и т.д.

## 152-ФЗ Frontend-слой

- Consent checkbox под каждой формой — `checked=false` по умолчанию
- Submit заблокирован без согласия
- Cookie banner (localStorage key: `tp_cookie_consent`)
- Footer: legal-ссылки + реквизиты-заглушки
- Legal pages: `legal/privacy.html`, `legal/offer.html`, `legal/cookies.html`

## Мобильный бургер — строгий шаблон

Не отступать от реализации в `src/js/main.js`:
- `position: fixed`, `width: min(320px, 85vw)`, `height: 100dvh`
- Overlay — отдельный элемент (#mobile-overlay), не псевдоэлемент
- `body.menu-open` с `position: fixed; width: 100%` — блокировка iOS-скролла
- Закрытие: overlay / пункт меню / Escape
- `aria-expanded` на кнопке, `aria-hidden` на меню

## Формы

- Телефонная маска `+7 (___) ___-__-__` без внешних библиотек
- Состояния: loading / success / error с `aria-live="polite"`
- Защита от двойного submit (`pending` флаг)
- Endpoint из `import.meta.env.VITE_FORM_ENDPOINT`

## Текущий статус

Фазы 0–4 завершены. Проект готов к передаче заказчику.
Подробнее: `project-state.md`, `finalize.md`, `integration-contract.md`.
