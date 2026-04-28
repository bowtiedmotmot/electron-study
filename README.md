# Electron Explorer

A React + Tailwind app for learning atomic structure — built for kids studying the periodic table.

## What it does

Presents a random element with a charge (neutral, positive, or negative ion) and asks the student to figure out:

- Number of **protons**
- Number of **electrons**
- Number of **neutrons**
- **Mass number**

After submitting, it shows which answers were right, walks through the step-by-step math, and draws an atom diagram with electrons in their shells. A streak counter rewards correct runs.

## The rules it teaches

| Property | Formula |
|---|---|
| Protons | = Atomic number (always) |
| Neutrons | = Mass number − Atomic number |
| Mass number | = Protons + Neutrons |
| Electrons | = Protons − Charge |

A **+charge** means the atom lost electrons (cation). A **−charge** means it gained electrons (anion).

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser, or `http://<your-local-ip>:5173` on a phone or iPad (same Wi-Fi network).

## Stack

- [React 18](https://react.dev)
- [Tailwind CSS 3](https://tailwindcss.com)
- [Vite 6](https://vitejs.dev)

## Project structure

```
src/
  App.jsx       # main UI — question flow, scoring, atom diagram
  elements.js   # element data, charge tables, answer helpers
  index.css     # Tailwind directives
  main.jsx      # React entry point
```

## Adding elements

Edit `ELEMENTS` and `COMMON_CHARGES` in `src/elements.js`. Each element needs:

```js
{ name, symbol, atomicNumber, massNumber, category, color }
```

And a matching entry in `COMMON_CHARGES` with an array of valid charges (always include `0` for neutral).
