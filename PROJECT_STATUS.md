# Charmiss Operations Portal — PROJECT STATUS
_Last updated: 2026-03-18_

---

## 📁 File Architecture

```
index.html          ← Single-page shell: sidebar, views, modals, <script> tags
style.css           ← All CSS variables + component classes
data.js             ← TICKETS[], VENDORS{}, STAGES[], CUSTOMERS[], PRODUCTS[]
dashboard.js        ← Dashboard KPI widgets (NEW — separated 2026-03-18)
po-tracker.js       ← PO Ticket Tracker + SLA Journey + Notifications
order-app.js        ← Traditional Trade Order creation + Sales Order page
auth.js             ← Login / role switching
```

### Script load order (index.html bottom)
```html
<script src="data.js"></script>
<script src="dashboard.js"></script>   <!-- must load before po-tracker -->
<script src="po-tracker.js"></script>
<script src="order-app.js"></script>
<script src="auth.js"></script>
```

---

## 👤 Auth
- CEO = Wilasinee
- Sales = ฝนเทพ / สิริกาญจน์ / อัมพร
- GitHub Pages deployment

---

## 🗂️ Module 1 — PO Ticket Tracker (`po-tracker.js` + `data.js`)

### Ticket Status Flow
```
pending_att → received → verified → approved → confirmed
```

### PO Main Tabs (curPOMainTab)
| Tab | Sub-filters | procStatus shown |
|-----|-------------|-----------------|
| inbox | ทั้งหมด / รอแนบไฟล์ / รอรับงาน | pending_att, received, escalated |
| approve | ทั้งหมด / รอ Approve / Approved แล้ว | verified, approved |
| done | ทั้งหมด / Confirmed / ยกเลิก | confirmed, canceled |

### Ticket Modal (`openTicketModal`)
- Info grid: รับเมื่อ | Email From | SLA Deadline | **Ticket Status** (PO Reference section ถูกลบออก — แก้ได้ระดับ subtask แทน)
- SUB-TASKS panel: `buildUploadSubPanel(t)` + `buildAttSubTasks(t)`
- **Per-file PO Ref editing**: ปุ่ม ✏️ ข้าง PO Ref แต่ละ row → `editAttPoRef(tid, attIdx, ev)` (prompt → `att.poRef`)
- Upload zone: PDF/Excel/CSV/RTF, no ZIP
- Action buttons: `buildAttActionsOnly(t)`

### Key Functions
```js
openTicketModal(id)          // render modal
editAttPoRef(tid, attIdx, ev) // แก้ PO Ref per-attachment
editPoRef(tid)                // แก้ PO Ref ระดับ ticket (ใช้ใน Journey panel)
buildUploadSubPanel(t)        // subtask panel พร้อม upload zone
buildAttSubTasks(t)           // subtask rows พร้อม timer/SLA
acceptAttTask(tid, attIdx, ev)
approvePO(tid, attIdx, ev)
rejectSingleTask(tid, origIdx, ev)
```

### Mock Data (`data.js`)
- id:1 Beautrium — procStatus:'verified' (demo รอ Approve PO)
- TT tickets: id 20, 21, 120–122 — `caseType:'ORDER'`, มี field `shopName`

---

## 🗂️ Module 2 — Dashboard (`dashboard.js`)

### KPI Cards (dynamic, rendered to `#dashStatCards`)
| Card | Metric | Source |
|------|--------|--------|
| PO Tickets วันนี้ | count startTs >= today | TICKETS |
| SLA Rate (7 วัน) | (total-breach)/total × 100% | getSLAStatus() |
| เวลาเฉลี่ยต่อ Ticket | avg(confirmedAt - startTs) hrs | confirmed tickets |
| ค้าง / เกิน SLA | count journey.stuck=true | real tickets |

### KPI Meters (progress bars, rendered to `#dashKPIMeters`)
- SLA On-Time Rate (เป้า ≥ 90%)
- Completion Rate = Confirmed / ทั้งหมด
- Avg. Processing Time (เป้า ≤ 12 ชม.)
- ค้างอยู่ / กำลังดำเนินการ

### Charts
- **Pie Chart** (`#dashPieSvg`) — PO ตามสถานะ 5 segments
- **Pipeline** (`#dashPipeline`) — 7 stages count
- **SLA Weekly Bar** (`#dashBreachChart`) — breach/ontime per week + % rate ใต้บาร์
- **SO Channel Bars** (`#dashSOChannelContent`) — MT+INV / MT / TT

### Master render call
```js
renderDashboard()  // calls: renderDashStatCards, renderDashKPIMeters,
                   //         renderDashPie, renderDashPipeline,
                   //         renderDashBreachChart, renderDashSOChannel
```

> **Note:** `po-tracker.js` เรียก `renderDashboard()` แทนการเรียก individual functions — ทุก action (confirmTicket, doCancel, approvePO ฯลฯ) ควรเรียก `renderDashboard()` แทน `renderDashPie()` ฯลฯ

---

## 🗂️ Module 3 — Traditional Trade Order App (`order-app.js`)

### Product Sheet (psheet)
Columns: CODE | BARCODE | PRODUCT NAME/SKU | ALLOCATED STOCK | PRICE TIER | จำนวน | รวม | Tester/ของแถม | หมายเหตุ

