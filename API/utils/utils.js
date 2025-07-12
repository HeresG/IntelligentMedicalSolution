export class Utils {
  static getBirthDateFromCNP = (cnp) => {
    if (cnp.length !== 13 || isNaN(Number(cnp))) {
      throw new Error("CNP-ul trebuie să aibă exact 13 caractere numerice");
    }

    const givenGenderChar = cnp[0];
    const givenYear = cnp.slice(1, 3);
    const givenMonth = cnp.slice(3, 5);
    const givenDay = cnp.slice(5, 7);

    let year;
    switch (givenGenderChar) {
      case "1":
      case "2":
        year = "19" + givenYear;
        break;
      case "3":
      case "4":
        year = "18" + givenYear;
        break;
      case "5":
      case "6":
        year = "20" + givenYear;
        break;
      default:
        throw new Error("CNP-ul trebuie să înceapă cu un caracter valid");
    }

    const dateString = `${year}-${givenMonth}-${givenDay}`;
    const birthDate = new Date(dateString);

    if (isNaN(birthDate.getTime())) {
      throw new Error("Data nașterii este invalidă");
    }

    return birthDate;
  };

  static getGenderFromCNP = (cnp) => {
    if (cnp.length !== 13 || isNaN(Number(cnp))) {
      throw new Error("CNP-ul trebuie să aibă exact 13 caractere numerice");
    }

    const givenGenderChar = cnp[0];
    const validFemaleCharacters = ["2", "4", "6", "8"];
    const validMaleCharacters = ["1", "3", "5", "7"];

    if (![...validFemaleCharacters, ...validMaleCharacters].includes(givenGenderChar)) {
      throw new Error("CNP-ul trebuie să înceapă cu un caracter valid");
    }

    return validFemaleCharacters.includes(givenGenderChar) ? "F" : "M";
  };



  static getAgeFromCNP = (cnp) => {
    const birthDate = Utils.getBirthDateFromCNP(cnp);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    return age;
  };
}
