import { productConfig } from "./config.js";

export class UI {
    constructor() {
        this.slideLeftValue = 0;
        this.titleElement = document.querySelector(".title");
        this.navElement = document.querySelector("nav");
        this.productsContainerElement = document.querySelector(
            ".products-container"
        );
        this.body = document.querySelector("body");

        this.slideProducts = this.slideProducts.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.drawPopup = this.drawPopup.bind(this);
        this.lazyLoadImage = this.lazyLoadImage.bind(this);
    }

    drawTitle(title) {
        this.titleElement.innerHTML = title;
    }

    drawCategories(categories, eventListener) {
        if (categories) {
            const ulElement = document.createElement("ul");

            categories.forEach((category, index) => {
                const liElement = document.createElement("li");
                liElement.innerHTML = category;

                if (index === 0) {
                    this.drawActiveCategory(liElement);
                }

                liElement.addEventListener("click", eventListener);
                ulElement.appendChild(liElement);
            });

            this.navElement.appendChild(ulElement);
        }
    }

    drawActiveCategory(element) {
        element.className = "active";

        const activeBarElement = document.createElement("div");
        activeBarElement.className = "active-bar";
        element.appendChild(activeBarElement);
    }

    drawProducts(products) {
        if (products) {
            this.slideLeftValue = 0;
            this.productsContainerElement.innerHTML = "";

            const observer = new IntersectionObserver(this.lazyLoadImage);

            const sliderWrapperElement = document.createElement("div");
            sliderWrapperElement.className = "slider-wrapper";

            products.forEach((product) => {
                const productContainerElement = document.createElement("div");
                productContainerElement.className = "product-container";

                const imageElement = document.createElement("img");
                imageElement.className = "product-image";
                imageElement.dataset.src = product.image;

                observer.observe(imageElement);

                const productNameElement = document.createElement("div");
                productNameElement.className = "product-name";
                productNameElement.innerHTML = product.name;

                const priceElement = document.createElement("div");
                priceElement.className = "product-price";
                priceElement.innerHTML = product.priceText;

                productContainerElement.appendChild(imageElement);
                productContainerElement.appendChild(productNameElement);
                productContainerElement.appendChild(priceElement);

                const { shippingFee } = product.params;

                if (shippingFee === "FREE") {
                    const feeIsFreeElement = document.createElement("div");
                    feeIsFreeElement.className = "product-fee-container";
                    feeIsFreeElement.innerHTML = "Ücretsiz Kargo";

                    const cargoElement = document.createElement("img");
                    cargoElement.src = "/src/assets/img/cargo-truck.png";
                    cargoElement.className = "product-fee-truck";

                    feeIsFreeElement.appendChild(cargoElement);
                    productContainerElement.appendChild(feeIsFreeElement);
                }

                const addToCartElement = document.createElement("div");
                addToCartElement.className = "product-add-to-cart";
                addToCartElement.innerHTML = "Sepete Ekle";
                addToCartElement.addEventListener("click", this.addToCart);

                productContainerElement.appendChild(addToCartElement);

                sliderWrapperElement.appendChild(productContainerElement);
            });

            const prevElement = document.createElement("div");
            prevElement.className = "prev pagination";
            prevElement.innerHTML = "<";
            prevElement.addEventListener("click", this.slideProducts);

            const nextElement = document.createElement("div");
            nextElement.className = "next pagination";
            nextElement.innerHTML = ">";
            nextElement.addEventListener("click", this.slideProducts);

            this.productsContainerElement.appendChild(prevElement);
            this.productsContainerElement.appendChild(nextElement);
            this.productsContainerElement.appendChild(sliderWrapperElement);
        }
    }

    addToCart() {
        const popup = document.querySelector(".popup");
        if (popup) {
            popup.remove();
        }

        this.drawPopup();
    }

    slideProducts(event) {
        const { className } = event.target;
        const wrapper = document.querySelector(".slider-wrapper");
        const prevLeft = Number(wrapper.style.left.split("px")[0]);

        if (className.includes("prev")) {
            if (prevLeft < 0) {
                this.slideLeftValue += productConfig.width + productConfig.marginLeft;
            }
        } else {
            const productContainerCount =
                document.querySelectorAll(".product-container").length;

            if (
                productContainerCount *
                (productConfig.width + productConfig.marginLeft) -
                800 >
                -prevLeft
            ) {
                this.slideLeftValue -= productConfig.width + productConfig.marginLeft;
            }
        }

        wrapper.style.left = `${this.slideLeftValue}px`;
    }

    drawPopup() {
        const popupElement = document.createElement("div");
        popupElement.className = "popup";

        const contentElement = document.createElement("div");
        contentElement.className = "popup-content";

        const leftArea = document.createElement("div");
        leftArea.className = "popup-left-area";
        const icon = document.createElement("img");
        icon.className = "popup-icon";
        icon.src = "/src/assets/img/check.png";

        const textElement = document.createElement("div");
        textElement.className = "popup-text-content";
        const title = document.createElement("div");
        title.innerHTML = "Ürün sepete eklendi.";
        title.className = "popup-title";
        const goToBasket = document.createElement("div");
        goToBasket.className = "popup-gotobasket";
        goToBasket.innerHTML = "Sepete Git";
        textElement.appendChild(title);
        textElement.appendChild(goToBasket);

        leftArea.appendChild(icon);
        leftArea.appendChild(textElement);

        const closeIcon = document.createElement("img");
        closeIcon.className = "popup-close-icon";
        closeIcon.src = "/src/assets/img/cancel.png";
        closeIcon.addEventListener("click", this.closePopup);

        contentElement.appendChild(leftArea);
        contentElement.appendChild(closeIcon);

        popupElement.appendChild(contentElement);
        this.body.appendChild(popupElement);
    }

    closePopup(event) {
        event.target.parentElement.parentElement.remove();
    }

    lazyLoadImage(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
            }
        });
    }
}