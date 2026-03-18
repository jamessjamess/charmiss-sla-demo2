/* ══════════════════════════════════════════════════════════════
   DASHBOARD.JS — Charmiss Operations Portal
   KPI Dashboard: SLA Rate, Avg Processing Time, Pipeline Health
   ══════════════════════════════════════════════════════════════ */

// ─── KPI CALCULATIONS ────────────────────────────────────────

function getDashKPIs() {
  var real = TICKETS.filter(function(t){ return !t._isMockup && t.status !== 'canceled'; });
  var today = new Date(); today.setHours(0,0,0,0);
  var todayTs = today.getTime();
  var weekAgo = todayTs - 7*24*3600000;

  var todayTickets  = TICKETS.filter(function(t){ return !t._isMockup && t.startTs >= todayTs; });
  var inProcess     = real.filter(function(t){ return t.status !== 'confirmed'; });
  var confirmed     = TICKETS.filter(function(t){ return !t._isMockup && t.status === 'confirmed'; });
  var canceled      = TICKETS.filter(function(t){ return !t._isMockup && t.status === 'canceled'; });
  var confirmedToday= confirmed.filter(function(t){ return t.confirmedAt && t.confirmedAt >= todayTs; });

  // SLA rate (7 days)
  var recent = TICKETS.filter(function(t){ return !t._isMockup && t.startTs >= weekAgo; });
  var breach  = recent.filter(function(t){
    var sla = getSLAStatus(t.startTs, t.status);
    return sla.cls === 'urgent';
  });
  var slaRate = recent.length > 0 ? Math.round(((recent.length - breach.length) / recent.length) * 100) : 100;

  // Near SLA breach
  var nearBreach = inProcess.filter(function(t){
    var sla = getSLAStatus(t.startTs, t.status);
    return sla.cls === 'warn';
  });

  // Avg processing time for confirmed tickets (hours)
  var completedWithTime = confirmed.filter(function(t){ return t.confirmedAt && t.startTs; });
  var avgHrs = 0;
  if (completedWithTime.length > 0) {
    var totalMs = completedWithTime.reduce(function(s, t){ return s + (t.confirmedAt - t.startTs); }, 0);
    avgHrs = Math.round(totalMs / completedWithTime.length / 3600000 * 10) / 10;
  }

  // Stuck count
  var stuck = real.filter(function(t){
    return Object.values(t.journey).some(function(s){ return s.stuck; });
  });

  return {
    todayTickets:   todayTickets.length,
    inProcess:      inProcess.length,
    confirmedToday: confirmedToday.length,
    canceled:       canceled.length,
    nearBreach:     nearBreach.length,
    breach:         breach.length,
    slaRate:        slaRate,
    avgHrs:         avgHrs,
    stuck:          stuck.length,
    recentTotal:    recent.length,
  };
}

// ─── STAT CARDS ──────────────────────────────────────────────

function renderDashStatCards() {
  var kpi = getDashKPIs();
  var el = document.getElementById('dashStatCards');
  if (!el) return;

  var slaColor = kpi.slaRate >= 90 ? 'var(--success)' : kpi.slaRate >= 75 ? 'var(--warn)' : 'var(--danger)';
  var slaIcon  = kpi.slaRate >= 90 ? '✅' : kpi.slaRate >= 75 ? '⚠️' : '🔴';
  var slaSubColor = kpi.slaRate >= 90 ? 'ok' : 'warn';

  var avgColor = kpi.avgHrs <= 12 ? 'var(--success)' : kpi.avgHrs <= 24 ? 'var(--warn)' : 'var(--danger)';

  el.innerHTML = [
    {
      label:'PO Tickets วันนี้', icon:'🎫', iconBg:'var(--pink-l)', iconColor:'var(--pink)',
      val: kpi.todayTickets, valColor:'var(--text)',
      sub: kpi.inProcess + ' รอดำเนินการ', subClass:'warn',
      onclick:"gotoView('po-tickets')"
    },
    {
      label:'SLA Rate (7 วัน)', icon: slaIcon, iconBg: kpi.slaRate>=90?'#ECFDF5':kpi.slaRate>=75?'#FFFBEB':'#FEF2F2',
      iconColor: slaColor,
      val: kpi.slaRate + '%', valColor: slaColor,
      sub: kpi.breach + ' ใบเกิน SLA', subClass: slaSubColor,
      onclick:"gotoView('sla-journey')"
    },
    {
      label:'เวลาเฉลี่ยต่อ Ticket', icon:'⏱️', iconBg:'#EDE9FE', iconColor:'#7C3AED',
      val: kpi.avgHrs > 0 ? kpi.avgHrs + ' ชม.' : '—', valColor: avgColor,
      sub:'จาก ' + (TICKETS.filter(function(t){return !t._isMockup&&t.status==='confirmed';}).length) + ' Confirmed',
      subClass:'',
      onclick:"gotoView('sla-journey')"
    },
    {
      label:'ค้าง / เกิน SLA', icon:'🚨', iconBg:'#FEF2F2', iconColor:'var(--danger)',
      val: kpi.stuck, valColor: kpi.stuck > 0 ? 'var(--danger)' : 'var(--success)',
      sub: kpi.nearBreach + ' ใกล้ครบกำหนด', subClass: kpi.nearBreach > 0 ? 'warn' : 'ok',
      onclick:"gotoView('sla-journey')"
    },
  ].map(function(c) {
    return '<div class="stat-card" onclick="' + c.onclick + '" style="cursor:pointer">'
      + '<div class="stat-hdr">'
      + '<span class="stat-lbl">' + c.label + '</span>'
      + '<div class="stat-ico" style="background:' + c.iconBg + ';color:' + c.iconColor + '">' + c.icon + '</div>'
      + '</div>'
      + '<div class="stat-val" style="color:' + c.valColor + '">' + c.val + '</div>'
      + '<div class="stat-sub ' + c.subClass + '">' + c.sub + '</div>'
      + '</div>';
  }).join('');
}

