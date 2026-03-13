// ═══════════════════════════════════════════════════════
//  CHARMISS PORTAL — AUTH & ROLE MANAGEMENT  (v2 clean)
// ═══════════════════════════════════════════════════════

// ─── ROLES ───
var ROLES = {
  root:          { label:'Root Admin',    labelTH:'ผู้ดูแลระบบสูงสุด', icon:'🔑', color:'#7C3AED', bg:'#EDE9FE', badge:'ROOT',
    views:['dashboard','sla-journey','po-tickets','admin','notifications','vendors','create-order','sales-order','role-management'] },
  ceo:           { label:'CEO',           labelTH:'ผู้บริหาร',          icon:'👑', color:'#B45309', bg:'#FEF3C7', badge:'CEO',
    views:['dashboard','sla-journey','sales-order','notifications'] },
  admin_officer: { label:'Admin Officer', labelTH:'เจ้าหน้าที่ Admin',  icon:'🛡️', color:'#1D4ED8', bg:'#DBEAFE', badge:'ADMIN',
    views:['dashboard','sla-journey','po-tickets','admin','notifications','vendors','create-order','sales-order','role-management'] },
  account:       { label:'Accounting',   labelTH:'บัญชี / การเงิน',   icon:'🧾', color:'#0891B2', bg:'#CFFAFE', badge:'ACC',
    views:['dashboard','sla-journey','sales-order','notifications'] },
  warehouse:     { label:'Warehouse',    labelTH:'คลังสินค้า',          icon:'📦', color:'#059669', bg:'#D1FAE5', badge:'WH',
    views:['dashboard','sla-journey','notifications'] },
  sales:         { label:'Sales',        labelTH:'พนักงานขาย',          icon:'🛍️', color:'#DB2777', bg:'#FCE7F3', badge:'SALES',
    views:['dashboard','sla-journey','create-order','sales-order','notifications'] }
};

// ─── USERS  (username = role key, password = role key) ───
var USERS = [
  { id:'u01', name:'System Admin',    username:'root',          password:'root',          role:'root',          avatar:'RA', team:'IT / System' },
  { id:'u02', name:'Wilasinee',        username:'ceo',           password:'ceo',           role:'ceo',           avatar:'WL', team:'Executive' },
  { id:'u03', name:'สมใจ เจริญสุข',   username:'admin_officer', password:'admin_officer', role:'admin_officer', avatar:'สจ', team:'MT Operations' },
  { id:'u04', name:'ฝนเทพ สมบัติ',    username:'sales',         password:'sales',         role:'sales',         avatar:'ฝท', team:'TT Sales' },
  { id:'u05', name:'สิริกาญจน์ ดี',   username:'sales2',        password:'sales',         role:'sales',         avatar:'สก', team:'TT Sales' },
  { id:'u06', name:'อัมพร รักไทย',    username:'sales3',        password:'sales',         role:'sales',         avatar:'อพ', team:'TT Sales' },
  { id:'u07', name:'นภาพร เศรษฐี',    username:'account',       password:'account',       role:'account',       avatar:'นพ', team:'Finance' },
  { id:'u08', name:'สุรชัย คงดี',     username:'warehouse',     password:'warehouse',     role:'warehouse',     avatar:'สช', team:'Warehouse' }
];

// ─── AUTH STATE ───
var AUTH = { loggedIn:false, user:null, role:null };

// ─── BOOTSTRAP: runs once after all scripts load ───
function authBoot() {
  // Show login screen immediately
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('portalWrap').style.display  = 'none';
}

// ─── LOGIN ───
function doLogin() {
  var uname = (document.getElementById('loginUsername').value || '').trim();
  var upass  =  document.getElementById('loginPassword').value || '';
  var errEl  =  document.getElementById('loginError');

  var found = USERS.find(function(u){ return u.username === uname && u.password === upass; });
  if (!found) {
    errEl.textContent = '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
    errEl.style.display = 'block';
    document.getElementById('loginPassword').value = '';
    var card = document.getElementById('loginCard');
    card.style.animation = 'none';
    requestAnimationFrame(function(){ card.style.animation = 'loginShake .4s ease'; });
    return;
  }

  AUTH.loggedIn = true;
  AUTH.user     = found;
  AUTH.role     = ROLES[found.role];

  // Swap screens
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('portalWrap').style.display  = 'flex';

  // Update sidebar user card
  var av = document.getElementById('sidebarUserAvatar');
  if (av) { av.textContent = found.avatar; av.style.background = AUTH.role.color; }
  var un = document.getElementById('sidebarUserName');
  if (un) un.textContent = found.name;
  var ur = document.getElementById('sidebarUserRole');
  if (ur) ur.textContent = AUTH.role.labelTH;
  var ub = document.getElementById('sidebarUserBadge');
  if (ub) { ub.textContent = AUTH.role.badge; ub.style.background = AUTH.role.color; }

  // Apply nav visibility
  applyRoleNav();

  // Navigate to first allowed view
  var first = AUTH.role.views[0] || 'dashboard';
  gotoView(first);
}

