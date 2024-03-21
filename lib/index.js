"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const date = new Date();
core.debug(`Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
const createJson = (formData) => {
    const lines = formData.split("\n");
    const newLines = lines.filter((i) => i != "");
    let requiredArray = [];
    for (let i = 0; i < newLines.length; i++) {
        if (i % 2 !== 0) {
            requiredArray.push(newLines[i]);
        }
    }
    const configObject = {
        [requiredArray[0]]: {
            destination_cidrs: [requiredArray[1]],
            ports: [
                {
                    destination_from_port: requiredArray[2],
                    destination_to_port: requiredArray[3],
                },
            ],
            protocols: [parseInt(requiredArray[4])],
            connection: requiredArray[5],
        },
    };
    console.log(`My Form Data :${JSON.stringify(configObject)}`);
};
const run = async () => {
    var _a, _b;
    core.debug(` AGAIN Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `);
    const token = core.getInput("gh-token");
    const octokit = github.getOctokit(token);
    const { owner, repo, number } = github.context.issue;
    core.debug(`Owner is:${owner} | Repo: ${repo} | number : ${number}`);
    // core.debug(`Owner is:${github.context}`);
    try {
        const issue = await octokit.rest.issues.get({
            owner,
            repo,
            issue_number: number,
        });
        core.debug(`Main content success : ${issue}`);
        console.log(`Main Content is this:${JSON.stringify(issue)}`);
        createJson((_a = issue.data) === null || _a === void 0 ? void 0 : _a.body);
    }
    catch (error) {
        core.setFailed((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Unknown error");
    }
};
run();
