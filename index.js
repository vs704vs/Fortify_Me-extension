function estimateCrackTime(password, numberofTimes) {
    // Assumptions:
    const averageGuessesPerSecond = 1e9; // 1 billion guesses per second
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInYear = BigInt(3.154e+7);

    // Determine the number of possible combinations based on password length and character set
    const characterSetSize = 94; // Assumption: considering printable ASCII characters
    const passwordLength = password.length;
    let possibleCombinations = BigInt(characterSetSize) ** BigInt(passwordLength);
    let crackTimeSeconds = possibleCombinations / BigInt(averageGuessesPerSecond);
    let crackTimeSeconds_pg = crackTimeSeconds/BigInt(21)

    if(numberofTimes != 0){
        crackTimeSeconds = crackTimeSeconds/BigInt(numberofTimes);
        crackTimeSeconds_pg = crackTimeSeconds_pg/BigInt(numberofTimes);
    }

    final_string = "seconds";
    final_string_pg = "seconds";

    if(crackTimeSeconds > secondsInYear){
        crackTimeSeconds = crackTimeSeconds/BigInt(secondsInYear);
        final_string = "years";
    }
    else if(crackTimeSeconds > secondsInDay){
        crackTimeSeconds = crackTimeSeconds/BigInt(secondsInDay);
        final_string = "days";
    }
    else if(crackTimeSeconds > secondsInHour){
        crackTimeSeconds = crackTimeSeconds/BigInt(secondsInHour);
        final_string = "hours";
    }
    else if(crackTimeSeconds > secondsInMinute){
        crackTimeSeconds = crackTimeSeconds/BigInt(secondsInMinute);
        final_string = "minutes";
    }


    if(crackTimeSeconds_pg > secondsInYear){
        crackTimeSeconds_pg = crackTimeSeconds_pg/BigInt(secondsInYear);
        final_string_pg = "years";
    }
    else if(crackTimeSeconds_pg > secondsInDay){
        crackTimeSeconds_pg = crackTimeSeconds_pg/BigInt(secondsInDay);
        final_string_pg = "days";
    }
    else if(crackTimeSeconds_pg > secondsInHour){
        crackTimeSeconds_pg = crackTimeSeconds_pg/BigInt(secondsInHour);
        final_string_pg = "hours";
    }
    else if(crackTimeSeconds_pg > secondsInMinute){
        crackTimeSeconds_pg = crackTimeSeconds_pg/BigInt(secondsInMinute);
        final_string_pg = "minutes";
    }
    return [[crackTimeSeconds, final_string], [crackTimeSeconds_pg, final_string_pg]];
}


async function getData(url, sha1Hash) {
    let response = await fetch(url);
    let hashes = await response.text();

    const hashList = hashes.split('\n');
    let count = 0;
    hashList.forEach(hash => {
        if ( hash.substring(0,35) == sha1Hash.substring(5) ) {
           count = (hash.substring(37));
        } 
    });
    const res = estimateCrackTime(password, count);
    document.querySelector(".heading").innerHTML = "DECODING TIME ESTIMATE:";
    console.log(res);


    //////////////////////////// adding stuff and designing them ////////////////////////////

    document.querySelector("#one").innerHTML = "Standard PC: " + res[0][0] + " " + res[0][1];
    document.querySelector("#two").innerHTML = "Parallel GPUs: " + res[1][0] + " " + res[1][1];
    document.querySelector("#three").innerHTML = "Previous breaches: " + count + " times";

    const boxone = document.querySelector("#box1");
    let my_class1 = "green";
    if(res[0][1] === "years") my_class1 = "green";
    else if(res[0][1] === "months" || res[0][1] === "days") my_class1 = "blue";
    else my_class1 = "red";
    boxone.classList.add(my_class1);

    const boxtwo = document.querySelector("#box2");
    let my_class2 = "green";
    if(res[1][1] === "years") my_class2 = "green";
    else if(res[1][1] === "months" || res[1][1] === "days") my_class2 = "blue";
    else my_class2 = "red";
    boxtwo.classList.add(my_class2);

    const boxthree = document.querySelector("#box3");
    let my_class3 = "green";
    if(count === 0) my_class3 = "green";
    else if(count >= 1 && count <= 5) my_class3 = "blue";
    else my_class3 = "red";
    boxthree.classList.add(my_class3);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector(".form").addEventListener("submit", function(event) {
    event.preventDefault();
    getInput();
})


function getInput() {

    password = (document.querySelector(".input").value);

    const sha1Hash = SHA1(password).toUpperCase(); 
    const url  = "https://api.pwnedpasswords.com/range/" + sha1Hash.substring(0,5);
    getData(url, sha1Hash);
}









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
* Secure Hash Algorithm (SHA1)
* http://www.webtoolkit.info/
**/


function SHA1(msg) {
    function rotate_left(n,s) {
    var t4 = ( n<<s ) | (n>>>(32-s));
    return t4;
    };
    function lsb_hex(val) {
    var str='';
    var i;
    var vh;
    var vl;
    for( i=0; i<=6; i+=2 ) {
    vh = (val>>>(i*4+4))&0x0f;
    vl = (val>>>(i*4))&0x0f;
    str += vh.toString(16) + vl.toString(16);
    }
    return str;
    };
    function cvt_hex(val) {
    var str='';
    var i;
    var v;
    for( i=7; i>=0; i-- ) {
    v = (val>>>(i*4))&0x0f;
    str += v.toString(16);
    }
    return str;
    };
    function Utf8Encode(string) {
    string = string.replace(/\r\n/g,'\n');
    var utftext = '';
    for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
    utftext += String.fromCharCode(c);
    }
    else if((c > 127) && (c < 2048)) {
    utftext += String.fromCharCode((c >> 6) | 192);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    else {
    utftext += String.fromCharCode((c >> 12) | 224);
    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
    utftext += String.fromCharCode((c & 63) | 128);
    }
    }
    return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for( i=0; i<msg_len-3; i+=4 ) {
    j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    word_array.push( j );
    }
    switch( msg_len % 4 ) {
    case 0:
    i = 0x080000000;
    break;
    case 1:
    i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    break;
    case 2:
    i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    break;
    case 3:
    i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8 | 0x80;
    break;
    }
    word_array.push( i );
    while( (word_array.length % 16) != 14 ) word_array.push( 0 );
    word_array.push( msg_len>>>29 );
    word_array.push( (msg_len<<3)&0x0ffffffff );
    for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
    for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for( i= 0; i<=19; i++ ) {
    temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
    E = D;
    D = C;
    C = rotate_left(B,30);
    B = A;
    A = temp;
    }
    for( i=20; i<=39; i++ ) {
    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
    E = D;
    D = C;
    C = rotate_left(B,30);
    B = A;
    A = temp;
    }
    for( i=40; i<=59; i++ ) {
    temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
    E = D;
    D = C;
    C = rotate_left(B,30);
    B = A;
    A = temp;
    }
    for( i=60; i<=79; i++ ) {
    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
    E = D;
    D = C;
    C = rotate_left(B,30);
    B = A;
    A = temp;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
   
    return temp.toLowerCase();
   }