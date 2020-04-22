class DailyModel {
    constructor(id, confirmed, deaths, recovered, date) {
        this.id = id;
        this.confirmed = confirmed;
        this.deaths = deaths;
        this.recovered = recovered;
        this.date = date;
    }
}

export default DailyModel;