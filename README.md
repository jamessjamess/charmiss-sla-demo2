# Charmiss Portal

Internal web portal for Betime Beauty House (Charmiss brand)  
ระบบติดตาม PO/SLA และจัดการ Sales Order สำหรับ Traditional Trade

## โครงสร้างไฟล์

```
charmiss-portal/
├── index.html        ← เปิดหน้านี้ (HTML layout + navigation)
├── style.css         ← Design system, สี, fonts, component styles
├── data.js           ← ข้อมูลหลัก: VENDORS, TICKETS, CUSTOMERS, PRODUCTS
├── po-tracker.js     ← โมดูล PO/SLA Tracker (logic ทั้งหมด)
├── order-app.js      ← โมดูล Sales Order App + WMS Upload
├── PROJECT_STATUS.md ← สรุปภาพรวมระบบ (อ่านก่อนทำงานกับ AI)
└── README.md         ← ไฟล์นี้
```

## ถ้าต้องการแก้ข้อมูล

| ต้องการแก้ | เปิดไฟล์ |
|-----------|---------|
| เพิ่ม/แก้ลูกค้า | `data.js` → หา `CUSTOMERS` |
| เพิ่ม/แก้สินค้า หรือราคา | `data.js` → หา `PRODUCTS` |
| เพิ่ม Vendor ใหม่ | `data.js` → หา `VENDORS` |
| แก้ SLA Rules | `po-tracker.js` → หา `getSLADeadline` |
| แก้หน้าตา / สี | `style.css` → หา `:root` |

## วิธีใช้กับ AI (Claude)

เมื่อต้องการแก้งาน ให้แนบไฟล์เฉพาะส่วนที่เกี่ยวข้อง:

- แก้ข้อมูลอย่างเดียว → แนบแค่ `data.js`
- แก้ PO/SLA logic → แนบ `po-tracker.js` + `PROJECT_STATUS.md`
- แก้ Order App → แนบ `order-app.js` + `PROJECT_STATUS.md`
- แก้หน้าตา UI → แนบ `index.html` + `style.css`

## Live URL

Your site is live at 
https://jamessjamess.github.io/charmiss-sla-demo2/
