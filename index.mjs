import * as fs from "fs";

const fileName = "example.txt";
const fileContents = "Lorem Ipsum";

fs.writeFile(fileName, fileContents, function (err) {
  if (err) {
    console.error(`Failed to write file: ${err}`);
    return;
  }
  console.log(`File ${fileName} written successfully!`);
});