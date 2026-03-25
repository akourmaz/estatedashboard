# EstateDash — Дизайн-спецификация

**Дата:** 2026-03-20
**Статус:** Одобрено пользователем
**Тип:** Новый проект — одностраничный дашборд для агентов по недвижимости

---

## 1. Обзор

EstateDash — внутренний веб-инструмент для агентов по недвижимости в Грузии. Позволяет быстро находить, фильтровать и просматривать объекты недвижимости из сводной Excel-таблицы. Одна страница, все данные, удобный поиск.

### Целевая аудитория

Агенты по недвижимости, работающие с объектами застройщиков в Грузии (Батуми, Тбилиси, Гонио, Кобулети и др.).

### Ключевая задача

Заменить неудобную Excel-таблицу красивым, быстрым дашбордом с мгновенным поиском и фильтрацией по ~50 объектам от ~30 застройщиков.

---

## 2. Технический стек

| Технология | Назначение |
|---|---|
| Next.js 14 (App Router) | Фреймворк |
| TypeScript | Типизация |
| Tailwind CSS | Стилизация |
| shadcn/ui | UI-компоненты |
| xlsx (SheetJS) | Парсинг Excel |
| Zustand | Управление состоянием |
| lucide-react | Иконки |
| localStorage | Персистентность данных |

**Бэкенд:** отсутствует. Чисто фронтенд-приложение.

---

## 3. Архитектура

### Структура проекта

```
estate-dash/
├── app/
│   ├── layout.tsx              # Корневой layout с тёмной темой
│   └── page.tsx                # Единственная страница — дашборд
├── components/
│   ├── ui/                     # shadcn/ui компоненты
│   ├── dashboard/
│   │   ├── Header.tsx          # Шапка: логотип, кнопка импорта Excel
│   │   ├── SearchBar.tsx       # Глобальный поиск по всем полям
│   │   ├── FilterPanel.tsx     # Панель фильтров
│   │   ├── PropertyTable.tsx   # Основная таблица объектов
│   │   ├── PropertyRow.tsx     # Строка таблицы (раскрывающаяся)
│   │   ├── PropertyDetail.tsx  # Развёрнутая карточка объекта
│   │   └── StatsBar.tsx        # Мини-статистика сверху
│   └── shared/
│       └── ExcelImporter.tsx   # Компонент импорта Excel
├── lib/
│   ├── excel-parser.ts         # Парсинг XLSX → типизированные данные
│   ├── types.ts                # TypeScript интерфейсы
│   ├── filters.ts              # Логика фильтрации
│   └── utils.ts                # Утилиты
├── stores/
│   └── dashboard-store.ts      # Zustand: данные, фильтры, поиск
├── start-data/
│   └── table.xlsx              # Исходные данные
└── public/
```

---

## 4. Модель данных

### Интерфейс Property

```typescript
interface Property {
  id: string;                    // генерируется при импорте
  developer: string;             // Застройщик: "ALLIANCE", "AMBASSADORI"...
  project: string;               // Объект: "Centropolis", "Highline"...
  paymentTerms: string;          // Условия ПВ и рассрочки
  commissionTerms: string;       // Условия выплаты комиссии агентам
  links: {
    website?: string;            // Официальный сайт
    whatsapp?: string;           // WhatsApp
    googleDisk?: string;         // Google Disk
    map?: string;                // Карта (Яндекс/Гугл)
    priceList?: string;          // Ссылка на прайс
  };
  finishing: string;             // Отделка: BF, WF, GF, Turnkey
  propertyType: string;          // Тип: Апартаменты, Жилой, Вилла, Таунхаус
  area: string;                  // Площадь: "29-71", "32-42"...
  deliveryQuarter: string;       // Месяц/квартал сдачи
  deliveryYear: string;          // Год сдачи: "2029", "Сдан"...
  renovationPrice?: string;      // Стоимость ремонта за м²
  renovationCommission?: string; // Как платят комиссию за ремонт
  guaranteedYield?: string;      // Гарантированная доходность
  location: string;              // Локация: Батуми, Тбилиси, Гонио...
  minPricePerSqm: string;       // Мин. цена за м²: "3004$", "5750$"...
  floors: string;                // Этажность: "48, 55"...
  mortgage: string;              // Ипотека: Да/Нет
  trainingLink?: string;         // Ссылка на обучение
  comments?: string;             // Комментарии и пожелания
  primaryContact: string;        // Основной контакт застройщика
  commissionNet: string;         // Комиссия агента чистыми: "4.0%"
  commissionWithVAT: string;     // Комиссия агента с НДС: "4.7%"
}
```

### Маппинг колонок Excel

Парсер маппит колонки по позиции (фиксированная структура таблицы):

| Колонка | Поле |
|---|---|
| A | developer |
| B | project |
| C | paymentTerms |
| D | commissionTerms |
| E | links.website |
| F | links.whatsapp |
| G | links.googleDisk |
| H | links.map |
| I | links.priceList |
| J | finishing |
| K | propertyType |
| L | area |
| M | deliveryQuarter |
| N | deliveryYear |
| O | renovationPrice |
| P | renovationCommission |
| Q | guaranteedYield |
| R | location |
| S | minPricePerSqm |
| T | floors |
| U | mortgage |
| V | trainingLink |
| W | comments |
| X | primaryContact |
| Y | commissionNet |
| Z | commissionWithVAT |

