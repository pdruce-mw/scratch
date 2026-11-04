// Copyright 2026 The MathWorks, Inc.
module.exports = {
    issueClosedComment: (tag, releaseUrl) =>
        `This issue has been addressed in [${tag}](${releaseUrl}). Feel free to reopen the issue if you need. Thank you for your contribution.`,
    smokeFailureIssueTitle: "The smoke test of the published releases does not pass",
    smokeFailureIssueBody: (runUrl, result) =>
        `The smoke test of the published releases did not pass. [This run](${runUrl}) ended with \`${result}\`. If a step failed, the run keeps the installer logs as an artifact.\n\nEach later run that does not pass adds a comment here. The first run that passes closes this issue.`,
    smokeFailedAgainComment: (runUrl, result) =>
        `The smoke test did not pass again. [This run](${runUrl}) ended with \`${result}\`.`,
    smokePassedComment: (runUrl) =>
        `The smoke test passed in [this run](${runUrl}), so this issue is closed.`,
};
