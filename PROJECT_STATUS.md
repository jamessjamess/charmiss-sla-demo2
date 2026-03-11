# PROJECT_STATUS.md — Charmiss Portal
> อัปเดตล่าสุด: v26 | ไฟล์หลัก: `charmiss-portal-v26.html` (~385KB, 5,791 บรรทัด)
> เอกสารนี้ให้ AI (Claude) อ่านทุก session ใหม่เพื่อเข้าใจภาพรวมโปรเจกต์โดยไม่ต้องโหลดไฟล์ HTML ทั้งหมด

---

## 1. ภาพรวมระบบ

**Charmiss Portal** คือ Single-file HTML application สำหรับ Betime Beauty House (แบรนด์ Charmiss) ประกอบด้วย 2 ระบบหลักในไฟล์เดียว:

| ระบบ | กลุ่มผู้ใช้ | วัตถุประสงค์ |
|------|------------|--------------|
| **PO/SLA Tracker** | ทีม Procurement / Admin | ติดตาม PO Email จาก Vendor ผ่าน Document Journey 7 Stage |
| **Sales Order App** | Sales Rep (TT) | สร้างและจัดการ Order สินค้าให้ลูกค้า Traditional Trade |

**Design System:** Charmiss Pink Theme — CSS variables อยู่ใน `:root` บรรทัด ~12–25
- Primary: `--pink: #E8457A`, `--pink-d: #C73360`
- Font: Noto Sans Thai + IBM Plex Mono (monospace) + Sarabun
- Layout: Sidebar fixed 230px + Main content area

---

## 2. โครงสร้าง Views (หน้าต่างๆ)

Navigation ผ่าน `gotoView(viewId)` — แต่ละ view คือ `<div class="view" id="view-[name]">`

| View ID | ชื่อหน้า | Module |
|---------|---------|--------|
| `dashboard` | Dashboard | PO/SLA — สรุป Stats, Pie Chart, Breach Trend, Activity Feed |
| `sla-journey` | SLA Journey | PO/SLA — ตาราง Document Journey พร้อม Pipeline inline |
| `po-tickets` | PO Tickets | PO/SLA — รายการ Ticket จาก Email Inbox |
| `create-order` | สร้าง Order | Sales Order App (Order App JS) |
| `sales-order` | Sales Order | รายการ SO ที่สร้างแล้ว + Preview + Upload |
| `wms-upload` | Upload WMS | อัปโหลดข้อมูลการส่งของจาก WMS (Excel/CSV) |
| `admin` | Admin PO | ตาราง Admin สรุป PO |
| `notifications` | การแจ้งเตือน | รายการ Notification |
| `vendors` | Vendor Rules | ตั้งค่า Vendor + SLA Rules |

---

## 3. โมดูล PO/SLA Tracker

### 3.1 Data Structures

**`VENDORS`** (object) — บรรทัด ~1998
```
key → { label, color, bg, logo, channel }
```
Vendors: Watsons, Beautrium, Konvy, Eveandboy, 24Shopping/7-11, Multy, Tsuruha, CJ Express

**`TICKETS`** (array) — บรรทัด ~2055
```js
{
  id, vendor, subject, startTs, status,        // 'new'|'confirmed'|'canceled'
  procStatus,                                   // 'pending_att'|'received'|'verified'|'approved'
  currentStage,                                 // key ของ stage ปัจจุบัน
  journey: {                                    // object keyed by stage
    po: { done, ts, stuck },
    approve_po: { done, ts, stuck },
    open_so: { done, ts, stuck },
    approve_so: { done, ts, stuck },
    doc_wh: { done, ts, stuck },
    delivery: { done, ts, stuck },
    delivered: { done, ts, stuck }
  },
  attachments: [...],
  emailBody: '...',
  _isMockup: bool                               // mockup data ใช้เพื่อ demo เท่านั้น
}
```

**`STAGES`** (array) — บรรทัด ~2254
7 stages: po → approve_po → open_so → approve_so → doc_wh → delivery → delivered

**SLA Rules** — บรรทัด ~1983 (`getSLADeadline`)
- Email ก่อน 12:00 → Deadline = 09:00 วันถัดไป
- Email หลัง 12:00 → Deadline = 14:00 วันถัดไป

**Per-stage SLA allowances** (นาที):
```
po:60, approve_po:1440, open_so:480, approve_so:480,
doc_wh:240, delivery:1440, delivered:60
```

### 3.2 Functions สำคัญ

