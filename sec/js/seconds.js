const masterElem = document.querySelector(".mainstore");
let mili = 0;
let timer;
function converter(data) {
  return String(data).slice(0, 2) < 10
    ? "0" + String(data).slice(0, 2)
    : String(data).slice(0, 2);
}
function start() {
  clearInterval(timer);
  timer = setInterval(() => {
    mili += 10;
    const time = new Date(mili);
    masterElem.textContent = `${converter(time.getUTCHours())}:${converter(time.getMinutes())}:${converter(time.getSeconds())}:${converter(time.getMilliseconds())}`;
  }, 10);
}
function pause() {
  clearInterval(timer);
}
function reset() {
  clearInterval(timer);
  mili = 0;
  masterElem.textContent = "00:00:00:00";
  document.querySelector(".ulRoot").innerHTML = "";
}
function toList() {
  document.querySelector(".ulRoot").innerHTML +=  `<li>${masterElem.textContent} </li>`;
}
document.querySelector(".st").addEventListener("click", () => start());
document.querySelector(".sp").addEventListener("click", () => pause());
document.querySelector(".res").addEventListener("click", () => reset());
document.querySelector(".cr").addEventListener("click", () => toList());
