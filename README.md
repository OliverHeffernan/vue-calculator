# vue-calculator
## Documentation
### Features
#### Multiple-Calculations
In this app, you can have infinite lines of calculations, similar to a graphics calculator. To create a new line/calculation, press the enter key, and a new line will be added below the currently selected line.

#### Copying Answers To Clipboard
To copy a result froma calculation to the clipboard, simply click the result, and it will be copied to the clipboard to be pasted later.
You can also type "ans" to reference the answer to the previous calculation.

#### Variables
To create a variable, type what you want to call the variable, followed by an equals sign, followed by the value of the variable. You can then reference this variable in later calculations by typing the name of the variable.

#### Powers
To use powers in your calculations, use the "^" symbol to write in super script. Then to end the power type ";", and the cursor will drop back down to the lower level. For example, if I wanted to calculate 5 squared, I would type "5^2;". This application also supports nested powers, for example, if I wanted to calculate 5 to the power of 5 squared, I would type "5^(5^2;);".

### Functions
Vue-calculator supports many functions, each of which is listed below.
 - sin(angle)
 - cos(angle)
 - tan(angle)
 - log() base 10
 - ln()
 - sec(angle)
 - cosec(angle), csc(angle)
 - cot(angle)

### Constants
Currently the only constant supported is pi. If you type in "pi", it automatically gets replaced with the symbol for pi. I plan to add euler's constant.

### Comments
If you want to add some descriptions to your calculations, start a new line with "//" and the app will not attempt to calculate that line, so you can write a description without worrying about errors.

### Settings
To open settings, click the cog icon in the top right corner, and a panel will slide out. To close the settings, click the cog again.
#### Angle Mode
The following angle units are supported:
- degrees
- radians
- gradians
To switch between them, open the settings. Click on the text that displays what unit is currently being used, and it will cycle between the units.

#### Precision
To change the number of significant figures that results are rounded to, enter the number of significant figures into the input field in settings, corresponding to "Precision".

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