// ─── LOGOUT ───
function doLogout() {
  if (!confirm('ต้องการออกจากระบบ?')) return;
  AUTH.loggedIn = false; AUTH.user = null; AUTH.role = null;
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('portalWrap').style.display  = 'none';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').style.display = 'none';
}

// ─── ROLE-BASED NAV ───
function applyRoleNav() {
  if (!AUTH.user) return;
  var allowed = ROLES[AUTH.user.role] ? ROLES[AUTH.user.role].views : [];
  document.querySelectorAll('[data-nav-view]').forEach(function(el) {
    var v = el.getAttribute('data-nav-view');
    el.style.display = allowed.indexOf(v) >= 0 ? '' : 'none';
  });
  // Hide nav groups that have no visible children
  document.querySelectorAll('.nav-grp').forEach(function(grp) {
    var sib = grp.nextElementSibling; var has = false;
    while (sib && !sib.classList.contains('nav-grp')) {
      if (sib.classList.contains('nav-item') && sib.style.display !== 'none') has = true;
      sib = sib.nextElementSibling;
    }
    grp.style.display = has ? '' : 'none';
  });
}

// ─── ROLE MANAGEMENT PAGE ───
var RM = { editingId: null, filterRole: 'all' };

function renderRoleManagement() {
  renderRMStats();
  renderRMUserList();
}

function renderRMStats() {
  var el = document.getElementById('rm-stats-row'); if (!el) return;
  var html = '';
  Object.keys(ROLES).forEach(function(rk) {
    var r   = ROLES[rk];
    var cnt = USERS.filter(function(u){ return u.role === rk; }).length;
    var isActive = RM.filterRole === rk;
    html += '<div class="rm-stat-card" onclick="rmSetFilter(\'' + rk + '\',this)" style="cursor:pointer;border-left:3px solid '+r.color+';'+(isActive?'outline:2px solid '+r.color+';outline-offset:2px':'')+'">'
          + '<div style="font-size:22px">'+r.icon+'</div>'
          + '<div><div style="font-size:20px;font-weight:800;color:var(--text1)">'+cnt+'</div>'
          + '<div style="font-size:10.5px;color:var(--text3)">'+r.label+'</div></div>'
          + '</div>';
  });
  // "ทั้งหมด" card
  var allActive = RM.filterRole === 'all';
  html = '<div class="rm-stat-card" onclick="rmSetFilter(\'all\',this)" style="cursor:pointer;border-left:3px solid var(--pink);'+(allActive?'outline:2px solid var(--pink);outline-offset:2px':'')+'">'
       + '<div style="font-size:22px">👥</div>'
       + '<div><div style="font-size:20px;font-weight:800;color:var(--text1)">'+USERS.length+'</div>'
       + '<div style="font-size:10.5px;color:var(--text3)">ทั้งหมด</div></div>'
       + '</div>' + html;
  el.innerHTML = html;
}

