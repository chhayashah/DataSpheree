const { parse } = require("csv-parse");
const { Readable } = require("stream");

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const readable = Readable.from(buffer);

    readable
      .pipe(
        parse({
          columns: true, // pehli row headers maano
          skip_empty_lines: true,
          trim: true,
        }),
      )
      .on("data", (row) => results.push(row))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

module.exports = { parseCSV };
