export type UserDTO = {
    name: string,
    lastName: string,
    username: string,
    dateOfBirth: Date,
    mail: string,
    wordsPerMinutes: number,
    typeOfReader: string,
    searchCriteria: string
    minRange: number,
    maxRange: number
}

// export class User{
//     constructor(
//         public name: string,
//         public lastName: string,
//         public username: string,
//         public dateOfBirth: Date,
//         public mail: string,
//         public wordsPerMinutes: number,
//         public typeOfReader: string,
//         public searchCriteria: string
//     ){}
// }