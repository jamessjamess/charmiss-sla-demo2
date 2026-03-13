// ─── HELPERS ───
function fmt(sec){
  const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function fmtDate(ts){return new Date(ts).toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'});}
function fmtTime(ts){return new Date(ts).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});}
function fmtDateTime(ts){return fmtDate(ts)+' '+fmtTime(ts);}

function getSLADeadline(startTs){
  const d=new Date(startTs),next=new Date(d);
  next.setDate(next.getDate()+1);
  if(d.getHours()<12){next.setHours(9,0,0,0);}else{next.setHours(14,0,0,0);}
  return next.getTime();
}
function getSLAStatus(startTs,status){
  if(status==='confirmed'||status==='canceled'||status==='delivered')return{cls:'done',label:'—'};
  const deadline=getSLADeadline(startTs),now=Date.now(),remaining=deadline-now;
  if(remaining<0)return{cls:'urgent',label:'เกิน SLA!'};
  if(remaining<3*3600*1000)return{cls:'warn',label:fmtDateTime(deadline)};
  return{cls:'ok',label:fmtDateTime(deadline)};
}


// ─── STATE ───
var STAGE_REMARKS = {};  // key: ticketId+'_'+stageKey → {text, images:[...]}
// ── Sample remarks for overdue stages ──
(function(){
  function sr(tid,sk,txt){ STAGE_REMARKS[tid+'_'+sk]={text:txt,images:[]}; }
  // Ticket 3 Eveandboy stuck approve_po
  sr(3,'approve_po','⚠️ รอ Approve จาก Manager นาน 26 ชม. — ผู้อนุมัติอยู่ต่างจังหวัด — ประสานแล้ว Approve เสร็จ 12/03 11:00 น.');
  // Ticket 10 Beautrium approve_so overdue
  sr(10,'approve_so','‼️ Invoice ราคาไม่ตรง PO ต้นฉบับ 2 รายการ — แก้ไขแล้วส่ง Invoice ใหม่ให้คลัง 10:45 น. 12/03 — เกิน SLA 1 ชม.');
  // Ticket 13 CJ doc_wh overdue  
  sr(13,'doc_wh','📦 ส่งเอกสารล่าช้า 6 ชม. — ERP ออก Invoice ไม่ได้ — IT แก้ไข เสร็จ 20:00 น. ส่งเอกสารทันที');
  // Ticket 22 Watsons approve_po overdue
  sr(22,'approve_po','ℹ️ เกิน SLA 2 ชม. — มีสินค้าใหม่ต้องตรวจ Stock ก่อน — Approve เสร็จ 09:15 น.');
  // Ticket 15 Eveandboy delivery done overdue
  sr(15,'delivery','🚚 ส่งสำเร็จ — ล่าช้า 3 ชม. รถติดทางด่วน 07:00-10:00 น. — ถึง Terminal 21 Korat 11:30 น. Vendor ยืนยันรับแล้ว');
  // Mockup MT tickets
  sr(102,'approve_po','✍️ รอผู้มีอำนาจอนุมัติ PO — ผู้อนุมัติลาออกนอก ไม่มีการ Delegate งาน ค้างอยู่นาน 52 ชั่วโมง');
  sr(103,'open_so','📋 ระบบ ERP มีปัญหา ไม่สามารถสร้าง SO ได้ — ทีม IT กำลังแก้ไข รอ Resolve มาแล้ว 2 วัน');
  sr(104,'approve_so','🧾 ราคาสินค้าใน SO ไม่ตรงกับ PO ต้นฉบับ — ต้องแก้ไข Invoice ก่อน Approve ติดค้าง 72 ชั่วโมง');
  sr(105,'doc_wh','📦 เอกสารถูกส่งอีเมลไปแล้ว แต่คลังไม่ได้รับ — อาจติด Spam Filter หรือ Email ผิด ต้องส่งซ้ำ');
  sr(106,'delivery','🚚 Logistic Partner แจ้งว่าสินค้าไม่พร้อมส่ง — รอ Stock เติมจาก Supplier ใช้เวลา 3-5 วัน');
  sr(107,'delivered','🎉 สินค้าถูกส่งถึงแล้ว แต่ Vendor ยังไม่ยืนยันรับของใน Portal — รอ Sign-off มาแล้ว 40 ชั่วโมง');
  // Mockup TT tickets
  sr(120,'approve_po','✍️ Order รอ Approve จาก Sales Manager — Manager ลาป่วย ยังไม่มีคน Delegate ค้างอยู่ 28 ชั่วโมง');
  sr(121,'open_so','📋 Approved แล้ว แต่ ERP ยังไม่ได้เปิด SO — ติดต่อทีม Ops แล้ว รอดำเนินการ 18 ชั่วโมง');
  sr(122,'delivery','🚚 สินค้าพร้อมส่งแล้ว แต่ Logistics ยังไม่มารับ — รถขนส่งเต็ม ต้องรอรอบถัดไป 2 วัน');
})();
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
let curPOMainTab='inbox';

