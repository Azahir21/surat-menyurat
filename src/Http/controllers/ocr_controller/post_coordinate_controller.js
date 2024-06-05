const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const { PythonShell } = require("python-shell");

function getCoordinate(filepath, searchText, pages) {
  return new Promise((resolve, reject) => {
    try {
      let x = [];
      let y = [];
      let page_number = [];
      const pyshell = new PythonShell("script.py", {
        mode: "text",
        pythonPath: `python`,
        scriptPath: "python/",
        args: [filepath, searchText, pages],
      });

      pyshell.on("message", function (message) {
        console.log(message);
        const values = message.split(" ");
        page_number.push(parseInt(values[0]));
        x.push(parseInt(values[1]));
        y.push(parseInt(values[2]));
      });

      pyshell.end(function (err, code, signal) {
        if (err) {
          console.error("Error during PDF parsing:", err);
          reject({ error: "Terjadi kesalahan selama parsing PDF." });
        } else {
          console.log("The exit code was: " + code);
          console.log("The exit signal was: " + signal);
          console.log("finished");
          resolve({ page_number, x, y });
        }
      });
    } catch (error) {
      console.error("Error during PDF parsing:", error);
      reject({ error: "Terjadi kesalahan selama parsing PDF." });
    }
  });
}

async function changeTextInPdfV2(inputPath, outputPath, searchText, newText) {
  try {
    const pdfBytes = fs.readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const coordinate = await getCoordinate(inputPath, searchText, pages.length);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontSize = 12;
    const backgroundColor = rgb(1, 1, 1);
    const textWidth = newText.length * fontSize * 0.6;
    const textHeight = fontSize;

    for (let i = 0; i < pages.length; i++) {
      const page = coordinate.page_number[i];
      const x = coordinate.x[i];
      const y = coordinate.y[i];

      if (x && y) {
        pages[page].drawRectangle({
          x: x,
          y: y,
          width: textWidth,
          height: textHeight,
          color: backgroundColor,
        });

        pages[i].drawText(newText, {
          x: x,
          y: y,
          size: fontSize,
          color: rgb(0, 0, 0),
          font: font,
        });
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(outputPath, modifiedPdfBytes);
    return {
      sukses: "Perubahan teks pada PDF berhasil disimpan ke " + outputPath,
    };
  } catch (error) {
    console.error("Error during PDF parsing:", error);
    return { error: "Terjadi kesalahan selama parsing PDF." };
  }
}

module.exports = {
  changeTextInPdfV2,
};
