
// пример для реализации алгоритма
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
// конец примера 
//--------------------------------------------------------------------------


// функция клолнирования
function superDeep(obj) {
  const clone = {};
  //здесь важно понимать, с чем мы все таки работаем и писать условия исходя из получаемых данных, уверен, будут вопросы по new Date() )))
  if (
    (Array.isArray(obj) == false && typeof obj !== "object") ||
    typeof obj === "function" ||
    obj instanceof Date || obj === null
  ) {
    return obj;
  }

  if (Array.isArray(obj) == true) {
    return obj.map((i) => superDeep(i));
  } else if (typeof obj == "object") {
    for (const key in obj) {
      clone[`${key}`] = superDeep(obj[`${key}`]);
    }
  }
  return clone;
}
// функция клолнирования --------------------------------------------------------------------
//экземпляр
const clone = superDeep(obj);
//экземпляр -------------------------------------------



// функция проверки копирования 
function toEqw(natural, clone, storage = []) {
  const arrayu = storage;
  if (natural !== clone) {
    // работа исключительно с данными ссылочного типа. непримитивы сравниваются по ссылочному значению, поэтому,
    // если они повторяют друг друга, то они равны, если же они скопированы, то они не будут равны и запушатся в массив с соотв записью)
    if (Array.isArray(clone) === true) {
      arrayu.push(`array copy ${JSON.stringify(clone)}`);
    } else if (typeof clone === "object") {
      if (clone === null) {
        arrayu.push(`obj copy 123`);
      } else {
        arrayu.push(`obj copy ${JSON.stringify(clone)}`);
      }
    }
    // примитивы сравниваются по значению, а это означает, что они в любом случае будут равны.
  } else if (natural === clone) {
    arrayu.push(`copied primitive ${clone}`);
  }

  if (Array.isArray(natural) === true && Array.isArray(clone) === true) {
    return natural.map((item, index) => {
      toEqw(item, clone[index], arrayu);
    });
  } else if (typeof natural == "object" && typeof clone == "object") {
    for (const key in natural) {
      toEqw(natural[`${key}`], clone[`${key}`], arrayu);
    }
  }

  return arrayu;
}
// функция проверки копирования --------------------------------------------------

console.log(toEqw(obj, clone));
console.log(clone, obj)