var PO_SUB_TABS={
  inbox:  [{f:'all_inbox',lbl:'ทั้งหมด'},{f:'pending_att',lbl:'📎 รอแนบไฟล์'},{f:'received',lbl:'📥 รอรับงาน'}],
  approve:[{f:'all_approve',lbl:'ทั้งหมด'},{f:'verified',lbl:'🔍 รอ Approve'},{f:'approved',lbl:'✅ Approved แล้ว'}],
  done:   [{f:'all_done',lbl:'ทั้งหมด'},{f:'confirmed',lbl:'☑️ Confirmed'},{f:'rejected',lbl:'🚫 ยกเลิก'}],
};

function setPOMainTab(tab,el){
  curPOMainTab=tab;
  document.querySelectorAll('.po-main-tab').forEach(function(b){
    var isAct=b.id===('potab-main-'+tab);
    b.style.color=isAct?'var(--pink)':'var(--text2)';
    b.style.borderBottom=isAct?'3px solid var(--pink)':'3px solid transparent';
  });
  curPOFilter='all_'+tab;
  renderPOSubTabs();
  renderTickets();
}

function renderPOSubTabs(){
  var tabEl=document.getElementById('po-status-tabs');
  if(!tabEl) return;
  var defs=PO_SUB_TABS[curPOMainTab]||[];
  var html="";
  for(var di=0;di<defs.length;di++){
    var d=defs[di];
    var ac=curPOFilter===d.f?" active":"";
    html+='<button class="potab'+ac+'" data-filter="'+d.f+'" onclick="setPOFilter(this.dataset.filter,this)">'+d.lbl+'</button>';
  }
  tabEl.innerHTML=html;
}

function updatePOMainTabCounts(){
  var inbox=TICKETS.filter(function(t){return t.procStatus==='pending_att'||t.procStatus==='received'||t.procStatus==='escalated';}).length;
  var approve=TICKETS.filter(function(t){return t.procStatus==='verified'||t.procStatus==='approved';}).length;
  var done=TICKETS.filter(function(t){return t.status==='confirmed'||t.status==='canceled';}).length;
  var ei=document.getElementById('cnt-main-inbox');
  var ea=document.getElementById('cnt-main-approve');
  var ed=document.getElementById('cnt-main-done');
  if(ei) ei.textContent=inbox;
  if(ea) ea.textContent=approve;
  if(ed) ed.textContent=done;
}

function goToPOTab(mainTab,subFilter){
  gotoView('po-tickets');
  curPOMainTab=mainTab;
  curPOFilter=subFilter||('all_'+mainTab);
  document.querySelectorAll('.po-main-tab').forEach(function(b){
    var isAct=b.id===('potab-main-'+mainTab);
    b.style.color=isAct?'var(--pink)':'var(--text2)';
    b.style.borderBottom=isAct?'3px solid var(--pink)':'3px solid transparent';
  });
  renderPOSubTabs();
  renderTickets();
}
let curPOCaseFilter='all',curPOProcFilter='all',curChannelFilter='all';
let vendorRules=[...Object.entries(VENDORS).map(([name,v])=>({name,email:v.email,subject:v.subject,slaNote:v.slaNote,deliveryNote:v.deliveryNote,portal:v.portal,active:true}))];


