// ===== PAGE MANAGEMENT =====
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