- Free/Tester buttons: `class=psh-free-btn`, `data-freevkey`, `data-freedelta`
- Handler: `_pshClickHandler` → `pshFreeAdj(vkey, delta)`
- Price mismatch: warning badge + red border + required หมายเหตุ

### Orders Page (`#page-orders`)
Filter chips row 1: ทั้งหมด | ✓ ยืนยันแล้ว | ✏️ แบบร่าง | ✅ SO แล้ว
Filter chips row 2 (SO): ทั้งหมด | ⏳ ยังไม่ได้สร้าง SO | ✅ สร้าง SO แล้ว
_(Review filter ถูกลบออกจากหน้านี้ — อยู่ใน Sales Order แทน)_

### Order Card (`renderOrds`)
- Layout: ชื่อร้าน + ref + SO number (left) | ยอดรวม (right)
- **ปุ่ม ตรวจสอบ ถูกลบออกจาก Orders** — ใช้หน้า Sales Order แทน

---

## 🗂️ Module 4 — Sales Order Page (`order-app.js`)

### SO_MOCK Data Fields
```js
{
  id, ref, customer, date, qty, channel,   // core
  status,           // 'ok' | 'edit' | 'wait'
  printStatus,      // 'พิมพ์แล้ว' | null
  reviewer, reviewDate,  // ผู้ตรวจสอบ + วันเวลา
  poFile,           // ชื่อไฟล์ PO (string | null)
  poFileType,       // 'internal' สำหรับ mt-noinv
  soFile,           // ชื่อไฟล์ SO (string | null)
  invoiceFile,      // ชื่อไฟล์ Invoice (string | null) — mt-noinv ไม่มี
  otherFiles,       // array ไฟล์อื่นๆ เช่น ใบปะหน้า
}
```

### Channel Values
| channel | ความหมาย |
|---------|---------|
| `mt-inv` | Modern Trade มี Invoice |
| `mt-noinv` | Modern Trade ไม่มี Invoice |
| `tt` | Traditional Trade |

### Table Columns (ล่าสุด — STATUS และ PRINT STATUS ถูกลบออก)
☐ | CUSTOMER NAME | DOCUMENT NUMBER | REFERENCE | ISSUE DATE | ORDER QTY | 📄 ใบ PO | 📄 ใบ SO | 📄 ใบ Invoice | 📎 เอกสารอื่นๆ | PREVIEW | ตรวจสอบ

### Invoice Column Rules
- **`mt-noinv` filter active** → `<th id="so-invoice-th">` ซ่อนด้วย `display:none` (เรียกใน `soSetChannel`)
- แต่ละ row ที่เป็น `mt-noinv` → `<td>` ก็ซ่อนด้วยเมื่อ filter active
- Tab ทั้งหมด: row mt-noinv แสดง `—`

### Review Flow
```js
soMarkReviewed(id, ev)      // toggle ok ↔ wait, บันทึก reviewer + reviewDate
soSetReviewFilter(v, el)    // 'all' | 'reviewed' | 'pending'
```

### Document Upload
```js
soHandleUpload(soId, fieldKey, input)  // fieldKey: 'poFile'|'soFile'|'invoiceFile'|'other'
soDocCell(soId, fieldKey, filename, ...) // render ปุ่มปริ้น หรือ upload label
soOtherFilesCell(soId, files)          // render multiple files + "+ เพิ่ม"
```

---

## 🗂️ Module 5 — SLA Journey (`po-tracker.js`)

### `buildJourneyRow(t)`
- MT tickets: แสดง `t.vendor` + logo จาก VENDORS
- TT tickets (`caseType:'ORDER'`): แสดง `t.shopName` + tag สีเขียว "Traditional Trade"
- Logo TT: `{color:'#166534', bg:'#DCFCE7', logo:'TT'}`

### Journey Date Filters
```
curJourneyDays: 0=all, 7=7d, 30=30d, -1=custom range
```

---

## ⚙️ Known Patterns & Rules

```
NEVER JSON.stringify in onclick HTML attributes → use data-* attributes
NEVER nested backtick template literals
Always validate: node --check filename.js
vkey format:  pid + "||" + label  (double-pipe)
MOCK_STOCK key: pid + "_" + label  (underscore)
renderPgrid always calls attachPsheetHandlers (removes+re-adds ONE listener)
renderDashboard() — เรียกครั้งเดียวแทน individual dash render functions
```

---

## 🎨 CSS Variables (style.css)
```css
--pink:#E8457A  --pink-d:#C73360  --pink-l:#FDE8EF  --pink-ll:#FEF5F8
--pink-m:#F5A8C0  --border:#F0D9E4  --text:#2D1A24  --text2:#6B4458
--success:#059669  --warn:#D97706  --danger:#DC2626  --cancel:#7C3AED
```

---

## 📌 TODO / Next Steps

- [ ] Dashboard SLA weekly data — เชื่อมกับข้อมูล TICKETS จริงแทน mock weeks array
- [ ] Sales Order — เชื่อม soFile / invoiceFile กับระบบ print จริง
- [ ] SLA Journey — TT filter: dropdown แสดง shopName แทน "Traditional Trade"
- [ ] PO Tracker — persist `att.poRef` edits to backend
- [ ] Dashboard — เพิ่ม date range filter สำหรับ KPI cards
