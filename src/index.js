import { Service } from "./service.js";

class App {
    constructor() {
        this.service = new Service();
        this.getData();
    }

    getData() {
        this.service
            .getDataFromJson()
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    }
}

new App();