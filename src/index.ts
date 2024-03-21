import * as core from "@actions/core";
import * as github from "@actions/github";

const date = new Date();
core.debug(
  `Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `
);

const createJson = (formData: string) => {
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
  core.debug(
    ` AGAIN Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `
  );
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
    createJson(issue.data?.body as string);
  } catch (error) {
    core.setFailed((error as Error)?.message ?? "Unknown error");
  }
};

run();
