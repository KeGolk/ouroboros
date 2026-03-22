# GSD Roadmap — Q00/ouroboros Open Issues Resolution

> **Project:** Q00/ouroboros (Specification-First AI Development Plugin)
> **Scope:** All 7 open issues — full lifecycle resolution
> **Methodology:** GSD + Octo (Debate → Plan → Implement → Test → Validate → Review)
> **Created:** 2026-03-06
> **Branch Strategy:** One feature branch per phase, PRs to main

---

## Phase 1: Stabilization & Safety (P0 Bugs)

**Goal:** Stop breaking things. Fix destructive/misleading behavior.
**Issues:** #59, #61, #60
**Branch:** `fix/stabilization-phase1`

### Phase 1A: MCP Server Reconnection (#59)
**Complexity:** M | **Risk:** High

**Root Cause Analysis:**
- MCP server uses FastMCP with stdio/SSE transport
- Server init: `src/ouroboros/mcp/server/adapter.py` lines 438-530
- CLI entry: `src/ouroboros/cli/commands/mcp.py` lines 26-73
- `.mcp.json` config uses `uvx --python 3.14` to launch
- Likely cause: stale PID/socket from previous session, no graceful shutdown handler

**Implementation Plan:**
1. Add signal handler (SIGTERM/SIGINT) in `mcp.py:_run_mcp_server()` for graceful shutdown
2. Add health check endpoint to MCPServerAdapter (heartbeat response)
3. Add stale lock file cleanup on server startup (check PID alive)
4. Add `--force` flag to `mcp serve` to kill existing instances
5. Document recovery steps in error messages

**Files to Modify:**
- `src/ouroboros/cli/commands/mcp.py` — signal handlers, PID file
- `src/ouroboros/mcp/server/adapter.py` — health check, cleanup on init
- `.mcp.json` — consider adding restart policy

**Testing:**
- [ ] Unit: signal handler fires cleanup on SIGTERM
- [ ] Unit: stale PID detection and cleanup
- [ ] Integration: start → kill -9 → restart succeeds
- [ ] Integration: two instances detect conflict

**Validation:**
- Server starts cleanly after unclean shutdown
- `/mcp` reconnect works without full Claude Code restart
- Error messages include actionable recovery steps

---

### Phase 1B: Ralph Respects CLAUDE.md Git Workflow (#61)
**Complexity:** M | **Risk:** Medium

**Root Cause Analysis:**
- Ralph loop: `skills/ralph/SKILL.md` lines 62-92
- Uses `evolve_step(lineage_id, seed_content, execute=true)` per iteration
- No git workflow detection exists anywhere in codebase
- `tag_generation()` referenced in issue but not yet implemented
- Ralph's commit behavior is embedded in the skill instructions, not Python code

**Implementation Plan:**
1. Create `src/ouroboros/core/git_workflow.py`:
   - `detect_git_workflow(project_root: Path) -> GitWorkflowConfig`
   - Parse CLAUDE.md for patterns: "PR-based", "never commit to main", "create branch", "pull request"
   - Return config: `{use_branches: bool, branch_pattern: str, auto_pr: bool, protected_branches: list}`
2. Create `src/ouroboros/core/git_ops.py`:
   - `ensure_feature_branch(config, lineage_id) -> str` — create `ooo/ralph/{lineage_id}` if needed
   - `commit_changes(message, branch) -> str` — commit to correct branch
   - `create_pr(branch, title, body) -> str | None` — optional PR creation
3. Update `skills/ralph/SKILL.md`:
   - Before first iteration: detect git workflow from CLAUDE.md
   - If PR-based: create feature branch, commit there
   - On success: push and suggest/create PR
4. Update `skills/run/SKILL.md` with same detection logic

**Files to Create:**
- `src/ouroboros/core/git_workflow.py` — workflow detection
- `src/ouroboros/core/git_ops.py` — git operations

**Files to Modify:**
- `skills/ralph/SKILL.md` — add git workflow detection step
- `skills/run/SKILL.md` — same detection
- `skills/evolve/SKILL.md` — same detection (via ralph integration)

**Testing:**
- [ ] Unit: CLAUDE.md parsing detects "PR-based workflow" pattern
- [ ] Unit: CLAUDE.md parsing detects "never commit to main" pattern
- [ ] Unit: Branch name generation follows pattern `ooo/ralph/{lineage_id}`
- [ ] Unit: No-preference case defaults to current branch behavior
- [ ] Integration: Ralph loop creates branch when CLAUDE.md says PR-based
- [ ] Integration: Ralph loop commits to current branch when no preference

