class CasesModel {
    constructor(id, region, countryCode, newConfirmed, totalConfirmed, newDeaths, totalDeaths, newRecovered, totalRecovered) {
        this.id = id;
        this.region = region;
        this.countryCode = countryCode;
        this.newConfirmed = newConfirmed;
        this.totalConfirmed = totalConfirmed;
        this.newDeaths = newDeaths;
        this.totalDeaths = totalDeaths;
        this.newRecovered = newRecovered;
        this.totalRecovered = totalRecovered
    }
}

export default CasesModel;