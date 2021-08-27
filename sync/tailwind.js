const _ = require("lodash");
const fs = require("fs");
const writeStream = fs.createWriteStream(
  __dirname + "/../lists/tailwind.txt"
);
const pathName = writeStream.path.replace("../", "");
const htmlToJson = require("html-to-json");
const terminal = require("../terminal");

const base2fetch = [
  "https://tailwind.build/classes"
];
const promises = [];

const linkParser = htmlToJson.createParser([
  "#bs-classes a",
  {
    func: function($a) {
      var tempA = $a.text(),
          newA = tempA.replace(/( \/ .*)/g, ''),
          newA = newA.replace(/\./g, '');
      return newA;
    }
  }
]);

const pageParser = url => {
  return new Promise((resolve, reject) => {
    linkParser
      .request(url)
      .then(links => {
        resolve(links);
      })
      .catch(e => {
        reject(e);
      });
  });
};

for (fetchUrl of base2fetch) {
  let l = fetchUrl.split("/");

  terminal.log(
    "⏱️ ",
    "Creating Promises for " + l[l.length - 1].replace(".html", "")
  );

  promises.push(pageParser(fetchUrl));
}

terminal.log("🖨️ ", "Loading " + promises.length + " pages");
terminal.spinner.start();

const timerStart = Date.now();

Promise.all(promises).then(values => {
  let functions = _.flatten(values);
  for (f in functions) {
    writeStream.write(functions[f].func + "\n");
  }

  terminal.spinner.stop();
  terminal.log(
    "🧨 ",
    "Loaded in " + (Date.now() - timerStart) / 1000 + " seconds"
  );

  writeStream.on("finish", () => {
    terminal.log("🏁 ", `Tailwind CSS Sync complete.`);
    terminal.log("💾 ", `Saved to ${pathName}`);
  });

  writeStream.on("error", err => {
    terminal.log(
      "🐞 ",
      `There is an error writing the file ${pathName} => ${err}`
    );
  });

  writeStream.end();
});
