class SimpleCalendar {
  container;
  today;
  selectedDate;

  constructor(selector) {
    this.today = new Date();
    this.renderedMonth = new Date();
    this.selectedDate = new Date();
    this.container = document.querySelector(selector);
    this.buildCalender();
  }

  buildCalender() {
    const self = this;
    const calenderWrapper = document.createElement("div");
    const calenderTable = document.createElement("table");

    function buildMonthSelector() {
      const monthSelector = document.createElement("div");
      monthSelector.classList.add("month-selector");
      calenderWrapper.appendChild(monthSelector);

      const prevMonthButton = document.createElement("button");
      prevMonthButton.textContent = "<";
      prevMonthButton.addEventListener("click", () => {
        self.renderedMonth = new Date(
          self.renderedMonth.getFullYear(),
          self.renderedMonth.getMonth() - 1,
          1
        );
        updateCurrentMonthLabel();
        buildBody();
      });
      monthSelector.appendChild(prevMonthButton);

      const monthLabel = document.createElement("span");
      monthLabel.textContent = new Date(
        self.renderedMonth.getFullYear(),
        self.renderedMonth.getMonth(),
        1
      ).toLocaleDateString("default", { month: "long", year: "numeric" });
      monthSelector.appendChild(monthLabel);

      const nextMonthButton = document.createElement("button");
      nextMonthButton.textContent = ">";
      nextMonthButton.addEventListener("click", () => {
        self.renderedMonth = new Date(
          self.renderedMonth.getFullYear(),
          self.renderedMonth.getMonth() + 1,
          1
        );
        updateCurrentMonthLabel();
        buildBody();
      });
      monthSelector.appendChild(nextMonthButton);

      function updateCurrentMonthLabel() {
        monthLabel.textContent = new Date(
          self.renderedMonth.getFullYear(),
          self.renderedMonth.getMonth(),
          1
        ).toLocaleDateString("default", { month: "long", year: "numeric" });
      }
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

    function buildBody() {
      var body = calenderTable.querySelector("tbody");
      if (body) {
        body.innerHTML = "";
      } else {
        body = document.createElement("tbody");
        calenderTable.appendChild(body);
      }

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
        self.today.getFullYear(),
        self.today.getMonth(),
        day
      );
      buildBody();
    }

    buildMonthSelector();
    buildHeader();
    buildBody();

    calenderWrapper.appendChild(calenderTable);
    self.container.appendChild(calenderWrapper);
  }
}

const myCalendar = new SimpleCalendar("#calendarContainer");
