// blacklist markets & events by network id then branch id

// initialize blacklists with network ids
var markets = { '0': {}, '7': {}, '10101': {} };
var events = { '0': {}, '7': {}, '10101': {} };

// [ network id ][ branch id ]
markets['0']['1010101'] = [
    "7960c1fb48ac30c060c143666520ac11822a7337a0fe86807ea73675c4b7b65",
    "82a2883b413003b790398230f1793a49b66f51190ff0a64bf37ff0feec1e458",
    "8a36bb791ceb1d80da3bbe6b02a55030bb0c5d8233e7d2b8e9742d2b1ac4a1b",
    "-679dd23af25d5053c639e2f17789cc4838a8bbef7fc4275e2e4f6ba59b365ab",
    "-baecbd5912a5365e499c58f66d8a7b0362b139ff55d766c00194bdf255762fb0",
    "-9d16373030c5ee68f4df240edfae9ed3ad853fbaef21a757e879527be03f71b",
    "-5bfeea0efc754add5e4d11d8a57666f5210a7f5d46437e406b127971b28ac381",
    "-144a8d4b00f0ec1d5b2ac030c23c39e8e99acdc91ff37d8298380c9eb4bdf8d4",
    "-7c3e6010123bff906d24b946dce575ee854c02fc895e7d0b1a6e0c1cda1de64d",
    "-81635174e39d2ddf7e978e7891ecdba821fd3cae44e0351f64c8dedc383bb771",
    "-78e4a8b5dbd3a013a42cf8976654045ad1614e2882515791ba43876922b37802",
    "-e055740a84abada89dfc997cb33083f24f1fd2d5788088888d3f41febaece0c5"
];

markets['7']['1010101'] = [
    "-7c3e6010123bff906d24b946dce575ee854c02fc895e7d0b1a6e0c1cda1de64d",
    "7960c1fb48ac30c060c143666520ac11822a7337a0fe86807ea73675c4b7b65",
    "82a2883b413003b790398230f1793a49b66f51190ff0a64bf37ff0feec1e458",
    "8a36bb791ceb1d80da3bbe6b02a55030bb0c5d8233e7d2b8e9742d2b1ac4a1b",
    "-679dd23af25d5053c639e2f17789cc4838a8bbef7fc4275e2e4f6ba59b365ab",
    "-baecbd5912a5365e499c58f66d8a7b0362b139ff55d766c00194bdf255762fb0",
    "-144a8d4b00f0ec1d5b2ac030c23c39e8e99acdc91ff37d8298380c9eb4bdf8d4",
    "-81635174e39d2ddf7e978e7891ecdba821fd3cae44e0351f64c8dedc383bb771",
    "-e055740a84abada89dfc997cb33083f24f1fd2d5788088888d3f41febaece0c5",
    "-77ddf3f672cef175a4642a215fde1435fb2ffe8593bbc0ce46cbdaade523bca4",
    "-a76f6c46ae32417b52be6fbd811c317209bafd7d090b2b607ecf57fa8fb87d57",
    "-7fef80c02ff8508dac301510863f1cb982b3841c1ae01ccc5cab3e0d023a06d2",
    "-2ecd1bd09e58c933470e17ec06d0e231fee40115bac918620ceccdcd7f46859c",
    "-733d0f0d6f0422f1aaac130fc8009019163753bfdd8446006b4313465a5a4023",
    "-3d0f7ced9b591d476b1711b2145d932f9fad7524eced56156f54e3ff250f87ec",
    "-d71810e303d9e37f5c83ee31dd87e2d5eac4a6d25b65d38d9e2c2ce447e6e93a",
    "-c4872f12af3bc570d53a9194e926ca0e97d730ddadd06b0c5b1d687e430056f7",
    "-2a17e7f100b030c6a2a6666a1d43f82a3c554c22cbcd27f639be47466687a5cb",
    "-c716909c9f66770f3b90ee904f043f33a1c282c179506e8ad3d982fd611ae26",
    "-7eb9fde28c41896064ae43332f5a4697044cf40302486f668e658a2ed462103d",
    "-36888da57ede86fa9a176244da7c5840bf929bf4b0d2543e85e7d09630f0d600",
    "-9b241692291951b3192c03f510d744c324bf3e75b3ceb6ecd6d53515c0673055"
];

markets['10101']['1010101'] = [];

module.exports = {
	markets: markets,
	events: events
};
