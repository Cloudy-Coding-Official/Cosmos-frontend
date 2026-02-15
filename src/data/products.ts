/** Imágenes de Unsplash (gratuitas, uso en demos). */

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=600&fit=crop`;

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
  reviews?: number;
  description?: string;
  highlights?: string[];
  specs?: { label: string; value: string }[];
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Auriculares inalámbricos",
    price: 49.99,
    image: IMG("1505740420928-5e560c06d30e"),
    seller: "TechStore",
    rating: 4.8,
    reviews: 124,
    description:
      "Sonido premium, batería hasta 30h. Compatible con Bluetooth 5.2. Incluye estuche y cable USB-C.",
    highlights: [
      "Cancelación de ruido activa",
      "Batería 30 horas",
      "Bluetooth 5.2",
      "Estuche incluido",
    ],
    specs: [
      { label: "Conectividad", value: "Bluetooth 5.2" },
      { label: "Batería", value: "Hasta 30 h" },
      { label: "Driver", value: "40 mm" },
      { label: "Impedancia", value: "32 Ω" },
      { label: "Rango de frecuencia", value: "20 Hz - 20 kHz" },
      { label: "Peso", value: "250 g" },
      { label: "Incluye", value: "Estuche, cable USB-C" },
    ],
  },
  {
    id: "2",
    name: "Mochila urbana",
    price: 35.5,
    image: IMG("1553062407-98eeb64c6a62"),
    seller: "ModaLatam",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Cargador rápido 65W",
    price: 22.0,
    image: IMG("1727885796960-70a0adfe40ef"),
    seller: "ElectroPlus",
    rating: 4.9,
  },
  {
    id: "4",
    name: "Zapatillas running",
    price: 89.99,
    image: IMG("1542291026-7eec264c27ff"),
    seller: "DeportesYA",
    rating: 4.7,
  },
  {
    id: "5",
    name: "Café en grano 1kg",
    price: 12.5,
    image: IMG("1447933601403-0c6688de566e"),
    seller: "CaféRegional",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Lámpara LED escritorio",
    price: 28.0,
    image: IMG("1507473885765-e6ed057f782c"),
    seller: "HogarCosmos",
    rating: 4.4,
  },
  {
    id: "7",
    name: "Pack 3 camisetas básicas",
    price: 24.99,
    image: IMG("1521572163474-6864f9cf17ab"),
    seller: "ModaLatam",
    rating: 4.6,
  },
  {
    id: "8",
    name: "Reloj inteligente",
    price: 75.0,
    image: IMG("1523275335684-37898b6baf30"),
    seller: "TechStore",
    rating: 4.8,
  },
];

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}
