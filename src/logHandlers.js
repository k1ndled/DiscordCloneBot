/*/

    TAKEN FROM V1  

/*/

const COLOR = require(`chalk`);

exports.warn = (...message) => {
  console.log(COLOR.yellow(`<warn>`));
  console.warn(...message);
  console.log(COLOR.yellow(`</warn>`));
};

exports.error = (...message) => {
  console.log(COLOR.red(`<error>`));
  console.warn(...message);
  console.log(COLOR.red(`</error>`));
};

exports.info = (...message) => {
  console.log(COLOR.cyan(`[INFO] > ` + COLOR.yellow(...message)));
};

exports.success = (...message) => {
  console.log(COLOR.cyan(`[SUCCESS] > ` + COLOR.green(...message)));
};