function renderRMUserList() {
  var el = document.getElementById('rm-user-list'); if (!el) return;
  var list = USERS.slice();
  if (RM.filterRole !== 'all') list = list.filter(function(u){ return u.role === RM.filterRole; });
  var q = ((document.getElementById('rm-search') || {}).value || '').toLowerCase().trim();
  if (q) list = list.filter(function(u){ return u.name.toLowerCase().indexOf(q) >= 0 || u.username.toLowerCase().indexOf(q) >= 0; });
  if (!list.length) { el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text3)">🔍 ไม่พบผู้ใช้งาน</div>'; return; }
  var html = '';
  list.forEach(function(u) {
    var r = ROLES[u.role] || { label:u.role, icon:'👤', color:'#888', bg:'#eee', badge:u.role };
    var isSelf    = AUTH.user && AUTH.user.id === u.id;
    var isEditing = RM.editingId === u.id;
    var canEdit   = AUTH.user && (AUTH.user.role === 'root' || (AUTH.user.role !== 'root' && u.role !== 'root'));
    html += '<div class="rm-row' + (isEditing ? ' rm-row-editing' : '') + '">';
    // Left: avatar + name
    html += '<div style="display:flex;align-items:center;gap:12px;flex:1;min-width:0">'
          + '<div class="rm-avatar" style="background:'+r.color+'">'+u.avatar+'</div>'
          + '<div><div style="font-size:13px;font-weight:700;color:var(--text1)">'+u.name+(isSelf?' <span style="font-size:10px;color:var(--pink)">(คุณ)</span>':'')+'</div>'
          + '<div style="font-size:11px;color:var(--text3);font-family:monospace">@'+u.username+' · '+u.team+'</div>'
          + '</div></div>';
    // Right: badge + edit button
    html += '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">'
          + '<span class="rm-role-badge" style="background:'+r.bg+';color:'+r.color+'">'+r.icon+' '+r.label+'</span>';
    if (canEdit) html += '<button class="rm-edit-btn" onclick="openEditUser(\''+u.id+'\')">✏️</button>';
    html += '</div>';
    // Inline edit panel
    if (isEditing) {
      html += '<div class="rm-edit-panel">'
            + '<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:12px">✏️ แก้ไข: <span style="color:var(--pink)">'+u.name+'</span></div>'
            + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'
            + '<div><label style="font-size:11px;font-weight:700;color:var(--text3);display:block;margin-bottom:4px">ชื่อ-นามสกุล</label><input id="rm-edit-name" class="sel" style="width:100%;box-sizing:border-box" value="'+u.name+'"></div>'
            + '<div><label style="font-size:11px;font-weight:700;color:var(--text3);display:block;margin-bottom:4px">ทีม / แผนก</label><input id="rm-edit-team" class="sel" style="width:100%;box-sizing:border-box" value="'+u.team+'"></div>'
            + '</div>'
            + '<div style="margin-bottom:12px"><label style="font-size:11px;font-weight:700;color:var(--text3);display:block;margin-bottom:7px">Role</label><div style="display:flex;flex-wrap:wrap;gap:6px">';
      Object.keys(ROLES).forEach(function(rk) {
        var rd  = ROLES[rk];
        if (rk === 'root' && AUTH.user && AUTH.user.role !== 'root') return;
        var sel = u.role === rk;
        html += '<label style="display:flex;align-items:center;gap:5px;padding:6px 11px;border-radius:7px;border:1.5px solid '+(sel?rd.color:'var(--border)')+';background:'+(sel?rd.bg:'var(--surface2)')+';cursor:pointer;font-size:12px;font-weight:'+(sel?700:500)+'">'
              + '<input type="radio" name="rm-role-'+u.id+'" value="'+rk+'" '+(sel?'checked':'')+' style="accent-color:'+rd.color+'">'
              + rd.icon+' '+rd.label+'</label>';
      });
      html += '</div></div>'
            + '<div style="margin-bottom:12px"><label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:12px;font-weight:600;color:var(--text2)">'
            + '<input type="checkbox" id="rm-reset-chk" onchange="document.getElementById(\'rm-pw-row\').style.display=this.checked?\'grid\':\'none\'" style="accent-color:var(--pink)"> เปลี่ยนรหัสผ่าน</label></div>'
            + '<div id="rm-pw-row" style="display:none;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">'
            + '<div><label style="font-size:11px;font-weight:700;color:var(--text3);display:block;margin-bottom:4px">รหัสผ่านใหม่</label><input id="rm-pw1" type="password" class="sel" style="width:100%;box-sizing:border-box" placeholder="••••••••"></div>'
            + '<div><label style="font-size:11px;font-weight:700;color:var(--text3);display:block;margin-bottom:4px">ยืนยัน</label><input id="rm-pw2" type="password" class="sel" style="width:100%;box-sizing:border-box" placeholder="••••••••"></div>'
            + '</div>'
            + '<div style="display:flex;gap:8px;align-items:center">'
            + '<button class="btn btn-pink btn-sm" onclick="saveEditUser(\''+u.id+'\')">💾 บันทึก</button>'
            + '<button class="btn btn-ghost btn-sm" onclick="closeEditUser()">ยกเลิก</button>';
      if (AUTH.user && AUTH.user.role === 'root' && !isSelf)
        html += '<button class="btn btn-sm" style="margin-left:auto;background:var(--danger);color:#fff;border:none" onclick="confirmDeleteUser(\''+u.id+'\')">🗑 ลบ</button>';
      html += '</div></div>';
    }
    html += '</div>';
  });
  el.innerHTML = html;
}

