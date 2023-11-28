const factSentence = process.argv[2]
const factName = toPascalCase(factSentence)

console.log(factName)

function toPascalCase(sentence) {
  // Remove any non-alphanumeric characters and split the sentence into words
  const words = sentence.replace(/[^0-9a-zA-Z]/g, ' ').split(' ')

  // Convert the first letter of each word to uppercase and concatenate them
  const pascalCase = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('')

  return pascalCase
}
