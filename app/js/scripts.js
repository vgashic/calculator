// display limits
const mainDisplayLimit = 15;
const smallDisplayLimit = 25;

// get all buttons into array
const buttons = [...document.querySelectorAll("button")];


// get display element
const mainDisplay = document.querySelector("#main-display p");
const smallDisplay = document.querySelector("#small-display p");


// add event listeners
buttons.forEach(button => button.addEventListener("click", doCalcStuff));

// states
var newCalc = true;
var hasDecimalPoint = false;

// values
var mainDisplayValue = mainDisplay.innerHTML;
var smallDisplayValue = smallDisplay.innerHTML;
var keyPressed;
var lastEntered;
var lastEnteredType;


function calculateExpression(expr) {
	let result;

	if (expr.toString().length <= mainDisplayLimit) {
		result = eval(expr).toString();
	} else {
		// todo: implement display limit
		result = "err";
	}

	return result;
}


function digitPressed(digit) {
	if (mainDisplay.innerHTML.replace(".", "").replace("-", "").length < mainDisplayLimit) {
		if (lastEnteredType == "operator" || mainDisplay.innerHTML == "0" || lastEnteredType == "equals") {
			mainDisplay.innerHTML = digit;

			if (lastEnteredType == "equals") {
				smallDisplay.innerHTML = "";
			}
		} else {
			mainDisplay.innerHTML += digit;
		}

		if (!(mainDisplay.innerHTML == "0" && digit == "0" && lastEntered == "0")) {
			smallDisplay.innerHTML += digit;
		}
	}
}


function operatorPressed(operator) {
	if (lastEnteredType == "operator") {
		smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0, -1);
	}

	// first calculate expression in small display
	let currentValue = calculateExpression(smallDisplay.innerHTML);

	// then write to screen
	mainDisplay.innerHTML = currentValue;
	smallDisplay.innerHTML += keyPressed;

	hasDecimalPoint = false;
}


function equalsPressed() {
	if (lastEnteredType == "operator") {
		smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0, -1);
	}

	let currentValue = calculateExpression(smallDisplay.innerHTML);

	mainDisplay.innerHTML = currentValue;
	//smallDisplay.innerHTML = currentValue;

	hasDecimalPoint = false;
}



function pointPressed() {
	if (hasDecimalPoint) {
		return;
	} else {
		if (lastEnteredType == "digit") {
			mainDisplay.innerHTML += ".";
			smallDisplay.innerHTML += ".";
		} else {
			mainDisplay.innerHTML = "0.";
			smallDisplay.innerHTML = "0.";
		}

		hasDecimalPoint = true;
	}

}



function commandPressed(cmd) {
	switch (cmd) {
		case "clearAll": {
			mainDisplay.innerHTML = "0";
			smallDisplay.innerHTML = "0";
			newCalc = true;
			hasDecimalPoint = false;
			break;
		}
		case "clearCurrent": {
			let numberOnDisplay = mainDisplay.innerHTML;
			smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0, -numberOnDisplay.length);

			mainDisplay.innerHTML = "0";
			hasDecimalPoint = false;
		}
		default:
			break;
	}
}



function doCalcStuff(e) {

	keyPressed = this.dataset.calc;
	keyType = this.dataset.type;

	// console.log(this.dataset.calc);
	if (newCalc) {

		switch (keyType) {

			case "digit": {
				mainDisplay.innerHTML = keyPressed;
				smallDisplay.innerHTML = keyPressed;
				break;
			}

			case "point": {
				mainDisplay.innerHTML += keyPressed;
				smallDisplay.innerHTML += keyPressed;
				hasDecimalPoint = true;
				break;
			}

			case "operator": {
				smallDisplay.innerHTML += keyPressed;
				break;
			}

			default: {
				break;
			}

		}


		newCalc = false;

	} else {
		switch (keyType) {
			case "digit":
				digitPressed(keyPressed);
				break;
			case "operator":
				operatorPressed(keyPressed);
				break;
			case "equals":
				equalsPressed();
				break;
			case "point":
				pointPressed();
				break;
			case "command":
				commandPressed(keyPressed);
				break;
			default:
				break;
		}
	}

	lastEntered = keyPressed;
	lastEnteredType = keyType;
	//console.log(lastEnteredType);

}