# project-state.md — ТехПоток

Обновлён: 2026-05-24

---

## Текущая фаза

**Фаза 4 завершена. Проект готов к передаче заказчику.**

---

## Переменные проекта

| Переменная | Значение |
|---|---|
| PROJECT_MODE | vite-static |
| NICHE | B2B инжиниринг |
| RUN_MODE | step-by-step |
| DARK_MODE | light-only |
| INTEGRATIONS | форма-email, metrika |
| ALLOW_FAKE_DATA | false |
| LANGUAGE | ru |
| LEGAL_REGION | РФ |

---

## Дизайн-система (зафиксирована в Фазе 1, подтверждена заказчиком)

| Токен | Значение |
|---|---|
| Шрифт заголовков | Exo 2 (700 / 800) |
| Шрифт текста | Golos Text (400 / 500) |
| `--color-hero` | `#0D2240` (тёмно-синий Hero) |
| `--color-graphite` | `#1E2D42` |
| `--color-blue` | `#1A4E8A` |
| `--color-accent` | `#E06A0A` (оранжевый) |
| `--color-surface` | `#FFFFFF` |
| `--color-surface-2` | `#F2F5F9` |
| `--color-text` | `#18202E` |
| `--color-text-2` | `#536078` |
| `--color-border` | `#D2DAE8` |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 80 / 96px |
| Radius | sm:4px / md:6px / lg:8px |
| Transition | 0.25s ease |
| Container | max 1240px |

---

## Состояние файлов

### Созданы и завершены ✅

| Файл | Описание |
|---|---|
| `package.json` | Vite 5, скрипты dev/build/preview |
| `vite.config.js` | outDir: dist |
| `.env.example` | VITE_FORM_ENDPOINT, VITE_METRIKA_ID |
| `index.html` | 11 секций: Header, Hero, Для кого, Услуги, Кейсы, Процесс, Преимущества, Команда, FAQ, Контакты, Footer + Modal + Cookie banner + Scroll top |
| `src/css/style.css` | Полная дизайн-система: токены, reset, типографика, все компоненты, адаптив, анимации |
| `src/js/main.js` | Бургер, FAQ-аккордеон, модалка (focus trap), телефонная маска, формы с consent-gate и fetch, cookie-баннер, слайдер кейсов, IntersectionObserver, аналитика |
| `legal/privacy.html` | Структурная заглушка политики конфиденциальности |
| `legal/offer.html` | Структурная заглушка публичной оферты |
| `legal/cookies.html` | Структурная заглушка политики cookie |
| `dist/` | Production build (vite build ✅, 54ms) |

### Созданы в Фазе 4 ✅

| Файл | Описание |
|---|---|
| `finalize.md` | Acceptance checklist, спецификация ассетов, карта плейсхолдеров, legal readiness, deploy guide |
| `integration-contract.md` | Шаблон дополнительных аналитических событий для заказчика |
| `CLAUDE.md` | Документация проекта для Claude Code |

---

## Секции index.html — чеклист

| Секция | Реализована | Плейсхолдеры |
|---|---|---|
| Header | ✅ | logo, phone |
| Mobile menu | ✅ | — |
| Hero | ✅ | [16:9 image], [цифра]×3 |
| Для кого | ✅ | [Отрасль 1–6], описания |
| Услуги | ✅ | [Компетенция 1–6], описания |
| Кейсы (слайдер) | ✅ | [case-image]×3, [client-name]×3, [результат]×3 |
| Процесс | ✅ | Контент написан (6 шагов) |
| Преимущества | ✅ | Контент написан (6 пунктов) |
| Команда + Сертификаты | ✅ | [Имя Фамилия]×4, [avatar]×4, [certificate]×4 |
| FAQ | ✅ | 7 вопросов с реальными вопросами, [Ответ N] |
| Контакты + форма | ✅ | [map], [phone], [email], [address] |
| Footer | ✅ | [Название компании], [ИНН], [ОГРН], [Юридический адрес] |
| Modal | ✅ | — |
| Cookie banner | ✅ | — |
| Scroll top | ✅ | — |

---

## 152-ФЗ Frontend-слой — чеклист

- [x] Consent checkbox под каждой формой — `unchecked` по умолчанию
- [x] Submit заблокирован без согласия
- [x] Ссылка на `legal/privacy.html` под каждой формой
- [x] Cookie banner при первом визите (localStorage `tp_cookie_consent`)
- [x] Footer: legal-ссылки (privacy / offer / cookies)
- [x] Footer: реквизиты-заглушки (ИНН, ОГРН, адрес)
- [x] Structural stubs: `legal/privacy.html`, `legal/offer.html`, `legal/cookies.html`
- [ ] Финальные тексты — юрист заказчика

---

## Интеграции

| Интеграция | Статус |
|---|---|
| Форма → Email (`VITE_FORM_ENDPOINT`) | Реализован fetch в `main.js`, endpoint из `.env` |
| Яндекс.Метрика (`VITE_METRIKA_ID`) | Wrapper `ym()` реализован; ID из `.env` |
| Базовые события | `form_submit_success`, `form_submit_error`, `phone_click` |
| `integration-contract.md` | ✅ Создан — шаблон для заказчика |

---

## Открытые вопросы / риски

| Тема | Статус |
|---|---|
| Логотип (векторный файл) | Ждём от заказчика |
| Реальные фото объектов / команды | Ждём от заказчика |
| Реквизиты ИНН, ОГРН, адрес | Ждём от заказчика |
| Кейсы с реальными цифрами | Ждём от заказчика |
| Отрасли и компетенции | Ждём от заказчика |
| VITE_METRIKA_ID | Ждём от заказчика |
| VITE_FORM_ENDPOINT | Ждём от заказчика |
| Legal-тексты (privacy/offer/cookies) | Юрист заказчика |

---

## Следующий шаг

**Передача заказчику. Что остаётся на стороне заказчика:**
1. Заполнить все плейсхолдеры по карте в `finalize.md` (раздел 4)
2. Предоставить реальные изображения (AVIF/WebP) согласно спецификации ассетов
3. Создать `.env` из `.env.example` — вписать `VITE_FORM_ENDPOINT` и `VITE_METRIKA_ID`
4. Добавить скрипт Яндекс.Метрики в `<head>` index.html
5. Юрист: финальные тексты `legal/privacy.html`, `legal/offer.html`, `legal/cookies.html`
6. Согласовать дополнительные аналитические события по `integration-contract.md`
7. Визуальный тест на реальном iPhone + Lighthouse аудит после подстановки контента
