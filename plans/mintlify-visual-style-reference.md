# Mintlify Visual Style Reference — для рескина EstateDash

**Дата:** 2026-03-20
**Источник:** Скриншот сайта Mintlify (docs.mintlify.com)
**Цель:** Полное описание визуального стиля для последующего применения к проекту EstateDash

---

## 1. Общая концепция стиля

### 1.1 Философия

Это современный **developer-oriented UI** с уклоном в **AI / SaaS / DevTools** эстетику. Тёмная тема (dark-first) с ощущением **"технологичной чистоты"** — без визуального шума, с акцентом на контент.

> **Главный UX-принцип:** «Контент — главный, интерфейс — вторичен»

### 1.2 Визуальные ассоциации

- **GitHub Docs** + **Vercel** + **Linear** + **Notion AI**
- Ощущение **"умного продукта"**, а не просто сайта
- **Futuristic, clean, developer-friendly, AI-powered aesthetic**

### 1.3 Стилевые ключевые слова (для нейронки/промптов)

```
dark minimalistic SaaS UI
neon green accents
soft gradients
glassmorphism light (очень лёгкий)
futuristic, clean, developer-friendly
AI-powered aesthetic
```

---

## 2. Цветовая система

### 2.1 Фоны — Deep Navy / Green-Black

Фон — **очень тёмный, почти чёрный, но НЕ чистый чёрный**. С лёгким холодным зелёно-синим подтоном (deep navy / green-black).

| Уровень | Токен | Цвет | Применение |
|---|---|---|---|
| Canvas | `--bg-canvas` | `#0B0F0E` — `#0F1412` | Самый глубокий фон страницы, sidebar |
| Surface | `--bg-surface` | `#111916` — `#131D1A` | Основная область контента |
| Card | `--bg-card` | `#0E1A1A` — `#101D1D` | Feature-карточки (с teal-оттенком) |
| Elevated | `--bg-elevated` | `#1A2420` — `#1E2A25` | Dropdown, вложенные панели |
| Overlay | `--bg-overlay` | `#222E2A` — `#253330` | Модалы, tooltips |
| Hover | `--bg-hover` | `#1A2420` | Hover-состояние строк и элементов |
| Active | `--bg-active` | `#1D2A25` | Активная/выбранная строка |

**Ключевая особенность:** Карточки имеют **тёмно-бирюзовый/teal оттенок фона**, а не нейтральный серый. Это создаёт монохромную гармонию с зелёным акцентом.

### 2.2 Акцент — Неоново-зелёный / Мятный

Основной акцент: **один яркий неоново-зелёный цвет** ~`#00FFB2`. Без второго акцентного цвета — **чистый монохром + зелёный**.

| Вариант | Цвет | Применение |
|---|---|---|
| Primary | `#00FFB2` — `#0DE5A8` | Активные ссылки, иконки, индикаторы |
| Bright | `#3DFCB4` — `#4FFFBF` | Hover-подсветка, выделение |
| Muted BG | `rgba(0, 255, 178, 0.08)` — `rgba(0, 255, 178, 0.12)` | Фон активного элемента в sidebar |
| Subtle BG | `rgba(0, 255, 178, 0.04)` — `rgba(0, 255, 178, 0.06)` | Едва заметная подложка |
| Glow | `rgba(0, 255, 178, 0.15)` — `rgba(0, 255, 178, 0.20)` | Свечение при hover |
| Border | `rgba(0, 255, 178, 0.12)` — `rgba(0, 255, 178, 0.30)` | Рамки карточек |

> **Важный момент:** Нет резких контрастов → всё **мягко, "светится", а не "кричит"**

### 2.3 Текст

| Тип | Цвет | Применение |
|---|---|---|
| Primary | `#EAEAEA` — `#F0F2F5` | Заголовки, основной текст |
| Secondary | `#9AA3A0` — `#8B9AB5` | Описания, подзаголовки, пункты меню |
| Tertiary | `#5C6A7E` — `#6B7280` | Неактивные пункты, вспомогательный текст |
| Disabled | `#3D4654` | Отключённые элементы |
| Accent | `#00FFB2` | Ссылки, активные элементы, breadcrumbs |

### 2.4 Borders

| Тип | Цвет | Применение |
|---|---|---|
| Subtle | `rgba(255, 255, 255, 0.05)` | Разделители в sidebar, еле видимые |
| Default | `rgba(255, 255, 255, 0.08)` | Стандартные рамки |
| Strong | `rgba(255, 255, 255, 0.14)` | Более заметные рамки |
| Accent | `rgba(0, 255, 178, 0.30)` | Рамки на акцентных элементах |
| Card | `rgba(0, 255, 178, 0.12)` | Тонкая зелёная рамка на карточках |
| Active indicator | `#00FFB2` (solid, 3px) | Вертикальная линия у активного пункта TOC |

