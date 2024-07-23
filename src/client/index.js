import { validateDate } from "./js/validateDate";
import axios from "axios";
import "./styles/index.scss";

const callApi = async (data) => {
    return await axios
        .post("/api", data)
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            // handle error when exception
            console.log(error);
        })
        .finally(function () {
            // always executed
        });
};

// ====================================Local Storage implement=================================
// Load/Get data from localStore
const loadDataStorage = async () => {
    const savedPlanList = document.querySelector(".js-savedPlan");
    const dataStorage = localStorage.getItem("trip")
        ? JSON.parse(localStorage.getItem("trip"))
        : [];
    if (!dataStorage.length) {
        savedPlanList.classList.add("d-none");
    } else {
        await updateSavedBookingList(dataStorage);
        // add event for button remove
        const jsTripRemove = document.querySelectorAll(".js-tripRemove");
        jsTripRemove.forEach((elm) => {
            elm.addEventListener("click", async (event) => {
                if (confirm("Do you want remove trip!")) {
                    console.log("jsOnclick", event.target.dataset.id);
                    removeTripBooking(event.target.dataset.id);
                    window.location.reload();
                }
            });
        });
    }
};

// Update and render saved list boking
const updateSavedBookingList = async (dataStorage) => {
    const jsTrip = document.querySelector(".js-trip");
    jsTrip.innerHTML = "";
    dataStorage.forEach(async (item, index) => {
        const templateWeather = await createWeather(
            item.data.dataRes.weatherbit.data
        );
        const tripCard = document.createElement("li");
        tripCard.className = "mb-3";
        tripCard.dataset.id = item.id;
        const templateTrip = `
    <div class="card" style="width: 18rem;">
      <img src="${
          item.data.dataRes.pixabay.hits[0].webformatURL
      }" class="img-fluid img-thumbnail" alt="...">
      <div class="card-body">
        <p class="card-title fs-4 mb-3 mt-3">Trip to ${
            item.data.dataReq.nameLocal
        }</p>
        <p class="card-text fs-4 mb-3 mt-3">Due date: ${validateDate(
            item.data.dataReq.dateStart,
            item.data.dataReq.dateEnd
        )} day</p>
        <div class="d-flex justify-content-between">
          <p class="card-text card-title fs-6 mb-3 mt-3"><span
              class="text-nowrap bg-body-secondary border text-primary fw-bold fs-4">DEPARTURE
              :</span>
            <span>${item.data.dataReq.dateStart}</span>
          </p>
          <p class="card-text card-title fs-6 mb-3 mt-3"><span
              class="text-nowrap bg-body-secondary border text-primary fw-bold fs-4">RETURN
              :</span>
            <span>${item.data.dataReq.dateEnd}</span>
          </p>
        </div>
        <p class="card-text">${item.data.dataReq.tripNote}</p>
      </div>
      <ul class="list-group list-group-flush">
        ${templateWeather}
      </ul>
      <div class="card-body">
        <button type="button" class="btn btn-outline-dark js-tripRemove" data-id="${
            item.id
        }">Remove trip</button>
      </div>
    </div>`;
        tripCard.insertAdjacentHTML("afterbegin", templateTrip);
        jsTrip.append(tripCard);
    });
};

// Remove plan Booking
const removeTripBooking = (id) => {
    const dataStorage = localStorage.getItem("trip")
        ? JSON.parse(localStorage.getItem("trip"))
        : [];
    const result = dataStorage.filter((item) => item.id !== id);
    localStorage.setItem("trip", JSON.stringify(result));
};

// Save plan
const saveTripBooking = (data) => {
    const dataStorage = localStorage.getItem("trip")
        ? JSON.parse(localStorage.getItem("trip"))
        : [];
    if (dataStorage.length) {
        const id = Math.max(...dataStorage.map((item) => item.id));
        dataStorage.push({
            id: `${id + 1}`,
            data: data,
        });
    } else {
        dataStorage.push({
            id: "1",
            data: data,
        });
    }
    localStorage.setItem("trip", JSON.stringify(dataStorage));
};

