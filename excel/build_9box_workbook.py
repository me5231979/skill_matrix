#!/usr/bin/env python3
"""Build the VU 9-Box Talent Assessment per-unit workbook (formula-only .xlsx)."""
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, Protection
from openpyxl.comments import Comment
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.utils import get_column_letter

OUT = "VU_9Box_Talent_Assessment_Template.xlsx"

# ---------- palette / styles ----------
GOLD = "CFAE70"
BLACK = "1C1C1C"
INPUT_FILL = PatternFill("solid", fgColor="FFF7E0")
AUTO_FILL = PatternFill("solid", fgColor="F5F5F5")
HDR_FILL = PatternFill("solid", fgColor=BLACK)
SEC_FILL = PatternFill("solid", fgColor="E8DCC3")
GREEN_FILL = PatternFill("solid", fgColor="C6EFCE")
AMBER_FILL = PatternFill("solid", fgColor="FFEB9C")
RED_FILL = PatternFill("solid", fgColor="FFC7CE")
BLUE_FILL = PatternFill("solid", fgColor="DDEBF7")
MID_FILL = PatternFill("solid", fgColor="FFF2CC")
GREY_FILL = PatternFill("solid", fgColor="F2F2F2")

F_BASE = Font(name="Arial", size=10)
F_BOLD = Font(name="Arial", size=10, bold=True)
F_HDR = Font(name="Arial", size=10, bold=True, color="FFFFFF")
F_TITLE = Font(name="Arial", size=16, bold=True, color=BLACK)
F_SUB = Font(name="Arial", size=10, italic=True, color="666666")
F_SEC = Font(name="Arial", size=11, bold=True, color=BLACK)
F_SMALL = Font(name="Arial", size=9, color="444444")

THIN = Side(style="thin", color="BFBFBF")
BOX = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)

# row extents
R0, R1 = 6, 255        # role scoring data rows
A0, A1 = 6, 305        # assessment data rows
S0, S1 = 6, 605        # skills data rows
C0, C1 = 2, 301        # calc helper rows (maps assessment)

RS = "'1. Role Scoring'"
AS = "'2. Assessment'"
SK = "'3. Skills (SBJA)'"

wb = openpyxl.Workbook()
wb.remove(wb.active)

def cell(ws, ref, value=None, font=F_BASE, fill=None, align=None, border=None,
         fmt=None, locked=True):
    c = ws[ref]
    if value is not None:
        c.value = value
    c.font = font
    if fill: c.fill = fill
    if align: c.alignment = align
    if border: c.border = border
    if fmt: c.number_format = fmt
    c.protection = Protection(locked=locked)
    return c

