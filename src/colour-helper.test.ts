import { hexToHsl, getColour } from './colour-helper';

xtest('Return preset colour from getColour', async () => {
    const colourConfig = await getColour('white');
    
    console.log(colourConfig);
});

xtest('Return preset colour (warmwhite) from getColour', async () => {
    const colourConfig = await getColour('warmwhite');
    
    console.log(colourConfig);
});


xtest('Return hex colour from getColour', async () => {
  const colourConfig = await getColour('#000000');
  
  console.log(colourConfig);
});

xtest('Return hex colour from getColour', async () => {
  const colourConfig = await getColour('#121212');
  
  console.log(colourConfig);
});

xtest('Return colour config from hex', async () => {
  const colourConfig = await hexToHsl('#555555');
  
  console.log(colourConfig);
});