// ====================================Render plan implement=================================
// Create New Plan
const createPlanBooking = async (data) => {
    const templateWeather = await createWeather(data.dataRes.weatherbit.data);
    const jsTrip = document.querySelector(".js-planNew");
    const tripCard = document.createElement("li");
    tripCard.className = "mb-3";
    const templateTrip = `
    <div class="card" style="width: 18rem;">
      <img src="${data.dataRes.pixabay.hits[0].webformatURL}" class="img-fluid img-thumbnail" alt="...">
      <div class="card-body">
        <p class="card-title fs-4 mb-3 mt-3">Trip to ${data.dataReq.nameLocal}</p>
        <p class="card-text fs-4 mb-3 mt-3">Dua date: ${data.dataReq.dateCount} day</p>
        <div class="d-flex justify-content-between">
          <p class="card-text card-title fs-6 mb-3 mt-3"><span
              class="text-nowrap bg-body-secondary border text-primary fw-bold fs-4">DEPARTURE
              :</span>
            <span>${data.dataReq.dateStart}</span>
          </p>
          <p class="card-text card-title fs-6 mb-3 mt-3"><span
              class="text-nowrap bg-body-secondary border text-primary fw-bold fs-4">RETURN
              :</span>
            <span>${data.dataReq.dateEnd}</span>
          </p>
        </div>
        <p class="card-text">${data.dataReq.tripNote}</p>
      </div>
      <ul class="list-group list-group-flush">
        ${templateWeather}
      </ul>
      <div class="card-body">
        <button type="button" class="btn btn-outline-primary js-saveTrip">Save trip</button>
        <button type="button" class="btn btn-outline-dark js-remove">Remove trip</button>
      </div>
    </div>`;
    tripCard.insertAdjacentHTML("afterbegin", templateTrip);
    jsTrip.appendChild(tripCard);
};

// Create Weather list
const createWeather = async (data) => {
    let template = ``;
    data.forEach(async (item) => {
        template += `<li class="list-group-item d-flex">
      <div>
        <p>${item.datetime}</p> : 
        <div class="form-check-inline">
        <span>${item.low_temp}°C</span> ~ <span>${item.high_temp}°C</span>
        </div>
        
      </div>
    </li>`;
    });
    return template;
};

// ====================================Render error=================================
const showError = () => {
    const jsError = document.querySelector(".js-error");
    jsError.classList.remove("d-none");
};
const hideError = () => {
    const jsError = document.querySelector(".js-error");
    jsError.classList.add("d-none");
};

// ====================================Main JS=================================
document.addEventListener("DOMContentLoaded", async () => {
    // Load data from LocalStorage
    loadDataStorage();

    const jsInput = document.querySelector(".js-input");
    jsInput.addEventListener("focusout", (event) => {
        const nameLocalTrip = jsInput.value;
        if (!nameLocalTrip) {
            showError(true);
            return;
        }
        hideError();
    });
    const jsSubmit = document.querySelector(".js-submit");
    const jsTripNote = document.querySelector(".js-planNote");
    const jsDateStart = document.querySelector(".js-dateStart");
    const jsDateEnd = document.querySelector(".js-dateEnd");
    jsSubmit.addEventListener("click", async (event) => {
        event.preventDefault();

        const nameLocalTrip = jsInput.value;
        const tripNote = jsTripNote.value;
        const dateStart = jsDateStart.value;
        const dateEnd = jsDateEnd.value;
        const dateCount = validateDate(dateStart, dateEnd);
        if (dateCount <= 0) {
            alert("Error : Day end must be greater than day end ");
            return;
        }
        if (!nameLocalTrip) {
            showError(true);
            return;
        }
        hideError();
        const config = {
            nameLocal: nameLocalTrip,
            tripNote: tripNote,
            dateStart: dateStart,
            dateEnd: dateEnd,
            dateCount: dateCount,
        };

        // Call API to fetch data
        const data = await callApi(config);
        console.log("fetch data: ", data);

        // Create new plan
        await createPlanBooking(data);

        // Add function to button
        const jsSaveTrip = document.querySelector(".js-saveTrip");
        jsSaveTrip.addEventListener("click", (event) => {
            console.log("jsOnclick", event.target.dataset.id);
            saveTripBooking(data);
            window.location.reload();
        });
        const jsRemove = document.querySelector(".js-remove");
        jsRemove.addEventListener("click", () => {
            if (confirm("Do you want remove trip!")) {
                const jsTrip = document.querySelector(".js-planNew");
                jsTrip.innerHTML = "";
            }
        });

        event.target.innerHTML = "Start plaing";
        event.target.disable = false;
    });
});
