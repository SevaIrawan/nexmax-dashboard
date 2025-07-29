# NEXMAX Dashboard - Styling & CSS Documentation

## 🎨 CSS Architecture Overview

### Design System
NEXMAX Dashboard menggunakan sistem desain yang konsisten dengan tema modern dan profesional. CSS diorganisir dengan pendekatan modular dan scalable.

### Color Palette
```css
/* Primary Colors */
--primary-blue: #667eea;
--primary-purple: #764ba2;
--primary-pink: #f093fb;
--primary-cyan: #4facfe;

/* Neutral Colors */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;

/* Status Colors */
--success-green: #10b981;
--warning-yellow: #f59e0b;
--error-red: #ef4444;
--info-blue: #3b82f6;
```

## 📁 CSS File Structure

### Global Styles (`styles/globals.css`)
File CSS global yang berisi:
- CSS reset dan base styles
- Sidebar styling
- Global utility classes
- Dark theme implementation

### Component Styles (`styles/dashboard-components.css`)
File khusus untuk komponen dashboard:
- KPI card styling
- Chart component styles
- Grid layouts
- Responsive design

### Transaction Pages (`styles/transaction-pages.css`)
File untuk halaman transaksi:
- Table styling
- Form components
- Modal dialogs
- Export functionality

### Sidebar Submenu (`styles/sidebar-submenu.css`)
File khusus untuk sidebar:
- Submenu styling
- Scroll behavior
- Animation effects
- Responsive sidebar

## 🎯 Component Styling

### 1. KPI Cards (StandardStatCard)

#### Base Styling
```css
.kpi-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  padding: 20px;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}
```

#### Color Themes
```css
.kpi-card.blue {
  border-left: 4px solid #667eea;
}

.kpi-card.purple {
  border-left: 4px solid #f093fb;
}

.kpi-card.cyan {
  border-left: 4px solid #4facfe;
}

.kpi-card.green {
  border-left: 4px solid #10b981;
}
```

#### Typography
```css
.kpi-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
  line-height: 1.2;
}

.kpi-change {
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-change.positive {
  color: #10b981;
}

.kpi-change.negative {
  color: #ef4444;
}
```

### 2. Chart Components

#### Chart Container
```css
.chart-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
  padding: 20px;
  height: 300px;
  position: relative;
}

.chart-container.small {
  height: 250px;
}

.chart-container.large {
  height: 400px;
}
```

#### Chart Grid Layout
```css
.charts-grid-standard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.charts-grid-3x1 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.charts-grid-complex {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
```

### 3. KPI Grid Layout

#### Standard Grid
```css
.kpi-grid-standard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

/* Dynamic width based on card count */
.kpi-grid-standard[data-card-count="2"] {
  grid-template-columns: repeat(2, 1fr);
}

.kpi-grid-standard[data-card-count="3"] {
  grid-template-columns: repeat(3, 1fr);
}

.kpi-grid-standard[data-card-count="4"] {
  grid-template-columns: repeat(4, 1fr);
}
```

#### Responsive Grid
```css
@media (max-width: 768px) {
  .kpi-grid-standard {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .kpi-grid-standard {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### 4. Sidebar Styling

#### Main Sidebar
```css
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  overflow-y: auto;
  transition: all 0.3s ease;
  z-index: 1000;
}

.sidebar.collapsed {
  width: 75px;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.sidebar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  opacity: 0.7;
}
```

#### Menu Items
```css
.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.menu-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-left-color: #667eea;
}

.menu-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: white;
  border-left-color: #667eea;
}