**Validation:**
- Ralph with "PR-based" CLAUDE.md creates feature branch
- Ralph without git preferences behaves as before (backward compat)
- Commit messages include iteration metadata
- PR creation includes verification results

---

### Phase 1C: Evaluation Output Accuracy (#60)
**Complexity:** S | **Risk:** Low

**Root Cause Analysis:**
- Evaluation pipeline: `src/ouroboros/evaluation/pipeline.py` lines 110-134
- Mechanical verification: `src/ouroboros/evaluation/mechanical.py`
- The "this is expected" message is in the skill output formatting, not Python code
- Skills: `skills/evaluate/SKILL.md`
- Need to check `git diff --stat` or working tree state before declaring failures "expected"

**Implementation Plan:**
1. Add `detect_code_changes(project_root: Path) -> bool` helper:
   - Check `git diff --name-only` (staged + unstaged)
   - Check for untracked files in src/
   - Return True if code modifications exist
2. Update `skills/evaluate/SKILL.md`:
   - After mechanical verification fails, check for code changes
   - If changes exist + build fails → "Code changes detected but build/test failed. Fix issues or run `ooo ralph`"
   - If no changes exist → "No code changes yet. This is expected for a pre-implementation evaluation"
3. Update evaluation result formatting in skill to include code-change awareness

**Files to Modify:**
- `skills/evaluate/SKILL.md` — conditional messaging
- `src/ouroboros/evaluation/pipeline.py` — add code change detection to EvaluationContext (optional)

**Testing:**
- [ ] Unit: code change detection returns True when files modified
- [ ] Unit: code change detection returns False on clean tree
- [ ] Integration: evaluate with changes shows "fix issues" message
- [ ] Integration: evaluate without changes shows "expected" message

**Validation:**
- User sees accurate messaging matching their actual state
- No regression on passing evaluations
- Next-step suggestions differ based on code presence

---

## Phase 2: Contextual Intelligence (P1 Enhancements)

**Goal:** Make the tool context-aware and self-guiding.
**Issues:** #57, #58
**Branch:** `feat/contextual-intelligence-phase2`

### Phase 2A: Interview Reads Codebase First (#57)
**Complexity:** L | **Risk:** Medium

**Root Cause Analysis:**
- Interview engine: `src/ouroboros/bigbang/interview.py`
- `InterviewState` has fields: `is_brownfield`, `codebase_paths`, `codebase_context`, `explore_completed` (lines 88-91)
- These fields EXIST but are underutilized
- Socratic interviewer agent: `agents/socratic-interviewer.md`
- MCP handler: `src/ouroboros/mcp/tools/definitions.py` — InterviewHandler

**Implementation Plan:**
1. Update `agents/socratic-interviewer.md`:
   - Add "Phase 0: Context Scan" before first question
   - Instructions: Use Glob/Grep/Read to scan project structure
   - Identify: language, framework, existing auth, config, test setup, CI
   - Store findings in interview state
2. Update `src/ouroboros/bigbang/interview.py`:
   - Add `auto_explore_codebase(paths: list[Path]) -> str` method
   - Scan: file tree, package.json/pyproject.toml, key directories
   - Generate structured context summary
   - Set `explore_completed = True` after scan
3. Update `skills/interview/SKILL.md`:
   - Path A (MCP): Pass `codebase_paths` to `ouroboros_interview`
   - Path B (Agent): Read project structure before first question
   - Transform question format: open → confirmation
4. Update InterviewHandler in MCP tools:
   - Accept `codebase_paths` parameter
   - Auto-scan on first call if not already explored

**Files to Modify:**
- `agents/socratic-interviewer.md` — add context scan phase
- `src/ouroboros/bigbang/interview.py` — implement auto_explore_codebase()
- `skills/interview/SKILL.md` — add pre-scan step
- `src/ouroboros/mcp/tools/definitions.py` — InterviewHandler accepts paths

**Testing:**
- [ ] Unit: auto_explore_codebase returns structured summary for Python project
- [ ] Unit: auto_explore_codebase returns structured summary for Node.js project
- [ ] Unit: explore_completed flag prevents re-scanning
- [ ] Integration: interview with brownfield project asks confirmation questions
- [ ] Integration: interview with greenfield project asks open questions (no context to scan)

**Validation:**
- Brownfield interview references actual files/patterns found
- Questions use "I see X in path/to/file" format
- No performance degradation on large codebases (scan is targeted, not exhaustive)
- Greenfield projects still work normally

---

### Phase 2B: Next Step Suggestions (#58)
**Complexity:** S | **Risk:** Low

