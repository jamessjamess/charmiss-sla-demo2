# Charmiss Portal — PROJECT_STATUS.md
_Last updated: 2026-03-12_

---

## โครงสร้างไฟล์ (Multi-file)

| ไฟล์ | หน้าที่ |
|------|---------|
| `index.html` | HTML shell: Sidebar, Views, Modals, Script tags |
| `style.css` | CSS ทั้งหมด (Portal + Order App) |
| `data.js` | ข้อมูลหลัก: VENDORS, TICKETS, STAGES, CUSTOMERS, PRODUCTS, NOTIFICATIONS |
| `po-tracker.js` | Logic: SLA Journey, PO Tickets, Dashboard, Admin, Vendors, Notifications |
| `order-app.js` | Logic: สร้าง Order, Sales Order |

โหลดตามลำดับ: `data.js` → `po-tracker.js` → `order-app.js`

---

## หน้าทั้งหมด (Views)

| View ID | เมนู | หมายเหตุ |
|---------|------|----------|
| `view-dashboard` | 📊 Dashboard | Pie chart + Pipeline + SLA Breach trend + SO Channel |
| `view-sla-journey` | 🗺️ SLA Journey | ติดตาม Journey ทุก Ticket รวมถึง Traditional Trade |
| `view-po-tickets` | 📧 PO Tickets | MT เท่านั้น (ไม่มี Traditional Trade) |
| `view-create-order` | ➕ สร้าง Order | Sales Order App (mobile-first) |
| `view-sales-order` | 📋 Sales Order | ตาราง SO แยก channel: MT มี Invoice / MT ไม่มี Invoice / TT |
| `view-admin` | 👤 Admin PO | ภาพรวม admin + ตาราง PO |
| `view-notifications` | 🔔 การแจ้งเตือน | Feed + Tickets ด่วน + Countdown |
| `view-vendors` | 🏪 Vendor Rules | ตาราง Vendor + SLA Rules |

---

## data.js — TICKETS สำคัญ

### Real Tickets (แสดงทุกหน้า)

| id | vendor | สถานะ (procStatus) | caseType | หมายเหตุ |
|----|--------|-------------------|----------|----------|
| 1 | Beautrium | received | A | รอกดรับงาน |
| 2 | CJ Express | verified | A | Delivered แล้ว |
| 3 | Eveandboy | escalated | A | Stuck ที่ approve_po |
| 4 | Konvy | received | A | รอกดรับงาน |
| 5 | Lotus | pending_att | B | มี subTasks |
| 6 | Tsuruha | verified | A | อยู่ที่ delivery |
| 7 | Watsons | received | A | รอกดรับงาน |
| 8 | 24Shopping (7-11) | received | A | canceled |
| 9 | Multy | approved | A | approved แล้ว |
| 20 | Traditional Trade | approved | ORDER | ร้านทองแสงหล้า — อยู่ที่ doc_wh |
| 21 | Traditional Trade | verified | ORDER | ร้านมณีเภสัช — stuck ที่ approve_po |
| 35 | Lotus | verified | A | TIMS system |
| 36-38 | 24Shopping (7-11) | various | A | หลาย PO |

### Mockup Tickets (_isMockup: true — แสดงใน SLA Journey ด้านล่าง)

| id | vendor | ค้างที่ stage | channel |
|----|--------|--------------|---------|
| 101 | Beautrium | po (รับ Email) | MT |
| 102 | Konvy | approve_po | MT |
| 103 | Watsons | open_so | MT |
| 104 | CJ Express | approve_so | MT |
| 105 | Tsuruha | doc_wh | MT |
| 106 | Eveandboy | delivery | MT |
| 107 | Multy | delivered (รอ confirm) | MT |
| 108 | 24Shopping (7-11) | open_so + approve_so | MT |
| 120 | Traditional Trade | approve_po | TT |
| 121 | Traditional Trade | open_so | TT |
| 122 | Traditional Trade | delivery | TT |

---

## Logic สำคัญใน po-tracker.js

### Channel Filter (SLA Journey)
- `all` = ทั้งหมด (MT + TT)
- `mt` = caseType !== 'ORDER'
- `tt` = caseType === 'ORDER'

### PO Tickets
- แสดงเฉพาะ `caseType !== 'ORDER'` (line 1021)
- Traditional Trade ไม่ปรากฎในหน้านี้

### SLA Rules
- รับ Email ก่อน 12:00 → Confirm ภายใน 09:00 วันถัดไป
- รับ Email หลัง 12:00 → Confirm ภายใน 14:00 วันถัดไป

### renderTickets() Filter Tabs
- `all` / `pending_att` / `received` / `verified` / `approved` / `rejected`

---

## Technical Notes

### Known Fix Pattern (Template Literal Issue)
ถ้า syntax error ใน po-tracker.js ให้ใช้ string concatenation แทน backtick template literal ใน buildXxxHtml functions ทั้งหมด ห้ามใช้ nested backtick

### Variable Declarations
- ใช้ `var` ใน loop (ไม่ใช้ `let`) เพื่อหลีกเลี่ยง duplicate declaration error
- ตรวจสอบด้วย `node --check filename.js` ก่อน deploy เสมอ

---

## Sessions ที่ผ่านมา (Brief)

- **v1–v10**: Single-file HTML, สร้าง Order App (mobile-first)
- **v4–v19**: PO Ticket / SLA Tracking System
- **v20–v26**: Merge ทั้ง 2 ระบบ → Charmiss Portal (single-file)
- **Multi-file Split**: แยกเป็น 5 ไฟล์ (index.html + style.css + data.js + po-tracker.js + order-app.js)
- **ปัจจุบัน**: เพิ่ม Traditional Trade ใน SLA Journey filter, เพิ่ม mockup tickets ครบทุก stage

---

## TODO / Backlog
- [ ] Backend API / Database (ปัจจุบันยังเป็น in-memory mock data)
- [ ] Login / Auth system
- [ ] Real CSV/Excel import สำหรับ PO จาก Email
- [ ] Mobile responsiveness สำหรับ SLA Journey table
- [ ] Push notification สำหรับ SLA breach
