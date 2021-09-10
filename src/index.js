import { Service } from "./service.js";
import { UI } from "./ui.js";

class App {
    error = false;
    title = "Sizin İçin Seçtiklerimiz";

    constructor() {
        this.ui = new UI();
        this.service = new Service();
        this.getData();
    }

    getData() {
        this.service
            .getDataFromJson()
            .then((response) => this.dataSuccess(response))
            .catch((_err) => this.dataError());
    }

    dataSuccess(response) {
        if (response.statusCode === "SUCCESS") {
            this.error = false;
            const { recommendedProducts, userCategories } =
            response.responses[0][0].params;
            this.products = recommendedProducts;

            const defaultTitle = "Size Özel";
            const defaultProducts = recommendedProducts[defaultTitle];

            this.ui.drawTitle(this.title);
            this.ui.drawCategories(userCategories, this.navItemClick);
            this.ui.drawProducts(defaultProducts);
        }
    }

    dataError() {
        this.error = true;
    }

    navItemClick = (event) => {
        const { parentElement, textContent } = event.target;
        const activeLi = parentElement.querySelectorAll(".active");

        if (activeLi) {
            activeLi.forEach((li) => li.classList.remove("active"));
        }

        this.ui.drawActiveCategory(event.target);

        this.ui.drawProducts(this.products[textContent]);
    };
}

new App();