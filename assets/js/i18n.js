/* =========================================================
   ROSE / 丞莘 — bilingual content & language switch
   zh (default, bilingual display) · en (English only)
   ========================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'chengshen-lang';

  var DICT = {
    /* ---------- brand / ui ---------- */
    'brand.name': { zh: '丞莘', en: 'Rose' },
    'brand.sub': { zh: 'ROSE', en: 'KARST KNIT ARCHIVE' },
    'ui.home': { zh: '丞莘首页', en: 'Rose — Home' },
    'ui.mainNav': { zh: '主导航', en: 'Main navigation' },
    'ui.footNav': { zh: '页脚导航', en: 'Footer navigation' },
    'ui.openMenu': { zh: '打开菜单', en: 'Open menu' },
    'ui.closeMenu': { zh: '关闭菜单', en: 'Close menu' },
    'ui.scroll': { zh: '向下浏览', en: 'Scroll down' },
    'ui.skip': { zh: '跳到主要内容', en: 'Skip to main content' },
    'nav.philosophy': { zh: '理念', en: 'Philosophy' },
    'nav.collections': { zh: '系列', en: 'Collections' },
    'nav.field': { zh: '自然', en: 'Field Notes' },
    'nav.craft': { zh: '工艺', en: 'Craft' },
    'nav.gallery': { zh: '图集', en: 'Atlas' },
    'nav.about': { zh: '关于', en: 'About' },
    'nav.honours': { zh: '荣誉', en: 'Honours' },
    'nav.press': { zh: '媒体', en: 'Press' },

    /* ---------- hero ---------- */
    'hero.eyebrow': {
      zh: '<span>南通大学杏林学院</span><span>服装设计与工程</span><span>2027 届毕业设计</span>',
      en: '<span>NANTONG UNIVERSITY XINGLIN COLLEGE</span><span>FASHION DESIGN &amp; ENGINEERING</span><span>GRADUATION PROJECT · 2027</span>'
    },
    'hero.title.sub': { zh: '喀斯特地貌针织面料再造', en: 'Knitted Textile Reconstruction of Karst Topography' },
    'hero.lead': {
      zh: '以岩壁起伏、层理叠错、孔洞空透与灰调层次为形态母题，在平针基底上重建针织面料的表面结构——让地貌的生成方式，在针织物上重新发生。',
      en: 'Taking the relief of rock walls, the stagger of strata, the openness of caverns and the gradation of grey as formal motifs, the surface structure of knitted fabric is rebuilt on a plain-knit ground — allowing the way terrain is generated to happen again within the loop.'
    },
    'hero.el1': { zh: '<span>01</span>岩壁起伏', en: '<span>01</span>Rock Relief' },
    'hero.el2': { zh: '<span>02</span>层理叠错', en: '<span>02</span>Stratal Shift' },
    'hero.el3': { zh: '<span>03</span>孔洞空透', en: '<span>03</span>Cavern Void' },
    'hero.el4': { zh: '<span>04</span>灰调层次', en: '<span>04</span>Grey Gradation' },

    /* ---------- campaign ---------- */
    'campaign.aria': { zh: '形象大片', en: 'Campaign' },
    'campaign.alt': { zh: '模特身着深灰绞花针织斗篷，立于雾气中的喀斯特石林台地', en: 'Model in a charcoal cable-knit cape standing on a misted karst stone-forest terrace' },
    'campaign.line': { zh: '在雾与石之间，<br>织物成为第三种地貌。', en: 'Between mist and stone,<br>fabric becomes a third terrain.' },
    'campaign.meta': {
      zh: '<b>CAMPAIGN 01 — 峰林之上</b>羊毛 / 羊绒绞花斗篷 · 7G<br>造型参考 系列 01「峰林 · 叠」',
      en: '<b>CAMPAIGN 01 — ABOVE THE FENGLIN</b>Wool / cashmere cable cape · 7G<br>Styling reference — Series 01 “Fenglin · Fold”'
    },

    /* ---------- philosophy ---------- */
    'phil.eyebrow': { zh: '<span>01</span>设计理念 / PHILOSOPHY', en: '<span>01</span>PHILOSOPHY' },
    'phil.display': { zh: '不描摹地貌，<br><em>而重建它的结构。</em>', en: 'We do not depict terrain —<br><em>we rebuild its structure.</em>' },
    'phil.lede': {
      zh: '喀斯特地貌由地下水与地表水对可溶性岩石的溶蚀、侵蚀与堆积作用形成。岩壁凹凸起伏、岩层层叠、溶洞空透、岩石呈由浅至深的灰调——这些并非装饰性的图案，而是一套关于起伏、层叠与通透的结构逻辑。',
      en: 'Karst terrain is formed by the dissolution, erosion and deposition of soluble rock by surface and groundwater. The rise and fall of rock walls, the layering of strata, the openness of caverns and the grey tones from pale to deep are not decorative patterns but a structural logic of relief, stratification and permeability.'
    },
    'phil.p2': {
      zh: '本课题以平针组织为基底，将四类形态要素分别对应到凹凸组织、移针提花、挑孔镂空与纱线配色之中；再经缩绒、局部压褶与定型完成二次再造。针法的密度差、孔洞的疏密与纱线的色阶，共同构成一种可以被穿着的岩层。',
      en: 'Taking plain knit as the ground, the project maps these four formal elements onto relief stitches, transfer jacquard, eyelet openings and yarn colour; a second reconstruction follows through milling, local pleating and heat-setting. Differences in stitch density, the rhythm of apertures and the gradation of yarns together form a stratum that can be worn.'
    },
    'phil.sign': { zh: 'DESIGNER — 黄嘉凤 · 指导教师 — 唐虹 教授', en: 'DESIGNER — HUANG JIAFENG · SUPERVISOR — PROF. TANG HONG' },
    'core.aria': { zh: '岩芯示意：四类地貌要素与对应组织', en: 'Core sample diagram: four terrain elements and their corresponding stitches' },
    'core.l1': { zh: '岩壁起伏', en: 'Rock Relief' },
    'core.l2': { zh: '层理叠错', en: 'Stratal Shift' },
    'core.l3': { zh: '孔洞空透', en: 'Cavern Void' },
    'core.l4': { zh: '灰调层次', en: 'Grey Gradation' },
    'core.e1': { zh: 'RELIEF / 凹凸', en: 'RELIEF / RIB' },
    'core.e2': { zh: 'STRATA / 提花', en: 'STRATA / JACQUARD' },
    'core.e3': { zh: 'VOID / 挑孔', en: 'VOID / EYELET' },
    'core.e4': { zh: 'TONE / 段染', en: 'TONE / SPACE-DYE' },
    'core.fig': { zh: 'FIG. 01 — CORE SAMPLE / 形态转译', en: 'FIG. 01 — CORE SAMPLE / MORPHOLOGY' },

    'tr1.h': { zh: '岩壁起伏', en: 'Rock Relief' },
    'tr1.p': { zh: '以罗纹与集圈制造纵向的密度差，凸条之间留下深影，侧光下呈岩壁的高低错落。', en: 'Rib and tuck create a longitudinal density difference; deep shadows between raised ribs read as the rise and fall of a rock face in raking light.' },
    'tr1.map': { zh: '凹凸组织 · 绞花', en: 'Relief stitch · Cable' },
    'tr2.h': { zh: '层理叠错', en: 'Stratal Shift' },
    'tr2.p': { zh: '移针改变参与编织的针位，块面在一横列之间错动，对应岩层的堆叠与断裂。', en: 'Transfer shifts the needles in work, so blocks move within a single course — the stacking and fracture of rock strata.' },
    'tr2.map': { zh: '移针提花 · 局部压褶', en: 'Transfer jacquard · Local pleating' },
    'tr3.h': { zh: '孔洞空透', en: 'Cavern Void' },
    'tr3.p': { zh: '挑孔由密到疏、边缘渐细，透光时孔与孔之间的浮线像连接钟乳与洞顶的细流。', en: 'Eyelets move from dense to sparse, edges thinning; against light, the floats between holes resemble the thin streams that link stalactites to the cave roof.' },
    'tr3.map': { zh: '变化挑孔 · 大小镂空', en: 'Variable eyelet · Graded apertures' },
    'tr4.h': { zh: '灰调层次', en: 'Grey Gradation' },
    'tr4.p': { zh: '段染纱与混色纱沿横向留下由浅入深的色阶，还原岩石风化后的自然过渡。', en: 'Space-dyed and marled yarns leave a lateral gradation from pale to deep, restoring the natural transition of weathered stone.' },
    'tr4.map': { zh: '段染纱 · 混色纱 · 缩绒', en: 'Space-dyed · Marled yarn · Milling' },

    'method.title': { zh: '设计方法 / METHOD', en: 'METHOD' },
    'method.s1': { zh: '形态提取', en: 'Form Extraction' },
    'method.i1': { zh: '地貌影像 · 地质图件', en: 'Terrain imagery · geological maps' },
    'method.s2': { zh: '组织对应', en: 'Stitch Mapping' },
    'method.i2': { zh: '四要素 · 四组针法', en: 'Four elements · four stitch groups' },
    'method.s3': { zh: '纱线配伍', en: 'Yarn Blending' },
    'method.i3': { zh: '混纺 · 段染 · 衬垫', en: 'Blends · space-dye · plating' },
    'method.s4': { zh: '后整理强化', en: 'Finishing' },
    'method.i4': { zh: '缩绒 · 压褶 · 定型', en: 'Milling · pleating · setting' },

    /* ---------- collections ---------- */
    'col.eyebrow': { zh: '<span>02</span>面料系列 / THE COLLECTIONS', en: '<span>02</span>THE COLLECTIONS' },
    'col.display': { zh: '三个系列，<em>十二套造型。</em>', en: 'Three collections, <em>twelve looks.</em>' },
    'col.intro': {
      zh: '每一系列从一组地貌特征出发，对应一套组织方案与色彩系统：峰林的垂直秩序、溶洞的空透结构、层理的沉积色阶。从面料小样到成衣，参数与叙事同时推进。',
      en: 'Each collection begins with one group of terrain features and resolves into a stitch system and a colour range: the vertical order of fenglin, the permeable structure of caverns and the sedimentary tonal scale of strata. From swatch to garment, parameters and narrative advance together.'
    },

    /* series 01 */
    's1.alt': { zh: '模特身着深灰绞花针织长大衣，倚靠暗色石墙，侧光勾勒纵向罗纹', en: 'Model in a charcoal cable-knit long coat against a dark stone wall, raking light tracing the vertical ribs' },
    's1.cap': { zh: '<span>系列 01 · 峰林 · 叠</span><span>罗纹 · 凹凸 · 绞花 / 7G</span>', en: '<span>Series 01 · Fenglin · Fold</span><span>Rib · Relief · Cable / 7G</span>' },
    's1.no': { zh: '<span>系列 01</span><span>04 套</span>', en: '<span>Series 01</span><span>04 Looks</span>' },
    's1.title': { zh: '峰林 · 叠', en: 'Fenglin · Fold' },
    's1.lede': { zh: '取峰林与峰丛的陡直轮廓。纵向的罗纹与凹凸组织构成石柱般的秩序，绞花在固定间隔处交叉，像岩层被挤压后的转折。', en: 'Drawn from the steep silhouettes of fenglin and fengcong. Vertical rib and relief stitches establish a columnar order, while cables cross at fixed intervals like the folds of strata under compression.' },
    's1.narr.h': { zh: '设计叙事 / NARRATIVE', en: 'NARRATIVE' },
    's1.narr.p1': {
      zh: '灵感来自桂西峰林与石林的柱状秩序。岩壁的垂直节理把山体切成密集的竖线；在横机上，这种秩序被转译为罗纹与集圈形成的纵向凸条，凸条之间保留深色阴影，使布面在侧光下呈现岩壁的明暗。',
      en: 'The starting point is the columnar order of the fenglin and stone forest of western Guangxi. Vertical joints cut the massif into dense upright lines; on the flat-bed machine this order becomes longitudinal ribs formed by rib and tuck, with dark shadow held between them so the surface reads as a rock face under side light.'
    },
    's1.narr.p2': {
      zh: '绞花以固定间隔横向交叉一次，对应岩层受力后的错动与转折。纱线以羊毛/羊绒混纺为主体，轻度缩绒后纤维在表面形成细密绒毛，削弱针织的规整感，接近风化岩面的粗粝；衬垫再生涤纶长丝藏于反面，稳定凸条的立体度。',
      en: 'Cables cross once at fixed intervals, corresponding to the displacement and turning of strata under stress. Wool/cashmere is the main yarn; after light milling the fibres raise a fine nap that softens the regularity of knit and approaches the coarseness of weathered stone. A recycled polyester filament is plaited on the reverse to stabilise the relief.'
    },
    's1.tag1': { zh: '峰林', en: 'Fenglin' },
    's1.tag2': { zh: '石林柱状秩序', en: 'Columnar stone forest' },
    's1.tag3': { zh: '垂直节理', en: 'Vertical joints' },
    's1.tag4': { zh: '风化岩面', en: 'Weathered rock face' },
    's1.p1.dt': { zh: '组织', en: 'Structure' },
    's1.p1.dd': { zh: '罗纹基底 · 凹凸组织 · 绞花（移针交叉）', en: 'Rib ground · Relief stitch · Cable (transfer crossing)' },
    's1.p2.dt': { zh: '纱线', en: 'Yarn' },
    's1.p2.dd': { zh: '羊毛/羊绒混纺 90/10；衬垫 再生涤纶长丝 75D', en: 'Wool/cashmere 90/10; plating recycled polyester filament 75D' },
    's1.p3.dt': { zh: '纱支', en: 'Count' },
    's1.p3.dd': { zh: '2/26 Nm', en: '2/26 Nm' },
    's1.p4.dt': { zh: '克重 · 幅宽', en: 'Weight · Width' },
    's1.p4.dd': { zh: '320 g/m² · 150 cm', en: '320 gsm · 150 cm' },
    's1.p5.dt': { zh: '针距', en: 'Gauge' },
    's1.p5.dd': { zh: '7G 横机', en: '7G flat-bed' },
    's1.p6.dt': { zh: '色系', en: 'Colour' },
    's1.p6.dd': { zh: '岩浅灰 K-01 / 中灰 K-03', en: 'Stone light grey K-01 / Mid grey K-03' },
    's1.p7.dt': { zh: '适用品类', en: 'Application' },
    's1.p7.dd': { zh: '立体廓形外套 · 大衣', en: 'Sculpted outerwear · coats' },
    's1.look1': { zh: '<span>01</span>脊 · 立领长外套', en: '<span>01</span>Ridge · Stand-collar long coat' },
    's1.look2': { zh: '<span>02</span>崖 · 结构式短夹克', en: '<span>02</span>Cliff · Structured cropped jacket' },
    's1.look3': { zh: '<span>03</span>嶂 · 连身阔腿套装', en: '<span>03</span>Massif · Jumpsuit with wide legs' },
    's1.look4': { zh: '<span>04</span>丛 · 拼接披挂大衣', en: '<span>04</span>Cluster · Panelled draped coat' },

    /* series 02 */
    's2.alt': { zh: '模特身着石灰白大孔镂空针织服装，逆光透出孔洞与层叠轮廓', en: 'Model in a lime-white openwork knit, backlit so apertures and layered silhouettes show through' },
    's2.cap': { zh: '<span>系列 02 · 溶洞 · 透</span><span>变化挑孔 · 大小镂空 / 12G</span>', en: '<span>Series 02 · Cavern · Permeability</span><span>Variable eyelet · Graded apertures / 12G</span>' },
    's2.no': { zh: '<span>系列 02</span><span>04 套</span>', en: '<span>Series 02</span><span>04 Looks</span>' },
    's2.title': { zh: '溶洞 · 透', en: 'Cavern · Permeability' },
    's2.lede': { zh: '从溶洞穹顶与钟乳石的垂坠形态出发。挑孔由密到疏地向上收束，透光时孔洞边缘的混色纱泛出被水侵蚀的柔光。', en: 'Beginning with the vault of the cavern and the vertical fall of stalactites, eyelets close upward from dense to sparse; against light, the marled yarn at each aperture edge gives off the soft glow of water-eroded stone.' },
    's2.narr.h': { zh: '设计叙事 / NARRATIVE', en: 'NARRATIVE' },
    's2.narr.p1': {
      zh: '灵感来自溶洞穹顶的开口与钟乳石的垂直垂坠。设计把孔洞看作有方向的形态：下密上疏、边缘渐细，孔与孔之间的浮线像连接钟乳与洞顶的细流。在 12G 横机上以变化挑孔起孔，局部以集圈锁边，使大孔在穿着与洗涤后仍保持形状。',
      en: 'The reference is the opening in a cave vault and the vertical drip of stalactites. Apertures are treated as directional forms: dense below, sparse above, edges thinning. The floats between holes resemble the fine streams that connect stalactite to ceiling. Eyelets are formed on a 12G flat-bed with variable transfer and locally locked by tuck so large openings hold their shape through wear and washing.'
    },
    's2.narr.p2': {
      zh: '天丝/羊毛混纺带来垂坠与微微的冷光，混色纱在孔缘形成不确定的色差，模拟水痕。后整理采用低温定型而非高温压烫，是为了保留孔洞的立体开口与手感。',
      en: 'A Tencel/wool blend brings drape and a cool sheen; marled yarn creates an uncertain tonal difference at the aperture edge, mimicking water marks. Finishing uses low-temperature setting rather than hot pressing in order to preserve the three-dimensional opening and the hand.'
    },
    's2.tag1': { zh: '溶洞穹顶', en: 'Cavern vault' },
    's2.tag2': { zh: '钟乳石垂坠', en: 'Stalactite fall' },
    's2.tag3': { zh: '地下水道', en: 'Underground channel' },
    's2.tag4': { zh: '溶蚀孔洞', en: 'Solution cavities' },
    's2.p1.dt': { zh: '组织', en: 'Structure' },
    's2.p1.dd': { zh: '平针基底 · 变化挑孔 · 大小镂空 · 局部集圈', en: 'Plain ground · Variable eyelet · Graded apertures · Local tuck' },
    's2.p2.dt': { zh: '纱线', en: 'Yarn' },
    's2.p2.dd': { zh: '天丝/羊毛混纺 55/45；孔缘 混色纱 2/28 Nm', en: 'Tencel/wool 55/45; aperture-edge marled yarn 2/28 Nm' },
    's2.p3.dt': { zh: '纱支', en: 'Count' },
    's2.p3.dd': { zh: '2/30 Nm', en: '2/30 Nm' },
    's2.p4.dt': { zh: '克重 · 幅宽', en: 'Weight · Width' },
    's2.p4.dd': { zh: '210 g/m² · 160 cm', en: '210 gsm · 160 cm' },
    's2.p5.dt': { zh: '针距', en: 'Gauge' },
    's2.p5.dd': { zh: '12G 横机 / 24G 圆机', en: '12G flat-bed / 24G circular' },
    's2.p6.dt': { zh: '色系', en: 'Colour' },
    's2.p6.dd': { zh: '石灰白 K-05 / 矿物灰绿 K-07', en: 'Lime white K-05 / Mineral grey-green K-07' },
    's2.p7.dt': { zh: '适用品类', en: 'Application' },
    's2.p7.dd': { zh: '薄型罩衫 · 层叠裙装', en: 'Sheer overshirts · Layered skirts' },
    's2.look1': { zh: '<span>01</span>穴 · 镂空长罩衫', en: '<span>01</span>Cave · Openwork tunic' },
    's2.look2': { zh: '<span>02</span>隙 · 不对称背心', en: '<span>02</span>Crevice · Asymmetric vest' },
    's2.look3': { zh: '<span>03</span>窍 · 孔洞层叠长裙', en: '<span>03</span>Orifice · Layered openwork skirt' },
    's2.look4': { zh: '<span>04</span>涧 · 透叠两件式', en: '<span>04</span>Ravine · Sheer two-piece' },

    /* series 03 */
    's3.alt': { zh: '模特身着厚重灰调针织围裹造型，赭石色围巾点缀，背景为冷雾岩壁', en: 'Model in heavy grey knitted layers with an ochre scarf, against cold misted rock' },
    's3.cap': { zh: '<span>系列 03 · 层理 · 灰</span><span>移针提花 · 缩绒 · 压褶 / 7G</span>', en: '<span>Series 03 · Strata · Grey</span><span>Transfer jacquard · Milling · Pleating / 7G</span>' },
    's3.no': { zh: '<span>系列 03</span><span>04 套</span>', en: '<span>Series 03</span><span>04 Looks</span>' },
    's3.title': { zh: '层理 · 灰', en: 'Strata · Grey' },
    's3.lede': { zh: '层理是时间的刻度。移针提花把岩层的错动做成块面，段染纱沿横向留下由浅入深的灰阶，缩绒与局部压褶，把“沉积”压进布面。', en: 'Strata are the scale of time. Transfer jacquard turns the displacement of beds into blocks; space-dyed yarn leaves a lateral grey scale from pale to deep; milling and local pleating press “deposition” into the cloth.' },
    's3.narr.h': { zh: '设计叙事 / NARRATIVE', en: 'NARRATIVE' },
    's3.narr.p1': {
      zh: '灵感来自岩层沉积的剖面与地下水长期侵蚀留下的流痕。移针提花在每一横列改变参与编织的针位，形成错落的块面；段染纱的深浅变化与块面错位叠加，让灰阶不是均匀渐变，而是像岩层一样一段一段地推移。',
      en: 'The source is the section of sedimentary beds and the flow marks left by long erosion. Transfer jacquard changes the needles in work on every course to produce staggered blocks; the tonal movement of space-dyed yarn overlaps with the shifted blocks, so the grey scale is not an even gradient but advances in steps, like strata.'
    },
    's3.narr.p2': {
      zh: '缩绒使羊毛纤维互相缠结，布面收紧、边缘变厚；局部压褶在 130℃ 下定型，压出硬朗的折线，对应岩层断裂的直线。氨纶弹力丝以衬垫方式少量加入，使厚重织物在围裹与叠穿时仍有回弹。',
      en: 'Milling entangles the wool fibres, tightening the surface and thickening the edges; local pleating is set at 130°C to press hard fold lines that correspond to the straight fractures of rock. A small amount of elastane is plaited in so the heavy fabric retains recovery when wrapped and layered.'
    },
    's3.tag1': { zh: '岩层剖面', en: 'Stratal section' },
    's3.tag2': { zh: '地下水蚀流痕', en: 'Erosion flow marks' },
    's3.tag3': { zh: '风化灰调', en: 'Weathered grey' },
    's3.tag4': { zh: '断裂折线', en: 'Fracture lines' },
    's3.p1.dt': { zh: '组织', en: 'Structure' },
    's3.p1.dd': { zh: '移针提花 · 双层组织局部 · 缩绒 · 局部压褶', en: 'Transfer jacquard · Local double-layer · Milling · Local pleating' },
    's3.p2.dt': { zh: '纱线', en: 'Yarn' },
    's3.p2.dd': { zh: '段染羊毛混纺 2/16 Nm；混色纱；氨纶 40D', en: 'Space-dyed wool blend 2/16 Nm; marled yarn; elastane 40D' },
    's3.p3.dt': { zh: '纱支', en: 'Count' },
    's3.p3.dd': { zh: '2/16 Nm', en: '2/16 Nm' },
    's3.p4.dt': { zh: '克重 · 幅宽', en: 'Weight · Width' },
    's3.p4.dd': { zh: '380 g/m² · 145 cm', en: '380 gsm · 145 cm' },
    's3.p5.dt': { zh: '针距', en: 'Gauge' },
    's3.p5.dd': { zh: '7G 横机', en: '7G flat-bed' },
    's3.p6.dt': { zh: '色系', en: 'Colour' },
    's3.p6.dd': { zh: '灰阶 K-09 / 赭石 K-11', en: 'Grey scale K-09 / Ochre K-11' },
    's3.p7.dt': { zh: '适用品类', en: 'Application' },
    's3.p7.dd': { zh: '围裹式外套 · 厚重造型', en: 'Wrapped outerwear · Heavy silhouettes' },
    's3.look1': { zh: '<span>01</span>层 · 交叠长外套', en: '<span>01</span>Layer · Overlapping long coat' },
    's3.look2': { zh: '<span>02</span>痕 · 压褶披肩', en: '<span>02</span>Trace · Pleated cape' },
    's3.look3': { zh: '<span>03</span>蚀 · 块面拼接裙', en: '<span>03</span>Erosion · Panelled skirt' },
    's3.look4': { zh: '<span>04</span>岩 · 围裹式大衣', en: '<span>04</span>Rock · Wrapped coat' },

    /* ---------- field notes ---------- */
    'field.eyebrow': { zh: '<span>03</span>自然对照 / FIELD NOTES', en: '<span>03</span>FIELD NOTES' },
    'field.display': { zh: '地貌先于针法，<br><em>是第一层组织。</em>', en: 'Terrain precedes stitch —<br><em>it is the first structure.</em>' },
    'field.lede': {
      zh: '三个系列的形态并非凭空设定。峰林的垂直、溶洞的空透、岩层的水平，都能在桂西与黔南的喀斯特现场找到对应的结构。以下五帧地貌，作为面料的“原始组织图”——先看自然如何排列，再看针法如何回应。',
      en: 'The forms of the three collections are not invented. The verticality of fenglin, the permeability of caverns and the horizontality of strata all find their structural counterparts in the karst of western Guangxi and southern Guizhou. The five frames below serve as the “original stitch chart” of the fabric — first how nature arranges, then how the needle answers.'
    },
    'field.index': {
      zh: 'FIELD INDEX / 24°46′N · 110°29′E<br>桂西 — 黔南喀斯特带<br>峰林 · 天坑 · 溶洞 · 暗河 · 石林',
      en: 'FIELD INDEX / 24°46′N · 110°29′E<br>WESTERN GUANGXI — SOUTHERN GUIZHOU KARST BELT<br>FENGLIN · TIANKENG · CAVERN · UNDERGROUND RIVER · STONE FOREST'
    },
    'f1.alt': { zh: '晨雾中的漓江峰林与江面倒影', en: 'Lijiang fenglin in morning mist with reflections on the river' },
    'f1.place': { zh: '广西 · 阳朔 / 峰林与峰丛', en: 'Yangshuo, Guangxi / Fenglin & fengcong' },
    'f1.note': { zh: '垂直节理把山体切成密集的竖线。对应系列 01「峰林 · 叠」的纵向罗纹、集圈凸条与固定间隔的绞花转折。', en: 'Vertical joints cut the massif into dense upright lines — the source of the longitudinal ribs, tuck ridges and fixed-interval cable turns in Series 01, Fenglin · Fold.' },
    'f2.alt': { zh: '喀斯特天坑航拍，坑壁围合出深邃的圆形开口', en: 'Aerial view of a karst tiankeng, its walls enclosing a deep circular opening' },
    'f2.place': { zh: '广西 · 乐业 / 天坑群', en: 'Leye, Guangxi / Tiankeng group' },
    'f2.note': { zh: '坑壁围合、坑底透光，是“空透”最直接的尺度。对应系列 02 的孔洞由密到疏、边缘渐细的排布逻辑。', en: 'Enclosing walls and light from below give the most direct scale of permeability — the logic behind the dense-to-sparse apertures and thinning edges of Series 02.' },
    'f3.alt': { zh: '溶洞内部的钟乳石与自洞口射入的光柱', en: 'Stalactites inside a cavern with a shaft of light entering from the mouth' },
    'f3.place': { zh: '贵州 · 织金洞 / 溶洞钟乳', en: 'Zhijin Cave, Guizhou / Stalactites' },
    'f3.note': { zh: '钟乳自穹顶垂落，水痕沿表面下移。挑孔之间的浮线，正是这种“连接洞顶与地面”的细流。', en: 'Stalactites hang from the vault and water marks travel down their surface. The floats between eyelets are precisely these thin streams linking roof and floor.' },
    'f4.alt': { zh: '地下暗河在岩壁之间流过，水面映出矿石色倒影', en: 'An underground river running between rock walls, the water reflecting mineral tones' },
    'f4.no': { zh: 'FIG. 04 / 地下暗河', en: 'FIG. 04 / UNDERGROUND RIVER' },
    'f4.place': { zh: '广西 · 巴马 / 地下河出口', en: 'Bama, Guangxi / Underground river outlet' },
    'f4.note': { zh: '水流在岩壁上留下深浅不一的流痕。段染纱的灰阶推移、缩绒后的表面起伏，都从这里取得依据。', en: 'Water leaves flow marks of varying depth on the rock. The grey progression of space-dyed yarn and the surface relief after milling both take their evidence from here.' },
    'f5.alt': { zh: '石林岩层近景，水平层理与风化裂隙清晰可见', en: 'Close view of stone-forest strata, horizontal bedding and weathered fissures clearly visible' },
    'f5.no': { zh: 'FIG. 05', en: 'FIG. 05' },
    'f5.place': { zh: '云南 · 石林 / 岩层剖面', en: 'Stone Forest, Yunnan / Stratal section' },
    'f5.note': { zh: '层理与裂隙，是系列 03 移针提花与局部压褶的直接来源。', en: 'Bedding and fissures are the direct source of the transfer jacquard and local pleating in Series 03.' },
    'field.pull': { zh: '「水用一万年穿过岩石，<br>我们用一根纱，穿过另一根纱。」', en: '“Water takes ten thousand years to pass through rock;<br>we take a single yarn and pass it through another.”' },
    'field.pullSrc': { zh: 'FIELD NOTE / ON TIME AND EROSION', en: 'FIELD NOTE / ON TIME AND EROSION' },
    'field.text.h': { zh: '岩层把时间，<br>写成了水平线。', en: 'Strata write time<br>as a horizontal line.' },
    'field.text.p1': {
      zh: '沉积是一层一层发生的，侵蚀却沿着裂隙垂直切下。石林的剖面因此同时拥有两种方向：水平的色阶与垂直的断口。系列 03 把这两种方向分别交给段染纱与压褶——前者负责颜色如何推移，后者负责结构在哪里断开。',
      en: 'Deposition happens layer by layer, while erosion cuts vertically down along fissures. The stone-forest section therefore holds two directions at once: a horizontal tonal scale and a vertical break. Series 03 assigns these to space-dyed yarn and pleating — the first governs how colour advances, the second where structure breaks.'
    },
    'field.text.p2': {
      zh: '在 7G 横机上，提花块面每 12–24 针错动一次，段染纱的深浅在同一横列内自然过渡；缩绒让布面收紧、边缘变厚，压褶则在 130℃ 下压出硬朗折线。于是“沉积”与“断裂”同时留在了一块布上。',
      en: 'On the 7G flat-bed, jacquard blocks shift every 12–24 needles and the depth of space-dyed yarn moves naturally within a single course; milling tightens the surface and thickens the edge, while pleating at 130°C presses hard fold lines. Deposition and fracture are thus held in the same cloth.'
    },
    'field.text.map': { zh: '对应系列 03「层理 · 灰」/ 移针提花 · 双层次 · 缩绒 · 局部压褶', en: 'Series 03, Strata · Grey / Transfer jacquard · Double layer · Milling · Local pleating' },
    'field.disclaimer': { zh: '影像说明：本页景观与人物影像为 AI 辅助生成的视觉研究，用于呈现地貌结构与织物组织的对照关系。', en: 'Image note: the landscapes and figures on this page are AI-assisted visual studies made to present the relationship between terrain structure and knitted structure.' },

    /* ---------- interlude ---------- */
    'interlude.aria': { zh: '设计引语', en: 'Design statement' },
    'interlude.quote': { zh: '「岩壁的起伏、层理的叠错、溶洞的空透、岩石的灰调——<br>最终都成为线圈的张力。」', en: '“The relief of rock, the stagger of strata, the openness of caverns, the grey of stone —<br>all of it finally becomes the tension of a loop.”' },
    'interlude.src': { zh: 'DESIGN STATEMENT / 黄嘉凤', en: 'DESIGN STATEMENT / HUANG JIAFENG' },

    /* ---------- craft ---------- */
    'craft.eyebrow': { zh: '<span>04</span>制作工艺 / CRAFT &amp; CONSTRUCTION', en: '<span>04</span>CRAFT &amp; CONSTRUCTION' },
    'craft.display': { zh: '从一根纱线，<br><em>到一层岩面。</em>', en: 'From a single yarn<br><em>to a surface of rock.</em>' },
    'craft.lede': {
      zh: '面料的质感不是画出来的，而是在针床、张力与温度之间生成的。本课题以横机为主、圆机为辅，从纱线配伍、上机组织、后整理到成衣打样，每一步都围绕“岩壁的起伏、层理的错动、孔洞的通透”反复试验并记录参数。',
      en: 'The texture of a fabric is not drawn; it is generated between needle bed, tension and temperature. Working mainly on flat-bed machines with circular knitting in support, the project tests and records every step from yarn selection and stitch structure to finishing and garment sampling around three conditions: the relief of the rock face, the displacement of strata and the permeability of the void.'
    },
    'craft.b1': { zh: '纱线选型与配伍', en: 'Yarn Selection' },
    'yarn.h1': { zh: '纱线', en: 'YARN' },
    'yarn.h2': { zh: '成分 / 规格', en: 'COMPOSITION / SPEC' },
    'yarn.h3': { zh: '在织物中的作用', en: 'ROLE IN THE FABRIC' },
    'yarn.r1a': { zh: '羊毛 / 羊绒混纺', en: 'Wool / cashmere blend' },
    'yarn.r1b': { zh: '90 / 10 · 2/26 Nm', en: '90 / 10 · 2/26 Nm' },
    'yarn.r1c': { zh: '主体纱。缩绒后表面起绒，形成风化岩面的粗粝与厚度。', en: 'Main yarn. Milling raises a nap that gives the coarseness and weight of weathered stone.' },
    'yarn.r2a': { zh: '天丝 / 羊毛混纺', en: 'Tencel / wool blend' },
    'yarn.r2b': { zh: '55 / 45 · 2/30 Nm', en: '55 / 45 · 2/30 Nm' },
    'yarn.r2c': { zh: '提供垂坠与冷光，用于镂空系列，使孔洞边缘挺括而不塌。', en: 'Provides drape and a cool sheen; used in the openwork series so aperture edges stay crisp rather than collapsing.' },
    'yarn.r3a': { zh: '段染羊毛混纺', en: 'Space-dyed wool blend' },
    'yarn.r3b': { zh: '2/16 Nm · 灰阶段染', en: '2/16 Nm · grey scale' },
    'yarn.r3c': { zh: '沿横向形成由浅至深的色阶，对应岩层沉积的自然过渡。', en: 'Forms a lateral scale from pale to deep, corresponding to the natural transition of sedimentary beds.' },
    'yarn.r4a': { zh: '混色纱', en: 'Marled yarn' },
    'yarn.r4b': { zh: '羊毛 / 再生涤纶 2/28 Nm', en: 'Wool / recycled polyester 2/28 Nm' },
    'yarn.r4c': { zh: '细密色差。用于孔缘与局部点缀，模拟水痕与矿物杂质。', en: 'Fine tonal irregularity, used at aperture edges and as local accents to suggest water marks and mineral inclusions.' },
    'yarn.r5a': { zh: '再生涤纶长丝', en: 'Recycled polyester filament' },
    'yarn.r5b': { zh: '75D', en: '75D' },
    'yarn.r5c': { zh: '衬垫纱。藏于反面，稳定凸条与块面的立体度，控制尺寸回缩。', en: 'Plating yarn. Hidden on the reverse, it stabilises the relief of ribs and blocks and controls shrinkage.' },
    'yarn.r6a': { zh: '氨纶弹力丝', en: 'Elastane' },
    'yarn.r6b': { zh: '40D', en: '40D' },
    'yarn.r6c': { zh: '少量衬垫，赋予厚重织物回弹，适应围裹与叠穿。', en: 'Plaited in small amounts to give the heavy fabric recovery for wrapping and layering.' },
    'yarn.note': { zh: '所有纱线经同一缸号比对后上机；混纺比例按手感与缩绒率微调，避免不同批次造成色差。', en: 'All yarns are matched against a single dye lot before knitting; blend ratios are adjusted for hand and milling rate to prevent shade variation between batches.' },

    'craft.b2': { zh: '上机与组织结构', en: 'Structure & Machine' },
    'craft.tabsAria': { zh: '组织工艺', en: 'Knit structures' },
    'craft.tab1': { zh: '<span>01</span>凹凸组织', en: '<span>01</span>Relief' },
    'craft.tab2': { zh: '<span>02</span>绞花', en: '<span>02</span>Cable' },
    'craft.tab3': { zh: '<span>03</span>移针提花', en: '<span>03</span>Transfer Jacquard' },
    'craft.tab4': { zh: '<span>04</span>变化挑孔', en: '<span>04</span>Variable Eyelet' },
    'craft.p1.h': { zh: '凹凸组织 <span>RELIEF</span>', en: 'Relief Stitch <span>RELIEF</span>' },
    'craft.p1.p': { zh: '以罗纹为基底，在固定针位连续集圈，使部分线圈停留在针上、形成凸起的纵条；相邻针位保持平针，凸条之间自然形成凹槽。凸条的宽度由连续集圈的针数决定，凹槽的深度由张力控制。', en: 'On a rib ground, tuck is repeated at fixed needle positions so that certain loops are held on the needle and form a raised longitudinal rib; neighbouring positions remain plain, creating a natural groove between ribs. Rib width is set by the number of needles in continuous tuck, groove depth by tension.' },
    'craft.p1.l1': { zh: '上机：7G 横机，中密，横密约 42 纵行 / 10cm', en: 'Machine: 7G flat-bed, medium density, approx. 42 wales / 10 cm' },
    'craft.p1.l2': { zh: '要点：凸条宽度 4–6 针，凹槽保留 2 针平针，避免连续集圈导致张力过大', en: 'Key point: ribs 4–6 needles wide, 2 plain needles held in the groove to avoid excessive tension in continuous tuck' },
    'craft.p1.l3': { zh: '对应：峰林 · 叠 / 岩壁纵向节理', en: 'Corresponds to: Fenglin · Fold / vertical joints of the rock face' },
    'craft.p2.h': { zh: '绞花 <span>CABLE</span>', en: 'Cable <span>CABLE</span>' },
    'craft.p2.p': { zh: '将相邻针位的线圈按固定间隔交换位置，形成向一侧扭转的辫状结构。交叉的跨度与频率决定“折线”的硬度：跨度越大，转折越明显；频率越低，岩层的段落感越强。', en: 'Loops at adjacent needle positions are exchanged at fixed intervals to form a braided structure twisted to one side. The span and frequency of the crossing determine the hardness of the “fold line”: a wider span gives a sharper turn; a lower frequency gives a stronger sense of strata.' },
    'craft.p2.l1': { zh: '上机：7G 横机，每 8 横列交叉一次，跨度 3 针 × 3 针', en: 'Machine: 7G flat-bed, crossing every 8 courses, 3 × 3 needle span' },
    'craft.p2.l2': { zh: '要点：交叉处适当放松张力，防止线圈断裂；反面浮线保持平整', en: 'Key point: relax tension at the crossing to prevent loop breakage; keep floats flat on the reverse' },
    'craft.p2.l3': { zh: '对应：峰林 · 叠 / 岩层受力转折', en: 'Corresponds to: Fenglin · Fold / stress folds in strata' },
    'craft.p3.h': { zh: '移针提花 <span>TRANSFER JACQUARD</span>', en: 'Transfer Jacquard <span>TRANSFER JACQUARD</span>' },
    'craft.p3.p': { zh: '在每一横列改变参与编织的针位，把色纱送到指定区域，形成错落的块面。块面之间不追求精确对齐，而是保留 1–2 针的位移，使层理呈现自然错动，而非机械的几何图案。', en: 'The needles in work change on every course, and colour is carried to the required zone to form staggered blocks. Exact alignment is deliberately avoided; a displacement of 1–2 needles is retained so the strata shift naturally rather than reading as a mechanical geometric pattern.' },
    'craft.p3.l1': { zh: '上机：7G 横机，双色 / 三色换梭，块面宽度 12–24 针', en: 'Machine: 7G flat-bed, two- or three-colour striping, block width 12–24 needles' },
    'craft.p3.l2': { zh: '要点：换梭处控制浮线长度 ≤ 8mm，反面以衬垫纱固定', en: 'Key point: floats at colour changes ≤ 8 mm, fixed on the reverse with plating yarn' },
    'craft.p3.l3': { zh: '对应：层理 · 灰 / 岩层沉积与断裂', en: 'Corresponds to: Strata · Grey / deposition and fracture' },
    'craft.p4.h': { zh: '变化挑孔 <span>VARIABLE EYELET</span>', en: 'Variable Eyelet <span>VARIABLE EYELET</span>' },
    'craft.p4.p': { zh: '通过移针与空针在布面留出孔洞，孔的直径由连续空针数决定。孔洞按“下密上疏”的序列排布，边缘以集圈锁边，形成类似溶蚀孔洞的圆钝轮廓，而不是规则网眼。', en: 'Needle transfer and empty needles leave apertures in the surface; hole diameter is set by the number of consecutive empty needles. Apertures are sequenced from dense below to sparse above and locked at the edge with tuck, producing rounded contours like solution cavities rather than a regular mesh.' },
    'craft.p4.l1': { zh: '上机：12G 横机，孔洞直径 4–14mm，孔距 18–36mm', en: 'Machine: 12G flat-bed, hole diameter 4–14 mm, spacing 18–36 mm' },
    'craft.p4.l2': { zh: '要点：孔径大于 10mm 时加密锁边；浮线长度 ≤ 10mm，防止勾丝', en: 'Key point: increase edge locking above 10 mm; floats ≤ 10 mm to prevent snagging' },
    'craft.p4.l3': { zh: '对应：溶洞 · 透 / 溶洞穹顶与钟乳垂坠', en: 'Corresponds to: Cavern · Permeability / vault and stalactite fall' },

    'craft.b3': { zh: '后整理再造', en: 'Finishing' },
    'craft.b3.text': { zh: '下机只是半成品。缩绒改变纤维的缠结程度，压褶改变布面的折线方向，定型锁定尺寸与形态——三道工序共同决定面料最终的“岩性”。', en: 'Off the machine, the fabric is only half finished. Milling changes the degree of fibre entanglement, pleating changes the direction of fold lines, and setting locks dimension and form — three processes that together decide the final “rock nature” of the cloth.' },
    'fin1.h': { zh: '缩绒', en: 'Milling' },
    'fin1.p': { zh: '35–40℃ 温水、中性缩绒剂，处理 15–20 min。羊毛鳞片在机械作用下缠结，表面起绒，布面收紧，形成风化岩面的粗粝感。', en: 'Warm water at 35–40°C with a neutral milling agent, 15–20 min. Under mechanical action the wool scales entangle, the surface raises a nap and the cloth tightens, producing the coarseness of a weathered rock face.' },
    'fin1.meta': { zh: '回缩率控制 ≤ 8% · 对应系列 01 / 03', en: 'Shrinkage ≤ 8% · Series 01 / 03' },
    'fin2.h': { zh: '水洗柔软', en: 'Washing & Softening' },
    'fin2.p': { zh: '低温水洗配合柔软剂，去除织造过程中的油剂与浮色，改善手感。镂空系列需控制水流强度，避免孔洞变形与边缘起毛。', en: 'Low-temperature washing with a softener removes processing oils and loose colour and improves hand. In the openwork series the water pressure must be controlled to avoid distorting apertures or raising edge fibres.' },
    'fin2.meta': { zh: '水温 ≤ 30℃ · 对应系列 02', en: 'Water ≤ 30°C · Series 02' },
    'fin3.h': { zh: '局部压褶', en: 'Local Pleating' },
    'fin3.p': { zh: '在 130℃ 下以模板压出硬朗折线，仅作用于局部，保留其余部分的柔软。折线与提花块面错位叠加，强化岩层断裂的直线感。', en: 'Templates press hard fold lines at 130°C, applied only locally so the rest of the cloth keeps its softness. The folds are set out of register with the jacquard blocks, reinforcing the straight-line quality of fractured strata.' },
    'fin3.meta': { zh: '压力 0.3 MPa · 对应系列 03', en: 'Pressure 0.3 MPa · Series 03' },
    'fin4.h': { zh: '定型与防缩', en: 'Setting & Anti-shrink' },
    'fin4.p': { zh: '低温蒸汽定型锁定幅宽与孔洞形态；抗起毛起球与防缩整理在最后一道完成，保证成衣在穿着与洗涤后的尺寸稳定。', en: 'Low-temperature steam setting locks width and aperture form; anti-pilling and anti-shrink finishes are applied in the final pass so the garment keeps its dimensions through wear and washing.' },
    'fin4.meta': { zh: '抗起球 ≥ 3 级 · 全系列', en: 'Anti-pilling ≥ grade 3 · All series' },

    'craft.b4': { zh: '从打样到成衣', en: 'Sampling to Garment' },
    'tl1.h': { zh: '形态提取', en: 'Form Extraction' },
    'tl1.p': { zh: '地貌影像与地质图件分类，提取岩壁、层理、孔洞、灰调四类要素，简化为可编织的单元。', en: 'Terrain images and geological maps are classified to extract four elements — rock face, strata, void and grey tone — and reduced to knittable units.' },
    'tl2.h': { zh: '组织设计', en: 'Stitch Design' },
    'tl2.p': { zh: '确定针法、针距与花型循环，绘制组织图与上机图，估算克重与缩率。', en: 'Stitch type, gauge and pattern repeat are fixed; structure and machine charts are drawn and weight and shrinkage estimated.' },
    'tl3.h': { zh: '上机试织', en: 'Trial Knitting' },
    'tl3.p': { zh: '调整张力与密度，试织 30×30cm 样片；记录不同参数下的凸条高度与孔径变化。', en: 'Tension and density are adjusted and 30 × 30 cm swatches knitted; rib height and aperture change are recorded against parameters.' },
    'tl4.h': { zh: '后整理试验', en: 'Finishing Trials' },
    'tl4.p': { zh: '对样片分组做缩绒、压褶、定型对比，测量缩率、厚度与手感，筛选最优组合。', en: 'Swatches are grouped for comparative milling, pleating and setting; shrinkage, thickness and hand are measured to select the best combination.' },
    'tl5.h': { zh: '样片评价', en: 'Swatch Evaluation' },
    'tl5.p': { zh: '从肌理层次、孔洞通透性、悬垂性、尺寸稳定性四方面评分，确定成衣用料。', en: 'Swatches are scored on surface layering, aperture permeability, drape and dimensional stability to determine the final fabric.' },
    'tl6.h': { zh: '成衣制作', en: 'Garment Making' },
    'tl6.p': { zh: '制版、裁剪、缝制，处理面料与廓形、分割线的关系，完成一个系列 4 套成衣。', en: 'Pattern cutting and sewing follow, resolving the relationship between fabric, silhouette and seam lines; four looks complete each collection.' },

    'craft.b5': { zh: '质量控制要点', en: 'Quality Control' },
    'qc1.l': { zh: '密度', en: 'Density' },
    'qc1.p': { zh: '每 10cm 横密 / 纵密偏差，同批样片抽检。', en: 'Wales and courses per 10 cm checked against tolerance; random inspection of each batch.' },
    'qc2.l': { zh: '缩率', en: 'Shrinkage' },
    'qc2.p': { zh: '缩绒前后标记测量，超差调整水温与时间。', en: 'Marked and measured before and after milling; water temperature and time adjusted when out of tolerance.' },
    'qc3.l': { zh: '孔洞', en: 'Aperture' },
    'qc3.p': { zh: '浮线长度上限，孔缘无脱散、无勾丝。', en: 'Maximum float length; edges free of laddering and snagging.' },
    'qc4.l': { zh: '色差', en: 'Colour Difference' },
    'qc4.p': { zh: '同批同缸比对，段染过渡自然无断阶。', en: 'Compared within the same batch and dye lot; space-dyed transitions natural without stepping.' },

    /* ---------- gallery ---------- */
    'gal.eyebrow': { zh: '<span>05</span>纹理图集 / TEXTURE ATLAS', en: '<span>05</span>TEXTURE ATLAS' },
    'gal.display': { zh: '把地貌，<em>放大到纤维。</em>', en: 'Terrain, <em>magnified to the fibre.</em>' },
    'gal.intro': { zh: '八幅织物切片：三幅为组织特写，五幅为地貌意象的织物转译。密度、孔径、灰阶与流向，最终都落在纤维的起伏上。', en: 'Eight fabric fragments: three stitch studies and five landforms translated into cloth. Density, aperture, grey level and flow all resolve into the relief of fibre.' },
    'tile1.name': { zh: '凹凸 · 纵向凸条', en: 'Relief · Longitudinal Ribs' },
    'tile2.name': { zh: '挑孔 · 孔缘', en: 'Eyelet · Aperture Edge' },
    'tile3.name': { zh: '提花 · 层理块面', en: 'Jacquard · Stratal Blocks' },
    'tile4.name': { zh: '峰林 · 柱状秩序', en: 'Fenglin · Columnar Order' },
    'tile5.name': { zh: '溶洞 · 穹顶光隙', en: 'Cavern · Vault Light' },
    'tile6.name': { zh: '石芽 · 侵蚀沟槽', en: 'Karren · Solution Grooves' },
    'tile7.name': { zh: '地下河 · 流痕', en: 'Underground River · Flow Marks' },
    'tile8.name': { zh: '岩层 · 风化灰阶', en: 'Strata · Weathered Grey' },
    'tile.a1': { zh: '凹凸组织纵向凸条纹理', en: 'Longitudinal rib texture of a relief stitch' },
    'tile.a2': { zh: '挑孔组织孔缘纹理', en: 'Aperture-edge texture of an eyelet structure' },
    'tile.a3': { zh: '移针提花层理块面纹理', en: 'Stratal block texture of a transfer jacquard' },
    'tile.a4': { zh: '峰林柱状秩序意象', en: 'Image of columnar fenglin order' },
    'tile.a5': { zh: '溶洞穹顶光隙意象', en: 'Image of light through a cavern vault' },
    'tile.a6': { zh: '石芽与溶痕侵蚀沟槽意象', en: 'Image of karren and solution grooves' },
    'tile.a7': { zh: '地下河侵蚀流痕意象', en: 'Image of erosion marks left by an underground river' },
    'tile.a8': { zh: '岩层断面与风化灰阶意象', en: 'Image of a stratal section and weathered grey tones' },

    /* ---------- about ---------- */
    'about.eyebrow': { zh: '<span>06</span>关于 / ABOUT', en: '<span>06</span>ABOUT' },
    'about.display': { zh: '黄嘉凤<br><em>服231 · 2027 届</em>', en: 'Huang Jiafeng<br><em>Class 231 · 2027</em>' },
    'about.statement': { zh: '以针法为地质作用，以线圈为岩层。三个系列、十二套造型，试图回答一个问题：当地貌不再作为图案被印在布上，它能否成为织物自身的结构？', en: 'With stitch as geological process and loop as stratum, three collections and twelve looks attempt to answer one question: when terrain is no longer printed on cloth as a pattern, can it become the structure of the fabric itself?' },
    'about.i1.dt': { zh: '设计师', en: 'Designer' },
    'about.i1.dd': { zh: '黄嘉凤', en: 'Huang Jiafeng' },
    'about.i2.dt': { zh: '学院', en: 'Institution' },
    'about.i2.dd': { zh: '南通大学杏林学院', en: 'Nantong University Xinglin College' },
    'about.i3.dt': { zh: '专业 / 班级', en: 'Programme / Class' },
    'about.i3.dd': { zh: '服装设计与工程 · 服231', en: 'Fashion Design & Engineering · Class 231' },
    'about.i4.dt': { zh: '学号', en: 'Student ID' },
    'about.i4.dd': { zh: '2315142316', en: '2315142316' },
    'about.i5.dt': { zh: '指导教师', en: 'Supervisor' },
    'about.i5.dd': { zh: '唐虹 教授', en: 'Prof. Tang Hong' },
    'about.i6.dt': { zh: '课题类别', en: 'Project Type' },
    'about.i6.dd': { zh: '毕业论文 · 工程实践', en: 'Graduation thesis · Engineering practice' },
    'about.i7.dt': { zh: '课题名称', en: 'Project Title' },
    'about.i7.dd': { zh: '喀斯特地貌特征下的针织面料再造与服装设计', en: 'Knitted Textile Reconstruction and Fashion Design under Karst Topographic Features' },
    'about.i8.dt': { zh: '成果形式', en: 'Outcome' },
    'about.i8.dd': { zh: '三个系列 12 套效果图与结构图；一个系列 4 套成衣；面料再造小样若干；毕业论文与外文翻译', en: 'Three collections with 12 illustrated looks and structure drawings; four finished garments from one collection; a set of reconstructed swatches; thesis and translated foreign text.' },
    'about.s1': { zh: '设计周期', en: 'Period' },
    'about.s2': { zh: '面料小样', en: 'Swatches' },
    'about.s2v': { zh: '3 组 / 12 款', en: '3 groups / 12 designs' },
    'about.s3': { zh: '成衣', en: 'Garments' },
    'about.s3v': { zh: '4 套', en: '4 looks' },
    'about.s4': { zh: '工艺路线', en: 'Process' },
    'about.s4v': { zh: '横机为主 · 圆机为辅', en: 'Flat-bed primary · circular secondary' },

    /* ---------- press kit ---------- */
    'press.eyebrow': { zh: '<span>06</span>媒体资料 / PRESS KIT', en: '<span>06</span>PRESS KIT' },
    'press.title': { zh: '可用于报道的<br><em>文本与图像。</em>', en: 'Text and images<br><em>cleared for editorial use.</em>' },
    'press.intro': { zh: '以下资料可用于本项目的媒体报道。引用图像时请注明设计师与院校，完整说明见图像包内的 CREDITS 文件。', en: 'The following materials are available for editorial coverage of the project. Please credit the designer and the institution; full terms are included in the CREDITS file inside the image pack.' },
    'press.shortLabel': { zh: '设计师简介 · 短版 / BIO — SHORT', en: 'BIO — SHORT' },
    'press.bioShort': { zh: '黄嘉凤，南通大学杏林学院服装设计与工程专业 2027 届毕业生。毕业设计「丞莘」以喀斯特地貌为形态母题，将岩壁起伏、层理叠错、孔洞空透与灰调层次转译为针织组织语言，完成从面料小样到成衣的系统性再造。', en: 'Huang Jiafeng is a 2027 graduate of Fashion Design and Engineering at Nantong University Xinglin College. Her graduation project, Rose, takes karst topography as its formal motif, translating rock relief, stratal shift, cavern voids and grey gradation into knitted structure — a systematic reconstruction that runs from swatch to garment.' },
    'press.longLabel': { zh: '设计师简介 · 长版 / BIO — LONG', en: 'BIO — LONG' },
    'press.bioLong': { zh: '黄嘉凤，服231班，南通大学杏林学院服装设计与工程专业。她的创作围绕「地貌能否成为织物自身的结构」展开：不以印花复制风景，而以针法、纱线与后整理重建地貌的生成逻辑。毕业设计「丞莘」包含峰林·叠、溶洞·透、层理·灰三个面料系列，共十二套造型，其中四套完成成衣制作。她关注针织物在结构、触感与穿着之间的平衡，倾向以参数化方式记录实验过程，并以克制的色彩与表面处理呈现材料本身的时间感。', en: 'Huang Jiafeng (Class 231) studied Fashion Design and Engineering at Nantong University Xinglin College. Her practice asks whether terrain can become the structure of a fabric rather than its print: instead of reproducing landscape as pattern, she rebuilds its generative logic through stitch, yarn and finishing. The graduation project Rose comprises three fabric collections — Fenglin · Fold, Cavern · Permeability and Strata · Grey — with twelve looks, four of which are realised as garments. Her work balances structure, touch and wearability, documents experiments through parameters, and favours restrained colour and surface treatment that let the material carry its own sense of time.' },
    'press.overviewLabel': { zh: '项目概述 / PROJECT OVERVIEW', en: 'PROJECT OVERVIEW' },
    'press.overview': { zh: '「丞莘」以中国南方喀斯特地貌为研究对象，提取岩壁起伏、层理叠错、孔洞空透与灰调层次四类形态要素，对应凹凸组织、移针提花、变化挑孔与段染配色，并在 7G / 12G 横机上完成上机试验。后整理以缩绒、局部压褶、低温定型与抗起毛起球为核心，最终形成三个面料系列与十二套造型。项目强调「结构转译」而非「图案复制」，并以可复现的参数记录完整的打样流程。', en: 'Rose studies the karst landscapes of southern China and extracts four formal elements — rock relief, stratal shift, cavern void and grey gradation — mapping them onto relief stitch, transfer jacquard, variable eyelet and space-dyed colour on 7G and 12G flat-bed machines. Finishing centres on milling, local pleating, low-temperature setting and anti-pilling, producing three fabric collections and twelve looks. The project insists on structural translation rather than pattern reproduction, and documents the full sampling process through reproducible parameters.' },
    'press.packLabel': { zh: '高清图像包 / IMAGE PACK', en: 'IMAGE PACK' },
    'press.packMeta': { zh: '10 幅图像 · JPG · 长边最高 2560 px · 约 5.8 MB，含使用说明 CREDITS.txt', en: '10 images · JPG · up to 2560 px on the long edge · approx. 5.8 MB, with CREDITS.txt' },
    'press.download': { zh: '下载图像包 / DOWNLOAD IMAGE PACK', en: 'DOWNLOAD IMAGE PACK' },
    'press.contactLabel': { zh: '媒体联系 / MEDIA CONTACT', en: 'MEDIA CONTACT' },
    'press.c1t': { zh: '媒体联络', en: 'Media' },
    'press.c2t': { zh: '院校', en: 'Institution' },
    'press.c2d': { zh: '南通大学杏林学院', en: 'Nantong University Xinglin College' },
    'press.c3t': { zh: '所在地', en: 'Location' },
    'press.c3d': { zh: '中国 · 江苏 南通', en: 'Nantong, Jiangsu, China' },
    'press.c4t': { zh: '图像授权', en: 'Image Use' },
    'press.c4d': { zh: '仅限与本项目报道相关的编辑使用', en: 'Editorial use related to this project only' },
    'press.copy': { zh: '复制文本 / COPY', en: 'COPY TEXT' },
    'press.copied': { zh: '已复制 / COPIED', en: 'COPIED' },

    /* ---------- honours ---------- */
    'hon.eyebrow': { zh: '<span>07</span>荣誉与提名 / HONOURS', en: '<span>07</span>HONOURS' },
    'hon.display': { zh: '被看见之前，<br><em>先被做出来。</em>', en: 'Before being seen,<br><em>it first had to be made.</em>' },
    'hon.intro': { zh: '以下条目为课题在概念展示阶段设定的展演与奖项对照，用于说明作品可能的投递方向，并非实际获奖或提名记录。', en: 'The entries below are conceptual exhibition and award targets set for the graduation project. They indicate possible submission directions and are not actual awards or nominations.' },
    'hon.p1': { zh: '峰林 · 叠<em>FENGLIN / VERTICAL ORDER</em>', en: 'Fenglin · Fold<em>FENGLIN / VERTICAL ORDER</em>' },
    'hon.a1': { zh: '巴黎时装周 · 中国设计新势力展演', en: 'Paris Fashion Week · China New Designers Showcase' },
    'hon.st1': { zh: '入选展演', en: 'Selected' },
    'hon.p2': { zh: '溶洞 · 透<em>CAVERN / VOID &amp; LIGHT</em>', en: 'Cavern · Permeability<em>CAVERN / VOID &amp; LIGHT</em>' },
    'hon.a2': { zh: 'Red Dot Design Award · Communication Design', en: 'Red Dot Design Award · Communication Design' },
    'hon.st2': { zh: '提名', en: 'Nominated' },
    'hon.p3': { zh: '层理 · 灰<em>STRATA / GREY WEATHERING</em>', en: 'Strata · Grey<em>STRATA / GREY WEATHERING</em>' },
    'hon.a3': { zh: 'iF Design Award · Product Design', en: 'iF Design Award · Product Design' },
    'hon.st3': { zh: '入围', en: 'Shortlisted' },
    'hon.p4': { zh: '喀斯特针织面料再造<em>KARST KNITTED TEXTILE</em>', en: 'Karst Knitted Textile<em>KARST KNITTED TEXTILE</em>' },
    'hon.a4': { zh: "A' Design Award · Textile, Fabric &amp; Materials", en: "A' Design Award · Textile, Fabric &amp; Materials" },
    'hon.st4': { zh: '提名', en: 'Nominated' },
    'hon.p5': { zh: '丞莘 · 喀斯特针织档案<em>ROSE / KARST KNIT ARCHIVE</em>', en: 'Rose · Karst Knit Archive<em>ROSE / KARST KNIT ARCHIVE</em>' },
    'hon.a5': { zh: '中国国际大学生时装周 · 针织设计', en: 'China Graduate Fashion Week · Knitwear Design' },
    'hon.st5': { zh: '入选', en: 'Selected' },
    'hon.note': { zh: '本版块为毕业设计概念设定：所列赛事、年份与状态均不作为获奖依据，正式投递与结果以主办方公布为准。', en: 'This section is a conceptual presentation for the graduation project. The listed events, years and statuses are not evidence of awards; actual submissions and results are subject to the organisers’ announcements.' },
    'hon.flag': { zh: '概念设定', en: 'CONCEPTUAL' },

    /* ---------- closing / footer ---------- */
    'closing.aria': { zh: '收尾形象', en: 'Closing image' },
    'closing.alt': { zh: '身着深灰绞花针织外套的背影，立于雾气弥漫的喀斯特石柱之间', en: 'Back view of a figure in a charcoal cable-knit coat among misted karst pillars' },
    'closing.line': { zh: '地貌不复制，<br>结构重生。', en: 'Terrain is not copied;<br>structure is reborn.' },
    'closing.brand': { zh: '丞莘 · ROSE — KARST KNIT ARCHIVE', en: 'ROSE — KARST KNIT ARCHIVE' },
    'foot.m1': { zh: '南通大学杏林学院', en: 'Nantong University Xinglin College' },
    'foot.m2': { zh: '服装设计与工程 · 服231', en: 'Fashion Design & Engineering · Class 231' },
    'foot.m3': { zh: '指导教师 唐虹 教授', en: 'Supervisor · Prof. Tang Hong' },
    'foot.copy': { zh: '© 2026 丞莘 · Rose — 喀斯特地貌特征下的针织面料再造与服装设计', en: '© 2026 ROSE — Knitted Textile Reconstruction and Fashion Design under Karst Topographic Features' },
    'foot.updated': { zh: '最后更新 2026.11 · 毕业设计概念展示', en: 'Last updated 11.2026 · Graduation project, conceptual presentation' }
  };

  var PAGE = {
    title: {
      zh: '丞莘 · 喀斯特地貌针织面料再造与服装设计',
      en: 'Rose · Knitted Textile Reconstruction of Karst Topography'
    },
    desc: {
      zh: '丞莘（Rose）— 喀斯特地貌特征下的针织面料再造与服装设计。以岩壁起伏、层理叠错、孔洞空透与灰调层次为形态母题，在针织物上重建地貌的结构语言。',
      en: 'Rose — knitted textile reconstruction and fashion design under karst topographic features. Rock relief, stratal shift, cavern voids and grey gradation are rebuilt as the structural language of knitted fabric.'
    }
  };

  function saved() {
    try { return localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'zh'; }
    catch (e) { return 'zh'; }
  }

  /* ?lang=en / ?lang=zh 优先于本地记忆，便于分享英文版链接 */
  function fromQuery() {
    var m = null;
    try { m = location.search.match(/[?&]lang=(en|zh)(?:&|$)/); } catch (e) {}
    return m ? m[1] : null;
  }

  var qlang = fromQuery();
  var lang = qlang || saved();
  if (qlang) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }

  function syncUrl() {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    try {
      var url = location.pathname + (lang === 'en' ? '?lang=en' : '') + location.hash;
      history.replaceState(null, '', url);
    } catch (e) {}
  }

  function setMeta(sel, value) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute('content', value);
  }

  /* 分享卡片与 canonical / hreflang：仅在 http(s) 下补全为绝对地址 */
  function seo() {
    var title = PAGE.title[lang];
    var desc = PAGE.desc[lang];
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', desc);
    setMeta('meta[property="og:locale"]', lang === 'en' ? 'en_US' : 'zh_CN');
    setMeta('meta[property="og:locale:alternate"]', lang === 'en' ? 'zh_CN' : 'en_US');

    if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
    var base = location.origin + location.pathname;

    function link(rel, href, hreflang) {
      var sel = 'link[rel="' + rel + '"]' + (hreflang ? '[hreflang="' + hreflang + '"]' : '');
      var el = document.querySelector(sel);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        if (hreflang) el.setAttribute('hreflang', hreflang);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    }

    link('canonical', base + '?lang=zh');
    link('alternate', base + '?lang=zh', 'zh-CN');
    link('alternate', base + '?lang=en', 'en');
    link('alternate', base, 'x-default');

    function absoluteMeta(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var v = el.getAttribute('content');
      if (v && v.indexOf('http') !== 0) {
        try { el.setAttribute('content', new URL(v, location.href).href); } catch (e) {}
      }
    }
    absoluteMeta('meta[property="og:image"]');
    absoluteMeta('meta[name="twitter:image"]');

    if (!document.querySelector('meta[property="og:url"]')) {
      var u = document.createElement('meta');
      u.setAttribute('property', 'og:url');
      document.head.appendChild(u);
    }
    setMeta('meta[property="og:url"]', base + (lang === 'en' ? '?lang=en' : ''));
  }

  function renderEl(el) {
    var key = el.getAttribute('data-i18n');
    var entry = DICT[key];
    if (!entry) return;
    if (lang === 'en') {
      el.innerHTML = entry.en;
    } else {
      var html = entry.zh;
      if (el.hasAttribute('data-bi')) {
        var inline = el.getAttribute('data-bi') === 'inline';
        html += '<span class="i18n-en' + (inline ? ' i18n-en--inline' : '') + '">' + entry.en + '</span>';
      }
      el.innerHTML = html;
    }
  }

  function paint() {
    document.querySelectorAll('[data-i18n]').forEach(renderEl);

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var entry = DICT[el.getAttribute('data-i18n-alt')];
      if (entry) el.setAttribute('alt', entry[lang]);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var entry = DICT[el.getAttribute('data-i18n-aria')];
      if (entry) el.setAttribute('aria-label', entry[lang]);
    });

    document.title = PAGE.title[lang];
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', PAGE.desc[lang]);

    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.documentElement.classList.remove('lang-boot');

    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', b.getAttribute('data-lang') === 'zh'
        ? (lang === 'en' ? 'Switch to Chinese' : '切换到中文')
        : (lang === 'en' ? 'Switch to English' : '切换到英文'));
    });

    var toggle = document.getElementById('navToggle');
    if (toggle) {
      var open = document.body.classList.contains('nav-open');
      var k = open ? 'ui.closeMenu' : 'ui.openMenu';
      toggle.setAttribute('aria-label', DICT[k][lang]);
    }

    seo();
  }

  function currentAnchor() {
    var ids = ['philosophy', 'collections', 'field', 'craft', 'gallery', 'about', 'honours'];
    var line = window.innerHeight * 0.32;
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (!el) continue;
      var r = el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) return el;
    }
    return null;
  }

  function setLang(next) {
    if (next === lang) return;
    var anchor = currentAnchor();
    var before = anchor ? anchor.getBoundingClientRect().top : 0;
    var y = window.pageYOffset || document.documentElement.scrollTop;

    lang = next;
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    paint();
    syncUrl();

    if (anchor) {
      var after = anchor.getBoundingClientRect().top;
      var delta = after - before;
      if (Math.abs(delta) > 1) window.scrollTo(0, y + delta);
    }
  }

  document.querySelectorAll('.lang-switch button').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(b.getAttribute('data-lang'));
    });
  });

  /* ---------- press kit copy ---------- */
  function copyText(text, done) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else {
      fallback();
    }
  }

  document.querySelectorAll('[data-copy-target]').forEach(function (btn) {
    var label = btn.getAttribute('data-i18n') || 'press.copy';
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-copy-target'));
      if (!target) return;
      /* 中文模式下复制时剔除英文副行，避免粘出双语混排 */
      var clone = target.cloneNode(true);
      clone.querySelectorAll('.i18n-en').forEach(function (n) { n.parentNode.removeChild(n); });
      copyText(clone.innerText.trim(), function () {
        btn.textContent = DICT['press.copied'][lang];
        clearTimeout(btn._copyTimer);
        btn._copyTimer = setTimeout(function () {
          btn.textContent = DICT[label][lang];
        }, 1800);
      });
    });
  });

  paint();
})();
