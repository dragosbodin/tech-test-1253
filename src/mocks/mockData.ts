// Fill array with all uppercase alphabet letters
export const alphabetLetters = Array.from(Array(26).keys()).map((i) =>
    String.fromCharCode(65 + i)
)

// Generate 40 rows of with key value pairs for each letter in the alphabet
export const mockData = Array.from(Array(40).keys()).map((_idx) => {
    return Object.fromEntries(
        alphabetLetters.map((letter) => {
            return [letter, Math.floor(Math.random() * 100000)]
        })
    )
})
