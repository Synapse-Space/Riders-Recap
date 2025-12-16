/**
 * RideWrapped 2025
 * Interactive Annual Recap for Riders
 */

// ===================================
// State Management
// ===================================
const state = {
    currentScreen: 'intro',
    currentQuestion: 1,
    totalQuestions: 11,
    currentSlide: 0,
    totalSlides: 12,
    userData: {
        name: '',
        totalDistance: 0,
        locations: [], // Array of location names
        locationCoords: [], // Array of {lat, lng} after geocoding
        daysRidden: 0,
        favoriteTime: '',
        favoriteTerrain: '',
        longestRide: 0,
        favoriteDay: '',
        preferredWeather: '',
        rideLength: '',
        memorableMoment: ''
    },
    journeyMap: null,
    bikeMarker: null,
    animationRunning: false
};

// ===================================
// Personality Determination
// ===================================
const personalities = {
    explorer: {
        icon: '🧭',
        title: 'The Explorer',
        desc: 'You ride for the journey, not the shortcut. New roads call to you.'
    },
    speedster: {
        icon: '⚡',
        title: 'The Speedster',
        desc: 'Slow is a four-letter word. The thrill of speed is your drug.'
    },
    zenRider: {
        icon: '🌿',
        title: 'The Zen Rider',
        desc: 'The destination is the ride itself. Peace on two wheels.'
    },
    commuterKing: {
        icon: '👑',
        title: 'The Commuter King',
        desc: 'You turned routine into ritual. Every day is a ride day.'
    },
    weekendWarrior: {
        icon: '🦅',
        title: 'The Weekend Warrior',
        desc: 'You save the best for Saturday. Freedom awaits.'
    },
    nightOwl: {
        icon: '🦉',
        title: 'The Night Owl',
        desc: 'When the city sleeps, you ride. The night is yours.'
    },
    enduranceBeast: {
        icon: '🐺',
        title: 'The Endurance Beast',
        desc: 'The longer the ride, the better. Distance is your discipline.'
    },
    socialRider: {
        icon: '🤝',
        title: 'The Social Rider',
        desc: 'Riding is better with company. Every ride is a story shared.'
    }
};

const terrainData = {
    mountains: { emoji: '🏔️', name: 'Mountains', tagline: 'Curves. Climbs. Cold air.' },
    highways: { emoji: '🛣️', name: 'Highways', tagline: 'Endless lanes. Wind therapy.' },
    city: { emoji: '🌃', name: 'City Streets', tagline: 'Traffic? Challenge accepted.' },
    coastal: { emoji: '🌊', name: 'Coastal Roads', tagline: 'Salt air. Ocean views.' },
    countryside: { emoji: '🌾', name: 'Countryside', tagline: 'Open fields. No rush.' }
};

const timeData = {
    dawn: { emoji: '🌅', name: 'Dawn Rider', tagline: 'First light. Empty roads. Your kind of peace.' },
    morning: { emoji: '☀️', name: 'Morning Rider', tagline: 'Fresh air. Clear mind. The day hasn\'t touched you yet.' },
    afternoon: { emoji: '🌤️', name: 'Afternoon Rider', tagline: 'When others rest, you ride.' },
    evening: { emoji: '🌆', name: 'Evening Rider', tagline: 'Golden skies. Quiet roads. Your therapy session.' },
    night: { emoji: '🌙', name: 'Night Rider', tagline: 'City lights. Cool air. The world is finally quiet.' }
};

const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
};

const weatherData = {
    sunny: { emoji: '☀️', name: 'Sunny & Clear' },
    cloudy: { emoji: '⛅', name: 'Cloudy' },
    rainy: { emoji: '🌧️', name: 'Rainy' },
    any: { emoji: '🌈', name: 'Any Weather' }
};

const rideLengthData = {
    short: 'Quick Spins',
    medium: 'Day Trips',
    long: 'Long Hauls'
};

