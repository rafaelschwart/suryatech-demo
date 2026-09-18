import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "SuryaTech Response Desk",
  shortName: "Response Desk",
  client: "Suryatech EV Power LLC",
  version: packageJson.version,
  copyright: `© ${currentYear}, Suryatech EV Power LLC. Built by Arqentia.`,
  meta: {
    title: "SuryaTech Response Desk",
    description:
      "Operating system for a VEH122 vendor: see every public request the day it posts, assemble the response, keep the compliance evidence current, and watch station performance.",
  },
};