### 2.5 Тёмно-зелёные градиенты

Используются повсеместно для создания глубины:

```css
/* Карточка — градиент сверху вниз */
background: linear-gradient(180deg, 
  rgba(0, 255, 178, 0.06) 0%, 
  rgba(0, 255, 178, 0.01) 60%, 
  transparent 100%
);

/* Радиальное свечение на карточке */
background: radial-gradient(
  ellipse at center top,
  rgba(0, 255, 178, 0.08) 0%,
  rgba(0, 255, 178, 0.02) 50%,
  transparent 100%
);
```

---

## 3. Свет и эффекты (КЛЮЧЕВАЯ ФИШКА)

Это самая важная визуальная особенность стиля. Без этих эффектов дизайн будет выглядеть "плоским и мёртвым".

### 3.1 Soft Glow — мягкое свечение

Элементы не просто имеют цвет — они **мягко светятся**:

```css
/* Свечение карточки при hover */
.card-glow:hover {
  box-shadow: 
    0 0 20px rgba(0, 255, 178, 0.08),
    0 0 40px rgba(0, 255, 178, 0.04),
    0 0 80px rgba(0, 255, 178, 0.02);
}

/* Inner glow — внутреннее свечение */
.inner-glow {
  box-shadow: inset 0 1px 0 rgba(0, 255, 178, 0.06),
              inset 0 0 20px rgba(0, 255, 178, 0.03);
}
```

### 3.2 Gradient Overlays — градиентные наложения

Карточки имеют **зелёный градиент сверху**, создающий эффект "подсвеченной поверхности":

```css
.card-gradient-overlay {
  position: relative;
}
.card-gradient-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, 
    rgba(0, 255, 178, 0.06) 0%, 
    transparent 70%
  );
  border-radius: inherit;
  pointer-events: none;
}
```

### 3.3 Glassmorphism Light — лёгкий стеклоэффект

Очень деликатный, **не как у Apple** — просто лёгкий blur + прозрачность:

```css
.glass-light {
  background: rgba(15, 20, 18, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### 3.4 Hover-переходы

**Плавные, не резкие.** Лёгкое усиление свечения при наведении:

```css
.smooth-hover {
  transition: all 200ms ease;
}
.smooth-hover:hover {
  background: rgba(0, 255, 178, 0.04);
  box-shadow: 0 0 20px rgba(0, 255, 178, 0.06);
  transform: translateY(-1px); /* едва заметный подъём */
}
```

### 3.5 Эффект "живого интерфейса"

Совокупность всех эффектов создаёт ощущение **"живого интерфейса"**:
- blur
- прозрачные градиенты
- внутренние свечения (inner glow)
- мягкие тени с цветом акцента
- плавные transition на всех интерактивных элементах

---

## 4. Типографика

### 4.1 Шрифт

- **Семейство:** Sans-serif (Inter, System UI)
- **Характер:** Современный, нейтральный, без декоративности
- **Начертания:** Regular (400), Medium (500), Semibold (600)

### 4.2 Иерархия

| Элемент | Размер | Вес | Особенности |
|---|---|---|---|
| H1 — Page title | 28-32px | Semibold (600) | Крупный, жирный, чистый. Tracking: -0.02em |
| H2 — Section label | 14-16px | Semibold (600) | Зелёный цвет, caps иногда |
| H3 — Card title | 16-18px | Semibold (600) | Белый, аккуратный |
| Body | 14-15px | Regular (400) | Лёгкий, читаемый |
| Sidebar items | 14px | Medium (500) | С иконками |
| Nav tabs | 14px | Medium (500) | Top bar |
| TOC items | 13-14px | Regular (400) | Правый sidebar |
| Small/caption | 12px | Regular (400) | Вспомогательный |

### 4.3 Ритмика

- **Много воздуха** — интерфейс "дышит"
- **Чёткая вертикальная ритмика** — consistent spacing
- **Нет перегруженности** — каждый элемент имеет пространство
- **Line-height:** заголовки 1.2-1.3, текст 1.5-1.6

---

## 5. Layout / Сетка

### 5.1 Основная структура

```
┌──────────┬────────────────────────────┬──────────┐
│          │       Top Navigation       │          │
│  Left    ├────────────────────────────┤  Right   │
│  Sidebar │                            │  Sidebar │
│  ~260px  │     Main Content Area      │  ~200px  │
│          │                            │          │
│  nav     │     cards / table / etc    │  TOC     │
│  items   │                            │  anchors │
│          │                            │          │
└──────────┴────────────────────────────┴──────────┘
```

### 5.2 Spacing — "Breathing Space"

- **Padding карточек:** 24-32px
- **Gap между карточками:** 20-24px
- **Sidebar padding:** 12-16px horizontal
- **Content area padding:** 32-48px
- **Section spacing:** 32-48px vertical

### 5.3 Принципы

- Равномерные отступы
- Строгая геометрия
- Интерфейс **"дышит"** — большие breathing spaces
- Grid: 2 колонки для карточек, responsive

---

## 6. Компоненты UI

### 6.1 Sidebar (Боковая панель)

- **Ширина:** ~260-280px
- **Фон:** Самый тёмный уровень
- **Логотип:** Верхний левый угол, зелёный значок + белое название
- **Пункты меню:**
  - Иконки **минималистичные**, line-style
  - Неактивные: серый текст (`#9AA3A0`)
  - **Активный:** яркий зелёный фон-подложка + белый текст + `border-radius: 8px`
  - Hover: лёгкое осветление фона
