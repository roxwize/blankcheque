// Blank Cheque //
//   (c) 2022   //
//THEKI LLECTIVE// 
const storyBox = document.getElementById("story");
const resultBox = document.getElementById("result");
const Parser = {};

Parser.AnAgreement = function(nextLetter) {
  let ltr;
  switch(nextLetter) {
    case "a":
    case "e":
    case "i":
    case "o":
    case "u":
      ltr = "an ";
      break;
    default:
      ltr = "a ";
      break;
  }
  return ltr;
}

Parser.LoadedStory = [];
Parser.Inputs = [];
Parser.CreateStoryElement = function(wordlet, id) {
    // Procedurally generate the input tag, as well as the bolded 
    // information about what word it is
    const el = document.createElement("div")
    // For more information on what these single-letter parameters mean, 
    // consult the readme!
    el.innerHTML = `<b>${wordlet.t ? wordlet.t + " " + wordlet.w.descriptor.toLowerCase() : wordlet.w.descriptor}${wordlet.e ? " ending in \"-"+wordlet.e + "\"" : ""}${wordlet.d ? ", " + wordlet.d : ""}</b>: <input type="${wordlet.w.descriptor == WordType.NUM.descriptor ? "number" : "text"}" class="textinput" id="input-${id}" required/><br />`;
    el.style.display = "inline";
    storyBox.appendChild(el);
    return el; // This isn't used, but can be useful for debugging and later applications
}
Parser.CreateText = function(input, bold = false) {
    // This is used when rendering the final story. Bolded text is used 
    // for words that were filled out by the user. This code is
    // subject to change as the structure of the webpage changes.
    let text;
    if (!bold) {
        text = document.createElement("span");
    } else {
        text = document.createElement("strong");
    }
    text.innerHTML = input;
    resultBox.appendChild(text);
}
Parser.ParseArray = function(array) {
    // This function loops through all of the word blanks and creates
    // input tags via Parser.CreateStoryElement for them. It also
    // pushes these blanks to Parser.Inputs which is used in the
    // Storrelate function. Words included in the story that are not
    // blanks are represented as null.
    storyBox.innerHTML = "";
    array.forEach((element, index) => {
        if (typeof element == 'object') {
            const el = Parser.CreateStoryElement(element, index);
            Parser.Inputs.push(el.getElementsByTagName('input')[0]);
        } else {
            Parser.Inputs.push(null);
        }
    });
}
Parser.Storrelate = function() {
    // This takes all of the user's inputs and constructs the final
    // story out of them. This entire function is subject to drastic
    // change as the layout of the webpage changes.
    resultBox.innerHTML = "";
    for (let i = 0; i < Parser.LoadedStory.length; i++) {
        if (typeof Parser.LoadedStory[i] === 'object') {
          Parser.CreateText(Parser.Inputs[i].value, true);
        } else {
          let textToAdd = Parser.LoadedStory[i]
          // Change "a" to "an" if necessary
          if (textToAdd == "an ") {
            textToAdd = Parser.AnAgreement(Parser.Inputs[i+1].value.split('')[0]);
          }
          Parser.CreateText(textToAdd);
        }
    }
    return false;
}
Parser.LoadStory = function(b) {
    // This takes the story loaded by the user and stores it into memory
    // while also making input elements for the blanks. For details on
    // the previously mentioned process, see the description of
    // Parser.ParseArray(). The original story is encoded in Base64
    // for data condensing and ease of sharing.
    const json = JSON.parse(atob(b));
    Parser.LoadedStory = json; // is this necessary?
    Parser.ParseArray(Parser.LoadedStory);
    const btn = document.createElement("input");
    btn.type = "submit";
    btn.value = "storrelate";
    storyBox.appendChild(btn);
}

const WordType = {
    // These are constants containing all of the different kinds of words
    // used in stories. These variables are only meant to be used when
    // the story is being created; when it is being loaded, the
    // JSON.parse() function removes the classes and instead represents
    // them as an unnamed object.
    NOUN: {
        descriptor: "Noun"
    },
    VERB: {
        descriptor: "Verb"
    },
    ADV: {
        descriptor: "Adverb"
    },
    ADJ: {
        descriptor: "Adjective"
    },
    PRNOUN: {
        descriptor: "Proper noun"
    },
    PLNOUN: {
        descriptor: "Noun (Plural)"
    },
    TIME: {
        descriptor: "<u class=\"tooltip\" title=\"e.g. yesterday, May 25, a year ago\">Time frame</u>" // Maybe attribute help tooltips to a parameter?
    },
    NUM: {
        descriptor: "Number"
    },
    PLACE: {
        descriptor: "<u class=\"tooltip\" title=\"e.g. Mars, Akihabara, my house\">Place</u>"
    }
};

// Debug temp variables and functions; refactor later!
const textbox = document.querySelector("textarea");

function DebugParse(p) {
    // Parse an example story and load it into memory.
    const spungler = btoa(JSON.stringify(p));
    Parser.LoadStory(spungler);
}
DebugParse([
    {w:WordType.PRNOUN},
    " (born ",
    {w:WordType.TIME},
    ") is ",
    "an ",
    {w:WordType.ADJ},
    " podcaster and former ",
    {w:WordType.NOUN},
    " known under the stage name FPS",
    {w:WordType.PLACE,d:"one word"},
    ". His YouTube channel features them portraying the ",
    {w:WordType.ADJ},
    " role of ",
    {w:WordType.PRNOUN},
    ", ",
    "an ",
    {w:WordType.ADV},
    " ",
    {w:WordType.ADJ},
    " \"professional ",
    {w:WordType.ADJ,d:"nationality"},
    "\" from Moscow, Russia. His videos center around the usage of large amounts of firearms and explosives."
])
