// Function to dynamically load a script
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.onload = callback;
    script.onerror = function () {
        console.error('Failed to load script: ' + src);
    };
    document.body.appendChild(script);
}

function showApplePage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'block';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
    loadScript('apple.js', function () {
        console.log('apple.js loaded');
        setupBoard();
    });
}

function showGrapePage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'block';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
    loadScript('grape.js', function () {
        console.log('grape.js loaded');
        setupBoard();
    });
}

function showOrangePage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'block';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
    loadScript('orange.js', function () {
        console.log('orange.js loaded');
        setupBoard();
    });
}

function showWatermelonPage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'block';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
    loadScript('watermelon.js', function () {
        console.log('watermelon.js loaded');
        setupBoard();
    });
}

function showMangoPage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'block';
    document.getElementById('tigerPage').style.display = 'none';
    loadScript('mango.js', function () {
        console.log('mango.js loaded');
        setupBoard();
    });
}

function showTigerPage(event) {
    event.preventDefault(); // 링크 기본 동작 방지
    document.getElementById('mainPage').style.display = 'none';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'block';
    loadScript('tiger.js', function () {
        console.log('tiger.js loaded');
        setupBoard();
    });
}

function goBack(event) {
    document.getElementById('mainPage').style.display = 'block';
    document.getElementById('applePage').style.display = 'none';
    document.getElementById('grapePage').style.display = 'none';
    document.getElementById('orangePage').style.display = 'none';
    document.getElementById('watermelonPage').style.display = 'none';
    document.getElementById('mangoPage').style.display = 'none';
    document.getElementById('tigerPage').style.display = 'none';
}