// ===================================
// DOM Elements
// ===================================
const elements = {
    app: document.getElementById('app'),
    introScreen: document.getElementById('intro-screen'),
    questionnaireScreen: document.getElementById('questionnaire-screen'),
    slidesScreen: document.getElementById('slides-screen'),
    startBtn: document.getElementById('start-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    generateBtn: document.getElementById('generate-btn'),
    progressFill: document.getElementById('progress-fill'),
    slidesContainer: document.getElementById('slides-container'),
    slideDots: document.getElementById('slide-dots'),
    slidePrev: document.getElementById('slide-prev'),
    slideNext: document.getElementById('slide-next')
};

// ===================================
// Screen Transitions
// ===================================
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
    }
    
    // Show/hide Instagram share button based on screen
    if (screenName === 'slides') {
        showInstagramButton();
    } else {
        hideInstagramButton();
    }
}

// ===================================
// Questionnaire Logic
// ===================================
function updateProgress() {
    const progress = (state.currentQuestion / state.totalQuestions) * 100;
    elements.progressFill.style.width = `${progress}%`;
}

function showQuestion(questionNum) {
    const slides = document.querySelectorAll('.question-slide');
    
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        slide.classList.remove('active', 'exit');
        
        if (slideNum === questionNum) {
            slide.classList.add('active');
        } else if (slideNum < questionNum) {
            slide.classList.add('exit');
        }
    });
    
    // Update navigation buttons
    elements.prevBtn.disabled = questionNum === 1;
    
    if (questionNum === state.totalQuestions) {
        elements.nextBtn.classList.add('hidden');
        elements.generateBtn.classList.remove('hidden');
    } else {
        elements.nextBtn.classList.remove('hidden');
        elements.generateBtn.classList.add('hidden');
    }
    
    updateProgress();
    
    // Focus input if present
    setTimeout(() => {
        const activeSlide = document.querySelector('.question-slide.active');
        const input = activeSlide?.querySelector('input, textarea');
        if (input) input.focus();
    }, 400);
}

function validateCurrentQuestion() {
    const question = state.currentQuestion;
    const data = state.userData;
    
    switch (question) {
        case 1: return data.name.trim().length > 0;
        case 2: return data.totalDistance > 0;
        case 3: return data.locations.filter(loc => loc.trim().length > 0).length >= 2;
        case 4: return data.daysRidden > 0;
        case 5: return data.favoriteTime !== '';
        case 6: return data.favoriteTerrain !== '';
        case 7: return data.longestRide > 0;
        case 8: return data.favoriteDay !== '';
        case 9: return data.preferredWeather !== '';
        case 10: return data.rideLength !== '';
        case 11: return true; // Memory is optional
        default: return true;
    }
}

function nextQuestion() {
    if (!validateCurrentQuestion()) {
        // Shake animation for invalid
        const activeSlide = document.querySelector('.question-slide.active');
        activeSlide.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            activeSlide.style.animation = '';
        }, 500);
        return;
    }
    
    if (state.currentQuestion < state.totalQuestions) {
        state.currentQuestion++;
        showQuestion(state.currentQuestion);
    }
}

function prevQuestion() {
    if (state.currentQuestion > 1) {
        state.currentQuestion--;
        showQuestion(state.currentQuestion);
    }
}

