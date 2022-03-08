import { processResult, controller, DaDataConfig, model } from "./index";

const tmpl = document.querySelector("#tmpl");

class MyForm extends HTMLElement {
  constructor() {
    super();
    // element created

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(tmpl.content.cloneNode(true));

    this.formUi = {
      party: this.shadowRoot.querySelector("#party"),
      shortName: this.shadowRoot.querySelector("#name_short"),
      fullName: this.shadowRoot.querySelector("#name_full"),
      innKpp: this.shadowRoot.querySelector("#inn_kpp"),
      addressFull: this.shadowRoot.querySelector("#address"),

      update(model) {
        Object.keys(this.formUi).forEach((key) => {
          this.formUi[key].value = model[key];
        });
      }
    };

    this.updateUI = this.formUi.update.bind(this);
  }

  connectedCallback() {
    // browser calls this method when the element is added to the document
    // (can be called many times if an element is repeatedly added/removed)

    controller.registerEvent(
      this.shadowRoot.querySelector("#inn_kpp"),
      "keyup",
      (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (event.code !== "Enter") {
          return;
        }

        const inn = event.target.value.trim();

        const { options, url } = DaDataConfig;

        const optionsToSend = {
          ...options,
          body: JSON.stringify({ query: inn })
        };

        fetch(url, optionsToSend)
          .then((response) => response.json())
          .then((result) => processResult(result))
          .then((data) => {
            controller.updateModel(data);
            this.updateUI(model);
          })
          .catch((error) => console.log("error", error));
      }
    );
  }

  disconnectedCallback() {
    // browser calls this method when the element is removed from the document
    // (can be called many times if an element is repeatedly added/removed)
  }

  static get observedAttributes() {
    return [
      /* array of attribute names to monitor for changes */
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  // there can be other element methods and properties
}

export default MyForm;

customElements.define("my-form", MyForm);
