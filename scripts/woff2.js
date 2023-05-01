/* eslint-disable sort/object-properties */
import fs from "node:fs";
import path from "node:path";

import subsetFont from "subset-font";

async function main() {
  const options = {
    targetFormat: "woff2",
  };

  const filePath = path.resolve(
    __dirname,
    "../public/assets/fonts/MODI_Senobi-Gothic_2017_0702/Senobi-Gothic-Bold.ttf",
  );

  const buffer = fs.readFileSync(filePath);

  const subsetFontBuffer = await subsetFont(buffer, "1234567890.", options);

  // サブセットフォントの書き出し
  fs.writeFileSync("subset-font.woff2", subsetFontBuffer);
}

main();