// ===================================
// Input Handlers
// ===================================
function setupInputHandlers() {
    // Text inputs
    document.getElementById('user-name').addEventListener('input', (e) => {
        state.userData.name = e.target.value;
    });
    
    document.getElementById('total-distance').addEventListener('input', (e) => {
        state.userData.totalDistance = parseInt(e.target.value) || 0;
    });
    
    // Location inputs - setup initial handlers
    setupLocationInputHandlers();
    
    // Add location button
    document.getElementById('add-location-btn').addEventListener('click', addNewLocationInput);
    
    document.getElementById('days-ridden').addEventListener('input', (e) => {
        state.userData.daysRidden = parseInt(e.target.value) || 0;
    });
    
    document.getElementById('longest-ride').addEventListener('input', (e) => {
        state.userData.longestRide = parseInt(e.target.value) || 0;
    });
    
    document.getElementById('memorable-moment').addEventListener('input', (e) => {
        state.userData.memorableMoment = e.target.value;
    });
    
    // Option cards
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            const value = this.dataset.value;
            const parent = this.closest('.question-slide');
            const step = parseInt(parent.dataset.step);
            
            // Remove selected from siblings
            parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Store value
            switch (step) {
                case 5: state.userData.favoriteTime = value; break;
                case 6: state.userData.favoriteTerrain = value; break;
                case 8: state.userData.favoriteDay = value; break;
                case 9: state.userData.preferredWeather = value; break;
                case 10: state.userData.rideLength = value; break;
            }
            
            // Auto-advance after selection (except last step)
            if (step < state.totalQuestions) {
                setTimeout(() => nextQuestion(), 300);
            }
        });
    });
    
    // Enter key to advance
    document.querySelectorAll('.text-input, .number-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                nextQuestion();
            }
        });
    });
}

// ===================================
// Location Input Management
// ===================================
function setupLocationInputHandlers() {
    document.querySelectorAll('.location-input').forEach((input, index) => {
        input.addEventListener('input', () => {
            collectLocations();
        });
    });
}

function collectLocations() {
    const inputs = document.querySelectorAll('.location-input');
    state.userData.locations = Array.from(inputs).map(input => input.value.trim());
}

function addNewLocationInput() {
    const container = document.getElementById('locations-container');
    const currentCount = container.querySelectorAll('.location-input-row').length;
    
    if (currentCount >= 10) return; // Max 10 locations
    
    const newRow = document.createElement('div');
    newRow.className = 'location-input-row';
    newRow.dataset.index = currentCount;
    newRow.innerHTML = `
        <span class="location-number">${currentCount + 1}</span>
        <input
            type="text"
            class="text-input location-input"
            placeholder="e.g. Next stop"
            autocomplete="off"
        />
    `;
    
    container.appendChild(newRow);
    
    // Add input handler to new input
    const newInput = newRow.querySelector('.location-input');
    newInput.addEventListener('input', () => {
        collectLocations();
    });
    newInput.focus();
}

