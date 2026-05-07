# RPG Game

В проекте реализована RPG-игра с персонажами, оружием, боевой логикой, Webpack-сборкой и Jest-тестами.

## Что реализовано

### Основная логика

Реализован базовый класс `Weapon` со свойствами:

- `name`
- `attack`
- `durability`
- `initDurability`
- `range`

Реализованы методы оружия:

- `takeDamage()`
- `getDamage()`
- `isBroken()`

Реализованы классы оружия:

- `Arm`
- `Bow`
- `Sword`
- `Knife`
- `Staff`

Реализованы улучшенные классы оружия:

- `LongBow`
- `Axe`
- `StormStaff`

Реализован базовый класс `Player` со свойствами:

- `life`
- `magic`
- `speed`
- `attack`
- `agility`
- `luck`
- `description`
- `weapon`
- `position`
- `name`

Реализованы основные персонажи:

- `Warrior`
- `Archer`
- `Mage`

Реализованы улучшенные персонажи:

- `Dwarf`
- `Crossbowman`
- `Demiurge`

### Боевая система

Реализованы методы:

- `getLuck()`
- `getDamage()`
- `takeDamage()`
- `isDead()`
- `moveLeft()`
- `moveRight()`
- `move()`
- `isAttackBlocked()`
- `dodged()`
- `takeAttack()`
- `checkWeapon()`
- `tryAttack()`
- `chooseEnemy()`
- `moveToEnemy()`
- `turn()`

Функция `play(players)` запускает бой между персонажами и возвращает победителя.

### Webpack

Настроена сборка проекта через Webpack:

- entry point: `src/index.js`
- HTML-шаблон: `src/index.html`
- стили подключаются через `css-loader` и `MiniCssExtractPlugin`
- итоговая сборка попадает в папку `dist`

### Jest

Добавлены тесты для:

- классов оружия;
- классов персонажей;
- игровой функции `play()`.

### Ветка `visual`

В ветке `visual` дополнительно реализована визуализация боя на странице:

- карточки характеристик персонажей;
- лог событий боя.

## Установка проекта

Клонировать репозиторий:

```bash
git clone https://github.com/ExtroZ-ui/rpg-game.git
```

Перейти в папку проекта:

```bash
cd rpg-game
```

Установить зависимости:

```bash
npm install
```

## Запуск основной версии

Перейти на ветку `main`:

```bash
git checkout main
```

Установить зависимости, если они ещё не установлены:

```bash
npm install
```

Собрать проект:

```bash
npm run build
```

Запустить локальный сервер:

```bash
npm run start
```

Открыть в браузере:

```text
http://127.0.0.1:8080
```

## Запуск визуальной версии

Перейти на ветку `visual`:

```bash
git checkout visual
```

Установить зависимости, если они ещё не установлены:

```bash
npm install
```

Собрать проект:

```bash
npm run build
```

Запустить локальный сервер:

```bash
npm run start
```

Открыть в браузере:

```text
http://127.0.0.1:8080
```

На странице будет доступна визуализация сражения.

## Проверка кода

Запуск ESLint:

```bash
npm run lint
```

Автоисправление ошибок оформления:

```bash
npm run lint:fix
```

## Запуск тестов

Запустить тесты:

```bash
npm run test
```

Запустить тесты с отчётом покрытия:

```bash
npm run test:coverage
```
