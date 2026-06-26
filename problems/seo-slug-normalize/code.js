export function normalizeSeoSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`'"“”‘’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 5)
    .join("-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