// ===================================
// Geocoding with Nominatim
// ===================================
async function geocodeLocation(locationName) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`,
            { headers: { 'User-Agent': 'RideWrapped2025' } }
        );
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                name: locationName
            };
        }
    } catch (error) {
        console.log('Geocoding error:', error);
    }
    return null;
}

async function geocodeAllLocations() {
    const locations = state.userData.locations.filter(loc => loc.trim().length > 0);
    const coords = [];
    
    for (const loc of locations) {
        const result = await geocodeLocation(loc);
        if (result) {
            coords.push(result);
        }
    }
    
    state.userData.locationCoords = coords;
    return coords;
}

// ===================================
// Map Initialization and Animation
// ===================================
function initJourneyMap() {
    const mapContainer = document.getElementById('journey-map');
    if (!mapContainer || state.journeyMap) return;
    
    const coords = state.userData.locationCoords;
    if (coords.length < 2) return;
    
    // Calculate center and bounds
    const lats = coords.map(c => c.lat);
    const lngs = coords.map(c => c.lng);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    
    // Create map
    state.journeyMap = L.map('journey-map', {
        center: [centerLat, centerLng],
        zoom: 6,
        zoomControl: false,
        attributionControl: false
    });
    
    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(state.journeyMap);
    
    // Fit bounds to show all points
    const bounds = L.latLngBounds(coords.map(c => [c.lat, c.lng]));
    state.journeyMap.fitBounds(bounds, { padding: [40, 40] });
    
    // Add markers for each location
    coords.forEach((coord, index) => {
        const isStart = index === 0;
        const isEnd = index === coords.length - 1;
        
        const icon = L.divIcon({
            className: `location-marker ${isStart ? 'start' : ''} ${isEnd ? 'end' : ''}`,
            iconSize: [isStart || isEnd ? 26 : 20, isStart || isEnd ? 26 : 20],
            iconAnchor: [isStart || isEnd ? 13 : 10, isStart || isEnd ? 13 : 10]
        });
        
        L.marker([coord.lat, coord.lng], { icon })
            .bindTooltip(coord.name, { permanent: false, direction: 'top' })
            .addTo(state.journeyMap);
    });
    
    // Draw route line
    const routeCoords = coords.map(c => [c.lat, c.lng]);
    L.polyline(routeCoords, {
        color: '#00ffc8',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
    }).addTo(state.journeyMap);
    
    // Add bike marker at start
    const bikeIcon = L.divIcon({
        className: 'bike-marker',
        html: '🏍️',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
    
    state.bikeMarker = L.marker([coords[0].lat, coords[0].lng], { icon: bikeIcon })
        .addTo(state.journeyMap);
    
    // Start animation after a delay
    setTimeout(() => animateBikeJourney(coords), 1000);
}

function animateBikeJourney(coords) {
    if (state.animationRunning || coords.length < 2) return;
    state.animationRunning = true;
    
    let currentStep = 0;
    const totalSteps = coords.length - 1;
    const stepDuration = 1500; // ms per segment
    const framesPerStep = 30;
    
    function animateToNextPoint() {
        if (currentStep >= totalSteps) {
            state.animationRunning = false;
            return;
        }
        
        const start = coords[currentStep];
        const end = coords[currentStep + 1];
        let frame = 0;
        
        function moveFrame() {
            if (frame >= framesPerStep) {
                currentStep++;
                setTimeout(animateToNextPoint, 300);
                return;
            }
            
            const progress = frame / framesPerStep;
            const eased = 1 - Math.pow(1 - progress, 3); // Ease out
            
            const lat = start.lat + (end.lat - start.lat) * eased;
            const lng = start.lng + (end.lng - start.lng) * eased;
            
            state.bikeMarker.setLatLng([lat, lng]);
            frame++;
            
            setTimeout(moveFrame, stepDuration / framesPerStep);
        }
        
        moveFrame();
    }
    
    animateToNextPoint();
}

// ===================================
// Personality Calculator
// ===================================
function calculatePersonality() {
    const { favoriteTime, favoriteTerrain, rideLength, daysRidden, totalDistance } = state.userData;
    
    // Simple personality algorithm based on user choices
    if (favoriteTime === 'night') return personalities.nightOwl;
    if (rideLength === 'long' && totalDistance > 5000) return personalities.enduranceBeast;
    if (daysRidden > 200) return personalities.commuterKing;
    if (favoriteTerrain === 'mountains' || favoriteTerrain === 'countryside') return personalities.explorer;
    if (rideLength === 'short' && favoriteTime === 'morning') return personalities.zenRider;
    if (state.userData.favoriteDay === 'saturday' || state.userData.favoriteDay === 'sunday') return personalities.weekendWarrior;
    if (favoriteTerrain === 'highways' && rideLength === 'long') return personalities.speedster;
    
    return personalities.explorer; // Default
}

// ===================================
// Slide Generation
// ===================================
function generateSlides() {
    const data = state.userData;
    const personality = calculatePersonality();
    const terrain = terrainData[data.favoriteTerrain];
    const time = timeData[data.favoriteTime];
    const weather = weatherData[data.preferredWeather];
    
    const slides = [
        // Slide 1: Opening
        {
            class: 'slide-opening',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                    <div class="road-animation"></div>
                </div>
                <div class="slide-content">
                    <span class="slide-emoji">🏍️</span>
                    <h1 class="slide-headline">
                        Your 2025<br>
                        <span class="highlight">RideWrapped</span><br>
                        is here
                    </h1>
                    <p class="slide-subtext">
                        Every ride. Every road. Every memory.<br>
                        Let's see what you did out there, <strong>${data.name}</strong>.
                    </p>
                </div>
            `
        },
        // Slide 2: Distance
        {
            class: 'slide-distance',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline">
                        You rode<br>
                        <span class="big-number" data-value="${data.totalDistance}">${data.totalDistance.toLocaleString()}</span>
                        <span class="highlight">km</span>
                    </h1>
                    <p class="slide-subtext">
                        That's not just distance.<br>
                        That's <strong>dedication</strong> on two wheels.
                    </p>
                </div>
            `
        },
        // Slide 3: Journey Map
        {
            class: 'slide-journey',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline" style="font-size: 1.5rem; margin-bottom: 0.5rem;">
                        Your Epic Journey
                    </h1>
                    <p class="slide-subtext" style="margin-bottom: 0.5rem;">
                        ${data.locationCoords.length} stops across the map
                    </p>
                    <div class="map-container">
                        <div id="journey-map"></div>
                    </div>
                    <div class="journey-route-info">
                        <div class="route-stat">
                            <div class="route-stat-value">${data.locationCoords.length}</div>
                            <div class="route-stat-label">Cities</div>
                        </div>
                        <div class="route-stat">
                            <div class="route-stat-value">${data.locationCoords.map(c => c.name).join(' → ')}</div>
                            <div class="route-stat-label">Route</div>
                        </div>
                    </div>
                </div>
            `
        },
        // Slide 4: Consistency
        {
            class: 'slide-consistency',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline">
                        You showed up<br>
                        <span class="big-number">${data.daysRidden}</span>
                        <span class="highlight">days</span>
                    </h1>
                    <div class="calendar-dots">
                        ${generateCalendarDots(data.daysRidden)}
                    </div>
                    <p class="slide-subtext">
                        Rain. Heat. Traffic.<br>
                        None of it stopped you.
                    </p>
                </div>
            `
        },
        // Slide 4: Time Identity
        {
            class: `slide-time ${data.favoriteTime}`,
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <span class="slide-emoji">${time.emoji}</span>
                    <h1 class="slide-headline">
                        You're a<br>
                        <span class="highlight">${time.name}</span>
                    </h1>
                    <p class="slide-subtext">
                        ${time.tagline}
                    </p>
                </div>
            `
        },
        // Slide 5: Terrain Identity
        {
            class: 'slide-terrain',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <span class="slide-emoji">${terrain.emoji}</span>
                    <h1 class="slide-headline">
                        ${terrain.name} had<br>
                        <span class="highlight">your heart</span>
                    </h1>
                    <p class="slide-subtext">
                        ${terrain.tagline}<br>
                        The harder the road, the more you wanted it.
                    </p>
                </div>
            `
        },
        // Slide 6: Personality
        {
            class: 'slide-personality',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <p class="slide-subtext" style="margin-bottom: 1.5rem;">Your riding style:</p>
                    <div class="personality-card">
                        <span class="personality-icon">${personality.icon}</span>
                        <h2 class="personality-title">${personality.title}</h2>
                        <p class="personality-desc">${personality.desc}</p>
                    </div>
                </div>
            `
        },
        // Slide 7: Achievement
        {
            class: 'slide-achievement',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline">
                        Your longest ride<br>
                        <span class="big-number">${data.longestRide}</span>
                        <span class="highlight">km</span>
                    </h1>
                    <p class="slide-subtext">
                        One day. One tank.<br>
                        <strong>Endless memories.</strong>
                    </p>
                </div>
            `
        },
        // Slide 8: Habits
        {
            class: 'slide-habits',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline" style="font-size: 1.5rem; margin-bottom: 2rem;">
                        Your Riding Habits
                    </h1>
                    <div class="habits-grid">
                        <div class="habit-bubble float-1">
                            <span class="habit-icon">📅</span>
                            <div class="habit-text">
                                <span class="habit-label">Favorite Day</span>
                                <span class="habit-value">${dayNames[data.favoriteDay]}</span>
                            </div>
                        </div>
                        <div class="habit-bubble float-2">
                            <span class="habit-icon">${weather.emoji}</span>
                            <div class="habit-text">
                                <span class="habit-label">Best Weather</span>
                                <span class="habit-value">${weather.name}</span>
                            </div>
                        </div>
                        <div class="habit-bubble float-3">
                            <span class="habit-icon">🛤️</span>
                            <div class="habit-text">
                                <span class="habit-label">Your Style</span>
                                <span class="habit-value">${rideLengthData[data.rideLength]}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        // Slide 9: Memory
        {
            class: 'slide-memory',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <h1 class="slide-headline" style="font-size: 1.5rem; margin-bottom: 2rem;">
                        Your most memorable ride
                    </h1>
                    <div class="memory-card">
                        <p class="memory-quote">
                            ${data.memorableMoment || 'That feeling of the open road... nothing quite like it.'}
                        </p>
                    </div>
                </div>
            `
        },
        // Slide 10: Share Card
        {
            class: 'slide-share',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <div class="share-card">
                        <div class="share-card-content">
                            <p class="share-personality">${personality.icon} I'm ${personality.title}</p>
                            <p class="share-stats">${data.totalDistance.toLocaleString()} km</p>
                            <p class="share-terrain">${terrain.name} ${terrain.emoji} > Everything</p>
                            <p class="share-hashtag">#RideWrapped2025</p>
                            <p class="share-logo">🏍️ RideWrapped</p>
                        </div>
                    </div>
                </div>
            `
        },
        // Slide 11: Farewell
        {
            class: 'slide-farewell',
            content: `
                <div class="slide-bg">
                    <div class="slide-bg-gradient"></div>
                </div>
                <div class="slide-content">
                    <p class="farewell-headline">This year, you didn't just ride...</p>
                    <h1 class="farewell-statement">You lived it<br>on two wheels.</h1>
                    <button class="share-button" onclick="shareRideWrapped()">
                        <span>Share Your RideWrapped</span>
                        <span>📤</span>
                    </button>
                </div>
            `
        }
    ];
    
    // Render slides
    elements.slidesContainer.innerHTML = slides.map((slide, index) => `
        <div class="slide ${slide.class} ${index === 0 ? 'active' : ''}" data-slide="${index}">
            ${slide.content}
        </div>
    `).join('');
    
    // Generate dots
    elements.slideDots.innerHTML = slides.map((_, index) => `
        <div class="slide-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
    `).join('');
    
    // Add dot click handlers
    document.querySelectorAll('.slide-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide));
        });
    });
    
    state.totalSlides = slides.length;
}

function generateCalendarDots(daysRidden) {
    const dots = [];
    const totalDots = 52; // Representative calendar
    const filledRatio = Math.min(daysRidden / 365, 1);
    const filledCount = Math.round(totalDots * filledRatio);
    
    for (let i = 0; i < totalDots; i++) {
        const isFilled = i < filledCount;
        dots.push(`<div class="calendar-dot ${isFilled ? 'filled' : ''}"></div>`);
    }
    
    return dots.join('');
}

// ===================================
// Slide Navigation
// ===================================
function goToSlide(index) {
    if (index < 0 || index >= state.totalSlides) return;
    
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    state.currentSlide = index;
    
    // Update nav buttons
    elements.slidePrev.disabled = index === 0;
    elements.slideNext.disabled = index === state.totalSlides - 1;
    
    // Initialize journey map when journey slide (index 2) is shown
    if (index === 2 && !state.journeyMap) {
        setTimeout(() => initJourneyMap(), 300);
    }
    
    // Animate slide content
    animateSlideContent(index);
}

function nextSlide() {
    if (state.currentSlide < state.totalSlides - 1) {
        goToSlide(state.currentSlide + 1);
    }
}

function prevSlide() {
    if (state.currentSlide > 0) {
        goToSlide(state.currentSlide - 1);
    }
}

function animateSlideContent(slideIndex) {
    const slide = document.querySelector(`.slide[data-slide="${slideIndex}"]`);
    if (!slide) return;
    
    // Animate elements with GSAP
    const elements = slide.querySelectorAll('.slide-headline, .slide-subtext, .slide-emoji, .personality-card, .habit-bubble, .memory-card, .share-card, .farewell-headline, .farewell-statement, .share-button, .journey-map-container');
    
    gsap.fromTo(elements, 
        { opacity: 0, y: 30 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15,
            ease: 'power3.out'
        }
    );
    
    // Animate big numbers
    const bigNumber = slide.querySelector('.big-number');
    if (bigNumber) {
        const targetValue = parseInt(bigNumber.dataset.value) || parseInt(bigNumber.textContent.replace(/,/g, ''));
        animateNumber(bigNumber, targetValue);
    }
}

function animateNumber(element, targetValue) {
    const duration = 2000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(targetValue * easeOut);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===================================
// Share Functionality
// ===================================
function shareRideWrapped() {
    const personality = calculatePersonality();
    const data = state.userData;
    const terrain = terrainData[data.favoriteTerrain];
    
    const shareText = `My 2025 RideWrapped 🏍️\n\n` +
        `${personality.icon} I'm ${personality.title}\n` +
        `📏 ${data.totalDistance.toLocaleString()} km ridden\n` +
        `📅 ${data.daysRidden} days on two wheels\n` +
        `${terrain.emoji} ${terrain.name} > Everything\n\n` +
        `#RideWrapped2025`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My RideWrapped 2025',
            text: shareText
        }).catch(console.log);
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Copied to clipboard! Share your RideWrapped on social media.');
        }).catch(() => {
            alert(shareText);
        });
    }
}

