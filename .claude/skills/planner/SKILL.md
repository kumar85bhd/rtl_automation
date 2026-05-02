# PLANNER SKILL

---

## PURPOSE

Generate execution plan (`run_plan.json`) from:

* MASTER.xls
* Vector_Excel folder
* config.ini

Planner performs validation and mapping only.
No execution is performed.

---

## TRIGGERS

* "run planner"
* "build plan"
* "generate plan"
* "show plan"
* "what testcases are there"

---

## INPUTS

From config.ini:

* workspace_path
* master_file_path
* vector_excel_path

---

## OUTPUT

File:

<default_prj_name>/plans/run_plan.json

Also display summary.

---

# ==============================

# PHASE 1 — PRE-VALIDATION

# ==============================

---

### STEP 0 — Validate workspace_path

Check:

* exists
* is directory
* is readable

If any fails:

→ STOP

---

### STEP 1 — Load MASTER.xls

Extract:

* Category
* Item_Description

If missing / empty:

→ STOP

---

### STEP 2 — Load ALL Vector Files + COMMON

For each CATEGORY in MASTER:

* Load: vector_<CATEGORY>.xls

If file missing:

→ Mark all testcases in that CATEGORY:

* sim_status = SKIPPED
* skip_reason = "Vector file missing"

Continue.

---

### STEP 3 — Read COMMON (per file)

For each loaded vector file:

* Read COMMON sheet

If COMMON missing:

→ All testcases in that CATEGORY:

* SKIPPED
* "COMMON sheet missing"

Continue.

---

### STEP 4 — Validate default_prj_name

Rules:

* Must exist in COMMON
* Must be identical across all categories

If missing OR mismatch:

→ STOP

---

# ==============================

# PHASE 2 — TESTCASE PROCESSING

# ==============================

---

### STEP 5 — Read SIM

For each CATEGORY:

* Must exist
* Must not be empty

Else:

→ STOP

---

### STEP 6 — Build SIM Lookup

Key:

Item_Description

Rules:

* First occurrence wins
* Ignore duplicates

---

### STEP 7 — Process MASTER (CRITICAL RULE)

Planner MUST iterate MASTER only.

---

### STEP 8 — Evaluate Each Testcase

---

#### CASE 1 — Found in SIM

Extract:

* dir_name
* variables

If dir_name missing:

→ SKIPPED
→ "dir_name missing"

Else:

→ READY

---

#### CASE 2 — Not Found

→ SKIPPED
→ "No SIM mapping"

---

#### CASE 3 — Duplicate dir_name (GLOBAL)

Rules:

* Check across ALL categories
* First occurrence (MASTER order) wins
* Others:

→ SKIPPED
→ "Duplicate dir_name"

---

### STEP 9 — Build CONFIG

CONFIG = COMMON + SIM
SIM overrides COMMON

Exclude from CONFIG:

* Item_Description
* dir_name
* Category

---

### STEP 10 — Create Plan Entry

```json
{
  "Category": "...",
  "Item_Description": "...",
  "dir_name": "...",
  "sim_status": "...",
  "skip_reason": "...",
  "config": {...}
}
```

---

# ==============================

# PHASE 3 — OUTPUT

# ==============================

---

### STEP 11 — Build Summary

Track:

* total
* ready
* skipped

Also track:

skipped_reasons:

```json
[
  { "Item_Description": "...", "reason": "..." }
]
```

Rules:

* total = len(testcases)
* ready + skipped = total

---

### STEP 12 — Write run_plan.json

```json
{
  "default_prj_name": "...",
  "workspace_path": "...",
  "plan_created": "...",
  "summary": {...},
  "testcases": [...]
}
```

Ensure folder exists:

<default_prj_name>/plans/

---

# ==============================

# RULES

# ==============================

---

### RULE 1 — MASTER is source of truth

* Never iterate SIM directly

---

### RULE 2 — Planner does not execute

* No folder creation (except plan output)
* No script execution

---

### RULE 3 — Status values

Planner assigns only:

* READY
* SKIPPED

---

### RULE 4 — CONFIG integrity

* Keys must match env.scr variables
* No validation here

---

### RULE 5 — Case sensitivity

* All matching is case-sensitive

---

# ==============================

# STOP CONDITIONS

# ==============================

* workspace_path invalid
* MASTER missing / empty
* default_prj_name missing
* default_prj_name mismatch
* SIM missing
* SIM empty

---

# ==============================

# SKIPPED CONDITIONS

# ==============================

* Vector file missing
* COMMON sheet missing
* No SIM mapping
* dir_name missing
* Duplicate dir_name

---

# ==============================

# OUTPUT DISPLAY

# ==============================

Plan Summary:

Total: <N>
READY: <N>
SKIPPED: <N>

If skipped exists:

<testcase> → <reason>

---

# ==============================

# DO NOT

# ==============================

* Do not execute anything
* Do not read Excel in Executor
* Do not infer missing data
* Do not auto-correct invalid inputs

---