.menu-icon {
  font-size: 1.25rem;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.menu-label {
  font-weight: 500;
  flex: 1;
}

.menu-arrow {
  font-size: 0.875rem;
  transition: transform 0.3s ease;
}

.menu-item.expanded .menu-arrow {
  transform: rotate(90deg);
}
```

#### Submenu
```css
.submenu {
  background: rgba(0,0,0,0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.submenu-item {
  display: flex;
  align-items: center;
  padding: 8px 24px 8px 48px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.submenu-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.submenu-item.active {
  background: rgba(102, 126, 234, 0.2);
  color: white;
}
```

### 5. Header Styling

#### Main Header
```css
.header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 85px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  z-index: 999;
  transition: left 0.3s ease;
}

.header.sidebar-collapsed {
  left: 75px;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
}
```

### 6. Sub-header Styling

#### Fixed Sub-header
```css
.sub-header {
  position: fixed;
  top: 85px;
  left: 280px;
  right: 0;
  min-height: 100px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 48px;
  z-index: 1000;
  transition: left 0.3s ease;
  overflow: hidden;
}

.sub-header.sidebar-collapsed {
  left: 75px;
}

.sub-header-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
}

.sub-header-slicers {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}
```

#### Slicer Components
```css
.slicer-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slicer-select:hover {
  border-color: #667eea;
}

.slicer-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

### 7. Table Styling

#### Data Table
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.data-table th {
  background: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-size: 0.875rem;
}

.data-table tr:hover {
  background: #f9fafb;
}

.data-table tr:last-child td {
  border-bottom: none;
}
```

#### Editable Cells
```css
.editable-cell {
  position: relative;
}

.editable-cell input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
}

.editable-cell input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.editable-cell .edit-icon {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.editable-cell:hover .edit-icon {
  opacity: 1;
}
```

### 8. Form Styling

#### Modal Forms
```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}
```

#### Form Fields
```css
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #ef4444;
}

.form-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 4px;
}
```

#### Form Buttons
```css
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
```

## 📱 Responsive Design

### 1. Mobile Breakpoints
```css
/* Mobile */
@media (max-width: 768px) {
  .sidebar {
    width: 75px;
  }
  
  .main-content {
    margin-left: 75px;
  }
  
  .header {
    left: 75px;
  }
  
  .sub-header {
    left: 75px;
    padding: 15px 20px;
  }
  
  .sub-header-slicers {
    flex-direction: column;
    gap: 8px;
  }
  
  .kpi-grid-standard {
    grid-template-columns: 1fr;
  }
  
  .charts-grid-standard {
    grid-template-columns: 1fr;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .kpi-grid-standard {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid-standard {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .kpi-grid-standard {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .charts-grid-standard {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 2. Print Styles
```css
@media print {
  .sidebar,
  .header,
  .sub-header,
  .btn,
  .modal-overlay {
    display: none !important;
  }
  
  .main-content {
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
  
  .kpi-card,
  .chart-container {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

## 🎭 Animation & Transitions

### 1. Smooth Transitions
```css
/* Global transitions */
* {
  transition: all 0.3s ease;
}

/* Sidebar transitions */
.sidebar {
  transition: width 0.3s ease;
}

/* Card hover effects */
.kpi-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Button hover effects */
.btn {
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
```

### 2. Loading Animations
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}
```

### 3. Shimmer Effect
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.shimmer {
  position: relative;
  overflow: hidden;
  background: #f6f7f8;
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}
```

## 🎨 Dark Theme Support

### 1. Dark Theme Variables
```css
:root {
  /* Light theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
}

[data-theme="dark"] {
  /* Dark theme */
  --bg-primary: #1e293b;
  --bg-secondary: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --border-color: #475569;
}
```

### 2. Dark Theme Components
```css
/* Dark theme KPI cards */
[data-theme="dark"] .kpi-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  color: var(--text-primary);
}

/* Dark theme tables */
[data-theme="dark"] .data-table {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

[data-theme="dark"] .data-table th {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

[data-theme="dark"] .data-table td {
  border-color: var(--border-color);
  color: var(--text-primary);
}
```

## 🔧 CSS Utilities

### 1. Spacing Utilities
```css
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-4 { margin: 1rem; }
.m-8 { margin: 2rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.p-8 { padding: 2rem; }
```

### 2. Flexbox Utilities
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
```

### 3. Grid Utilities
```css
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
```

### 4. Text Utilities
```css
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }

.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## 📊 Performance Optimization

### 1. CSS Optimization
```css
/* Use efficient selectors */
.kpi-card { /* Good */ }
.kpi-card .title { /* Good */ }
.kpi-card > .title { /* Better */ }

/* Avoid deep nesting */
.kpi-card .content .title .text { /* Bad */ }
.kpi-title { /* Good */ }
```

### 2. Critical CSS
```css
/* Inline critical styles */
.critical-styles {
  /* Above-the-fold styles */
  .header { position: fixed; }
  .sidebar { position: fixed; }
  .main-content { margin-left: 280px; }
}
```

### 3. CSS Purge
```javascript
// Remove unused CSS
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

*This styling and CSS documentation provides comprehensive information about the NEXMAX Dashboard styling system, including component styles, responsive design, animations, and performance optimization.* 