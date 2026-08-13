const supportedMajor = 24;
const currentMajor = Number.parseInt(process.versions.node.split(".")[0] ?? "", 10);

if (currentMajor !== supportedMajor) {
  console.error(
    `Sawayatra requires Node ${supportedMajor}. Current runtime: ${process.versions.node}. ` +
      "Switch to Node 24 before running development, build, or preview commands.",
  );
  process.exit(1);
}
