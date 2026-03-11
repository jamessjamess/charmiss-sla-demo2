// ─── VENDOR DATA ───
const VENDORS={
  'Watsons':         {color:'#4F46E5',bg:'#E0E7FF',logo:'WT',
                      email:'@aswatson.net',
                      subject:'Non EDI PO from Central Watson',
                      slaNote:'รับ PO ก่อน 12:00 → Confirm ภายใน 09:00 วันถัดไป / รับหลัง 12:00 → Confirm ภายใน 14:00 วันถัดไป',
                      deliveryNote:'ส่งสินค้าที่ DC Watsons ตาม Delivery date ในใบ PO'},
  'Beautrium':       {color:'#B45309',bg:'#FEF3C7',logo:'BT',
                      email:'@thebeautrium.com',
                      subject:'[BEAUTRIUM] Purchase Order (PO)',
                      slaNote:'ส่ง Confirm ภายใน 24 ชม. หลังรับ PO',
                      deliveryNote:'ส่งที่ Beautrium DC พร้อมใบ Invoice & ใบส่งสินค้าอย่างละ 3 ใบ'},
  'Eveandboy':       {color:'#7C3AED',bg:'#EDE9FE',logo:'EB',
                      email:'autoreport@eveandboy.com',
                      subject:'Eveandboy : ใบสั่งของ',
                      slaNote:'Reply ยืนยันรายการและวันส่ง ภายใน 24 ชม.',
                      deliveryNote:'ส่งสินค้าที่สาขา เวลา 09:00–15:00 น. ตาม PO แต่ละสาขา'},
  'Konvy':           {color:'#059669',bg:'#D1FAE5',logo:'KV',
                      email:'@konvy.com',
                      subject:'Konvy PO to Brand',
                      slaNote:'Confirm รายการ+วันส่ง Reply กลับ Email นี้',
                      deliveryNote:'รับสินค้าอายุ 17 เดือนขึ้นไป / ต่ำกว่า 12 เดือนต้องขออนุมัติก่อน'},
  'Multy':           {color:'#DC2626',bg:'#FEE2E2',logo:'MT',
                      email:'@multybeauty.com',
                      subject:'MULTY Purchasing Order',
                      slaNote:'Confirm ภายใน 2 วันทำการ',
                      deliveryNote:'ส่งสินค้าพร้อม Invoice + GR ที่ Multy DC'},
  'CJ Express':      {color:'#1D4ED8',bg:'#DBEAFE',logo:'CJ',
                      email:'SAPSENDER@cjexpress.co.th',
                      subject:'PO No.',
                      slaNote:'Confirm ภายใน 24 ชม. — ค่าปรับ 10% หากส่งสินค้าไม่ครบ',
                      deliveryNote:'ส่งตรง DC CJ ตาม Delivery date ที่ระบุในใบ PO'},
  'Tsuruha':         {color:'#0891B2',bg:'#CFFAFE',logo:'TS',
                      email:'tgs_auto_mail03@tsuruha.co.th',
                      subject:'Ordering Data (สั่ง)',
                      slaNote:'Reply Confirm รายการ+วันส่งภายใน 2 วันทำการ',
                      deliveryNote:'ส่งที่ Tsuruha DC ตาม Delivery date พร้อมเอกสารครบ'},
  'Lotus':           {color:'#2E7D32',bg:'#E8F5E9',logo:'LT',
                      email:'noreply@lotus-supplier.co.th',
                      subject:'[Lotus] New PO Notification',
                      portal:'https://supplier.lotuss.co.th',
                      slaNote:'Email เป็นแค่การแจ้งเตือน — ต้อง Login Lotus Supplier Portal เพื่อรับใบ PO จริง',
                      deliveryNote:'Download ใบ PO จาก Lotus Supplier Portal แล้วดำเนินการผ่านระบบ Portal'},
  '24Shopping (7-11)':{color:'#6B7280',bg:'#F3F4F6',logo:'7E',
                      email:'@cpall.co.th',
                      subject:'PO "2038',
                      slaNote:'Confirm ผ่าน Portal CPALL ภายใน 48 ชม.',
                      deliveryNote:'ส่งที่ 7-Eleven DC ตาม zone ที่ระบุในใบ PO'},
  'Traditional Trade':{color:'#166534',bg:'#DCFCE7',logo:'TT',
                      email:'@internal',
                      subject:'Order',
                      slaNote:'ออกใบ SO ผ่านระบบภายใน 1 วันทำการ',
                      deliveryNote:'ส่งตรงให้ลูกค้า / ร้านค้า Traditional Trade'},
};

const now=Date.now();

