function scaleUnits(input) {
  const kilo = 1024;
  const mega = kilo * kilo;
  const giga = mega * kilo;
  const tera = giga * kilo;

  if (input >= tera) {
    return [input / tera, 'T', 40];
  } else if (input >= giga) {
    return [input / giga, 'G', 30];
  } else if (input >= mega) {
    return [input / mega, 'M', 20];
  } else if (input >= kilo) {
    return [input / kilo, 'k', 10];
  } else {
    return [input, '', 0 ];
  }
}