RTL Workflow Automation — Design Document (V2.0)

---

PURPOSE

Automates RTL testcase execution using a structured, file-driven workflow.

System is built for:

- Deterministic execution
- Modular configuration (per category)
- Clean separation of responsibilities
- Future extensibility (VECTOR, BACK_ANNOTATION)

---

SYSTEM ARCHITECTURE

Planner → Executor → Analyzer

Artifacts:

- Planner → run_plan.json
- Executor → status.json
- Analyzer → Summary.xls

---

CORE PRINCIPLES

1. MASTER defines WHAT exists
2. Vector Excel defines HOW to run
3. Planner defines WHAT WILL run

---

INPUT MODEL

---

MASTER.xls

Defines all valid testcases.

Columns:

- Category
- Item_Description

Rules:

- Source of truth
- Order defines execution order
- Planner must iterate MASTER only

---

Vector_Excel Folder

Vector_Excel/
  vector_<category>.xls

---

vector_<category>.xls Structure

Each file is a self-contained configuration unit per category

Contains:

- COMMON (mandatory)
- SIM (mandatory)
- VECTOR (future)
- BACK_ANNOTATION (future)

---

SHEET DEFINITIONS

---

COMMON

Format:

- Column 1 → key
- Column 2 → value

Required:

- default_prj_name

Scope:

- Applies to entire category

---

STAGE ABSTRACTION

STAGES = [SIM, VECTOR, BACK_ANNOTATION]

Rules:

- Each stage must contain Item_Description
- SIM must contain dir_name
- Other columns → config variables

---

SIM

Used for:

- Mapping Item_Description → dir_name
- Extracting execution variables

---

VECTOR / BACK_ANNOTATION

- Same structure as SIM
- Not executed in current version
- Must not break planning

---

CONFIG MODEL

CONFIG = COMMON + STAGE
STAGE overrides COMMON

Current execution stage:

SIM

---

PLANNER

---

Responsibilities

- Validate inputs
- Build run_plan.json
- Decide READY vs SKIPPED
- Do NOT execute anything

---

Planner Flow

1. Validate workspace_path
2. Read MASTER
3. For each CATEGORY:
   - Load vector_<category>.xls
4. Validate COMMON
5. Validate default_prj_name consistency
6. Read SIM
7. Map testcases
8. Build CONFIG
9. Generate run_plan.json

---

workspace_path Validation

Valid if:

- Exists
- Is directory
- Is readable

Planner does NOT validate files inside workspace

---

STOP Conditions

- workspace_path invalid
- MASTER missing/empty
- COMMON missing
- default_prj_name missing
- default_prj_name mismatch
- SIM missing
- SIM empty

---

SKIPPED Conditions

- Vector file missing
- No SIM mapping
- dir_name missing
- Duplicate dir_name
- Empty Category

---

Planner Rules

- MASTER drives iteration
- Never iterate SIM directly
- Planner assigns only:
  - READY
  - SKIPPED

---

EXECUTOR

---

Responsibilities

- Execute testcases from run_plan.json
- Update env.scr
- Run run.scr
- Validate logs
- Write status.json

---

Responsibilities NOT included

- No Excel reading
- No planning logic

---

ANALYZER

---

Responsibilities

- Read status.json
- Generate Summary.xls
- One sheet per CATEGORY

---

ERROR MODEL

---

Error_Message Priority

1. Execution failure
2. WARN

Rules:

- Execution error overrides WARN
- WARN only if no failure

---

EXECUTION MODEL

- CATEGORY level → parallel
- Within CATEGORY → sequential

---

WORKSPACE MODEL

<default_prj_name>/
  plans/
  logs/
  <CATEGORY>/
    <dir_name>/

---

KNOWN LIMITATIONS

- ".e" log detection is approximate
- VECTOR/BACK not executed
- No retry mechanism

---

FUTURE EXTENSIONS

- Enable VECTOR execution
- Enable BACK_ANNOTATION execution
- Add retry support
- Add parallel execution limits

---
