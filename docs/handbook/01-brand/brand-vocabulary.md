---
title: Brand Vocabulary
version: 0.1.0
status: Review
owner: Product Team
last_updated: 2026-07-02
related_chapters:
  - brand-essence.md
  - brand-personality.md
  - voice.md
  - ../02-ndl/writing.md
  - ../03-design-system/product-language-tokens.md
related_product_specs: []
---

# Brand Vocabulary

People do not think in financial terminology.

They think in everyday language.

Niva translates financial complexity into human language.

Every word should reduce cognitive effort.

Never increase it.

## Purpose

This chapter defines the official product language system of Niva.

It explains which words belong to Niva, which words are forbidden, why those decisions exist, and how the vocabulary should evolve as the product grows.

This chapter also prepares the foundation for Product Language Tokens.

Product Language Tokens are documentation only in this sprint. They must not be integrated into code yet.

## Vocabulary Principles

### Principle 01: Prefer Human Language Over Financial Language

Use the words people would naturally use when thinking about their money.

| Approved | Avoid | Reason |
| --- | --- | --- |
| Disponible | Balance liquido | "Disponible" answers what the user can use. "Balance liquido" asks the user to translate finance language. |

### Principle 02: Prefer Outcomes Over Technical Terms

Name the result the user cares about, not the system event that happened behind it.

| Approved | Avoid | Reason |
| --- | --- | --- |
| Todo listo | Operacion completada | "Todo listo" feels resolved and human. "Operacion completada" sounds like software reporting on itself. |

### Principle 03: Prefer Clarity Over Precision

Precision matters only when it helps the user make a better decision.

| Approved | Avoid | Reason |
| --- | --- | --- |
| Para gastar | Saldo disponible posterior a reservas | "Para gastar" gives immediate meaning. The longer phrase is more technically precise but slower to understand. |

### Principle 04: Prefer Conversation Over Software

Niva should sound like a calm product companion, not a control panel.

| Approved | Avoid | Reason |
| --- | --- | --- |
| Hoy | Dashboard | "Hoy" starts from the user's moment. "Dashboard" starts from a software pattern. |

### Principle 05: Every Word Should Answer A Question

Words should help users understand what they have, what changed, what needs attention, or what they can do next.

Never describe the database.

## Official Product Dictionary

### Home

| Approved | Avoid | Reason |
| --- | --- | --- |
| Inicio | Dashboard | "Inicio" feels like the natural starting point of the product. It does not require the user to understand software vocabulary. |
| Hoy | Analytics Dashboard | "Hoy" focuses on the user's current financial reality. It keeps attention on what matters now. |
| Resumen | Operational Report | "Resumen" promises a quick understanding. "Operational Report" feels internal and administrative. |

### Money

| Approved | Avoid | Reason |
| --- | --- | --- |
| Tu dinero | Wallet | "Tu dinero" is direct and personal. "Wallet" is a product metaphor that can feel imported and vague. |
| Disponible | Cash Position | "Disponible" answers what can be used. "Cash Position" sounds like treasury language. |
| Reservado | Balance Sheet | "Reservado" explains money set aside in a way people can act on. "Balance Sheet" belongs to accounting. |
| Para gastar | Net Balance | "Para gastar" translates money into use. "Net Balance" asks the user to calculate meaning. |

### Activity

| Approved | Avoid | Reason |
| --- | --- | --- |
| Actividad | Transaction List | "Actividad" describes what happened without making the screen feel like a ledger. |
| Nuevo movimiento | New Transaction | "Nuevo movimiento" is familiar in Spanish financial contexts while staying conversational. |
| Pago registrado | Payment Operation | "Pago registrado" confirms the user outcome. "Payment Operation" describes a system action. |

### Accounts

| Approved | Avoid | Reason |
| --- | --- | --- |
| Cuenta | Asset | "Cuenta" is the object users recognize. "Asset" adds financial abstraction. |
| Cuenta creada | Account Provisioned | "Cuenta creada" confirms completion in plain language. "Provisioned" is infrastructure language. |
| Agrega tu primera cuenta | Create Financial Account Record | The approved phrase guides the first step. The avoided phrase describes a database object. |

### Goals

| Approved | Avoid | Reason |
| --- | --- | --- |
| Objetivo | KPI | "Objetivo" connects to a desired outcome. "KPI" belongs to business measurement, not personal finance. |
| Progreso | Performance Metric | "Progreso" helps the user see movement. "Performance Metric" feels evaluative and cold. |
| Compromisos | Liabilities | "Compromisos" is human and responsible. "Liabilities" is accounting language. |