| Function | บรรทัด | หน้าที่ |
|----------|--------|---------|
| `getSLAStatus(startTs, status)` | ~1989 | คืน `{status, remaining, deadline}` |
| `renderJourney()` | ~2652 | Render ตาราง SLA Journey พร้อม filter |
| `buildPipelineHtml(t)` | ~2698 | สร้าง Pipeline dots inline |
| `buildExpandHtml(t)` | ~2749 | สร้าง Expand row แสดง Journey detail |
| `renderTickets()` | ~3036 | Render PO Tickets table |
| `openTicketModal(id)` | ~3157 | เปิด Modal รายละเอียด Ticket |
| `buildAttSubTasks(t)` | ~3422 | สร้าง Sub-task checklist แนบเอกสาร |
| `exportTable(tableId)` | ~3850 | Export เป็น Excel (XLSX.js) พร้อม Thai UTF-8 BOM |

### 3.3 State Variables (PO/SLA)
```js
var STAGE_REMARKS = {};   // key: ticketId+'_'+stageKey → {text, images:[]}
var REMARK_OPEN = {};     // key: ticketId+'_'+stageKey → bool
var STAGE_ACTIONS = {...} // default action labels per stage
var curPOFilter = 'all';
var curPOVendor = '';
var curDateFilter = 7;    // วัน (7/14/30/custom)
var curJourneyDays = 7;
```

---

## 4. โมดูล Sales Order App

### 4.1 Data Structures

**`CUSTOMERS`** (array) — บรรทัด ~4044
```js
{ id, name, sales, type }  // type: 'Dealer' | 'Wholesale'
```
Sales Reps: ฝนเทพ, สิริกาญจน์, อัมพร (~40 ลูกค้า)

**`PRODUCTS`** (array) — บรรทัด ~4068
```js
{
  id, name, cat, emoji,
  dealer,     // ราคา Dealer (บาท/ชิ้น)
  wholesale,  // ราคา Wholesale (บาท/ชิ้น)
  variants: [
    {
      label,      // ชื่อสี/ขนาด
      trCode,     // รหัส TR (5 หลัก)
      barcode,    // 13 หลัก
      price50,    // ราคา 50+ ชิ้น (null = ไม่มี)
      price6      // ราคา 6 ชิ้น (null = ไม่มี)
    }
  ]
}
```

Categories: Brow, Cheek, Eye, Lip, Face, Skincare (~35 สินค้า, 150+ SKU variants)

**Pricing Tiers:**
- `dealer` — ราคา Dealer ต่อชิ้น
- `wholesale` — ราคา Wholesale ต่อชิ้น
- `price50` / `price6` — ราคาพิเศษตาม quantity (per variant)
- Special Price — กรอกราคาเองได้ **ต้องมี reason** (mandatory audit field)

### 4.2 State Object `S`
```js
const S = {
  selCust: null,          // ลูกค้าที่เลือก
  cart: [],               // [{pid, variantLabel, qty, price, priceMode, specialReason}]
  orders: [],             // orders ที่ confirm แล้ว
  drafts: [],             // draft orders
  varPid: null,           // product ที่กำลัง pick variant
  varSelections: {},      // variant label → qty
  varSpecialPrice: {},    // variant label → price
  varSpecialReason: {},   // variant label → reason string
  catFilter: 'ทั้งหมด',
  pgSearch: '',
  lastOrderRef: null,     // ref ของ order ล่าสุด (สำหรับ open report)
}
```

### 4.3 Order App Pages (ภายใน view-create-order)
```
page-new      → เลือกลูกค้า + Catalog สินค้า + Cart
page-orders   → รายการ Order ที่บันทึกแล้ว
successSc     → หน้า Success หลัง Confirm
```

### 4.4 Functions สำคัญ (Order App)

| Function | บรรทัด | หน้าที่ |
|----------|--------|---------|
| `renderCusts()` | ~4385 | Render รายชื่อลูกค้า + Search |
| `renderPgrid()` | ~4427 | Render Product Grid + filter |
| `openVarSheet(p)` | ~4522 | เปิด Bottom sheet เลือก Variant |
| `renderVarList(p)` | ~4584 | Render variant options + pricing |
| `renderCart()` | ~4771 | Render Cart summary |
| `openConfirm()` | ~4835 | Confirm Order → บันทึกใน S.orders |
| `renderOrds()` | ~4909 | Render รายการ Orders |
| `openReport(ref)` | ~5063 | Export Report Sheet (CSV/PDF) |

---

## 5. โมดูล Sales Order & WMS

