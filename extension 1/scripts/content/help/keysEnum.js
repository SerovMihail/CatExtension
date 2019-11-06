const KEY_CODES = {
    ENTER: 13, // default key
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    F5: 116,
};

function getKeyCode(key) {
    let keyCode = KEY_CODES[key];
    if(!keyCode) {
        return KEY_CODES[ENTER];
    } else {
        return keyCode;
    }
     
};