- **Разделители:** Тонкие, почти невидимые
- **Группировка:** Логические секции, разделённые пробелом + тонкой линией

### 6.2 Top Navigation Bar

- **Высота:** ~56-64px
- **Tabs:**
  - Активный: зелёный текст
  - Неактивный: серый текст
  - Без подчёркивания — чисто цветовое выделение
- **Search bar:**
  - Скруглённое поле (`border-radius: 8px`)
  - Тёмный фон + subtle border
  - Placeholder серый + иконка лупы
  - Shortcut badge «⌘K» справа
- **AI кнопка:** «✦ Ask AI» — отдельная CTA кнопка с border

### 6.3 Feature Cards (Карточки) — КЛЮЧЕВОЙ ПАТТЕРН

```
┌─────────────────────────────────┐
│  ╔═══════════════════════════╗  │
│  ║   gradient + grid pattern ║  │
│  ║                           ║  │
│  ║      🔷 3D Icon          ║  │  ← teal gradient overlay
│  ║                           ║  │     + grid mesh pattern
│  ╚═══════════════════════════╝  │
│                                 │
│  Card Title (white, semibold)   │
│  Description text (gray)        │
│                                 │
└─────────────────────────────────┘
```

- **Скругления:** `border-radius: 12-16px` (medium radius)
- **Border:** `rgba(0, 255, 178, 0.12)` — тонкая зелёная
- **Фон:** Тёмно-бирюзовый gradient (от `#0A1A1A` к `#0D1F1D`)
- **Overlay:** Зелёный gradient сверху + grid-pattern mesh
- **Hover:** Лёгкое усиление glow, **плавное**
- **Иконки:** 3D-изометрические, зелёного цвета, по центру
- **Высота визуальной области:** ~140-160px

### 6.4 Table of Contents (Правая панель)

- **Ширина:** ~200-220px
- **Заголовок:** «On this page» с иконкой
- **Активный:** зелёный текст + **зелёная вертикальная линия слева** (3px solid)
- **Неактивный:** серый текст
- **Минимализм** — акцент только на текущем разделе

### 6.5 Breadcrumb / Section Label

- Над заголовком: зелёный текст «Getting Started»
- Размер: 14px, medium weight
- Роль: breadcrumb + категория

---

## 7. Иконки и графика

### 7.1 Стиль иконок

- **Line icons** — тонкие, outline/stroke
- **Монохромные** + зелёный акцент для активных
- **Стиль:** outline / wireframe
- **Абстрактные** — без детализации, символизм

### 7.2 Иконки на карточках

- Крупнее обычных иконок меню
- **3D-изометрические** / геометрические
- Зелёного цвета (`#00FFB2`)
- По центру визуальной области карточки

---

## 8. Визуальные паттерны и текстуры

### 8.1 Grid/Mesh Pattern на карточках

Тонкий **grid-pattern** на фоне карточек — линии образующие сетку:

