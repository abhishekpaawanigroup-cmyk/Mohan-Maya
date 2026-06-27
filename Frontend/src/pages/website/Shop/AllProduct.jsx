import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiSliders, FiInbox, FiX } from "react-icons/fi";
import ProductFilters from "./Filter";
import ProductModal from "./ProductModal";
import ProductCard from "../../../components/common/ProductCard";
import AnimatedSearchInput from "../../../components/common/AnimatedSearchInput";
import { ProductGridSkeleton } from "../../../components/common/Skeleton";
import { products, categories, characters } from "../../../data/products";
import { useDebounce } from "../../../hooks/useHooks";

const PAGE_SIZE = 6;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 300);

  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedCharacter, setSelectedCharacter] = useState("All Characters");
  const [price, setPrice] = useState("all");
  const [sort, setSort] = useState("featured");
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const productsTopRef = useRef(null);
  const gridWrapRef = useRef(null);
  // Height the grid is locked to during a page transition so the column never
  // collapses (and the page never jumps) while the old grid swaps for the new.
  const [lockedHeight, setLockedHeight] = useState(null);

  // Show skeletons while the debounced search is catching up with typing.
  const loading = search !== debouncedSearch;

  // Keep the URL in sync with the search box (shareable links).
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch) next.set("search", debouncedSearch);
    else next.delete("search");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Adopt a search term arriving from the header while already on this page.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch((prev) => (prev !== urlSearch ? urlSearch : prev));
  }, [searchParams]);

  // Filter changes always send the user back to the first page.
  const changeCategory = (c) => { setSelectedCategory(c); setPage(1); };
  const changeCharacter = (c) => { setSelectedCharacter(c); setPage(1); };
  const changePrice = (p) => { setPrice(p); setPage(1); };
  const changeSort = (s) => { setSort(s); setPage(1); };
  const changeSearch = (v) => { setSearch(v); setPage(1); };

  const filtered = useMemo(() => {
    let list = [...products];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All Products") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedCharacter !== "All Characters") {
      list = list.filter((p) => p.character === selectedCharacter);
    }

    if (price !== "all") {
      const [min, max] = price.split("-").map(Number);
      list = list.filter((p) => p.price >= min && p.price <= max);
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return list;
  }, [debouncedSearch, selectedCategory, selectedCharacter, price, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Pagination handler: lock the current grid height (prevents collapse/jump
  // mid-transition), change the page, then smoothly scroll the product section
  // — not the whole window — back to the top.
  const goToPage = (next) => {
    const target = Math.min(Math.max(1, next), totalPages);
    if (target === safePage) return;
    if (gridWrapRef.current) setLockedHeight(gridWrapRef.current.offsetHeight);
    setPage(target);
    productsTopRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const resetFilters = () => {
    setSelectedCategory("All Products");
    setSelectedCharacter("All Characters");
    setPrice("all");
    setSort("featured");
    setSearch("");
    setPage(1);
  };

  const filtersProps = {
    categories,
    selectedCategory,
    onCategoryChange: changeCategory,
    characters,
    selectedCharacter,
    onCharacterChange: changeCharacter,
    price,
    onPriceChange: changePrice,
    sort,
    onSortChange: changeSort,
    onReset: resetFilters,
  };




  return (
    <section id="products" className="py-20 bg-gray-50 dark:bg-[#0d0508] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <AnimatedSearchInput
            value={search}
            onChange={changeSearch}
            onClear={() => changeSearch("")}
          />
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden btn-outline justify-center "
          >
            <FiSliders size={18} /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop filters */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <ProductFilters {...filtersProps} />
          </div>

          {/* Products */}
          <div className="flex-1">
            <div
              ref={productsTopRef}
              className="flex items-center justify-between mb-6 scroll-mt-24"
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {loading ? (
              <ProductGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <FiInbox size={56} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold dark:text-white">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button onClick={resetFilters} className="btn-primary mt-6">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* The wrapper holds a locked min-height during transitions so the
                    column never collapses while the grid fades/slides between pages. */}
                <div
                  ref={gridWrapRef}
                  style={lockedHeight ? { minHeight: lockedHeight } : undefined}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={safePage}
                      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        y: prefersReducedMotion ? 0 : -8,
                        transition: { duration: prefersReducedMotion ? 0 : 0.12, ease: "easeIn" },
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.28,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      onAnimationComplete={(definition) => {
                        // Release the height lock once the new grid has settled.
                        if (definition?.opacity === 1) setLockedHeight(null);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                    >
                      {paginated.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => goToPage(safePage - 1)}
                      disabled={safePage === 1}
                      aria-label="Previous page"
                      className="h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 dark:text-white disabled:opacity-40 hover:border-[#fe4462] hover:text-[#fe4462] transition"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={`page-${i + 1}`}
                        onClick={() => goToPage(i + 1)}
                        aria-label={`Go to page ${i + 1}`}
                        aria-current={safePage === i + 1 ? "page" : undefined}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          safePage === i + 1
                            ? "bg-[#fe4462] text-white"
                            : "border border-gray-300 dark:border-white/10 dark:text-white hover:border-[#fe4462] hover:text-[#fe4462]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => goToPage(safePage + 1)}
                      disabled={safePage === totalPages}
                      aria-label="Next page"
                      className="h-10 px-3 rounded-lg border border-gray-300 dark:border-white/10 dark:text-white disabled:opacity-40 hover:border-[#fe4462] hover:text-[#fe4462] transition"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filters drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[998] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 h-screen w-[320px] max-w-[85vw] bg-gray-50 dark:bg-[#0d0508] z-[999] overflow-y-auto p-4 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold dark:text-white">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <FiX size={22} className="dark:text-white" />
                </button>
              </div>
              <ProductFilters {...filtersProps} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickViewProduct && (
          <ProductModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Products;
