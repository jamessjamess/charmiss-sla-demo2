# Charmiss Portal — PROJECT_STATUS.md
_Last updated: 2026-03-17_

> **สำหรับ AI:** อ่านไฟล์นี้ก่อนเสมอ อย่า re-read source files ทั้งหมด — ใช้ส่วน **DATA SCHEMA** และ **FUNCTION MAP** เพื่อเข้าใจโครงสร้างได้ทันที

---

## 1. โครงสร้างไฟล์ (Multi-file SPA)

| ไฟล์ | หน้าที่ | ขนาดโดยประมาณ |
|------|---------|---------------|
| `index.html` | HTML shell: Sidebar, Views, Modals, `<script>` tags | ~75 KB |
| `style.css` | CSS ทั้งหมด (Portal + Order App + psheet table) | ~65 KB |
| `data.js` | ข้อมูลหลัก: VENDORS, TICKETS, STAGES, CUSTOMERS, PRODUCTS, NOTIFICATIONS | ~112 KB |
| `po-tracker.js` | Logic: SLA Journey, PO Tickets, Dashboard, Admin, Vendors, Notifications | ~125 KB |
| `order-app.js` | Logic: สร้าง Order, Sales Order list, Cart, Confirm | ~123 KB |
| `auth.js` | Login / Role management (CEO = Wilasinee) | ~18 KB |

**โหลดตามลำดับ:** `data.js` → `po-tracker.js` → `order-app.js` → `auth.js`

---

## 2. DATA SCHEMA (อ่านส่วนนี้แทนการเปิดไฟล์ทั้งหมด)

### 2.1 CUSTOMERS array — `data.js`
**203 ร้านค้า** จาก TT_Shop.xlsx

```js
{
  id: '1889',                        // string (System ID จาก ERP)
  name: 'CHOM SREY YOU',             // ชื่อร้านค้า
  sales: 'ฝนเทพ',                    // พนักงานขาย (ฝนเทพ | สิริกาญจน์ | อัมพร)
  shopType: 'Wholesale',             // ประเภทร้านค้า (ดูค่าได้ข้างล่าง)
  priceType: 'Dealer',               // ประเภทราคา → ใช้เลือก price tier default
  creditTerm: '7 วัน ส่วนลด 2%',    // เงื่อนไขเครดิต → trigger ปุ่มส่วนลด 2%
}
```

**shopType values:** `Wholesale` | `Wholesale - Beauty Store` | `Retail - Drugstore` | `Retail - Beauty Store`  
**priceType values:** `Dealer` (124) | `Wholesale` (57) | `Clearance` (5) | `Export` (2)  
**creditTerm values:** `30 วัน` (104) | `7 วัน ส่วนลด 2%` (40) | `โอนก่อนส่งของ` (15) | `7วัน ไม่มีส่วนลด` (4) | `ส่งของก่อนค่อยชำระ` (3)

> **Business rule:** ถ้า `creditTerm.includes('2%')` → แสดงปุ่ม "ส่วนลด 2% ท้ายบิล" ใน custInfo card

---

### 2.2 PRODUCTS array — `data.js`
**71 product groups / 208 SKUs** จาก TT_Product_Price.xlsx

```js
{
  id: 'g_charmiss_glowfriend_natural_bl',  // string key (g_ prefix)
  name: 'Charmiss Glowfriend Natural Blush On',
  cat: 'Cheek',                             // หมวดหมู่ (ดูข้างล่าง)
  emoji: '🌸',                              // icon แทนรูปสินค้า
  dealer: 60,                               // ราคา Dealer (บาท)
  wholesale: 67,                            // ราคา Wholesale (บาท)
  variants: [
    {
      label: '01 BEST FRIEND',              // ชื่อ shade / variant
      trCode: '16010',                      // TR Code (อ้างอิงระบบ ERP)
      barcode: '8857127482217',             // บาร์โค้ด 13 หลัก
      price50: null,                        // ราคา 50 ลัง (null = ไม่มี tier นี้)
      price6: null,                         // ราคา 6 ลัง  (null = ไม่มี tier นี้)
    }
  ]
}
```