// ─── KPI METER ROW ───────────────────────────────────────────

function renderDashKPIMeters() {
  var el = document.getElementById('dashKPIMeters');
  if (!el) return;
  var kpi = getDashKPIs();

  function meter(label, value, max, color, unit, sublabel) {
    var pct = Math.min(100, Math.round((value / (max||1)) * 100));
    var barColor = color;
    return '<div style="flex:1;min-width:130px">'
      + '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px">'
      + '<span style="font-size:11px;font-weight:700;color:var(--text2)">' + label + '</span>'
      + '<span style="font-size:13px;font-weight:800;color:' + color + '">' + value + unit + '</span>'
      + '</div>'
      + '<div style="height:7px;background:var(--border);border-radius:4px;overflow:hidden">'
      + '<div style="height:100%;width:' + pct + '%;background:' + barColor + ';border-radius:4px;transition:width .5s ease"></div>'
      + '</div>'
      + '<div style="font-size:9.5px;color:var(--text3);margin-top:3px">' + sublabel + '</div>'
      + '</div>';
  }

  var slaColor = kpi.slaRate >= 90 ? 'var(--success)' : kpi.slaRate >= 75 ? 'var(--warn)' : 'var(--danger)';
  var avgColor = kpi.avgHrs <= 12 ? 'var(--success)' : kpi.avgHrs <= 24 ? 'var(--warn)' : 'var(--danger)';
  var total = TICKETS.filter(function(t){ return !t._isMockup; }).length;
  var confirmed = TICKETS.filter(function(t){ return !t._isMockup && t.status === 'confirmed'; }).length;
  var completionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
  var completionColor = completionRate >= 70 ? 'var(--success)' : completionRate >= 40 ? 'var(--warn)' : 'var(--danger)';

  el.innerHTML = '<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:stretch">'
    + meter('SLA On-Time Rate', kpi.slaRate, 100, slaColor, '%', '7 วันล่าสุด (เป้า ≥ 90%)')
    + '<div style="width:1px;background:var(--border);flex-shrink:0;margin:2px 0"></div>'
    + meter('Completion Rate', completionRate, 100, completionColor, '%', 'Confirmed / ทั้งหมด')
    + '<div style="width:1px;background:var(--border);flex-shrink:0;margin:2px 0"></div>'
    + meter('Avg. Processing Time', kpi.avgHrs, 48, avgColor, ' ชม.', 'เป้า ≤ 12 ชม. / ticket')
    + '<div style="width:1px;background:var(--border);flex-shrink:0;margin:2px 0"></div>'
    + meter('ค้างอยู่', kpi.stuck, Math.max(kpi.inProcess, 1), kpi.stuck>0?'var(--danger)':'var(--success)', ' ใบ', 'จาก ' + kpi.inProcess + ' กำลังดำเนินการ')
    + '</div>';
}

// ─── PIE CHART ───────────────────────────────────────────────

