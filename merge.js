const mergeFiles = require("merge-files");
const terminal = require("./terminal");

const inputPathList = [
  __dirname + "/lists/tailwind.txt"
];

// console.log(__dirname);

mergeFiles(inputPathList, __dirname + "/result.txt").then(status => {
  if (status) {
    terminal.log("All Tailwind classes up to date.");
  } else {
    terminal.log("🐞 ", "Error. Please check input files");
  }
});
