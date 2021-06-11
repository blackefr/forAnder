const obj = {
  gogi: null,
  gogu: undefined,
  name: "John",
  arr: [1, 2, 3, 4, { a: 3, b: 4, arrt: [{ t: 3 }, 1, 23, 4] }, 5, 6],
  ot: {
    u: 2,
    y: 3,
  },
  logi: function () {
    return 42;
  },
  data: new Date(),
};

function superDeep(obj) {
  const clone = {};
  if (
    (Array.isArray(obj) == false && typeof obj !== "object") ||
    obj instanceof Date
  ) {
    return obj;
  }

  if (Array.isArray(obj) == true) {
    return obj.map((i) => superDeep(i));
  } else if (typeof obj == "object") {
    for (const key in obj) {
      clone[`${key}`] = superDeep(obj[`${key}`]);
    }
    return clone;
  }
}

const clone = superDeep(obj);
clone.name = "stray";
clone.ot.u = 5;
clone.logi = function logi() {
  return 2 + 3 + 4;
};
clone.gogi = "34252";
clone.data = new Date().getDay();

console.log(clone.data);
console.log(clone.arr == obj.arr);
console.log(clone.ot == obj.ot);
console.log(clone.ot.u == obj.ot.u);
console.log(clone.arr[4].arrt[0] == obj.arr[4].arrt[0]);
console.log(13);
console.log(typeof obj, typeof obj.arr);
console.log(obj.arr[4].arrt[0]);
console.log(clone.name == obj.name);
console.log(clone.logi());
console.log(obj.logi());
console.log(typeof (new Date()));



clone.arr[4].arrt[0].t = 5


console.log(clone, obj);


console.log(clone.arr[4].arrt[0].t , obj.arr[4].arrt[0].t );