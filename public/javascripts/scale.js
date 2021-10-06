function scaleUnits(input) {
  const kilo = 1024;
  const mega = kilo * kilo;
  const giga = mega * kilo;
  const tera = giga * kilo;

  if (input >= tera) {
    return [input / tera, 'T'];
  } else if (input >= giga) {
    return [input / giga, 'G'];
  } else if (input >= mega) {
    return [input / mega, 'M'];
  } else if (input >= kilo) {
    return [input / kilo, 'k'];
  } else {
    return [input, '' ];
  }
}