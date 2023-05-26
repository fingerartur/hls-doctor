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

const getDuration = (playlist: string) => {
  const durationTexts = playlist.split('\n')
    .filter((line: string) => line.startsWith('#EXTINF'))

    const duration = durationTexts.map((text: string) => {
      // e.g. #EXTINF:5.500,
      return Number(text.replace('#EXTINF:', '').replace(/,.*/, ''));
    }).reduce((acc: number, curr: number) => acc + curr, 0);
  
    return secondsToHms(duration);
}

const getDiscontinuities = (playlist: string) => {
  const parts = playlist.split('#EXT-X-DISCONTINUITY\n');

  if (parts.length === 1) {
    return [];
  }

  return parts.map((part: string, index: number) => {
    return {
      index,
      duration: getDuration(part),
    }
  });
}

const printInfo = (playlist: string) => {
  const duration = getDuration(playlist);
  const discontinuities = getDiscontinuities(playlist);
  const isContinuous = discontinuities.length === 0;

  console.log('Duration sec', duration);
  console.log('Continuous', isContinuous);

  if (!isContinuous) {
    console.log('Discontinuities', discontinuities);
  }
}

const isMaster = (playlist: string) => {
  return playlist.includes('#EXT-X-STREAM-INF');
}

const main = async () => {
  const inputFile = process.argv[2];
  const playlist = fs.readFileSync(inputFile, { encoding: 'utf8', flag: 'r' });

  if (isMaster(playlist)) {
    console.info("This is a master playlist.");
    return;
  }

  console.info("This is a media playlist.");

  printInfo(playlist);
};

main()