// ===================================
// Instagram Stories Share
// ===================================
function openShareModal() {
    document.getElementById('share-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeShareModal() {
    document.getElementById('share-modal').classList.add('hidden');
    document.body.style.overflow = '';
    
    // Hide progress
    document.getElementById('download-progress').classList.add('hidden');
}

function showInstagramButton() {
    document.getElementById('instagram-share-btn').classList.remove('hidden');
}

function hideInstagramButton() {
    document.getElementById('instagram-share-btn').classList.add('hidden');
}

async function captureSlideAsImage(slideIndex) {
    const slide = document.querySelector(`.slide[data-slide="${slideIndex}"]`);
    if (!slide) return null;
    
    // Temporarily make the slide visible for capture
    const wasActive = slide.classList.contains('active');
    if (!wasActive) {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
        slide.style.transform = 'scale(1)';
    }
    
    try {
        const canvas = await html2canvas(slide, {
            backgroundColor: '#0d1b2a',
            scale: 2, // Higher quality for Instagram
            width: 1080 / 2, // Instagram story width
            height: 1920 / 2, // Instagram story height
            windowWidth: 540,
            windowHeight: 960,
            useCORS: true,
            logging: false
        });
        
        return canvas.toDataURL('image/png');
    } catch (error) {
        console.error('Error capturing slide:', error);
        return null;
    } finally {
        // Reset visibility if wasn't active
        if (!wasActive) {
            slide.style.opacity = '';
            slide.style.visibility = '';
            slide.style.transform = '';
        }
    }
}

async function downloadCurrentSlide() {
    const progressEl = document.getElementById('download-progress');
    const progressFill = document.getElementById('download-progress-fill');
    const progressText = document.getElementById('download-progress-text');
    
    progressEl.classList.remove('hidden');
    progressFill.style.width = '30%';
    progressText.textContent = 'Capturing slide...';
    
    const imageData = await captureSlideAsImage(state.currentSlide);
    
    if (imageData) {
        progressFill.style.width = '80%';
        progressText.textContent = 'Preparing download...';
        
        // Create download link
        const link = document.createElement('a');
        link.download = `RideWrapped_Slide_${state.currentSlide + 1}.png`;
        link.href = imageData;
        link.click();
        
        progressFill.style.width = '100%';
        progressText.textContent = '✅ Downloaded! Ready for Instagram Stories';
        
        setTimeout(() => {
            progressEl.classList.add('hidden');
            progressFill.style.width = '0%';
        }, 2000);
    } else {
        progressText.textContent = '❌ Error capturing slide. Try again.';
        setTimeout(() => {
            progressEl.classList.add('hidden');
            progressFill.style.width = '0%';
        }, 2000);
    }
}

async function downloadAllSlides() {
    const progressEl = document.getElementById('download-progress');
    const progressFill = document.getElementById('download-progress-fill');
    const progressText = document.getElementById('download-progress-text');
    
    progressEl.classList.remove('hidden');
    progressText.textContent = 'Starting download...';
    
    const totalSlides = state.totalSlides;
    let downloaded = 0;
    
    for (let i = 0; i < totalSlides; i++) {
        progressFill.style.width = `${((i + 1) / totalSlides) * 90}%`;
        progressText.textContent = `Capturing slide ${i + 1} of ${totalSlides}...`;
        
        const imageData = await captureSlideAsImage(i);
        
        if (imageData) {
            // Create download link with slight delay between downloads
            const link = document.createElement('a');
            link.download = `RideWrapped_${String(i + 1).padStart(2, '0')}.png`;
            link.href = imageData;
            link.click();
            downloaded++;
            
            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 300));
        }
    }
    
    progressFill.style.width = '100%';
    progressText.textContent = `✅ Downloaded ${downloaded} slides! Check your downloads folder.`;
    
    setTimeout(() => {
        progressEl.classList.add('hidden');
        progressFill.style.width = '0%';
    }, 3000);
}

