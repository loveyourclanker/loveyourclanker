---
order: 4
slug: plan-execute-check
icon: list-checks
---

# Plan, Execute, Check

A robust and professional approach. Good balance of speed and control. The current _meta_.

## Flow

| Step | Software Engineer | Agent |
| ---: | ----------------- | ----- |
|    1 | The software engineer enters 'Plan Mode' and starts by prompting a system increment. "I want to integrate voice assistance into the app". "The website needs a new page for media reports". "I need to parallelise processing of the input queue, it's a bottleneck and we have residual available compute". The engineer may add "ask me questions if you are unsure" or my favourite "Consider carefully, think critically, make a plan". | |
|    2 | | The Agent evaluates the request app type, and prompts for Gaps. "The table affected by the processing is configured for page level locking, the bottleneck may just move the the database, should we fix that?". |
|    3 | The software engineer answers questions. | |
|    4 | | The agent builds the plan without changing any code or config. |
|    5 | The Software Engineer reviews the plan and prompts changes or corrections. | |
|    6 | | The agent updates the plan and requests the go ahead to start coding.<br>**Repeat steps 4-6 until the Software Engineer is Happy** |
|    7 | The Software Engineer gives the go ahead for coding | |
|    8 | | The Agent flips out of 'Plan' mode and starts modifying files |
|    9 | Once the Agent is finished, the Software Engineer takes over control of the change set | |
|  9.1 | Uses git tools to examine the changes made by the Agent. | |
|  9.2 | Hand codes changes or corrections | |
|  9.3 | Rethinks design approaches that didn't really work once implemented | |
|  9.4 | May prompt the Agent to make minor or tedious corrections | |

10. The interaction ends.

The next step is usually to re-enter 'Plan' mode and repeat the interraction. This may or may not be accompanied with a dump or clearing of context.

## Tools

Any modern harness + frontier model. Claude Code + Opus or Fable, Cursor, Antigravity etc.....

## Speed

Medium to High. If you get good at this technique and target the right increments, you can really pump out high quality code that you are still connected to and still be proud of.

## Control

Medium to High. You are in control of the architecture, the plan, the implementation you are literally handing off the part the the Agent can do well which is grinding out code.

## Quality

Medium to High. If you prompt well and really pick up issues in the plan and really attend to your check step (step 9) then you can keep quality high.

## Safety

High. Probably better than you can do without assistance.

## Brainrot

Medium. This is efficient but you are handing off the #fun and rewarding part of the process which is writing interesting code. It's important to use other techniques for really important code that is core to your IP (See I Code, You Check)

## Token Use

Medium to High. I have built whole systems on the $39 Claude plan using this method. Remember to clear context when you are flipping to a new increment and prompt your Agent to update it's memory with key decisions.

## Best For

- Production Code that does not require creativity.
- Code that has been 'seen before'
