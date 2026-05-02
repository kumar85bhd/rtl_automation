RTL Workflow Automation — Execution Contract (V2.0)

---

SYSTEM FLOW

Planner → Executor → Analyzer

Artifacts:

- run_plan.json
- status.json
- Summary.xls

---

INPUTS

---

MASTER.xls

Columns:

- Category
- Item_Description

Defines all valid testcases.
Planner MUST iterate MASTER only.

---

Vector_Excel Folder

Vector_Excel/
  vector_<category>.xls

Rules:

- One file per CATEGORY
- Missing file → SKIPPED

---

COMMON Sheet

- Column 1 → key
- Column 2 → value

Required:

- default_prj_name

If missing → STOP

---

STAGES

STAGES = [SIM, VECTOR, BACK_ANNOTATION]

Rules:

- Each STAGE must contain Item_Description
- SIM must contain dir_name
- CONFIG = COMMON + STAGE
- STAGE overrides COMMON

Execution:

- Only SIM executed

---

PLANNER

---

Step 0 — Validate workspace_path

Valid if:

- Exists
- Directory
- Readable

Else → STOP

---

Planner Process

1. Read MASTER
2. For each CATEGORY:
   - Load vector_<CATEGORY>.xls
3. If file missing:
   → SKIPPED
4. Read COMMON
5. Validate default_prj_name consistency
6. Read SIM
7. For each testcase in MASTER:

- If found:
  
  - build CONFIG
  - READY

- If not found:
  
  - SKIPPED ("No SIM mapping")

- If dir_name missing:
  
  - SKIPPED

---

OUTPUT

run_plan.json must include:

{
  "default_prj_name": "...",
  "workspace_path": "...",
  "testcases": [...]
}

---

EXECUTOR

---

Per testcase:

1. Overwrite check
2. Create folder
3. Copy required files
4. Write status.json → IN_PROGRESS
5. Update env.scr
6. Execute run.scr
7. Validate logs
8. Update status.json

---

LOG VALIDATION

- Check *.log exists
- Scan ALL logs
- Match:
  - "error" (case-insensitive)
  - ".e" (temporary)

On match:

<FileName> <LineNo>:<LineContent>

---

STATUS

sim_status:

- READY
- IN_PROGRESS
- DONE
- FAILED
- SKIPPED
- UNKNOWN

---

ERROR_MESSAGE

Priority:

1. Execution failure
2. WARN

---

ANALYZER

- Read status.json
- Generate Summary.xls
- One sheet per CATEGORY

---

EXECUTION MODEL

- CATEGORY parallel
- Within CATEGORY sequential

---

STOP CONDITIONS

- workspace_path invalid
- MASTER missing
- COMMON missing
- default_prj_name missing
- default_prj_name mismatch
- SIM missing
- SIM empty

---
