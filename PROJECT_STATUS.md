# Charmiss Operations Portal — PROJECT STATUS
_Last updated: 2026-03-18_

---

## 📁 File Architecture

```
index.html        ← Single-page shell: sidebar, views, modals, <script> tags
style.css         ← CSS variables + component classes
data.js           ← TICKETS[], VENDORS{}, STAGES[], CUSTOMERS[], PRODUCTS[]
dashboard.js      ← Dashboard KPI widgets (separated 2026-03-18)
po-tracker.js     ← PO Ticket Tracker + SLA Journey + Notifications
order-app.js      ← TT Order creation + Sales Order page
auth.js           ← Login / role switching
```

### Script load order (bottom of index.html)
```html
<script src="data.js"></script>
<script src="dashboard.js"></script>   <!-- must load before po-tracker -->
<script src="po-tracker.js"></script>
<script src="order-app.js"></script>
<script src="auth.js"></script>
```

---

## 👤 Auth
- CEO = Wilasinee | Sales = ฝนเทพ / สิริกาญจน์ / อัมพร
- GitHub Pages deployment

---

## 🗂️ Module 1 — PO Ticket Tracker (`po-tracker.js` + `data.js`)

### Ticket Status Flow
```
pending_att → received → verified → approved → confirmed
```

### PO Main Tabs (curPOMainTab)
| Tab | procStatus shown |
|-----|-----------------|
| inbox | pending_att, received, escalated |
| approve | verified, approved |
| done | confirmed, canceled |

### Ticket Modal (`openTicketModal`)
- Info grid: รับเมื่อ | Email From | SLA Deadline | Ticket Status
- **PO Reference ลบออกจาก top-level modal แล้ว** — แก้ได้เฉพาะระดับ subtask
- SUB-TASKS: `buildUploadSubPanel(t)` + `buildAttSubTasks(t)`
- **Per-file PO Ref**: ปุ่ม ✏️ ข้าง PO Ref ทุก row → `editAttPoRef(tid, attIdx, ev)`
  - prompt → บันทึก `att.poRef` เฉพาะไฟล์นั้น

### Key Functions
```js
openTicketModal(id)
editAttPoRef(tid, attIdx, ev)   // แก้ PO Ref per-attachment
editPoRef(tid)                   // แก้ PO Ref ระดับ ticket (Journey panel เท่านั้น)
buildUploadSubPanel(t)
buildAttSubTasks(t)
```

### TT Tickets (data.js)
- id: 20, 21, 120–122 — `caseType:'ORDER'`, field `shopName` = ชื่อร้านค้า
- แสดงใน SLA Journey ด้วย `shopName` + tag "Traditional Trade" (สีเขียว)

---

## 🗂️ Module 2 — Dashboard (`dashboard.js`)

### KPI Cards (dynamic → `#dashStatCards`)
| Card | Metric |
|------|--------|
| PO Tickets วันนี้ | count startTs >= today |
| SLA Rate (7 วัน) | (total−breach)/total × 100% |
| เวลาเฉลี่ยต่อ Ticket | avg(confirmedAt − startTs) hrs |
| ค้าง / เกิน SLA | journey.stuck count |

### KPI Meters (`#dashKPIMeters`)
- SLA On-Time Rate (เป้า ≥ 90%) | Completion Rate | Avg. Processing Time (เป้า ≤ 12 ชม.) | ค้างอยู่

### Charts
- Pie (`#dashPieSvg`) — PO ตามสถานะ 5 segments
- Pipeline (`#dashPipeline`) — 7 stages count
- SLA Weekly Bar (`#dashBreachChart`) — breach/ontime + % rate ใต้บาร์
- SO Channel (`#dashSOChannelContent`) — MT+INV / MT / TT bars

### Master call
```js
renderDashboard()   // เรียกแทน individual functions ทั้งหมด
// po-tracker.js ทุก action เรียก renderDashboard() ไม่ใช่ individual functions
```

---

## 🗂️ Module 3 — Order App (หน้า สร้าง Order, `order-app.js`)

### Product Sheet (psheet) — Columns
CODE | BARCODE | PRODUCT NAME/SKU | ALLOCATED STOCK | PRICE TIER | จำนวน | รวม | Tester/ของแถม | หมายเหตุ

### Price Tier Buttons
- `D ฿xx` | `WS ฿xx` | **`ราคาพิเศษ`** (สีเหลือง — ไม่ใช้ icon ⭐ แล้ว)
- กด ราคาพิเศษ → tier แสดงช่องราคา + hint "กรอกเหตุผลในช่องหมายเหตุ"
- mismatch ประเภทราคา → note border แดง + label "⚠️ บังคับกรอก"

### Note Column (ขวาสุด) — รวม 3 กรณี
| สถานะ | Label | Border |
|-------|-------|--------|
| ปกติ | — | var(--border) |
| ราคาพิเศษ | ⭐ ราคาพิเศษ | เหลือง |
| Mismatch | ⚠️ บังคับกรอก | แดง |
- skunote → บันทึกลง `varSkuNotes` + `varSpecialReason` พร้อมกัน

