function scaleUnits(input) {
  const kibi = 1024;
  const mebi = kibi * kibi;
  const gibi = mebi * kibi;
  const tebi = gibi * kibi;

  const kilo = 1000;
  const mega = kilo * kilo;
  const giga = mega * kilo;
  const tera = giga * kilo;

  if (input >= gibi * kilo) {
    return [input / tibi, 'Ti', 40];
  } else if (input >= mebi * kilo) {
    return [input / gibi, 'Gi', 30];
  } else if (input >= kibi * kilo) {
    return [input / mebi, 'Mi', 20];
  } else if (input >= kilo) {
    return [input / kibi, 'Ki', 10];
  } else {
    return [input, '', 0 ];
  }
}