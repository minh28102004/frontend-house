// Components
export { FlashSaleCard } from "./components/FlashSaleCard";
export { FlashSaleList } from "./components/FlashSaleList";
export { FlashSaleProductCard } from "./components/FlashSaleProductCard";
export { FlashSaleDetail } from "./components/FlashSaleDetail";
export { FlashSaleSection } from "./components/FlashSaleSection";
export { CountdownTimer } from "./components/CountdownTimer";

// Hooks
export { useFlashSales } from "./hooks/useFlashSale";
export { useActiveFlashSales } from "./hooks/useFlashSale";
export { useFlashSaleBySlug } from "./hooks/useFlashSale";

// Services
export { ClientFlashSaleService } from "./services/flash-sale.service";

// Models
export type { FlashSale, ProductBasic, FlashSaleListResponse } from "./models/flash-sale.model";

// Main Component
export { default as FlashSalePage } from "./FlashSale";

