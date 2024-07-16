const translations = {
    en: {
        chooseGame: "Please choose the game",
        tryGame: "Make a jigsaw puzzle with your picture and challenge yourself to the game",
        slidingGame: "Sliding puzzle games",
        loudPerson: "This is a white board. Draw freely!"
    },

    ko: {
        chooseGame: "게임을 선택해 주세요",
        tryGame: "당신의 사진으로 직소 퍼즐을 만들어 게임에 도전하세요",
        slidingGame: "슬라이딩 퍼즐 게임",
        loudPerson: "화이트보드에 자유롭게 그리세요!"

    }

}

function changeLanguage(lng) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.innerHTML = translations[lng][key];
    });
}

document.getElementById('languageSelector').addEventListener('change', function () {
    const selectedLanguage = this.value;
    changeLanguage(selectedLanguage);
});

// 페이지 로드 시 기본 언어 설정
document.addEventListener('DOMContentLoaded', function () {
    const defaultLanguage = document.documentElement.lang || 'ko';
    changeLanguage(defaultLanguage);
});