**หมวดหมู่ (cat):** `Brow` (3) | `Cheek` (25) | `Lip` (13) | `Eye` (3) | `Face` (10) | `Others` (12) | `Skincare` (5)  
**Emoji map:** Brow=✏️ | Eye=👁️ | Cheek=🌸 | Lip=💋 | Face=✨ | Skincare=🧴 | Others=📦

> **Price50/Price6:** มีเฉพาะบางสินค้า เช่น Foundation 5g, Cushion 5g, Primer — ตรวจด้วย `v.price50 != null`

---

### 2.3 State Object S — `order-app.js`

```js
let S = {
  cat: 'ทั้งหมด',         // category filter ที่เลือกอยู่
  cart: [],               // รายการที่เลือก (ดู cart item schema ข้างล่าง)
  orders: [],             // order history (draft + confirmed)
  selCust: null,          // CUSTOMERS entry ที่เลือกอยู่ (หรือ custom obj)
  dateFilter: 'all',      // filter ใน Orders tab
  statusFilter: 'all',    // filter ใน Orders tab
  varModes: {},           // {pid_varLabel: 'dealer'|'wholesale'|'p50'|'p6'|'special'}
  varSpecialPrice: {},    // {pid_varLabel: number}
  varSpecialReason: {},   // {pid_varLabel: string}
  varSkuNotes: {},        // {pid_varLabel: string}  — หมายเหตุ per SKU
  varFreeItems: {},       // {pid_varLabel: [{type:'free'|'tester', qty:N}]}
  billDiscount2pct: false,// ส่วนลดท้ายบิล 2%
  orderAttachments: [],   // [{name, size, file}]  — ไฟล์แนบ
  lastOrderRef: null,
}
```

**Cart item schema:**
```js
{
  pid, name, emoji, cat,
  variant, trCode, barcode,
  qty, mode,                       // mode = price tier
  dp, wp, p50, p6, unitPrice,      // dp=dealer price, wp=wholesale price
  specialPrice, specialReason,
  skuNote,                         // หมายเหตุ SKU
  freeItems: [{type, qty}],        // ของแถม/Tester
}
```

---

### 2.4 TICKETS array — `data.js`

```js
{
  id: 1,
  vendor: 'Beautrium',
  procStatus: 'received',    // pending_att|received|verified|approved|escalated|rejected
  caseType: 'A',             // 'A'=MT PO, 'B'=MT PO+attachment, 'ORDER'=Traditional Trade
  _isMockup: false,          // true = แสดงเฉพาะ SLA Journey demo section
  // ... SLA stage timestamps
}
```

**Channel logic:**  
- MT  = `caseType !== 'ORDER'`  
- TT  = `caseType === 'ORDER'`  
- PO Tickets page แสดงเฉพาะ MT (`caseType !== 'ORDER'`, line ~1021 po-tracker.js)

---

## 3. FUNCTION MAP

### order-app.js — ฟังก์ชันหลัก

| ฟังก์ชัน | หน้าที่ |
|---------|---------|
| `renderCusts()` | สร้างตาราง 5-col ลูกค้า (รหัส/ชื่อ/shopType/priceType/creditTerm) |
| `renderCustInfo()` | card แสดงลูกค้าที่เลือก + ปุ่มส่วนลด 2% |
| `selectCust(id)` | เลือกลูกค้า, reset billDiscount2pct |
| `toggleBillDiscount()` | toggle S.billDiscount2pct, re-render cart |
| `renderPgrid()` | สร้าง **spreadsheet table** สินค้า (psheet) |
| `setPflMode(pid,label,mode)` | เปลี่ยน price tier ของ SKU |
| `adjPflQty / setPflQty` | เพิ่ม/ลด/set จำนวน SKU → add to cart |
| `addPflToCart(pid,label,v,qty)` | push cart item พร้อม freeItems/skuNote |
| `getPflCurrentPrice(pid,label,v)` | คำนวณราคาตาม mode ปัจจุบัน |
| `addFreeItem / adjFreeItem / removeFreeItem` | จัดการ ของแถม/Tester per SKU |
| `setPflSkuNote(pid,label,val)` | บันทึกหมายเหตุ SKU |
| `renderCart()` | render ตะกร้า + freeItems badges |
| `updSum()` | คำนวณ grand total, หัก 2% ถ้า active |
| `handleOrderAttach(input)` | จัดการ file attach (สูงสุด 5 ไฟล์) |
| `openConfirm() / doConfirm()` | confirm dialog + สร้าง Order record |
| `saveDraft()` | บันทึก draft order |
| `resetOrder()` | ล้างทุก state กลับเป็น blank form |
| `renderOrds()` | render Orders list page |
| `orderGoTab(t)` | switch tab 'new'/'orders' |

