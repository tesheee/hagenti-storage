interface Room {
  id: string;
  name: string;
  floor?: string;
  deviceCount?: number;
  mapUrl?: string;
  thumbnail?: string;
  updatedAt?: string;
}

interface Organization {
  id: string;
  name: string;
  address?: string;
  rooms: Room[];
}

export const demoOrganizations: Organization[] = [
  {
    id: "1",
    name: "Главный офис",
    address: "ул. Ленина, 15",
    rooms: [
      {
        id: "1-1",
        name: "Серверная",
        floor: "1 этаж",
        deviceCount: 24,
        mapUrl: "/maps/server-room.png",
        thumbnail: "#4F46E5",
        updatedAt: "2 дня назад",
      },
      {
        id: "1-2",
        name: "Отдел IT",
        floor: "2 этаж",
        deviceCount: 15,
        mapUrl: "/maps/it-dept.png",
        thumbnail: "#0EA5E9",
        updatedAt: "5 дней назад",
      },
      {
        id: "1-3",
        name: "Бухгалтерия",
        floor: "2 этаж",
        deviceCount: 8,
        updatedAt: "1 неделю назад",
      },
      {
        id: "1-4",
        name: "Коммутационный узел",
        floor: "Подвал",
        deviceCount: 12,
        updatedAt: "3 дня назад",
      },
    ],
  },
  {
    id: "2",
    name: "Филиал №1",
    address: "пр. Победы, 42",
    rooms: [
      {
        id: "2-1",
        name: "Серверная",
        floor: "1 этаж",
        deviceCount: 18,
        thumbnail: "#8B5CF6",
        mapUrl: "/maps/branch1-server.png",
        updatedAt: "1 день назад",
      },
      {
        id: "2-2",
        name: "Офис",
        floor: "1 этаж",
        deviceCount: 10,
        updatedAt: "4 дня назад",
      },
    ],
  },
  {
    id: "3",
    name: "Филиал №2",
    address: "ул. Гагарина, 8",
    rooms: [
      {
        id: "3-1",
        name: "Серверная",
        floor: "2 этаж",
        deviceCount: 16,
        thumbnail: "#EC4899",
        mapUrl: "/maps/branch2-server.png",
        updatedAt: "6 дней назад",
      },
      {
        id: "3-2",
        name: "Колл-центр",
        floor: "1 этаж",
        deviceCount: 25,
        thumbnail: "#F59E0B",
        mapUrl: "/maps/call-center.png",
        updatedAt: "вчера",
      },
      {
        id: "3-3",
        name: "Склад",
        floor: "1 этаж",
        deviceCount: 5,
        updatedAt: "2 недели назад",
      },
    ],
  },
];
