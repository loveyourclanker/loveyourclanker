---
order: 5
slug: icode-ucheck
icon: scan-search
---

# I Code, You Check

A High touch, high skill, professional approach for the most critical code. Complete control. You get to do the interesting bits. Not very fast.

## Flow

| Step | Software Engineer                                                                                                                                                                           | Agent                                                                                                                      | Prompt Examples                                                                                                                                                                                                                                                                                                   |
| ---: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    1 | The software engineer enters 'Plan Mode' and starts by prompting a system increment. The engineer may tack a nudge onto the end of it — the last one is my favourite.                       |                                                                                                                            | "I want to integrate voice assistance into the app", "The website needs a new page for media reports", "I need to parallelise processing of the input queue, it's a bottleneck and we have residual available compute", "ask me questions if you are unsure", "Consider carefully, think critically, make a plan" |
|    2 |                                                                                                                                                                                             | The Agent evaluates the request app type, and prompts for Gaps.                                                            | "The table affected by the processing is configured for page level locking, the bottleneck may just move the the database, should we fix that?"                                                                                                                                                                   |
|    3 | The software engineer answers questions.                                                                                                                                                    |                                                                                                                            |                                                                                                                                                                                                                                                                                                                   |
|    4 |                                                                                                                                                                                             | The agent builds the plan without changing any code or config.                                                             |                                                                                                                                                                                                                                                                                                                   |
|    5 | The Software Engineer reviews the plan and prompts changes or corrections.                                                                                                                  |                                                                                                                            |                                                                                                                                                                                                                                                                                                                   |
|    6 |                                                                                                                                                                                             | The agent updates the plan and requests the go ahead to start coding.<br>**Note that the Engineer now does the Execution** |                                                                                                                                                                                                                                                                                                                   |
|    7 | The Software Engineer begins coding the changes in increments                                                                                                                               |                                                                                                                            |                                                                                                                                                                                                                                                                                                                   |
|    8 | At the end of each increment, usually when the code compiles, the Software Engineer prompts the Agent to check the work.                                                                    |                                                                                                                            | "I have completed the first part of the plan, check my work for errors, gaps, ommissions"                                                                                                                                                                                                                         |
|    9 |                                                                                                                                                                                             | The agent checks the code, it may use git tools to check the diff.                                                         |                                                                                                                                                                                                                                                                                                                   |
|   10 |                                                                                                                                                                                             | the Agent lists out a set of errors, gaps and omissions                                                                    |                                                                                                                                                                                                                                                                                                                   |
|   11 | The Engineer runs through the list and makes any corrections that they agree with.<br>**The Engineer may choose to ignore issues found by the agent if they are irrelevant or unimportant** |                                                                                                                            |                                                                                                                                                                                                                                                                                                                   |

12. Steps 7 through 11 are repeated until the Engineer thinks the work is done
13. The interaction ends.

_notes_

- the Agent stays in 'Plan' mode the whole time.
- If you get stuck you can prompt "what were you thinking about for this change?", look at the code and use it to get unstuck.
- The Agent is usually super good at finding gaps to the point it can surface minor things that are not important. Use your judgement to ignore what isn't necessary.

## Tools

Any modern harness + frontier model. Claude Code + Opus or Fable, Cursor, Antigravity etc.....

## Speed

Medium. You are still hand coding. Equivalent speed to 'Pair coding' approach from extreme programming.

## Control

Highest. You are in complete control.

## Quality

Highest. Basically your best skills + an omnipresent reviewer who has read every line of code on github.

## Safety

Highest.

## Brainrot

Negative. You are learning, you are problem solving, you are getting smarter than the agent.

## Token Use

Medium. Still paying for planning and checking but not all the generation tokens.

## Best For

- Production Code that has never existed before.
- Key IP for your business
- Technology that is your 'Moat'
