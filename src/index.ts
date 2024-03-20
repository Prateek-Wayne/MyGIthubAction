import * as core from '@actions/core';
import * as github from '@actions/github';

const date=new Date();
core.debug(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
const run=async()=>{
    core.debug(` AGAIN Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
    const token = core.getInput('gh-token');
    const octokit = github.getOctokit(token);

    const { owner, repo, number } = github.context.issue;
    core.debug(`Owner is:${owner} | Repo: ${repo} | number : ${number}`);
    // core.debug(`Owner is:${github.context}`);
    try {
        const issue=await octokit.rest.issues.get({
            owner,repo,issue_number:number
        });
        core.debug(`Main content success : ${issue}`);
        console.log(`Main Content is this:${JSON.stringify(issue)}`);
    } catch (error) {
        core.setFailed((error as Error)?.message ?? "Unknown error")
    }
}

run();