upperCapitalizeFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

randomNumbers = () => {
  return (Math.floor(Math.random() * 90000) + 10000).toString().substring(1);
};

module.exports = {
  upperCapitalizeFirst,
  randomNumbers,
};
