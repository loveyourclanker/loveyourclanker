---
order: 1
slug: tab-completion
icon: arrow-right-to-line
---

# Tab Completion

In the early days of AI coding, this was _it_ and it is where the agentic engineering journey started for many. Tends to be not used much as there are newer patterns that give a better combination of efficiency with control and safety.

## Flow

| Step | Software Engineer | Agent |
| ---: | ----------------- | ----- |
|    1 | In the context of hand coding inside existing software, The software engineer starts writing a line of code, function, or class body. | |
|    2 | The software engineer presses <kbd>Tab</kbd>. | |
|    3 | | The agent gathers context from around the cursor, including comments and code errors. |
|    4 | | The agent generates and presents a proposed completion. |
|    5 | The software engineer reviews the proposed completion: | |
|  5a. | **Accepts the completion** — The software engineer confirms the change. | The agent applies the completion. |
|  5b. | **Rejects the completion** — The software engineer declines the change. | The agent makes no changes. |

6. The interaction ends.

## Tools

Microsoft Copilot

## Speed

Low. Mostly just not getting stuck. Marginally faster than looking up the answer on stack overflow and copy/pasting.

## Control

High. The Software engineer is in control of the process, can reject any increment, can provide as much context as they think is needed.

## Quality

High. The incremental and 'small blast radius' of this approach results in quality equivalent to hand coding.

## Safety

High. Again, Incremental and 'small blast radius' of this approach results in safety eqivalent to your own skill level. Care should obviously still be taken if you are completing a function in an Auth chain or similar high risk area.

## Brainrot

Low. The lassitude of handing off the hard problem is countered by the immediate discovery of the answer and reinforced by seeing the code run succesfully.

## Token Use

Low. You are paying for a few hundred tokens of surrounding context per keystroke and nothing else. The cheapest pattern there is.

## Best For

- Established engineers who want to maintain control but increase efficiency marginally.
