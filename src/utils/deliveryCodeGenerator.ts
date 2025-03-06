
/**
 * Generates a random delivery code with 6 characters (letters and numbers)
 * The code will have 4 uppercase letters and 2 numbers at random positions
 */
export const generateDeliveryCode = (): string => {
  const generateLetters = () => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };
  
  let code = generateLetters();
  
  // Pick 2 random positions for numbers
  const positions = [];
  while (positions.length < 2) {
    const pos = Math.floor(Math.random() * 6);
    if (!positions.includes(pos)) {
      positions.push(pos);
    }
  }
  
  const codeArray = code.split('');
  
  // Replace letters with numbers at the selected positions
  positions.forEach(pos => {
    codeArray[pos] = Math.floor(Math.random() * 10).toString();
  });
  
  return codeArray.join('');
};
