import { Currency } from "../types";

export const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ",",
  "0",
  "⌫",
];

export const STORE_CATEGORIES = [
  "Gastronomía",
  "Tienda",
  "Servicios",
  "Otro",
];

export const ONBOARDING_STEPS = ["Tu comercio", "Preferencia", "Resumen"];

export const PREFERENCE_OPTIONS: Array<{
  value: Currency;
  title: string;
  detail: string;
  mark: string;
}> = [
  {
    value: "ARS",
    title: "Recibir en pesos",
    detail: "Lo que cobres llega como pesos argentinos.",
    mark: "$",
  },
  {
    value: "USDC",
    title: "Recibir en dólares digitales",
    detail: "Protegé tus cobros de la inflación.",
    mark: "U",
  },
];
