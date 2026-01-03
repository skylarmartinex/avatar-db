# Prompts Page UI Copy Improvements

## Overview

Updated the Prompts page to use **human-first, plain English copy** instead of backend acronyms.

---

## Changes Made

### **1. Page Header** ✅

#### **Before**:
```
Prompts.
Browse your library of generated merged JSON prompts with Finder-style navigation.
Filter by dimension to find exactly what you need.
```

#### **After**:
```
Saved Prompts.
Browse and filter previously generated editorial prompts.
Finder-style filtering by identity, background, and style.
```

**Why**:
- "Saved Prompts" is clearer than "Prompts"
- Removed mention of "JSON" (technical detail)
- Removed "dimension" (backend terminology)
- More concise and user-friendly

---

### **2. Column Headers** ✅

#### **Before** (Backend Acronyms):
```
ET | FA | BT | HR | SC | ST | V
```

#### **After** (Plain English):
```
Ethnicity | Face Archetype | Body Type | Hair Style | Background | Outfit | Version
```

**Mapping**:
| Backend Code | UI Label |
|--------------|----------|
| ET | Ethnicity |
| FA | Face Archetype |
| BT | Body Type |
| HR | Hair Style |
| SC | Background |
| ST | Outfit |
| V | Version |

**Why**:
- Users don't need to memorize acronyms
- Immediately understandable
- Professional and accessible

---

### **3. Column Header Styling** ✅

#### **Before**:
```typescript
className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider"
```

#### **After**:
```typescript
className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide"
```

**Changes**:
- Removed `font-mono` (monospace font)
- Changed to `font-bold` (sans-serif, bold)
- Increased size from 10px to 11px
- Lightened color from zinc-500 to zinc-400
- Reduced tracking from `wider` to `wide`

**Why**:
- Monospace was for code/backend labels
- Sans-serif is more readable for plain English
- Bold makes headers stand out
- Slightly larger and lighter for better visibility

---

### **4. Filter "All" Button** ✅

#### **Before**:
```
All
```

#### **After**:
```
Any
```

**Why**:
- Reads more naturally: "Ethnicity: Any" vs "Ethnicity: All"
- Clearer intent (any option is acceptable)
- More conversational

---

### **5. Prompt Card Titles** ✅

**Already Implemented** (from previous work):

#### **Display Format**:
```
Soft Goddess · Fitness Ripped · Filipina · Straight Hair · Beach · Tribal Bikini

FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

**Structure**:
- **Primary** (large, white): Human-readable title
- **Secondary** (small, muted): Canonical ID

**Why**:
- User immediately knows what the prompt is
- Canonical ID still available for power users
- No need to decode backend naming

---

## UI/UX Principles Applied

### **1. Human-First Language**
- Plain English over technical jargon
- Descriptive over abbreviated
- Conversational over formal

### **2. Progressive Disclosure**
- Show what matters first (human-readable)
- Technical details available but secondary
- Don't overwhelm with backend complexity

### **3. Accessibility**
- Clear, readable labels
- No memorization required
- Intuitive navigation

### **4. Consistency**
- All labels follow same pattern
- Uniform styling across columns
- Predictable behavior

---

## Backend Unchanged

**Important**: All changes are **UI-only**. Backend code, file names, and canonical IDs remain unchanged.

**Backend Code** (unchanged):
- Dimension codes: ET, FA, BT, HR, SC, ST, V
- File naming: `FA-SG-A__BT-FR__ET-PH...`
- API responses: Use backend codes
- Registry structure: Unchanged

**UI Layer** (updated):
- Display labels: Plain English
- Column headers: Human-readable
- User-facing text: Non-technical

---

## User Experience Impact

### **Before**:
- User sees "ET" and thinks "What does ET mean?"
- Must learn backend acronyms to navigate
- Feels technical and intimidating
- "Prompts" is vague

### **After**:
- User sees "Ethnicity" and immediately understands
- No learning curve required
- Feels professional and accessible
- "Saved Prompts" is clear and specific

---

## Examples

### **Column Interaction**:

**Before**:
```
ET: All
FA: All
BT: All
```

**After**:
```
Ethnicity: Any
Face Archetype: Any
Body Type: Any
```

Reads naturally: "Show me any ethnicity, any face archetype, any body type"

---

### **Prompt Card**:

**Title**:
```
Soft Goddess · Fitness Ripped · Filipina · Straight Hair · Beach · Tribal Bikini
```

**Canonical ID** (muted):
```
FA-SG-A__BT-FR__ET-PH__HR-ST__SC-BEACH__ST-POCA__v01__r01
```

User immediately understands the prompt without decoding.

---

## Testing Checklist

- [ ] Page title shows "Saved Prompts"
- [ ] Subtitle is clear and non-technical
- [ ] Column headers show plain English labels
- [ ] "Any" button appears instead of "All"
- [ ] Column headers use sans-serif font (not monospace)
- [ ] Prompt titles show human-readable format
- [ ] Canonical IDs still visible but secondary
- [ ] No backend codes visible in primary UI elements

---

## Future Enhancements (Optional)

### **Phase 2**:
- Add tooltips to column headers with descriptions
- Add helper text under "Background" column: "Background remains visually secondary"
- Add search/filter input for quick prompt finding

### **Phase 3**:
- Nested filtering (Ethnicity → Region → Archetype)
- Saved filter presets
- Prompt tagging and collections

---

## Success Criteria

**UI is successful if**:
- ✅ User never needs to learn backend acronyms
- ✅ Navigation is intuitive and self-explanatory
- ✅ Professional and accessible feel
- ✅ Technical details available but not primary
- ✅ Backend unchanged (UI-only changes)

---

## Summary

**Changed**:
- Page title: "Prompts" → "Saved Prompts"
- Subtitle: More clear and concise
- Column headers: Backend codes → Plain English
- Column styling: Monospace → Sans-serif bold
- Filter button: "All" → "Any"

**Unchanged**:
- Backend code structure
- File naming conventions
- API responses
- Canonical ID format
- Registry structure

**Result**: Professional, accessible, human-first UI that doesn't require technical knowledge to navigate.
