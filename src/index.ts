import * as core from "@actions/core";
import * as github from "@actions/github";
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

// type FileData = RestEndpointMethodTypes["repos"]["getContent"]["response"]["data"];
interface FileData {
  type: "file" | "symlink" | "submodule" | "dir";
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  git_url: string | null;
  html_url: string | null;
  download_url: string | null;
  _links: any; // You can specify the structure of _links if needed
}



const date = new Date();
core.debug(
  `Main Code Started 🚀 at ${date.getDate()}: ${date.getHours()}: ${date.getMinutes()} `
);

const createJson = (formData: string): Object => {
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
  //   console.log(`My Form Data :${JSON.stringify(configObject)}`);
  return configObject;
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
    const myData = createJson(issue.data?.body as string);
    console.log(`COntent is this:${JSON.stringify(myData)}`);

   // Fetch the content of the existing file
   const fileDataResponse = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: 'allowlist.json', // Path to the existing file
  });

  const fileData = fileDataResponse.data as FileData;
  console.log(`THis is the content of file data: ${JSON.stringify(fileData)}`);
  if(fileData.type)
  if (fileData.type !== 'file' || !fileData?.content) {
    throw new Error('The specified path does not point to a file or the file is empty');
  }

  // // Decode the content from base64
  const fileContent = Buffer.from(fileData?.content, 'base64').toString();
  console.log(`This is my Exact Data Present Loclly ${fileContent}`);

  // new content:
  const newContent = fileContent + JSON.stringify(myData);
  
  // Update the file with the new content
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: 'allowlist.json', // Path to the existing file
    message: 'Append form data', // Commit message
    content: Buffer.from(newContent).toString('base64'), // Encode the new content to base64
    sha: fileData.sha, // The blob SHA of the file being replaced
  });


  } catch (error) {
    core.setFailed((error as Error)?.message ?? "Unknown error");
  }
};

run();