### Analytics

| Approved | Avoid | Reason |
| --- | --- | --- |
| Resumen | Analytics Dashboard | "Resumen" makes analysis feel accessible. "Analytics Dashboard" makes it feel specialized. |
| Tendencia | KPI | "Tendencia" explains direction. "KPI" implies corporate performance tracking. |
| Comparación | Operational Report | "Comparación" states the user action. "Operational Report" sounds like a back-office artifact. |

### Buttons

| Approved | Avoid | Reason |
| --- | --- | --- |
| Agregar | Create | "Agregar" matches everyday Spanish interface behavior and feels active without being technical. |
| Guardar | Submit | "Guardar" tells the user what happens to their work. "Submit" feels form-centric. |
| Editar | Modify Record | "Editar" is simple and familiar. "Modify Record" exposes implementation language. |
| Cancelar | Abort Operation | "Cancelar" is clear and calm. "Abort Operation" is unnecessarily severe. |

### Empty States

| Approved | Avoid | Reason |
| --- | --- | --- |
| Todavía no hay actividad | No data | The approved phrase explains the state without making it feel broken. |
| Agrega tu primera cuenta | Empty account collection | The approved phrase gives the next step. The avoided phrase describes the database. |
| Empieza con un objetivo | No goals configured | The approved phrase invites progress. The avoided phrase sounds like a settings error. |

### Errors

| Approved | Avoid | Reason |
| --- | --- | --- |
| Algo no salió bien | Error | The approved phrase is human and calm. "Error" is too blunt on its own. |
| Intenta de nuevo | Retry operation | The approved phrase gives a clear next step. The avoided phrase sounds procedural. |
| Revisa los datos | Validation failed | The approved phrase helps the user correct the issue. The avoided phrase reports a technical failure. |

### Success States

| Approved | Avoid | Reason |
| --- | --- | --- |
| Todo listo | Operation completed | The approved phrase gives closure without celebration or technical noise. |
| Cuenta creada | Account record created | The approved phrase confirms the user-visible result. The avoided phrase exposes internal structure. |
| Pago registrado | Transaction saved | The approved phrase reflects the user intent. The avoided phrase reflects storage. |

### Notifications

| Approved | Avoid | Reason |
| --- | --- | --- |
| Nuevo movimiento | Transaction event | The approved phrase is understandable at a glance. The avoided phrase feels system-generated. |
| Tienes un compromiso pendiente | Liability alert | The approved phrase is useful and calm. The avoided phrase feels alarming and technical. |
| Tu resumen está listo | Report generated | The approved phrase is personal and outcome-based. The avoided phrase is operational. |

### Dates

| Approved | Avoid | Reason |
| --- | --- | --- |
| Hoy | Current period | "Hoy" is immediate and human. "Current period" forces interpretation. |
| Este mes | Monthly reporting period | "Este mes" matches how people think about time. The avoided phrase is reporting language. |
| Próximo pago | Scheduled transaction date | "Próximo pago" connects date to meaning. The avoided phrase describes a data field. |

### Numbers

| Approved | Avoid | Reason |
| --- | --- | --- |
| Total | Aggregate value | "Total" is familiar and enough. "Aggregate value" is analytical jargon. |
| Disponible | Net available amount | "Disponible" answers the core question. The avoided phrase is unnecessarily formal. |
| Reservado | Allocated amount | "Reservado" describes intent. "Allocated amount" sounds like accounting configuration. |

## Forbidden Words

These words do not belong to Niva product language unless they appear inside a technical document or an external integration label that cannot be changed.

