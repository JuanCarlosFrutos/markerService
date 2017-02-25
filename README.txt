					MARKERSERVICE.JS

MarkerService.js is a module that allows to generte a custom marker using svg file. You can choose the text, colour and width.
All functions in this module are asynchronous. 

FUNCTIONS.

changeAttr: 

	This function has three inputs. Colour, width and svg file path.

	-Only supports hexadecimal format (three or six characters).
	-The maximum size of the width is 300px.

	Function converts svg file to DOM, it changes attributes and saves the new file with svg format in the same path.

convertSvgToPng: 

	This function has one input. Input is the path of svg file. Function coverts svg file to png. 
	Png file is stored in the actual path. The file will have the same name of svg file.
	(this function uses svg-to-png module.)

createTextImage: 

	The function creates a png image that contains a text. Text is an input of the function.
	Other input is path font. Only supports BMFont format (.fnt).
	(this function uses jimp module.)

combinePngs: 

	The function has two inputs. Path marker and path text image. This function resize text image and combine 
	two images. Return final image path.
	(this function uses jimp module.)
			
					MARKER.JS

marker.js uses markerservice.js to generate the specific marker requested by the user in URL. The URL must contain the text that will be writed
inside the marker, color and width.   
Color and width are GET params, but if you dont give all params, program won`t works.

Example correct URL : http://localhost:3000/marker/1-1?colour=ff0000&width=200
				
					INTEGRATION_TEST.JS

integratios_test.js contains two test. First test checks if program returns 201 code when URL is correct and 
second test checks if program returns 404 code when URL is wrong.
	
					UNIT_TEST.JS 

It checks all functions when they work correctly and when the arguments of this functions are wrong. Some inputs in functions are path 
if this path doesn´t exist , test will fail , for this reason you will be sure that all necesary files exist before run the test.

					
				