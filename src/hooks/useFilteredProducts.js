// src/hooks/useFilteredProducts.js
import { useMemo } from "react";

export default function useFilteredProducts({
  products,
  query = "",
  category = "",
  price = "",
  distanceFilter = "",
  sort = ""
}) {
  return useMemo(() => {
    let result = products;

    // 1) Arama
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
      );
    }

    // 2) Kategori
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // 3) Fiyat
    if (price) {
      if (price === "0-100 TL") result = result.filter(p => p.price <= 100);
      else if (price === "100-300 TL")
        result = result.filter(p => p.price > 100 && p.price <= 300);
      else if (price === "300+ TL") result = result.filter(p => p.price > 300);
    }

    // 4) Mesafe
    if (distanceFilter) {
      const d = parseInt(distanceFilter, 10) * 1000;
      result = result.filter(p => p.distance <= d);
    }

    // 5) Sıralama
    if (sort) {
      if (sort === "En Yakın") result = [...result].sort((a, b) => a.distance - b.distance);
      else if (sort === "En Ucuz") result = [...result].sort((a, b) => a.price - b.price);
      else if (sort === "En Pahalı") result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, query, category, price, distanceFilter, sort]);
}