// ─── DASHBOARD PIE CHART ─────────────────────────────
// 4 statuses matching PO Ticket tabs
function renderDashPie(){
  var total=TICKETS.filter(function(t){return !t._isMockup;}).length;
  var counts={
    pending_att: TICKETS.filter(function(t){return !t._isMockup&&t.procStatus==='pending_att';}).length,
    received:    TICKETS.filter(function(t){return !t._isMockup&&(t.procStatus==='received'||t.procStatus==='escalated');}).length,
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

// ─── DASHBOARD PIPELINE (7 stages, dynamic from TICKETS) ───
function renderDashPipeline(){
  var el=document.getElementById('dashPipeline');
  if(!el) return;
  var real=TICKETS.filter(function(t){return !t._isMockup && t.status!=='canceled';});
  var stageConfig=[
    {key:'po',        label:'เปิด PO/<br>Order',   bg:'#F0FDF4', color:'#16A34A'},
    {key:'approve_po',label:'Appv PO/<br>Order',   bg:'#EDE9FE', color:'#7C3AED'},
    {key:'open_so',   label:'เปิด SO',              bg:'#DBEAFE', color:'#1D4ED8'},
    {key:'approve_so',label:'Appv SO/<br>Invoice',  bg:'#FEF3C7', color:'#B45309'},
    {key:'doc_wh',    label:'ส่งเอกสาร<br>ให้คลัง', bg:'#FEE2E2', color:'#DC2626'},
    {key:'delivery',  label:'จัดส่ง<br>(Delivery)', bg:'#E0F2FE', color:'#0284C7'},
    {key:'delivered', label:'จัดส่ง<br>สำเร็จ',     bg:'var(--success-bg)', color:'var(--success)'},
  ];
  var html='';
  for(var i=0;i<stageConfig.length;i++){
    var sc=stageConfig[i];
    var isLast=(i===stageConfig.length-1);
    // Count tickets currently AT this stage (not done past it)
    var cnt=real.filter(function(t){return t.currentStage===sc.key && !t.journey[sc.key].done;}).length;
    // Special for 'po': count where po is done but nothing further
    if(sc.key==='po') cnt=real.filter(function(t){return t.currentStage==='po';}).length;
    html+='<div style="flex:1;background:'+sc.bg+';display:flex;flex-direction:column;align-items:center;justify-content:center;'+(isLast?'':'border-right:1px solid var(--border);')+'padding:4px 3px;cursor:pointer" onclick="gotoView(\'sla-journey\')" title="'+sc.label.replace(/<br>/g,' ')+'">'
      +'<div style="font-size:20px;font-weight:800;color:'+sc.color+';line-height:1">'+cnt+'</div>'
      +'<div style="font-size:9px;color:'+sc.color+';font-weight:600;text-align:center;line-height:1.3;margin-top:3px">'+sc.label+'</div>'
      +'</div>';
  }
  el.innerHTML=html;
}

// ─── DASHBOARD SO CHANNEL (dynamic from TICKETS) ───
function renderDashSOChannel(){
  var el=document.getElementById('dashSOChannelContent');
  if(!el) return;
  var real=TICKETS.filter(function(t){return !t._isMockup;});
  // MT มี Invoice = non-ORDER caseType, has 'approve_so' done (Invoice exists)
  var mtInv=real.filter(function(t){return t.caseType!=='ORDER' && t.journey && t.journey.approve_so && t.journey.approve_so.done;});
  // MT ไม่มี Invoice = non-ORDER, no approve_so done yet but status != canceled
  var mtNoInv=real.filter(function(t){return t.caseType!=='ORDER' && t.status!=='canceled' && !(t.journey && t.journey.approve_so && t.journey.approve_so.done);});
  // TT = ORDER type
  var tt=real.filter(function(t){return t.caseType==='ORDER' && t.status!=='canceled';});
  var total=mtInv.length+mtNoInv.length+tt.length;
  var maxCount=Math.max(mtInv.length,mtNoInv.length,tt.length,1);
  var maxBarH=64;
  function bar(count,bg,color,label){
    var h=Math.max(4,Math.round((count/maxCount)*maxBarH));
    return '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px">'
      +'<div style="font-size:14px;font-weight:700;color:'+color+'">'+count+'</div>'
      +'<div style="width:100%;display:flex;align-items:flex-end;height:'+maxBarH+'px">'
      +'<div style="width:100%;height:'+h+'px;background:'+bg+';border-radius:4px 4px 0 0"></div>'
      +'</div>'
      +'<div style="font-size:9.5px;font-weight:600;color:'+color+';text-align:center;line-height:1.3">'+label+'</div>'
      +'</div>';
  }
  el.innerHTML='<div style="display:flex;align-items:flex-end;gap:10px">'
    +bar(mtInv.length,'#DBEAFE','#1D4ED8','MT มี<br>Invoice')
    +bar(mtNoInv.length,'#EDE9FE','#7C3AED','MT ไม่มี<br>Invoice')
    +bar(tt.length,'#D1FAE5','#059669','TT')
    +'</div>'
    +'<div style="border-top:1px solid var(--border);margin-top:10px;padding-top:8px;display:flex;gap:8px;flex-wrap:wrap">'
    +'<div style="font-size:11px;color:var(--text2)">รวม SO: <strong>'+total+'</strong> ใบ</div>'
    +'</div>';
}

// ─── INIT ───
curPOMainTab='inbox';curPOFilter='all_inbox';renderPOSubTabs();
renderTickets();
renderJourney();
renderDashPipeline();
renderDashSOChannel();
renderVendorSummary();
renderAdminTable();
renderVendorRules();
renderNotifications('all');

// ─── LIVE DURATION COUNTER (อัปเดตทุก 30 วินาที) ───
setInterval(function(){
  var counters=document.querySelectorAll('[id^="jdur-"][data-start]');
  counters.forEach(function(el){
    var startMs=parseInt(el.dataset.start||'0');
    var isStuck=el.dataset.stuck==='1';
    if(!startMs) return;
    var diffMs=Date.now()-startMs;
    var h=Math.floor(diffMs/3600000);
    var m=Math.floor((diffMs%3600000)/60000);
    var txt=(h>0?(h+' ชม. '):'')+(m+' น.');
    if(isStuck) txt+=(' (ค้าง)');
    el.textContent=txt;
  });
},30000);

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
  const titles={dashboard:'Dashboard','sla-journey':'SLA Journey — ติดตามเอกสาร','po-tickets':'PO Tickets จาก Email','create-order':'สร้าง Order',admin:'Admin PO',notifications:'การแจ้งเตือน',vendors:'Vendor Rules','sales-order':'Sales Order','wms-upload':'Upload ข้อมูลการส่งของจาก WMS','role-management':'🔑 จัดการสิทธิ์ผู้ใช้'};
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
  var h = 100;
  el.innerHTML = weeks.map(function(w) {
    var breachH = Math.round((w.breach/(maxTotal||1))*h);
    var ontimeH = Math.round((w.ontime/(maxTotal||1))*h);
    return '<div class="bar-grp" style="gap:2px;justify-content:flex-end;flex:1">'
      + '<div class="bar-val" style="font-size:9px">' + (w.breach>0?'<span style="color:var(--danger);font-weight:700">'+w.breach+'</span>':'<span style="color:var(--text3)">'+w.breach+'</span>') + '</div>'
      + '<div style="width:100%;display:flex;flex-direction:column;gap:1px;align-items:stretch">'
        + '<div style="background:var(--danger);height:'+breachH+'px;border-radius:3px 3px 0 0;opacity:0.85;min-height:'+(w.breach>0?'3':'0')+'px"></div>'
        + '<div style="background:var(--success);height:'+ontimeH+'px;opacity:0.75;min-height:'+(w.ontime>0?'3':'0')+'px"></div>'
      + '</div>'
      + '<div style="font-size:9.5px;color:var(--text3);font-weight:600;margin-top:3px">'+w.w+'</div>'
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

function onVendorSelect(sel){
  renderJourney();
}

function selectVendor(name){
  var sel=document.getElementById('journey-vendor-filter');
  if(sel) sel.value=name;
  renderJourney();
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




// ── Journey expand state ──
var journeyExpandedIds = new Set();
var journeyAllExpanded = false;

function journeyToggleAll(){
  journeyAllExpanded = !journeyAllExpanded;
  var rows = document.querySelectorAll('.jt-row');
  rows.forEach(function(row){
    var id = parseInt(row.id.replace('jrow-',''));
    if(!isNaN(id)){
      var expRow = document.getElementById('jexp-'+id);
      var inner = document.getElementById('jexpinner-'+id);
      if(expRow && inner){
        if(journeyAllExpanded){
          expRow.classList.add('open'); inner.style.display='block'; row.style.background='var(--pink-ll)';
          journeyExpandedIds.add(id);
        } else {
          expRow.classList.remove('open'); inner.style.display='none'; row.style.background='';
          journeyExpandedIds.delete(id);
        }
      }
    }
  });
  var btn = document.getElementById('journey-collapse-btn');
  if(btn) btn.textContent = journeyAllExpanded ? '📁 พับทั้งหมด' : '📂 ขยายทั้งหมด';
}

function renderJourney(){
  var vendorFilter=document.getElementById('journey-vendor-filter')?document.getElementById('journey-vendor-filter').value:'';
  var stageFilter=document.getElementById('journey-stage-filter')?document.getElementById('journey-stage-filter').value:'';
  var stuckFilter=document.getElementById('journey-stuck-filter')?document.getElementById('journey-stuck-filter').value:'';
  var docSearch=(document.getElementById('journey-doc-search')?document.getElementById('journey-doc-search').value:'').toLowerCase().trim();

  var realData=TICKETS.filter(function(t){return !t._isMockup && t.status!=='canceled';});
  if(curChannelFilter==='mt') realData=realData.filter(function(t){return t.caseType!=='ORDER';});
  if(curChannelFilter==='tt') realData=realData.filter(function(t){return t.caseType==='ORDER';});
  var vendorSearch=vendorFilter.toLowerCase().trim();
  if(vendorSearch) realData=realData.filter(function(t){return t.vendor.toLowerCase().indexOf(vendorSearch)>=0 || (t.poRef&&t.poRef.toLowerCase().indexOf(vendorSearch)>=0);});
  if(docSearch) realData=realData.filter(function(t){return (t.poRef&&t.poRef.toLowerCase().indexOf(docSearch)>=0)||(t.subject&&t.subject.toLowerCase().indexOf(docSearch)>=0)||(String(t.id).indexOf(docSearch)>=0);});
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
  if(docSearch) mockupData=mockupData.filter(function(t){return (t.poRef&&t.poRef.toLowerCase().indexOf(docSearch)>=0)||(t.subject&&t.subject.toLowerCase().indexOf(docSearch)>=0)||(String(t.id).indexOf(docSearch)>=0);});
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
    // Auto-advance: if previous stage is done but currentStage not updated yet
    var effectiveCurrentStage=t.currentStage;
    for(var ci=0;ci<STAGES.length-1;ci++){
      var csk=STAGES[ci].key; var csd=t.journey[csk]||{};
      var nsk=STAGES[ci+1].key; var nsd=t.journey[nsk]||{};
      if(csd.done&&!nsd.done&&!nsd.stuck&&t.currentStage===csk){
        effectiveCurrentStage=nsk; break;
      }
    }
    var cls='ps-pending';
    if(s.done) cls='ps-done';
    else if(s.stuck && ((i===0)||(t.journey[STAGES[i-1].key]||{}).done===true)) cls='ps-blocked';
    else if(stage.key===effectiveCurrentStage) cls='ps-active';
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
      // เวลาเริ่มต้น = ts ของ stage ก่อนหน้า (ถ้ามี) หรือ startTs ของ ticket
      var prevTs2=null;
      if(i>0){var prevS2=t.journey[STAGES[i-1].key]||{};if(prevS2.ts) prevTs2=prevS2.ts;}
      var activeStartTs=prevTs2||t.startTs;
      var elapsedMins=Math.round((Date.now()-activeStartTs)/60000);
      var overSLA2=elapsedMins>allowMins;
      var eColor=overSLA2?'var(--danger)':'var(--warn)';
      var elStr=elapsedMins>=60?(Math.round(elapsedMins/60*10)/10+'h'):(elapsedMins+'m');
      tsLine='<div class="pipe-ts" style="color:var(--warn)">'+fmtTime(activeStartTs)+'</div>'
            +'<div class="pipe-ts-sla" style="color:'+eColor+';font-size:8.5px;font-weight:700">⏱ '+elStr+(overSLA2?' ⚠️':'')+'</div>';
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

  // Only show the FIRST stuck stage - suppress any subsequent stuck stages
  var firstStuckKey2=null;
  for(var si3=0;si3<STAGES.length;si3++){
    var ss3=t.journey[STAGES[si3].key]||{};
    if(ss3.stuck){firstStuckKey2=STAGES[si3].key;break;}
  }
  for(var i=0;i<STAGES.length;i++){
    var stage=STAGES[i];
    var s=t.journey[stage.key]||{done:false,ts:null,stuck:false};
    var nextTs=(i<STAGES.length-1)?(t.journey[STAGES[i+1].key]||{}).ts:null;
    var isCurrentActive=(stage.key===t.currentStage&&!s.done);
    // Only render stuck stage if it's THE FIRST stuck (firstStuckKey2)
    var effectiveStuck2=s.stuck&&(stage.key===firstStuckKey2);
    if(!s.ts && !effectiveStuck2 && !isCurrentActive) continue;
    s=Object.assign({},s,{stuck:effectiveStuck2});
    var isPO=(stage.key==='po');
    // startTs: PO uses ticket.startTs; others use PREVIOUS stage's completion ts
    var startTs;
    if(isPO){
      startTs=t.startTs;
    } else if(i>0){
      var ps=t.journey[STAGES[i-1].key]||{};
      startTs=ps.ts||t.startTs;
    } else {
      startTs=t.startTs;
    }
    // endTs: for PO, show po.ts if done; for others, endTs = this stage's own ts (completion time)
    var endTs=isPO?(s.done?s.ts:null):(s.done?s.ts:null);
    // doneButNoEndTs = stage is marked done but ts wasn't recorded (legacy data)
    
    var doneButNoEndTs=(s.done&&!s.stuck&&!s.ts&&!isPO);
    var durationHrs=0; var durationStr='—';
    var isLiveCounter=false; // flag for live counter
    if(isPO){
      durationStr='รับจากคู่ค้า';
    } else if(startTs&&endTs){
      durationHrs=Math.round((endTs-startTs)/3600000*10)/10;
      durationStr=durationHrs>=1?(durationHrs+' ชม.'):(Math.round((endTs-startTs)/60000)+' นาที');
    } else if(startTs&&s.stuck){
      durationHrs=Math.floor((Date.now()-startTs)/3600000);
      var dMin=Math.floor(((Date.now()-startTs)%3600000)/60000);
      durationStr=durationHrs+' ชม. '+dMin+' น. (ค้าง)';
      isLiveCounter=true;
    } else if(startTs&&stage.key===t.currentStage){
      durationHrs=Math.floor((Date.now()-startTs)/3600000);
      var dMin2=Math.floor(((Date.now()-startTs)%3600000)/60000);
      durationStr=(durationHrs>0?(durationHrs+' ชม. '):'')+(dMin2+' น.');
      isLiveCounter=true;
    }

    var isDone=(s.done&&!s.stuck&&!!endTs)||(doneButNoEndTs);
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
    if(isLiveCounter) barColor=s.stuck?'var(--danger)':'var(--warn)';
    var endTsCell=isPO?(s.done&&s.ts?fmtDateTime(s.ts):(s.stuck?'<span style="color:var(--danger);font-weight:600">กำลังดำเนินการ</span>':'<span style="color:var(--warn);font-weight:600">กำลังดำเนินการ</span>'))
      :(endTs?fmtDateTime(endTs)
        :(s.stuck?'<span style="color:var(--danger);font-weight:600">ยังค้างอยู่</span>'
          :(doneButNoEndTs?'<span style="color:var(--success);font-size:10.5px">เสร็จแล้ว</span>'
            :(stage.key===t.currentStage?'<span style="color:var(--warn);font-weight:600">กำลังดำเนินการ</span>':'—'))));
    var liveId=isLiveCounter?('jdur-'+t.id+'-'+stage.key):null;
    var liveStartAttr=isLiveCounter?(' data-start="'+startTs+'" data-stuck="'+(s.stuck?1:0)+'"'):'';
    var durationCell=isPO
      ?'<span style="font-size:11.5px;color:var(--text3);font-style:italic">รับจากคู่ค้า</span>'
      :('<div style="display:flex;align-items:center;gap:7px">'
        +'<div style="flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden">'
        +'<div style="width:'+barPct+'%;height:100%;background:'+barColor+';border-radius:3px"></div>'
        +'</div>'
        +(liveId
          ?'<span id="'+liveId+'"'+liveStartAttr+' style="font-size:11.5px;font-weight:700;color:'+barColor+';font-family:monospace;white-space:nowrap">'+durationStr+'</span>'
          :'<span style="font-size:11.5px;font-weight:700;color:'+barColor+';font-family:monospace;white-space:nowrap">'+durationStr+'</span>')
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

  // ── SUMMARY PANEL: CTA for current stage (no button for delivery/delivered) ──
  var activeStageCTA='';
  var noCtaStages={'delivery':true,'delivered':true};
  for(var si=0;si<STAGES.length;si++){
    var ss=STAGES[si]; var sv=t.journey[ss.key]||{};
    var isAct=(sv.stuck||(ss.key===t.currentStage&&!sv.done));
    if(isAct){
      if(!noCtaStages[ss.key]){
        var sact=STAGE_ACTIONS[ss.key];
        if(sact){
          activeStageCTA='<a href="'+sact.url+'" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:6px;width:100%;padding:10px 14px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700;margin-bottom:8px;letter-spacing:-.2px">ดำเนินการ '+sact.label+'</a>';
        }
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
  if(isOpen) journeyExpandedIds.add(id); else journeyExpandedIds.delete(id);
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
  var stEl=document.getElementById('po-status-tabs');
  if(stEl) stEl.querySelectorAll('.potab').forEach(function(b){b.classList.remove('active');});
  if(el) el.classList.add('active');
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
  var data=TICKETS.filter(function(t){return t.caseType!=='ORDER';});  // PO Tracker: MT only
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
  // Zone filter (main tab)
  if(curPOMainTab==='inbox'){
    data=data.filter(function(t){return t.procStatus==='pending_att'||t.procStatus==='received'||t.procStatus==='escalated';});
  } else if(curPOMainTab==='approve'){
    data=data.filter(function(t){return t.procStatus==='verified'||t.procStatus==='approved';});
  } else if(curPOMainTab==='done'){
    data=data.filter(function(t){return t.status==='confirmed'||t.status==='canceled';});
  }
  // Sub-filter within zone
  if(curPOFilter!=='all'&&curPOFilter!=='all_inbox'&&curPOFilter!=='all_approve'&&curPOFilter!=='all_done'){
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
    'escalated':   '<span class="badge b-pending-att" style="background:#FEE2E2;color:#DC2626"><span class="bdot" style="background:#DC2626"></span>🔴 Escalated</span>',
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
  updatePOMainTabCounts();renderDashPipeline();renderDashSOChannel();if(document.getElementById('dashPieSvg')) renderDashPie();renderDashBreachChart();
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
        +'<button onclick="rejectSelected('+t.id+',event)" style="font-size:11px;padding:6px 14px;background:var(--danger);color:#fff;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-family:inherit">🚫 ปฏิเสธที่เลือก</button>'
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
  renderDashPie();renderDashBreachChart();renderDashPipeline();renderDashSOChannel();renderTickets();renderJourney();renderVendorSummary();renderAdminTable();
  showToast('📥 กดรับงานแล้ว — ' + t.vendor + ' · ' + fmtDateTime(t.acceptedAt));
}

function openCancelModal(id,ev){
  if(ev)ev.stopPropagation();
  cancelPendingId=id;
  const t=TICKETS.find(x=>x.id===id);
  const wrap=document.getElementById('cancel-wrap');
  wrap.innerHTML=`
    <div class="mhdr">
      <div><div class="mtitle">🚫 ไม่รับงาน PO นี้</div><div class="msub">${t?t.vendor:''} — ${t?t.subject.substring(0,40):''}…</div></div>
      <button class="mclose" onclick="closeCancelModal()">✕</button>
    </div>
    <div class="mbody">
      <div style="font-size:12.5px;color:var(--text2);margin-bottom:12px">กรุณาเลือกเหตุผลที่ไม่รับงาน:</div>
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
  renderDashPie();renderDashBreachChart();renderDashPipeline();renderDashSOChannel();renderTickets();renderJourney();renderVendorSummary();renderAdminTable();
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
  curNotifTab=tab||curNotifTab;
  tab=curNotifTab;
  var data=NOTIFICATIONS;
  if(tab!=='all') data=data.filter(function(n){return n.type===tab;});

  // ── Main notification list ──
  var listEl=document.getElementById('notif-list');
  if(listEl){
    listEl.innerHTML=data.map(function(n){
      var iconBg=n.type==='sla'?'#FEE2E2':n.type==='new'?'var(--pink-ll)':'var(--surface3)';
      return '<div class="notif-item'+(n.unread?' unread':'')+'" onclick="readNotif('+n.id+')" style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:10px;cursor:pointer;background:'+(n.unread?'var(--pink-ll)':'')+'">'
        +'<div style="width:36px;height:36px;border-radius:50%;background:'+iconBg+';display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">'+n.icon+'</div>'
        +'<div style="flex:1;min-width:0">'
        +'<div style="font-size:12.5px;font-weight:'+(n.unread?'700':'600')+';color:var(--text);margin-bottom:2px">'+n.title+'</div>'
        +'<div style="font-size:11.5px;color:var(--text2);margin-bottom:4px;line-height:1.4">'+n.desc+'</div>'
        +'<div style="font-size:10.5px;color:var(--text3)">'+n.time+'</div>'
        +'</div>'
        +(n.unread?'<div style="width:8px;height:8px;border-radius:50%;background:var(--pink);flex-shrink:0;margin-top:4px"></div>':'')
        +'</div>';
    }).join('')||'<div style="text-align:center;padding:32px;color:var(--text3)">🔔 ไม่มีการแจ้งเตือน</div>';
  }

  // ── Summary cards ──
  renderNotifSummaryCards();

  // ── Pending actions panel ──
  var pendEl=document.getElementById('notif-pending-actions');
  if(pendEl){
    var received=TICKETS.filter(function(t){return t.procStatus==='received'||t.procStatus==='pending_att';});
    var toApprove=TICKETS.filter(function(t){return t.procStatus==='verified';});
    var slaBreached=TICKETS.filter(function(t){
      var sla=getSLAStatus(t.startTs,t.status);return sla.cls==='urgent';
    });
    var items=[
      received.length?{icon:'📥',label:'รอกดรับงาน',count:received.length,color:'var(--pink)',action:"goToPOTab('inbox','received')"}:null,
      toApprove.length?{icon:'✅',label:'รอ Approve PO',count:toApprove.length,color:'#7C3AED',action:"goToPOTab('approve','verified')"}:null,
      slaBreached.length?{icon:'🚨',label:'เกิน SLA แล้ว',count:slaBreached.length,color:'var(--danger)',action:"gotoView('sla-journey')"}:null,
    ].filter(Boolean);
    pendEl.innerHTML=items.length?items.map(function(item){
      return '<div onclick="'+item.action+'" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);cursor:pointer">'
        +'<div style="width:32px;height:32px;border-radius:8px;background:var(--surface2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0">'+item.icon+'</div>'
        +'<div style="flex:1"><div style="font-size:12px;font-weight:600;color:var(--text)">'+item.label+'</div></div>'
        +'<span style="font-size:13px;font-weight:800;color:'+item.color+';font-family:monospace">'+item.count+'</span>'
        +'<span style="color:var(--text3);font-size:12px">→</span>'
        +'</div>';
    }).join(''):'<div style="color:var(--text3);font-size:12px;text-align:center;padding:12px 0">✅ ไม่มีงานรอดำเนินการ</div>';
  }

  // ── Urgent ticket list ──
  renderNotifUrgentList();
  // ── Vendor mini summary ──
  renderNotifVendorSummary();

  // ── SLA countdown panel ──
  var slaEl=document.getElementById('notif-sla-countdown');
  if(slaEl){
    var urgentTickets=TICKETS.filter(function(t){return t.status!=='confirmed'&&t.status!=='canceled';})
      .map(function(t){
        var dl=getSLADeadline(t.startTs);
        var remaining=dl-Date.now();
        return {t:t,deadline:dl,remaining:remaining};
      })
      .sort(function(a,b){return a.remaining-b.remaining;})
      .slice(0,5);
    slaEl.innerHTML=urgentTickets.length?urgentTickets.map(function(item){
      var ms=item.remaining;
      var isOver=ms<0;
      var absMs=Math.abs(ms);
      var h=Math.floor(absMs/3600000);
      var m=Math.floor((absMs%3600000)/60000);
      var timeStr=(isOver?'เกิน ':'')+(h>0?h+'ชม. ':'')+m+'น.';
      var color=isOver?'var(--danger)':h<3?'var(--warn)':'var(--success)';
      return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--border)">'
        +'<div style="flex:1;min-width:0"><div style="font-size:11.5px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+item.t.vendor+'</div>'
        +'<div style="font-size:10px;color:var(--text3);font-family:monospace">'+(item.t.poRef||'')+'</div></div>'
        +'<span style="font-size:11px;font-weight:700;color:'+color+';font-family:monospace;white-space:nowrap">'+(isOver?'🔴 ':'⏱ ')+timeStr+'</span>'
        +'</div>';
    }).join(''):'<div style="color:var(--success);font-size:12px;text-align:center;padding:12px 0">✅ ทุก Ticket ทันเวลา</div>';
  }
}

function renderNotifSummaryCards(){
  var cardsEl=document.getElementById('notif-summary-cards');
  if(!cardsEl) return;
  var unread=NOTIFICATIONS.filter(function(n){return n.unread;}).length;
  var slaAlert=TICKETS.filter(function(t){var s=getSLAStatus(t.startTs,t.status);return s.cls==='urgent';}).length;
  var newToday=TICKETS.filter(function(t){return Date.now()-t.startTs<86400000;}).length;
  var pending=TICKETS.filter(function(t){return t.procStatus==='received'||t.procStatus==='verified';}).length;
  var cards=[
    {icon:'🔔',label:'ยังไม่ได้อ่าน',val:unread,color:'var(--pink)',bg:'var(--pink-ll)',view:'notifications'},
    {icon:'🚨',label:'เกิน SLA',val:slaAlert,color:'var(--danger)',bg:'#FEE2E2',view:'sla-journey'},
    {icon:'📧',label:'PO เข้าวันนี้',val:newToday,color:'#0284C7',bg:'#E0F2FE',view:'po-tickets'},
    {icon:'⏳',label:'รอดำเนินการ',val:pending,color:'#7C3AED',bg:'#EDE9FE',view:'po-tickets'},
  ];
  cardsEl.innerHTML=cards.map(function(c){
    var html='<div style="background:'+c.bg+';border-radius:var(--r);padding:14px 16px;cursor:pointer" onclick="gotoView(\''+c.view+'\')">'; 
    html+='<div style="font-size:20px;margin-bottom:4px">'+c.icon+'</div>';
    html+='<div style="font-size:24px;font-weight:800;color:'+c.color+';font-family:monospace;line-height:1">'+c.val+'</div>';
    html+='<div style="font-size:11px;font-weight:600;color:'+c.color+';margin-top:4px">'+c.label+'</div>';
    html+='</div>';
    return html;
  }).join('');
}
function switchNotifTab(tab,el){
  var allAtabs=document.querySelectorAll('#view-notifications .atab');
  allAtabs.forEach(function(x){x.classList.remove('active');});
  if(el) el.classList.add('active');
  renderNotifications(tab);
}
function readNotif(id){const n=NOTIFICATIONS.find(x=>x.id===id);if(n){n.unread=false;renderNotifications(curNotifTab);updateBadge();}}
function markAllRead(){NOTIFICATIONS.forEach(n=>n.unread=false);renderNotifications(curNotifTab);updateBadge();showToast('✓ อ่านทั้งหมดแล้ว');}

// ─── NOTIFICATION: URGENT TICKET LIST ───
var curNotifUrgentTab = 'all';
function switchNotifUrgentTab(tab, el) {
  curNotifUrgentTab = tab;
  document.querySelectorAll('#ntab-urgent,#ntab-near,#ntab-pending').forEach(function(b) {
    b.style.borderBottomColor = 'transparent';
    b.style.color = 'var(--text3)';
    b.style.fontWeight = '600';
  });
  if(el) { el.style.borderBottomColor = 'var(--pink)'; el.style.color = 'var(--pink)'; el.style.fontWeight = '700'; }
  renderNotifUrgentList();
}
function renderNotifUrgentList() {
  var el = document.getElementById('notif-urgent-list');
  if(!el) return;
  var tickets = TICKETS.filter(function(t){ return t.status!=='confirmed'&&t.status!=='canceled'; });
  var now = Date.now();
  if(curNotifUrgentTab === 'all') {
    tickets = tickets.filter(function(t){ var s=getSLAStatus(t.startTs,t.status); return s.cls==='urgent'; });
  } else if(curNotifUrgentTab === 'near') {
    tickets = tickets.filter(function(t){ var s=getSLAStatus(t.startTs,t.status); return s.cls==='warn'; });
  } else if(curNotifUrgentTab === 'pending') {
    tickets = tickets.filter(function(t){ return t.procStatus==='received'||t.procStatus==='pending_att'; });
  }
  if(!tickets.length) {
    el.innerHTML = '<div style="text-align:center;padding:28px;color:var(--text3);font-size:12px">✅ ไม่มีรายการ</div>';
    return;
  }
  var v_map = VENDORS || {};
  el.innerHTML = tickets.map(function(t) {
    var v = v_map[t.vendor]||{color:'#666',bg:'#eee',logo:'??'};
    var sla = getSLAStatus(t.startTs,t.status);
    var stage = STAGES.find(function(s){return s.key===t.currentStage;})||{label:t.currentStage};
    return '<div onclick="gotoView(\'sla-journey\')" style="display:flex;align-items:center;gap:9px;padding:10px 14px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s" onmouseover="this.style.background=\'var(--pink-ll)\'" onmouseout="this.style.background=\'\'">'
      +'<div style="width:28px;height:28px;border-radius:7px;background:'+v.bg+';color:'+v.color+';font-size:9px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+v.logo+'</div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-size:12px;font-weight:700;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+t.vendor+'</div>'
      +'<div style="font-size:10.5px;color:var(--text3);font-family:monospace">'+(t.poRef||'—')+'</div>'
      +'<div style="font-size:10px;color:var(--text2);margin-top:1px">📍 '+stage.label+'</div>'
      +'</div>'
      +'<span class="sla-chip '+sla.cls+'" style="font-size:10px;white-space:nowrap">'+(sla.cls==='urgent'?'🔴 เกิน SLA':sla.cls==='warn'?'⚠️ ใกล้ครบ':'✅')+'</span>'
      +'</div>';
  }).join('');
}

// ─── NOTIFICATION: VENDOR MINI SUMMARY ───
function renderNotifVendorSummary() {
  var el = document.getElementById('notif-vendor-summary');
  if(!el) return;
  var pending = TICKETS.filter(function(t){ return t.status!=='confirmed'&&t.status!=='canceled'; });
  var vendorCount = {};
  pending.forEach(function(t){ vendorCount[t.vendor] = (vendorCount[t.vendor]||0)+1; });
  var sorted = Object.entries(vendorCount).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
  if(!sorted.length) { el.innerHTML='<div style="font-size:12px;color:var(--text3);text-align:center;padding:8px">ไม่มีรายการค้าง</div>'; return; }
  el.innerHTML = sorted.map(function(entry) {
    var v = (VENDORS||{})[entry[0]]||{color:'#666',bg:'#eee',logo:'??'};
    return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">'
      +'<div style="width:22px;height:22px;border-radius:5px;background:'+v.bg+';color:'+v.color+';font-size:8px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0">'+v.logo+'</div>'
      +'<div style="flex:1;font-size:11.5px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+entry[0]+'</div>'
      +'<span style="font-size:12px;font-weight:800;color:var(--pink);font-family:monospace">'+entry[1]+'</span>'
      +'</div>';
  }).join('');
}

// ─── NAV: GO TO PO TAB WITH FILTER ───
function goToPOTab(group, filter) {
  gotoView('po-tickets');
  var btn = document.querySelector('[data-filter="'+filter+'"]');
  setPOFilter(filter, btn);
}

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

