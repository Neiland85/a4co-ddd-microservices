import React from 'react';
interface SearchBarProps {
    onSearch: (term: string) => void;
    placeholder?: string;
    loading?: boolean;
}
declare const SearchBar: React.FC<SearchBarProps>;
interface QuickFiltersProps {
    onCategorySelect: (category: string) => void;
    selectedCategory?: string;
}
declare const QuickFilters: React.FC<QuickFiltersProps>;
interface SearchResultsProps {
    searchTerm: string;
    onClearSearch: () => void;
}
declare const SearchResults: React.FC<SearchResultsProps>;
interface ProductSearchProps {
    title?: string;
    showQuickFilters?: boolean;
    maxResults?: number;
}
declare const ProductSearch: React.FC<ProductSearchProps>;
export default ProductSearch;
export { SearchBar, QuickFilters, SearchResults };
//# sourceMappingURL=ProductSearch.d.ts.map