---

## 5. UI/UX дизайн

### Визуальный стиль

- **Тёмная тема** — фон `#0A0A0F`, карточки `#12121A`, акцент `#3B82F6`
- **Шрифт** — Inter (системный)
- **Скруглённые карточки**, тонкие border `1px solid rgba(255,255,255,0.06)`
- **Финтех-стиль** — много пространства, чёткая типографика, минимализм

### Лейаут страницы (сверху вниз)

1. **Header** — логотип EstateDash, кнопка "Загрузить Excel", счётчик объектов
2. **StatsBar** — мини-карточки: всего объектов, кол-во локаций, кол-во застройщиков, мин. цена за м²
3. **SearchBar** — полнотекстовый поиск по всем полям (debounce 300ms)
4. **FilterPanel** — компактные dropdown-фильтры:
   - Локация (мульти-селект)
   - Застройщик (мульти-селект)
   - Тип (мульти-селект)
   - Отделка (мульти-селект: BF, WF, GF, Turnkey)
   - Год сдачи (мульти-селект)
   - Ипотека (Да/Нет)
   - Диапазон цены за м²
   - Диапазон комиссии
   - Кнопка "Сбросить всё"
5. **PropertyTable** — интерактивная таблица:
   - Столбцы: Застройщик, Проект, Локация, Тип, Площадь, Сдача, Отделка, Цена/м², Комиссия
   - Сортировка по клику на заголовок
   - Раскрывающиеся строки с полной карточкой

### Раскрывающаяся карточка объекта (PropertyDetail)

При клике по строке показывает ВСЕ данные:
- Условия первоначального взноса и рассрочки
- Условия выплаты комиссии агентам
- Комиссия чистыми и с НДС
- Стоимость ремонта за м²
- Как платят комиссию за ремонт
- Гарантированная доходность
- Этажность
- Ипотека
- Основной контакт (кликабельный номер телефона)
- Кликабельные ссылки с иконками: Сайт, WhatsApp, Google Disk, Карта, Прайс
- Обучение по объекту
- Комментарии и пожелания

---

## 6. Поток данных

```
Excel файл (.xlsx)
       ↓
  ExcelImporter (drag-drop / file picker)
       ↓
  excel-parser.ts (SheetJS)
   - Читает лист "РУС"
   - Маппит колонки по позиции
   - Пропускает строки-заголовки (строки 1-3)
   - Валидирует обязательные поля (developer, project)
   - Генерирует id для каждого объекта
       ↓
  Zustand store (dashboard-store.ts)
   - properties[] — массив Property
   - searchQuery — текст поиска
   - filters — активные фильтры
   - sortBy / sortOrder — сортировка
   - Автосохранение в localStorage
       ↓
  React компоненты
   - FilterPanel читает уникальные значения из properties
   - SearchBar фильтрует по searchQuery
   - PropertyTable отображает отфильтрованный/отсортированный список
```

---

## 7. Управление состоянием (Zustand)

```typescript
interface DashboardStore {
  // Данные
  properties: Property[];
  setProperties: (properties: Property[]) => void;

  // Поиск
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Фильтры
  filters: {
    locations: string[];
    developers: string[];
    propertyTypes: string[];
    finishings: string[];
    deliveryYears: string[];
    mortgage: string | null;
    priceRange: { min: number | null; max: number | null };
    commissionRange: { min: number | null; max: number | null };
  };
  setFilter: (key: string, value: any) => void;
  resetFilters: () => void;

  // Сортировка
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setSort: (column: string) => void;

  // Вычисляемые
  filteredProperties: () => Property[];
}
```

---

## 8. Обработка ошибок

| Ситуация | Реакция |
|---|---|
| Загружен не Excel-файл | Toast: "Файл не является Excel-таблицей" |
| Пустая таблица | Toast: "В таблице не найдены данные об объектах" |
| Отсутствующие поля | Заполнить пустыми строками, не блокировать импорт |
| Повторный импорт | Confirm dialog: "Заменить текущие данные?" |
| Нет данных в localStorage | Показать пустое состояние с кнопкой "Загрузить Excel" |

---

## 9. Зависимости

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "xlsx": "^0.18",
    "zustand": "^4",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3",
    "@types/react": "^18",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
```

shadcn/ui компоненты (устанавливаются через CLI):
- Table, Input, Button, DropdownMenu, Badge, Dialog, Toast, Popover, Command

---

## 10. Критерии успеха MVP

1. Агент загружает Excel → видит все ~50 объектов в красивой таблице
2. Мгновенный поиск находит объект по любому тексту за < 100ms
3. Фильтры сужают список по локации, застройщику, типу, отделке, году, ипотеке, цене, комиссии
4. Клик по строке раскрывает ВСЮ информацию (условия, ссылки, контакты)
5. Все ссылки кликабельны (WhatsApp, сайт, карта, диск, прайс)
6. Данные сохраняются между сессиями (localStorage)
7. Тёмная финтех-тема, адаптивная вёрстка

---

## 11. Вне скоупа MVP

- Отдельные страницы (калькулятор, сравнение, детальная карточка)
- Бэкенд / база данных
- Авторизация / личные кабинеты
- Листы "Инвестиции" и "Акции" из Excel
- Карта объектов
- PDF-генерация
- Уведомления