| Forbidden Word | Why It Does Not Belong |
| --- | --- |
| Dashboard | It centers the software surface instead of the user's financial moment. Niva says "Inicio" or "Hoy". |
| Wallet | It is an imported metaphor that can confuse accounts, cash, and total money. Niva says "Tu dinero" or "Cuenta". |
| Ledger | It belongs to accounting systems and suggests recordkeeping instead of understanding. |
| Asset | It turns personal money into investment terminology. Niva uses concrete words like "Cuenta". |
| KPI | It belongs to corporate performance management. Niva helps people understand progress without making them feel measured. |
| Analytics Dashboard | It combines two software-heavy terms and makes insight feel reserved for experts. |
| Expense Tracker | It narrows Niva to expense logging. Niva is a broader financial control center. |
| Budget Management | It sounds administrative and controlling. Niva uses calmer, more direct language around goals, commitments, and available money. |
| Financial Control | It feels rigid and institutional when used as interface copy. Niva creates confidence without sounding authoritarian. |
| Transaction List | It describes a table, not a user's activity. Niva says "Actividad". |
| Balance Sheet | It is a formal accounting statement, not product language for everyday users. |
| Cash Position | It belongs to treasury language and makes available money feel abstract. |
| Operational Report | It is internal business language. Niva uses "Resumen" when users need a concise view. |

## Approved Words

| Approved Word | Explanation |
| --- | --- |
| Inicio | The natural place to begin. It is familiar, simple, and non-technical. |
| Tu dinero | A personal phrase that keeps the product centered on the user's reality. |
| Disponible | The clearest answer to what money can be used now. |
| Reservado | Explains money set aside without requiring accounting vocabulary. |
| Actividad | A broad, human word for what changed in the user's financial life. |
| Cuenta | The clearest name for a place where money lives. |
| Objetivo | Connects planning to an outcome the user wants. |
| Compromisos | A human word for money responsibilities without the weight of "liabilities". |
| Hoy | Anchors the product in the user's present moment. |
| Resumen | Promises understanding without overwhelming detail. |
| Progreso | Helps the user see movement toward something meaningful. |
| Agregar | A direct action word for adding something new. |
| Guardar | Reassures the user that their work will be kept. |
| Editar | Familiar, short, and action-oriented. |
| Cancelar | Clear and calm when the user decides not to continue. |
| Todo listo | Confirms completion in a relaxed, human way. |
| Cuenta creada | Names the finished outcome without technical detail. |
| Pago registrado | Confirms the user's intended action was recorded. |
| Nuevo movimiento | Describes new financial activity in familiar language. |
| Todavía no hay actividad | Explains an empty state without making it feel like an error. |
| Agrega tu primera cuenta | Gives the next step in a helpful, specific way. |

## Product Implications

### Navigation

Navigation labels must use approved, human terms.

Use "Inicio", "Actividad", "Cuentas", and "Objetivos" before any technical or category-heavy alternative.

### Forms

Forms should ask for information in the same language users use to describe their money.

Labels must describe the answer expected from the user, not the database field being populated.

### Buttons

Buttons must use short action verbs.

Prefer "Agregar", "Guardar", "Editar", and "Cancelar".

Avoid verbs that describe technical submission, provisioning, mutation, or persistence.

### Cards

Cards should answer one clear question.

For example: what is available, what is reserved, what changed, what needs attention, or what is progressing.

### Notifications

Notifications must be useful, calm, and specific.

They should never dramatize, shame, or over-celebrate.

### Emails

Emails should follow the same vocabulary as the product interface.

Subject lines must be direct and understandable without financial jargon.

### Push Notifications

Push notifications must be shorter than in-product copy and must avoid urgency unless user money or access is at risk.

### Charts

Charts should label meaning before method.

Use labels like "Disponible", "Reservado", "Progreso", and "Este mes" instead of analytical or reporting terms.

### Settings

Settings should describe user choices in plain language.

Avoid exposing implementation categories unless a technical user action truly requires them.

### Future AI Assistant

The future Niva assistant must inherit this vocabulary.

It should explain, summarize, and guide using approved words, and it should avoid forbidden words unless it is clarifying an external term for the user.

## Language Evolution

Niva vocabulary should evolve slowly and intentionally.

New words may be added when they meet all of these conditions:

- They reduce cognitive effort.
- They match how users naturally talk about money.
- They support a real product need.
- They do not duplicate an existing approved word.
- They can be reused across screens, notifications, and future assistant responses.

When a new word is introduced, it must be documented in this chapter or in a future UX writing chapter before it becomes product copy.

If a word appears repeatedly in product work but is not documented, the Handbook must be updated before implementation is considered complete.

## QA Checklist

Every future PR that introduces or changes product copy must verify:

- [ ] No forbidden words.
- [ ] Approved vocabulary only.
- [ ] New copy documented.
- [ ] UX Writing updated.
- [ ] Product Specs aligned.

## Chapter Status

Status: Review.

This chapter is the official source of truth for Niva product vocabulary.