### CSS Classes หลักที่ใช้บ่อย

| Class | ที่อยู่ | หน้าที่ |
|-------|---------|---------|
| `.psheet-wrap` | style.css | wrapper scrollable ของ product table |
| `.psheet` | style.css | ตาราง spreadsheet สินค้า |
| `.psh-prod-hdr` | style.css | header row ของแต่ละ product group |
| `.psh-code/bc/name/stock/tier/qty/note/free` | style.css | column cells |
| `.ctable` | style.css | ตารางลูกค้า |
| `.cust-list` | style.css | container ตารางลูกค้า (overflow-x:auto) |
| `.var-sku` | style.css | badge TR Code |
| `.var-qbtn / .var-qnum` | style.css | qty +/− controls |
| `.citem` | style.css | cart item row |

---

## 4. Views ทั้งหมด

| View ID | เมนู | หมายเหตุ |
|---------|------|----------|
| `view-dashboard` | 📊 Dashboard | Pie chart + Pipeline + SLA Breach trend |
| `view-sla-journey` | 🗺️ SLA Journey | ทุก Ticket รวม TT, filter: all/mt/tt |
| `view-po-tickets` | 📧 PO Tickets | MT เท่านั้น |
| `view-create-order` | ➕ สร้าง Order | Order App (mobile-first) |
| `view-sales-order` | 📋 Sales Order | ตาราง SO: MT Invoice / MT ไม่มี Invoice / TT |
| `view-admin` | 👤 Admin PO | ภาพรวม admin + ตาราง PO |
| `view-notifications` | 🔔 การแจ้งเตือน | Feed + Tickets ด่วน + Countdown |
| `view-vendors` | 🏪 Vendor Rules | ตาราง Vendor + SLA Rules |

---

## 5. หน้า สร้าง Order — UI Structure

```
view-create-order
└── order-app-wrap
    ├── tab-bar [สร้าง Order | Orders 🔴]
    └── order-pages
        ├── page-new (id="page-new")
        │   ├── card: ข้อมูลลูกค้า
        │   │   ├── search input #cSearch
        │   │   ├── cust-list > ctable > #custListBody (5 cols)
        │   │   └── #custInfo (card + ปุ่มส่วนลด 2%)
        │   ├── card: เลือกสินค้า
        │   │   ├── search input #pSearch
        │   │   ├── category chips #catChips
        │   │   └── #prod-flat-list → renderPgrid() → .psheet table
        │   │       ├── thead: Code|Barcode|Product Name|Allocated Stock|Price Tier|จำนวน|หมายเหตุ|ของแถม
        │   │       ├── .psh-prod-hdr (1 row per product group)
        │   │       └── td rows (1 row per SKU)
        │   ├── card: ตะกร้าสินค้า #cartCard
        │   │   ├── #cartItems
        │   │   ├── #orderNote + file attach input
        │   │   └── #attList
        │   └── #sumWrap
        │       ├── #discountRow (hidden unless 2% active)
        │       └── sbar (grand total + ชิ้น)
        └── page-orders (id="page-orders")
            └── renderOrds() → order cards
```

---

## 6. SLA Stages (7 stages)

```
po → approve_po → open_so → approve_so → doc_wh → delivery → delivered
```

**SLA Rules:**
- รับก่อน 12:00 → ตอบภายใน 09:00 วันถัดไป
- รับหลัง 12:00 → ตอบภายใน 14:00 วันถัดไป

---

## 7. Known Patterns & Rules (อ่านก่อนแก้โค้ด)

### ⚠️ Template Literal ห้ามใช้ nested backtick
- ใช้ string concatenation แทน backtick ใน buildXxx/render functions เสมอ
- ถ้า syntax error ใน po-tracker.js → แปลง backtick เป็น string concat

