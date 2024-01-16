class SimpleCalendar {
  container;
  today;
  selectedDate;
  renderedMonth;

  constructor(selector) {
    this.today = new Date();
    this.renderedMonth = new Date();
    this.selectedDate = new Date();

    this.container = document.querySelector(selector);

    this.buildSelectedDateInfo();
    this.buildCalender();
  }

  buildSelectedDateInfo() {
    const self = this;
    const container = document.createElement("div");
    container.classList.add("selected-date-info");

    self.container.addEventListener("selectDate", (event) => {});

    function buildSelectedDate() {
      var selectedDateContainer = container.querySelector("selected-date");

      if (selectedDateContainer) {
        selectedDateContainer.innerHTML = "";
      } else {
        selectedDateContainer = document.createElement("div");
        selectedDateContainer.classList.add("selected-date");
        container.appendChild(selectedDateContainer);
      }

      const selectedMonth = document.createElement("div");
      const selectedDay = document.createElement("div");
      selectedDateContainer.appendChild(selectedMonth);
      selectedDateContainer.appendChild(selectedDay);
      container.appendChild(selectedDateContainer);
    }

    function buildEventsList() {
      const eventsList = document.createElement("div");
      container.appendChild(eventsList);
    }

    buildSelectedDate();
    buildEventsList();
    self.container.appendChild(container);
  }

  buildCalender() {
    const self = this;
    const container = document.createElement("div");
    const calenderTable = document.createElement("table");

    self.container.addEventListener("switchMonth", (event) => {
      destroyBody();
      buildBody();
    });

    self.container.addEventListener("selectDate", (event) => {
      const selectedDate = calenderTable.querySelector(".day.selected");
      if (selectedDate) {
        selectedDate.classList.remove("selected");
      }
      calenderTable.querySelectorAll(".day")[event.detail.date.getDate() - 1].classList.add("selected");
    });

    function buildMonthSelector() {
      const monthSelector = document.createElement("div");
      monthSelector.classList.add("month-selector");
      container.appendChild(monthSelector);

      const prevMonthButton = document.createElement("button");
      prevMonthButton.textContent = "<";
      monthSelector.appendChild(prevMonthButton);

      prevMonthButton.addEventListener("click", () => {
        self.renderedMonth = new Date(
          self.renderedMonth.getFullYear(),
          self.renderedMonth.getMonth() - 1,
          1
        );

        self.container.dispatchEvent(
          new CustomEvent("switchMonth", {
            detail: { date: self.renderedMonth },
          })
        );
      });

      const nextMonthButton = document.createElement("button");
      nextMonthButton.textContent = ">";
      monthSelector.appendChild(nextMonthButton);

      nextMonthButton.addEventListener("click", () => {
        self.renderedMonth = new Date(
          self.renderedMonth.getFullYear(),
          self.renderedMonth.getMonth() + 1,
          1
        );

        self.container.dispatchEvent(
          new CustomEvent("switchMonth", {
            detail: { date: self.renderedMonth },
          })
        );
      });
    }

    function buildHeader() {
      const header = document.createElement("thead");
      const headerRow = document.createElement("tr");
      header.appendChild(headerRow);
      calenderTable.appendChild(header);

      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      weekdays.forEach((weekday) => {
        const th = document.createElement("th");
        th.classList.add("weekday");
        th.textContent = weekday;
        headerRow.appendChild(th);
      });
    }

    function destroyBody() {
      const body = calenderTable.querySelector("tbody");
      if (body) {
        body.parentNode.removeChild(body);
      }
    }

    function buildBody() {
      const body = document.createElement("tbody");
      calenderTable.appendChild(body);

      const daysInMonth = new Date(
        self.renderedMonth.getFullYear(),
        self.renderedMonth.getMonth() + 1,
        0
      ).getDate();

      const firstDayIndex = new Date(
        self.renderedMonth.getFullYear(),
        self.renderedMonth.getMonth(),
        1
      ).getDay();

      let dayCounter = 1;
      for (let i = 0; i < 7; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("td");
          if (i === 0 && j < firstDayIndex) {
            // Empty cell for days before the 1st
          } else if (dayCounter <= daysInMonth) {
            cell.appendChild(buildDayCell(dayCounter));
            dayCounter++;
          }
          row.appendChild(cell);
        }
        body.appendChild(row);
      }
    }

    function buildDayCell(day) {
      const cell = document.createElement("div");

      const isSelected =
        self.renderedMonth.getMonth() === self.selectedDate.getMonth() &&
        self.renderedMonth.getFullYear() === self.selectedDate.getFullYear() &&
        self.selectedDate.getDate() === day;

      const isToday =
        self.renderedMonth.getMonth() === self.today.getMonth() &&
        self.renderedMonth.getFullYear() === self.today.getFullYear() &&
        self.today.getDate() === day;

      cell.textContent = day;
      cell.classList.add("day");

      if (isSelected) cell.classList.add("selected");
      if (isToday) cell.classList.add("today");

      cell.addEventListener("click", () => selectDay(day));

      return cell;
    }

    function selectDay(day) {
      self.selectedDate = new Date(
        self.renderedMonth.getFullYear(),
        self.renderedMonth.getMonth(),
        day
      );

      self.container.dispatchEvent(
        new CustomEvent("selectDate", {
          detail: { date: self.selectedDate },
        })
      );
    }

    buildMonthSelector();
    buildHeader();
    buildBody();

    container.appendChild(calenderTable);
    self.container.appendChild(container);
  }
}

const myCalendar = new SimpleCalendar("#calendarContainer");
