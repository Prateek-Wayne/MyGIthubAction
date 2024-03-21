const issueData = {
  "body": "### Configuration Name\n\nartifactory-ehv\n\n### Destination CIDRs\n\n130.139.138.30/32\n\n### Destination From Port\n\n443\n\n### Destination To Port\n\n443\n\n### Protocols\n\n6\n\n### Connection\n\ndirect"
};

// Split the body content into lines
const lines = issueData.body.split('\n');



const newLines=lines.filter((i)=>i!='');
let requiredArray=[];
for(let i=0;i<newLines.length;i++)
{
  if(i%2!==0)
  {
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


console.log(JSON.stringify(configObject));
console.dir(configObject);
// "artifactory-ehv": {
//   destination_cidrs: ["130.139.138.30/32"],
//   ports: [
//     {
//       destination_from_port: "443",
//       destination_to_port: "443",
//     },
//   ],
//   protocols: [6],
//   connection: "direct",
// },