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
  "g_charmiss_brow_high_lifting_l_One Size": {allocated:40, personalQuota:30, poolQuota:90},
  "g_charmiss_brookie_brow_slim_p_01 DARK CHOCOLATE": {allocated:47, personalQuota:50, poolQuota:150},
  "g_charmiss_brookie_brow_slim_p_02 BROWN SUGAR": {allocated:14, personalQuota:40, poolQuota:200},
  "g_charmiss_brookie_brow_slim_p_04 MAPLE SYRUB": {allocated:6, personalQuota:80, poolQuota:240},
  "g_charmiss_stylish_brow_auto_p_01 Dark Brown": {allocated:37, personalQuota:60, poolQuota:180},
  "g_charmiss_stylish_brow_auto_p_02 Natural Brown": {allocated:1, personalQuota:30, poolQuota:90},
  "g_charmiss_glowfriend_natural__01 BEST FRIEND": {allocated:14, personalQuota:80, poolQuota:400},
  "g_charmiss_glowfriend_natural__02 SUGAR AND BOO": {allocated:1, personalQuota:80, poolQuota:240},
  "g_charmiss_glowfriend_natural__03 Spoil Me": {allocated:45, personalQuota:80, poolQuota:320},
  "g_charmiss_glowfriend_natural__04 Crush Blush": {allocated:14, personalQuota:60, poolQuota:300},
  "g_charmiss_show_me_your_love_g_GL01 Crush On You": {allocated:17, personalQuota:30, poolQuota:90},
  "g_charmiss_show_me_your_love_g_GL02 Be My Baby": {allocated:44, personalQuota:60, poolQuota:240},
  "g_charmiss_show_me_your_love_g_GL03 Make You Mine": {allocated:17, personalQuota:40, poolQuota:120},
  "g_charmiss_show_me_your_love_g_GL01 Crush On You (7-11)": {allocated:48, personalQuota:50, poolQuota:150},
  "g_charmiss_show_me_your_charm__01 Crazy On Me": {allocated:5, personalQuota:60, poolQuota:180},
  "g_charmiss_show_me_your_charm__02 Adore Me": {allocated:22, personalQuota:50, poolQuota:250},
  "g_charmiss_show_me_your_charm__03 Play With Me": {allocated:16, personalQuota:30, poolQuota:150},
  "g_charmiss_show_me_your_charm__04 Dance With Me": {allocated:29, personalQuota:80, poolQuota:240},
  "g_charmiss_show_me_your_charm__01 Chic Rouge": {allocated:24, personalQuota:30, poolQuota:150},
  "g_charmiss_show_me_your_charm__02 Naughty Pink": {allocated:18, personalQuota:80, poolQuota:320},
  "g_charmiss_show_me_your_charm__03 Jolly Tangerine": {allocated:36, personalQuota:40, poolQuota:200},
  "g_charmiss_glowlogram_eyeshado_01 Sweet Moments": {allocated:4, personalQuota:30, poolQuota:150},
  "g_charmiss_glowlogram_eyeshado_02 Peach Energy": {allocated:14, personalQuota:50, poolQuota:150},
  "g_charmiss_glowlogram_eyeshado_03 Warm On A Cold Night": {allocated:14, personalQuota:30, poolQuota:120},
  "g_charmiss_glowlogram_eyeshado_04 Shiny Apricot (แพคเกจ7-11)": {allocated:17, personalQuota:60, poolQuota:300},
  "g_charmiss_airy_glow_everyday__01 Ivory (เก่า)": {allocated:23, personalQuota:40, poolQuota:160},
  "g_charmiss_airy_glow_everyday__02 Natural Beige (เก่า)": {allocated:22, personalQuota:40, poolQuota:200},
  "g_charmiss_airy_glow_everyday__03 Honey Beige (เก่า)": {allocated:17, personalQuota:30, poolQuota:150},
  "g_charmiss_good_mood_extra_shi_01 Pink Lemonade": {allocated:40, personalQuota:40, poolQuota:200},
  "g_charmiss_good_mood_extra_shi_02 Orange Marmalade": {allocated:46, personalQuota:40, poolQuota:120},
  "g_charmiss_good_mood_extra_shi_03 Cherry Margarita": {allocated:29, personalQuota:60, poolQuota:240},
  "g_charmiss_good_mood_extra_shi_04 Chocolate Milk Tea": {allocated:40, personalQuota:80, poolQuota:240},
  "g_charmiss_show_me_your_love_j_01 ROSY DROP": {allocated:43, personalQuota:50, poolQuota:150},
  "g_charmiss_show_me_your_love_j_02 BRIGHT & GLOW DROP": {allocated:14, personalQuota:30, poolQuota:120},
  "g_charmiss_show_me_your_love_j_03 AQUA DROP": {allocated:25, personalQuota:50, poolQuota:150},
  "g_charmiss_show_me_your_love_j_03 AQUA DROP (7-11)": {allocated:13, personalQuota:80, poolQuota:400},
  "g_charmiss_charming_glow_airy__01 Ivory": {allocated:20, personalQuota:40, poolQuota:200},
  "g_charmiss_charming_glow_airy__02 Natural Beige": {allocated:31, personalQuota:60, poolQuota:300},
  "g_charmiss_charming_glow_airy__03 Honey Beige": {allocated:29, personalQuota:40, poolQuota:160},
  "g_charmiss_charming_glow_airy__01 Ivory (Refill)": {allocated:8, personalQuota:40, poolQuota:200},
  "g_charmiss_charming_glow_longw_01 Ivory": {allocated:35, personalQuota:80, poolQuota:320},
  "g_charmiss_charming_glow_longw_02 Light Beige": {allocated:47, personalQuota:80, poolQuota:320},
  "g_charmiss_charming_glow_longw_03 Medium Beige": {allocated:37, personalQuota:60, poolQuota:240},
  "g_charmiss_charming_glow_longw_04 Honey Beige": {allocated:14, personalQuota:40, poolQuota:200},
  "g_charmiss_charming_glow_setti_One Size": {allocated:31, personalQuota:30, poolQuota:90},
  "g_charmiss_charming_glow_powde_One Size": {allocated:7, personalQuota:40, poolQuota:200},
  "g_charmiss_juicy_glowy_tint_01 Cherry On Top": {allocated:10, personalQuota:60, poolQuota:300},
  "g_charmiss_juicy_glowy_tint_02 Cranberry Syrup": {allocated:4, personalQuota:60, poolQuota:240},
  "g_charmiss_juicy_glowy_tint_03 Sweet Jelly": {allocated:38, personalQuota:60, poolQuota:300},
  "g_charmiss_juicy_glowy_tint_04 Pink Pomelo": {allocated:16, personalQuota:80, poolQuota:240},
  "g_charmiss_the_milky_way_marbl_01 LUNAR ECLIPSE": {allocated:43, personalQuota:30, poolQuota:150},
  "g_charmiss_the_milky_way_marbl_02 JUPITER": {allocated:34, personalQuota:50, poolQuota:250},
  "g_charmiss_the_milky_way_marbl_03 SHOOTING STAR": {allocated:21, personalQuota:30, poolQuota:120},
  "g_charmiss_the_universe_plumpi_One Size": {allocated:27, personalQuota:40, poolQuota:160},
  "g_charmiss_the_milky_way_marbl_01 MORNING STAR": {allocated:0, personalQuota:50, poolQuota:250},
  "g_charmiss_the_milky_way_marbl_02 STRAWBERRY MOON": {allocated:48, personalQuota:40, poolQuota:200},
  "g_charmiss_the_milky_way_marbl_03 NEBULA": {allocated:6, personalQuota:50, poolQuota:250},
  "g_charmiss_the_milky_way_marbl_04 SUPERNOVA": {allocated:32, personalQuota:80, poolQuota:240},
  "g_charmiss_endless_kiss_liquid_01 Puppy Love": {allocated:9, personalQuota:50, poolQuota:150},
  "g_charmiss_endless_kiss_liquid_02 Romantic love": {allocated:34, personalQuota:80, poolQuota:240},
  "g_charmiss_endless_kiss_liquid_03 True Love": {allocated:38, personalQuota:50, poolQuota:200},
  "g_endless_kiss_liquid_matte_04 Cherry Rush": {allocated:1, personalQuota:30, poolQuota:120},
  "g_endless_kiss_liquid_matte_05 Burnt Sugar": {allocated:19, personalQuota:40, poolQuota:120},
  "g_endless_kiss_liquid_matte_06 Velvet Rosewood": {allocated:15, personalQuota:80, poolQuota:240},
  "g_charmiss_stylish_matte_eyeli_One Size": {allocated:5, personalQuota:60, poolQuota:180},
  "g_charmiss_crystal_cube_ph_cha_One Size": {allocated:48, personalQuota:80, poolQuota:240},
  "g_charmiss_crystal_cube_ph_cha_One Size": {allocated:8, personalQuota:60, poolQuota:300},
  "g_charmiss_uv_extra_shine_crys_One Size": {allocated:10, personalQuota:50, poolQuota:250},
  "g_charmiss_uv_extra_shine_crys_One Size": {allocated:38, personalQuota:60, poolQuota:180},
  "g_charmiss_uv_extra_shine_crys_One Size": {allocated:34, personalQuota:40, poolQuota:200},
  "g_charmiss_mellow_shining_balm_01 GIRL BOSS": {allocated:19, personalQuota:60, poolQuota:300},
  "g_charmiss_mellow_shining_balm_02 NEW GEN": {allocated:41, personalQuota:50, poolQuota:200},
  "g_charmiss_mellow_shining_balm_03 INTERN": {allocated:33, personalQuota:60, poolQuota:180},
  "g_charmiss_mellow_shining_balm_04 INSPIRING": {allocated:15, personalQuota:40, poolQuota:120},
  "g_charmiss_matte_all_day_acne__01 IVORY": {allocated:21, personalQuota:30, poolQuota:150},
  "g_charmiss_matte_all_day_acne__02 NATURAL BEIGE": {allocated:35, personalQuota:40, poolQuota:200},
  "g_charmiss_matte_all_day_acne__03 HONEY BEIGE": {allocated:14, personalQuota:30, poolQuota:90},
  "g_charmiss_matte_all_day_acne__01 Ivory 5g": {allocated:45, personalQuota:30, poolQuota:90},
  "g_charmiss_show_me_your_love_i_GL04 CRYSTAL HEART": {allocated:4, personalQuota:30, poolQuota:120},
  "g_charmiss_show_me_your_love_i_GL05 FAIRY DUST": {allocated:4, personalQuota:80, poolQuota:240},
  "g_charmiss_show_me_your_love_i_GL06 STARRY SKY": {allocated:17, personalQuota:60, poolQuota:180},
  "g_charmiss_show_me_your_love_i_GL07 PINKY TWINKLE": {allocated:34, personalQuota:40, poolQuota:200},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:36, personalQuota:80, poolQuota:320},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:15, personalQuota:60, poolQuota:240},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:12, personalQuota:30, poolQuota:90},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:42, personalQuota:60, poolQuota:240},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:27, personalQuota:60, poolQuota:240},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:46, personalQuota:30, poolQuota:150},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:41, personalQuota:30, poolQuota:90},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:25, personalQuota:50, poolQuota:150},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:15, personalQuota:40, poolQuota:120},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:34, personalQuota:60, poolQuota:180},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:27, personalQuota:40, poolQuota:160},
  "g_charmiss_glowfriend_mochi_bl_One Size": {allocated:29, personalQuota:40, poolQuota:120},
  "g_charmiss_jelly_joy_01 Soda Pop สีชมพู Cool Tone": {allocated:28, personalQuota:80, poolQuota:240},
  "g_charmiss_jelly_joy_02 Sugar On Me #ไฮไลท์เนื้อเจลลี่": {allocated:3, personalQuota:80, poolQuota:240},
  "g_charmiss_jelly_joy_03 Chewy Cherry สีแดงเชอร์รี่": {allocated:5, personalQuota:40, poolQuota:120},
  "g_charmiss_jelly_joy_04 Eve & Joy สีชมพูช็อกกี้พิงค์": {allocated:26, personalQuota:60, poolQuota:240},
  "g_charmiss_you_make_me_blush_l_01 FIRST DATE": {allocated:13, personalQuota:60, poolQuota:180},
  "g_charmiss_you_make_me_blush_l_02 FANCY YOU": {allocated:10, personalQuota:60, poolQuota:180},
  "g_charmiss_you_make_me_blush_l_03 FALL YOU": {allocated:24, personalQuota:50, poolQuota:200},
  "g_charmiss_you_make_me_blush_l_04 FAITH LOVE": {allocated:18, personalQuota:60, poolQuota:300},
  "g_charmiss_everything_nice_gli_01 Ice Sore": {allocated:46, personalQuota:80, poolQuota:400},
  "g_charmiss_everything_nice_gli_02 Best Friends": {allocated:45, personalQuota:60, poolQuota:180},
  "g_charmiss_everything_nice_gli_03 Sweet 'N Sour": {allocated:12, personalQuota:50, poolQuota:150},
  "g_charmiss_everything_nice_gli_01 Ice Sore (GRADE B)": {allocated:3, personalQuota:80, poolQuota:400},
  "g_charmiss_everything_nice_air_01 Vanquish Evil": {allocated:34, personalQuota:30, poolQuota:150},
  "g_charmiss_everything_nice_air_02 Saving The Day": {allocated:20, personalQuota:30, poolQuota:90},
  "g_charmiss_everything_nice_air_03 Girl Power": {allocated:37, personalQuota:60, poolQuota:300},
  "g_charmiss_everything_nice_mat_01 Ivory": {allocated:33, personalQuota:40, poolQuota:120},
  "g_charmiss_everything_nice_mat_02 Natural Beige": {allocated:32, personalQuota:30, poolQuota:90},
  "g_charmiss_everything_nice_mat_03 Honey Beige": {allocated:4, personalQuota:80, poolQuota:240},
  "g_charmiss_everything_nice_moc_01 Sugar": {allocated:43, personalQuota:40, poolQuota:160},
  "g_charmiss_everything_nice_moc_02 Spice": {allocated:7, personalQuota:80, poolQuota:240},
  "g_charmiss_everything_nice_moc_03 Everything Nice": {allocated:37, personalQuota:80, poolQuota:240},
  "g_charmiss_everything_nice_eye_01 Girls Gone Mild": {allocated:39, personalQuota:30, poolQuota:120},
  "g_charmiss_everything_nice_eye_02 Dream Scheme": {allocated:42, personalQuota:80, poolQuota:400},
  "g_charmiss_everything_nice_eye_03 Just Desserts": {allocated:33, personalQuota:50, poolQuota:200},
  "g_charmiss_perfect_heart_everl_00 FAIR": {allocated:13, personalQuota:50, poolQuota:150},
  "g_charmiss_perfect_heart_everl_01 Ivory": {allocated:16, personalQuota:60, poolQuota:180},
  "g_charmiss_perfect_heart_everl_02 Natural Beige": {allocated:42, personalQuota:50, poolQuota:200},
  "g_charmiss_perfect_heart_everl_03 Honey Beige": {allocated:20, personalQuota:30, poolQuota:90},
  "g_charmiss_jewel_jelly_crystal_01 PINK DIAMOND": {allocated:29, personalQuota:80, poolQuota:400},
  "g_charmiss_jewel_jelly_crystal_02 SILVER MOON": {allocated:6, personalQuota:30, poolQuota:150},
  "g_charmiss_jewel_jelly_crystal_03 GOLD CRUSH": {allocated:13, personalQuota:80, poolQuota:320},
  "g_charmiss_juicy_pop_tint_01 Pink Lady": {allocated:8, personalQuota:50, poolQuota:150},
  "g_charmiss_juicy_pop_tint_02 Milky Raspberry": {allocated:15, personalQuota:50, poolQuota:200},
  "g_charmiss_juicy_pop_tint_03 Dragon Bloom": {allocated:10, personalQuota:60, poolQuota:300},
  "g_charmiss_juicy_pop_tint_04 Grape Bliss": {allocated:45, personalQuota:50, poolQuota:250},
  "g_charm_on_glassy_stick_01 PINK ME UP": {allocated:41, personalQuota:80, poolQuota:240},
  "g_charm_on_glassy_stick_03 DEWY POMELO": {allocated:42, personalQuota:80, poolQuota:320},
  "g_charm_on_glassy_stick_04 SUGAR LILAC": {allocated:42, personalQuota:30, poolQuota:90},
  "g_charmiss_charm_on_glassy_sti_02 MOONBERRY": {allocated:16, personalQuota:30, poolQuota:90},
  "g_charm_on_matte_stick_05 MWAH PINK": {allocated:47, personalQuota:80, poolQuota:240},
  "g_charm_on_matte_stick_06 CHARMING ROSETTE": {allocated:17, personalQuota:50, poolQuota:250},
  "g_charm_on_matte_stick_07 FOG MOCHA": {allocated:13, personalQuota:50, poolQuota:150},
  "g_charm_on_matte_stick_08 TOASTY TEDDY": {allocated:43, personalQuota:50, poolQuota:250},
  "g_charmiss_hyacherry_oil_contr_One Size": {allocated:31, personalQuota:50, poolQuota:150},
  "g_charmiss_everything_nice_moc_01 SUGAR (GRADE B)": {allocated:5, personalQuota:60, poolQuota:240},
  "g_charmiss_everything_nice_moc_02 SPICE (GRADE B)": {allocated:2, personalQuota:30, poolQuota:120},
  "g_charmiss_everything_nice_moc_03 EVERYTHING NICE (GRADE B)": {allocated:49, personalQuota:40, poolQuota:200},
  "g_charmiss_blooming_heart_soft_01 IVORY": {allocated:16, personalQuota:40, poolQuota:200},
  "g_charmiss_blooming_heart_soft_02 NATURAL BEIGE": {allocated:28, personalQuota:80, poolQuota:400},
  "g_charmiss_blooming_heart_glit_01 ROSIE": {allocated:27, personalQuota:80, poolQuota:240},
  "g_charmiss_blooming_heart_glit_02 LILAC": {allocated:7, personalQuota:30, poolQuota:150},
  "g_charmiss_blooming_heart_tint_01 Cherry Blossom": {allocated:9, personalQuota:80, poolQuota:240},
  "g_charmiss_blooming_heart_tint_02 Peach Bunny": {allocated:23, personalQuota:80, poolQuota:400},
  "g_charmiss_blooming_heart_tint_03 Plum Pixie": {allocated:9, personalQuota:60, poolQuota:180},
  "g_charmiss_blooming_heart_tint_04 Bad Babe Berry": {allocated:2, personalQuota:50, poolQuota:200},
  "g_charmiss_blooming_heart_shin_One Size": {allocated:50, personalQuota:30, poolQuota:120},
  "g_charmiss_blooming_heart_shin_One Size": {allocated:13, personalQuota:40, poolQuota:200},
  "g_charmiss_blooming_heart_loos_01 Pink Petal": {allocated:6, personalQuota:50, poolQuota:250},
  "g_charmiss_blooming_heart_loos_02 Lilac Lock": {allocated:26, personalQuota:80, poolQuota:400},
  "g_charmiss_blooming_heart_char_01 COTTON CANDY": {allocated:9, personalQuota:40, poolQuota:120},
  "g_charmiss_blooming_heart_char_02 MIDNIGHT MOCHA": {allocated:11, personalQuota:60, poolQuota:180},
  "g_charmiss_acne_balance_toner__One Size": {allocated:11, personalQuota:50, poolQuota:200},
  "g_charmiss_acne_balance_cleans_One Size": {allocated:42, personalQuota:40, poolQuota:160},
  "g_charmiss_perfect_heart_matte_One Size": {allocated:10, personalQuota:30, poolQuota:120},
  "g_charmiss_my_melody_box_set_One Size": {allocated:2, personalQuota:60, poolQuota:180},
  "g_charmiss_kuromi_box_set_One Size": {allocated:12, personalQuota:60, poolQuota:240},
  "g_charmiss_snow_collection_tin_01 COZY PINK": {allocated:19, personalQuota:40, poolQuota:120},
  "g_charmiss_snow_collection_tin_02 CRYSTAL FLAKE": {allocated:1, personalQuota:40, poolQuota:160},
  "g_charmiss_airy_kiss_tint_matt_01 ROSE MERINGUE": {allocated:21, personalQuota:50, poolQuota:150},
  "g_charmiss_airy_kiss_tint_matt_02 CHERRY ON TOP": {allocated:49, personalQuota:50, poolQuota:200},
  "g_charmiss_airy_kiss_tint_matt_03 TANGERINE CRUSH": {allocated:41, personalQuota:80, poolQuota:320},
  "g_charmiss_airy_kiss_tint_matt_04 STRAWBERRY KISS": {allocated:43, personalQuota:80, poolQuota:320},
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
  var btn=document.getElementById('loadStockBtn');
  if(btn){btn.innerHTML='⏳ กำลังโหลด...';btn.disabled=true;}
  await new Promise(function(r){setTimeout(r,800);});
  STOCK_DATA={};
  Object.keys(MOCK_STOCK).forEach(function(k){STOCK_DATA[k]=MOCK_STOCK[k];});
  STOCK_LOADED=true;
  STOCK_LOADING=false;
  if(btn){btn.innerHTML='🔄 Reload Stock';btn.disabled=false;}
  renderPgrid();
  showToast('✅ โหลด Allocated Stock สำเร็จ (Mock Data) — '+new Date().toLocaleTimeString('th-TH'));
}

// ═══ STATE ═══
// Debounce helper — prevents rapid re-renders
function _debounce(fn, ms){
  var t; return function(){ clearTimeout(t); t=setTimeout(fn, ms); };
}
var renderPgridDebounced;  // assigned after renderPgrid is defined

