const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
   date = new Date();
   id = (Date.now() + '').slice(-10);

   constructor(coords, distance, duration) {
      this.coords = coords; // [lat, lng]
      this.distance = distance; //in km
      this.duration = duration; //in min
   }
}

class Running extends Workout {
   constructor(coords, distance, duration, cadence) {
      super(coords, distance, duration);
      this.cadence = cadence;
      this.calcPace();
   }

   calcPace() {
      this.pace = this.duration / this.distance;
   }
}

class Cycling extends Workout {
   constructor(coords, distance, duration, elevationGain) {
      super(coords, distance, duration);
      this.elevationGain = elevationGain;
      this.calcSpeed();
   }

   calcSpeed() {
      this.speed = this.distance / (this.duration / 60);
   }
}

//////////////////////////////

class App {
   #map;
   #mapEvent;
   constructor() {
      this._getPosition();
      form.addEventListener('submit', this._setWorkoutonMap.bind(this));
      inputType.addEventListener('change', this._toggleElevationField);
   }

   _getPosition() {
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
            alert('Could not get your position:(');
         });
      }
   }

   _loadMap(position) {
      const { latitude, longitude } = position.coords;
      const coords = [latitude, longitude];

      this.#map = L.map('map').setView(coords, 13);
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      this.#map.on('click', this._showForm.bind(this));
   }

   _showForm(mapE) {
      this.#mapEvent = mapE;
      form.classList.remove('hidden');
      inputDistance.focus();
   }
   _toggleElevationField() {
      inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
   }

   _setWorkoutonMap(e) {
      e.preventDefault();
      inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';
      const { lat, lng } = this.#mapEvent.latlng;
      L.marker([lat, lng])
         .addTo(this.#map)
         .bindPopup(
            L.popup({
               maxWidth: 250,
               minWidth: 100,
               autoClose: false,
               closeOnClick: false,
               closeOnEscapeKey: false,
               className: 'running-popup',
            })
         )
         .setPopupContent('Workout')
         .openPopup();
   }
}

const app = new App();
