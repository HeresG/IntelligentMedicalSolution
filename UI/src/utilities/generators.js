export const createIncrementalArray = (minValue, maxValue) => {
    if ((minValue > maxValue) || (typeof minValue !== "number") || (typeof maxValue !== "number")) {
        throw Error("Min value must be lower than max value and it must be a number")
    }

    const arrayOfObjects = [];
    for (let value = minValue; value <= maxValue; value++) {
        arrayOfObjects.push({ value });
    }
    return arrayOfObjects;
}

// This CNP generator is based on the insight from: https://ro.wikipedia.org/wiki/Cod_numeric_personal_(Rom%C3%A2nia)
export const generatePersonalDetailsFromCNP = (cnp) => {
    if (cnp.length !== 13 && !isNaN(parseInt(cnp))) {
        throw new Error('CNP-ul trebuie să aibă exact 13 caractere (numar)');
    }
    

    const givenGenderChar = cnp[0];
    const givenYear = cnp.slice(1, 3);
    const givenMonth = cnp.slice(3, 5);
    const givenDay = cnp.slice(5, 7)

    const validFemaleCharacters = ["2", "4", "6", "8"];
    const validMaleCharacters = ["1", "3", "5", "7"];

    if (![...validFemaleCharacters, ...validMaleCharacters].includes(givenGenderChar)) {
        throw new Error("CNP ul trebuie sa inceapa cu un caracter valid")
    }

    let year;
    switch (givenGenderChar) {
        case "1":
        case "2": {
            year = "19" + givenYear
            break;
        }
        case "3":
        case "4": {
            year = "18" + givenYear
            break;
        }
        case "5":
        case "6": {
            year = "20" + givenYear
            break;
        }
        default: {
            year = givenYear
        }
    }

       const dateString = `${year}-${givenMonth}-${givenDay}`;
       const birthDate = new Date(dateString);
   
       if (isNaN(birthDate.getTime())) {
           throw new Error('Data nașterii este invalidă');
       }


    return {
        gender: validFemaleCharacters.includes(givenGenderChar) ? "F" : "M",
        birthDate
    };
};