### ✅ วิธีที่ถูกต้อง: data-* attributes + event delegation (ไม่ใช้ onclick string)
```js
// ✅ ถูก — ไม่มีปัญหา quote collision เลย
html += '<button data-action="setmode" data-vkey="'+vkeyAttr+'" data-mode="dealer">D</button>';
// แล้วใช้ addEventListener บน container แทน
container.addEventListener('click', function(e){
  var el = e.target.closest('[data-action]');
  var action = el.getAttribute('data-action');
  var vkey   = el.getAttribute('data-vkey');   // "pid||variantLabel"
  // vkey separator: "||" (double pipe)
});
```

### ⚠️ vkey format ใน psheet ≠ vkey format ใน MOCK_STOCK
```
psheet vkey = pid + "||" + label   (ใช้ || เป็น separator)
MOCK_STOCK key = pid + "_" + label  (ใช้ _ เป็น separator)
getStock(pid, label) รับ pid และ label แยกกัน → ใช้ได้ทั้งสอง format
```

### ⚠️ onclick ใน HTML string → ใช้ JSON.stringify
```js
// ✅ ถูก
+'<button onclick="setPflMode('+JSON.stringify(pid)+','+JSON.stringify(v.label)+',\'dealer\')">
// ❌ ผิด (quote collision)
+'<button onclick="setPflMode(\''+pid+'\',\''+v.label+'\',...)">'
```

### ⚠️ var ใน loop ไม่ใช้ let/const
```js
// ✅ ถูก (ป้องกัน duplicate declaration error)
for(var i=0; ...) { var x = ...; }
```

### ✅ Performance Tips — Live Server
- renderPgrid เรียกได้บ่อย แต่ใช้ debounce 120ms สำหรับ search
- RENDER_LIMIT=80: ถ้า SKU มากกว่า 80 → บอกให้ user ค้นหาก่อน
- แต่ cart items (qty>0) bypass limit เสมอ
- listener ต้องถูก remove ก่อน re-add ทุกครั้ง: `_pshClickHandler`, `_pshChangeHandler`, `_pshInputHandler`

### ✅ Validate ก่อน deploy เสมอ
```bash
node --check data.js
node --check order-app.js
node --check po-tracker.js
```

---

## 8. TODO / Backlog

- [ ] Backend API / Database (ปัจจุบัน in-memory mock data)
- [ ] Login / Auth system (auth.js เป็น skeleton, CEO=Wilasinee)
- [ ] Google Sheets integration สำหรับ Allocated Stock (loadAllocatedStock ปัจจุบัน mock 1.5s delay)
- [ ] รูปสินค้าจริง (ปัจจุบันใช้ emoji แทน)
- [ ] Real CSV/Excel import สำหรับ PO จาก Email
- [ ] Mobile responsiveness สำหรับ psheet table (ปัจจุบัน overflow-x scroll)
- [x] **RENDER_LIMIT=80 SKUs/render** — ใช้ search/category เพื่อกรอง (cart items แสดงเสมอ)
- [x] **Debounce** renderPgrid 120ms สำหรับ search input
- [x] **removeEventListener** ก่อน addEventListener ทุกครั้ง (ป้องกัน double-fire)
- [ ] Push notification สำหรับ SLA breach

---

## 9. Sessions ที่ผ่านมา (Brief)

| Version | สิ่งที่ทำ |
|---------|----------|
| v1–v10 | Single-file HTML, Order App (mobile-first) |
| v4–v19 | PO Ticket / SLA Tracking System |
| v20–v26 | Merge → Charmiss Portal (single-file) |
| Multi-file | แยก 5 ไฟล์ |
| 2026-03-12 | เพิ่ม TT filter SLA Journey, mockup tickets |
| **2026-03-17 v1** | อัปเดต CUSTOMERS (203 ร้าน) + PRODUCTS (71/208 SKU) จาก Excel, flat product list → psheet table, ปุ่มส่วนลด 2%, ของแถม/Tester, แนบไฟล์ Order |
| **2026-03-17 v2** | Fix: renderCusts data-custid delegation, renderPgrid data-action delegation, full name per row, MOCK_STOCK correct keys, quota warning |
| **2026-03-17 v3** | **Fix: double-fire (+qty) → removeEventListener before re-add; freeze 3 cols (sticky CSS, solid bg); free/tester = input field; price tier mismatch warning + mandatory reason; 2% discount button → cart area; debounce render; RENDER_LIMIT=80 (perf); MOCK_STOCK 166 entries correct IDs** |