// Tickets now include journey stages
const TICKETS=[
  {id:1,vendor:'Beautrium',subject:'[BEAUTRIUM] Purchase Order (PO)',poRef:'BT-PO-20250805-001',
   caseType:'A',procStatus:'received',
   attachments:[{name:'POW2S-2603-0026.pdf',url:'#',poRef:'POW2S-2603-0026',ext:'pdf'},{name:'Product_List_Aug.xlsx',url:'#',poRef:'BT-PO-20250805-001',ext:'xlsx'}],
   status:'pending',startTs:now-5.5*3600000,cancelReason:'',emailFrom:'Peerada_Bo@thebeautrium.com',
   emailBody:'เรียน บริษัทคู่ค้า\nบิวเทรี่ยมขอนำส่งใบสั่งซื้อ (PO) รายละเอียดดังเอกสารแนบ รบกวนตรวจสอบรายการสินค้า และขอความร่วมมือแจ้งรายการสินค้าที่ขาดส่ง กลับให้ทางบิวเทรี่ยมด้วยค่ะ',
   journey:{po:{done:true,ts:now-5.5*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po'},
  {id:2,vendor:'CJ Express',subject:'PO No. 4003280436',poRef:'4003280436',
   caseType:'A',procStatus:'verified',
   attachments:[{name:'PO No. 4003280436.pdf',url:'#',poRef:'4003280436',ext:'pdf'}],
   status:'confirmed',startTs:now-8*3600000,cancelReason:'',emailFrom:'SAPSENDER@cjexpress.co.th',
   emailBody:'ใบสั่งซื้อเลขที่ PO 4003280436 วันที่ 10.03.2026 จากบริษัท ซี.เจ. เอ็กซ์เพรส กรุ๊ป จำกัด ขอความร่วมมือในการส่งสินค้าให้ครบตามจำนวนที่สั่ง และตรงตามวันที่กำหนดส่งสินค้า เพื่อหลีกเลี่ยงค่าปรับ 10% จากมูลค่าขาดส่งสินค้า\n\nอีเมลล์ฉบับนี้ถูกส่งจากระบบอัตโนมัติ และไม่มีการรองรับการตอบกลับ หากพบปัญหา กรุณาติดต่อเจ้าหน้าที่แผนกเติมสินค้า (RPM)',
   journey:{po:{done:true,ts:now-8*3600000},approve_po:{done:true,ts:now-7*3600000},open_so:{done:true,ts:now-6*3600000},approve_so:{done:true,ts:now-5*3600000},doc_wh:{done:true,ts:now-4*3600000},delivery:{done:true,ts:now-2*3600000},delivered:{done:true,ts:now-1*3600000}},
   currentStage:'delivered'},
  {id:3,vendor:'Eveandboy',subject:'Eveandboy : ใบสั่งของ จำนวน 49 ใบ Charmiss',poRef:'POD260135162',
   caseType:'A',procStatus:'escalated',
   attachments:[
     {name:'POD260135162_CHARMISS_SIAM SQUARE ONE.pdf',url:'#',poRef:'POD260135162',ext:'pdf',branch:'SIAM SQUARE ONE'},
     {name:'POD260135162_CHARMISS_SIAM SQUARE ONE.xlsx',url:'#',poRef:'POD260135162',ext:'xlsx',branch:'SIAM SQUARE ONE'},
     {name:'POD260135161_CHARMISS_TERMINAL 21 KORAT.pdf',url:'#',poRef:'POD260135161',ext:'pdf',branch:'TERMINAL 21 KORAT'},
     {name:'POD260135161_CHARMISS_TERMINAL 21 KORAT.xlsx',url:'#',poRef:'POD260135161',ext:'xlsx',branch:'TERMINAL 21 KORAT'},
     {name:'POD260135160_CHARMISS_MEGA BANGNA.pdf',url:'#',poRef:'POD260135160',ext:'pdf',branch:'MEGA BANGNA'},
     {name:'POD260135160_CHARMISS_MEGA BANGNA.xlsx',url:'#',poRef:'POD260135160',ext:'xlsx',branch:'MEGA BANGNA'},
   ],
   status:'pending',startTs:now-26*3600000,cancelReason:'',emailFrom:'autoreport@eveandboy.com',
   emailBody:'รบกวนตอบกลับ วันที่ส่งสินค้าและการจัดเรียง สาขาใหม่สำหรับแบรนด์ที่เข้าร่วม\n\nเรียน คู่ค้า\nเรื่อง การสั่งซื้อสินค้า (ส่งสินค้าที่สาขาในช่วงเวลา 09.00 - 15.00 น)\n\nสิ่งที่ส่งมาด้วย\n1. ใบสั่งซื้อสินค้า (PO)\nPOD260135162 — SIAM SQUARE ONE\nPOD260135161 — TERMINAL 21 KORAT\nPOD260135160 — MEGA BANGNA',
   journey:{po:{done:true,ts:now-26*3600000},approve_po:{done:false,ts:null,stuck:true},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po'},
  {id:4,vendor:'Konvy',subject:'Konvy PO to Brand Charmiss (106128)',poRef:'106128',
   caseType:'A',procStatus:'received',
   attachments:[{name:'106128 Charmiss.pdf',url:'#',poRef:'106128',ext:'pdf'}],
   status:'pending',startTs:now-1.5*3600000,cancelReason:'',emailFrom:'yanisa.r@konvy.com',
   emailBody:'เรียน คู่ค้า\nขออนุญาตนำส่ง PO ตามไฟล์แนบค่ะ PO มีอายุ 14 วัน นับจาก Delivery date จัดส่งสินค้าที่ Warehouse ตามแผนที่แนบมา\n\nรบกวน confirm รายการ/จำนวน และทาง Konvy มีนโยบายรับสินค้าอายุ 17 เดือนขึ้นไป ตามในเงื่อนไขด้านล่างของใบ PO\n\nกรณีที่สินค้ามีอายุต่ำกว่า 12 เดือน ทางแบรนด์จำเป็นต้องแจ้งขออนุมัติก่อนส่งสินค้าทุกครั้ง พร้อมแจ้งวันที่จัดส่งสินค้ากลับมาทาง E-mail นี้ด้วยค่ะ',
   journey:{po:{done:true,ts:now-1.5*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'po'},
  {id:5,vendor:'Lotus',subject:'[Lotus] New PO Notification — PO2025-08-CHARM-001',poRef:'LT-2025-08-CHARM-001',
   caseType:'B',procStatus:'pending_att',
   attachments:[],
   status:'pending_att',startTs:now-4*3600000,cancelReason:'',emailFrom:'noreply@lotus-supplier.co.th',
   portalUrl:'https://supplier.lotuss.co.th',
   subTasks:[
     {id:'st1',label:'เข้า Lotus Supplier Portal',done:true, ts:now-3.8*3600000},
     {id:'st2',label:'Download ใบ PO จาก Portal',done:false,ts:null},
     {id:'st3',label:'แนบ PDF เข้า Ticket นี้',   done:false,ts:null},
     {id:'st4',label:'Forward ให้ mt.sales@charmiss.co', done:false,ts:null},
   ],
   journey:{po:{done:true,ts:now-4*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'po'},
  {id:6,vendor:'Tsuruha',subject:'[04/03/2026] Ordering Data (สั่ง)',poRef:'PO00126010074',
   caseType:'A',procStatus:'verified',
   attachments:[
     {name:'PO00126010074.pdf',url:'#',poRef:'PO00126010074',ext:'pdf'},
     {name:'PO00126010074.xlsx',url:'#',poRef:'PO00126010074',ext:'xlsx'},
     {name:'PO00126010075.pdf',url:'#',poRef:'PO00126010075',ext:'pdf'},
     {name:'PO00126010075.xlsx',url:'#',poRef:'PO00126010075',ext:'xlsx'},
     {name:'PO00126010076.pdf',url:'#',poRef:'PO00126010076',ext:'pdf'},
     {name:'PO00126010076.xlsx',url:'#',poRef:'PO00126010076',ext:'xlsx'},
   ],
   status:'confirmed',startTs:now-10*3600000,cancelReason:'',emailFrom:'tgs_auto_mail03@tsuruha.co.th',
   emailBody:'[04/03/2026] Ordering Data (สั่ง)\n\nรายการ PO ที่แนบมาในอีเมลนี้:\n- PO00126-010074\n- PO00126-010075\n- PO00126-010076\n\nหมายเหตุ: ชื่อไฟล์ PDF/XLSX เป็นเอกสารเดียวกัน ต่างกันแค่ Format',
   journey:{po:{done:true,ts:now-10*3600000},approve_po:{done:true,ts:now-9*3600000},open_so:{done:true,ts:now-8*3600000},approve_so:{done:true,ts:now-6*3600000},doc_wh:{done:true,ts:now-4*3600000},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'delivery'},
  {id:7,vendor:'Watsons',subject:'Non EDI PO from Central Watson Co.,Ltd For 1111977701-BETIME BEAUTY HOUSE',poRef:'PO22940193',
   caseType:'A',procStatus:'received',
   attachments:[
     {name:'1111977701_20260310073206.zip',url:'#',poRef:'PO22940193',ext:'zip'},
     {name:'FAX1111977701_026652000_PO22940193_795955.pdf',url:'#',poRef:'PO22940193',ext:'pdf'},
     {name:'FAX1111977701_026652000_PO22940194_795956.pdf',url:'#',poRef:'PO22940194',ext:'pdf'},
   ],
   status:'pending',startTs:now-0.8*3600000,cancelReason:'',emailFrom:'app_group@aswatson.net',
   emailBody:'Dear All\n        Please find NON EDI PO in the attachment.\n\nBest Regards,\nIT Application Team',
   journey:{po:{done:true,ts:now-0.8*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'po'},
  {id:8,vendor:'24Shopping (7-11)',subject:'PO "2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์" เตรียมสินค้าเข้าคลัง',poRef:'PO_CT33530743',
   caseType:'A',procStatus:'received',
   attachments:[
     {name:'PO_CT33530743.pdf',url:'#',poRef:'PO_CT33530743',ext:'pdf'},
     {name:'PO_CT33530345.pdf',url:'#',poRef:'PO_CT33530345',ext:'pdf'},
   ],
   status:'canceled',startTs:now-12*3600000,cancelReason:'PO ซ้ำซ้อน',emailFrom:'rpa-notification@cpall.co.th',
   emailBody:'เรียน 2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์\n\nรบกวนจัดเตรียมสินค้าพร้อมจัดส่ง รายละเอียดตาม PO แนบ\n\nการจัดเตรียมสินค้าเข้าคลังวันที่ 06/03/2569\n- สินค้าต้องมี สคบ. ภาษาไทยและ Barcode ติดทุกชิ้น\n- สินค้าติดรหัสสินค้า (AMOS) 6 หลัก (ติดทุกชิ้น)',
   journey:{po:{done:true,ts:now-12*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'canceled'},

  // ── ORDER-SOURCED TICKETS (from สร้าง Order system) ──
  {id:20,vendor:'Traditional Trade',subject:'Order: สร้าง Order — ร้านทองแสงหล้า',poRef:'ORD-260311-001',
   caseType:'ORDER',procStatus:'approved',
   attachments:[],
   status:'pending',startTs:now-2*24*3600000+3*3600000,cancelReason:'',emailFrom:'system@charmiss.internal',
   approvedAt:now-2*24*3600000+5*3600000,
   emailBody:'Order สร้างโดย: ฝนเทพ (Sales) ลูกค้า: ร้านทองแสงหล้า ยอดรวม: 15,400 บาท สินค้า 6 รายการ',
   journey:{
     po:{done:true,ts:now-2*24*3600000+3*3600000,stuck:false},
     approve_po:{done:true,ts:now-2*24*3600000+4*3600000,stuck:false},
     open_so:{done:true,ts:now-2*24*3600000+6*3600000,stuck:false},
     approve_so:{done:true,ts:now-2*24*3600000+8*3600000,stuck:false},
     doc_wh:{done:false,ts:null,stuck:false},
     delivery:{done:false,ts:null,stuck:false},
     delivered:{done:false,ts:null,stuck:false},
   },
   currentStage:'doc_wh',stuckReason:''},

  {id:21,vendor:'Traditional Trade',subject:'Order: สร้าง Order — ร้านมณีเภสัช',poRef:'ORD-260310-002',
   caseType:'ORDER',procStatus:'verified',
   attachments:[],
   status:'pending',startTs:now-1*24*3600000+1*3600000,cancelReason:'',emailFrom:'system@charmiss.internal',
   approvedAt:null,
   emailBody:'Order สร้างโดย: สิริกาญจน์ (Sales) | ลูกค้า: ร้านมณีเภสัช | ยอดรวม: 8,750 บาท | สินค้า 4 รายการ',
   journey:{
     po:{done:true,ts:now-1*24*3600000+1*3600000,stuck:false},
     approve_po:{done:false,ts:now-1*24*3600000+1*3600000,stuck:true},
     open_so:{done:false,ts:null,stuck:false},
     approve_so:{done:false,ts:null,stuck:false},
     doc_wh:{done:false,ts:null,stuck:false},
     delivery:{done:false,ts:null,stuck:false},
     delivered:{done:false,ts:null,stuck:false},
   },
   currentStage:'approve_po',stuckReason:'รอ Approve Order จาก Sales Manager'},

  // approved & rejected demo tickets (ensure all filter tabs have data)
  {id:9,vendor:'Multy',subject:'MULTY Purchasing Order — PO2026020200019',poRef:'PO2026020200019',
   caseType:'A',procStatus:'approved',
   attachments:[
     {name:'PO2026020200019_20260202140456.pdf',url:'#',poRef:'PO2026020200019',ext:'pdf'},
     {name:'PO2026020200018_20260202140501.pdf',url:'#',poRef:'PO2026020200018',ext:'pdf'},
   ],
   status:'pending',startTs:now-3*3600000,cancelReason:'',emailFrom:'noreply2@multybeauty.com',
   approvedAt:now-2.5*3600000,
   emailBody:'* สินค้าที่จัดส่งต้องมีอายุไม่ต่ำกว่า 12 เดือนขึ้นไป*\n** วัน เวลา และที่อยู่ในการจัดส่งสินค้า รายละเอียดตามไฟล์แนบ\n*** กรุณาจัดส่งสินค้าตามวันส่งสินค้าที่ระบุใน PO',
   journey:{po:{done:true,ts:now-3*3600000},approve_po:{done:true,ts:now-2.5*3600000},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so'},

  // ─── MOCKUP: ตัวอย่างเอกสารค้างในแต่ละ Stage ───
  {id:101,vendor:'Beautrium',subject:'[MOCKUP] BT-PO-20250801-007 — ค้างที่ PO / รับ Email',poRef:'BT-PO-20250801-007',
   caseType:'A',procStatus:'received',
   _isMockup:true, stuckReason:'📥 Email เข้าระบบแล้ว แต่ยังไม่มีใครหยิบขึ้นมาดำเนินการ — รอ Assign งานอยู่นานกว่า 38 ชั่วโมง',
   attachments:[],
   status:'pending',startTs:now-38*3600000,risk:'high',cancelReason:'',emailFrom:'purchasing@beautrium.com',
   journey:{po:{done:false,ts:null,stuck:true},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'po'},

  {id:102,vendor:'Konvy',subject:'[MOCKUP] KV-106055 — ค้างที่ Approve PO นาน 2 วัน',poRef:'KV-106055',
   caseType:'A',procStatus:'escalated',
   _isMockup:true, stuckReason:'✍️ รอผู้มีอำนาจอนุมัติ PO — ผู้อนุมัติลาออกนอก ไม่มีการ Delegate งาน ทำให้ PO ค้างอยู่นาน 52 ชั่วโมง',
   attachments:[{name:'Konvy_PO_106055.pdf',url:'#'}],
   status:'pending',startTs:now-52*3600000,risk:'high',cancelReason:'',emailFrom:'procurement@konvy.com',
   journey:{po:{done:true,ts:now-52*3600000},approve_po:{done:false,ts:null,stuck:true},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po'},

  {id:103,vendor:'Watsons',subject:'[MOCKUP] WT-NEDI-0730-03 — ค้างที่ เปิด SO',poRef:'WT-NEDI-0730-03',
   caseType:'B',procStatus:'pending_att',
   _isMockup:true, stuckReason:'📋 ระบบ ERP มีปัญหา ไม่สามารถสร้าง SO ได้ — ทีม IT กำลังแก้ไข รอการ Resolve มาแล้ว 2 วัน',
   attachments:[{name:'Watsons_PO_0730.pdf',url:'#'}],
   status:'pending',startTs:now-60*3600000,risk:'high',cancelReason:'',emailFrom:'noneditpo@aswatson.net',
   journey:{po:{done:true,ts:now-60*3600000},approve_po:{done:true,ts:now-58*3600000},open_so:{done:false,ts:null,stuck:true},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so'},

  {id:104,vendor:'CJ Express',subject:'[MOCKUP] PO No. 20250729002 — ค้างที่ Approve SO / Invoice',poRef:'20250729002',
   caseType:'A',procStatus:'escalated',
   _isMockup:true, stuckReason:'🧾 ราคาสินค้าใน SO ไม่ตรงกับ PO ต้นฉบับ — ต้องแก้ไข Invoice ก่อน Approve ทำให้ติดค้าง 72 ชั่วโมง',
   attachments:[{name:'CJ_PO_20250729002.pdf',url:'#'}],
   status:'pending',startTs:now-72*3600000,risk:'high',cancelReason:'',emailFrom:'po@cjexpress.co.th',
   journey:{po:{done:true,ts:now-72*3600000},approve_po:{done:true,ts:now-70*3600000},open_so:{done:true,ts:now-68*3600000},approve_so:{done:false,ts:null,stuck:true},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_so'},

  {id:105,vendor:'Tsuruha',subject:'[MOCKUP] TS-20250727 — ค้างที่ ส่งเอกสารให้คลัง',poRef:'TS-20250727',
   caseType:'A',procStatus:'verified',
   _isMockup:true, stuckReason:'📦 เอกสารถูกส่งอีเมลไปแล้ว แต่คลังไม่ได้รับ — อาจติด Spam Filter หรือ Email ผิด ต้องส่งซ้ำ',
   attachments:[{name:'Tsuruha_OrderData_27072025.pdf',url:'#'}],
   status:'pending',startTs:now-80*3600000,risk:'med',cancelReason:'',emailFrom:'ordering@tsuruha.co.th',
   journey:{po:{done:true,ts:now-80*3600000},approve_po:{done:true,ts:now-78*3600000},open_so:{done:true,ts:now-75*3600000},approve_so:{done:true,ts:now-72*3600000},doc_wh:{done:false,ts:null,stuck:true},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'doc_wh'},

  {id:106,vendor:'Eveandboy',subject:'[MOCKUP] EB-2025-0726-012 — ค้างที่ จัดส่งสินค้า',poRef:'EB-2025-0726-012',
   caseType:'A',procStatus:'verified',
   _isMockup:true, stuckReason:'🚚 Logistic Partner แจ้งว่าสินค้าไม่พร้อมส่ง — รอ Stock เติมจาก Supplier ใช้เวลา 3–5 วัน',
   attachments:[{name:'EB_PO_Jul2025_12items.pdf',url:'#'}],
   status:'pending',startTs:now-90*3600000,risk:'med',cancelReason:'',emailFrom:'po@eveandboy.com',
   journey:{po:{done:true,ts:now-90*3600000},approve_po:{done:true,ts:now-88*3600000},open_so:{done:true,ts:now-85*3600000},approve_so:{done:true,ts:now-82*3600000},doc_wh:{done:true,ts:now-78*3600000},delivery:{done:false,ts:null,stuck:true},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'delivery'},

  {id:107,vendor:'Multy',subject:'[MOCKUP] MT-PO-0724-2025 — ค้างที่ ยืนยันการรับสินค้า',poRef:'MT-PO-0724-2025',
   caseType:'B',procStatus:'verified',
   _isMockup:true, stuckReason:'🎉 สินค้าถูกส่งถึงแล้ว แต่ Vendor ยังไม่ยืนยันรับของใน Portal — รอ Sign-off มาแล้ว 40 ชั่วโมง',
   attachments:[{name:'Multy_PO_0724.pdf',url:'#'}],
   status:'pending',startTs:now-100*3600000,risk:'low',cancelReason:'',emailFrom:'order@multybeauty.com',
   journey:{po:{done:true,ts:now-100*3600000},approve_po:{done:true,ts:now-98*3600000},open_so:{done:true,ts:now-95*3600000},approve_so:{done:true,ts:now-92*3600000},doc_wh:{done:true,ts:now-88*3600000},delivery:{done:true,ts:now-40*3600000},delivered:{done:false,ts:null,stuck:true}},
   currentStage:'delivered'},

  {id:108,vendor:'24Shopping (7-11)',subject:'[MOCKUP] PO "2038877 — Escalate หลาย Stage',poRef:'2038877',
   caseType:'A',procStatus:'escalated',
   _isMockup:true, stuckReason:'🔴 Escalate: ไม่ผ่านทั้ง เปิด SO และ Approve SO — ข้อมูลสินค้าผิดตั้งแต่ต้น ต้องแก้ไข PO กับ Vendor ก่อนดำเนินการต่อ',
   attachments:[{name:'7-11_PO_2038877.pdf',url:'#'},{name:'7-11_ItemList.xlsx',url:'#'}],
   status:'pending',startTs:now-120*3600000,risk:'high',cancelReason:'',emailFrom:'po@cpall.co.th',
   journey:{po:{done:true,ts:now-120*3600000},approve_po:{done:true,ts:now-115*3600000},open_so:{done:false,ts:null,stuck:true},approve_so:{done:false,ts:null,stuck:true},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so'},
];

const STAGES=[
  {key:'po',        label:'เปิด PO / Order',          icon:'📧',shortLabel:'เปิด PO/Order'},
  {key:'approve_po',label:'Appv PO/Order',             icon:'✅',shortLabel:'Appv PO/Order'},
  {key:'open_so',   label:'เปิด SO',                   icon:'📋',shortLabel:'เปิด SO'},
  {key:'approve_so',label:'Approve SO / เปิด Invoice', icon:'🧾',shortLabel:'Appv SO/Inv'},
  {key:'doc_wh',    label:'ส่งเอกสารให้คลัง',           icon:'📦',shortLabel:'ส่งเอกสาร'},
  {key:'delivery',  label:'จัดส่งสินค้า (Delivery)',    icon:'🚚',shortLabel:'Delivery'},
  {key:'delivered', label:'จัดส่งสำเร็จ',               icon:'🎉',shortLabel:'สำเร็จ'},
];

const CANCEL_REASONS=[
  {icon:'🔁',label:'PO ซ้ำซ้อน',desc:'มี PO เลขเดิมในระบบแล้ว'},
  {icon:'📅',label:'วันส่งชนวันหยุด',desc:'ไม่สามารถส่งสินค้าได้ตามกำหนด'},
  {icon:'📦',label:'ยอดไม่ถึง MOQ',desc:'ปริมาณสั่งซื้อต่ำกว่าขั้นต่ำ'},
  {icon:'❌',label:'ไม่เกี่ยวข้อง',desc:'Email ไม่ใช่ PO ของเรา'},
  {icon:'🔄',label:'PO ถูกยกเลิกโดย Vendor',desc:'Vendor แจ้งยกเลิก PO นี้'},
  {icon:'📋',label:'อื่นๆ',desc:'ระบุเหตุผลเพิ่มเติม'},
];

const NOTIFICATIONS=[
  {id:1,type:'sla',icon:'🚨',title:'SLA เกินกำหนด — Eveandboy',desc:'PO ใบสั่งของ 49 ใบ ยังไม่ผ่าน Approve PO — เกิน SLA แล้ว',time:'30 นาทีที่แล้ว',unread:true},
  {id:2,type:'new',icon:'📧',title:'PO ใหม่จาก Watsons',desc:'Non EDI PO from Central Watson — รับเข้าระบบแล้ว',time:'48 นาทีที่แล้ว',unread:true},
  {id:3,type:'sla',icon:'⚠️',title:'ใกล้ครบ SLA — Beautrium',desc:'ต้องผ่าน Approve PO ภายใน 09:00 น. พรุ่งนี้',time:'1 ชั่วโมงที่แล้ว',unread:true},
  {id:4,type:'new',icon:'📧',title:'PO ใหม่จาก Konvy',desc:'Konvy PO to Brand Charmiss (106128)',time:'1.5 ชั่วโมงที่แล้ว',unread:false},
  {id:5,type:'system',icon:'✅',title:'Tsuruha — Invoice ส่งแล้ว',desc:'เอกสาร Ordering Data 04/08/2025 อยู่ใน Stage Delivery',time:'2 ชั่วโมงที่แล้ว',unread:false},
  {id:6,type:'system',icon:'🚫',title:'24Shopping ถูกยกเลิก',desc:'Admin ยกเลิก PO 2038491 — เหตุผล: PO ซ้ำซ้อน',time:'3 ชั่วโมงที่แล้ว',unread:false},
];

// ─── STATE ───
var STAGE_REMARKS = {};  // key: ticketId+'_'+stageKey → {text, images:[...]}
var REMARK_OPEN = {};    // key: ticketId+'_'+stageKey → bool (expanded?)
var STAGE_ACTIONS = {
  po:        { label:'กดรับงาน PO',     icon:'📥', url:'#confirm-po' },
  open_so:   { label:'เปิด SO ใน ERP',  icon:'📋', url:'#erp-so' },
  approve_so:{ label:'Approve SO',       icon:'✅', url:'#erp-approve' },
  doc_wh:    { label:'Upload เอกสารคลัง',icon:'📤', url:'#wh-upload' },
  delivery:  { label:'แจ้ง Logistics',   icon:'🚚', url:'#logistics' },
  approve_po:{ label:'Approve PO',       icon:'✅', url:'#erp-approve' },
};
let curJourneyDays=0;
let curPOFilter='all',curPOVendor='',curDateFilter=0,cancelPendingId=null,curNotifTab='all',curSLAFilter='all';
let curPOCaseFilter='all',curPOProcFilter='all',curChannelFilter='all';
let vendorRules=[...Object.entries(VENDORS).map(([name,v])=>({name,email:v.email,subject:v.subject,slaNote:v.slaNote,deliveryNote:v.deliveryNote,portal:v.portal,active:true}))];


// ─── DASHBOARD PIE CHART ─────────────────────────────
// 4 statuses matching PO Ticket tabs
function renderDashPie(){
  var total=TICKETS.filter(function(t){return !t._isMockup;}).length;
  var counts={
    pending_att: TICKETS.filter(function(t){return !t._isMockup&&t.procStatus==='pending_att';}).length,
    received:    TICKETS.filter(function(t){return !t._isMockup&&t.procStatus==='received';}).length,
    verified:    TICKETS.filter(function(t){return !t._isMockup&&t.procStatus==='verified';}).length,
    approved:    TICKETS.filter(function(t){return !t._isMockup&&t.procStatus==='approved';}).length,
    rejected:    TICKETS.filter(function(t){return !t._isMockup&&(t.procStatus==='rejected'||t.status==='canceled');}).length,
  };
  var segments=[
    {key:'pending_att', label:'📎 รอแนบไฟล์เพิ่ม',  color:'#F59E0B', count:counts.pending_att},
    {key:'received',    label:'📥 รอกดรับงาน PO',    color:'#0EA5E9', count:counts.received},
    {key:'verified',    label:'🔍 รอ Approve PO',     color:'#8B5CF6', count:counts.verified},
    {key:'approved',    label:'✅ Approved PO แล้ว',  color:'#10B981', count:counts.approved},
    {key:'rejected',    label:'🚫 ยกเลิกแล้ว',        color:'#EF4444', count:counts.rejected},
  ];
  // Circumference of r=15.5 circle ≈ 97.39
  var C=2*Math.PI*15.5;
  var svgEl=document.getElementById('dashPieSvg');
  var legEl=document.getElementById('dashPieLegend');
  var totEl=document.getElementById('dashPieTotal');
  if(!svgEl||!legEl) return;
  // Remove old segments
  var oldSegs=svgEl.getElementsByClassName('pie-seg');while(oldSegs.length>0){oldSegs[0].parentNode.removeChild(oldSegs[0]);}
  if(totEl) totEl.textContent=total;
  var offset=0;
  var legHtml='';
  segments.forEach(function(seg){
    if(seg.count<=0){
      legHtml+='<div class="dleg-item"><span class="dleg-dot" style="background:'+seg.color+';opacity:.3"></span><span class="dleg-label" style="opacity:.45">'+seg.label+'</span><span class="dleg-val" style="opacity:.45">0</span></div>';
      return;
    }
    var arc=total>0?(seg.count/total)*C:0;
    var gap=C-arc;
    var circle=document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx','18'); circle.setAttribute('cy','18'); circle.setAttribute('r','15.5');
    circle.setAttribute('fill','none'); circle.setAttribute('stroke',seg.color);
    circle.setAttribute('stroke-width','3.5');
    circle.setAttribute('stroke-dasharray',arc.toFixed(2)+' '+gap.toFixed(2));
    circle.setAttribute('stroke-dashoffset',(C/4-offset).toFixed(2));
    circle.setAttribute('stroke-linecap','round');
    circle.classList.add('pie-seg');
    circle.style.cursor='pointer';
    circle.setAttribute('onclick',"setPOFilter('"+seg.key+"',document.querySelector('.potab[data-filter=\'"+seg.key+"\']'));gotoView('po-tickets')");
    circle.setAttribute('title',seg.label+': '+seg.count);
    svgEl.appendChild(circle);
    offset+=arc;
    legHtml+='<div class="dleg-item" style="cursor:pointer" onclick="gotoView(\'po-tickets\');setPOFilter(\''+seg.key+'\',null);">'
      +'<span class="dleg-dot" style="background:'+seg.color+'"></span>'
      +'<span class="dleg-label">'+seg.label+'</span>'
      +'<span class="dleg-val">'+seg.count+'</span></div>';
  });
  legEl.innerHTML=legHtml;
}

// ─── INIT ───
renderTickets();
renderJourney();
renderVendorSummary();
renderAdminTable();
renderVendorRules();
renderNotifications('all');

// ─── NAVIGATION ───
// ── SIDEBAR COLLAPSE ─────────────────────
var _sidebarCollapsed = false;
function toggleSidebar(){
  _sidebarCollapsed = !_sidebarCollapsed;
  var sb = document.getElementById('sidebar');
  var main = document.querySelector('.main');
  var btn = document.getElementById('nav-toggle-btn');
  if(!sb) return;
  if(_sidebarCollapsed){
    sb.classList.add('collapsed');
    if(main) main.style.marginLeft = '54px';
    if(btn) btn.textContent = '▶';
  } else {
    sb.classList.remove('collapsed');
    if(main) main.style.marginLeft = '';
    if(btn) btn.textContent = '◀';
  }
}

function gotoView(v,el){
  document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
  const viewEl=document.getElementById('view-'+v);
  if(viewEl)viewEl.classList.add('active');
  if(v==='sales-order') soInit();
  if(v==='wms-upload') { wmsSetDateRange('month', document.querySelector('.wmsdtab[onclick*="month"]')); wmsRender(); }
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  if(el)el.classList.add('active');
  else{
    document.querySelectorAll('.nav-item').forEach(ni=>{
      const fn=ni.getAttribute('onclick')||'';
      if(fn.includes("'"+v+"'"))ni.classList.add('active');
    });
  }
  const titles={dashboard:'Dashboard','sla-journey':'SLA Journey — ติดตามเอกสาร','po-tickets':'PO Tickets จาก Email','create-order':'สร้าง Order',admin:'Admin PO',notifications:'การแจ้งเตือน',vendors:'Vendor Rules','sales-order':'Sales Order','wms-upload':'Upload ข้อมูลการส่งของจาก WMS'};
  document.getElementById('page-title').textContent=titles[v]||v;
}

// ─── DATE FILTER ───
var curVsDays=3;
function setVsDate(days,el){
  curVsDays=days;
  document.querySelectorAll(".vstab").forEach(function(x){x.classList.remove("active");});
  if(el)el.classList.add("active");
  var r=document.getElementById("vs-date-range");
  if(r)r.style.display=(days===-1)?"flex":"none";
  renderVendorSummary();
}

// ─── DASHBOARD BREACH CHART ───
function renderDashBreachChart() {
  var el = document.getElementById('dashBreachChart');
  if(!el) return;
  // Mock weekly data: [week label, breach, ontime]
  var weeks = [
    {w:'W38',breach:3,ontime:8},
    {w:'W39',breach:1,ontime:11},
    {w:'W40',breach:4,ontime:7},
    {w:'W41',breach:2,ontime:9},
    {w:'W42',breach:0,ontime:12},
    {w:'W43',breach:5,ontime:6},
    {w:'W44',breach:1,ontime:10},
  ];
  var maxTotal = Math.max.apply(null, weeks.map(function(w){return w.breach+w.ontime;}));
  var h = 70;
  el.innerHTML = weeks.map(function(w) {
    var breachH = Math.round((w.breach/(maxTotal||1))*h);
    var ontimeH = Math.round((w.ontime/(maxTotal||1))*h);
    return '<div class="bar-grp" style="gap:2px;justify-content:flex-end">'
      + '<div class="bar-val" style="font-size:9px">' + (w.breach>0?'<span style="color:var(--danger)">'+w.breach+'</span>':'') + '</div>'
      + '<div style="width:100%;display:flex;flex-direction:column;gap:1px;align-items:stretch">'
        + '<div style="background:var(--danger);height:'+breachH+'px;border-radius:2px 2px 0 0;opacity:0.85;min-height:'+(w.breach>0?'3':'0')+'px"></div>'
        + '<div style="background:var(--success);height:'+ontimeH+'px;opacity:0.75;min-height:'+( w.ontime>0?'3':'0')+'px"></div>'
      + '</div>'
      + '<div style="font-size:9px;color:var(--text3);font-weight:600">'+w.w+'</div>'
      + '</div>';
  }).join('');
}

// ─── VENDOR SUMMARY ───
function renderVendorSummary(){
  // kept as stub — vendor summary table removed from dashboard
  var tbody = document.getElementById('vendor-summary-tbody');
  if(tbody) tbody.innerHTML = '';
}


// ── CHANNEL FILTER + VENDOR SEARCH ─────────────────────
function setChannelFilter(f,el){
  curChannelFilter=f;
  document.querySelectorAll('.ch-filter-btn').forEach(function(b){b.classList.remove('active');});
  if(el) el.classList.add('active');
  renderJourney();
}

function getAllVendors(){
  var seen={};var result=[];
  TICKETS.forEach(function(t){if(t.vendor&&!seen[t.vendor]){seen[t.vendor]=true;result.push(t.vendor);}});
  return result.sort();
}

function onVendorSearch(inp){
  var q=inp.value.toLowerCase().trim();
  var dd=document.getElementById('vendor-dropdown');
  if(!dd) return;
  var vendors=getAllVendors();
  var filtered=q?vendors.filter(function(v){return v.toLowerCase().indexOf(q)>=0;}):vendors;
  if(!filtered.length){dd.style.display='none';renderJourney();return;}
  dd.innerHTML=filtered.map(function(v){
    var isOrder=TICKETS.find(function(t){return t.vendor===v&&t.caseType==='ORDER';});
    var tag=isOrder
      ?'<span style="font-size:9px;background:#dcfce7;color:#166534;border-radius:3px;padding:0 5px;font-weight:700">TT</span>'
      :'<span style="font-size:9px;background:#dbeafe;color:#1d4ed8;border-radius:3px;padding:0 5px;font-weight:700">MT</span>';
    return '<div onclick="selectVendor(\'' + v.replace(/'/g,"\\'") + '\')" style="padding:7px 12px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--border)" onmousedown="event.preventDefault()" onmouseover="this.style.background=\'var(--pink-ll)\'" onmouseout="this.style.background=\'\'">'+tag+' '+v+'</div>';
  }).join('');
  dd.style.display='block';
  renderJourney();
}

function selectVendor(name){
  var inp=document.getElementById('journey-vendor-filter');
  if(inp) inp.value=name;
  var dd=document.getElementById('vendor-dropdown');
  if(dd) dd.style.display='none';
  renderJourney();
}

function hideVendorDropdown(){
  setTimeout(function(){
    var dd=document.getElementById('vendor-dropdown');
    if(dd) dd.style.display='none';
    renderJourney();
  },150);
}

// ─── SLA JOURNEY DATE FILTER ───
function setJourneyDate(days,el){
  curJourneyDays=days;
  document.querySelectorAll('.jdtab').forEach(function(x){x.classList.remove('active');});
  if(el) el.classList.add('active');
  var rangeEl=document.getElementById('journey-date-range');
  if(rangeEl) rangeEl.style.display=(days===-1)?'flex':'none';
  renderJourney();
}

// ─── SLA JOURNEY RENDER ───
// ─── STAGE REMARKS & UPLOADS ─────────────────────────────
// Store per-ticket per-stage remarks and image attachments
function getRemarkKey(tid,sk){ return tid+'_'+sk; }
function getStageRemark(tid,sk){ return STAGE_REMARKS[getRemarkKey(tid,sk)]||{text:'',images:[]}; }
function saveStageRemark(tid,sk,text){ 
  var k=getRemarkKey(tid,sk);
  if(!STAGE_REMARKS[k]) STAGE_REMARKS[k]={text:'',images:[]};
  STAGE_REMARKS[k].text=text;
}
function addStageImage(tid,sk,name,dataUrl){
  var k=getRemarkKey(tid,sk);
  if(!STAGE_REMARKS[k]) STAGE_REMARKS[k]={text:'',images:[]};
  STAGE_REMARKS[k].images.push({name:name,dataUrl:dataUrl});
}
function openStageImagePicker(tid,sk){
  var inp=document.createElement('input');
  inp.type='file'; inp.accept='image/*,application/pdf'; inp.multiple=true;
  inp.onchange=function(){
    Array.from(inp.files).forEach(function(f){
      var reader=new FileReader();
      reader.onload=function(e){
        addStageImage(tid,sk,f.name,e.target.result);
        // Refresh the remark row in place
        var el=document.getElementById('jremark-'+tid+'-'+sk);
        if(el) el.innerHTML=buildRemarkRowHtml(tid,sk);
      };
      reader.readAsDataURL(f);
    });
  };
  inp.click();
}

// Quick-action per stuck stage: navigate to the relevant action

// State: which remark rows are open (expanded)
// ── REMARK PANEL STATE ──────────────────────


function submitRemark(tid, sk, ev){
  if(ev) ev.stopPropagation();
  var ta = document.getElementById('remark-ta-' + tid + '-' + sk);
  if(ta) saveStageRemark(tid, sk, ta.value);
  // Collapse the remark row
  REMARK_OPEN[tid + '_' + sk] = false;
  var el = document.getElementById('jremark-' + tid + '-' + sk);
  if(el) el.style.display = 'none';
  // Update inline button in main row
  var r = getStageRemark(tid, sk);
  var hasRemark = !!(r.text || (r.images && r.images.length > 0));
  // Re-render just the remark cell content in main row
  var mainRow = el ? el.previousElementSibling : null;
  if(mainRow){
    var btn = mainRow.querySelector('[title="Remark / เหตุผลที่ล่าช้า"]');
    if(btn){
      btn.textContent = hasRemark ? ('📝 ' + r.text.slice(0,14) + (r.text.length>14?'…':'')) : '📝 หมายเหตุ';
      btn.style.borderColor = hasRemark ? 'var(--pink-m)' : 'var(--border)';
      btn.style.background = hasRemark ? 'var(--pink-ll)' : 'var(--surface2)';
      btn.style.color = hasRemark ? 'var(--pink-d)' : 'var(--text3)';
    }
  }
}

function toggleRemark(tid, sk, ev){
  if(ev) ev.stopPropagation();
  var key = tid + '_' + sk;
  REMARK_OPEN[key] = !REMARK_OPEN[key];
  var el = document.getElementById('jremark-' + tid + '-' + sk);
  if(el){
    if(REMARK_OPEN[key]){
      // Show: rebuild content and display
      el.innerHTML = '<td colspan="5" style="padding:0">' + buildRemarkRowHtml(tid, sk) + '</td>';
      el.style.display = '';
      setTimeout(function(){
        var ta = document.getElementById('remark-ta-' + tid + '-' + sk);
        if(ta) ta.focus();
      }, 50);
    } else {
      el.style.display = 'none';
    }
  }
  // Update the inline remark button text in the stage row
  var mainRow = el ? el.previousElementSibling : null;
  if(mainRow){
    var r = getStageRemark(tid, sk);
    var hasRemark = !!(r.text || (r.images && r.images.length > 0));
    var btn = mainRow.querySelector('[title="Remark / เหตุผลที่ล่าช้า"]');
    if(btn){
      btn.textContent = hasRemark ? ('💬 ' + r.text.slice(0,18) + (r.text.length>18?'…':'')) : '💬 Remark';
    }
  }
}

function buildRemarkRowHtml(tid, sk){
  var r = getStageRemark(tid, sk);
  var key = tid + '_' + sk;
  var isOpen = REMARK_OPEN[key] || false;
  var hasContent = !!(r.text || (r.images && r.images.length > 0));

  var onclickToggle = 'toggleRemark(' + tid + ',&quot;' + sk + '&quot;,event)';
  var onclickSave = 'saveStageRemark(' + tid + ',&quot;' + sk + '&quot;,this.value)';
  var onclickSubmit = 'submitRemark(' + tid + ',&quot;' + sk + '&quot;,event)';

  if(!isOpen){
    // Collapsed: small clickable bar showing preview or invitation
    var previewText = hasContent
      ? ('<span style="font-size:10.5px;color:var(--pink-d);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:400px">📝 ' + r.text + '</span>'
         + (r.images && r.images.length ? '<span style="font-size:9.5px;color:var(--text3)">📎 ' + r.images.length + '</span>' : ''))
      : '<span style="font-size:10.5px;color:var(--text3);flex:1">📝 หมายเหตุ / เหตุผลที่ล่าช้า</span>';
    return '<div style="padding:5px 10px 5px;background:transparent;border-top:1px dashed var(--border);display:flex;align-items:center;gap:8px;min-height:30px">'
      + previewText
      + '<button onclick="' + onclickToggle + '" style="font-size:10.5px;padding:2px 10px;border:1.5px solid var(--border);border-radius:5px;background:var(--surface2);color:var(--text2);cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">'
      + (hasContent ? '✏️ แก้ไข' : '+ เพิ่ม')
      + '</button>'
      + '</div>';
  }

  // Expanded panel
  var imgs = (r.images || []).map(function(img){
    return '<div style="position:relative;display:inline-block">'
      + '<img src="' + img.dataUrl + '" title="' + img.name + '" style="width:44px;height:44px;object-fit:cover;border-radius:5px;border:1.5px solid var(--border);cursor:pointer" onclick="window.open(this.src)">'
      + '</div>';
  }).join('');

  var onclickImg = 'openStageImagePicker(' + tid + ',&quot;' + sk + '&quot;)';
  var addBtn = '<button onclick="' + onclickImg + '" style="width:44px;height:44px;border:1.5px dashed var(--pink-m);border-radius:5px;background:var(--pink-ll);color:var(--pink);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0" title="แนบรูป">+</button>';

  return '<div style="padding:8px 12px 10px;background:#FEFCFF;border-top:1px dashed var(--border)">'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
    + '<span style="font-size:10.5px;font-weight:700;color:var(--text3)">📝 หมายเหตุ / เหตุผลที่ล่าช้า</span>'
    + '<span style="flex:1"></span>'
    + '<button onclick="' + onclickToggle + '" style="font-size:10px;padding:2px 9px;border:1.5px solid var(--border);border-radius:5px;background:var(--surface2);color:var(--text2);cursor:pointer;font-family:inherit">▲ ย่อ</button>'
    + '</div>'
    + '<textarea id="remark-ta-' + tid + '-' + sk + '" placeholder="บันทึกหมายเหตุ / เหตุผลที่ล่าช้า..." style="width:100%;min-height:56px;resize:vertical;border:1.5px solid var(--border);border-radius:6px;padding:7px 10px;font-size:11.5px;font-family:inherit;background:var(--surface);color:var(--text);box-sizing:border-box;" onchange="' + onclickSave + '" onblur="' + onclickSave + '">' + r.text + '</textarea>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">'
    + '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">' + imgs + addBtn + '</div>'
    + '<button onclick="' + onclickSubmit + '" style="padding:5px 16px;background:var(--pink);color:#fff;border:none;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer;font-family:inherit;flex-shrink:0">💾 บันทึก</button>'
    + '</div>'
    + '</div>';
}



function renderJourney(){
  var vendorFilter=document.getElementById('journey-vendor-filter')?document.getElementById('journey-vendor-filter').value:'';
  var stageFilter=document.getElementById('journey-stage-filter')?document.getElementById('journey-stage-filter').value:'';
  var stuckFilter=document.getElementById('journey-stuck-filter')?document.getElementById('journey-stuck-filter').value:'';

  var realData=TICKETS.filter(function(t){return !t._isMockup && t.status!=='canceled';});
  if(curChannelFilter==='mt') realData=realData.filter(function(t){return t.caseType!=='ORDER';});
  if(curChannelFilter==='tt') realData=realData.filter(function(t){return t.caseType==='ORDER';});
  var vendorSearch=vendorFilter.toLowerCase().trim();
  if(vendorSearch) realData=realData.filter(function(t){return t.vendor.toLowerCase().indexOf(vendorSearch)>=0 || (t.poRef&&t.poRef.toLowerCase().indexOf(vendorSearch)>=0);});
  if(stageFilter)  realData=realData.filter(function(t){return t.currentStage===stageFilter;});
  if(stuckFilter==='stuck')  realData=realData.filter(function(t){return Object.values(t.journey).some(function(s){return s.stuck;});});
  if(stuckFilter==='ontime') realData=realData.filter(function(t){return !Object.values(t.journey).some(function(s){return s.stuck;});});
  if(curJourneyDays===-1){
    var fromEl=document.getElementById('journey-date-from');
    var toEl=document.getElementById('journey-date-to');
    if(fromEl&&fromEl.value){var f=new Date(fromEl.value).getTime();realData=realData.filter(function(t){return t.startTs>=f;});}
    if(toEl&&toEl.value){var t2e=new Date(toEl.value).getTime()+86400000;realData=realData.filter(function(t){return t.startTs<=t2e;});}
  } else if(curJourneyDays>0){
    var cutoff=Date.now()-curJourneyDays*24*3600*1000;
    realData=realData.filter(function(t){return t.startTs>=cutoff;});
  }

  var mockupData=TICKETS.filter(function(t){return !!t._isMockup;});
  if(curChannelFilter==='mt') mockupData=mockupData.filter(function(t){return t.caseType!=='ORDER';});
  if(curChannelFilter==='tt') mockupData=mockupData.filter(function(t){return t.caseType==='ORDER';});
  if(vendorSearch) mockupData=mockupData.filter(function(t){return t.vendor.toLowerCase().indexOf(vendorSearch)>=0||(t.poRef&&t.poRef.toLowerCase().indexOf(vendorSearch)>=0);});
  if(stageFilter)  mockupData=mockupData.filter(function(t){return t.currentStage===stageFilter;});
  if(stuckFilter==='ontime') mockupData=mockupData.filter(function(t){return !Object.values(t.journey).some(function(s){return s.stuck;});});

  var tbody=document.getElementById('journey-tbody');
  if(!tbody) return;

  if(!realData.length&&!mockupData.length){
    tbody.innerHTML='<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text3)">🗺️ ไม่พบเอกสาร — ลองเปลี่ยน Filter</td></tr>';
    return;
  }

  var html='';
  var allData=realData.concat(mockupData);
  for(var di=0;di<allData.length;di++){
    html+=buildJourneyRow(allData[di]);
  }
  tbody.innerHTML=html;
}

function buildPipelineHtml(t){
  var html='';
  var slaMins={po:60,approve_po:1440,open_so:480,approve_so:480,doc_wh:240,delivery:1440,delivered:60};
  for(var i=0;i<STAGES.length;i++){
    var stage=STAGES[i];
    var s=t.journey[stage.key]||{done:false,ts:null,stuck:false};
    var cls='ps-pending';
    if(s.done) cls='ps-done';
    else if(s.stuck) cls='ps-blocked';
    else if(stage.key===t.currentStage) cls='ps-active';
    var icon=s.done?'✓':s.stuck?'!':stage.key===t.currentStage?'◉':'';
    var allowMins=slaMins[stage.key]||480;
    var pipeOverSLA=false;
    var tsLine='';
    if(s.done&&s.ts){
      var nextS=(i<STAGES.length-1)?(t.journey[STAGES[i+1].key]||{}):null;
      if(stage.key==='po'){
        tsLine='<div class="pipe-ts" style="color:var(--success)">'+fmtTime(s.ts)+'</div>';
      } else {
        var durMins=nextS&&nextS.ts?Math.round((nextS.ts-s.ts)/60000):null;
        var overSLA=durMins!==null&&durMins>allowMins;
        pipeOverSLA=overSLA;
        var durColor=overSLA?'var(--danger)':'var(--success)';
        var durStr=durMins!==null?(durMins>=60?(Math.round(durMins/60*10)/10+'h'):(durMins+'m')):'—';
        tsLine='<div class="pipe-ts" style="color:'+(overSLA?'var(--danger)':'var(--success)')+'">✓ '+fmtTime(s.ts)+'</div>'
              +'<div class="pipe-ts-sla" style="color:'+durColor+';font-size:8.5px;font-weight:700">⏱ '+durStr+(overSLA?' ⚠':'')+'</div>';
      }
    } else if(cls==='ps-active'){
      var elapsedMins=Math.round((Date.now()-(s.ts||t.startTs))/60000);
      var overSLA2=elapsedMins>allowMins;
      var eColor=overSLA2?'var(--danger)':'var(--warn)';
      tsLine='<div class="pipe-ts" style="color:var(--warn)">ดำเนินการ</div>'
            +'<div class="pipe-ts-sla" style="color:'+eColor+';font-size:8.5px;font-weight:700">⏱ '+(elapsedMins>=60?(Math.round(elapsedMins/60*10)/10+'h'):(elapsedMins+'m'))+(overSLA2?' ⚠️':'')+'</div>';
    } else if(cls==='ps-blocked'){
      var stuckMins=s.ts?Math.round((Date.now()-s.ts)/60000):0;
      tsLine='<div class="pipe-ts" style="color:var(--danger)">กำลังดำเนินการ</div>'
            +'<div class="pipe-ts-sla" style="color:var(--danger);font-size:8.5px;font-weight:700">⏱ '+(stuckMins>=60?(Math.round(stuckMins/60*10)/10+'h'):(stuckMins+'m'))+' ⚠️</div>'
            +'<button onclick="event.stopPropagation();openTicketModal('+t.id+')" style="margin-top:2px;font-size:8px;padding:1px 5px;background:var(--danger);color:#fff;border:none;border-radius:3px;cursor:pointer;font-family:inherit;font-weight:700">แก้ไข</button>';
    } else {
      tsLine='<div class="pipe-ts">—</div>';
    }
    if(pipeOverSLA) cls+=' ps-over';
    html+='<div class="pipe-step '+cls+'" onclick="event.stopPropagation();jtShowStage('+t.id+',"'+stage.key+'")">'
         +'<div class="pipe-node">'+icon+'</div>'
         +'<div class="pipe-lbl">'+stage.shortLabel+'</div>'
         +tsLine
         +'</div>';
  }
  return html;
}

function buildExpandHtml(t){
  var sla=getSLAStatus(t.startTs,t.status);
  var elapsedMs=Date.now()-t.startTs;
  var elapsed=Math.floor(elapsedMs/1000);
  var rows='';
  var slaMins={po:60,approve_po:1440,open_so:480,approve_so:480,doc_wh:240,delivery:1440,delivered:60};

  for(var i=0;i<STAGES.length;i++){
    var stage=STAGES[i];
    var s=t.journey[stage.key]||{done:false,ts:null,stuck:false};
    var nextTs=(i<STAGES.length-1)?(t.journey[STAGES[i+1].key]||{}).ts:null;
    var isCurrentActive=(stage.key===t.currentStage&&!s.done);
    if(!s.ts && !s.stuck && !isCurrentActive) continue;
    var isPO=(stage.key==='po');
    var startTs=s.ts;
    var endTs=isPO?s.ts:nextTs;
    var durationHrs=0; var durationStr='—';
    if(isPO){
      durationStr='รับจากคู่ค้า';
    } else if(startTs&&endTs){
      durationHrs=Math.round((endTs-startTs)/3600000*10)/10;
      durationStr=durationHrs>=1?(durationHrs+' ชม.'):(Math.round((endTs-startTs)/60000)+' นาที');
    } else if(startTs&&s.stuck){
      durationHrs=Math.floor((Date.now()-startTs)/3600000);
      durationStr=durationHrs+' ชม. (ค้าง)';
    } else if(startTs&&stage.key===t.currentStage){
      durationHrs=Math.floor((Date.now()-startTs)/3600000);
      durationStr=(durationHrs>=1?(durationHrs+' ชม.'):'< 1 ชม.')+' (ดำเนินการ)';
    }

    var isDone=s.done&&!s.stuck&&!!endTs;
    var isActive=(s.stuck||isCurrentActive);

    // ── PER-STAGE SLA STATUS (single line, 3 states) ──
    var allowM=slaMins[stage.key]||480;
    var stageSLATxt=''; var stageSLAColor=''; var stageSLABg='';
    if(isPO){
      // No SLA badge for PO receipt
    } else if(isDone && startTs && endTs){
      var durM=Math.round((endTs-startTs)/60000);
      var overS=durM>allowM;
      if(overS){
        stageSLATxt='⚠️ เสร็จแล้ว เกิน SLA';
        stageSLAColor='var(--danger)'; stageSLABg='var(--danger-bg)';
      } else {
        stageSLATxt='✅ เสร็จแล้ว ทันเวลา';
        stageSLAColor='var(--success)'; stageSLABg='transparent';
      }
    } else if(isActive && startTs){
      var elM=Math.round((Date.now()-startTs)/60000);
      var overA=elM>allowM;
      stageSLATxt=overA?'⚠️ กำลังดำเนินการ (เกิน SLA)':'⏰ กำลังดำเนินการ';
      stageSLAColor=overA?'var(--danger)':'var(--warn)';
      stageSLABg=overA?'var(--danger-bg)':'var(--warn-bg)';
    }
    var stageSLAHtml=stageSLATxt
      ?('<span style="font-size:10.5px;font-weight:700;color:'+stageSLAColor+';'+(stageSLABg&&stageSLABg!=='transparent'?'background:'+stageSLABg+';padding:1px 6px;border-radius:10px;':'')+';white-space:nowrap">'+stageSLATxt+'</span>')
      :'';

    // ── MAIN STATUS TEXT ── (single line only)
    var statusTxt=''; var statusColor='var(--success)';
    if(s.stuck){statusTxt='กำลังดำเนินการ';statusColor='var(--danger)';}
    else if(stage.key===t.currentStage&&!s.done){statusTxt='กำลังดำเนินการ';statusColor='var(--warn)';}
    else if(isDone){statusTxt='เสร็จแล้ว';statusColor='var(--success)';}
    else{statusTxt='—';statusColor='var(--text3)';}

    // STATUS cell = single SLA badge only (replaces the duplicative 2-line status)
    var statusCell=stageSLAHtml||'<span style="font-size:11.5px;color:'+statusColor+';font-weight:600">'+statusTxt+'</span>';

    // ── DURATION BAR ──
    var barMax=72; var barPct=isPO?0:Math.min(100,(durationHrs/barMax)*100);
    var barColor=durationHrs>48?'var(--danger)':durationHrs>12?'var(--warn)':'var(--success)';
    var endTsCell=isPO?(startTs?fmtDateTime(startTs):'—')
      :(endTs?fmtDateTime(endTs)
        :(s.stuck?'<span style="color:var(--danger)">ยังค้างอยู่</span>'
          :(stage.key===t.currentStage?'<span style="color:var(--warn)">กำลังดำเนินการ</span>':'—')));
    var durationCell=isPO
      ?'<span style="font-size:11.5px;color:var(--text3);font-style:italic">รับจากคู่ค้า</span>'
      :('<div style="display:flex;align-items:center;gap:7px">'
        +'<div style="flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden">'
        +'<div style="width:'+barPct+'%;height:100%;background:'+barColor+';border-radius:3px"></div>'
        +'</div>'
        +'<span style="font-size:11.5px;font-weight:700;color:'+barColor+';font-family:monospace;white-space:nowrap">'+durationStr+'</span>'
        +'</div>');

    // ── REMARK BUTTON (rightmost column, no shortcut) ──
    var r=getStageRemark(t.id,stage.key);
    var hasRemark=!!(r.text||(r.images&&r.images.length>0));
    var remarkKey=t.id+'_'+stage.key;
    var onclickToggle='toggleRemark('+t.id+',&quot;'+stage.key+'&quot;,event)';
    var remarkBtn='<button onclick="'+onclickToggle+'" title="หมายเหตุ" style="font-size:10px;padding:2px 9px;border:1.5px solid '+(hasRemark?'var(--pink-m)':'var(--border)')+';border-radius:5px;background:'+(hasRemark?'var(--pink-ll)':'var(--surface2)')+';color:'+(hasRemark?'var(--pink-d)':'var(--text3)')+';cursor:pointer;font-family:inherit;white-space:nowrap;line-height:1.4">'+(hasRemark?'📝 '+r.text.slice(0,14)+(r.text.length>14?'…':''):'📝 หมายเหตุ')+'</button>';

    // ── REMARK EXPAND ROW ──
    var remarkExpandHtml=buildRemarkRowHtml(t.id,stage.key);
    var remarkRowDisplay=(REMARK_OPEN[remarkKey])?'':'display:none';

    rows+='<tr style="border-bottom:none">'
         +'<td style="padding:8px 10px;font-size:12px;font-weight:600;white-space:nowrap">'+stage.icon+' '+stage.label+'</td>'
         +'<td style="padding:8px 10px;font-size:11.5px;font-family:monospace;color:var(--text2)">'+(startTs?fmtDateTime(startTs):'—')+'</td>'
         +'<td style="padding:8px 10px;font-size:11.5px;font-family:monospace;color:var(--text2)">'+endTsCell+'</td>'
         +'<td style="padding:8px 10px;min-width:180px">'+statusCell+'</td>'
         +'<td style="padding:8px 10px;min-width:140px">'+durationCell+'</td>'
         +'<td style="padding:6px 10px">'+remarkBtn+'</td>'
         +'</tr>'
         +'<tr id="jremark-'+t.id+'-'+stage.key+'" style="border-bottom:1px solid var(--border);'+remarkRowDisplay+'">'
         +'<td colspan="6" style="padding:0">'+remarkExpandHtml+'</td>'
         +'</tr>';
  }

  // ── SUMMARY PANEL: CTA for current stage ──
  var activeStageCTA='';
  for(var si=0;si<STAGES.length;si++){
    var ss=STAGES[si]; var sv=t.journey[ss.key]||{};
    var isAct=(sv.stuck||(ss.key===t.currentStage&&!sv.done));
    if(isAct){
      var sact=STAGE_ACTIONS[ss.key];
      if(sact){
        activeStageCTA='<a href="'+sact.url+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:10px 14px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;margin-bottom:8px;letter-spacing:-.2px">ดำเนินการ '+sact.label+'</a>';
      }
      break;
    }
  }

  var attachLine=t.attachments&&t.attachments.length
    ?('<div style="font-size:11px;color:var(--success);margin-bottom:8px">📎 '+t.attachments.length+' ไฟล์แนบ</div>'):'';

  return '<div style="display:grid;grid-template-columns:1fr 180px;gap:16px;align-items:start">'
    +'<div>'
    +'<div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">⏱️ เวลาที่ใช้ในแต่ละ Stage</div>'
    +'<table style="width:100%;border-collapse:collapse;background:var(--surface)">'
    +'<thead><tr style="background:var(--surface3)">'
    +'<th style="padding:7px 10px;font-size:10.5px;text-align:left;color:var(--text3)">Stage</th>'
    +'<th style="padding:7px 10px;font-size:10.5px;text-align:left;color:var(--text3)">เวลาเริ่ม</th>'
    +'<th style="padding:7px 10px;font-size:10.5px;text-align:left;color:var(--text3)">เวลาเสร็จ</th>'
    +'<th style="padding:7px 10px;font-size:10.5px;text-align:left;color:var(--text3)">สถานะ / SLA</th>'
    +'<th style="padding:7px 10px;font-size:10.5px;color:var(--text3)">ระยะเวลา</th>'
    +'<th style="padding:7px 10px;font-size:10.5px;text-align:left;color:var(--text3)">หมายเหตุ</th>'
    +'</tr></thead><tbody>'+rows+'</tbody></table></div>'
    +'<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:14px 16px">'
    +'<div style="font-size:11px;font-weight:700;color:var(--text3);margin-bottom:10px;text-transform:uppercase">สรุป</div>'
    +'<div style="font-size:12.5px;font-weight:700;margin-bottom:4px">'+t.vendor+'</div>'
    +'<div style="font-family:monospace;font-size:11px;color:var(--text2);margin-bottom:12px">'+(t.poRef||'—')+'</div>'
    +'<div style="font-size:10.5px;font-weight:700;color:var(--text3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.4px">⏱ เวลาทั้งหมดที่ใช้</div>'
    +(function(){var ms=elapsedMs;var totalMin=Math.floor(ms/60000);var h=Math.floor(totalMin/60);var d=Math.floor(h/24);var hR=h%24;var mR=totalMin%60;var ds=d>0?(d+' วัน '+hR+' ชม.'):h>0?(h+' ชม. '+mR+' น.'):(totalMin+' น.');var ec=d>=3?'var(--danger)':d>=1?'var(--warn)':'var(--success)';return '<div style="font-size:24px;font-weight:900;font-family:monospace;color:'+ec+';line-height:1.1;margin-bottom:3px">'+ds+'</div>'+(d>0?'<div style="font-size:9.5px;color:var(--text3);font-family:monospace;margin-bottom:10px">'+fmt(elapsed)+'</div>':'<div style="margin-bottom:10px"></div>');})()
    +'<div style="margin-bottom:12px"><span class="sla-chip '+sla.cls+'">'
    +(sla.cls==='urgent'?'🔴 เกิน SLA':sla.cls==='warn'?'⚠️ ใกล้ครบ':'✅ ปกติ')+'</span></div>'
    +attachLine
    +activeStageCTA+'</div></div>';
}

function buildJourneyRow(t){
  var v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
  var sla=getSLAStatus(t.startTs,t.status);
  var isStuck=Object.values(t.journey).some(function(s){return s.stuck;});
  var elapsedHrs=Math.floor((Date.now()-t.startTs)/3600000);
  var stuckBadge=isStuck?'<span class="stuck-badge">⚠️ ค้าง</span>':'';
  // Generate SO number: SO + year(2-digit) + month(2-digit) + sequential from id
  var soDate=new Date(t.startTs);
  var soYear=String(soDate.getFullYear()).slice(-2);
  var soMonth=String(soDate.getMonth()+1).padStart(2,'0');
  var soSeq=String(100+t.id).padStart(6,'0');
  var soNum='SO'+soYear+soMonth+'3'+soSeq.slice(-5);
  var mainRow='<tr class="jt-row'+(isStuck?' is-stuck':'')+'" id="jrow-'+t.id+'" onclick="toggleJourneyRow('+t.id+')">'
    +'<td><div style="display:flex;align-items:center;gap:7px">'
    +'<div class="vlogo" style="color:'+v.color+';background:'+v.bg+';width:28px;height:28px;border-radius:7px;font-size:9.5px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+v.logo+'</div>'
    +'<div><div style="font-weight:700;font-size:12.5px">'+t.vendor+'</div>'+stuckBadge+'</div>'
    +'</div></td>'
    +'<td><span style="font-family:monospace;font-size:11px;color:var(--text2)">'+(t.poRef||'—')+'</span></td>'
    +'<td><span style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;color:var(--text)">'+soNum+'</span></td>'
    +'<td><div class="pipe">'+buildPipelineHtml(t)+'</div></td>'
    +'<td style="text-align:center;white-space:nowrap"><span style="font-size:11px;color:var(--text3)">'+fmtDate(t.startTs)+'</span><br>'
    +'<span style="font-size:10.5px;font-family:monospace;color:var(--text3)">'+fmtTime(t.startTs)+'</span></td>'
    +'</tr>';
  var expandRow='<tr class="jt-expand-row" id="jexp-'+t.id+'">'
    +'<td colspan="5"><div class="jt-expand-inner" id="jexpinner-'+t.id+'">'+buildExpandHtml(t)+'</div></td>'
    +'</tr>';
  return mainRow+expandRow;
}


function toggleJourneyRow(id){
  var expRow=document.getElementById('jexp-'+id);
  var inner=document.getElementById('jexpinner-'+id);
  var mainRow=document.getElementById('jrow-'+id);
  if(!expRow||!inner) return;
  var isOpen=expRow.classList.toggle('open');
  inner.style.display=isOpen?'block':'none';
  if(mainRow) mainRow.style.background=isOpen?'var(--pink-ll)':'';
}

function jtShowStage(ticketId,stageKey){
  var t=TICKETS.find(function(x){return x.id===ticketId;});
  if(!t) return;
  var s=t.journey[stageKey]||{done:false,ts:null,stuck:false};
  var stage=STAGES.find(function(x){return x.key===stageKey;});
  var msg=stage.icon+' '+stage.label+'\n';
  if(s.done&&s.ts) msg+='✅ เสร็จ: '+fmtDateTime(s.ts);
  else if(s.stuck) msg+='⚠️ กำลังดำเนินการ (ติดค้างอยู่ที่ Stage นี้)';
  else if(stageKey===t.currentStage) msg+='◉ กำลังดำเนินการ';
  else msg+='○ ยังไม่ถึง Stage นี้';
  var existing=document.getElementById('stage-popup');
  if(existing) existing.remove();
  var popup=document.createElement('div');
  popup.id='stage-popup';
  popup.style.cssText='position:fixed;z-index:500;background:#1e1e2e;color:white;padding:8px 13px;border-radius:8px;font-size:12px;line-height:1.6;box-shadow:0 4px 20px rgba(0,0,0,.3);max-width:240px;pointer-events:none;white-space:pre-line;top:50%;left:50%;transform:translate(-50%,-50%)';
  popup.textContent=msg;
  document.body.appendChild(popup);
  setTimeout(function(){popup.remove();},2500);
}



function openJourneyDetail(id){
  const t=TICKETS.find(x=>x.id===id);
  if(!t)return;
  const v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
  const wrap=document.getElementById('journey-modal-wrap');
  const stepsHtml=STAGES.map(stage=>{
    const sData=t.journey[stage.key]||{done:false,ts:null,stuck:false};
    let bgColor,textColor,note;
    if(sData.done){bgColor='var(--success)';textColor='white';note=`เสร็จเมื่อ ${fmtDateTime(sData.ts)}`;}
    else if(sData.stuck){bgColor='var(--danger)';textColor='white';note='⚠️ กำลังดำเนินการ';}
    else if(stage.key===t.currentStage){bgColor='var(--warn-bg)';textColor='var(--warn)';note='◉ กำลังดำเนินการอยู่';}
    else{bgColor='var(--surface3)';textColor='var(--text3)';note='ยังไม่ถึง Stage นี้';}
    return`<div class="step-detail-row">
      <div class="step-num" style="background:${bgColor};color:${textColor}">${stage.icon}</div>
      <div class="step-info">
        <div class="step-name">${stage.label}</div>
        <div class="step-note">${note}</div>
      </div>
      <div class="step-time">${sData.ts?fmtDateTime(sData.ts):'—'}</div>
    </div>`;
  }).join('');

  wrap.innerHTML=`
    <div class="mhdr">
      <div>
        <div class="mtitle">🗺️ Journey Detail — ${t.vendor}</div>
        <div class="msub">${t.subject}</div>
      </div>
      <button class="mclose" onclick="closeJourneyModal()">✕</button>
    </div>
    <div class="mbody">
      <div class="sec-title">📍 สถานะแต่ละ Stage</div>
      ${stepsHtml}
      <div class="sec-title" style="margin-top:16px">ℹ️ ข้อมูลทั่วไป</div>
      <div class="pf-grid">
        <div class="pf"><label>Vendor</label><div class="val">${t.vendor}</div></div>
        <div class="pf"><label>รับเมื่อ</label><div class="val">${fmtDateTime(t.startTs)}</div></div>
        <div class="pf"><label>Attachments</label><div class="val">${t.attachments&&t.attachments.length>0?t.attachments.length+' ไฟล์':'ไม่มี'}</div></div>
        <div class="pf"><label>Stage ปัจจุบัน</label><div class="val">${STAGES.find(s=>s.key===t.currentStage)?.label||'—'}</div></div>
        <div class="pf"><label>Risk</label><div class="val">${t.risk==='high'?'🔴 สูง':t.risk==='med'?'🟡 กลาง':'🟢 ต่ำ'}</div></div>
        <div class="pf"><label>SLA</label><div class="val"><span class="sla-chip ${getSLAStatus(t.startTs,t.status).cls}">${getSLAStatus(t.startTs,t.status).label}</span></div></div>
      </div>
    </div>
    <div class="mfoot">
      ${t.status!=='confirmed'&&t.status!=='canceled'?`<button class="btn btn-success" onclick="confirmTicket(${t.id});closeJourneyModal()">✓ Confirm PO</button>`:''}
      <button class="btn btn-ghost" onclick="closeJourneyModal()">ปิด</button>
    </div>`;
  document.getElementById('journey-overlay').classList.add('open');
}
function closeJourneyModal(){document.getElementById('journey-overlay').classList.remove('open');}

// ─── PO TICKETS ───
function setPOFilter(f,el){
  curPOFilter=f;
  document.querySelectorAll('.potab').forEach(x=>x.classList.remove('active'));
  if(el)el.classList.add('active');
  renderTickets();
}
function filterTicketVendor(v){curPOVendor=v;renderTickets();}
function setSLAFilter(f,el){
  curSLAFilter=f;
  var btns=document.getElementById('sla-filter-btns');
  if(btns) btns.querySelectorAll('.potab').forEach(function(b){b.classList.toggle('active',b.dataset.sla===f);});
  renderTickets();
}
// setPOCaseFilter/setPOProcFilter removed - unified into setPOFilter
function setEmailDateFilter(days,el){
  curDateFilter=days;
  document.querySelectorAll('.edtab').forEach(x=>x.classList.remove('active'));
  if(el)el.classList.add('active');
  var rangeEl=document.getElementById('email-date-range');
  if(rangeEl) rangeEl.style.display=(days===-1)?'flex':'none';
  if(days!==-1) renderTickets();
}

function renderTickets(){
  var data=TICKETS;
  // Date filter
  if(curDateFilter===-1){
    var fromEl=document.getElementById('email-date-from');
    var toEl=document.getElementById('email-date-to');
    if(fromEl&&fromEl.value){var f=new Date(fromEl.value).getTime();data=data.filter(function(t){return t.startTs>=f;});}
    if(toEl&&toEl.value){var t2e=new Date(toEl.value).getTime()+86400000;data=data.filter(function(t){return t.startTs<=t2e;});}
  } else if(curDateFilter>0){
    var cutoff=Date.now()-curDateFilter*24*3600*1000;
    data=data.filter(function(t){return t.startTs>=cutoff;});
  }
  // Unified status filter (maps to procStatus or status='confirmed'/'canceled')
  if(curPOFilter!=='all'){
    if(curPOFilter==='confirmed') data=data.filter(function(t){return t.status==='confirmed';});
    else if(curPOFilter==='rejected') data=data.filter(function(t){return t.status==='canceled';});
    else data=data.filter(function(t){return t.procStatus===curPOFilter;});
  }
  if(curPOVendor) data=data.filter(function(t){return t.vendor===curPOVendor;});
  // SLA filter
  if(curSLAFilter==='over'){
    data=data.filter(function(t){
      var slaData=getSLAStatus(t.startTs,t.status);
      return slaData.cls==='urgent';
    });
  } else if(curSLAFilter==='normal'){
    data=data.filter(function(t){
      var slaData=getSLAStatus(t.startTs,t.status);
      return slaData.cls!=='urgent';
    });
  }

  // procStatus badge map — new 5-status model
  var procMap={
    'pending_att': '<span class="badge b-pending-att"><span class="bdot"></span>📎 รอแนบไฟล์เพิ่ม</span>',
    'received':    '<span class="badge b-received"><span class="bdot"></span>📥 รอกดรับงาน PO</span>',
    'accepted':    '<span class="badge b-confirmed"><span class="bdot"></span>📥 กดรับงานแล้ว</span>',
    'verified':    '<span class="badge b-verified"><span class="bdot"></span>🔍 รอ Approve PO</span>',
    'approved':    '<span class="badge b-approved"><span class="bdot"></span>✅ Approved PO แล้ว</span>',
    'escalated':   '<span class="badge b-escalated"><span class="bdot"></span>🔴 เร่งด่วน</span>',
  };

  // Count for tabs
  var cntAll=TICKETS.length;
  var cntPendAtt=TICKETS.filter(function(t){return t.procStatus==='pending_att';}).length;
  var cntReceived=TICKETS.filter(function(t){return t.procStatus==='received';}).length;
  var cntVerified=TICKETS.filter(function(t){return t.procStatus==='verified';}).length;
  var cntApproved=TICKETS.filter(function(t){return t.procStatus==='approved';}).length;
  var cntConfirmed=TICKETS.filter(function(t){return t.status==='confirmed';}).length;
  var cntRejected=TICKETS.filter(function(t){return t.status==='canceled';}).length;
  var tabEl=document.getElementById('po-status-tabs');
  if(tabEl){
    tabEl.querySelectorAll('.potab').forEach(function(btn){
      var f=btn.dataset.filter;
      if(f==='all')btn.innerHTML='ทั้งหมด <span style="font-family:monospace">('+cntAll+')</span>';
      else if(f==='pending_att')btn.innerHTML='📎 รอแนบไฟล์ <span style="font-family:monospace">('+cntPendAtt+')</span>';
      else if(f==='received')btn.innerHTML='📥 รอรับงาน <span style="font-family:monospace">('+cntReceived+')</span>';
      else if(f==='verified')btn.innerHTML='🔍 รอ Approve <span style="font-family:monospace">('+cntVerified+')</span>';
      else if(f==='approved')btn.innerHTML='✅ Approved <span style="font-family:monospace">('+cntApproved+')</span>';
      else if(f==='confirmed')btn.innerHTML='☑️ Confirmed <span style="font-family:monospace">('+cntConfirmed+')</span>';
      else if(f==='rejected')btn.innerHTML='🚫 ยกเลิกแล้ว <span style="font-family:monospace">('+cntRejected+')</span>';
    });
  }

  document.getElementById('ticket-tbody').innerHTML=data.map(function(t){
    var v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
    var sla=getSLAStatus(t.startTs,t.status);
    var isDone=t.status==='confirmed'||t.status==='canceled';

    // Attachments
    var attachHtml='<span style="color:var(--text3);font-size:11px">—</span>';
    if(t.attachments&&t.attachments.length>0){
      attachHtml='<button onclick="event.stopPropagation();openAttachModal('+t.id+')" style="display:inline-flex;align-items:center;gap:5px;color:var(--pink-d);font-size:12px;font-weight:600;background:var(--pink-ll);border:1.5px solid var(--pink-m);border-radius:6px;padding:4px 11px;cursor:pointer;font-family:inherit">📎 '+t.attachments.length+' ไฟล์</button>';
    } else if(t.caseType==='B'){
      attachHtml='<span style="font-size:11px;color:#B45309;font-weight:600">⚠️ รอ Download</span>';
    }

    // Action cell
    var actionHtml='';
    if(t.procStatus==='accepted'){
      actionHtml='<div style="display:flex;flex-direction:column;gap:2px">'
        +'<div style="display:flex;align-items:center;gap:5px">'
        +'<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:var(--success-bg);color:var(--success);font-size:10px;font-weight:700;flex-shrink:0">✓</span>'
        +'<span style="font-size:12px;font-weight:700;color:var(--success)">กดรับงานแล้ว</span>'
        +'</div>'
        +(t.acceptedAt?'<span style="font-family:monospace;font-size:10px;color:var(--text3);padding-left:23px">'+fmtDateTime(t.acceptedAt)+'</span>':'')
        +'</div>';
    } else if(isDone){
      var doneTs=t.confirmedAt||t.canceledAt||null;
      var doneLabel=t.status==='confirmed'?'✅ Confirmed':'🚫 Rejected';
      actionHtml='<div style="font-size:10.5px;color:var(--text3);line-height:1.5">'+doneLabel+'<br>'+(doneTs?('<span style="font-family:monospace;font-size:10px">'+fmtDateTime(doneTs)+'</span>'):'')+'</div>';
    } else {
      actionHtml='<div style="display:flex;gap:5px;align-items:center">'
        +'<button class="act-btn confirm btn-sm" title="กดรับงาน" onclick="confirmTicket('+t.id+',event)">📥 รับงาน</button>'
        +'<button class="act-btn cancel-btn btn-sm" title="Reject" onclick="openCancelModal('+t.id+',event)">🚫</button>'
        +'<button class="act-btn btn-sm" title="SLA Journey" onclick="event.stopPropagation();gotoView(\'sla-journey\')" style="color:var(--pink);border-color:var(--pink-m)">🗺️</button>'
        +'</div>';
    }

    var isStuck=Object.values(t.journey).some(function(s){return s.stuck;});
    var rowBg=isStuck?'style="background:rgba(220,38,38,.04)"':'';
    return '<tr onclick="openTicketModal('+t.id+')" '+rowBg+'>'
      +'<td onclick="event.stopPropagation()"><input type="checkbox"></td>'
      +'<td><div class="vcell"><div class="vlogo" style="color:'+v.color+';background:'+v.bg+'">'+v.logo+'</div>'
      +'<div><div style="font-weight:600;font-size:12.5px">'+t.vendor+'</div>'
      +'<div style="font-size:10.5px;color:var(--text3)">'+t.emailFrom+'</div></div></div></td>'
      +'<td style="max-width:160px">'
      +'<div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px" title="'+t.subject+'">'+t.subject+'</div>'
      +'<div style="font-size:10.5px;color:var(--text3);font-family:monospace;margin-top:1px">'+(t.poRef||'—')+'</div>'
      +'</td>'
      +'<td><div style="display:flex;flex-wrap:wrap;max-width:200px">'+attachHtml+'</div></td>'
      +'<td style="font-size:11.5px;white-space:nowrap">'+fmtDateTime(t.startTs)+'</td>'
      +'<td><span class="sla-chip '+sla.cls+'" style="font-size:11px">'+sla.label+'</span></td>'
      +'<td style="text-align:center">'+(procMap[t.procStatus]||'<span class="badge b-in-progress"><span class="bdot"></span>IN PROGRESS</span>')+'</td>'
      +'<td style="white-space:nowrap;min-width:140px">'+actionHtml+'</td>'
      +'</tr>';
  }).join('');
  if(document.getElementById('dashPieSvg')) renderDashPie();renderDashBreachChart();
}

// ─── TICKET MODAL ───
function openTicketModal(id){
  const t=TICKETS.find(x=>x.id===id);
  if(!t)return;
  const v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
  const sla=getSLAStatus(t.startTs,t.status);
  const isDone=t.status==='confirmed'||t.status==='canceled';
  const wrap=document.getElementById('modal-wrap');

  // Build mini journey viz
  const miniJourney=STAGES.map((stage,i)=>{
    const sData=t.journey[stage.key]||{done:false,ts:null,stuck:false};
    let cls='pending';
    if(sData.done)cls='done';
    else if(sData.stuck)cls='blocked';
    else if(stage.key===t.currentStage)cls='active';
    return`<div style="display:flex;flex-direction:column;align-items:center;flex:1;position:relative">
      ${i<STAGES.length-1?`<div style="position:absolute;top:14px;left:50%;right:-50%;height:2px;background:${sData.done?'var(--success)':'var(--border)'};z-index:0"></div>`:''}
      <div style="width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;z-index:1;border:2px solid ${cls==='done'?'var(--success)':cls==='active'?'var(--warn)':cls==='blocked'?'var(--danger)':'var(--border)'};background:${cls==='done'?'var(--success)':cls==='active'?'var(--warn-bg)':cls==='blocked'?'var(--danger-bg)':'var(--surface3)'};color:${cls==='done'?'white':cls==='active'?'var(--warn)':cls==='blocked'?'var(--danger)':'var(--text3)'}">${cls==='done'?'✓':cls==='active'?'◉':cls==='blocked'?'!':'○'}</div>
      <div style="font-size:9.5px;color:var(--text3);margin-top:4px;text-align:center">${stage.shortLabel}</div>
    </div>`;
  }).join('');

  // Email body — use real data, or build structured mock
  const emailBody = t.emailBody || (
    'From: ' + t.emailFrom + '\n' +
    'Subject: ' + t.subject + '\n' +
    'วันที่: ' + fmtDateTime(t.startTs) + '\n' +
    '─────────────────────────────\n\n' +
    '[' + t.vendor + '] แจ้งใบ Purchase Order สำหรับสินค้า Charmiss\n\n' +
    'PO Reference: ' + t.poRef + '\n' +
    'กรุณาดำเนินการตรวจสอบและยืนยันภายในกำหนด SLA\n\n' +
    'ขอบคุณ,\n' + t.vendor + ' Procurement Team'
  );

  // Per-attachment sub-tasks
  const attSubTasks=buildAttSubTasks(t);

  wrap.innerHTML=`
    <div class="mhdr">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="vlogo" style="background:${v.bg};color:${v.color};width:36px;height:36px;border-radius:9px;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">${v.logo}</div>
        <div>
          <div class="mtitle">${t.vendor}</div>
          <div class="msub">${t.subject}</div>
        </div>
      </div>
      <button class="mclose" onclick="closeModal()">✕</button>
    </div>
    <div class="mbody">
      <div class="sec-title">📍 Document Journey</div>
      <div style="display:flex;align-items:flex-start;gap:0;margin-bottom:14px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--r-sm);padding:12px 8px">${miniJourney}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px">
        <div class="pf"><label>รับเมื่อ</label><div class="val">${fmtDateTime(t.startTs)}</div></div>
        <div class="pf"><label>Email From</label><div class="val" style="font-size:11px">${t.emailFrom}</div></div>
        <div class="pf"><label>SLA Deadline</label><div class="val"><span class="sla-chip ${sla.cls}">${sla.label}</span></div></div>
        <div class="pf" style="grid-column:span 3"><label>Ticket Status</label><div class="val">${{
          'pending_att':'<span class="badge b-pending-att"><span class="bdot"></span>📎 รอแนบไฟล์เพิ่ม — รอ PIC Download/Upload</span>',
          'received':'<span class="badge b-received"><span class="bdot"></span>📥 รอกดรับงาน PO — ยังไม่ได้ตรวจรับ</span>',
          'verified':'<span class="badge b-verified"><span class="bdot"></span>🔍 รอ Approve PO เพื่อเริ่มงาน SO</span>',
          'approved':'<span class="badge b-approved"><span class="bdot"></span>✅ Approved PO แล้ว — เริ่มงาน SO ได้เลย</span>',
          'escalated':'<span class="badge b-escalated"><span class="bdot"></span>🔴 เร่งด่วน — ต้องการความช่วยเหลือ</span>',
        }[t.procStatus]||'<span class="badge b-received"><span class="bdot"></span>📥 รอกดรับงาน PO</span>'}</div></div>
      </div>

      <!-- ── ELAPSED TIME COUNTUP (standalone section) ── -->
      ${(()=>{
        var ms=Date.now()-t.startTs;
        var totalMin=Math.floor(ms/60000);
        var h=Math.floor(totalMin/60); var d=Math.floor(h/24);
        var hDisp=h%24; var mDisp=totalMin%60;
        var elapsed=d>0?(d+'ว '+hDisp+'ชม. '+mDisp+'น.'):h>0?(h+'ชม. '+mDisp+'น.'):(totalMin+'น.');
        var pct=Math.min(100,Math.round((ms/(26*3600000))*100));
        var barColor=ms>26*3600000?'var(--danger)':ms>12*3600000?'var(--warn)':'#3B82F6';
        var bgColor=ms>26*3600000?'var(--danger-bg)':ms>12*3600000?'var(--warn-bg)':'#EFF6FF';
        var borderColor=ms>26*3600000?'var(--danger)':ms>12*3600000?'var(--warn)':'#BFDBFE';
        var label=ms>26*3600000?'⚠️ เกิน SLA':ms>12*3600000?'⏰ ใกล้ครบ SLA':'⏱ เวลาที่ผ่านไป';
        return '<div style="display:flex;align-items:center;gap:12px;background:'+bgColor+';border-radius:9px;padding:11px 14px;margin-bottom:14px;border:1.5px solid '+borderColor+';">'
          +'<div style="flex-shrink:0;min-width:72px;text-align:center">'
          +'<div style="font-size:20px;font-weight:900;font-family:monospace;color:'+barColor+';line-height:1.1">'+elapsed+'</div>'
          +'<div style="font-size:9.5px;color:'+barColor+';margin-top:3px;font-weight:700">'+label+'</div>'
          +'</div>'
          +'<div style="flex:1">'
          +'<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">'
          +'<span style="font-size:10px;color:var(--text3)">รับ Email: '+new Date(t.startTs).toLocaleDateString("th-TH",{day:"2-digit",month:"2-digit",year:"2-digit"})+" "+new Date(t.startTs).toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit"})+'</span>'
          +(t.slaDeadline||sla.label?'<span style="font-size:10px;font-weight:700;color:'+barColor+'">SLA: '+sla.label+'</span>':'')
          +'</div>'
          +'<div style="height:7px;background:var(--border);border-radius:4px;overflow:hidden">'
          +'<div style="height:100%;background:'+barColor+';border-radius:4px;width:'+pct+'%"></div>'
          +'</div>'
          +'</div>'
          +'</div>';
      })()}

      <div class="sec-title">📧 Email Content</div>
      <div style="background:#F8F9FA;border:1px solid var(--border);border-radius:8px;padding:13px 15px;margin-bottom:12px;font-size:11.5px;line-height:1.8;color:var(--text2);white-space:pre-wrap;font-family:'IBM Plex Mono',monospace;max-height:140px;overflow-y:auto">${emailBody}</div>

      <div class="sec-title">📋 Sub-tasks — แยกตาม Attachment / งานที่ต้องทำ</div>
      ${attSubTasks}

      ${t.caseType==='B'&&t.subTasks?buildLotusSubPanel(t):''}

      ${t.status==='confirmed'
        ?'<div style="display:flex;align-items:center;gap:7px;margin-top:10px;padding:9px 13px;background:var(--success-bg);border-radius:8px;font-size:12px;color:var(--success);font-weight:600">✅ Confirmed แล้ว'+(t.confirmedAt?' — '+fmtDateTime(t.confirmedAt):'')+'</div>'
        :t.status==='canceled'
        ?'<div style="display:flex;align-items:center;gap:7px;margin-top:10px;padding:9px 13px;background:var(--danger-bg);border-radius:8px;font-size:12px;color:var(--danger);font-weight:600">🚫 ยกเลิกแล้ว — '+t.cancelReason+'</div>'
        :''}
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-ghost btn-sm" onclick="closeModal();openJourneyDetail(${t.id})">🗺️ ดู Journey</button>
      </div>
    </div>
    <div class="mfoot">
      <button class="btn btn-ghost" onclick="closeModal()">ปิด</button>
    </div>`;
  document.getElementById('overlay').classList.add('open');
}
function closeModal(){document.getElementById('overlay').classList.remove('open');}

// ─── CONFIRM / CANCEL ───

// ─── PO TICKET MODAL HELPERS ─────────────────────────────

// ─── BUILD ATTACHMENT SUB-TASKS ─────────────────────────

// Get active file type filter for a ticket
var ATT_FILTER = {};  // tid -> 'all'|'pdf'|'xlsx'|'zip' etc.

function setAttFilter(tid, ext, ev){
  if(ev) ev.stopPropagation();
  ATT_FILTER[tid] = ext;
  openTicketModal(tid);
}

function acceptAllVisible(tid, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t||!t.attachments) return;
  var filt=ATT_FILTER[tid]||'all';
  var count=0;
  t.attachments.forEach(function(att,i){
    if(filt==='all'||att.ext===filt){
      if(!att.accepted){
        att.accepted=true; att.acceptedBy=CURRENT_SALES||'ฝนเทพ'; count++;
      }
    }
  });
  if(t.procStatus==='received'||t.procStatus==='pending_att') t.procStatus='verified';
  showToast('✅ รับงาน '+count+' ไฟล์แล้ว');
  openTicketModal(tid);
  renderTickets();
}

function approvePO(tid, attIdx, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t) return;
  if(attIdx!=null && t.attachments && t.attachments[attIdx]){
    // Accept the specific attachment first if not already
    if(!t.attachments[attIdx].accepted){
      t.attachments[attIdx].accepted=true;
      t.attachments[attIdx].acceptedBy=CURRENT_SALES||'ฝนเทพ';
    }
  }
  // Mark all visible attachments as accepted if approving all
  if(attIdx==null && t.attachments){
    t.attachments.forEach(function(a){
      if(!a.accepted){ a.accepted=true; a.acceptedBy=CURRENT_SALES||'ฝนเทพ'; }
    });
  }
  t.procStatus='approved';
  t.approvedAt=Date.now();
  showToast('✅ Approved PO แล้ว — เริ่มงาน SO ได้เลย');
  openTicketModal(tid);
  renderTickets();
}

// ─── SELECTION HELPERS ─────────────────────────

function toggleSelItem(tid, origIdx, checked, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t) return;
  if(!t._sel) t._sel={};
  t._sel[origIdx]=checked;
  openTicketModal(tid);
}

function toggleSelAll(tid, checked, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t) return;
  if(!t._sel) t._sel={};
  var filt=ATT_FILTER[tid]||'all';
  var atts=t.attachments||[];
  var visible=filt==='all'?atts:atts.filter(function(a){return a.ext===filt;});
  visible.forEach(function(a){ t._sel[atts.indexOf(a)]=checked; });
  openTicketModal(tid);
}

function acceptSelected(tid, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t||!t._sel) return;
  var count=0;
  Object.keys(t._sel).forEach(function(i){
    if(t._sel[i] && t.attachments[i] && !t.attachments[i].accepted){
      t.attachments[i].accepted=true; t.attachments[i].acceptedBy=CURRENT_SALES||'ฝนเทพ'; count++;
    }
  });
  t._sel={};
  if(t.procStatus==='received'||t.procStatus==='pending_att') t.procStatus='verified';
  showToast('✅ รับงาน '+count+' ไฟล์แล้ว');
  openTicketModal(tid); renderTickets();
}

function approveSelected(tid, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t||!t._sel) return;
  Object.keys(t._sel).forEach(function(i){
    if(t._sel[i] && t.attachments[i]){
      t.attachments[i].accepted=true; t.attachments[i].acceptedBy=CURRENT_SALES||'ฝนเทพ';
    }
  });
  t._sel={}; t.procStatus='approved'; t.approvedAt=Date.now();
  showToast('✅ Approved PO ที่เลือกแล้ว');
  openTicketModal(tid); renderTickets();
}

function rejectSelected(tid, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t||!t._sel) return;
  var count=0;
  Object.keys(t._sel).forEach(function(i){
    if(t._sel[i] && t.attachments[i]){
      t.attachments[i].rejected=true; count++;
    }
  });
  t._sel={};
  showToast('🚫 ปฏิเสธ '+count+' ไฟล์แล้ว');
  openTicketModal(tid); renderTickets();
}

function rejectSingleTask(tid, origIdx, ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t) return;
  if(origIdx==null){
    // No attachment ticket — reject whole ticket
    closeModal(); openCancelModal(tid); return;
  }
  if(t.attachments && t.attachments[origIdx]){
    t.attachments[origIdx].rejected=true;
  }
  showToast('🚫 ปฏิเสธงานนี้แล้ว');
  openTicketModal(tid); renderTickets();
}

function rejectTicket(tid, ev){
  if(ev) ev.stopPropagation();
  closeModal();
  openCancelModal(tid);
}

function buildAttSubTasks(t){
  var sla=getSLAStatus(t.startTs,t.status);
  var slaDeadline=sla.label;
  var isOver=sla.cls==='urgent';
  var now=Date.now();
  var filt=ATT_FILTER[t.id]||'all';
  var isApproved=t.procStatus==='approved';
  // Per-ticket selection state (in-memory only)
  if(!t._sel) t._sel={};

  function elapsedStr(fromTs){
    var ms=now-fromTs; var m=Math.floor(ms/60000);
    var h=Math.floor(m/60); var d=Math.floor(h/24);
    if(d>0) return d+'ว '+(h%24)+'ชม.';
    if(h>0) return h+'ชม. '+(m%60)+'น.';
    return m+'น.';
  }
  function timerBadge(fromTs,over){
    var el=elapsedStr(fromTs);
    var bg=over?'var(--danger-bg)':'var(--surface3)';
    var col=over?'var(--danger)':'var(--text3)';
    return '<span style="font-size:9.5px;padding:2px 8px;border-radius:10px;background:'+bg+';color:'+col+';font-weight:700;font-family:monospace">⏱ '+el+'</span>';
  }
  function slaChip(){
    var col=isOver?'var(--danger)':sla.cls==='warn'?'var(--warn)':'var(--success)';
    var bg=isOver?'var(--danger-bg)':sla.cls==='warn'?'var(--warn-bg)':'var(--success-bg)';
    return '<span style="font-size:9.5px;padding:2px 8px;border-radius:10px;background:'+bg+';color:'+col+';font-weight:700;white-space:nowrap">📅 '+slaDeadline+'</span>';
  }

  var html='';
  var atts=t.attachments||[];

  if(atts.length===0){
    var acc=t._accepted||false;
    html+='<div style="display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:9px;background:'+(acc?'#F0FDF4':'var(--pink-ll)')+';border:1.5px solid '+(acc?'#86EFAC':'var(--pink-m)')+';margin-bottom:6px">'
      +'<div style="width:24px;height:24px;border-radius:50%;border:2px solid '+(acc?'#16A34A':'var(--pink)')+';background:'+(acc?'#16A34A':'transparent')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'
      +(acc?'<svg width="11" height="11" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>':'<span style="font-size:11px;color:var(--pink);font-weight:700">1</span>')
      +'</div>'
      +'<div style="flex:1"><div style="font-size:12px;font-weight:700">รับงาน PO นี้</div><div style="font-size:10.5px;color:var(--pink-d)">PO Ref: '+t.poRef+'</div></div>'
      +timerBadge(t.startTs,isOver)+' '+slaChip()
      +(isApproved
        ?'<span style="font-size:10.5px;color:var(--success);font-weight:700">✅ Approved แล้ว</span>'
        :(acc
          ?'<button onclick="approvePO('+t.id+',null,event)" style="font-size:11px;padding:5px 14px;background:#7C3AED;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">✅ Approve PO</button>'
          :'<div style="display:flex;gap:6px;flex-shrink:0">'
            +'<button onclick="acceptTicket('+t.id+',event)" style="font-size:11px;padding:5px 12px;background:var(--pink);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">รับงาน</button>'
            +'<button onclick="approvePO('+t.id+',null,event)" style="font-size:11px;padding:5px 12px;background:#7C3AED;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">✅ Approve PO</button>'
            +'<button onclick="rejectSingleTask('+t.id+',null,event)" style="font-size:11px;padding:5px 12px;background:transparent;color:var(--danger);border:1.5px solid var(--danger);border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">🚫 ไม่รับ</button>'
          +'</div>'
        )
      )
      +'</div>';
    return html;
  }

  // Extension filter bar
  var exts={};
  atts.forEach(function(a){ if(a.ext) exts[a.ext]=true; });
  var extList=Object.keys(exts);
  var hasFilter=extList.length>1;

  if(hasFilter){
    html+='<div style="display:flex;align-items:center;gap:6px;margin-bottom:10px;flex-wrap:wrap">'
      +'<span style="font-size:10.5px;color:var(--text3);font-weight:700">กรอง:</span>';
    var filters=['all'].concat(extList);
    filters.forEach(function(ex){
      var active=filt===ex;
      var cnt=ex==='all'?atts.length:atts.filter(function(a){return a.ext===ex;}).length;
      var label=ex==='all'?'ทั้งหมด ('+cnt+')':'.'+ex.toUpperCase()+' ('+cnt+')';
      html+='<button onclick="setAttFilter('+t.id+',\''+ex+'\',event)" style="font-size:11px;padding:3px 11px;border:1.5px solid '+(active?'var(--pink)':'var(--border)')+';border-radius:16px;background:'+(active?'var(--pink)':'var(--surface)')+';color:'+(active?'#fff':'var(--text2)')+';cursor:pointer;font-family:inherit;font-weight:'+(active?'700':'500')+'">'+label+'</button>';
    });
    html+='</div>';
  }

  var visible=filt==='all'?atts:atts.filter(function(a){return a.ext===filt;});
  var visIdx=visible.map(function(a){return atts.indexOf(a);});
  var allSel=visIdx.every(function(i){return t._sel[i];});

  // Select-All header row
  if(!isApproved && visible.length>1){
    html+='<div style="display:flex;align-items:center;gap:8px;padding:5px 12px 8px 12px;margin-bottom:2px">'
      +'<label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:11.5px;color:var(--text2);font-weight:600;user-select:none">'
      +'<input type="checkbox" id="sel-all-'+t.id+'" '+(allSel?'checked':'')+' onchange="toggleSelAll('+t.id+',this.checked,event)" style="width:15px;height:15px;accent-color:var(--pink);cursor:pointer">'
      +'เลือกทั้งหมด ('+visible.length+' งาน)'
      +'</label>'
      +'<span style="flex:1"></span>'
      +'<span style="font-size:10.5px;color:var(--text3)">เลือกแล้ว: '+visIdx.filter(function(i){return t._sel[i];}).length+'/'+visible.length+'</span>'
      +'</div>';
  }

  // Sub-task rows
  visible.forEach(function(att,rowNum){
    var origIdx=atts.indexOf(att);
    var accepted=att.accepted||false;
    var acceptedBy=att.acceptedBy||'';
    var rejected=att.rejected||false;
    var isSel=t._sel[origIdx]||false;
    var extBadge='';
    if(att.ext){
      var extColor=att.ext==='pdf'?'#DC2626':att.ext==='xlsx'?'#166534':att.ext==='zip'?'#9333EA':'#6366F1';
      var extBg=att.ext==='pdf'?'#FEE2E2':att.ext==='xlsx'?'#DCFCE7':att.ext==='zip'?'#F3E8FF':'#EEF2FF';
      extBadge='<span style="font-size:9px;padding:1px 6px;border-radius:8px;background:'+extBg+';color:'+extColor+';font-weight:700;font-family:monospace;flex-shrink:0">.'+att.ext.toUpperCase()+'</span>';
    }
    var rowState=isApproved?'approved':accepted?'accepted':rejected?'rejected':'pending';
    var rowBg=rowState==='approved'||rowState==='accepted'?'#F0FDF4':rowState==='rejected'?'#FEF2F2':'#fff';
    var rowBorder=rowState==='approved'||rowState==='accepted'?'#86EFAC':rowState==='rejected'?'#FECACA':isSel?'var(--pink)':'var(--border)';

    html+='<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:9px;background:'+rowBg+';border:1.5px solid '+rowBorder+';margin-bottom:5px;box-shadow:0 1px 3px rgba(0,0,0,.05)">';
    // Checkbox (for selection)
    if(!isApproved && !accepted && !rejected){
      html+='<input type="checkbox" '+(isSel?'checked':'')+' onchange="toggleSelItem('+t.id+','+origIdx+',this.checked,event)" style="width:15px;height:15px;accent-color:var(--pink);cursor:pointer;flex-shrink:0">';
    }
    // Row number circle
    html+='<div style="width:22px;height:22px;border-radius:50%;border:2px solid '+(rowState==='approved'||rowState==='accepted'?'#16A34A':rowState==='rejected'?'#EF4444':'var(--pink-m)')+';background:'+(rowState==='approved'||rowState==='accepted'?'#16A34A':rowState==='rejected'?'#FEE2E2':'transparent')+';display:flex;align-items:center;justify-content:center;flex-shrink:0">'
      +(rowState==='approved'||rowState==='accepted'?'<svg width="10" height="10" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>':rowState==='rejected'?'<span style="font-size:10px;color:#EF4444;font-weight:700">✕</span>':'<span style="font-size:10px;color:var(--pink);font-weight:700">'+(rowNum+1)+'</span>')
      +'</div>'
    // File info
    +'<div style="flex:1;min-width:0">'
      +'<div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap">'
      +'<span style="font-size:12px;font-weight:600;color:'+(rowState==='rejected'?'#EF4444':rowState==='approved'||rowState==='accepted'?'#166534':'var(--text)')+'">📎 '+att.name+'</span>'
      +extBadge
      +(att.branch?'<span style="font-size:9.5px;color:var(--text3)">'+att.branch+'</span>':'')
      +'</div>'
      +(rowState==='approved'?'<div style="font-size:10px;color:var(--success)">✓ Approved PO แล้ว</div>'
        :rowState==='accepted'?'<div style="font-size:10px;color:var(--success)">✓ รับงานโดย '+acceptedBy+' แล้ว</div>'
        :rowState==='rejected'?'<div style="font-size:10px;color:#EF4444">🚫 ไม่รับงานนี้</div>'
        :'<div style="font-size:10.5px;color:var(--pink-d);font-family:monospace">PO Ref: '+(att.poRef||t.poRef)+'</div>'
      )
    +'</div>'
    +timerBadge(t.startTs,isOver)+' '+slaChip()
    // Action buttons
    +(isApproved
      ?'<span style="font-size:10px;color:var(--success);font-weight:700;flex-shrink:0">✅</span>'
      :accepted
      ?'<button onclick="approvePO('+t.id+','+origIdx+',event)" style="font-size:10.5px;padding:4px 10px;background:#7C3AED;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">✅ Approve</button>'
      :rejected
      ?'<span style="font-size:10px;color:#EF4444;font-weight:700;flex-shrink:0">ปฏิเสธแล้ว</span>'
      :'<div style="display:flex;gap:4px;flex-shrink:0">'
        +'<button onclick="acceptAttTask('+t.id+','+origIdx+',event)" style="font-size:10.5px;padding:4px 9px;background:var(--pink);color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">รับงาน</button>'
        +'<button onclick="approvePO('+t.id+','+origIdx+',event)" style="font-size:10.5px;padding:4px 9px;background:#7C3AED;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">✅ Approve PO</button>'
        +'<button onclick="rejectSingleTask('+t.id+','+origIdx+',event)" title="ไม่รับงานนี้" style="font-size:10.5px;padding:4px 9px;background:transparent;color:var(--danger);border:1.5px solid var(--danger);border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">🚫</button>'
      +'</div>'
    )
    +'</div>';
  });

  // Bottom bulk action bar
  var selCount=visIdx.filter(function(i){return t._sel[i];}).length;
  if(!isApproved){
    if(selCount>0){
      // Show bulk actions for selected items
      html+='<div style="display:flex;gap:7px;margin-top:10px;padding:10px 12px;border-top:2px solid var(--pink-m);background:var(--pink-ll);border-radius:0 0 9px 9px;align-items:center;">'
        +'<span style="font-size:11px;color:var(--pink-d);font-weight:700">เลือก '+selCount+' งาน:</span>'
        +'<button onclick="acceptSelected('+t.id+',event)" style="font-size:11px;padding:6px 14px;background:var(--pink);color:#fff;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-family:inherit">📥 รับที่เลือก</button>'
        +'<button onclick="approveSelected('+t.id+',event)" style="font-size:11px;padding:6px 14px;background:#7C3AED;color:#fff;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-family:inherit">✅ Approve PO ที่เลือก</button>'
        +'<button onclick="rejectSelected('+t.id+',event)" style="font-size:11px;padding:6px 14px;background:transparent;color:var(--danger);border:1.5px solid var(--danger);border-radius:7px;font-weight:700;cursor:pointer;font-family:inherit">🚫 ไม่รับที่เลือก</button>'
        +'</div>';
    } else {
      var allAccepted=atts.every(function(a){return a.accepted;});
      html+='<div style="display:flex;gap:7px;margin-top:10px;padding-top:10px;border-top:1px dashed var(--border)">'
        +(allAccepted
          ?'<button onclick="approvePO('+t.id+',null,event)" style="flex:2;font-size:12px;padding:9px 14px;background:#7C3AED;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit">✅ Approve PO ทั้งหมด</button>'
          :'<button onclick="acceptAllVisible('+t.id+',event)" style="flex:2;font-size:12px;padding:9px 14px;background:var(--success);color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit">'
            +(filt==='all'?'📥 รับทุกงานใน Email นี้':'📥 รับทุก .'+filt.toUpperCase())
          +'</button>'
          +'<button onclick="approvePO('+t.id+',null,event)" style="flex:2;font-size:12px;padding:9px 14px;background:#7C3AED;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit">✅ Approve PO</button>'
        )
        +'<button onclick="rejectTicket('+t.id+',event)" style="flex:1;font-size:12px;padding:9px 12px;background:var(--surface);color:var(--danger);border:1.5px solid var(--danger);border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit">🚫 ปฏิเสธ</button>'
        +'</div>';
    }
  } else {
    html+='<div style="padding:10px 13px;margin-top:8px;background:#F0FDF4;border-radius:8px;border:1.5px solid #86EFAC;font-size:12px;color:#166534;font-weight:700">'
      +'✅ Approved PO แล้ว'+(t.approvedAt?' — '+(new Date(t.approvedAt)).toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'}):'')
      +' — เริ่มงาน SO ได้เลย</div>';
  }
  return html;
}

function acceptAttTask(tid,attIdx,ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t||!t.attachments[attIdx]) return;
  t.attachments[attIdx].accepted=true;
  t.attachments[attIdx].acceptedBy=CURRENT_SALES||'ฝนเทพ';
  if(t.procStatus==='received'||t.procStatus==='pending_att') t.procStatus='verified';
  showToast('✅ รับงาน '+t.attachments[attIdx].name+' แล้ว');
  openTicketModal(tid);
  renderTickets();
}

function acceptTicket(tid,ev){
  if(ev) ev.stopPropagation();
  var t=TICKETS.find(function(x){return x.id===tid;});
  if(!t) return;
  t._accepted=true;
  if(t.procStatus==='received') t.procStatus='verified';
  showToast('✅ รับงาน Ticket #'+tid+' แล้ว');
  openTicketModal(tid);
  renderTickets();
}

// Lotus Case B sub-task panel (extracted to function to avoid nested template)
function buildLotusSubPanel(t){
  var allDone=t.subTasks.every(function(s){return s.done;});
  var doneCount=t.subTasks.filter(function(s){return s.done;}).length;
  var total=t.subTasks.length;
  var pct=Math.round(doneCount/total*100);
  return '<div style="background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:9px;padding:12px 14px;margin-bottom:10px">'
    +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
    +'<div style="display:flex;align-items:center;gap:7px">'
    +'<span style="font-size:17px">🪷</span>'
    +'<div><div style="font-size:12.5px;font-weight:700;color:#78350F">Lotus Supplier Portal — Sub-tasks</div>'
    +'<div style="font-size:11px;color:#92400E">ต้อง Login Portal เพื่อ Download ใบ PO ด้วยตนเอง</div></div>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:6px">'
    +'<div style="font-size:10px;font-weight:700;color:#92400E">'+doneCount+'/'+total+'</div>'
    +'<div style="width:60px;height:6px;background:#FDE68A;border-radius:3px;overflow:hidden">'
    +'<div style="width:'+pct+'%;height:100%;background:'+(allDone?'#16A34A':'#F59E0B')+';border-radius:3px;transition:width .3s"></div></div>'
    +(allDone?'<span style="font-size:10px;background:#DCFCE7;color:#166534;padding:2px 7px;border-radius:10px;font-weight:700">✓ ครบแล้ว</span>':'')
    +'</div></div>'
    +'<div style="display:flex;flex-direction:column;gap:5px">'+buildSubTaskRows(t)+'</div>'
    +'</div>';
}


function buildSubTaskRows(t){
  if(!t.subTasks) return '';
  return t.subTasks.map(function(st,si){
    var bg    = st.done ? '#DCFCE7' : '#fff';
    var border= st.done ? '#86EFAC' : '#FDE68A';
    var cbBorder = st.done ? '#16A34A' : '#F59E0B';
    var cbBg  = st.done ? '#16A34A' : 'transparent';
    var textColor = st.done ? '#166534' : '#78350F';
    var strikeStyle = st.done ? 'text-decoration:line-through;opacity:.7' : '';
    var checkInner = st.done
      ? '<svg width="11" height="11" fill="none" stroke="white" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<span style="font-size:11px;color:#D97706;font-weight:700">'+(si+1)+'</span>';
    var doneTime = st.ts
      ? '<div style="font-size:10px;color:var(--text3)">✓ เสร็จ '+new Date(st.ts).toLocaleString('th-TH',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})+'</div>'
      : '';
    var portalBtn = (si===1 && !st.done && t.portalUrl)
      ? '<a href="'+t.portalUrl+'" target="_blank" onclick="event.stopPropagation()" style="font-size:11px;padding:5px 12px;background:#2E7D32;color:#fff;border-radius:6px;text-decoration:none;font-weight:700;white-space:nowrap;flex-shrink:0">เปิด Portal →</a>'
      : '';
    var pendingIcon = st.done ? '' : '<svg width="14" height="14" fill="none" stroke="#D97706" stroke-width="2.5" viewBox="0 0 24 24" style="flex-shrink:0;opacity:.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>';
    return '<div style="display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;background:'+bg+';border:1px solid '+border+';" onclick="toggleSubTask('+t.id+',\''+st.id+'\',event)">'
      +'<div style="width:22px;height:22px;border-radius:50%;border:2px solid '+cbBorder+';background:'+cbBg+';display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:all .2s">'+checkInner+'</div>'
      +'<div style="flex:1"><div style="font-size:12px;font-weight:600;color:'+textColor+';'+strikeStyle+'">'+st.label+'</div>'+doneTime+'</div>'
      +portalBtn+pendingIcon
      +'</div>';
  }).join('');
}

function toggleSubTask(ticketId, stId, ev){
  if(ev) ev.stopPropagation();
  const t=TICKETS.find(x=>x.id===ticketId);
  if(!t||!t.subTasks) return;
  const st=t.subTasks.find(s=>s.id===stId);
  if(!st) return;
  st.done=!st.done;
  st.ts=st.done?Date.now():null;
  // If all sub-tasks done → auto-advance procStatus to ready
  if(t.subTasks.every(s=>s.done) && t.procStatus==='pending_att'){
    t.procStatus='received';
    showToast('✅ ครบทุก Sub-task แล้ว — สถานะเปลี่ยนเป็น พร้อมดำเนินการ');
  }
  // Re-open modal to refresh
  openTicketModal(ticketId);
  renderTickets();
}

function confirmTicket(id,ev){
  if(ev)ev.stopPropagation();
  const t=TICKETS.find(x=>x.id===id);
  if(!t)return;
  t.status='confirmed';
  t.procStatus='accepted';
  t.acceptedAt=Date.now();
  t.confirmedAt=Date.now();
  t.currentStage='approve_po';
  // Mark only first stage done
  t.journey.po={done:true,ts:t.acceptedAt,stuck:false};
  renderDashPie();renderDashBreachChart();renderTickets();renderJourney();renderVendorSummary();renderAdminTable();
  showToast('📥 กดรับงานแล้ว — ' + t.vendor + ' · ' + fmtDateTime(t.acceptedAt));
}

function openCancelModal(id,ev){
  if(ev)ev.stopPropagation();
  cancelPendingId=id;
  const t=TICKETS.find(x=>x.id===id);
  const wrap=document.getElementById('cancel-wrap');
  wrap.innerHTML=`
    <div class="mhdr">
      <div><div class="mtitle">🚫 ยกเลิก PO</div><div class="msub">${t?t.vendor:''} — ${t?t.subject.substring(0,40):''}…</div></div>
      <button class="mclose" onclick="closeCancelModal()">✕</button>
    </div>
    <div class="mbody">
      <div style="font-size:12.5px;color:var(--text2);margin-bottom:12px">เลือกเหตุผลการยกเลิก:</div>
      <div style="display:flex;flex-direction:column;gap:6px" id="cancel-reasons">
        ${CANCEL_REASONS.map((r,i)=>`
          <label style="display:flex;align-items:center;gap:10px;padding:9px 11px;border:1.5px solid var(--border);border-radius:var(--r-sm);cursor:pointer;transition:all .12s" onmouseenter="this.style.borderColor='var(--cancel)'" onmouseleave="this.style.borderColor='var(--border)'">
            <input type="radio" name="cancel-reason" value="${r.label}" style="accent-color:var(--cancel)">
            <span style="font-size:16px">${r.icon}</span>
            <div><div style="font-weight:600;font-size:13px">${r.label}</div><div style="font-size:11.5px;color:var(--text3)">${r.desc}</div></div>
          </label>`).join('')}
      </div>
      <textarea id="cancel-note" placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)..." style="width:100%;margin-top:10px;padding:9px 11px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;resize:vertical;min-height:60px;outline:none"></textarea>
    </div>
    <div class="mfoot">
      <button class="btn btn-ghost" onclick="closeCancelModal()">ยกเลิก</button>
      <button class="btn btn-cancel" onclick="doCancel()">🚫 ยืนยันการยกเลิก</button>
    </div>`;
  document.getElementById('cancel-overlay').classList.add('open');
}
function closeCancelModal(){document.getElementById('cancel-overlay').classList.remove('open');cancelPendingId=null;}
function doCancel(){
  const sel=document.querySelector('input[name="cancel-reason"]:checked');
  if(!sel){showToast('⚠️ กรุณาเลือกเหตุผล');return;}
  const t=TICKETS.find(x=>x.id===cancelPendingId);
  if(t){t.status='canceled';t.procStatus='rejected';t.cancelReason=sel.value;t.canceledAt=Date.now();t.currentStage='canceled';}
  renderDashPie();renderDashBreachChart();renderTickets();renderJourney();renderVendorSummary();renderAdminTable();
  closeCancelModal();
  showToast('🚫 ยกเลิก PO เรียบร้อย — เหตุผล: '+sel.value);
}

// ─── ADMIN TABLE ───
function renderAdminTable(){
  const sMap={new:'<span class="badge b-new"><span class="bdot"></span>PO ใหม่</span>',pending:'<span class="badge b-pending"><span class="bdot"></span>รอ Confirm</span>',confirmed:'<span class="badge b-confirmed"><span class="bdot"></span>Confirmed</span>',canceled:'<span class="badge b-canceled"><span class="bdot"></span>ยกเลิก</span>'};
  document.getElementById('admin-tbody').innerHTML=TICKETS.map(t=>{
    const v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
    const sla=getSLAStatus(t.startTs,t.status);
    const isDone=t.status==='confirmed'||t.status==='canceled';
    return`<tr onclick="openTicketModal(${t.id})">
      <td><div class="vcell"><div class="vlogo" style="color:${v.color};background:${v.bg}">${v.logo}</div><strong>${t.vendor}</strong></div></td>
      <td style="max-width:200px;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.subject}</td>
      <td style="font-size:11.5px">${fmtDateTime(t.startTs)}</td>
      <td><span class="sla-chip ${sla.cls}" style="font-size:11px">${sla.label}</span></td>
      <td>${sMap[t.status]||''}</td>
      <td style="font-size:12px;color:var(--text2)">Admin PO</td>
      <td onclick="event.stopPropagation()">
        ${!isDone?`<button class="act-btn confirm btn-sm" onclick="confirmTicket(${t.id},event)">✓</button> <button class="act-btn cancel-btn btn-sm" onclick="openCancelModal(${t.id},event)">🚫</button>`:'<span style="font-size:11.5px;color:var(--text3)">เสร็จแล้ว</span>'}
      </td>
    </tr>`;
  }).join('');
}

// ─── NOTIFICATIONS ───
function renderNotifications(tab){
  curNotifTab=tab;
  let data=NOTIFICATIONS;
  if(tab!=='all')data=data.filter(n=>n.type===tab);
  document.getElementById('notif-list').innerHTML=data.map(n=>`
    <div class="notif-item${n.unread?' unread':''}" onclick="readNotif(${n.id})">
      <div class="notif-ava" style="background:var(--pink-ll)">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread?'<div class="notif-dot"></div>':''}
    </div>`).join('')||'<div class="empty"><div class="empty-ico">🔔</div><div class="empty-title">ไม่มีการแจ้งเตือน</div></div>';
}
function switchNotifTab(tab,el){document.querySelectorAll('.atab').forEach(x=>x.classList.remove('active'));el.classList.add('active');renderNotifications(tab);}
function readNotif(id){const n=NOTIFICATIONS.find(x=>x.id===id);if(n){n.unread=false;renderNotifications(curNotifTab);updateBadge();}}
function markAllRead(){NOTIFICATIONS.forEach(n=>n.unread=false);renderNotifications(curNotifTab);updateBadge();showToast('✓ อ่านทั้งหมดแล้ว');}
function updateBadge(){
  const c=NOTIFICATIONS.filter(n=>n.unread).length;
  const el=document.getElementById('nb-notif');
  if(el){el.textContent=c||'';el.style.display=c?'':'none';}
}

// ─── VENDOR RULES ───
function renderVendorRules(){
  document.getElementById('vendor-rules-tbody').innerHTML=vendorRules.map((r,i)=>{
    const v=VENDORS[r.name]||{color:'#666',bg:'#eee',logo:'??'};
    const portalBadge = v.portal
      ? `<a href="${v.portal}" target="_blank" style="display:inline-flex;align-items:center;gap:3px;font-size:10.5px;color:#4F46E5;font-weight:600;text-decoration:none;background:#EDE9FE;border-radius:4px;padding:2px 7px;margin-top:3px">🌐 Portal</a>`
      : '';
    return`<tr>
      <td><div class="vcell"><div class="vlogo" style="color:${v.color};background:${v.bg}">${v.logo}</div>
        <div><strong style="font-size:12.5px">${r.name}</strong>${portalBadge}</div>
      </div></td>
      <td><span class="code" style="font-size:11.5px">${r.email}</span></td>
      <td><span class="code" style="font-size:11.5px">${r.subject}</span></td>
      <td style="max-width:200px"><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${v.slaNote||'—'}</div></td>
      <td style="max-width:200px"><div style="font-size:11.5px;color:var(--text2);line-height:1.6">${v.deliveryNote||'—'}</div></td>
      <td><span class="badge ${r.active?'b-confirmed':'b-canceled'}" style="font-size:10px"><span class="bdot"></span>${r.active?'เปิดใช้งาน':'ปิดใช้งาน'}</span></td>
      <td onclick="event.stopPropagation()">
        <button class="act-btn btn-sm" onclick="toggleVendor(${i})">${r.active?'⊙ ปิด':'⊙ เปิด'}</button>
        <button class="act-btn btn-sm">✏️ แก้ไข</button>
      </td>
    </tr>`;
  }).join('');
}
function toggleVendor(i){vendorRules[i].active=!vendorRules[i].active;renderVendorRules();}
function showAddVendorModal(){
  document.getElementById('vendor-wrap').innerHTML=`
    <div class="mhdr">
      <div><div class="mtitle">➕ เพิ่ม Vendor ใหม่</div><div class="msub">กำหนด Email Pattern สำหรับ Auto-detect</div></div>
      <button class="mclose" onclick="closeVendorModal()">✕</button>
    </div>
    <div class="mbody">
      <div style="display:flex;flex-direction:column;gap:12px">
        <div><label style="font-size:11.5px;font-weight:700;color:var(--text2);display:block;margin-bottom:4px">ชื่อ Vendor *</label>
          <input id="v-name" placeholder="เช่น Shopee" style="width:100%;padding:8px 11px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;outline:none"></div>
        <div><label style="font-size:11.5px;font-weight:700;color:var(--text2);display:block;margin-bottom:4px">Email Domain *</label>
          <input id="v-email" placeholder="@shopee.co.th" style="width:100%;padding:8px 11px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:'IBM Plex Mono',monospace;font-size:13px;outline:none"></div>
        <div><label style="font-size:11.5px;font-weight:700;color:var(--text2);display:block;margin-bottom:4px">Subject Keyword</label>
          <input id="v-subj" placeholder="เช่น Shopee PO" style="width:100%;padding:8px 11px;border:1.5px solid var(--border);border-radius:var(--r-sm);font-family:inherit;font-size:13px;outline:none"></div>
      </div>
    </div>
    <div class="mfoot">
      <button class="btn btn-ghost" onclick="closeVendorModal()">ยกเลิก</button>
      <button class="btn btn-pink" onclick="addVendor()">+ เพิ่ม Vendor</button>
    </div>`;
  document.getElementById('vendor-overlay').classList.add('open');
}
function addVendor(){
  const name=document.getElementById('v-name').value.trim();
  const email=document.getElementById('v-email').value.trim();
  const subj=document.getElementById('v-subj').value.trim();
  if(!name||!email){showToast('⚠️ กรุณากรอก Vendor และ Email Domain');return;}
  vendorRules.push({name,email,subject:subj,active:true});
  renderVendorRules();closeVendorModal();
  showToast('✅ เพิ่ม Vendor '+name+' เรียบร้อยแล้ว');
}
function closeVendorModal(){document.getElementById('vendor-overlay').classList.remove('open');}

// ─── EXPORT ───
function exportTable(tableId){
  var rows=[];
  var filename='';
  var today=new Date().toISOString().slice(0,10);

  if(tableId==='vendor-summary'){
    filename='SLA_VendorSummary_'+today;
    rows.push(['คู่ค้า','เลขที่เอกสาร','Stage ปัจจุบัน','ค้างมา (ชม.)','SLA Status']);
    var tbody=document.getElementById('vendor-summary-tbody');
    if(tbody){
      var trs=tbody.querySelectorAll('tr');
      trs.forEach(function(tr){
        var tds=tr.querySelectorAll('td');
        if(tds.length>=5){
          rows.push([tds[0].innerText.trim(),tds[1].innerText.trim(),tds[2].innerText.trim(),tds[3].innerText.trim(),tds[4].innerText.trim()]);
        }
      });
    }
  } else if(tableId==='journey'){
    filename='SLA_DocumentFlow_'+today;
    rows.push(['คู่ค้า','เลขที่เอกสาร','Stage ปัจจุบัน','SLA Status','รับเมื่อ']);
    TICKETS.forEach(function(t){
      if(t.status==='canceled') return;
      var sla=getSLAStatus(t.startTs,t.status);
      var slaText=sla.cls==='urgent'?'เกิน SLA':sla.cls==='warn'?'ใกล้ครบ':'ปกติ';
      var stageLbl={po:'PO / ใบสั่งของ',approve_po:'Approve PO',open_so:'เปิด SO',approve_so:'Approve SO',doc_wh:'ส่งเอกสารให้คลัง',delivery:'Delivery',delivered:'สำเร็จ'};
      rows.push([t.vendor,t.poRef||'—',stageLbl[t.currentStage]||t.currentStage,slaText,fmtDateTime(t.startTs)]);
    });
  } else if(tableId==='admin-po'){
    filename='SLA_AdminPO_'+today;
    rows.push(['Vendor','Subject','รับ Email','SLA Deadline','สถานะ','Admin']);
    var tbody=document.getElementById('admin-tbody');
    if(tbody){
      var trs=tbody.querySelectorAll('tr');
      trs.forEach(function(tr){
        var tds=tr.querySelectorAll('td');
        if(tds.length>=6){
          rows.push([tds[0].innerText.trim(),tds[1].innerText.trim(),tds[2].innerText.trim(),tds[3].innerText.trim(),tds[4].innerText.trim(),tds[5].innerText.trim()]);
        }
      });
    }
  } else if(tableId==='po-tickets'){
    filename='SLA_POTickets_'+today;
    rows.push(['Vendor','Subject / PO Ref','รับเมื่อ','สถานะ','Stage','SLA']);
    TICKETS.forEach(function(t){
      if(t._isMockup) return;
      var sla=getSLAStatus(t.startTs,t.status);
      var slaText=sla.cls==='urgent'?'เกิน SLA':sla.cls==='warn'?'ใกล้ครบ':'ปกติ';
      rows.push([t.vendor,t.subject||t.poRef||'—',fmtDateTime(t.startTs),t.status,t.currentStage,slaText]);
    });
  } else if(tableId==='vendor-rules'){
    filename='SLA_VendorRules_'+today;
    rows.push(['Vendor','Email Domain','Subject Keyword','สถานะ']);
    var tbody=document.getElementById('vendor-rules-tbody');
    if(tbody){
      var trs=tbody.querySelectorAll('tr');
      trs.forEach(function(tr){
        var tds=tr.querySelectorAll('td');
        if(tds.length>=4){
          rows.push([tds[0].innerText.trim(),tds[1].innerText.trim(),tds[2].innerText.trim(),tds[4]?tds[4].innerText.trim():'']);
        }
      });
    }
  }

  if(rows.length<=1){showToast('ไม่มีข้อมูลที่จะ Export');return;}
  var csv=rows.map(function(r){return r.map(function(cell){return'"'+String(cell).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
  var blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  var a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename+'.csv';
  a.click();
  showToast('📥 Export สำเร็จ — '+filename+'.csv ('+( rows.length-1)+' รายการ)');
}

// ─── ATTACHMENT MODAL ───
function openAttachModal(id){
  const t=TICKETS.find(x=>x.id===id);
  if(!t)return;
  const v=VENDORS[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
  const wrap=document.getElementById('attach-modal-wrap');
  const fileIcons={pdf:'🔴',xlsx:'🟢',xls:'🟢',docx:'🔵',doc:'🔵',csv:'🟡',zip:'⚫',jpg:'🟣',png:'🟣'};
  const listHtml=t.attachments.length>0?t.attachments.map((a,i)=>{
    const ext=(a.name.split('.').pop()||'').toLowerCase();
    const ico=fileIcons[ext]||'📄';
    return`<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;border-bottom:1px solid var(--border);transition:background .1s" onmouseover="this.style.background='var(--pink-ll)'" onmouseout="this.style.background=''">
      <span style="font-size:18px;flex-shrink:0">${ico}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${a.name}">${a.name}</div>
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase">${ext} file</div>
      </div>
      <a href="${a.url}" target="_blank" onclick="event.stopPropagation()" class="btn btn-ghost btn-xs" style="flex-shrink:0">📥 เปิด</a>
    </div>`;
  }).join(''):`<div style="text-align:center;padding:30px;color:var(--text3);font-size:13px">ไม่มี Attachment</div>`;

  wrap.innerHTML=`
    <div class="mhdr">
      <div>
        <div class="mtitle">📎 Attachments — ${t.vendor}</div>
        <div class="msub">${t.subject.substring(0,50)}${t.subject.length>50?'…':''} &nbsp;·&nbsp; ${t.attachments.length} ไฟล์</div>
      </div>
      <button class="mclose" onclick="closeAttachModal()">✕</button>
    </div>
    <div style="max-height:400px;overflow-y:auto">${listHtml}</div>
    <div class="mfoot">
      <span style="font-size:11.5px;color:var(--text3);margin-right:auto">ทั้งหมด ${t.attachments.length} ไฟล์</span>
      <button class="btn btn-ghost" onclick="closeAttachModal()">ปิด</button>
    </div>`;
  document.getElementById('attach-overlay').classList.add('open');
}
function closeAttachModal(){document.getElementById('attach-overlay').classList.remove('open');}


function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg;el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'),3200);
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();closeCancelModal();closeVendorModal();closeJourneyModal();closeAttachModal();}
});

// ═══ ORDER APP JS ═══

const CURRENT_SALES = 'ฝนเทพ';


// ══════════════════════════════════════════
// ALLOCATED STOCK & QUOTA SYSTEM
// ══════════════════════════════════════════
// Mock data - in production this fetches from Google Sheets API
// Format: { [productId_variantLabel]: { allocated: N, quota: N } }
var STOCK_DATA = {};
var STOCK_LOADED = false;
var STOCK_LOADING = false;

// Mock stock data (simulates Google Sheets response)
// Structure: allocated=ยอดที่ใช้ไปแล้ว, personalQuota=Quota ของ Sales คนนี้, poolQuota=Quota รวม TT ที่ยืมกันได้
const MOCK_STOCK = {
  'g_brookie_01 Dark Chocolate':   {allocated:45, personalQuota:80,  poolQuota:200},
  'g_brookie_02 Brown Sugar':       {allocated:20, personalQuota:50,  poolQuota:150},
  'g_brookie_04 Maple Syrup':       {allocated:60, personalQuota:60,  poolQuota:180},
  'g_stylishbrow_01 Dark Brown':    {allocated:15, personalQuota:40,  poolQuota:120},
  'g_stylishbrow_02 Natural Brown': {allocated:38, personalQuota:40,  poolQuota:120},
  'g_blush_01 Best Friend':         {allocated:22, personalQuota:60,  poolQuota:160},
  'g_blush_02 Sugar And Boo':       {allocated:55, personalQuota:60,  poolQuota:160},
  'g_blush_03 Spoil Me':            {allocated:8,  personalQuota:30,  poolQuota:90},
  'g_blush_04 Crush Blush':         {allocated:0,  personalQuota:30,  poolQuota:90},
  'g_blush_05 Rosy Cheeks':         {allocated:30, personalQuota:30,  poolQuota:90},
  'g_blush_06 Kiss Me More':        {allocated:12, personalQuota:50,  poolQuota:140},
  'g_milkyblush_01 Milky Way':      {allocated:5,  personalQuota:20,  poolQuota:60},
  'g_glittergloss_01 Rose Gold':    {allocated:18, personalQuota:40,  poolQuota:110},
  'g_airykiss_01 Cherry Blossom':   {allocated:25, personalQuota:50,  poolQuota:140},
  'g_airykiss_02 Berry':            {allocated:45, personalQuota:50,  poolQuota:140},
  'g_tattoo_01 Red':                {allocated:10, personalQuota:30,  poolQuota:90},
  'g_lipbalm_01 Cherry':            {allocated:33, personalQuota:60,  poolQuota:160},
  'g_mascarabrow_One Size':         {allocated:7,  personalQuota:25,  poolQuota:70},
};

function getStockKey(pid, varLabel){ return pid+'_'+varLabel; }
function getStock(pid, varLabel){
  var key=getStockKey(pid,varLabel);
  return STOCK_DATA[key]||null;
}
function getQuotaRemaining(pid, varLabel, qtyInCart){
  var s=getStock(pid,varLabel);
  if(!s) return null;
  return s.personalQuota - s.allocated - (qtyInCart||0);
}
function getPoolRemaining(pid, varLabel, qtyInCart){
  var s=getStock(pid,varLabel);
  if(!s) return null;
  return s.poolQuota - s.allocated - (qtyInCart||0);
}

async function loadAllocatedStock(){
  if(STOCK_LOADING) return;
  STOCK_LOADING=true;
  const btn=document.getElementById('loadStockBtn');
  if(btn){btn.textContent='⏳ กำลังโหลด...';btn.disabled=true;}
  // Simulate async fetch from Google Sheets (1.5s delay)
  await new Promise(r=>setTimeout(r,1500));
  // In production: fetch from Google Sheets API
  // const resp = await fetch('https://sheets.googleapis.com/v4/spreadsheets/SHEET_ID/values/Stock!A:D?key=API_KEY');
  STOCK_DATA = {...MOCK_STOCK};
  STOCK_LOADED = true;
  STOCK_LOADING = false;
  if(btn){btn.textContent='🔄 Reload Stock';btn.disabled=false;}
  renderPgrid();
  if(S.varPid) renderVarList(PRODUCTS.find(x=>x.id===S.varPid));
  showToast('✅ โหลด Allocated Stock สำเร็จ — ข้อมูลล่าสุด '+new Date().toLocaleTimeString('th-TH'));
}

const CUSTOMERS = [
  {id:'1889',name:'CHOM SREY YOU',sales:'ฝนเทพ',type:'Dealer'},{id:'1345',name:'Miss VUOCH ENG KAING',sales:'ฝนเทพ',type:'Wholesale'},
  {id:'2701',name:'MUANJAI TRADING EXPORT-IMPORT',sales:'ฝนเทพ',type:'Dealer'},{id:'3063',name:'OR NAI SEA',sales:'ฝนเทพ',type:'Wholesale'},
  {id:'1981',name:'SOKKHENG HOK',sales:'ฝนเทพ',type:'Dealer'},{id:'3253',name:'VOUCHMUY KAING',sales:'ฝนเทพ',type:'Dealer'},
  {id:'330',name:'เซคคั่นฟลอร์',sales:'ฝนเทพ',type:'Wholesale'},{id:'1887',name:'ไอซี่ บิวตี้ สำนักงานใหญ่',sales:'ฝนเทพ',type:'Dealer'},
  {id:'73',name:'ไฮโซ คอสเมติก สำนักงานใหญ่',sales:'ฝนเทพ',type:'Wholesale'},{id:'768',name:'ชมพู่คอสเมติกส์',sales:'ฝนเทพ',type:'Dealer'},
  {id:'1974',name:'ดาวบิวตี้ สำนักงานใหญ่',sales:'ฝนเทพ',type:'Wholesale'},{id:'1349',name:'น.ส.พลอยรุ้ง เลิศทวีพรกุล',sales:'ฝนเทพ',type:'Dealer'},
  {id:'83',name:'บ.เจเอ็ม คอสเมติคส์ (ไทยแลนด์) จำกัด',sales:'ฝนเทพ',type:'Wholesale'},
  {id:'687',name:'เอ็นเอ็น บิวตี้',sales:'สิริกาญจน์',type:'Dealer'},{id:'1943',name:'คุณเซ่งเว้ง แซ่เตียว',sales:'สิริกาญจน์',type:'Dealer'},
  {id:'1942',name:'คุณธนธัส อินมา',sales:'สิริกาญจน์',type:'Wholesale'},{id:'2671',name:'คุณภัทรสุฎา ชุณหชัชวาลกุล',sales:'สิริกาญจน์',type:'Dealer'},
  {id:'678',name:'ดีโม่ คอสเมติก',sales:'สิริกาญจน์',type:'Wholesale'},{id:'3182',name:'น.ส. วิชุดา ชัยคำวัง',sales:'สิริกาญจน์',type:'Dealer'},
  {id:'3218',name:'น.ส. อุมาพร จันทวี',sales:'สิริกาญจน์',type:'Dealer'},{id:'1957',name:'น.ส.ภัทชา ไตรเวทย์',sales:'สิริกาญจน์',type:'Wholesale'},
  {id:'2742',name:'นางสาว อุบลวรรณ แก้วสุนัน',sales:'สิริกาญจน์',type:'Dealer'},{id:'351',name:'น้ำหวานบิวตี้',sales:'สิริกาญจน์',type:'Wholesale'},
  {id:'76',name:'บ.เคโร๊ะบิวตี้ จำกัด',sales:'สิริกาญจน์',type:'Dealer'},{id:'1997',name:'บ.เจบี อิมเพรส (ประเทศไทย) จำกัด',sales:'สิริกาญจน์',type:'Wholesale'},
  {id:'750',name:'เครื่องแป้งสิริกาญจน์36',sales:'สิริกาญจน์',type:'Dealer'},
  {id:'1955',name:'แคทลียา บิวตี้',sales:'อัมพร',type:'Wholesale'},{id:'3323',name:'แอล เอส มาร์เก็ตติ้ง',sales:'อัมพร',type:'Dealer'},
  {id:'730',name:'แฮร์บิวตี้ สำนักงานใหญ่',sales:'อัมพร',type:'Dealer'},{id:'778',name:'โฉมงาม',sales:'อัมพร',type:'Wholesale'},
  {id:'1886',name:'กระบี่ คอสเมติก สำนักงานใหญ่',sales:'อัมพร',type:'Dealer'},{id:'1915',name:'คลังจันทร์เจ้า',sales:'อัมพร',type:'Wholesale'},
  {id:'3047',name:'คอสเม่ สโตร์',sales:'อัมพร',type:'Dealer'},{id:'1994',name:'จัสพิงค์ สำนักงานใหญ่',sales:'อัมพร',type:'Dealer'},
  {id:'1877',name:'น.ส.พิกุล สมใจ',sales:'อัมพร',type:'Wholesale'},{id:'711',name:'น.ส.สรัลชนา ศรีเฮงไพบูลย์',sales:'อัมพร',type:'Dealer'},
  {id:'2986',name:'นางสาว วลัยพร หิมมะ',sales:'อัมพร',type:'Wholesale'},{id:'1913',name:'นาย ญาณวุฒิ โค้วณาภรณ์',sales:'อัมพร',type:'Dealer'},
];

// variants: [{label, trCode, barcode, price50, price6}]
const PRODUCTS = [
  // ─── BROW ───
  {id:'g_mascarabrow',name:'Brow High Lifting Light Mascara',cat:'Eye',emoji:'👁️',dealer:80,wholesale:87,
    variants:[{label:'One Size',trCode:'',barcode:'8857127482163',price50:null,price6:null}]},
  {id:'g_brookie',name:'Brookie Brow Slim Pencil',cat:'Brow',emoji:'✏️',dealer:45,wholesale:52,
    variants:[
      {label:'01 Dark Chocolate',trCode:'25011',barcode:'8857127482170',price50:null,price6:null},
      {label:'02 Brown Sugar',trCode:'25021',barcode:'8857127482187',price50:null,price6:null},
      {label:'04 Maple Syrup',trCode:'25040',barcode:'8857127482200',price50:null,price6:null},
    ]},
  {id:'g_stylishbrow',name:'Stylish Brow Auto Pencil',cat:'Brow',emoji:'🎯',dealer:32,wholesale:37,
    variants:[
      {label:'01 Dark Brown',trCode:'25050',barcode:'8857127482545',price50:null,price6:null},
      {label:'02 Natural Brown',trCode:'25060',barcode:'8857127482552',price50:null,price6:null},
    ]},
  // ─── CHEEK ───
  {id:'g_blush',name:'Glowfriend Natural Blush On',cat:'Cheek',emoji:'🌸',dealer:60,wholesale:67,
    variants:[
      {label:'01 Best Friend',trCode:'16010',barcode:'8857127482217',price50:null,price6:null},
      {label:'02 Sugar And Boo',trCode:'16020',barcode:'8857127482224',price50:null,price6:null},
      {label:'03 Spoil Me',trCode:'16030',barcode:'8857127482231',price50:null,price6:null},
      {label:'04 Crush Blush',trCode:'16040',barcode:'8857127482248',price50:null,price6:null},
      {label:'05 Rosy Cheeks',trCode:'16050',barcode:'8857127482255',price50:null,price6:null},
      {label:'06 Kiss Me More',trCode:'16060',barcode:'8857127482262',price50:null,price6:null},
      {label:'07 Coral Kiss',trCode:'16070',barcode:'8857127482279',price50:null,price6:null},
      {label:'08 Double Spice',trCode:'16080',barcode:'8857127482286',price50:null,price6:null},
      {label:'09 Hey Bestie',trCode:'16090',barcode:'8857127482293',price50:null,price6:null},
      {label:'10 You Look Good',trCode:'16100',barcode:'8857127482620',price50:null,price6:null},
      {label:'11 Y2K Is Now',trCode:'16110',barcode:'8857127482637',price50:null,price6:null},
    ]},
  {id:'g_milkyblush',name:'The Milky Way Marble Blush On',cat:'Cheek',emoji:'🌌',dealer:80,wholesale:90,
    variants:[
      {label:'01 Lunar Eclipse',trCode:'16120',barcode:'8857128879078',price50:null,price6:null},
      {label:'02 Jupiter',trCode:'16130',barcode:'8857128879085',price50:null,price6:null},
      {label:'03 Shooting Star',trCode:'16140',barcode:'8857128879092',price50:null,price6:null},
    ]},
  {id:'g_crystalblush',name:'Crystal Cube PH Changing Blush Gel',cat:'Cheek',emoji:'💎',dealer:100,wholesale:120,
    variants:[
      {label:'Standard',trCode:'16150',barcode:'8857128879184',price50:null,price6:null},
    ]},
  {id:'g_mochiblush',name:'Glowfriend Mochi Blush On',cat:'Cheek',emoji:'🍡',dealer:110,wholesale:120,
    variants:[
      {label:"#01 That's My Girl",trCode:'16190',barcode:'8857128879658',price50:null,price6:null},
      {label:'#02 Stay Cool',trCode:'16200',barcode:'8857128879665',price50:null,price6:null},
      {label:'#03 Babe Club',trCode:'16210',barcode:'8857128879672',price50:null,price6:null},
      {label:'#04 Crush Blush',trCode:'16220',barcode:'8857128879689',price50:null,price6:null},
      {label:'#05 Rosy Cheeks',trCode:'16230',barcode:'8857128879696',price50:null,price6:null},
      {label:'#06 Kiss Me More',trCode:'16240',barcode:'8857128879702',price50:null,price6:null},
      {label:'#07 Coral Kiss',trCode:'16250',barcode:'8857128879719',price50:null,price6:null},
      {label:'#08 Sugar And Boo',trCode:'16260',barcode:'8857128879726',price50:null,price6:null},
      {label:'#09 Gimmie Blush',trCode:'16270',barcode:'8857128879733',price50:null,price6:null},
      {label:'#10 You Look Good',trCode:'16280',barcode:'8857128879740',price50:null,price6:null},
      {label:'#11 Y2K Is Now',trCode:'16290',barcode:'8857128879757',price50:null,price6:null},
      {label:'#12 My Bestie',trCode:'16300',barcode:'8857128879764',price50:null,price6:null},
    ]},
  {id:'g_jellyjoy',name:'Jelly Joy Cheek',cat:'Cheek',emoji:'🍬',dealer:110,wholesale:120,
    variants:[
      {label:'01 Soda Pop',trCode:'16160',barcode:'8857128879344',price50:null,price6:null},
      {label:'02 Sugar On Me',trCode:'17010',barcode:'8857128879351',price50:null,price6:null},
      {label:'03 Chewy Cherry',trCode:'16170',barcode:'8857128879368',price50:null,price6:null},
      {label:'04 Eve & Joy',trCode:'16180',barcode:'8857128879375',price50:null,price6:null},
    ]},
  {id:'g_liquidblush',name:'You Make Me Blush Liquid Blush On',cat:'Cheek',emoji:'💗',dealer:55,wholesale:60,
    variants:[
      {label:'01 First Date',trCode:'16310',barcode:'8857128879627',price50:null,price6:null},
      {label:'02 Fancy You',trCode:'16320',barcode:'8857128879634',price50:null,price6:null},
      {label:'03 Fall You',trCode:'16330',barcode:'8857128879641',price50:null,price6:null},
      {label:'04 Faith Love',trCode:'16370',barcode:'8859856200032',price50:null,price6:null},
      {label:'05 Forever Youth',trCode:'16380',barcode:'8859856200049',price50:null,price6:null},
    ]},
  {id:'g_jeweljelly',name:'Jewel Jelly Crystal Stick',cat:'Cheek',emoji:'💠',dealer:84,wholesale:89,
    variants:[
      {label:'01 Pink Diamond',trCode:'17020',barcode:'8859856200315',price50:null,price6:null},
      {label:'02 Silver Moon',trCode:'17030',barcode:'8859856200322',price50:null,price6:null},
      {label:'03 Gold Crush',trCode:'17040',barcode:'8859856200339',price50:null,price6:null},
    ]},
  {id:'g_charmon',name:'Charm On Glassy/Matte Stick',cat:'Cheek',emoji:'🪄',dealer:55,wholesale:60,
    variants:[
      {label:'01 Pink Me Up (Glassy)',trCode:'16390',barcode:'8859856200483',price50:null,price6:null},
      {label:'02 Moonberry (Glassy)',trCode:'16400',barcode:'8859856200490',price50:null,price6:null},
      {label:'03 Dewy Pomelo (Glassy)',trCode:'16410',barcode:'8859856200506',price50:null,price6:null},
      {label:'04 Sugar Lilac (Glassy)',trCode:'16420',barcode:'8859856200513',price50:null,price6:null},
      {label:'05 Mwah Pink (Matte)',trCode:'16430',barcode:'8859856200520',price50:null,price6:null},
      {label:'06 Charming Rosette (Matte)',trCode:'16440',barcode:'8859856200537',price50:null,price6:null},
      {label:'07 Fog Mocha (Matte)',trCode:'16450',barcode:'8859856200544',price50:null,price6:null},
      {label:'08 Toasty Teddy (Matte)',trCode:'16460',barcode:'8859856200551',price50:null,price6:null},
    ]},
  // ─── EYE ───
  {id:'g_eyepalette',name:'Glowlogram Eyeshadow Palette',cat:'Eye',emoji:'🎨',dealer:80,wholesale:90,
    variants:[
      {label:'01 Sweet Moments',trCode:'22010',barcode:'8857127482569',price50:null,price6:null},
      {label:'02 Peach Energy',trCode:'22020',barcode:'8857127482576',price50:null,price6:null},
      {label:'03 Warm On A Cold Night',trCode:'22030',barcode:'8857127482583',price50:null,price6:null},
      {label:"04 Shiny Apricot",trCode:'22040',barcode:'8857127482668',price50:null,price6:null},
      {label:"05 Frosted 90's",trCode:'22050',barcode:'8857127482781',price50:null,price6:null},
    ]},
  {id:'g_eyeliner',name:'Stylish Matte Eyeliner',cat:'Eye',emoji:'✍️',dealer:60,wholesale:70,
    variants:[{label:'Black',trCode:'23000',barcode:'8857127482774',price50:null,price6:null}]},
  // ─── LIP ───
  {id:'g_glittergloss',name:'Show Me Your Love Glitter Lip Gloss',cat:'Lip',emoji:'✨',dealer:60,wholesale:67,
    variants:[
      {label:'GL01 Crush On You',trCode:'32010',barcode:'8857127482361',price50:null,price6:null},
      {label:'GL02 Be My Baby',trCode:'32020',barcode:'8857127482378',price50:null,price6:null},
      {label:'GL03 Make You Mine',trCode:'32030',barcode:'8857127482385',price50:null,price6:null},
    ]},
  {id:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',cat:'Lip',emoji:'💋',dealer:60,wholesale:67,
    variants:[
      {label:'01 Crazy On Me',trCode:'33130',barcode:'8857127482309',price50:null,price6:null},
      {label:'02 Adore Me',trCode:'33140',barcode:'8857127482316',price50:null,price6:null},
      {label:'03 Play With Me',trCode:'33150',barcode:'8857127482323',price50:null,price6:null},
      {label:'04 Dance With Me',trCode:'33160',barcode:'8857127482330',price50:null,price6:null},
      {label:'05 Try Me',trCode:'33170',barcode:'8857127482347',price50:null,price6:null},
      {label:'06 Forget Me (Not)',trCode:'33180',barcode:'8857127482354',price50:null,price6:null},
      {label:'07 New',trCode:'33340',barcode:'8857128879016',price50:null,price6:null},
      {label:'08 New',trCode:'33350',barcode:'8857128879023',price50:null,price6:null},
    ]},
  {id:'g_tattoo',name:'Show Me Your Charm Tattoo Matte Tint',cat:'Lip',emoji:'💄',dealer:60,wholesale:67,
    variants:[
      {label:'01 Chic Rouge',trCode:'33190',barcode:'8857127482392',price50:null,price6:null},
      {label:'02 Naughty Pink',trCode:'33200',barcode:'8857127482408',price50:null,price6:null},
      {label:'03 Jolly Tangerine',trCode:'33211',barcode:'8857127482415',price50:null,price6:null},
    ]},
  {id:'g_lipbalm',name:'Good Mood Extra Shine Lip Balm',cat:'Lip',emoji:'🍒',dealer:70,wholesale:80,
    variants:[
      {label:'01 Pink Lemonade',trCode:'34010',barcode:'8857127482675',price50:null,price6:null},
      {label:'02 Orange Marmalade',trCode:'34020',barcode:'8857127482682',price50:null,price6:null},
      {label:'03 Cherry Margarita',trCode:'34030',barcode:'8857127482699',price50:null,price6:null},
      {label:'04 Chocolate Milk Tea',trCode:'34040',barcode:'8857127482705',price50:null,price6:null},
    ]},
  {id:'g_juicydrop',name:'Show Me Your Love Juicy Drop Lip & Cheek Oil',cat:'Lip',emoji:'🍓',dealer:75,wholesale:82,
    variants:[
      {label:'01 Rosy Drop',trCode:'32050',barcode:'8857127482743',price50:null,price6:null},
      {label:'02 Bright & Glow Drop',trCode:'32060',barcode:'8857127482750',price50:null,price6:null},
      {label:'03 Aqua Drop',trCode:'32070',barcode:'8857127482767',price50:null,price6:null},
    ]},
  {id:'g_juicyglowtint',name:'Juicy Glowy Tint',cat:'Lip',emoji:'🌹',dealer:70,wholesale:80,
    variants:[
      {label:'01 Cherry On Top',trCode:'33220',barcode:'8857127482453',price50:null,price6:null},
      {label:'02 Cranberry Syrup',trCode:'33230',barcode:'8857127482460',price50:null,price6:null},
      {label:'03 Sweet Jelly',trCode:'33240',barcode:'8857127482477',price50:null,price6:null},
      {label:'04 Pink Pomelo',trCode:'33250',barcode:'8857127482484',price50:null,price6:null},
      {label:'05 Lychee Soda',trCode:'33260',barcode:'8857127482491',price50:null,price6:null},
      {label:'06 Peach Parfait',trCode:'33270',barcode:'8857127482507',price50:null,price6:null},
      {label:'07 Sugar Figs',trCode:'33280',barcode:'8857127482989',price50:null,price6:null},
      {label:'08 Berry Sorbet',trCode:'33290',barcode:'8857127482996',price50:null,price6:null},
    ]},
  {id:'g_milkylipbalm',name:'The Milky Way Marble Liquid Lip Balm',cat:'Lip',emoji:'🌙',dealer:90,wholesale:110,
    variants:[
      {label:'01 Morning Star',trCode:'34050',barcode:'8857128879030',price50:null,price6:null},
      {label:'02 Strawberry Moon',trCode:'34060',barcode:'8857128879047',price50:null,price6:null},
      {label:'03 Nebula',trCode:'34070',barcode:'8857128879054',price50:null,price6:null},
      {label:'04 Supernova',trCode:'34080',barcode:'8857128879061',price50:null,price6:null},
    ]},
  {id:'g_endlesskiss',name:'Endless Kiss Liquid Matte',cat:'Lip',emoji:'💞',dealer:38,wholesale:42,
    variants:[
      {label:'01 Puppy Love',trCode:'33310',barcode:'8857127482897',price50:null,price6:null},
      {label:'02 Romantic Love',trCode:'33320',barcode:'8857127482903',price50:null,price6:null},
      {label:'03 True Love',trCode:'33330',barcode:'8857127482910',price50:null,price6:null},
      {label:'04 Cherry Rush',trCode:'33570',barcode:'8859856200773',price50:null,price6:null},
      {label:'05 Burnt Sugar',trCode:'33580',barcode:'8859856200780',price50:null,price6:null},
      {label:'06 Velvet Rosewood',trCode:'33590',barcode:'8859856200797',price50:null,price6:null},
    ]},
  {id:'g_paradisegloss',name:'Show Me Your Love In To The Paradise Lip Gloss 2.5g',cat:'Lip',emoji:'🦋',dealer:60,wholesale:67,
    variants:[
      {label:'GL04 Crystal Heart',trCode:'32090',barcode:'8857128879559',price50:null,price6:null},
      {label:'GL05 Fairy Dust',trCode:'32100',barcode:'8857128879566',price50:null,price6:null},
      {label:'GL06 Starry Sky',trCode:'32110',barcode:'8857128879573',price50:null,price6:null},
      {label:'GL07 Pinky Twinkle',trCode:'32120',barcode:'8857128879580',price50:null,price6:null},
      {label:'GL08 Petal Aura',trCode:'32130',barcode:'8857128879597',price50:null,price6:null},
      {label:"GL09 Aphros's Rose",trCode:'32140',barcode:'8857128879603',price50:null,price6:null},
      {label:'GL10 Wine Reflection',trCode:'32150',barcode:'8857128879610',price50:null,price6:null},
    ]},
  {id:'g_mellowbalm',name:'Mellow Shining Balm',cat:'Lip',emoji:'🌟',dealer:90,wholesale:100,
    variants:[
      {label:'01 Girl Boss',trCode:'31010',barcode:'8857128879276',price50:null,price6:null},
      {label:'02 New Gen',trCode:'31020',barcode:'8857128879283',price50:null,price6:null},
      {label:'03 Intern',trCode:'31030',barcode:'8857128879290',price50:null,price6:null},
      {label:'04 Inspiring',trCode:'31040',barcode:'8857128879306',price50:null,price6:null},
      {label:'05 My Goal',trCode:'31050',barcode:'8857128879313',price50:null,price6:null},
      {label:'06 Recall',trCode:'31060',barcode:'8857128879320',price50:null,price6:null},
    ]},
  {id:'g_juicypop',name:'Juicy Pop Tint',cat:'Lip',emoji:'🫧',dealer:90,wholesale:95,
    variants:[
      {label:'01 Pink Lady',trCode:'33390',barcode:'8859856200353',price50:null,price6:null},
      {label:'02 Milky Raspberry',trCode:'33400',barcode:'8859856200360',price50:null,price6:null},
      {label:'03 Dragon Bloom',trCode:'33410',barcode:'8859856200377',price50:null,price6:null},
      {label:'04 Grape Bliss',trCode:'33420',barcode:'8859856200384',price50:null,price6:null},
      {label:'05 Cherry Pop',trCode:'33430',barcode:'8859856200391',price50:null,price6:null},
      {label:'06 Strawberry Martini',trCode:'33440',barcode:'8859856200407',price50:null,price6:null},
      {label:'07 Ruby Punch',trCode:'33450',barcode:'8859856200414',price50:null,price6:null},
      {label:'08 Melon Crush',trCode:'33460',barcode:'8859856200421',price50:null,price6:null},
      {label:'09 Caramel Apple Rum',trCode:'33470',barcode:'8859856200438',price50:null,price6:null},
    ]},
  {id:'g_airykisstintmatte',name:'Airy Kiss Tint Matte Lip & Cheek',cat:'Lip',emoji:'🌺',dealer:100,wholesale:105,
    variants:[
      {label:'01 Rose Meringue',trCode:'33510',barcode:'8859856200704',price50:null,price6:null},
      {label:'02 Cherry On Top',trCode:'33520',barcode:'8859856200711',price50:null,price6:null},
      {label:'03 Tangerine Crush',trCode:'33530',barcode:'8859856200728',price50:null,price6:null},
      {label:'04 Strawberry Kiss',trCode:'33540',barcode:'8859856200735',price50:null,price6:null},
      {label:'05 Almond Cream',trCode:'33550',barcode:'8859856200742',price50:null,price6:null},
      {label:'06 Peach Mousse',trCode:'33560',barcode:'8859856200759',price50:null,price6:null},
    ]},
  // ─── FACE ───
  {id:'g_cushionold',name:'Airy Glow Everyday Cushion SPF50+ PA++++ (เก่า)',cat:'Face',emoji:'🧁',dealer:180,wholesale:220,
    variants:[
      {label:'01 Ivory',trCode:'12010',barcode:'8857127482422',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12020',barcode:'8857127482439',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12030',barcode:'8857127482446',price50:null,price6:null},
    ]},
  {id:'g_cushionnew',name:'Charming Glow Airy Cushion SPF50+ PA++++',cat:'Face',emoji:'🪞',dealer:185,wholesale:205,
    variants:[
      {label:'01 Ivory',trCode:'12040',barcode:'8857127482804',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12050',barcode:'8857127482811',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12060',barcode:'8857127482828',price50:null,price6:null},
    ]},
  {id:'g_foundation',name:'Charming Glow Longwear Foundation SPF50+ PA++++',cat:'Face',emoji:'🧴',dealer:180,wholesale:200,
    variants:[
      {label:'01 Ivory',trCode:'11010',barcode:'8857127482842',price50:null,price6:null},
      {label:'02 Light Beige',trCode:'11020',barcode:'8857127482859',price50:null,price6:null},
      {label:'03 Medium Beige',trCode:'11030',barcode:'8857127482866',price50:null,price6:null},
      {label:'04 Honey Beige',trCode:'11040',barcode:'8857127482873',price50:null,price6:null},
    ]},
  {id:'g_foundation5g',name:'Charming Glow Longwear Foundation 5g',cat:'Face',emoji:'🧴',dealer:33,wholesale:37,
    variants:[
      {label:'01 Ivory 5g',trCode:'11012',barcode:'8857128879986',price50:31,price6:null},
      {label:'02 Light Beige 5g',trCode:'11021',barcode:'8857127482927',price50:31,price6:null},
      {label:'03 Medium Beige 5g',trCode:'11032',barcode:'8857128879993',price50:31,price6:null},
    ]},
  {id:'g_powder',name:'Charming Glow Setting Powder Translucent (แป้งนางฟ้า)',cat:'Face',emoji:'💫',dealer:180,wholesale:200,
    variants:[{label:'Translucent',trCode:'15000',barcode:'8857127482835',price50:null,price6:null}]},
  {id:'g_acnecushion',name:'Matte All Day Acne Cushion SPF50 PA++++',cat:'Face',emoji:'🌿',dealer:160,wholesale:170,
    variants:[
      {label:'01 Ivory',trCode:'12080',barcode:'8857128879962',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12070',barcode:'8857128879412',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12090',barcode:'8857128879962',price50:null,price6:null},
    ]},
  {id:'g_acnecushion5g',name:'Matte All Day Acne Cushion SPF50 PA++++ 5g',cat:'Face',emoji:'🌿',dealer:35,wholesale:37,
    variants:[
      {label:'01 Ivory 5g',trCode:'12130',barcode:'8859856200223',price50:33,price6:null},
      {label:'02 Natural Beige 5g',trCode:'12140',barcode:'8859856200230',price50:33,price6:null},
      {label:'03 Honey Beige 5g',trCode:'12150',barcode:'8859856200247',price50:33,price6:null},
    ]},
  {id:'g_perfectheart',name:'Perfect Heart Everlasting Matte Cushion SPF50+ PA+++',cat:'Face',emoji:'💝',dealer:220,wholesale:240,
    variants:[
      {label:'00 Fair',trCode:'12220',barcode:'8859856200575',price50:null,price6:null},
      {label:'01 Ivory',trCode:'12160',barcode:'8859856200285',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12170',barcode:'8859856200292',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12180',barcode:'8859856200308',price50:null,price6:null},
    ]},
  {id:'g_settingspray',name:'Perfect Heart Matte Finish Setting Spray 50ml',cat:'Face',emoji:'💨',dealer:55,wholesale:60,
    variants:[{label:'50ml',trCode:'18000',barcode:'8859856200568',price50:null,price6:null}]},
  {id:'g_brush',name:'Charming Glow Powder Brush (แปรง)',cat:'Beauty Tools',emoji:'🖌️',dealer:57,wholesale:68,
    variants:[{label:'Standard',trCode:'42000',barcode:'8857127482880',price50:null,price6:null}]},
  {id:'g_primer',name:'Hyacherry Oil Control Primer 6g',cat:'Face',emoji:'🫙',dealer:37,wholesale:39,
    variants:[{label:'6g',trCode:'14000',barcode:'8859856200452',price50:null,price6:35}]},
  // ─── SKINCARE ───
  {id:'g_sunscreen40',name:'UV Extra Shine Crystal Shield Sunscreen SPF50+PA++++ 40g',cat:'Skincare',emoji:'☀️',dealer:190,wholesale:220,
    variants:[{label:'40g',trCode:'51001',barcode:'8857128879177',price50:null,price6:null}]},
  {id:'g_sunscreen10',name:'UV Extra Shine Crystal Shield Sunscreen SPF50+PA++++ 10g',cat:'Skincare',emoji:'☀️',dealer:70,wholesale:80,
    variants:[{label:'10g',trCode:'51003',barcode:'8857128879146',price50:null,price6:null}]},
  {id:'g_toner',name:'Acne Balance Toner Pad 110ml',cat:'Skincare',emoji:'💧',dealer:140,wholesale:150,
    variants:[{label:'110ml',trCode:'53021',barcode:'8859856200766',price50:null,price6:null}]},
  {id:'g_cleanser',name:'Acne Balance Cleansing Gel 100ml',cat:'Skincare',emoji:'🫧',dealer:50,wholesale:60,
    variants:[{label:'100ml',trCode:'52011',barcode:'8859856200674',price50:null,price6:null}]},
];


const CATS = ['ทั้งหมด', ...new Set(PRODUCTS.map(p=>p.cat))];

