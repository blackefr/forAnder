import { rootDiv, storage } from "../Storage/Storage.js";

class Stopwatcher {
  // данные, которые необходимы для создания и отрисовки. дефолтное состояние на новый экземпляр секундомера.
  constructor({ id, millisec = 0, li = [], disabled = true, paused = true }) {
    this.id = id;
    this.data = new Date(millisec);
    this.millisec = millisec;
    this.li = li;
    this.disabled = disabled;
    this.paused = paused;
    this.structure();
  }
  converter(data) {
    return data < 10 ? ("0" + data).slice(0, 2) : data;
  }
  tick = null;
  // для обработки this.data
  dataHelper() {
    return `
	  ${this.converter(this.data.getUTCHours())}:${this.converter(
      this.data.getMinutes()
    )}:${this.converter(this.data.getSeconds())}:${
      ("0" + this.data.getMilliseconds()).slice(-3, -1) < 10
        ? ("00" + this.data.getMilliseconds()).slice(-3, -1)
        : String(this.data.getMilliseconds()).slice(-3, -1)
    }
	  `;
  }
  // сохранение результата
  recordedResult() {
    storage[`${this.id}`] = this;
    localStorage.setItem("dataStore", JSON.stringify(storage));
  }
  // описание основной структуры
  structure() {
    const divElement = document.createElement("div");
    const hElement = document.createElement("h1");
    const watcher = document.createElement("h2");
    const divElement2 = document.createElement("div");
    const mainList = document.createElement("div");
    const listUl = document.createElement("ul");
    divElement.classList.add(this.id, "stopwatchers");
    hElement.textContent = "Секундомер";
    watcher.textContent = this.dataHelper();
    mainList.className = "list";

    // кнопка для удаления секундомера и удаление всех данных о нем
    const deleterButton = document.createElement("button");
    deleterButton.textContent = "удалить секундомер";
    deleterButton.addEventListener("click", () => {
      clearInterval(this.tick);
      delete storage[this.id];
      localStorage.setItem("dataStore", JSON.stringify(storage));
      divElement.remove();
    });

    // кнопка старта
    const startButton = document.createElement("button");
    startButton.className = "startButton";
    startButton.textContent = "start";
    startButton.disabled = !this.disabled;
    startButton.addEventListener("click", () => {
      clearInterval(this.tick);
      this.tick = setInterval(() => {
        this.millisec += 10;
        this.data = new Date(this.millisec);
        watcher.textContent = this.dataHelper();
        storage[`${this.id}`] = this;
        localStorage.setItem("dataStore", JSON.stringify(storage));
      }, 10);
      this.disabled = !this.disabled;
      pauseButton.disabled = lapButton.disabled = false;
      resetButton.disabled = startButton.disabled = true;
      this.paused = !this.paused;
      this.recordedResult();
    });

    // кнопка паузы
    const pauseButton = document.createElement("button");
    pauseButton.className = "pauseButton";
    pauseButton.textContent = "pause";
    pauseButton.disabled = this.disabled;
    pauseButton.addEventListener("click", () => {
      clearInterval(this.tick);
      this.disabled = !this.disabled;
      pauseButton.disabled = lapButton.disabled = true;
      resetButton.disabled = startButton.disabled = false;
      this.paused = !this.paused;
      this.recordedResult();
    });

    // кнопка сброса
    const resetButton = document.createElement("button");
    resetButton.className = "resetButton";
    resetButton.textContent = "reset";
    resetButton.disabled = !this.disabled;
    resetButton.addEventListener("click", () => {
      listUl.innerHTML = "";
      this.li = [];
      this.millisec = 0;
      this.data = new Date(this.millisec);
      watcher.textContent = this.dataHelper();
      this.recordedResult();
    });

    // кнопка круга
    const lapButton = document.createElement("button");
    lapButton.className = "lapButton";
    lapButton.textContent = "lap";
    lapButton.disabled = this.disabled;
    lapButton.addEventListener("click", () => {
      const listLi = document.createElement("li");
      const liDel = document.createElement("button");
      liDel.textContent = "x";
      liDel.addEventListener("click", (e) => {
        e.target.remove();
        listLi.remove();
        this.li = this.li.filter((i) => i != listLi.textContent);
        this.recordedResult();
      });
      this.li.push(this.dataHelper());
      listLi.textContent = `${this.li[this.li.length - 1]}`;
      listUl.append(listLi);
      listLi.append(liDel);
    });

    // ставим элемент каждый на свое место
    rootDiv.append(divElement);
    divElement.append(deleterButton, hElement, watcher, divElement2, mainList);
    divElement2.append(startButton, pauseButton, resetButton, lapButton);
    mainList.append(listUl);

    //  при обновлении страницы выстраивается структура списка
    this.li.forEach((i) => {
      const listLi = document.createElement("li");
      listLi.textContent = `${i}`;
      const liDel = document.createElement("button");
      liDel.textContent = "x";
      liDel.addEventListener("click", (e) => {
        e.target.remove();
        listLi.remove();
        this.li = this.li.filter((i) => i != listLi.textContent);
        this.recordedResult();
      });
      listUl.append(listLi);
      listLi.append(liDel);
    });

    // для того, чтобы секундомер не прекращал работу после обновления страницы
    if (!this.paused) {
      this.tick = setInterval(() => {
        this.millisec += 10;
        this.data = new Date(this.millisec);
        watcher.textContent = this.dataHelper();
        storage[`${this.id}`] = this;
        localStorage.setItem("dataStore", JSON.stringify(storage));
      }, 10);
    }
  }
}

//  после обновления страницы отрисовываем создаем и отрисовываем все, что было сохранено
Object.values(storage).forEach((i) => new Stopwatcher(i));

//  для создания нового секундомера
const creator = document.createElement("div");
const creatorButton = document.createElement("button");
creatorButton.textContent = "создать секундомер";

// используем дефолтное состояние секундомера, но id передаем именно здесь, иначе js ругается
creatorButton.addEventListener("click", () => {
  const a = new Stopwatcher({
    id:
      ((Object.values(storage)[Object.values(storage).length - 1] || 0).id ||
        0) + 1,
  });
  a.recordedResult();
});
rootDiv.before(creator);
creator.append(creatorButton);
