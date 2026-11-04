// Copyright 2026 The MathWorks, Inc.
const {
    smokeFailureIssueTitle,
    smokeFailureIssueBody,
    smokeFailedAgainComment,
    smokePassedComment,
} = require("./messages");

const SMOKE_FAILURE_LABEL = "smoke-test-failure";

async function findOpenFailureIssue({ github, owner, repo }) {
    const { data: issues } = await github.rest.issues.listForRepo({
        owner,
        repo,
        labels: SMOKE_FAILURE_LABEL,
        state: "open",
    });
    return issues.find((issue) => !issue.pull_request);
}

module.exports = async function reportSmokeResult({ github, context, core, result }) {
    const { owner, repo } = context.repo;
    const runUrl = `${context.serverUrl}/${owner}/${repo}/actions/runs/${context.runId}`;
    const issue = await findOpenFailureIssue({ github, owner, repo });

    if (result === "success") {
        if (!issue) {
            core.info("The smoke test passed, and no failure issue is open.");
            return;
        }
        await github.rest.issues.createComment({
            owner,
            repo,
            issue_number: issue.number,
            body: smokePassedComment(runUrl),
        });
        await github.rest.issues.update({
            owner,
            repo,
            issue_number: issue.number,
            state: "closed",
            state_reason: "completed",
        });
        core.info(`Closed issue #${issue.number}.`);
        return;
    }

    if (issue) {
        await github.rest.issues.createComment({
            owner,
            repo,
            issue_number: issue.number,
            body: smokeFailedAgainComment(runUrl, result),
        });
        core.info(`Commented on issue #${issue.number}.`);
        return;
    }

    const { data: created } = await github.rest.issues.create({
        owner,
        repo,
        title: smokeFailureIssueTitle,
        body: smokeFailureIssueBody(runUrl, result),
        labels: [SMOKE_FAILURE_LABEL],
    });
    core.info(`Opened issue #${created.number}.`);
};

module.exports.SMOKE_FAILURE_LABEL = SMOKE_FAILURE_LABEL;
