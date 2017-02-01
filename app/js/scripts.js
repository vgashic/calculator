// display limits
const mainDisplayLimit = 11;
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
var lastEnteredOperator = "";
var expressionToDisplay;
var expressionToCalculate = "(";
var cePressed = 0;


function calculateExpression(expr) {

	let num = eval(createExpression(expr));
	let result = num.toString();
	let fl = parseFloat(num);

	if (result.replace(".", "").replace("-", "").length <= mainDisplayLimit) {
		return result;
	} else {
		result = fl.toExponential(mainDisplayLimit - 5).toString();
	}

	return result;
}


function digitPressed(digit) {
	if (mainDisplay.innerHTML.replace(".", "").replace("-", "").length <= mainDisplayLimit) {
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
			expressionToCalculate += digit;
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
	lastEnteredOperator = keyPressed;
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
		switch (lastEnteredType) {
			case "digit":
				{
					mainDisplay.innerHTML += ".";
					smallDisplay.innerHTML += ".";
					break;
				}

			case "operator":
				{
					mainDisplay.innerHTML = "0.";
					smallDisplay.innerHTML += "0.";
					break;
				}

			default:
				{
					mainDisplay.innerHTML = "0.";
					smallDisplay.innerHTML = "0.";
					break;
				}
		}

		hasDecimalPoint = true;
	}

}



function commandPressed(cmd) {
	switch (cmd) {
		case "clearAll":
			{
				mainDisplay.innerHTML = "0";
				smallDisplay.innerHTML = "0";
				newCalc = true;
				hasDecimalPoint = false;
				break;
			}
		case "clearCurrent":
			{
				cePressed++;

				if (cePressed == 1) {

					let numberOnDisplay = mainDisplay.innerHTML;
					smallDisplay.innerHTML = smallDisplay.innerHTML.slice(0, -numberOnDisplay.length);

					mainDisplay.innerHTML = "0";
					hasDecimalPoint = false;
				} else {
					cePressed = 0;
					commandPressed("clearAll");
				}
				break;
			}
		default:
			break;
	}
}


function createExpression(expr) {
	let arr = [...expr];
	let result = "(";
	let numbers = "0123456789.";
	let prevOperator = "";


	for (var i = 0; i < arr.length; i++) {

		if (numbers.indexOf(arr[i]) > -1) {
			result += arr[i];
		} else {
			if ("/*".indexOf(arr[i]) > -1 && "+-".indexOf(prevOperator) > -1) {
				result += `)${arr[i]}`;
			} else if ("+-".indexOf(arr[i]) > -1 && "*/".indexOf(prevOperator) > -1 && prevOperator != "") {
				result += `${arr[i]}(`;
			} else {
				result += arr[i];
			}

			prevOperator = arr[i];
		}
	}

	if ("+-".indexOf(prevOperator) > -1) {
		result += ")";
	}

	//console.log(result);
	return result;
}



function doCalcStuff(e) {

	keyPressed = this.dataset.calc;
	keyType = this.dataset.type;

	// console.log(this.dataset.calc);
	if (newCalc) {

		switch (keyType) {

			case "digit":
				{
					mainDisplay.innerHTML = keyPressed;
					smallDisplay.innerHTML = keyPressed;
					break;
				}

			case "point":
				{
					mainDisplay.innerHTML += keyPressed;
					smallDisplay.innerHTML += keyPressed;
					hasDecimalPoint = true;
					break;
				}

			case "operator":
				{
					smallDisplay.innerHTML += keyPressed;
					break;
				}

			default:
				{
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
	lastEnteredOperator = (keyType == "operator") ? keyPressed : lastEnteredOperator;
	//console.log(lastEnteredType);

}