**Root Cause Analysis:**
- Some skills already have partial next-step suggestions
- `skills/interview/SKILL.md` lines 107-109: mentions `ooo seed`
- `skills/seed/SKILL.md` lines 125-131: mentions `ooo run`
- `skills/run/SKILL.md`: mentions `ooo evaluate`
- `skills/evaluate/SKILL.md`: NO next-step suggestion
- Inconsistent format across skills

**Implementation Plan:**
1. Define standard "Next Step" output block format:
   ```
   ---
   ## What's Next

   | Outcome | Next Command | Description |
   |---------|-------------|-------------|
   | Success | `ooo <cmd>` | <why> |
   | Failure | `ooo <cmd>` | <why> |
   ```
2. Update each SKILL.md with the standard block:

| Skill | Success Next | Failure Next |
|-------|-------------|-------------|
| `interview` | `ooo seed` | Continue interview |
| `seed` | `ooo run` | Revise seed |
| `run` | `ooo evaluate` | Fix issues, `ooo run` again |
| `evaluate` (pass) | Done, or `ooo evolve` | `ooo ralph` or fix manually |
| `evolve` | `ooo evaluate` | `ooo ralph` or `ooo unstuck` |
| `ralph` | `ooo evaluate` (final check) | Check logs, manual intervention |
| `status` | (context-dependent) | — |
| `unstuck` | `ooo run` | Try different approach |

**Files to Modify:**
- `skills/interview/SKILL.md` — standardize format
- `skills/seed/SKILL.md` — standardize format
- `skills/run/SKILL.md` — add failure path
- `skills/evaluate/SKILL.md` — add next-step section (MISSING)
- `skills/evolve/SKILL.md` — add next-step section
- `skills/ralph/SKILL.md` — add next-step section
- `skills/status/SKILL.md` — context-dependent suggestions
- `skills/unstuck/SKILL.md` — add next-step section

**Testing:**
- [ ] Manual: run each ooo command and verify next-step appears
- [ ] Review: all SKILL.md files have "What's Next" section

**Validation:**
- Every ooo step ends with actionable next command
- Success and failure paths both have suggestions
- Format is consistent across all skills

---

## Phase 3: Resilience & Expansion (P2 Features)

**Goal:** Handle interruptions gracefully and extend platform reach.
**Issues:** #50, #65
**Branch per issue:** `feat/workflow-resumption`, `feat/openclaw-integration`

### Phase 3A: Workflow Resumption After Ctrl+C (#50)
**Complexity:** XL | **Risk:** High

**Root Cause Analysis:**
- WorkflowState: `src/ouroboros/orchestrator/workflow_state.py` lines 125-289
- Tracks: session_id, goal, acceptance_criteria, current_ac_index, phase, activity
- AC markers: `[AC_START: N]`, `[AC_COMPLETE: N]` parsed from agent messages
- CheckpointStore: `src/ouroboros/persistence/checkpoint.py`
- SessionTracker: `src/ouroboros/orchestrator/session.py` lines 62-149
- StateStore: `src/ouroboros/plugin/state/store.py` — already has mode-based persistence
- Key gap: no signal handler to save state on interrupt, no resume CLI path

**Implementation Plan:**
1. **Signal handler & auto-checkpoint:**
   - Add SIGINT handler in orchestrator runner
   - On Ctrl+C: serialize current WorkflowState to `.ouroboros/sessions/{session_id}/state.json`
   - Include: AC progress, file diffs, last checkpoint, phase
   - Use existing CheckpointStore infrastructure

2. **Session directory structure:**
   ```
   .ouroboros/sessions/
   └── {session_id}/
       ├── state.json          # WorkflowState snapshot
       ├── context_summary.md  # LLM-generated summary of progress
       ├── file_changes.patch  # git diff at interrupt time
       └── metadata.json       # timestamps, seed_id, lineage
   ```

3. **Context injection on resume:**
   - Generate `context_summary.md` from WorkflowState + completed ACs
   - On resume: inject summary into system prompt
   - Skip completed ACs, restart from last incomplete

4. **CLI commands:**
   - `ooo status --sessions` — list interrupted sessions
   - `ooo resume [session_id]` — resume specific session
   - `ooo resume --latest` — resume most recent

5. **Resume skill:**
   - Create `skills/resume/SKILL.md`
   - Read session state, inject context, continue execution

**Files to Create:**
- `skills/resume/SKILL.md` — resume skill definition
- `src/ouroboros/orchestrator/resume.py` — resume logic

**Files to Modify:**
- `src/ouroboros/orchestrator/workflow_state.py` — add serialization/deserialization
- `src/ouroboros/orchestrator/session.py` — add interrupt handling
- `src/ouroboros/persistence/checkpoint.py` — session-level checkpoints
- `skills/status/SKILL.md` — add --sessions flag

