# GitHub Workflows

English | [Chinese](./README_zh.md)

A collection of GitHub Actions workflows and repository templates for pnpm-based JavaScript and TypeScript projects. The `.github` directory covers pull request checks, lint fixes, preview packages, releases, contributor welcomes, issue forms, dependency updates, and sponsorship links.

These files are templates to copy and customize for a target repository. The workflows use repository events; they do not expose `workflow_call` entry points. This repository does not include an application, `package.json`, or a pnpm lockfile to run the package-related jobs on its own.

## Workflow reference

Paths below are relative to `.github/`.

| File | Trigger | Purpose and behavior | When to use it |
| --- | --- | --- | --- |
| [workflows/ci.yaml](./.github/workflows/ci.yaml) | Pull request | Sets up pnpm and Node.js LTS, installs dependencies with `pnpm i`, and runs `pnpm run lint`. | Check lint rules before merging a pull request. The current workflow does not run tests or a build. |
| [workflows/autofix.yml](./.github/workflows/autofix.yml) | Pull request targeting `main` | Installs dependencies with `--frozen-lockfile`, runs `pnpm lint --fix`, and passes the resulting changes to autofix.ci. | Provide automatic lint fixes for contributions to the main branch. |
| [workflows/semantic-pull-requests.yaml](./.github/workflows/semantic-pull-requests.yaml) | Pull request target: opened, edited, or synchronized | Validates a Conventional Commits-style PR title and rejects subjects beginning with an uppercase ASCII letter. Runs only in the configured `{owner}/{repo}`. | Keep PR titles consistent for review and release history. |
| [workflows/enforce-release-source.yml](./.github/workflows/enforce-release-source.yml) | Pull request target against `release`: opened, reopened, or edited | Fails the check unless the source is `main` in the configured repository. | Restrict release promotion to PRs from the same repository's `main` branch. Configure a required status check to make the result block merging. |
| [workflows/pkg.pr.new.yml](./.github/workflows/pkg.pr.new.yml) | Pull request changing `src/**` | Installs dependencies, runs `pnpm build`, and executes `npx pkg-pr-new publish`. Cancels older runs for the same PR. | Publish preview packages so a source change can be tried before merging. |
| [workflows/release.yml](./.github/workflows/release.yml) | Push of a tag matching `v*` | Invokes `lonewolfyx-workflows/npm-public-actions@main` with pnpm, then runs `npx genereleaselog@latest` with `GITHUB_TOKEN`. | Automate package publishing and release-log generation from version tags, after correcting the permissions placement described below. |
| [workflows/pr-contributor-welcome.yml](./.github/workflows/pr-contributor-welcome.yml) | Pull request target: closed; job runs only for merged PRs in the configured repository | Fetches up to five commits attributed to the author and maintains a welcome comment when the returned count is below three. | Welcome contributors using a commit-count heuristic. This does not establish whether it is the author's first merged PR. |
| [workflows/pr-contributor-welcome-v2.yml](./.github/workflows/pr-contributor-welcome-v2.yml) | Pull request target: closed; job runs only for merged PRs in the configured repository | Searches for the author's merged PRs and posts a welcome comment when the search returns exactly one. The message includes npmx community links. | Welcome an author after their first merged PR, with community-specific text customized for your project. |

## Issue forms and repository configuration

| File | Purpose and behavior | When to use it |
| --- | --- | --- |
| [ISSUE_TEMPLATE/bug-report.yml](./.github/ISSUE_TEMPLATE/bug-report.yml) | Requires a bug description, reproduction link, and expected behavior; adds the `bug` label. | Collect actionable bug reports. |
| [ISSUE_TEMPLATE/feature-suggestion.yml](./.github/ISSUE_TEMPLATE/feature-suggestion.yml) | Requires a use case and proposed solution, with optional alternatives and context; adds `enhancement`. | Gather feature requests with a clear motivation. |
| [ISSUE_TEMPLATE/documentation.yml](./.github/ISSUE_TEMPLATE/documentation.yml) | Requires a description of the documentation problem, with optional page location and context; adds `documentation`. | Report missing or unclear documentation. |
| [ISSUE_TEMPLATE/help-wanted.yml](./.github/ISSUE_TEMPLATE/help-wanted.yml) | Requires the user's objective, with optional attempted approaches and context; adds `help`. | Collect usage questions and support requests. |
| [ISSUE_TEMPLATE/config.yml](./.github/ISSUE_TEMPLATE/config.yml) | Allows blank issues and defines placeholder contact links. | Configure the issue chooser and direct users to support channels. |
| [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) | Provides linked-issue, context, and description sections, plus a contribution checklist. | Standardize PR descriptions; adapt the existing forge-specific checklist to your project. |
| [renovate.json5](./.github/renovate.json5) | Extends `github>config-preset/renovate-config` and sets `automerge: true`. | Configure dependency updates when Renovate is enabled; review the shared preset and automerge policy for your repository. |
| [FUNDING.yml](./.github/FUNDING.yml) | Configures `lonewolfyx` on GitHub Sponsors, Open Collective, and Buy Me a Coffee. | Display sponsorship options for the intended maintainer. |

## Using the templates

1. Copy the files you need into the target repository's `.github` directory.
2. Apply the project-specific changes in the table below.
3. For package workflows, provide a `package.json`, pnpm configuration, and `pnpm-lock.yaml`. Define the `lint` and `build` scripts used by the selected workflows; the lint script must accept `--fix` for autofix.
4. Configure the selected external services, including Renovate, autofix.ci, preview publishing, and package publishing, as applicable.
5. Open a pull request to verify the selected checks. Configure branch protection or rulesets with the required checks before relying on them to control merges.

## Customization before use

| Setting or file | Required adaptation |
| --- | --- |
| `{owner}/{repo}` | Replace every occurrence in the release-source check, semantic-title check, and both welcome workflows. Their repository guards otherwise skip the jobs. |
| Branch and path filters | Adapt `main`, `release`, `src/**`, and the `v*` tag pattern to your branching, source layout, and release conventions. |
| Welcome workflows | Select one variant. Both share the same workflow name and concurrency group expression, so enabling both can cause cancellation between them. Customize the message and replace the npmx Discord and contributor-role links in v2. |
| `ISSUE_TEMPLATE/config.yml` | Replace `[label title name]`, `[label link]`, and `[label description]` with actual string values, or remove the placeholder contact entry. |
| Bug reproduction link | Replace `lonewolfyx/package-name` and the `playground` path with your project's reproduction location. |
| PR checklist | Replace the `forges` wording, provider/capability/fixture instructions, and commands such as `pnpm check:all` and `pnpm capability-matrix` with your contribution requirements. The current CI only runs lint. |
| Issue labels | Ensure `bug`, `enhancement`, `documentation`, and `help` exist in the target repository, or change the forms to match your labels. |
| Funding and Renovate | Replace sponsorship accounts as needed and confirm that the shared Renovate preset matches your dependency-update policy. |
| Release permissions | Move `contents: write` and `id-token: write` from the action step to the release job or workflow. GitHub defines `permissions` at workflow or job scope; the current step-level placement is invalid. See [GitHub's workflow syntax reference](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idpermissions). Configure publishing authentication for the selected publishing action. |

