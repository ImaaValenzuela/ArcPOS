export function formatAmount(value: string): string {
  if (!value) return "0";
  const [integer, decimal] = value.split(",");
  const formattedInteger = Number(integer || 0).toLocaleString("es-AR");
  return decimal === undefined
    ? formattedInteger
    : `${formattedInteger},${decimal.slice(0, 2)}`;
}