def header_row(ws, row, headers, widths, auto_cols=()):
    for i, (h, w) in enumerate(zip(headers, widths), start=1):
        L = get_column_letter(i)
        c = cell(ws, f"{L}{row}", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
        ws.column_dimensions[L].width = w
    ws.row_dimensions[row].height = 42

def unlock_input_range(ws, col, r_start, r_end, fill=INPUT_FILL, fmt=None, align=None):
    for r in range(r_start, r_end + 1):
        c = ws[f"{col}{r}"]
        c.fill = fill
        c.font = F_BASE
        c.border = BOX
        c.protection = Protection(locked=False)
        if fmt: c.number_format = fmt
        c.alignment = align or Alignment(vertical="top", wrap_text=True)

def formula_col(ws, col, r_start, r_end, template, fmt=None, align=None, fill=AUTO_FILL):
    """template uses {r} for the data row."""
    for r in range(r_start, r_end + 1):
        c = ws[f"{col}{r}"]
        c.value = template.format(r=r)
        c.font = F_BASE
        c.fill = fill
        c.border = BOX
        if fmt: c.number_format = fmt
        c.alignment = align or Alignment(vertical="top", wrap_text=True)
        c.protection = Protection(locked=True)

def dv(ws, formula1, sqref, prompt=None, title=None, allow_blank=True):
    d = DataValidation(type="list", formula1=formula1, allow_blank=allow_blank,
                       showDropDown=False)
    if prompt:
        d.promptTitle = (title or "")[:32]
        d.prompt = prompt[:255]
        d.showInputMessage = True
    d.error = "Pick a value from the dropdown list."
    d.showErrorMessage = True
    ws.add_data_validation(d)
    d.add(sqref)
    return d

def protect(ws, **kw):
    ws.protection.sheet = True
    ws.protection.formatCells = False
    ws.protection.formatColumns = False
    ws.protection.formatRows = False
    ws.protection.autoFilter = False
    ws.protection.sort = False
    ws.protection.selectLockedCells = False
    ws.protection.selectUnlockedCells = False

# =====================================================================
# LISTS (hidden)
# =====================================================================
ls = wb.create_sheet("Lists")
list_data = {
    "A": ("Levels", ["M4", "M5", "E1"]),
    "B": ("Score15", [1, 2, 3, 4, 5]),
    "C": ("Perf", [3, 2, 1]),
    "D": ("HML", ["High", "Medium", "Low"]),
    "E": ("LMH", ["Low", "Medium", "High"]),
    "F": ("YesNo", ["Yes", "No"]),
    "G": ("Reviews", [0, 1, 2]),
    "H": ("Readiness", ["Now", "1-2 yrs", "3+ yrs"]),
    "I": ("Coverage", ["Green", "Yellow", "Red"]),
    "J": ("SkillLevels", ["Foundational", "Intermediate", "Advanced", "Expert"]),
    "K": ("PanelDecision", ["Accept proposed", "Override - documented",
                             "Support pathway - no label", "Defer"]),
    "L": ("BorderlineOutcome", ["Confirmed critical", "Held at Not critical"]),
    "M": ("Wave", ["Pilot", "Wave 1", "Wave 2", "Wave 3"]),
}
for col, (name, vals) in list_data.items():
    cell(ls, f"{col}1", name, font=F_BOLD)
    for i, v in enumerate(vals, start=2):
        cell(ls, f"{col}{i}", v)
# N: mirror of the 9 box labels (for override dropdown)
cell(ls, "N1", "BoxLabels", font=F_BOLD)
matrix_cells = ["C36", "D36", "E36", "C37", "D37", "E37", "C38", "D38", "E38"]
for i, mc in enumerate(matrix_cells, start=2):
    cell(ls, f"N{i}", f"=Setup!${mc[0]}${mc[1:]}")
ls.sheet_state = "hidden"
protect(ls)

# =====================================================================
# SETUP
# =====================================================================
st = wb.create_sheet("Setup")
st.sheet_view.showGridLines = False
for w, col in zip([62, 26, 26, 30, 30, 10], "ABCDEF"):
    st.column_dimensions[col].width = w
cell(st, "A1", "Setup & Program Settings", font=F_TITLE)
cell(st, "A2", "Yellow cells are yours to fill. Everything else is set by the program design "
               "locked at the Sept 11 gate.", font=F_SUB)

cell(st, "A3", "UNIT INFORMATION", font=F_SEC, fill=SEC_FILL)
st.merge_cells("A3:E3")
unit_fields = [
    ("Business Unit", "B4"),
    ("Engagement Consultant (EC)", "B5"),
    ("Calibration chair (one-up leader)", "B6"),
    ("Facilitator", "B7"),
    ("Calibration session date", "B8"),
    ("Wave", "B9"),
]
for i, (label, ref) in enumerate(unit_fields):
    r = 4 + i
    cell(st, f"A{r}", label, font=F_BOLD, border=BOX)
    unlock_input_range(st, "B", r, r, fmt="yyyy-mm-dd" if ref == "B8" else None)
dv(st, "=Lists!$M$2:$M$5", "B9", prompt="Pilot or enterprise wave, per the gate decision.",
   title="Wave")

cell(st, "A11", "PROGRAM SETTINGS  (locked at the Sept 11 gate - change only with the program team)",
     font=F_SEC, fill=SEC_FILL)
st.merge_cells("A11:E11")
settings = [
    ("Critical-role threshold (out of 25)", "B12", 16, "0",
     "16/25 is the initial threshold - a design choice tested in the pilot, not a research constant. Source: program document, 'How We Identify Critical Roles'."),
    ("Borderline band (totals closer than this to the threshold get a mandatory 2nd discussion)", "B13", 2, "0",
     "Scores within 2 points of the 16 threshold get a second discussion. Calibrated to the worked example: 15 is borderline; 14 and 18 are clean calls."),
    ("Concentration review trigger (share of placements in the High-potential top boxes)", "B14", 0.40, "0%",
     "No target distribution. Concentrated results trigger an evidence & fairness review, never a curve. Default mirrors the worked example (2 of 5 = 40%)."),
    ("Career-conversation window (days)", "B15", 365, "0",
     "Aspiration comes only from a documented career conversation held within the last year."),
]
for i, (label, ref, val, fmt, note) in enumerate(settings):
    r = 12 + i
    cell(st, f"A{r}", label, font=F_BOLD, border=BOX, align=WRAP)
    unlock_input_range(st, "B", r, r, fmt=fmt)
    st[ref] = val
    st[ref].comment = Comment(note, "Program design")

cell(st, "A17", "TEAMS / SUB-UNITS  (feeds the Team dropdown on the entry tabs; optional)",
     font=F_SEC, fill=SEC_FILL)
st.merge_cells("A17:E17")
unlock_input_range(st, "A", 18, 32)

cell(st, "A34", "9-BOX LABELS  (row = Performance, column = Potential; labels must stay unique)",
     font=F_SEC, fill=SEC_FILL)
st.merge_cells("A34:E34")
cell(st, "B35", "Performance ↓ / Potential →", font=F_BOLD, border=BOX, align=CENTER)
for col, lab in zip("CDE", ["Low", "Medium", "High"]):
    cell(st, f"{col}35", lab, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
perf_rows = [("3 - Exceeds", ["High Professional", "Emerging Talent", "High Potential"]),
             ("2 - Meets", ["Solid Professional", "Core Performer", "Solid Performer, Strong Potential"]),
             ("1 - Below", ["Action Required", "Inconsistent Performer", "Rough Diamond"])]
for i, (plab, labs) in enumerate(perf_rows):
    r = 36 + i
    cell(st, f"B{r}", plab, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
    for col, lab in zip("CDE", labs):
        unlock_input_range(st, col, r, r, align=CENTER)
        st[f"{col}{r}"] = lab
cell(st, "A40", "Label defaults follow the program document's worked example: High Potential, "
                "Emerging Talent, High Professional, and 'Solid Performer, Strong Potential' are "
                "the document's own terms; the rest are standard 9-box names and may be renamed here.",
     font=F_SMALL)
st.merge_cells("A40:E41")
st["A40"].alignment = WRAP
protect(st)

# =====================================================================
# 1. ROLE SCORING
# =====================================================================
rs = wb.create_sheet("1. Role Scoring")
cell(rs, "A1", "Step 1 - Score the Roles", font=F_TITLE)
cell(rs, "A2", "Score every M4-E1 role on the five anchored 1-5 scales (hover a scored column's "
               "header for the prompt and anchors). Higher always means more critical; Internal "
               "bench is reverse-scored (no bench = 5). Totals, the borderline second-discussion "
               "flag and the CRITICAL? call compute automatically. Every score needs a "
               "one-sentence rationale. Score the seat with a stranger in it - not the incumbent.",
     font=F_SUB)
rs.merge_cells("A2:Q3")
rs["A2"].alignment = WRAP

headers = ["Role ID (auto)", "Role title", "Level", "Team", "VC/CoS call-out?",
           "1 Impact (1-5)", "2 Perf variability (1-5)", "3 Skill scarcity (1-5)",
           "4 Internal bench (reverse) (1-5)", "5 Market & vacancy risk (1-5)",
           "Total /25 (auto)", "Preliminary result (auto)", "2nd discussion held?",
           "2nd discussion outcome", "CRITICAL? (auto)", "Rationale (one sentence)", "QA (auto)"]
widths = [10, 34, 8, 16, 12, 9, 9, 9, 9, 9, 9, 20, 12, 18, 14, 46, 30]
header_row(rs, 5, headers, widths)

anchors = {
    "F": ("Impact", "What breaks in 30-90 days if this seat fails or empties?\n1 = absorbed by others, little disruption\n3 = key function noticeably disrupted; workarounds hold\n5 = core function or strategic priority visibly impaired within weeks"),
    "G": ("Performance variability", "How different are outcomes between an average and a great person in this seat?\n1 = output largely fixed by process\n3 = a great performer meaningfully improves quality, cost or speed\n5 = outcomes swing dramatically on the incumbent's judgment, expertise or relationships"),
    "H": ("Skill scarcity", "How rare is the expertise or undocumented institutional knowledge required?\n1 = common in market; knowledge documented\n3 = 1-2 years to develop; some knowledge undocumented\n5 = rare or takes years; heavy undocumented institutional knowledge"),
    "I": ("Internal bench (REVERSE-scored)", "Could anyone inside credibly cover this role today?\n1 = several people could credibly cover it today\n3 = one plausible person, with real development gaps\n5 = no plausible internal coverage"),
    "J": ("Market & vacancy risk", "How hard is an external search, and how likely is a vacancy within 3 years?\n1 = fast, inexpensive hire; stable incumbent\n3 = 3-6 month search, or moderate vacancy chance\n5 = 6-12+ month costly search, and vacancy plausible within 1-3 years"),
}
for col, (t, txt) in anchors.items():
    rs[f"{col}5"].comment = Comment(f"{t}\n{txt}\nA 2 or 4 falls between anchors.", "Program design", height=220, width=340)

for colref in "BCDEFGHIJMNP":
    unlock_input_range(rs, colref, R0, R1)
formula_col(rs, "A", R0, R1, '=IF($B{r}="","","R"&TEXT(ROW()-5,"000"))')
formula_col(rs, "K", R0, R1,
    '=IF($B{r}="","",IF(COUNT($F{r}:$J{r})<5,"",SUM($F{r}:$J{r})))', fmt="0",
    align=CENTER)
formula_col(rs, "L", R0, R1,
    '=IF($B{r}="","",IF(COUNT($F{r}:$J{r})<5,"Scores incomplete",'
    'IF($K{r}>=Setup!$B$12,"Critical","Not critical")'
    '&IF(ABS($K{r}-Setup!$B$12)<Setup!$B$13," (borderline - 2nd discussion)","")))')
formula_col(rs, "O", R0, R1,
    '=IF($B{r}="","",IF(COUNT($F{r}:$J{r})<5,"Pending scores",'
    'IF(ABS($K{r}-Setup!$B$12)<Setup!$B$13,'
    'IF($N{r}="Confirmed critical","YES",IF($N{r}="Held at Not critical","No","Pending 2nd discussion")),'
    'IF($K{r}>=Setup!$B$12,"YES","No"))))', align=CENTER)
formula_col(rs, "Q", R0, R1,
    '=IF($B{r}="","",IF(COUNT($F{r}:$J{r})<5,"⚠ Scores incomplete",'
    '_xlfn.TEXTJOIN(" · ",TRUE,'
    'IF($P{r}="","⚠ Rationale missing",""),'
    'IF(AND(ABS($K{r}-Setup!$B$12)<Setup!$B$13,$M{r}<>"Yes"),"⚠ 2nd discussion required",""),'
    'IF(AND(ABS($K{r}-Setup!$B$12)<Setup!$B$13,$N{r}=""),"⚠ Outcome not recorded",""))))')

dv(rs, "=Lists!$A$2:$A$4", f"C{R0}:C{R1}", prompt="M4, M5 or E1 only.", title="Level")
dv(rs, "=Setup!$A$18:$A$32", f"D{R0}:D{R1}",
   prompt="Teams come from the Setup tab. Optional.", title="Team")
dv(rs, "=Lists!$F$2:$F$3", f"E{R0}:E{R1}",
   prompt="Did a VC or Chief of Staff call this role out? Input, not verdict - every role is still scored.",
   title="Call-out")
for colref in "FGHIJ":
    dv(rs, "=Lists!$B$2:$B$6", f"{colref}{R0}:{colref}{R1}",
       prompt="Score 1-5 against the anchors (hover the column header). 2 and 4 fall between anchors.",
       title="Score")
dv(rs, "=Lists!$F$2:$F$3", f"M{R0}:M{R1}",
   prompt="Required whenever the total lands within the borderline band.", title="2nd discussion")
dv(rs, "=Lists!$L$2:$L$3", f"N{R0}:N{R1}",
   prompt="Outcome of the mandatory second discussion for borderline totals.", title="Outcome")

rs.freeze_panes = "C6"
rs.auto_filter.ref = f"A5:Q{R1}"
rs.conditional_formatting.add(f"O{R0}:O{R1}",
    FormulaRule(formula=[f'$O{R0}="YES"'], fill=GREEN_FILL, font=Font(name="Arial", size=10, bold=True, color="006100")))
rs.conditional_formatting.add(f"O{R0}:O{R1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("Pending",$O{R0}))'], fill=AMBER_FILL))
rs.conditional_formatting.add(f"L{R0}:L{R1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("2nd discussion",$L{R0}))'], fill=AMBER_FILL))
rs.conditional_formatting.add(f"Q{R0}:Q{R1}",
    FormulaRule(formula=[f'$Q{R0}<>""'], font=Font(name="Arial", size=10, color="9C0006")))
protect(rs)

# =====================================================================
# 2. ASSESSMENT
# =====================================================================
a = wb.create_sheet("2. Assessment")
cell(a, "A1", "Step 2 & 3 - Assess and Calibrate", font=F_TITLE)
cell(a, "A2", "One row per M4-E1 incumbent. Enter the evidence, the Performance rating (1-3) and "
               "the Ability / Aspiration / Engagement reads: Potential and the proposed box compute "
               "automatically (all three High = High; any Low = Low). In calibration the manager "
               "presents, the panel challenges, the one-up leader decides - record the panel "
               "decision, any override with its rationale, and (critical roles only) readiness, "
               "retention risk and coverage. Aspiration comes only from a documented career "
               "conversation. Managers never share a grid label.",
     font=F_SUB)
a.merge_cells("A2:AH3")
a["A2"].alignment = WRAP

headersA = [
    "Person ID (auto)", "Name", "Role (pick from Step 1)", "Level (auto)", "Team (auto)",
    "Critical role? (auto)", "Assessing manager", "Months in role",
    "Active performance process?", "Reviews on record (0-2)", "Career conversation date",
    "Conversation status (auto)", "Performance (1-3)",
    "Performance evidence (results, KPIs, 2 examples)", "Evidence basis (auto)",
    "Ability (H/M/L)", "Aspiration (H/M/L)", "Engagement (H/M/L)", "Potential (auto)",
    "Proposed box (auto)", "SBJA skills at/above (auto)", "SBJA gaps (auto)",
    "Panel decision", "Override placement", "Final box (auto)",
    "Override / dissent record", "Readiness (critical only)", "Retention risk? (critical only)",
    "Risk evidence & action (required if risk = Yes)", "Coverage (critical only)",
    "Flags status (auto)", "Development action", "Development due (auto)", "QA (auto)"]
widthsA = [10, 20, 30, 8, 14, 11, 18, 9, 11, 9, 13, 13, 9, 42, 16, 8, 8, 8, 10, 18,
           10, 8, 18, 18, 18, 30, 12, 11, 32, 11, 16, 32, 12, 40]
header_row(a, 5, headersA, widthsA)

a["P5"].comment = Comment("Ability: demonstrated learning agility - not similarity or visibility.", "Program design")
a["Q5"].comment = Comment("Aspiration comes ONLY from a documented career conversation - asked, never assumed.", "Program design")
a["R5"].comment = Comment("Engagement: observable work behavior and stated intent - never location, caregiving, or willingness to relocate.", "Program design")
a["M5"].comment = Comment("3 Exceeds, 2 Meets, 1 Below, over the last 12-18 months. Reviews on record first (at most two), then results and two specific examples. No review on record = structured retrospective, flagged, with one extra probe. SBJA proficiency supports the rating where tied to real outcomes.", "Program design", height=180, width=320)
a["W5"].comment = Comment("The one-up leader decides every placement. 'Support pathway - no label' is for anyone in an active performance process. 'Defer' for placements the panel postpones. Overrides and dissent are documented.", "Program design", height=140, width=320)

for colref in ["B", "C", "G", "H", "I", "J", "K", "M", "N", "P", "Q", "R", "W", "X",
               "Z", "AA", "AB", "AC", "AD", "AF"]:
    unlock_input_range(a, colref, A0, A1,
                       fmt="yyyy-mm-dd" if colref == "K" else None)

formula_col(a, "A", A0, A1, '=IF($B{r}="","","P"&TEXT(ROW()-5,"000"))')
formula_col(a, "D", A0, A1,
    f'=IF($C{{r}}="","",IFERROR(INDEX({RS}!$C$6:$C$255,MATCH($C{{r}},{RS}!$B$6:$B$255,0)),"Role not in Step 1"))',
    align=CENTER)
formula_col(a, "E", A0, A1,
    f'=IF($C{{r}}="","",IFERROR(INDEX({RS}!$D$6:$D$255,MATCH($C{{r}},{RS}!$B$6:$B$255,0)),""))')
formula_col(a, "F", A0, A1,
    f'=IF($C{{r}}="","",IFERROR(INDEX({RS}!$O$6:$O$255,MATCH($C{{r}},{RS}!$B$6:$B$255,0)),"Role not in Step 1"))',
    align=CENTER)
formula_col(a, "L", A0, A1,
    '=IF($B{r}="","",IF($K{r}="","Needed",IF(TODAY()-$K{r}<=Setup!$B$15,"Current","Needed (>12 mo)")))',
    align=CENTER)
formula_col(a, "O", A0, A1,
    '=IF($B{r}="","",IF($J{r}="","Reviews not entered",IF($J{r}=0,"Retrospective - extra probe","Reviews on record: "&$J{r})))')
formula_col(a, "S", A0, A1,
    '=IF(OR($P{r}="",$Q{r}="",$R{r}=""),"",IF(COUNTIF($P{r}:$R{r},"Low")>0,"Low",IF(COUNTIF($P{r}:$R{r},"High")=3,"High","Medium")))',
    align=CENTER)
formula_col(a, "T", A0, A1,
    '=IF(OR($M{r}="",$S{r}=""),"",INDEX(Setup!$C$36:$E$38,4-$M{r},MATCH($S{r},Lists!$E$2:$E$4,0)))')
formula_col(a, "U", A0, A1,
    f'=IF($B{{r}}="","",IF(COUNTIF({SK}!$A$6:$A$605,$B{{r}})=0,"—",'
    f'(COUNTIFS({SK}!$A$6:$A$605,$B{{r}},{SK}!$F$6:$F$605,"At")'
    f'+COUNTIFS({SK}!$A$6:$A$605,$B{{r}},{SK}!$F$6:$F$605,"Above"))'
    f'/COUNTIF({SK}!$A$6:$A$605,$B{{r}})))', fmt="0%", align=CENTER)
formula_col(a, "V", A0, A1,
    f'=IF($B{{r}}="","",IF(COUNTIF({SK}!$A$6:$A$605,$B{{r}})=0,"—",'
    f'COUNTIFS({SK}!$A$6:$A$605,$B{{r}},{SK}!$F$6:$F$605,"GAP")))', fmt="0", align=CENTER)
formula_col(a, "Y", A0, A1,
    '=IF($B{r}="","",IF($W{r}="","Pending calibration",'
    'IF($W{r}="Support pathway - no label","Support pathway (no label)",'
    'IF($W{r}="Defer","Deferred",'
    'IF($W{r}="Override - documented",IF($X{r}="","⚠ Select override placement",$X{r}),'
    'IF($T{r}="","Pending assessment",$T{r}))))))')
formula_col(a, "AE", A0, A1,
    '=IF($B{r}="","",IF($F{r}<>"YES","n/a - not critical",'
    'IF(AND($H{r}<>"",$H{r}<6),"Deferred (<6 mo in role)",'
    'IF(OR($AA{r}="",$AB{r}="",$AD{r}=""),"Incomplete",'
    'IF(AND($AB{r}="Yes",$AC{r}=""),"Risk action missing","Complete")))))', align=CENTER)
formula_col(a, "AG", A0, A1,
    '=IF(OR($B{r}="",Setup!$B$8=""),"",Setup!$B$8+30)', fmt="yyyy-mm-dd", align=CENTER)
formula_col(a, "AH", A0, A1,
    '=IF($B{r}="","",_xlfn.TEXTJOIN(" · ",TRUE,'
    'IF(AND($M{r}<>"",$N{r}=""),"⚠ Performance evidence missing",""),'
    'IF(AND($Q{r}<>"",$K{r}=""),"⚠ Aspiration needs a documented career conversation",""),'
    'IF(AND($M{r}<>"",$L{r}<>"Current"),"⚠ Career conversation needed",""),'
    'IF(AND($W{r}="Override - documented",$Z{r}=""),"⚠ Override rationale missing",""),'
    'IF(AND($AB{r}="Yes",$AC{r}=""),"⚠ Retention action missing",""),'
    f'IF(AND($F{{r}}="YES",COUNTIF({SK}!$A$6:$A$605,$B{{r}})=0),"⚠ SBJA skills check missing (critical role)",""),'
    'IF(AND($I{r}="Yes",$W{r}<>"Support pathway - no label",$W{r}<>""),"⚠ Active performance process: support pathway, no label","")))')

dv(a, f"={RS}!$B$6:$B$255", f"C{A0}:C{A1}",
   prompt="Pick the role exactly as entered on 1. Role Scoring. Make role titles unique (add the team if needed).",
   title="Role")
dv(a, "=Lists!$F$2:$F$3", f"I{A0}:I{A1}",
   prompt="Yes = an active performance process. That means a support pathway, no label - pay, slating and improvement topics get parked.",
   title="Active process")
dv(a, "=Lists!$G$2:$G$4", f"J{A0}:J{A1}",
   prompt="Reviews on record, at most two. 0 = structured retrospective, flagged, with one extra probe.",
   title="Reviews")
dv(a, "=Lists!$C$2:$C$4", f"M{A0}:M{A1}",
   prompt="3 Exceeds · 2 Meets · 1 Below, over the last 12-18 months, evidence first.",
   title="Performance")
for colref in "PQR":
    dv(a, "=Lists!$D$2:$D$4", f"{colref}{A0}:{colref}{A1}",
       prompt="High / Medium / Low. All three High = High potential; any Low = Low potential.",
       title="A / A / E")
dv(a, "=Lists!$K$2:$K$5", f"W{A0}:W{A1}",
   prompt="The one-up leader's decision on the proposed box.", title="Panel decision")
dv(a, "=Lists!$N$2:$N$10", f"X{A0}:X{A1}",
   prompt="Only when the panel decision is 'Override - documented'. Record the rationale and dissent.",
   title="Override")
dv(a, "=Lists!$H$2:$H$4", f"AA{A0}:AA{A1}",
   prompt="Critical-role incumbents only: time to broader scope. Under 6 months in role defers.",
   title="Readiness")
dv(a, "=Lists!$F$2:$F$3", f"AB{A0}:AB{A1}",
   prompt="Critical roles and calibrated regrettable-loss risk only. Confidential, evidence-based, always paired with an action.",
   title="Retention risk")
dv(a, "=Lists!$I$2:$I$4", f"AD{A0}:AD{A1}",
   prompt="Green = sustainable · Yellow = one option or a gap · Red = no backup.",
   title="Coverage")

a.freeze_panes = "D6"
a.auto_filter.ref = f"A5:AH{A1}"
a.conditional_formatting.add(f"F{A0}:F{A1}",
    FormulaRule(formula=[f'$F{A0}="YES"'], fill=GREEN_FILL, font=Font(name="Arial", size=10, bold=True, color="006100")))
a.conditional_formatting.add(f"L{A0}:L{A1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("Needed",$L{A0}))'], fill=AMBER_FILL))
a.conditional_formatting.add(f"Y{A0}:Y{A1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("Pending",$Y{A0}))'], fill=AMBER_FILL))
a.conditional_formatting.add(f"Y{A0}:Y{A1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("Support pathway",$Y{A0}))'], fill=BLUE_FILL))
a.conditional_formatting.add(f"Y{A0}:Y{A1}",
    FormulaRule(formula=[f'ISNUMBER(SEARCH("⚠",$Y{A0}))'], fill=RED_FILL))
a.conditional_formatting.add(f"AD{A0}:AD{A1}",
    FormulaRule(formula=[f'$AD{A0}="Red"'], fill=RED_FILL))
a.conditional_formatting.add(f"AD{A0}:AD{A1}",
    FormulaRule(formula=[f'$AD{A0}="Yellow"'], fill=AMBER_FILL))
a.conditional_formatting.add(f"AD{A0}:AD{A1}",
    FormulaRule(formula=[f'$AD{A0}="Green"'], fill=GREEN_FILL))
a.conditional_formatting.add(f"AB{A0}:AB{A1}",
    FormulaRule(formula=[f'$AB{A0}="Yes"'], fill=RED_FILL))
a.conditional_formatting.add(f"AE{A0}:AE{A1}",
    FormulaRule(formula=[f'OR($AE{A0}="Incomplete",$AE{A0}="Risk action missing")'], fill=AMBER_FILL))
a.conditional_formatting.add(f"AH{A0}:AH{A1}",
    FormulaRule(formula=[f'$AH{A0}<>""'], font=Font(name="Arial", size=10, color="9C0006")))
protect(a)

# =====================================================================
# 3. SKILLS (SBJA)
# =====================================================================
sk = wb.create_sheet("3. Skills (SBJA)")
cell(sk, "A1", "SBJA Skills Check - critical roles only", font=F_TITLE)
cell(sk, "A2", "For each critical-role incumbent, list the skills the Skills-Based Job "
               "Architecture attaches to their role and the level the role requires, then rate the "
               "person's current level. One question: is this person at the level the role needs? "
               "At or above supports the placement; below becomes the development plan. Skills "
               "never decide a placement alone. The % at/above and gap count feed the Assessment "
               "tab automatically.",
     font=F_SUB)
sk.merge_cells("A2:G3")
sk["A2"].alignment = WRAP

headersS = ["Person (pick from Step 2)", "Role (auto)", "Skill (from the SBJA)",
            "Required @ role level", "Current level", "Δ (auto)", "Suggested action (auto)"]
widthsS = [24, 30, 32, 18, 18, 10, 42]
header_row(sk, 5, headersS, widthsS)
for colref in "ACDE":
    unlock_input_range(sk, colref, S0, S1)
formula_col(sk, "B", S0, S1,
    f'=IF($A{{r}}="","",IFERROR(INDEX({AS}!$C$6:$C$305,MATCH($A{{r}},{AS}!$B$6:$B$305,0)),"Not in Step 2"))')
formula_col(sk, "F", S0, S1,
    '=IF(OR($A{r}="",$D{r}="",$E{r}=""),"",'
    'IF(MATCH($E{r},Lists!$J$2:$J$5,0)>MATCH($D{r},Lists!$J$2:$J$5,0),"Above",'
    'IF(MATCH($E{r},Lists!$J$2:$J$5,0)=MATCH($D{r},Lists!$J$2:$J$5,0),"At","GAP")))',
    align=CENTER)
formula_col(sk, "G", S0, S1,
    '=IF($F{r}="GAP","Development priority: "&$C{r},'
    'IF($F{r}="Above","Capability evidence - feeds the ability discussion",""))')

dv(sk, f"={AS}!$B$6:$B$305", f"A{S0}:A{S1}",
   prompt="Pick the person exactly as entered on 2. Assessment.", title="Person")
dv(sk, "=Lists!$J$2:$J$5", f"D{S0}:D{S1}",
   prompt="The proficiency the SBJA publishes for this role's level.", title="Required")
dv(sk, "=Lists!$J$2:$J$5", f"E{S0}:E{S1}",
   prompt="The incumbent's demonstrated proficiency, tied to real outcomes.", title="Current")

sk.freeze_panes = "B6"
sk.auto_filter.ref = f"A5:G{S1}"
sk.conditional_formatting.add(f"F{S0}:F{S1}",
    FormulaRule(formula=[f'$F{S0}="GAP"'], fill=RED_FILL, font=Font(name="Arial", size=10, bold=True, color="9C0006")))
sk.conditional_formatting.add(f"F{S0}:F{S1}",
    FormulaRule(formula=[f'$F{S0}="At"'], fill=GREEN_FILL))
sk.conditional_formatting.add(f"F{S0}:F{S1}",
    FormulaRule(formula=[f'$F{S0}="Above"'], fill=BLUE_FILL))
protect(sk)

# =====================================================================
# CALC (hidden helper)
# =====================================================================
cs = wb.create_sheet("Calc")
box_map = ["C36", "D36", "E36", "C37", "D37", "E37", "C38", "D38", "E38"]  # A..I
for i, mc in enumerate(box_map):
    L = get_column_letter(i + 1)
    cell(cs, f"{L}1", f"Box {mc}", font=F_BOLD)
    for r in range(C0, C1 + 1):
        ar = r + 4
        cs[f"{L}{r}"] = (f'=IF({AS}!$Y{ar}=Setup!${mc[0]}${mc[1:]},{AS}!$B{ar},"")')
cell(cs, "K1", "Red coverage roles", font=F_BOLD)
cell(cs, "L1", "Retention-risk flags", font=F_BOLD)
for r in range(C0, C1 + 1):
    ar = r + 4
    cs[f"K{r}"] = (f'=IF(AND({AS}!$F{ar}="YES",{AS}!$AD{ar}="Red"),'
                   f'{AS}!$C{ar}&" - "&{AS}!$B{ar},"")')
    cs[f"L{r}"] = (f'=IF({AS}!$AB{ar}="Yes",{AS}!$B{ar}&" ("&{AS}!$C{ar}&")","")')
cs.sheet_state = "hidden"
protect(cs)

# =====================================================================
# 9-BOX GRID
# =====================================================================
g = wb.create_sheet("9-Box Grid")
g.sheet_view.showGridLines = False
g.column_dimensions["A"].width = 16
for col in "BCD":
    g.column_dimensions[col].width = 46
cell(g, "A1", "The 9-Box Grid", font=F_TITLE)
cell(g, "A2", '=IF(Setup!$B$4="","(business unit not set - see Setup)",Setup!$B$4)&" · calibrated placements only · a box is a snapshot, not a verdict"',
     font=F_SUB)
cell(g, "A4", "Performance ↓ / Potential →", font=F_BOLD, align=CENTER, border=BOX)
for col, mcell in zip("BCD", ["C35", "D35", "E35"]):
    cell(g, f"{col}4", f"=Setup!${mcell[0]}${mcell[1:]}", font=F_HDR, fill=HDR_FILL,
         align=CENTER, border=BOX)

band_fill = {
    ("3", "D"): GREEN_FILL, ("3", "C"): MID_FILL, ("2", "D"): MID_FILL,
    ("3", "B"): GREY_FILL, ("2", "C"): GREY_FILL, ("1", "D"): GREY_FILL,
    ("2", "B"): PatternFill("solid", fgColor="E9E9E9"),
    ("1", "C"): PatternFill("solid", fgColor="E9E9E9"),
    ("1", "B"): RED_FILL,
}
perf_bands = [("3", "3 - Exceeds", 5, ["C36", "D36", "E36"], ["A", "B", "C"]),
              ("2", "2 - Meets", 7, ["C37", "D37", "E37"], ["D", "E", "F"]),
              ("1", "1 - Below", 9, ["C38", "D38", "E38"], ["G", "H", "I"])]
for pkey, plab, row, mcells, calc_cols in perf_bands:
    cell(g, f"A{row}", plab, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
    g.merge_cells(f"A{row}:A{row+1}")
    for col, mc, cc in zip("BCD", mcells, calc_cols):
        fill = band_fill[(pkey, col)]
        cell(g, f"{col}{row}",
             f'=Setup!${mc[0]}${mc[1:]}&"  ("&COUNTIF({AS}!$Y$6:$Y$305,Setup!${mc[0]}${mc[1:]})&")"',
             font=F_BOLD, fill=fill, align=CENTER, border=BOX)
        cell(g, f"{col}{row+1}",
             f'=_xlfn.TEXTJOIN(", ",TRUE,Calc!${cc}$2:${cc}$301)',
             fill=fill, align=WRAP, border=BOX)
    g.row_dimensions[row].height = 22
    g.row_dimensions[row + 1].height = 64

cell(g, "A12", "PLACEMENT SUMMARY", font=F_SEC, fill=SEC_FILL)
g.merge_cells("A12:D12")
summary = [
    ("People entered (Step 2)", f'=COUNTA({AS}!$B$6:$B$305)', "0"),
    ("Placed on the grid", f'=SUMPRODUCT(COUNTIF({AS}!$Y$6:$Y$305,Setup!$C$36:$E$38))', "0"),
    ("Pending assessment", f'=COUNTIF({AS}!$Y$6:$Y$305,"Pending assessment")', "0"),
    ("Pending calibration", f'=COUNTIF({AS}!$Y$6:$Y$305,"Pending calibration")+COUNTIF({AS}!$Y$6:$Y$305,"⚠ Select override placement")', "0"),
    ("Support pathway (no label)", f'=COUNTIF({AS}!$Y$6:$Y$305,"Support pathway (no label)")', "0"),
    ("Deferred", f'=COUNTIF({AS}!$Y$6:$Y$305,"Deferred")', "0"),
    ("Share in the High-potential top boxes", f'=IF($C$14=0,"—",(COUNTIF({AS}!$Y$6:$Y$305,Setup!$E$36)+COUNTIF({AS}!$Y$6:$Y$305,Setup!$E$37))/$C$14)', "0%"),
    ("Concentration check (review, never a curve)",
     '=IF($C$14=0,"—",IF($C$19>Setup!$B$14,"⚠ Concentrated result - run the evidence & fairness review","Within expected range"))', None),
]
for i, (label, f, fmt) in enumerate(summary):
    r = 13 + i
    g.merge_cells(f"A{r}:B{r}")
    cell(g, f"A{r}", label, font=F_BOLD, border=BOX)
    cell(g, f"C{r}", f, border=BOX, fmt=fmt, align=Alignment(horizontal="left"))
g.conditional_formatting.add("C20",
    FormulaRule(formula=['ISNUMBER(SEARCH("⚠",$C$20))'], fill=AMBER_FILL))
cell(g, "A22", "No target distribution: concentrated results trigger an evidence and fairness "
               "review, never a curve. Small groups legitimately run high. Placements refresh "
               "every 6-12 months.", font=F_SMALL)
g.merge_cells("A22:D23")
g["A22"].alignment = WRAP
protect(g)

# =====================================================================
# DASHBOARD
# =====================================================================
d = wb.create_sheet("Dashboard")
d.sheet_view.showGridLines = False
for w, col in zip([42, 30, 30, 18, 42, 14], "ABCDEF"):
    d.column_dimensions[col].width = w
cell(d, "A1", "Unit Readout Dashboard", font=F_TITLE)
cell(d, "A2", '="Business unit: "&IF(Setup!$B$4="","(not set)",Setup!$B$4)&"   ·   EC: "&IF(Setup!$B$5="","(not set)",Setup!$B$5)&"   ·   Calibration chair: "&IF(Setup!$B$6="","(not set)",Setup!$B$6)',
     font=F_SUB)

cell(d, "A4", "THE FOUR OUTPUTS - a unit counts as complete when all four exist", font=F_SEC, fill=SEC_FILL)
d.merge_cells("A4:D4")
for cix, h in zip("ABCD", ["Output", "Measure", "Value", "Status"]):
    cell(d, f"{cix}5", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)

rows4 = [
    ("1 · Critical-role list", "Roles scored / critical / pending",
     f'=COUNTA({RS}!$B$6:$B$255)&" scored · "&COUNTIF({RS}!$O$6:$O$255,"YES")&" critical · "&COUNTIF({RS}!$O$6:$O$255,"Pending scores")+COUNTIF({RS}!$O$6:$O$255,"Pending 2nd discussion")&" pending"',
     f'=IF(AND(COUNTA({RS}!$B$6:$B$255)>0,COUNTIF({RS}!$O$6:$O$255,"Pending scores")+COUNTIF({RS}!$O$6:$O$255,"Pending 2nd discussion")=0),"Complete","In progress")'),
    ("2 · Calibrated placements", "People / placed or resolved / pending",
     f'=COUNTA({AS}!$B$6:$B$305)&" people · "&SUMPRODUCT(COUNTIF({AS}!$Y$6:$Y$305,Setup!$C$36:$E$38))+COUNTIF({AS}!$Y$6:$Y$305,"Support pathway (no label)")+COUNTIF({AS}!$Y$6:$Y$305,"Deferred")&" resolved · "&COUNTIF({AS}!$Y$6:$Y$305,"Pending*")+COUNTIF({AS}!$Y$6:$Y$305,"⚠ Select override placement")&" pending"',
     f'=IF(AND(COUNTA({AS}!$B$6:$B$305)>0,COUNTIF({AS}!$Y$6:$Y$305,"Pending*")+COUNTIF({AS}!$Y$6:$Y$305,"⚠ Select override placement")=0),"Complete","In progress")'),
    ("3 · Flags (critical-role incumbents)", "Complete or deferred / incomplete",
     f'=COUNTIF({AS}!$AE$6:$AE$305,"Complete")+COUNTIF({AS}!$AE$6:$AE$305,"Deferred (<6 mo in role)")&" done · "&COUNTIF({AS}!$AE$6:$AE$305,"Incomplete")+COUNTIF({AS}!$AE$6:$AE$305,"Risk action missing")&" open"',
     f'=IF(COUNTIF({AS}!$AE$6:$AE$305,"Incomplete")+COUNTIF({AS}!$AE$6:$AE$305,"Risk action missing")=0,"Complete","In progress")'),
    ("4 · Dataset entry (QA clean)", "Open QA items across all tabs",
     f'=COUNTIF({RS}!$Q$6:$Q$255,"*⚠*")+COUNTIF({AS}!$AH$6:$AH$305,"*⚠*")&" open QA items"',
     f'=IF(COUNTIF({RS}!$Q$6:$Q$255,"*⚠*")+COUNTIF({AS}!$AH$6:$AH$305,"*⚠*")=0,"Ready","Issues open")'),
]
for i, (o, m, v, s) in enumerate(rows4):
    r = 6 + i
    cell(d, f"A{r}", o, font=F_BOLD, border=BOX)
    cell(d, f"B{r}", m, border=BOX)
    cell(d, f"C{r}", v, border=BOX, align=Alignment(horizontal="left"))
    cell(d, f"D{r}", s, border=BOX, align=CENTER, font=F_BOLD)
cell(d, "A10", "UNIT STATUS", font=F_BOLD, border=BOX)
cell(d, "D10",
     '=IF(AND($D$6="Complete",$D$7="Complete",$D$8="Complete",$D$9="Ready"),"UNIT COMPLETE ✓","IN PROGRESS")',
     font=Font(name="Arial", size=12, bold=True), border=BOX, align=CENTER)
d.merge_cells("A10:C10")
d.row_dimensions[10].height = 26
for ref in ["D6", "D7", "D8", "D9", "D10"]:
    d.conditional_formatting.add(ref, FormulaRule(
        formula=[f'OR(${ref[0]}${ref[1:]}="Complete",${ref[0]}${ref[1:]}="Ready",${ref[0]}${ref[1:]}="UNIT COMPLETE ✓")'],
        fill=GREEN_FILL))
    d.conditional_formatting.add(ref, FormulaRule(
        formula=[f'OR(${ref[0]}${ref[1:]}="In progress",${ref[0]}${ref[1:]}="Issues open",${ref[0]}${ref[1:]}="IN PROGRESS")'],
        fill=AMBER_FILL))

cell(d, "A13", "QA & EVIDENCE CHECKS  (each item names its row on the entry tabs)", font=F_SEC, fill=SEC_FILL)
d.merge_cells("A13:D13")
qa_rows = [
    ("Role rationale missing", f'=COUNTIF({RS}!$Q$6:$Q$255,"*Rationale missing*")'),
    ("Borderline: 2nd discussion required", f'=COUNTIF({RS}!$Q$6:$Q$255,"*2nd discussion required*")'),
    ("Borderline: outcome not recorded", f'=COUNTIF({RS}!$Q$6:$Q$255,"*Outcome not recorded*")'),
    ("Role scores incomplete", f'=COUNTIF({RS}!$Q$6:$Q$255,"*Scores incomplete*")'),
    ("Performance evidence missing", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Performance evidence missing*")'),
    ("Aspiration without a documented career conversation", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Aspiration needs*")'),
    ("Career conversation needed", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Career conversation needed*")'),
    ("Override rationale missing", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Override rationale missing*")'),
    ("Retention risk without an action", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Retention action missing*")'),
    ("Critical role without an SBJA skills check", f'=COUNTIF({AS}!$AH$6:$AH$305,"*SBJA skills check missing*")'),
    ("Active performance process placed with a label", f'=COUNTIF({AS}!$AH$6:$AH$305,"*Active performance process*")'),
    ("Retrospective ratings (info - extra probe applies, not an error)", f'=COUNTIF({AS}!$O$6:$O$305,"Retrospective*")'),
]
for i, (label, f) in enumerate(qa_rows):
    r = 14 + i
    cell(d, f"A{r}", label, border=BOX)
    d.merge_cells(f"A{r}:B{r}")
    cell(d, f"C{r}", f, border=BOX, align=CENTER, fmt="0")
    if i < 11:
        d.conditional_formatting.add(f"C{r}", FormulaRule(formula=[f'$C${r}>0'], fill=RED_FILL))

cell(d, "A27", "DISTRIBUTIONS  (no target distribution - review, never a curve)", font=F_SEC, fill=SEC_FILL)
d.merge_cells("A27:D27")
dist_rows = [
    ("Performance - 3 Exceeds", f'=COUNTIF({AS}!$M$6:$M$305,3)'),
    ("Performance - 2 Meets", f'=COUNTIF({AS}!$M$6:$M$305,2)'),
    ("Performance - 1 Below", f'=COUNTIF({AS}!$M$6:$M$305,1)'),
    ("Potential - High", f'=COUNTIF({AS}!$S$6:$S$305,"High")'),
    ("Potential - Medium", f'=COUNTIF({AS}!$S$6:$S$305,"Medium")'),
    ("Potential - Low", f'=COUNTIF({AS}!$S$6:$S$305,"Low")'),
]
for i, (label, f) in enumerate(dist_rows):
    r = 28 + i
    cell(d, f"A{r}", label, border=BOX)
    cell(d, f"C{r}", f, border=BOX, align=CENTER, fmt="0")
for i, mc in enumerate(matrix_cells):
    r = 28 + i
    cell(d, f"E{r}", f"=Setup!${mc[0]}${mc[1:]}", border=BOX)
    cell(d, f"F{r}", f'=COUNTIF({AS}!$Y$6:$Y$305,Setup!${mc[0]}${mc[1:]})', border=BOX,
         align=CENTER, fmt="0")
cell(d, "E27", "Final placements per box", font=F_BOLD, fill=SEC_FILL)
d.merge_cells("E27:F27")

cell(d, "A38", "CRITICAL-ROLE RISK VIEW", font=F_SEC, fill=SEC_FILL)
d.merge_cells("A38:F38")
risk_rows = [
    ("Coverage - Green (sustainable)", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AD$6:$AD$305,"Green")'),
    ("Coverage - Yellow (one option or a gap)", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AD$6:$AD$305,"Yellow")'),
    ("Coverage - Red (no backup → January coverage plan)", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AD$6:$AD$305,"Red")'),
    ("Readiness - Now", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AA$6:$AA$305,"Now")'),
    ("Readiness - 1-2 yrs", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AA$6:$AA$305,"1-2 yrs")'),
    ("Readiness - 3+ yrs", f'=COUNTIFS({AS}!$F$6:$F$305,"YES",{AS}!$AA$6:$AA$305,"3+ yrs")'),
    ("Retention-risk flags (confidential - always paired with an action)", f'=COUNTIF({AS}!$AB$6:$AB$305,"Yes")'),
]
for i, (label, f) in enumerate(risk_rows):
    r = 39 + i
    cell(d, f"A{r}", label, border=BOX)
    d.merge_cells(f"A{r}:B{r}")
    cell(d, f"C{r}", f, border=BOX, align=CENTER, fmt="0")
d.conditional_formatting.add("C41", FormulaRule(formula=['$C$41>0'], fill=RED_FILL))
cell(d, "A47", "Red-coverage roles:", font=F_BOLD, border=BOX)
cell(d, "B47", '=IF(_xlfn.TEXTJOIN("; ",TRUE,Calc!$K$2:$K$301)="","(none)",_xlfn.TEXTJOIN("; ",TRUE,Calc!$K$2:$K$301))', border=BOX)
d.merge_cells("B47:F47")
cell(d, "A48", "Retention-risk flags:", font=F_BOLD, border=BOX)
cell(d, "B48", '=IF(_xlfn.TEXTJOIN("; ",TRUE,Calc!$L$2:$L$301)="","(none)",_xlfn.TEXTJOIN("; ",TRUE,Calc!$L$2:$L$301))', border=BOX)
d.merge_cells("B48:F48")
cell(d, "A50", "Access is role-based: the person's leadership chain, their EC, and the program "
               "team only. Never used for compensation, layoffs, discipline, or automated "
               "employment decisions. Data moves to Oracle once validated; interim files are "
               "deleted with confirmation.", font=F_SMALL)
d.merge_cells("A50:F51")
d["A50"].alignment = WRAP
protect(d)

# =====================================================================
# EXPORT (flat)
# =====================================================================
ex = wb.create_sheet("Export (flat)")
exp_cols = [
    ("Business unit", "Setup!$B$4", 20), ("Wave", "Setup!$B$9", 10),
    ("Team", f"{AS}!$E{{r}}", 16), ("Person", f"{AS}!$B{{r}}", 20),
    ("Role", f"{AS}!$C{{r}}", 30), ("Level", f"{AS}!$D{{r}}", 8),
    ("Critical role?", f"{AS}!$F{{r}}", 11), ("Months in role", f"{AS}!$H{{r}}", 9),
    ("Reviews on record", f"{AS}!$J{{r}}", 9), ("Performance", f"{AS}!$M{{r}}", 9),
    ("Ability", f"{AS}!$P{{r}}", 9), ("Aspiration", f"{AS}!$Q{{r}}", 9),
    ("Engagement", f"{AS}!$R{{r}}", 9), ("Potential", f"{AS}!$S{{r}}", 10),
    ("Proposed box", f"{AS}!$T{{r}}", 18), ("Panel decision", f"{AS}!$W{{r}}", 18),
    ("Final box", f"{AS}!$Y{{r}}", 18), ("Override / dissent", f"{AS}!$Z{{r}}", 26),
    ("Readiness", f"{AS}!$AA{{r}}", 10), ("Retention risk", f"{AS}!$AB{{r}}", 10),
    ("Risk action", f"{AS}!$AC{{r}}", 26), ("Coverage", f"{AS}!$AD{{r}}", 10),
    ("Flags status", f"{AS}!$AE{{r}}", 14), ("SBJA % at/above", f"{AS}!$U{{r}}", 10),
    ("SBJA gaps", f"{AS}!$V{{r}}", 8), ("Development action", f"{AS}!$AF{{r}}", 28),
    ("Development due", f"{AS}!$AG{{r}}", 12), ("Calibration date", "Setup!$B$8", 12),
    ("EC", "Setup!$B$5", 16), ("Calibration chair", "Setup!$B$6", 16),
    ("QA open", f"{AS}!$AH{{r}}", 34),
]
cell(ex, "A1", "One row per person - the consolidation view the program team collects into the "
               "enterprise dataset (Monday.com template / Excel backup, then Oracle). "
               "Everything here mirrors the entry tabs; nothing is typed on this sheet.",
     font=F_SUB)
ex.merge_cells("A1:J1")
for i, (h, src, w) in enumerate(exp_cols, start=1):
    L = get_column_letter(i)
    cell(ex, f"{L}3", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
    ex.column_dimensions[L].width = w
ex.row_dimensions[3].height = 30
for r in range(4, 304):
    ar = r + 2  # assessment row
    for i, (h, src, w) in enumerate(exp_cols, start=1):
        L = get_column_letter(i)
        src_r = src.format(r=ar)
        c = ex[f"{L}{r}"]
        c.value = f'=IF({AS}!$B{ar}="","",{src_r})'
        c.font = F_BASE
        if h in ("Development due", "Calibration date"):
            c.number_format = "yyyy-mm-dd"
        if h == "SBJA % at/above":
            c.number_format = "0%"
ex.freeze_panes = "A4"
ex.auto_filter.ref = "A3:AE303"
protect(ex)

# =====================================================================
# START HERE
# =====================================================================
sh = wb.create_sheet("Start Here", 0)
sh.sheet_view.showGridLines = False
for w, col in zip([3, 30, 26, 16, 16, 14, 14, 14, 26, 3], "ABCDEFGHIJ"):
    sh.column_dimensions[col].width = w

def para(ws, r, text, font=F_BASE, span="B:I", height=None, fill=None):
    c1, c2 = span.split(":")
    ws.merge_cells(f"{c1}{r}:{c2}{r}")
    c = cell(ws, f"{c1}{r}", text, font=font, align=WRAP, fill=fill)
    if height:
        ws.row_dimensions[r].height = height
    return c

r = 2
cell(sh, f"B{r}", "9-Box Talent Assessment - Business Unit Workbook", font=Font(name="Arial", size=18, bold=True, color=BLACK)); r += 1
para(sh, r, "Vanderbilt University · People, Culture & Belonging · M4-E1 · FY27 · one workbook per business unit", F_SUB); r += 2

para(sh, r, "WHAT THIS WORKBOOK DOES", F_SEC, fill=SEC_FILL); r += 1
para(sh, r, "It automates the whole unit exercise: criterion totals, the 16/25 critical call and "
            "the ±2 borderline second-discussion flag, the Ability/Aspiration/Engagement → "
            "Potential rule, the box placement, the SBJA gap math, the live 9-box grid, the QA "
            "checks, and the readout dashboard. You type evidence and judgments in the yellow "
            "cells; every grey '(auto)' column computes itself. Formula cells are locked so they "
            "can't be typed over (Review → Unprotect Sheet removes the guard; there is no password).",
     height=58); r += 2

para(sh, r, "HOW TO RUN YOUR UNIT", F_SEC, fill=SEC_FILL); r += 1
steps = [
    ("1 · Setup", "Enter the unit, EC, calibration chair, facilitator, calibration date, wave, and your team list. The thresholds and box labels are the program design locked at the Sept 11 gate - change them only with the program team."),
    ("2 · 1. Role Scoring", "List every M4-E1 role and score the five criteria live in the 75-minute session (hover each score column's header for the prompt and anchors). The total, the borderline flag and the CRITICAL? call compute automatically. Record the one-sentence rationale - the list must be auditable across all 39 units."),
    ("3 · 2. Assessment", "One row per incumbent. Enter reviews on record, career-conversation date, performance evidence, the Performance rating (1-3) and the A/A/E reads. Potential and the proposed box appear automatically."),
    ("4 · 3. Skills (SBJA)", "Critical-role incumbents only: list the role's SBJA skills, the required level, and the person's current level. Gaps and the % at/above flow back to the Assessment tab and become the development plan."),
    ("5 · Calibrate", "In the session the manager presents 2 minutes, the panel challenges, the one-up leader decides. Record the Panel decision (accept / override / support pathway / defer), any override rationale and dissent, and - critical roles only - readiness, retention risk (always paired with an action) and coverage."),
    ("6 · Read out", "The 9-Box Grid and Dashboard update live. Your unit is complete when the Dashboard shows all four outputs green and zero QA items. 'Export (flat)' is the sheet the program team collects for the enterprise dataset."),
]
for tstep, txt in steps:
    sh.merge_cells(f"C{r}:I{r}")
    cell(sh, f"B{r}", tstep, font=F_BOLD, align=Alignment(vertical="top"))
    cell(sh, f"C{r}", txt, align=WRAP)
    sh.row_dimensions[r].height = 44
    r += 1
r += 1

para(sh, r, "LEGEND", F_SEC, fill=SEC_FILL); r += 1
cell(sh, f"B{r}", "You type here", fill=INPUT_FILL, border=BOX, align=CENTER)
cell(sh, f"C{r}", "Computed - locked, don't type", fill=AUTO_FILL, border=BOX, align=CENTER)
cell(sh, f"D{r}", "⚠ QA - fix it", font=Font(name="Arial", size=10, color="9C0006"), border=BOX, align=CENTER)
cell(sh, f"E{r}", "Critical / good", fill=GREEN_FILL, border=BOX, align=CENTER)
cell(sh, f"F{r}", "Needs attention", fill=AMBER_FILL, border=BOX, align=CENTER)
cell(sh, f"G{r}", "Risk / red", fill=RED_FILL, border=BOX, align=CENTER)
r += 2

para(sh, r, "HOW ONE PERSON LANDS IN A BOX", F_SEC, fill=SEC_FILL); r += 1
para(sh, r, "Performance evidence sets the row. The Ability, Aspiration, Engagement read sets the "
            "column. The SBJA skills check backs both and hands the manager a ready-made "
            "development plan. Row meets column - that is the box - and the calibration panel "
            "confirms it. Everything else in this workbook exists only to keep that simple move "
            "honest.", height=44); r += 2

para(sh, r, "WHAT THIS IS NOT", F_SEC, fill=SEC_FILL); r += 1
para(sh, r, "Not successor slating, not a promotion list, not a layoff exercise, not performance "
            "management, and nothing below M4. Managers never share a grid label - employees get "
            "a real conversation about strengths, aspirations, readiness, development priorities "
            "and opportunities. Choosing deep expertise over broader scope is a valid and valued "
            "path. This data is never used for compensation, layoffs, discipline, or automated "
            "employment decisions.", height=58); r += 2

para(sh, r, "THE FIVE CRITICAL-ROLE CRITERIA (anchors also sit in the score-column header notes)", F_SEC, fill=SEC_FILL); r += 1
crit_hdr = ["Criterion & prompt", "1 (low)", "3 (moderate)", "5 (high)"]
crit_rows = [
    ("1 Impact - what breaks in 30-90 days if this seat fails or empties?",
     "Work absorbed by others with little disruption.", "A key function noticeably disrupted; workarounds hold.", "A core function or strategic priority visibly impaired within weeks."),
    ("2 Performance variability - how different are outcomes between an average and a great person?",
     "Output largely fixed by process.", "A great performer meaningfully improves quality, cost, or speed.", "Outcomes swing dramatically on the incumbent's judgment, expertise, or relationships."),
    ("3 Skill scarcity - how rare is the expertise or undocumented institutional knowledge?",
     "Skills common in the market; knowledge documented.", "Skills take 1-2 years; some knowledge undocumented.", "Expertise rare or takes years; heavy undocumented institutional knowledge."),
    ("4 Internal bench (REVERSE-scored) - could anyone inside credibly cover this role today?",
     "Several people could credibly cover it today.", "One plausible person, with real development gaps.", "No plausible internal coverage."),
    ("5 Market & vacancy risk - how hard is an external search; how likely a vacancy in 3 years?",
     "Fast, inexpensive external hire; stable incumbent.", "A 3-6 month search, or a moderate chance of vacancy.", "A 6-12+ month costly search, and vacancy plausible within 1-3 years."),
]
hdr_cols = ["B", "C", "F", "H"]
spans = [("B", "B"), ("C", "E"), ("F", "G"), ("H", "I")]
for (c1, c2), h in zip(spans, crit_hdr):
    if c1 != c2:
        sh.merge_cells(f"{c1}{r}:{c2}{r}")
    cell(sh, f"{c1}{r}", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
r += 1
for row_vals in crit_rows:
    for (c1, c2), v in zip(spans, row_vals):
        if c1 != c2:
            sh.merge_cells(f"{c1}{r}:{c2}{r}")
        cell(sh, f"{c1}{r}", v, align=WRAP, border=BOX)
    sh.row_dimensions[r].height = 48
    r += 1
para(sh, r, "16 of 25 is the initial threshold - a design choice tested in the pilot. Scores "
            "within 2 points get a second discussion. Not seniority, not the incumbent: score the "
            "seat with a stranger in it. Don't assume all roles are critical - many senior seats "
            "are important, visible, and refillable.", F_SMALL, height=44); r += 2

para(sh, r, "CALIBRATION RULES - QUICK REFERENCE", F_SEC, fill=SEC_FILL); r += 1
rules = [
    ("Performance (row)", "3 Exceeds · 2 Meets · 1 Below, over the last 12-18 months. Reviews on record first (at most two), then results and two specific examples. No review = structured retrospective, flagged, one extra probe."),
    ("Potential (column)", "Ability, Aspiration, Engagement - each High/Med/Low. All three High = High; any Low = Low. Ability is demonstrated learning agility. Aspiration only from a documented career conversation. Engagement is observable behavior and stated intent - never location, caregiving, or willingness to relocate."),
    ("Decision", "Manager presents 2 minutes, the panel challenges, the one-up leader decides. Overrides and dissent are documented. Active performance process = support pathway, no label. Pay, slating and improvement topics get parked."),
    ("Flags", "Retention risk: critical roles and calibrated regrettable-loss risk only - confidential, evidence-based, always paired with an action. Critical incumbents add readiness (Now / 1-2 / 3+ yrs) and coverage (Red / Yellow / Green). Under 6 months in role defers."),
    ("Guardrails", "No target distribution - concentrated results trigger an evidence and fairness review, never a curve. Placements refresh every 6-12 months; a box is a snapshot, not a verdict. Exceptional craft with no appetite for broader scope is High Professional, a valued destination."),
]
for t_, txt in rules:
    sh.merge_cells(f"C{r}:I{r}")
    cell(sh, f"B{r}", t_, font=F_BOLD, border=BOX, align=Alignment(vertical="top"))
    cell(sh, f"C{r}", txt, align=WRAP, border=BOX)
    sh.row_dimensions[r].height = 52
    r += 1
r += 1

para(sh, r, "WORKED EXAMPLE - People Operations (from the program document; reference only, the entry tabs start clean)", F_SEC, fill=SEC_FILL); r += 1
para(sh, r, "Real SBJA roles, fictional people and scores. Enter these on the entry tabs and the "
            "workbook reproduces every result below - a useful self-test and training aid.", F_SMALL); r += 1

ex1_hdr = ["Role (level)", "Impact", "Perf var", "Scarcity", "Bench", "Mkt/vac", "Total", "Critical?"]
ex1 = [
    ("People Operations Executive (E1)", 5, 4, 4, 4, 4, 21, "YES"),
    ("Total Rewards Lead (M5)", 4, 3, 4, 3, 4, 18, "YES"),
    ("Consulting Lead (M5)", 3, 4, 3, 2, 3, 15, "No (±2 - held at No after the 2nd discussion)"),
    ("Learning & Development Lead (M4)", 3, 3, 3, 2, 3, 14, "No"),
    ("Payroll Lead (M4)", 4, 2, 2, 2, 2, 12, "No"),
]
cols1 = ["B", "C", "D", "E", "F", "G", "H", "I"]
for cix, h in zip(cols1, ex1_hdr):
    cell(sh, f"{cix}{r}", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
r += 1
for rowv in ex1:
    for cix, v in zip(cols1, rowv):
        cell(sh, f"{cix}{r}", v, border=BOX, align=WRAP if cix in ("B", "I") else CENTER)
    r += 1
para(sh, r, "Payroll touches every employee yet scored 12: documented processes, refillable seat. "
            "Total Rewards scored critical: hot market, scarce expertise, thin bench. Criticality "
            "follows risk and replaceability, not visibility.", F_SMALL, height=32); r += 2

ex2_hdr = ["Incumbent (role)", "Perf", "A/A/E", "Box"]
ex2 = [
    ("J. Rivera · People Ops Executive (E1)", "3 (two reviews)", "H/H/H → High", "High Potential - accelerate and retain; ready 1-2 yrs"),
    ("T. Chen · L&D Lead (M4)", "3 (two reviews)", "H/M/H → Medium", "Emerging Talent - broaden in place; revisit next cycle"),
    ("R. Dubois · Consulting Lead (M5)", "3 (retrospective + probe)", "M/L/H → Low", "High Professional - retain, recognize, teach; a valued destination"),
    ("S. Patel · Total Rewards Lead (M5)", "2 (one review + retrospective)", "H/H/H → High", "Solid Performer, Strong Potential - development priority for a critical role"),
    ("L. Novak · Payroll Lead (M4)", "1 (retrospective + probe)", "M/M/M → Medium", "No label - support pathway; reassessed when evidence is stable"),
]
spans2 = [("B", "C"), ("D", "D"), ("E", "F"), ("G", "I")]
for (c1, c2), h in zip(spans2, ex2_hdr):
    if c1 != c2:
        sh.merge_cells(f"{c1}{r}:{c2}{r}")
    cell(sh, f"{c1}{r}", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
r += 1
for rowv in ex2:
    for (c1, c2), v in zip(spans2, rowv):
        if c1 != c2:
            sh.merge_cells(f"{c1}{r}:{c2}{r}")
        cell(sh, f"{c1}{r}", v, border=BOX, align=WRAP)
    sh.row_dimensions[r].height = 34
    r += 1
para(sh, r, "Three people rated Performance 3; only one is High Potential. Dubois' Low aspiration "
            "comes from his own words, never a guess. Novak's case routed to a support pathway "
            "instead of a label. Two of five in the top boxes triggered the concentration review; "
            "the evidence held, the placements stood.", F_SMALL, height=44); r += 2

ex3_hdr = ["T. Chen - skill (real L&D requirements)", "Required @ M4", "Current", "Δ"]
ex3 = [
    ("Instructional Design", "Expert", "Expert", "At"),
    ("Curriculum Development", "Expert", "Expert", "At"),
    ("Adult Learning Principles", "Expert", "Expert", "At"),
    ("Training Analysis", "Advanced", "Advanced", "At"),
    ("Learning Platforms", "Intermediate", "Advanced", "Above"),
    ("Leadership Development", "Advanced", "Intermediate", "GAP"),
]
spans3 = [("B", "C"), ("D", "E"), ("F", "G"), ("H", "H")]
for (c1, c2), h in zip(spans3, ex3_hdr):
    if c1 != c2:
        sh.merge_cells(f"{c1}{r}:{c2}{r}")
    cell(sh, f"{c1}{r}", h, font=F_HDR, fill=HDR_FILL, align=CENTER, border=BOX)
r += 1
for rowv in ex3:
    for (c1, c2), v in zip(spans3, rowv):
        if c1 != c2:
            sh.merge_cells(f"{c1}{r}:{c2}{r}")
        cell(sh, f"{c1}{r}", v, border=BOX,
             align=CENTER if c1 != "B" else Alignment(vertical="top"))
    r += 1
para(sh, r, "Five of six at or above (83%) backs the Performance 3. Above-level Learning Platforms "
            "fed the ability discussion. The one gap, Leadership Development, becomes her "
            "development action - and her profile travels into the Talent Transfer Portal.",
     F_SMALL, height=40); r += 2
para(sh, r, "Program: kickoff Sept 14, done by Dec 11, 2026 · Program Lead: Matt Estes · Executive "
            "Sponsor: Sydney Savion. Data governance: role-based access; Monday.com and Excel are "
            "temporary - data moves to Oracle once validated and interim files are deleted with "
            "confirmation.", F_SUB, height=40)
protect(sh)

# order sheets
order = ["Start Here", "Setup", "1. Role Scoring", "2. Assessment", "3. Skills (SBJA)",
         "9-Box Grid", "Dashboard", "Export (flat)", "Calc", "Lists"]
wb._sheets = [wb[n] for n in order]
wb.active = 0

import os
out_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), OUT)
wb.save(out_path)
print("saved", out_path)
