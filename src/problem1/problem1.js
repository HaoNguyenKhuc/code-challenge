var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  return (n * (n + 1)) / 2;
};

var sum_to_n_c = function (n) {
  return Array.from({ length: n }, (_, i) => i + 1).reduce(
    (sum, num) => sum + num,
    0
  );
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
