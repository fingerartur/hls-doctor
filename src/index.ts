#!/usr/bin/env node

const fs = require('fs');

const secondsToHms = (d: number) => {
  d = Number(d);
  const h = Math.floor(d / 3600);
  const m = Math.floor(d % 3600 / 60);
  const s = Math.floor(d % 3600 % 60);

  const hDisplay = h > 0 ? h + ':' : '';
  const mDisplay = m > 0 ? m + ':' : '0:';
  const sDisplay = s > 0 ? s : '0';
  return hDisplay + mDisplay + sDisplay;
};

const main = async () => {
  const inputFile = process.argv[2];
  const data = fs.readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });

  const durationTexts = data.split('\n')
    .filter((line: string) => line.startsWith('#EXTINF'))

  const duration = durationTexts.map((text: string) => {
    // e.g. #EXTINF:5.500,
    return Number(text.replace('#EXTINF:', '').replace(',', ''));
  }).reduce((acc: number, curr: number) => acc + curr, 0);

  console.log('duration sec', secondsToHms(duration));
};

main()