// ===================================
// Touch/Swipe Support
// ===================================
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > threshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - prev slide
            prevSlide();
        }
    }
}

function setupSwipeHandlers() {
    const slidesContainer = elements.slidesContainer;
    
    slidesContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slidesContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

// ===================================
// Keyboard Navigation
// ===================================
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (state.currentScreen === 'slides') {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            }
        }
    });
}

// ===================================
// Initialize
// ===================================
function init() {
    // Setup event listeners
    elements.startBtn.addEventListener('click', () => {
        switchScreen('questionnaire');
        showQuestion(1);
    });
    
    elements.prevBtn.addEventListener('click', prevQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
    
    elements.generateBtn.addEventListener('click', async () => {
        if (validateCurrentQuestion()) {
            // Collect final locations
            collectLocations();
            
            // Show loading state
            elements.generateBtn.innerHTML = '<span>Loading your journey...</span><span class="sparkle">🗺️</span>';
            elements.generateBtn.disabled = true;
            
            // Geocode all locations
            await geocodeAllLocations();
            
            // Generate and show slides
            generateSlides();
            switchScreen('slides');
            
            // Reset button state
            elements.generateBtn.innerHTML = '<span>Generate My RideWrapped</span><span class="sparkle">✨</span>';
            elements.generateBtn.disabled = false;
            
            // Animate first slide
            setTimeout(() => {
                animateSlideContent(0);
            }, 500);
        }
    });
    
    elements.slidePrev.addEventListener('click', prevSlide);
    elements.slideNext.addEventListener('click', nextSlide);
    
    setupInputHandlers();
    setupSwipeHandlers();
    setupKeyboardNavigation();
    
    // Add shake animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