**`view-sales-order`** — แสดง SO list ที่มาจาก Order App + filter channel (MT มี Invoice / MT ไม่มี Invoice / TT / E-Commerce)

**`view-wms-upload`** — อัปโหลด Excel WMS
- Parse ด้วย SheetJS (xlsx.js)
- State: `WMS_ROWS`, `WMS_FILTERED`
- Functions: `wmsSetDateRange()`, `wmsRender()`, `wmsUpdateStats()`

---

## 6. Modals & Sheets

| Element ID | ประเภท | ใช้สำหรับ |
|------------|--------|----------|
| `overlay` + `modal-wrap` | Modal | Ticket Detail |
| `cancel-overlay` | Modal | ยืนยัน Cancel Ticket |
| `vendor-overlay` | Modal | Add Vendor |
| `journey-overlay` | Modal | Journey Detail |
| `attach-overlay` | Modal | Attachment viewer |
| `detail-sheet` | Bottom Sheet | Order Detail |
| `var-sheet` | Bottom Sheet | Variant Picker |
| `report-sheet` | Bottom Sheet | Export Report |

---

## 7. Dependencies (CDN)

```html
xlsx.full.min.js  → cdnjs (SheetJS v0.18.5) — Excel export/import
Google Fonts      → Noto Sans Thai, IBM Plex Mono, Playfair Display, Sarabun
```
ไม่มี Framework (React/Vue) — Pure HTML/CSS/JS ทั้งหมด

---

## 8. Known Issues & Conventions

### Bug Patterns เคยเจอ
- **Nested template literal backticks** — ทำให้ JS ระเบิด → แก้ด้วย string concatenation
- **Duplicate `let` declarations** — ถ้าเพิ่ม block ใหม่ → ใช้ `var` แทนใน global scope
- **Validate syntax**: `node --check charmiss-portal-v26.html` (หรือ copy JS block ไป validate)

### Coding Conventions
- HTML Sections คั่นด้วย `<!-- ════════ MODULE NAME ════════ -->`
- JS Sections คั่นด้วย `// ─── SECTION NAME ───`
- Data arrays อยู่ท้ายไฟล์ตั้งแต่บรรทัด ~1997 (VENDORS) และ ~4044 (CUSTOMERS/PRODUCTS)
- State variables ใช้ชื่อ `cur*` สำหรับ filter state (curPOFilter, curDateFilter ฯลฯ)

---

## 9. Data ที่ Business User อาจต้องแก้บ่อย

| ข้อมูล | ตำแหน่งในไฟล์ | วิธีแก้ |
|--------|--------------|---------|
| เพิ่ม/แก้ลูกค้า | บรรทัด ~4044 `CUSTOMERS` | เพิ่ม object `{id, name, sales, type}` |
| เพิ่ม/แก้สินค้า | บรรทัด ~4068 `PRODUCTS` | เพิ่ม object พร้อม variants array |
| เพิ่ม/แก้ราคา | ใน `PRODUCTS` แต่ละรายการ | แก้ `dealer`, `wholesale`, `price50`, `price6` |
| เพิ่ม Vendor | บรรทัด ~1998 `VENDORS` | เพิ่ม key ใหม่ใน object |
| SLA Rules | บรรทัด ~1983 `getSLADeadline()` | แก้ logic เวลา |

---

## 10. Roadmap / TODO (ณ v26)

- [ ] แยก data (CUSTOMERS, PRODUCTS, VENDORS) ออกเป็นไฟล์ `.js` แยก เพื่อให้แก้ง่าย
- [ ] เพิ่ม local persistence (localStorage) สำหรับ Orders และ Stage Remarks
- [ ] Real backend integration (Google Sheets API หรือ Supabase)
- [ ] User authentication (แยก role Procurement vs Sales)
- [ ] Deploy บน GitHub Pages เพื่อ Business User เปิดผ่าน URL ได้เลย

---

## วิธีใช้เอกสารนี้กับ AI (Claude)

เมื่อเริ่ม session ใหม่ ให้ paste prompt นี้:

```
นี่คือ PROJECT_STATUS.md ของ Charmiss Portal:
[paste เนื้อหาไฟล์นี้]

และนี่คือ HTML ไฟล์ปัจจุบัน:
[แนบ charmiss-portal-vXX.html]

ขอให้ช่วย: [งานที่ต้องการ]
```

หากงานเล็กน้อย (แก้ data / แก้ CSS) → paste เฉพาะ PROJECT_STATUS.md ไม่ต้องแนบ HTML ทั้งไฟล์
