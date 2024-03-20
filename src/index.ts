import * as core from '@actions/core';
import * as github from '@actions/github';

const date=new Date();
core.debug(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
const run=async()=>{
    core.notice(`Main Code Starte 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
    const token=core.getInput( "gh-token");
    const octokit=github.getOctokit(token);
    const context=github.context;
    const { owner, repo, number } = github.context.issue;
    try {
        const issue = await octokit.rest.issues.get({
            owner,
            repo,
            issue_number: number
          });
          const issueBody = issue.data.body;
          console.log(`Inside the issueBody :${issueBody}`);
    } catch (error) {
        core.setFailed((error as Error)?.message ?? "Unknown error")
    }
}

run();