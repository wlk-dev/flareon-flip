var quotes = [
    '\"It is very emotionally sensible and when it is nervous, it releases large amounts of heat through its fur.\"\n\n',
    '\"When shiny, Flareon\'s orange fur turns a much lighter orange and yellow, and shimmers in the sunlight\"\n',
    '\"Flareon is also an altruistic and loyal being. However it can get angry for an important reason, be real explosive.\"\n',
    '\"The fire that is expelled from its mouth is even hotter, and can reach 3092 degrees Fahrenheit (1700 degrees Celsius).\"\n',
    '\"It has a flame sack in its body. Its body temperature can reach up to 1,650 degrees Fahrenheit before battle.\"\n\n',
    '\"Flareon\'s yellow fur has an important function: to release heat so that it does not suffocate.\"\n\n',
    '\"When it catches prey or finds berries, it breathes fire on them until theyre well done, and then it gobbles them up.\"\n',
    '\"The pokemon Flareon has the highest attack stat out of\
    all of the other Eevee evolutions, which is impressive.\"\n',
]
var randomNumber = Math.floor(Math.random()*quotes.length);
document.getElementById('quotes').innerHTML = quotes[randomNumber];
function newQuote(){
    var randomNumber = Math.floor(Math.random()*quotes.length);
    document.getElementById('quotes').innerHTML = quotes[randomNumber];
}