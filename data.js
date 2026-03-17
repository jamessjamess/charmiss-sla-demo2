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
   currentStage:'approve_po'},
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
   currentStage:'approve_po'},
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
   journey:{po:{done:true,ts:now-10*3600000},approve_po:{done:true,ts:now-9*3600000},open_so:{done:true,ts:now-8*3600000},approve_so:{done:true,ts:now-6*3600000},doc_wh:{done:true,ts:now-4*3600000},delivery:{done:false,ts:now-4*3600000,stuck:false},delivered:{done:false,ts:null,stuck:false}},
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
   currentStage:'approve_po'},
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

  // ── Lotus (more POs from TIMS system) ──
  {id:35,vendor:'Lotus',subject:'TIMS alert message for "Purchase order - 39148958 is published"',poRef:'39148958',
   caseType:'A',procStatus:'verified',
   attachments:[{name:'สำเนาของ 260309132623.988',url:'#',poRef:'39148958',ext:'pdf'}],
   status:'pending',startTs:now-18*3600000,risk:'low',cancelReason:'',emailFrom:'tims-prod@lotuss.com',
   emailBody:'Dear TIMS supplier,\n\nNew Purchase order - 39148958 has been published for vendor code 57204.\n\nPlease check it at https://tims.lotuss.com\n\nRegards,\nTIMS system',
   journey:{po:{done:true,ts:now-18*3600000},approve_po:{done:true,ts:now-17*3600000},open_so:{done:true,ts:now-15*3600000},approve_so:{done:true,ts:now-12*3600000},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'doc_wh'},

  // ── 24Shopping (more POs) ──
  {id:36,vendor:'24Shopping (7-11)',subject:'PO "2038491:บจ. บีไทม์ บิวตี้ เฮ้าส์ PO Date 10/03/2026"',poRef:'PO_CT43529163',
   caseType:'A',procStatus:'received',
   attachments:[
     {name:'PO_CT43529163.pdf',url:'#',poRef:'PO_CT43529163',ext:'pdf'},
     {name:'2038491_202603101430010797_854.pdf',url:'#',poRef:'PO_CT43529163',ext:'pdf'},
   ],
   status:'pending',startTs:now-4*3600000,risk:'low',cancelReason:'',emailFrom:'auto_po@24shopping.co.th',
   emailBody:'เรียน คู่ค้า\n\nการจัดเตรียมสินค้าเข้าคลัง 24Shopping\n- สินค้าต้องมี สคบ. ภาษาไทยและ Barcode ติดทุกชิ้น\n- สำเนา PO + ใบส่งสินค้า / ใบกำกับภาษี (ต้นฉบับ)\n\nเลขที่เอกสาร: T041030181',
   journey:{po:{done:true,ts:now-4*3600000},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po'},

  {id:37,vendor:'24Shopping (7-11)',subject:'PO "2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์" เตรียมสินค้าเข้าคลัง // เลขที่ "PO_CT33530327"',poRef:'PO_CT33530327',
   caseType:'A',procStatus:'approved',
   attachments:[{name:'PO_CT33530327.pdf',url:'#',poRef:'PO_CT33530327',ext:'pdf'}],
   status:'pending',startTs:now-32*3600000,risk:'low',cancelReason:'',emailFrom:'rpa-notification@cpall.co.th',
   emailBody:'เรียน 2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์\n\nรบกวนจัดเตรียมสินค้าพร้อมจัดส่ง รายละเอียดตาม PO แนบ',
   journey:{po:{done:true,ts:now-32*3600000},approve_po:{done:true,ts:now-31*3600000},open_so:{done:true,ts:now-29*3600000},approve_so:{done:true,ts:now-27*3600000},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'doc_wh'},

  {id:38,vendor:'24Shopping (7-11)',subject:'PO "2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์" เตรียมสินค้าเข้าคลัง // เลขที่ "PO_CT33530230"',poRef:'PO_CT33530230',
   caseType:'A',procStatus:'approved',
   attachments:[{name:'PO_CT33530230.pdf',url:'#',poRef:'PO_CT33530230',ext:'pdf'}],
   status:'confirmed',startTs:now-5*24*3600000+2*3600000,risk:'low',cancelReason:'',emailFrom:'rpa2-notification@gosoft.co.th',
   emailBody:'เรียน 2038491 บจ. บีไทม์ บิวตี้ เฮ้าส์\n\nรบกวนจัดเตรียมสินค้าพร้อมจัดส่ง รายละเอียดตาม PO แนบ',
   journey:{po:{done:true,ts:now-5*24*3600000+2*3600000},approve_po:{done:true,ts:now-5*24*3600000+3*3600000},open_so:{done:true,ts:now-4.8*24*3600000},approve_so:{done:true,ts:now-4.5*24*3600000},doc_wh:{done:true,ts:now-4*24*3600000},delivery:{done:true,ts:now-3*24*3600000},delivered:{done:true,ts:now-2*24*3600000}},
   currentStage:'delivered'},

  // ── Multy ──
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

  // ── Traditional Trade (Order-sourced, แสดงใน SLA Journey เท่านั้น) ──
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
     approve_po:{done:false,ts:null,stuck:true},
     open_so:{done:false,ts:null,stuck:false},
     approve_so:{done:false,ts:null,stuck:false},
     doc_wh:{done:false,ts:null,stuck:false},
     delivery:{done:false,ts:null,stuck:false},
     delivered:{done:false,ts:null,stuck:false},
   },
   currentStage:'approve_po',stuckReason:'รอ Approve Order จาก Sales Manager'},

  // ─── MOCKUP: ตัวอย่างเอกสารค้างในแต่ละ Stage (MT) ───
  {id:101,vendor:'Beautrium',subject:'[MOCKUP] BT-PO-20250801-007 — ค้างที่ PO / รับ Email',poRef:'BT-PO-20250801-007',
   caseType:'A',procStatus:'received',
   _isMockup:true,stuckReason:'📥 Email เข้าระบบแล้ว แต่ยังไม่มีใครหยิบขึ้นมาดำเนินการ — รอ Assign งานอยู่นานกว่า 38 ชั่วโมง',
   attachments:[],status:'pending',startTs:now-38*3600000,risk:'high',cancelReason:'',emailFrom:'purchasing@beautrium.com',
   journey:{po:{done:false,ts:null,stuck:true},approve_po:{done:false,ts:null,stuck:false},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'po'},

  {id:102,vendor:'Konvy',subject:'[MOCKUP] KV-106055 — ค้างที่ Approve PO นาน 2 วัน',poRef:'KV-106055',
   caseType:'A',procStatus:'escalated',
   _isMockup:true,stuckReason:'✍️ รอผู้มีอำนาจอนุมัติ PO — ผู้อนุมัติลาออกนอก ค้างอยู่นาน 52 ชั่วโมง',
   attachments:[{name:'Konvy_PO_106055.pdf',url:'#'}],
   status:'pending',startTs:now-52*3600000,risk:'high',cancelReason:'',emailFrom:'procurement@konvy.com',
   journey:{po:{done:true,ts:now-52*3600000},approve_po:{done:false,ts:null,stuck:true},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po'},

  {id:103,vendor:'Watsons',subject:'[MOCKUP] WT-NEDI-0730-03 — ค้างที่ เปิด SO',poRef:'WT-NEDI-0730-03',
   caseType:'A',procStatus:'pending_att',
   _isMockup:true,stuckReason:'📋 ระบบ ERP มีปัญหา ไม่สามารถสร้าง SO ได้ — ทีม IT กำลังแก้ไข รอการ Resolve มาแล้ว 2 วัน',
   attachments:[{name:'Watsons_PO_0730.pdf',url:'#'}],
   status:'pending',startTs:now-60*3600000,risk:'high',cancelReason:'',emailFrom:'noneditpo@aswatson.net',
   journey:{po:{done:true,ts:now-60*3600000},approve_po:{done:true,ts:now-58*3600000},open_so:{done:false,ts:null,stuck:true},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so'},

  {id:104,vendor:'CJ Express',subject:'[MOCKUP] PO No. 20250729002 — ค้างที่ Approve SO / Invoice',poRef:'20250729002',
   caseType:'A',procStatus:'escalated',
   _isMockup:true,stuckReason:'🧾 ราคาสินค้าใน SO ไม่ตรงกับ PO ต้นฉบับ — ต้องแก้ไข Invoice ก่อน Approve ค้าง 72 ชั่วโมง',
   attachments:[{name:'CJ_PO_20250729002.pdf',url:'#'}],
   status:'pending',startTs:now-72*3600000,risk:'high',cancelReason:'',emailFrom:'po@cjexpress.co.th',
   journey:{po:{done:true,ts:now-72*3600000},approve_po:{done:true,ts:now-70*3600000},open_so:{done:true,ts:now-68*3600000},approve_so:{done:false,ts:null,stuck:true},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_so'},

  {id:105,vendor:'Tsuruha',subject:'[MOCKUP] TS-20250727 — ค้างที่ ส่งเอกสารให้คลัง',poRef:'TS-20250727',
   caseType:'A',procStatus:'verified',
   _isMockup:true,stuckReason:'📦 เอกสารถูกส่งอีเมลไปแล้ว แต่คลังไม่ได้รับ — อาจติด Spam Filter หรือ Email ผิด ต้องส่งซ้ำ',
   attachments:[{name:'Tsuruha_OrderData_27072025.pdf',url:'#'}],
   status:'pending',startTs:now-80*3600000,risk:'med',cancelReason:'',emailFrom:'ordering@tsuruha.co.th',
   journey:{po:{done:true,ts:now-80*3600000},approve_po:{done:true,ts:now-78*3600000},open_so:{done:true,ts:now-75*3600000},approve_so:{done:true,ts:now-72*3600000},doc_wh:{done:false,ts:null,stuck:true},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'doc_wh'},

  {id:106,vendor:'Eveandboy',subject:'[MOCKUP] EB-2025-0726-012 — ค้างที่ จัดส่งสินค้า',poRef:'EB-2025-0726-012',
   caseType:'A',procStatus:'verified',
   _isMockup:true,stuckReason:'🚚 Logistic Partner แจ้งว่าสินค้าไม่พร้อมส่ง — รอ Stock เติมจาก Supplier ใช้เวลา 3-5 วัน',
   attachments:[{name:'EB_PO_Jul2025_12items.pdf',url:'#'}],
   status:'pending',startTs:now-90*3600000,risk:'med',cancelReason:'',emailFrom:'po@eveandboy.com',
   journey:{po:{done:true,ts:now-90*3600000},approve_po:{done:true,ts:now-88*3600000},open_so:{done:true,ts:now-85*3600000},approve_so:{done:true,ts:now-82*3600000},doc_wh:{done:true,ts:now-78*3600000},delivery:{done:false,ts:null,stuck:true},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'delivery'},

  {id:107,vendor:'Multy',subject:'[MOCKUP] MT-PO-0724-2025 — ค้างที่ ยืนยันการรับสินค้า',poRef:'MT-PO-0724-2025',
   caseType:'A',procStatus:'verified',
   _isMockup:true,stuckReason:'🎉 สินค้าถูกส่งถึงแล้ว แต่ Vendor ยังไม่ยืนยันรับของใน Portal — รอ Sign-off มาแล้ว 40 ชั่วโมง',
   attachments:[{name:'Multy_PO_0724.pdf',url:'#'}],
   status:'pending',startTs:now-100*3600000,risk:'low',cancelReason:'',emailFrom:'order@multybeauty.com',
   journey:{po:{done:true,ts:now-100*3600000},approve_po:{done:true,ts:now-98*3600000},open_so:{done:true,ts:now-95*3600000},approve_so:{done:true,ts:now-92*3600000},doc_wh:{done:true,ts:now-88*3600000},delivery:{done:true,ts:now-40*3600000},delivered:{done:false,ts:null,stuck:true}},
   currentStage:'delivered'},

  {id:108,vendor:'24Shopping (7-11)',subject:'[MOCKUP] PO 2038877 — Escalate หลาย Stage',poRef:'2038877',
   caseType:'A',procStatus:'escalated',
   _isMockup:true,stuckReason:'🔴 Escalate: ไม่ผ่านทั้ง เปิด SO และ Approve SO — ข้อมูลสินค้าผิดตั้งแต่ต้น ต้องแก้ไข PO กับ Vendor ก่อนดำเนินการต่อ',
   attachments:[{name:'7-11_PO_2038877.pdf',url:'#'},{name:'7-11_ItemList.xlsx',url:'#'}],
   status:'pending',startTs:now-120*3600000,risk:'high',cancelReason:'',emailFrom:'po@cpall.co.th',
   journey:{po:{done:true,ts:now-120*3600000},approve_po:{done:true,ts:now-115*3600000},open_so:{done:false,ts:null,stuck:true},approve_so:{done:false,ts:null,stuck:true},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so'},

  // ─── MOCKUP: Traditional Trade ค้างทุก Stage ───
  {id:120,vendor:'Traditional Trade',subject:'[MOCKUP] ORD-TT-001 — ค้างที่ Approve Order',poRef:'ORD-TT-MOCK-001',
   caseType:'ORDER',procStatus:'verified',
   _isMockup:true,stuckReason:'✍️ Order รอ Approve จาก Manager — Sales Manager ลาป่วย ค้างอยู่ 28 ชั่วโมง',
   attachments:[],status:'pending',startTs:now-28*3600000,risk:'high',cancelReason:'',emailFrom:'system@charmiss.internal',
   emailBody:'Order สร้างโดย: อัมพร | ลูกค้า: แฮร์บิวตี้ | ยอดรวม: 12,600 บาท | สินค้า 5 รายการ',
   journey:{po:{done:true,ts:now-28*3600000,stuck:false},approve_po:{done:false,ts:null,stuck:true},open_so:{done:false,ts:null,stuck:false},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'approve_po',stuckReason:'รอ Approve Order จาก Sales Manager'},

  {id:121,vendor:'Traditional Trade',subject:'[MOCKUP] ORD-TT-002 — ค้างที่ เปิด SO',poRef:'ORD-TT-MOCK-002',
   caseType:'ORDER',procStatus:'approved',
   _isMockup:true,stuckReason:'📋 Approved แล้ว แต่ ERP ยังไม่ได้เปิด SO — ติดต่อทีม Ops แล้ว รอดำเนินการ 18 ชั่วโมง',
   attachments:[],status:'pending',startTs:now-50*3600000,risk:'med',cancelReason:'',emailFrom:'system@charmiss.internal',
   emailBody:'Order สร้างโดย: ฝนเทพ | ลูกค้า: ดาวบิวตี้ | ยอดรวม: 7,200 บาท | สินค้า 3 รายการ',
   journey:{po:{done:true,ts:now-50*3600000,stuck:false},approve_po:{done:true,ts:now-48*3600000,stuck:false},open_so:{done:false,ts:null,stuck:true},approve_so:{done:false,ts:null,stuck:false},doc_wh:{done:false,ts:null,stuck:false},delivery:{done:false,ts:null,stuck:false},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'open_so',stuckReason:'ERP ยังไม่ได้เปิด SO — ค้างอยู่ 18 ชั่วโมง'},

  {id:122,vendor:'Traditional Trade',subject:'[MOCKUP] ORD-TT-003 — ค้างที่ จัดส่ง',poRef:'ORD-TT-MOCK-003',
   caseType:'ORDER',procStatus:'approved',
   _isMockup:true,stuckReason:'🚚 สินค้าพร้อมส่งแล้ว แต่ Logistics ยังไม่มารับ — รถขนส่งเต็ม รอรอบถัดไป 2 วัน',
   attachments:[],status:'pending',startTs:now-96*3600000,risk:'low',cancelReason:'',emailFrom:'system@charmiss.internal',
   emailBody:'Order สร้างโดย: สิริกาญจน์ | ลูกค้า: น้ำหวานบิวตี้ | ยอดรวม: 19,800 บาท | สินค้า 8 รายการ',
   journey:{po:{done:true,ts:now-96*3600000,stuck:false},approve_po:{done:true,ts:now-94*3600000,stuck:false},open_so:{done:true,ts:now-90*3600000,stuck:false},approve_so:{done:true,ts:now-86*3600000,stuck:false},doc_wh:{done:true,ts:now-80*3600000,stuck:false},delivery:{done:false,ts:null,stuck:true},delivered:{done:false,ts:null,stuck:false}},
   currentStage:'delivery',stuckReason:'Logistics ยังไม่มารับสินค้า — รอรอบถัดไป'},

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
  {icon:'📦',label:'ตรวจ MOQ — ยอดไม่ถึงขั้นต่ำ',desc:'ปริมาณสั่งซื้อต่ำกว่า MOQ ที่กำหนด'},
  {icon:'📅',label:'ส่งไม่ตรงวันหยุด',desc:'วันส่งสินค้าตรงกับวันหยุด ส่งไม่ได้'},
  {icon:'🔁',label:'PO ส่งซ้ำ (เลขเดิม)',desc:'มี PO เลขเดิมในระบบแล้ว / Duplicate'},
  {icon:'❌',label:'PO ไม่เกี่ยวข้อง',desc:'Email นี้ไม่ใช่ PO สำหรับ Charmiss'},
  {icon:'🔄',label:'Vendor ยกเลิก PO',desc:'Vendor แจ้งยกเลิก PO นี้ทางอีเมล'},
  {icon:'📋',label:'อื่นๆ — ระบุเพิ่มเติม',desc:'ดูรายละเอียดในช่องหมายเหตุด้านล่าง'},
];

const NOTIFICATIONS=[
  {id:1,type:'sla',icon:'🚨',title:'SLA เกินกำหนด — Eveandboy',desc:'PO ใบสั่งของ 49 ใบ ยังไม่ผ่าน Approve PO — เกิน SLA แล้ว',time:'30 นาทีที่แล้ว',unread:true},
  {id:2,type:'new',icon:'📧',title:'PO ใหม่จาก Watsons',desc:'Non EDI PO from Central Watson — รับเข้าระบบแล้ว',time:'48 นาทีที่แล้ว',unread:true},
  {id:3,type:'sla',icon:'⚠️',title:'ใกล้ครบ SLA — Beautrium',desc:'ต้องผ่าน Approve PO ภายใน 09:00 น. พรุ่งนี้',time:'1 ชั่วโมงที่แล้ว',unread:true},
  {id:4,type:'new',icon:'📧',title:'PO ใหม่จาก Konvy',desc:'Konvy PO to Brand Charmiss (106128)',time:'1.5 ชั่วโมงที่แล้ว',unread:false},
  {id:5,type:'system',icon:'✅',title:'Tsuruha — Invoice ส่งแล้ว',desc:'เอกสาร Ordering Data 04/08/2025 อยู่ใน Stage Delivery',time:'2 ชั่วโมงที่แล้ว',unread:false},
  {id:6,type:'system',icon:'🚫',title:'24Shopping ถูกยกเลิก',desc:'Admin ยกเลิก PO 2038491 — เหตุผล: PO ซ้ำซ้อน',time:'3 ชั่วโมงที่แล้ว',unread:false},
];

const CUSTOMERS = [
  {id:'1889',name:'CHOM SREY YOU',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1345',name:'Miss VUOCH ENG KAING',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'2701',name:'MUANJAI TRADING EXPORT-IMPORT COOPERATION CO.,LTD',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3063',name:'OR NAI SEA',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1981',name:'SOKKHENG HOK',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3253',name:'VOUCHMUY KAING',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'ส่งของก่อนค่อยชำระ'},
  {id:'750',name:'เครื่องแป้ง',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'36',name:'เจ้จู สำนักงานใหญ่ สำนักงานใหญ่',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'330',name:'เซคคั่นฟลอร์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'687',name:'เอ็นเอ็น บิวตี้',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1955',name:'แคทลียา บิวตี้',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3323',name:'แอล เอส มาร์เก็ตติ้ง',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'730',name:'แฮร์บิวตี้ สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'778',name:'โฉมงาม',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1887',name:'ไอซี่ บิวตี้ สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'73',name:'ไฮโซ คอสเมติก สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1886',name:'กระบี่ คอสเมติก สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1915',name:'คลังจันทร์เจ้า',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3047',name:'คอสเม่ สโตร์',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1943',name:'คุณเซ่งเว้ง แซ่เตียว',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1942',name:'คุณธนธัส อินมา',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2671',name:'คุณภัทรสุฎา ชุณหชัชวาลกุล',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1994',name:'จัสพิงค์ สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'768',name:'ชมพู่คอสเมติกส์',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1974',name:'ดาวบิวตี้ สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'678',name:'ดีโม่ คอสเมติก',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3182',name:'น.ส. วิชุดา ชัยคำวัง',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3218',name:'น.ส. อุมาพร จันทวี',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1349',name:'น.ส.พลอยรุ้ง เลิศทวีพรกุล',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1877',name:'น.ส.พิกุล สมใจ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7วัน ไม่มีส่วนลด'},
  {id:'1957',name:'น.ส.ภัทชา ไตรเวทย์',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'711',name:'น.ส.สรัลชนา ศรีเฮงไพบูลย์',sales:'อัมพร',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2986',name:'นางสาว วลัยพร หิมมะ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2742',name:'นางสาว อุบลวรรณ แก้วสุนัน',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1913',name:'นาย ญาณวุฒิ โค้วณาภรณ์',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'351',name:'น้ำหวานบิวตี้',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'76',name:'บริษัท เคโร๊ะบิวตี้ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'83',name:'บริษัท เจเอ็ม คอสเมติคส์ (ไทยแลนด์) จำกัด (สำนักงานใหญ่) สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1997',name:'บริษัท เจบี อิมเพรส (ประเทศไทย) จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1970',name:'บริษัท เจลิน กรุ๊ป จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3213',name:'บริษัท เชียงใหม่ คอสเมติคส์ จำกัด',sales:'สิริกาญจน์',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'359',name:'บริษัท เปรียว คอสเมติกส์ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'77',name:'บริษัท เพียว คอสเมติก แอนด์ บิวตี้ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'78',name:'บริษัท เมย์โคโค จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3195',name:'บริษัท เรืองทองฟาร์มาซี จำกัด สาขาที่ 00007 00007',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3212',name:'บริษัท เวลธ์โปรดักท์เซ็นเตอร์ จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1884',name:'บริษัท เอ.เอ็น.คอสเมติกส์ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1982',name:'บริษัท เอสทีพี บิวตี้ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1983',name:'บริษัท เอสทีพี บิวตี้ไนน์ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1956',name:'บริษัท แกรนด์บิวตี้มาร์ท จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'72',name:'บริษัท แก้ว บิวตี้ จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'776',name:'บริษัท แคนดี้ คอสเมติก (2565) จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'270',name:'บริษัท แพทองกุล จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1903',name:'บริษัท แมนดี้ คอสเม่ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1961',name:'บริษัท แสงไทยแพร่ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'746',name:'บริษัท แอล เค บิวตี้ แอนด์ เฮลท์ จำกัด 00002',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'75',name:'บริษัท แอลที แกรนด์ เทรดดิ้ง จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1958',name:'บริษัท แฮปปี้ช็อป คอสเมติกส์ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'781',name:'บริษัท โทนี่คอสเมติคส์ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'2682',name:'บริษัท ไอคิว ซ็อปเทรดดิ้ง จำกัด',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1979',name:'บริษัท กลางเวียง บิวตี้มาร์ท จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2725',name:'บริษัท กันตา 136 (ไทยแลนด์) จำกัด',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Clearance',creditTerm:'โอนก่อนส่งของ'},
  {id:'673',name:'บริษัท กานต์ บิวตี้สโตร์ 101 จำกัด',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2718',name:'บริษัท กานต์เภสัช จำกัด (สาขาป่าพะยอม) 00001',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2752',name:'บริษัท กู๊ดวิลฟาร์มาซี จำกัด',sales:'ฝนเทพ',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1883',name:'บริษัท ควีนแลนด์ บิวตี้ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'3288',name:'บริษัท จัสมอร์1998 จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'681',name:'บริษัท ชุติมา คอนเนค จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'84',name:'บริษัท ซุปเปอร์โกลด์ 666 จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3297',name:'บริษัท ทรัพย์มันตรา คอร์ปอเรชั่น กรุ๊ปส์ จำกัด (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Wholesale',priceType:'Clearance',creditTerm:'ส่งของก่อนค่อยชำระ'},
  {id:'79',name:'บริษัท ทีแอนด์เอ็ม อินเตอร์เนชั่นแนล คอสเมติกส์ จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2751',name:'บริษัท นกบิวตี้ แอนด์ เดอะทรีโฮม จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1975',name:'บริษัท นาคา ทรัพย์ประสิทธิ์ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'795',name:'บริษัท บ้านเภสัช เฟสติวัล จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'2710',name:'บริษัท บ้านครีมนครศรี จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'350',name:'บริษัท บิวตี้ ทาวน์ พิษณุโลก จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'85',name:'บริษัท บิวตี้เซ็นเตอร์ 9569 จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'69',name:'บริษัท บิวตี้เวิลด์ อุดรธานี จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3076',name:'บริษัท บิวตี้บลิ้งค์ 2024 จำกัด (สำนักงานใหญ่)',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'2706',name:'บริษัท บีเจ บิวตี้ฟูล ช็อป จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2696',name:'บริษัท บุญดีรวย จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'2030',name:'บริษัท ปุ๊กกี้ บิวตี้ตี้ 289 จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7วัน ไม่มีส่วนลด'},
  {id:'2984',name:'บริษัท พรภัณฑ์บิวตี้ จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3167',name:'บริษัท พัทยาบิวตี้ (ประเทศไทย) จำกัด 00000',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'759',name:'บริษัท ริชชี่บิวตี้ จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2760',name:'บริษัท วารีรัตน์ ช็อป จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Wholesale',priceType:'Clearance',creditTerm:'ส่งของก่อนค่อยชำระ'},
  {id:'82',name:'บริษัท วิน คอสเมติคส์ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2976',name:'บริษัท วิมล บิวตี้ จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3175',name:'บริษัท ส.พรทวีชัย จำกัด',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3217',name:'บริษัท สตาร์ ควีน อินเตอร์กรุ๊ป จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'74',name:'บริษัท สวยมีดี จำกัด 00003',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3194',name:'บริษัท สวัสดีไดเร็คท์ จำกัด (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1984',name:'บริษัท หางดงคอสเมติคส์ จำกัด สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'70',name:'บริษัท อโณ2020 จำกัด สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2673',name:'บริษัท อาร์ต บอกซ์ จำกัด',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2709',name:'บริษัท อินทารา จำกัด',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'695',name:'บริษัท อูอา จำกัด สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'766',name:'บลิ๊ง บลิ๊ง ซูเปอร์มาร์ท',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'3205',name:'บุญสิน',sales:'อัมพร',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'760',name:'ปราง ปราง คอสเม สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'666',name:'พริ้นเซส เฮาส์ สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2717',name:'พิ้งสกู๊ดเตอร์ แฟชั่น แอนด์ กิฟชอป',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3174',name:'ฟารีดาบิวตี้',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'713',name:'ร.ต.อ. อนุสรณ์ สมรภูมิ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'81',name:'ร้าน ไอเมคอัพ สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2708',name:'ร้าน คนสวย',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'80',name:'ร้าน สา บิวตี้ สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'806',name:'ร้านเมียงดงบิวตี้ท่าศาลา',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1885',name:'ร้านแก้มแดง สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2750',name:'ร้านแซล่มแซ่มซ้อย',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'804',name:'ร้านแสนสวยบิวตี้คลับ สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1912',name:'ร้านโยมิคอสเมติคส์ สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1978',name:'ร้านคอสเมท สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'792',name:'ร้านนันทพร ช็อป (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'762',name:'ร้านบูม',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2693',name:'ศศิธร บิวตี้แอนด์คอสเมติคส์',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'329',name:'หจก.ดีเค สกินช็อป',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'361',name:'ห้างห้นส่วนจำกัด เพ็ญสุข คอร์เปอร์เรชั่น จำกัด',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3222',name:'ห้างหุ้นส่วนจำกัด เมียงดงบิวตี้ท่าศาลา',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'3202',name:'ห้างหุ้นส่วนจำกัด โอเคสวย2555',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'802',name:'ห้างหุ้นส่วนจำกัด กีต้าคอสเมติคส์ สำนักงานใหญ่',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3286',name:'ห้างหุ้นส่วนจำกัด นานาบิวตี้ 2022',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1980',name:'ห้างหุ้นส่วนจำกัด บิวตี้ดีไลท์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'355',name:'ห้างหุ้นส่วนจำกัด บิวตี้มาร์ท อุทัยธานี',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2705',name:'ห้างหุ้นส่วนจำกัด ปาร์ตี้ กรุ๊ป เอ็มเอชเค',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'680',name:'ห้างหุ้นส่วนจำกัด มดบิวตี้ แอนด์ คอสเมติกส์',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'2762',name:'ห้างหุ้นส่วนจำกัด ยุทธการเกษตร',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3252',name:'ห้างหุ้นส่วนจำกัด วิว คอสเมติก (สำนักงานใหญ่)',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3193',name:'ห้างหุ้นส่วนจำกัด ฮอด คอสเมติกส์',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'67',name:'ห้างหุ้นส่วนจำกัด105 บิวตี้ช็อป สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'68',name:'ห้างหุ้นส่วนจำกัดพีบีคอสโม่ช็อป สำนักงานใหญ่',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3328',name:'นาย ชวน เถิงจาง',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3408',name:'ตินตาล บิวตี้ สกินแคร์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3386',name:'ร้านเจเค สุราษฎร์ขายปลีกราคาส่ง',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'3385',name:'มะปราง เครื่องสำอาง',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'3331',name:'บริษัท เบเกอร์ สมิทธ์ (ประเทศไทย) จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Export',creditTerm:'โอนก่อนส่งของ'},
  {id:'3426',name:'บริษัท โทฟู สกินแคร์ จำกัด (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'4487',name:'บริษัท ซีที โกลบอล กรุ๊ป จำกัด',sales:'พี่แอม',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'4488',name:'บ้านครีม ปูเป้',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'4489',name:'บริษัท อาณาจักรมารวย จำกัด',sales:'สิริกาญจน์',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'4490',name:'บริษัท เมคอัพมอร์ จำกัด',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'โอนก่อนส่งของ'},
  {id:'3436',name:'บริษัท บ้านครีมบิวตี้ จำกัด (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'3452',name:'ร้าน ไบร์ท ทู บิวตี้ สำนักงานใหญ่',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'4652',name:'CHANMALA PHASOUKNAMKHONG',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'4536',name:'น.ส. กุลธิดา เกตุแก้ว',sales:'อัมพร',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'71',name:'วันบิวตี้วัน',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'1876',name:'บิวตี้ฟลาย',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'1914',name:'โซคิ้วท์',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'1992',name:'บริษัท การ์ตูนภูเก็ต จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'โอนก่อนส่งของ'},
  {id:'4501',name:'บริษัท กานต์เภสัช จำกัด (สาขาสะเดา)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'4503',name:'บริษัท กานต์เภสัช จำกัด (สาขาเมืองพัทลุง)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'2719',name:'น.ส. ญาณิศา ชูแสงจันทร์',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'3347',name:'บริษัท เอ็น.วี.เบสท์ ซัพพลาย จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Clearance',creditTerm:'โอนก่อนส่งของ'},
  {id:'4733',name:'ร้านมีมี่เครื่องสำอางค์',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7วัน ไม่มีส่วนลด'},
  {id:'6355',name:'บริษัท ณจันตา ครีเอชั่น จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'687',name:'เอ็นเอ็น บิวตี้',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'3323',name:'แอล เอส มาร์เก็ตติ้ง',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'6246',name:'บริษัท เอกคณินทร์ เทรดดิ้ง จำกัด',sales:'สิริกาญจน์',shopType:'Wholesale',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'5034',name:'บริษัท เอเอสเอ็ม ช็อป จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'5147',name:'ลัชชี่ ป๊อป บิวตี้ สโตร์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'6276',name:'นาง บังอร ภักดียุทธ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'6352',name:'นางสาวเจนจิรา ศรีนิ่ม',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'1960',name:'นาย ณัฐพงษ์ ปลัดศรีช่วย',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'2738',name:'ไดโอโนะ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'3289',name:'บริษัท ซุปเปอร์ชีป จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'347',name:'บริษัท บิวตี้เวิลด์ อุดรธานี จำกัด',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'38',name:'เวลเวท',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'4500',name:'บริษัท กานต์เภสัช จำกัด (สำนักงานใหญ่)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:''},
  {id:'4502',name:'บริษัท กานต์เภสัช จำกัด (สาขาสตูล)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:''},
  {id:'4549',name:'ภูเก็ตบิวตี้เซ็นเตอร์2',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'4653',name:'ยูนิคอส บิวตี้',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'4695',name:'นาย เอกรินทร์ อุคำ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'4702',name:'อาบังมินิมาร์ท',sales:'อัมพร',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'4734',name:'น้องศรี ซาลอน',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'4738',name:'หจก. เจริญเพิ่มพูนทรัพย์ 696',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'30 วัน'},
  {id:'4749',name:'น.ส. ดรุณี มณีโชติ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'4750',name:'บริษัท กานต์เภสัช จำกัด (สาขาบางแก้ว)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:''},
  {id:'4758',name:'บริษัท สุราษฎร์ธานี ดีเวลลอปเม้นท์ จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'4993',name:'บริษัท พาสเทล พลีส จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'5117',name:'บริษัท ป๊อบสตาร์ เอ แอนด์ พี จำกัด',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'7 วัน ส่วนลด 2%'},
  {id:'5118',name:'บริษัท พรลิขิต จำกัด',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Dealer',creditTerm:''},
  {id:'5129',name:'นรา คอสเมติก',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'5147',name:'ลัชชี่ ป๊อป บิวตี้ สโตร์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:'30 วัน'},
  {id:'6220',name:'บริษัท เอเอสเอ็ม ช็อป จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'6275',name:'บริษัท กานต์เภสัช จำกัด (สาขาราเมศวร์)',sales:'อัมพร',shopType:'Retail - Drugstore',priceType:'Dealer',creditTerm:''},
  {id:'6276',name:'นาง บังอร ภักดียุทธ',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'6352',name:'นางสาวเจนจิรา ศรีนิ่ม',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'6353',name:'บริษัท เอแอนด์วาย สโตร์ จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:''},
  {id:'6354',name:'บริษัท โต๊ะเครื่องแป้ง จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'6355',name:'บริษัท ณจันตา ครีเอชั่น จำกัด',sales:'อัมพร',shopType:'Wholesale',priceType:'Dealer',creditTerm:''},
  {id:'6426',name:'บริษัท เฮงชัวร์ จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'6431',name:'บริษัท ปุ๊กกี้ บิวตี้ตี้ 289 จำกัด_00001',sales:'สิริกาญจน์',shopType:'Retail - Beauty Store',priceType:'Dealer',creditTerm:'7วัน ไม่มีส่วนลด'},
  {id:'6490',name:'ร้านน้องรักบิวตี้มอล',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Dealer',creditTerm:'โอนก่อนส่งของ'},
  {id:'6506',name:'บริษัท เรนเดียร์ช็อปปิ้ง888 จำกัด',sales:'อัมพร',shopType:'Retail - Beauty Store',priceType:'Wholesale',creditTerm:''},
  {id:'803',name:'สวยดูดี คอสเมติกส์',sales:'ฝนเทพ',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'1971',name:'ZHANG GUOJIN',sales:'ฝนเทพ',shopType:'Wholesale - Beauty Store',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'2025',name:'น.ส.จรรยมณฑน์ ชัยปฐวี',sales:'ฝนเทพ',shopType:'Wholesale',priceType:'Wholesale',creditTerm:'โอนก่อนส่งของ'},
  {id:'3347',name:'บริษัท เอ็น.วี.เบสท์ ซัพพลาย จำกัด',sales:'พี่แอม',shopType:'Wholesale',priceType:'Clearance',creditTerm:''},
  {id:'3280',name:'น.ส. พิจาริน ธิติบดินทร์',sales:'พี่แอม',shopType:'Wholesale',priceType:'Export',creditTerm:''},
  {id:'86',name:'บริษัท สุราษฎร์ธานี ดีเวลลอปเม้นท์ จํากัด (สำนักงานใหญ่)',sales:'',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'289',name:'นางสาวจรรยมณฑน์ ชัยปฐวี',sales:'',shopType:'Wholesale',priceType:'',creditTerm:''},
  {id:'798',name:'บิวตี้ ทัช',sales:'',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''},
  {id:'675',name:'มายเวย์คอสเมติกส์',sales:'',shopType:'Retail - Beauty Store',priceType:'',creditTerm:''}
];




// variants: [{label, trCode, barcode, price50, price6}]
const PRODUCTS = [
  // ─── BROW ───,
  {id:'g_charmiss_brow_high_lifting_l',name:'Charmiss Brow High Lifting LIight Mascara',cat:'Brow',emoji:'✏️',dealer:80,wholesale:87,
    variants:[
      {label:'One Size',trCode:'',barcode:'8857127482163',price50:null,price6:null}
    ]},
  {id:'g_charmiss_brookie_brow_slim_p',name:'Charmiss Brookie Brow Slim Pencil',cat:'Brow',emoji:'✏️',dealer:45,wholesale:52,
    variants:[
      {label:'01 DARK CHOCOLATE',trCode:'25011',barcode:'8857127482170',price50:null,price6:null},
      {label:'02 BROWN SUGAR',trCode:'25021',barcode:'8857127482187',price50:null,price6:null},
      {label:'04 MAPLE SYRUB',trCode:'25040',barcode:'8857127482200',price50:null,price6:null}
    ]},
  {id:'g_charmiss_stylish_brow_auto_p',name:'Charmiss Stylish Brow Auto Pencil',cat:'Brow',emoji:'✏️',dealer:32,wholesale:37,
    variants:[
      {label:'01 Dark Brown',trCode:'25050',barcode:'8857127482545',price50:null,price6:null},
      {label:'02 Natural Brown',trCode:'25060',barcode:'8857127482552',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_glowfriend_natural_',name:'Charmiss Glowfriend Natural Blush On',cat:'Cheek',emoji:'🌸',dealer:60,wholesale:67,
    variants:[
      {label:'01 BEST FRIEND',trCode:'16010',barcode:'8857127482217',price50:null,price6:null},
      {label:'02 SUGAR AND BOO',trCode:'16020',barcode:'8857127482224',price50:null,price6:null},
      {label:'03 Spoil Me',trCode:'16030',barcode:'8857127482231',price50:null,price6:null},
      {label:'04 Crush Blush',trCode:'16040',barcode:'8857127482248',price50:null,price6:null},
      {label:'05 Rosy Cheeks',trCode:'16050',barcode:'8857127482255',price50:null,price6:null},
      {label:'06 Kiss Me More',trCode:'16060',barcode:'8857127482262',price50:null,price6:null},
      {label:'07 Coral Kiss',trCode:'16070',barcode:'8857127482279',price50:null,price6:null},
      {label:'08 Double Spice',trCode:'16080',barcode:'8857127482286',price50:null,price6:null},
      {label:'09 Hey Bestie',trCode:'16090',barcode:'8857127482293',price50:null,price6:null},
      {label:'10 You Look Good',trCode:'16100',barcode:'8857127482620',price50:null,price6:null},
      {label:'11 Y2K Is Now',trCode:'16110',barcode:'8857127482637',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_show_me_your_love_g',name:'Charmiss Show Me Your Love Glitter Lip Gloss',cat:'Lip',emoji:'💋',dealer:60,wholesale:67,
    variants:[
      {label:'GL01 Crush On You',trCode:'32010',barcode:'8857127482361',price50:null,price6:null},
      {label:'GL02 Be My Baby',trCode:'32020',barcode:'8857127482378',price50:null,price6:null},
      {label:'GL03 Make You Mine',trCode:'32030',barcode:'8857127482385',price50:null,price6:null},
      {label:'GL01 Crush On You (7-11)',trCode:'32011',barcode:'8857127482644',price50:null,price6:null},
      {label:'GL03 Make You Mine (7-11)',trCode:'32031',barcode:'8857127482651',price50:null,price6:null},
      {label:'GL01 (7-11) (GRADE B)',trCode:'32011-B',barcode:'8857127482644',price50:null,price6:null},
      {label:'GL03 Make You Mine (7-11) (GRADE B)',trCode:'32031-B',barcode:'8857127482651',price50:null,price6:null}
    ]},
  {id:'g_charmiss_show_me_your_charm_',name:'Charmiss Show Me Your Charm Airy Kiss Tint',cat:'Lip',emoji:'💋',dealer:60,wholesale:67,
    variants:[
      {label:'01 Crazy On Me',trCode:'33130',barcode:'8857127482309',price50:null,price6:null},
      {label:'02 Adore Me',trCode:'33140',barcode:'8857127482316',price50:null,price6:null},
      {label:'03 Play With Me',trCode:'33150',barcode:'8857127482323',price50:null,price6:null},
      {label:'04 Dance With Me',trCode:'33160',barcode:'8857127482330',price50:null,price6:null},
      {label:'05 Try Me',trCode:'33170',barcode:'8857127482347',price50:null,price6:null},
      {label:'06 Forget Me (Not)',trCode:'33180',barcode:'8857127482354',price50:null,price6:null},
      {label:'07 New',trCode:'33340',barcode:'8857128879016',price50:null,price6:null},
      {label:'08 New',trCode:'33350',barcode:'8857128879023',price50:null,price6:null}
    ]},
  {id:'g_charmiss_show_me_your_charm_',name:'Charmiss Show Me Your Charm Tattoo Matte Tint',cat:'Lip',emoji:'💋',dealer:60,wholesale:67,
    variants:[
      {label:'01 Chic Rouge',trCode:'33190',barcode:'8857127482392',price50:null,price6:null},
      {label:'02 Naughty Pink',trCode:'33200',barcode:'8857127482408',price50:null,price6:null},
      {label:'03 Jolly Tangerine',trCode:'33211',barcode:'8857127482415',price50:null,price6:null}
    ]},
  // ─── EYE ───,
  {id:'g_charmiss_glowlogram_eyeshado',name:'CHARMISS GLOWLOGRAM EYESHADOW PALETTE',cat:'Eye',emoji:'👁️',dealer:80,wholesale:90,
    variants:[
      {label:'01 Sweet Moments',trCode:'22010',barcode:'8857127482569',price50:null,price6:null},
      {label:'02 Peach Energy',trCode:'22020',barcode:'8857127482576',price50:null,price6:null},
      {label:'03 Warm On A Cold Night',trCode:'22030',barcode:'8857127482583',price50:null,price6:null},
      {label:'04 Shiny Apricot (แพคเกจ7-11)',trCode:'22040',barcode:'8857127482668',price50:null,price6:null},
      {label:'05 Frosted 90\'s',trCode:'22050',barcode:'8857127482781',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_airy_glow_everyday_',name:'Charmiss Airy Glow Everyday Cushion SPF50+ PA++++',cat:'Face',emoji:'✨',dealer:180,wholesale:220,
    variants:[
      {label:'01 Ivory (เก่า)',trCode:'12010',barcode:'8857127482422',price50:null,price6:null},
      {label:'02 Natural Beige (เก่า)',trCode:'12020',barcode:'8857127482439',price50:null,price6:null},
      {label:'03 Honey Beige (เก่า)',trCode:'12030',barcode:'8857127482446',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_good_mood_extra_shi',name:'Charmiss Good Mood Extra Shine Lip Balm',cat:'Lip',emoji:'💋',dealer:70,wholesale:80,
    variants:[
      {label:'01 Pink Lemonade',trCode:'34010',barcode:'8857127482675',price50:null,price6:null},
      {label:'02 Orange Marmalade',trCode:'34020',barcode:'8857127482682',price50:null,price6:null},
      {label:'03 Cherry Margarita',trCode:'34030',barcode:'8857127482699',price50:null,price6:null},
      {label:'04 Chocolate Milk Tea',trCode:'34040',barcode:'8857127482705',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_show_me_your_love_j',name:'CHARMISS SHOW ME YOUR LOVE JUICY DROP LIP & CHEEK OIL',cat:'Cheek',emoji:'🌸',dealer:75,wholesale:82,
    variants:[
      {label:'01 ROSY DROP',trCode:'32050',barcode:'8857127482743',price50:null,price6:null},
      {label:'02 BRIGHT & GLOW DROP',trCode:'32060',barcode:'8857127482750',price50:null,price6:null},
      {label:'03 AQUA DROP',trCode:'32070',barcode:'8857127482767',price50:null,price6:null},
      {label:'03 AQUA DROP (7-11)',trCode:'32071',barcode:'8857127482941',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_charming_glow_airy_',name:'Charmiss Charming Glow Airy Cushion SPF50+ PA++++',cat:'Face',emoji:'✨',dealer:185,wholesale:205,
    variants:[
      {label:'01 Ivory',trCode:'12040',barcode:'8857127482804',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12050',barcode:'8857127482811',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12060',barcode:'8857127482828',price50:null,price6:null},
      {label:'01 Ivory (Refill)',trCode:'12190',barcode:'8859856200254',price50:null,price6:null},
      {label:'02 Natural Beige (Refill)',trCode:'12200',barcode:'8859856200261',price50:null,price6:null},
      {label:'03 Honey Beige (Refill)',trCode:'12210',barcode:'8859856200278',price50:null,price6:null}
    ]},
  {id:'g_charmiss_charming_glow_longw',name:'Charmiss Charming Glow Longwear Foundation SPF50+ PA++++',cat:'Face',emoji:'✨',dealer:180,wholesale:200,
    variants:[
      {label:'01 Ivory',trCode:'11010',barcode:'8857127482842',price50:null,price6:null},
      {label:'02 Light Beige',trCode:'11020',barcode:'8857127482859',price50:null,price6:null},
      {label:'03 Medium Beige',trCode:'11030',barcode:'8857127482866',price50:null,price6:null},
      {label:'04 Honey Beige',trCode:'11040',barcode:'8857127482873',price50:null,price6:null},
      {label:'01 Ivory 5g',trCode:'11012',barcode:'8857128879986',price50:31,price6:null},
      {label:'02 Light Beige 5g',trCode:'11021',barcode:'8857127482927',price50:31,price6:null},
      {label:'03 Medium Beige 5g',trCode:'11032',barcode:'8857128879993',price50:31,price6:null}
    ]},
  {id:'g_charmiss_charming_glow_setti',name:'Charmiss Charming Glow Setting Powder Translucent (แป้งนางฟ้า)',cat:'Face',emoji:'✨',dealer:180,wholesale:200,
    variants:[
      {label:'One Size',trCode:'15000',barcode:'8857127482835',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_charming_glow_powde',name:'Charmiss Charming Glow Powder Brush (แปรง)',cat:'Others',emoji:'📦',dealer:57,wholesale:68,
    variants:[
      {label:'One Size',trCode:'42000',barcode:'8857127482880',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_juicy_glowy_tint',name:'Charmiss Juicy Glowy Tint',cat:'Lip',emoji:'💋',dealer:70,wholesale:80,
    variants:[
      {label:'01 Cherry On Top',trCode:'33220',barcode:'8857127482453',price50:null,price6:null},
      {label:'02 Cranberry Syrup',trCode:'33230',barcode:'8857127482460',price50:null,price6:null},
      {label:'03 Sweet Jelly',trCode:'33240',barcode:'8857127482477',price50:null,price6:null},
      {label:'04 Pink Pomelo',trCode:'33250',barcode:'8857127482484',price50:null,price6:null},
      {label:'05 lychee Soda',trCode:'33260',barcode:'8857127482491',price50:null,price6:null},
      {label:'06 Peach Parfait',trCode:'33270',barcode:'8857127482507',price50:null,price6:null},
      {label:'07 Sugar Figs',trCode:'33280',barcode:'8857127482989',price50:null,price6:null},
      {label:'08 Berry Sorbet',trCode:'33290',barcode:'8857127482996',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_the_milky_way_marbl',name:'Charmiss The Milky Way Marble Blush On',cat:'Cheek',emoji:'🌸',dealer:80,wholesale:90,
    variants:[
      {label:'01 LUNAR ECLIPSE',trCode:'16120',barcode:'8857128879078',price50:null,price6:null},
      {label:'02 JUPITER',trCode:'16130',barcode:'8857128879085',price50:null,price6:null},
      {label:'03 SHOOTING STAR',trCode:'16140',barcode:'8857128879092',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_the_universe_plumpi',name:'Charmiss The Universe Plumping Lip Gloss ( LIMITED EDITION)',cat:'Lip',emoji:'💋',dealer:80,wholesale:90,
    variants:[
      {label:'One Size',trCode:'32080',barcode:'8857127482972',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_the_milky_way_marbl',name:'Charmiss The Milky Way Marble Liquid Lip Balm',cat:'Cheek',emoji:'🌸',dealer:90,wholesale:110,
    variants:[
      {label:'01 MORNING STAR',trCode:'34050',barcode:'8857128879030',price50:null,price6:null},
      {label:'02 STRAWBERRY MOON',trCode:'34060',barcode:'8857128879047',price50:null,price6:null},
      {label:'03 NEBULA',trCode:'34070',barcode:'8857128879054',price50:null,price6:null},
      {label:'04 SUPERNOVA',trCode:'34080',barcode:'8857128879061',price50:null,price6:null},
      {label:'04 Supernova (7-11) หมอช้าง',trCode:'34082',barcode:'8857128879214',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_endless_kiss_liquid',name:'Charmiss Endless Kiss Liquid Matte',cat:'Others',emoji:'📦',dealer:38,wholesale:42,
    variants:[
      {label:'01 Puppy Love',trCode:'33310',barcode:'8857127482897',price50:null,price6:null},
      {label:'02 Romantic love',trCode:'33320',barcode:'8857127482903',price50:null,price6:null},
      {label:'03 True Love',trCode:'33330',barcode:'8857127482910',price50:null,price6:null}
    ]},
  {id:'g_endless_kiss_liquid_matte',name:'Endless Kiss liquid Matte',cat:'Others',emoji:'📦',dealer:38,wholesale:42,
    variants:[
      {label:'04 Cherry Rush',trCode:'33570',barcode:'8859856200773',price50:null,price6:null},
      {label:'05 Burnt Sugar',trCode:'33580',barcode:'8859856200780',price50:null,price6:null},
      {label:'06 Velvet Rosewood',trCode:'33590',barcode:'8859856200797',price50:null,price6:null}
    ]},
  // ─── EYE ───,
  {id:'g_charmiss_stylish_matte_eyeli',name:'Charmiss Stylish Matte Eyeliner',cat:'Eye',emoji:'👁️',dealer:60,wholesale:70,
    variants:[
      {label:'One Size',trCode:'23000',barcode:'8857127482774',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_crystal_cube_ph_cha',name:'Charmiss Crystal Cube PH Changing Blush Gel',cat:'Cheek',emoji:'🌸',dealer:100,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16150',barcode:'8857128879184',price50:null,price6:null}
    ]},
  {id:'g_charmiss_crystal_cube_ph_cha',name:'Charmiss Crystal Cube PH Changing Blush Gel (pack 7-11)',cat:'Cheek',emoji:'🌸',dealer:100,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16152',barcode:'8857128879399',price50:null,price6:null}
    ]},
  // ─── SKINCARE ───,
  {id:'g_charmiss_uv_extra_shine_crys',name:'CHARMISS UV EXTRA SHINE CRYSTAL SHIELD SUNSCREEN SPF50+PA++++ 10g',cat:'Skincare',emoji:'🧴',dealer:70,wholesale:80,
    variants:[
      {label:'One Size',trCode:'51003',barcode:'8857128879146',price50:null,price6:null}
    ]},
  {id:'g_charmiss_uv_extra_shine_crys',name:'CHARMISS UV EXTRA SHINE CRYSTAL SHIELD SUNSCREEN SPF50+PA++++ 10g x 3 PCS.',cat:'Skincare',emoji:'🧴',dealer:0,wholesale:0,
    variants:[
      {label:'One Size',trCode:'51005',barcode:'8857128879153',price50:null,price6:null}
    ]},
  {id:'g_charmiss_uv_extra_shine_crys',name:'CHARMISS UV EXTRA SHINE CRYSTAL SHIELD SUNSCREEN SPF50+PA++++ 40g',cat:'Skincare',emoji:'🧴',dealer:190,wholesale:220,
    variants:[
      {label:'One Size',trCode:'51001',barcode:'8857128879177',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_mellow_shining_balm',name:'CHARMISS MELLOW SHINING BALM',cat:'Others',emoji:'📦',dealer:90,wholesale:100,
    variants:[
      {label:'01 GIRL BOSS',trCode:'31010',barcode:'8857128879276',price50:null,price6:null},
      {label:'02 NEW GEN',trCode:'31020',barcode:'8857128879283',price50:null,price6:null},
      {label:'03 INTERN',trCode:'31030',barcode:'8857128879290',price50:null,price6:null},
      {label:'04 INSPIRING',trCode:'31040',barcode:'8857128879306',price50:null,price6:null},
      {label:'05 MY GOAL',trCode:'31050',barcode:'8857128879313',price50:null,price6:null},
      {label:'06 RECALL',trCode:'31060',barcode:'8857128879320',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_matte_all_day_acne_',name:'Charmiss Matte All Day Acne Cushion SPF50 PA++++',cat:'Face',emoji:'✨',dealer:160,wholesale:170,
    variants:[
      {label:'01 IVORY',trCode:'12080',barcode:'8857128879962',price50:null,price6:null},
      {label:'02 NATURAL BEIGE',trCode:'12070',barcode:'8857128879412',price50:null,price6:null},
      {label:'03 HONEY BEIGE',trCode:'12090',barcode:'8857128879962',price50:null,price6:null},
      {label:'01 Ivory 5g',trCode:'12130',barcode:'8859856200223',price50:33,price6:null},
      {label:'02 Natural Beige 5g',trCode:'12140',barcode:'8859856200230',price50:33,price6:null},
      {label:'03 Honey Beige 5g',trCode:'12150',barcode:'8859856200247',price50:33,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_show_me_your_love_i',name:'CHARMISS SHOW ME YOUR LOVE IN TO THE PARADISE LIP GLOSS 2.5g',cat:'Lip',emoji:'💋',dealer:60,wholesale:67,
    variants:[
      {label:'GL04 CRYSTAL HEART',trCode:'32090',barcode:'8857128879559',price50:null,price6:null},
      {label:'GL05 FAIRY DUST',trCode:'32100',barcode:'8857128879566',price50:null,price6:null},
      {label:'GL06 STARRY SKY',trCode:'32110',barcode:'8857128879573',price50:null,price6:null},
      {label:'GL07 PINKY TWINKLE',trCode:'32120',barcode:'8857128879580',price50:null,price6:null},
      {label:'GL08 PETAL AURA',trCode:'32130',barcode:'8857128879597',price50:null,price6:null},
      {label:'GL09 APHROS’S ROSE',trCode:'32140',barcode:'8857128879603',price50:null,price6:null},
      {label:'GL10 WINE REFLECTION',trCode:'32150',barcode:'8857128879610',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #01 THAT\'S MY GIRL (ไฮไลท์สีขาวมุก)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16190',barcode:'8857128879658',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #02 STAY COOL (ไฮไลท์สีขาวประกายฟ้า)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16200',barcode:'8857128879665',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #03 BABE CLUB (ไฮไลท์สีพีช)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16210',barcode:'8857128879672',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #04 CRUSH BLUSH (สีส้มอุ่นโทนสุภาพ)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16220',barcode:'8857128879689',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #05 ROSY CHEEKS (สีส้มอมชมพู)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16230',barcode:'8857128879696',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #06 KISS ME MORE (สีแดงระเรื่อ)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16240',barcode:'8857128879702',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #07 CORAL KISS(สีส้มบ่มแดด)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16250',barcode:'8857128879719',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #08 SUGAR AND BOO (สีพีชอ่อน)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16260',barcode:'8857128879726',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #09 GIMMIE BLUSH (สีชมพูนู้ดสุภาพ)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16270',barcode:'8857128879733',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #10 YOU LOOK GOOD (สีชมพูกุหลาบระเรื่อ)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16280',barcode:'8857128879740',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #11 Y2K IS NOW (สีชมพูบาร์บี้)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16290',barcode:'8857128879757',price50:null,price6:null}
    ]},
  {id:'g_charmiss_glowfriend_mochi_bl',name:'CHARMISS GLOWFRIEND MOCHI BLUSH ON #12 MY BESTIE (สีม่วงอมชมพู)',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'One Size',trCode:'16300',barcode:'8857128879764',price50:null,price6:null}
    ]},
  {id:'g_charmiss_jelly_joy',name:'Charmiss Jelly Joy',cat:'Cheek',emoji:'🌸',dealer:110,wholesale:120,
    variants:[
      {label:'01 Soda Pop สีชมพู Cool Tone',trCode:'16160',barcode:'8857128879344',price50:null,price6:null},
      {label:'02 Sugar On Me #ไฮไลท์เนื้อเจลลี่',trCode:'17010',barcode:'8857128879351',price50:null,price6:null},
      {label:'03 Chewy Cherry สีแดงเชอร์รี่',trCode:'16170',barcode:'8857128879368',price50:null,price6:null},
      {label:'04 Eve & Joy สีชมพูช็อกกี้พิงค์',trCode:'16180',barcode:'8857128879375',price50:null,price6:null}
    ]},
  {id:'g_charmiss_you_make_me_blush_l',name:'CHARMISS YOU MAKE ME BLUSH LIQUID BLUSH ON',cat:'Cheek',emoji:'🌸',dealer:55,wholesale:60,
    variants:[
      {label:'01 FIRST DATE',trCode:'16310',barcode:'8857128879627',price50:null,price6:null},
      {label:'02 FANCY YOU',trCode:'16320',barcode:'8857128879634',price50:null,price6:null},
      {label:'03 FALL YOU',trCode:'16330',barcode:'8857128879641',price50:null,price6:null},
      {label:'04 FAITH LOVE',trCode:'16370',barcode:'8859856200032',price50:null,price6:null},
      {label:'05 FOREVER YOUTH',trCode:'16380',barcode:'8859856200049',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_everything_nice_gli',name:'Charmiss Everything Nice Glitter Lip Gloss',cat:'Lip',emoji:'💋',dealer:67,wholesale:67,
    variants:[
      {label:'01 Ice Sore',trCode:'32160',barcode:'8857128879436',price50:null,price6:null},
      {label:'02 Best Friends',trCode:'32170',barcode:'8857128879450',price50:null,price6:null},
      {label:'03 Sweet \'N Sour',trCode:'32180',barcode:'8857128879474',price50:null,price6:null},
      {label:'01 Ice Sore (GRADE B)',trCode:'32160-B',barcode:'8857128879436',price50:null,price6:null},
      {label:'02 Best Friends (GRADE B)',trCode:'32170-B',barcode:'8857128879450',price50:null,price6:null},
      {label:'03 Sweet \'N Sour (GRADE B)',trCode:'32180-B',barcode:'8857128879474',price50:null,price6:null}
    ]},
  {id:'g_charmiss_everything_nice_air',name:'Charmiss Everything Nice Airy Lip Tint',cat:'Lip',emoji:'💋',dealer:67,wholesale:67,
    variants:[
      {label:'01 Vanquish Evil',trCode:'33360',barcode:'8857128879771',price50:null,price6:null},
      {label:'02 Saving The Day',trCode:'33370',barcode:'8857128879788',price50:null,price6:null},
      {label:'03 Girl Power',trCode:'33380',barcode:'8857128879795',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_everything_nice_mat',name:'Charmiss Everything Nice Matte All Day Cushion Spf50 Pa++++',cat:'Face',emoji:'✨',dealer:117,wholesale:117,
    variants:[
      {label:'01 Ivory',trCode:'12100',barcode:'8857128879832',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12110',barcode:'8857128879849',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12120',barcode:'8857128879856',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_everything_nice_moc',name:'Charmiss Everything Nice Mochi Blush Duo',cat:'Cheek',emoji:'🌸',dealer:67,wholesale:67,
    variants:[
      {label:'01 Sugar',trCode:'16340',barcode:'8857128879498',price50:null,price6:null},
      {label:'02 Spice',trCode:'16350',barcode:'8857128879511',price50:null,price6:null},
      {label:'03 Everything Nice',trCode:'16360',barcode:'8857128879535',price50:null,price6:null}
    ]},
  // ─── EYE ───,
  {id:'g_charmiss_everything_nice_eye',name:'Charmiss Everything Nice Eyeshadow Palette',cat:'Eye',emoji:'👁️',dealer:77,wholesale:77,
    variants:[
      {label:'01 Girls Gone Mild',trCode:'22060',barcode:'8857128879801',price50:null,price6:null},
      {label:'02 Dream Scheme',trCode:'22070',barcode:'8857128879818',price50:null,price6:null},
      {label:'03 Just Desserts',trCode:'22080',barcode:'8857128879825',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_perfect_heart_everl',name:'Charmiss Perfect Heart Everlasting Matte Cushion SPF50+ PA+++',cat:'Face',emoji:'✨',dealer:220,wholesale:240,
    variants:[
      {label:'00 FAIR',trCode:'12220',barcode:'8859856200575',price50:null,price6:null},
      {label:'01 Ivory',trCode:'12160',barcode:'8859856200285',price50:null,price6:null},
      {label:'02 Natural Beige',trCode:'12170',barcode:'8859856200292',price50:null,price6:null},
      {label:'03 Honey Beige',trCode:'12180',barcode:'8859856200308',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_jewel_jelly_crystal',name:'Charmiss Jewel Jelly Crystal Stick',cat:'Others',emoji:'📦',dealer:84,wholesale:89,
    variants:[
      {label:'01 PINK DIAMOND',trCode:'17020',barcode:'8859856200315',price50:null,price6:null},
      {label:'02 SILVER MOON',trCode:'17030',barcode:'8859856200322',price50:null,price6:null},
      {label:'03 GOLD CRUSH',trCode:'17040',barcode:'8859856200339',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_juicy_pop_tint',name:'Charmiss Juicy Pop Tint',cat:'Lip',emoji:'💋',dealer:90,wholesale:95,
    variants:[
      {label:'01 Pink Lady',trCode:'33390',barcode:'8859856200353',price50:null,price6:null},
      {label:'02 Milky Raspberry',trCode:'33400',barcode:'8859856200360',price50:null,price6:null},
      {label:'03 Dragon Bloom',trCode:'33410',barcode:'8859856200377',price50:null,price6:null},
      {label:'04 Grape Bliss',trCode:'33420',barcode:'8859856200384',price50:null,price6:null},
      {label:'05 Cherry Pop',trCode:'33430',barcode:'8859856200391',price50:null,price6:null},
      {label:'06 Strawberry Martini',trCode:'33440',barcode:'8859856200407',price50:null,price6:null},
      {label:'07 Ruby Punch',trCode:'33450',barcode:'8859856200414',price50:null,price6:null},
      {label:'08 Melon Crush',trCode:'33460',barcode:'8859856200421',price50:null,price6:null},
      {label:'09 Caramel Apple Rum',trCode:'33470',barcode:'8859856200438',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charm_on_glassy_stick',name:'CHARM ON GLASSY STICK',cat:'Others',emoji:'📦',dealer:55,wholesale:60,
    variants:[
      {label:'01 PINK ME UP',trCode:'16390',barcode:'8859856200483',price50:null,price6:null},
      {label:'03 DEWY POMELO',trCode:'16410',barcode:'8859856200506',price50:null,price6:null},
      {label:'04 SUGAR LILAC',trCode:'16420',barcode:'8859856200513',price50:null,price6:null}
    ]},
  {id:'g_charmiss_charm_on_glassy_sti',name:'CHARMISS CHARM ON GLASSY STICK',cat:'Others',emoji:'📦',dealer:55,wholesale:60,
    variants:[
      {label:'02 MOONBERRY',trCode:'16400',barcode:'8859856200490',price50:null,price6:null}
    ]},
  {id:'g_charm_on_matte_stick',name:'CHARM ON MATTE STICK',cat:'Others',emoji:'📦',dealer:55,wholesale:60,
    variants:[
      {label:'05 MWAH PINK',trCode:'16430',barcode:'8859856200520',price50:null,price6:null},
      {label:'06 CHARMING ROSETTE',trCode:'16440',barcode:'8859856200537',price50:null,price6:null},
      {label:'07 FOG MOCHA',trCode:'16450',barcode:'8859856200544',price50:null,price6:null},
      {label:'08 TOASTY TEDDY',trCode:'16460',barcode:'8859856200551',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_hyacherry_oil_contr',name:'CHARMISS HYACHERRY OIL CONTROL PRIMER (6g)',cat:'Face',emoji:'✨',dealer:37,wholesale:39,
    variants:[
      {label:'One Size',trCode:'14000',barcode:'8859856200452',price50:null,price6:35}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_everything_nice_moc',name:'CHARMISS EVERYTHING NICE MOCHI BLUSH DUO',cat:'Cheek',emoji:'🌸',dealer:0,wholesale:0,
    variants:[
      {label:'01 SUGAR (GRADE B)',trCode:'16340-B',barcode:'8857128879498',price50:null,price6:null},
      {label:'02 SPICE (GRADE B)',trCode:'16350-B',barcode:'8857128879511',price50:null,price6:null},
      {label:'03 EVERYTHING NICE (GRADE B)',trCode:'16360-B',barcode:'8857128879535',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_blooming_heart_soft',name:'CHARMISS BLOOMING HEART SOFT GLOW CUSHION SPF50+PA++++',cat:'Face',emoji:'✨',dealer:185,wholesale:0,
    variants:[
      {label:'01 IVORY',trCode:'12230',barcode:'8859856200131',price50:null,price6:null},
      {label:'02 NATURAL BEIGE',trCode:'12240',barcode:'8859856200155',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_blooming_heart_glit',name:'CHARMISS BLOOMING HEART GLITTER LIP GLOSS',cat:'Lip',emoji:'💋',dealer:130,wholesale:0,
    variants:[
      {label:'01 ROSIE',trCode:'32190',barcode:'8859856200056',price50:null,price6:null},
      {label:'02 LILAC',trCode:'32200',barcode:'8859856200070',price50:null,price6:null}
    ]},
  {id:'g_charmiss_blooming_heart_tint',name:'Charmiss Blooming Heart Tinted Lip Serum',cat:'Lip',emoji:'💋',dealer:130,wholesale:0,
    variants:[
      {label:'01 Cherry Blossom',trCode:'34091',barcode:'8859856200599',price50:null,price6:null},
      {label:'02 Peach Bunny',trCode:'34101',barcode:'8859856200605',price50:null,price6:null},
      {label:'03 Plum Pixie',trCode:'34111',barcode:'8859856200612',price50:null,price6:null},
      {label:'04 Bad Babe Berry',trCode:'34121',barcode:'8859856200629',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_blooming_heart_shin',name:'CHARMISS BLOOMING HEART SHINING BLUSH PINK HIGHLIGHTER',cat:'Cheek',emoji:'🌸',dealer:130,wholesale:0,
    variants:[
      {label:'One Size',trCode:'16470',barcode:'8859856200094',price50:null,price6:null}
    ]},
  {id:'g_charmiss_blooming_heart_shin',name:'CHARMISS BLOOMING HEART SHINING BLUSH ROSY LILAC',cat:'Cheek',emoji:'🌸',dealer:130,wholesale:0,
    variants:[
      {label:'One Size',trCode:'16480',barcode:'8859856200117',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_blooming_heart_loos',name:'Charmiss Blooming Heart Loose Powder',cat:'Others',emoji:'📦',dealer:130,wholesale:0,
    variants:[
      {label:'01 Pink Petal',trCode:'15010',barcode:'8859856200681',price50:null,price6:null},
      {label:'02 Lilac Lock',trCode:'15020',barcode:'8859856200698',price50:null,price6:null}
    ]},
  {id:'g_charmiss_blooming_heart_char',name:'CHARMISS BLOOMING HEART CHARMING PALETTE',cat:'Others',emoji:'📦',dealer:190,wholesale:0,
    variants:[
      {label:'01 COTTON CANDY',trCode:'22090',barcode:'8859856200650',price50:null,price6:null},
      {label:'02 MIDNIGHT MOCHA',trCode:'22100',barcode:'8859856200667',price50:null,price6:null}
    ]},
  // ─── SKINCARE ───,
  {id:'g_charmiss_acne_balance_toner_',name:'Charmiss Acne Balance Toner Pad 110 ml.',cat:'Skincare',emoji:'🧴',dealer:140,wholesale:150,
    variants:[
      {label:'One Size',trCode:'53021',barcode:'8859856200766',price50:null,price6:null}
    ]},
  {id:'g_charmiss_acne_balance_cleans',name:'Charmiss Acne Balance Cleansing Gel 100 ml.',cat:'Skincare',emoji:'🧴',dealer:50,wholesale:60,
    variants:[
      {label:'One Size',trCode:'52011',barcode:'8859856200674',price50:null,price6:null}
    ]},
  // ─── FACE ───,
  {id:'g_charmiss_perfect_heart_matte',name:'Charmiss Perfect Heart Matte Finish Setting Spray 50ml',cat:'Face',emoji:'✨',dealer:55,wholesale:60,
    variants:[
      {label:'One Size',trCode:'18000',barcode:'8859856200568',price50:null,price6:null}
    ]},
  // ─── OTHERS ───,
  {id:'g_charmiss_my_melody_box_set',name:'Charmiss My Melody Box Set',cat:'Others',emoji:'📦',dealer:2000,wholesale:0,
    variants:[
      {label:'One Size',trCode:'98010',barcode:'8859856200469',price50:null,price6:null}
    ]},
  {id:'g_charmiss_kuromi_box_set',name:'Charmiss Kuromi Box Set',cat:'Others',emoji:'📦',dealer:2000,wholesale:0,
    variants:[
      {label:'One Size',trCode:'98020',barcode:'8859856200476',price50:null,price6:null}
    ]},
  // ─── LIP ───,
  {id:'g_charmiss_snow_collection_tin',name:'CHARMISS SNOW COLLECTION TINTED LIP SERUM',cat:'Lip',emoji:'💋',dealer:0,wholesale:130,
    variants:[
      {label:'01 COZY PINK',trCode:'34130',barcode:'8859856200889',price50:null,price6:null},
      {label:'02 CRYSTAL FLAKE',trCode:'34140',barcode:'8859856200896',price50:null,price6:null}
    ]},
  // ─── CHEEK ───,
  {id:'g_charmiss_airy_kiss_tint_matt',name:'CHARMISS AIRY KISS TINT MATTE LIP & CHEEK',cat:'Cheek',emoji:'🌸',dealer:100,wholesale:105,
    variants:[
      {label:'01 ROSE MERINGUE',trCode:'33510',barcode:'8859856200704',price50:null,price6:null},
      {label:'02 CHERRY ON TOP',trCode:'33520',barcode:'8859856200711',price50:null,price6:null},
      {label:'03 TANGERINE CRUSH',trCode:'33530',barcode:'8859856200728',price50:null,price6:null},
      {label:'04 STRAWBERRY KISS',trCode:'33540',barcode:'8859856200735',price50:null,price6:null},
      {label:'05 ALMOND CREAM',trCode:'33550',barcode:'8859856200742',price50:null,price6:null},
      {label:'06 PEACH MOUSSE',trCode:'33560',barcode:'8859856200759',price50:null,price6:null}
    ]}
];

const CATS = ['ทั้งหมด', ...new Set(PRODUCTS.map(p=>p.cat))];

