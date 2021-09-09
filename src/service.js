export class Service {
    async getDataFromJson() {
        const response = await fetch("/src/data/data.json");
        const data = await response.json();

        return data;
    }
}