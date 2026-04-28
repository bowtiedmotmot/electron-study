export const ELEMENTS = [
  { name: "Hydrogen",   symbol: "H",  atomicNumber: 1,  massNumber: 1,  category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Helium",     symbol: "He", atomicNumber: 2,  massNumber: 4,  category: "noble gas",      color: "bg-purple-400" },
  { name: "Lithium",    symbol: "Li", atomicNumber: 3,  massNumber: 7,  category: "alkali metal",   color: "bg-red-400"    },
  { name: "Beryllium",  symbol: "Be", atomicNumber: 4,  massNumber: 9,  category: "alkaline earth", color: "bg-orange-400" },
  { name: "Boron",      symbol: "B",  atomicNumber: 5,  massNumber: 11, category: "metalloid",      color: "bg-green-600"  },
  { name: "Carbon",     symbol: "C",  atomicNumber: 6,  massNumber: 12, category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Nitrogen",   symbol: "N",  atomicNumber: 7,  massNumber: 14, category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Oxygen",     symbol: "O",  atomicNumber: 8,  massNumber: 16, category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Fluorine",   symbol: "F",  atomicNumber: 9,  massNumber: 19, category: "halogen",        color: "bg-teal-400"   },
  { name: "Neon",       symbol: "Ne", atomicNumber: 10, massNumber: 20, category: "noble gas",      color: "bg-purple-400" },
  { name: "Sodium",     symbol: "Na", atomicNumber: 11, massNumber: 23, category: "alkali metal",   color: "bg-red-400"    },
  { name: "Magnesium",  symbol: "Mg", atomicNumber: 12, massNumber: 24, category: "alkaline earth", color: "bg-orange-400" },
  { name: "Aluminum",   symbol: "Al", atomicNumber: 13, massNumber: 27, category: "post-transition",color: "bg-blue-400"   },
  { name: "Silicon",    symbol: "Si", atomicNumber: 14, massNumber: 28, category: "metalloid",      color: "bg-green-600"  },
  { name: "Phosphorus", symbol: "P",  atomicNumber: 15, massNumber: 31, category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Sulfur",     symbol: "S",  atomicNumber: 16, massNumber: 32, category: "nonmetal",       color: "bg-yellow-400" },
  { name: "Chlorine",   symbol: "Cl", atomicNumber: 17, massNumber: 35, category: "halogen",        color: "bg-teal-400"   },
  { name: "Argon",      symbol: "Ar", atomicNumber: 18, massNumber: 40, category: "noble gas",      color: "bg-purple-400" },
  { name: "Potassium",  symbol: "K",  atomicNumber: 19, massNumber: 39, category: "alkali metal",   color: "bg-red-400"    },
  { name: "Calcium",    symbol: "Ca", atomicNumber: 20, massNumber: 40, category: "alkaline earth", color: "bg-orange-400" },
  { name: "Iron",       symbol: "Fe", atomicNumber: 26, massNumber: 56, category: "transition",     color: "bg-blue-500"   },
  { name: "Copper",     symbol: "Cu", atomicNumber: 29, massNumber: 64, category: "transition",     color: "bg-blue-500"   },
  { name: "Zinc",       symbol: "Zn", atomicNumber: 30, massNumber: 65, category: "transition",     color: "bg-blue-500"   },
  { name: "Silver",     symbol: "Ag", atomicNumber: 47, massNumber: 108,category: "transition",     color: "bg-blue-500"   },
  { name: "Gold",       symbol: "Au", atomicNumber: 79, massNumber: 197,category: "transition",     color: "bg-blue-500"   },
  { name: "Lead",       symbol: "Pb", atomicNumber: 82, massNumber: 207,category: "post-transition",color: "bg-blue-400"   },
];

export const COMMON_CHARGES = {
  "H":  [0, 1, -1],
  "He": [0],
  "Li": [0, 1],
  "Be": [0, 2],
  "B":  [0, 3],
  "C":  [0, 4, -4],
  "N":  [0, 3, -3],
  "O":  [0, 2, -2],
  "F":  [0, -1],
  "Ne": [0],
  "Na": [0, 1],
  "Mg": [0, 2],
  "Al": [0, 3],
  "Si": [0, 4, -4],
  "P":  [0, 3, 5, -3],
  "S":  [0, 2, 4, 6, -2],
  "Cl": [0, 1, -1],
  "Ar": [0],
  "K":  [0, 1],
  "Ca": [0, 2],
  "Fe": [0, 2, 3],
  "Cu": [0, 1, 2],
  "Zn": [0, 2],
  "Ag": [0, 1],
  "Au": [0, 1, 3],
  "Pb": [0, 2, 4],
};

export function formatCharge(charge) {
  if (charge === 0) return "neutral (0)";
  if (charge === 1) return "+1";
  if (charge === -1) return "−1";
  if (charge > 0) return `+${charge}`;
  return `−${Math.abs(charge)}`;
}

export function getCorrectAnswers(element, charge) {
  const protons = element.atomicNumber;
  const electrons = protons - charge;
  const neutrons = element.massNumber - protons;
  const massNumber = element.massNumber;
  return { protons, electrons, neutrons, massNumber };
}

export function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function newQuestion(excludeElement = null, excludeCharge = null) {
  let element, charge;
  let attempts = 0;
  do {
    element = randomPick(ELEMENTS);
    const charges = COMMON_CHARGES[element.symbol];
    charge = randomPick(charges);
    attempts++;
  } while (
    attempts < 20 &&
    element.symbol === excludeElement?.symbol &&
    charge === excludeCharge
  );
  return { element, charge };
}
