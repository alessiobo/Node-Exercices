import figlet from "figlet";

figlet('Hello, World!', (err, data) => {
  if (err) {
    console.log('Qualcosa è andato storto...');
    console.dir(err);
    return;
  }
  console.log(data);
});