**Testing:**
- [ ] Unit: WorkflowState serializes/deserializes correctly
- [ ] Unit: context summary generation captures AC progress
- [ ] Unit: resume skips completed ACs
- [ ] Integration: interrupt mid-workflow → resume picks up correctly
- [ ] Integration: file changes preserved across interrupt/resume
- [ ] Edge case: interrupt during file write (partial state)
- [ ] Edge case: resume with conflicting file changes

**Validation:**
- Ctrl+C at any point saves recoverable state
- Resume restores progress without re-executing completed ACs
- Context summary is accurate and concise (token-efficient)
- No data loss on interrupt

---

### Phase 3B: OpenClaw Gateway Integration (#65) — EXCLUDED
> Dropped from scope per user decision. External PR from vdk888 — not our priority.

---

## Execution Lifecycle

### Per-Phase Cycle:

```
┌─────────────────────────────────────────────────────────┐
│  1. PRE-IMPLEMENTATION                                   │
│     ├─ Octo Debate (prioritize & approach)              │
│     ├─ Codebase Exploration (find exact locations)      │
│     └─ GSD Plan (this document)                         │
│                                                          │
│  2. IMPLEMENTATION                                       │
│     ├─ Feature branch per phase                         │
│     ├─ Atomic commits per issue                         │
│     ├─ Tests written alongside code                     │
│     └─ Code simplifier pass after each issue            │
│                                                          │
│  3. TESTING                                              │
│     ├─ Unit tests for new functions/classes             │
│     ├─ Integration tests for workflows                  │
│     ├─ Edge case coverage (interrupts, errors)          │
│     └─ Regression: full test suite (2382+ tests)        │
│                                                          │
│  4. VALIDATION                                           │
│     ├─ Manual verification of each fix                  │
│     ├─ PR review (pr-review-toolkit)                    │
│     └─ Acceptance criteria check per issue              │
│                                                          │
│  5. POST-OP DEBATE                                       │
│     ├─ Octo debate on implementation quality            │
│     ├─ Architecture impact assessment                   │
│     ├─ Backward compatibility verification              │
│     └─ Performance impact analysis                      │
│                                                          │
│  6. DELIVERY                                             │
│     ├─ PR creation with Summary + Test Plan             │
│     ├─ Octo review (multi-AI code review)               │
│     ├─ Address review comments                          │
│     └─ Merge readiness confirmation                     │
└─────────────────────────────────────────────────────────┘
```

### Phase Dependencies:

```
Phase 1 (Stabilization)
├── 1A: MCP Reconnect (#59)      ──┐
├── 1B: Ralph Git Workflow (#61)  ──┼── All independent, can parallel
└── 1C: Eval Accuracy (#60)      ──┘
         │
         ▼
Phase 2 (Intelligence)
├── 2A: Interview Context (#57)  ── Independent
└── 2B: Next Steps (#58)         ── Independent (can parallel with 2A)
         │
         ▼
Phase 3 (Resilience)
├── 3A: Workflow Resume (#50)    ── Depends on stable infra (Phase 1)
└── 3B: OpenClaw (#65)           ── Independent (PR review when submitted)
```

### Post-Op Debate Topics (per phase):

**Phase 1 Post-Op:**
- Did MCP fix address root cause or just symptoms?
- Is CLAUDE.md parsing robust enough for diverse formats?
- Should git workflow detection be a reusable core module?

**Phase 2 Post-Op:**
- Is codebase scanning fast enough for large projects?
- Are next-step suggestions context-aware or just static?
- Should suggestions adapt based on user's history?

**Phase 3 Post-Op:**
- Is checkpoint granularity sufficient (AC-level vs message-level)?
- Token efficiency of context injection on resume?
- OpenClaw bridge: should it be in-tree or separate package?

---

## Success Criteria

| Issue | Done When |
|-------|-----------|
| #59 | MCP reconnects after unclean shutdown without full Claude Code restart |
| #61 | Ralph creates feature branch + PR when CLAUDE.md says PR-based workflow |
| #60 | Eval shows "fix issues" when code exists + fails, "expected" only when no code |
| #57 | Interview references actual files/patterns from codebase in questions |
| #58 | Every ooo command ends with "What's Next" section |
| #50 | Ctrl+C saves state, `ooo resume` continues from last completed AC |
| #65 | OpenClaw bridge delegates correctly, top_p fix scoped to Anthropic only |

## Total Estimated Scope

- **Phase 1:** ~2-3 days (3 issues, M+M+S complexity)
- **Phase 2:** ~2-3 days (2 issues, L+S complexity)
- **Phase 3:** ~4-5 days (2 issues, XL+M complexity)
- **Total:** ~8-11 days of implementation + testing + review