### Tester/ของแถม — Event Architecture
```
ปุ่ม: <button data-action="adjfreetotal" data-delta="-1/1">
handler: document.addEventListener('click') once (_pshHandlerBound guard)
  → check: prod-flat-list.contains(e.target)
  → adjfreetotal branch → _freeAdjBusy guard (re-entry protection)
```
- **`pshFreeAdj` ถูกลบออกแล้ว** — ไม่มี second execution path

### Orders Filter (หน้า Orders tab) — Row เดียว
`ทั้งหมด | ✓ ยืนยันแล้ว | ✏️ แบบร่าง` **|** `📋 ทั้งหมด | ⏳ ยังไม่ได้สร้าง SO | ✅ สร้าง SO แล้ว`
- ลบ "✅ SO แล้ว" ออกแล้ว | class: `ord-status-chip` / `ord-so-chip`

### ตะกร้าสินค้า (renderCart)
- แสดง: items ที่ `qty > 0` **หรือ** `freeTotal > 0`
- qty=0 + มี freeItems → price row dimmed (฿0), freeHtml ยังแสดง
- **Tester/ของแถม bar format**: `Tester/ของแถม ×N` (รวม qty เป็นตัวเลขเดียว)
  ```
  [ Tester/ของแถม ×N ]          ไม่คิดในยอดรวม
  ```

---

## 🗂️ Module 4 — Sales Order Page (`order-app.js`)

### SO_MOCK Fields
```js
{ id, ref, customer, date, qty, channel,
  status,           // 'ok' | 'edit' | 'wait'
  reviewer, reviewDate,
  poFile, poFileType,   // 'internal' for mt-noinv
  soFile, invoiceFile,  // invoiceFile=null for mt-noinv
  otherFiles }          // array
```

### Channels & Tabs
| channel | Tab |
|---------|-----|
| `mt-inv` | 🏬 MT มี Invoice |
| `mt-noinv` | 📋 MT ไม่มี Invoice |
| `tt` | 🏪 TT |
| `other` | 📦 Other (future) |

### Column Order
☐ | **ตรวจสอบ** | CUSTOMER NAME | DOC NO | REF | DATE | QTY | 📄 ใบ PO | 📄 ใบ SO | **PREVIEW** | 📄 ใบ Invoice | 📎 เอกสารอื่นๆ

### Print Bar (เหนือ table — `#so-print-bar`)
`🖨 Print ทั้งหมดตาม Filter:` `[Print PO]` `[Print SO]` `[Print Invoice]` `[Print เอกสารอื่นๆ]`
- `soPrintAllByType(type)` — loop filtered rows เก็บ files → showToast
- Invoice button id=`so-invoice-print-btn` ซ่อนเมื่อ tab mt-noinv

### Invoice Column Rules
- Tab `mt-noinv` → `<th id="so-invoice-th">` ซ่อน + print button ซ่อน
- Tab ทั้งหมด → row mt-noinv แสดง `—`

### Review
```js
soMarkReviewed(id, ev)       // toggle ok↔wait, บันทึก reviewer+reviewDate → renderCart
soSetReviewFilter(v, el)     // 'all' | 'reviewed' | 'pending'
```

### Document Cells
```js
soDocCell(soId, fieldKey, filename, color, bg, border, label, 'soPrintDoc')
soOtherFilesCell(soId, files)
soHandleUpload(soId, fieldKey, input)   // update soState.data + soRender()
```

---

## 🗂️ Module 5 — SLA Journey (`po-tracker.js`)

### `buildJourneyRow(t)`
- TT (`caseType:'ORDER'`): logo TT สีเขียว + `t.shopName` + tag "Traditional Trade"
- MT: logo จาก `VENDORS[t.vendor]` + `t.vendor`

---

## ⚙️ Known Patterns & Rules

```
NEVER JSON.stringify in onclick HTML attributes → use data-* attributes
NEVER nested backtick template literals
Always validate: node --check filename.js
vkey format:  pid + "||" + label  (double-pipe)
MOCK_STOCK key: pid + "_" + label  (underscore)
```

### Event Handler Flags
| Flag | ค่า | ความหมาย |
|------|-----|---------|
| `_pshHandlerBound` | bool | psheet listeners attach ครั้งเดียวตลอดชีวิต |
| `_freeAdjBusy` | bool | กัน adjfreetotal re-entry double-fire |
| `_quotaLock` | bool | กัน quota confirm dialog loop |

---

## 🎨 CSS Variables
```css
--pink:#E8457A  --pink-d:#C73360  --pink-l:#FDE8EF  --pink-ll:#FEF5F8
--pink-m:#F5A8C0  --border:#F0D9E4  --text:#2D1A24  --text2:#6B4458
--success:#059669  --warn:#D97706  --danger:#DC2626  --cancel:#7C3AED
```

---

## 📌 TODO
- [ ] Dashboard SLA weekly — เชื่อมกับ TICKETS จริง (ปัจจุบัน mock weeks array)
- [ ] Sales Order — soFile/invoiceFile เชื่อมกับ print จริง
- [ ] SLA Journey TT filter — dropdown แสดง shopName แทน "Traditional Trade"
- [ ] PO Tracker — persist att.poRef edits to backend
- [ ] Dashboard — date range filter สำหรับ KPI cards
- [ ] Cart qty=0+freeItems — sync กลับ psheet เมื่อ rmItem
