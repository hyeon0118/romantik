/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/search.js":
/*!*********************************!*\
  !*** ./src/client/js/search.js ***!
  \*********************************/
/***/ (() => {

eval("const closeIcon = document.querySelector(\".searchbar svg:nth-of-type(2)\");\nconst input = document.querySelector('input[name=\"keyword\"]');\nconst before = document.getElementById(\"before-search\");\nconst after = document.getElementById(\"after-search\");\n\nfunction clearInput() {\n  input.value = \"\";\n  closeIcon.style.opacity = 0;\n  before.style.display = \"flex\";\n  after.style.display = \"none\";\n}\n\ninput.addEventListener(\"input\", () => {\n  if (input.value) {\n    before.style.display = \"none\";\n    after.style.display = \"flex\";\n    history.replaceState(null, null, \"/search?keyword=\" + input.value);\n  } else {\n    before.style.display = \"flex\";\n    after.style.display = \"none\";\n    history.replaceState(null, null, \"/search\");\n  }\n});\n\n//# sourceURL=webpack://romantik/./src/client/js/search.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/search.js"]();
/******/ 	
/******/ })()
;