```css
/* Grid pattern background */
.card-grid-pattern {
  background-image:
    linear-gradient(rgba(0, 255, 178, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 178, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

Создаёт:
- Ощущение технологичности
- Визуальную глубину
- Отличие от плоского цвета

### 8.2 Градиентные поверхности

Фон карточек — **radial gradient** от центра, не плоский цвет:

```css
.card-teal-surface {
  background: 
    radial-gradient(ellipse at center top, rgba(0, 255, 178, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, #0E1A1A 0%, #0B0F0E 100%);
}
```

---

## 9. UX-подход

### 9.1 Принципы

- **Ничего не отвлекает** — визуал помогает ориентироваться
- **Акценты только на важном** — один цвет, точечно
- **Плавные hover-эффекты** — всё smooth, ничего резкого
- **Понятная навигация** — сканирование глазами за секунды
- **Быстрый сканинг** — чёткая иерархия, ритм, группировка

### 9.2 Поведение интерактивных элементов

| Элемент | Действие | Эффект |
|---|---|---|
| Карточка | Hover | Лёгкое свечение + подъём 1px |
| Ссылка | Hover | Изменение opacity / brightness |
| Sidebar item | Hover | Фон осветляется |
| Sidebar item | Active | Зелёная подложка + белый текст |
| Кнопка | Hover | Усиление glow |
| Input | Focus | Border становится accent-цветом |

---

## 10. Сопоставление с текущим EstateDash

### 10.1 Основные отличия

| Аспект | Текущий EstateDash | Mintlify / Новый стиль |
|---|---|---|
| **Акцентный цвет** | Синий `#3B82F6` | Неоново-зелёный `#00FFB2` |
| **Второй акцент** | Фиолетовый `#8B5CF6` | ❌ Нет — монохром + зелёный |
| **Фон canvas** | `#08080D` (нейтральный) | `#0B0F0E` (green-black подтон) |
| **Фон surface** | `#111118` (нейтральный) | `#111916` (с зелёным оттенком) |
| **Карточки** | Нейтрально-серые | С бирюзовым оттенком + gradient + glow |
| **Borders** | Белые rgba | Зелёные rgba на акцентных элементах |
| **Hover эффекты** | Простое осветление | Soft glow + gradient усиление |
| **Ощущение** | Fintech dashboard | AI-powered DevTools |

### 10.2 Готовые CSS-переменные для замены

```css
/* === MINTLIFY-INSPIRED PALETTE === */

/* Backgrounds — green-black tinted */
--bg-canvas: #0B0F0E;
--bg-surface: #111916;
--bg-elevated: #1A2420;
--bg-overlay: #222E2A;
--bg-hover: #162018;
--bg-active: #1D2A25;

/* Card backgrounds — teal-tinted */
--bg-card: #0E1A1A;
--bg-card-hover: #112220;
--bg-card-gradient: linear-gradient(180deg, rgba(0, 255, 178, 0.06) 0%, transparent 70%);

/* Accent — Neon Green / Mint */
--accent-primary: #00FFB2;
--accent-primary-hover: #00E6A0;
--accent-primary-muted: rgba(0, 255, 178, 0.12);
--accent-primary-subtle: rgba(0, 255, 178, 0.06);
--accent-glow: rgba(0, 255, 178, 0.15);
--accent-glow-strong: rgba(0, 255, 178, 0.25);

/* NO secondary accent — монохром */

/* Text */
--text-primary: #EAEAEA;
--text-secondary: #9AA3A0;
--text-tertiary: #5C6A7E;
--text-disabled: #3D4654;
--text-accent: #00FFB2;

/* Borders */
--border-subtle: rgba(255, 255, 255, 0.05);
--border-default: rgba(255, 255, 255, 0.08);
--border-strong: rgba(255, 255, 255, 0.14);
--border-accent: rgba(0, 255, 178, 0.30);
--border-card: rgba(0, 255, 178, 0.12);

/* Glow effects */
--glow-sm: 0 0 10px rgba(0, 255, 178, 0.06);
--glow-md: 0 0 20px rgba(0, 255, 178, 0.08), 0 0 40px rgba(0, 255, 178, 0.04);
--glow-lg: 0 0 30px rgba(0, 255, 178, 0.10), 0 0 60px rgba(0, 255, 178, 0.05), 0 0 100px rgba(0, 255, 178, 0.02);

/* Glass */
--glass-bg: rgba(11, 15, 14, 0.75);
--glass-blur: 12px;
--glass-border: rgba(255, 255, 255, 0.05);

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 8px 30px rgba(0, 0, 0, 0.5);
```

### 10.3 Tailwind-цвета для `tailwind.config.ts`

```typescript
colors: {
  // Elevation System — green-black tinted
  canvas: "#0B0F0E",
  surface: "#111916",
  elevated: "#1A2420",
  overlay: "#222E2A",
  hover: "#162018",
  active: "#1D2A25",
  
  // Card
  card: {
    DEFAULT: "#0E1A1A",
    hover: "#112220",
  },

  // Accent — single neon green
  accent: {
    primary: "#00FFB2",
    "primary-hover": "#00E6A0",
    "primary-muted": "rgba(0, 255, 178, 0.12)",
    "primary-subtle": "rgba(0, 255, 178, 0.06)",
  },
  // NO secondary accent

  // Text
  "text-primary": "#EAEAEA",
  "text-secondary": "#9AA3A0",
  "text-tertiary": "#5C6A7E",
  "text-disabled": "#3D4654",

  // Borders
  "border-subtle": "rgba(255, 255, 255, 0.05)",
  "border-default": "rgba(255, 255, 255, 0.08)",
  "border-strong": "rgba(255, 255, 255, 0.14)",
  "border-accent": "rgba(0, 255, 178, 0.30)",
  "border-card": "rgba(0, 255, 178, 0.12)",
}
```

### 10.4 Файлы для изменения при рескине

1. **[`tailwind.config.ts`](estate-dash/tailwind.config.ts)** — обновить все цветовые токены
2. **[`globals.css`](estate-dash/src/app/globals.css)** — обновить CSS-переменные, добавить glow/glass утилиты
3. **[`Header.tsx`](estate-dash/src/components/dashboard/Header.tsx)** — стиль навигации, glass-эффект
4. **[`FilterPanel.tsx`](estate-dash/src/components/dashboard/FilterPanel.tsx)** — стиль фильтров
5. **[`PropertyRow.tsx`](estate-dash/src/components/dashboard/PropertyRow.tsx)** — hover glow, зелёные акценты
6. **[`PropertyDetail.tsx`](estate-dash/src/components/dashboard/PropertyDetail.tsx)** — gradient overlay на карточке
7. **[`StatsBar.tsx`](estate-dash/src/components/dashboard/StatsBar.tsx)** — stat-карточки с glow
8. **[`SearchBar.tsx`](estate-dash/src/components/dashboard/SearchBar.tsx)** — subtle border + focus accent

---

## 11. Утилитарные CSS-классы для воспроизведения

```css
/* === MINTLIFY EFFECTS === */

/* Grid pattern background for cards */
.card-grid-pattern {
  background-image:
    linear-gradient(rgba(0, 255, 178, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 178, 0.03) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* Teal radial gradient for card backgrounds */
.card-teal-gradient {
  background: 
    radial-gradient(ellipse at center top, rgba(0, 255, 178, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, #0E1A1A 0%, #0B0F0E 100%);
}

/* Gradient overlay — подсвеченная поверхность */
.gradient-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 255, 178, 0.06) 0%, transparent 70%);
  border-radius: inherit;
  pointer-events: none;
}

/* Soft glow on hover */
.glow-hover {
  transition: box-shadow 200ms ease, transform 200ms ease;
}
.glow-hover:hover {
  box-shadow: 0 0 20px rgba(0, 255, 178, 0.08),
              0 0 40px rgba(0, 255, 178, 0.04);
  transform: translateY(-1px);
}

/* Inner glow */
.inner-glow {
  box-shadow: inset 0 1px 0 rgba(0, 255, 178, 0.06),
              inset 0 0 20px rgba(0, 255, 178, 0.03);
}

/* Glassmorphism light */
.glass {
  background: rgba(11, 15, 14, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Active sidebar item */
.sidebar-active {
  background: rgba(0, 255, 178, 0.10);
  color: #00FFB2;
  border-radius: 8px;
}

/* Active TOC indicator */
.toc-active {
  border-left: 3px solid #00FFB2;
  color: #00FFB2;
  padding-left: 12px;
}

/* Focus ring */
.focus-ring:focus-visible {
  box-shadow: 0 0 0 2px var(--bg-canvas), 0 0 0 4px #00FFB2;
  outline: none;
}
```

---

## 12. Итоговая формула стиля

```
Dark Theme (green-black base)
  + Single Neon Green Accent (#00FFB2)
  + Soft Glow Effects (box-shadow rgba)
  + Gradient Overlays (linear/radial green gradients)
  + Light Glassmorphism (blur + transparency)
  + Grid Mesh Patterns (subtle background lines)
  + Generous Spacing (breathing room)
  + Clean Sans-serif Typography
  + Smooth Transitions (200ms ease)
  = Futuristic, AI-powered, Developer-friendly Aesthetic
```

> **Ключевое отличие от текущего дизайна:** переход от "строгого fintech dashboard" к "умному AI-powered продукту" через замену синего на неоново-зелёный, добавление glow-эффектов и градиентных поверхностей.