let S = {
  cat:'ทั้งหมด', cart:[], orders:[], selCust:null,
  dateFilter:'all', statusFilter:'all', soFilter:'no_so',
  varPid:null, varModes:{}, varSelections:{},
  varSpecialPrice:{}, varSpecialReason:{},
  varSkuNotes:{},         // หมายเหตุต่อ SKU
  varFreeItems:{},        // ของแถม/Tester per SKU: {varLabel: [{type:'tester'|'free',qty:N}]}
  billDiscount2pct:false, // ส่วนลดท้ายบิล 2%
  orderAttachments:[],    // ไฟล์แนบ Order
  lastOrderRef:null,
};

// ═══ MOCK DATA ═══
S.orders = [
  {
    ref:'ORD-260301-001', status:'confirmed', soNumber:'SO260300201',
    custId:'768', custName:'ชมพู่คอสเมติกส์', sales:'ฝนเทพ',
    items:[
      {pid:'g_blush',name:'Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'04 Crush Blush',trCode:'16040',barcode:'8857127482248',qty:6,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60},
      {pid:'g_blush',name:'Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'05 Rosy Cheeks',trCode:'16050',barcode:'8857127482255',qty:4,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60},
      {pid:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'02 Adore Me',trCode:'33140',barcode:'8857127482316',qty:12,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67},
    ],
    total: 6*60+4*60+12*67, note:'ส่งด่วน กรุณาแพ็คแยกสี',
    timestamp: new Date(Date.now()-2*60*60*1000).toISOString(),
  },
  {
    ref:'ORD-260310-002', status:'confirmed', soNumber:'SO260300202',
    custId:'1887', custName:'ไอซี่ บิวตี้ สำนักงานใหญ่', sales:'ฝนเทพ',
    items:[
      {pid:'g_eyepalette',name:'Glowlogram Eyeshadow Palette',emoji:'🎨',cat:'Eye',variant:'01 Sweet Moments',trCode:'22010',barcode:'8857127482569',qty:4,mode:'dealer',dp:80,wp:90,p50:null,p6:null,unitPrice:80},
      {pid:'g_mochiblush',name:'Glowfriend Mochi Blush On',emoji:'🍡',cat:'Cheek',variant:'03 Peach Puff',trCode:'16220',barcode:'8857128879689',qty:6,mode:'dealer',dp:110,wp:120,p50:null,p6:null,unitPrice:110},
      {pid:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'04 Berry Kiss',trCode:'33160',barcode:'8857127482330',qty:3,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67},
    ],
    total: 4*80+6*110+3*67, note:'',
    timestamp: new Date(Date.now()-2*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260308-003', status:'confirmed', soNumber:'SO260300203',
    custId:'1974', custName:'ดาวบิวตี้ สำนักงานใหญ่', sales:'ฝนเทพ',
    items:[
      {pid:'g_blush',name:'Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'01 Coral Kiss',trCode:'16010',barcode:'8857127482224',qty:12,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67},
      {pid:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'01 Rose Quartz',trCode:'33130',barcode:'8857127482309',qty:6,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67},
      {pid:'g_liptint',name:'Glowfriend Water Lip Tint',emoji:'🌷',cat:'Lip',variant:'02 Blood Orange',trCode:'31220',barcode:'8857127482392',qty:8,mode:'wholesale',dp:55,wp:62,p50:null,p6:null,unitPrice:62},
    ],
    total: 12*67+6*67+8*62, note:'ลูกค้าต้องการของก่อนวันที่ 15 มี.ค.',
    timestamp: new Date(Date.now()-4*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260307-004', status:'confirmed', soNumber:'SO260300204',
    custId:'73', custName:'ไฮโซ คอสเมติก สำนักงานใหญ่', sales:'สิริกาญจน์',
    items:[
      {pid:'g_mochiblush',name:'Glowfriend Mochi Blush On',emoji:'🍡',cat:'Cheek',variant:'01 Milk Strawberry',trCode:'16210',barcode:'8857128879665',qty:10,mode:'wholesale',dp:110,wp:120,p50:null,p6:null,unitPrice:120},
      {pid:'g_eyepalette',name:'Glowlogram Eyeshadow Palette',emoji:'🎨',cat:'Eye',variant:'02 Golden Hour',trCode:'22020',barcode:'8857127482576',qty:5,mode:'wholesale',dp:80,wp:90,p50:null,p6:null,unitPrice:90},
    ],
    total: 10*120+5*90, note:'',
    timestamp: new Date(Date.now()-5*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260305-005', status:'confirmed', soNumber:'SO260300205',
    custId:'330', custName:'เซคคั่นฟลอร์', sales:'อัมพร',
    items:[
      {pid:'g_blush',name:'Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'03 Dusty Rose',trCode:'16030',barcode:'8857127482231',qty:8,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60},
      {pid:'g_liptint',name:'Glowfriend Water Lip Tint',emoji:'🌷',cat:'Lip',variant:'01 Cherry Pop',trCode:'31210',barcode:'8857127482385',qty:6,mode:'dealer',dp:55,wp:62,p50:null,p6:null,unitPrice:55},
      {pid:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'03 Plum Party',trCode:'33150',barcode:'8857127482323',qty:4,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60},
    ],
    total: 8*60+6*55+4*60, note:'เก็บเงินปลายทาง',
    timestamp: new Date(Date.now()-7*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260303-006', status:'confirmed', soNumber:'SO260300206',
    custId:'1349', custName:'น.ส.พลอยรุ้ง เลิศทวีพรกุล', sales:'สิริกาญจน์',
    items:[
      {pid:'g_airykiss',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'05 Candy Coral',trCode:'33170',barcode:'8857127482347',qty:24,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67},
      {pid:'g_mochiblush',name:'Glowfriend Mochi Blush On',emoji:'🍡',cat:'Cheek',variant:'02 Berry Mousse',trCode:'16215',barcode:'8857128879672',qty:12,mode:'wholesale',dp:110,wp:120,p50:null,p6:null,unitPrice:120},
    ],
    total: 24*67+12*120, note:'ลูกค้าหัวหน้า ดูแลเป็นพิเศษ',
    timestamp: new Date(Date.now()-9*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260228-007', status:'confirmed', soNumber:'SO260300207',
    custId:'1981', custName:'SOKKHENG HOK', sales:'ฝนเทพ',
    items:[
      {pid:'g_blush',name:'Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'02 Sweet Pink',trCode:'16020',barcode:'8857127482217',qty:6,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60},
      {pid:'g_liptint',name:'Glowfriend Water Lip Tint',emoji:'🌷',cat:'Lip',variant:'03 Peach Sorbet',trCode:'31230',barcode:'8857127482408',qty:6,mode:'dealer',dp:55,wp:62,p50:null,p6:null,unitPrice:55},
    ],
    total: 6*60+6*55, note:'ส่ง EMS',
    timestamp: new Date(Date.now()-12*24*3600000).toISOString(),
  },
  {
    ref:'ORD-260226-008', status:'approved', soNumber:'SO260300208',
    soRef:'SO260300208', stRef:'ST260300082',
    custId:'687', custName:'เอ็นเอ็น บิวตี้', sales:'สิริกาญจน์',
    items:[
      {pid:'g_charmiss_glowfriend_natural_',name:'Charmiss Glowfriend Natural Blush On',emoji:'🌸',cat:'Cheek',variant:'03 Spoil Me',trCode:'16030',barcode:'8857127482231',qty:12,mode:'wholesale',dp:60,wp:67,p50:null,p6:null,unitPrice:67,specialReason:'',isMismatch:false,skuNote:'',freeItems:[{type:'free',qty:2}]},
      {pid:'g_charmiss_show_me_your_charm_',name:'Show Me Your Charm Airy Kiss Tint',emoji:'💋',cat:'Lip',variant:'01 Crazy On Me',trCode:'33110',barcode:'8857127482293',qty:6,mode:'dealer',dp:60,wp:67,p50:null,p6:null,unitPrice:60,specialReason:'ลูกค้า VIP',isMismatch:true,skuNote:'ลูกค้า VIP พิเศษ',freeItems:[]},
    ],
    total:12*67+6*60, note:'ส่งก่อนสิ้นเดือน',
    timestamp: new Date(Date.now()-14*24*3600000).toISOString(),
  },
  {
    ref:'DFT-260312-001', status:'draft',
    custId:'3063', custName:'OR NAI SEA', sales:'ฝนเทพ',
    items:[
      {pid:'g_eyepalette',name:'Glowlogram Eyeshadow Palette',emoji:'🎨',cat:'Eye',variant:'01 Sweet Moments',trCode:'22010',barcode:'8857127482569',qty:2,mode:'dealer',dp:80,wp:90,p50:null,p6:null,unitPrice:80},
    ],
    total: 2*80, note:'รอยืนยันจำนวน',
    timestamp: new Date(Date.now()-30*60*1000).toISOString(),
  },
];

// ═══ INIT ═══
(function(){
  buildCats(); renderPgrid(); renderCusts(); renderCustInfo();
  renderPgridDebounced = _debounce(renderPgrid, 120);
  // Default: show orders without SO
  S.soFilter='no_so';
  var pCountEl = document.getElementById('pCount');
  if(pCountEl) pCountEl.textContent = PRODUCTS.length + ' รายการ';
  orderUpdateBadge();
  renderOrds();
})();

function orderUpdateBadge(){
  document.getElementById('tBadge').textContent = S.orders.length;
}

// ═══ CUSTOMERS ═══
function renderCusts(){
  var q=document.getElementById('cSearch').value.toLowerCase().trim();
  document.getElementById('cClr').classList.toggle('show',q.length>0);
  var list=CUSTOMERS.filter(function(c){
    return !q||c.name.toLowerCase().includes(q)||(c.id+'').includes(q)||(c.sales||'').toLowerCase().includes(q);
  });
  var tbody=document.getElementById('custListBody');
  var shopTypeColor=function(t){
    if(!t) return 'background:#f3f4f6;color:#6b7280;';
    if(t.includes('Wholesale')) return 'background:#dbeafe;color:#1d4ed8;';
    return 'background:#fce7f3;color:#be185d;';
  };
  var priceColor=function(p){
    if(p==='Dealer') return 'background:var(--pink-ll);color:#9d174d;';
    if(p==='Wholesale') return 'background:#d1fae5;color:#065f46;';
    if(p==='Export') return 'background:#e0e7ff;color:#3730a3;';
    if(p==='Clearance') return 'background:#fef3c7;color:#92400e;';
    return 'background:#f3f4f6;color:#374151;';
  };
  var creditColor=function(cr){
    if(!cr) return 'color:var(--text3)';
    if(cr.includes('2%')) return 'color:#b45309;font-weight:700;';
    if(cr.includes('30')) return 'color:#7c3aed;';
    if(cr.includes('โอนก่อน')) return 'color:#dc2626;font-weight:700;';
    return 'color:var(--text2);';
  };
  // Use data-custid attribute — NO onclick string interpolation
  var rows=list.map(function(c){
    var sel=S.selCust&&S.selCust.id===c.id;
    var stLabel=(c.shopType||'').replace('Wholesale - ','WS-').replace('Retail - ','RT-')||'—';
    return '<tr data-custid="'+c.id+'" class="cust-row'+(sel?' selected':'')+'" style="cursor:pointer;">'
      +'<td class="ct-id">'+c.id+'</td>'
      +'<td class="ct-name" style="font-weight:'+(sel?'700':'500')+';">'+c.name+'</td>'
      +'<td style="font-size:9px;padding:4px 6px;"><span style="display:inline-block;padding:2px 6px;border-radius:6px;font-weight:700;white-space:nowrap;'+shopTypeColor(c.shopType)+'">'+stLabel+'</span></td>'
      +'<td style="font-size:9px;padding:4px 6px;"><span style="display:inline-block;padding:2px 6px;border-radius:6px;font-weight:700;white-space:nowrap;'+priceColor(c.priceType)+'">'+( c.priceType||'—')+'</span></td>'
      +'<td style="font-size:9px;padding:4px 6px;white-space:nowrap;'+creditColor(c.creditTerm)+'">'+( c.creditTerm||'—')+'</td>'
      +'</tr>';
  }).join('');
  var addRow='<tr data-custid="__other__" class="cust-row" style="cursor:pointer;background:var(--pink-ll);">'
    +'<td style="color:var(--pink);font-weight:800;padding:6px 8px;">+</td>'
    +'<td style="color:var(--pink);font-weight:700;font-size:12px;" colspan="4">+ เพิ่มร้านค้าที่ไม่มีในรายการ</td>'
    +'</tr>';
  tbody.innerHTML = rows
    ? rows+addRow
    : '<tr><td colspan="5" style="padding:14px;text-align:center;color:var(--text3);font-size:13px;">ไม่พบลูกค้า</td></tr>'+addRow;
  renderCustInfo();
  // Attach click handlers via event delegation on tbody (avoids all quote issues)
  tbody.onclick=function(e){
    var tr=e.target.closest('tr[data-custid]');
    if(!tr) return;
    var cid=tr.getAttribute('data-custid');
    if(cid==='__other__'){selectCustomOther();}
    else{selectCust(cid);}
  };
}

function renderCustInfo(){
  var el=document.getElementById('custInfo');
  if(!el) return;
  if(!S.selCust){el.style.display='none';return;}
  var c=S.selCust;
  var creditHtml='';
  if(c.creditTerm){
    var ctColor=c.creditTerm.includes('2%')?'color:#b45309;font-weight:700;':c.creditTerm.includes('โอนก่อน')?'color:#dc2626;':'color:var(--text2);';
    creditHtml='<span style="font-size:10px;'+ctColor+'">💳 '+c.creditTerm+'</span>';
  }
  var priceColor2=function(p){
    if(p==='Dealer') return 'background:var(--pink-ll);color:#9d174d;';
    if(p==='Wholesale') return 'background:#d1fae5;color:#065f46;';
    return 'background:#f3f4f6;color:#374151;';
  };
  el.style.display='block';
  el.innerHTML='<div style="background:var(--surface);border:1.5px solid var(--pink);border-radius:10px;padding:10px 12px;margin-top:6px;">'
    +'<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">'
    +'<span style="font-size:12px;font-weight:800;color:var(--text);">✅ '+c.name+'</span>'
    +'<span style="font-size:9px;padding:2px 7px;border-radius:6px;font-weight:700;'+priceColor2(c.priceType||c.type||'')+'">'+( c.priceType||c.type||'—')+'</span>'
    +creditHtml
    +'</div>'
    +'<div style="display:flex;gap:12px;margin-top:4px;flex-wrap:wrap;">'
    +'<span style="font-size:11px;color:var(--text2);">🏪 '+(c.shopType||'—')+'</span>'
    +'<span style="font-size:11px;color:var(--text2);">👤 '+(c.sales||CURRENT_SALES)+'</span>'
    +'<span style="font-size:11px;color:var(--text3);">ID: '+c.id+'</span>'
    +'</div>'
    +'</div>';
}
function toggleBillDiscount(){
  S.billDiscount2pct=!S.billDiscount2pct;
  renderCustInfo();
  renderCart();
  updateDisc2pctBar();
}
function updateDisc2pctBar(){
  var bar=document.getElementById('disc2pctBar');
  var btn=document.getElementById('disc2pctBtn');
  var lbl=document.getElementById('disc2pctLabel');
  if(!bar) return;
  var c=S.selCust;
  if(c&&c.creditTerm&&c.creditTerm.includes('2%')){
    bar.style.display='flex'; bar.style.alignItems='center'; bar.style.justifyContent='space-between';
    if(lbl) lbl.textContent='💳 '+c.creditTerm;
    if(btn){
      btn.textContent=S.billDiscount2pct?'✓ ส่วนลด 2% เปิดอยู่':'กด ส่วนลด 2%';
      btn.style.background=S.billDiscount2pct?'#f59e0b':'#fff';
      btn.style.color=S.billDiscount2pct?'#fff':'#92400e';
    }
  } else {
    bar.style.display='none';
  }
}
function selectCust(id){
  S.selCust=CUSTOMERS.find(function(c){return c.id===id;});
  S.billDiscount2pct=false;
  renderCusts();
  updateDisc2pctBar();
}
function selectCustomOther(){
  var name=prompt('ชื่อร้านค้า / ลูกค้าใหม่:','');
  if(!name||!name.trim()) return;
  var typeOpt=confirm('ประเภทราคา:\n[OK] = Dealer\n[ยกเลิก] = Wholesale');
  var priceType=typeOpt?'Dealer':'Wholesale';
  S.selCust={id:'OTH-'+Date.now(),name:name.trim(),priceType:priceType,shopType:'',creditTerm:'',sales:CURRENT_SALES,_isOther:true};
  S.billDiscount2pct=false;
  renderCusts();
}
function clearCS(){ document.getElementById('cSearch').value=''; renderCusts(); }

// ═══ PRODUCTS ═══
function buildCats(){
  document.getElementById('catChips').innerHTML=CATS.map(c=>
    `<div class="chip ${c===S.cat?'active':''}" onclick="setCat('${c.replace(/'/g,"\\'")}',this)">${c}</div>`).join('');
}
function setCat(c,el){
  S.cat=c;
  document.querySelectorAll('#catChips .chip').forEach(x=>x.classList.remove('active'));
  el.classList.add('active'); renderPgrid();
}
function renderPgrid(){
  var q=document.getElementById('pSearch').value.toLowerCase().trim();
  var list=PRODUCTS.filter(function(p){
    var mc=S.cat==='ทั้งหมด'||p.cat===S.cat;
    var mq=!q||p.name.toLowerCase().includes(q)
      ||p.variants.some(function(v){return v.trCode&&v.trCode.toLowerCase().includes(q);})
      ||p.variants.some(function(v){return v.barcode&&v.barcode.includes(q);});
    return mc&&mq;
  });
  var container=document.getElementById('prod-flat-list');
  if(!container) return;
  if(!list.length){
    container.innerHTML='<div style="padding:20px;text-align:center;color:var(--text3);">🔍 ไม่พบสินค้า</div>';
    return;
  }

  var RENDER_LIMIT=80;   // max SKU rows per render (performance)
  var totalSkus=list.reduce(function(s,p){return s+p.variants.length;},0);
  var pCountEl=document.getElementById('pCount');
  if(pCountEl) pCountEl.textContent=list.length+' กลุ่ม / '+totalSkus+' SKU';
  var html='<table class="psheet"><thead><tr>'
    +'<th class="psh-code">Code</th>'
    +'<th class="psh-bc">Barcode</th>'
    +'<th class="psh-name">Product Name / SKU</th>'
    +'<th class="psh-stock">Allocated Stock</th>'
    +'<th class="psh-tier">Price Tier</th>'
    +'<th class="psh-qty">จำนวน</th>'
    +'<th class="psh-total" style="text-align:right;">รวม</th>'
    +'<th class="psh-free">Tester/ของแถม</th>'
    +'<th class="psh-note">หมายเหตุ</th>'
    +'</tr></thead><tbody>';

  var _rowCount=0;
  list.forEach(function(p){
    if(_rowCount>=RENDER_LIMIT) return;
    p.variants.forEach(function(v){
      var _inCart=S.cart.some(function(c){return c.pid===p.id&&c.variant===v.label;});
      if(_rowCount>=RENDER_LIMIT&&!_inCart) return;  // always show cart items
      if(!_inCart) _rowCount++;
      var vkey=p.id+'||'+v.label;   // use || separator (safe in data attr)
      var vkeyAttr=vkey.replace(/"/g,'&quot;');
      var cartItem=S.cart.find(function(c){return c.pid===p.id&&c.variant===v.label;});
      var qty=cartItem?cartItem.qty:0;

      var custPT=(S.selCust&&(S.selCust.priceType||S.selCust.type))||'Dealer';
      var defaultMode=custPT.toLowerCase()==='wholesale'?'wholesale':'dealer';
      var mode=S.varModes[vkey]||defaultMode;
      var any50=v.price50!=null;
      var any6=v.price6!=null;

      // ── Stock ──
      var stockHtml='<span style="font-size:9px;color:var(--text3);">—</span>';
      if(STOCK_LOADED){
        var s2=getStock(p.id,v.label);
        if(s2){
          var pRem=s2.personalQuota-s2.allocated;
          var poolRem=s2.poolQuota-s2.allocated;
          var pC=pRem<=0?'#dc2626':pRem<=5?'#d97706':'#16a34a';
          var poC=poolRem<=0?'#dc2626':poolRem<=10?'#d97706':'#6366f1';
          stockHtml='<div style="display:flex;flex-direction:column;gap:2px;">'
            +'<span style="font-size:9px;font-weight:700;color:'+pC+';">👤 '+pRem+'/'+s2.personalQuota+'</span>'
            +'<span style="font-size:9px;font-weight:700;color:'+poC+';">🤝 '+poolRem+'/'+s2.poolQuota+'</span>'
            +'</div>';
        }
      }

      // ── Price tier buttons — use data-action + data-vkey + data-mode ──
      var btnBase='psh-tier-btn';
      var tierBtnHtml=function(m,label){
        var active=mode===m;
        var bgMap={dealer:'var(--pink-m)',wholesale:'#059669',p50:'#d97706',p6:'#ea580c',special:'#f59e0b'};
        var st='padding:2px 7px;border-radius:5px;border:1.5px solid '
          +(active?'transparent':'var(--border)')
          +';font-size:9px;font-weight:800;cursor:pointer;font-family:inherit;white-space:nowrap;'
          +'background:'+(active?(bgMap[m]||bgMap.dealer):'var(--bg)')
          +';color:'+(active?'#fff':'var(--text2)')+';';
        return '<button class="'+btnBase+'" data-action="setmode" data-vkey="'+vkeyAttr+'" data-mode="'+m+'" style="'+st+'">'+label+'</button>';
      };
      var tierHtml='<div style="display:flex;flex-wrap:wrap;gap:3px;">'
        +tierBtnHtml('dealer','D ฿'+p.dealer)
        +tierBtnHtml('wholesale','WS ฿'+p.wholesale)
        +(any50?tierBtnHtml('p50','50ลัง ฿'+v.price50):'')
        +(any6?tierBtnHtml('p6','6ลัง ฿'+v.price6):'')
        +tierBtnHtml('special','⭐')
        +'</div>';
      // Mismatch check
      var custPT3=(S.selCust&&(S.selCust.priceType||S.selCust.type))||'Dealer';
      var isTierMismatch=(custPT3==='Dealer'&&mode==='wholesale')||(custPT3==='Wholesale'&&mode==='dealer');
      var hasMismatchReason=(S.varSpecialReason[vkey]||'').trim().length>0;
      if(isTierMismatch){
        tierHtml+='<div style="margin-top:3px;font-size:9px;font-weight:700;color:#92400e;background:#fef3c7;border-radius:4px;padding:1px 6px;display:inline-block;">⚠️ ไม่ตรงประเภท</div>';
      }
      if(mode==='special'){
        var spVal=(S.varSpecialPrice[vkey]||'');
        var spReason=(S.varSpecialReason[vkey]||'').replace(/"/g,'&quot;');
        tierHtml+='<div style="display:flex;gap:3px;margin-top:3px;">'
          +'<input data-action="sprice" data-vkey="'+vkeyAttr+'" type="number" min="0" placeholder="฿" value="'+spVal+'" style="width:55px;padding:2px 5px;border:1.5px solid #f59e0b;border-radius:5px;font-size:11px;font-family:inherit;">'
          +'<input data-action="sreason" data-vkey="'+vkeyAttr+'" type="text" placeholder="เหตุผลราคาพิเศษ" value="'+spReason+'" style="flex:1;min-width:60px;padding:2px 5px;border:1.5px solid #f59e0b;border-radius:5px;font-size:11px;font-family:inherit;">'
          +'</div>';
      }

      // ── Qty ──
      var currentPrice=(function(){
        if(mode==='dealer') return p.dealer;
        if(mode==='wholesale') return p.wholesale;
        if(mode==='p50'&&any50) return v.price50;
        if(mode==='p6'&&any6) return v.price6;
        if(mode==='special') return S.varSpecialPrice[vkey]||p.dealer;
        return p.dealer;
      })();
      var qtyHtml='<div style="display:flex;align-items:center;gap:3px;justify-content:center;">'
        +'<button class="var-qbtn" data-action="adjqty" data-vkey="'+vkeyAttr+'" data-delta="-1">−</button>'
        +'<input class="var-qnum psh-qty-input" data-action="setqty" data-vkey="'+vkeyAttr+'" type="number" min="0" value="'+qty+'" style="width:42px;text-align:center;">'
        +'<button class="var-qbtn" data-action="adjqty" data-vkey="'+vkeyAttr+'" data-delta="1">+</button>'
        +'</div>'
      // ── Note ──
      var skuNote=(S.varSkuNotes[vkey]||'').replace(/"/g,'&quot;');
      var mismatchNote=(isTierMismatch&&!hasMismatchReason);
      var noteBorderColor=mismatchNote?'#dc2626':'var(--border)';
      var notePlaceholder=isTierMismatch?'* เหตุผลที่ใช้ราคาข้ามประเภท (บังคับ)':'หมายเหตุ SKU...';
      var noteHtml=(isTierMismatch?'<div style="font-size:9px;color:#92400e;font-weight:700;margin-bottom:2px;">⚠️ บังคับกรอก</div>':'')        +'<input data-action="skunote" data-vkey="'+vkeyAttr+'" type="text" placeholder="'+notePlaceholder+'" value="'+skuNote+'" style="width:100%;min-width:90px;padding:3px 6px;border:1.5px solid '+noteBorderColor+';border-radius:5px;font-size:11px;font-family:inherit;background:'+(mismatchNote?'#fff8f8':'var(--bg)')+';box-sizing:border-box;">';

      // ── Free/Tester ──
      // Single ของแถม/Tester qty input
      var freeTotal=(S.varFreeItems[vkey]||[]).reduce(function(s,f){return s+f.qty;},0);
      var freeHtml=
        '<div style="display:flex;align-items:center;gap:3px;justify-content:center;">'
        +'<button class="var-qbtn" data-action="adjfreetotal" data-vkey="'+vkeyAttr+'" data-delta="-1">−</button>'
        +'<input data-action="setfreetotal" data-vkey="'+vkeyAttr+'" type="number" min="0" value="'+freeTotal+'" placeholder="0" style="width:42px;padding:2px 4px;border:1.5px solid '+(freeTotal>0?'#059669':'var(--border)')+';border-radius:6px;font-size:13px;font-weight:700;text-align:center;font-family:inherit;background:'+(freeTotal>0?'#f0fdf4':'var(--bg)')+';color:'+(freeTotal>0?'#166534':'var(--text3)')+';transition:all .15s;">'
        +'<button class="var-qbtn" data-action="adjfreetotal" data-vkey="'+vkeyAttr+'" data-delta="1">+</button>'

      var rowBg=qty>0?'background:var(--pink-l);':'';
      html+='<tr data-vkey="'+vkeyAttr+'" style="'+rowBg+'">'
        +'<td class="psh-code">'+(v.trCode?'<span style="font-size:14px;font-weight:900;font-family:monospace;color:#c0134f;background:#fce7f3;padding:3px 8px;border-radius:7px;display:inline-block;letter-spacing:0.5px;">'+v.trCode+'</span>':'<span style="color:var(--text3);font-size:10px;">—</span>')+'</td>'
        +'<td class="psh-bc"><span style="font-family:monospace;font-size:9px;color:var(--text3);">'+(v.barcode||'—')+'</span></td>'
        +'<td class="psh-name">'
          +'<div style="font-size:10px;font-weight:800;color:var(--text);line-height:1.3;">'+p.emoji+' '+p.name+'</div>'
          +'<div style="font-size:11px;color:var(--text2);margin-top:1px;">'+v.label+'</div>'
        +'</td>'
        +'<td class="psh-stock">'+stockHtml+'</td>'
        +'<td class="psh-tier">'+tierHtml+'</td>'
        +'<td class="psh-qty">'+qtyHtml+'</td>'
        +'<td class="psh-total" style="text-align:right;padding:6px 10px;vertical-align:middle;font-size:12px;font-weight:800;color:var(--pink);white-space:nowrap;">'
          +(qty>0?'฿'+(currentPrice*qty).toLocaleString():'<span style="color:var(--text3);font-weight:400;">—</span>')
        +'</td>'
        +'<td class="psh-free">'+freeHtml+'</td>'
        +'<td class="psh-note">'+noteHtml+'</td>'
        +'</tr>';
    });
  });


  html+='</tbody></table>';
  container.innerHTML=html;
  attachPsheetHandlers(container);
}

// ── Central event handler for all psheet interactions ──
var _pshClickHandler = null;
var _pshChangeHandler = null;
var _pshInputHandler = null;
function attachPsheetHandlers(container){
  // Remove previous listeners before attaching new ones (prevents double-fire)
  if(_pshClickHandler)  container.removeEventListener('click',  _pshClickHandler);
  if(_pshChangeHandler) container.removeEventListener('change', _pshChangeHandler);
  if(_pshInputHandler)  container.removeEventListener('input',  _pshInputHandler);
  _pshClickHandler = function(e){
    var el=e.target.closest('[data-action]');
    if(!el) return;
    e.stopPropagation();
    var action=el.getAttribute('data-action');
    var vkey=el.getAttribute('data-vkey');
    if(!vkey) return;
    var parts=vkey.split('||');
    var pid=parts[0], label=parts.slice(1).join('||');

    if(action==='setmode'){
      var mode=el.getAttribute('data-mode');
      var custPT2=(S.selCust&&(S.selCust.priceType||S.selCust.type))||'Dealer';
      var isMismatch=(custPT2==='Dealer'&&mode==='wholesale')||(custPT2==='Wholesale'&&mode==='dealer');
      if(isMismatch){
        // Show inline warning — don't block, but flag it
        if(!S.varSpecialReason[vkey]){
          S.varModes[vkey]=mode;
          S.varMismatch=S.varMismatch||{};
          S.varMismatch[vkey]=true;
        } else {
          S.varModes[vkey]=mode;
        }
      } else {
        S.varModes[vkey]=mode;
        if(S.varMismatch) delete S.varMismatch[vkey];
      }
      if(renderPgridDebounced) renderPgridDebounced(); else renderPgrid();
    } else if(action==='adjqty'){
      var delta=parseInt(el.getAttribute('data-delta'))||0;
      pshAdjQty(pid,label,vkey,delta);
    } else if(action==='adjfreetotal'){
      var fdelta2=parseInt(el.getAttribute('data-delta'))||0;
      if(!S.varFreeItems[vkey]) S.varFreeItems[vkey]=[];
      var curTotal=S.varFreeItems[vkey].reduce(function(s,f){return s+f.qty;},0);
      var newTotal=Math.max(0,curTotal+fdelta2);
      S.varFreeItems[vkey]=newTotal>0?[{type:'free',qty:newTotal}]:[];
      var ci3=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
      if(ci3) ci3.freeItems=JSON.parse(JSON.stringify(S.varFreeItems[vkey]));
      // Update input visually — suppress the change event with a flag
      var inp=el.parentNode.querySelector('input[data-action="setfreetotal"]');
      if(inp){
        inp.dataset.suppressChange='1';
        inp.value=newTotal;
        inp.style.borderColor=newTotal>0?'#059669':'var(--border)';
        inp.style.background=newTotal>0?'#f0fdf4':'var(--bg)';
        inp.style.color=newTotal>0?'#166534':'var(--text3)';
        setTimeout(function(){inp.dataset.suppressChange='';},0);
      }
    } else if(action==='addfree'){
      // legacy — redirect to adjfreetotal logic
      if(!S.varFreeItems[vkey]) S.varFreeItems[vkey]=[];
      var exAll=S.varFreeItems[vkey].reduce(function(s,f){return s+f.qty;},0);
      S.varFreeItems[vkey]=[{type:'free',qty:exAll+1}];
      renderPgrid();
    } else if(action==='adjfree'){
      var fidx=parseInt(el.getAttribute('data-fidx'));
      var fdelta=parseInt(el.getAttribute('data-delta'))||0;
      if(S.varFreeItems[vkey]&&S.varFreeItems[vkey][fidx]!==undefined){
        S.varFreeItems[vkey][fidx].qty=Math.max(0,S.varFreeItems[vkey][fidx].qty+fdelta);
        if(S.varFreeItems[vkey][fidx].qty===0) S.varFreeItems[vkey].splice(fidx,1);
      }
      renderPgrid();
    } else if(action==='rmfree'){
      var ridx=parseInt(el.getAttribute('data-fidx'));
      if(S.varFreeItems[vkey]) S.varFreeItems[vkey].splice(ridx,1);
      renderPgrid();
    }
  };
  container.addEventListener('click', _pshClickHandler);

  // Input handlers (change/input events)
  _pshChangeHandler = function(e){
    var el=e.target;
    var action=el.getAttribute('data-action');
    var vkey=el.getAttribute('data-vkey');
    if(!vkey||!action) return;
    var parts=vkey.split('||');
    var pid=parts[0], label=parts.slice(1).join('||');

    if(action==='setqty'){
      pshSetQty(pid,label,vkey,parseInt(el.value)||0);
    } else if(action==='setfreeqty'){
      var fidxC=parseInt(el.getAttribute('data-fidx'));
      var newQty=Math.max(0,parseInt(el.value)||0);
      if(S.varFreeItems[vkey]&&S.varFreeItems[vkey][fidxC]!==undefined){
        if(newQty===0){S.varFreeItems[vkey].splice(fidxC,1); renderPgrid();}
        else{S.varFreeItems[vkey][fidxC].qty=newQty;}
        var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
        if(ci) ci.freeItems=JSON.parse(JSON.stringify(S.varFreeItems[vkey]||[]));
      }
    } else if(action==='setfreetype'||action==='setfreetotal'){
      if(el.dataset.suppressChange) return;  // suppressed by adjfreetotal button
      // Single combined ของแถม/Tester qty
      var newFqty=Math.max(0,parseInt(el.value)||0);
      if(!S.varFreeItems[vkey]) S.varFreeItems[vkey]=[];
      // Store as single entry with type='free'
      if(newFqty===0){
        S.varFreeItems[vkey]=[];
      } else {
        S.varFreeItems[vkey]=[{type:'free',qty:newFqty}];
      }
      var ci2=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
      if(ci2) ci2.freeItems=JSON.parse(JSON.stringify(S.varFreeItems[vkey]));
      // Re-style input instantly
      var hasVal=newFqty>0;
      el.style.borderColor=hasVal?'#059669':'var(--border)';
      el.style.background=hasVal?'#f0fdf4':'var(--bg)';
      el.style.color=hasVal?'#166534':'var(--text3)';
    } else if(action==='sprice'){
      S.varSpecialPrice[vkey]=parseFloat(el.value)||null;
      // update cart if exists
      var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
      if(ci&&ci.mode==='special'){ci.unitPrice=S.varSpecialPrice[vkey]||ci.dp;renderCart();}
    } else if(action==='sreason'){
      S.varSpecialReason[vkey]=el.value;
      var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
      if(ci) ci.specialReason=el.value;
    } else if(action==='skunote'){
      S.varSkuNotes[vkey]=el.value;
      var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
      if(ci) ci.skuNote=el.value;
    }
  };
  container.addEventListener('change', _pshChangeHandler);
  // Also handle input event for notes (live update without needing blur)
  _pshInputHandler = function(e){
    var el=e.target;
    var action=el.getAttribute('data-action');
    if(action==='skunote'||action==='sreason'||action==='sprice'){
      var vkey=el.getAttribute('data-vkey');
      if(!vkey) return;
      var parts=vkey.split('||');
      var pid=parts[0],label=parts.slice(1).join('||');
      if(action==='skunote'){
        S.varSkuNotes[vkey]=el.value;
        var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
        if(ci) ci.skuNote=el.value;
      }else if(action==='sreason'){
        S.varSpecialReason[vkey]=el.value;
      }else if(action==='sprice'){
        S.varSpecialPrice[vkey]=parseFloat(el.value)||null;
      }
    }
  };
  container.addEventListener('input', _pshInputHandler);
}

function pshGetPrice(pid,label,vkey){
  var p=PRODUCTS.find(function(x){return x.id===pid;});
  if(!p) return 0;
  var v=p.variants.find(function(x){return x.label===label;});
  if(!v) return p.dealer;
  var mode=S.varModes[vkey]||'dealer';
  if(mode==='dealer') return p.dealer;
  if(mode==='wholesale') return p.wholesale;
  if(mode==='p50'&&v.price50!=null) return v.price50;
  if(mode==='p6'&&v.price6!=null) return v.price6;
  if(mode==='special') return S.varSpecialPrice[vkey]||p.dealer;
  return p.dealer;
}

function pshAdjQty(pid,label,vkey,delta){
  var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
  if(ci){
    var newQty=Math.max(0,ci.qty+delta);
    if(newQty===0){
      // Quota check before removing
      S.cart=S.cart.filter(function(c){return !(c.pid===pid&&c.variant===label);});
    } else {
      // Quota check
      if(!pshCheckQuota(pid,label,newQty)) return;
      ci.qty=newQty;
      ci.unitPrice=pshGetPrice(pid,label,vkey);
    }
  } else if(delta>0){
    if(!pshValidateMismatch(vkey)) return;
    if(!pshCheckQuota(pid,label,1)) return;
    pshAddToCart(pid,label,vkey,1);
    return;
  }
  renderCart(); renderPgrid();
}

function pshSetQty(pid,label,vkey,qty){
  if(qty<0) qty=0;
  if(qty>0&&!pshCheckQuota(pid,label,qty)) return;
  var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===label;});
  if(qty===0){
    S.cart=S.cart.filter(function(c){return !(c.pid===pid&&c.variant===label);});
  } else if(ci){
    ci.qty=qty;
    ci.unitPrice=pshGetPrice(pid,label,vkey);
  } else {
    if(!pshValidateMismatch(vkey)) return;
    pshAddToCart(pid,label,vkey,qty);
    return;
  }
  renderCart(); renderPgrid();
}

var _quotaLock=false;
function pshCheckQuota(pid,label,qty){
  if(!STOCK_LOADED) return true;
  if(_quotaLock) return true;  // prevent double-fire
  var s=getStock(pid,label);
  if(!s) return true;
  var poolRem=s.poolQuota-s.allocated;
  var pRem=s.personalQuota-s.allocated;
  if(qty>poolRem){
    _quotaLock=true;
    var ok=confirm('🚫 สั่งเกิน Quota รวม TT\n• สั่ง '+qty+' / TT รวม เหลือ '+poolRem+'/'+s.poolQuota+'\n\nยืนยันการสั่ง?');
    _quotaLock=false;
    if(!ok) return false;
  } else if(qty>pRem){
    _quotaLock=true;
    var ok2=confirm('⚠️ สั่งเกิน Quota ส่วนตัว — แต่ยังมี Quota รวม TT\n• สั่ง '+qty+' / Quota ฉัน เหลือ '+pRem+' | TT รวม เหลือ '+poolRem+'\n\nยืนยันใช้ Quota รวม TT?');
    _quotaLock=false;
    if(!ok2) return false;
  }
  return true;
}

function pshValidateMismatch(vkey){
  var custPT4=(S.selCust&&(S.selCust.priceType||S.selCust.type))||'Dealer';
  var mode=S.varModes[vkey]||'dealer';
  var isMis=(custPT4==='Dealer'&&mode==='wholesale')||(custPT4==='Wholesale'&&mode==='dealer');
  if(!isMis) return true;
  // Check skuNote (the หมายเหตุ column) for the reason
  var reason=(S.varSkuNotes[vkey]||'').trim();
  if(!reason){
    alert('\u26A0\uFE0F ราคา '+mode+' ไม่ตรงกับประเภทร้านค้า ('+custPT4+')\nกรุณากรอกเหตุผลในช่องหมายเหตุ (ขวาสุด) ก่อนเพิ่มสินค้า');
    return false;
  }
  // Save note as specialReason for the cart item
  S.varSpecialReason[vkey]=reason;
  return true;
}
function pshAddToCart(pid,label,vkey,qty){
  var p=PRODUCTS.find(function(x){return x.id===pid;});
  if(!p) return;
  var v=p.variants.find(function(x){return x.label===label;});
  if(!v) return;
  var mode=S.varModes[vkey]||( (S.selCust&&(S.selCust.priceType||S.selCust.type)||'Dealer').toLowerCase()==='wholesale'?'wholesale':'dealer');
  var unitPrice=pshGetPrice(pid,label,vkey);
  // Save mismatch reason for any mode (special OR price tier mismatch)
  var custPT5=(S.selCust&&(S.selCust.priceType||S.selCust.type))||'Dealer';
  var isMis5=(custPT5==='Dealer'&&mode==='wholesale')||(custPT5==='Wholesale'&&mode==='dealer');
  var reasonToSave=S.varSpecialReason[vkey]||'';
  S.cart.push({
    pid:pid,name:p.name,emoji:p.emoji,cat:p.cat,
    variant:label,trCode:v.trCode,barcode:v.barcode,
    qty:qty,mode:mode,dp:p.dealer,wp:p.wholesale,p50:v.price50,p6:v.price6,unitPrice:unitPrice,
    specialPrice:mode==='special'?(S.varSpecialPrice[vkey]||null):null,
    specialReason:reasonToSave,
    isMismatch:isMis5,
    skuNote:(S.varSkuNotes[vkey]||''),
    freeItems:(S.varFreeItems[vkey]?JSON.parse(JSON.stringify(S.varFreeItems[vkey])):[]),
  });
  renderCart(); renderPgrid();
}


function filterP(){
  document.getElementById('pClr').classList.toggle('show',document.getElementById('pSearch').value.length>0);
  if(renderPgridDebounced) renderPgridDebounced(); else renderPgrid();
}
function clearPS(){document.getElementById('pSearch').value='';document.getElementById('pClr').classList.remove('show');renderPgrid();}
// ═══ FLAT PRODUCT LIST HELPERS ═══
function toggleProdExpand(el){
  var pid=el.getAttribute('data-pid');
  if(!pid) return;
  var prod=document.getElementById('pfl-'+pid);
  if(!prod) return;
  var skus=prod.querySelector('.pfl-skus');
  var arr=prod.querySelector('.pfl-arrow');
  if(!skus) return;
  var open=skus.style.display!=='none';
  skus.style.display=open?'none':'block';
  if(arr) arr.textContent=open?'▸':'▾';
}
function setPflMode(pid,varLabel,mode){
  var key=pid+'_'+varLabel;
  S.varModes[key]=mode;
  renderPgrid();
}
function setPflSpPrice(pid,varLabel,val){
  S.varSpecialPrice[pid+'_'+varLabel]=parseFloat(val)||null;
  renderPgrid();
}
function setPflSpReason(pid,varLabel,val){
  S.varSpecialReason[pid+'_'+varLabel]=val;
}
function setPflSkuNote(pid,varLabel,val){
  S.varSkuNotes[pid+'_'+varLabel]=val;
  // Update cart item note if exists
  var ci=S.cart.find(function(c){return c.pid===pid&&c.variant===varLabel;});
  if(ci) ci.skuNote=val;
}
function addFreeItem(pid,varLabel,type){
  var key=pid+'_'+varLabel;
  if(!S.varFreeItems[key]) S.varFreeItems[key]=[];
  // Check if same type already exists
  var existing=S.varFreeItems[key].find(function(f){return f.type===type;});
  if(existing){existing.qty+=1;}
  else{S.varFreeItems[key].push({type:type,qty:1});}
  renderPgrid();
}
function adjFreeItem(pid,varLabel,idx,delta){
  var key=pid+'_'+varLabel;
  if(!S.varFreeItems[key]||!S.varFreeItems[key][idx]) return;
  S.varFreeItems[key][idx].qty=Math.max(0,S.varFreeItems[key][idx].qty+delta);
  if(S.varFreeItems[key][idx].qty===0) S.varFreeItems[key].splice(idx,1);
  renderPgrid();
}
function removeFreeItem(pid,varLabel,idx){
  var key=pid+'_'+varLabel;
  if(S.varFreeItems[key]) S.varFreeItems[key].splice(idx,1);
  renderPgrid();
}
function adjPflQty(pid,varLabel,v,delta){
  var cartItem=S.cart.find(function(c){return c.pid===pid&&c.variant===varLabel;});
  if(cartItem){
    cartItem.qty=Math.max(0,cartItem.qty+delta);
    if(cartItem.qty===0) S.cart=S.cart.filter(function(c){return !(c.pid===pid&&c.variant===varLabel);});
  } else if(delta>0){
    addPflToCart(pid,varLabel,v,1);
    return;
  }
  renderCart(); renderPgrid();
}
function setPflQty(pid,varLabel,v,val){
  var qty=Math.max(0,parseInt(val)||0);
  var cartItem=S.cart.find(function(c){return c.pid===pid&&c.variant===varLabel;});
  if(qty===0){
    S.cart=S.cart.filter(function(c){return !(c.pid===pid&&c.variant===varLabel);});
  } else if(cartItem){
    cartItem.qty=qty;
    cartItem.unitPrice=getPflCurrentPrice(pid,varLabel,v);
  } else {
    addPflToCart(pid,varLabel,v,qty);
    return;
  }
  renderCart(); renderPgrid();
}
function getPflCurrentPrice(pid,varLabel,v){
  var p=PRODUCTS.find(function(x){return x.id===pid;});
  if(!p) return 0;
  var key=pid+'_'+varLabel;
  var mode=S.varModes[key]||'dealer';
  if(mode==='dealer') return p.dealer;
  if(mode==='wholesale') return p.wholesale;
  if(mode==='p50'&&v&&v.price50!=null) return v.price50;
  if(mode==='p6'&&v&&v.price6!=null) return v.price6;
  if(mode==='special') return S.varSpecialPrice[key]||p.dealer;
  return p.dealer;
}
function addPflToCart(pid,varLabel,v,qty){
  var p=PRODUCTS.find(function(x){return x.id===pid;});
  if(!p) return;
  var key=pid+'_'+varLabel;
  var mode=S.varModes[key]||'dealer';
  var unitPrice=getPflCurrentPrice(pid,varLabel,v);
  S.cart.push({
    pid:pid,name:p.name,emoji:p.emoji,cat:p.cat,
    variant:varLabel,trCode:v.trCode,barcode:v.barcode,
    qty:qty,mode:mode,dp:p.dealer,wp:p.wholesale,p50:v.price50,p6:v.price6,unitPrice:unitPrice,
    specialPrice:mode==='special'?(S.varSpecialPrice[key]||null):null,
    specialReason:(S.varSpecialReason[key]||''),
    skuNote:(S.varSkuNotes[key]||''),
    freeItems:(S.varFreeItems[key]?JSON.parse(JSON.stringify(S.varFreeItems[key])):[]),
  });
  renderCart(); renderPgrid();
}


// ═══ VARIANT PICKER ═══
function tapProd(pid){
  const p=PRODUCTS.find(x=>x.id===pid);
  S.varPid=pid; S.varModes={}; S.varSelections={};
  S.varSpecialPrice={}; S.varSpecialReason={};
  S.cart.filter(c=>c.pid===pid).forEach(c=>{
    S.varSelections[c.variant]=c.qty;
    S.varModes[c.variant]=c.mode||'dealer';
    if(c.specialPrice!=null) S.varSpecialPrice[c.variant]=c.specialPrice;
    if(c.specialReason) S.varSpecialReason[c.variant]=c.specialReason;
  });
  openVarSheet(p);
}
function tapProdSku(pid,varLabel){
  const p=PRODUCTS.find(x=>x.id===pid);
  S.varPid=pid; S.varModes={}; S.varSelections={};
  S.varSpecialPrice={}; S.varSpecialReason={};
  S.cart.filter(c=>c.pid===pid).forEach(c=>{
    S.varSelections[c.variant]=c.qty;
    S.varModes[c.variant]=c.mode||'dealer';
    if(c.specialPrice!=null) S.varSpecialPrice[c.variant]=c.specialPrice;
    if(c.specialReason) S.varSpecialReason[c.variant]=c.specialReason;
  });
  if(!S.varSelections[varLabel]) S.varSelections[varLabel]=1;
  if(!S.varModes[varLabel]) S.varModes[varLabel]='dealer';
  openVarSheet(p);
}
function openVarSheet(p){
  const allTR=[...new Set(p.variants.filter(v=>v.trCode).map(v=>v.trCode))].join(', ');
  document.getElementById('varProdInfo').innerHTML=`
    <div class="varpick-em">${p.emoji}</div>
    <div><div class="varpick-name">${p.name}</div>
    ${allTR?`<div class="varpick-tr">TR: ${allTR}</div>`:''}
    </div>`;
  document.getElementById('varPricePick').style.display='none';
  renderVarList(p);
  openSheet('varSheet');
}
function getPriceForMode(p,mode){
  if(mode==='dealer') return p.dealer;
  if(mode==='wholesale') return p.wholesale;
  if(mode==='special') return null;
  // 50/6: check if any variant has it (use first found)
  const v=p.variants.find(vr=>vr.price50!=null);
  if(mode==='p50'&&v) return v.price50;
  const v6=p.variants.find(vr=>vr.price6!=null);
  if(mode==='p6'&&v6) return v6.price6;
  return p.dealer;
}
function renderVarPricePick(p){
  const any50=p.variants.some(v=>v.price50!=null);
  const any6=p.variants.some(v=>v.price6!=null);
  document.getElementById('varPricePick').innerHTML=`
    <div class="price-tab ${S.varMode==='dealer'?'sel-d':''}" onclick="setVarMode('dealer')">
      <div style="font-size:10px;font-weight:800;">Dealer</div>
      <div style="font-size:15px;font-weight:700;">฿${p.dealer}</div>
    </div>
    <div class="price-tab ${S.varMode==='wholesale'?'sel-w':''}" onclick="setVarMode('wholesale')">
      <div style="font-size:10px;font-weight:800;">Wholesale</div>
      <div style="font-size:15px;font-weight:700;">฿${p.wholesale}</div>
    </div>
    ${any50?`<div class="price-tab ${S.varMode==='p50'?'sel-50':''}" onclick="setVarMode('p50')">
      <div style="font-size:10px;font-weight:800;">50 ลัง</div>
      <div style="font-size:15px;font-weight:700;">฿${p.variants.find(v=>v.price50!=null).price50}</div>
    </div>`:''}
    ${any6?`<div class="price-tab ${S.varMode==='p6'?'sel-6':''}" onclick="setVarMode('p6')">
      <div style="font-size:10px;font-weight:800;">6 ลัง</div>
      <div style="font-size:15px;font-weight:700;">฿${p.variants.find(v=>v.price6!=null).price6}</div>
    </div>`:''}
    <div class="price-tab ${S.varMode==='special'?'sel-sp':''}" onclick="setVarMode('special')" style="border-color:#f59e0b;">
      <div style="font-size:10px;font-weight:800;">⭐ ราคาพิเศษ</div>
      <div style="font-size:11px;font-weight:600;color:#f59e0b;">กำหนดเอง</div>
    </div>`;
}
function setSpPrice(v,val){S.varSpecialPrice[v]=parseFloat(val)||null;}
function setSpReason(v,val){S.varSpecialReason[v]=val;}
function getVarMode(label){return S.varModes[label]||'dealer';}
function setSkuMode(label,mode){
  S.varModes[label]=mode;
  renderVarList(PRODUCTS.find(x=>x.id===S.varPid));
}
function getPriceForVariantMode(p,v,mode){
  if(mode==='dealer') return p.dealer;
  if(mode==='wholesale') return p.wholesale;
  if(mode==='special') return S.varSpecialPrice[v.label]||null;
  if(mode==='p50'&&v.price50!=null) return v.price50;
  if(mode==='p6'&&v.price6!=null) return v.price6;
  return p.dealer;
}
function renderVarList(p){
  const any50=p.variants.some(v=>v.price50!=null);
  const any6=p.variants.some(v=>v.price6!=null);
  document.getElementById('varList').innerHTML=p.variants.map(v=>{
    const qty=S.varSelections[v.label]||0;
    const sel=qty>0;
    const mode=getVarMode(v.label);
    const safeLabel=v.label.replace(/'/g,"\\'").replace(/"/g,'&quot;');
    const spPrice=S.varSpecialPrice[v.label]!=null?S.varSpecialPrice[v.label]:'';
    const spReason=S.varSpecialReason[v.label]||'';
    const displayPrice=mode==='special'?`<span style="font-size:10px;color:#f59e0b;font-weight:700;">กำหนดเอง</span>`:
      `<span style="font-size:12px;font-weight:700;color:var(--pink);">฿${getPriceForVariantMode(p,v,mode)}</span>`;

    const custType2=S.selCust?S.selCust.type:'';
    const modeBtn=(m,label,cls)=>{
      // Show mismatch warning if customer type doesn't match price tier
      const isMismatch=(custType2==='Dealer'&&m==='wholesale')||(custType2==='Wholesale'&&m==='dealer');
      const needReason=isMismatch||(m!=='dealer'&&m!=='wholesale'&&m!=='special'&&getPriceForVariantMode(p,v,m)===p.dealer);
      return `<button onclick="event.stopPropagation();setSkuMode('${safeLabel}','${m}')"
        title="${isMismatch?'⚠️ ไม่ตรงกับประเภทร้านค้า — ต้องกรอกหมายเหตุ':''}"
        style="padding:3px 7px;border-radius:6px;border:1.5px solid ${mode===m?'transparent':isMismatch&&mode===m?'var(--warn)':'var(--border)'};font-size:9px;font-weight:800;cursor:pointer;font-family:'Sarabun',sans-serif;
        background:${mode===m?(m==='dealer'?'var(--pink-m)':m==='wholesale'?'var(--success)':m==='special'?'#f59e0b':m==='p50'?'#d97706':'#ea580c'):'var(--surface)'};
        color:${mode===m?'#fff':'var(--text2)'};">${label}${isMismatch?'⚠️':''}</button>`;
    };

    return `<div class="var-row ${sel?'selected':''}" onclick="toggleVar('${safeLabel}')">
      <div class="var-chk">${sel?'✓':''}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
          <span class="var-lbl">${v.label}</span>
          ${displayPrice}
        </div>
        <div class="var-codes" style="margin-top:3px;">
          ${v.trCode?`<span class="var-sku">TR ${v.trCode}</span>`:''}
          ${v.barcode?`<span class="var-bc">📦 ${v.barcode}</span>`:''}
          ${(()=>{
            if(!STOCK_LOADED) return '';
            const s=getStock(p.id,v.label);
            if(!s) return '';
            const cartQty=S.varSelections[v.label]||0;
            const pRem=s.personalQuota-s.allocated-cartQty;
            const poolRem=s.poolQuota-s.allocated-cartQty;
            const pColor=pRem<0?'var(--danger)':pRem<=5?'var(--warn)':'var(--success)';
            const poolColor=poolRem<0?'var(--danger)':poolRem<=10?'var(--warn)':'#6366f1';
            return '<div style="display:inline-flex;gap:5px;align-items:center;flex-wrap:wrap;margin-top:2px;">'
              +'<span style="font-size:9px;padding:1px 7px;border-radius:4px;background:'+(pRem<0?'var(--danger-bg)':pRem<=5?'var(--warn-bg)':'var(--success-bg)')+';color:'+pColor+';font-weight:700;">📊 ของฉัน: เหลือ '+pRem+'/'+s.personalQuota+'</span>'
              +'<span style="font-size:9px;padding:1px 7px;border-radius:4px;background:'+(poolRem<0?'var(--danger-bg)':poolRem<=10?'var(--warn-bg)':'#ede9fe')+';color:'+poolColor+';font-weight:700;">🤝 TT รวม: เหลือ '+poolRem+'/'+s.poolQuota+'</span>'
              +'</div>';
          })()}
        </div>
        ${sel?`<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;" onclick="event.stopPropagation()">
          ${modeBtn('dealer','Dealer','')}
          ${modeBtn('wholesale','WS','')}
          ${any50&&v.price50!=null?modeBtn('p50','50ลัง',''):''}
          ${any6&&v.price6!=null?modeBtn('p6','6ลัง',''):''}
          ${modeBtn('special','⭐ ราคาพิเศษ','')}
        </div>`:''}
      </div>
      <div class="var-qty" onclick="event.stopPropagation()">
        <button class="var-qbtn" onclick="adjVar('${safeLabel}',-1)">−</button>
        <input class="var-qnum" type="number" min="0" value="${qty}" onchange="setVarQty('${safeLabel}',this.value)" onclick="event.stopPropagation()">
        <button class="var-qbtn" onclick="adjVar('${safeLabel}',1)">+</button>
      </div>
    </div>
    ${(()=>{
      const custT=S.selCust?S.selCust.type:'';
      const isMismatch=(custT==='Dealer'&&mode==='wholesale')||(custT==='Wholesale'&&mode==='dealer');
      const showSpRow=sel&&(mode==='special'||isMismatch);
      if(!showSpRow) return '';
      const isReqReason=isMismatch&&mode!=='special';
      return `<div class="sp-row" style="${isMismatch?'background:#FEF3C7;border-color:#F59E0B;':''}">
        <div class="sp-row-title">${mode==='special'?'⭐ ราคาพิเศษ':'⚠️ ราคาไม่ตรงประเภทร้านค้า — บังคับกรอกหมายเหตุ'}: ${v.label} ${v.trCode?`<span class="var-sku">TR ${v.trCode}</span>`:''}</div>
        <div class="sp-inputs">
          ${mode==='special'?`<input class="sp-price-input" type="number" min="0" placeholder="ราคา ฿" value="${spPrice}"
            oninput="setSpPrice('${safeLabel}',this.value)" onclick="event.stopPropagation()">`:
            '<span style="font-size:11px;color:#92400E;font-weight:600;">ราคา: '+getPriceForVariantMode(p,v,mode)+'฿ ('+mode+')</span>'}
          <textarea class="sp-reason-input" rows="2" placeholder="${isReqReason?'* บังคับ: เหตุผลที่เลือกราคาไม่ตรงกับประเภทร้านค้า...':'เหตุผลที่ขอราคาพิเศษ...'}" 
            style="${isReqReason&&!spReason?'border-color:var(--danger);':''}${isReqReason?'border-width:2px;':''}"
            oninput="setSpReason('${safeLabel}',this.value)" onclick="event.stopPropagation()">${spReason}</textarea>
        </div>
      </div>`;
    })()}`
  }).join('');
}
function toggleVar(v){
  S.varSelections[v]=(S.varSelections[v]>0)?0:1;
  if(S.varSelections[v]>0&&!S.varModes[v]) S.varModes[v]='dealer';
  renderVarList(PRODUCTS.find(x=>x.id===S.varPid));
}
function adjVar(v,d){
  S.varSelections[v]=Math.max(0,(S.varSelections[v]||0)+d);
  renderVarList(PRODUCTS.find(x=>x.id===S.varPid));
}
function setVarQty(v,val){S.varSelections[v]=Math.max(0,parseInt(val)||0);}
function confirmVarPick(){
  const p=PRODUCTS.find(x=>x.id===S.varPid);
  // ── Quota check ──
  if(STOCK_LOADED){
    const overPersonal=[], overPool=[];
    p.variants.forEach(v=>{
      const qty=S.varSelections[v.label]||0;
      if(qty>0){
        const s=getStock(p.id,v.label);
        if(s){
          const pRem=s.personalQuota-s.allocated;
          const poolRem=s.poolQuota-s.allocated;
          if(qty>pRem) overPersonal.push({label:v.label,qty,pRem,personalQuota:s.personalQuota,poolRem,poolQuota:s.poolQuota});
          else if(qty>poolRem) overPool.push({label:v.label,qty,poolRem,poolQuota:s.poolQuota});
        }
      }
    });
    if(overPool.length>0){
      const msg='🚫 สั่งเกิน Quota รวม TT:\n'
        +overPool.map(x=>'• '+x.label+': สั่ง '+x.qty+' / TT รวม เหลือ '+x.poolRem+'/'+x.poolQuota).join('\n')
        +'\n\nยืนยันว่า "รับทราบ และยืนยันการสั่ง (ใช้ Quota รวม)" ?';
      if(!confirm(msg)) return;
    } else if(overPersonal.length>0){
      const msg='⚠️ สั่งเกิน Quota ส่วนตัว — แต่ยังมี Quota รวม TT เหลืออยู่:\n'
        +overPersonal.map(x=>'• '+x.label+': สั่ง '+x.qty+' / Quota ฉัน เหลือ '+x.pRem+' | TT รวม เหลือ '+x.poolRem).join('\n')
        +'\n\nยืนยันใช้ Quota รวม TT แทน ?';
      if(!confirm(msg)) return;
    }
  }
  // ── Price-tier mismatch check ──
  const custType=S.selCust?S.selCust.type:'';
  const mismatchItems=[];
  p.variants.forEach(v=>{
    const qty=S.varSelections[v.label]||0;
    if(qty<=0) return;
    const mode=S.varModes[v.label]||'dealer';
    // Check if price exists for chosen mode
    const hasPrice=getPriceForVariantMode(p,v,mode)!=null && getPriceForVariantMode(p,v,mode)>0;
    if(!hasPrice && mode!=='special') mismatchItems.push({label:v.label,mode});
    // Check customer type vs price tier mismatch
    if(custType==='Dealer'&&mode==='wholesale') mismatchItems.push({label:v.label,mode,typeWarn:true,custType});
    if(custType==='Wholesale'&&mode==='dealer') mismatchItems.push({label:v.label,mode,typeWarn:true,custType});
  });
  if(mismatchItems.length>0){
    // Force special reason input for mismatched items
    const msg='⚠️ ราคาไม่ตรงกับประเภทร้านค้า:\n'
      +mismatchItems.map(x=>x.typeWarn
        ?'• '+x.label+': ลูกค้าประเภท '+x.custType+' แต่เลือกราคา '+x.mode
        :'• '+x.label+': ไม่มีราคาใน tier '+x.mode
      ).join('\n')
      +'\n\nกรุณาใส่หมายเหตุให้ครบทุก SKU ที่ไม่ตรง';
    // Check that all mismatch items have special reason
    let allHaveReason=true;
    mismatchItems.forEach(x=>{
      if(!S.varSpecialReason[x.label]||S.varSpecialReason[x.label].trim()===''){
        allHaveReason=false;
      }
    });
    if(!allHaveReason){
      alert(msg+'\n\n→ กรุณากลับไปกรอกหมายเหตุสำหรับ SKU ที่มีดอกจัน (*)');
      // Highlight missing reason fields
      mismatchItems.forEach(x=>{
        if(!S.varSpecialReason[x.label]) S.varModes[x.label]='special';
      });
      renderVarList(p);
      return;
    }
  }
  S.cart=S.cart.filter(c=>c.pid!==S.varPid);
  p.variants.forEach(v=>{
    const qty=S.varSelections[v.label]||0;
    if(qty>0){
      const mode=S.varModes[v.label]||'dealer';
      let unitP;
      if(mode==='special'){
        unitP=S.varSpecialPrice[v.label]!=null?S.varSpecialPrice[v.label]:p.dealer;
      } else {
        unitP=getPriceForVariantMode(p,v,mode);
      }
      S.cart.push({
        pid:S.varPid,name:p.name,emoji:p.emoji,cat:p.cat,
        variant:v.label,trCode:v.trCode,barcode:v.barcode,
        qty,mode,dp:p.dealer,wp:p.wholesale,p50:v.price50,p6:v.price6,unitPrice:unitP,
        specialPrice:mode==='special'?(S.varSpecialPrice[v.label]||null):null,
        specialReason:(S.varSpecialReason[v.label]||''),
      });
    }
  });
  closeSheet('varSheet'); renderCart(); renderPgrid();
}

// ═══ CART ═══
function lineTotal(it){return it.unitPrice*it.qty;}

function syncCartFreeItems(){
  S.cart.forEach(function(ci){
    var vkey=ci.pid+'||'+ci.variant;
    if(S.varFreeItems[vkey]) ci.freeItems=JSON.parse(JSON.stringify(S.varFreeItems[vkey]));
  });
}
function renderCart(){
  var cc=document.getElementById('cartCard'),ch=document.getElementById('cartHint'),sw=document.getElementById('sumWrap');
  if(!S.cart.length){cc.style.display='none';ch.style.display='block';sw.style.display='none';return;}
  cc.style.display='block';ch.style.display='none';sw.style.display='block';
  document.getElementById('cartBg').textContent=S.cart.length;
  var cartHtml=S.cart.map(function(it,idx){
    var lt=lineTotal(it);
    var modeLabel=it.mode==='dealer'?'Dealer':it.mode==='wholesale'?'WS':it.mode==='p50'?'50ลัง':it.mode==='p6'?'6ลัง':'⭐ พิเศษ';
    var modeClass=it.mode==='dealer'?'b-d':it.mode==='wholesale'?'b-ws':it.mode==='p50'?'b-50':it.mode==='p6'?'b-6':'b-sp';
    var freeHtml='';
    if(it.freeItems&&it.freeItems.length){
      freeHtml='<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">'
        +it.freeItems.map(function(fi){
          return '<span style="font-size:9px;padding:2px 7px;border-radius:5px;background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;font-weight:700;">'
            +(fi.type==='tester'?'🧪 Tester':'🎁 ของแถม')+' '+fi.qty+' ชิ้น</span>';
        }).join('')+'</div>';
    }
    return '<div class="citem">'
      +'<div class="citem-hd">'
      +'<div class="citem-em">'+it.emoji+'</div>'
      +'<div class="citem-info">'
      +'<div class="citem-name">'+it.name+'</div>'
      +'<div style="font-size:11px;color:var(--text2);font-weight:600;">'+it.variant+'</div>'
      +'<div style="display:flex;gap:4px;margin-top:2px;flex-wrap:wrap;align-items:center;">'
      +(it.trCode?'<span class="var-sku">TR '+it.trCode+'</span>':'')
      +'<span class="b '+modeClass+'">'+modeLabel+'</span>'
      +(it.skuNote?'<span style="font-size:9px;color:#92400e;background:#fffbeb;border:1px solid #fcd34d;border-radius:5px;padding:1px 5px;">📝 '+it.skuNote+'</span>':'')
      +'</div>'
      +freeHtml
      +'</div>'
      +'<button class="citem-rm" onclick="rmItem('+idx+')">×</button>'
      +'</div>'
      +'<div class="crow" style="background:var(--surface);border-radius:8px;padding:6px 8px;">'
      +'<div class="qtyctrl">'
      +'<button class="qtybtn" onclick="chQty('+idx+',-1)">−</button>'
      +'<input class="qtynum" type="number" min="1" value="'+it.qty+'" onchange="stQty('+idx+',this.value)">'
      +'<button class="qtybtn" onclick="chQty('+idx+',1)">+</button>'
      +'</div>'
      +'<span style="flex:1;font-size:12px;color:var(--text2);">฿'+it.unitPrice+' × '+it.qty+' ชิ้น</span>'
      +'<span style="font-size:13px;font-weight:700;color:var(--pink);">฿'+lt.toLocaleString()+'</span>'
      +'</div>'
      +'</div>';
  }).join('');
  document.getElementById('cartItems').innerHTML=cartHtml;
  updSum();
  updateDisc2pctBar();
}
function updSum(){
  var subtotal=S.cart.reduce(function(s,i){return s+lineTotal(i);},0);
  var discAmt=S.billDiscount2pct?Math.round(subtotal*0.02):0;
  var grandTotal=subtotal-discAmt;
  document.getElementById('gtotal').textContent=grandTotal.toLocaleString();
  document.getElementById('tqty').textContent=S.cart.reduce(function(s,i){return s+i.qty;},0);
  var discRow=document.getElementById('discountRow');
  if(discRow){
    if(S.billDiscount2pct&&discAmt>0){
      discRow.style.display='flex';
      discRow.innerHTML='<span style="font-size:11px;color:#92400e;font-weight:700;">💳 ส่วนลด 2% ('+S.selCust.creditTerm+')</span>'
        +'<span style="font-size:12px;font-weight:700;color:#dc2626;">−฿'+discAmt.toLocaleString()+'</span>';
    } else {
      discRow.style.display='none';
    }
  }
}
function rmItem(idx){S.cart.splice(idx,1);renderCart();renderPgrid();}
function rmProd(pid){S.cart=S.cart.filter(function(c){return c.pid!==pid;});renderCart();renderPgrid();}
function chQty(i,d){S.cart[i].qty=Math.max(1,S.cart[i].qty+d);renderCart();}
function stQty(i,v){S.cart[i].qty=Math.max(1,parseInt(v)||1);renderCart();}

// ═══ DRAFT ═══
function saveDraft(){
  if(!S.selCust){alert('กรุณาเลือกลูกค้า');return;}
  if(!S.cart.length){alert('กรุณาเลือกสินค้า');return;}
  const now=new Date();
  const ref='DFT-'+orderFmtD(now)+'-'+String(S.orders.filter(o=>o.status==='draft').length+1).padStart(3,'0');
  const grand=S.cart.reduce((s,i)=>s+lineTotal(i),0);
  S.orders.unshift({
    ref,status:'draft',custId:S.selCust.id,custName:S.selCust.name,sales:CURRENT_SALES,
    items:JSON.parse(JSON.stringify(S.cart)),total:grand,
    note:document.getElementById('orderNote').value,
    attachments:S.orderAttachments.map(function(a){return {name:a.name,size:a.size};}),
    billDiscount2pct:S.billDiscount2pct,
    timestamp:now.toISOString(),
  });
  orderUpdateBadge(); renderOrds();
  resetOrder();
  orderGoTab('orders');
}

// ═══ CONFIRM ═══
function openConfirm(){ syncCartFreeItems();
  if(!S.selCust){alert('กรุณาเลือกลูกค้า');return;}
  if(!S.cart.length){alert('กรุณาเลือกสินค้า');return;}
  const grand=S.cart.reduce((s,i)=>s+lineTotal(i),0);
  var subtotal=S.cart.reduce(function(s,i){return s+lineTotal(i);},0);
  var discAmt=S.billDiscount2pct?Math.round(subtotal*0.02):0;
  var attachInfo=S.orderAttachments.length>0?' · 📎 '+S.orderAttachments.length+' ไฟล์':'';
  var creditTerm=S.selCust&&S.selCust.creditTerm?S.selCust.creditTerm:'—';
  document.getElementById('confContent').innerHTML=
    '<div class="mrow"><span class="mrl">ร้านค้า</span><span class="mrv">'+S.selCust.name+'</span></div>'
    +'<div class="mrow"><span class="mrl">รหัส</span><span class="mrv">'+S.selCust.id+'</span></div>'
    +'<div class="mrow"><span class="mrl">ประเภทราคา</span><span class="mrv">'+(S.selCust.priceType||S.selCust.type||'—')+'</span></div>'
    +'<div class="mrow"><span class="mrl">เงื่อนไขเครดิต</span><span class="mrv">'+creditTerm+'</span></div>'
    +'<div class="mrow"><span class="mrl">Sales</span><span class="mrv">'+CURRENT_SALES+'</span></div>'
    +'<div class="mrow"><span class="mrl">วันที่</span><span class="mrv">'+orderDtStr(new Date())+attachInfo+'</span></div>'
    +(discAmt>0?'<div class="mrow" style="background:#fffbeb;"><span class="mrl" style="color:#92400e;">💳 ส่วนลด 2%</span><span class="mrv" style="color:#dc2626;">−฿'+discAmt.toLocaleString()+'</span></div>':'')
    +'<div style="margin:10px 0 5px;font-size:10px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:1px;">รายการ ('+S.cart.length+' SKU)</div>'
    +S.cart.map(function(it){
      var lt=lineTotal(it);
      var pl=modeLbl(it);
      var freeStr=it.freeItems&&it.freeItems.length?' + '+it.freeItems.map(function(f){return (f.type==='tester'?'🧪':'🎁')+f.qty;}).join(' '):'';
      return '<div class="mrow"><span class="mrl">'+it.emoji+' '+it.name+'<br><span style="font-size:9px;">'+it.variant+' · '+pl+' × '+it.qty+freeStr+'</span>'+(it.skuNote?'<br><span style="font-size:9px;color:#92400e;">📝 '+it.skuNote+'</span>':'')+'</span><span class="mrv">฿'+lt.toLocaleString()+'</span></div>';
    }).join('');
  var grandAfterDisc=grand-discAmt;
  document.getElementById('confTotal').textContent=grandAfterDisc.toLocaleString();
  openSheet('confirmSheet');
}
function modeLbl(it){
  if(it.mode==='dealer') return `Dealer ฿${it.dp}`;
  if(it.mode==='wholesale') return `WS ฿${it.wp}`;
  if(it.mode==='p50') return `50ลัง ฿${it.p50}`;
  if(it.mode==='p6') return `6ลัง ฿${it.p6}`;
  if(it.mode==='special') return `⭐ ราคาพิเศษ ฿${it.unitPrice}${it.specialReason?' ('+it.specialReason+')':''}`;
  return `฿${it.unitPrice}`;
}
function doConfirm(){
  const now=new Date();
  const ref='ORD-'+orderFmtD(now)+'-'+String(S.orders.filter(o=>o.status==='confirmed').length+1).padStart(3,'0');
  var subtotalDC=S.cart.reduce(function(s,i){return s+lineTotal(i);},0);
  var discAmtDC=S.billDiscount2pct?Math.round(subtotalDC*0.02):0;
  const grand=subtotalDC-discAmtDC;
  // Auto-generate SO number (mockup): SO + 9-digit sequence
  var maxSO=260300207;
  S.orders.forEach(function(o){ if(o.soNumber&&o.soNumber.startsWith('SO')){var n=parseInt(o.soNumber.slice(2));if(!isNaN(n)&&n>maxSO)maxSO=n;} });
  var soNumber='SO'+String(maxSO+1);
  const order={
    ref,status:'confirmed',custId:S.selCust.id,custName:S.selCust.name,sales:CURRENT_SALES,
    items:JSON.parse(JSON.stringify(S.cart)),total:grand,
    soNumber:soNumber,
    note:document.getElementById('orderNote').value,
    attachments:S.orderAttachments.map(function(a){return {name:a.name,size:a.size};}),
    billDiscount2pct:S.billDiscount2pct,
    timestamp:now.toISOString(),
  };
  S.orders.unshift(order); S.lastOrderRef=ref;
  closeSheet('confirmSheet');
  showSuccessPage(order);
  orderUpdateBadge(); renderOrds();
}
function showSuccessPage(order){
  document.getElementById('formWrap').style.display='none';
  document.getElementById('successSc').classList.add('show');
  document.getElementById('sRef').textContent=order.ref;
  document.getElementById('sStore').textContent='🏪 '+order.custName;
  document.getElementById('sTime').textContent=orderDtStr(new Date(order.timestamp));
    document.getElementById('successSummary').innerHTML=
    '<div class="order-summary-title">รายการสินค้า</div>'
    +'<div style="overflow-x:auto;border:1.5px solid var(--border);border-radius:10px;margin-bottom:4px;">'
    +'<table style="width:100%;border-collapse:collapse;font-size:12px;min-width:380px;">'
    +'<thead><tr style="background:var(--pink-ll);border-bottom:1.5px solid var(--border);">'
    +'<th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text2);width:80px;">TR Code</th>'
    +'<th style="padding:6px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text2);">ชื่อสินค้า / SKU</th>'
    +'<th style="padding:6px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);white-space:nowrap;">ราคา</th>'
    +'<th style="padding:6px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);">จำนวน</th>'
    +'<th style="padding:6px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);white-space:nowrap;">Tester/ของแถม</th>'
    +'<th style="padding:6px 10px;text-align:right;font-size:10px;font-weight:800;color:var(--text2);">รวม</th>'
    +'</tr></thead><tbody>'
    +order.items.map(function(it,idx){var lt=lineTotal(it);
      var modeLabel=it.mode==='dealer'?'D':it.mode==='wholesale'?'WS':it.mode==='p50'?'50ลัง':it.mode==='p6'?'6ลัง':'⭐';
      var modeColor=it.mode==='dealer'?'background:var(--pink-m);color:#fff;':it.mode==='wholesale'?'background:#059669;color:#fff;':'background:#f59e0b;color:#fff;';
      var rowBg=idx%2===0?'background:#fff;':'background:var(--surface);';
      var freeStr=it.freeItems&&it.freeItems.length?it.freeItems.map(function(f){return '<span style="font-size:9px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:1px 5px;font-weight:700;color:#166534;">'+(f.type==='tester'?'🧪':'🎁')+' '+f.qty+'</span>';}).join(' '):''; 
      return '<tr style="'+rowBg+'border-bottom:1px solid var(--border);">'
        +'<td style="padding:8px 10px;vertical-align:middle;">'
          +(it.trCode?'<span style="font-size:14px;font-weight:900;font-family:monospace;color:var(--pink-d);background:var(--pink-ll);padding:3px 8px;border-radius:6px;display:inline-block;">'+it.trCode+'</span>':'<span style="font-size:10px;color:var(--text3);">—</span>')
        +'</td>'
        +'<td style="padding:8px 10px;vertical-align:middle;">'
          +'<div style="font-size:12px;font-weight:700;line-height:1.3;">'+it.emoji+' '+it.name+'</div>'
          +'<div style="font-size:11px;color:var(--text2);margin-top:1px;">'+it.variant+'</div>'
          +(it.skuNote?'<div style="font-size:9px;color:#92400e;margin-top:2px;background:#fffbeb;border-radius:4px;padding:1px 6px;display:inline-block;">📝 '+it.skuNote+'</div>':'')
          +(it.isMismatch&&it.specialReason?'<div style="font-size:9px;color:#7c3aed;margin-top:2px;background:#f5f3ff;border-radius:4px;padding:1px 6px;display:inline-block;">⚠️ ราคาพิเศษ: '+it.specialReason+'</div>':'')
          +(freeStr?'<div style="margin-top:3px;display:flex;gap:3px;flex-wrap:wrap;">'+freeStr+'</div>':'')
        +'</td>'
        +'<td style="padding:8px 10px;text-align:center;vertical-align:middle;white-space:nowrap;">'
          +'<span style="font-size:10px;font-weight:800;padding:2px 6px;border-radius:5px;'+modeColor+'">'+modeLabel+'</span>'
          +'<div style="font-size:12px;font-weight:700;margin-top:2px;">฿'+it.unitPrice+'</div>'
        +'</td>'
        +'<td style="padding:8px 10px;text-align:center;vertical-align:middle;font-size:14px;font-weight:800;">'+it.qty+'</td>'
        +(function(){
          var fi2=it.freeItems||[];
          var total2=fi2.reduce(function(s,f){return s+f.qty;},0);
          if(!total2) return '<td style="padding:8px 10px;text-align:center;vertical-align:middle;"><span style="color:var(--text3);font-size:9px;">—</span></td>';
          return '<td style="padding:8px 10px;text-align:center;vertical-align:middle;font-size:13px;font-weight:800;color:#166534;">'+total2+'</td>';
        })()
        +'<td style="padding:8px 10px;text-align:right;vertical-align:middle;font-size:13px;font-weight:800;color:var(--pink);white-space:nowrap;">฿'+lt.toLocaleString()+'</td>'
        +'</tr>';}).join('')
    +'</tbody></table></div>'
    +(order.billDiscount2pct?'<div class="sum-row" style="background:#fffbeb;border-radius:6px;padding:4px 8px;"><div class="sum-name" style="color:#92400e;">💳 ส่วนลด 2%</div><div class="sum-price" style="color:#dc2626;">−฿'+Math.round(order.items.reduce(function(s,i){return s+lineTotal(i);},0)*0.02).toLocaleString()+'</div></div>':'');
  document.getElementById('sTotalVal').textContent=order.total.toLocaleString();
}
function openReportForLast(){if(S.lastOrderRef)openReport(S.lastOrderRef);}

// ═══ FILE ATTACHMENTS ═══
function handleOrderAttach(input){
  if(!input.files||!input.files.length) return;
  for(var i=0;i<input.files.length;i++){
    var f=input.files[i];
    if(S.orderAttachments.length>=5){showToast('แนบได้สูงสุด 5 ไฟล์');break;}
    S.orderAttachments.push({name:f.name,size:f.size,file:f});
  }
  input.value='';
  renderAttachments();
}
function removeAttachment(idx){
  S.orderAttachments.splice(idx,1);
  renderAttachments();
}
function renderAttachments(){
  var el=document.getElementById('attList');
  if(!el) return;
  el.innerHTML=S.orderAttachments.map(function(a,i){
    var kb=Math.round(a.size/1024);
    var icon='📎';
    if(a.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) icon='🖼️';
    else if(a.name.match(/\.pdf$/i)) icon='📄';
    else if(a.name.match(/\.(xlsx|xls|csv)$/i)) icon='📊';
    return '<div style="display:flex;align-items:center;gap:6px;padding:5px 8px;background:var(--surface);border:1px solid var(--border);border-radius:7px;margin-top:4px;">'
      +'<span style="font-size:13px;">'+icon+'</span>'
      +'<span style="flex:1;font-size:11px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+a.name+'</span>'
      +'<span style="font-size:9px;color:var(--text3);">'+kb+'KB</span>'
      +'<button onclick="removeAttachment('+i+')" style="background:none;border:none;cursor:pointer;color:var(--cancel);font-size:14px;padding:0 2px;line-height:1;">×</button>'
      +'</div>';
  }).join('');
}

function resetOrder(){
  S.cart=[];S.selCust=null;S.lastOrderRef=null;
  S.varModes={};S.varSelections={};S.varSpecialPrice={};S.varSpecialReason={};
  S.varSkuNotes={};S.varFreeItems={};S.billDiscount2pct=false;S.orderAttachments=[];
  S.varMismatch={};
  S.varSkuNotes={};S.varFreeItems={};S.billDiscount2pct=false;S.orderAttachments=[];
  document.getElementById('formWrap').style.display='block';
  document.getElementById('successSc').classList.remove('show');
  document.getElementById('cSearch').value='';
  document.getElementById('pSearch').value='';
  document.getElementById('orderNote').value='';
  var attList=document.getElementById('attList');
  if(attList) attList.innerHTML='';
  S.cat='ทั้งหมด'; buildCats(); renderCusts(); renderCart(); renderPgrid();
}

// ═══ ORDERS LIST ═══
function setDF(v,el){
  S.dateFilter=v;
  document.querySelectorAll('#dateChips .chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  var dr=document.getElementById('ord-date-range');
  if(dr) dr.style.display=(v==='custom')?'flex':'none';
  if(v!=='custom') renderOrds();
}
function setDFCustom(){
  var f=document.getElementById('ordDateFrom');
  var t=document.getElementById('ordDateTo');
  if(f&&f.value&&t&&t.value) renderOrds();
}
function setOStatus(v,el){
  S.statusFilter=v;
  document.querySelectorAll('#statusChips .chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active'); renderOrds();
}
function setSOFilter(v,el){
  S.soFilter=v;
  document.querySelectorAll('#soFilterChips .chip').forEach(function(c){
    c.classList.remove('active');
  });
  el.classList.add('active');
  renderOrds();
}
function renderOrds(){
  const q=(document.getElementById('oSearch').value||'').toLowerCase().trim();
  document.getElementById('oClr').classList.toggle('show',q.length>0);
  const now=new Date();
  const filtered=S.orders.filter(o=>{
    const ms=S.statusFilter==='all'||o.status===S.statusFilter;
    const mso=(S.soFilter==='all')
      ||(S.soFilter==='no_so'&&(o.status!=='approved'||(o.status==='draft')))
      ||(S.soFilter==='has_so'&&o.status==='approved');
    const mq=!q||o.custName.toLowerCase().includes(q)||o.ref.toLowerCase().includes(q)||o.custId.includes(q);
    const ts=new Date(o.timestamp);
    const md=(()=>{
      if(S.dateFilter==='all') return true;
      if(S.dateFilter==='today'){const d=new Date();d.setHours(0,0,0,0);return ts>=d;}
      if(S.dateFilter==='7'||S.dateFilter==='14'||S.dateFilter==='30'){
        const days=parseInt(S.dateFilter);
        const d=new Date();d.setDate(d.getDate()-days);d.setHours(0,0,0,0);return ts>=d;
      }
      if(S.dateFilter==='week'){const d=new Date();d.setDate(d.getDate()-6);d.setHours(0,0,0,0);return ts>=d;}
      if(S.dateFilter==='month'){return ts.getMonth()===now.getMonth()&&ts.getFullYear()===now.getFullYear();}
      if(S.dateFilter==='custom'){
        const fEl=document.getElementById('ordDateFrom');
        const tEl=document.getElementById('ordDateTo');
        const fv=fEl&&fEl.value?new Date(fEl.value).getTime():null;
        const tv=tEl&&tEl.value?new Date(tEl.value).getTime()+86400000:null;
        if(fv&&ts<fv) return false;
        if(tv&&ts>tv) return false;
        return true;
      }
      return true;
    })();
    return ms&&mq&&md&&mso;
  });
  const rev=filtered.filter(o=>o.status==='confirmed').reduce((s,o)=>s+o.total,0);
  const units=filtered.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0);
  const drafts=filtered.filter(o=>o.status==='draft').length;
  const uniqueCusts=new Set(filtered.map(o=>o.custId)).size;
  document.getElementById('oStats').innerHTML=[
    {l:'ยืนยันแล้ว',v:filtered.filter(o=>o.status==='confirmed').length,c:'var(--pink)'},
    {l:'สร้าง SO แล้ว',v:filtered.filter(o=>o.status==='approved').length,c:'#059669'},
    {l:'แบบร่าง',v:drafts,c:'var(--cancel)'},
    {l:'ลูกค้ารวม',v:uniqueCusts,c:'var(--pink-m)'},
    {l:'ยอดรวม',v:'฿'+rev.toLocaleString(),c:'var(--text)'},
    {l:'ชิ้นรวม',v:units,c:'var(--success)'},
  ].map(s=>`<div class="ssc"><div class="ssc-lbl">${s.l}</div><div class="ssc-val" style="color:${s.c}">${s.v}</div></div>`).join('');
  const el=document.getElementById('ordsList');
  if(!filtered.length){el.innerHTML='<div class="empty"><div class="empty-ico">📦</div><div class="empty-txt">ไม่พบ Order</div></div>';return;}
  el.innerHTML=filtered.map(o=>{
    const isDraft=o.status==='draft';
    const units=o.items.reduce((s,i)=>s+i.qty,0);
    const modes=[...new Set(o.items.map(i=>i.mode))];
    return `<div class="ocard ${isDraft?'is-draft':''}" onclick="openDetail('${o.ref}')">
      <div class="ocard-top">
        <div style="min-width:0;"><div class="o-store">${o.custName}</div><div class="o-id">${o.ref}</div>
        ${(!isDraft&&o.soNumber)?`<div style="font-size:11px;font-family:monospace;font-weight:700;color:#7C3AED;margin-top:2px;letter-spacing:.3px">📄 ${o.soNumber}</div>`:''}
        </div>
        <div class="o-amt ${isDraft?'draft-amt':''}">฿${o.total.toLocaleString()}</div>
      </div>
      <div class="otags">
        ${isDraft?'<span class="b b-draft">✏️ แบบร่าง</span>':o.status==='approved'?'<span class="b b-ok" style="background:#d1fae5;color:#065f46;border-color:#6ee7b7;">✅ SO แล้ว</span>':'<span class="b b-ok">✓ ยืนยัน</span>'}
        <span class="b b-sales">${o.sales}</span>
        ${modes.includes('dealer')?'<span class="b b-d">Dealer</span>':''}
        ${modes.includes('wholesale')?'<span class="b b-ws">WS</span>':''}
        ${modes.includes('p50')?'<span class="b b-50">50ลัง</span>':''}
        ${modes.includes('p6')?'<span class="b b-6">6ลัง</span>':''}
      </div>
      <div class="oprv">${o.items.map(i=>`${i.emoji} ${i.variant} ×${i.qty}`).join('  ·  ')}</div>
      <div class="ofoot">
        <span class="otime">🕐 ${orderDtStr(new Date(o.timestamp))}</span>
        <span class="oqty">${units} ชิ้น · ${o.items.length} SKU</span>
      </div>
    </div>`;
  }).join('');
}
function clearOS(){document.getElementById('oSearch').value='';renderOrds();}

// ═══ DETAIL ═══
function openDetail(ref){
  const o=S.orders.find(x=>x.ref===ref);if(!o)return;
  const isDraft=o.status==='draft';
  document.getElementById('dtTitle').textContent=o.custName;
  document.getElementById('dtRef').textContent=o.ref;
  const units=o.items.reduce((s,i)=>s+i.qty,0);
  document.getElementById('dtBody').innerHTML=`
    <div class="dmeta">
      <div class="dmi"><div class="dmi-lbl">Sales</div><div class="dmi-val">${o.sales}</div></div>
      <div class="dmi"><div class="dmi-lbl">สถานะ</div><div class="dmi-val" style="color:${isDraft?'var(--cancel)':'var(--success)'};">${isDraft?'✏️ แบบร่าง':'✓ ยืนยัน'}</div></div>
      <div class="dmi"><div class="dmi-lbl">วันที่</div><div class="dmi-val" style="font-size:11px;">${orderDtStr(new Date(o.timestamp))}</div></div>
      <div class="dmi"><div class="dmi-lbl">จำนวน</div><div class="dmi-val">${units} ชิ้น (${o.items.length} SKU)</div></div>
      ${o.note?`<div class="dmi full"><div class="dmi-lbl">หมายเหตุ</div><div class="dmi-val" style="font-size:11px;">${o.note}</div></div>`:''}
    </div>
    <div style="font-size:10px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;">รายการสินค้า</div>
    <div style="overflow-x:auto;border:1.5px solid var(--border);border-radius:10px;margin-bottom:4px;">
    <table style="width:100%;border-collapse:collapse;font-size:12px;min-width:480px;">
      <thead><tr style="background:var(--pink-ll);border-bottom:1.5px solid var(--border);">
        <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text2);white-space:nowrap;width:85px;">TR Code</th>
        <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text2);">ชื่อสินค้า / SKU</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);white-space:nowrap;">ราคา/ชิ้น</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);">จำนวน</th>
        <th style="padding:7px 10px;text-align:right;font-size:10px;font-weight:800;color:var(--text2);">รวม</th>
        <th style="padding:7px 10px;text-align:center;font-size:10px;font-weight:800;color:var(--text2);white-space:nowrap;">Tester/ของแถม</th>
        <th style="padding:7px 10px;text-align:left;font-size:10px;font-weight:800;color:var(--text2);">หมายเหตุ</th>
      </tr></thead>
      <tbody>
    ${o.items.map(function(it,idx){
      var lt=lineTotal(it);
      var modeLabel=it.mode==='dealer'?'D':it.mode==='wholesale'?'WS':it.mode==='p50'?'50ลัง':it.mode==='p6'?'6ลัง':'⭐';
      var modeColor=it.mode==='dealer'?'background:var(--pink-m);color:#fff;':it.mode==='wholesale'?'background:#059669;color:#fff;':'background:#f59e0b;color:#fff;';
      var rowBg=idx%2===0?'background:#fff;':'background:var(--surface);';
      var freeStr=it.freeItems&&it.freeItems.length?it.freeItems.map(function(f){return '<span style="font-size:9px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:1px 5px;font-weight:700;color:#166534;">'+(f.type==='tester'?'🧪':'🎁')+' '+f.qty+'</span>';}).join(' '):'';
      return '<tr style="'+rowBg+'border-bottom:1px solid var(--border);">'
        +'<td style="padding:8px 10px;vertical-align:middle;">'
          +(it.trCode?'<span style="font-size:14px;font-weight:900;font-family:monospace;color:var(--pink-d);background:var(--pink-ll);padding:3px 8px;border-radius:6px;display:inline-block;letter-spacing:0.5px;">'+it.trCode+'</span>':'<span style="font-size:10px;color:var(--text3);">—</span>')
        +'</td>'
        +'<td style="padding:8px 10px;vertical-align:middle;">'
          +'<div style="font-size:12px;font-weight:700;color:var(--text);line-height:1.3;">'+it.emoji+' '+it.name+'</div>'
          +'<div style="font-size:11px;color:var(--text2);margin-top:2px;">'+it.variant+'</div>'
          +(it.barcode?'<div style="font-size:9px;color:var(--text3);font-family:monospace;margin-top:1px;">'+it.barcode+'</div>':'')
          +(it.skuNote?'<div style="font-size:9px;color:#92400e;margin-top:2px;background:#fffbeb;border-radius:4px;padding:1px 6px;display:inline-block;">📝 '+it.skuNote+'</div>':'')
          +(it.isMismatch&&it.specialReason?'<div style="font-size:9px;color:#7c3aed;margin-top:2px;background:#f5f3ff;border-radius:4px;padding:1px 6px;display:inline-block;">⚠️ ราคาพิเศษ: '+it.specialReason+'</div>':'')
          +(it.mode==='special'&&it.specialReason&&!it.isMismatch?'<div style="font-size:9px;color:#b45309;margin-top:2px;background:#fffbeb;border-radius:4px;padding:1px 6px;display:inline-block;">⭐ '+it.specialReason+'</div>':'')
          +(freeStr?'<div style="margin-top:3px;display:flex;gap:3px;flex-wrap:wrap;">'+freeStr+'</div>':'')
        +'</td>'
        +'<td style="padding:8px 10px;text-align:center;vertical-align:middle;white-space:nowrap;">'
          +'<span style="font-size:10px;font-weight:800;padding:2px 7px;border-radius:5px;'+modeColor+'">'+modeLabel+'</span>'
          +'<div style="font-size:12px;font-weight:700;color:var(--text);margin-top:3px;">฿'+it.unitPrice+'</div>'
          +(it.mode==='special'&&it.specialReason?'<div style="font-size:9px;color:#92400e;">'+it.specialReason+'</div>':'')
        +'</td>'
        +'<td style="padding:8px 10px;text-align:center;vertical-align:middle;font-size:14px;font-weight:800;color:var(--text);">'+it.qty+'</td>'
        +'<td style="padding:8px 10px;text-align:right;vertical-align:middle;font-size:13px;font-weight:800;color:var(--pink);white-space:nowrap;">฿'+lt.toLocaleString()+'</td>'
        +(function(){
          var fi=it.freeItems||[];
          var total=fi.reduce(function(s,f){return s+f.qty;},0);
          if(!total) return '<td style="padding:8px 10px;text-align:center;vertical-align:middle;"><span style="font-size:11px;color:var(--text3);">—</span></td>';
          return '<td style="padding:8px 10px;text-align:center;vertical-align:middle;font-size:14px;font-weight:800;color:#166534;">'+total+'</td>';
        })()
        +'<td style="padding:8px 10px;text-align:left;vertical-align:middle;font-size:11px;color:var(--text2);">'
          +(it.skuNote?'<span style="display:inline-block;background:#fffbeb;border-radius:4px;padding:1px 6px;color:#92400e;font-weight:600;">📝 '+it.skuNote+'</span>':'<span style="color:var(--text3);">—</span>')
          +(it.specialReason&&it.isMismatch?'<div style="font-size:9px;color:#7c3aed;background:#f5f3ff;border-radius:4px;padding:1px 6px;margin-top:2px;display:inline-block;">⚠️ '+it.specialReason+'</div>':'')
        +'</td>'
        +'</tr>';
    }).join('')}
      </tbody>
    </table></div>
    <div class="dtot"><span class="dtot-lbl">ยอดรวม</span><span class="dtot-val">฿${o.total.toLocaleString()}</span></div>
    ${isDraft?`
    <button class="btn btn-p" style="margin-top:14px;margin-bottom:8px;" onclick="confirmDraft('${o.ref}')">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      ยืนยัน Order
    </button>`
    :(o.status==='confirmed'?`
    <div style="margin-top:14px;margin-bottom:10px;background:#F5F3FF;border:1.5px solid #C4B5FD;border-radius:10px;padding:12px 14px">
      <div style="font-size:11px;font-weight:800;color:#5B21B6;margin-bottom:10px;display:flex;align-items:center;gap:5px">
        🔗 เลข SO &amp; ST Reference
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <div style="flex:1;min-width:140px;">
          <div style="font-size:10px;font-weight:700;color:#7C3AED;margin-bottom:4px;">SO Number <span style="color:var(--danger);">* บังคับกรอก</span></div>
          <input id="so-ref-input-${o.ref}" type="text" placeholder="เช่น SO260300122"
            value="${o.soRef||''}"
            style="width:100%;padding:7px 10px;border:1.5px solid #C4B5FD;border-radius:7px;font-size:13px;font-family:monospace;font-weight:700;color:#1A1A1A;background:#fff;box-sizing:border-box;outline:none;"
            oninput="soRefInputChange('${o.ref}',this.value)"
            onfocus="this.style.borderColor='#7C3AED'"
            onblur="this.style.borderColor='#C4B5FD'">
          <div id="so-ref-err-${o.ref}" style="display:none;font-size:10px;color:var(--danger);margin-top:3px;font-weight:600;">⚠ กรุณากรอก SO Number</div>
        </div>
        <div style="flex:1;min-width:140px;">
          <div style="font-size:10px;font-weight:700;color:#6366f1;margin-bottom:4px;">ST Reference Number <span style="font-size:9px;color:var(--text3);">(ถ้ามี)</span></div>
          <input id="st-ref-input-${o.ref}" type="text" placeholder="เช่น ST260300100"
            value="${o.stRef||''}"
            style="width:100%;padding:7px 10px;border:1.5px solid #C7D2FE;border-radius:7px;font-size:13px;font-family:monospace;font-weight:700;color:#1A1A1A;background:#fff;box-sizing:border-box;outline:none;"
            oninput="stRefInputChange('${o.ref}',this.value)"
            onfocus="this.style.borderColor='#6366f1'"
            onblur="this.style.borderColor='#C7D2FE'">
        </div>
      </div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:8px;">
      <button class="btn" style="background:linear-gradient(135deg,#059669,#047857);color:#fff;box-shadow:0 4px 14px rgba(5,150,105,.28);padding:10px 22px;font-size:13px;font-weight:800;" onclick="approveOrder('${o.ref}')">
        ✅ สร้าง Sales Order เสร็จแล้ว
      </button>
    </div>`
    :(o.status==='approved'?`
    <div style="margin-top:14px;margin-bottom:8px;background:#ECFDF5;border:1.5px solid #6EE7B7;border-radius:10px;padding:10px 14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:16px;">✅</span>
          <div style="font-size:12px;font-weight:800;color:#065F46;">Sales Order สร้างแล้ว</div>
        </div>
        <button onclick="editSORef('${o.ref}')" style="padding:5px 14px;border-radius:7px;border:1.5px solid #6EE7B7;background:#fff;cursor:pointer;font-size:11px;font-weight:800;color:#065F46;font-family:inherit;">✏️ แก้ไข</button>
      </div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <div><span style="font-size:10px;color:#059669;">SO: </span><span style="font-family:monospace;font-size:13px;font-weight:900;color:#047857;">${o.soRef||'—'}</span></div>
        ${o.stRef?'<div><span style="font-size:10px;color:#6366f1;">ST: </span><span style="font-family:monospace;font-size:13px;font-weight:900;color:#4338CA;">'+o.stRef+'</span></div>':''}
      </div>
    </div>`:''
    )
    )}
    <div style="display:flex;gap:8px;margin-top:${isDraft?'0':'14px'};">
      <button class="btn-export" style="flex:1;justify-content:center;" onclick="openReport('${o.ref}')">
        📤 Export Report
      </button>
      <button class="btn btn-danger btn-sm" style="flex-shrink:0;" onclick="showDelConfirm('${o.ref}')">
        🗑️ ลบ
      </button>
    </div>
    <div class="del-confirm" id="delConf-${o.ref}">
      <p>ยืนยันลบ Order นี้?<br>การกระทำนี้ไม่สามารถย้อนกลับได้</p>
      <div class="del-btns">
        <button class="btn btn-danger btn-sm" onclick="deleteOrder('${o.ref}')">ลบถาวร</button>
        <button class="btn btn-s btn-sm" onclick="hideDelConfirm('${o.ref}')">ยกเลิก</button>
      </div>
    </div>`;
  openSheet('detailSheet');
}
function showDelConfirm(ref){document.getElementById('delConf-'+ref).classList.add('show');}
function hideDelConfirm(ref){document.getElementById('delConf-'+ref).classList.remove('show');}
function editSORef(ref){
  var o=S.orders.find(function(x){return x.ref===ref;});
  if(!o) return;
  o.status='confirmed';
  closeSheet('detailSheet');
  setTimeout(function(){openDetail(ref);},80);
}
function stRefInputChange(ref, val){
  var o=S.orders.find(function(x){return x.ref===ref;}); if(!o) return;
  o.stRef=val.trim();
}
function soRefInputChange(ref, val){
  const o=S.orders.find(x=>x.ref===ref); if(!o) return;
  o.soRef=val.trim();
  const err=document.getElementById('so-ref-err-'+ref);
  if(err) err.style.display='none';
}

function getLatestSORef(){
  // Find highest SO number from SO_MOCK (ERP data) + confirmed orders
  var maxNum=260300122; // seed from known latest SO numbers
  // scan SO_MOCK for highest
  if(typeof SO_MOCK!=='undefined'){
    SO_MOCK.forEach(function(r){
      if(r.id&&r.id.startsWith('SO')){
        var n=parseInt(r.id.slice(2)); if(!isNaN(n)&&n>maxNum) maxNum=n;
      }
    });
  }
  // scan confirmed orders with soRef
  S.orders.forEach(function(o){
    if(o.soRef&&o.soRef.startsWith('SO')){
      var n=parseInt(o.soRef.slice(2)); if(!isNaN(n)&&n>maxNum) maxNum=n;
    }
  });
  return 'SO'+String(maxNum+1);
}

function getRecentSONumbers(){
  // Return last 4 SO numbers for display as hints
  var nums=[];
  if(typeof SO_MOCK!=='undefined'){
    SO_MOCK.forEach(function(r){ if(r.id&&r.id.startsWith('SO')){nums.push(parseInt(r.id.slice(2)));} });
  }
  nums.sort(function(a,b){return b-a;});
  var top=nums.slice(0,4);
  var next=top.length>0?(top[0]+1):260300123;
  return {recent:top.map(function(n){return 'SO'+n;}), next:'SO'+next};
}

function approveOrder(ref){
  const o=S.orders.find(x=>x.ref===ref); if(!o||o.status!=='confirmed') return;
  // Validate SO Ref
  const inp=document.getElementById('so-ref-input-'+ref);
  const soRefVal=(inp?inp.value:o.soRef||'').trim();
  if(!soRefVal){
    const err=document.getElementById('so-ref-err-'+ref);
    if(err){err.style.display='block';}
    if(inp){inp.style.borderColor='var(--danger)';inp.focus();}
    showToast('⚠ กรุณากรอก SO Number ก่อน Approve');
    return;
  }
  if(!/^SO\d+$/.test(soRefVal)){
    const err=document.getElementById('so-ref-err-'+ref);
    if(err){err.style.display='block';err.textContent='⚠ รูปแบบ SO ไม่ถูกต้อง เช่น SO260300115';}
    if(inp){inp.style.borderColor='var(--danger)';}
    showToast('⚠ รูปแบบ SO ไม่ถูกต้อง — ควรขึ้นต้นด้วย SO ตามด้วยตัวเลข');
    return;
  }
  o.soRef=soRefVal;
  o.status='approved';
  o.approvedAt=new Date().toISOString();
  closeSheet('detailSheet'); orderUpdateBadge(); renderOrds();
  showToast('✅ สร้าง Sales Order เสร็จแล้ว — SO: '+soRefVal+(o.stRef?' | ST: '+o.stRef:''));
}

function confirmDraft(ref){
  const o=S.orders.find(x=>x.ref===ref);if(!o||o.status!=='draft')return;
  const now=new Date();
  const newRef='ORD-'+orderFmtD(now)+'-'+String(S.orders.filter(x=>x.status==='confirmed').length+1).padStart(3,'0');
  o.status='confirmed';
  o.ref=newRef;
  o.timestamp=now.toISOString();
  // Auto-assign SO number
  var maxSO=260300207;
  S.orders.forEach(function(ord){ if(ord.soNumber&&ord.soNumber.startsWith('SO')){var n=parseInt(ord.soNumber.slice(2));if(!isNaN(n)&&n>maxSO)maxSO=n;} });
  o.soNumber='SO'+String(maxSO+1);
  closeSheet('detailSheet'); orderUpdateBadge(); renderOrds();
}
function deleteOrder(ref){
  S.orders=S.orders.filter(o=>o.ref!==ref);
  closeSheet('detailSheet'); orderUpdateBadge(); renderOrds();
}

// ═══ EXPORT REPORT ═══
function openReport(ref){
  const o=S.orders.find(x=>x.ref===ref);if(!o)return;
  const d=new Date(o.timestamp);
  const dateStr=d.toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'});
  const grouped={};
  o.items.forEach(it=>{
    if(!grouped[it.name]) grouped[it.name]={emoji:it.emoji,rows:[],mode:it.mode};
    grouped[it.name].rows.push(it);
  });
  let lines=[];
  lines.push('🌸 Charmiss — ใบสั่งซื้อสินค้า');
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`📋 เลข Order : ${o.ref}`);
  lines.push(`📅 วันที่    : ${dateStr}`);
  lines.push(`🏪 ร้านค้า  : ${o.custName} (#${o.custId})`);
  lines.push(`👤 Sales    : ${o.sales}`);
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push('📦 รายการสินค้า'); lines.push('');
  Object.values(grouped).forEach(g=>{
    const mLabel=g.mode==='dealer'?'Dealer':g.mode==='wholesale'?'Wholesale':g.mode==='p50'?'ราคา 50 ลัง':g.mode==='special'?'ราคาพิเศษ':'ราคา 6 ลัง';
    lines.push(`${g.emoji} ${g.rows[0].name} [${mLabel}]`);
    g.rows.forEach(it=>{
      const trStr=it.trCode?` [TR ${it.trCode}]`:'';
      const spStr=it.mode==='special'?` ⭐ราคาพิเศษ ฿${it.unitPrice}${it.specialReason?' เหตุผล:'+it.specialReason:''}`:` ฿${it.unitPrice}`;
      lines.push(`   • ${it.variant}${trStr}${spStr} × ${it.qty} ชิ้น = ฿${(it.unitPrice*it.qty).toLocaleString()}`);
    });
    lines.push('');
  });
  lines.push('━━━━━━━━━━━━━━━━━━━━');
  lines.push(`💰 ยอดรวมทั้งหมด : ฿${o.total.toLocaleString()}`);
  if(o.note) lines.push(`📝 หมายเหตุ : ${o.note}`);
  lines.push(''); lines.push('ขอบคุณที่ไว้วางใจ Charmiss 🌸');
  document.getElementById('reportText').textContent=lines.join('\n');
  document.getElementById('copyFeedback').style.display='none';
  openSheet('reportSheet');
}
function copyReport(){
  const txt=document.getElementById('reportText').textContent;
  if(navigator.clipboard){navigator.clipboard.writeText(txt);}
  else{const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);}
  const fb=document.getElementById('copyFeedback');fb.style.display='flex';
  setTimeout(()=>fb.style.display='none',2500);
}

// ═══ TABS / SHEETS / UTILS ═══
function orderGoTab(t){
  document.querySelectorAll('.order-app-wrap .page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.order-app-wrap .tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+t).classList.add('active');
  document.getElementById('tab-'+t).classList.add('active');
  if(t==='orders') renderOrds();
}
function openSheet(id){document.getElementById(id).classList.add('open');}
function orderCloseSheet(id){document.getElementById(id).classList.remove('open');}
function closeSheet(id){document.getElementById(id).classList.remove('open');}
function closeBg(e,id){if(e.target===document.getElementById(id))closeSheet(id);}
function orderFmtD(d){return d.getFullYear().toString().slice(-2)+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');}
function orderDtStr(d){return d.toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'})+' '+d.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});}


/* ══════════════════════════════════════════════════ */
/* ══ SALES ORDER PAGE JS ═══════════════════════════ */
/* ══════════════════════════════════════════════════ */

// ──────────────────────────────────────────────────────
// SALES ORDER DATA
// channel: 'mt-inv'=Modern Trade มี Invoice, 'mt-noinv'=MT ไม่มี Invoice, 'tt'=Traditional Trade
// ──────────────────────────────────────────────────────
const SO_MOCK = [
  // ── MT มี Invoice (Watsons, Eveandboy, Beautrium, CJ, 24Shopping with PO ref) ──
  { id:'SO260300098', ref:'22940194',      customer:'บริษัท เซ็นทรัล วัตสัน จำกัด',         date:'2026-03-10', qty:60,   channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/11, 11:51', poFile:'Watson_PO_22940194.pdf' },
  { id:'SO260300099', ref:'POD260135171',  customer:'EVEANDBOY CO., LTD สาขาที่ 1',           date:'2026-03-10', qty:72,   channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/10, 19:29', poFile:'Eveandboy_POD260135171.pdf' },
  { id:'SO260300100', ref:'POD260135168',  customer:'EVEANDBOY CO., LTD สาขาที่ 2',           date:'2026-03-10', qty:60,   channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/10, 19:29', poFile:'Eveandboy_POD260135168.pdf' },
  { id:'SO260300101', ref:'POD260135166',  customer:'EVEANDBOY CO., LTD สาขาที่ 3',           date:'2026-03-10', qty:144,  channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/10, 19:29', poFile:'Eveandboy_POD260135166.pdf' },
  { id:'SO260300102', ref:'POD260135165',  customer:'EVEANDBOY CO., LTD สาขาที่ 4',           date:'2026-03-10', qty:132,  channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/10, 19:29', poFile:'Eveandboy_POD260135165.pdf' },
  { id:'SO260300103', ref:'BT-PO-20250805-001', customer:'บริษัท บิวเทรียม จำกัด',           date:'2026-03-10', qty:96,   channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/10, 14:20', poFile:'Beautrium_BT-PO.pdf' },
  { id:'SO260300104', ref:'PO2026020200019', customer:'บริษัท มัลตี้ บิวตี้ จำกัด',          date:'2026-03-09', qty:288,  channel:'mt-inv',   status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/09, 16:45', poFile:'Multy_PO2026020200019.pdf' },
  { id:'SO260300097', ref:'-',             customer:'บริษัท ชุติมา คอนเนค จำกัด',             date:'2026-03-10', qty:120,  channel:'mt-inv',   status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:null },
  { id:'SO260300105', ref:'22940195',      customer:'บริษัท เซ็นทรัล วัตสัน จำกัด',         date:'2026-03-08', qty:480,  channel:'mt-inv',   status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'Watson_PO_22940195.pdf' },
  { id:'SO260300106', ref:'4003280436',    customer:'บริษัท ซี.เจ. เอ็กซ์เพรส กรุ๊ป จำกัด', date:'2026-03-07', qty:432,  channel:'mt-inv',   status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'CJ_PO_4003280436.pdf' },
  // ── MT ไม่มี Invoice (no PO ref / internal SO) ──
  { id:'SO260300001', ref:'-',             customer:'บริษัท ซี.เจ. เอ็กซ์เพรส กรุ๊ป จำกัด', date:'2026-03-03', qty:432,  channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'INT_PO_SO260300001.pdf', poFileType:'internal' },
  { id:'SO260300002', ref:'-',             customer:'บริษัท ซี.เจ. เอ็กซ์เพรส กรุ๊ป จำกัด', date:'2026-03-03', qty:576,  channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'INT_PO_SO260300002.pdf', poFileType:'internal' },
  { id:'SO260300003', ref:'-',             customer:'บริษัท ทเวนตี้ไฟร์ ช้อปปิ้ง จำกัด',    date:'2026-03-06', qty:12,   channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'INT_PO_SO260300003.pdf', poFileType:'internal' },
  { id:'SO260300004', ref:'SO260300017',   customer:'บริษัท ทเวนตี้ไฟร์ ช้อปปิ้ง จำกัด',    date:'2026-03-06', qty:720,  channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:null },
  { id:'SO260300005', ref:'SO260300018',   customer:'บริษัท ทเวนตี้ไฟร์ ช้อปปิ้ง จำกัด',    date:'2026-03-06', qty:1080, channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:null },
  { id:'SO260300008', ref:'-',             customer:'น้ำหวานบิวตี้',                           date:'2026-03-04', qty:85,   channel:'mt-noinv', status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'INT_PO_SO260300008.pdf', poFileType:'internal' },
  { id:'ST260300009', ref:'SO260300021',   customer:'น้ำหวานบิวตี้',                           date:'2026-03-04', qty:7,    channel:'mt-noinv', status:'ok',   printStatus:null,         reviewer:'koranit', reviewDate:'2026/03/05, 09:30', poFile:null },
  { id:'SO260300013', ref:'22912054',      customer:'บริษัท เซ็นทรัล วัตสัน จำกัด',         date:'2026-03-02', qty:624,  channel:'mt-noinv', status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/04, 08:22', poFile:null },
  { id:'SO260300014', ref:'22912055',      customer:'บริษัท เซ็นทรัล วัตสัน จำกัด',         date:'2026-03-02', qty:120,  channel:'mt-noinv', status:'edit', printStatus:null,         reviewer:'koranit', reviewDate:'2026/03/04, 08:22', poFile:null },
  { id:'SO260300015', ref:'22911880',      customer:'941 estore-eDC Wangnoi',                  date:'2026-03-02', qty:34,   channel:'mt-noinv', status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/04, 08:33', poFile:null },
  // ── Traditional Trade (ร้านค้า TT) — Document Number มาจาก ERP ขึ้นต้นด้วย SO ──
  { id:'SO260311201', ref:'TT-260311-001', customer:'ร้านทองแสงหล้า',                     date:'2026-03-11', qty:22,   channel:'tt',       status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'TT_SO260311201.pdf' },
  { id:'SO260310202', ref:'TT-260310-002', customer:'ร้านมณีเภสัช',                        date:'2026-03-10', qty:18,   channel:'tt',       status:'wait', printStatus:null,         reviewer:null,      reviewDate:null, poFile:'TT_SO260310202.pdf' },
  { id:'SO260308203', ref:'TT-260308-003', customer:'ร้านชัยพรมงคล',                       date:'2026-03-08', qty:35,   channel:'tt',       status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/09, 10:15', poFile:'TT_SO260308203.pdf' },
  { id:'SO260305204', ref:'TT-260305-004', customer:'ร้านสิริโอสถ',                         date:'2026-03-05', qty:12,   channel:'tt',       status:'ok',   printStatus:'พิมพ์แล้ว', reviewer:'koranit', reviewDate:'2026/03/06, 14:20', poFile:'TT_SO260305204.pdf' },
  { id:'SO260303205', ref:'TT-260303-005', customer:'ร้านบิวตี้พลัส จ.เชียงใหม่',          date:'2026-03-03', qty:48,   channel:'tt',       status:'edit', printStatus:null,         reviewer:'koranit', reviewDate:'2026/03/04, 09:00', poFile:'TT_SO260303205.pdf' },
];

let soChannelFilter = 'all';

// ─── State ───
const soState = {
  data: SO_MOCK,
  filtered: [...SO_MOCK],
  selected: new Set(),
};

// ─── Init ───
let soQuickDays = 7;

function soInit() {
  soChannelFilter = 'all';
  document.querySelectorAll('.so-ch-tab').forEach(b => {
    b.style.color = 'var(--text2)';
    b.style.borderBottomColor = 'transparent';
  });
  const allTab = document.querySelector('.so-ch-tab');
  if(allTab) { allTab.style.color='var(--pink)'; allTab.style.borderBottomColor='var(--pink)'; }
  soSetQuick(7, document.querySelector('.sodtab[data-days="7"]'));
}

function soSetChannel(ch, el) {
  soChannelFilter = ch;
  document.querySelectorAll('.so-ch-tab').forEach(b => {
    b.style.color = 'var(--text2)';
    b.style.borderBottomColor = 'transparent';
    b.style.fontWeight = '600';
  });
  if(el) { el.style.color='var(--pink)'; el.style.borderBottomColor='var(--pink)'; el.style.fontWeight='700'; }
  soFilter();
}

// soHandleUpload + soUploadForRow removed — WMS handled via backend API


function soToggleDateRange(btn) {
  var dr = document.getElementById('so-date-range');
  var isOpen = dr && dr.style.display !== 'none';
  if(dr) dr.style.display = isOpen ? 'none' : 'flex';
  document.querySelectorAll('.sodtab').forEach(b => b.classList.remove('active'));
  if(!isOpen && btn) btn.classList.add('active');
}

function soSetQuick(days, el) {
  soQuickDays = days;
  document.querySelectorAll('.sodtab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  // close custom range panel
  var dr = document.getElementById('so-date-range');
  if(dr) dr.style.display = 'none';
  const today = new Date();
  const fmt = d => d.toISOString().slice(0,10);
  const from = new Date(today);
  from.setDate(today.getDate() - (days - 1));
  document.getElementById('soDateFrom').value = fmt(from);
  document.getElementById('soDateTo').value = fmt(today);
  soFilter();
}

function soApplyFilter() {
  document.querySelectorAll('.sodtab').forEach(b => {
    if(!b.id || b.id !== 'so-range-btn') b.classList.remove('active');
  });
  soFilter();
}

function soFilter() {
  const q = (document.getElementById('soSearch').value || '').toLowerCase().trim();
  const from = document.getElementById('soDateFrom').value;
  const to = document.getElementById('soDateTo').value;
  soState.filtered = soState.data.filter(row => {
    const matchCh = soChannelFilter === 'all' || row.channel === soChannelFilter;
    const matchQ = !q || row.customer.toLowerCase().includes(q) || row.id.toLowerCase().includes(q) || (row.ref||'').toLowerCase().includes(q);
    const matchFrom = !from || row.date >= from;
    const matchTo = !to || row.date <= to;
    return matchCh && matchQ && matchFrom && matchTo;
  });
  soState.selected = new Set();
  document.getElementById('soCheckAll').checked = false;
  soRender();
}

function soRender() {
  const tbody = document.getElementById('soTableBody');
  document.getElementById('soCount').textContent = 'Number of Sales Order: ' + soState.filtered.length;

  if (!soState.filtered.length) {
    tbody.innerHTML = '<tr><td colspan="11"><div class="so-empty"><div class="so-empty-ico">📋</div><div class="so-empty-txt">ไม่พบข้อมูล Sales Order</div></div></td></tr>';
    return;
  }

  tbody.innerHTML = soState.filtered.map((row, i) => {
    const isOk = row.status === 'ok';
    const isEdit = row.status === 'edit';
    const rowClass = isOk ? 'so-row-confirmed' : '';

    let statusHtml;
    if (isOk) {
      statusHtml = `<div class="so-status-wrap">
        <span class="so-status so-status-ok">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          ตรวจสอบแล้ว
        </span>
        ${row.reviewer ? `<div class="so-status-sub">${row.reviewer}<br>${row.reviewDate}</div>` : ''}
      </div>`;
    } else if (isEdit) {
      statusHtml = `<div class="so-status-wrap">
        <span class="so-status so-status-edit">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          มีการแก้ไข
        </span>
        ${row.reviewer ? `<div class="so-status-sub">${row.reviewer}<br>${row.reviewDate}</div>` : ''}
      </div>`;
    } else {
      statusHtml = `<span class="so-status so-status-wait">
        <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        รอตรวจสอบ
      </span>`;
    }

    const printHtml = row.printStatus
      ? `<span class="so-print-ok"><svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> ${row.printStatus}</span>`
      : `<span class="so-print-none">-</span>`;

    const refHtml = row.ref && row.ref !== '-' ? `<span class="so-ref">${row.ref}</span>` : `<span class="so-print-none">-</span>`;

    // Channel tag
    const chTag = row.channel === 'mt-inv'
      ? '<span style="font-size:9px;background:#dbeafe;color:#1d4ed8;border-radius:3px;padding:1px 5px;font-weight:700;display:inline-block;margin-bottom:2px">MT+INV</span>'
      : row.channel === 'tt'
      ? '<span style="font-size:9px;background:#dcfce7;color:#166534;border-radius:3px;padding:1px 5px;font-weight:700;display:inline-block;margin-bottom:2px">TT</span>'
      : '<span style="font-size:9px;background:#f3f4f6;color:#6b7280;border-radius:3px;padding:1px 5px;font-weight:700;display:inline-block;margin-bottom:2px">MT</span>';

    // PO document cell — mt-noinv gets internal PO print button
    let poDocHtml;
    if (row.channel === 'mt-noinv') {
      if (row.poFile && row.poFileType === 'internal') {
        // Internal PO document - mockup print button
        poDocHtml = `<button onclick="soPrintInternalPO('${row.id}')" title="ปริ้น ใบสั่งซื้อภายใน"
             style="display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border:1.5px solid #BBF7D0;border-radius:5px;background:#F0FDF4;color:#166534;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap"
             onmouseover="this.style.background='#DCFCE7'" onmouseout="this.style.background='#F0FDF4'">
            <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            🖨 ปริ้น ใบ PO
          </button>`;
      } else {
        poDocHtml = '<span style="color:var(--text3);font-size:11px">—</span>';
      }
    } else if (row.poFile) {
      poDocHtml = `<button onclick="soPrintPO('${row.id}','${row.poFile}')" title="พิมพ์ใบ PO: ${row.poFile}"
           style="display:inline-flex;align-items:center;gap:4px;padding:4px 9px;border:1.5px solid #BFDBFE;border-radius:5px;background:#EFF6FF;color:#1D4ED8;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap"
           onmouseover="this.style.background='#DBEAFE'" onmouseout="this.style.background='#EFF6FF'">
          <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          ${row.poFile.slice(0,18)}${row.poFile.length>18?'…':''}
        </button>`;
    } else {
      poDocHtml = '<span style="color:var(--text3);font-size:11px">—</span>';
    }

    // Upload cell removed (WMS API integration handled backend)

    return `<tr class="${rowClass}" data-idx="${i}">
      <td><input type="checkbox" class="so-row-check" data-id="${row.id}" onchange="soToggleRow(this)" ${soState.selected.has(row.id) ? 'checked' : ''}></td>
      <td>${statusHtml}</td>
      <td class="so-custname"><div>${row.customer}</div>${chTag}</td>
      <td><span class="so-docnum">${row.id}</span></td>
      <td>${refHtml}</td>
      <td class="so-date-cell">${row.date}</td>
      <td style="text-align:right; padding-right:24px;"><span class="so-qty">${row.qty.toLocaleString()}</span></td>
      <td>${printHtml}</td>
      <td style="white-space:nowrap">${poDocHtml}</td>
      <td>
        <button class="so-preview-btn" onclick="soPreview('${row.id}')" title="Preview">
          <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="13" y2="15"/><rect x="13" y="13" width="6" height="6" rx="1" fill="currentColor" opacity=".2"/><path d="M13 13v6h6"/></svg>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function soToggleAll(cb) {
  if (cb.checked) {
    soState.filtered.forEach(r => soState.selected.add(r.id));
  } else {
    soState.selected.clear();
  }
  document.querySelectorAll('.so-row-check').forEach(c => c.checked = cb.checked);
}
function soToggleRow(cb) {
  const id = cb.getAttribute('data-id');
  if (cb.checked) soState.selected.add(id); else soState.selected.delete(id);
  const allChecked = soState.filtered.every(r => soState.selected.has(r.id));
  document.getElementById('soCheckAll').checked = allChecked;
}

function soPrintSelected() {
  const ids = [...soState.selected];
  if (!ids.length) { showToast('กรุณาเลือก Sales Order ที่ต้องการพิมพ์'); return; }
  showToast('🖨️ กำลังพิมพ์ ' + ids.length + ' รายการ...');
}
function soExport() {
  const rows = soState.filtered;
  if (!rows.length) { showToast('ไม่มีข้อมูลสำหรับ Export'); return; }
  const header = ['Channel','Status','Customer Name','Document Number','Reference','Issue Date','Order Qty (pcs)','Print Status'];
  const statusLabel = s => s==='ok'?'ตรวจสอบแล้ว':s==='edit'?'มีการแก้ไข':'รอตรวจสอบ';
  const chLabel = c => c==='mt-inv'?'MT+Invoice':c==='tt'?'TT':'MT';
  const bom = '\uFEFF';
  const csvRows = [header.join(','), ...rows.map(r => [
    chLabel(r.channel), statusLabel(r.status), '"'+r.customer+'"', r.id, r.ref||'-', r.date, r.qty, r.printStatus||'-'
  ].join(','))];
  const blob = new Blob([bom + csvRows.join('\n')], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='sales_orders.csv'; a.click();
  URL.revokeObjectURL(url);
}
function soPreview(id) {
  showToast('📋 Preview: ' + id);
}

function soPrintPO(soId, filename) {
  showToast('🖨️ กำลังพิมพ์ใบ PO: ' + filename);
}

function soPrintInternalPO(id) {
  var row = soState.data.find(function(r){ return r.id === id; });
  if (!row) return;
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.45);z-index:9999;display:flex;align-items:center;justify-content:center';
  var html = '<div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:400px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:inherit">';
  html += '<div style="font-size:16px;font-weight:700;color:#166534;margin-bottom:4px">🖨 ปริ้น ใบสั่งซื้อภายใน</div>';
  html += '<div style="font-size:11.5px;color:#9CA3AF;margin-bottom:16px">Internal PO Document — ดึงจาก ERP (Mockup)</div>';
  html += '<div style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:8px;padding:14px 16px;margin-bottom:14px">';
  html += '<div style="display:flex;gap:0;flex-direction:column;gap:6px">';
  html += '<div><span style="font-size:10px;color:#6B7280;display:block">SO Document No.</span><span style="font-size:14px;font-weight:800;font-family:monospace;color:#1A1A1A">'+id+'</span></div>';
  html += '<div><span style="font-size:10px;color:#6B7280;display:block">Customer</span><span style="font-size:12.5px;font-weight:600">'+row.customer+'</span></div>';
  html += '<div style="display:flex;gap:20px"><div><span style="font-size:10px;color:#6B7280;display:block">Issue Date</span><span style="font-size:12px;font-weight:600">'+row.date+'</span></div><div><span style="font-size:10px;color:#6B7280;display:block">Qty (pcs)</span><span style="font-size:12px;font-weight:600">'+row.qty.toLocaleString()+'</span></div></div>';
  html += '</div></div>';
  html += '<div style="font-size:11px;color:#9CA3AF;margin-bottom:18px;line-height:1.6">ระบบจะดึงรายการสินค้าจาก ERP เพื่อสร้างใบสั่งซื้อสำหรับส่งมอบภายใน<br><span style="color:#D97706">⚠ ยังไม่เชื่อมต่อ API — Mockup เท่านั้น</span></div>';
  html += '<div style="display:flex;gap:8px">';
  html += '<button id="ipoConfirmBtn" style="flex:1;padding:10px;background:#15803D;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit">🖨 พิมพ์เอกสาร</button>';
  html += '<button id="ipoCloseBtn" style="padding:10px 18px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">ยกเลิก</button>';
  html += '</div></div>';
  overlay.innerHTML = html;
  overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  overlay.querySelector('#ipoConfirmBtn').addEventListener('click', function(){
    overlay.remove();
    showToast('🖨 ส่งไปยัง Printer แล้ว — ' + id);
  });
  overlay.querySelector('#ipoCloseBtn').addEventListener('click', function(){ overlay.remove(); });
}

// ─── WMS HISTORY ─────────────────────────────────────────────────────────────
var WMS_HISTORY = [];

function wmsSetTab(tab, el) {
  document.querySelectorAll('.wms-tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  document.getElementById('wms-tab-upload').style.display  = tab === 'upload'  ? '' : 'none';
  document.getElementById('wms-tab-history').style.display = tab === 'history' ? '' : 'none';
  if (tab === 'history') wmsRenderHistory();
}

function wmsShowConfirmBar() {
  var bar = document.getElementById('wms-confirm-bar');
  var desc = document.getElementById('wms-confirm-desc');
  if (!bar) return;
  if (!WMS_ROWS || WMS_ROWS.length === 0) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  var fromStr = (document.getElementById('wms-date-from')||{}).value || '—';
  var toStr   = (document.getElementById('wms-date-to')||{}).value   || '—';
  if (desc) desc.textContent = WMS_ROWS.length.toLocaleString() + ' records · ช่วงข้อมูล ' + fromStr + ' ถึง ' + toStr;
}

function wmsConfirmUpload() {
  if (!WMS_ROWS || !WMS_ROWS.length) { showToast('ยังไม่มีข้อมูล — กรุณาอัปโหลดไฟล์ก่อน'); return; }
  var fromStr = (document.getElementById('wms-date-from')||{}).value || '';
  var toStr   = (document.getElementById('wms-date-to')||{}).value   || '';
  var periodLabel = wmsPeriodLabel(fromStr || (WMS_ROWS[0] && WMS_ROWS[0].createdDate));
  var existing = WMS_HISTORY.find(function(h){ return h.period === periodLabel; });
  var titleEl = document.getElementById('wms-table-title');
  var fname = titleEl ? titleEl.textContent.replace('📋 ','') : 'Outbound_Order.xlsx';
  var entry = {
    id: Date.now(),
    uploadedAt: new Date().toLocaleString('th-TH', {day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}),
    filename: fname,
    dateFrom: fromStr, dateTo: toStr,
    records: WMS_ROWS.length,
    period: periodLabel,
    confirmedBy: 'admin',
    merged: !!existing,
  };
  if (existing) existing.records += WMS_ROWS.length;
  WMS_HISTORY.unshift(entry);
  var badge = document.getElementById('wms-history-badge');
  if (badge) { badge.textContent = WMS_HISTORY.length; badge.style.display = ''; }
  wmsRebuildMonthFilter();
  var bar = document.getElementById('wms-confirm-bar');
  if (bar) bar.style.display = 'none';
  showToast('✅ บันทึกแล้ว! ' + entry.records.toLocaleString() + ' records · ' + periodLabel + (existing ? ' (รวมกับข้อมูลเดิม)' : ''));
}

function wmsPeriodLabel(dateVal) {
  if (!dateVal) return 'ไม่ระบุช่วง';
  try { var d = new Date(dateVal); if (isNaN(d)) return 'ไม่ระบุช่วง';
    return d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }); } catch(e){ return 'ไม่ระบุช่วง'; }
}

function wmsRebuildMonthFilter() {
  var sel = document.getElementById('wms-hist-month'); if (!sel) return;
  var periods = [];
  WMS_HISTORY.forEach(function(h){ if (periods.indexOf(h.period)<0) periods.push(h.period); });
  sel.innerHTML = '<option value="">ทุกช่วงเวลา</option>' + periods.map(function(p){ return '<option>'+p+'</option>'; }).join('');
}

function wmsRenderHistory() {
  var search = ((document.getElementById('wms-hist-search')||{}).value||'').toLowerCase();
  var monthF = (document.getElementById('wms-hist-month')||{}).value||'';
  var filtered = WMS_HISTORY.filter(function(h){
    if (monthF && h.period !== monthF) return false;
    if (search && h.filename.toLowerCase().indexOf(search)<0) return false;
    return true;
  });
  // Period summary cards
  var cardsEl = document.getElementById('wms-period-cards');
  if (cardsEl) {
    var periods = {};
    WMS_HISTORY.forEach(function(h){ if(!periods[h.period]) periods[h.period]={records:0,files:0}; periods[h.period].records+=h.records; periods[h.period].files++; });
    cardsEl.innerHTML = Object.keys(periods).length
      ? Object.keys(periods).map(function(p){
          return '<div style="background:var(--surface);border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;min-width:150px">'
            +'<div style="font-size:11px;font-weight:700;color:var(--text2);margin-bottom:4px">📅 '+p+'</div>'
            +'<div style="font-size:20px;font-weight:700;color:var(--pink)">'+periods[p].records.toLocaleString()+'</div>'
            +'<div style="font-size:11px;color:var(--text3)">records รวม · '+periods[p].files+' ไฟล์</div>'
            +'</div>';
        }).join('')
      : '<div style="font-size:12px;color:var(--text3);padding:6px">ยังไม่มีข้อมูล</div>';
  }
  var tbody = document.getElementById('wms-history-tbody'); if(!tbody) return;
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--text3)">'
      +(WMS_HISTORY.length?'🔍 ไม่พบรายการ':'<div style="font-size:26px;margin-bottom:8px">🗂️</div><div style="font-weight:700">ยังไม่มีประวัติ</div><div style="font-size:12px;margin-top:4px">Confirm ไฟล์จากแท็บ Upload ไฟล์ใหม่</div>')
      +'</td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(function(h) {
    var rangeStr = (h.dateFrom&&h.dateTo) ? h.dateFrom+' ถึง '+h.dateTo : (h.dateFrom||'—');
    var badge = h.merged ? '<span style="font-size:10px;background:#EDE9FE;color:#7C3AED;padding:1px 6px;border-radius:10px;font-weight:700;margin-left:4px">รวมข้อมูล</span>':'';
    return '<tr style="transition:background .1s" onmouseover="this.style.background=\'var(--pink-ll)\'" onmouseout="this.style.background=\'\'">'
      +'<td style="padding:9px 12px;font-size:11.5px;font-family:monospace;color:var(--text2);white-space:nowrap">'+h.uploadedAt+'</td>'
      +'<td style="padding:9px 12px;font-size:12px;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">📊 '+h.filename+'</td>'
      +'<td style="padding:9px 12px;font-size:11.5px;color:var(--text2)">'+rangeStr+'</td>'
      +'<td style="padding:9px 12px;font-size:12px;font-weight:700;text-align:right">'+h.records.toLocaleString()+'</td>'
      +'<td style="padding:9px 12px"><span style="font-size:11px;font-weight:700;color:#059669;background:#D1FAE5;padding:2px 8px;border-radius:10px">✅ บันทึกแล้ว</span></td>'
      +'<td style="padding:9px 12px;font-size:11.5px">'+h.period+badge+'</td>'
      +'<td style="padding:9px 12px;font-size:12px;color:var(--text2)">'+h.confirmedBy+'</td>'
      +'</tr>';
  }).join('');
}

// ─── WMS UPLOAD MODULE ───────────────────────────────────────────────────────

var WMS_ROWS = []; // parsed rows from uploaded file
var WMS_FILTERED = [];

function wmsSetDateRange(val, btn) {
  var today = new Date();
  var fmt = d => d.toISOString().slice(0,10);
  var from, to = fmt(today);
  if(val === 'today') {
    from = fmt(today);
  } else if(val === 'month') {
    from = fmt(new Date(today.getFullYear(), today.getMonth(), 1));
    to   = fmt(new Date(today.getFullYear(), today.getMonth()+1, 0));
  } else if(val === 'lastmonth') {
    from = fmt(new Date(today.getFullYear(), today.getMonth()-1, 1));
    to   = fmt(new Date(today.getFullYear(), today.getMonth(), 0));
  } else {
    var fromD = new Date(today); fromD.setDate(today.getDate() - (val - 1));
    from = fmt(fromD);
  }
  var f = document.getElementById('wms-date-from');
  var t = document.getElementById('wms-date-to');
  if(f) f.value = from;
  if(t) t.value = to;
  if(btn) { document.querySelectorAll('.wmsdtab').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
}

function wmsUpdateStats(rows) {
  var total = rows.length;
  var allocated = rows.filter(function(r){return r.status==='Allocated';}).length;
  var newU = rows.filter(function(r){return r.status==='New'||r.status==='Unallocated'||r.status==='Partially Allocated'||r.status==='Allocation Failed';}).length;
  var picked = rows.filter(function(r){return r.status==='Picked';}).length;
  var cancelled = rows.filter(function(r){return r.status&&r.status.indexOf('Cancel')>=0;}).length;
  var els = {total:'wms-stat-total',allocated:'wms-stat-allocated',new:'wms-stat-new',picked:'wms-stat-picked',cancelled:'wms-stat-cancelled'};
  var vals = {total:total,allocated:allocated,new:newU,picked:picked,cancelled:cancelled};
  for(var k in els){var el=document.getElementById(els[k]);if(el)el.textContent=vals[k];}
}

function wmsRender() {
  var search = ((document.getElementById('wms-search')||{}).value||'').toLowerCase();
  var statusF = (document.getElementById('wms-status-filter')||{}).value||'';
  var groupF  = (document.getElementById('wms-group-filter')||{}).value||'';
  var dateFrom = (document.getElementById('wms-date-from')||{}).value||'';
  var dateTo   = (document.getElementById('wms-date-to')||{}).value||'';

  WMS_FILTERED = WMS_ROWS.filter(function(r) {
    if(search && !(
      (r.orderId||'').toLowerCase().indexOf(search)>=0 ||
      (r.ext1||'').toLowerCase().indexOf(search)>=0 ||
      (r.ext2||'').toLowerCase().indexOf(search)>=0 ||
      (r.customer||'').toLowerCase().indexOf(search)>=0
    )) return false;
    if(statusF && r.status !== statusF) return false;
    if(groupF  && r.group  !== groupF)  return false;
    if(dateFrom || dateTo) {
      var d = r.createdDate ? new Date(r.createdDate) : null;
      if(d) {
        if(dateFrom && d < new Date(dateFrom)) return false;
        if(dateTo   && d > new Date(dateTo + 'T23:59:59')) return false;
      }
    }
    return true;
  });

  var tbody = document.getElementById('wms-tbody');
  if(!tbody) return;

  var countEl = document.getElementById('wms-record-count');
  if(countEl) countEl.textContent = WMS_FILTERED.length ? '(' + WMS_FILTERED.length.toLocaleString() + ' รายการ)' : '';

  if(!WMS_FILTERED.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:36px;color:var(--text3)">'
      + (WMS_ROWS.length ? '🔍 ไม่พบรายการที่ตรงกับ Filter' : '<div style="font-size:32px;margin-bottom:10px">📊</div><div style="font-weight:700">ยังไม่มีข้อมูล WMS</div><div style="font-size:12px;margin-top:4px">กรุณาอัปโหลดไฟล์ Outbound_Order จาก WMS ด้านบน</div>')
      + '</td></tr>';
    return;
  }

  var statusColors = {
    'Allocated':           'color:#059669;background:#D1FAE5',
    'Picked':              'color:#1D4ED8;background:#DBEAFE',
    'New':                 'color:#D97706;background:#FEF3C7',
    'Unallocated':         'color:#DC2626;background:#FEF2F2',
    'Partially Allocated': 'color:#7C3AED;background:#EDE9FE',
    'Allocation Failed':   'color:#DC2626;background:#FEF2F2',
    'Cancelled via API':   'color:#6B7280;background:#F3F4F6',
  };

  tbody.innerHTML = WMS_FILTERED.slice(0, 300).map(function(r) {
    var sStyle = statusColors[r.status] || 'color:var(--text2);background:var(--surface3)';
    var soCell = r.ext2
      ? '<span style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;color:#1D4ED8;font-weight:700;background:#EFF6FF;padding:1px 6px;border-radius:4px">'+r.ext2+'</span>'
      : '<span style="color:var(--text3);font-size:11px">—</span>';
    var custCell = r.customer ? '<span style="font-size:12px">'+r.customer+'</span>' : '<span style="color:var(--text3);font-size:11px">—</span>';
    var fmtD = function(d){if(!d)return'—';var dt=new Date(d);return dt.toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'})+' '+dt.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});};
    return '<tr style="transition:background .1s;cursor:default" onmouseover="this.style.background=\'var(--pink-ll)\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:8px 12px;font-size:11px;font-family:monospace;color:var(--text2);white-space:nowrap">'+fmtD(r.createdDate)+'</td>'
      + '<td style="padding:8px 12px"><span style="font-family:monospace;font-size:11.5px;font-weight:700;color:var(--text)">'+r.orderId+'</span></td>'
      + '<td style="padding:8px 12px;font-size:11.5px;color:var(--text2);font-family:monospace">'+(r.ext1||'—')+'</td>'
      + '<td style="padding:8px 12px;background:rgba(219,234,254,0.3)">'+soCell+'</td>'
      + '<td style="padding:8px 12px"><span style="font-size:10.5px;font-weight:700;'+(r.group==='E-Commerce'?'color:#7C3AED;background:#EDE9FE':'color:#059669;background:#D1FAE5')+';padding:2px 7px;border-radius:4px">'+r.group+'</span></td>'
      + '<td style="padding:8px 12px"><span style="font-size:10.5px;font-weight:700;'+sStyle+';padding:2px 8px;border-radius:10px;display:inline-block">'+r.status+'</span></td>'
      + '<td style="padding:8px 12px;text-align:right;font-size:12px;font-weight:600">'+r.lines+'</td>'
      + '<td style="padding:8px 12px;text-align:right;font-size:12px;font-weight:600;color:'+(r.openQty>0?'var(--warn)':'var(--text)')+'">'+r.openQty+'</td>'
      + '<td style="padding:8px 12px;font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+custCell+'</td>'
      + '<td style="padding:8px 12px;font-size:11px;font-family:monospace;color:var(--text2);white-space:nowrap">'+fmtD(r.reqDelivery)+'</td>'
      + '</tr>';
  }).join('');
  if(WMS_FILTERED.length > 300) {
    tbody.innerHTML += '<tr><td colspan="10" style="text-align:center;padding:10px;font-size:11.5px;color:var(--text3);font-style:italic">แสดง 300 รายการแรก จากทั้งหมด '+WMS_FILTERED.length.toLocaleString()+' รายการ</td></tr>';
  }
}

function wmsFilter() { wmsRender(); }

function wmsHandleDrop(event) {
  event.preventDefault();
  var zone = document.getElementById('wms-drop-zone');
  if(zone){ zone.style.borderColor='var(--border2)'; zone.style.background='var(--bg)'; }
  var files = event.dataTransfer.files;
  if(files.length) wmsProcessFile(files[0]);
}

function wmsHandleFileSelect(inp) {
  if(inp.files.length) wmsProcessFile(inp.files[0]);
  inp.value='';
}

function wmsProcessFile(file) {
  var statusEl = document.getElementById('wms-drop-status');
  if(statusEl) statusEl.textContent = '⏳ กำลังอ่านไฟล์...';
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = new Uint8Array(e.target.result);
      // Use SheetJS if available, otherwise parse CSV
      if(typeof XLSX !== 'undefined') {
        var wb = XLSX.read(data, {type:'array', cellDates:true});
        var ws = wb.Sheets[wb.SheetNames[0]];
        var json = XLSX.utils.sheet_to_json(ws, {raw:false, defval:''});
        WMS_ROWS = json.map(function(row) {
          return {
            createdDate: row['Created Date']||null,
            orderId:     row['Outbound Order ID']||'',
            ext1:        row['External Order #1']||'',
            ext2:        row['External Order #2']||'',
            group:       row['Order Group']||'',
            status:      row['Status']||'',
            lines:       row['# of Order Lines']||0,
            openQty:     row['Open Qty']||0,
            customer:    row['Customer Company']||row['Ship To Company']||'',
            reqDelivery: row['Requested Delivery Date']||null,
            outboundType:row['Outbound Type']||'',
          };
        });
        if(statusEl) statusEl.innerHTML = '<span style="color:var(--success)">✅ โหลดแล้ว '+WMS_ROWS.length.toLocaleString()+' records</span>';
        wmsUpdateStats(WMS_ROWS);
        window.wmsRender();
        wmsShowConfirmBar();
        // Update table title
        var tt = document.getElementById('wms-table-title');
        if(tt) tt.textContent = '📋 ' + file.name;
        showToast('✅ อ่านไฟล์แล้ว '+WMS_ROWS.length.toLocaleString()+' records จาก '+file.name);
      } else {
        if(statusEl) statusEl.innerHTML = '<span style="color:var(--warn)">⚠️ SheetJS ไม่พร้อม — ลองโหลดหน้าใหม่</span>';
      }
    } catch(err) {
      if(statusEl) statusEl.innerHTML = '<span style="color:var(--danger)">❌ อ่านไฟล์ไม่ได้: '+err.message+'</span>';
    }
  };
  reader.readAsArrayBuffer(file);
}

function wmsExportTable() {
  if(!WMS_FILTERED.length){ showToast('ไม่มีข้อมูลสำหรับ Export'); return; }
  showToast('📤 Export '+WMS_FILTERED.length+' รายการ');
}

function wmsRender() {
  // duplicate guard — defined twice, second wins
}

// Re-define wmsRender correctly (override stub above)
(function(){
var _wmsRender = function() {
  var search = ((document.getElementById('wms-search')||{}).value||'').toLowerCase();
  var statusF = (document.getElementById('wms-status-filter')||{}).value||'';
  var groupF  = (document.getElementById('wms-group-filter')||{}).value||'';
  var dateFrom = (document.getElementById('wms-date-from')||{}).value||'';
  var dateTo   = (document.getElementById('wms-date-to')||{}).value||'';

  WMS_FILTERED = WMS_ROWS.filter(function(r) {
    if(search && !(
      (r.orderId||'').toLowerCase().indexOf(search)>=0 ||
      (r.ext1||'').toLowerCase().indexOf(search)>=0 ||
      (r.ext2||'').toLowerCase().indexOf(search)>=0 ||
      (r.customer||'').toLowerCase().indexOf(search)>=0
    )) return false;
    if(statusF && r.status !== statusF) return false;
    if(groupF  && r.group  !== groupF)  return false;
    if(dateFrom || dateTo) {
      var d = r.createdDate ? new Date(r.createdDate) : null;
      if(d) {
        if(dateFrom && d < new Date(dateFrom)) return false;
        if(dateTo   && d > new Date(dateTo + 'T23:59:59')) return false;
      }
    }
    return true;
  });

  var tbody = document.getElementById('wms-tbody');
  if(!tbody) return;

  var countEl = document.getElementById('wms-record-count');
  if(countEl) countEl.textContent = WMS_FILTERED.length ? '(' + WMS_FILTERED.length.toLocaleString() + ' รายการ)' : '';

  if(!WMS_FILTERED.length) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;padding:36px;color:var(--text3)">'
      + (WMS_ROWS.length ? '🔍 ไม่พบรายการที่ตรงกับ Filter' : '<div style="font-size:32px;margin-bottom:10px">📊</div><div style="font-weight:700">ยังไม่มีข้อมูล WMS</div><div style="font-size:12px;margin-top:4px">กรุณาอัปโหลดไฟล์ Outbound_Order จาก WMS ด้านบน</div>')
      + '</td></tr>';
    return;
  }

  var statusColors = {
    'Allocated':           'color:#059669;background:#D1FAE5',
    'Picked':              'color:#1D4ED8;background:#DBEAFE',
    'New':                 'color:#D97706;background:#FEF3C7',
    'Unallocated':         'color:#DC2626;background:#FEF2F2',
    'Partially Allocated': 'color:#7C3AED;background:#EDE9FE',
    'Allocation Failed':   'color:#DC2626;background:#FEF2F2',
    'Cancelled via API':   'color:#6B7280;background:#F3F4F6',
  };

  tbody.innerHTML = WMS_FILTERED.slice(0, 300).map(function(r) {
    var sStyle = statusColors[r.status] || 'color:var(--text2);background:var(--surface3)';
    var soCell = r.ext2
      ? '<span style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;color:#1D4ED8;font-weight:700;background:#EFF6FF;padding:1px 6px;border-radius:4px">'+r.ext2+'</span>'
      : '<span style="color:var(--text3);font-size:11px">—</span>';
    var custCell = r.customer ? '<span style="font-size:12px">'+r.customer+'</span>' : '<span style="color:var(--text3);font-size:11px">—</span>';
    var fmtD = function(d){
      if(!d)return'—';
      try{var dt=new Date(d);if(isNaN(dt))return String(d).slice(0,16);
      return dt.toLocaleDateString('th-TH',{day:'2-digit',month:'2-digit',year:'2-digit'})+' '+dt.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});}catch(e){return String(d).slice(0,16);}
    };
    return '<tr style="transition:background .1s;cursor:default" onmouseover="this.style.background=\'var(--pink-ll)\'" onmouseout="this.style.background=\'\'">'
      + '<td style="padding:8px 12px;font-size:11px;font-family:monospace;color:var(--text2);white-space:nowrap">'+fmtD(r.createdDate)+'</td>'
      + '<td style="padding:8px 12px"><span style="font-family:monospace;font-size:11.5px;font-weight:700;color:var(--text)">'+r.orderId+'</span></td>'
      + '<td style="padding:8px 12px;font-size:11.5px;color:var(--text2);font-family:monospace">'+(r.ext1||'—')+'</td>'
      + '<td style="padding:8px 12px;background:rgba(219,234,254,0.3)">'+soCell+'</td>'
      + '<td style="padding:8px 12px"><span style="font-size:10.5px;font-weight:700;'+(r.group==='E-Commerce'?'color:#7C3AED;background:#EDE9FE':'color:#059669;background:#D1FAE5')+';padding:2px 7px;border-radius:4px">'+r.group+'</span></td>'
      + '<td style="padding:8px 12px"><span style="font-size:10.5px;font-weight:700;'+sStyle+';padding:2px 8px;border-radius:10px;display:inline-block">'+r.status+'</span></td>'
      + '<td style="padding:8px 12px;text-align:right;font-size:12px;font-weight:600">'+r.lines+'</td>'
      + '<td style="padding:8px 12px;text-align:right;font-size:12px;font-weight:600;color:'+(Number(r.openQty)>0?'var(--warn)':'var(--text)')+'">'+r.openQty+'</td>'
      + '<td style="padding:8px 12px;font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+custCell+'</td>'
      + '<td style="padding:8px 12px;font-size:11px;font-family:monospace;color:var(--text2);white-space:nowrap">'+fmtD(r.reqDelivery)+'</td>'
      + '</tr>';
  }).join('');
  if(WMS_FILTERED.length > 300) {
    tbody.innerHTML += '<tr><td colspan="10" style="text-align:center;padding:10px;font-size:11.5px;color:var(--text3);font-style:italic">แสดง 300 รายการแรก จากทั้งหมด '+WMS_FILTERED.length.toLocaleString()+' รายการ</td></tr>';
  }
};
window.wmsRender = _wmsRender;
window.wmsFilter = _wmsRender;
})();



