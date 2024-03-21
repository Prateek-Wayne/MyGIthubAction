import * as core from '@actions/core';
import * as github from '@actions/github';

const date=new Date();
core.debug(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
const run=async()=>{
    core.notice(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
    const token=core.getInput( "gh-token");
    const label=core.getInput('label');
    const octokit=github.getOctokit(token);
    const context=github.context;
    const pullRequest = context.payload.pull_request;
    try {
        if(!pullRequest)
        {
            throw new Error('this action can only be run on a PR.')
        }
        await octokit.rest.issues.addLabels({
            owner:context.repo.owner,
            repo:context.repo.repo,
            issue_number:pullRequest.number,
            labels:[label],
        })
    } catch (error) {
        core.setFailed((error as Error)?.message ?? "Unknown error")
    }
}

run();