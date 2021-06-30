import { rootDiv, storage } from "../Storage/Storage.js";
class Stopwatcher {
  tick = null;
  constructor({ id, millisec = 0, li = [], disabled = true, paused = true }) {
    this.id = id;
    this.time = new Date(millisec);
    this.millisec = millisec;
    this.li = li;
    this.disabled = disabled;
    this.paused = paused;
    this.structure();
  }
  structure() {
    const divElement = document.createElement("div");
    const hElement = document.createElement("h1");
    const watcher = document.createElement("h2");
    const divElement2 = document.createElement("div");
    const mainList = document.createElement("div");
    const listUl = document.createElement("ul");
    const button = new Buttons(this);
    const starter = button.startButton(this, watcher);
    const pauser = button.pauseButton(this);
    const reseter = button.resetButton(this, watcher, listUl);
    const lapper = button.lapButton(this, watcher, listUl);
    divElement.classList.add(this.id, "stopwatchers");
    hElement.textContent = "Секундомер";
    watcher.textContent = this.convertedWatcher();
    mainList.className = "list";
    rootDiv.append(divElement);
    divElement.append(hElement, watcher, divElement2, mainList);
    this.li.forEach((time) => {
      listUl.prepend(this.toGenerLi(time));
    });
    divElement2.append(starter, pauser, reseter, lapper);
    mainList.append(listUl);
    starter.addEventListener("click", () => {
      pauser.disabled = lapper.disabled = false;
      reseter.disabled = starter.disabled = true;
    });
    pauser.addEventListener("click", () => {
      pauser.disabled = lapper.disabled = true;
      reseter.disabled = starter.disabled = false;
    });
  }
  toGenerLi(time) {
    const listLi = document.createElement("li");
    listLi.textContent = `${time}`;
    const liDel = document.createElement("button");
    liDel.textContent = "x";
    liDel.addEventListener("click", (event) => {
      event.target.remove();
      listLi.remove();
      this.li = this.li.filter((i) => i != listLi.textContent);
      this.toRec();
    });
    listLi.append(liDel);
    return listLi;
  }
  converter(time) {
    return time < 10 ? ("0" + time).slice(0, 2) : time;
  }
  convertedWatcher() {
    const curMili = this.time.getMilliseconds();
    return `
		 ${this.converter(this.time.getUTCHours())}:${this.converter(
      this.time.getMinutes()
    )}:${this.converter(this.time.getSeconds())}:${
      ("0" + curMili).slice(-3, -1) < 10
        ? ("00" + curMili).slice(-3, -1)
        : String(curMili).slice(-3, -1)
    }`;
  }
  toRec() {
    storage[`${this.id}`] = this;
    localStorage.setItem("dataStore", JSON.stringify(storage));
  }
}
class Buttons {
  constructor() {}
  timerRun(content, watcher) {
    return (content.tick = setInterval(() => {
      content.millisec += 10;
      content.time = new Date(content.millisec);
      watcher.textContent = content.convertedWatcher();
      content.toRec();
    }, 10));
  }
  startButton(content, watcher) {
    const tostart = document.createElement("button");
    tostart.className = "startButton";
    tostart.textContent = "start";
    tostart.disabled = !content.disabled;
    tostart.addEventListener("click", () => {
      clearInterval(content.tick);
      content.paused = !content.paused;
      content.disabled = !content.disabled;
      this.timerRun(content, watcher);
    });
    !content.paused ? this.timerRun(content, watcher) : null;
    return tostart;
  }
  pauseButton(content) {
    const pause = document.createElement("button");
    pause.className = "pauseButton";
    pause.textContent = "pause";
    pause.disabled = content.disabled;
    pause.addEventListener("click", () => {
      clearInterval(content.tick);
      content.paused = !content.paused;
      content.disabled = !content.disabled;
      content.toRec();
    });
    return pause;
  }
  resetButton(content, watcher, ullist) {
    const reset = document.createElement("button");
    reset.className = "resetButton";
    reset.textContent = "reset";
    reset.disabled = !content.disabled;
    reset.addEventListener("click", () => {
      ullist.innerHTML = "";
      content.li = [];
      content.millisec = 0;
      content.time = new Date(content.millisec);
      watcher.textContent = content.convertedWatcher();
      content.toRec();
    });
    return reset;
  }
  lapButton(content, watcher, ul) {
    const lap = document.createElement("button");
    lap.className = "lapButton";
    lap.textContent = "lap";
    lap.disabled = content.disabled;
    lap.addEventListener("click", () => {
      content.li.push(watcher.textContent);
      ul.prepend(content.toGenerLi(watcher.textContent));
      content.toRec();
    });
    return lap;
  }
}
Object.values(storage).forEach((stopwachers) => new Stopwatcher(stopwachers));
//  для создания нового секундомера
const creator = document.createElement("div");
const creatorButton = document.createElement("button");
creatorButton.textContent = "создать секундомер";
creatorButton.addEventListener("click", () => {
  const a = new Stopwatcher({
    id:
      ((Object.values(storage)[Object.values(storage).length - 1] || 0).id ||
        0) + 1,
  });
  a.toRec();
});
rootDiv.before(creator);
creator.append(creatorButton);
