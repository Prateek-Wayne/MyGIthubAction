import * as core from '@actions/core';
import * as github from '@actions/github';

const date=new Date();
core.debug(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
const run=()=>{
    core.notice(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
    const token=core.getInput( "gh-token");
    core.debug(`Inside the main function ${token}`);
    const label=core.getInput('label');
    const ocktokit=github.getOctokit(token);
    const context=github.context;
    console.log(context);
}

run();