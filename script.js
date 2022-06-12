// Blank Cheque //
//   (c) 2022   //
//THEKI LLECTIVE// 

const storyBox = document.getElementById("story");
const Parser = {};

Parser.LoadedStory = [];
Parser.Inputs = [];
Parser.CreateStoryElement = function(wordlet, id) {
  const el = document.createElement("div")
  el.innerHTML = `<b>${wordlet.t ? wordlet.t + " " + wordlet.w.descriptor.toLowerCase() : wordlet.w.descriptor}${wordlet.e ? " ending in \"-"+wordlet.e + "\"" : ""}</b>: <input type="${wordlet.w.descriptor == WordType.NUM.descriptor ? "number" : "text"}" class="textinput" id="input-${id}" required/><br />`;
  el.style.display = "inline";
  storyBox.appendChild(el);
  return el;
}
Parser.CreateText = function(input,bold=false) {
  let text;
  if (!bold) {
	text = document.createElement("span");
  } else {
    text = document.createElement("strong");
  }
  text.innerHTML = input;
  storyBox.appendChild(text);
}
Parser.ParseArray = function(array) {
  storyBox.innerHTML = "";
  array.forEach((element, index) => {
    if (typeof element == 'object') {
      const el = Parser.CreateStoryElement(element,index);
      Parser.Inputs.push(el.getElementsByTagName('input')[0]);
    } else {
		Parser.Inputs.push(null);
	}
  });
}
Parser.Storrelate = function() {
  // document.getElementById("stButton").remove() // Delete the storrelate button, refactor for regeneration later
  for (let i = 0; i < Parser.LoadedStory.length; i++) {
	  if (typeof Parser.LoadedStory[i] === 'object') {
		  Parser.CreateText(Parser.Inputs[i].value,true);
	  } else {
		  Parser.CreateText(Parser.LoadedStory[i]);
	  }
  }
  return false;
}
Parser.LoadStory = function(b) {
	const json = JSON.parse(atob(b));
	Parser.LoadedStory = json; // is this necessary?
	Parser.ParseArray(Parser.LoadedStory);
	const btn = document.createElement("input");
	btn.type = "submit";
	btn.value = "storrelate";
	storyBox.appendChild(btn);
}

const WordType = {
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
	  descriptor: "<u class=\"tooltip\" title=\"e.g. yesterday, today, a year ago\">Time frame</u>" // Maybe attribute help tooltips to a parameter?
  },
  NUM: {
	  descriptor: "Number"
  }
};

//Parser.ParseArray(testStory);

// Debug temp variables and functions
const textbox = document.querySelector("textarea");
function DebugParse(p) {
	const spungler = btoa(JSON.stringify(p));
	Parser.LoadStory(spungler);
}
DebugParse([
	"I took a ",
	{w:WordType.NOUN},
	" and my ",
	{w:WordType.NOUN},
	" ",
	{w:WordType.VERB,t:"Past tense"},
	"!"
])
