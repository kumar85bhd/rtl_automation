# RTL Workflow Automation — Execution Contract (V3)

---

## DESIGN CONTEXT REFERENCE

This document defines strict execution rules.

For architecture rationale and detailed context:
→ Refer to docs/DESIGN.md

Rules:

* CLAUDE.md is the source of truth
* DESIGN.md is for clarification only
* Do NOT override rules using DESIGN.md

---

## SYSTEM FLOW

Planner → Executor → Analyzer

Current implementation scope:

* Planner only

---

## INPUTS

---

### MASTER.xls

Columns:

* Category
* Item_Description

Rules:

* Source of truth
* Planner MUST iterate MASTER only

---

### Vector_Excel Folder

```text
Vector_Excel/
  vector_<category>.xls
```

Rules:

* One file per CATEGORY
* Missing file → SKIPPED

---

## COMMON Sheet

* Column 1 → key
* Column 2 → value

Required:

* default_prj_name

If missing → STOP

---

## STAGES

```
STAGES = [SIM, VECTOR, BACK_ANNOTATION]
```

Rules:

* Each STAGE must contain Item_Description
* SIM must contain dir_name
* CONFIG = COMMON + STAGE
* STAGE overrides COMMON

Execution:

* Only SIM is executed

---

## PLANNER

---

### Step 0 — Validate workspace_path

Valid if:

* Exists
* Directory
* Readable

Else → STOP

---

### Planner Process

1. Read MASTER

2. For each CATEGORY:

   * Load vector_<CATEGORY>.xls

3. If file missing:
   → All testcases in that CATEGORY:

   * SKIPPED ("Vector file missing")

4. Read COMMON

5. Validate default_prj_name:

   * Must exist
   * Must be identical across all categories
   * Else → STOP

6. Read SIM

   * If missing → STOP
   * If empty → STOP

7. Build SIM lookup

   * Key: Item_Description
   * First occurrence wins

8. Process testcases (MASTER-driven)

For each testcase:

* If found in SIM:

  * Extract dir_name
  * If missing → SKIPPED ("dir_name missing")
  * Else → READY

* If not found:

  * SKIPPED ("No SIM mapping")

* If duplicate dir_name:

  * SKIPPED ("Duplicate dir_name")

---

## CONFIG MODEL

```
CONFIG = COMMON + SIM
SIM overrides COMMON
```

Exclude from CONFIG:

* Item_Description
* dir_name
* Category

---

## OUTPUT

### run_plan.json

```json
{
  "default_prj_name": "...",
  "workspace_path": "...",
  "plan_created": "...",
  "summary": {
    "total": 0,
    "ready": 0,
    "skipped": 0,
    "skipped_reasons": [
      { "Item_Description": "...", "reason": "..." }
    ]
  },
  "testcases": [
    {
      "Category": "...",
      "Item_Description": "...",
      "dir_name": "...",
      "sim_status": "READY | SKIPPED",
      "skip_reason": "...",
      "config": {}
    }
  ]
}
```

---

## CANONICAL skip_reason VALUES

Must use exactly:

* "Vector file missing"
* "No SIM mapping"
* "dir_name missing"
* "Duplicate dir_name"
* "COMMON sheet missing"

---

## STOP CONDITIONS

* workspace_path invalid
* MASTER missing or empty
* default_prj_name missing
* default_prj_name mismatch
* SIM missing
* SIM empty

---

## RULES

* Planner assigns only:

  * READY
  * SKIPPED

* Planner does NOT:

  * execute scripts
  * create testcase folders
  * read logs

---
