const sleep = (time) => new Promise((resolve, reject) => {
  if (time < 0) reject("bad parameter");
  setTimeout(resolve, time * 1000);
});

sleep(5).then(console.log).catch(console.log)
// sleep(-1).then(() => console.log("two")).catch(console.log)
// sleep(2).then(() => console.log("three")).catch(console.log)