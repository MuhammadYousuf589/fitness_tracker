// ===== PAGE MANAGEMENT =====
// ===== Client-side API mock for GitHub Pages demo =====
// If the site is served as a static site (no backend), intercept fetch
// calls to `/api/*` and handle them in localStorage so the demo works.
(function(){
    const isStatic = location.hostname.endsWith('github.io') || location.protocol === 'file:' || location.hostname === '';
    if (!isStatic) return; // only enable mock when running as static site

    const seedExercises = window.__seedExercises = window.__seedExercises || (function(){
        return [
            { id:1, name:'Running', description:'Running at a moderate pace', category:'Cardio', difficulty:'Intermediate', calories_burned_per_minute:10.0, muscle_groups:'Legs, Core', instructions:'Maintain steady pace' },
            { id:2, name:'Cycling', description:'Cycling on a flat surface', category:'Cardio', difficulty:'Beginner', calories_burned_per_minute:8.0, muscle_groups:'Legs, Glutes', instructions:'Keep back straight' },
            { id:3, name:'Push-ups', description:'Classic push-up exercise', category:'Strength', difficulty:'Beginner', calories_burned_per_minute:4.0, muscle_groups:'Chest, Shoulders, Triceps', instructions:'Keep body straight' }
        ];
    })();

    function readStore(key, fallback){
        try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e){ return fallback; }
    }
    function writeStore(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

    // initialize stores
    if (!localStorage.getItem('exercises')) writeStore('exercises', seedExercises);
    if (!localStorage.getItem('workouts')) writeStore('workouts', []);
    if (!localStorage.getItem('goals')) writeStore('goals', []);
    if (!localStorage.getItem('body_measurements')) writeStore('body_measurements', []);
    if (!localStorage.getItem('users')) writeStore('users', [{ id:1, name:'Demo User', age:25, height_cm:170, initial_weight_kg:70, gender:'male' }]);

    const originalFetch = window.fetch.bind(window);
    window.fetch = async function(input, init){
        const url = (typeof input === 'string') ? input : (input && input.url) || '';
        if (!url.startsWith('/api/')) return originalFetch(input, init);

        const method = (init && init.method) || 'GET';
        const path = url.replace(/^\/api\//, '');
        const parts = path.split('/').filter(Boolean);

        // small helper to create Response-like object
        function jsonResponse(obj){
            return new Response(JSON.stringify(obj), { status:200, headers:{ 'Content-Type':'application/json' } });
        }

        // parse body if present
        let body = null;
        if (init && init.body) {
            try { body = JSON.parse(init.body); } catch(e){ body = null; }
        }

        // Route handlers
        try {
            // EXERCISES
            if (parts[0] === 'exercises'){
                if (method === 'GET'){
                    const exercises = readStore('exercises', []);
                    return jsonResponse({ exercises });
                }
            }

            // WORKOUTS
            if (parts[0] === 'workouts'){
                if (method === 'GET'){
                    const workouts = readStore('workouts', []).sort((a,b)=> new Date(b.date) - new Date(a.date));
                    return jsonResponse({ workouts });
                }
                if (method === 'POST'){
                    const workouts = readStore('workouts', []);
                    const id = (workouts.length? (workouts[workouts.length-1].id||0):0) + 1;
                    const now = new Date().toISOString();
                    const w = { id, user_id:1, exercise_name: body.exercise_name || 'Unknown', duration_minutes: body.duration_minutes||0, calories_burned: body.calories_burned||Math.round(5*(body.duration_minutes||0)), date: now };
                    workouts.push(w); writeStore('workouts', workouts);
                    return jsonResponse({ message:'Workout logged successfully!', id, calories_burned: w.calories_burned });
                }
                if (method === 'DELETE' && parts[1]){
                    const id = Number(parts[1]);
                    let workouts = readStore('workouts', []);
                    workouts = workouts.filter(x=> x.id !== id);
                    writeStore('workouts', workouts);
                    return jsonResponse({ message:'Workout deleted successfully!' });
                }
            }

            // PROFILE
            if (parts[0] === 'profile'){
                if (method === 'GET'){
                    const users = readStore('users', []);
                    return jsonResponse({ profile: users[0] || null });
                }
                if (method === 'POST'){
                    const users = readStore('users', []);
                    users[0] = Object.assign(users[0]||{}, body);
                    writeStore('users', users);
                    return jsonResponse({ message:'Profile updated successfully!' });
                }
            }

            // GOALS
            if (parts[0] === 'goals'){
                if (method === 'GET'){
                    const goals = readStore('goals', []);
                    return jsonResponse({ goals });
                }
                if (method === 'POST'){
                    const goals = readStore('goals', []);
                    const id = (goals.length? goals[goals.length-1].id:0) + 1;
                    const g = { id, user_id:1, goal_type: body.goal_type, target_value: body.target_value, current_value: 0, target_date: body.target_date || null, created_at: new Date().toISOString(), is_completed: false };
                    goals.push(g); writeStore('goals', goals);
                    return jsonResponse({ message:'Goal set successfully!', id: g.id });
                }
                if (method === 'PUT' && parts[1]){
                    const id = Number(parts[1]);
                    const goals = readStore('goals', []);
                    const g = goals.find(x=> x.id === id);
                    if (g){ Object.assign(g, body); writeStore('goals', goals); }
                    return jsonResponse({ message:'Goal updated successfully!' });
                }
                if (method === 'DELETE' && parts[1]){
                    const id = Number(parts[1]);
                    let goals = readStore('goals', []);
                    goals = goals.filter(x=> x.id !== id); writeStore('goals', goals);
                    return jsonResponse({ message: 'Goal deleted successfully!' });
                }
            }

            // BODY MEASUREMENTS
            if (parts[0] === 'body-measurements'){
                if (method === 'GET'){
                    const measurements = readStore('body_measurements', []).sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                    return jsonResponse({ measurements });
                }
                if (method === 'POST'){
                    const measurements = readStore('body_measurements', []);
                    const id = (measurements.length? measurements[measurements.length-1].id:0) + 1;
                    const now = new Date().toISOString();
                    const m = Object.assign({ id, user_id:1, measurement_date: now }, body);
                    measurements.push(m); writeStore('body_measurements', measurements);
                    return jsonResponse({ message:'Body measurements saved successfully!', id: m.id });
                }
            }

            // Simple aggregate endpoints (charts/statistics) - use workouts/measurements
            if (parts[0] === 'charts'){
                const workouts = readStore('workouts', []);
                if (parts[1] === 'workout-data'){
                    // last 30 days grouped by date
                    const map = {};
                    workouts.forEach(w=>{ const d = w.date.split('T')[0]; map[d] = map[d] || { date:d, workout_count:0, daily_calories:0, total_duration:0 }; map[d].workout_count++; map[d].daily_calories += (w.calories_burned||0); map[d].total_duration += (w.duration_minutes||0); });
                    const arr = Object.values(map).sort((a,b)=> new Date(a.date)-new Date(b.date));
                    return jsonResponse({ workoutData: arr });
                }
            }

            // default: respond with empty OK
            return jsonResponse({});
        } catch(err){
            return new Response(JSON.stringify({ error: err.message }), { status:500, headers:{ 'Content-Type':'application/json' } });
        }
    };
    console.log('🔁 API mock enabled for static demo (GitHub Pages)');
})();

function showPage(pageId) {
    console.log('🔄 Switching to page:', pageId);
    



















































































































































































































































































































});    console.log('🔘 Login form:', document.getElementById('login-form'));    console.log('🔘 Start button:', document.getElementById('start-journey-btn'));    console.log('📄 All pages:', document.querySelectorAll('.page').length);    
    // Debug info    showPage('landing-page');    
    // Start with landing page    initializeEventListeners();    
    // Initialize all event listeners    console.log("🏋️‍♂️ WebFit Tracker Loaded!");document.addEventListener('DOMContentLoaded', function() {// ===== MAIN INITIALIZATION =====}    updateEnhancedDashboard();    updateDashboardProfile();    loadWorkouts();    // Load any initial app data    console.log("🚀 Initializing WebFit Tracker...");function initializeApp() {// ===== INITIALIZATION =====}    }        });            await handleMeasurementSubmission(this);            event.preventDefault();        measurementForm.addEventListener('submit', async function(event) {    if (measurementForm) {    const measurementForm = document.getElementById('measurement-form');function setupMeasurementForm() {}    }        });            await handleProfileSubmission(this);            event.preventDefault();        profileForm.addEventListener('submit', async function(event) {    if (profileForm) {    const profileForm = document.getElementById('profile-form');function setupProfileForm() {}    }        });            await handleWorkoutSubmission(this);            event.preventDefault();        workoutForm.addEventListener('submit', async function(event) {    if (workoutForm) {    const workoutForm = document.getElementById('workout-form');function setupWorkoutForm() {// ===== FORM SETUP FUNCTIONS =====
        const result = await setResponse.json();
        
        if(!setResponse.ok) {
            throw new Error(result.error || 'Failed to set goal');
        }

        return result;
    } catch (error) {
        throw error;
    }
}        });            body: JSON.stringify(goalData)            },                'Content-Type': 'application/json',            headers: {            method: 'POST',    try {
        const setResponse = await fetch('/api/goals', {async function setGoalWithValidation(goalData) {
    try {
        await setGoalWithValidation(goalData);
        
        const messageElement = document.getElementById('goal-message');
        if (messageElement) {
            messageElement.textContent = "Goal set successfully!";
            messageElement.style.color = '#00ff00';
        }
        
        form.reset();
        loadGoals();
    } catch (error) {
        const messageElement = document.getElementById('goal-message');
        if (messageElement) {
            messageElement.textContent = error.message;
            messageElement.style.color = '#FF0000';
        }
    }
}    };        target_date: formData.get('target_date') || null        target_value: parseFloat(formData.get('target_value')),        goal_type: formData.get('goal_type'),    const goalData = {    const formData = new FormData(form);async function handleRegularGoalSetup(form) {            const setupBtn = form.querySelector('.setup-btn');
            if (setupBtn) {
                setupBtn.textContent = 'Goal Set! Redirecting...';
                setupBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
            }
            
            setTimeout(() => {
                showSection('dashboard');
            }, 1500);
        } else {
            alert('Error setting goal: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error setting goal:', error);
        // For demo, still proceed to dashboard
        const setupBtn = form.querySelector('.setup-btn');
        if (setupBtn) {
            setupBtn.textContent = 'Goal Set! Redirecting...';
            setupBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        }
        
        setTimeout(() => {
            showSection('dashboard');
        }, 1500);
    }
}
        const result = await setResponse.json();
        
        if(setResponse.ok) {
            // Show success and move to dashboard        });            body: JSON.stringify(goalData)            },                'Content-Type': 'application/json',            headers: {            method: 'POST',        const setResponse = await fetch('/api/goals', {
    try {
        // For demo purposes, we'll skip the API check and just set the goal    };        target_date: formData.get('target_date') || null        target_value: parseFloat(formData.get('target_value')),        goal_type: formData.get('goal_type'),    const goalData = {    const formData = new FormData(form);async function handleInitialGoalSetup(form) {}    }        unitElement.textContent = units[goalType] || '';        };            'exercise_target': 'reps'            'calorie_burn': 'calories',            'workout_frequency': 'workouts/week',            'target_weight': 'kg',        const units = {        const goalType = goalTypeSelect.value;    
    if (goalTypeSelect && unitElement) {    const unitElement = document.getElementById(`${prefix}target-unit`);    const goalTypeSelect = document.getElementById(`${prefix}goal-type`);    const prefix = formType === 'initial' ? 'initial-' : '';function updateGoalUnitDisplay(formType) {}    }        });            updateGoalUnitDisplay('regular');        regularGoalType.addEventListener('change', function() {    if (regularGoalType) {    const regularGoalType = document.getElementById('goal-type');
    // Update goal unit display for regular form    }        });            updateGoalUnitDisplay('initial');        goalTypeSelect.addEventListener('change', function() {    if (goalTypeSelect) {    const goalTypeSelect = document.getElementById('initial-goal-type');
    // Update goal unit display for initial form    }        });            await handleRegularGoalSetup(this);            event.preventDefault();        goalForm.addEventListener('submit', async function(event) {    if (goalForm) {    const goalForm = document.getElementById('goal-form');
    // Regular goal form    }        });            await handleInitialGoalSetup(this);            event.preventDefault();        initialGoalForm.addEventListener('submit', async function(event) {    if (initialGoalForm) {    const initialGoalForm = document.getElementById('initial-goal-form');    
    // Initial goal form (after login)    console.log('🎯 Setting up goal forms...');function setupGoalForms() {// ===== GOAL SETUP HANDLING =====}    }        alert('Please enter both username and password');    } else {        }, 1000);            document.getElementById('login-form').reset();            }                loginBtn.disabled = false;                loginBtn.style.background = '';                loginBtn.textContent = 'Sign In';            if (loginBtn) {            
            // Reset login form            showPage('app-page');        setTimeout(() => {        
        // Simulate API call delay        
        console.log('✅ Login successful, switching to app...');        }            loginBtn.disabled = true;            loginBtn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';            loginBtn.textContent = 'Signing In...';        if (loginBtn) {        const loginBtn = document.querySelector('.login-btn');        // Show loading state    
    if (usernameValue && passwordValue) {    
    console.log('📋 Login attempt:', { username: usernameValue, password: '***' });    const passwordValue = password.value.trim();    
    const usernameValue = username.value.trim();    }        return;        alert('Login form not properly loaded. Please refresh the page.');        console.error('❌ Username or password fields not found');    
    if (!username || !password) {    const password = document.getElementById('password');    
    const username = document.getElementById('username');    console.log('🎯 Handling login process...');function handleLogin() {}    setupMeasurementForm();    setupProfileForm();    setupWorkoutForm();    
    // Setup other forms    setupGoalForms();    
    // Setup goal forms    }        });            handleLogin();            console.log('🖱️ Login button clicked directly');            event.preventDefault();        loginBtn.addEventListener('click', function(event) {    if (loginBtn) {    const loginBtn = document.getElementById('login-submit-btn');    
    // Direct login button click as backup    }        console.error('❌ Login form not found!');    } else {        });            handleLogin();            console.log('📝 Login form submitted');            event.preventDefault();        loginForm.addEventListener('submit', function(event) {    if (loginForm) {    const loginForm = document.getElementById('login-form');    
    // Login Form    }        console.error('❌ Start journey button not found!');    } else {        startButton.addEventListener('click', switchToLogin);        console.log('✅ Found start journey button');    if (startButton) {    const startButton = document.getElementById('start-journey-btn');    
    // Start Journey Button    console.log('🔧 Initializing event listeners...');function initializeEventListeners() {// ===== ENHANCED INITIALIZATION =====}    }            break;            loadProgressCharts(); // FIXED: This will now load charts        case 'progress-charts':            break;            loadExercises(); // FIXED: This will now load exercises        case 'exercise-library':            break;            loadGoals();        case 'goals':            break;            loadBodyMeasurements();        case 'body-measurements':            break;            loadProfile();        case 'bmi-calculator':            break;            loadWorkouts();        case 'history':            break;            updateEnhancedDashboard();            updateDashboardGoals();            updateDashboardProfile();            loadWorkouts();        case 'dashboard':    switch(sectionId) {    console.log('📥 Loading data for section:', sectionId);function loadSectionData(sectionId) {}    loadSectionData(sectionId);    
    // Load data for specific sections    }        console.error('❌ Target section not found:', sectionId);    } else {        console.log('✅ Now showing section:', sectionId);        targetSection.classList.add('active');    if (targetSection) {    const targetSection = document.getElementById(sectionId);    
    // Show target section    });        section.classList.remove('active');    document.querySelectorAll('.section').forEach(section => {    
    // Hide all sections    console.log('🔄 Switching to section:', sectionId);function showSection(sectionId) {}    }        mainContent.classList.toggle('with-nav');        nav.classList.toggle('active');    
    if (nav && mainContent) {    const mainContent = document.querySelector('.main-content');    const nav = document.querySelector('.vertical-nav');function toggleNav() {// ===== NAVIGATION MANAGEMENT =====}    showPage('login-page');    console.log('🎯 Start button clicked! Switching to login page...');function switchToLogin() {// Simple function for the landing page button}    }        showPage('landing-page');    if (confirm('Are you sure you want to logout?')) {function logout() {}    }        initializeApp();        // Initialize app        showSection('goal-setup');        // Show goal setup first    if (pageId === 'app-page') {    
    // Special handling for app page    }        console.error('❌ Target page not found:', pageId);    } else {        console.log('✅ Now showing page:', pageId);        targetPage.classList.add('active');    if (targetPage) {    const targetPage = document.getElementById(pageId);    
    // Show target page    });        page.classList.remove('active');    document.querySelectorAll('.page').forEach(page => {    // Hide all pages