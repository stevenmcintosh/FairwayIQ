# Business Case Template

> **What this is:** A guided questionnaire for producing an exec-ready business case.
> Answer the questions below, then paste your answers into Claude with the instruction:
> "Using my answers, write a business case in the format of the WatchTower example."
>
> **Who this is for:** Anyone proposing a new internal tool, initiative, or infrastructure spend.
> Non-technical users can complete this without help.
>
> **Target length of the final document:** One page. Executives should be able to read it in 90 seconds.

---

## Section A: The Trigger

> What prompted this initiative? The best business cases start with a specific, real incident — not an abstract problem.

```
What happened that made this feel urgent?
(e.g., "Angola registrations dropped to 0 and we didn't find out for 24 hours")

___

When did it happen?

___

Who noticed it? How?

___

What was the impact? (revenue, customers, reputation, time lost)

___
```

---

## Section B: The Problem

> Describe the underlying process failure, not just the incident. What systemic gap allowed this to happen?

```
What is the current process for handling this?
(e.g., "Sorin manually pulls reports and messages the team on WhatsApp")

___

What are the failure points in that process?
(e.g., "Relies on one person, only works during business hours, depends on reports working correctly")

___

How often could this fail? (Daily / Weekly / Every time someone is on leave / etc.)

___

Who else is exposed to this problem?

___
```

---

## Section C: The Risk

> Quantify what is at stake. Executives approve things when the cost of inaction is clear.

```
What happens if this is not fixed and an incident occurs again?

___

What is the estimated cost of one missed incident?
(In registrations lost, hours of downtime, revenue exposure, or SLA breach)

___

What markets / products / teams are affected?

___

Has this happened before? How many times?

___
```

---

## Section D: The Solution

> One paragraph. What does the initiative do? No technical jargon.

```
What does the solution do?
(Keep to 3-5 sentences. What does it detect/prevent/enable? Who benefits?)

___

Is this already built, partially built, or new?
(Already built / Partially built / New build required)

___

If already built: what is needed to go live?
(e.g., "Data team briefed with webhook URL, Slack channel access, infra approved")

___

If new: rough time to build?

___
```

---

## Section E: The Cost

> Be specific. Vague cost estimates lose exec confidence.

```
One-time build cost (developer time or contractor cost):

___

Monthly infrastructure cost (list each service and its cost):

Service 1: ___ / month
Service 2: ___ / month
Service 3: ___ / month
Total: ___ / month

Annual cost:

___

Is any of this already covered by existing subscriptions?

___
```

---

## Section F: The Value

> What does success look like? Make it measurable.

```
What improves immediately after launch?
(e.g., "Detection time drops from 24 hours to 15 minutes")

___

What does success look like in 90 days?
(e.g., "First incident caught automatically, ops team using dashboard daily")

___

How does this pay for itself?
(e.g., "One caught incident per year = $X in saved registrations = pays for 5 years of infra")

___
```

---

## Section G: The Ask

> Be explicit about what you need from the exec reading this.

```
What decision are you asking for?
(e.g., "Approve production deployment and $40/month infrastructure spend")

___

Who needs to act (and what do they need to do)?

___

What is the deadline or urgency?

___

What is out of scope for this ask (save for a future phase)?

___
```

---

## Output Instructions for Claude

Once you have filled in the sections above, paste this into Claude:

> "Using my answers to the business case questionnaire below, write a one-page exec-ready business case document in markdown. The tone should be direct and factual — no marketing language. Structure it with: The Incident, The Problem, What We're Exposed To (table), The Solution, Value Delivered (before/after table), Cost (table), Risk of Not Proceeding, and The Ask. Keep it under 600 words. Here are my answers: [paste answers]"
