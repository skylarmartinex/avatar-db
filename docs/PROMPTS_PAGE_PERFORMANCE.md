# Prompts Page Performance Fixes

## Issues Identified and Fixed

### 1. **Render Loop Prevention**
**Problem**: Functions like `getUniqueValues()` were being called on every render (lines 103-109 in old code), causing expensive recalculations.

**Fix**: 
- Wrapped all derived data in `useMemo` hooks
- Only recalculates when dependencies (`allPrompts`, `registry`) change
- Prevents infinite render loops

### 2. **Stable Function References**
**Problem**: Functions like `getLabel()` and `buildPromptTitle()` were recreated on every render, causing child components to re-render unnecessarily.

**Fix**:
- Wrapped all callback functions in `useCallback`
- Provides stable function references across renders
- Prevents unnecessary child re-renders

### 3. **Component Memoization**
**Problem**: Every filter column and prompt card was re-rendering on any state change.

**Fix**:
- Created `FilterColumn` component wrapped in `React.memo`
- Created `PromptCard` component wrapped in `React.memo`
- Components only re-render when their props actually change

### 4. **Efficient Data Loading**
**Problem**: No cleanup on unmount, potential memory leaks.

**Fix**:
- Added `mounted` flag to prevent state updates after unmount
- Proper cleanup in `useEffect` return function
- Safe error handling with fallback empty states

### 5. **Stable Keys**
**Problem**: None found, but ensured using `prompt.filename` as key (stable, unique).

**Fix**:
- Confirmed stable key usage: `key={prompt.filename}`
- Never using array index as key

### 6. **No Heavy Components in List**
**Problem**: None found - no Monaco editor or JSON viewers in list.

**Fix**:
- Confirmed list only shows metadata (title, canonical ID)
- JSON viewer only on detail page

### 7. **Filtering Performance**
**Problem**: Filtering was done in `useEffect` with `setState`, causing extra renders.

**Fix**:
- Moved filtering to `useMemo`
- Filtering happens during render, no extra state updates
- Single render per selection change

## Performance Improvements

### Before:
```typescript
// Called on EVERY render
const etValues = getUniqueValues('ET');
const faValues = getUniqueValues('FA').filter(...);
// ... 5 more calls

// Filter in useEffect (extra render)
useEffect(() => {
    const filtered = allPrompts.filter(...);
    setFilteredPrompts(filtered); // Causes re-render
}, [selection, allPrompts]);
```

### After:
```typescript
// Calculated ONCE when allPrompts/registry changes
const uniqueValues = useMemo(() => {
    // Single pass through all prompts
    // Extract all dimension values at once
    return { ET: [...], FA: [...], ... };
}, [allPrompts, registry]);

// Filtered DURING render (no extra render)
const filteredPrompts = useMemo(() => {
    return allPrompts.filter(...);
}, [allPrompts, selection]);
```

## Offline Compatibility

✅ **Fully Offline**: No external dependencies
✅ **Read-Only**: Only browses existing prompts
✅ **No File Writes**: Never generates or saves prompts
✅ **Local Filesystem**: Reads from `/api/prompts` which reads local files
✅ **Safe Timestamps**: Falls back gracefully if timestamps missing

## Browser Stability

✅ **No Infinite Loops**: All `useEffect` dependencies are stable
✅ **No Memory Leaks**: Proper cleanup on unmount
✅ **Efficient Rendering**: Memoization prevents unnecessary re-renders
✅ **Stable Keys**: Using `filename` (unique, stable)
✅ **Safe Error Handling**: Graceful fallbacks for missing data

## Testing Checklist

- [ ] Page loads without crashing
- [ ] Filtering works smoothly (no lag)
- [ ] Clicking filters updates list instantly
- [ ] No console errors
- [ ] Browser memory usage stays stable
- [ ] Works with 0 prompts (empty state)
- [ ] Works with 200+ prompts (if applicable)
- [ ] Clicking prompt navigates to detail page
- [ ] Back button works correctly

## Future Optimizations (if needed)

If you have 200+ prompts:

1. **Virtualization**: Use `react-window` or `react-virtualized`
   ```typescript
   import { FixedSizeList } from 'react-window';
   ```

2. **Pagination**: Show 50 prompts per page

3. **Search Debouncing**: If adding text search
   ```typescript
   const debouncedSearch = useMemo(
       () => debounce((value) => setSearch(value), 300),
       []
   );
   ```

## Code Structure

```
PromptsPage (main component)
├── useMemo: uniqueValues (extract all dimension values)
├── useMemo: filteredPrompts (filter based on selection)
├── useCallback: getLabel (stable label getter)
├── useCallback: buildPromptTitle (stable title builder)
├── useCallback: handleSelectionChange (stable selection handler)
│
├── FilterColumn (memoized component × 7)
│   └── Renders dimension filter buttons
│
└── PromptCard (memoized component × N)
    └── Renders individual prompt card
```

## Performance Metrics

**Expected Results**:
- Initial load: < 100ms (for 20 prompts)
- Filter change: < 16ms (60fps)
- Memory usage: Stable (no leaks)
- CPU usage: Minimal (no constant recalculations)
