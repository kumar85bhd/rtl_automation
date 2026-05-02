# RTL Workflow Automation — Design Document (V3)

---

## PURPOSE

Automate RTL testcase execution with:

* deterministic flow
* modular configuration
* scalable architecture

---

## CORE PRINCIPLES

1. MASTER defines WHAT exists
2. Vector_Excel defines HOW to run
3. Planner defines WHAT WILL run

---

## SYSTEM ARCHITECTURE

Planner → Executor → Analyzer

---

## DATA MODEL

---

### MASTER.xls

Defines:

* Category
* Item_Description

Rules:

* Source of truth
* Drives iteration

---

### Vector_Excel

```text
Vector_Excel/
  vector_<category>.xls
```

Each file is a **self-contained configuration unit**

---

## SHEETS

---

### COMMON

* Key-value pairs
* Defines global config per category
* Must include:

  * default_prj_name

---

### STAGES

```
STAGES = [SIM, VECTOR, BACK_ANNOTATION]
```

---

### SIM

Defines:

* mapping: Item_Description → dir_name
* execution variables

---

### VECTOR / BACK_ANNOTATION

* Same structure as SIM
* Reserved for future stages
* Validated but not executed

---

## CONFIG MODEL

```
CONFIG = COMMON + STAGE
STAGE overrides COMMON
```

Current execution:

```
SIM only
```

---

## PLANNER

---

### Responsibilities

* validate inputs
* map testcases
* build execution plan

---

### Behavior

* MASTER-driven iteration
* No execution
* Produces run_plan.json

---

### Error Model

---

#### STOP (fatal)

* workspace invalid
* MASTER missing
* default_prj_name issues
* SIM missing/empty

---

#### SKIPPED (non-fatal)

* missing vector file
* missing SIM mapping
* invalid dir_name
* duplicate dir_name

---

## EXECUTION MODEL (Future)

* parallel per CATEGORY
* sequential within CATEGORY

---

## DESIGN DECISIONS

---

### Why Vector_Excel per category?

* modular configuration
* easier debugging
* scalable

---

### Why MASTER-driven?

* ensures completeness
* prevents accidental execution

---

### Why STAGE abstraction?

* avoids duplication
* future-ready

---

## FUTURE EXTENSIONS

* enable VECTOR execution
* enable BACK_ANNOTATION execution
* retry mechanism
* execution orchestration agent

---
