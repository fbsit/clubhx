export const vendorGoals = [
  {
    id: "G001",
    vendorId: "V001",
    type: "by_category" as const,
    categoryGoals: [
      { category: "Color", amount: 5000000 },      // Meta mensual: 5M
      { category: "Cuidado", amount: 3500000 },     // Meta mensual: 3.5M
      { category: "Styling", amount: 1500000 },     // Meta mensual: 1.5M
      { category: "Técnico", amount: 800000 }       // Meta mensual: 800K
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    notes: "Meta anual 2024 por categorías - Enfoque en diversificación",
    status: "active" as const,
    createdAt: new Date("2023-12-15")
  },
  {
    id: "G002",
    vendorId: "V001",
    type: "general" as const,
    amount: 25000000,
    startDate: new Date("2023-01-01"),
    endDate: new Date("2023-12-31"),
    notes: "Meta anual 2023",
    status: "completed" as const,
    achievement: 115,
    createdAt: new Date("2022-12-20")
  },
  {
    id: "G003",
    vendorId: "V002",
    type: "by_category" as const,
    categoryGoals: [
      { category: "Color", amount: 12000000 },
      { category: "Cuidado", amount: 8000000 },
      { category: "Styling", amount: 3000000 },
      { category: "Técnico", amount: 2000000 },
      { category: "Texturización", amount: 3000000 },
      { category: "Accesorios", amount: 2000000 }
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    notes: "Meta anual 2024 por categorías - Región Valparaíso",
    status: "active" as const,
    createdAt: new Date("2023-12-15")
  },
  {
    id: "G004",
    vendorId: "V003",
    type: "general" as const,
    amount: 27000000,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    notes: "Meta anual 2024 - Foco en productos premium",
    status: "active" as const,
    achievement: 83,
    createdAt: new Date("2023-12-15")
  },
  {
    id: "G005",
    vendorId: "V004",
    type: "by_category" as const,
    categoryGoals: [
      { category: "Color", amount: 15000000 },
      { category: "Cuidado", amount: 10000000 },
      { category: "Styling", amount: 4000000 },
      { category: "Técnico", amount: 3000000 }
    ],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    notes: "Meta anual 2024 por categorías - Vendedor estrella",
    status: "active" as const,
    createdAt: new Date("2023-12-15")
  },
  {
    id: "G006",
    vendorId: "V005",
    type: "general" as const,
    amount: 20000000,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    notes: "Meta anual 2024 - Región Norte",
    status: "active" as const,
    achievement: 76,
    createdAt: new Date("2023-12-15")
  }
];

export const getVendorGoals = (vendorId: string) => {
  return vendorGoals.filter(goal => goal.vendorId === vendorId);
};