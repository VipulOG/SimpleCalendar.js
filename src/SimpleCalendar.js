class SimpleCalendar {
  container;
  today;
  selectedDate;
  renderedMonth;
  events;

  constructor(selector, events) {
    this.today = new Date();
    this.renderedMonth = new Date();
    this.selectedDate = new Date();

    this.events = events || [];
    this.container = document.querySelector(selector);

    this.buildSelectedDateInfo();
    this.buildCalender();
  }

  addEvent(event) {
    this.events.push(event);
    this.container.dispatchEvent(
      new CustomEvent("eventAdded", { detail: { event } })
    );
  }

  buildSelectedDateInfo() {
    const self = this;

    const container = document.createElement("div");
    container.classList.add("selected-date-info");

    self.container.addEventListener("selectDate", (event) => {
      clearEventsList();
      buildEventsList();
    });

    self.container.addEventListener("eventAdded", (event) => {
      clearEventsList();
      buildEventsList();
    });

    function buildTodayButton() {
      const todayButton = document.createElement("p");
      todayButton.id = "today";
      todayButton.textContent = "Today";
      container.appendChild(todayButton);

      todayButton.addEventListener("click", () => {
        self.selectedDate = new Date();
        self.renderedMonth = new Date();
        self.container.dispatchEvent(
          new CustomEvent("switchMonth", {
            detail: { date: self.renderedMonth },
          })
        );
        self.container.dispatchEvent(
          new CustomEvent("selectDate", {
            detail: { date: self.selectedDate },
          })
        );
      });
    }

    function buildSelectedDate() {
      const selectedDateContainer = document.createElement("div");
      selectedDateContainer.classList.add("selected-date");
      container.appendChild(selectedDateContainer);

      const selectedMonth = document.createElement("div");
      const selectedDay = document.createElement("div");
      selectedMonth.id = "selected-month";
      selectedDay.id = "selected-day";

      self.container.addEventListener("selectDate", (event) => {
        selectedMonth.textContent = event.detail.date.toLocaleString(
          "default",
          { month: "long", year: "numeric" }
        );
        selectedDay.textContent = event.detail.date.getDate();
      });

      selectedMonth.textContent = self.selectedDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      selectedDay.textContent = self.selectedDate.getDate();

      selectedDateContainer.appendChild(selectedMonth);
      selectedDateContainer.appendChild(selectedDay);
      container.appendChild(selectedDateContainer);
    }

    function clearEventsList() {
      const eventsList = container.querySelector(".events-list");
      const eventsList2 = self.container.querySelector(".events-list.variant");
      if (eventsList) eventsList.remove();
      if (eventsList2) eventsList2.remove();
    }

    function buildEventsList() {
      const eventsList = document.createElement("div");
      eventsList.classList.add("events-list");
      container.appendChild(eventsList);

      self.events.forEach((event) => {
        if (
          event.date.getMonth() === self.selectedDate.getMonth() &&
          event.date.getFullYear() === self.selectedDate.getFullYear() &&
          event.date.getDate() === self.selectedDate.getDate()
        ) {
          const eventItem = document.createElement("div");
          eventItem.classList.add("event-item");

          const eventTitle = document.createElement("div");
          eventTitle.classList.add("event-title");
          eventTitle.textContent = event.title;
          eventItem.appendChild(eventTitle);

          const eventTime = document.createElement("div");
          eventTime.classList.add("event-time");
          eventTime.textContent = event.time;
          eventItem.appendChild(eventTime);
          eventsList.appendChild(eventItem);
        }
      });

      const eventListVariant = eventsList.cloneNode(true);
      eventListVariant.classList.add("variant");
      self.container.appendChild(eventListVariant);
    }

    buildTodayButton();
    buildSelectedDate();
    buildEventsList();
    self.container.appendChild(container);
  }

  buildCalender() {
    const self = this;

    const container = document.createElement("div");
    container.classList.add("calender-wrap");

    const calenderTable = document.createElement("table");
    calenderTable.id = "calender";

    self.container.addEventListener("switchMonth", (event) => {
      buildDayCells();
    });

    self.container.addEventListener("selectDate", (event) => {
      const selectedDate = calenderTable.querySelector(".day.selected");
      if (selectedDate) {
        selectedDate.classList.remove("selected");
      }
      const days = calenderTable.querySelectorAll(".day");
      const selectedDayIndex = event.detail.date.getDate() - 1;
      days[selectedDayIndex].classList.add("selected");
    });

    function buildMonthSwitch() {
      const monthSwitch = document.createElement("div");
      monthSwitch.classList.add("month-switch");
      container.appendChild(monthSwitch);

      const prevMonthButton = document.createElement("button");
      prevMonthButton.textContent = "<";
      prevMonthButton.type = "button";
      monthSwitch.appendChild(prevMonthButton);

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

      const label = document.createElement("p");
      label.textContent = self.renderedMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      monthSwitch.appendChild(label);

      self.container.addEventListener("switchMonth", (event) => {
        label.textContent = event.detail.date.toLocaleString("default", {
          month: "long",
          year: "numeric",
        });
      });

      const nextMonthButton = document.createElement("button");
      nextMonthButton.textContent = ">";
      nextMonthButton.type = "button";
      monthSwitch.appendChild(nextMonthButton);

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

    function buildBody() {
      const body = document.createElement("tbody");
      calenderTable.appendChild(body);

      for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
          const cell = document.createElement("td");
          row.appendChild(cell);
        }
        body.appendChild(row);
      }

      buildDayCells();
    }

    function buildDayCells() {
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

      const cells = calenderTable.querySelectorAll("td");

      // clear all cells
      cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.classList.remove("day");
        cell.classList.remove("today");
        cell.classList.remove("selected");
      });

      // fill in cells
      for (let i = 0; i < daysInMonth; i++) {
        const cell = cells[firstDayIndex + i];
        cell.classList.add("day");
        cell.textContent = i + 1;

        const isSelected =
          self.renderedMonth.getMonth() === self.selectedDate.getMonth() &&
          self.renderedMonth.getFullYear() ===
            self.selectedDate.getFullYear() &&
          self.selectedDate.getDate() === i + 1;

        const isToday =
          self.renderedMonth.getMonth() === self.today.getMonth() &&
          self.renderedMonth.getFullYear() === self.today.getFullYear() &&
          self.today.getDate() === i + 1;

        if (isSelected) cell.classList.add("selected");
        if (isToday) cell.classList.add("today");

        cell.addEventListener("click", () => {
          selectDay(i + 1);
        });
      }
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

    buildMonthSwitch();
    buildHeader();
    buildBody();

    container.appendChild(calenderTable);
    self.container.appendChild(container);

    // move events list variant to the end of the container
    const eventsList2 = self.container.querySelector(".events-list.variant");
    if (eventsList2) self.container.appendChild(eventsList2);
  }
}