function renderDashPie() {
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
  var C=2*Math.PI*15.5;
  var svgEl=document.getElementById('dashPieSvg');
  var legEl=document.getElementById('dashPieLegend');
  var totEl=document.getElementById('dashPieTotal');
  if(!svgEl||!legEl) return;
  var oldSegs=svgEl.getElementsByClassName('pie-seg');
  while(oldSegs.length>0){oldSegs[0].parentNode.removeChild(oldSegs[0]);}
  if(totEl) totEl.textContent=total;
  var offset=0; var legHtml='';
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
    circle.setAttribute('onclick',"setPOFilter('"+seg.key+"',document.querySelector('.potab[data-filter=\\'"+seg.key+"\\']'));gotoView('po-tickets')");
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

// ─── PIPELINE ────────────────────────────────────────────────

function renderDashPipeline() {
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
    var cnt=real.filter(function(t){return t.currentStage===sc.key && !t.journey[sc.key].done;}).length;
    if(sc.key==='po') cnt=real.filter(function(t){return t.currentStage==='po';}).length;
    html+='<div style="flex:1;background:'+sc.bg+';display:flex;flex-direction:column;align-items:center;justify-content:center;'+(isLast?'':'border-right:1px solid var(--border);')+'padding:4px 3px;cursor:pointer" onclick="gotoView(\'sla-journey\')" title="'+sc.label.replace(/<br>/g,' ')+'">'
      +'<div style="font-size:20px;font-weight:800;color:'+sc.color+';line-height:1">'+cnt+'</div>'
      +'<div style="font-size:9px;color:'+sc.color+';font-weight:600;text-align:center;line-height:1.3;margin-top:3px">'+sc.label+'</div>'
      +'</div>';
  }
  el.innerHTML=html;
}

// ─── SLA WEEKLY BREACH CHART ─────────────────────────────────

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
    var total = w.breach + w.ontime;
    var rate  = total > 0 ? Math.round((w.ontime/total)*100) : 100;
    var rateColor = rate >= 90 ? 'var(--success)' : rate >= 75 ? 'var(--warn)' : 'var(--danger)';
    var breachH = Math.round((w.breach/(maxTotal||1))*h);
    var ontimeH = Math.round((w.ontime/(maxTotal||1))*h);
    return '<div class="bar-grp" style="gap:2px;justify-content:flex-end;flex:1">'
      + '<div class="bar-val" style="font-size:9px">'
      + (w.breach>0 ? '<span style="color:var(--danger);font-weight:700">'+w.breach+'</span>' : '<span style="color:var(--text3)">0</span>')
      + '</div>'
      + '<div style="width:100%;display:flex;flex-direction:column;gap:1px;align-items:stretch" title="'+w.w+': '+rate+'% On-time">'
        + '<div style="background:var(--danger);height:'+breachH+'px;border-radius:3px 3px 0 0;opacity:0.85;min-height:'+(w.breach>0?'3':'0')+'px"></div>'
        + '<div style="background:var(--success);height:'+ontimeH+'px;opacity:0.75;min-height:'+(w.ontime>0?'3':'0')+'px"></div>'
      + '</div>'
      + '<div style="font-size:9.5px;color:var(--text3);font-weight:600;margin-top:3px">'+w.w+'</div>'
      + '<div style="font-size:8.5px;font-weight:700;color:'+rateColor+'">'+rate+'%</div>'
      + '</div>';
  }).join('');
}

// ─── SO CHANNEL CHART ────────────────────────────────────────

function renderDashSOChannel() {
  var el=document.getElementById('dashSOChannelContent');
  if(!el) return;
  var real=TICKETS.filter(function(t){return !t._isMockup;});
  var mtInv   =real.filter(function(t){return t.caseType!=='ORDER' && t.journey && t.journey.approve_so && t.journey.approve_so.done;});
  var mtNoInv =real.filter(function(t){return t.caseType!=='ORDER' && t.status!=='canceled' && !(t.journey && t.journey.approve_so && t.journey.approve_so.done);});
  var tt      =real.filter(function(t){return t.caseType==='ORDER' && t.status!=='canceled';});
  var total   =mtInv.length+mtNoInv.length+tt.length;
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

// ─── VENDOR SUMMARY (stub) ───────────────────────────────────

function renderVendorSummary() {
  var tbody = document.getElementById('vendor-summary-tbody');
  if(tbody) tbody.innerHTML = '';
}

// ─── MASTER RENDER ───────────────────────────────────────────

function renderDashboard() {
  renderDashStatCards();
  renderDashKPIMeters();
  renderDashPie();
  renderDashPipeline();
  renderDashBreachChart();
  renderDashSOChannel();
}
