"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const pgn_cidrs_file_path = [
    "130.138.0.0/17",
    "130.138.128.0/18",
    "130.138.192.0/19",
    "130.139.0.0/16",
    "130.140.0.0/14",
    "130.144.0.0/14",
    "137.55.0.0/16",
    "144.54.0.0/16",
    "149.59.0.0/16",
    "161.83.0.0/16",
    "161.84.0.0/17",
    "161.84.128.0/18",
    "161.84.192.0/19",
    "161.85.128.0/17",
    "161.85.0.0/18",
    "161.85.64.0/19",
    "161.85.96.0/20",
    "161.86.0.0/15",
    "161.88.0.0/16",
    "161.91.0.0/16",
    "161.92.0.0/16",
    "167.81.0.0/16",
    "10.0.0.0/8",
    "192.68.48.0/23",
];
const allow_list_file_path = {
    "artifactory-ehv": {
        destination_cidrs: ["130.139.138.30/32"],
        ports: [
            {
                destination_from_port: "443",
                destination_to_port: "443",
            },
        ],
        protocols: [6],
        connection: "direct",
    },
    //   "artifactory-pic": {
    //     destination_cidrs: ["161.85.28.82/32"],
    //     ports: [
    //       {
    //         destination_from_port: "443",
    //         destination_to_port: "443",
    //       },
    //     ],
    //     protocols: [6],
    //     connection: "direct",
    //   },
    //   blackduck: {
    //     destination_cidrs: ["161.92.84.250/32"],
    //     ports: [
    //       {
    //         destination_from_port: "443",
    //         destination_to_port: "443",
    //       },
    //     ],
    //     protocols: [6],
    //     connection: "firewall",
    //   },
};
function ipToInt(ip) {
    return (ip
        .split(".")
        .reduce((ipInt, octet) => (ipInt << 8) + parseInt(octet, 10), 0) >>> 0);
}
function isCidrAllowed(serviceCidr, allowedCidr) {
    // console.log(`Insiden the line 75 :${allowedCidr}`);
    const [allowedIp, allowedMask] = allowedCidr.split("/");
    const [serviceIp, serviceMask] = serviceCidr.split("/");
    console.log(`Insidn the line 78 :${serviceIp} | ${serviceMask}`);
    const allowedMaskInt = parseInt(allowedMask);
    const serviceMaskInt = parseInt(serviceMask);
    const allowedIpInt = ipToInt(allowedIp);
    const serviceIpInt = ipToInt(serviceIp);
    const mask = ~(Math.pow(2, 32 - allowedMaskInt) - 1);
    return ((allowedIpInt & mask) === (serviceIpInt & mask) &&
        allowedMaskInt <= serviceMaskInt);
}
function isCidrInAllowedCidrs(allowedCidrs, serviceCidr) {
    return allowedCidrs.some((allowedCidr) => isCidrAllowed(serviceCidr, allowedCidr));
}
async function check() {
    for (const [key, value] of Object.entries(allow_list_file_path)) {
        value.destination_cidrs.forEach((cidr) => {
            console.log(`Inside line 100 : ${cidr}`);
            if (!isCidrInAllowedCidrs(pgn_cidrs_file_path, cidr)) {
                console.log(`cidr ${cidr} in ${key} is NOT in allowed cidrs`);
                console.log(`cidr ${cidr} in ${key} is NOT in allowed cidrs`);
            }
            else {
                console.log(`cidr ${cidr} in ${key} is in allowed cidrs`);
            }
        });
    }
}
exports.check = check;
check();