function rmSetFilter(role, el) {
  RM.filterRole = role;
  renderRMStats();
  renderRMUserList();
}

function openEditUser(uid)  { RM.editingId = uid;  renderRMUserList(); }
function closeEditUser()    { RM.editingId = null;  renderRMUserList(); }

function saveEditUser(uid) {
  var u = USERS.find(function(x){ return x.id === uid; }); if (!u) return;
  var n  = document.getElementById('rm-edit-name');
  var t  = document.getElementById('rm-edit-team');
  var rp = document.querySelector('input[name="rm-role-'+uid+'"]:checked');
  var rc = document.getElementById('rm-reset-chk');
  var p1 = document.getElementById('rm-pw1');
  var p2 = document.getElementById('rm-pw2');
  if (n && n.value.trim()) u.name = n.value.trim();
  if (t && t.value.trim()) u.team = t.value.trim();
  if (rp) u.role = rp.value;
  if (rc && rc.checked) {
    if (!p1 || !p1.value) { showToast('⚠️ กรุณากรอกรหัสผ่านใหม่'); return; }
    if (p1.value !== (p2 ? p2.value : '')) { showToast('⚠️ รหัสผ่านไม่ตรงกัน'); return; }
    u.password = p1.value;
  }
  if (AUTH.user && AUTH.user.id === uid) {
    AUTH.user = u; AUTH.role = ROLES[u.role];
    var un = document.getElementById('sidebarUserName'); if (un) un.textContent = u.name;
    var ur = document.getElementById('sidebarUserRole'); if (ur) ur.textContent = AUTH.role.labelTH;
    var ub = document.getElementById('sidebarUserBadge'); if (ub) { ub.textContent = AUTH.role.badge; ub.style.background = AUTH.role.color; }
    applyRoleNav();
  }
  RM.editingId = null; renderRoleManagement();
  showToast('✅ บันทึกข้อมูลเรียบร้อยแล้ว');
}

function confirmDeleteUser(uid) {
  var u = USERS.find(function(x){ return x.id === uid; });
  if (!u || !confirm('ลบผู้ใช้ "'+u.name+'" ออกจากระบบ?')) return;
  USERS = USERS.filter(function(x){ return x.id !== uid; });
  RM.editingId = null; renderRoleManagement();
  showToast('🗑 ลบผู้ใช้แล้ว');
}

function openAddUserModal()  { document.getElementById('add-user-modal').style.display = 'flex'; }
function closeAddUserModal() {
  document.getElementById('add-user-modal').style.display = 'none';
  ['au-name','au-username','au-team','au-pw','au-pw2'].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=''; });
  var radios = document.querySelectorAll('input[name="au-role-pick"]');
  radios.forEach(function(r){ r.checked = false; });
}
function doAddUser() {
  var name  = (document.getElementById('au-name').value  || '').trim();
  var uname = (document.getElementById('au-username').value || '').trim();
  var team  = (document.getElementById('au-team').value  || '').trim() || 'General';
  var pw    = document.getElementById('au-pw').value  || '';
  var pw2   = document.getElementById('au-pw2').value || '';
  var rp    = document.querySelector('input[name="au-role-pick"]:checked');
  if (!name || !uname || !pw || !rp) { showToast('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน'); return; }
  if (pw !== pw2) { showToast('⚠️ รหัสผ่านไม่ตรงกัน'); return; }
  if (USERS.find(function(u){ return u.username === uname; })) { showToast('⚠️ Username นี้มีในระบบแล้ว'); return; }
  var newU = { id:'u'+String(Date.now()).slice(-6), name:name, username:uname, password:pw,
               role:rp.value, avatar:name.slice(0,2), team:team };
  USERS.push(newU);
  closeAddUserModal(); renderRoleManagement();
  showToast('✅ เพิ่มผู้ใช้ "'+newU.name+'" เรียบร้อยแล้ว');
}

// ─── QUICK-FILL for demo chips on login screen ───
function quickFill(u, p) {
  document.getElementById('loginUsername').value = u;
  document.getElementById('loginPassword').value = p;
  document.getElementById('loginError').style.display = 'none';
}

// ─── AUTO-BOOT ───
// Wait for DOM then init
(function waitReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', authBoot);
  } else {
    authBoot();
  }
})();
